import { useNavigate } from 'react-router-dom';

const HERO = {
  image: '/hero/blemout-landing-hero.png',
  alt: 'BLEMOUT Advanced Sun Defence everyday — SPF 50+ moisturiser radiance',
  to: '/shop/blemout-enviro-shield-sunscreen',
  width: 1024,
  height: 453,
};

/** Single full-width homepage hero — native banner aspect, no crop or stretch. */
export default function HeroCarousel() {
  const navigate = useNavigate();

  const openShop = () => {
    navigate(HERO.to);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  };

  return (
    <section className="relative z-0 w-full overflow-hidden bg-[#8ec8ef]">
      <button
        type="button"
        aria-label="Shop BLEMOUT Advanced Sun Defence"
        onClick={openShop}
        className="group relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left"
      >
        <img
          src={HERO.image}
          alt={HERO.alt}
          width={HERO.width}
          height={HERO.height}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          sizes="100vw"
          className="block h-auto w-full max-w-none object-contain object-center"
          style={{ imageRendering: 'auto' }}
        />
      </button>
    </section>
  );
}
