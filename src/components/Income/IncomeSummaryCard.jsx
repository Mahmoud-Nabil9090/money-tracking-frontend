function IncomeSummaryCard({ total, currency }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center justify-between p-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
          >
            💰
          </div>

          {/* Title */}
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
              إجمالي الدخل
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
              إجمالي الدخل للفترة المحددة
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="text-left">
          <div className="text-2xl font-extrabold tracking-tight font-mono sm:text-3xl" style={{ color: "var(--text-heading)" }}>
            {Number(total).toLocaleString("ar-EG")}
          </div>
          <div className="mt-1 text-sm font-bold" style={{ color: "var(--brand-primary)" }}>
            {currency}
          </div>
        </div>
      </div>

      {/* Green Bottom Accent */}
      <div className="h-1 w-full" style={{ backgroundColor: "var(--brand-primary)" }} />
    </div>
  );
}

export default IncomeSummaryCard;
