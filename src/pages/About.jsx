import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import PageMeta from '../components/seo/PageMeta';
import { BUSINESS } from '../data/business';

const FOUNDER_QUOTE =
  'True confidence starts with understanding and caring for your skin. We created Blemout® to empower you with effective, gentle solutions that celebrate your unique beauty. Love the skin you are in, nourish it, and let your inner radiance shine. Trust the journey, embrace the glow.';

const COFOUNDER_QUOTE =
  'At BLEMOUT, our goal is not to promise overnight transformation. It is to create skincare that is thoughtful, purposeful and transparent. From the ingredients we choose to the way we communicate with our customers, we want every decision to reflect responsibility, quality and care. We want people to understand what they are using, why they are using it and how it fits into a consistent skincare routine.';

const whyChoose = [
  {
    title: 'Thoughtful Formulation',
    copy: 'Products are developed around purposeful ingredient selection and clear product intent.',
  },
  {
    title: 'Transparency',
    copy: 'We aim to communicate clearly about what our products contain and how they are intended to be used.',
  },
  {
    title: 'Responsible Care',
    copy: 'We focus on responsible skincare rather than unrealistic overnight promises.',
  },
  {
    title: 'Quality Focus',
    copy: 'We prioritize consistency, formulation quality and thoughtful product development.',
  },
  {
    title: 'Continuous Learning',
    copy: 'We continue learning and refining our approach as formulation knowledge evolves.',
  },
];

const featuredIngredients = [
  'Niacinamide',
  'Alpha Arbutin',
  'Glutathione',
  'Tranexamic Acid',
  'Azelaic Acid',
  'Kojic Acid Dipalmitate',
  'Salicylic Acid',
  'Sodium Hyaluronate',
  'Green Tea Extract',
  'Licorice Root Extract',
];

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About BLEMOUT',
  description:
    'Meet BLEMOUT founders Raj Vilecha and Vinod Jindal, and learn our vision, mission and formulation approach since 2023.',
  mainEntity: {
    '@type': 'Organization',
    name: BUSINESS.name,
    email: BUSINESS.email,
    foundingDate: String(BUSINESS.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: '#166 B, HUDA R-2',
      addressLocality: 'Cheeka',
      addressRegion: 'Haryana',
      postalCode: '136034',
      addressCountry: 'IN',
    },
  },
};

function VoiceCard({ name, role, quote, image, alt, reverse = false }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={`overflow-hidden bg-[#f4f8f7] ${reverse ? 'lg:order-2' : ''}`}>
        <img
          src={image}
          alt={alt}
          width="1600"
          height="900"
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-contain"
        />
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-teal">{role}</p>
        <h2 className="mt-3 text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold tracking-[-0.03em] text-[#222222]">
          {name}
        </h2>
        <p className="mt-6 text-[17px] leading-[1.85] text-[#4a5560] md:text-[18px]">{quote}</p>
      </div>
    </article>
  );
}

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
      <PageMeta
        title="About BLEMOUT | Founder Voices, Vision and Care"
        description="Read BLEMOUT founder and co-founder perspectives, plus our vision, mission, values and science-led approach to everyday skincare."
        path="/about"
        schema={aboutSchema}
      />

      <section id="voices" className="scroll-mt-28 px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <div className="mx-auto max-w-[1400px] space-y-20 md:space-y-28">
          <FadeUp>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-[clamp(2.1rem,4.2vw,3.4rem)] font-bold tracking-[-0.04em] text-[#222222]">
                About BLEMOUT
              </h1>
            </div>
          </FadeUp>

          <FadeUp>
            <VoiceCard
              name="Raj Vilecha"
              role="Founder, BLEMOUT"
              quote={FOUNDER_QUOTE}
              image="/about/raj-vilecha.png"
              alt="Raj Vilecha, Founder of BLEMOUT"
            />
          </FadeUp>

          <FadeUp>
            <VoiceCard
              name="Vinod Jindal"
              role="Co-Founder, BLEMOUT"
              quote={COFOUNDER_QUOTE}
              image="/about/vinod-jindal.png"
              alt="Vinod Jindal, Co-Founder of BLEMOUT"
              reverse
            />
          </FadeUp>
        </div>
      </section>

      <section id="vision" className="scroll-mt-28 bg-[#f4fbf9] px-5 py-16 md:px-8 md:py-24 lg:px-10">
        <FadeUp>
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-bold tracking-[-0.035em] text-[#222222]">
                Our Vision
              </h2>
              <p className="mt-6 max-w-xl text-[18px] leading-[1.8] text-[#4a5560] md:text-[20px]">
                To make thoughtful skincare simpler, clearer and more trustworthy for everyday people.
              </p>
            </div>
            <div className="overflow-hidden bg-white p-6 md:p-10">
              <img
                src="/about/about-facewash.jpg"
                alt="BLEMOUT Skin Glow Facewash"
                width="1400"
                height="933"
                loading="lazy"
                decoding="async"
                className="h-auto max-h-[520px] w-full object-contain"
              />
            </div>
          </div>
        </FadeUp>
      </section>

      <section id="mission" className="scroll-mt-28 px-5 py-16 md:px-8 md:py-24 lg:px-10">
        <FadeUp>
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 overflow-hidden bg-[#f5f8f7] p-6 md:order-1 md:p-10">
              <img
                src="/about/about-repair-cream.jpg"
                alt="BLEMOUT Blemishes Repair Cream"
                width="1400"
                height="933"
                loading="lazy"
                decoding="async"
                className="h-auto max-h-[520px] w-full object-contain"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-bold tracking-[-0.035em] text-[#222222]">
                Our Mission
              </h2>
              <p className="mt-6 max-w-xl text-[18px] leading-[1.8] text-[#4a5560] md:text-[20px]">
                To create purposeful skincare with carefully selected ingredients, responsible
                formulation and transparent communication.
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      <section id="why" className="scroll-mt-28 bg-[#d4ebf3] px-5 py-16 md:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
              <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-bold tracking-[-0.035em] text-[#222222]">
                Why Choose BLEMOUT
              </h2>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {whyChoose.map((item, index) => (
              <FadeUp key={item.title} delay={index * 0.04}>
                <article className="h-full bg-[#b7dce8] p-6 md:p-7">
                  <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#2a6f8a]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 text-[18px] font-bold tracking-[-0.02em] text-[#222222]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#3f4d56]">{item.copy}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section id="science" className="scroll-mt-28 bg-[#f2fbf9] px-5 py-16 md:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
              <FlaskConical className="mx-auto mb-5 text-teal" size={28} strokeWidth={1.5} />
              <h2 className="text-[clamp(2rem,4vw,3.15rem)] font-bold tracking-[-0.035em] text-[#222222]">
                Science Behind the Care
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-[#4a5560] md:text-[18px]">
                Every BLEMOUT formula is built around purposeful ingredients and a consistent
                approach to everyday skin concerns. We highlight selected actives already used in
                our products so you can see what each formula is designed around.
              </p>
            </div>
          </FadeUp>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {featuredIngredients.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 bg-white px-4 py-3 text-[14px] font-bold text-[#222222] md:text-[15px]"
              >
                <Sparkles size={14} className="text-teal" strokeWidth={1.75} />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
