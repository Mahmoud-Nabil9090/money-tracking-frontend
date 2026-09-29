import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";

import {
  getAccountTransactions,
  adjustAccountBalance,
} from "../../services/accountService";

import AccountFilters from "../../components/accounts/AccountFilters";
import AccountBalanceModal from "../../components/accounts/AccountBalanceModal";

function AccountDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [accountData, setAccountData] = useState(
    location.state?.account || null
  );

  const [transactions, setTransactions] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    start: "",
    end: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isBalanceModalOpen, setIsBalanceModalOpen] =
    useState(false);

  const [savingBalance, setSavingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  const fetchTransactions = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccountTransactions(id, filters);

      if (response.success) {
        setTransactions(response.data || []);
      } else {
        setError("Failed to load transaction history.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load transaction history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTransactions(appliedFilters);
    }
  }, [id, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      start: startDate,
      end: endDate,
    });
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");

    setAppliedFilters({
      start: "",
      end: "",
    });
  };

  const handleOpenBalanceModal = () => {
    setBalanceError("");
    setIsBalanceModalOpen(true);
  };

  const handleCloseBalanceModal = () => {
    if (savingBalance) {
      return;
    }

    setIsBalanceModalOpen(false);
    setBalanceError("");
  };

  const handleSaveBalance = async (data) => {
    try {
      setSavingBalance(true);
      setBalanceError("");

      const response = await adjustAccountBalance(id, data);

      if (response.success) {
        setAccountData(response.data);
        setIsBalanceModalOpen(false);

        await fetchTransactions(appliedFilters);
      } else {
        setBalanceError(
          response.message || "Failed to adjust account balance."
        );
      }
    } catch (err) {
      console.error("Error adjusting account balance:", err);

      setBalanceError(
        err.response?.data?.message ||
          "Failed to adjust account balance. Please try again."
      );
    } finally {
      setSavingBalance(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/accounts"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Accounts
        </Link>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {accountData?.name || "Account"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {accountData?.type || ""}
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${
                  Number(accountData?.balance || 0) < 0
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {Number(
                  accountData?.balance || 0
                ).toLocaleString()}
              </span>

              <span className="text-sm font-medium text-gray-500">
                {accountData?.currency || ""}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenBalanceModal}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Adjust Balance
          </button>
        </div>

        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Account Transaction History
        </h2>

        <AccountFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-white shadow-sm">
            <p className="text-gray-500">
              Loading transactions...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-5">
            <p className="text-red-500">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No transactions found for this account.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Type
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Balance After
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {transactions.map((transaction) => {
                    const amount = Number(
                      transaction.amount || 0
                    );

                    return (
                      <tr
                        key={transaction._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {transaction.date
                            ? new Date(
                                transaction.date
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {transaction.description || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {transaction.type || "-"}
                        </td>

                        <td
                          className={`px-6 py-4 text-right text-sm font-semibold ${
                            amount < 0
                              ? "text-red-500"
                              : "text-gray-900"
                          }`}
                        >
                          {amount.toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {Number(
                            transaction.balanceAfter || 0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AccountBalanceModal
          account={accountData}
          isOpen={isBalanceModalOpen}
          onClose={handleCloseBalanceModal}
          onSave={handleSaveBalance}
          saving={savingBalance}
          error={balanceError}
        />
      </div>
    </div>
  );
}

export default AccountDetails;