import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
  Droplet,
  FlaskConical,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Sun,
} from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiMessage from '../components/ui/ApiMessage';
import { useCart } from '../context/CartContext';
import { normalizeProductContent } from '../data/productImages';
import { calcDiscountPercent, getSellingPrice } from '../data/business';
import api from '../utils/api';
import { formatPrice } from '../utils/format';

const ICONS = { Droplet, FlaskConical, Heart, Leaf, Shield, Sparkles, Sun };

const accordionDefs = [
  { key: 'overview', label: 'Overview' },
  { key: 'benefits', label: 'Benefits' },
  { key: 'highlights', label: 'Key Ingredients' },
  { key: 'howToUse', label: 'How to Use' },
  { key: 'ingredients', label: 'Full Ingredient List' },
  { key: 'precautions', label: 'Precautions' },
  { key: 'faqs', label: 'FAQs' },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('overview');
  const [touchX, setTouchX] = useState(null);

  const fetchProduct = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/products/${slug}`)
      .then(async ({ data }) => {
        setProduct(normalizeProductContent(data));
        setActiveImage(0);
        setQuantity(1);
        setOpenAccordion('overview');
        const { data: all } = await api.get('/products');
        setRelated(
          all
            .filter((p) => p._id !== data._id && (p.category === data.category || p.isBestSeller))
            .slice(0, 4)
        );
      })
      .catch((err) => {
        setProduct(null);
        setError(err.response?.status === 404 ? 'notfound' : 'offline');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const images = useMemo(() => product?.images || [], [product]);

  if (loading) return <LoadingSpinner className="py-32" />;

  if (error || !product) {
    return (
      <div className="py-32">
        <ApiMessage
          type={error === 'offline' ? 'offline' : 'empty'}
          message={
            error === 'offline'
              ? 'Unable to load this product. Check that the backend and MongoDB are running.'
              : 'Product not found.'
          }
          onRetry={error === 'offline' ? fetchProduct : undefined}
        />
        <div className="text-center mt-4">
          <Link to="/shop" className="text-sm text-teal hover:text-dark-teal transition-colors">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const sellingPrice = getSellingPrice(product);
  const mrp = product.mrp && product.mrp > sellingPrice ? product.mrp : null;
  const discount =
    product.discountPercentage > 0
      ? product.discountPercentage
      : calcDiscountPercent(mrp, sellingPrice);

  const goImage = (dir) => {
    if (!images.length) return;
    setActiveImage((i) => (i + dir + images.length) % images.length);
  };

  const handleAddToCart = () => addToCart({ ...product, price: sellingPrice }, quantity);
  const handleBuyNow = () => {
    addToCart({ ...product, price: sellingPrice }, quantity);
    navigate('/checkout');
  };

  const accordionContent = {
    overview: product.summary || product.description || 'Details coming soon.',
    benefits: product.benefits.length ? (
      <ul className="space-y-2">
        {product.benefits.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-teal">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    ) : (
      'Details coming soon.'
    ),
    highlights: product.ingredientHighlights.length ? (
      <div className="grid sm:grid-cols-2 gap-4">
        {product.ingredientHighlights.map((item) => {
          const Icon = ICONS[item.icon] || Sparkles;
          return (
            <div key={item.name} className="flex gap-3 items-start">
              <span className="w-10 h-10 rounded-full bg-[#f5f8f7] flex items-center justify-center text-teal shrink-0">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold text-text">{item.name}</p>
                <p className="mt-1 text-sm text-soft-text leading-relaxed">{item.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      product.ingredients || 'See packaging for key ingredients.'
    ),
    howToUse: product.howToUse || 'Details coming soon.',
    ingredients: product.ingredients || 'See product packaging.',
    precautions: product.precautions || 'For external use only. Discontinue if irritation occurs.',
    faqs: product.faqs.length ? (
      <div className="space-y-4">
        {product.faqs.map((faq) => (
          <div key={faq.question}>
            <p className="font-semibold text-text">{faq.question}</p>
            <p className="mt-1 text-soft-text">{faq.answer}</p>
          </div>
        ))}
      </div>
    ) : null,
  };

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <FadeUp>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
            <div>
              <div
                className="relative aspect-square border-0 bg-transparent flex items-center justify-center overflow-hidden"
                onTouchStart={(e) => setTouchX(e.changedTouches[0]?.clientX ?? null)}
                onTouchEnd={(e) => {
                  const end = e.changedTouches[0]?.clientX;
                  if (touchX == null || end == null) return;
                  const delta = end - touchX;
                  if (Math.abs(delta) < 40) return;
                  goImage(delta < 0 ? 1 : -1);
                }}
              >
                <img
                  src={images[activeImage] || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => goImage(-1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-[#222222] flex items-center justify-center hover:bg-white"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => goImage(1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-[#222222] flex items-center justify-center hover:bg-white"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img + i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 aspect-square w-[72px] md:w-20 border-0 bg-transparent p-0 flex items-center justify-center overflow-hidden transition-opacity ${
                        activeImage === i ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-2">
              <p className="text-[12px] tracking-[0.2em] uppercase text-teal font-bold mb-3">
                {product.category}
              </p>
              <h1 className="text-[32px] md:text-[40px] font-bold text-text tracking-tight leading-tight">
                {product.name}
              </h1>
              {product.summary && (
                <p className="mt-4 text-[16px] text-soft-text leading-relaxed">{product.summary}</p>
              )}

              <div className="mt-6 flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-bold text-text">{formatPrice(sellingPrice)}</span>
                {mrp && <span className="text-soft-text line-through text-base">{formatPrice(mrp)}</span>}
                {discount > 0 ? <span className="text-sm font-semibold text-teal">{discount}% off</span> : null}
              </div>

              {product.size && (
                <p className="mt-4 text-[15px] text-soft-text">
                  Size: <span className="text-text font-semibold">{product.size}</span>
                </p>
              )}
              {product.skinType && (
                <p className="mt-2 text-[15px] text-soft-text">
                  Suitable for: <span className="text-text font-semibold">{product.skinType}</span>
                </p>
              )}

              <div className="mt-6 inline-flex items-center border border-gray-200 rounded-full">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-soft-text hover:text-dark-teal"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-soft-text hover:text-dark-teal"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAddToCart} className="flex-1 gap-2">
                  <ShoppingBag size={16} /> Add to Cart
                </Button>
                <Button variant="secondary" onClick={handleBuyNow} className="flex-1">
                  Buy Now
                </Button>
              </div>

              <div className="mt-8 space-y-3 text-[15px] text-soft-text">
                <p className="flex items-center gap-2">
                  <Truck size={16} className="text-teal" /> Secure shipping across India
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-teal" /> Dermatologically inspired formulas
                </p>
              </div>

              {(product.includedProducts || product.comboItems)?.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs tracking-[0.16em] uppercase font-bold text-text mb-3">Includes</p>
                  <ul className="space-y-1.5 text-[15px] text-soft-text">
                    {(product.includedProducts || product.comboItems).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 border-t border-gray-100">
                {accordionDefs.map((item) => {
                  if (item.key === 'faqs' && !accordionContent.faqs) return null;
                  const open = openAccordion === item.key;
                  return (
                    <div key={item.key} className="border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(open ? '' : item.key)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="text-[15px] font-semibold text-text">{item.label}</span>
                        <span className="text-teal text-lg leading-none">{open ? '−' : '+'}</span>
                      </button>
                      {open && (
                        <div className="pb-5 text-[15px] text-soft-text leading-relaxed">
                          {accordionContent[item.key]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeUp>

        {related.length > 0 && (
          <section className="mt-20 md:mt-28">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#222222] tracking-[-0.03em] mb-8 md:mb-10">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-12">
              {related.slice(0, 3).map((item) => (
                <ProductCard key={item._id} product={item} imageMode="shop" />
              ))}
            </div>
            <div className="mt-6">
              <Link to="/shop" className="text-[15px] font-semibold text-dark-teal hover:text-teal">
                Browse all products →
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
