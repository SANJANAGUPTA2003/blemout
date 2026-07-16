import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BadgeCheck,
  Eye,
  FlaskConical,
  Heart,
  HeartPulse,
  Leaf,
  Microscope,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import PageMeta from '../components/seo/PageMeta';
import { BUSINESS } from '../data/business';

const founderStories = [
  {
    image: '/about/blemout-repair-cream-editorial.png',
    alt: 'BLEMOUT advanced blemish repair cream displayed in a teal clinical studio',
    chapters: [
      {
        id: 'story',
        title: 'Why BLEMOUT Began',
        paragraphs: [
          'I began this journey with a simple belief: skincare should heal, not harm; care, not compromise. In a world overflowing with quick fixes and harsh formulations, I felt a deep responsibility to create products that respect the skin, the body and the human being behind every face.',
          'Our skin is not a trend. It is a living, breathing part of us — carrying our stories, our stress, our joy and our resilience. Since 2023, BLEMOUT has honoured that truth with skincare that sees the person, not only the concern.',
        ],
      },
      {
        id: 'promise',
        title: 'Our Promise',
        paragraphs: [
          'Every product we create is guided by one non-negotiable promise: effective care without unnecessary side effects. We choose ingredients thoughtfully, formulate responsibly and test with patience — never shortcuts.',
          'True results should never come at the cost of long-term health. If something is not safe, not needed or not aligned with our values, it does not belong in our products, no matter how popular it may be.',
        ],
      },
    ],
  },
  {
    image: '/about/blemout-sunscreen-editorial.png',
    alt: 'BLEMOUT SPF 50 sunscreen presented in a warm golden studio setting',
    reverse: true,
    chapters: [
      {
        id: 'sustainability',
        title: 'Beauty With Responsibility',
        paragraphs: [
          'Our purpose goes beyond beauty. We believe skincare is an act of self-respect and humanity — a choice that can support confidence, dignity and well-being. When a brand chooses honesty, safety and transparency, it contributes, however quietly, to a kinder world.',
          'We are committed to science-backed formulations, ethical practices and conscious choices that honour your body, protect your future and reflect compassion for people and the planet.',
        ],
      },
      {
        id: 'looking-ahead',
        title: 'Looking Ahead',
        paragraphs: [
          'Continuous learning is part of our responsibility. We will keep listening, researching and improving so that every decision remains grounded in safety, purpose and respect for long-term well-being.',
          'Thank you for trusting us with your skin. That trust is never taken lightly. We promise to treat it with honesty, patience and care — today, and always.',
        ],
      },
    ],
  },
];

const philosophyItems = [
  {
    icon: FlaskConical,
    title: 'Science-backed formulations',
    copy: 'Formulation decisions guided by ingredient knowledge and purposeful product design.',
  },
  {
    icon: Leaf,
    title: 'Thoughtfully selected ingredients',
    copy: 'Every ingredient is considered for its role, compatibility and place in the complete formula.',
  },
  {
    icon: HeartPulse,
    title: 'Ethical skincare',
    copy: 'Care built around responsibility, respect and choices we can stand behind.',
  },
  {
    icon: Eye,
    title: 'Transparent formulation',
    copy: 'Clear product information without fear-based language or unrealistic promises.',
  },
  {
    icon: Microscope,
    title: 'Continuous research',
    copy: 'An ongoing commitment to learning, evaluating and improving our approach.',
  },
  {
    icon: Search,
    title: 'Long-term skin health',
    copy: 'Routines designed around consistency and healthy-looking skin over quick fixes.',
  },
];

