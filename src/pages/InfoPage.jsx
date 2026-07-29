import { Link } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import { BUSINESS } from '../data/business';

const PAGES = {
  affiliate: {
    title: 'Affiliate',
    body: [
      'Partner with BLEMOUT and share dermatologically inspired blemish care with your audience.',
      `Email ${BUSINESS.email} with “Affiliate” in the subject line to learn about collaboration opportunities.`,
    ],
  },
  faq: {
    title: 'FAQs',
    body: [
      'Track your order using your Order ID and the phone number used at checkout on the Track Order page.',
      'For product questions, email us with your concern and skin type. For returns, unopened products may be eligible within 7 days of delivery.',
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    body: [
      'Orders are typically prepared within 3–5 business days. Delivery timelines vary by location across India.',
      'You will receive a secure Order ID after checkout that you can use to track your package.',
    ],
  },
  returns: {
    title: 'Return Policy',
    body: [
      'Unopened products may be returned within 7 days of delivery.',
      `Contact ${BUSINESS.email} with your Order ID to begin a return request.`,
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We use your contact and shipping details only to fulfill orders and respond to support requests.',
      'Public order tracking never exposes full phone numbers, email addresses, or complete delivery addresses.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      'By placing an order you agree to our checkout terms, product usage guidance, and support policies.',
      'Please review product usage and precautions on each product page before purchase.',
    ],
  },
};

export default function InfoPage({ pageKey }) {
  const page = PAGES[pageKey] || PAGES.faq;

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <FadeUp>
          <p className="text-[12px] tracking-[0.2em] uppercase text-teal font-bold mb-3">BLEMOUT</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text tracking-tight">{page.title}</h1>
          <div className="mt-6 space-y-4">
            {page.body.map((paragraph) => (
              <p key={paragraph} className="text-[16px] text-soft-text leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
            <Link to="/contact" className="text-dark-teal hover:text-teal transition-colors">
              Contact Us
            </Link>
            <Link to="/track-order" className="text-dark-teal hover:text-teal transition-colors">
              Track Order
            </Link>
            <Link to="/shop" className="text-dark-teal hover:text-teal transition-colors">
              Shop
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
