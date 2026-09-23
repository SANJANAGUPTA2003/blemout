export function shipClaimFilter(orderMongoId) {
  return {
    _id: orderMongoId,
    orderStatus: { $in: ['pending', 'processing'] },
    shippingLock: { $ne: true },
    $or: [{ awbNumber: '' }, { awbNumber: null }, { awbNumber: { $exists: false } }],
  };
}

export function shouldRetryExistingShipment(order) {
  return Boolean(order?.shipmentId) && !order?.awbNumber;
}

export function pickupLocationOrError() {
  const location = String(process.env.SHIPROCKET_PICKUP_LOCATION || '').trim();
  if (!location) {
    return {
      ok: false,
      code: 'pickup_unconfigured',
      message:
        'SHIPROCKET_PICKUP_LOCATION is not configured. Set it to the exact pickup name from the Shiprocket dashboard.',
    };
  }
  return { ok: true, location };
}
