import { memo, useState } from 'react';
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
  sizes = '(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 420px',
  loading = 'lazy',
  fetchPriority = 'auto',
  width = 900,
  height = 900,
}) {
  const [failed, setFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  const canSwapOnHover = Boolean(hoverSrc && hoverSrc !== src && !hoverFailed);
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain';
  const primary = getResponsiveImage(src, role);
  const hover = getResponsiveImage(hoverSrc, role);

  if (!src || failed) {
    return (
      <div className={`aspect-square w-full overflow-hidden border-0 bg-transparent ${containerClass}`}>
        <ProductPlaceholder size={size} className="h-full rounded-none" />
      </div>
    );
  }

  return (
    <div
      className={`aspect-square w-full relative overflow-hidden border-0 bg-transparent ${containerClass}`}
    >
      {/* Hover layer is mounted immediately so the colourful image is cached before first hover */}
      <picture>
        {primary.srcSet && <source type="image/webp" srcSet={primary.srcSet} sizes={sizes} />}
        <img
          src={primary.src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onError={() => setFailed(true)}
          className={`relative z-0 block w-full h-full ${fitClass} transition-opacity duration-400 ease-out ${
            canSwapOnHover ? '[@media(hover:hover)]:group-hover:opacity-0' : ''
          } ${className}`}
        />
      </picture>
      {canSwapOnHover && (
        <picture>
          {hover.srcSet && <source type="image/webp" srcSet={hover.srcSet} sizes={sizes} />}
          <img
            src={hover.src}
            alt=""
            aria-hidden="true"
            width={width}
            height={height}
            loading="eager"
            decoding="async"
            onError={() => setHoverFailed(true)}
            className={`absolute z-10 left-0 top-0 w-full h-full border-0 ${fitClass} opacity-0 transition-opacity duration-400 ease-out [@media(hover:hover)]:group-hover:opacity-100 ${className}`}
          />
        </picture>
      )}
    </div>
  );
}

export default memo(ProductImage);
