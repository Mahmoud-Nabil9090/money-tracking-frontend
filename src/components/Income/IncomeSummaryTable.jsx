


function IncomeSummaryTable({ items, currency }) {
  return (
    
<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">

  {/* Table Header */}
  <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M15 7.5V6.5A2.5 2.5 0 0012.5 4h-1A2.5 2.5 0 009 6.5v.5m6 10v.5a2.5 2.5 0 01-2.5 2.5h-1A2.5 2.5 0 019 17.5V17"
        />
      </svg>
    </div>

    <div>
      <h3 className="text-base font-semibold text-gray-800">
        Income Details
      </h3>

      <p className="text-xs text-gray-400">
        Income sources for the selected month
      </p>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full">

      {/* Table Head */}
      <thead>
        <tr className="bg-gray-50/80">
          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            Income Source
          </th>

          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
            Amount
          </th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="divide-y divide-gray-100">

        {items.length === 0 ? (
          <tr>
            <td
              colSpan="2"
              className="px-6 py-12 text-center"
            >
              <div className="flex flex-col items-center justify-center">

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                    />
                  </svg>
                </div>

                <p className="text-sm font-medium text-gray-600">
                  No income found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  There is no income recorded for this month.
                </p>

              </div>
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr
              key={item._id}
              className="group transition-colors duration-200 hover:bg-green-50/40"
            >

              {/* Source */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-sm font-semibold text-green-600 transition-colors group-hover:bg-green-100">
                    {item.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <span className="font-medium text-gray-700">
                    {item.name}
                  </span>

                </div>
              </td>

              {/* Amount */}
              <td className="px-6 py-4 text-right">
                <span className="font-semibold text-gray-800">
                  {Number(item.amount).toLocaleString()}
                </span>

                <span className="ml-1 text-sm font-medium text-green-600">
                  {currency}
                </span>
              </td>

            </tr>
          ))
        )}

      </tbody>

      {/* Total */}
      {items.length > 0 && (
        <tfoot>
          <tr className="border-t-2 border-green-100 bg-green-50/60">

            <td className="px-6 py-5">
              <div className="flex items-center gap-2">

                <div className="h-2 w-2 rounded-full bg-green-500" />

                <span className="font-bold text-gray-800">
                  Total Income
                </span>

              </div>
            </td>

            <td className="px-6 py-5 text-right">
              <span className="text-lg font-bold text-green-700">
                {Number(
                  items.reduce(
                    (sum, item) => sum + Number(item.amount),
                    0
                  )
                ).toLocaleString()}
              </span>

              <span className="ml-1 text-sm font-semibold text-green-600">
                {currency}
              </span>
            </td>

          </tr>
        </tfoot>
      )}

    </table>
  </div>

  {/* Bottom Accent */}
  <div className="h-1 w-full bg-green-500" />

</div>


  );
}

export default IncomeSummaryTable;