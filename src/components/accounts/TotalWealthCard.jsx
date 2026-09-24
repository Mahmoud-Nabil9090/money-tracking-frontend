function TotalWealthCard({ totalWealth, currency }) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-medium text-gray-500">
        Total Wealth
      </p>

      <div className="flex items-baseline gap-2">
        <h2
          className={`text-3xl font-bold ${
            totalWealth < 0 ? "text-red-500" : "text-gray-900"
          }`}
        >
          {totalWealth.toLocaleString()}
        </h2>

        {currency && (
          <span className="text-sm font-medium text-gray-500">
            {currency}
          </span>
        )}
      </div>
    </div>
  );
}

export default TotalWealthCard;