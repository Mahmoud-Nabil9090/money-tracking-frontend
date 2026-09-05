


function IncomeSummaryTable({ items, currency }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Income Source
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="2"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No income found for this month.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item._id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-right font-medium">
                    {Number(item.amount).toLocaleString()} {currency}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {items.length > 0 && (
            <tfoot>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-bold">
                  Total
                </td>

                <td className="px-6 py-4 text-right font-bold">
                  {Number(
                    items.reduce(
                      (sum, item) => sum + Number(item.amount),
                      0
                    )
                  ).toLocaleString()}{" "}
                  {currency}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default IncomeSummaryTable;