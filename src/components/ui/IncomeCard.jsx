import Badge from "../common/Badge";

const recurrenceLabels = {
  once: "Once",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function IncomeCard({
  income,
  onEdit,
  onDelete,
  onDisable,
}) {
  const isRecurring = ["weekly", "monthly", "yearly"].includes(
    income.recurrence
  );

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {income.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {income.receivedDate?.slice(0, 10) || "—"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {Number(income.amount || 0).toLocaleString()}{" "}
            {income.currency || ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {income.recurrence && (
          <Badge tone={isRecurring ? "blue" : "neutral"}>
            {recurrenceLabels[income.recurrence] || income.recurrence}
          </Badge>
        )}

        {isRecurring && (
          <Badge tone={income.isActive === false ? "neutral" : "green"}>
            {income.isActive === false ? "Inactive" : "Active"}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(income)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(income)}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600"
        >
          Delete
        </button>

        {isRecurring && onDisable && income.isActive !== false && (
          <button
            type="button"
            onClick={() => onDisable(income)}
            className="rounded-lg border border-yellow-300 px-3 py-2 text-sm font-medium text-yellow-700"
          >
            Disable
          </button>
        )}
      </div>
    </article>
  );
}