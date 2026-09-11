import { useEffect, useRef, useState } from "react";
import Badge from "../../components/common/Badge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { deleteIncome, getIncomeList, getIncomeSummary } from "../../services/incomeService";

const recurrenceLabels = { once: "مرة واحدة", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" };
const errorMessage = (error) => error.response?.data?.message || error.message || "تعذر تحميل البيانات";

async function loadIncome(signal) {
  const [list, summary] = await Promise.all([
    getIncomeList({ signal }),
    getIncomeSummary(6, { signal }),
  ]);
  if (!list.success || !summary.success || !Array.isArray(list.data) || !Array.isArray(summary.data)) {
    throw new Error("تعذر تحميل بيانات الدخل");
  }
  return { records: list.data, summary: summary.data };
}

// The team supplies onEdit and integrates this page after shared Axios auth is ready.
export default function IncomeList({ onEdit }) {
  const [data, setData] = useState({ records: [], summary: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const deleteLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    loadIncome(controller.signal).then((result) => {
      if (!controller.signal.aborted) { setData(result); setError(""); }
    }).catch((failure) => {
      if (!controller.signal.aborted) setError(errorMessage(failure));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [reload]);

  function refresh() {
    setLoading(true);
    setError("");
    setReload((value) => value + 1);
  }

  async function confirmDelete() {
    if (!selected || deleteLock.current) return;
    deleteLock.current = true;
    setDeleting(true);
    setDeleteError("");
    try {
      const result = await deleteIncome(selected._id);
      if (!result.success) throw new Error(result.message || "تعذر حذف مصدر الدخل");
      setSelected(null);
      setNotice("تم حذف مصدر الدخل");
      refresh();
    } catch (failure) {
      setDeleteError(errorMessage(failure));
    } finally {
      deleteLock.current = false;
      setDeleting(false);
    }
  }

  return (
    <section className="p-6" aria-labelledby="income-list-title">
      <h1 id="income-list-title" className="mb-4 text-2xl font-bold">Income</h1>
      {notice && <p role="status" dir="auto" className="mb-4 text-green-800">{notice}</p>}
      {loading ? <p role="status">Loading…</p> : error ? (
        <div role="alert">
          <p dir="auto">{notice ? "تم الحذف، لكن تعذر تحديث القائمة والملخص." : "تعذر تحميل القائمة والملخص."} {error}</p>
          <button type="button" onClick={refresh} className="mt-3 rounded border px-4 py-2">Retry</button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded border">
            <table className="w-full text-left">
              <caption className="sr-only">All income records</caption>
              <thead><tr>{["Name", "Amount", "Currency", "Date", "Recurrence", "Actions"].map((label) => <th scope="col" key={label} className="p-3">{label}</th>)}</tr></thead>
              <tbody>
                {data.records.length === 0 && <tr><td colSpan={6} className="p-6 text-center">No income records.</td></tr>}
                {data.records.map((income) => {
                  const recurring = ["weekly", "monthly", "yearly"].includes(income.recurrence);
                  return (
                    <tr key={income._id} className="border-t">
                      <td className="p-3">{income.name}</td>
                      <td className="p-3">{Number(income.amount).toLocaleString()}</td>
                      <td className="p-3">{income.currency}</td>
                      <td className="p-3">{income.receivedDate?.slice(0, 10) || "—"}</td>
                      <td className="p-3"><div className="flex flex-wrap gap-2">
                        <Badge tone={recurring ? "blue" : "neutral"}>{recurrenceLabels[income.recurrence] || income.recurrence || "—"}</Badge>
                        {recurring && <Badge tone={income.isActive ? "green" : "neutral"}>{income.isActive ? "Active" : "Inactive"}</Badge>}
                      </div></td>
                      <td className="p-3"><div className="flex gap-3">
                        <button type="button" disabled={!onEdit} onClick={() => onEdit?.(income)} aria-label={`Edit ${income.name}`} title={!onEdit ? "Edit integration pending" : undefined} className="rounded border px-3 py-1 disabled:opacity-50">Edit</button>
                        <button type="button" onClick={() => { setSelected(income); setDeleteError(""); setNotice(""); }} aria-label={`Delete ${income.name}`} className="rounded border border-red-700 px-3 py-1 text-red-700">Delete</button>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <section className="mt-6" aria-labelledby="income-summary-title">
            <h2 id="income-summary-title" className="text-lg font-semibold">Monthly income summary</h2>
            <p className="my-2 text-sm" dir="auto">المجاميع كما يرجعها الخادم؛ لا يفصل العملات ولا يحوّل بينها.</p>
            {data.summary.length === 0 ? <p>No summary available.</p> : <ul className="flex flex-wrap gap-4">{data.summary.map((item) => (
              <li key={`${item.year}-${item.month}`} className="rounded border p-3">{item.month} {item.year}: <strong>{Number(item.total).toLocaleString()}</strong></li>
            ))}</ul>}
          </section>
        </>
      )}
      <ConfirmDialog open={Boolean(selected)} busy={deleting} error={deleteError} onCancel={() => setSelected(null)} onConfirm={confirmDelete}>
        حذف مصدر الدخل «{selected?.name}» نهائي.
        {selected && selected.recurrence !== "once" && " سيتم حذف المصدر المتكرر بالكامل، وليس إيقاف التكرار فقط."}
      </ConfirmDialog>
    </section>
  );
}
