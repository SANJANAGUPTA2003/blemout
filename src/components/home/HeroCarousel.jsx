import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HOMEPAGE_HERO_SLIDES } from '../../data/homepageConfig';

const INTERVAL_MS = 5000;
const TRANSITION_MS = 600;

/** Two landing banners in an exact 16:9 frame with a horizontal autoplay slide. */
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const count = HOMEPAGE_HERO_SLIDES.length;

  const go = (dir) => {
    setIndex((i) => (i + dir + count) % count);
  };

  useEffect(() => {
    if (count < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count]);

  return (
    <section className="relative z-0 w-full overflow-hidden">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        <div
          className="hero-slideshow-track flex h-full w-full"
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
              className="relative h-full w-full min-w-full shrink-0 cursor-pointer overflow-hidden"
            >
              <img
                src={hero.image}
                alt={hero.alt}
                width={1920}
                height={1080}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                sizes="100vw"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
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
