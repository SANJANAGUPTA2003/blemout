import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-mint-strong/30 mt-auto border-t border-mint-strong/50">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-1">
            <Logo variant="full" />
            <p className="mt-5 text-[13px] text-soft-text leading-relaxed font-normal">
              Dermatologically inspired formulas for pigmentation, uneven tone,
              and blemish-prone areas.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-soft-text mb-5 font-medium">Quick Links</h4>
            <ul className="space-y-3 text-[13px] text-soft-text">
              <li><Link to="/shop" className="hover:text-dark-teal transition-colors duration-300">Shop All</Link></li>
              <li><Link to="/#concerns" className="hover:text-dark-teal transition-colors duration-300">Shop By Concern</Link></li>
              <li><Link to="/#combos" className="hover:text-dark-teal transition-colors duration-300">Combos</Link></li>
              <li><Link to="/track-order" className="hover:text-dark-teal transition-colors duration-300">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-dark-teal transition-colors duration-300">Contact</Link></li>
              <li><Link to="/admin/login" className="hover:text-dark-teal transition-colors duration-300">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-soft-text mb-5 font-medium">Policies</h4>
            <ul className="space-y-3 text-[13px] text-soft-text">
              <li><a href="#" className="hover:text-teal transition-colors duration-300">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-teal transition-colors duration-300">Return & Refund</a></li>
              <li><a href="#" className="hover:text-teal transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-soft-text mb-5 font-medium">Contact</h4>
            <ul className="space-y-3 text-[13px] text-soft-text">
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-teal shrink-0" strokeWidth={1.5} />
                <span>hello@blemout.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-teal shrink-0" strokeWidth={1.5} />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100/80 text-center text-xs text-soft-text">
          © {new Date().getFullYear()} BLEMOUT. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
