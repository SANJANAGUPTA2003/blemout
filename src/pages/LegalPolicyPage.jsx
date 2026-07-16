import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  BadgeIndianRupee,
  Banknote,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  CircleX,
  Clock3,
  CloudLightning,
  Cookie,
  Copyright,
  CreditCard,
  Database,
  FileText,
  FlaskConical,
  Landmark,
  ListChecks,
  LockKeyhole,
  Mail,
  MapPin,
  MapPinned,
  MessagesSquare,
  PackageCheck,
  PackageX,
  RefreshCw,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Truck,
  UserRoundCheck,
  WalletCards,
} from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import PageMeta from '../components/seo/PageMeta';
import { BUSINESS } from '../data/business';
import { POLICIES, POLICY_UPDATED } from '../data/policies';

const policyOrder = ['shipping', 'returns', 'privacy', 'terms'];
const sectionIcons = {
  BadgeCheck,
  BadgeIndianRupee,
  Banknote,
  CircleX,
  Clock3,
  CloudLightning,
  Cookie,
  Copyright,
  CreditCard,
  Database,
  FileText,
  FlaskConical,
  Landmark,
  ListChecks,
  LockKeyhole,
  MapPinned,
  MessagesSquare,
  PackageCheck,
  PackageX,
  RefreshCw,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Truck,
  UserRoundCheck,
  WalletCards,
};

const brandPromise = [
  'BLEMOUT products are thoughtfully formulated without steroid-based ingredients and without unnecessary harsh chemicals.',
  'Our formulations focus on responsible, science-backed skincare designed to support healthy-looking skin while respecting your skin barrier.',
  'Skincare results naturally vary from person to person depending on skin type, lifestyle, consistency of use and individual concerns.',
  'Therefore, while our products are created with carefully selected ingredients and high quality standards, we do not guarantee identical results for every individual.',
];

export default function LegalPolicyPage({ policyKey }) {
  const policy = POLICIES[policyKey] || POLICIES.shipping;
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'FAQPage'],
    name: policy.title,
    description: policy.description,
    dateModified: '2026-07-16',
    publisher: {
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
    mainEntity: policy.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-white">
      <PageMeta
        title={`${policy.title} | BLEMOUT`}
        description={policy.description}
        path={policy.path}
        schema={schema}
      />

      <header className="bg-gradient-to-b from-[#f4fbfa] to-white px-5 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
        <FadeUp>
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
              Legal & Customer Care
            </p>
            <h1 className="max-w-3xl text-[38px] font-bold leading-[1.08] tracking-[-0.035em] text-[#222222] md:text-[56px]">
              {policy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#4a5560] md:text-[18px]">
              {policy.intro}
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#4a5560] shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
              <CalendarDays size={16} className="text-teal" aria-hidden="true" />
              Last updated {POLICY_UPDATED}
            </div>
          </div>
        </FadeUp>
      </header>

      <main className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[190px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[#222222]">
              Policies
            </p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-2">
              {policyOrder.map((key) => {
                const item = POLICIES[key];
                return (
                  <Link
                    key={key}
                    to={item.path}
                    className={`text-[14px] font-medium transition-colors ${
                      key === policyKey ? 'text-teal' : 'text-[#4a5560] hover:text-dark-teal'
                    }`}
                  >
                    {item.shortTitle}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <article className="min-w-0">
            {policy.sections.map((section, index) => (
              <FadeUp key={section.heading} delay={Math.min(index * 0.03, 0.15)}>
                <section className="mb-5 scroll-mt-28 rounded-3xl bg-[#fafcfb] p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7f7f4] text-dark-teal">
                      {(() => {
                        const Icon = sectionIcons[section.icon] || FileText;
                        return <Icon size={21} strokeWidth={1.8} aria-hidden="true" />;
                      })()}
                    </span>
                    <h2 className="pt-1.5 text-[23px] font-bold tracking-[-0.025em] text-[#222222] md:text-[27px]">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-[16px] leading-[1.8] text-[#4a5560]">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets?.length > 0 && (
                      <ul className="grid gap-3 pt-1 sm:grid-cols-2">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#36414c]">
                            <Check size={17} className="mt-1 shrink-0 text-teal" aria-hidden="true" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </FadeUp>
            ))}

            <FadeUp>
              <section className="mt-10 overflow-hidden rounded-[2rem] bg-[#123f3d] p-7 text-white md:p-10">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#74d9cc]">
                    <ShieldCheck size={25} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74d9cc]">
                      Responsible skincare
                    </p>
                    <h2 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-white md:text-[34px]">
                      Our Brand Promise
                    </h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {brandPromise.map((paragraph) => (
                    <p key={paragraph} className="text-[15px] leading-[1.75] text-white/82">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </FadeUp>

            <FadeUp>
              <section className="mt-14">
                <div className="flex items-center gap-3">
                  <CircleHelp size={25} className="text-teal" aria-hidden="true" />
                  <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[#222222] md:text-[34px]">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="mt-6 space-y-3">
                  {policy.faqs.map((faq) => (
                    <details key={faq.question} className="group rounded-2xl bg-[#fafcfb] p-5 open:bg-[#f4faf8]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <h3 className="text-[16px] font-semibold leading-snug text-[#222222]">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          size={19}
                          className="shrink-0 text-teal transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="mt-3 pr-7 text-[15px] leading-[1.75] text-[#4a5560]">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </FadeUp>

            <FadeUp>
              <section className="mt-14 rounded-3xl bg-[#eef8f6] p-6 md:p-8">
                <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#222222]">
                  Contact BLEMOUT
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4a5560]">
                  Questions about this policy or your order? Our customer-care team is here to help.
                </p>
                <div className="mt-5 space-y-4 text-[15px] text-[#4a5560]">
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-start gap-3 transition-colors hover:text-dark-teal"
                >
                  <Mail size={18} className="mt-0.5 shrink-0 text-teal" />
                  {BUSINESS.email}
                </a>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-teal" />
                    <span>
                      {BUSINESS.addressLines.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                    </span>
                </div>
              </div>
              </section>
            </FadeUp>
          </article>
        </div>
      </main>
    </div>
  );
}
