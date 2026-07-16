import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import SectionHeading from '../components/ui/SectionHeading';
import { BUSINESS } from '../data/business';
import api from '../utils/api';

const infoSections = [
  {
    id: 'affiliate',
    title: 'Affiliate',
    body: 'Interested in partnering with BLEMOUT? Email us to learn about affiliate opportunities.',
    to: '/affiliate',
  },
  {
    id: 'faqs',
    title: 'FAQs',
    body: 'For order tracking, use your Order ID and checkout phone number on the Track Order page. For product questions, message us with your concern and skin type.',
    to: '/faq',
  },
  {
    id: 'shipping',
    title: 'Shipping Policy',
    body: 'Shiprocket orders are processed in 1–3 business days and usually arrive within 7–15 business days. Shipping is free on 3+ products.',
    to: '/shipping-policy',
  },
  {
    id: 'returns',
    title: 'Return & Refund Policy',
    body: 'Eligible unused and unopened products with their original seal intact may be returned within 7 days.',
    to: '/return-refund-policy',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body: 'Learn how we handle customer information and work with service providers such as Razorpay.',
    to: '/privacy-policy',
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    body: 'Review the terms that apply when using our website and placing an order.',
    to: '/terms-and-conditions',
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    body: 'We aim to keep BLEMOUT readable and usable across devices. If you encounter an accessibility barrier, email us and we will help.',
  },
];

export default function Contact() {
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeUp>
            <SectionHeading
              title="Contact Us"
              subtitle="Have a question? We'd love to hear from you."
            />
          </FadeUp>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FadeUp delay={0.1} className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 space-y-4">
                {success && (
                  <div className="bg-light-teal/50 text-dark-teal text-sm p-4 rounded-xl">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl">{error}</div>
                )}
                <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                </div>
                <Textarea label="Message" name="message" value={form.message} onChange={handleChange} required />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="space-y-4">
                <div className="bg-[#f7faf9] p-6">
                  <h3 className="font-bold text-text mb-4 text-[17px]">Get in Touch</h3>
                  <div className="space-y-4 text-[15px] text-soft-text">
                    <div className="flex items-start gap-3">
                      <Mail size={18} className="text-teal shrink-0 mt-0.5" />
                      <a href={`mailto:${BUSINESS.email}`} className="hover:text-dark-teal transition-colors">
                        {BUSINESS.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-teal shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {BUSINESS.addressLines.map((line) => (
                          <span key={line} className="block">{line}</span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center justify-center gap-2 bg-teal text-white rounded-2xl p-4 hover:bg-dark-teal transition-colors"
                >
                  <Mail size={20} />
                  <span className="font-semibold text-sm">Email Us</span>
                </a>
              </div>
            </FadeUp>
          </div>

          <div className="max-w-5xl mx-auto mt-16 md:mt-20 grid md:grid-cols-2 gap-8">
            {infoSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-lg font-bold text-text">
                  {section.to ? (
                    <Link to={section.to} className="hover:text-dark-teal transition-colors">
                      {section.title}
                    </Link>
                  ) : (
                    section.title
                  )}
                </h2>
                <p className="mt-2 text-[15px] text-soft-text leading-relaxed">{section.body}</p>
                {section.to && (
                  <Link
                    to={section.to}
                    className="mt-3 inline-flex text-[13px] font-semibold text-dark-teal hover:text-teal"
                  >
                    Read more →
                  </Link>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
