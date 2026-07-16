import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { isRazorpayConfigured } from './utils/razorpayConfig.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  // Private routes must never be cached by browsers/CDNs.
  if (
    req.path.startsWith('/api/admin') ||
    req.path.startsWith('/api/orders') ||
    req.path.startsWith('/api/payment') ||
    (req.path.startsWith('/api/contact') && req.method !== 'POST') ||
    req.method !== 'GET'
  ) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'public, max-age=15');
  res.json({ status: 'ok', brand: 'BLEMOUT' });
});

app.listen(PORT, () => {
  console.log(`BLEMOUT server running on port ${PORT}`);
  if (!isRazorpayConfigured()) {
    console.log('Razorpay: not configured — checkout will show demo payment message.');
  }
});
