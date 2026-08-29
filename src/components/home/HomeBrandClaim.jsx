import FadeUp from '../ui/FadeUp';

export default function HomeBrandClaim() {
  return (
    <section className="bg-white px-5 py-12 md:px-8 md:py-16 lg:px-10">
      <FadeUp>
        <div className="mx-auto max-w-[1520px] overflow-hidden">
          <img
            src="/about/blemout-claims.png"
            alt="BLEMOUT responsible formulation promise"
            width="1600"
            height="600"
            loading="lazy"
            decoding="async"
            className="h-auto w-full object-contain"
          />
        </div>
      </FadeUp>
    </section>
  );
}
