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
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10">
        <div
          className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          <FadeUp>
            <div className="aspect-square overflow-hidden bg-[#f7faf9] p-3 md:p-4 flex items-center justify-center">
              <img src={image} alt={imageAlt} className="w-full h-full object-contain" />
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="max-w-lg lg:py-4">
              {eyebrow && (
                <p className="text-[12px] tracking-[0.22em] uppercase text-teal font-bold mb-4">
                  {eyebrow}
                </p>
              )}
              <h2 className="text-[34px] md:text-[42px] font-bold text-text tracking-tight leading-tight">
                {title}
              </h2>
              <p className="mt-5 text-[16px] md:text-[17px] text-soft-text leading-relaxed">{body}</p>
              {bullets.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {bullets.map((item) => (
                    <li key={item} className="text-[15px] text-text flex gap-2">
                      <span className="text-teal mt-0.5 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {ingredients.length > 0 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ingredients.map((item) => {
                    const Icon = ICONS[item.icon] || Sparkles;
                    return (
                      <div
                        key={item.name}
                        className="flex gap-3 items-start p-3 bg-[#f7faf9] border border-transparent hover:border-teal/20 transition-colors"
                      >
                        <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-teal">
                          <Icon size={18} strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-text">{item.name}</p>
                          <p className="mt-0.5 text-[13px] text-soft-text leading-snug">{item.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {howToUse && (
                <p className="mt-6 text-[15px] text-soft-text leading-relaxed">
                  <span className="font-semibold text-text">How to use: </span>
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
