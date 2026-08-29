export default function BrandWordmark({ className = '' }) {
  return (
    <section className={`overflow-hidden bg-white ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 py-14 text-center md:px-8 md:py-16 lg:px-10">
        <p className="mb-6 text-[12px] font-bold uppercase tracking-[0.18em] text-[#4f9fc4] md:mb-8 md:text-[13px]">
          Science Behind the Care
        </p>
        <div
          className="inline-flex max-w-full items-center justify-center gap-[clamp(12px,2vw,32px)]"
          aria-label="BLEMOUT"
        >
          <img
            src="/logo-left.png"
            alt=""
            className="h-[clamp(56px,8vw,140px)] w-auto shrink-0 object-contain"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
          <img
            src="/logo-right.png"
            alt="BLEMOUT"
            className="h-[clamp(48px,7vw,128px)] w-auto max-w-[min(70vw,720px)] object-contain object-left"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
