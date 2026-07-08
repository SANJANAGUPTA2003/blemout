import Button from './Button';

export default function ApiMessage({
  type = 'error',
  message,
  onRetry,
  className = '',
}) {
  const styles = {
    error: 'bg-red-50 text-red-600 border-red-100',
    empty: 'bg-ivory text-soft-text border-gray-100',
    offline: 'bg-ivory text-soft-text border-gray-100',
  };

  return (
    <div className={`text-center py-20 px-6 ${className}`}>
      <div className={`inline-block rounded-2xl border px-8 py-6 max-w-md ${styles[type]}`}>
        <p className="text-sm leading-relaxed">{message}</p>
        {onRetry && (
          <Button size="sm" className="mt-4" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
