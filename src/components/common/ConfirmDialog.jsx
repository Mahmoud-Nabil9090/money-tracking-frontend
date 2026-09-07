import { useEffect, useId, useRef } from "react";

export default function ConfirmDialog({ open, title = "هل أنت متأكد؟", children, busy = false, error, onCancel, onConfirm }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={busy}
      className="m-auto w-full max-w-md rounded-xl p-6 shadow-xl backdrop:bg-black/40"
      onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}
    >
      <h2 id={titleId} className="text-lg font-semibold" dir="auto">{title}</h2>
      <div id={descriptionId} className="my-4" dir="auto">{children}</div>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      <div className="flex justify-end gap-3">
        <button autoFocus type="button" disabled={busy} onClick={onCancel} className="rounded border px-4 py-2 disabled:opacity-50">Cancel</button>
        <button type="button" disabled={busy} onClick={onConfirm} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">{busy ? "Deleting…" : "Delete"}</button>
      </div>
    </dialog>
  );
}
