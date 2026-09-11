import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IncomeForm from "../../components/forms/IncomeForm";
import ThemeToggle from "../../components/ThemeToggle";
import { createIncome } from "../../services/incomeService";

function NewIncomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setServerError("");

      await createIncome(formData);

      // إعادة التوجيه إلى صفحة الإيرادات مع رسالة النجاح
      navigate("/income", {
        state: {
          successMessage: "تم إضافة مصدر الدخل بنجاح",
        },
      });
    } catch (err) {
      console.error("Error creating income:", err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.code === "TRIAL_LIMIT_20_ENTRIES"
          ? "تم الوصول إلى الحد الأقصى للحساب التجريبي (20 عملية)"
          : err.response?.data?.code === "SUBSCRIPTION_EXPIRED"
          ? "انتهت فترة اشتراكك، يرجى التجديد للإضافة"
          : "حدث خطأ أثناء إضافة مصدر الدخل، يرجى المحاولة مرة أخرى.");
      setServerError(msg);
    } finally {
      setLoading(false);
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

            <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
              إضافة دخل جديد
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
              إضافة مصدر دخل
            </h1>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              US-101
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            أدخل بيانات الإيراد الجديد لحفظها في قاعدة البيانات وتحديث التقارير المالية
          </p>
        </div>

        {/* Income Form Component */}
        <IncomeForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={loading}
          serverError={serverError}
          onCancel={() => navigate("/income")}
        />
      </div>
    </div>
  );
}

export default NewIncomePage;
