import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  getAccounts,
  getAccountTransactions,
  adjustAccountBalance,
} from "../../services/accountService";
import AccountFilters from "../../components/accounts/AccountFilters";
import AccountBalanceModal from "../../components/accounts/AccountBalanceModal";
import ThemeToggle from "../../components/ThemeToggle";

function formatDisplayDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AccountDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [accountData, setAccountData] = useState(
    location.state?.account || null
  );

  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    start: "",
    end: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [savingBalance, setSavingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // جلب بيانات الحساب وتاريخ الحركات
  useEffect(() => {
    let cancelled = false;

    async function loadAccountAndTransactions() {
      if (!id) return;
      try {
        setError("");

        // 1. جلب بيانات الحساب إذا لم تكن موجودة في الـ state
        const accountsPromise = !accountData
          ? getAccounts()
          : Promise.resolve(null);

        // 2. جلب الحركات الخاصة بالحساب
        const transactionsPromise = getAccountTransactions(id, appliedFilters);

        const [accountsRes, txnsRes] = await Promise.all([
          accountsPromise,
          transactionsPromise,
        ]);

        if (cancelled) return;

        if (accountsRes) {
          const list = Array.isArray(accountsRes)
            ? accountsRes
            : accountsRes?.data || [];
          const found = list.find((acc) => (acc._id || acc.id) === id);
          if (found) {
            setAccountData(found);
          }
        }

        const txnsList = Array.isArray(txnsRes)
          ? txnsRes
          : txnsRes?.data || [];

        // ترتيب الحركات: من الأحدث للأقدم (Newest -> Oldest)
        const sorted = [...txnsList].sort(
          (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
        );

        setTransactions(sorted);
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading account details:", err);
        setError(
          err.response?.data?.message ||
            "تعذر تحميل تفاصيل الحساب وتاريخ الحركات."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAccountAndTransactions();

    return () => {
      cancelled = true;
    };
  }, [id, appliedFilters, accountData]);

  const handleApplyFilters = () => {
    setLoading(true);
    setAppliedFilters({
      start: startDate,
      end: endDate,
    });
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setLoading(true);
    setAppliedFilters({
      start: "",
      end: "",
    });
  };

  const handleOpenBalanceModal = () => {
    setBalanceError("");
    setIsBalanceModalOpen(true);
  };

  const handleCloseBalanceModal = () => {
    if (savingBalance) return;
    setIsBalanceModalOpen(false);
    setBalanceError("");
  };

  // US-302: تعديل الرصيد يدوياً
  const handleSaveBalance = async (data) => {
    try {
      setSavingBalance(true);
      setBalanceError("");

      const response = await adjustAccountBalance(id, data);

      if (response.success || response.data) {
        const updated = response.data || response;
        setAccountData(updated);
        setSuccessToast("تم تعديل الرصيد بنجاح");
        setTimeout(() => setSuccessToast(""), 4000);

        // إعادة جلب الحركات فوراً
        const txnsRes = await getAccountTransactions(id, appliedFilters);
        const txnsList = Array.isArray(txnsRes) ? txnsRes : txnsRes?.data || [];
        const sorted = [...txnsList].sort(
          (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
        );
        setTransactions(sorted);
        return true;
      }

      setBalanceError(response.message || "تعذر تعديل رصيد الحساب.");
      return false;
    } catch (err) {
      console.error("Error adjusting account balance:", err);
      setBalanceError(
        err.response?.data?.message ||
          "حدث خطأ أثناء تعديل الرصيد، يرجى المحاولة مرة أخرى."
      );
      return false;
    } finally {
      setSavingBalance(false);
    }
  };

  const balance = Number(accountData?.balance || 0);
  const isNegative = balance < 0;
  const currency = accountData?.currency || "EGP";

  return (
    <main
      className="min-h-screen bg-slate-50/80 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        {/* Toast النجاح */}
        {successToast && (
          <div
            role="status"
            className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-300"
          >
            <span>✓</span>
            <span>{successToast}</span>
          </div>
        )}

        {/* Navigation & Header */}
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
              تفاصيل الحساب وتاريخ الحركات (US-305)
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/accounts"
              className="hidden items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 sm:flex"
            >
              <span>العودة للحسابات</span>
              <span aria-hidden="true">&larr;</span>
            </Link>
          </div>
        </div>

        {/* تنبيه الرصيد السالب إن وجد (US-303) */}
        {isNegative && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          >
            <div className="flex items-center gap-2 font-bold">
              <span>⚠️</span>
              <span>تنبيه: الرصيد الحالي غير كافٍ أو بالسالب ({balance.toLocaleString()} {currency})</span>
            </div>
            <p className="mt-1 text-xs opacity-90">
              يتم تحديث الرصيد تلقائياً بواسطة السيرفر عند تسجيل مصروفات أو مداخيل جديدة.
            </p>
          </div>
        )}

        {/* بطاقة معلومات الحساب وزر تعديل الرصيد */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 md:flex md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {accountData?.type || "Account"}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {accountData?.name || "تفاصيل الحساب"}
              </h1>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                الرصيد الحالي:
              </span>
              <span
                className={`text-3xl font-extrabold tracking-tight ${
                  isNegative
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {balance.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {currency}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 md:mt-0">
            {/* زر تعديل الرصيد يدوياً (US-302) */}
            <button
              type="button"
              onClick={handleOpenBalanceModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95"
            >
              <span>✏️ تعديل الرصيد يدوياً</span>
            </button>
          </div>
        </div>

        {/* فلترة الحركات بالتاريخ */}
        <AccountFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        {/* جدول تاريخ الحركات (US-305) */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              تاريخ الحركات (Transaction History)
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              مرتبة من الأحدث إلى الأقدم (Newest &rarr; Oldest)
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                جاري تحميل الحركات...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400">
              <p className="text-base font-semibold">لا توجد حركات مسجلة</p>
              <p className="mt-1 text-xs">
                لم يتم العثور على حركات مالية لهذا الحساب في الفترة المحددة.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-right text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-3.5">التاريخ (Date)</th>
                    <th className="px-6 py-3.5">الوصف (Description)</th>
                    <th className="px-6 py-3.5">النوع (Type)</th>
                    <th className="px-6 py-3.5 text-left">المبلغ (Amount)</th>
                    <th className="px-6 py-3.5 text-left">الرصيد بعد الحركة (Balance After)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {transactions.map((tx) => {
                    const rawAmount = Number(tx.amount || 0);
                    const isCredit = tx.type === "credit";
                    const isDebit = tx.type === "debit";
                    const isAdjustment = tx.type === "adjustment";

                    // تحديد الإشارة والمبلغ:
                    // Credit -> موجب (+) بلون أخضر
                    // Debit -> سالب (-) بلون أحمر
                    // Adjustment -> موجب أو سالب حسب الفرق
                    let displaySign = "";
                    let isPositive = false;

                    if (isCredit) {
                      displaySign = "+";
                      isPositive = true;
                    } else if (isDebit) {
                      displaySign = "-";
                      isPositive = false;
                    } else if (isAdjustment) {
                      const diff = Number(tx.balanceAfter || 0) - Number(tx.balanceBefore || 0);
                      displaySign = diff >= 0 ? "+" : "-";
                      isPositive = diff >= 0;
                    }

                    return (
                      <tr
                        key={tx._id}
                        className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                      >
                        {/* التاريخ */}
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                          {formatDisplayDate(tx.date)}
                        </td>

                        {/* الوصف */}
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                          <p className="font-semibold">{tx.description || "معاملة"}</p>
                          {tx.notes && (
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {tx.notes}
                            </p>
                          )}
                        </td>

                        {/* النوع */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                              isCredit
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : isDebit
                                ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                            }`}
                          >
                            {isCredit
                              ? "دخل (Credit)"
                              : isDebit
                              ? "مصروف (Debit)"
                              : "تعديل (Adjustment)"}
                          </span>
                        </td>

                        {/* المبلغ مع الإشارة */}
                        <td
                          className={`px-6 py-4 text-left font-bold ${
                            isPositive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {displaySign}
                          {rawAmount.toLocaleString()} {currency}
                        </td>

                        {/* الرصيد بعد الحركة */}
                        <td className="px-6 py-4 text-left font-bold text-slate-900 dark:text-white">
                          {Number(tx.balanceAfter ?? 0).toLocaleString()} {currency}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal تعديل الرصيد (US-302) */}
        <AccountBalanceModal
          account={accountData}
          isOpen={isBalanceModalOpen}
          onClose={handleCloseBalanceModal}
          onSave={handleSaveBalance}
          saving={savingBalance}
          error={balanceError}
        />
      </div>
    </main>
  );
}

export default AccountDetails;