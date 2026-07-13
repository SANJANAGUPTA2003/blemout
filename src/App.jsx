import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CollectionPage from './pages/CollectionPage';
import About from './pages/About';
import ShopByConcern from './pages/ShopByConcern';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import InfoPage from './pages/InfoPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContacts from './pages/admin/AdminContacts';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
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
              <Route path="shipping-policy" element={<InfoPage pageKey="shipping" />} />
              <Route path="return-policy" element={<InfoPage pageKey="returns" />} />
              <Route path="privacy-policy" element={<InfoPage pageKey="privacy" />} />
              <Route path="terms" element={<InfoPage pageKey="terms" />} />
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
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
