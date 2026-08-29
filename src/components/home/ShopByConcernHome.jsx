import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';
import { HOMEPAGE_CONCERNS } from '../../data/homepageConfig';

export default function ShopByConcernHome() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <h2 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222] md:text-[44px] lg:text-[48px]">
              Shop by Concern
            </h2>
          </div>
        </FadeUp>

        <div
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-none md:gap-5 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {HOMEPAGE_CONCERNS.map((concern) => (
            <Link
              key={concern.id}
              to={`/shop-by-concern/${concern.id}`}
              className="group w-[46vw] max-w-[220px] shrink-0 lg:w-auto lg:max-w-none"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#f4f7f6]">
                <img
                  src={concern.image}
                  alt={concern.name}
                  width="800"
                  height="800"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
                />
              </div>
              <span className="sr-only">{concern.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
