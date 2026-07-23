import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import ApiMessage from '../components/ui/ApiMessage';
import { useProducts } from '../context/ProductContext';
import { CONCERNS } from '../data/storefrontConfig';
import { resolveBySlugs } from '../data/productDisplay';

export default function ConcernCollection() {
  const { concernId } = useParams();
  const { products, loading, error, slow, retry } = useProducts();
  const concern = CONCERNS.find((c) => c.id === concernId);

  const list = useMemo(() => {
    if (!concern) return [];
    return resolveBySlugs(products, concern.productSlugs);
  }, [products, concern]);

  if (!concern) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-20">
        <ApiMessage type="empty" message="This concern page was not found." />
        <Link to="/shop-by-concern" className="mt-6 inline-block text-dark-teal underline">
          Back to Shop by Concern
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <FadeUp>
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
            Shop by Concern
          </p>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h1 className="text-[34px] font-bold tracking-[-0.03em] text-[#222222] md:text-[48px]">
                {concern.name}
              </h1>
              <p className="mt-4 text-[16px] leading-relaxed text-[#4a5560]">{concern.description}</p>
            </div>
            <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full bg-[#f4f7f6] md:mx-0 md:h-36 md:w-36">
              <img
                src={concern.image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </FadeUp>

        <div className="mt-12 md:mt-14">
          {loading ? (
            <ProductSkeleton count={4} />
          ) : error ? (
            <ApiMessage
              type="offline"
              message={slow ? 'Still loading…' : 'Unable to load products.'}
              onRetry={retry}
            />
          ) : list.length === 0 ? (
            <ApiMessage type="empty" message="No matching products for this concern yet." />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16">
              {list.map((product) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>
          )}
        </div>

        <Link
          to="/shop-by-concern"
          className="mt-12 inline-block text-[14px] font-semibold text-dark-teal hover:underline"
        >
          ← All concerns
        </Link>
      </div>
    </div>
  );
}
