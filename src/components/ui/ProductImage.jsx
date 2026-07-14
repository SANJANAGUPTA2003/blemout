import { useState } from 'react';
import ProductPlaceholder from './ProductPlaceholder';

export default function ProductImage({
  src,
  hoverSrc,
  alt,
  className = '',
  containerClass = '',
  size = 'md',
  fit = 'contain',
}) {
  const [failed, setFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  const canSwapOnHover = Boolean(hoverSrc && hoverSrc !== src && !hoverFailed);
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain';

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
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={`relative z-0 block w-full h-full ${fitClass} transition-all duration-500 ease-out ${
          canSwapOnHover
            ? '[@media(hover:hover)]:group-hover:opacity-0 [@media(hover:hover)]:group-hover:scale-[1.03]'
            : '[@media(hover:hover)]:group-hover:scale-[1.03]'
        } ${className}`}
      />
      {canSwapOnHover && (
        <img
          src={hoverSrc}
          alt=""
          aria-hidden="true"
          onError={() => setHoverFailed(true)}
          className={`absolute z-10 left-0 top-0 w-full h-full border-0 ${fitClass} opacity-0 transition-all duration-500 ease-out [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-[1.03] ${className}`}
        />
      )}
    </div>
  );
}
