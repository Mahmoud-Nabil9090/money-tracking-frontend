
import { useEffect, useState } from "react";
import { getAccounts } from "../../services/accountService";

import TotalWealthCard from "../../components/accounts/TotalWealthCard";
import AccountList from "../../components/accounts/AccountList";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAccounts();

        if (response.success) {
          setAccounts(response.data || []);
        } else {
          setError("Failed to load accounts.");
        }
      } catch (err) {
        console.error("Error fetching accounts:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load accounts. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const totalWealth = accounts.reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  );

  const currency = accounts[0]?.currency || "";

  

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Accounts
        </h1>

        <TotalWealthCard
          totalWealth={totalWealth}
          currency={currency}
        />

        <AccountList accounts={accounts} />
      </div>
    </div>
  );
}

export default Accounts;

