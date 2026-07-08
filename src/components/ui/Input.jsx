export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-text text-sm placeholder:text-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-light-teal transition-colors ${
          error ? 'border-red-400' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
