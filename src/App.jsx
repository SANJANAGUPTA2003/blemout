import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ShopByConcern = lazy(() => import('./pages/ShopByConcern'));
const ConcernCollection = lazy(() => import('./pages/ConcernCollection'));
const Cart = lazy(() => import('./pages/Cart'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Contact = lazy(() => import('./pages/Contact'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Checkout = lazy(() => import('./pages/Checkout'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const LegalPolicyPage = lazy(() => import('./pages/LegalPolicyPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminRoute = lazy(() => import('./components/admin/AdminRoute'));
const AdminDashboardHome = lazy(() => import('./pages/admin/AdminDashboardHome'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));

function RouteFallback() {
  return (
    <div
      className="min-h-[48vh] w-full animate-pulse bg-gradient-to-b from-[#f4f6f5] to-white"
      aria-hidden
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="shop/:slug" element={<ProductDetail />} />
                <Route
                  path="new"
                  element={
                    <CollectionPage
                      collection="new"
                      title="New"
                    />
                  }
                />
                <Route
                  path="best-sellers"
                  element={
                    <CollectionPage
                      collection="best-sellers"
                      title="Best Sellers"
                    />
                  }
                />
                <Route
                  path="limited-picks"
                  element={
                    <CollectionPage
                      collection="limited-picks"
                      title="Limited Picks"
                    />
                  }
                />
                <Route path="shop-by-concern" element={<ShopByConcern />} />
                <Route path="shop-by-concern/:concernId" element={<ConcernCollection />} />
                <Route path="about" element={<About />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success" element={<OrderSuccess />} />
                <Route path="contact" element={<Contact />} />
                <Route path="track-order" element={<TrackOrder />} />
                <Route path="affiliate" element={<InfoPage pageKey="affiliate" />} />
                <Route path="faq" element={<InfoPage pageKey="faq" />} />
                <Route path="shipping-policy" element={<LegalPolicyPage policyKey="shipping" />} />
                <Route path="return-refund-policy" element={<LegalPolicyPage policyKey="returns" />} />
                <Route path="privacy-policy" element={<LegalPolicyPage policyKey="privacy" />} />
                <Route path="terms-and-conditions" element={<LegalPolicyPage policyKey="terms" />} />
                {/* Preserve existing policy URLs */}
                <Route path="return-policy" element={<LegalPolicyPage policyKey="returns" />} />
                <Route path="terms" element={<LegalPolicyPage policyKey="terms" />} />
                {/* Legacy product URL support */}
                <Route path="product/:slug" element={<ProductDetail />} />
              </Route>

              <Route path="admin/login" element={<AdminLogin />} />

              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardHome />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="contacts" element={<AdminContacts />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
