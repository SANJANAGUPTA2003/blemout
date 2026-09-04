import { memo } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import Button from './Button';
import PriceDisplay from './PriceDisplay';
import StarRating from './StarRating';
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
          containerClass="aspect-square"
          className=""
        />
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-[2px] bg-[#9fd9cf] px-2.5 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#1f5c56]">
            {badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4 text-left md:pt-5">
        <Link to={path}>
          <h3
            title={name}
            className="min-h-[3.6em] text-[clamp(16px,1.2vw,18px)] font-semibold leading-snug tracking-[-0.01em] text-[#222222] [@media(hover:hover)]:group-hover:text-dark-teal"
          >
            {name}
          </h3>
        </Link>

        <StarRating rating={5} size={14} />

        {benefitLine && (
          <p className="mt-2.5 text-[14px] leading-relaxed text-[#4a5560] line-clamp-2 md:text-[15px] lg:line-clamp-3">
            {benefitLine}
          </p>
        )}

        <div className="mt-3.5">
          <PriceDisplay sellingPrice={sellingPrice} mrp={mrp} discount={discount} />
        </div>

        <div className="mt-auto pt-4">
          <Button type="button" size="md" className="w-full py-3.5 text-[15px] md:text-[16px]" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export default memo(HomeProductCard);
