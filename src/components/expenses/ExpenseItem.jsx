import React from "react";

const TYPE_CONFIG = {
  daily: {
    label: "يومي (Daily)",
    style: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60",
    icon: "📅",
  },
  fixed: {
    label: "شهري ثابت (Fixed)",
    style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60",
    icon: "📌",
  },
  emergency: {
    label: "طارئ (Emergency)",
    style: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60",
    icon: "🚨",
  },
};

const ACCOUNT_TYPE_ICONS = {
  bank: "🏦",
  wallet: "📱",
  cash: "💵",
};

export default function ExpenseItem({
  expense,
  categoryName,
  accountInfo,
  onEdit,
  onDelete,
}) {
  const amount = Number(expense.amount || 0);
  const typeKey = String(expense.expenseType || expense.type || "").toLowerCase();
  const typeDetails = TYPE_CONFIG[typeKey] || {
    label: expense.expenseType || "مصروف",
    style: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
    icon: "💸",
  };

  const formattedDate = expense.date
    ? new Date(expense.date).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const accName = accountInfo?.name || expense.account?.name || "";
  const accType = accountInfo?.type || expense.account?.type || "";
  const accColor = accountInfo?.color || expense.account?.color || "#0d9488";
  const accIcon = ACCOUNT_TYPE_ICONS[accType] || "💳";

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Header: Description & Amount */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              {expense.description || "بدون وصف"}
            </h3>
            <span className="mt-1 inline-block text-xs font-medium text-slate-400 dark:text-slate-500">
              📅 {formattedDate}
            </span>
          </div>

          <div className="text-left font-mono font-extrabold text-slate-900 dark:text-white">
            <span className="text-xl text-rose-600 dark:text-rose-400">
              -{amount.toLocaleString()}
            </span>{" "}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {expense.currency || "EGP"}
            </span>
          </div>
        </div>

        {/* Badges: Type, Category, Account */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Type Badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeDetails.style}`}
          >
            <span>{typeDetails.icon}</span>
            <span>{typeDetails.label}</span>
          </span>

          {/* Category Badge */}
          {categoryName && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <span>🏷️</span>
              <span>{categoryName}</span>
            </span>
          )}

          {/* Account Badge */}
          {accName && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
              style={{
                borderColor: `${accColor}40`,
                backgroundColor: `${accColor}12`,
                color: accColor,
              }}
            >
              <span>{accIcon}</span>
              <span>{accName}</span>
            </span>
          )}
        </div>

        {/* Notes if present */}
        {expense.notes && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            📝 {expense.notes}
          </p>
        )}
      </div>

      {/* Actions (US-205) */}
      <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => onEdit?.(expense)}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400"
        >
          <span>✏️</span>
          <span>تعديل</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(expense)}
          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
        >
          <span>🗑️</span>
          <span>حذف</span>
        </button>
      </div>
    </article>
  );
}
