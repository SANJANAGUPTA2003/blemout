import Button from './Button';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Keep Order',
  loadingLabel = 'Cancelling...',
  confirmDisabled = false,
  onConfirm,
  onCancel,
  loading = false,
  children,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-[22px] font-bold tracking-[-0.03em] text-[#222222]">
          {title}
        </h2>
        {message && (
          <p className="mt-3 text-[15px] leading-relaxed text-[#4a5560] md:text-[16px]">{message}</p>
        )}
        {children}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            className="w-full sm:w-auto"
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
          >
            {loading ? loadingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
