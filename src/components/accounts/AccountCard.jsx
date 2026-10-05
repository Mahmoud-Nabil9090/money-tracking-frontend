import React from "react";
import { useNavigate, Link } from "react-router-dom";

const typeBadges = {
  bank: {
    label: "Bank (بنك)",
    style: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60",
    icon: "🏦",
  },
  wallet: {
    label: "Wallet (محفظة)",
    style: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900/60",
    icon: "📱",
  },
  cash: {
    label: "Cash (كاش)",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60",
    icon: "💵",
  },
};

function AccountCard({ account, onArchive, onRestore }) {
  const navigate = useNavigate();
  const balance = Number(account.balance || 0);
  const isNegative = balance < 0;
  const isArchived = account.isActive === false;

  const typeKey = String(account.type || "").toLowerCase();
  const badgeInfo = typeBadges[typeKey] || {
    label: account.type || "Account",
    style: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: "💳",
  };

  const accountColor = account.color || "#0d9488";

  const handleCardClick = (e) => {
    // If clicked on an action button, don't navigate
    if (e.target.closest("button") || e.target.closest("a")) return;
    navigate(`/accounts/${account._id}`, {
      state: { account },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 text-right transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
        isArchived
          ? "border-slate-200/80 bg-slate-100/60 opacity-80 dark:border-slate-800 dark:bg-slate-900/40"
          : isNegative
          ? "border-red-300 bg-red-50/40 hover:border-red-400 dark:border-red-900/60 dark:bg-red-950/20"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      }`}
    >
      {/* Top accent line with account's custom color */}
      <div
        className="absolute top-0 right-0 left-0 h-1.5 transition-all group-hover:h-2"
        style={{ backgroundColor: accountColor }}
      />

      <div>
        {/* Top Header: Type & Status */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badgeInfo.style}`}
            >
              <span>{badgeInfo.icon}</span>
              <span>{badgeInfo.label}</span>
            </span>

            {isArchived && (
              <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                📦 مؤرشف
              </span>
            )}
          </div>

          <div
            className="h-3 w-3 rounded-full shadow-xs ring-2 ring-white dark:ring-slate-900"
            style={{ backgroundColor: accountColor }}
            title={`لون الحساب: ${accountColor}`}
          />
        </div>

        {/* Account Name */}
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {account.name}
        </h3>
      </div>

      {/* Account Balance */}
      <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          الرصيد الحالي (Current Balance)
        </span>
        <div className="mt-1 flex items-baseline justify-between">
          <p
            className={`text-2xl font-extrabold tracking-tight font-mono ${
              isNegative
                ? "text-red-600 dark:text-red-400"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {balance.toLocaleString()}
          </p>
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
            {account.currency || "EGP"}
          </span>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <Link
          to={`/accounts/${account._id}`}
          state={{ account }}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
        >
          التفاصيل والحركات &larr;
        </Link>

        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Link
            to={`/accounts/${account._id}/edit`}
            state={{ account }}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400"
            title="تعديل الحساب"
          >
            ✏️ تعديل
          </Link>

          {/* Archive / Restore Button */}
          {isArchived ? (
            onRestore && (
              <button
                type="button"
                onClick={() => onRestore(account)}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                title="استعادة الحساب"
              >
                ♻️ استعادة
              </button>
            )
          ) : (
            onArchive && (
              <button
                type="button"
                onClick={() => onArchive(account)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                title="أرشفة الحساب"
              >
                📦 أرشفة
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountCard;
