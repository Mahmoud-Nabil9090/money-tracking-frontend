/**
 * MonthComparisonCard — US-605 — Emerald Dusk Theme
 * Shows Income & Expense difference: This Month vs Last Month
 */
import React from "react";

function calcDiff(current, previous) {
  if (previous === null || previous === undefined) return null;
  const diff    = current - previous;
  const pct     = previous !== 0
    ? Math.round((Math.abs(diff) / previous) * 100 * 10) / 10
    : current > 0 ? 100 : 0;
  return { diff, pct, up: diff >= 0 };
}

function CompareRow({ label, icon, current, previous, invertColor = false }) {
  const result = calcDiff(current, previous);
  const fmt    = (n) => Number(n || 0).toLocaleString("ar-EG");

  const isPositive = result?.up;
  const colorStyle = result === null
    ? "var(--text-tertiary)"
    : invertColor
    ? isPositive ? "var(--status-danger)" : "var(--status-success)"
    : isPositive ? "var(--status-success)" : "var(--status-danger)";

  const arrow = result?.up ? "↑" : "↓";

  return (
    <div
      className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: "var(--border-secondary)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <div>
          <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{label}</p>
          <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            هذا الشهر:{" "}
            <span className="font-mono font-bold" style={{ color: "var(--text-primary)" }}>{fmt(current)} EGP</span>
          </p>
          {previous !== null && previous !== undefined && (
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              الشهر السابق: <span className="font-mono">{fmt(previous)} EGP</span>
            </p>
          )}
        </div>
      </div>

      {result !== null ? (
        <div className="text-left" style={{ color: colorStyle }}>
          <div className="text-base font-extrabold font-mono">
            {arrow} {result.pct}%
          </div>
          <div className="text-[11px] font-bold">
            {result.up ? "+" : "-"}{fmt(Math.abs(result.diff))}
          </div>
        </div>
      ) : (
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>لا توجد بيانات سابقة</span>
      )}
    </div>
  );
}

export default function MonthComparisonCard({ data = {}, loading = false }) {
  const currentIncome   = Number(data?.income?.total   || 0);
  const currentExpenses = Number(data?.expenses?.total || 0);
  const prevIncome      = data?.prev?.income   ? Number(data.prev.income.total)   : null;
  const prevExpenses    = data?.prev?.expenses ? Number(data.prev.expenses.total) : null;
  const netBalance      = currentIncome - currentExpenses;

  if (loading) {
    return (
      <div
        className="rounded-2xl border p-6 animate-pulse space-y-3"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="h-4 w-40 rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-16 w-full rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-16 w-full rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6 transition-all"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: "var(--border-secondary)" }}>
        <div>
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-heading)" }}>
            <span>📊</span>
            <span>هذا الشهر مقابل السابق</span>
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>مقارنة الدخل والمصاريف</p>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold ring-1"
          style={{
            backgroundColor: netBalance >= 0 ? "var(--status-success-bg)" : "var(--status-danger-bg)",
            color: netBalance >= 0 ? "var(--status-success)" : "var(--status-danger)",
            ringColor: netBalance >= 0 ? "var(--status-success-border)" : "var(--status-danger-border)",
          }}
        >
          <span>{netBalance >= 0 ? "✓" : "⚠"}</span>
          <span>
            {netBalance >= 0 ? "+" : ""}
            {Number(netBalance).toLocaleString("ar-EG")} EGP
          </span>
        </div>
      </div>

      {/* Rows */}
      <CompareRow
        label="الدخل"
        icon="📈"
        current={currentIncome}
        previous={prevIncome}
        invertColor={false}
      />
      <CompareRow
        label="المصاريف"
        icon="💸"
        current={currentExpenses}
        previous={prevExpenses}
        invertColor={true}
      />
    </div>
  );
}
