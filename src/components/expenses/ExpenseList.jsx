import ExpenseItem from "./ExpenseItem";

export default function ExpenseList({
  expenses,
  categories,
  accounts,
  onEdit,
  onDelete,
}) {
  function getCategoryName(expense) {
    const categoryValue = expense.category;

    if (!categoryValue) {
      return "Uncategorized";
    }

    const matchedCategory = categories.find(
      (category) => category._id === categoryValue
    );

    return matchedCategory?.name || categoryValue;
  }

  function getAccountName(expense) {
    const accountValue =
      expense.account?._id ||
      expense.account ||
      expense.accountId ||
      "";

    if (!accountValue) {
      return "";
    }

    const matchedAccount = accounts.find(
      (account) => account._id === accountValue
    );

    return matchedAccount?.name || "Unknown Account";
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">
          No expenses match the selected filters.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          Expense List
        </h2>

        <span className="text-sm text-slate-500">
          {expenses.length}{" "}
          {expenses.length === 1
            ? "expense"
            : "expenses"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            categoryName={getCategoryName(expense)}
            accountName={getAccountName(expense)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
