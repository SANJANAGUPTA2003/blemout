import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import Logo from '../ui/Logo';
import { BUSINESS } from '../../data/business';

const aboutLinks = [
  { label: 'Our Story', to: '/about#story' },
  { label: 'Our Philosophy', to: '/about#philosophy' },
  { label: 'Sustainability', to: '/about#sustainability' },
];

const serviceLinks = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Affiliate', to: '/affiliate' },
  { label: 'FAQs', to: '/faq' },
];

const policyLinks = [
  { label: 'Shipping Policy', to: '/shipping-policy' },
  { label: 'Return & Refund Policy', to: '/return-refund-policy' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
];

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative z-10 inline-block text-[#3d4a52] hover:text-dark-teal transition-colors duration-300 cursor-pointer"
    >
      {children}
    </Link>
  );
}

/** Premium light mint footer — Korean skincare inspired. */
export default function Footer() {
  return (
    <footer className="relative z-20 mt-auto border-t border-[#d7ebe8]/70 bg-[#F2FBFA]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2">
            <Logo variant="footer" />
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-[#3d4a52] md:text-[17px]">
              Since {BUSINESS.foundedYear}, dermatologically inspired formulas for
              pigmentation, uneven tone, and blemish-prone areas.
            </p>
            <ul className="mt-6 space-y-3 text-[15px] text-[#3d4a52] md:text-[16px]">
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-teal" strokeWidth={1.75} />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="relative z-10 transition-colors hover:text-dark-teal"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-teal" strokeWidth={1.75} />
                <span className="leading-relaxed">
                  {BUSINESS.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[16px] font-bold uppercase tracking-[0.16em] text-[#1f2a30]">
              About
            </h4>
            <ul className="space-y-3 text-[16px]">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[16px] font-bold uppercase tracking-[0.16em] text-[#1f2a30]">
              Customer Service
            </h4>
            <ul className="space-y-3 text-[16px]">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[16px] font-bold uppercase tracking-[0.16em] text-[#1f2a30]">
              Policies
            </h4>
            <ul className="space-y-3 text-[16px]">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink to="/admin/login">Admin</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[#d7ebe8]/80 pt-8 text-center text-[14px] text-[#4a5560]">
          © {new Date().getFullYear()} BLEMOUT. Since {BUSINESS.foundedYear}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
