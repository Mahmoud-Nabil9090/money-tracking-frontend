/**
 * DebtSummaryCard — US-604 — Emerald Dusk Theme
 * Consumes GET /api/debts/summary
 */
import { Link } from "react-router-dom";

export default function DebtSummaryCard({ summary, loading = false }) {
  const {
    totalRemaining = 0,
    activeCount    = 0,
    overdueCount   = 0,
    dueSoonCount   = 0,
    nearestDueDate = null,
    nearestDueStatus = null,
    estimatedSettlementDate = null,
    needsMorePayments = false,
    message = "",
  } = summary || {};

  const fmt = (n) => Number(n || 0).toLocaleString("ar-EG");

  if (loading) {
    return (
      <div
        className="rounded-2xl border p-6 animate-pulse"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="h-4 w-32 rounded mb-4" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-8 w-48 rounded mb-2" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6 flex flex-col gap-4 transition-all"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-heading)" }}>
            <span>💳</span>
            <span>ملخص الديون</span>
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>إجمالي الالتزامات المالية</p>
        </div>
        <Link
          to="/debts"
          className="text-xs font-bold hover:underline"
          style={{ color: "var(--brand-accent)" }}
        >
          إدارة الديون ←
        </Link>
      </div>

      {/* Main amount */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-extrabold" style={{ color: "var(--brand-accent)" }}>
            {fmt(totalRemaining)}
          </span>
          <span className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>EGP متبقي</span>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold ring-1"
          style={{
            backgroundColor: "var(--status-info-bg)",
            color: "var(--status-info)",
            ringColor: "var(--status-info-border)",
          }}
        >
          ✓ {activeCount} غير مكتمل
        </span>
        {dueSoonCount > 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold ring-1"
            style={{
              backgroundColor: "var(--status-warning-bg)",
              color: "var(--status-warning)",
              ringColor: "var(--status-warning-border)",
            }}
          >
            ◷ {dueSoonCount} قريب الاستحقاق
          </span>
        )}
        {overdueCount > 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold ring-1 animate-pulse"
            style={{
              backgroundColor: "var(--status-danger-bg)",
              color: "var(--status-danger)",
              ringColor: "var(--status-danger-border)",
            }}
          >
            ⚠ {overdueCount} متأخر
          </span>
        )}
      </div>

      {/* Nearest due */}
      {nearestDueDate && (
        <div
          className="rounded-xl border p-3"
          style={{
            backgroundColor: nearestDueStatus === "overdue"
              ? "var(--status-danger-bg)"
              : "var(--status-warning-bg)",
            borderColor: nearestDueStatus === "overdue"
              ? "var(--status-danger-border)"
              : "var(--status-warning-border)",
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--text-tertiary)" }}>أقرب استحقاق:</span>
            <span
              className="font-bold"
              style={{
                color: nearestDueStatus === "overdue"
                  ? "var(--status-danger)"
                  : "var(--brand-accent)",
              }}
            >
              {new Date(nearestDueDate).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {needsMorePayments ? (
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {message || "أضف دفعات أكثر لحساب التوقع"}
        </p>
      ) : estimatedSettlementDate ? (
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          موعد السداد المتوقع:{" "}
          <strong>{new Date(estimatedSettlementDate).toLocaleDateString("ar-EG")}</strong>
        </p>
      ) : (
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          لا توجد ديون غير مكتملة.
        </p>
      )}
    </div>
  );
}
