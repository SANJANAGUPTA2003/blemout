import { useState } from 'react';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import SectionHeading from '../components/ui/SectionHeading';
import api from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
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
              <div className="bg-ivory rounded-2xl p-6">
                <h3 className="font-semibold text-text mb-4">Get in Touch</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-teal shrink-0" />
                    <span>hello@blemout.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-teal shrink-0" />
                    <span>+91 98765 43210</span>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-teal text-white rounded-2xl p-4 hover:bg-dark-teal transition-colors"
              >
                <MessageCircle size={20} />
                <span className="font-medium text-sm">Chat on WhatsApp</span>
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
