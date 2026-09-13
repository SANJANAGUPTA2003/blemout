import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HOMEPAGE_HERO_SLIDES } from '../../data/homepageConfig';

const INTERVAL_MS = 5000;
const TRANSITION_MS = 600;

/** Intrinsic size of both original landing JPEGs in /public/hero (measured 3840×1700). */
const HERO_WIDTH = 3840;
const HERO_HEIGHT = 1700;

/** Full-bleed landing banners — the image is the section, with no letterbox frame. */
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set([0]));
  const count = HOMEPAGE_HERO_SLIDES.length;

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
      mark((next + 1) % count);
      return next;
    });
  };

  useEffect(() => {
    if (count < 2) return undefined;
    const warm = window.setTimeout(() => mark(1), 700);
    const id = window.setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % count;
        mark(next);
        mark((next + 1) % count);
        return next;
      });
    }, INTERVAL_MS);
    return () => {
      window.clearTimeout(warm);
      window.clearInterval(id);
    };
  }, [count]);

  return (
    <section className="relative z-0 w-full overflow-hidden bg-white">
      <div className="relative w-full overflow-hidden">
        <div
          className="hero-slideshow-track flex w-full"
          style={{
            transform: `translate3d(-${index * 100}%, 0, 0)`,
            transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
          }}
        >
          {HOMEPAGE_HERO_SLIDES.map((hero, i) => (
            <Link
              key={hero.id}
              to={hero.to}
              aria-label={hero.alt}
              tabIndex={i === index ? 0 : -1}
              className="relative block w-full min-w-full shrink-0 cursor-pointer overflow-hidden"
            >
              {loaded.has(i) ? (
                <img
                  src={hero.image}
                  alt={hero.alt}
                  width={HERO_WIDTH}
                  height={HERO_HEIGHT}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding={i === 0 ? 'sync' : 'async'}
                  draggable={false}
                  className="block h-auto w-full max-w-full"
                />
              ) : (
                <div
                  className="w-full bg-white"
                  style={{ aspectRatio: `${HERO_WIDTH} / ${HERO_HEIGHT}` }}
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </div>

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
