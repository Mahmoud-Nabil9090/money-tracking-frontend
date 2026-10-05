import React from "react";
import AccountCard from "./AccountCard";

function AccountList({ accounts, onArchive, onRestore, emptyMessage = "لا توجد حسابات مسجلة." }) {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
        <span className="text-4xl">💳</span>
        <p className="mt-3 text-base font-semibold text-slate-700 dark:text-slate-300">{emptyMessage}</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          يمكنك البدء بإنشاء حساب جديد بالضغط على زر "إضافة حساب جديد".
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard
          key={account._id || account.id}
          account={account}
          onArchive={onArchive}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}

export default AccountList;
