export default function ExpenseFilters({
  filters,
  categories,
  accounts,
  onChange,
}) {
  function updateFilter(name, value) {
    onChange({
      ...filters,
      [name]: value,
    });
  }

  function clearFilters() {
    onChange({
      period: "all",
      from: "",
      to: "",
      type: "",
      category: "",
      account: "",
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Filter expenses by date, type, category and account
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Period */}
        <div>
          <label
            htmlFor="expense-period"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Date
          </label>

          <select
            id="expense-period"
            value={filters.period}
            onChange={(event) =>
              updateFilter("period", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value="all">All Dates</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="expense-type"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Type
          </label>

          <select
            id="expense-type"
            value={filters.type}
            onChange={(event) =>
              updateFilter("type", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All Types</option>
            <option value="daily">Daily</option>
            <option value="fixed">Fixed Monthly</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="expense-category"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="expense-category"
            value={filters.category}
            onChange={(event) =>
              updateFilter("category", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Account */}
        <div>
          <label
            htmlFor="expense-account"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Account
          </label>

          <select
            id="expense-account"
            value={filters.account}
            onChange={(event) =>
              updateFilter("account", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All Accounts</option>

            {accounts.map((account) => (
              <option
                key={account._id}
                value={account._id}
              >
                {account.name}
                {account.isActive === false
                  ? " (Archived)"
                  : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Date Range */}
      {filters.period === "custom" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="expense-from"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              From
            </label>

            <input
              id="expense-from"
              type="date"
              value={filters.from}
              onChange={(event) =>
                updateFilter("from", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="expense-to"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              To
            </label>

            <input
              id="expense-to"
              type="date"
              value={filters.to}
              onChange={(event) =>
                updateFilter("to", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>
    </section>
  );
}
