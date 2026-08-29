import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { BUSINESS } from '../data/business';
import api from '../utils/api';

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
      <div className="px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <FadeUp>
            <h1 className="text-center text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[#222222]">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-center text-[17px] leading-relaxed text-[#4a5560]">
              For customer support, email {BUSINESS.email}.
            </p>
          </FadeUp>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <FadeUp>
              <form onSubmit={handleSubmit} className="space-y-4">
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

            <FadeUp delay={0.08}>
              <div className="space-y-4">
                <p className="text-[15px] leading-relaxed text-[#4a5560]">{BUSINESS.address}</p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center justify-center gap-2 bg-teal px-5 py-4 text-white transition-colors hover:bg-dark-teal"
                >
                  <Mail size={18} />
                  <span className="text-[14px] font-semibold uppercase tracking-[0.08em]">Email Us</span>
                </a>
                <p className="text-[14px] leading-relaxed text-[#6b7280]">
                  For affiliation or collaboration, email us with a short note about the partnership.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
