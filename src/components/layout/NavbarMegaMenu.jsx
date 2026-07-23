import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MEGA_MENUS } from '../../data/storefrontConfig';

const MENU_KEYS = ['shop', 'new', 'bestSellers', 'limitedPicks'];

/**
 * First click/tap on a label opens its menu.
 * Second click/tap on the same open label navigates to that collection page.
 */
export default function NavbarMegaMenu({ mobile = false, onNavigate }) {
  const [openKey, setOpenKey] = useState(null);
  const rootRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const baseId = useId();

  useEffect(() => {
    setOpenKey(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpenKey(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  const handleLabelClick = (key, to) => {
    if (openKey === key) {
      setOpenKey(null);
      navigate(to);
      onNavigate?.();
      return;
    }
    setOpenKey(key);
  };

  if (mobile) {
    return (
      <div ref={rootRef} className="space-y-1">
        {MENU_KEYS.map((key) => {
          const menu = MEGA_MENUS[key];
          const isOpen = openKey === key;
          return (
            <div key={key} className="border-b border-[#eef1f0] pb-2">
              <button
                type="button"
                className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-semibold tracking-[0.06em] text-[#222222] uppercase"
                aria-expanded={isOpen}
                onClick={() => handleLabelClick(key, menu.to)}
              >
                <span>{menu.label}</span>
                <span className="text-teal text-lg leading-none">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="space-y-3 pb-3 pl-1">
                  {menu.links.map((link) => (
                    <Link
                      key={link.to + link.label}
                      to={link.to}
                      onClick={onNavigate}
                      className="block text-[16px] text-[#4a5560] hover:text-dark-teal"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {menu.cards.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {menu.cards.map((card) => (
                        <Link key={card.to} to={card.to} onClick={onNavigate} className="block">
                          <div className="aspect-square overflow-hidden bg-[#f6f7f6]">
                            <img
                              src={card.image}
                              alt={card.label}
                              className="h-full w-full object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <p className="mt-2 text-[14px] font-semibold text-[#222222]">{card.label}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="hidden items-center gap-1 xl:flex">
      {MENU_KEYS.map((key) => {
        const menu = MEGA_MENUS[key];
        const isOpen = openKey === key;
        const panelId = `${baseId}-${key}`;
        return (
          <div key={key} className="relative">
            <button
              type="button"
              className={`px-3 py-2 text-[15px] xl:text-[16px] font-semibold tracking-[0.04em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
                isOpen ? 'text-dark-teal' : 'text-[#222222] hover:text-dark-teal'
              }`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-haspopup="true"
              onClick={() => handleLabelClick(key, menu.to)}
            >
              {menu.label}
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-label={`${menu.label} menu`}
                className="absolute left-1/2 top-full z-[80] w-[min(92vw,720px)] -translate-x-1/2 pt-3"
              >
                <div className="border border-[#eef1f0] bg-white px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div
                    className={`grid gap-6 ${menu.cards.length ? 'grid-cols-[200px_1fr]' : 'grid-cols-1'}`}
                  >
                    <div className="flex flex-col gap-3">
                      {menu.links.map((link) => (
                        <NavLink
                          key={link.to + link.label}
                          to={link.to}
                          className="text-[16px] font-semibold text-[#222222] hover:text-dark-teal"
                          onClick={() => setOpenKey(null)}
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                    {menu.cards.length > 0 && (
                      <div
                        className={`grid gap-4 ${
                          menu.cards.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                        }`}
                      >
                        {menu.cards.map((card) => (
                          <Link
                            key={card.to}
                            to={card.to}
                            onClick={() => setOpenKey(null)}
                            className="group/card block"
                          >
                            <div className="aspect-square overflow-hidden bg-[#fafafa]">
                              <img
                                src={card.image}
                                alt={card.label}
                                width="400"
                                height="400"
                                className="h-full w-full object-contain transition-transform duration-400 [@media(hover:hover)]:group-hover/card:scale-[1.03]"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            <p className="mt-3 text-center text-[14px] font-semibold text-[#222222]">
                              {card.label}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
