function isSet(value) {
  return Boolean(value && String(value).trim() && !/your_|changeme|placeholder/i.test(value));
}

export function isShippingConfigured() {
  return isSet(process.env.SHIPROCKET_EMAIL) && isSet(process.env.SHIPROCKET_PASSWORD);
}

export function shippingNotConfiguredResult() {
  return {
    ok: false,
    code: 'not_configured',
    message: 'Shipping provider is not configured. The order was not marked as shipped.',
  };
}

const unconfigured = {
  name: 'unconfigured',
  configured: false,
  async createShipment() {
    return shippingNotConfiguredResult();
  },
  async getCourierOptions() {
    return shippingNotConfiguredResult();
  },
  async assignCourier() {
    return shippingNotConfiguredResult();
  },
  async generateAWB() {
    return shippingNotConfiguredResult();
  },
  async schedulePickup() {
    return shippingNotConfiguredResult();
  },
  async generateLabel() {
    return shippingNotConfiguredResult();
  },
  async trackShipment() {
    return shippingNotConfiguredResult();
  },
};

export default unconfigured;
