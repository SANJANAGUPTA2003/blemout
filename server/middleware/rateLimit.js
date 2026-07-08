const buckets = new Map();

export function rateLimit({ windowMs = 60_000, max = 10 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = buckets.get(ip);

    if (!entry || now > entry.resetAt) {
      buckets.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      return res.status(429).json({
        message: 'Too many requests. Please wait a moment and try again.',
      });
    }

    entry.count += 1;
    return next();
  };
}
