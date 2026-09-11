import { useState } from "react";
import { formatDateForInput } from "../../utiles/data";

const TYPE_OPTIONS = [
  { label: "Salary", value: "salary", arabic: "راتب", icon: "💼" },
  { label: "Freelance", value: "freelance", arabic: "عمل حر", icon: "💻" },
  { label: "Rent", value: "rental", arabic: "إيجار", icon: "🏠" },
  { label: "Profit", value: "investment", arabic: "أرباح / استثمار", icon: "📈" },
  { label: "Other", value: "other", arabic: "أخرى", icon: "🏷️" },
];

function normalizeCategory(val) {
  if (!val) return "salary";
  const lower = String(val).toLowerCase();
  if (lower === "rent" || lower === "rental") return "rental";
  if (lower === "profit" || lower === "investment") return "investment";
  if (lower === "salary") return "salary";
  if (lower === "freelance") return "freelance";
  if (lower === "other") return "other";
  return lower;
}

function IncomeForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  mode = "create", // "create" | "edit"
  onCancel,
  serverError = "",
}) {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || "",
    type: normalizeCategory(initialData?.category || initialData?.type),
    amount: initialData?.amount !== undefined ? String(initialData.amount) : "",
    currency: initialData?.currency || "EGP",
    receivedDate: formatDateForInput(initialData?.receivedDate || initialData?.date),
    notes: initialData?.notes || "",
  }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (data = formData) => {
    const errs = {};

    // Name validation
    if (!data.name || !data.name.trim()) {
      errs.name = "اسم مصدر الدخل مطلوب (Name is required)";
    } else if (data.name.trim().length > 100) {
      errs.name = "اسم مصدر الدخل لا يمكن أن يتجاوز 100 حرف";
    }

    // Type validation
    if (!data.type) {
      errs.type = "نوع الدخل مطلوب (Type is required)";
    }

    // Amount validation
    if (data.amount === "" || data.amount === null || data.amount === undefined) {
      errs.amount = "المبلغ مطلوب (Amount is required)";
    } else {
      const num = Number(data.amount);
      if (isNaN(num)) {
        errs.amount = "يرجى إدخال قيمة رقمية صحيحة";
      } else if (num <= 0) {
        errs.amount = "يجب أن يكون المبلغ أكبر من صفر (Amount must be > 0)";
      }
    }

    // Currency validation
    if (!data.currency || !data.currency.trim()) {
      errs.currency = "العملة مطلوبة (Currency is required)";
    }

    // Received Date validation
    if (!data.receivedDate) {
      errs.receivedDate = "تاريخ الاستلام مطلوب (Received Date is required)";
    }

    // Notes validation (optional, but max 500)
    if (data.notes && data.notes.length > 500) {
      errs.notes = "الملاحظات لا يمكن أن تتجاوز 500 حرف";
    }

    return errs;
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate();
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      type: true,
      amount: true,
      currency: true,
      receivedDate: true,
      notes: true,
    });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.type,
      amount: parseFloat(formData.amount),
      currency: formData.currency.trim() || "EGP",
      receivedDate: formData.receivedDate,
      notes: formData.notes ? formData.notes.trim() : "",
      recurrence: initialData?.recurrence || "once",
      status: initialData?.status || "cleared",
    };

    if (onSubmit) {
      onSubmit(payload);
    }
  };

  const isEdit = mode === "edit";

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-none transition-all">
      {/* Decorative Top Accent Bar */}
      <div
        className={`h-2 w-full bg-linear-to-r ${
          isEdit
            ? "from-amber-500 via-orange-500 to-amber-600"
            : "from-emerald-500 via-teal-500 to-emerald-600"
        }`}
      />

      <div className="p-6 sm:p-10">
        {/* Header with Icon and Badge */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-13 w-13 items-center justify-center rounded-2xl shadow-inner ${
                isEdit
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200/80 dark:ring-amber-800/60"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200/80 dark:ring-emerald-800/60"
              }`}
            >
              {isEdit ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-2xl">
                {isEdit ? "تعديل مصدر الدخل" : "إضافة مصدر دخل جديد"}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {isEdit
                  ? "قم بتحديث بيانات الإيراد وحفظ التغييرات في قاعدة البيانات"
                  : "أدخل بيانات الإيراد الجديد لحفظها وتحديث الإجماليات"}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${
              isEdit
                ? "bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                : "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isEdit ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            {isEdit ? "وضع التعديل (US-104)" : "إضافة جديد (US-101)"}
          </span>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/90 dark:bg-red-950/30 p-4 text-sm text-red-800 dark:text-red-300 shadow-xs">
            <svg
              className="h-5 w-5 shrink-0 text-red-500 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">تنبيه:</p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Name Field */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="income-name"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Name <span className="text-rose-500">*</span>
                <span className="mr-2 text-xs font-normal text-slate-400">
                  (اسم مصدر الدخل)
                </span>
              </label>
              <span className="text-xs text-slate-400">
                {formData.name.length}/100
              </span>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>

              <input
                id="income-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="مثال: مرتب شهر سبتمبر، مشروع برمجة، إيجار شقة..."
                maxLength={100}
                className={`w-full rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 py-3 pr-10 pl-4 text-sm text-slate-800 dark:text-slate-100 transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                  errors.name && touched.name
                    ? "border-rose-400 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-300/80 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/10"
                }`}
              />
            </div>

            {errors.name && touched.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                <span>⚠️</span> {errors.name}
              </p>
            )}
          </div>

          {/* Type & Amount Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Type Dropdown */}
            <div>
              <label
                htmlFor="income-type"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Type <span className="text-rose-500">*</span>
                <span className="mr-2 text-xs font-normal text-slate-400">
                  (نوع الدخل)
                </span>
              </label>

              <div className="relative">
                <select
                  id="income-type"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  onBlur={() => handleBlur("type")}
                  className={`w-full appearance-none rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                    errors.type && touched.type
                      ? "border-rose-400 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-300/80 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/10"
                  }`}
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="dark:bg-slate-800">
                      {opt.icon} {opt.label} — {opt.arabic}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {errors.type && touched.type && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span>⚠️</span> {errors.type}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div>
              <label
                htmlFor="income-amount"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Amount <span className="text-rose-500">*</span>
                <span className="mr-2 text-xs font-normal text-slate-400">
                  (المبلغ)
                </span>
              </label>

              <div className="relative">
                <input
                  id="income-amount"
                  type="number"
                  step="any"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  onBlur={() => handleBlur("amount")}
                  placeholder="0.00"
                  className={`w-full rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 py-3 pr-4 pl-14 text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                    errors.amount && touched.amount
                      ? "border-rose-400 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-300/80 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/10"
                  }`}
                />

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="rounded-md bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {formData.currency || "EGP"}
                  </span>
                </div>
              </div>

              {errors.amount && touched.amount && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span>⚠️</span> {errors.amount}
                </p>
              )}
            </div>
          </div>

          {/* Currency & Received Date Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Currency Field */}
            <div>
              <label
                htmlFor="income-currency"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Currency <span className="text-rose-500">*</span>
                <span className="mr-2 text-xs font-normal text-slate-400">
                  (العملة)
                </span>
              </label>

              <input
                id="income-currency"
                type="text"
                value={formData.currency}
                onChange={(e) =>
                  handleChange("currency", e.target.value.toUpperCase())
                }
                onBlur={() => handleBlur("currency")}
                placeholder="EGP, USD, EUR, SAR..."
                maxLength={10}
                className={`w-full rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100 transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                  errors.currency && touched.currency
                    ? "border-rose-400 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-300/80 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/10"
                }`}
              />

              {errors.currency && touched.currency && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span>⚠️</span> {errors.currency}
                </p>
              )}
            </div>

            {/* Received Date Field */}
            <div>
              <label
                htmlFor="income-date"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Received Date <span className="text-rose-500">*</span>
                <span className="mr-2 text-xs font-normal text-slate-400">
                  (تاريخ الاستلام)
                </span>
              </label>

              <input
                id="income-date"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => handleChange("receivedDate", e.target.value)}
                onBlur={() => handleBlur("receivedDate")}
                className={`w-full rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                  errors.receivedDate && touched.receivedDate
                    ? "border-rose-400 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-300/80 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/10"
                }`}
              />

              {errors.receivedDate && touched.receivedDate && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span>⚠️</span> {errors.receivedDate}
                </p>
              )}
            </div>
          </div>

          {/* Notes Field (Optional) */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="income-notes"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Notes
                <span className="mr-2 text-xs font-normal text-slate-400">
                  (ملاحظات تفصيلية - اختياري)
                </span>
              </label>
              <span className="text-xs text-slate-400">
                {formData.notes.length}/500
              </span>
            </div>

            <textarea
              id="income-notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              onBlur={() => handleBlur("notes")}
              placeholder="اكتب أي تفاصيل، سبب الزيادة، أو رقم فاتورة..."
              maxLength={500}
              className={`w-full rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 p-4 text-sm text-slate-800 dark:text-slate-100 transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                errors.notes && touched.notes
                  ? "border-rose-400 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-300/80 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/10"
              }`}
            />

            {errors.notes && touched.notes && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                <span>⚠️</span> {errors.notes}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3.5 pt-4 sm:flex-row sm:justify-end sm:items-center border-t border-slate-100 dark:border-slate-800">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-2xs transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 disabled:opacity-50"
              >
                إلغاء وتراجع
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-4 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                isEdit
                  ? "bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20 focus:ring-amber-500/25"
                  : "bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 focus:ring-emerald-500/25"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>جاري الحفظ والتسجيل...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  <span>{isEdit ? "حفظ التعديلات (Save)" : "حفظ مصدر الدخل (Save)"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncomeForm;
