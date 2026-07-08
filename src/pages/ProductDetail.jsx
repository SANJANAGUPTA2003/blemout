import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import ProductImage from '../components/ui/ProductImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiMessage from '../components/ui/ApiMessage';
import { useCart } from '../context/CartContext';
import { getProductImages } from '../data/productImages';
import api from '../utils/api';
import { formatPrice } from '../utils/format';

const tabs = ['Description', 'Ingredients', 'How To Use'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [activeImage, setActiveImage] = useState(0);

  const fetchProduct = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setActiveImage(0);
      })
      .catch((err) => {
        setProduct(null);
        setError(err.response?.status === 404 ? 'notfound' : 'offline');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

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
          <Link to="/shop" className="text-sm text-teal hover:text-dark-teal transition-colors duration-300">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = getProductImages(product);

  const handleAddToCart = () => addToCart(product, quantity);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const tabContent = {
    Description: product.description,
    Ingredients: product.ingredients || 'Ingredient list coming soon.',
    'How To Use': product.howToUse || 'Usage instructions coming soon.',
  };

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          <FadeUp>
            <div className="bg-ivory rounded-xl overflow-hidden">
              <ProductImage
                src={images[activeImage]}
                alt={product.name}
                size="xl"
                containerClass="rounded-xl"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg bg-ivory overflow-hidden border-2 transition-colors duration-300 ${
                      activeImage === i ? 'border-teal' : 'border-transparent hover:border-light-teal'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </FadeUp>

          <FadeUp delay={0.08}>
            <div className="lg:pt-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-teal font-medium">
                {product.category}
              </p>
              <h1 className="mt-3 text-2xl md:text-3xl font-medium text-text leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-teal text-teal" />
                  ))}
                </div>
                <span className="text-xs text-soft-text">(4.8)</span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <p className="text-xl font-semibold text-text">
                  {formatPrice(product.price)}
                </p>
                {product.mrp > product.price && (
                  <p className="text-sm text-soft-text line-through">{formatPrice(product.mrp)}</p>
                )}
              </div>
              {product.size && (
                <p className="mt-2 text-sm text-soft-text">{product.size}</p>
              )}

              {product.benefits?.length > 0 && (
                <ul className="mt-8 space-y-2.5">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[13px] text-soft-text font-normal">
                      <span className="w-1 h-1 rounded-full bg-teal mt-2 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-10 flex items-center gap-5">
                <div className="flex items-center rounded-full border border-gray-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-soft-text hover:text-teal transition-colors duration-300"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-soft-text hover:text-teal transition-colors duration-300"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-xs text-soft-text">Only {product.stock} left</span>
                )}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAddToCart} className="gap-2 flex-1 sm:flex-none">
                  <ShoppingBag size={16} />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={handleBuyNow} className="flex-1 sm:flex-none">
                  Buy Now
                </Button>
              </div>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.12} className="mt-20 md:mt-28 max-w-2xl">
          <div className="flex gap-8 border-b border-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm transition-colors duration-300 border-b -mb-px ${
                  activeTab === tab
                    ? 'border-teal text-teal font-medium'
                    : 'border-transparent text-soft-text hover:text-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-8 text-[13px] text-soft-text leading-relaxed font-normal whitespace-pre-line">
            {tabContent[activeTab]}
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
