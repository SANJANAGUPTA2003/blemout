import { Droplets } from 'lucide-react';

export default function ProductPlaceholder({ className = '', size = 'md' }) {
  const sizes = {
    sm: 'h-48',
    md: 'h-72',
    lg: 'h-80',
    xl: 'h-[28rem]',
  };

  return (
    <div
      className={`${sizes[size]} w-full border-0 bg-transparent flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-mid-teal/40">
        <Droplets size={size === 'sm' ? 20 : 28} strokeWidth={1.5} />
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-soft-text">BLEMOUT</span>
      </div>
    </div>
  );
}
