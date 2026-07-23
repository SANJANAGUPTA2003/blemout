import { useMemo } from 'react';

const MESSAGES = [
  'FREE SHIPPING ON SELECTED ORDERS',
  'STEROID-FREE FORMULATIONS',
  'SECURE PAYMENTS',
  'CASH ON DELIVERY AVAILABLE',
  'SKINCARE MADE FOR EVERYDAY CONCERNS',
];

export default function AnnouncementBar() {
  const loop = useMemo(() => [...MESSAGES, ...MESSAGES], []);

  return (
    <div
      className="announcement-bar bg-teal text-white overflow-hidden"
      role="region"
      aria-label="Site announcements"
    >
      <div className="announcement-marquee flex w-max whitespace-nowrap py-2.5 will-change-transform">
        {loop.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="inline-flex items-center px-6 md:px-10 text-[11px] md:text-[12px] tracking-[0.14em] font-semibold uppercase"
          >
            <span>{message}</span>
            <span className="mx-6 md:mx-10 opacity-50" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
