import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  ZoomIn,
  Star,
} from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import ApiMessage from '../components/ui/ApiMessage';
import ImageZoomLightbox from '../components/product/ImageZoomLightbox';
import StickyPurchaseBar from '../components/product/StickyPurchaseBar';
import ProductQuickAdd from '../components/product/ProductQuickAdd';
import ProductRecommendCarousel from '../components/product/ProductRecommendCarousel';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { getResponsiveImage, normalizeProductContent } from '../data/productImages';
import { getDetailGallery, getProductBadge } from '../data/productDisplay';
import { getRecommendedProducts } from '../data/productRecommendations';
import { calcDiscountPercent, getSellingPrice } from '../data/business';
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

function PdpMainImage({ src, alt, priority }) {
  const image = getResponsiveImage(src, 'main');
  return (
    <picture>
      {image.srcSet && (
        <source
          type="image/webp"
          srcSet={image.srcSet}
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      )}
      <img
        src={image.src || src}
        alt={alt}
        width={1200}
        height={1200}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="w-full h-full object-contain"
      />
    </picture>
  );
}

function PdpThumbImage({ src }) {
  const image = getResponsiveImage(src, 'thumb');
  return (
    <picture>
      {image.webpSrc && <source type="image/webp" srcSet={image.srcSet || image.webpSrc} />}
      <img
        src={image.src || src}
        alt=""
        width={160}
        height={160}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain"
      />
    </picture>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, isDrawerOpen } = useCart();
  const { products: summaryProducts, getProductBySlug, getBySlug, slow } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('overview');
  const [touchX, setTouchX] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const purchaseRef = useRef(null);

  // Instant paint from summary cache when available
  useEffect(() => {
    const cached = getBySlug?.(slug);
    if (cached) {
      setProduct((prev) => prev?.slug === slug ? prev : normalizeProductContent(cached));
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);
    setActiveImage(0);
    setQuantity(1);
    setOpenAccordion('overview');

    let active = true;
    getProductBySlug(slug)
      .then((data) => {
        if (!active) return;
        if (!data) {
          if (!cached) {
            setProduct(null);
            setError('notfound');
          }
          return;
        }
        setProduct(normalizeProductContent(data));
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        if (!cached) {
          setProduct(null);
          setError(err.response?.status === 404 ? 'notfound' : 'offline');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, getProductBySlug, getBySlug]);

  const fetchProduct = useCallback(() => {
    setLoading(true);
    setError(null);
    return getProductBySlug(slug)
      .then((data) => {
        if (!data) {
          setProduct(null);
          setError('notfound');
          return;
        }
        setProduct(normalizeProductContent(data));
        setActiveImage(0);
        setQuantity(1);
        setOpenAccordion('overview');
      })
      .catch((err) => {
        setProduct(null);
        setError(err.response?.status === 404 ? 'notfound' : 'offline');
      })
      .finally(() => setLoading(false));
  }, [slug, getProductBySlug]);

  const images = useMemo(() => (product ? getDetailGallery(product) : []), [product]);

  // Prefetch next gallery image for faster swipe
  useEffect(() => {
    if (!images.length) return;
    const next = images[(activeImage + 1) % images.length];
    if (!next || typeof window === 'undefined') return;
    const img = new window.Image();
    img.decoding = 'async';
    img.src = next;
  }, [images, activeImage]);

  const related = useMemo(
    () => getRecommendedProducts(product, summaryProducts),
    [product, summaryProducts]
  );

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12">
          <div className="aspect-square rounded-sm bg-[#eef2f1] animate-pulse" />
          <div className="space-y-4 pt-2">
            <div className="h-4 w-24 rounded bg-[#eef2f1] animate-pulse" />
            <div className="h-10 w-3/4 rounded bg-[#e8eceb] animate-pulse" />
            <div className="h-20 w-full rounded bg-[#eef2f1] animate-pulse" />
            <div className="h-8 w-32 rounded bg-[#e8eceb] animate-pulse" />
          </div>
        </div>
        {slow && (
          <p className="mt-8 text-center text-sm text-[#4a5560]">
            Products are taking a little longer to load. Please wait or retry.
          </p>
        )}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-32">
        <ApiMessage
          type={error === 'offline' ? 'offline' : 'empty'}
          message={
            error === 'offline'
              ? slow
                ? 'Products are taking a little longer to load. Please wait or retry.'
                : 'Unable to load this product. Check that the backend and MongoDB are running.'
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
  const badge = getProductBadge(product);
  const maxQty = product.stock > 0 ? product.stock : 99;

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
                className="relative aspect-square border-0 bg-[#fafafa] flex items-center justify-center overflow-hidden"
                onTouchStart={(e) => setTouchX(e.changedTouches[0]?.clientX ?? null)}
                onTouchEnd={(e) => {
                  const end = e.changedTouches[0]?.clientX;
                  if (touchX == null || end == null) return;
                  const delta = end - touchX;
                  if (Math.abs(delta) < 40) return;
                  goImage(delta < 0 ? 1 : -1);
                }}
              >
                <PdpMainImage
                  src={images[activeImage] || product.imageUrl}
                  alt={product.name}
                  priority={activeImage === 0}
                />
                <button
                  type="button"
                  aria-label="Zoom image"
                  onClick={() => setZoomOpen(true)}
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#222222]"
                >
                  <ZoomIn size={18} />
                </button>
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
                      className={`shrink-0 aspect-square w-[72px] md:w-20 border-0 bg-[#fafafa] p-0 flex items-center justify-center overflow-hidden transition-opacity ${
                        activeImage === i ? 'opacity-100 ring-1 ring-teal' : 'opacity-45 hover:opacity-80'
                      }`}
                    >
                      <PdpThumbImage src={img} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-2">
              {badge && (
                <p className="mb-3 inline-block rounded-[2px] bg-[#f6f7f6] px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-[#222222]">
                  {badge}
                </p>
              )}
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-teal md:text-[12px]">
                {product.category}
              </p>
              <h1 className="text-[clamp(1.5rem,2.5vw,1.85rem)] font-bold leading-snug tracking-[-0.02em] text-text md:text-[28px]">
                {product.name}
              </h1>
              <div className="mt-3 flex items-center gap-1 text-teal" aria-label="Rated 5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                ))}
              </div>
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
              {typeof product.stock === 'number' && (
                <p className="mt-2 text-[14px] text-soft-text">
                  {product.stock > 0 ? `In stock (${product.stock})` : 'Currently out of stock'}
                </p>
              )}

              <div ref={purchaseRef} className="mt-6 inline-flex items-center border border-gray-200 rounded-full">
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
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="p-3 text-soft-text hover:text-dark-teal"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAddToCart} className="flex-1 gap-2" disabled={product.stock === 0}>
                  <ShoppingBag size={16} /> Add to Cart
                </Button>
                <Button variant="secondary" onClick={handleBuyNow} className="flex-1" disabled={product.stock === 0}>
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

        <ProductRecommendCarousel
          products={related}
          title={
            product.isCombo || product.category === 'Combo'
              ? 'Pair With These Essentials'
              : 'You May Also Like'
          }
        />
      </div>

      <ImageZoomLightbox
        open={zoomOpen}
        src={images[activeImage] || product.imageUrl}
        alt={product.name}
        onClose={() => setZoomOpen(false)}
      />
      <StickyPurchaseBar
        targetRef={purchaseRef}
        productName={product.name}
        price={sellingPrice}
        imageUrl={images[0] || product.imageUrl}
        onAdd={handleAddToCart}
        hidden={zoomOpen || isDrawerOpen || quickAddOpen}
      />
      <ProductQuickAdd
        product={product}
        disabled={zoomOpen || isDrawerOpen}
        onOpenChange={setQuickAddOpen}
      />
    </div>
  );
}
