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
export default function ProductCard({ product, imageMode = 'shop' }) {
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
    <article className="group flex flex-col h-full bg-white">
      <Link to={path} className="relative block overflow-hidden">
        <ProductImage
          src={primaryImage}
          hoverSrc={hoverImage}
          alt={product.name}
          size="lg"
          compact
          containerClass="rounded-none"
        />
        <div className="pointer-events-none absolute inset-0 bg-teal/0 transition-colors duration-500 [@media(hover:hover)]:group-hover:bg-teal/5" />
        <span className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto w-fit opacity-0 translate-y-2 transition-all duration-500 text-[11px] tracking-[0.18em] uppercase font-semibold text-dark-teal [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0">
          View Product
        </span>
      </Link>

      <div className="flex flex-col flex-1 pt-5 pb-2 text-center px-1">
        <Link to={path}>
          <h3 className="text-[18px] md:text-[19px] font-semibold text-text group-hover:text-dark-teal transition-colors duration-300 leading-snug">
            {product.name}
          </h3>
        </Link>
        {(product.summary || product.benefits?.[0]) && (
          <p className="mt-2 text-sm text-soft-text line-clamp-2 font-normal leading-relaxed">
            {product.summary || product.benefits[0]}
          </p>
        )}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <p className="text-base font-bold text-text">{formatPrice(sellingPrice)}</p>
          {mrp && (
            <p className="text-sm text-soft-text line-through">{formatPrice(mrp)}</p>
          )}
          {discount > 0 ? (
            <p className="text-xs font-semibold text-teal">{discount}% off</p>
          ) : null}
        </div>
        <Link
          to={path}
          className="mt-4 inline-flex justify-center text-[13px] font-semibold tracking-wide text-dark-teal hover:text-teal transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </article>
  );
}
