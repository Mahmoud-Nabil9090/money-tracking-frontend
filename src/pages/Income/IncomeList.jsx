import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import IncomeCard from "../../components/ui/IncomeCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import {
  deleteIncome,
  getIncomes,
} from "../../services/incomeService";

export default function IncomeList() {
  const navigate = useNavigate();

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedIncome, setSelectedIncome] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // Initial load
  useEffect(() => {
    let cancelled = false;

    getIncomes()
      .then((data) => {
        if (cancelled) return;

        setIncomes(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "تعذر تحميل قائمة الدخل"
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Used after Delete and when Retry is clicked
  async function reloadIncomes() {
    try {
      setLoading(true);
      setError("");

      const data = await getIncomes();

      setIncomes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "تعذر تحميل قائمة الدخل"
      );
    } finally {
      setLoading(false);
    }
  }

  const total = useMemo(() => {
    return incomes.reduce(
      (sum, income) => sum + Number(income.amount || 0),
      0
    );
  }, [incomes]);

  function handleEdit(income) {
    navigate(`/income/${income._id}/edit`);
  }

  function handleDeleteClick(income) {
    setSelectedIncome(income);
    setDeleteError("");
    setSuccessMessage("");
  }

  function handleCancelDelete() {
    if (deleting) return;

    setSelectedIncome(null);
    setDeleteError("");
  }

  async function handleConfirmDelete() {
    if (!selectedIncome || deleting) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const result = await deleteIncome(selectedIncome._id);

      if (result?.success === false) {
        throw new Error(
          result.message || "تعذر حذف مصدر الدخل"
        );
      }

      setSelectedIncome(null);
      setSuccessMessage("تم حذف مصدر الدخل بنجاح");

      // Refetch from backend so List and Total stay accurate.
      await reloadIncomes();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          err.message ||
          "تعذر حذف مصدر الدخل"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main
      className="min-h-screen px-4 py-8 transition-colors duration-200 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
            >
              <span>لوحة التحكم</span>
            </Link>
            <span style={{ color: "var(--border-primary)" }}>/</span>
            <span
              className="rounded-lg px-2 py-1 font-semibold"
              style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
            >
              قائمة مصادر الدخل
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={reloadIncomes}
              disabled={loading}
              className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50"
              style={{
                borderColor: "var(--border-primary)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
            >
              تحديث ⟳
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-heading)" }}>
              مصادر الدخل
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              إدارة جميع مصادر الدخل الخاصة بك
            </p>
          </div>

          {/* Total */}
          <div
            className="rounded-xl border px-5 py-3"
            style={{
              borderColor: "var(--border-primary)",
              backgroundColor: "var(--bg-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>
              إجمالي الدخل
            </p>
            <p className="text-xl font-extrabold font-mono" style={{ color: "var(--brand-primary)" }}>
              {total.toLocaleString("ar-EG")} <span className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>EGP</span>
            </p>
          </div>
        </div>

        {/* Add button */}
        <div>
          <Link
            to="/income/new"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-95"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            ➕ إضافة مصدر دخل جديد
          </Link>
        </div>

        {/* Delete success */}
        {successMessage && (
          <div
            className="rounded-xl border p-3 text-sm font-semibold"
            style={{
              backgroundColor: "var(--status-success-bg)",
              borderColor: "var(--status-success-border)",
              color: "var(--status-success)",
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center">
            <div
              className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4"
              style={{
                borderColor: "var(--border-primary)",
                borderTopColor: "var(--brand-primary)",
              }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
              جاري تحميل قائمة الدخل...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: "var(--status-danger-bg)",
              borderColor: "var(--status-danger-border)",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--status-danger)" }}>
              ⚠️ {error}
            </p>
            <button
              type="button"
              onClick={reloadIncomes}
              className="mt-3 rounded-lg px-4 py-2 text-xs font-bold text-white"
              style={{ backgroundColor: "var(--status-danger)" }}
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && incomes.length === 0 && (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
            }}
          >
            <p className="text-3xl mb-3">💰</p>
            <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>
              لا توجد مصادر دخل مسجلة بعد
            </p>
            <button
              type="button"
              onClick={() => navigate("/income/new")}
              className="mt-4 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              إضافة مصدر دخل
            </button>
          </div>
        )}

        {/* Income List */}
        {!loading && !error && incomes.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {incomes.map((income) => (
              <IncomeCard
                key={income._id}
                income={income}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Delete confirmation */}
        <ConfirmDialog
          open={Boolean(selectedIncome)}
          busy={deleting}
          error={deleteError}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        >
          <p>
            هل أنت متأكد من حذف{" "}
            <strong>{selectedIncome?.name}</strong>؟
          </p>

          {selectedIncome?.recurrence &&
            selectedIncome.recurrence !== "once" && (
              <p className="mt-2" style={{ color: "var(--status-danger)" }}>
                سيتم حذف مصدر الدخل المتكرر بالكامل ولن تظهر
                له فترات مستقبلية.
              </p>
            )}
        </ConfirmDialog>
      </div>
    </main>
  );
}