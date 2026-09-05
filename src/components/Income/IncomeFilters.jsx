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
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      
      <div>
        <label className="mb-2 block text-sm font-medium">
          Month
        </label>

        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
        >
          {months.map((monthName, index) => (
            <option key={monthName} value={index + 1}>
              {monthName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Year
        </label>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
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