import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';

function prefersConstrainedMotion() {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection?.saveData) return true;
  if (/(^|-)2g$/i.test(connection?.effectiveType || '')) return true;
  return false;
}

export default function BestSellersCarousel({ products = [] }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, origin: 0 });
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [allowAutoplay, setAllowAutoplay] = useState(() =>
    typeof window === 'undefined' ? true : !prefersConstrainedMotion()
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setAllowAutoplay(!prefersConstrainedMotion());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.12, rootMargin: '80px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  const wrapOffset = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    while (offsetRef.current >= half) offsetRef.current -= half;
    while (offsetRef.current < 0) offsetRef.current += half;
  }, []);

  useEffect(() => {
    const shouldRun =
      allowAutoplay && inView && tabVisible && !paused && products.length > 0;
    if (!shouldRun) return undefined;

    let raf = 0;
    let last = performance.now();
    const SPEED_PX_PER_SEC = 26;

    const tick = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!dragRef.current.active) {
        offsetRef.current += (SPEED_PX_PER_SEC * dt) / 1000;
        wrapOffset();
        applyTransform();
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [allowAutoplay, inView, tabVisible, paused, products.length, applyTransform, wrapOffset]);

  const scrollByCard = useCallback(
    (dir) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector('[data-carousel-item]');
      const amount = card ? card.getBoundingClientRect().width + 32 : 360;
      offsetRef.current += dir * amount;
      wrapOffset();
      applyTransform();
    },
    [applyTransform, wrapOffset]
  );

  const onPointerDown = (e) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      origin: offsetRef.current,
    };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    e.preventDefault();
    offsetRef.current = dragRef.current.origin - (e.clientX - dragRef.current.startX);
    wrapOffset();
    applyTransform();
  };

  const endDrag = () => {
    dragRef.current.active = false;
  };

  if (!products.length) return null;

  const looped = [
    ...products.map((p) => ({ product: p, key: `a-${p._id}` })),
    ...products.map((p) => ({ product: p, key: `b-${p._id}` })),
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 mb-10 md:mb-12 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[36px] md:text-[44px] lg:text-[48px] font-bold text-[#222222] tracking-[-0.03em] leading-[1.1]">
            Best Sellers
          </h2>
          <p className="mt-3 text-[16px] text-[#4a5560] max-w-md leading-relaxed">
            The most-loved BLEMOUT formulas and routines, curated for everyday clarity.
          </p>
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button
            type="button"
            aria-label="Scroll bestsellers left"
            onClick={() => scrollByCard(-1)}
            className="w-10 h-10 rounded-full bg-[#f6f7f6] flex items-center justify-center text-[#26313D] hover:text-dark-teal hover:bg-[#eef1f0] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll bestsellers right"
            onClick={() => scrollByCard(1)}
            className="w-10 h-10 rounded-full bg-[#f6f7f6] flex items-center justify-center text-[#26313D] hover:text-dark-teal hover:bg-[#eef1f0] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden px-5 md:px-8 lg:px-10">
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 will-change-transform cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          {looped.map(({ product, key }) => (
            <div
              key={key}
              data-carousel-item
              className="shrink-0 w-[82vw] sm:w-[46vw] lg:w-[min(420px,calc((100vw-6rem)/3))] xl:w-[min(430px,420px)]"
            >
              <ProductCard product={product} imageMode="promo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
