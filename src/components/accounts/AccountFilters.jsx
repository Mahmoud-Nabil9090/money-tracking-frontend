function AccountFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          تصفية الحركات بالتاريخ (Filter Transactions)
        </h3>
        {(startDate || endDate) && (
          <span className="text-xs text-blue-600 dark:text-blue-400">
            فلتر مفعّل
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <label
            htmlFor="startDate"
            className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400"
          >
            من تاريخ (From)
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950/40"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400"
          >
            إلى تاريخ (To)
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950/40"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            تطبيق الفلتر
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountFilters;
