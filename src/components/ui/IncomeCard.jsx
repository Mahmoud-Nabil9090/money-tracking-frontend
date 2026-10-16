import Badge from "../common/Badge";

const recurrenceLabels = {
  once: "مرة واحدة",
  weekly: "أسبوعي",
  monthly: "شهري",
  yearly: "سنوي",
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
    <article
      className="rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
            {income.name}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            {income.receivedDate?.slice(0, 10) || "—"}
          </p>
        </div>

        <div className="text-left">
          <p className="text-lg font-extrabold font-mono" style={{ color: "var(--brand-primary)" }}>
            {Number(income.amount || 0).toLocaleString("ar-EG")}{" "}
            <span className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>
              {income.currency || "EGP"}
            </span>
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
            {income.isActive === false ? "غير نشط" : "نشط"}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "var(--border-secondary)" }}>
        <button
          type="button"
          onClick={() => onEdit?.(income)}
          className="rounded-lg border px-3 py-2 text-xs font-bold transition-colors"
          style={{
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-card)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-primary)"; e.currentTarget.style.color = "var(--brand-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-primary)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          ✏️ تعديل
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(income)}
          className="rounded-lg border px-3 py-2 text-xs font-bold transition-colors"
          style={{
            borderColor: "var(--status-danger-border)",
            color: "var(--status-danger)",
            backgroundColor: "var(--status-danger-bg)",
          }}
        >
          🗑️ حذف
        </button>

        {isRecurring && onDisable && income.isActive !== false && (
          <button
            type="button"
            onClick={() => onDisable(income)}
            className="rounded-lg border px-3 py-2 text-xs font-bold transition-colors"
            style={{
              borderColor: "var(--status-warning-border)",
              color: "var(--status-warning)",
              backgroundColor: "var(--status-warning-bg)",
            }}
          >
            ⏸️ تعطيل
          </button>
        )}
      </div>
    </article>
  );
}