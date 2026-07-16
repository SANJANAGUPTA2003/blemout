import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/hero/blemout-sun-defence.png',
    alt: 'BLEMOUT Premium Skincare Collection',
    to: '/shop',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const hasMultipleSlides = slides.length > 1;

  const go = useCallback((next) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!hasMultipleSlides || paused || reduceMotion) return undefined;
    const timer = window.setInterval(() => go(index + 1), 5600);
    return () => window.clearInterval(timer);
  }, [index, paused, reduceMotion, go, hasMultipleSlides]);

  const slide = slides[index];

  const openShop = () => {
    navigate(slide.to);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  };

  return (
    <section
      className="relative aspect-[1004/453] h-auto w-full overflow-hidden border-0 bg-transparent"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        if (!hasMultipleSlides) return;
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (!hasMultipleSlides) return;
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 40) return;
        go(delta < 0 ? index + 1 : index - 1);
      }}
    >
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.button
            type="button"
            aria-label={`Shop ${slide.alt}`}
            onClick={openShop}
            key={slide.id}
            className="group absolute inset-0 block h-full w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: 'easeOut' }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              width="2008"
              height="906"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.005]"
            />
          </motion.button>
        </AnimatePresence>

        {hasMultipleSlides && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text transition-colors hover:bg-white md:left-6"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text transition-colors hover:bg-white md:right-6"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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
          </>
        )}
      </div>
    </section>
  );
}
