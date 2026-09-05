

function IncomeSummaryCard({ total, currency }) {
  return (
    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm text-gray-500">
        Total Income
      </p>

      <div className="text-3xl font-bold">
        {Number(total).toLocaleString()} {currency}
      </div>
    </div>
  );
}

export default IncomeSummaryCard;
