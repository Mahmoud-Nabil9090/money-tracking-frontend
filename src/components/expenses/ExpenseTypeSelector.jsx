import { expenseTypes } from "./expenseTypes";

const colorClasses = {
  red: "border-red-200 bg-red-50 text-red-700 ring-red-500 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
  yellow: "border-amber-200 bg-amber-50 text-amber-700 ring-amber-500 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  gray: "border-slate-300 bg-slate-100 text-slate-700 ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const typeEnglish = {
  daily: "Daily",
  fixed: "Fixed",
  emergency: "Emergency",
};

// يعرض أنواع المصروف كخيارات ملونة: Daily (أحمر) | Fixed (أصفر) | Emergency (رمادي)
export default function ExpenseTypeSelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        نوع المصروف (Expense Type) <span className="text-red-500">*</span>
      </legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {expenseTypes.map((type) => {
          const isSelected = value === type.value;
          return (
            <label
              key={type.value}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${colorClasses[type.color]} ${
                isSelected
                  ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-sm font-bold"
                  : "opacity-75 hover:opacity-100 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="expense-type"
                value={type.value}
                checked={isSelected}
                onChange={(event) => onChange(event.target.value)}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-bold">{type.label}</span>
                  <span className="text-xs opacity-75 font-normal">
                    {typeEnglish[type.value]}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-xs font-bold rounded-full bg-white/60 dark:bg-black/40 px-1.5 py-0.5">
                    ✓
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
