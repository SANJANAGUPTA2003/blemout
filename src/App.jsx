import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminRoute from './components/admin/AdminRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CollectionPage from './pages/CollectionPage';
import ShopByConcern from './pages/ShopByConcern';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import InfoPage from './pages/InfoPage';

const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Checkout = lazy(() => import('./pages/Checkout'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const LegalPolicyPage = lazy(() => import('./pages/LegalPolicyPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
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
                      eyebrow="New"
                      title="New Arrivals"
                      subtitle="Fresh launches including serum and newly curated duos."
                    />
                  }
                />
                <Route
                  path="best-sellers"
                  element={
                    <CollectionPage
                      collection="best-sellers"
                      eyebrow="Bestsellers"
                      title="Best Sellers"
                      subtitle="The most-loved BLEMOUT formulas and routines."
                    />
                  }
                />
                <Route
                  path="limited-picks"
                  element={
                    <CollectionPage
                      collection="limited-picks"
                      eyebrow="Limited"
                      title="Limited Picks"
                      subtitle="Full kits and approved combo sets, curated for complete routines."
                    />
                  }
                />
                <Route path="shop-by-concern" element={<ShopByConcern />} />
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
