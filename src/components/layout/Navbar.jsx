import { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Logo from '../ui/Logo';

const routeLinks = [
  { label: 'Home', to: '/', end: true },
  { label: 'Shop', to: '/shop' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Contact', to: '/contact' },
];

const hashLinks = [
  { label: 'Shop By Concern', hash: 'concerns' },
  { label: 'Combos', hash: 'combos' },
];

const navLinkClass = ({ isActive }) =>
  `relative py-1 text-[13px] font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
    isActive
      ? 'text-teal after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-teal'
      : 'text-soft-text hover:text-dark-teal'
  }`;

const hashLinkClass =
  'relative py-1 text-[13px] font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap text-soft-text hover:text-dark-teal';

function scrollToHash(hash) {
  document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    const hash = location.hash.replace('#', '');
    if (!hash) return undefined;
    const timer = window.setTimeout(() => scrollToHash(hash), 100);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const handleHashClick = useCallback(
    (e, hash) => {
      e.preventDefault();
      setMobileOpen(false);
      if (location.pathname === '/') {
        scrollToHash(hash);
        window.history.replaceState(null, '', `/#${hash}`);
      } else {
        navigate(`/#${hash}`);
      }
    },
    [location.pathname, navigate]
  );

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.04)]' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[68px] md:h-[72px]">
          <Logo variant="navbar" className="justify-self-start" />

          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 justify-self-center">
            {routeLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
            {hashLinks.map((link) => (
              <a
                key={link.label}
                href={`/#${link.hash}`}
                onClick={(e) => handleHashClick(e, link.hash)}
                className={hashLinkClass}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 justify-self-end">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-soft-text hover:text-dark-teal transition-colors duration-300"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link
              to="/cart"
              className="relative p-2.5 text-soft-text hover:text-dark-teal transition-colors duration-300"
              aria-label="Cart"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 bg-teal text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 text-soft-text hover:text-dark-teal transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-5">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full max-w-md mx-auto block px-5 py-2.5 rounded-full border border-gray-100 text-sm text-text placeholder:text-soft-text focus:outline-none focus:border-teal/40 bg-light-teal/20"
              autoFocus
            />
          </div>
        )}
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-white px-5 py-3 border-t border-gray-50">
          {routeLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block py-3.5 text-sm font-semibold border-b border-gray-50 last:border-0 transition-colors duration-300 ${
                  isActive ? 'text-teal' : 'text-soft-text hover:text-dark-teal'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {hashLinks.map((link) => (
            <a
              key={link.label}
              href={`/#${link.hash}`}
              onClick={(e) => handleHashClick(e, link.hash)}
              className="block py-3.5 text-sm font-semibold border-b border-gray-50 last:border-0 text-soft-text hover:text-dark-teal transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
