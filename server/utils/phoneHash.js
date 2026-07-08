import bcrypt from 'bcryptjs';

export function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

export async function hashPhone(phone) {
  const normalized = normalizePhone(phone);
  return bcrypt.hash(normalized, 10);
}

export async function verifyPhone(phone, hashedPhone) {
  if (!hashedPhone) return false;
  const normalized = normalizePhone(phone);
  return bcrypt.compare(normalized, hashedPhone);
}
