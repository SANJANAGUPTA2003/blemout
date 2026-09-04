import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';
import SmartImage from '../ui/SmartImage';
import { HOMEPAGE_CONCERNS } from '../../data/homepageConfig';

export default function ShopByConcernHome() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <h2 className="section-heading">Shop by Concern</h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 md:gap-5">
          {HOMEPAGE_CONCERNS.map((concern) => (
            <Link
              key={concern.id}
              to={`/shop-by-concern/${concern.id}`}
              className="group min-w-0"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#f4f7f6]">
                <SmartImage
                  src={concern.image}
                  alt={concern.name}
                  role="card"
                  width={800}
                  height={800}
                  loading="lazy"
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 18vw"
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
