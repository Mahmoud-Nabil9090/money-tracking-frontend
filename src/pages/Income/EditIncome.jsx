import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import IncomeForm from "../../components/forms/IncomeForm";
import ThemeToggle from "../../components/ThemeToggle";
import { getIncomeById, updateIncome } from "../../services/incomeService";

function EditIncomePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [initialData, setInitialData] = useState(location.state?.income || null);
  const [loading, setLoading] = useState(!location.state?.income);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fetchIncomeDetails = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const data = await getIncomeById(id);
      setInitialData(data);
    } catch (err) {
      console.error("Error fetching income:", err);
      setLoadError(
        err.response?.data?.message ||
          "لم يتم العثور على مصدر الدخل المطلوب أو حدث خطأ أثناء التحميل."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!initialData && id) {
      fetchIncomeDetails();
    }
  }, [id, initialData, fetchIncomeDetails]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setSaveError("");

      await updateIncome(id, formData);

      // إعادة التوجيه إلى صفحة الإيرادات مع رسالة النجاح
      navigate("/income", {
        state: {
          successMessage: "تم التعديل بنجاح",
        },
      });
    } catch (err) {
      console.error("Error updating income:", err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.code === "SUBSCRIPTION_EXPIRED"
          ? "انتهت فترة اشتراكك، يرجى التجديد لتعديل البيانات"
          : "حدث خطأ أثناء تعديل مصدر الدخل، يرجى المحاولة مرة أخرى.");
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        {/* Navigation / Breadcrumbs */}
        <nav className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>الرئيسية</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <Link
              to="/income"
              className="rounded-lg px-2 py-1 transition hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
            >
              مصادر الدخل
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <span className="rounded-lg bg-amber-50 dark:bg-amber-950/60 px-2 py-1 font-semibold text-amber-700 dark:text-amber-300">
              تعديل الدخل
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/income"
              className="hidden items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:text-slate-800 dark:hover:text-slate-200 sm:flex"
            >
              <span>العودة للقائمة</span>
              <svg
                className="h-4 w-4 rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
              تعديل مصدر الدخل
            </h1>
            <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-3 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              US-104
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            تعديل البيانات المحفوظة لمصدر الدخل وحفظ التحديثات مباشرة
          </p>
        </div>

        {/* Dynamic State Rendering */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-14 text-slate-500 shadow-xl shadow-slate-100 dark:shadow-none">
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <svg
                className="h-7 w-7 animate-spin"
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
            </div>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              جاري تحميل بيانات الدخل القديمة...
            </p>
            <p className="mt-1 text-xs text-slate-400">يرجى الانتظار قليلاً</p>
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 p-8 text-center shadow-xl shadow-rose-100/50 dark:shadow-none">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
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
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">خطأ في استرجاع البيانات</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{loadError}</p>
            <button
              type="button"
              onClick={() => navigate("/income")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-800 dark:bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:hover:bg-slate-600"
            >
              العودة لقائمة الإيرادات
            </button>
          </div>
        ) : (
          <IncomeForm
            key={initialData?._id || id}
            mode="edit"
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={saving}
            serverError={saveError}
            onCancel={() => navigate("/income")}
          />
        )}
      </div>
    </div>
  );
}

export default EditIncomePage;
