import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Logo from '../ui/Logo';

const primaryLinks = [
  { label: 'SHOP', to: '/shop' },
  { label: 'NEW', to: '/new' },
  { label: 'BEST SELLERS', to: '/best-sellers' },
  { label: 'LIMITED PICKS', to: '/limited-picks' },
  { label: 'SHOP BY CONCERN', to: '/shop-by-concern' },
  { label: 'ABOUT', to: '/about' },
];

const utilityLinks = [
  { label: 'CONTACT', to: '/contact' },
  { label: 'TRACK ORDER', to: '/track-order' },
];

const navLinkClass = ({ isActive }) =>
  `relative py-1 text-[14px] md:text-[15px] font-bold tracking-[0.08em] uppercase transition-colors duration-300 whitespace-nowrap ${
    isActive
      ? 'text-teal after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-[2px] after:bg-teal'
      : 'text-soft-text hover:text-dark-teal'
  }`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, openDrawer } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setSearchOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.06)]' : ''
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-[78px] md:h-[86px] gap-4">
          <Logo variant="navbar" className="justify-self-start" />

          <nav className="hidden xl:flex items-center gap-7 justify-self-center">
            {primaryLinks.map((link) => (
              <NavLink key={link.label} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 justify-self-end">
            {utilityLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hidden lg:inline-flex px-2.5 py-2 text-[13px] font-semibold text-soft-text hover:text-dark-teal transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-3 text-soft-text hover:text-dark-teal transition-colors duration-300"
              aria-label="Search"
            >
              <Search size={21} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={openDrawer}
              className="relative p-3 text-soft-text hover:text-dark-teal transition-colors duration-300"
              aria-label="Open cart"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-0.5 bg-teal text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-3 text-soft-text hover:text-dark-teal transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="pb-5">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full max-w-lg mx-auto block px-5 py-3 rounded-full border border-gray-100 text-base text-text placeholder:text-soft-text focus:outline-none focus:border-teal/40 bg-white"
              autoFocus
            />
          </form>
        )}
      </div>

      {mobileOpen && (
        <nav className="xl:hidden bg-white px-5 py-3 border-t border-gray-50">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `block py-3.5 text-base font-semibold border-b border-gray-50 transition-colors duration-300 ${
                  isActive ? 'text-teal' : 'text-soft-text hover:text-dark-teal'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {utilityLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `block py-3.5 text-base font-semibold border-b border-gray-50 last:border-0 transition-colors duration-300 ${
                  isActive ? 'text-teal' : 'text-soft-text hover:text-dark-teal'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
