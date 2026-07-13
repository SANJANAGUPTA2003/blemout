import { useState, useEffect, useCallback } from 'react';
import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiMessage from '../components/ui/ApiMessage';
import HeroCarousel from '../components/home/HeroCarousel';
import BestSellersCarousel from '../components/home/BestSellersCarousel';
import EditorialStory from '../components/home/EditorialStory';
import ExploreMoreProducts from '../components/home/ExploreMoreProducts';
import { getPromoImage } from '../data/productImages';
import api from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      api.get('/products', { params: { collection: 'best-sellers' } }),
      api.get('/products', { params: { featured: 'true' } }),
    ])
      .then(([best, feat]) => {
        setProducts(best.data.slice(0, 8));
        setFeatured(feat.data.filter((p) => !p.isCombo));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const bySlug = (slug) => featured.find((p) => p.slug === slug);

  const repair = bySlug('blemout-blemishes-repair-cream');
  const sunscreen = bySlug('blemout-enviro-shield-sunscreen');
  const serum = bySlug('blemout-advanced-blemishes-repair-serum-30ml');
  const facewash = bySlug('blemout-skin-glow-age-defying-facewash');
  const moist = bySlug('blemout-hydra-glow-water-creme');

  return (
    <div>
      <HeroCarousel />

      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : error ? (
        <div className="py-20">
          <ApiMessage
            type="offline"
            message="Unable to load bestsellers. Check that the backend and MongoDB are running."
            onRetry={fetchProducts}
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