const values = [
  { icon: Eye, title: 'Transparency', copy: 'Clear information and honest expectations.' },
  { icon: ShieldCheck, title: 'Safety', copy: 'Responsible choices made with care.' },
  { icon: BadgeCheck, title: 'Quality', copy: 'Purposeful products and considered details.' },
  { icon: Heart, title: 'Care', copy: 'Respect for your skin guides every decision.' },
];

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About BLEMOUT',
  description:
    'Learn about BLEMOUT’s founder story since 2023, responsible skincare philosophy, steroid-free promise and commitment to transparent formulations.',
  mainEntity: {
    '@type': 'Organization',
    name: BUSINESS.name,
    email: BUSINESS.email,
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
        title="About BLEMOUT | Care That Respects Your Skin"
        description="Discover BLEMOUT’s founder story since 2023, skincare philosophy, steroid-free promise and commitment to responsible, transparent care."
        path="/about"
        schema={aboutSchema}
      />

      <section className="px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <FadeUp>
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div>
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
                Our Story · Since {BUSINESS.foundedYear}
              </p>
              <h1 className="max-w-xl text-[42px] font-bold leading-[1.05] tracking-[-0.04em] text-[#222222] md:text-[60px] lg:text-[68px]">
                Care That Respects Your Skin.
              </h1>
              <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-[#4a5560] md:text-[20px]">
                Science-backed skincare created with honesty, responsibility and care —
                trusted since {BUSINESS.foundedYear}.
              </p>
            </div>
            <div className="aspect-[3/2] overflow-hidden bg-[#f5f8f7]">
              <picture>
                <source srcSet="/about/blemout-facewash-editorial.webp" type="image/webp" />
                <img
                  src="/about/blemout-facewash-editorial.png"
                  alt="BLEMOUT acne facewash surrounded by water and glass in a clinical studio"
                  width="1400"
                  height="933"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center"
                />
              </picture>
            </div>
          </div>
        </FadeUp>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-14 max-w-2xl md:mb-20">
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
                A Note From Our Founder
              </p>
              <h2 className="text-[36px] font-bold leading-[1.1] tracking-[-0.035em] text-[#222222] md:text-[50px]">
                Built with intention, not shortcuts.
              </h2>
            </div>
          </FadeUp>

          <div className="space-y-20 md:space-y-28">
            {founderStories.map((story) => (
              <section key={story.image}>
                <FadeUp>
                  <div
                    className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                      story.reverse ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-[#f6f7f6]">
                      <picture>
                        <source srcSet={story.image.replace(/\.png$/, '.webp')} type="image/webp" />
                        <img
                          src={story.image}
                          alt={story.alt}
                          width="1120"
                          height="1400"
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-center"
                        />
                      </picture>
                    </div>
                    <div className="max-w-lg space-y-12">
                      {story.chapters.map((chapter) => (
                        <article key={chapter.id} id={chapter.id} className="scroll-mt-28">
                          <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
                            Founder Story
                          </p>
                          <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222] md:text-[42px]">
                            {chapter.title}
                          </h2>
                          <div className="mt-6 space-y-4">
                            {chapter.paragraphs.map((paragraph) => (
                              <p
                                key={paragraph}
                                className="text-[16px] leading-[1.8] text-[#4a5560] md:text-[17px]"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section id="philosophy" className="scroll-mt-28 bg-[#f7fbfa] px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Sparkles className="mx-auto mb-5 text-teal" size={26} strokeWidth={1.5} />
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
                What Guides Us
              </p>
              <h2 className="text-[36px] font-bold tracking-[-0.035em] text-[#222222] md:text-[50px]">
                Our Philosophy
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-[#4a5560]">
                Thoughtful skincare begins with clear choices and continues with a commitment to learn.
              </p>
            </div>
          </FadeUp>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {philosophyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.title} delay={index * 0.035}>
                  <article className="h-full bg-white p-7 md:p-8">
                    <Icon className="text-teal" size={24} strokeWidth={1.5} />
                    <h3 className="mt-6 text-[19px] font-bold tracking-[-0.02em] text-[#222222]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#4a5560]">
                      {item.copy}
                    </p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section id="steroid-free" className="scroll-mt-28 px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <FadeUp>
          <div className="mx-auto grid max-w-5xl items-center gap-8 bg-[#eaf7f5] p-8 md:grid-cols-[auto_1fr] md:gap-10 md:p-14">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-teal">
              <ShieldCheck size={30} strokeWidth={1.5} />
            </div>
            <div>
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-dark-teal">
                Our Responsible Formulation Promise
              </p>
              <h2 className="text-[32px] font-bold tracking-[-0.03em] text-[#222222] md:text-[44px]">
                Formulated Without Steroids
              </h2>
              <p className="mt-5 max-w-3xl text-[16px] leading-[1.8] text-[#3f4d56] md:text-[17px]">
                Our formulations are created without steroid-based ingredients and focus on responsible
                skincare that supports healthy-looking skin without unnecessary harsh ingredients.
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      <section id="values" className="scroll-mt-28 px-5 pb-24 md:px-8 md:pb-32 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-12">
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
                The BLEMOUT Standard
              </p>
              <h2 className="text-[36px] font-bold tracking-[-0.035em] text-[#222222] md:text-[50px]">
                Our Values
              </h2>
            </div>
          </FadeUp>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <FadeUp key={value.title} delay={index * 0.04}>
                  <article>
                    <Icon className="text-teal" size={23} strokeWidth={1.5} />
                    <h3 className="mt-5 text-[20px] font-bold text-[#222222]">{value.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#4a5560]">{value.copy}</p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
