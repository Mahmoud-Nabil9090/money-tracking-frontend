import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import {
  createExpense,
  updateExpense,
  getExpenseById,
  getExpenseCategories,
  getAccounts,
} from "../../services/expenseService";
import { formatDateForInput } from "../../utiles/data";

const PAYMENT_METHODS = [
  { value: "cash", label: "نقدي (كاش)", icon: "💵" },
  { value: "card", label: "بطاقة بنكية", icon: "💳" },
  { value: "wallet", label: "محفظة إلكترونية", icon: "📱" },
];

const EXPENSE_TYPES = [
  {
    value: "daily",
    label: "يومي (Daily)",
    desc: "مصاريف يومية متكررة كالمواصلات والطعام",
    badgeColor: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60",
    activeRing: "ring-2 ring-red-500 border-red-500",
  },
  {
    value: "fixed",
    label: "شهري ثابت (Fixed)",
    desc: "التزامات دورية ثابتة كالفواتير والإيجار",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60",
    activeRing: "ring-2 ring-amber-500 border-amber-500",
  },
  {
    value: "emergency",
    label: "طارئ (Emergency)",
    desc: "مصاريف غير متوقعة أو حالات طارئة",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    activeRing: "ring-2 ring-slate-600 border-slate-600",
  },
];

/**
 * ExpenseForm Component (US-201 / US-205)
 * يدعم إضافة وتعديل المصروف
 */
