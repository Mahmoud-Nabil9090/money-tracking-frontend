import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import AccountForm from "../../components/accounts/AccountForm";
import ThemeToggle from "../../components/ThemeToggle";
import { getAccountById, getAccounts } from "../../services/accountService";

export default function AccountFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = Boolean(id);
  const [initialData, setInitialData] = useState(location.state?.account || null);
  const [loading, setLoading] = useState(isEdit && !location.state?.account);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      if (!isEdit || initialData) return;

      try {
        setLoading(true);
        setError("");
        const acc = await getAccountById(id);
        if (cancelled) return;
        if (!acc) {
          setError("الحساب المطلوب غير موجود.");
        } else {
          setInitialData(acc);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading account for edit:", err);
        setError(err.response?.data?.message || "تعذر تحميل بيانات الحساب.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, initialData]);

  const handleSuccess = (account) => {
    const toastMsg = isEdit ? "تم تعديل بيانات الحساب بنجاح" : "تمت إضافة الحساب بنجاح";
    navigate("/accounts", {
      state: {
        toast: toastMsg,
        successMessage: toastMsg,
      },
    });
  };

  const handleCancel = () => {
    navigate("/accounts");
  };

  return (
    <main
      className="min-h-screen bg-slate-50/80 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8"
      dir="rtl"
    >
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
              to="/accounts"
              className="rounded-lg px-2 py-1 transition hover:bg-slate-200/60 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              الحسابات
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="rounded-lg bg-blue-50 px-2 py-1 font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {isEdit ? "تعديل الحساب" : "إضافة حساب جديد (US-301)"}
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
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-800/40 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-xl dark:bg-blue-950/60 dark:text-blue-400">
                {isEdit ? "✏️" : "💳"}
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEdit ? "تعديل الحساب المالي" : "إضافة حساب أو محفظة جديدة"}
                </h1>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {isEdit
                    ? "تعديل اسم ونوع ولون وعملة الحساب"
                    : "إنشاء حساب بنكي، محفظة إلكترونية، أو خزينة كاش لتتبع الأموال"}
                </p>
              </div>
            </div>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:mt-0">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              {isEdit ? "وضع التعديل" : "حساب جديد"}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  جاري تحميل بيانات الحساب...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <p className="font-bold">⚠️ {error}</p>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mt-4 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm"
                >
                  العودة لقائمة الحسابات
                </button>
              </div>
            ) : (
              <AccountForm
                initialData={initialData}
                isEdit={isEdit}
                accountId={id}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
