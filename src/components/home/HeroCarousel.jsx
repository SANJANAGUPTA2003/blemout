import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const slides = [
  {
    id: 1,
    image: '/products/facewash/2.jpg',
    headline: 'Reveal clearer, calmer-looking skin',
    copy: 'Dermatologically inspired formulas for blemish-prone and uneven tone.',
    cta: { label: 'Shop Now', to: '/shop' },
  },
  {
    id: 2,
    image: '/products/serum/2.jpg',
    headline: 'New: BLEMOUT Advanced Blemishes Repair Serum',
    copy: 'A focused treat step designed to support a more even appearance.',
    cta: { label: 'Discover Serum', to: '/shop/blemout-advanced-blemishes-repair-serum-30ml' },
  },
  {
    id: 3,
    image: '/products/repair-cream/2.jpg',
    headline: 'Build your complete blemish routine',
    copy: 'Cleanse, treat, repair, moisturise, and protect — in one curated kit.',
    cta: { label: 'Shop Limited Picks', to: '/limited-picks' },
  },
];

const clipPaths = [
  {
    initial: 'polygon(0% 0%, 0% 0%, 0% 0%)',
    animate: 'polygon(0% 0%, 200% 0%, 0% 200%)',
  },
  {
    initial: 'polygon(100% 0%, 100% 0%, 100% 0%)',
    animate: 'polygon(100% 0%, -100% 0%, 100% 200%)',
  },
  {
    initial: 'polygon(0% 100%, 0% 100%, 0% 100%)',
    animate: 'polygon(0% 100%, 200% 100%, 0% -100%)',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const reduceMotion = useReducedMotion();

  const go = useCallback((next) => {
    setIndex((current) => (next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const timer = window.setInterval(() => go(index + 1), 5600);
    return () => window.clearInterval(timer);
  }, [index, paused, reduceMotion, go]);

  const slide = slides[index];
  const wipe = clipPaths[index % clipPaths.length];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0f2f2f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 40) return;
        go(delta < 0 ? index + 1 : index - 1);
      }}
    >
      <div className="relative min-h-[78vh] md:min-h-[88vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 1, clipPath: wipe.initial }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, clipPath: wipe.animate }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.35 : 1.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/10" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 min-h-[78vh] md:min-h-[88vh] flex items-center">
          <div className="max-w-xl text-white py-20">
            <p className="text-[11px] tracking-[0.28em] uppercase font-semibold text-white/80 mb-5">
              BLEMOUT
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold leading-[1.05] tracking-tight text-white">
              {slide.headline}
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/90 leading-relaxed max-w-md font-medium">
              {slide.copy}
            </p>
            <div className="mt-8">
              <Link to={slide.cta.to}>
                <Button size="lg" className="bg-teal hover:bg-dark-teal">
                  {slide.cta.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 text-text flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 text-text flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-8 bg-teal' : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
