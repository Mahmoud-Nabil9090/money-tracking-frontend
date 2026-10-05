import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";
import ExpenseTypeSelector from "./ExpenseTypeSelector";
import ThemeToggle from "../ThemeToggle";
import {
  expenseTypes,
  isDefaultCategory,
  getCategoryType,
  mergeWithDefaultCategories,
} from "./expenseTypes";
import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
} from "../../services/expenseCategoryService";

const typeLabels = Object.fromEntries(
  expenseTypes.map((type) => [type.value, type])
);

// يرجّع معرّف التصنيف
function categoryId(category) {
  return category._id || category.id || category.categoryId;
}

// تصميم وألوان كل نوع حسب متطلبات التصميم:
// Daily -> أحمر | Fixed -> أصفر | Emergency -> رمادي
const typeColorStyles = {
  daily: {
    card: "border-red-200 bg-red-50/70 dark:border-red-900/50 dark:bg-red-950/20",
    badge: "border-red-200 bg-red-100/80 text-red-700 dark:border-red-900/60 dark:bg-red-900/40 dark:text-red-300",
    dot: "bg-red-500",
    name: "text-slate-900 dark:text-white",
  },
  fixed: {
    card: "border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20",
    badge: "border-amber-200 bg-amber-100/80 text-amber-700 dark:border-amber-900/60 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500",
    name: "text-slate-900 dark:text-white",
  },
  emergency: {
    card: "border-slate-300 bg-slate-100/70 dark:border-slate-700 dark:bg-slate-800/40",
    badge: "border-slate-300 bg-slate-200/80 text-slate-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-300",
    dot: "bg-slate-500",
    name: "text-slate-900 dark:text-white",
  },
};

