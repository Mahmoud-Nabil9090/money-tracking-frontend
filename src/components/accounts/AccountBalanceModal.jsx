import { useState, useId } from "react";

function AccountBalanceModal({
  account,
  isOpen,
  onClose,
  onSave,
  saving = false,
  error = "",
}) {
  const [newBalance, setNewBalance] = useState(() => String(account?.balance ?? ""));
  const [notes, setNotes] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const newBalanceId = useId();
  const notesId = useId();

  // Current balance and currency
  const currentBalance = Number(account?.balance ?? 0);
  const currency = account?.currency || "EGP";

  if (!isOpen) {
    return null;
  }

  const parsedNewBalance = Number(newBalance);
  const isValidNumber = newBalance !== "" && !Number.isNaN(parsedNewBalance);
  const diff = isValidNumber ? parsedNewBalance - currentBalance : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidNumber) {
      return;
    }

    const res = await onSave({
      newBalance: parsedNewBalance,
      notes: notes.trim(),
    });

    if (res !== false) {
      setLocalSuccess("تم تعديل الرصيد بنجاح");
      setTimeout(() => {
        setLocalSuccess("");
        onClose();
      }, 1000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              تعديل الرصيد يدوياً (US-302)
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {account?.name} • {account?.type}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* عرض الرصيد القديم والرصيد الجديد */}
        <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <div className="border-r border-slate-200 pr-3 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              الرصيد القديم
            </span>
            <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
              {currentBalance.toLocaleString()} {currency}
            </p>
          </div>

          <div className="pl-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              الرصيد الجديد
            </span>
            <p
              className={`mt-1 text-base font-bold ${
                isValidNumber
                  ? parsedNewBalance < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              {isValidNumber ? parsedNewBalance.toLocaleString() : "—"}{" "}
              {currency}
            </p>
            {isValidNumber && diff !== 0 && (
              <span className="text-[11px] font-semibold text-slate-400">
                {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor={newBalanceId}
              className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              الرصيد الجديد (New Balance) <span className="text-red-500">*</span>
            </label>
            <input
              id={newBalanceId}
              type="number"
              step="any"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950/40"
              required
            />
          </div>

          <div>
            <label
              htmlFor={notesId}
              className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              ملاحظة / سبب التعديل (Notes)
            </label>
            <textarea
              id={notesId}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="اكتب سبب تعديل الرصيد (اختياري)..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950/40"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
              ⚠️ {error}
            </div>
          )}

          {localSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
              ✓ {localSuccess}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={saving || !isValidNumber}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>جاري التعديل...</span>
                </>
              ) : (
                "تأكيد وتعديل الرصيد"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountBalanceModal;
