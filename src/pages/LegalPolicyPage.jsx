import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const policyNav = [
  { id: 'shipping', label: 'Shipping', to: '/shipping-policy' },
  { id: 'returns', label: 'Returns', to: '/return-refund-policy' },
  { id: 'privacy', label: 'Privacy', to: '/privacy-policy' },
  { id: 'terms', label: 'Terms', to: '/terms-and-conditions' },
  { id: 'pricing', label: 'Pricing', to: '/terms-and-conditions#pricing' },
  { id: 'payments', label: 'Payments', to: '/terms-and-conditions#payments' },
  { id: 'cod', label: 'Cash on Delivery', to: '/terms-and-conditions#cash-on-delivery' },
];

function sectionAnchor(heading = '') {
  return heading
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
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
  const location = useLocation();
  const policy = POLICIES[policyKey] || POLICIES.shipping;

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash, policyKey]);

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
    <div className="w-full min-w-0 overflow-x-hidden bg-white">
      <PageMeta
        title={`${policy.title} | BLEMOUT`}
        description={policy.description}
        path={policy.path}
        schema={schema}
      />

      <header className="w-full bg-gradient-to-b from-[#f4fbfa] to-white px-4 pb-10 pt-12 sm:px-5 md:px-8 md:pb-16 md:pt-24 lg:px-10">
        <FadeUp>
          <div className="mx-auto w-full max-w-[1400px]">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
              Legal & Customer Care
            </p>
            <h1 className="max-w-4xl break-words text-[clamp(1.85rem,6vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.035em] text-[#222222]">
              {policy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-[#4a5560] sm:mt-6 sm:text-[18px] md:text-[19px]">
              {policy.intro}
            </p>
            <div className="mt-6 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#4a5560] shadow-[0_8px_30px_rgba(31,41,55,0.05)]">
              <CalendarDays size={16} className="text-teal" aria-hidden="true" />
              Last updated {POLICY_UPDATED}
            </div>
          </div>
        </FadeUp>
      </header>

      <div className="w-full min-w-0 px-4 pb-16 sm:px-5 md:px-8 md:pb-28 lg:px-10">
        <div className="mx-auto grid w-full min-w-0 max-w-[1400px] gap-8 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-16">
          <aside className="min-w-0 w-full lg:sticky lg:top-28 lg:h-fit">
            <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.14em] text-[#222222]">
              Policies
            </p>
            <nav
              className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap"
              aria-label="Policy categories"
            >
              {policyNav.map((item) => {
                const fragment = item.to.includes('#') ? item.to.split('#')[1] : '';
                const isActive = fragment
                  ? policyKey === 'terms' && location.hash === `#${fragment}`
                  : item.id === policyKey && (policyKey !== 'terms' || !location.hash);
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={`rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal sm:px-4 sm:py-3 sm:text-[15px] md:text-[16px] lg:w-full ${
                      isActive
                        ? 'bg-teal text-white'
                        : 'bg-[#f3f5f4] text-[#222222] hover:bg-[#e8eeec]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <article className="min-w-0 w-full">
            {policy.sections.map((section, index) => (
              <FadeUp key={section.heading} delay={Math.min(index * 0.03, 0.15)}>
                <section
                  id={sectionAnchor(section.heading)}
                  className="mb-5 scroll-mt-28 rounded-2xl bg-[#fafcfb] p-5 sm:rounded-3xl sm:p-7 md:mb-8 md:p-9"
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e7f7f4] text-dark-teal sm:h-12 sm:w-12">
                      {(() => {
                        const Icon = sectionIcons[section.icon] || FileText;
                        return <Icon size={22} strokeWidth={1.8} aria-hidden="true" />;
                      })()}
                    </span>
                    <h2 className="min-w-0 break-words pt-1 text-[clamp(1.2rem,4.2vw,1.85rem)] font-bold tracking-[-0.025em] text-[#222222]">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="mt-5 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="break-words text-[16px] leading-[1.8] text-[#4a5560] md:text-[18px]">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets?.length > 0 && (
                      <ul className="grid gap-3 pt-1 md:grid-cols-2">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex min-w-0 items-start gap-2.5 text-[15px] leading-relaxed text-[#36414c] sm:text-[16px]">
                            <Check size={17} className="mt-1 shrink-0 text-teal" aria-hidden="true" />
                            <span className="min-w-0 break-words">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </FadeUp>
            ))}

            <FadeUp>
              <section className="mt-8 overflow-hidden rounded-2xl bg-[#e8f7f5] p-5 sm:mt-10 sm:rounded-[2rem] sm:p-7 md:p-10">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-teal sm:h-12 sm:w-12">
                    <ShieldCheck size={25} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal">
                      Responsible skincare
                    </p>
                    <h2 className="mt-2 text-[clamp(1.35rem,4vw,2.125rem)] font-bold tracking-[-0.03em] text-[#222222]">
                      Our Brand Promise
                    </h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {brandPromise.map((paragraph) => (
                    <p key={paragraph} className="text-[15px] leading-[1.75] text-[#3f4d56]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </FadeUp>

            <FadeUp>
              <section className="mt-10 sm:mt-14">
                <div className="flex min-w-0 items-center gap-3">
                  <CircleHelp size={25} className="shrink-0 text-teal" aria-hidden="true" />
                  <h2 className="min-w-0 text-[clamp(1.35rem,4vw,2.125rem)] font-bold tracking-[-0.03em] text-[#222222]">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="mt-6 space-y-3">
                  {policy.faqs.map((faq) => (
                    <details key={faq.question} className="group rounded-2xl bg-[#fafcfb] p-4 open:bg-[#f4faf8] sm:p-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 sm:items-center sm:gap-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="min-w-0 text-[15px] font-semibold leading-snug text-[#222222] sm:text-[16px]">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          size={19}
                          className="mt-0.5 shrink-0 text-teal transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="mt-3 pr-0 text-[15px] leading-[1.75] text-[#4a5560] sm:pr-7">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </FadeUp>

            <FadeUp>
              <section className="mt-10 rounded-2xl bg-[#eef8f6] p-5 sm:mt-14 sm:rounded-3xl sm:p-6 md:p-8">
                <h2 className="text-[clamp(1.25rem,3.5vw,1.5rem)] font-bold tracking-[-0.02em] text-[#222222]">
                  Contact BLEMOUT
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4a5560]">
                  Questions about this policy or your order? Our customer-care team is here to help.
                </p>
                <div className="mt-5 space-y-4 text-[15px] text-[#4a5560]">
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="flex min-w-0 items-start gap-3 break-all transition-colors hover:text-dark-teal"
                  >
                    <Mail size={18} className="mt-0.5 shrink-0 text-teal" />
                    {BUSINESS.email}
                  </a>
                  <div className="flex min-w-0 items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-teal" />
                    <span className="min-w-0 leading-relaxed">{BUSINESS.address}</span>
                  </div>
                </div>
              </section>
            </FadeUp>
          </article>
        </div>
      </div>
    </div>
  );
}
