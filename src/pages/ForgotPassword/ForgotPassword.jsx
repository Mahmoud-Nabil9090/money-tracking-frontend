import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import api from "../../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const codeInputs = useRef([]);

  const handleSendCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data?.message || "A 4-digit reset code has been sent to your email.");
      setStep("code");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to send the reset code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/auth/verify-reset-code", { email, code });
      const token = response.data?.data?.token;
      navigate(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Invalid or expired reset code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCodeChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = code.split("");
    nextCode[index] = digit;
    setCode(nextCode.join(""));
    if (digit && index < 3) codeInputs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event) => {
    event.preventDefault();
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    setCode(pastedCode);
    codeInputs.current[Math.min(pastedCode.length, 3)]?.focus();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6">
      <div className="mx-auto flex max-w-md justify-end">
        <ThemeToggle />
      </div>
      <section className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-emerald-600">Money Tracker</p>
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {step === "email" ? "Enter your email and we will send you a 4-digit code." : `Enter the code sent to ${email}.`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <label className="block text-sm font-medium">
              Email
              <input className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
            </label>
            <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <label className="block text-sm font-medium">
              4-digit verification code
              <div className="mt-2 flex justify-center gap-3" onPaste={handleCodePaste}>
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(element) => { codeInputs.current[index] = element; }}
                    className="h-14 w-12 rounded-xl border border-slate-300 bg-white text-center text-2xl font-bold outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 sm:h-16 sm:w-14"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={code[index] || ""}
                    onChange={(event) => handleCodeChange(index, event.target.value)}
                    onKeyDown={(event) => handleCodeKeyDown(index, event)}
                    required
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
            </label>
            <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting || code.length !== 4}>
              {submitting ? "Verifying..." : "Verify code"}
            </button>
          </form>
        )}

        {message && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">{message}</p>}
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{error}</p>}
        <Link className="mt-6 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700" to="/login">Back to login</Link>
      </section>
    </main>
  );
}

export default ForgotPassword;
