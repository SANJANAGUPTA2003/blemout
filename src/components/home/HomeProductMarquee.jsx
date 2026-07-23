import { Children, useCallback, useEffect, useRef, useState } from 'react';

function prefersConstrainedMotion() {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection?.saveData) return true;
  if (/(^|-)2g$/i.test(connection?.effectiveType || '')) return true;
  return false;
}

/**
 * Horizontal product strip — Explore More card ratio, continuous left→right motion.
 */
export default function HomeProductMarquee({ children, speed = 28, className = '' }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, origin: 0 });
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [allowAutoplay, setAllowAutoplay] = useState(() =>
    typeof window === 'undefined' ? true : !prefersConstrainedMotion()
  );

  const items = Children.toArray(children);

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
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
      rootMargin: '60px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  }, []);

  const measureAndReset = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    halfRef.current = half;
    if (half <= 0) return;
    // Start at -half so increasing X (LTR) loops seamlessly across the duplicated set
    offsetRef.current = -half;
    applyTransform();
  }, [applyTransform]);

  const wrapOffset = useCallback(() => {
    const half = halfRef.current;
    if (half <= 0) return;
    while (offsetRef.current >= 0) offsetRef.current -= half;
    while (offsetRef.current < -half) offsetRef.current += half;
  }, []);

  useEffect(() => {
    measureAndReset();
    const onResize = () => measureAndReset();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [items.length, measureAndReset]);

  useEffect(() => {
    const shouldRun = allowAutoplay && inView && tabVisible && !paused && items.length > 0;
    if (!shouldRun) return undefined;

    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!dragRef.current.active) {
        // Positive translate = content travels left → right
        offsetRef.current += (speed * dt) / 1000;
        wrapOffset();
        applyTransform();
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [allowAutoplay, inView, tabVisible, paused, items.length, speed, applyTransform, wrapOffset]);

  const onPointerDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX, origin: offsetRef.current };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    offsetRef.current = dragRef.current.origin + (e.clientX - dragRef.current.startX);
    wrapOffset();
    applyTransform();
  };

  const endDrag = () => {
    dragRef.current.active = false;
  };

  if (!items.length) return null;

  const looped = [
    ...items.map((child, i) => ({ child, key: `a-${i}` })),
    ...items.map((child, i) => ({ child, key: `b-${i}` })),
  ];

  return (
    <div
      ref={sectionRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-4 will-change-transform cursor-grab active:cursor-grabbing select-none sm:gap-5 md:gap-6"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {looped.map(({ child, key }) => (
          <div
            key={key}
            data-marquee-item
            className="w-[46vw] shrink-0 sm:w-[30vw] md:w-[22vw] lg:w-[min(240px,18vw)] xl:w-[min(260px,17vw)]"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
