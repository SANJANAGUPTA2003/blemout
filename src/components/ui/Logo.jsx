import { useState } from 'react';
import { Link } from 'react-router-dom';

function LogoImage({ src, alt, className, onError }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={onError}
      className={className}
      draggable={false}
    />
  );
}

export default function Logo({ className = '', variant = 'wordmark' }) {
  const [fullFailed, setFullFailed] = useState(false);
  const [wordmarkFailed, setWordmarkFailed] = useState(false);

  const fullSrc = fullFailed ? '/logo.svg' : '/logo-full.png';
  const wordmarkSrc = wordmarkFailed ? '/logo.svg' : '/logo-wordmark.png';

  if (variant === 'navbar') {
    return (
      <Link
        to="/"
        className={`inline-flex items-center gap-2 sm:gap-3 shrink-0 ${className}`}
        aria-label="BLEMOUT home"
      >
        <LogoImage
          src={wordmarkSrc}
          alt="BLEMOUT"
          onError={() => setWordmarkFailed(true)}
          className="h-7 w-auto sm:h-8 md:h-9 max-w-[8.5rem] sm:max-w-[10rem] object-contain object-left"
        />
        <LogoImage
          src={fullSrc}
          alt=""
          onError={() => setFullFailed(true)}
          className="h-11 w-auto sm:h-12 md:h-14 max-w-[4.5rem] sm:max-w-[5.25rem] md:max-w-[6rem] object-contain object-left"
        />
      </Link>
    );
  }

  const src = variant === 'full' ? fullSrc : wordmarkSrc;
  const heightClass =
    variant === 'full'
      ? 'h-9 w-auto sm:h-10 md:h-11 max-w-[12rem] sm:max-w-[14rem]'
      : 'h-7 w-auto sm:h-8 md:h-9 max-w-[10rem] sm:max-w-[11rem]';

  return (
    <Link to="/" className={`inline-flex items-center shrink-0 ${className}`} aria-label="BLEMOUT home">
      <LogoImage
        src={src}
        alt="BLEMOUT"
        onError={() => (variant === 'full' ? setFullFailed(true) : setWordmarkFailed(true))}
        className={`${heightClass} object-contain object-left`}
      />
    </Link>
  );
}
