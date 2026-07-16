import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef(null);
  const rafRef = useRef(0);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(
      '(pointer: fine) and (hover: hover) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'
    );
    const updateEnabled = () => {
      const next = mq.matches;
      setEnabled(next);
      document.body.classList.toggle('custom-cursor-enabled', next);
    };
    updateEnabled();
    mq.addEventListener('change', updateEnabled);
    return () => {
      mq.removeEventListener('change', updateEnabled);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const paint = () => {
      const el = cursorRef.current;
      if (!el) return;
      const { x, y } = posRef.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = visibleRef.current ? '1' : '0';
    };

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      visibleRef.current = true;
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = 0;
          paint();
        });
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      paint();
    };

    const onEnter = () => {
      visibleRef.current = true;
      paint();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] transition-opacity duration-300"
      style={{ opacity: 0, willChange: 'transform' }}
    >
      <div className="w-9 h-9 rounded-full border border-teal/25 bg-teal/10" />
      <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/40" />
    </div>
  );
}
