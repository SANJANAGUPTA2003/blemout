import { useState } from 'react';
import ProductPlaceholder from './ProductPlaceholder';

export default function ProductImage({
  src,
  alt,
  className = '',
  containerClass = '',
  size = 'md',
}) {
  const [failed, setFailed] = useState(false);

  const heights = {
    sm: 'h-48',
    md: 'h-72',
    lg: 'h-80',
    xl: 'h-[28rem]',
  };

  if (!src || failed) {
    return <ProductPlaceholder size={size} className={containerClass} />;
  }

  return (
    <div
      className={`${heights[size]} w-full bg-mint-strong/20 flex items-center justify-center overflow-hidden ${containerClass}`}
    >
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={`max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06] ${className}`}
      />
    </div>
  );
}
