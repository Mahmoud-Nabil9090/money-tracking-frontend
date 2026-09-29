import { useEffect, useMemo, useState } from "react";

import ExpenseFilters from "../../components/expenses/ExpenseFilters";
import ExpenseList from "../../components/expenses/ExpenseList";

import {
  getAccounts,
  getExpenseCategories,
  getExpenses,
} from "../../services/expenseService";

const initialFilters = {
  period: "all",
  from: "",
  to: "",
  type: "",
  category: "",
  account: "",
};

function getStartOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay();

  // Monday = first day of the week
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);

  return result;
}

function getEndOfWeek(date) {
  const result = getStartOfWeek(date);

  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);

  return result;
}

function getCustomStartDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getCustomEndDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [filters, setFilters] = useState(initialFilters);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        expensesData,
        categoriesData,
        accountsData,
      ] = await Promise.all([
        getExpenses(),
        getExpenseCategories(),
        getAccounts(),
      ]);

      setExpenses(expensesData);
      setCategories(categoriesData);
      setAccounts(accountsData);
    } catch (err) {
      console.error("Failed to load expenses:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load expenses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return expenses.filter((expense) => {
      /*
       * TYPE FILTER
       */
      if (
        filters.type &&
        expense.expenseType !== filters.type
      ) {
        return false;
      }

      /*
       * CATEGORY FILTER
       *
       * New data can use category ID.
       * Legacy data may contain category name directly.
       */
      if (filters.category) {
        const selectedCategory = categories.find(
          (category) =>
            category._id === filters.category
        );

        const expenseCategory =
          expense.category?._id ||
          expense.category ||
          "";

        const matchesCategory =
          expenseCategory === filters.category ||
          expenseCategory === selectedCategory?.name;

        if (!matchesCategory) {
          return false;
        }
      }

      /*
       * ACCOUNT FILTER
       */
      if (filters.account) {
        const expenseAccount =
          expense.account?._id ||
          expense.account ||
          expense.accountId ||
          "";

        if (expenseAccount !== filters.account) {
          return false;
        }
      }

      /*
       * DATE FILTER
       */
      if (filters.period !== "all") {
        if (!expense.date) {
          return false;
        }

        const expenseDate = new Date(expense.date);

        if (Number.isNaN(expenseDate.getTime())) {
          return false;
        }

        if (filters.period === "day") {
          const isToday =
            expenseDate.getFullYear() ===
              now.getFullYear() &&
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getDate() === now.getDate();

          if (!isToday) {
            return false;
          }
        }

        if (filters.period === "week") {
          const startOfWeek = getStartOfWeek(now);
          const endOfWeek = getEndOfWeek(now);

          if (
            expenseDate < startOfWeek ||
            expenseDate > endOfWeek
          ) {
            return false;
          }
        }

        if (filters.period === "month") {
          const isCurrentMonth =
            expenseDate.getFullYear() ===
              now.getFullYear() &&
            expenseDate.getMonth() === now.getMonth();

          if (!isCurrentMonth) {
            return false;
          }
        }

        if (filters.period === "custom") {
          const fromDate = getCustomStartDate(
            filters.from
          );

          const toDate = getCustomEndDate(filters.to);

          if (
            fromDate &&
            expenseDate < fromDate
          ) {
            return false;
          }

          if (
            toDate &&
            expenseDate > toDate
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [expenses, categories, filters]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Loading expenses...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadData}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            Expenses
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and filter your expenses
          </p>
        </header>

        <ExpenseFilters
          filters={filters}
          categories={categories}
          accounts={accounts}
          onChange={setFilters}
        />

        <ExpenseList
          expenses={filteredExpenses}
          categories={categories}
          accounts={accounts}
        />
      </div>
    </main>
  );
}
