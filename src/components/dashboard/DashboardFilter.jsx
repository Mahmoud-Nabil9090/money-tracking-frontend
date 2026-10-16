/**
 * DashboardFilter — US-606 — Emerald Dusk Theme
 * Global filter: This Month | Previous Month | Last 3 Months | Custom
 * Emits { period, fromDate?, toDate? } to parent via onChange
 */
import React, { useState } from "react";

const PRESETS = [
  { key: "month",      label: "هذا الشهر" },
  { key: "last_month", label: "الشهر السابق" },
  { key: "3months",    label: "آخر 3 أشهر" },
  { key: "custom",     label: "مخصص" },
];

export default function DashboardFilter({ value = "month", onChange }) {
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = (key) => {
    if (key === "custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onChange({ period: key });
    }
  };

  const applyCustom = () => {
    if (!customFrom || !customTo) return;
    onChange({ period: "custom", fromDate: customFrom, toDate: customTo });
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Preset tabs */}
      <div
        className="inline-flex items-center gap-1 rounded-xl p-1 ring-1 text-xs"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          ringColor: "var(--border-primary)",
        }}
      >
        {PRESETS.map((p) => {
          const isActive = value === p.key && !(p.key === "custom" && !showCustom);
          const isCustomActive = p.key === "custom" && showCustom;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => handlePreset(p.key)}
              className="rounded-lg px-3 py-1.5 font-bold transition-all"
              style={{
                backgroundColor: isActive || isCustomActive ? "var(--brand-primary)" : "transparent",
                color: isActive || isCustomActive ? "#fff" : "var(--text-tertiary)",
                boxShadow: isActive || isCustomActive ? "var(--shadow-sm)" : "none",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom date range */}
      {showCustom && (
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-2"
          style={{
            borderColor: "var(--border-primary)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="bg-transparent text-xs outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>←</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="bg-transparent text-xs outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <button
            type="button"
            onClick={applyCustom}
            disabled={!customFrom || !customTo}
            className="rounded-lg px-3 py-1 text-xs font-bold text-white transition disabled:opacity-40"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            تطبيق
          </button>
        </div>
      )}
    </div>
  );
}
