import { Link } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import { CONCERNS } from '../data/storefrontConfig';

export default function ShopByConcern() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <FadeUp>
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.22em] text-teal">
            Shop by Concern
          </p>
          <h1 className="text-[34px] font-bold tracking-tight text-text md:text-[48px]">
            Face-focused care
          </h1>
          <p className="mt-4 max-w-xl text-[16px] text-soft-text md:text-[17px]">
            Start with the concern that matters most, then explore matching BLEMOUT formulas and
            combos.
          </p>
        </FadeUp>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 md:gap-8">
          {CONCERNS.map((concern, index) => (
            <FadeUp key={concern.id} delay={index * 0.04}>
              <Link to={`/shop-by-concern/${concern.id}`} className="group block text-center">
                <div className="mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-full bg-[#f4f7f6]">
                  <img
                    src={concern.image}
                    alt={concern.name}
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.05]"
                  />
                </div>
                <h2 className="mt-4 text-[15px] font-bold tracking-[-0.02em] text-[#222222] md:text-[16px] group-hover:text-dark-teal">
                  {concern.name}
                </h2>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
