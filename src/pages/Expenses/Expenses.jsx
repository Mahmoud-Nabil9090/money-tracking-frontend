import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import ExpenseFilters from "../../components/expenses/ExpenseFilters";
import ExpenseList from "../../components/expenses/ExpenseList";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ThemeToggle from "../../components/ThemeToggle";

import {
  getAccounts,
  getExpenseCategories,
  getExpenses,
  deleteExpense,
} from "../../services/expenseService";

const initialFilters = {
  period: "all",
  from: "",
  to: "",
  type: "all",
  category: "all",
  account: "all",
};

export default function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [filters, setFilters] = useState(initialFilters);

  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState("");

  const [toastMessage, setToastMessage] = useState(
    location.state?.toast || location.state?.successMessage || ""
  );

  // Confirm delete dialog state (US-205)
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    expense: null,
    busy: false,
    error: "",
  });

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Initial load of categories and accounts
  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        const [categoriesData, accountsData] = await Promise.all([
          getExpenseCategories(),
          getAccounts(),
        ]);
        if (cancelled) return;
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || []);
        setAccounts(Array.isArray(accountsData) ? accountsData : accountsData?.data || []);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load metadata (categories/accounts):", err);
      }
    }

    loadMeta();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Filter Change -> API Request -> Update List
   * Calls GET /expenses?from=...&to=...&type=...&category=...&account=...
   */
  const fetchFilteredExpenses = useCallback(async (activeFilters, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setFiltering(true);
      }
      setError("");

      const response = await getExpenses(activeFilters);
      const list = Array.isArray(response) ? response : response?.data || [];
      setExpenses(list);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError(
        err.response?.data?.message ||
          "تعذر تحميل المصروفات. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }, []);

  // When filters change: trigger API request
  useEffect(() => {
    fetchFilteredExpenses(filters, false);
  }, [filters, fetchFilteredExpenses]);

  // Handle Edit (US-205)
  const handleEdit = (expense) => {
    navigate(`/expenses/${expense._id}/edit`, {
      state: { expense },
    });
  };

  // Handle Delete request (US-205)
  const handleRequestDelete = (expense) => {
    setDeleteDialog({
      open: true,
      expense,
      busy: false,
      error: "",
    });
  };

  const handleCloseDelete = () => {
    if (deleteDialog.busy) return;
    setDeleteDialog({
      open: false,
      expense: null,
      busy: false,
      error: "",
    });
  };

  const handleConfirmDelete = async () => {
    const { expense } = deleteDialog;
    if (!expense) return;

    try {
      setDeleteDialog((prev) => ({ ...prev, busy: true, error: "" }));
      await deleteExpense(expense._id);
      setToastMessage("تم حذف المصروف بنجاح وتحديث رصيد الحساب.");
      handleCloseDelete();
      // Re-fetch with current filters
      fetchFilteredExpenses(filters, false);
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setDeleteDialog((prev) => ({
        ...prev,
        busy: false,
        error:
          err.response?.data?.message ||
          "حدث خطأ أثناء حذف المصروف. يرجى المحاولة مرة أخرى.",
      }));
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <main
      className="min-h-screen bg-slate-50/80 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Toast Message */}
        {toastMessage && (
          <div
            role="status"
            className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-xl dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-300"
          >
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-200/60 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <span>الرئيسية</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="rounded-lg bg-rose-50 px-2 py-1 font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              قائمة المصاريف والفلترة (Dev 3 - US-204)
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => fetchFilteredExpenses(filters, false)}
              disabled={loading || filtering}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              تحديث ⟳
            </button>
          </div>
        </div>

        {/* Title & Action Bar */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              المصاريف (Expenses)
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              عرض سجل المصاريف مع إمكانية الفلترة المتقدمة بالتاريخ والنوع والتصنيف والحساب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/expenses/categories"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60"
            >
              🏷️ إدارة التصنيفات
            </Link>

            <Link
              to="/expenses/new"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-rose-700 focus:ring-2 focus:ring-rose-500/20 active:scale-95"
            >
              <span>➕ تسجيل مصروف جديد (US-201)</span>
            </Link>
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <p className="font-semibold">⚠️ {error}</p>
            <button
              type="button"
              onClick={() => fetchFilteredExpenses(filters, false)}
              className="mt-3 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Filter Controls (US-204) */}
        <ExpenseFilters
          filters={filters}
          categories={categories}
          accounts={accounts}
          onChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Expenses List & State */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-rose-600 dark:border-slate-800 dark:border-t-rose-400" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              جاري تحميل المصروفات...
            </p>
          </div>
        ) : (
          <div className="relative">
            {filtering && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-xs transition dark:bg-slate-900/60">
                <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg dark:bg-slate-800">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>جاري تحديث النتائج من السيرفر...</span>
                </div>
              </div>
            )}

            <ExpenseList
              expenses={expenses}
              categories={categories}
              accounts={accounts}
              onEdit={handleEdit}
              onDelete={handleRequestDelete}
            />
          </div>
        )}

        {/* Confirm Delete Dialog (US-205) */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="تأكيد حذف المصروف"
          busy={deleteDialog.busy}
          error={deleteDialog.error}
          confirmText="حذف المصروف"
          cancelText="إلغاء"
          onCancel={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        >
          <p>
            هل أنت متأكد من رغبتك في حذف المصروف "{deleteDialog.expense?.description}" بقيمة{" "}
            <span className="font-bold">
              {Number(deleteDialog.expense?.amount || 0).toLocaleString()} {deleteDialog.expense?.currency || "EGP"}
            </span>
            ؟ سيتم عكس المعاملة وتحديث رصيد الحساب المالي المرتبط به تلقائياً.
          </p>
        </ConfirmDialog>
      </div>
    </main>
  );
}
