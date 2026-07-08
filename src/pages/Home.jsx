import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Star, Shield, Leaf, Heart, Sparkles } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import ProductCard from '../components/ui/ProductCard';
import ProductImage from '../components/ui/ProductImage';
import ProductPlaceholder from '../components/ui/ProductPlaceholder';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiMessage from '../components/ui/ApiMessage';
import {
  trustItems,
  concerns,
  combos,
  ingredients,
  reviews,
  faqs,
  routineSuggestions,
} from '../data/constants';
import { FACEWASH_IMAGES } from '../data/productImages';
import api from '../utils/api';
import { formatPrice } from '../utils/format';

const trustIcons = [Shield, Heart, Sparkles, Leaf, Heart];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedConcern, setSelectedConcern] = useState('dark-neck');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const essentials = products.filter((p) =>
    ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen', 'Blemishes Repair Cream'].includes(p.category)
  ).slice(0, 4);

  const comboProducts = products.filter((p) => p.category === 'Combo').slice(0, 4);

  const heroImage = products.find((p) => p.category === 'Face Wash')?.imageUrl || FACEWASH_IMAGES.hero;

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 xl:gap-20 items-center">
            <FadeUp>
              <p className="text-[11px] tracking-[0.22em] uppercase text-teal font-semibold mb-5">
                Blemish Care · Clinical Skincare
              </p>
              <h1 className="text-[2.35rem] md:text-5xl lg:text-[3.5rem] font-medium text-text leading-[1.12] tracking-tight">
                Target Blemishes.
                <br />
                Reveal Confident Skin.
              </h1>
              <p className="mt-6 text-soft-text text-base md:text-lg leading-relaxed max-w-md font-normal">
                Dermatologically inspired formulas created to care for pigmentation,
                uneven tone, and blemish-prone areas.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/shop">
                  <Button size="lg">Shop Now</Button>
                </Link>
                <a href="#routine-builder">
                  <Button variant="secondary" size="lg">Build Your Routine</Button>
                </a>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="relative bg-light-teal/15 rounded-2xl p-6 md:p-10">
                <div className="bg-white rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(45,190,173,0.08)]">
                  <ProductImage
                    src={heroImage}
                    alt="BLEMOUT Skin Glow & Age Defying Facewash"
                    size="xl"
                    containerClass="rounded-xl bg-light-teal/10"
                  />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-10 md:py-12 border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {trustItems.map((item, i) => {
              const Icon = trustIcons[i] || Shield;
              return (
                <FadeUp key={item} delay={i * 0.04} className="flex items-center gap-2.5">
                  <Icon size={16} className="text-teal shrink-0" strokeWidth={1.5} />
                  <span className="text-xs md:text-[13px] text-soft-text">{item}</span>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop Essentials */}
      <section className="py-24 md:py-32 bg-soft-blue/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeUp>
            <SectionHeading
              title="Shop Essentials"
              subtitle="Core products for your daily blemish care routine."
            />
          </FadeUp>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ApiMessage
              type="offline"
              message="Unable to load products. Make sure the backend server and MongoDB are running."
              onRetry={fetchProducts}
            />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {essentials.length > 0 ? (
                  essentials.map((product, i) => (
                    <FadeUp key={product._id} delay={i * 0.06}>
                      <ProductCard product={product} />
                    </FadeUp>
                  ))
                ) : (
                  ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen'].map((name, i) => (
                    <FadeUp key={name} delay={i * 0.06}>
                      <div className="bg-white rounded-xl overflow-hidden">
                        <ProductPlaceholder size="md" />
                        <div className="p-5 text-center">
                          <h3 className="text-sm font-medium">{name}</h3>
                          <p className="text-xs text-soft-text mt-1">Coming soon</p>
                        </div>
                      </div>
                    </FadeUp>
                  ))
                )}
              </div>
              <div className="text-center mt-14">
                <Link to="/shop">
                  <Button variant="outline">View All Products</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Shop By Concern */}
      <section id="concerns" className="py-24 md:py-32 bg-mint-strong/35">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeUp>
            <SectionHeading
              title="Shop By Concern"
              subtitle="Targeted solutions for specific pigmentation concerns."
            />
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {concerns.map((concern, i) => (
              <FadeUp key={concern.id} delay={i * 0.06}>
                <Link
                  to={`/shop?concern=${concern.id}`}
                  className="block bg-white rounded-xl p-8 transition-all duration-300 hover:bg-light-teal/30 group h-full"
                >
                  <h3 className="text-sm font-medium text-text group-hover:text-teal transition-colors duration-300">
                    {concern.name}
                  </h3>
                  <p className="mt-3 text-[13px] text-soft-text leading-relaxed font-normal">
                    {concern.description}
                  </p>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Best Combos */}
      <section id="combos" className="py-24 md:py-32 bg-soft-blue/30">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeUp>
            <SectionHeading
              title="Best Combos"
              subtitle="Curated bundles for maximum results at better value."
            />
          </FadeUp>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ApiMessage type="offline" message="Unable to load combos." onRetry={fetchProducts} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(comboProducts.length ? comboProducts : combos).map((combo, i) => (
                <FadeUp key={combo._id || combo.id} delay={i * 0.06}>
                  <div className="bg-mint-strong/20 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:bg-dark-teal/10 hover:-translate-y-1">
                    {combo._id ? (
                      <ProductImage src={combo.imageUrl} alt={combo.name} size="sm" containerClass="bg-mint-strong/30" />
                    ) : (
                      <ProductPlaceholder size="sm" />
                    )}
                    <div className="p-6 flex flex-col flex-1 text-center">
                      <h3 className="text-sm font-medium text-text">{combo.name}</h3>
                      <p className="text-[13px] text-soft-text mt-2">{combo.description}</p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <p className="text-sm font-semibold text-text">{formatPrice(combo.price)}</p>
                        {combo.mrp > combo.price && (
                          <p className="text-xs text-soft-text line-through">{formatPrice(combo.mrp)}</p>
                        )}
                      </div>
                      <Link to={combo._id ? `/product/${combo._id}` : '/shop?category=Combo'} className="mt-5">
                        <Button size="sm" className="w-full">Shop Combo</Button>
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="py-24 md:py-32 bg-mint-strong/25">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeUp>
            <SectionHeading
              title="Ingredient Spotlight"
              subtitle="Science-backed actives that power every BLEMOUT formula."
            />
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ingredients.map((ing, i) => (
              <FadeUp key={ing.name} delay={i * 0.06}>
                <div className="bg-white rounded-xl p-8 h-full">
                  <Leaf size={18} className="text-teal mb-5" strokeWidth={1.5} />
                  <h3 className="text-sm font-medium text-text">{ing.name}</h3>
                  <p className="mt-3 text-[13px] text-soft-text leading-relaxed font-normal">{ing.benefit}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Routine Builder */}
      <section id="routine-builder" className="py-24 md:py-32">
        <div className="max-w-xl mx-auto px-6 md:px-10">
          <FadeUp>
            <SectionHeading
              title="Build Your Routine"
              subtitle="Select your primary concern and we'll suggest the right products."
            />
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="bg-mint-strong/30 rounded-2xl p-8 md:p-10">
              <label className="block text-sm font-medium text-text mb-3">
                Your Primary Concern
              </label>
              <div className="relative">
                <select
                  value={selectedConcern}
                  onChange={(e) => setSelectedConcern(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-full border border-gray-100 text-sm appearance-none focus:outline-none focus:border-teal/40 bg-white text-text"
                >
                  {concerns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-soft-text pointer-events-none" />
              </div>
              <div className="mt-8">
                <p className="text-sm font-medium text-text mb-4">Suggested Routine</p>
                <ol className="space-y-3">
                  {routineSuggestions[selectedConcern]?.map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-[13px] text-soft-text">
                      <span className="w-6 h-6 rounded-full bg-light-teal text-teal text-[11px] font-medium flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <Link to="/shop" className="block mt-8">
                <Button className="w-full">Shop Suggested Products</Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 md:py-32 bg-mint-strong/25">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeUp>
            <SectionHeading
              title="What Our Customers Say"
              subtitle="Real results from real people."
            />
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((review, i) => (
              <FadeUp key={review.name} delay={i * 0.06}>
                <div className="bg-white rounded-xl p-7 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={13} className="fill-teal text-teal" />
                    ))}
                  </div>
                  <p className="text-[13px] text-soft-text leading-relaxed flex-1 font-normal">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-5 pt-5 border-t border-gray-50">
                    <p className="text-sm font-medium text-text">{review.name}</p>
                    <p className="text-xs text-soft-text mt-0.5">{review.location}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <FadeUp>
            <SectionHeading title="Frequently Asked Questions" />
          </FadeUp>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FadeUp key={faq.question} delay={i * 0.04}>
                <div className="border-b border-gray-50">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <span className="text-sm font-medium text-text pr-6">{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`text-teal shrink-0 transition-transform duration-300 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="pb-5 text-[13px] text-soft-text leading-relaxed font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
