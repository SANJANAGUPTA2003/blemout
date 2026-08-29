import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HOMEPAGE_HERO_SLIDES } from '../../data/homepageConfig';

/** Two landing banners in an exact 16:9 frame with a horizontal slide. */
export default function HeroCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const count = HOMEPAGE_HERO_SLIDES.length;

  const go = (dir) => {
    setIndex((i) => (i + dir + count) % count);
  };

  return (
    <section className="relative z-0 w-full overflow-hidden bg-black">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        <div
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {HOMEPAGE_HERO_SLIDES.map((hero, i) => (
            <button
              key={hero.id}
              type="button"
              aria-label={hero.alt}
              onClick={() => {
                navigate(hero.to);
                window.requestAnimationFrame(() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                });
              }}
              className="relative h-full w-full shrink-0 cursor-pointer overflow-hidden border-0 bg-transparent p-0"
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
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous landing image"
              onClick={(e) => {
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
