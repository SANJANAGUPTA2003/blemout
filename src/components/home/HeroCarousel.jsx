import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HOMEPAGE_HERO_SLIDES } from '../../data/homepageConfig';

const INTERVAL_MS = 5000;
const TRANSITION_MS = 600;
const APPROACH_MS = 400;

/** Intrinsic size of the optimized landing banners (same 2.26:1 ratio as the originals). */
const HERO_WIDTH = 1024;
const HERO_HEIGHT = 453;

/** Full-bleed landing banners — the image is the section, with no letterbox frame. */
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set([0]));
  const indexRef = useRef(0);
  const count = HOMEPAGE_HERO_SLIDES.length;
  indexRef.current = index;

  const mark = (i) => {
    setLoaded((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  };

  const go = (dir) => {
    setIndex((i) => {
      const next = (i + dir + count) % count;
      mark(next);
      return next;
    });
  };

  useEffect(() => {
    if (count < 2) return undefined;

    const approach = window.setTimeout(() => {
      mark((indexRef.current + 1) % count);
    }, Math.max(0, INTERVAL_MS - APPROACH_MS));

    const id = window.setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % count;
        mark(next);
        return next;
      });
    }, INTERVAL_MS);

    return () => {
      window.clearTimeout(approach);
      window.clearInterval(id);
    };
  }, [count]);

  return (
    <section className="relative z-0 w-full min-w-0 max-w-full overflow-x-hidden bg-white">
      <div
        className="relative w-full min-w-0 max-w-full overflow-hidden"
        style={{ aspectRatio: `${HERO_WIDTH} / ${HERO_HEIGHT}` }}
      >
        {HOMEPAGE_HERO_SLIDES.map((hero, i) => (
          <Link
            key={hero.id}
            to={hero.to}
            aria-label={hero.alt}
            tabIndex={i === index ? 0 : -1}
            className="hero-slideshow-track absolute inset-0 block min-w-0 w-full max-w-full cursor-pointer overflow-hidden"
            style={{
              transform: `translate3d(${(i - index) * 100}%, 0, 0)`,
              transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
            }}
          >
            {loaded.has(i) ? (
              <img
                src={hero.image}
                alt={hero.alt}
                width={HERO_WIDTH}
                height={HERO_HEIGHT}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
                decoding="async"
                draggable={false}
                className="block h-full w-full max-w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full max-w-full"
                style={{ backgroundColor: hero.bg || '#ffffff' }}
                aria-hidden="true"
              />
            )}
          </Link>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous landing image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#222222] shadow-sm md:left-5 md:h-12 md:w-12"
            >
              <ChevronLeft size={22} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Next landing image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#222222] shadow-sm md:right-5 md:h-12 md:w-12"
            >
              <ChevronRight size={22} strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
