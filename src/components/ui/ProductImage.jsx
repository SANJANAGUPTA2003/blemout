import { useState } from 'react';
import ProductPlaceholder from './ProductPlaceholder';

export default function ProductImage({
  src,
  hoverSrc,
  alt,
  className = '',
  containerClass = '',
  size = 'md',
  compact = false,
}) {
  const [failed, setFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  const pads = compact
    ? { sm: 'p-2', md: 'p-3', lg: 'p-3 md:p-4', xl: 'p-4' }
    : { sm: 'p-3', md: 'p-5', lg: 'p-6 md:p-8', xl: 'p-8' };
  const canSwapOnHover = Boolean(hoverSrc && hoverSrc !== src && !hoverFailed);
  const padClass = pads[size] || pads.md;

  if (!src || failed) {
    return (
      <div className={`aspect-square w-full bg-[#f5f8f7] ${containerClass}`}>
        <ProductPlaceholder size={size} className="h-full rounded-none" />
      </div>
    );
  }

  return (
    <div
      className={`aspect-square w-full relative bg-[#f5f8f7] flex items-center justify-center overflow-hidden transition-colors duration-500 [@media(hover:hover)]:group-hover:bg-[#e8f4f2] ${padClass} ${containerClass}`}
    >
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={`w-full h-full object-contain transition-all duration-500 ease-out ${
          canSwapOnHover
            ? '[@media(hover:hover)]:group-hover:opacity-0 [@media(hover:hover)]:group-hover:scale-[1.04]'
            : '[@media(hover:hover)]:group-hover:scale-[1.04]'
        } ${className}`}
      />
      {canSwapOnHover && (
        <img
          src={hoverSrc}
          alt=""
          aria-hidden="true"
          onError={() => setHoverFailed(true)}
          className={`absolute inset-0 m-auto ${compact ? 'w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)]' : 'w-[calc(100%-2.5rem)] h-[calc(100%-2.5rem)]'} object-contain opacity-0 transition-all duration-500 ease-out [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-[1.04] ${className}`}
        />
      )}
    </div>
  );
}
