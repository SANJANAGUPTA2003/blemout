export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl mb-12 md:mb-16 ${alignClass} ${className}`}>
      <h2 className="text-[32px] md:text-[40px] lg:text-[44px] font-bold text-[#222222] tracking-[-0.03em] leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[#4a5560] text-[15px] md:text-[16px] leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
