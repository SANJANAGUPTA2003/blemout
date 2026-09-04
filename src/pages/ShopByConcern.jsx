import { Link } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import SmartImage from '../components/ui/SmartImage';
import { CONCERNS } from '../data/storefrontConfig';

export default function ShopByConcern() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-teal">
              Shop by Concern
            </p>
            <h1 className="mt-2 text-[34px] font-bold tracking-tight text-text md:text-[48px]">
              Face-focused care
            </h1>
            <p className="mt-2 text-[16px] text-soft-text md:text-[17px]">
              Start with the concern that matters most, then explore matching BLEMOUT formulas and
              combos.
            </p>
          </div>
        </FadeUp>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 md:gap-6">
          {CONCERNS.map((concern, index) => (
            <FadeUp key={concern.id} delay={index * 0.04}>
              <Link to={`/shop-by-concern/${concern.id}`} className="group block">
                <div className="aspect-square w-full overflow-hidden bg-[#f4f7f6]">
                  <SmartImage
                    src={concern.image}
                    alt={concern.name}
                    role="card"
                    width={800}
                    height={800}
                    loading="lazy"
                    sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 18vw"
                    className="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.03]"
                  />
                </div>
                <span className="sr-only">{concern.name}</span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
