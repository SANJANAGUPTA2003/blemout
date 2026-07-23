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
      <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold text-[#222222] tracking-[-0.03em] leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[#4a5560] text-[16px] md:text-[18px] leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
