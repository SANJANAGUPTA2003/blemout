# BLEMOUT — Phase 1 Ecommerce

Premium skincare ecommerce website for **BLEMOUT**, built with React + Vite + Tailwind CSS and a Node.js + Express + MongoDB backend with Razorpay payments.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Framer Motion, Lucide React, Axios

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Razorpay, bcryptjs

## Project Structure

```
blem/
├── src/                    # Frontend
│   ├── components/         # UI, layout, admin components
│   ├── pages/              # Public & admin pages
│   ├── context/            # Cart & auth state
│   ├── data/               # Static content (FAQs, reviews, etc.)
│   └── utils/              # API client, formatters, Razorpay loader
├── server/                 # Backend
│   ├── config/             # Database connection
│   ├── models/             # MongoDB schemas
│   ├── controllers/        # Route handlers
│   ├── routes/             # API routes
│   ├── middleware/         # JWT auth
│   └── scripts/            # Database seed
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Razorpay](https://razorpay.com/) test account (for payments)

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
# Frontend (root directory)
npm install

# Backend
cd server
npm install
```

### 2. Configure Backend Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/blemout
JWT_SECRET=your_super_secret_jwt_key_change_this
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=5000
ADMIN_EMAIL=admin@blemout.com
ADMIN_PASSWORD=admin123
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or update `MONGODB_URI` to your Atlas connection string.

### 4. Seed Database

```bash
cd server
npm run seed
```

This creates:
- Admin account (`admin@blemout.com` / `admin123` by default)
- 8 sample skincare products

### 5. Start Backend Server

```bash
cd server
npm run dev
```

Server runs at **http://localhost:5000**

### 6. Start Frontend Dev Server

In a new terminal, from the project root:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173** (proxies `/api` to backend)

## Pages

| Page | Route |
|------|-------|
| Home | `/` |
| Shop | `/shop` |
| Product Detail | `/product/:id` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Success | `/order-success` |
| Contact | `/contact` |
| Track Order | `/track-order` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin` |

## API Routes

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| POST | `/api/orders` | Public |
| GET | `/api/orders` | Admin |
| POST | `/api/orders/track` | Public (Order ID + phone, rate-limited) |
| PUT | `/api/orders/:id/status` | Admin |
| POST | `/api/contact` | Public |
| GET | `/api/contact` | Admin |
| POST | `/api/admin/login` | Public |
| POST | `/api/payment/create-order` | Public |
| POST | `/api/payment/verify` | Public |

## Razorpay Setup

1. Create a Razorpay account at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys** and generate test keys
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `server/.env`
4. Use Razorpay test cards for checkout testing

## Order Tracking Security

- Public order IDs use random format: `BLM-A7K9Q2` (not sequential)
- Tracking requires **Order ID + phone number** via `POST /api/orders/track`
- Phone numbers are stored for admin fulfillment and verified using a `hashedPhone` field
- Public tracking never exposes address, email, Razorpay IDs, or full phone number
- Tracking endpoint is rate-limited (8 requests/minute per IP)

## Seed Products

```bash
cd server
npm run seed
```

This seeds 5 single products + 5 combo bundles with MRP/selling prices and image paths under `public/products/`. Replace placeholder images when designer assets are ready.

## Admin Access

- URL: `/admin/login`
- Default credentials (after seed): `admin@blemout.com` / `admin123`
- Change these in `.env` before seeding for production

## Build for Production

```bash
# Frontend
npm run build

# Backend
cd server
npm start
```

Serve the `dist/` folder with any static host (Vercel, Netlify, etc.) and deploy the backend separately.

## Brand Colors

| Color | Hex |
|-------|-----|
| White | `#FFFFFF` |
| Soft Ivory | `#FAF9F6` |
| Logo Teal | `#2DBEAD` |
| Light Teal | `#D4F5F1` |
| Mid Teal | `#5FA9A5` |
| Dark Teal | `#2A7F80` |
| Text | `#252525` |

## Phase 1 Exclusions

Customer login, wishlist, coupons, loyalty points, referrals, review backend, multi-admin roles, advanced analytics, and email marketing are intentionally excluded from this phase.
