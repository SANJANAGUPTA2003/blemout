import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import api from '../utils/api';

const ProductContext = createContext(null);

const TTL_MS = 5 * 60 * 1000;
const SLOW_MS = 4500;
const RETRY_COOLDOWN_MS = 2500;

function cacheKey(params = {}) {
  return JSON.stringify({
    view: params.view || 'summary',
    collection: params.collection || '',
    featured: params.featured || '',
    category: params.category || '',
  });
}

export function ProductProvider({ children }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [slow, setSlow] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(0);

  const cacheRef = useRef(new Map());
  const inflightRef = useRef(new Map());
  const detailCacheRef = useRef(new Map());
  const detailInflightRef = useRef(new Map());
  const lastRetryRef = useRef(0);
  const abortRef = useRef(null);

  const fetchSummary = useCallback(async ({ force = false } = {}) => {
    const key = cacheKey({ view: 'summary' });
    const cached = cacheRef.current.get(key);
    const now = Date.now();

    if (!force && cached && now - cached.at < TTL_MS) {
      setAllProducts(cached.data);
      setLoading(false);
      setError(false);
      setSlow(false);
      setLastFetchedAt(cached.at);
      return cached.data;
    }

    if (inflightRef.current.has(key)) {
      return inflightRef.current.get(key);
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);
    setSlow(false);

    let becameSlow = false;
    const slowTimer = window.setTimeout(() => {
      if (!controller.signal.aborted) {
        becameSlow = true;
        setSlow(true);
      }
    }, SLOW_MS);

    const request = api
      .get('/products', {
        params: { view: 'summary' },
        signal: controller.signal,
        timeout: 20000,
      })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : [];
        cacheRef.current.set(key, { data: list, at: Date.now() });
        setAllProducts(list);
        setLastFetchedAt(Date.now());
        setError(false);
        setSlow(false);
        return list;
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') return [];
        setError(true);
        if (becameSlow) setSlow(true);
        throw err;
      })
      .finally(() => {
        window.clearTimeout(slowTimer);
        setLoading(false);
        inflightRef.current.delete(key);
      });

    inflightRef.current.set(key, request);
    return request;
  }, []);

  const retry = useCallback(() => {
    const now = Date.now();
    if (now - lastRetryRef.current < RETRY_COOLDOWN_MS) return;
    lastRetryRef.current = now;
    fetchSummary({ force: true }).catch(() => {});
  }, [fetchSummary]);

  const getProductBySlug = useCallback(async (slug) => {
    if (!slug) return null;
    const cached = detailCacheRef.current.get(slug);
    if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

    if (detailInflightRef.current.has(slug)) {
      return detailInflightRef.current.get(slug);
    }

    const request = api
      .get(`/products/${slug}`, { timeout: 20000 })
      .then(({ data }) => {
        detailCacheRef.current.set(slug, { data, at: Date.now() });
        return data;
      })
      .finally(() => {
        detailInflightRef.current.delete(slug);
      });

    detailInflightRef.current.set(slug, request);
    return request;
  }, []);

  const invalidate = useCallback(() => {
    cacheRef.current.clear();
    detailCacheRef.current.clear();
    setLastFetchedAt(0);
  }, []);

  const getByCollection = useCallback(
    (collection) => {
      if (collection === 'best-sellers') return allProducts.filter((p) => p.isBestSeller);
      if (collection === 'new') return allProducts.filter((p) => p.isNewArrival);
      if (collection === 'limited-picks') return allProducts.filter((p) => p.isLimitedPick);
      return allProducts;
    },
    [allProducts]
  );

  const getFeatured = useCallback(
    () => allProducts.filter((p) => p.isFeatured && !p.isCombo),
    [allProducts]
  );

  const getBySlug = useCallback(
    (slug) => allProducts.find((p) => p.slug === slug),
    [allProducts]
  );

  useEffect(() => {
    fetchSummary().catch(() => {});
    return () => abortRef.current?.abort();
  }, [fetchSummary]);

  const isStale = useCallback(
    () => lastFetchedAt > 0 && Date.now() - lastFetchedAt > TTL_MS,
    [lastFetchedAt]
  );

  const value = useMemo(
    () => ({
      products: allProducts,
      loading,
      error,
      slow,
      isStale,
      retry,
      refresh: () => fetchSummary({ force: true }),
      getProductBySlug,
      invalidate,
      getByCollection,
      getFeatured,
      getBySlug,
    }),
    [
      allProducts,
      loading,
      error,
      slow,
      isStale,
      retry,
      fetchSummary,
      getProductBySlug,
      invalidate,
      getByCollection,
      getFeatured,
      getBySlug,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

// Hook colocated with provider for storefront consumers.
// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
