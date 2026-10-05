export default function ConfirmDialog({
  open,
  title = "هل أنت متأكد؟",
  children,
  busy = false,
  error = "",
  confirmText = "حذف",
  cancelText = "إلغاء",
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <h2
          id="confirm-dialog-title"
          className="mb-3 text-lg font-bold text-slate-900 dark:text-white"
        >
          {title}
        </h2>

        {children && (
          <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            {children}
          </div>
        )}

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
          >
            {busy ? "جاري الحذف..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}