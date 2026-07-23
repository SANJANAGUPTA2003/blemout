import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Logo from '../ui/Logo';
import NavbarMegaMenu from './NavbarMegaMenu';

const secondaryLinks = [
  { label: 'SHOP BY CONCERN', to: '/shop-by-concern' },
  { label: 'ABOUT', to: '/about' },
];

const utilityLinks = [
  { label: 'CONTACT', to: '/contact' },
  { label: 'TRACK ORDER', to: '/track-order' },
];

const navLinkClass = ({ isActive }) =>
  `relative inline-flex items-center py-1 text-[15px] xl:text-[16px] font-semibold tracking-[0.04em] uppercase transition-colors duration-250 whitespace-nowrap ${
    isActive
      ? 'text-teal after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-teal'
      : 'text-[#26313D] hover:text-dark-teal'
  }`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const megaPanelRef = useRef(null);
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
  }, [location.pathname, location.search]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setSearchOpen(false);
  };

  return (
    <header
      data-blem-navbar
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-[box-shadow] duration-300 ${
        scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.06)]' : ''
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        <div className="grid h-[70px] grid-cols-[auto_1fr_auto] items-center gap-3 md:h-[76px] md:gap-5">
          <Logo variant="navbar" className="justify-self-start" />

          <nav className="hidden items-center justify-self-center gap-2 xl:flex 2xl:gap-3">
            <NavbarMegaMenu panelHostRef={megaPanelRef} />
            {secondaryLinks.map((link) => (
              <NavLink key={link.label} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-0.5">
            {utilityLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hidden items-center px-2.5 py-2 text-[15px] font-semibold uppercase tracking-[0.04em] text-[#26313D] transition-colors hover:text-dark-teal lg:inline-flex xl:text-[16px]"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="inline-flex items-center justify-center p-2.5 text-[#26313D] transition-colors duration-250 hover:text-dark-teal"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex items-center justify-center p-2.5 text-[#26313D] transition-colors duration-250 hover:text-dark-teal"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-teal px-0.5 text-[9px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2.5 text-[#26313D] transition-colors hover:text-dark-teal xl:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="pb-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="mx-auto block w-full max-w-lg border-b border-gray-200 bg-transparent px-4 py-2.5 text-base text-[#222222] placeholder:text-[#6b7280] focus:border-teal/50 focus:outline-none"
              autoFocus
            />
          </form>
        )}
      </div>

      {/* Full-width mega panel mounts here — directly under navbar */}
      <div ref={megaPanelRef} className="relative z-[60] hidden xl:block" />

      {mobileOpen && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-gray-100/80 bg-white px-5 py-2 xl:hidden">
          <NavbarMegaMenu mobile onNavigate={() => setMobileOpen(false)} />
          {secondaryLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `block py-3 text-[15px] font-semibold uppercase tracking-[0.03em] transition-colors duration-250 ${
                  isActive ? 'text-teal' : 'text-[#26313D] hover:text-dark-teal'
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
                `block py-3 text-[15px] font-semibold uppercase tracking-[0.03em] transition-colors duration-250 ${
                  isActive ? 'text-teal' : 'text-[#26313D] hover:text-dark-teal'
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
