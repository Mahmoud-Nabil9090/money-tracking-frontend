
import { useEffect, useState } from "react";

function AccountBalanceModal({
  account,
  isOpen,
  onClose,
  onSave,
  saving,
  error,
}) {
  const [newBalance, setNewBalance] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && account) {
      setNewBalance(String(account.balance ?? ""));
      setNotes("");
    }
  }, [isOpen, account]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (newBalance === "") {
      return;
    }

    onSave({
      newBalance: Number(newBalance),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Adjust Balance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {account?.name}
          </p>
        </div>

        <div className="mb-5 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Current Balance
          </p>

          <p className="mt-1 text-xl font-semibold text-gray-900">
            {Number(account?.balance || 0).toLocaleString()}{" "}
            {account?.currency}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="newBalance"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New Balance
            </label>

            <input
              id="newBalance"
              type="number"
              step="any"
              value={newBalance}
              onChange={(event) =>
                setNewBalance(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="balanceNotes"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Reason / Notes
            </label>

            <textarea
              id="balanceNotes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={3}
              placeholder="Optional reason for this adjustment"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Balance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountBalanceModal;

