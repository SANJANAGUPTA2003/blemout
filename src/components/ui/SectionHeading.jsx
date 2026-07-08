export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-xl mb-14 md:mb-16 ${alignClass} ${className}`}>
      <h2 className="text-2xl md:text-[1.75rem] font-medium text-text tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-soft-text text-sm md:text-[15px] leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
