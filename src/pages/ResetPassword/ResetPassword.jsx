import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import api from "../../services/api";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = searchParams.get("token") || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset session is missing or invalid.");
      return;
    }
    if (!passwordPattern.test(password)) {
      setError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      navigate("/", {
        replace: true,
        state: { toast: "Password changed successfully." },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to reset the password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="mx-auto flex max-w-md justify-end">
        <ThemeToggle />
      </div>
      <section className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-emerald-600">Money Tracker</p>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose a strong new password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium">
            New password
            <input className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
          </label>
          <label className="block text-sm font-medium">
            Confirm new password
            <input className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
          </label>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Use at least 8 characters, including uppercase, lowercase, a number, and a special character.</p>
          <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Confirm password"}
          </button>
        </form>
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{error}</p>}
        <Link className="mt-6 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700" to="/login">Back to login</Link>
      </section>
    </main>
  );
}

export default ResetPassword;
