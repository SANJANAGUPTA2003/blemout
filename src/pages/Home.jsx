import { useMemo } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import BestSellersCarousel from '../components/home/BestSellersCarousel';
import EditorialStory from '../components/home/EditorialStory';
import ExploreMoreProducts from '../components/home/ExploreMoreProducts';
import ApiMessage from '../components/ui/ApiMessage';
import { CarouselSkeleton } from '../components/ui/ProductSkeleton';
import { getPromoImage } from '../data/productImages';
import { useProducts } from '../context/ProductContext';

export default function Home() {
  const { loading, error, slow, retry, getByCollection, getFeatured, getBySlug } = useProducts();

  const products = useMemo(() => getByCollection('best-sellers').slice(0, 8), [getByCollection]);
  const featured = useMemo(() => getFeatured(), [getFeatured]);

  const repair = getBySlug('blemout-blemishes-repair-cream') || featured.find((p) => p.slug === 'blemout-blemishes-repair-cream');
  const sunscreen = getBySlug('blemout-enviro-shield-sunscreen');
  const serum = getBySlug('blemout-advanced-blemishes-repair-serum-30ml');
  const facewash = getBySlug('blemout-skin-glow-age-defying-facewash');
  const moist = getBySlug('blemout-hydra-glow-water-creme');

  return (
    <div>
      <HeroCarousel />

      {loading ? (
        <div>
          <CarouselSkeleton />
          {slow && (
            <p className="pb-8 text-center text-sm text-[#4a5560]">
              Products are taking a little longer to load. Please wait or retry.
            </p>
          )}
        </div>
      ) : error ? (
        <div className="py-20">
          <ApiMessage
            type="offline"
            message={
              slow
                ? 'Products are taking a little longer to load. Please wait or retry.'
                : 'Unable to load bestsellers. Check that the backend and MongoDB are running.'
            }
            onRetry={retry}
          />
        </div>
      ) : (
        <BestSellersCarousel products={products} />
      )}

      {repair && (
        <EditorialStory
          eyebrow="Repair"
          title={repair.name}
          body={repair.summary || repair.description}
          bullets={(repair.benefits || []).slice(0, 4)}
          ingredients={(repair.ingredientHighlights || []).slice(0, 5)}
          howToUse={repair.howToUse}
          image={getPromoImage(repair)}
          imageAlt={repair.name}
          ctaTo={`/shop/${repair.slug}`}
        />
      )}

      {sunscreen && (
        <EditorialStory
          eyebrow="Protect"
          title={sunscreen.name}
          body={sunscreen.summary || sunscreen.description}
          bullets={(sunscreen.benefits || []).slice(0, 4)}
          ingredients={(sunscreen.ingredientHighlights || []).slice(0, 4)}
          howToUse={sunscreen.howToUse}
          image={getPromoImage(sunscreen)}
          imageAlt={sunscreen.name}
          ctaTo={`/shop/${sunscreen.slug}`}
          reverse
        />
      )}

      {serum && (
        <EditorialStory
          eyebrow="Treat"
          title={serum.name}
          body={serum.summary || serum.description}
          bullets={(serum.benefits || []).slice(0, 4)}
          ingredients={(serum.ingredientHighlights || []).slice(0, 4)}
          howToUse={serum.howToUse}
          image={getPromoImage(serum)}
          imageAlt={serum.name}
          ctaTo={`/shop/${serum.slug}`}
        />
      )}

      {facewash && (
        <EditorialStory
          eyebrow="Cleanse"
          title={facewash.name}
          body={facewash.summary || facewash.description}
          bullets={(facewash.benefits || []).slice(0, 4)}
          ingredients={(facewash.ingredientHighlights || []).slice(0, 4)}
          howToUse={facewash.howToUse}
          image={getPromoImage(facewash)}
          imageAlt={facewash.name}
          ctaTo={`/shop/${facewash.slug}`}
          reverse
        />
      )}

      {moist && (
        <EditorialStory
          eyebrow="Hydrate"
          title={moist.name}
          body={moist.summary || moist.description}
          bullets={(moist.benefits || []).slice(0, 4)}
          ingredients={(moist.ingredientHighlights || []).slice(0, 4)}
          howToUse={moist.howToUse}
          image={getPromoImage(moist)}
          imageAlt={moist.name}
          ctaTo={`/shop/${moist.slug}`}
        />
      )}

      <ExploreMoreProducts />
    </div>
  );
}
