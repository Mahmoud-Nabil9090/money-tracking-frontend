/**
 * Dashboard — Emerald Dusk Redesign
 * Sidebar layout with KPI cards, Cashflow chart, Outflows, Transactions
 * Matches the provided reference design image
 */
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardData } from "../../services/dashboardService";
import { getDebtSummary } from "../../services/debtService";
import Sidebar from "../../components/common/Sidebar";
import DashboardFilter from "../../components/dashboard/DashboardFilter";
import DebtSummaryCard from "../../components/dashboard/DebtSummaryCard";
import MonthComparisonCard from "../../components/dashboard/MonthComparisonCard";

/* ── constants ─────────────────────────────────────────── */
const MONTH_NAMES_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

const ACCOUNT_ICONS = { bank: "🏦", wallet: "📱", cash: "💵" };

/* ── component ─────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /* filter state */
  const [filterParams, setFilterParams] = useState({ period: "month" });

  /* dashboard data */
  const [data,        setData]        = useState(null);
  const [debtSummary, setDebtSummary] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [debtLoading, setDebtLoading] = useState(true);
  const [error,       setError]       = useState("");

  /* activity tab */
  const [activityTab, setActivityTab] = useState("all");

  /* ── fetch dashboard ──────────────────────────────────── */
  const fetchDashboard = useCallback(async (params) => {
    try {
      const res = await getDashboardData(params);
      setData(res);
      setError("");
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(
        err.response?.data?.message ||
          "تعذر تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── fetch debt summary ─────────────────────── */
  const fetchDebtSummary = useCallback(async () => {
    try {
      const res = await getDebtSummary();
      setDebtSummary(res);
    } catch (err) {
      console.error("Debt summary error:", err);
    } finally {
      setDebtLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getDashboardData(filterParams)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Dashboard load error:", err);
        setError(
          err.response?.data?.message ||
            "تعذر تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filterParams]);

  useEffect(() => {
    let cancelled = false;
    getDebtSummary()
      .then((result) => {
        if (!cancelled) setDebtSummary(result);
      })
      .catch((err) => {
        if (!cancelled) console.error("Debt summary error:", err);
      })
      .finally(() => {
        if (!cancelled) setDebtLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── derived values ───────────────────────────────────── */
  const handleLogout = () => { logout(); navigate("/login"); };
  const handleFilterChange = (params) => {
    setLoading(true);
    setFilterParams(params);
  };

  const userName        = user?.name || "المستخدم";
  const accounts        = data?.accounts || [];
  const totalWealth     = Number(data?.totalAccountBalance || 0);
  const totalIncome     = Number(data?.income?.total  || 0);
  const totalExpenses   = Number(data?.expenses?.total || 0);
  const netBalance      = Number(data?.netBalance || 0);
  const savingsRate     = totalIncome > 0
    ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))
    : 0;

  /* Cash account (type=cash) */
  const cashAccounts    = accounts.filter((a) => a.type === "cash");
  const cashBalance     = cashAccounts.reduce((s, a) => s + Number(a.balance || 0), 0);

  const chartData          = data?.chartData          || [];
  const expenseCategories  = data?.expenseCategories  || [];
  const recentActivity     = data?.recentActivity     || [];

  const filteredActivity = recentActivity.filter((item) =>
    activityTab === "all" ? true : item.type === activityTab
  );

  const maxChartVal = Math.max(
    ...chartData.map((d) => Math.max(d.income || 0, d.expenses || 0)),
    1
  );

  const fmt = (n) => Number(n || 0).toLocaleString("ar-EG");

  /* Get current month/year for greeting */
  const now = new Date();
  const greeting = now.getHours() < 12 ? "صباح الخير" : now.getHours() < 18 ? "مساء الخير" : "مساء الخير";

  /* ── render ───────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen font-sans antialiased transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      dir="rtl"
    >
      {/* Sidebar */}
      <Sidebar userName={userName} onLogout={handleLogout} />

      {/* Main Content — offset by sidebar width */}
      <main
        className="transition-all duration-200"
        style={{ marginRight: "var(--sidebar-width)" }}
      >
        {/* ═══════════════════════════════════════════════════
            TOP BAR
        ═══════════════════════════════════════════════════ */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3 backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--bg-secondary) 90%, transparent)",
            borderColor: "var(--border-primary)",
          }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
            <span style={{ color: "var(--text-secondary)" }}>MoneyTracking</span>
            <span>&gt;</span>
            <span className="font-bold" style={{ color: "var(--brand-primary)" }}>لوحة التحكم</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setDebtLoading(true);
                fetchDashboard(filterParams);
                fetchDebtSummary();
              }}
              disabled={loading}
              className="rounded-lg p-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              style={{ color: "var(--text-secondary)" }}
              title="تحديث البيانات"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
            </button>
            
            {/* Share button */}
            <button
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Zm0-12.814a2.25 2.25 0 1 0 3.933 2.185 2.25 2.25 0 0 0-3.933-2.185Z" />
              </svg>
              مشاركة
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════
            MAIN DASHBOARD CONTENT
        ═══════════════════════════════════════════════════ */}
        <div className="px-6 py-6 space-y-6">

          {/* ── Greeting + Filter ── */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="animate-fade-in-up">
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-heading)" }}>
                {greeting}، <span style={{ color: "var(--brand-primary)" }}>{userName}</span> 👋
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                نظرة عامة على وضعك المالي والنشاط الأخير
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 animate-fade-in-up stagger-1">
              <DashboardFilter
                value={filterParams.period}
                onChange={handleFilterChange}
              />
              <Link
                to="/expenses/new"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                <span>+</span>
                <span>تسجيل مصروف</span>
              </Link>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl border p-4 text-sm font-semibold"
              style={{
                backgroundColor: "var(--status-danger-bg)",
                borderColor: "var(--status-danger-border)",
                color: "var(--status-danger)",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              KPI CARDS — 4 columns like the reference
          ═══════════════════════════════════════════════════ */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Balance */}
            <KPICard
              label="إجمالي الأرصدة"
              value={fmt(totalWealth)}
              currency="EGP"
              subtitle={`${accounts.length} حسابات نشطة`}
              icon="💎"
              iconBg="var(--kpi-balance-icon-bg)"
              iconColor="var(--kpi-balance-icon-color)"
              link="/accounts"
              delay="stagger-1"
            />
            {/* Monthly Income */}
            <KPICard
              label="الدخل الشهري"
              value={fmt(totalIncome)}
              currency="EGP"
              subtitle={`${data?.income?.count || 0} حركة دخل`}
              icon="📈"
              iconBg="var(--kpi-income-icon-bg)"
              iconColor="var(--kpi-income-icon-color)"
              link="/income"
              delay="stagger-2"
            />
            {/* Monthly Expenses */}
            <KPICard
              label="المصروفات الشهرية"
              value={fmt(totalExpenses)}
              currency="EGP"
              subtitle={`${data?.expenses?.count || 0} عملية صرف`}
              icon="📉"
              iconBg="var(--kpi-expense-icon-bg)"
              iconColor="var(--kpi-expense-icon-color)"
              link="/expenses"
              delay="stagger-3"
            />
            {/* Savings */}
            <KPICard
              label="المدخرات"
              value={fmt(netBalance)}
              currency="EGP"
              subtitle={`نسبة الادخار ${savingsRate}%`}
              icon="🏆"
              iconBg="var(--kpi-savings-icon-bg)"
              iconColor="var(--kpi-savings-icon-color)"

              delay="stagger-4"
            />
          </section>

          {/* ═══════════════════════════════════════════════════
              CHARTS: Cashflow + Expense Categories (Outflows)
          ═══════════════════════════════════════════════════ */}
          <section className="grid gap-6 lg:grid-cols-12">
            {/* Cashflow Chart — 7 cols */}
            <div
              className="rounded-2xl border p-6 lg:col-span-7 animate-fade-in-up stagger-2"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-base">📈</span>
                  <h3 className="text-base font-bold" style={{ color: "var(--text-heading)" }}>
                    التدفق المالي
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5" style={{ color: "var(--brand-primary)" }}>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> دخل
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: "var(--status-danger)" }}>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> مصاريف
                  </span>
                </div>
              </div>

              {/* Amount display */}
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono" style={{ color: "var(--text-heading)" }}>
                  {fmt(totalWealth)}
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--text-tertiary)" }}>EGP</span>
                {savingsRate > 0 && (
                  <span className="mr-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    +{savingsRate}%
                  </span>
                )}
              </div>

              {/* Chart Bars */}
              <div className="flex h-48 items-end justify-between gap-3 border-b pt-4" style={{ borderColor: "var(--border-secondary)" }}>
                {chartData.map((item, idx) => {
                  const monthName = MONTH_NAMES_AR[item.month] || `M${item.month + 1}`;
                  const incH = Math.max(8, Math.round(((item.income   || 0) / maxChartVal) * 160));
                  const expH = Math.max(8, Math.round(((item.expenses || 0) / maxChartVal) * 160));
                  const isCurrentMonth = item.month === now.getMonth();
                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full items-end justify-center gap-1">
                        <div
                          className="w-full max-w-[16px] rounded-t-md transition-all duration-500 hover:brightness-110 cursor-pointer"
                          style={{
                            height: `${incH}px`,
                            backgroundColor: "var(--brand-primary)",
                            opacity: isCurrentMonth ? 1 : 0.6,
                          }}
                          title={`دخل: ${fmt(item.income)} EGP`}
                        />
                        <div
                          className="w-full max-w-[16px] rounded-t-md transition-all duration-500 hover:brightness-110 cursor-pointer"
                          style={{
                            height: `${expH}px`,
                            backgroundColor: "var(--status-danger)",
                            opacity: isCurrentMonth ? 1 : 0.5,
                          }}
                          title={`مصاريف: ${fmt(item.expenses)} EGP`}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-semibold ${isCurrentMonth ? "font-bold" : ""}`}
                        style={{
                          color: isCurrentMonth ? "var(--brand-primary)" : "var(--text-tertiary)",
                        }}
                      >
                        {monthName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outflows / Expense Categories — 5 cols */}
            <div
              className="rounded-2xl border p-6 lg:col-span-5 flex flex-col animate-fade-in-up stagger-3"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏷️</span>
                  <h3 className="text-base font-bold" style={{ color: "var(--text-heading)" }}>
                    توزيع المصروفات
                  </h3>
                </div>
                <Link to="/expenses/categories" className="text-xs font-bold hover:underline" style={{ color: "var(--brand-primary)" }}>
                  التصنيفات ←
                </Link>
              </div>

              {/* Total outflow amount */}
              <div className="mb-4 text-center">
                <span className="text-2xl font-extrabold font-mono" style={{ color: "var(--status-danger)" }}>
                  {fmt(totalExpenses)}
                </span>
                <span className="mr-1 text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>EGP</span>
              </div>

              {/* Categories list */}
              <div className="flex-1 space-y-3.5 overflow-y-auto">
                {expenseCategories.length === 0 ? (
                  <div className="py-8 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                    لا توجد مصاريف في هذه الفترة
                  </div>
                ) : (
                  expenseCategories.map((cat, idx) => {
                    const pct = totalExpenses > 0 ? Math.round((Number(cat.total || 0) / totalExpenses) * 100) : 0;
                    const catColor = cat.color || "#10b981";
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-bold" style={{ color: "var(--text-primary)" }}>
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: catColor }} />
                            {cat.name}
                          </span>
                          <span className="font-mono font-bold" style={{ color: "var(--text-secondary)" }}>
                            {fmt(cat.total)} EGP
                          </span>
                        </div>
                        <div
                          className="h-2 w-full overflow-hidden rounded-full"
                          style={{ backgroundColor: "var(--bg-tertiary)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(100, Math.max(4, pct))}%`,
                              backgroundColor: catColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <Link
                to="/expenses/new"
                className="mt-4 flex w-full items-center justify-center rounded-xl border py-2.5 text-xs font-bold transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-tertiary)",
                }}
              >
                + تسجيل مصروف جديد
              </Link>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              ACCOUNTS GRID
          ═══════════════════════════════════════════════════ */}
          <section className="space-y-4 animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-heading)" }}>
                  <span>🏦</span><span>الحسابات والمحافظ</span>
                </h2>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>أرصدتك في البنوك والمحافظ الرقمية والنقدية</p>
              </div>
              <Link to="/accounts/new" className="text-xs font-bold hover:underline" style={{ color: "var(--brand-primary)" }}>
                + إضافة محفظة
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((acc) => {
                const accIcon = ACCOUNT_ICONS[acc.type] || "💳";
                const balance = Number(acc.balance || 0);
                const color   = acc.color || "#10b981";
                return (
                  <Link
                    key={acc._id}
                    to={`/accounts/${acc._id}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-primary)",
                      boxShadow: "var(--shadow-card)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                      e.currentTarget.style.borderColor = color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-card)";
                      e.currentTarget.style.borderColor = "var(--border-primary)";
                    }}
                  >
                    <div className="absolute top-0 right-0 left-0 h-1 transition-all group-hover:h-1.5" style={{ backgroundColor: color }} />
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-2xl">{accIcon}</span>
                        <h3 className="mt-2 text-base font-bold transition" style={{ color: "var(--text-heading)" }}>
                          {acc.name}
                        </h3>
                        <span className="text-[11px] font-semibold uppercase" style={{ color: "var(--text-tertiary)" }}>
                          {acc.type}
                        </span>
                      </div>
                      <div className="h-3 w-3 rounded-full ring-2" style={{ backgroundColor: color, ringColor: "var(--bg-card)" }} />
                    </div>
                    <div className="mt-5 border-t pt-3 flex items-baseline justify-between" style={{ borderColor: "var(--border-secondary)" }}>
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>الرصيد:</span>
                      <span className="font-mono text-xl font-extrabold" style={{ color: "var(--text-heading)" }}>
                        {balance.toLocaleString("ar-EG")}{" "}
                        <span className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>{acc.currency || "EGP"}</span>
                      </span>
                    </div>
                  </Link>
                );
              })}

              <Link
                to="/accounts/new"
                className="flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-tertiary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand-primary)";
                  e.currentTarget.style.color = "var(--brand-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-primary)";
                  e.currentTarget.style.color = "var(--text-tertiary)";
                }}
              >
                <span className="text-2xl">➕</span>
                <span className="mt-2 text-xs font-bold">إضافة حساب جديد</span>
                <span className="text-[11px]">Bank · Wallet · Cash</span>
              </Link>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              CASH WIDGET + DEBT SUMMARY
          ═══════════════════════════════════════════════════ */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Cash Balance Widget */}
            <div
              className="rounded-2xl border p-6 transition-all animate-fade-in-up stagger-3"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-heading)" }}>
                    <span>💵</span><span>رصيد النقدي (Cash)</span>
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>محافظ النقدية المتوفرة لديك</p>
                </div>
                <Link to="/accounts" className="text-xs font-bold hover:underline" style={{ color: "var(--brand-primary)" }}>
                  عرض الكل ←
                </Link>
              </div>

              {cashAccounts.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-3xl mb-2">💸</p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>لا توجد محافظ نقدية مسجلة</p>
                  <Link to="/accounts/new" className="mt-2 inline-block text-xs font-bold hover:underline" style={{ color: "var(--brand-primary)" }}>
                    إضافة محفظة نقدية
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-mono text-4xl font-extrabold" style={{ color: "var(--brand-primary)" }}>{fmt(cashBalance)}</span>
                    <span className="text-sm font-bold" style={{ color: "var(--text-tertiary)" }}>EGP</span>
                  </div>
                  <div className="space-y-2">
                    {cashAccounts.map((acc) => (
                      <Link
                        key={acc._id}
                        to={`/accounts/${acc._id}`}
                        className="flex items-center justify-between rounded-xl border px-4 py-2.5 transition-colors"
                        style={{
                          borderColor: "var(--border-primary)",
                          backgroundColor: "var(--bg-tertiary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                        }}
                      >
                        <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{acc.name}</span>
                        <span className="font-mono text-sm font-bold" style={{ color: "var(--brand-primary)" }}>
                          {Number(acc.balance || 0).toLocaleString("ar-EG")} {acc.currency || "EGP"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Debt Summary */}
            <DebtSummaryCard summary={debtSummary} loading={debtLoading} />
          </section>

          {/* ═══════════════════════════════════════════════════
              MONTH COMPARISON
          ═══════════════════════════════════════════════════ */}
          <MonthComparisonCard data={data} loading={loading} />

          {/* ═══════════════════════════════════════════════════
              RECENT TRANSACTIONS
          ═══════════════════════════════════════════════════ */}
          <section
            className="rounded-2xl border p-6 animate-fade-in-up stagger-4"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4" style={{ borderColor: "var(--border-secondary)" }}>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-heading)" }}>
                  <span>⚡</span><span>آخر المعاملات</span>
                </h2>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>سجل لحظي لآخر الإيداعات والمصروفات</p>
              </div>
              <div
                className="inline-flex rounded-xl p-1 ring-1 text-xs"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  ringColor: "var(--border-primary)",
                }}
              >
                {[
                  { key: "all",     label: "الكل" },
                  { key: "expense", label: "المصاريف" },
                  { key: "income",  label: "المداخيل" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivityTab(key)}
                    className="rounded-lg px-3 py-1.5 font-bold transition-all"
                    style={{
                      backgroundColor: activityTab === key
                        ? (key === "expense" ? "var(--status-danger)" : key === "income" ? "var(--brand-primary)" : "var(--bg-card)")
                        : "transparent",
                      color: activityTab === key
                        ? (key === "all" ? "var(--text-primary)" : "#fff")
                        : "var(--text-tertiary)",
                      boxShadow: activityTab === key ? "var(--shadow-sm)" : "none",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 divide-y" style={{ divideColor: "var(--border-secondary)" }}>
              {filteredActivity.length === 0 ? (
                <div className="py-12 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                  لا توجد حركات مسجلة مؤخراً
                </div>
              ) : (
                filteredActivity.map((tx) => {
                  const isInc  = tx.type === "income";
                  const dateStr = tx.date
                    ? new Date(tx.date).toLocaleDateString("ar-EG", { day: "numeric", month: "short" })
                    : "—";
                  return (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between py-3.5 px-2 rounded-xl transition-colors"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-base"
                          style={{
                            backgroundColor: isInc ? "var(--status-success-bg)" : "var(--status-danger-bg)",
                            color: isInc ? "var(--status-success)" : "var(--status-danger)",
                          }}
                        >
                          {isInc ? "📈" : "💸"}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                            {tx.name || "معاملة"}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                            <span>{dateStr}</span>
                            {tx.category && <><span>•</span><span>{tx.category}</span></>}
                          </div>
                        </div>
                      </div>
                      <div className="text-left font-mono font-bold">
                        <span
                          className="text-base"
                          style={{ color: isInc ? "var(--status-success)" : "var(--status-danger)" }}
                        >
                          {isInc ? "+" : "-"}{Number(tx.amount || 0).toLocaleString("ar-EG")}
                        </span>{" "}
                        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{tx.currency || "EGP"}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Quick Actions Footer */}
          <div className="flex flex-wrap items-center gap-3 pb-4">
            <Link
              to="/income/new"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <span>➕</span><span>إضافة دخل</span>
            </Link>
            <Link
              to="/expenses/new"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
              style={{ backgroundColor: "var(--status-danger)" }}
            >
              <span>💸</span><span>تسجيل مصروف</span>
            </Link>
            <Link
              to="/accounts/new"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all active:scale-95"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <span>🏦</span><span>حساب جديد</span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ── KPI Card Sub-component ── */
function KPICard({ label, value, currency, subtitle, icon, iconBg, iconColor, link, delay = "" }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 animate-fade-in-up ${delay}`}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-card)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>{label}</span>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3">
        <span className="font-mono text-2xl font-extrabold" style={{ color: "var(--text-heading)" }}>
          {value}
        </span>
        <span className="mr-1 text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>{currency}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3 text-[11px]" style={{ borderColor: "var(--border-secondary)" }}>
        <span style={{ color: "var(--text-tertiary)" }}>{subtitle}</span>
        {link && (
          <Link to={link} className="font-bold hover:underline" style={{ color: "var(--brand-primary)" }}>
            عرض ←
          </Link>
        )}
      </div>
    </div>
  );
}
