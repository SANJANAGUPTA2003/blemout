import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import BrandWordmark from '../home/BrandWordmark';
import HomeBrandClaim from '../home/HomeBrandClaim';
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
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden">
      <ScrollToTop />
      <CustomCursor />
      <AnnouncementBar />
      <Navbar />
      <ProductProvider>
        <main className="min-w-0 w-full flex-1">
          <Outlet />
        </main>
      </ProductProvider>
      <HomeBrandClaim />
      <BrandWordmark />
      <Footer />
      <CartDrawer />
      <CartToast />
      <PromoHost />
    </div>
  );
}
