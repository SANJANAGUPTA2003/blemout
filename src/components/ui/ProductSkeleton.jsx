export default function ProductSkeleton({ count = 3, className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-12 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="animate-pulse">
          <div className="aspect-square w-full rounded-sm bg-[#eef2f1]" />
          <div className="mt-4 mx-auto h-4 w-3/4 rounded bg-[#e8eceb]" />
          <div className="mt-3 mx-auto h-3 w-1/2 rounded bg-[#eef2f1]" />
          <div className="mt-3 mx-auto h-4 w-1/3 rounded bg-[#e8eceb]" />
        </div>
      ))}
    </div>
  );
}

export function CarouselSkeleton({ count = 3 }) {
  return (
    <section className="relative py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 mb-10 md:mb-12">
        <div className="h-10 w-56 rounded bg-[#eef2f1] animate-pulse" />
        <div className="mt-4 h-4 w-80 max-w-full rounded bg-[#e8eceb] animate-pulse" />
      </div>
      <div className="flex gap-6 md:gap-8 overflow-hidden px-5 md:px-8 lg:px-10">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`carousel-skeleton-${index}`}
            className="shrink-0 w-[82vw] sm:w-[46vw] lg:w-[min(420px,calc((100vw-6rem)/3))] animate-pulse"
          >
            <div className="aspect-square w-full rounded-sm bg-[#eef2f1]" />
            <div className="mt-4 mx-auto h-4 w-3/4 rounded bg-[#e8eceb]" />
            <div className="mt-3 mx-auto h-3 w-1/2 rounded bg-[#eef2f1]" />
          </div>
        ))}
      </div>
    </section>
  );
}
