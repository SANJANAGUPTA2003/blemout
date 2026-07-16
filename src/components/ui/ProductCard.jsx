import { memo } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { formatPrice } from '../../utils/format';
import { calcDiscountPercent, getSellingPrice } from '../../data/business';
import {
  getHoverImage,
  getMainImage,
  getProductImages,
  getPromoImage,
  productPath,
} from '../../data/productImages';

/**
 * imageMode:
 * - "shop" (default): image 1 main, image 2 hover — Shop / PDP related
 * - "promo": image 2 main — Home, collections, Explore More
 */
function ProductCard({ product, imageMode = 'shop' }) {
  const sellingPrice = getSellingPrice(product);
  const mrp = product.mrp && product.mrp > sellingPrice ? product.mrp : null;
  const discount =
    product.discountPercentage > 0
      ? product.discountPercentage
      : calcDiscountPercent(mrp, sellingPrice);
  const images = getProductImages(product);
  const primaryImage =
    imageMode === 'promo' ? getPromoImage(product) : getMainImage(product);
  const hoverImage =
    imageMode === 'promo'
      ? images[0] && images[0] !== primaryImage
        ? images[0]
        : images[2] || ''
      : getHoverImage(product);
  const path = productPath(product);

  return (
    <article className="group flex flex-col h-full bg-white w-full">
      <Link to={path} className="relative block overflow-hidden rounded-sm">
        <ProductImage
          src={primaryImage}
          hoverSrc={hoverImage}
          alt={product.name}
          size="lg"
          role="card"
          loading="lazy"
          containerClass="rounded-sm"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit opacity-0 translate-y-1.5 transition-all duration-400 text-[11px] tracking-[0.14em] uppercase font-semibold text-[#222222] [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0">
          View Product
        </span>
      </Link>

      <div className="flex flex-col flex-1 pt-4 pb-1 text-center bg-white">
        <Link to={path} className="group/title">
          <h3 className="text-[17px] md:text-[18px] font-semibold text-[#222222] leading-snug tracking-[-0.01em] transition-colors duration-300 [@media(hover:hover)]:group-hover:underline [@media(hover:hover)]:group-hover:decoration-1 [@media(hover:hover)]:group-hover:underline-offset-4 [@media(hover:hover)]:group-hover:text-dark-teal">
            {product.name}
          </h3>
        </Link>
        {(product.summary || product.benefits?.[0]) && (
          <p className="mt-2 text-[14px] text-[#4a5560] line-clamp-2 font-normal leading-relaxed">
            {product.summary || product.benefits[0]}
          </p>
        )}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <p className="text-[15px] md:text-base font-bold text-[#222222]">{formatPrice(sellingPrice)}</p>
          {mrp && (
            <p className="text-sm text-[#6b7280] line-through">{formatPrice(mrp)}</p>
          )}
          {discount > 0 ? (
            <p className="text-xs font-semibold text-teal">{discount}% off</p>
          ) : null}
        </div>
        <Link
          to={path}
          className="mt-3 inline-flex justify-center text-[13px] font-semibold tracking-[0.02em] text-dark-teal opacity-80 transition-all duration-300 [@media(hover:hover)]:group-hover:opacity-100 hover:underline underline-offset-4"
        >
          Shop Now
        </Link>
      </div>
    </article>
  );
}

export default memo(ProductCard);
