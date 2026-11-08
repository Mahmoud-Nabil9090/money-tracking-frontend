import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Sidebar from "../../components/common/Sidebar";
import {
  getDebtSummary,
  getDebts,
  markDebtPaid,
  updateDebt,
} from "../../services/debtService";

const STATUS_LABELS = {
  active: "نشط",
  due_soon: "مستحق قريبًا",
  overdue: "متأخر",
  completed: "مكتمل",
};

const STATUS_STYLES = {
  active: {
    backgroundColor: "var(--status-info-bg)",
    color: "var(--status-info)",
  },
  due_soon: {
    backgroundColor: "var(--status-warning-bg)",
    color: "var(--status-warning)",
  },
  overdue: {
    backgroundColor: "var(--status-danger-bg)",
    color: "var(--status-danger)",
  },
  completed: {
    backgroundColor: "var(--status-success-bg)",
    color: "var(--status-success)",
  },
};

function getStatus(debt) {
  if (debt.debtStatus) return debt.debtStatus;
  if (debt.status === "paid") return "completed";
  if (debt.status === "overdue") return "overdue";
  return "active";
}

function formatAmount(amount, currency) {
  return `${Number(amount || 0).toLocaleString("ar-EG")} ${currency || "EGP"}`;
}

function formatDate(date) {
  if (!date) return "غير محدد";
  return new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function dateInputValue(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (!Number.isFinite(parsedDate.getTime())) return "";
  return [
    parsedDate.getFullYear(),
    String(parsedDate.getMonth() + 1).padStart(2, "0"),
    String(parsedDate.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function Debts() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [debts, setDebts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingDueDate, setSavingDueDate] = useState(false);
  const [dueDateEdit, setDueDateEdit] = useState(null);
  const [confirmDebt, setConfirmDebt] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [notice, setNotice] = useState("");

  const requestDebts = useCallback(async () => {
    const [debtList, debtSummary] = await Promise.all([
      getDebts(),
      getDebtSummary(),
    ]);
    return {
      debts: Array.isArray(debtList) ? debtList : [],
      summary: debtSummary,
    };
  }, []);

  const loadDebts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await requestDebts();
      setDebts(result.debts);
      setSummary(result.summary);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "تعذر تحميل بيانات الديون."
      );
    } finally {
      setLoading(false);
    }
  }, [requestDebts]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialDebts() {
      try {
        const result = await requestDebts();
        if (cancelled) return;
        setDebts(result.debts);
        setSummary(result.summary);
      } catch (requestError) {
        if (cancelled) return;
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "تعذر تحميل بيانات الديون."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitialDebts();
    return () => {
      cancelled = true;
    };
  }, [requestDebts]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  async function saveDueDate(event) {
    event.preventDefault();
    if (!dueDateEdit) return;

    try {
      setSavingDueDate(true);
      setError("");
      await updateDebt(dueDateEdit.id, {
        dueDate: dueDateEdit.value || null,
      });
      setDueDateEdit(null);
      setNotice("تم تحديث موعد الاستحقاق.");
      await loadDebts();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "تعذر تحديث موعد الاستحقاق."
      );
    } finally {
      setSavingDueDate(false);
    }
  }

  async function confirmCompletion() {
    if (!confirmDebt) return;

    try {
      setConfirmBusy(true);
      setConfirmError("");
      await markDebtPaid(confirmDebt._id);
      setConfirmDebt(null);
      setNotice("تم نقل الدين إلى قائمة الديون المكتملة.");
      await loadDebts();
    } catch (requestError) {
      setConfirmError(
        requestError.response?.data?.message ||
          requestError.message ||
          "تعذر إغلاق الدين."
      );
    } finally {
      setConfirmBusy(false);
    }
  }

  const displayName = user?.name || "المستخدم";
  const totalRemaining =
    summary?.totalRemaining ??
    debts.reduce(
      (total, debt) =>
        total + Math.max(0, Number(debt.totalAmount) - Number(debt.paidAmount || 0)),
      0
    );

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      dir="rtl"
    >
      <Sidebar userName={displayName} onLogout={handleLogout} />
      <main className="min-h-screen" style={{ marginRight: "var(--sidebar-width)" }}>
        <header
          className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--bg-secondary) 90%, transparent)",
            borderColor: "var(--border-primary)",
          }}
        >
          <div>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              MoneyTracking / الديون
            </p>
            <h1 className="mt-1 text-xl font-extrabold" style={{ color: "var(--text-heading)" }}>
              إدارة الديون
            </h1>
          </div>
          <button
            type="button"
            onClick={loadDebts}
            disabled={loading}
            className="rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-50"
            style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
          >
            تحديث
          </button>
        </header>

        <section className="space-y-6 p-6">
          {error && (
            <p role="alert" className="rounded-xl p-4 text-sm" style={{
              backgroundColor: "var(--status-danger-bg)",
              color: "var(--status-danger)",
            }}>
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="rounded-xl p-4 text-sm" style={{
              backgroundColor: "var(--status-success-bg)",
              color: "var(--status-success)",
            }}>
              {notice}
            </p>
          )}

          {summary && (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["المتبقي", formatAmount(totalRemaining)],
                ["قريب الاستحقاق", summary.dueSoonCount ?? 0],
                ["متأخر", summary.overdueCount ?? 0],
                ["أقرب موعد", formatDate(summary.nearestDueDate)],
              ].map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-2xl border p-5"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-primary)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</p>
                  <p
                    className="mt-2 text-lg font-extrabold"
                    style={{
                      color: label === "متأخر" && Number(value) > 0
                        ? "var(--status-danger)"
                        : "var(--text-heading)",
                    }}
                  >
                    {value}
                  </p>
                </article>
              ))}
            </section>
          )}

          {summary?.needsMorePayments && (
            <p
              className="rounded-xl border p-4 text-sm"
              style={{
                backgroundColor: "var(--status-info-bg)",
                borderColor: "var(--status-info-border)",
                color: "var(--status-info)",
              }}
            >
              {summary.message || "أضف دفعات أكثر لحساب التوقع"}
            </p>
          )}

          {summary?.estimatedSettlementDate && (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              موعد السداد المتوقع لكل الديون:{" "}
              <strong>{formatDate(summary.estimatedSettlementDate)}</strong>
            </p>
          )}

          <section className="space-y-4">
            <h2 className="text-lg font-bold" style={{ color: "var(--text-heading)" }}>
              كل الديون
            </h2>
            {loading && (
              <p className="rounded-xl border p-5" style={{ borderColor: "var(--border-primary)" }}>
                جاري تحميل الديون...
              </p>
            )}
            {!loading && !error && debts.length === 0 && (
              <p className="rounded-xl border p-5" style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
                color: "var(--text-secondary)",
              }}>
                مفيش ديون مسجلة حاليًا.
              </p>
            )}
            {!loading && debts.map((debt) => {
              const status = getStatus(debt);
              const remaining = Math.max(
                0,
                Number(debt.totalAmount) - Number(debt.paidAmount || 0)
              );
              const completed = status === "completed";
              const prediction = debt.prediction;

              return (
                <article
                  key={debt._id}
                  className="rounded-2xl border p-5"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: status === "overdue"
                      ? "var(--status-danger-border)"
                      : "var(--border-primary)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-base font-bold ${completed ? "line-through" : ""}`}
                          style={{
                            color: status === "overdue"
                              ? "var(--status-danger)"
                              : "var(--text-heading)",
                          }}
                        >
                          {completed && <span aria-label="مكتمل">✅ </span>}
                          {debt.creditor}
                        </h3>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-bold"
                          style={STATUS_STYLES[status]}
                        >
                          {STATUS_LABELS[status] || STATUS_LABELS.active}
                        </span>
                      </div>
                      <p className={`mt-2 text-sm ${completed ? "line-through" : ""}`}
                        style={{ color: "var(--text-secondary)" }}>
                        المتبقي: {formatAmount(remaining, debt.currency)}
                        {" · "}
                        المدفوع: {formatAmount(debt.paidAmount, debt.currency)}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                        الإجمالي: {formatAmount(debt.totalAmount, debt.currency)}
                      </p>
                      <div className="mt-3 text-sm" style={{
                        color: status === "overdue" ? "var(--status-danger)" : "var(--text-secondary)",
                      }}>
                        موعد الاستحقاق: {formatDate(debt.dueDate)}
                      </div>

                      {prediction?.needsMorePayments ? (
                        <p className="mt-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                          {prediction.message || "أضف دفعات أكثر لحساب التوقع"}
                        </p>
                      ) : prediction?.estimatedSettlementDate ? (
                        <p className="mt-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                          متوسط الدفع الشهري: {formatAmount(prediction.averageMonthlyPayment, debt.currency)}
                          {" · "}
                          السداد المتوقع: {formatDate(prediction.estimatedSettlementDate)}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!completed && (
                        <button
                          type="button"
                          onClick={() => setDueDateEdit({
                            id: debt._id,
                            value: dateInputValue(debt.dueDate),
                          })}
                          className="rounded-xl border px-3 py-2 text-xs font-bold"
                          style={{ borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
                        >
                          تعديل الموعد
                        </button>
                      )}
                      {!completed && (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDebt(debt);
                            setConfirmError("");
                          }}
                          className="rounded-xl px-3 py-2 text-xs font-bold text-white"
                          style={{ backgroundColor: "var(--status-success)" }}
                        >
                          تم السداد
                        </button>
                      )}
                    </div>
                  </div>

                  {dueDateEdit?.id === debt._id && (
                    <form
                      onSubmit={saveDueDate}
                      className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4"
                      style={{ borderColor: "var(--border-secondary)" }}
                    >
                      <label className="flex flex-col gap-2 text-xs font-semibold">
                        موعد الاستحقاق
                        <input
                          type="date"
                          value={dueDateEdit.value}
                          onChange={(event) => setDueDateEdit({
                            ...dueDateEdit,
                            value: event.target.value,
                          })}
                          className="rounded-lg border px-3 py-2"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-primary)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={savingDueDate}
                        className="rounded-lg px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                        style={{ backgroundColor: "var(--brand-primary)" }}
                      >
                        {savingDueDate ? "جاري الحفظ..." : "حفظ الموعد"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDueDateEdit(null)}
                        disabled={savingDueDate}
                        className="rounded-lg border px-4 py-2 text-xs font-bold"
                        style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}
                      >
                        إلغاء
                      </button>
                    </form>
                  )}
                </article>
              );
            })}
          </section>
        </section>
      </main>

      <ConfirmDialog
        open={Boolean(confirmDebt)}
        title="تأكيد إغلاق الدين"
        busy={confirmBusy}
        busyText="جاري التأكيد..."
        error={confirmError}
        confirmText="تأكيد السداد"
        cancelText="رجوع"
        onCancel={() => setConfirmDebt(null)}
        onConfirm={confirmCompletion}
      >
        {confirmDebt && (
          <>
            هل تؤكد نقل دين <strong>{confirmDebt.creditor}</strong> إلى الديون المكتملة؟
            {" "}سيتم اعتبار كامل المبلغ مسددًا بعد التأكيد.
          </>
        )}
      </ConfirmDialog>
    </div>
  );
}
