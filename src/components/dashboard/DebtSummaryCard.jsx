/**
 * DebtSummaryCard — US-604 — Emerald Dusk Theme
 * Consumes GET /api/debts/summary
 */
import React from "react";
import { Link } from "react-router-dom";

const CATEGORY_LABELS = {
  credit_card: "بطاقة ائتمان",
  auto_loan:   "قرض سيارة",
  personal:    "شخصي",
  student:     "تعليمي",
  mortgage:    "عقاري",
  other:       "أخرى",
};

export default function DebtSummaryCard({ summary, loading = false }) {
  const {
    totalRemaining = 0,
    totalDebt      = 0,
    totalPaid      = 0,
    activeCount    = 0,
    overdueCount   = 0,
    progressPct    = 0,
    nearestDue     = null,
    byCategory     = [],
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
        <div className="mt-1 flex items-center gap-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          <span>إجمالي: {fmt(totalDebt)} EGP</span>
          <span>•</span>
          <span style={{ color: "var(--brand-primary)" }}>مدفوع: {fmt(totalPaid)} EGP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span style={{ color: "var(--text-tertiary)" }}>نسبة السداد</span>
          <span className="font-bold" style={{ color: "var(--brand-primary)" }}>{progressPct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, progressPct)}%`,
              background: `linear-gradient(90deg, var(--brand-accent), var(--brand-primary))`,
            }}
          />
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
          ✓ {activeCount} نشط
        </span>
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
      {nearestDue && (
        <div
          className="rounded-xl border p-3"
          style={{
            backgroundColor: "var(--status-warning-bg)",
            borderColor: "var(--status-warning-border)",
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--text-tertiary)" }}>أقرب استحقاق:</span>
            <span
              className="font-bold"
              style={{
                color: nearestDue.status === "overdue" ? "var(--status-danger)" : "var(--brand-accent)",
              }}
            >
              {nearestDue.creditor}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-1">
            <span style={{ color: "var(--text-tertiary)" }}>
              {new Date(nearestDue.dueDate).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "long",
              })}
            </span>
            <span className="font-mono font-bold" style={{ color: "var(--text-primary)" }}>
              {fmt(nearestDue.remainingAmount)} {nearestDue.currency || "EGP"}
            </span>
          </div>
        </div>
      )}

      {/* Category breakdown (mini) */}
      {byCategory.length > 0 && (
        <div className="space-y-2 border-t pt-3" style={{ borderColor: "var(--border-secondary)" }}>
          {byCategory.slice(0, 3).map((cat) => (
            <div key={cat.category} className="flex items-center justify-between text-[11px]">
              <span style={{ color: "var(--text-tertiary)" }}>
                {CATEGORY_LABELS[cat.category] || cat.category}
              </span>
              <span className="font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                {fmt(cat.remaining)} EGP
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