export default function ExpenseForm({
  initialData: propInitialData = null,
  expenseId: propExpenseId = null,
  mode: propMode = null,
  onSuccess: propOnSuccess = null,
  onCancel: propOnCancel = null,
}) {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // تحديد الـ ID والنمط (Add vs Edit)
  const expenseId = propExpenseId || paramId;
  const isEditMode = Boolean(propMode === "edit" || expenseId || propInitialData?._id);

  // الحالة الأولية للنموذج
  const [formData, setFormData] = useState(() => {
    const data = propInitialData || location.state?.expense;
    return {
      amount: data?.amount ? String(data.amount) : "",
      description: data?.description || "",
      date: data?.date ? formatDateForInput(data.date) : formatDateForInput(new Date()),
      paymentMethod: data?.paymentMethod || "cash",
      accountId: data?.account?._id || data?.account || data?.accountId || "",
      type: data?.expenseType || data?.type || "daily",
      categoryId: data?.category?._id || data?.category || data?.categoryId || "",
      currency: data?.currency || "EGP",
      notes: data?.notes || "",
    };
  });

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // جلب التصنيفات والحسابات وتفاصيل المصروف إن كان تعديلاً
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setServerError("");

        const [categoriesRes, accountsRes] = await Promise.all([
          getExpenseCategories(),
          getAccounts(),
        ]);

        if (cancelled) return;

        const categoriesList = Array.isArray(categoriesRes)
          ? categoriesRes
          : categoriesRes?.data || [];
        const accountsList = Array.isArray(accountsRes)
          ? accountsRes
          : accountsRes?.data || [];

        setCategories(categoriesList);
        setAccounts(accountsList);

        // إذا كان في وضع التعديل ولم يتم تمرير البيانات عبر الـ state/props
        if (isEditMode && expenseId && !propInitialData && !location.state?.expense) {
          const fetchedExpense = await getExpenseById(expenseId);
          if (cancelled) return;

          if (fetchedExpense) {
            setFormData({
              amount: fetchedExpense.amount ? String(fetchedExpense.amount) : "",
              description: fetchedExpense.description || "",
              date: fetchedExpense.date
                ? formatDateForInput(fetchedExpense.date)
                : formatDateForInput(new Date()),
              paymentMethod: fetchedExpense.paymentMethod || "cash",
              accountId:
                fetchedExpense.account?._id ||
                fetchedExpense.account ||
                fetchedExpense.accountId ||
                "",
              type: fetchedExpense.expenseType || fetchedExpense.type || "daily",
              categoryId:
                fetchedExpense.category?._id ||
                fetchedExpense.category ||
                fetchedExpense.categoryId ||
                "",
              currency: fetchedExpense.currency || "EGP",
              notes: fetchedExpense.notes || "",
            });
          }
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to initialize expense form data:", err);
        setServerError(
          err.response?.data?.message ||
            err.message ||
            "حدث خطأ أثناء تحميل البيانات المطلوبة للنموذج."
        );
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [expenseId, isEditMode, location.state, propInitialData]);

  // تحديث الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // مسح رسالة الخطأ الخاصة بالحقل عند تعديله
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // التحقق من صحة الحقول (Form Validation)
  const validateForm = () => {
    const newErrors = {};

    // 1. Amount validation
    if (!formData.amount || String(formData.amount).trim() === "") {
      newErrors.amount = "المبلغ مطلوب (Amount is required)";
    } else {
      const parsedAmount = Number(formData.amount);
      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        newErrors.amount = "يرجى إدخال مبلغ صحيح أكبر من صفر";
      }
    }

    // 2. Description validation
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "الوصف مطلوب (Description is required)";
    } else if (formData.description.trim().length > 200) {
      newErrors.description = "الوصف يجب ألا يتجاوز 200 حرف";
    }

    // 3. Date validation
    if (!formData.date) {
      newErrors.date = "التاريخ مطلوب (Date is required)";
    }

    // 4. Payment Method validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "نوع الدفع مطلوب (Payment method is required)";
    }

    // 5. Account validation
    if (!formData.accountId) {
      newErrors.accountId = "الحساب مطلوب (Account is required)";
    } else {
      const selectedAcc = accounts.find((a) => (a._id || a.id) === formData.accountId);
      if (selectedAcc && selectedAcc.isActive === false) {
        newErrors.accountId = "لا يمكن اختيار حساب مؤرشف (هذا الحساب معطل ومؤرشف).";
      }
    }

    // 6. Type validation
    if (!formData.type) {
      newErrors.type = "نوع المصروف مطلوب (Expense type is required)";
    }

    // 7. Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = "التصنيف مطلوب (Category is required)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) {
      // تمرير التركيز أو التنبيه
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const el = document.querySelector(`[name="${firstErrorField}"]`);
        el?.focus?.();
      }
      return;
    }

    try {
      setIsSubmitting(true);

      // تجهيز البيانات المتوافقة مع الباك إند والمتطلبات:
      // إرسال accountId، categoryId، type مع الحقول الأساسية
      const payload = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        expenseType: formData.type,
        type: formData.type,
        categoryId: formData.categoryId,
        category: formData.categoryId,
        accountId: formData.accountId,
        account: formData.accountId,
        currency: formData.currency || "EGP",
        notes: formData.notes ? formData.notes.trim() : "",
      };

      let response;
      if (isEditMode) {
        // PUT /expenses/:id
        response = await updateExpense(expenseId, payload);
      } else {
        // POST /expenses
        response = await createExpense(payload);
      }

      const successTxt = isEditMode
        ? "تم تعديل المصروف بنجاح"
        : "تم تسجيل المصروف بنجاح";

      setSuccessMessage(successTxt);

      if (propOnSuccess) {
        propOnSuccess(response?.data || response);
      } else {
        // توجيه إلى صفحة المصاريف مع رسالة نجاح
        navigate("/expenses", {
          state: {
            toast: successTxt,
            successMessage: successTxt,
          },
        });
      }
    } catch (err) {
      console.error("Error submitting expense form:", err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.code === "TRIAL_LIMIT_20_ENTRIES"
          ? "تم الوصول للحد الأقصى للحساب التجريبي (20 عملية)."
          : err.response?.data?.code === "SUBSCRIPTION_EXPIRED"
          ? "انتهت فترة اشتراكك، يرجى التجديد لتسجيل العمليات."
          : isEditMode
          ? "حدث خطأ أثناء تعديل المصروف، يرجى المحاولة مرة أخرى."
          : "حدث خطأ أثناء تسجيل المصروف، يرجى المحاولة مرة أخرى.");
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (propOnCancel) {
      propOnCancel();
    } else {
      navigate("/expenses");
    }
  };

  if (initialLoading) {
    return (
      <main className="min-h-screen bg-slate-50/80 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600 dark:border-slate-700 dark:border-t-red-500" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              جاري تحميل بيانات المصروف...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Navigation / Header */}
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
              {isEditMode ? "تعديل مصروف (US-205)" : "تسجيل مصروف جديد (US-201)"}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleCancel}
              className="hidden items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 sm:flex"
            >
              <span>إلغاء والعودة</span>
              <span aria-hidden="true">&larr;</span>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
          {/* Card Header */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-800/40 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-lg dark:bg-red-950/60 dark:text-red-400">
                  {isEditMode ? "✏️" : "💸"}
                </span>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                    {isEditMode ? "تعديل المصروف" : "تسجيل مصروف جديد"}
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {isEditMode
                      ? "تعديل بيانات وتفاصيل المصروف المسجل سابقاً"
                      : "أدخل بيانات المصروف ليتم تسجيله وخصمه من الحساب المحدد"}
                  </p>
                </div>
              </div>
            </div>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:mt-0">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {isEditMode ? "وضع التعديل" : "إضافة جديدة"}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-6">
            {/* Server Error Alert */}
            {serverError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
              >
                <div className="flex items-start gap-3">
                  <span className="text-base">⚠️</span>
                  <div className="flex-1">
                    <p className="font-semibold">حدث خطأ</p>
                    <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{serverError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <p className="font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* 1. المبلغ (Amount) والعملة */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="expense-amount"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  المبلغ (Amount) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="expense-amount"
                    name="amount"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
                      errors.amount
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-950"
                        : "border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:focus:border-red-500 dark:focus:ring-red-950/40"
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                    {formData.currency || "EGP"}
                  </div>
                </div>
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.amount}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="expense-currency"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  العملة (Currency)
                </label>
                <select
                  id="expense-currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-950/40"
                >
                  <option value="EGP">EGP (ج.م)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="SAR">SAR (ر.س)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>

            {/* 2. الوصف (Description) */}
            <div>
              <label
                htmlFor="expense-description"
                className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                الوصف (Description) <span className="text-red-500">*</span>
              </label>
              <input
                id="expense-description"
                name="description"
                type="text"
                placeholder="مثال: فاتورة كهرباء، وجبة غداء، صيانة دورية..."
                value={formData.description}
                onChange={handleChange}
                maxLength={200}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
                  errors.description
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-950"
                    : "border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:focus:border-red-500 dark:focus:ring-red-950/40"
                }`}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                {errors.description ? (
                  <p className="text-red-600 dark:text-red-400">{errors.description}</p>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">
                    وصف مختصر وواضح للمصروف
                  </span>
                )}
                <span className="text-slate-400">{formData.description.length}/200</span>
              </div>
            </div>

            {/* 3. التاريخ (Date) & نوع الدفع (Payment Method) */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="expense-date"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  التاريخ (Date) <span className="text-red-500">*</span>
                </label>
                <input
                  id="expense-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
                    errors.date
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-950"
                      : "border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:focus:border-red-500 dark:focus:ring-red-950/40"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.date}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="expense-payment-method"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  نوع الدفع (Payment Method) <span className="text-red-500">*</span>
                </label>
                <select
                  id="expense-payment-method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
                    errors.paymentMethod
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-950"
                      : "border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:focus:border-red-500 dark:focus:ring-red-950/40"
                  }`}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.icon} {method.label}
                    </option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>
            </div>

            {/* 4. الحساب (Account) & التصنيف (Category) */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="expense-account"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    الحساب (Account) <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/accounts"
                    className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                  >
                    إدارة الحسابات
                  </Link>
                </div>
                <select
                  id="expense-account"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
                    errors.accountId
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-950"
                      : "border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:focus:border-red-500 dark:focus:ring-red-950/40"
                  }`}
                >
                  <option value="">-- اختار الحساب المخصوم منه --</option>
                  {accounts
                    .filter((acc) => acc.isActive !== false || (isEditMode && (acc._id || acc.id) === formData.accountId))
                    .map((acc) => {
                      const isArchived = acc.isActive === false;
                      return (
                        <option
                          key={acc._id}
                          value={acc._id}
                          disabled={isArchived}
                        >
                          {acc.name} ({Number(acc.balance || 0).toLocaleString()} {acc.currency || "EGP"})
                          {isArchived ? " [مؤرشف - معطل]" : ""}
                        </option>
                      );
                    })}
                </select>
                {errors.accountId && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.accountId}</p>
                )}
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  ⚠️ يتم تحديث رصيد الحساب تلقائياً بواسطة السيرفر.
                </p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="expense-category"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    التصنيف (Category) <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/expenses/categories"
                    className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                  >
                    إدارة التصنيفات
                  </Link>
                </div>
                <select
                  id="expense-category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
                    errors.categoryId
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-950"
                      : "border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:focus:border-red-500 dark:focus:ring-red-950/40"
                  }`}
                >
                  <option value="">-- اختار التصنيف --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.categoryId}</p>
                )}
              </div>
            </div>

            {/* 5. نوع المصروف (Type) */}
            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                نوع المصروف (Type) <span className="text-red-500">*</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {EXPENSE_TYPES.map((t) => {
                  const isSelected = formData.type === t.value;
                  return (
                    <label
                      key={t.value}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${t.badgeColor} ${
                        isSelected
                          ? t.activeRing
                          : "opacity-75 hover:opacity-100 hover:border-slate-400 dark:hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t.value}
                        checked={isSelected}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{t.label}</span>
                        {isSelected && (
                          <span className="text-xs font-bold">✓</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs opacity-80 leading-relaxed">
                        {t.desc}
                      </p>
                    </label>
                  );
                })}
              </div>
              {errors.type && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.type}</p>
              )}
            </fieldset>

            {/* 6. ملاحظات إضافية (Notes) */}
            <div>
              <label
                htmlFor="expense-notes"
                className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                ملاحظات إضافية (Notes)
              </label>
              <textarea
                id="expense-notes"
                name="notes"
                rows={3}
                placeholder="أي تفاصيل أو ملاحظات إضافية بخصوص هذا المصروف..."
                value={formData.notes}
                onChange={handleChange}
                maxLength={500}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-950/40"
              />
              <div className="mt-1 flex justify-end text-xs text-slate-400">
                {formData.notes.length}/500
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : isEditMode ? (
                  <>
                    <span>حفظ التعديلات</span>
                    <span aria-hidden="true">&rarr;</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل المصروف</span>
                    <span aria-hidden="true">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
