import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';

const items = [
  {
    image: '/products/facewash/lifestyle-01.jpg',
    label: 'Face Wash',
    to: '/shop/skin-glow-age-defying-facewash',
  },
  {
    image: '/products/serum/lifestyle-01.jpg',
    label: 'Serum',
    to: '/shop/advanced-blemishes-repair-serum',
  },
  {
    image: '/products/repair-cream/lifestyle-01.jpg',
    label: 'Repair Cream',
    to: '/shop/advanced-blemishes-repair-cream',
  },
  {
    image: '/products/moisturizer/lifestyle-01.jpg',
    label: 'Moisturizer',
    to: '/shop/hydra-glow-water-moist-creme',
  },
  {
    image: '/products/sunscreen/lifestyle-01.jpg',
    label: 'Sunscreen',
    to: '/shop/enviro-shield-sunscreen',
  },
  {
    image: '/products/facewash/lifestyle-02.jpg',
    label: 'Complete Routine',
    to: '/limited-picks',
  },
  {
    image: '/products/serum/lifestyle-02.jpg',
    label: 'New Arrivals',
    to: '/new',
  },
];

export default function DiscoveryGallery() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10">
        <FadeUp>
          <div className="mb-10 md:mb-14 max-w-xl">
            <p className="text-[11px] tracking-[0.22em] uppercase text-teal font-semibold mb-3">
              Discover
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text tracking-tight">
              Explore the collection
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((item, index) => (
            <FadeUp key={item.to + item.label} delay={index * 0.04}>
              <Link
                to={item.to}
                className={`group relative block overflow-hidden bg-[#f7faf9] ${
                  index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto md:min-h-[420px]' : 'aspect-square'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-400" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="text-white text-[12px] tracking-[0.2em] uppercase font-semibold">
                    See More
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
