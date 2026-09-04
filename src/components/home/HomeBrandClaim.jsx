import FadeUp from '../ui/FadeUp';
import SmartImage from '../ui/SmartImage';

export default function HomeBrandClaim() {
  return (
    <section className="bg-white px-5 py-12 md:px-8 md:py-16 lg:px-10">
      <FadeUp>
        <div className="mx-auto max-w-[1520px] overflow-hidden">
          <SmartImage
            src="/about/blemout-claims.png"
            alt="BLEMOUT responsible formulation promise"
            role="banner"
            width={1600}
            height={600}
            loading="lazy"
            sizes="100vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </FadeUp>
    </section>
  );
}
