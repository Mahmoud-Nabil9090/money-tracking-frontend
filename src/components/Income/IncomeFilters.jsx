const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function IncomeFilters({
  month,
  year,
  onMonthChange,
  onYearChange,
}) {
  const years = [];

  for (let i = 2020; i <= 2030; i++) {
    years.push(i);
  }

  return (
    
<div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">

  {/* Month Card */}
  <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="mb-4 flex items-center gap-3">
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800">
          Month
        </p>
        <p className="text-xs text-gray-400">
          Select a month
        </p>
      </div>
    </div>

    <select
      value={month}
      onChange={(e) => onMonthChange(Number(e.target.value))}
      className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
    >
      {months.map((monthName, index) => (
        <option key={monthName} value={index + 1}>
          {monthName}
        </option>
      ))}
    </select>
  </div>

  {/* Year Card */}
  <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="mb-4 flex items-center gap-3">
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
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800">
          Year
        </p>
        <p className="text-xs text-gray-400">
          Select a year
        </p>
      </div>
    </div>

    <select
      value={year}
      onChange={(e) => onYearChange(Number(e.target.value))}
      className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
    >
      {years.map((yearValue) => (
        <option key={yearValue} value={yearValue}>
          {yearValue}
        </option>
      ))}
    </select>
  </div>

</div>


  );
}

export default IncomeFilters;