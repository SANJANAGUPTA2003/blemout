/**
 * B. Large brand statement — same asset pair as navbar (logo-left + logo-right),
 * oversized on white. No dark badge wrapper.
 */
export default function BrandWordmark({ className = '' }) {
  return (
    <section className={`bg-white overflow-hidden ${className}`}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-12 md:py-16 text-center">
        <p className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-teal font-semibold mb-6 md:mb-8">
          Care for clearer-looking skin
        </p>
        <div
          className="inline-flex items-center justify-center gap-[clamp(12px,2vw,32px)] max-w-full"
          aria-label="BLEMOUT"
        >
          <img
            src="/logo-left.png"
            alt=""
            className="h-[clamp(56px,8vw,140px)] w-auto object-contain shrink-0"
            draggable={false}
          />
          <img
            src="/logo-right.png"
            alt="BLEMOUT"
            className="h-[clamp(48px,7vw,128px)] w-auto max-w-[min(70vw,720px)] object-contain object-left"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
