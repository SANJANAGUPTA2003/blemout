import { formatPrice } from '../../utils/format';

/**
 * Shared product pricing: selling (largest/black) → struck MRP → teal % OFF.
 */
export default function PriceDisplay({ sellingPrice, mrp, discount = 0, size = 'card' }) {
  const isPdp = size === 'pdp';

  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
      <span
        className={
          isPdp
            ? 'text-[28px] font-bold leading-none text-[#111111] md:text-[32px]'
            : 'text-[20px] font-bold leading-none text-[#111111] md:text-[22px]'
        }
      >
        {formatPrice(sellingPrice)}
      </span>
      {mrp ? (
        <span
          className={
            isPdp
              ? 'text-[14px] leading-none text-[#8a939b] line-through md:text-[15px]'
              : 'text-[12px] leading-none text-[#8a939b] line-through md:text-[13px]'
          }
        >
          {formatPrice(mrp)} MRP
        </span>
      ) : null}
      {discount > 0 ? (
        <span
          className={
            isPdp
              ? 'text-[13px] font-semibold leading-none text-teal md:text-[14px]'
              : 'text-[12px] font-semibold leading-none text-teal'
          }
        >
          {discount}% OFF
        </span>
      ) : null}
    </div>
  );
}
