import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IncomeFilters from "../../components/Income/IncomeFilters";
import IncomeSummaryCard from "../../components/Income/IncomeSummaryCard";
import IncomeSummaryTable from "../../components/Income/IncomeSummaryTable";
import ThemeToggle from "../../components/ThemeToggle";
import { getMonthlyIncome } from "../../services/incomeService";

function IncomeSummary() {
  const currentDate = new Date();

  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const [incomeData, setIncomeData] = useState({
    items: [],
    total: 0,
    currency: "EGP",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIncome();
  }, [month, year]);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMonthlyIncome(month, year);

      setIncomeData(data);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل بيانات الدخل");
    } finally {
      setLoading(false);
    }
  };

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
              الملخص الشهري للإيرادات
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/income/new"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-95"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              ➕ إضافة دخل
            </Link>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-heading)" }}>
            الملخص الشهري للإيرادات
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            اختر الشهر والسنة لعرض إجمالي الدخل والتفاصيل
          </p>
        </div>

        <IncomeFilters
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />

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
              جاري تحميل بيانات الدخل...
            </p>
          </div>
        )}

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

        {!loading && !error && (
          <>
            <IncomeSummaryCard
              total={incomeData.total}
              currency={incomeData.currency}
            />

            <IncomeSummaryTable
              items={incomeData.items}
              currency={incomeData.currency}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default IncomeSummary;