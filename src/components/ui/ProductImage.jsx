import { memo, useEffect, useRef, useState } from 'react';
import ProductPlaceholder from './ProductPlaceholder';
import { getResponsiveImage } from '../../data/productImages';

function ProductImage({
  src,
  hoverSrc,
  alt,
  className = '',
  containerClass = '',
  size = 'md',
  fit = 'contain',
  role = 'card',
  sizes = '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px',
  loading = 'lazy',
  fetchPriority = 'auto',
  width = 640,
  height = 640,
}) {
  const [failed, setFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);
  const [hoverReady, setHoverReady] = useState(false);
  const wrapRef = useRef(null);

  const canSwapOnHover = Boolean(hoverSrc && hoverSrc !== src && !hoverFailed);
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain';
  const primary = getResponsiveImage(src, role);
  const hover = getResponsiveImage(hoverSrc, role);

  useEffect(() => {
    if (!canSwapOnHover) return undefined;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHoverReady(true);
      },
      { rootMargin: '48px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canSwapOnHover]);

  if (!src || failed) {
    return (
      <div
        className={`relative w-full overflow-hidden border-0 bg-transparent ${
          containerClass.includes('aspect-') ? '' : 'aspect-square'
        } ${containerClass}`}
      >
        <ProductPlaceholder size={size} className="h-full rounded-none" />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden border-0 bg-transparent ${
        containerClass.includes('aspect-') ? '' : 'aspect-square'
      } ${containerClass}`}
      onPointerEnter={() => {
        if (canSwapOnHover) setHoverReady(true);
      }}
    >
      <picture>
        {primary.srcSet && <source type="image/webp" srcSet={primary.srcSet} sizes={sizes} />}
        <img
          src={primary.webpSrc || primary.src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onError={() => setFailed(true)}
          className={`relative z-0 block h-full w-full ${fitClass} transition-opacity duration-400 ease-out ${
            canSwapOnHover ? '[@media(hover:hover)]:group-hover:opacity-0' : ''
          } ${className}`}
        />
      </picture>
      {canSwapOnHover && hoverReady && (
        <picture>
          {hover.srcSet && <source type="image/webp" srcSet={hover.srcSet} sizes={sizes} />}
          <img
            src={hover.webpSrc || hover.src}
            alt=""
            aria-hidden="true"
            width={width}
            height={height}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            onError={() => setHoverFailed(true)}
            className={`absolute z-10 left-0 top-0 h-full w-full border-0 ${fitClass} opacity-0 transition-opacity duration-400 ease-out [@media(hover:hover)]:group-hover:opacity-100 ${className}`}
          />
        </picture>
      )}
    </div>
  );
}

export default memo(ProductImage);
