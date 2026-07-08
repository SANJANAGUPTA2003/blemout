import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import ProductImage from './ProductImage';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, showAddToCart = true }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const sellingPrice = product.price;
  const mrp = product.mrp && product.mrp > sellingPrice ? product.mrp : null;

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:bg-dark-teal/10 hover:shadow-[0_16px_40px_rgba(42,127,128,0.12)]">
      <Link to={`/product/${product._id}`} className="block overflow-hidden">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          size="md"
          containerClass="rounded-none bg-mint-strong/20 group-hover:bg-dark-teal/15 transition-colors duration-300"
        />
      </Link>
      <div className="flex flex-col flex-1 px-5 pt-5 pb-6 text-center">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-text group-hover:text-dark-teal transition-colors duration-300 leading-snug">
            {product.name}
          </h3>
        </Link>
        {product.benefits?.[0] && (
          <p className="mt-2 text-xs text-soft-text line-clamp-1 font-normal">
            {product.benefits[0]}
          </p>
        )}
        <div className="mt-3 flex items-center justify-center gap-2">
          <p className="text-sm font-semibold text-text">{formatPrice(sellingPrice)}</p>
          {mrp && (
            <p className="text-xs text-soft-text line-through">{formatPrice(mrp)}</p>
          )}
        </div>
        {showAddToCart && (
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="mt-4 w-full hover:bg-dark-teal"
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </Button>
        )}
      </div>
    </div>
  );
}
