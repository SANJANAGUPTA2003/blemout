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
      className="relative z-10 inline-block text-soft-text hover:text-dark-teal transition-colors duration-300 cursor-pointer"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-20 bg-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10">
          <div className="lg:col-span-2">
            <Logo variant="footer" />
            <p className="mt-5 text-[16px] text-soft-text leading-relaxed max-w-sm md:text-[17px]">
              Since {BUSINESS.foundedYear}, dermatologically inspired formulas for
              pigmentation, uneven tone, and blemish-prone areas.
            </p>
            <ul className="mt-6 space-y-3 text-[15px] text-soft-text md:text-[16px]">
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-teal shrink-0 mt-0.5" strokeWidth={1.75} />
                <a href={`mailto:${BUSINESS.email}`} className="relative z-10 hover:text-dark-teal transition-colors">
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-teal shrink-0 mt-0.5" strokeWidth={1.75} />
                <span className="leading-relaxed">
                  {BUSINESS.addressLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[16px] tracking-[0.16em] uppercase text-text mb-5 font-bold">About</h4>
            <ul className="space-y-3 text-[16px]">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[16px] tracking-[0.16em] uppercase text-text mb-5 font-bold">Customer Service</h4>
            <ul className="space-y-3 text-[16px]">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[16px] tracking-[0.16em] uppercase text-text mb-5 font-bold">Policies</h4>
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

        <div className="mt-14 pt-8 text-center text-sm text-[#4a5560]">
          © {new Date().getFullYear()} BLEMOUT. Since {BUSINESS.foundedYear}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
