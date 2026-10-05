function TotalWealthCard({ totalWealth = 0, currency = "EGP" }) {
  const isNegative = Number(totalWealth) < 0;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        إجمالي الثروة (Total Wealth)
      </p>

      <div className="flex items-center justify-center gap-2">
        <h2
          className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${
            isNegative
              ? "text-red-600 dark:text-red-400"
              : "text-slate-900 dark:text-white"
          }`}
        >
          {Number(totalWealth).toLocaleString()}
        </h2>

        {currency && (
          <span className="text-base font-semibold text-slate-500 dark:text-slate-400 sm:text-lg">
            {currency}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        مجموع أرصدة جميع الحسابات البنكية والمحافظ والنقدية
      </p>
    </div>
  );
}

export default TotalWealthCard;