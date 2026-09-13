

function IncomeSummaryCard({ total, currency }) {
  return (
  
<div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

  <div className="flex items-center justify-between p-6">

    {/* Left Side */}
    <div className="flex items-center gap-4">

      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
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

      {/* Title */}
      <div>
        <p className="text-sm font-medium text-gray-400">
          Total Income
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Your total income for the selected period
        </p>
      </div>

    </div>

    {/* Amount */}
    <div className="text-right">
      <div className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {Number(total).toLocaleString()}
      </div>

      <div className="mt-1 text-sm font-semibold text-green-600">
        {currency}
      </div>
    </div>

  </div>

  {/* Green Bottom Accent */}
  <div className="h-1 w-full bg-green-500" />

</div>


  );
}

export default IncomeSummaryCard;
