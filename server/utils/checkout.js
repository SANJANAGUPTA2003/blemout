import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { normalizePhone } from './phoneHash.js';

export const FREE_SHIPPING_MIN_PRODUCTS = 3;
export const STANDARD_SHIPPING_CHARGE = 49;
export const MIN_PAYABLE_PAISE = 100;

export function getShippingCharge(items = []) {
  const productCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  return productCount >= FREE_SHIPPING_MIN_PRODUCTS ? 0 : STANDARD_SHIPPING_CHARGE;
}

export function validateCustomer(customer = {}) {
  const name = String(customer.name || customer.customerName || '').trim();
  const email = String(customer.email || '').trim().toLowerCase();
  const address = String(customer.address || '').trim();
  const city = String(customer.city || '').trim();
  const state = String(customer.state || '').trim();
  const pincode = String(customer.pincode || '').replace(/\D/g, '');
  const phone = normalizePhone(customer.phone);

  if (!name) return { error: 'Name is required.' };
  if (phone.length !== 10) return { error: 'Enter a valid 10-digit phone number.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' };
  if (!address) return { error: 'Address is required.' };
  if (!city) return { error: 'City is required.' };
  if (!state) return { error: 'State is required.' };
  if (pincode.length !== 6) return { error: 'Enter a valid 6-digit pincode.' };

  return {
    customer: { name, phone, email, address, city, state, pincode },
  };
}

export async function validateAndPriceCart(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: 'Cart is empty.', status: 400 };
  }

  const cleaned = [];
  for (const item of rawItems) {
    const productId = item.productId || item._id;
    const quantity = Number(item.quantity);
    if (!productId || !mongoose.Types.ObjectId.isValid(String(productId))) {
      return { error: 'Invalid cart item.', status: 400 };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { error: 'Invalid item quantity.', status: 400 };
    }
    cleaned.push({ productId: String(productId), quantity });
  }

  const products = await Product.find({ _id: { $in: cleaned.map((item) => item.productId) } });
  const byId = new Map(products.map((product) => [String(product._id), product]));

  const pricedItems = [];
  let subtotal = 0;

  for (const item of cleaned) {
    const product = byId.get(item.productId);
    if (!product) {
      return { error: 'One or more products are no longer available.', status: 400 };
    }

    const stock = Number(product.stock);
    if (Number.isFinite(stock) && stock < item.quantity) {
      return { error: `${product.name} is out of stock.`, status: 400 };
    }

    const price = Number(product.sellingPrice || product.price || 0);
    if (!Number.isFinite(price) || price <= 0) {
      return { error: 'Unable to price this order.', status: 400 };
    }

    pricedItems.push({
      productId: product._id,
      name: product.name,
      price,
      quantity: item.quantity,
    });
    subtotal += price * item.quantity;
  }

  const shipping = getShippingCharge(pricedItems);
  const totalAmount = Math.round((subtotal + shipping) * 100) / 100;
  const amountPaise = Math.round(totalAmount * 100);

  if (!Number.isFinite(amountPaise) || amountPaise < MIN_PAYABLE_PAISE) {
    return { error: 'Invalid order amount.', status: 400 };
  }

  return { items: pricedItems, subtotal, shipping, totalAmount, amountPaise };
}

export async function restoreStock(items = []) {
  for (const item of items) {
    await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
  }
}

export async function decrementStock(items = []) {
  const decremented = [];
  try {
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        throw new Error('Insufficient stock.');
      }
      decremented.push(item);
    }
  } catch (error) {
    await restoreStock(decremented);
    throw error;
  }
}
