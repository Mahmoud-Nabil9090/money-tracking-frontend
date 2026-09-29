import { useEffect, useState } from "react";
import ConfirmDialog from "../common/ConfirmDialog";
import ExpenseTypeSelector from "./ExpenseTypeSelector";
import { expenseTypes } from "./expenseTypes";
import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
} from "../../services/expenseCategoryService";

const typeLabels = Object.fromEntries(
  expenseTypes.map((type) => [type.value, type])
);

// يرجّع معرّف التصنيف مهما كان اسم الحقل الذي أرسله الخادم.
function categoryId(category) {
  return category._id || category.id || category.categoryId;
}

// يحدد إذا كان التصنيف افتراضيًا، مع دعم أسماء الحقول المختلفة من الخادم.
function isDefaultCategory(category) {
  return Boolean(category.isDefault ?? category.is_default ?? category.default);
}

export default function CategoryManager() {
  // بيانات التصنيفات وحالة نموذج الإضافة أو التعديل.
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "daily" });
  const [editingId, setEditingId] = useState(null);
  // التصنيف المحدد للحذف، وحالات الطلبات والرسائل الظاهرة للمستخدم.
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // يجلب أحدث قائمة تصنيفات، ويعرض رسالة مفهومة إذا فشل الطلب.
  async function loadCategories() {
    try {
      setLoading(true);
      setError("");
      setCategories(await getExpenseCategories());
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

  // تحميل التصنيفات أول ما تظهر الصفحة.
  useEffect(() => {
    getExpenseCategories()
      .then(setCategories)
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "تعذر تحميل التصنيفات"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  // إفراغ النموذج والخروج من وضع التعديل.
  function resetForm() {
    setForm({ name: "", type: "daily" });
    setEditingId(null);
  }

  // تعبئة النموذج ببيانات التصنيف المختار لتعديله.
  function startEditing(category) {
    setEditingId(categoryId(category));
    setForm({ name: category.name || "", type: category.type || "daily" });
    setSuccess("");
  }

  // إضافة تصنيف جديد أو حفظ التعديلات على تصنيف موجود.
  async function handleSubmit(event) {
    event.preventDefault();
    // إزالة المسافات الزائدة ومنع إرسال اسم فارغ.
    const name = form.name.trim();
    if (!name) {
      setError("اكتب اسم التصنيف الأول");
      return;
    }

    try {
      setSaving(true);
      setError("");
      if (editingId) {
        await updateExpenseCategory(editingId, { name, type: form.type });
        setSuccess("تم تعديل التصنيف بنجاح");
      } else {
        await createExpenseCategory({ name, type: form.type });
        setSuccess("تم إضافة التصنيف بنجاح");
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

  // حذف التصنيف بعد تأكيد المستخدم، ثم تحديث القائمة.
  async function handleDelete() {
    if (!selectedCategory) return;
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
    <section className="mx-auto max-w-4xl p-6" dir="rtl">
      {/* عنوان الصفحة وتعريف قصير بإدارة تصنيفات المصاريف. */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">US-202 / US-203</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          تصنيفات المصاريف
        </h1>
        <p className="mt-2 text-slate-500">
          رتّب مصاريفك حسب النوع والتصنيف اللي يناسبك.
        </p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {success && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">{success}</p>}

      {/* النموذج نفسه يُستخدم للإضافة والتعديل حسب وجود معرّف تصنيف قيد التعديل. */}
      <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          {editingId ? "تعديل التصنيف" : "إضافة تصنيف خاص"}
        </h2>
        <div className="mb-5">
          <label htmlFor="category-name" className="mb-2 block text-sm font-semibold text-slate-700">اسم التصنيف</label>
          <input
            id="category-name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="مثال: قهوة"
            maxLength={80}
          />
        </div>
        <ExpenseTypeSelector value={form.type} onChange={(type) => setForm({ ...form, type })} />
        <div className="mt-5 flex gap-3">
          <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "إضافة التصنيف"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">إلغاء</button>}
        </div>
      </form>

      {/* عرض حالة التحميل، أو رسالة القائمة الفارغة، ثم بطاقات التصنيفات. */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">كل التصنيفات</h2>
        {loading && <p className="text-slate-500">جاري التحميل...</p>}
        {!loading && categories.length === 0 && <p className="text-slate-500">لسه مفيش تصنيفات.</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            // بيانات النوع تحدد اسمه ولونه، والتصنيف الافتراضي لا يظهر له تعديل أو حذف.
            const type = typeLabels[category.type] || typeLabels.daily;
            const defaultCategory = isDefaultCategory(category);
            return (
              <div key={categoryId(category)} className={`flex items-center justify-between rounded-xl border p-4 ${type.color === "red" ? "border-red-200 bg-red-50" : type.color === "yellow" ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-gray-50"}`}>
                <div>
                  <p className="font-semibold text-slate-900">{category.name}</p>
                  <p className="mt-1 text-xs text-slate-600">{type.label}{defaultCategory ? " · أساسي" : " · مخصص"}</p>
                </div>
                {!defaultCategory && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEditing(category)} className="text-sm font-semibold text-blue-600">تعديل</button>
                    <button type="button" onClick={() => setSelectedCategory(category)} className="text-sm font-semibold text-red-600">حذف</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* نافذة التأكيد تعرض اسم التصنيف قبل تنفيذ الحذف. */}
      <ConfirmDialog
        open={Boolean(selectedCategory)}
        busy={deleting}
        error={error}
        onCancel={() => setSelectedCategory(null)}
        onConfirm={handleDelete}
      >
        هل أنت متأكد إنك عايز تحذف <strong>{selectedCategory?.name}</strong>؟
      </ConfirmDialog>
    </section>
  );
}
