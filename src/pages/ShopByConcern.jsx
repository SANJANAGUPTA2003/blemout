import { Link } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';

const concerns = [
  {
    id: 'dark-neck',
    name: 'Dark Neck',
    description: 'Gentle cleanse and repair support for uneven tone on the neck.',
    image: '/products/repair-cream/2.jpg',
    to: '/shop/blemout-blemishes-repair-cream',
  },
  {
    id: 'underarms',
    name: 'Underarms',
    description: 'Targeted repair care with daily SPF protection for exposed areas.',
    image: '/products/sunscreen/2.jpg',
    to: '/shop/blemout-enviro-shield-sunscreen',
  },
  {
    id: 'elbows-knees',
    name: 'Elbows & Knees',
    description: 'Nourishing moisture and repair for rough, darker-looking patches.',
    image: '/products/moisturizer/2.jpg',
    to: '/shop/blemout-hydra-glow-water-creme',
  },
  {
    id: 'pigmentation',
    name: 'Pigmentation',
    description: 'Serum and repair formulas that support a more even appearance.',
    image: '/products/serum/2.jpg',
    to: '/shop/blemout-advanced-blemishes-repair-serum-30ml',
  },
  {
    id: 'blemishes',
    name: 'Blemish-Prone Skin',
    description: 'Start with a clarifying cleanse and build a complete routine.',
    image: '/products/facewash/2.jpg',
    to: '/shop/blemout-skin-glow-age-defying-facewash',
  },
  {
    id: 'routine',
    name: 'Full Routine',
    description: 'Prefer a curated kit? Explore limited picks and complete sets.',
    image: '/products/repair-cream/2.jpg',
    to: '/limited-picks',
  },
];

export default function ShopByConcern() {
  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-14 md:py-20">
        <FadeUp>
          <p className="text-[12px] tracking-[0.22em] uppercase text-teal font-bold mb-3">
            Shop by Concern
          </p>
          <h1 className="text-[34px] md:text-[48px] font-bold text-text tracking-tight">
            Find care by need
          </h1>
          <p className="mt-4 text-[16px] md:text-[17px] text-soft-text max-w-xl">
            Start with the concern that matters most, then explore the matching BLEMOUT formula or collection.
          </p>
        </FadeUp>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {concerns.map((concern, index) => (
            <FadeUp key={concern.id} delay={index * 0.04}>
              <Link to={concern.to} className="group block">
                <div className="aspect-square overflow-hidden bg-[#f5f8f7] relative p-6 flex items-center justify-center">
                  <img
                    src={concern.image}
                    alt={concern.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[12px] tracking-[0.18em] uppercase font-semibold">
                    See More
                  </span>
                </div>
                <h2 className="mt-4 text-[18px] md:text-[20px] font-semibold text-text group-hover:text-dark-teal transition-colors">
                  {concern.name}
                </h2>
                <p className="mt-2 text-[15px] text-soft-text leading-relaxed">{concern.description}</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
