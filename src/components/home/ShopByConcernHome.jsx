import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';
import { HOMEPAGE_CONCERNS } from '../../data/homepageConfig';

export default function ShopByConcernHome() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        <FadeUp>
          <div className="mb-10 md:mb-14 text-center">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
              Targeted Care
            </p>
            <h2 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222] md:text-[44px] lg:text-[48px]">
              Shop by Concern
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-[#4a5560]">
              Face-focused concerns — start with what your skin needs most.
            </p>
          </div>
        </FadeUp>

        <div
          className="flex gap-6 overflow-x-auto pb-2 scrollbar-none md:gap-8 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {HOMEPAGE_CONCERNS.map((concern) => (
              <Link
                key={concern.id}
                to={`/shop-by-concern/${concern.id}`}
                className="group flex w-[42vw] max-w-[180px] shrink-0 flex-col items-center text-center sm:w-[160px] lg:w-auto lg:max-w-none"
              >
              <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[#f4f7f6]">
                <img
                  src={concern.image}
                  alt={concern.name}
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.06]"
                />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold leading-snug tracking-[-0.01em] text-[#222222] md:text-[15px] [@media(hover:hover)]:group-hover:text-dark-teal">
                {concern.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
