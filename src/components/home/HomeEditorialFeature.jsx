import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';
import Button from '../ui/Button';
import { productPath } from '../../data/productImages';

/**
 * Homepage editorial campaign block.
 * Content comes from existing MongoDB product fields via props.
 */
export default function HomeEditorialFeature({
  product,
  promotionalImage,
  imagePosition = 'left',
  eyebrow,
}) {
  if (!product || !promotionalImage) return null;

  const reverse = imagePosition === 'right';
  const summary = product.summary || product.description || '';
  const path = productPath(product);

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        <div
          className={`grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14 xl:gap-20 ${
            reverse ? 'md:[&>*:first-child]:order-2' : ''
          }`}
        >
          <FadeUp>
            <img
              src={promotionalImage}
              alt={product.name}
              width="1400"
              height="933"
              loading="lazy"
              decoding="async"
              className="h-auto w-full max-w-full object-contain"
            />
          </FadeUp>

          <FadeUp delay={0.08}>
            <div className="max-w-lg lg:py-2">
              {eyebrow && (
                <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
                  {eyebrow}
                </p>
              )}
              <h2 className="text-[clamp(1.7rem,3.2vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-[#222222]">
                {product.name}
              </h2>
              {summary && (
                <p className="mt-5 text-[16px] leading-relaxed text-[#4a5560] md:text-[17px]">
                  {summary}
                </p>
              )}
              <div className="mt-8">
                <Link to={path} className="block w-full sm:inline-block sm:w-auto">
                  <Button className="w-full sm:w-auto">Shop Now</Button>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
