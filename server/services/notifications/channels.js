function isSet(value) {
  return Boolean(value && String(value).trim() && !String(value).includes('your_'));
}

export function getNotificationConfig() {
  return {
    email: isSet(process.env.RESEND_API_KEY) || isSet(process.env.SENDGRID_API_KEY),
    sms: isSet(process.env.MSG91_AUTH_KEY) || isSet(process.env.SMS_API_KEY),
    whatsapp: isSet(process.env.WHATSAPP_TOKEN) && isSet(process.env.WHATSAPP_PHONE_ID),
  };
}

function logSkip(channel, orderId, reason) {
  console.info(`[BLEMOUT notify] ${channel} not sent for ${orderId}: ${reason}`);
  return { channel, sent: false, reason };
}

async function sendEmail(order, payload) {
  const resend = process.env.RESEND_API_KEY;
  const sendgrid = process.env.SENDGRID_API_KEY;
  if (!isSet(resend) && !isSet(sendgrid)) {
    return logSkip('email', order.orderId, 'provider not configured');
  }

  try {
    if (isSet(resend)) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resend}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'BLEMOUT <noreply@blemout.com>',
          to: [order.email],
          subject: payload.subject,
          text: payload.text,
        }),
      });
      if (!response.ok) throw new Error(`email_http_${response.status}`);
      return { channel: 'email', sent: true };
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendgrid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: order.email }] }],
        from: { email: process.env.EMAIL_FROM || 'noreply@blemout.com', name: 'BLEMOUT' },
        subject: payload.subject,
        content: [{ type: 'text/plain', value: payload.text }],
      }),
    });
    if (!response.ok) throw new Error(`email_http_${response.status}`);
    return { channel: 'email', sent: true };
  } catch (error) {
    console.error(`[BLEMOUT notify] email failed for ${order.orderId}:`, error.message);
    return { channel: 'email', sent: false, reason: 'send_failed' };
  }
}

async function sendSms(order, text) {
  const key = process.env.MSG91_AUTH_KEY || process.env.SMS_API_KEY;
  if (!isSet(key)) {
    return logSkip('sms', order.orderId, 'provider not configured');
  }
  try {
    const response = await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        authkey: key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        recipients: [{ mobiles: `91${order.phone}`, message: text }],
      }),
    });
    if (!response.ok) throw new Error(`sms_http_${response.status}`);
    return { channel: 'sms', sent: true };
  } catch (error) {
    console.error(`[BLEMOUT notify] sms failed for ${order.orderId}:`, error.message);
    return { channel: 'sms', sent: false, reason: 'send_failed' };
  }
}

async function sendWhatsApp(order, payload) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!isSet(token) || !isSet(phoneId)) {
    return logSkip('whatsapp', order.orderId, 'provider not configured');
  }
  const templateName = String(payload?.whatsappTemplate || '').trim();
  if (!templateName) {
    return logSkip('whatsapp', order.orderId, 'template not configured');
  }
  try {
    const parameters = (payload.whatsappParams || []).map((text) => ({
      type: 'text',
      text: String(text),
    }));
    const response = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: `91${order.phone}`,
        type: 'template',
        template: {
          name: templateName,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
          ...(parameters.length ? { components: [{ type: 'body', parameters }] } : {}),
        },
      }),
    });
    if (!response.ok) throw new Error(`whatsapp_http_${response.status}`);
    return { channel: 'whatsapp', sent: true };
  } catch (error) {
    console.error(`[BLEMOUT notify] whatsapp failed for ${order.orderId}:`, error.message);
    return { channel: 'whatsapp', sent: false, reason: 'send_failed' };
  }
}

async function dispatch(order, messages, channels = ['email', 'sms', 'whatsapp']) {
  const senders = {
    email: () => sendEmail(order, messages.email),
    sms: () => sendSms(order, messages.sms),
    whatsapp: () => sendWhatsApp(order, messages),
  };
  const results = [];
  for (const channel of channels) {
    if (senders[channel]) results.push(await senders[channel]());
  }
  return results;
}

export { dispatch, logSkip };
