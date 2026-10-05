import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardData } from "../../services/dashboardService";
import ThemeToggle from "../../components/ThemeToggle";

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const ACCOUNT_ICONS = {
  bank: "🏦",
  wallet: "📱",
  cash: "💵",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [period, setPeriod] = useState("month"); // 'month' | 'last_month' | '3months'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityTab, setActivityTab] = useState("all"); // 'all' | 'expense' | 'income'

  const fetchDashboard = useCallback(async (selectedPeriod) => {
    try {
      setLoading(true);
      setError("");
      const res = await getDashboardData({ period: selectedPeriod });
      setData(res);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(
        err.response?.data?.message ||
          "تعذر تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(period);
  }, [period, fetchDashboard]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.name || "المستخدم";
  const accounts = data?.accounts || [];
  const totalWealth = Number(data?.totalAccountBalance || 0);
  const totalIncome = Number(data?.income?.total || 0);
  const totalExpenses = Number(data?.expenses?.total || 0);
  const netBalance = Number(data?.netBalance || 0);
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))
      : 0;

  const chartData = data?.chartData || [];
  const expenseCategories = data?.expenseCategories || [];
  const recentActivity = data?.recentActivity || [];

  const filteredActivity = recentActivity.filter((item) => {
    if (activityTab === "all") return true;
    return item.type === activityTab;
  });

  // Calculate highest monthly value for chart scale
  const maxChartVal = Math.max(
    ...chartData.map((d) => Math.max(d.income || 0, d.expenses || 0)),
    1
  );

  return (
    <div
      className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950"
      dir="rtl"
    >
      {/* Background ambient lighting glows (Emerald & Violet, no default blue) */}
      <div className="pointer-events-none fixed top-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Top Navbar / Header */}
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              💎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Money<span className="text-emerald-400">Tracking</span>
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                  لوحة التحكم
                </span>
              </div>
              <span className="text-xs text-slate-400">
                مرحباً بك، <strong className="text-emerald-300 font-semibold">{userName}</strong>
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-300">
            <Link
              to="/accounts"
              className="rounded-xl border border-slate-800 bg-slate-800/40 px-3 py-2 transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-white"
            >
              🏦 الحسابات ({accounts.length})
            </Link>
            <Link
              to="/expenses"
              className="rounded-xl border border-slate-800 bg-slate-800/40 px-3 py-2 transition hover:border-rose-500/40 hover:bg-slate-800 hover:text-white"
            >
              💸 المصاريف
            </Link>
            <Link
              to="/income"
              className="rounded-xl border border-slate-800 bg-slate-800/40 px-3 py-2 transition hover:border-teal-500/40 hover:bg-slate-800 hover:text-white"
            >
              💰 الدخل
            </Link>
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => fetchDashboard(period)}
              disabled={loading}
              title="تحديث البيانات"
              className="rounded-xl border border-slate-800 bg-slate-800/50 p-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              ⟳
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-900/40"
            >
              تسجيل الخروج
            </button>
          </div>
        </header>

        {/* 2. Welcome Banner with Quick Actions (CTA Bar) */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-linear-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  نظرة عامة على الوضع المالي
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                إجمالي ثروتك الحالية:{" "}
                <span className="font-mono text-emerald-400">
                  {totalWealth.toLocaleString()} EGP
                </span>
              </h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                موزعة على {accounts.length} حسابات ومحافظ نشطة مع حساب الفائض ونسب الادخار تلقائياً.
              </p>
            </div>

            {/* Quick Action Buttons (Primary CTAs) */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/income/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-teal-500 to-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:opacity-95 active:scale-95"
              >
                <span>➕</span>
                <span>إضافة دخل</span>
              </Link>

              <Link
                to="/expenses/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-amber-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition hover:opacity-95 active:scale-95"
              >
                <span>💸</span>
                <span>تسجيل مصروف</span>
              </Link>

              <Link
                to="/accounts/new"
                className="inline-flex items-center gap-2 rounded-2xl border border-purple-500/40 bg-purple-950/40 px-4 py-2.5 text-xs font-bold text-purple-200 transition hover:bg-purple-900/50 active:scale-95"
              >
                <span>🏦</span>
                <span>حساب / محفظة</span>
              </Link>
            </div>
          </div>

          {/* Period Selector Tabs inside Banner */}
          <div className="mt-6 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
            <span className="text-slate-400 font-medium">اختر الفترة الزمنية للتحليل:</span>
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 p-1 ring-1 ring-slate-800">
              <button
                type="button"
                onClick={() => setPeriod("month")}
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  period === "month"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                الشهر الحالي
              </button>
              <button
                type="button"
                onClick={() => setPeriod("last_month")}
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  period === "last_month"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                الشهر السابق
              </button>
              <button
                type="button"
                onClick={() => setPeriod("3months")}
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  period === "3months"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                آخر 3 أشهر
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs font-bold text-rose-300">
            ⚠️ {error}
          </div>
        )}

        {/* 3. Four Core Financial KPI Cards (Rich Fintech Glowing Cards) */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Wealth */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md transition-all hover:border-emerald-500/60 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">إجمالي الأرصدة (Wealth)</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-base">
                💎
              </span>
            </div>
            <div className="mt-4">
              <span className="font-mono text-3xl font-black text-white">
                {totalWealth.toLocaleString()}
              </span>
              <span className="mr-2 text-xs font-bold text-emerald-400">EGP</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <span>{accounts.length} حسابات نشطة</span>
              <Link to="/accounts" className="text-emerald-400 hover:underline">
                إدارة الحسابات &larr;
              </Link>
            </div>
          </div>

          {/* Card 2: Total Income */}
          <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md transition-all hover:border-teal-500/60 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">إجمالي الدخل (Income)</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 text-base">
                📈
              </span>
            </div>
            <div className="mt-4">
              <span className="font-mono text-3xl font-black text-teal-400">
                +{totalIncome.toLocaleString()}
              </span>
              <span className="mr-2 text-xs font-bold text-slate-400">EGP</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <span>{data?.income?.count || 0} حركة دخل</span>
              <Link to="/income" className="text-teal-400 hover:underline">
                عرض المداخيل &larr;
              </Link>
            </div>
          </div>

          {/* Card 3: Total Expenses */}
          <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md transition-all hover:border-rose-500/60 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">إجمالي المصاريف (Expenses)</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 text-base">
                📉
              </span>
            </div>
            <div className="mt-4">
              <span className="font-mono text-3xl font-black text-rose-400">
                -{totalExpenses.toLocaleString()}
              </span>
              <span className="mr-2 text-xs font-bold text-slate-400">EGP</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <span>{data?.expenses?.count || 0} عملية صرف</span>
              <Link to="/expenses" className="text-rose-400 hover:underline">
                تفاصيل المصاريف &larr;
              </Link>
            </div>
          </div>

          {/* Card 4: Net Flow & Savings Rate */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md transition-all hover:border-purple-500/60 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">صافي الفائض (Net Flow)</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 text-base">
                ⚡
              </span>
            </div>
            <div className="mt-4">
              <span
                className={`font-mono text-3xl font-black ${
                  netBalance >= 0 ? "text-purple-300" : "text-rose-400"
                }`}
              >
                {netBalance >= 0 ? `+${netBalance.toLocaleString()}` : netBalance.toLocaleString()}
              </span>
              <span className="mr-2 text-xs font-bold text-slate-400">EGP</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <span className="font-semibold text-emerald-400">
                نسبة الادخار: {savingsRate}%
              </span>
              <span className="text-slate-500">فائض الفترة</span>
            </div>
          </div>
        </section>

        {/* 4. Accounts & Wallets Carousel / Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🏦</span>
                <span>الحسابات والمحافظ المالية (Accounts & Wallets)</span>
              </h2>
              <p className="text-xs text-slate-400">
                أرصدتك في البنوك، المحافظ الرقمية، والنقدية المتوفرة
              </p>
            </div>
            <Link
              to="/accounts/new"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              + إضافة محفظة جديدة
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((acc) => {
              const accIcon = ACCOUNT_ICONS[acc.type] || "💳";
              const balance = Number(acc.balance || 0);
              const color = acc.color || "#10b981";

              return (
                <Link
                  key={acc._id}
                  to={`/accounts/${acc._id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/50"
                >
                  {/* Top color indicator line */}
                  <div
                    className="absolute top-0 right-0 left-0 h-1.5 transition-all group-hover:h-2"
                    style={{ backgroundColor: color }}
                  />

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl">{accIcon}</span>
                      <h3 className="mt-2 text-base font-bold text-white group-hover:text-emerald-300 transition">
                        {acc.name}
                      </h3>
                      <span className="text-[11px] font-semibold uppercase text-slate-500">
                        {acc.type}
                      </span>
                    </div>

                    <div
                      className="h-3 w-3 rounded-full ring-2 ring-slate-800"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  <div className="mt-5 border-t border-slate-800/80 pt-3 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">الرصيد:</span>
                    <span className="font-mono text-xl font-black text-white">
                      {balance.toLocaleString()}{" "}
                      <span className="text-xs font-bold text-slate-400">{acc.currency || "EGP"}</span>
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Quick Add Account Card */}
            <Link
              to="/accounts/new"
              className="flex min-h-[140px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-6 text-center text-slate-400 transition hover:border-emerald-500/50 hover:bg-slate-900/60 hover:text-emerald-400"
            >
              <span className="text-2xl">➕</span>
              <span className="mt-2 text-xs font-bold">إضافة حساب أو محفظة جديدة</span>
              <span className="text-[11px] text-slate-500">Bank, Wallet, Cash</span>
            </Link>
          </div>
        </section>

        {/* 5. Analytics & Visual Charts (Income vs. Expenses + Expense Categories) */}
        <section className="grid gap-6 lg:grid-cols-12">
          {/* 6-Month Comparison Chart (7 cols) */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📊</span>
                  <span>حركة الدخل والمصاريف (آخر 6 أشهر)</span>
                </h3>
                <p className="text-xs text-slate-400">مقارنة شهرية بين الإيرادات والمصروفات</p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> دخل
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> مصاريف
                </span>
              </div>
            </div>

            {/* Bar chart representation */}
            <div className="mt-6 flex h-60 items-end justify-between gap-3 pt-6">
              {chartData.map((item, idx) => {
                const monthName = MONTH_NAMES_AR[item.month] || `M${item.month + 1}`;
                const incHeight = Math.max(10, Math.round(((item.income || 0) / maxChartVal) * 180));
                const expHeight = Math.max(10, Math.round(((item.expenses || 0) / maxChartVal) * 180));

                return (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full items-end justify-center gap-1.5">
                      {/* Income Bar */}
                      <div
                        className="w-full max-w-[18px] rounded-t-lg bg-linear-to-t from-emerald-600 to-emerald-400 transition-all duration-300 hover:brightness-125"
                        style={{ height: `${incHeight}px` }}
                        title={`دخل: ${(item.income || 0).toLocaleString()} EGP`}
                      />
                      {/* Expense Bar */}
                      <div
                        className="w-full max-w-[18px] rounded-t-lg bg-linear-to-t from-rose-600 to-rose-400 transition-all duration-300 hover:brightness-125"
                        style={{ height: `${expHeight}px` }}
                        title={`مصاريف: ${(item.expenses || 0).toLocaleString()} EGP`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">{monthName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Expense Categories Breakdown (5 cols) */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🏷️</span>
                    <span>أعلى بنود المصاريف</span>
                  </h3>
                  <p className="text-xs text-slate-400">توزيع المصاريف حسب التصنيف</p>
                </div>
                <Link to="/expenses/categories" className="text-xs font-bold text-emerald-400 hover:underline">
                  التصنيفات &larr;
                </Link>
              </div>

              {/* Category bars */}
              <div className="mt-5 space-y-3.5">
                {expenseCategories.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    لا توجد مصاريف مسجلة في هذه الفترة
                  </div>
                ) : (
                  expenseCategories.map((cat, idx) => {
                    const percent =
                      totalExpenses > 0
                        ? Math.round((Number(cat.total || 0) / totalExpenses) * 100)
                        : 0;

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: cat.color || "#8b5cf6" }}
                            />
                            {cat.name}
                          </span>
                          <span className="font-mono font-bold text-slate-300">
                            {Number(cat.total || 0).toLocaleString()} EGP ({percent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(5, percent))}%`,
                              backgroundColor: cat.color || "#10b981",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <Link
              to="/expenses/new"
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-800/40 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              + تسجيل مصروف جديد
            </Link>
          </div>
        </section>

        {/* 6. Recent Transactions Feed */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>⚡</span>
                <span>آخر الحركات والمعاملات (Recent Activity)</span>
              </h2>
              <p className="text-xs text-slate-400">سجل لحظي لآخر الإيداعات والمصروفات</p>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex rounded-xl bg-slate-950 p-1 ring-1 ring-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActivityTab("all")}
                className={`rounded-lg px-3 py-1 font-bold transition ${
                  activityTab === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setActivityTab("expense")}
                className={`rounded-lg px-3 py-1 font-bold transition ${
                  activityTab === "expense" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                المصاريف
              </button>
              <button
                type="button"
                onClick={() => setActivityTab("income")}
                className={`rounded-lg px-3 py-1 font-bold transition ${
                  activityTab === "income" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                المداخيل
              </button>
            </div>
          </div>

          {/* Activity items list */}
          <div className="mt-4 divide-y divide-slate-800/60">
            {filteredActivity.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                لا توجد حركات مسجلة مؤخراً
              </div>
            ) : (
              filteredActivity.map((tx) => {
                const isInc = tx.type === "income";
                const dateStr = tx.date
                  ? new Date(tx.date).toLocaleDateString("ar-EG", {
                      day: "numeric",
                      month: "short",
                    })
                  : "—";

                return (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between py-3.5 transition hover:bg-slate-800/30 px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-base ${
                          isInc ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {isInc ? "📈" : "💸"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{tx.name || "معاملة"}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{dateStr}</span>
                          {tx.category && (
                            <>
                              <span>•</span>
                              <span>{tx.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-left font-mono font-bold">
                      <span
                        className={`text-base ${
                          isInc ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isInc ? "+" : "-"}
                        {Number(tx.amount || 0).toLocaleString()}
                      </span>{" "}
                      <span className="text-xs text-slate-500">{tx.currency || "EGP"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
