import unconfigured, { isShippingConfigured } from './unconfigured.js';
import { createShiprocketProvider } from './shiprocket.js';

export function getShippingProvider() {
  if (isShippingConfigured()) return createShiprocketProvider();
  return unconfigured;
}

export { isShippingConfigured };
