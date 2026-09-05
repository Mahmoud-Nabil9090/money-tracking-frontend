import { useEffect, useState } from "react";
import IncomeFilters from "../../components/Income/IncomeFilters";
import IncomeSummaryCard from "../../components/Income/IncomeSummaryCard";
import IncomeSummaryTable from "../../components/Income/IncomeSummaryTable";
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Monthly Income
        </h1>

        <p className="text-gray-500">
          View your income for a specific month
        </p>
      </div>

      <IncomeFilters
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      {loading && (
        <div className="mt-6 text-gray-500">
          Loading...
        </div>
      )}

      {error && (
        <div className="mt-6 text-red-500">
          {error}
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
  );
}

export default IncomeSummary;