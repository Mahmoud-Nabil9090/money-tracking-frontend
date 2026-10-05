import { useEffect, useState } from "react";
import { getExpenseCategories } from "../../services/expenseCategoryService";
import { mergeWithDefaultCategories, getCategoryType, expenseTypes } from "./expenseTypes";

const typeLabels = Object.fromEntries(
  expenseTypes.map((type) => [type.value, type.label])
);

// قائمة اختيار التصنيف (CategorySelector) - US-202
export default function CategorySelector({
  value,
  onChange,
  categories: providedCategories,
  reloadKey = 0,
}) {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loading, setLoading] = useState(!providedCategories);
  const [error, setError] = useState("");

  useEffect(() => {
    if (providedCategories) {
      return undefined;
    }

    let cancelled = false;
    getExpenseCategories()
      .then((items) => {
        if (!cancelled) {
          const list = Array.isArray(items) ? items : items?.data || [];
          setFetchedCategories(mergeWithDefaultCategories(list));
          setError("");
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "تعذر تحميل التصنيفات"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [providedCategories, reloadKey]);

  const rawCategories = providedCategories || fetchedCategories;
  const categories = mergeWithDefaultCategories(rawCategories);

  return (
    <div>
      <label
        htmlFor="expense-category"
        className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        التصنيف (Category)
      </label>
      <select
        id="expense-category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || Boolean(error)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-950/40 dark:disabled:bg-slate-800/50"
      >
        <option value="">
          {loading ? "جاري تحميل التصنيفات..." : "-- اختار التصنيف --"}
        </option>
        {categories.map((category) => {
          const type = getCategoryType(category);
          const typeLabel = typeLabels[type] ? ` (${typeLabels[type]})` : "";
          const id = category._id || category.id;
          return (
            <option key={id} value={id}>
              {category.name}{typeLabel}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
