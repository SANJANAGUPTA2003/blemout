import { shippingNotConfiguredResult, isShippingConfigured } from './unconfigured.js';
import { pickupLocationOrError } from '../../utils/shipClaim.js';

const API = 'https://apiv2.shiprocket.in/v1/external';

async function shiprocketLogin() {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  if (!response.ok) {
    return { ok: false, code: 'auth_failed', message: 'Shipping provider authentication failed.' };
  }
  const data = await response.json();
  if (!data?.token) {
    return { ok: false, code: 'auth_failed', message: 'Shipping provider did not return a token.' };
  }
  return { ok: true, token: data.token };
}

async function shiprocketRequest(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      ok: false,
      code: 'provider_error',
      message: data?.message || 'Shipping provider request failed.',
      data,
    };
  }
  return { ok: true, data };
}

function extractAwb(data = {}) {
  return (
    data?.response?.data?.awb_code ||
    data?.awb_code ||
    data?.awb ||
    ''
  );
}

function extractCourier(data = {}) {
  return data?.response?.data?.courier_name || data?.courier_name || data?.courier || '';
}

export function createShiprocketProvider() {
  return {
    name: 'shiprocket',
    configured: isShippingConfigured(),

    async createShipment(order) {
      if (!isShippingConfigured()) return shippingNotConfiguredResult();

      const pickup = pickupLocationOrError();
      if (!pickup.ok) return pickup;

      const auth = await shiprocketLogin();
      if (!auth.ok) return auth;

      let shipmentId = String(order.shipmentId || '').trim();
      let providerOrderId = String(order.providerOrderId || '').trim();
      let awb = '';
      let courier = '';
      let trackingUrl = '';
      let createdData = null;

      if (!shipmentId) {
        const payload = {
          order_id: order.orderId,
          order_date: new Date(order.createdAt || Date.now()).toISOString().slice(0, 19).replace('T', ' '),
          pickup_location: pickup.location,
          billing_customer_name: order.customerName,
          billing_last_name: '',
          billing_address: order.address,
          billing_city: order.city,
          billing_pincode: order.pincode,
          billing_state: order.state,
          billing_country: 'India',
          billing_email: order.email,
          billing_phone: order.phone,
          shipping_is_billing: true,
          order_items: (order.items || []).map((item) => ({
            name: item.name,
            sku: String(item.productId || item.name),
            units: item.quantity,
            selling_price: item.price,
          })),
          payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
          sub_total: order.totalAmount,
          length: 10,
          breadth: 10,
          height: 10,
          weight: 0.5,
        };

        const created = await shiprocketRequest('/orders/create/adhoc', {
          method: 'POST',
          token: auth.token,
          body: payload,
        });
        if (!created.ok) return created;
        createdData = created.data;
        shipmentId = String(created.data?.shipment_id || '');
        providerOrderId = String(created.data?.order_id || providerOrderId);
        awb = extractAwb(created.data);
        courier = extractCourier(created.data);
        trackingUrl = created.data?.tracking_url || '';
      }

      if (shipmentId && !awb) {
        const assign = await shiprocketRequest('/courier/assign/awb', {
          method: 'POST',
          token: auth.token,
          body: { shipment_id: shipmentId },
        });
        if (assign.ok) {
          awb = extractAwb(assign.data) || awb;
          courier = extractCourier(assign.data) || courier;
          trackingUrl = assign.data?.tracking_url || trackingUrl;
        }
      }

      if (!awb) {
        return {
          ok: false,
          code: 'awb_unavailable',
          message: 'Shipping provider did not return an AWB. The order was not marked as shipped.',
          shipmentId,
          providerOrderId,
        };
      }

      if (!trackingUrl) {
        trackingUrl = `https://shiprocket.co/tracking/${awb}`;
      }

      return {
        ok: true,
        provider: 'shiprocket',
        shipmentId: String(shipmentId || providerOrderId || ''),
        providerOrderId,
        awb,
        courier,
        trackingUrl,
        raw: createdData,
      };
    },

    async getCourierOptions() {
      return { ok: false, message: 'Courier listing is handled during createShipment.' };
    },
    async assignCourier() {
      return { ok: false, message: 'Use createShipment to assign a courier.' };
    },
    async generateAWB() {
      return { ok: false, message: 'AWB is generated during createShipment.' };
    },
    async schedulePickup() {
      return { ok: false, message: 'Pickup scheduling is not enabled until provider pickup is configured.' };
    },
    async generateLabel() {
      return { ok: false, message: 'Label generation is not enabled in this release.' };
    },
    async trackShipment() {
      return { ok: false, message: 'Use the shipping webhook for live tracking updates.' };
    },
  };
}
