import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <section className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Income
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your income sources
          </p>
        </div>

        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Income
          </p>

          <p className="text-xl font-bold text-gray-900">
            {total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Delete success */}
      {successMessage && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div
          role="status"
          className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500"
        >
          Loading income...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={reloadIncomes}
            className="mt-3 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && incomes.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">
            No income records yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/income/new")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Add Income
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
            <p className="mt-2 text-red-600">
              سيتم حذف مصدر الدخل المتكرر بالكامل ولن تظهر
              له فترات مستقبلية.
            </p>
          )}
      </ConfirmDialog>
    </section>
  );
}