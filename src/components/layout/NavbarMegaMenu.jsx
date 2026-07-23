import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MEGA_MENUS } from '../../data/storefrontConfig';

const MENU_KEYS = ['shop', 'new', 'bestSellers', 'limitedPicks'];

/**
 * SEREKO-style full-width dropdown under the navbar (~380–450px).
 * Not fullscreen — page remains visible underneath.
 */
export default function NavbarMegaMenu({ mobile = false, onNavigate, panelHostRef }) {
  const [openKey, setOpenKey] = useState(null);
  const [hostEl, setHostEl] = useState(null);
  const buttonsRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const baseId = useId();

  const close = () => setOpenKey(null);

  useEffect(() => {
    setHostEl(panelHostRef?.current || null);
  }, [panelHostRef, openKey]);

  useEffect(() => {
    setOpenKey(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!openKey) return undefined;
    const header = document.querySelector('[data-blem-navbar]');
    if (header) {
      const bottom = header.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--blem-nav-bottom', `${bottom}px`);
    }
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    const onPointer = (e) => {
      const inButtons = buttonsRef.current?.contains(e.target);
      const inPanel = hostEl?.contains(e.target);
      if (!inButtons && !inPanel) close();
    };
    const onScroll = () => {
      const header = document.querySelector('[data-blem-navbar]');
      if (header) {
        document.documentElement.style.setProperty(
          '--blem-nav-bottom',
          `${header.getBoundingClientRect().bottom}px`
        );
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [openKey, hostEl]);

  const handleLabelClick = (key, to) => {
    if (openKey === key) {
      setOpenKey(null);
      navigate(to);
      onNavigate?.();
      return;
    }
    setOpenKey(key);
  };

  const openMenu = openKey ? MEGA_MENUS[openKey] : null;
  const hasCards = Boolean(openMenu?.cards?.length);

  const panelPortal =
    hostEl &&
    createPortal(
      <AnimatePresence>
        {openMenu && (
          <div key={openKey} className="relative">
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-x-0 bottom-0 z-[55] bg-black/15"
              style={{ top: 'var(--blem-nav-bottom, 76px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />
            <motion.div
              id={`${baseId}-panel`}
              role="region"
              aria-label={`${openMenu.label} menu`}
              className="relative z-[60] w-full overflow-hidden rounded-b-2xl border-b border-[#e8eeec] bg-[#F6FFFD] shadow-[0_18px_40px_rgba(31,41,55,0.12)]"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className={`mx-auto flex min-h-[420px] max-h-[min(620px,72vh)] max-w-[1400px] gap-8 overflow-y-auto px-5 py-9 md:px-8 md:py-10 lg:gap-10 lg:px-10 ${
                  hasCards
                    ? 'flex-col items-stretch lg:flex-row lg:items-center'
                    : 'flex-col lg:flex-row lg:items-center'
                }`}
              >
                {!hasCards && (
                  <div className="flex w-full flex-col justify-center gap-1 lg:max-w-xl">
                    {openMenu.links.map((link) => (
                      <NavLink
                        key={link.to + link.label}
                        to={link.to}
                        onClick={() => {
                          close();
                          onNavigate?.();
                        }}
                        className={({ isActive }) =>
                          `w-fit py-2.5 text-[clamp(1.15rem,1.7vw,1.55rem)] font-semibold tracking-[-0.03em] transition-colors ${
                            isActive
                              ? 'text-teal underline decoration-2 underline-offset-8'
                              : 'text-[#222222] hover:text-teal'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                    <Link
                      to={openMenu.to}
                      onClick={() => {
                        close();
                        onNavigate?.();
                      }}
                      className="mt-6 inline-flex w-fit items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[#222222] transition-colors hover:text-teal"
                    >
                      See More
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                )}

                {hasCards && (
                  <>
                    <div className="hidden shrink-0 flex-col justify-center gap-1 lg:flex lg:w-[22%]">
                      {openMenu.links.map((link) => (
                        <NavLink
                          key={link.to + link.label}
                          to={link.to}
                          onClick={() => {
                            close();
                            onNavigate?.();
                          }}
                          className={({ isActive }) =>
                            `w-fit py-2 text-[clamp(1.1rem,1.5vw,1.4rem)] font-semibold tracking-[-0.03em] transition-colors ${
                              isActive
                                ? 'text-teal underline decoration-2 underline-offset-8'
                                : 'text-[#222222] hover:text-teal'
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>

                    <div
                      className={`grid min-w-0 flex-1 gap-5 md:gap-6 ${
                        openMenu.cards.length === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-2 sm:grid-cols-3'
                      }`}
                    >
                      {openMenu.cards.map((card) => {
                        const fitClass =
                          card.fit === 'contain' ? 'object-contain' : 'object-cover';
                        const pos = card.position || 'center';
                        return (
                          <Link
                            key={card.to}
                            to={card.to}
                            onClick={() => {
                              close();
                              onNavigate?.();
                            }}
                            className="group block min-w-0"
                          >
                            <div className="aspect-square overflow-hidden rounded-2xl bg-[#e8f4f1]">
                              <img
                                src={card.image}
                                alt={card.label}
                                width="640"
                                height="640"
                                className={`h-full w-full ${fitClass} transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]`}
                                style={{ objectPosition: pos }}
                                loading="eager"
                                decoding="async"
                              />
                            </div>
                            <p className="mt-3 text-[15px] font-semibold text-[#222222] md:text-[16px]">
                              {card.label}
                            </p>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="flex shrink-0 items-center justify-start lg:w-[12%] lg:justify-center">
                      <Link
                        to={openMenu.to}
                        onClick={() => {
                          close();
                          onNavigate?.();
                        }}
                        className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] text-[#222222] transition-colors hover:text-teal"
                      >
                        See More
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      hostEl
    );

  if (mobile) {
    return (
      <div ref={buttonsRef} className="space-y-1">
        {MENU_KEYS.map((key) => {
          const menu = MEGA_MENUS[key];
          const isOpen = openKey === key;
          return (
            <div key={key} className="border-b border-[#eef1f0]">
              <button
                type="button"
                className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-semibold uppercase tracking-[0.06em] text-[#222222]"
                aria-expanded={isOpen}
                onClick={() => handleLabelClick(key, menu.to)}
              >
                <span>{menu.label}</span>
                <span className="text-lg leading-none text-teal">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="space-y-3 pb-4 pl-1">
                  {menu.links.map((link) => (
                    <Link
                      key={link.to + link.label}
                      to={link.to}
                      onClick={onNavigate}
                      className="block text-[16px] text-[#4a5560] hover:text-teal"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {menu.cards.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {menu.cards.map((card) => (
                        <Link key={card.to} to={card.to} onClick={onNavigate} className="block">
                          <div className="aspect-square overflow-hidden rounded-xl bg-[#e8f4f1]">
                            <img
                              src={card.image}
                              alt={card.label}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <p className="mt-2 text-[13px] font-semibold text-[#222222]">
                            {card.label}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    to={menu.to}
                    onClick={onNavigate}
                    className="inline-flex pt-1 text-[14px] font-semibold text-teal"
                  >
                    See All Products →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div ref={buttonsRef} className="hidden items-center gap-1 xl:flex">
        {MENU_KEYS.map((key) => {
          const menu = MEGA_MENUS[key];
          const isOpen = openKey === key;
          return (
            <button
              key={key}
              type="button"
              className={`px-3 py-2 text-[15px] font-semibold uppercase tracking-[0.04em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal xl:text-[16px] ${
                isOpen ? 'text-teal' : 'text-[#222222] hover:text-dark-teal'
              }`}
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-controls={isOpen ? `${baseId}-panel` : undefined}
              onClick={() => handleLabelClick(key, menu.to)}
            >
              {menu.label}
            </button>
          );
        })}
      </div>
      {panelPortal}
    </>
  );
}
