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
} from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import StarRating from '../components/ui/StarRating';
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
import { getComboIncludedLabels } from '../data/storefrontConfig';
import { getRecommendedProducts } from '../data/productRecommendations';
import { getFullIngredients } from '../data/productIngredients';
import { calcDiscountPercent, getSellingPrice } from '../data/business';
import PriceDisplay from '../components/ui/PriceDisplay';

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
    <picture className="block h-full w-full">
      {image.srcSet && (
        <source
          type="image/webp"
          srcSet={image.srcSet}
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      )}
      <img
        src={image.webpSrc || image.src || src}
        alt={alt}
        width={1200}
        height={1200}
        sizes="(max-width: 1024px) 100vw, 55vw"
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
    <picture className="block h-full w-full">
      {image.webpSrc && <source type="image/webp" srcSet={image.srcSet || image.webpSrc} />}
      <img
        src={image.webpSrc || image.src || src}
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
