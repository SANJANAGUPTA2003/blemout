import { getResponsiveImage } from '../../data/productImages';

export default function SmartImage({
  src,
  alt,
  role = 'card',
  sizes = '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px',
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  width,
  height,
  className = '',
  draggable = false,
  style,
  onError,
}) {
  const image = getResponsiveImage(src, role);
  const imgSrc = image.webpSrc || image.src || src;

  return (
    <picture>
      {image.srcSet ? (
        <source type="image/webp" srcSet={image.srcSet} sizes={sizes} />
      ) : null}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        draggable={draggable}
        className={className}
        style={style}
        onError={onError}
      />
    </picture>
  );
}
