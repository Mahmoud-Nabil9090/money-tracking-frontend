import { useState } from "react";
import { quickDevLogin, logoutUser } from "../services/authService";

function AuthBanner({ onLoginSuccess }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleQuickLogin = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await quickDevLogin();
      if (res?.token) {
        setToken(res.token);
        setMsg("✅ تم تسجيل الدخول بنجاح وحفظ الـ Token في المتصفح!");
        if (onLoginSuccess) {
          onLoginSuccess(res.token);
        }
      }
    } catch (err) {
      console.error("Quick login failed:", err);
      setMsg("❌ فشل تسجيل الدخول التجريبي. تأكد أن السيرفر يعمل على البورت 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setToken(null);
    setMsg("تم تسجيل الخروج");
    if (onLoginSuccess) {
      onLoginSuccess(null);
    }
  };

  if (token) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs text-emerald-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>
            أنت مسجل الدخول الآن والـ <strong>Bearer Token</strong> مفعل في جميع طلبات الـ API.
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-emerald-300 bg-white px-2.5 py-1 font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          تسجيل خروج
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold flex items-center gap-2">
            <span>🔑</span> تنبيه: غير مسجل دخول (Unauthorized)
          </p>
          <p className="mt-1 text-xs text-amber-800">
            جميع مسارات الإيرادات بالباك إند تتطلب التوثيق عبر (<strong>Bearer Token</strong>).
            يمكنك تسجيل الدخول بنقرة واحدة بحساب الاختبار للمتابعة فوراً.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickLogin}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "جاري تسجيل الدخول..." : "⚡ تسجيل دخول تجريبي بنقرة واحدة"}
        </button>
      </div>

      {msg && (
        <p className="mt-2 text-xs font-semibold text-amber-800 border-t border-amber-200/60 pt-2">
          {msg}
        </p>
      )}
    </div>
  );
}

export default AuthBanner;

