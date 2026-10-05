import React from "react";

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ExpenseFilters({
  filters,
  categories = [],
  accounts = [],
  onChange,
  onReset,
}) {
  const handlePeriodChange = (period) => {
    const today = new Date();
    let from = "";
    let to = "";

    if (period === "today") {
      from = formatDate(today);
      to = formatDate(today);
    } else if (period === "week") {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() + diffToMonday);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      from = formatDate(startOfWeek);
      to = formatDate(endOfWeek);
    } else if (period === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      from = formatDate(startOfMonth);
      to = formatDate(endOfMonth);
    } else if (period === "all") {
      from = "";
      to = "";
    } else if (period === "custom") {
      // keep current from/to or default to current month
      from = filters.from || "";
      to = filters.to || "";
    }

    onChange({
      ...filters,
      period,
      from,
      to,
    });
  };

  const handleFieldChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const activeCount = [
    filters.period && filters.period !== "all",
    filters.from || filters.to,
    filters.type && filters.type !== "all",
    filters.category && filters.category !== "all",
    filters.account && filters.account !== "all",
  ].filter(Boolean).length;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            🔍
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              فلترة المصاريف (Filter Expenses)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              فلترة بالتاريخ، نوع المصروف، التصنيف، والحساب المالي معاً
            </p>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
              {activeCount} فلاتر مفعلة
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
            >
              إعادة ضبط ✕
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Date Filter (Period) */}
        <div>
          <label
            htmlFor="filter-period"
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            الفترة / التاريخ (Date)
          </label>
          <select
            id="filter-period"
            value={filters.period || "all"}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
          >
            <option value="all">كل التواريخ (All Dates)</option>
            <option value="today">اليوم (Today)</option>
            <option value="week">هذا الأسبوع (This Week)</option>
            <option value="month">هذا الشهر (This Month)</option>
            <option value="custom">فترة مخصصة (Custom Range)</option>
          </select>
        </div>

        {/* 2. Type Filter */}
        <div>
          <label
            htmlFor="filter-type"
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            النوع (Type)
          </label>
          <select
            id="filter-type"
            value={filters.type || "all"}
            onChange={(e) => handleFieldChange("type", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
          >
            <option value="all">كل الأنواع (All Types)</option>
            <option value="daily">يومي (Daily)</option>
            <option value="fixed">شهري ثابت (Fixed)</option>
            <option value="emergency">طارئ (Emergency)</option>
          </select>
        </div>

        {/* 3. Category Filter */}
        <div>
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            التصنيف (Category)
          </label>
          <select
            id="filter-category"
            value={filters.category || "all"}
            onChange={(e) => handleFieldChange("category", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
          >
            <option value="all">كل التصنيفات (All Categories)</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat.name || cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Account Filter */}
        <div>
          <label
            htmlFor="filter-account"
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            الحساب (Account)
          </label>
          <select
            id="filter-account"
            value={filters.account || "all"}
            onChange={(e) => handleFieldChange("account", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
          >
            <option value="all">كل الحسابات (All Accounts)</option>
            {accounts.map((acc) => (
              <option key={acc._id || acc.id} value={acc._id || acc.id}>
                {acc.name} ({acc.type}) {acc.isActive === false ? "[مؤرشف]" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {filters.period === "custom" && (
        <div className="mt-4 grid gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 sm:grid-cols-2">
          <div>
            <label
              htmlFor="filter-from"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              من تاريخ (From)
            </label>
            <input
              id="filter-from"
              type="date"
              value={filters.from || ""}
              onChange={(e) => handleFieldChange("from", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="filter-to"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              إلى تاريخ (To)
            </label>
            <input
              id="filter-to"
              type="date"
              value={filters.to || ""}
              onChange={(e) => handleFieldChange("to", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      )}
    </section>
  );
}
