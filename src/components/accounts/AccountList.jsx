
import AccountCard from "./AccountCard";

function AccountList({ accounts }) {
  if (!accounts.length) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">No accounts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard
          key={account._id}
          account={account}
        />
      ))}
    </div>
  );
}

export default AccountList;

