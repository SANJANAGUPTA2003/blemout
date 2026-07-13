import { Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, Headphones, Package, MessageCircle } from 'lucide-react';

const serviceItems = [
  { icon: Truck, label: 'Secure Shipping', text: 'Carefully packed orders across India' },
  { icon: RotateCcw, label: 'Easy Returns', text: 'Hassle-free support when you need it' },
  { icon: Shield, label: 'Trusted Formulas', text: 'Dermatologically inspired care' },
  { icon: Headphones, label: 'Support', text: 'Track order or contact our team' },
];

const actionBtn =
  'inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-teal text-dark-teal bg-white text-sm font-semibold transition-all duration-300 hover:bg-dark-teal hover:border-dark-teal hover:text-white';

export default function ServiceStrip() {
  return (
    <section className="border-t border-gray-100 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-5 md:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {serviceItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex gap-2 items-start">
                <Icon size={15} className="text-teal shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="text-[12px] md:text-[13px] font-semibold text-text leading-tight">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[11px] md:text-[12px] text-soft-text leading-snug">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 md:mt-6 flex flex-wrap gap-3">
          <Link to="/track-order" className={actionBtn}>
            <Package size={16} strokeWidth={1.75} />
            Track Your Order
          </Link>
          <Link to="/contact" className={actionBtn}>
            <MessageCircle size={16} strokeWidth={1.75} />
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
