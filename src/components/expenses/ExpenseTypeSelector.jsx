import { expenseTypes } from "./expenseTypes";

// فئات Tailwind المستخدمة لتلوين كل نوع من أنواع المصروف.
const colorClasses = {
  red: "border-red-200 bg-red-50 text-red-700 ring-red-500",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 ring-yellow-500",
  gray: "border-gray-200 bg-gray-50 text-gray-700 ring-gray-500",
};

// يعرض أنواع المصروف كخيارات، ويبلغ المكوّن الأب بالنوع الذي اختاره المستخدم.
export default function ExpenseTypeSelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-slate-700">
        نوع المصروف
      </legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {/* إنشاء خيار لكل نوع مع تمييز الخيار المحدد حاليًا. */}
        {expenseTypes.map((type) => (
          <label
            key={type.value}
            className={`cursor-pointer rounded-xl border p-4 transition ${colorClasses[type.color]} ${
              value === type.value ? "ring-2 ring-offset-1" : ""
            }`}
          >
            {/* يحدد الخيار المختار ويبلغ المكوّن الأب عند تغييره. */}
            <input
              type="radio"
              name="expense-type"
              value={type.value}
              checked={value === type.value}
              onChange={(event) => onChange(event.target.value)}
              className="sr-only"
            />
            <span className="block font-semibold">{type.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
