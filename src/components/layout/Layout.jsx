import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import BrandWordmark from '../home/BrandWordmark';
import ScrollToTop from '../ScrollToTop';
import CustomCursor from '../CustomCursor';
import CartDrawer from '../CartDrawer';
import CartToast from '../CartToast';
import PromoCampaignPopup from '../PromoCampaignPopup';
import { ProductProvider } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

function PromoHost() {
  const { isDrawerOpen } = useCart();
  return <PromoCampaignPopup blockedByOther={isDrawerOpen} />;
}

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <CustomCursor />
      <AnnouncementBar />
      <Navbar />
      <ProductProvider>
        <main className="flex-1">
          <Outlet />
        </main>
      </ProductProvider>
      <BrandWordmark />
      <Footer />
      <CartDrawer />
      <CartToast />
      <PromoHost />
    </div>
  );
}
