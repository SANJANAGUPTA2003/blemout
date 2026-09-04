import { memo } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import Button from './Button';
import PriceDisplay from './PriceDisplay';
import StarRating from './StarRating';
import { productPath } from '../../data/productImages';
import {
  getBenefitLine,
  getListingHoverImage,
  getListingImage,
  getProductBadge,
  normalizePricing,
} from '../../data/productDisplay';
import { useCart } from '../../context/CartContext';

/**
 * Shared listing card for Shop, collections, related, concern pages.
 */
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { sellingPrice, mrp, discount } = normalizePricing(product);
  const badge = getProductBadge(product);
  const primaryImage = getListingImage(product);
  const hoverImage = getListingHoverImage(product);
  const path = productPath(product);
  const benefit = getBenefitLine(product);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, price: sellingPrice }, 1);
  };

  return (
    <article className="group flex h-full w-full flex-col bg-white">
      <Link to={path} className="relative block overflow-hidden">
        <div className="relative">
          <ProductImage
            src={primaryImage}
            hoverSrc={hoverImage}
            alt={product.name}
            size="lg"
            role="card"
            loading="lazy"
            fit="contain"
            containerClass="aspect-square"
            className=""
          />
          {badge && (
            <span className="absolute left-3 top-3 z-10 rounded-[2px] bg-[#9fd9cf] px-2.5 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#1f5c56]">
              {badge}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4 text-left md:pt-5">
        <Link to={path}>
          <h3
            title={product.name}
            className="min-h-[3.6em] text-[clamp(16px,1.2vw,18px)] font-semibold leading-snug tracking-[-0.01em] text-[#222222] [@media(hover:hover)]:group-hover:text-dark-teal"
          >
            {product.name}
          </h3>
        </Link>

        <StarRating rating={5} size={15} className="mt-2.5 flex items-center gap-1 text-teal" />

        {benefit && (
          <p className="mt-2.5 min-h-[2.6em] text-[15px] leading-relaxed text-[#4a5560] line-clamp-2 md:text-[16px]">
            {benefit}
          </p>
        )}

        <div className="mt-3.5">
          <PriceDisplay sellingPrice={sellingPrice} mrp={mrp} discount={discount} />
        </div>

        <div className="mt-auto pt-5">
          <Button type="button" size="lg" className="w-full" onClick={handleAdd}>
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
