export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex justify-center py-24 ${className}`}>
      <div className="w-7 h-7 border-2 border-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
