
import { useNavigate } from "react-router-dom";

function AccountCard({ account }) {
  const navigate = useNavigate();

  const isNegative = Number(account.balance) < 0;

  const handleClick = () => {
    navigate(`/accounts/${account._id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{
              backgroundColor: account.color || "#6B7280",
            }}
          />

          <h3 className="font-semibold text-gray-900">
            {account.name}
          </h3>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {account.type}
        </span>
      </div>

      <div>
        <p className="text-sm text-gray-500">Current Balance</p>

        <div className="mt-1 flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold ${
              isNegative ? "text-red-500" : "text-gray-900"
            }`}
          >
            {Number(account.balance || 0).toLocaleString()}
          </span>

          <span className="text-sm text-gray-500">
            {account.currency}
          </span>
        </div>
      </div>
    </button>
  );
}

export default AccountCard;

