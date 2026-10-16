const months = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function IncomeFilters({
  month,
  year,
  onMonthChange,
  onYearChange,
}) {
  const years = [];

  for (let i = 2020; i <= 2030; i++) {
    years.push(i);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      {/* Month Card */}
      <div
        className="group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
          >
            📅
          </div>

          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-heading)" }}>
              الشهر
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              اختر الشهر
            </p>
          </div>
        </div>

        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="w-full cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
          style={{
            backgroundColor: "var(--bg-input)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        >
          {months.map((monthName, index) => (
            <option key={monthName} value={index + 1}>
              {monthName}
            </option>
          ))}
        </select>
      </div>

      {/* Year Card */}
      <div
        className="group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            📆
          </div>

          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-heading)" }}>
              السنة
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              اختر السنة
            </p>
          </div>
        </div>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-full cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
          style={{
            backgroundColor: "var(--bg-input)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        >
          {years.map((yearValue) => (
            <option key={yearValue} value={yearValue}>
              {yearValue}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default IncomeFilters;