import { Link } from 'react-router-dom';
import {
  Droplet,
  FlaskConical,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Sun,
} from 'lucide-react';
import FadeUp from '../ui/FadeUp';
import Button from '../ui/Button';
import { getResponsiveImage } from '../../data/productImages';

const ICONS = {
  Droplet,
  FlaskConical,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Sun,
};

export default function EditorialStory({
  eyebrow,
  title,
  body,
  bullets = [],
  ingredients = [],
  howToUse,
  image,
  imageAlt,
  ctaTo,
  ctaLabel = 'Learn More',
  reverse = false,
}) {
  const responsiveImage = getResponsiveImage(image, 'main');

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10">
        <div
          className={`grid lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          <FadeUp>
            <div className="aspect-square overflow-hidden border-0 bg-transparent flex items-center justify-center">
              <picture className="block h-full w-full">
                {responsiveImage.srcSet && (
                  <source
                    type="image/webp"
                    srcSet={responsiveImage.srcSet}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <img
                  src={responsiveImage.src}
                  alt={imageAlt}
                  width="1200"
                  height="1200"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </picture>
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="max-w-lg lg:py-2">
              {eyebrow && (
                <p className="text-[12px] tracking-[0.16em] uppercase text-teal font-bold mb-4">
                  {eyebrow}
                </p>
              )}
              <h2 className="text-[34px] md:text-[42px] lg:text-[46px] font-bold text-[#222222] tracking-[-0.03em] leading-[1.12]">
                {title}
              </h2>
              <p className="mt-5 text-[16px] md:text-[17px] text-[#4a5560] leading-relaxed">{body}</p>
              {bullets.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {bullets.map((item) => (
                    <li key={item} className="text-[15px] text-[#26313D] flex gap-2">
                      <span className="text-teal mt-0.5 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {ingredients.length > 0 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ingredients.map((item) => {
                    const Icon = ICONS[item.icon] || Sparkles;
                    return (
                      <div key={item.name} className="flex gap-3 items-start">
                        <span className="w-9 h-9 rounded-full bg-[#f6f7f6] flex items-center justify-center shrink-0 text-teal">
                          <Icon size={18} strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#222222]">{item.name}</p>
                          <p className="mt-0.5 text-[13px] text-[#4a5560] leading-snug">{item.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {howToUse && (
                <p className="mt-6 text-[15px] text-[#4a5560] leading-relaxed">
                  <span className="font-semibold text-[#222222]">How to use: </span>
                  {howToUse}
                </p>
              )}
              {ctaTo && (
                <div className="mt-8">
                  <Link to={ctaTo}>
                    <Button>{ctaLabel}</Button>
                  </Link>
                </div>
              )}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
