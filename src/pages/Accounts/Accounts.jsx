import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getAccounts,
  archiveAccount,
  restoreAccount,
} from "../../services/accountService";
import TotalWealthCard from "../../components/accounts/TotalWealthCard";
import AccountList from "../../components/accounts/AccountList";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ThemeToggle from "../../components/ThemeToggle";

function Accounts() {
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'archived'

  // Confirm dialog state for archive / restore
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null, // 'archive' | 'restore'
    account: null,
    busy: false,
    error: "",
  });

  const [toastMessage, setToastMessage] = useState(
    location.state?.toast || location.state?.successMessage || ""
  );

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccounts();
      const list = Array.isArray(response)
        ? response
        : response?.data || [];

      setAccounts(list);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError(
        err.response?.data?.message ||
          "تعذر تحميل بيانات الحسابات. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setError("");
        const response = await getAccounts();
        if (cancelled) return;
        const list = Array.isArray(response)
          ? response
          : response?.data || [];
        setAccounts(list);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching accounts:", err);
        setError(
          err.response?.data?.message ||
            "تعذر تحميل بيانات الحسابات. يرجى المحاولة مرة أخرى."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter accounts into active and archived
  const activeAccounts = accounts.filter((acc) => acc.isActive !== false);
  const archivedAccounts = accounts.filter((acc) => acc.isActive === false);

  // Wealth is calculated from active accounts
  const totalWealth = activeAccounts.reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  );

  const currency = accounts[0]?.currency || "EGP";

  // Handlers for initiating archive/restore
  const handleRequestArchive = (account) => {
    setConfirmDialog({
      open: true,
      action: "archive",
      account,
      busy: false,
      error: "",
    });
  };

  const handleRequestRestore = (account) => {
    setConfirmDialog({
      open: true,
      action: "restore",
      account,
      busy: false,
      error: "",
    });
  };

  const handleCloseConfirm = () => {
    if (confirmDialog.busy) return;
    setConfirmDialog({
      open: false,
      action: null,
      account: null,
      busy: false,
      error: "",
    });
  };

  const handleConfirmAction = async () => {
    const { action, account } = confirmDialog;
    if (!account) return;

    try {
      setConfirmDialog((prev) => ({ ...prev, busy: true, error: "" }));

      if (action === "archive") {
        await archiveAccount(account._id || account.id);
        setToastMessage(`تمت أرشفة حساب "${account.name}" بنجاح.`);
      } else if (action === "restore") {
        await restoreAccount(account._id || account.id);
        setToastMessage(`تمت استعادة حساب "${account.name}" بنجاح.`);
      }

      handleCloseConfirm();
      await fetchAccounts();
    } catch (err) {
      console.error(`Error performing ${action} on account:`, err);
      setConfirmDialog((prev) => ({
        ...prev,
        busy: false,
        error:
          err.response?.data?.message ||
          "حدث خطأ أثناء تنفيذ العملية. يرجى المحاولة مرة أخرى.",
      }));
    }
  };

  return (
    <main
      className="min-h-screen bg-slate-50/80 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        {/* Success Toast */}
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
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-200/60 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <span>الرئيسية</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="rounded-lg bg-blue-50 px-2 py-1 font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              إدارة الحسابات والمحافظ (Dev 4)
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={fetchAccounts}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              تحديث ⟳
            </button>
          </div>
        </div>

        {/* Title & Action Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              الحسابات والمحافظ (Accounts & Wallets)
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              إدارة حساباتك البنكية، المحافظ الإلكترونية، وأموال الكاش مع إمكانية الأرشفة وتعديل الرصيد.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/accounts/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 active:scale-95"
            >
              <span>➕</span>
              <span>إضافة حساب جديد (US-301)</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <p className="font-semibold">⚠️ {error}</p>
            <button
              type="button"
              onClick={fetchAccounts}
              className="mt-3 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              جاري تحميل بيانات الحسابات...
            </p>
          </div>
        ) : (
          <>
            {/* Total Wealth Summary */}
            <TotalWealthCard totalWealth={totalWealth} currency={currency} />

            {/* Tabs: Active vs Archived */}
            <div className="mb-6 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <div className="inline-flex rounded-2xl bg-slate-200/60 p-1 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveTab("active")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
                    activeTab === "active"
                      ? "bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span>الحسابات النشطة (Active Accounts)</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === "active"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-slate-300/70 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {activeAccounts.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("archived")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
                    activeTab === "archived"
                      ? "bg-white text-amber-700 shadow-sm dark:bg-slate-900 dark:text-amber-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span>الحسابات المؤرشفة (Archived Accounts)</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === "archived"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-slate-300/70 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {archivedAccounts.length}
                  </span>
                </button>
              </div>

              <span className="text-xs text-slate-400 dark:text-slate-500">
                {activeTab === "active"
                  ? "الحسابات النشطة فقط هي المتاحة للاختيار في المصاريف والمداخيل"
                  : "الحسابات المؤرشفة معطلة ومحجوبة عن الاختيار في النماذج"}
              </span>
            </div>

            {/* List of Accounts */}
            {activeTab === "active" ? (
              <AccountList
                accounts={activeAccounts}
                onArchive={handleRequestArchive}
                emptyMessage="لا توجد حسابات نشطة حالياً."
              />
            ) : (
              <AccountList
                accounts={archivedAccounts}
                onRestore={handleRequestRestore}
                emptyMessage="لا توجد حسابات مؤرشفة."
              />
            )}
          </>
        )}

        {/* Confirmation Dialog for Archive / Restore (US-306) */}
        <ConfirmDialog
          open={confirmDialog.open}
          title={
            confirmDialog.action === "archive"
              ? `أرشفة الحساب "${confirmDialog.account?.name}"`
              : `استعادة الحساب "${confirmDialog.account?.name}"`
          }
          busy={confirmDialog.busy}
          error={confirmDialog.error}
          confirmText={
            confirmDialog.action === "archive" ? "تأكيد الأرشفة" : "تأكيد الاستعادة"
          }
          cancelText="إلغاء"
          onCancel={handleCloseConfirm}
          onConfirm={handleConfirmAction}
        >
          {confirmDialog.action === "archive" ? (
            <p>
              هل أنت متأكد من رغبتك في أرشفة هذا الحساب؟ لن يتم حذفه ولكن سيتم تعطيله ومنع اختياره في نماذج المصاريف والمداخيل، ويمكنك استعادته في أي وقت من تبويب الحسابات المؤرشفة.
            </p>
          ) : (
            <p>
              هل تريد استعادة هذا الحساب وتفعيله مجدداً ليعود متاحاً للاستخدام وتسجيل العمليات المالية؟
            </p>
          )}
        </ConfirmDialog>
      </div>
    </main>
  );
}

export default Accounts;
