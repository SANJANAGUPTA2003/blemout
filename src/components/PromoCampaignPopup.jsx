import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import Button from './ui/Button';
import SmartImage from './ui/SmartImage';

const DISMISS_KEY = 'blemout_promo_popup_dismissed';
const START_KEY = 'blemout_promo_timer_started_at';
const SHOWN_KEY = 'blemout_promo_shown_count';
/** Show at 30s, then 80s, then 120s from first eligible visit. */
const SHOW_AT_MS = [30000, 80000, 120000];

const BLOCKED = ['/cart', '/checkout', '/order-success', '/track-order', '/admin'];

function isBlockedPath(pathname) {
  return BLOCKED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Global storefront promo popup.
 * Session-stable start timestamp. Shows at 30s, then 80s, then 120s if dismissed.
 * Timer starts when the customer first enters an eligible storefront page.
 */
export default function PromoCampaignPopup({ blockedByOther }) {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    const shown = Number(sessionStorage.getItem(SHOWN_KEY) || 0);
    const next = shown + 1;
    sessionStorage.setItem(SHOWN_KEY, String(next));
    if (next >= SHOW_AT_MS.length) {
      sessionStorage.setItem(DISMISS_KEY, '1');
    }
    setReady(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return undefined;
    if (isBlockedPath(location.pathname)) return undefined;

    let startedAt = Number(sessionStorage.getItem(START_KEY) || 0);
    if (!startedAt || Number.isNaN(startedAt)) {
      startedAt = Date.now();
      sessionStorage.setItem(START_KEY, String(startedAt));
    }

    const shown = Number(sessionStorage.getItem(SHOWN_KEY) || 0);
    if (shown >= SHOW_AT_MS.length) {
      sessionStorage.setItem(DISMISS_KEY, '1');
      return undefined;
    }

    const now = Date.now();
    let target = null;
    for (let i = shown; i < SHOW_AT_MS.length; i += 1) {
      const at = startedAt + SHOW_AT_MS[i];
      if (at > now + 40) {
        target = at;
        break;
      }
    }
    if (target == null) return undefined;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
      if (isBlockedPath(window.location.pathname)) return;
      setReady(true);
    }, target - now);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [location.pathname, ready]);

  const eligible =
    ready &&
    typeof window !== 'undefined' &&
    sessionStorage.getItem(DISMISS_KEY) !== '1' &&
    !isBlockedPath(location.pathname) &&
    !blockedByOther;

  useEffect(() => {
    if (!eligible) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [eligible, dismiss]);

  if (!eligible) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      onClick={dismiss}
    >
      <div
      className="relative w-full max-w-lg max-h-[min(92vh,760px)] overflow-y-auto overflow-x-hidden rounded-2xl bg-[#faf9f6] shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2.5 text-[#222222] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          aria-label="Close promotional message"
        >
          <X size={18} />
        </button>
        <div className="bg-[#eef4f2] px-3 pt-3 sm:px-4 sm:pt-4">
          <SmartImage
            src="/promo/glow-through-every-season.png"
            alt="Woman outdoors with glowing skin under summer light"
            role="card"
            width={900}
            height={900}
            loading="lazy"
            sizes="(max-width: 640px) 90vw, 512px"
            className="mx-auto h-auto max-h-[min(52vh,420px)] w-full object-contain object-center"
          />
        </div>
        <div className="px-6 py-8 text-center md:px-9">
          <h2
            id="promo-title"
            className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.03em] text-[#222222]"
          >
            Glow Through Every Season
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#4a5560]">
            Healthy, radiant-looking skin starts with the right skincare routine.
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-[#4a5560]">
            Discover BLEMOUT essentials designed for blemish-prone and dull-looking skin.
          </p>
          <Link to="/limited-picks" onClick={dismiss} className="mt-7 inline-block w-full">
            <Button className="w-full text-[16px] px-8 py-3.5">Explore Collection</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
