function IncomeSummaryTable({ items, currency }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border transition-all duration-200"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Table Header */}
      <div className="flex items-center gap-3 border-b px-6 py-5" style={{ borderColor: "var(--border-primary)" }}>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
        >
          💵
        </div>
        <div>
          <h3 className="text-base font-bold" style={{ color: "var(--text-heading)" }}>
            تفاصيل الدخل
          </h3>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            مصادر الدخل للشهر المحدد
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Head */}
          <thead>
            <tr style={{ backgroundColor: "var(--bg-tertiary)" }}>
              <th
                className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                مصدر الدخل
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                المبلغ
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-3xl mb-3">📭</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                      لا توجد إيرادات مسجلة
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      لا يوجد دخل مسجل لهذا الشهر
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item._id}
                  className="group transition-colors duration-150"
                  style={{ borderBottom: "1px solid var(--border-secondary)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {/* Source */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors"
                        style={{
                          backgroundColor: "var(--brand-primary-light)",
                          color: "var(--brand-primary)",
                        }}
                      >
                        {item.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-left">
                    <span className="font-bold font-mono" style={{ color: "var(--text-heading)" }}>
                      {Number(item.amount).toLocaleString("ar-EG")}
                    </span>
                    <span className="mr-1 text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
                      {currency}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Total */}
          {items.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: "2px solid var(--brand-primary)", backgroundColor: "var(--brand-primary-light)" }}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }} />
                    <span className="font-bold" style={{ color: "var(--text-heading)" }}>
                      إجمالي الدخل
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-left">
                  <span className="text-lg font-extrabold font-mono" style={{ color: "var(--brand-primary)" }}>
                    {Number(
                      items.reduce(
                        (sum, item) => sum + Number(item.amount),
                        0
                      )
                    ).toLocaleString("ar-EG")}
                  </span>
                  <span className="mr-1 text-sm font-bold" style={{ color: "var(--brand-primary)" }}>
                    {currency}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 w-full" style={{ backgroundColor: "var(--brand-primary)" }} />
    </div>
  );
}

export default IncomeSummaryTable;