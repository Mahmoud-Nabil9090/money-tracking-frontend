import React, { useState, useEffect } from "react";
import AccountTypeSelector from "./AccountTypeSelector";
import { createAccount, updateAccount } from "../../services/accountService";

const COLOR_PRESETS = [
  { name: "Teal (افتراضي)", value: "#0d9488" },
  { name: "Blue (أزرق)", value: "#2563eb" },
  { name: "Indigo (نيلي)", value: "#4f46e5" },
  { name: "Purple (بنفسجي)", value: "#9333ea" },
  { name: "Emerald (أخضر)", value: "#059669" },
  { name: "Amber (كهرماني)", value: "#d97706" },
  { name: "Rose (وردي)", value: "#e11d48" },
  { name: "Slate (رمادي)", value: "#475569" },
];

const CURRENCIES = [
  { code: "EGP", label: "EGP - جنيه مصري" },
  { code: "USD", label: "USD - دولار أمريكي" },
  { code: "EUR", label: "EUR - يورو أوروبي" },
  { code: "SAR", label: "SAR - ريال سعودي" },
  { code: "AED", label: "AED - درهم إماراتي" },
  { code: "KWD", label: "KWD - دينار كويتي" },
];

export default function AccountForm({
  initialData = null,
  isEdit = false,
  accountId = null,
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "bank",
    balance: initialData?.balance !== undefined ? String(initialData.balance) : "0",
    currency: initialData?.currency || "EGP",
    color: initialData?.color || "#0d9488",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "bank",
        balance: initialData.balance !== undefined ? String(initialData.balance) : "0",
        currency: initialData.currency || "EGP",
        color: initialData.color || "#0d9488",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({ ...prev, type: newType }));
    if (errors.type) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.type;
        return next;
      });
    }
  };

  const handleColorChange = (newColor) => {
    setFormData((prev) => ({ ...prev, color: newColor }));
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = "اسم الحساب مطلوب (Account name is required)";
    } else if (formData.name.trim().length > 100) {
      errs.name = "اسم الحساب لا يجب أن يتجاوز 100 حرف";
    }

    if (!formData.type) {
      errs.type = "يرجى تحديد نوع الحساب (Bank, Wallet, Cash)";
    }

    if (!isEdit) {
      if (formData.balance === "" || formData.balance === null) {
        errs.balance = "الرصيد الابتدائي مطلوب";
      } else if (Number.isNaN(Number(formData.balance))) {
        errs.balance = "يرجى إدخال قيمة رقمية صحيحة";
      }
    }

    if (!formData.currency) {
      errs.currency = "العملة مطلوبة";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      let res;
      if (isEdit) {
        // PUT /accounts/:id
        const payload = {
          name: formData.name.trim(),
          type: formData.type,
          currency: formData.currency,
          color: formData.color,
        };
        res = await updateAccount(accountId || initialData?._id, payload);
      } else {
        // POST /accounts
        const payload = {
          name: formData.name.trim(),
          type: formData.type,
          balance: parseFloat(formData.balance) || 0,
          currency: formData.currency,
          color: formData.color,
        };
        res = await createAccount(payload);
      }

      const accountData = res?.data || res;
      if (onSuccess) {
        onSuccess(accountData);
      }
    } catch (err) {
      console.error("Account submit error:", err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.code === "TRIAL_LIMIT_1_ACCOUNT"
          ? "النسخة التجريبية تسمح بإنشاء حساب واحد فقط. يرجى ترقية اشتراكك."
          : isEdit
          ? "تعذر حفظ تعديلات الحساب."
          : "تعذر إضافة الحساب الجديد.");
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <div className="flex items-center gap-2 font-bold">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {/* 1. اسم الحساب */}
      <div>
        <label
          htmlFor="account-name"
          className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          اسم الحساب (Account Name) <span className="text-red-500">*</span>
        </label>
        <input
          id="account-name"
          name="name"
          type="text"
          placeholder="مثال: البنك الأهلي، فودافون كاش، محفظة الجيب..."
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
            errors.name
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
          }`}
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            اختر اسماً فريداً ومميزاً لحسابك المالي
          </p>
        )}
      </div>

      {/* 2. نوع الحساب */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          نوع الحساب (Account Type) <span className="text-red-500">*</span>
        </label>
        <AccountTypeSelector
          value={formData.type}
          onChange={handleTypeChange}
          error={errors.type}
        />
      </div>

      {/* 3. الرصيد الابتدائي والعملة */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="account-balance"
            className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            {isEdit ? "الرصيد الحالي" : "الرصيد الابتدائي (Initial Balance)"}{" "}
            {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              id="account-balance"
              name="balance"
              type="number"
              step="any"
              disabled={isEdit}
              placeholder="0.00"
              value={formData.balance}
              onChange={handleChange}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition dark:bg-slate-800 dark:text-white ${
                isEdit
                  ? "cursor-not-allowed bg-slate-100 dark:bg-slate-800/60 dark:text-slate-400"
                  : errors.balance
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-700"
                  : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
              }`}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-xs font-bold text-slate-400">
              {formData.currency}
            </div>
          </div>
          {errors.balance ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.balance}</p>
          ) : isEdit ? (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              لتعديل الرصيد، استخدم خاصية "تعديل الرصيد يدوياً" من صفحة تفاصيل الحساب.
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              الرصيد المتوفر فعلياً في الحساب لحظة إنشائه
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="account-currency"
            className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            العملة (Currency) <span className="text-red-500">*</span>
          </label>
          <select
            id="account-currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.currency}</p>
          )}
        </div>
      </div>

      {/* 4. اللون المميز (Color) */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          اللون المميز للحساب (Account Color)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {COLOR_PRESETS.map((p) => {
            const isSelected = formData.color.toLowerCase() === p.value.toLowerCase();
            return (
              <button
                type="button"
                key={p.value}
                onClick={() => handleColorChange(p.value)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all ${
                  isSelected
                    ? "scale-110 border-slate-900 shadow-md ring-2 ring-blue-500 dark:border-white"
                    : "border-transparent opacity-85 hover:scale-105 hover:opacity-100"
                }`}
                style={{ backgroundColor: p.value }}
                title={p.name}
              >
                {isSelected && <span className="text-xs font-bold text-white drop-shadow">✓</span>}
              </button>
            );
          })}

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
            <input
              type="color"
              id="account-custom-color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              title="اختيار لون مخصص"
            />
            <label
              htmlFor="account-custom-color"
              className="cursor-pointer text-xs font-mono font-medium text-slate-600 dark:text-slate-300"
            >
              {formData.color}
            </label>
          </div>
        </div>
      </div>

      {/* Preview Card previewing color and type */}
      <div
        className="rounded-2xl border p-4 transition-all"
        style={{
          borderColor: `${formData.color}40`,
          backgroundColor: `${formData.color}0c`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: formData.color }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              معاينة مظهر الحساب
            </span>
          </div>
          <span className="text-xs font-semibold" style={{ color: formData.color }}>
            {formData.type.toUpperCase()}
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <h4 className="font-bold text-slate-800 dark:text-white">
            {formData.name || "اسم الحساب"}
          </h4>
          <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
            {Number(formData.balance || 0).toLocaleString()} {formData.currency}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            إلغاء
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.99] disabled:opacity-50"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>جاري الحفظ...</span>
            </>
          ) : isEdit ? (
            <span>حفظ تعديلات الحساب &larr;</span>
          ) : (
            <span>إضافة الحساب &larr;</span>
          )}
        </button>
      </div>
    </form>
  );
}
