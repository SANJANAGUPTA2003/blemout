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
    primary: 'bg-teal text-white hover:bg-dark-teal',
    secondary:
      'bg-white text-text border border-gray-100 hover:border-light-teal hover:bg-light-teal/30 hover:text-dark-teal',
    outline:
      'border border-teal/30 text-teal hover:bg-teal hover:text-white hover:border-teal',
    ghost: 'text-soft-text hover:text-dark-teal hover:bg-light-teal/40',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-5 py-2 text-xs tracking-wide',
    md: 'px-7 py-3 text-sm tracking-wide',
    lg: 'px-9 py-3.5 text-sm tracking-wide',
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