export default function CategoryManager() {
  // بيانات التصنيفات وحالة نموذج الإضافة أو التعديل
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "daily" });
  const [editingId, setEditingId] = useState(null);

  // التصنيف المحدد للحذف، وحالات التحميل والرسائل
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // يجلب أحدث قائمة تصنيفات ويدمج التصنيفات الافتراضية
  async function loadCategories() {
    try {
      setLoading(true);
      setError("");
      const fetched = await getExpenseCategories();
      setCategories(mergeWithDefaultCategories(fetched));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "تعذر تحميل التصنيفات"
      );
    } finally {
      setLoading(false);
    }
  }

  // تحميل التصنيفات عند فتح الصفحة
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const fetched = await getExpenseCategories();
        if (!cancelled) {
          setCategories(mergeWithDefaultCategories(fetched));
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "تعذر تحميل التصنيفات"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // إفراغ النموذج والخروج من وضع التعديل
  function resetForm() {
    setForm({ name: "", type: "daily" });
    setEditingId(null);
  }

  // تعبئة النموذج ببيانات التصنيف المختار لتعديله
  function startEditing(category) {
    if (isDefaultCategory(category)) {
      setError("لا يمكن تعديل التصنيفات الأساسية للنظام");
      return;
    }
    setEditingId(categoryId(category));
    setForm({
      name: category.name || "",
      type: getCategoryType(category),
    });
    setSuccess("");
    setError("");

    // التمرير إلى النموذج
    document.getElementById("category-name")?.focus();
  }

  // إضافة تصنيف جديد أو حفظ التعديلات على تصنيف مخصص
  async function handleSubmit(event) {
    event.preventDefault();
    const name = form.name.trim();

    if (!name) {
      setError("يرجى كتابة اسم التصنيف أولاً");
      return;
    }

    const typeObj =
      expenseTypes.find((t) => t.value === form.type) || expenseTypes[0];

    const payload = {
      name,
      type: form.type,
      color: typeObj.hex || "#ef4444",
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateExpenseCategory(editingId, payload);
        setSuccess("تم تعديل التصنيف بنجاح");
      } else {
        await createExpenseCategory(payload);
        setSuccess("تم إضافة التصنيف المخصص بنجاح");
      }

      resetForm();
      await loadCategories();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "تعذر حفظ التصنيف"
      );
    } finally {
      setSaving(false);
    }
  }

  // حذف التصنيف المخصص بعد التأكيد
  async function handleDelete() {
    if (!selectedCategory) return;

    if (isDefaultCategory(selectedCategory)) {
      setError("ممنوع حذف التصنيفات الافتراضية للنظام");
      setSelectedCategory(null);
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await deleteExpenseCategory(categoryId(selectedCategory));
      setSelectedCategory(null);
      setSuccess("تم حذف التصنيف بنجاح");
      await loadCategories();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "تعذر حذف التصنيف"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50/80 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-4xl">
        {/* Navigation & Header */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-200/60 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <span>الرئيسية</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link
              to="/expenses"
              className="rounded-lg px-2 py-1 transition hover:bg-slate-200/60 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              المصاريف
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="rounded-lg bg-red-50 px-2 py-1 font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300">
              تصنيفات المصاريف (US-202 / US-203)
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/expenses"
              className="hidden items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 sm:flex"
            >
              <span>العودة للمصاريف</span>
              <span aria-hidden="true">&larr;</span>
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-wide text-red-600 dark:text-red-400">
                US-202 / US-203 • Dev 2
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                إدارة تصنيفات المصاريف (Expense Categories)
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                رتّب مصاريفك حسب النوع والتصنيف، مع إمكانية إضافة تصنيفات مخصصة وحماية التصنيفات الأساسية.
              </p>
            </div>

            {/* دليل الألوان */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Daily (أحمر)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Fixed (أصفر)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                Emergency (رمادي)
              </span>
            </div>
          </div>
        </div>

        {/* تنبيهات النجاح والخطأ */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300" role="alert">
            <div className="flex items-center gap-2 font-medium">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50/80 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300" role="status">
            <div className="flex items-center gap-2 font-medium">
              <span>✓</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* نموذج الإضافة / التعديل */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingId ? "تعديل التصنيف المخصص" : "إضافة تصنيف خاص جديد (US-203)"}
            </h2>
            {editingId && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                وضع التعديل
              </span>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              اسم التصنيف <span className="text-red-500">*</span>
            </label>
            <input
              id="category-name"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-950/40"
              placeholder="مثال: قهوة، تسوق، اشتراكات، صيانة سيارة..."
              maxLength={50}
            />
          </div>

          <ExpenseTypeSelector
            value={form.type}
            onChange={(type) => setForm({ ...form, type })}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
            >
              {saving
                ? "جاري الحفظ..."
                : editingId
                ? "حفظ التعديل"
                : "إضافة التصنيف"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>

        {/* عرض قائمة التصنيفات */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                جميع التصنيفات
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                التصنيفات الأساسية الافتراضية والتصنيفات المخصصة
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {categories.length} تصنيف
            </span>
          </div>

          {loading && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-slate-300 border-t-red-600 dark:border-slate-700 dark:border-t-red-500" />
              <p className="text-sm">جاري تحميل التصنيفات...</p>
            </div>
          )}

          {!loading && categories.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              لا توجد تصنيفات حالياً.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => {
              const catType = getCategoryType(category);
              const typeInfo = typeLabels[catType] || typeLabels.daily;
              const defaultCategory = isDefaultCategory(category);
              const styles =
                typeColorStyles[catType] || typeColorStyles.daily;

              return (
                <div
                  key={categoryId(category)}
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${styles.card}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 shrink-0 rounded-full ${styles.dot}`} />
                    <div>
                      <p className={`font-bold text-sm ${styles.name}`}>
                        {category.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs">
                        <span
                          className={`rounded-md border px-2 py-0.5 font-semibold text-[11px] ${styles.badge}`}
                        >
                          {typeInfo.label}
                        </span>
                        {defaultCategory ? (
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            • أساسي (محمي)
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                            • مخصص
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* منع تعديل أو حذف التصنيفات الأساسية في الـ UI */}
                  {!defaultCategory ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(category)}
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-blue-600 shadow-2xs transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 shadow-2xs transition hover:bg-red-50 dark:border-red-900/60 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        حذف
                      </button>
                    </div>
                  ) : (
                    <span
                      title="تصنيف افتراضي أساسي لا يمكن حذفه"
                      className="text-xs text-slate-400 select-none dark:text-slate-500"
                    >
                      🔒
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* نافذة التأكيد قبل الحذف (هل أنت متأكد؟) */}
        <ConfirmDialog
          open={Boolean(selectedCategory)}
          busy={deleting}
          error={error}
          title="هل أنت متأكد؟"
          confirmText="نعم، احذف التصنيف"
          cancelText="إلغاء"
          onCancel={() => setSelectedCategory(null)}
          onConfirm={handleDelete}
        >
          هل أنت متأكد من رغبتك في حذف التصنيف:{" "}
          <strong className="text-slate-900 dark:text-white">
            "{selectedCategory?.name}"
          </strong>
          ؟
        </ConfirmDialog>
      </div>
    </section>
  );
}
