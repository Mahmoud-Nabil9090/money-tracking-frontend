import React from "react";
import ExpenseItem from "./ExpenseItem";

export default function ExpenseList({
  expenses = [],
  categories = [],
  accounts = [],
  onEdit,
  onDelete,
}) {
  function getCategoryName(expense) {
    const categoryValue = expense.category;
    if (!categoryValue) return "";

    const matchedCategory = categories.find(
      (category) =>
        category._id === categoryValue || category.name === categoryValue
    );

    return matchedCategory?.name || categoryValue;
  }

  function getAccountInfo(expense) {
    // If expense.account is populated object
    if (expense.account && typeof expense.account === "object" && expense.account.name) {
      return expense.account;
    }

    const accountValue =
      expense.account?._id ||
      expense.account ||
      expense.accountId ||
      "";

    if (!accountValue) return null;

    const matchedAccount = accounts.find(
      (acc) => (acc._id || acc.id) === accountValue
    );

    return matchedAccount || null;
  }

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const baseCurrency = expenses[0]?.currency || "EGP";

  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
        <span className="text-4xl">💸</span>
        <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-white">
          لا توجد مصاريف مطابقة
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          لم يتم العثور على أي مصروفات تطابق خيارات الفلترة المحددة، جرب تغيير الفلاتر أو إعادة ضبطها.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Summary Header */}
      <div className="flex flex-col gap-2 rounded-2xl bg-slate-100/80 p-4 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 dark:text-white">
            قائمة المصاريف
          </span>
          <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            {expenses.length} {expenses.length === 1 ? "مصروف" : "مصاريف"}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            إجمالي المصاريف المعروضة:
          </span>
          <span className="font-mono text-base font-extrabold text-rose-600 dark:text-rose-400">
            {totalAmount.toLocaleString()} {baseCurrency}
          </span>
        </div>
      </div>

      {/* Grid of Expenses */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense._id || expense.id}
            expense={expense}
            categoryName={getCategoryName(expense)}
            accountInfo={getAccountInfo(expense)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
