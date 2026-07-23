export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-teal text-white border border-transparent hover:bg-dark-teal hover:shadow-[0_8px_24px_rgba(45,190,173,0.28)]',
    secondary:
      'bg-white text-text border border-gray-100 hover:border-light-teal hover:bg-light-teal/30 hover:text-dark-teal',
    outline:
      'bg-white text-teal border border-teal hover:bg-[#e8f7f5] hover:text-teal hover:border-teal',
    ghost: 'text-soft-text hover:text-dark-teal hover:bg-light-teal/40',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-[14px] tracking-wide',
    md: 'px-8 py-3.5 text-[15px] md:text-[16px] tracking-wide',
    lg: 'px-10 py-4 text-[16px] md:text-[17px] tracking-wide',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
