const typeStyles = {
  daily: "bg-slate-100 text-slate-700",
  fixed: "bg-amber-100 text-amber-700",
  emergency: "bg-red-100 text-red-700",
};

const typeLabels = {
  daily: "Daily",
  fixed: "Fixed Monthly",
  emergency: "Emergency",
};

export default function ExpenseItem({
  expense,
  categoryName,
  accountName,
  onEdit,
  onDelete,
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            {expense.description || "Expense"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {expense.date?.slice(0, 10) || "—"}
          </p>
        </div>

        <p className="text-lg font-bold text-slate-900">
          {Number(expense.amount || 0).toLocaleString()}{" "}
          {expense.currency || "EGP"}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            typeStyles[expense.expenseType] ||
            "bg-slate-100 text-slate-700"
          }`}
        >
          {typeLabels[expense.expenseType] ||
            expense.expenseType ||
            "Unknown"}
        </span>

        {categoryName && (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
            {categoryName}
          </span>
        )}

        {accountName && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {accountName}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(expense)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(expense)}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
