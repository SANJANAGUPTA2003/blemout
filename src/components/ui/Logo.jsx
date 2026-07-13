import { Link } from 'react-router-dom';

function LogoImage({ src, alt, className }) {
  return <img src={src} alt={alt} className={className} draggable={false} />;
}

function goHomeTop(e) {
  if (window.location.pathname === '/') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export default function Logo({ className = '', variant = 'navbar' }) {
  // A. Navbar — complete official icon + wordmark
  if (variant === 'navbar') {
    return (
      <Link
        to="/"
        onClick={goHomeTop}
        className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}
        aria-label="BLEMOUT home"
        style={{ width: 'clamp(140px, 28vw, 220px)' }}
      >
        <LogoImage
          src="/logo-left.png"
          alt=""
          className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 object-contain shrink-0"
        />
        <LogoImage
          src="/logo-right.png"
          alt="BLEMOUT"
          className="h-7 sm:h-8 md:h-9 w-auto flex-1 min-w-0 object-contain object-left"
        />
      </Link>
    );
  }

  // C. Footer — smaller complete logo unit (clean wordmark for white bg)
  if (variant === 'footer') {
    return (
      <Link
        to="/"
        onClick={goHomeTop}
        className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}
        aria-label="BLEMOUT home"
      >
        <LogoImage
          src="/logo-left.png"
          alt=""
          className="h-9 w-9 md:h-10 md:w-10 object-contain shrink-0"
        />
        <LogoImage
          src="/logo-right.png"
          alt="BLEMOUT"
          className="h-7 md:h-8 w-auto max-w-[11rem] object-contain object-left"
        />
      </Link>
    );
  }

  return (
    <Link to="/" onClick={goHomeTop} className={`inline-flex items-center gap-2.5 shrink-0 ${className}`} aria-label="BLEMOUT home">
      <LogoImage
        src="/logo-left.png"
        alt=""
        className="h-8 w-8 object-contain shrink-0"
      />
      <LogoImage
        src="/logo-right.png"
        alt="BLEMOUT"
        className="h-7 w-auto max-w-[10rem] object-contain object-left"
      />
    </Link>
  );
}
