import { Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, Headphones, Package, MessageCircle } from 'lucide-react';

const serviceItems = [
  { icon: Truck, label: 'Secure Shipping', text: 'Carefully packed orders across India' },
  { icon: RotateCcw, label: 'Easy Returns', text: 'Hassle-free support when you need it' },
  { icon: Shield, label: 'Trusted Formulas', text: 'Dermatologically inspired care' },
  { icon: Headphones, label: 'Support', text: 'Track order or contact our team' },
];

const actionBtn =
  'inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#f6f7f6] text-dark-teal text-sm font-semibold transition-all duration-300 hover:bg-dark-teal hover:text-white';

export default function ServiceStrip() {
  return (
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {serviceItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex gap-2.5 items-start">
                <Icon size={16} className="text-teal shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="text-[13px] font-semibold text-[#222222] leading-tight">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[12px] text-[#4a5560] leading-snug">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 md:mt-7 flex flex-wrap gap-3">
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
