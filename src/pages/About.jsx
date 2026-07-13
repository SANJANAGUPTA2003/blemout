import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';

const sections = [
  {
    id: 'story',
    eyebrow: 'Our Story',
    title: 'Formulated for clearer-looking confidence',
    body: 'BLEMOUT was created for people seeking focused care for pigmentation, uneven tone, and blemish-prone areas — with formulas that feel calm, intentional, and everyday-ready.',
    image: '/products/facewash/2.jpg',
  },
  {
    id: 'formula',
    eyebrow: 'Our Formula',
    title: 'Actives chosen with purpose',
    body: 'From niacinamide and brightening antioxidants to targeted repair actives and daily SPF, each product is designed to play a clear role in a simple routine.',
    image: '/products/repair-cream/2.jpg',
    reverse: true,
  },
  {
    id: 'sustainability',
    eyebrow: 'Sustainability',
    title: 'Considered care, thoughtfully presented',
    body: 'We focus on practical packaging, clear ingredient communication, and formulas meant to earn a place in your routine — not clutter it.',
    image: '/products/moisturizer/2.jpg',
  },
];

export default function About() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-14 md:py-20">
        <FadeUp>
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center mb-16 md:mb-24">
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-teal font-semibold mb-3">About</p>
              <h1 className="text-3xl md:text-5xl font-semibold text-text tracking-tight leading-tight">
                BLEMOUT
              </h1>
              <p className="mt-5 text-soft-text text-lg leading-relaxed max-w-md">
                Dermatologically inspired blemish care — image-led, spacious, and built around real formulas.
              </p>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-4">
              <img src="/logo.png" alt="" className="h-24 w-24 md:h-28 md:w-28 object-contain" />
              <img src="/logo-wordmark.png" alt="BLEMOUT" className="h-12 md:h-14 w-auto object-contain" />
            </div>
          </div>
        </FadeUp>

        <div className="space-y-20 md:space-y-28">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <FadeUp>
                <div
                  className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                    section.reverse ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#f7faf9]">
                    <img src={section.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="max-w-lg">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-teal font-semibold mb-3">
                      {section.eyebrow}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-text tracking-tight">
                      {section.title}
                    </h2>
                    <p className="mt-5 text-soft-text leading-relaxed">{section.body}</p>
                  </div>
                </div>
              </FadeUp>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
