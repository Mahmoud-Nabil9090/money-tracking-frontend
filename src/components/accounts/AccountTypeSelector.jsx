import React from "react";

const ACCOUNT_TYPES = [
  {
    id: "bank",
    name: "Bank (حساب بنكي)",
    icon: "🏦",
    desc: "حساب جاري، توفير، أو بطاقة ائتمانية",
    activeColor: "border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-100 dark:ring-blue-400",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  },
  {
    id: "wallet",
    name: "Wallet (محفظة إلكترونية)",
    icon: "📱",
    desc: "فودافون كاش، إنستاباي، باي بال، محفظة رقمية",
    activeColor: "border-purple-500 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500 dark:border-purple-500 dark:bg-purple-950/40 dark:text-purple-100 dark:ring-purple-400",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
  },
  {
    id: "cash",
    name: "Cash (نقدية / كاش)",
    icon: "💵",
    desc: "أموال نقدية بيدك، الخزينة الشخصية، مصروف الجيب",
    activeColor: "border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-400",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
  },
];

export default function AccountTypeSelector({ value, onChange, disabled = false, error = "" }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ACCOUNT_TYPES.map((type) => {
          const isSelected = value === type.id;
          return (
            <button
              type="button"
              key={type.id}
              disabled={disabled}
              onClick={() => onChange(type.id)}
              className={`relative flex flex-col items-start rounded-2xl border p-4 text-right transition-all duration-200 ${
                isSelected
                  ? type.activeColor
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
              } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-2xl">{type.icon}</span>
                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs dark:bg-blue-500">
                    ✓
                  </span>
                )}
              </div>

              <div className="mt-2.5">
                <h4 className="text-sm font-bold">{type.name}</h4>
                <p className="mt-1 text-xs opacity-80 leading-relaxed">{type.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
