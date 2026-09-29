import { useEffect, useState } from "react";
import { getExpenseCategories } from "../../services/expenseCategoryService";

// قائمة اختيار التصنيف؛ يمكن تمرير التصنيفات من مكوّن آخر أو جلبها هنا.
export default function CategorySelector({
  value,
  onChange,
  categories: providedCategories,
  reloadKey = 0,
}) {
  // يحتفظ بالتصنيفات التي تم جلبها من الخادم عند عدم تمرير قائمة جاهزة.
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loading, setLoading] = useState(!providedCategories);
  const [error, setError] = useState("");

  // يجلب التصنيفات عند الحاجة، ويعيد الجلب إذا تغيّر مفتاح التحديث.
  useEffect(() => {
    if (providedCategories) {
      return undefined;
    }

    // يمنع تحديث الحالة إذا انتهى المكوّن قبل اكتمال طلب الشبكة.
    let cancelled = false;
    getExpenseCategories()
      .then((items) => {
        if (!cancelled) {
          setFetchedCategories(items);
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

  // القائمة الممررة لها الأولوية، وإلا نستخدم القائمة التي جلبناها.
  const categories = providedCategories || fetchedCategories;

  return (
    <div>
      <label
        htmlFor="expense-category"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        التصنيف
      </label>
      {/* يعرض القائمة ويعطّلها أثناء التحميل أو عند تعذّر جلب التصنيفات. */}
      <select
        id="expense-category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || Boolean(error)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
      >
        <option value="">
          {loading ? "جاري تحميل التصنيفات..." : "اختار التصنيف"}
        </option>
        {/* كل خيار يعرض اسم التصنيف ويستخدم معرّفه كقيمة للاختيار. */}
        {categories.map((category) => (
          <option
            key={category._id || category.id}
            value={category._id || category.id}
          >
            {category.name}
          </option>
        ))}
      </select>
      {/* إظهار رسالة الخطأ للمستخدم بدل إخفائها. */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
