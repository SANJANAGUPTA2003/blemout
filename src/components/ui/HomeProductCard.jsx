import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import ProductImage from './ProductImage';
import Button from './Button';
import { formatPrice } from '../../utils/format';
import { calcDiscountPercent, getSellingPrice } from '../../data/business';
import { productPath } from '../../data/productImages';
import { useCart } from '../../context/CartContext';

function HomeProductCard({
  product,
  image,
  hoverImage = '',
  badge,
  benefit,
  displayName,
  cartProducts,
}) {
  const { addToCart } = useCart();
  const sellingPrice = getSellingPrice(product);
  const mrp = product.mrp && product.mrp > sellingPrice ? product.mrp : null;
  const discount =
    product.discountPercentage > 0
      ? product.discountPercentage
      : calcDiscountPercent(mrp, sellingPrice);

  const name = displayName || product.name;
  const path = product.slug ? productPath(product) : '/shop';
  const primaryImage = image || product.imageUrl || '';
  const hoverSrc = hoverImage || product.hoverImage || '';
  const benefitLine = benefit || product.summary || product.benefits?.[0] || '';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const items =
      Array.isArray(cartProducts) && cartProducts.length ? cartProducts : [product];
    items.forEach((item) => {
      if (!item) return;
      addToCart({ ...item, price: getSellingPrice(item) }, 1);
    });
  };

  return (
    <article className="group flex h-full w-full flex-col bg-white">
      <Link to={path} className="relative block overflow-hidden">
        <ProductImage
          src={primaryImage}
          hoverSrc={hoverSrc}
          alt={name}
          size="lg"
          role="card"
          loading="lazy"
          fit="contain"
          containerClass="bg-[#fafafa]"
        />
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-[2px] bg-white/95 px-2.5 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#222222]">
            {badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-5 text-left">
        <Link to={path}>
          <h3 className="min-h-[3.4em] text-[clamp(1.1rem,1.5vw,1.4rem)] font-semibold leading-snug tracking-[-0.01em] text-[#222222] line-clamp-2 [@media(hover:hover)]:group-hover:text-dark-teal">
            {name}
          </h3>
        </Link>

        <div className="mt-2.5 flex items-center gap-1 text-teal" aria-label="Rated 5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          ))}
        </div>

        {benefitLine && (
          <p className="mt-2.5 min-h-[2.8em] text-[15px] leading-relaxed text-[#4a5560] line-clamp-2 md:text-[16px]">
            {benefitLine}
          </p>
        )}

        <div className="mt-3.5 flex flex-wrap items-baseline gap-2.5">
          <p className="text-[clamp(1.15rem,1.6vw,1.4rem)] font-bold text-[#222222]">
            {formatPrice(sellingPrice)}
          </p>
          {mrp && (
            <p className="text-[15px] text-[#6b7280] line-through md:text-[16px]">{formatPrice(mrp)}</p>
          )}
          {discount > 0 && (
            <p className="text-[13px] font-semibold text-teal md:text-[14px]">{discount}% off</p>
          )}
        </div>

        <div className="mt-auto pt-5">
          <Button type="button" size="md" className="w-full" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export default memo(HomeProductCard);
