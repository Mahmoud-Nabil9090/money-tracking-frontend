import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle";
import dashboardPreviewImg from "../../assets/dashboard-preview.jpg";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, devLogin } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (mode === "register" && !formData.name.trim()) {
      errs.name = "الاسم بالكامل مطلوب";
    }

    if (!formData.email.trim()) {
      errs.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.password) {
      errs.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      errs.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      if (mode === "login") {
        await login(formData.email.trim(), formData.password);
      } else {
        await register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Auth error:", err);
      setServerError(
        err.response?.data?.message ||
          (mode === "login"
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            : "حدث خطأ أثناء إنشاء الحساب. قد يكون البريد مسجلاً مسبقاً.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    try {
      setLoading(true);
      setServerError("");
      await devLogin();
      navigate("/dashboard");
    } catch (err) {
      console.error("Demo login error:", err);
      setServerError("تعذر تسجيل الدخول التجريبي. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased" dir="rtl">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* 1. Left Half: Form Side (50% on lg) */}
        <div className="flex w-full flex-col justify-between p-6 sm:p-10 lg:w-1/2 lg:p-16">
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20">
                💰
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Money<span className="text-emerald-400">Tracking</span>
                </span>
                <span className="block text-[11px] font-medium text-slate-400">
                  نظام الإدارة المالية الشامل
                </span>
              </div>
            </div>

            <ThemeToggle />
          </div>

          {/* Form Container */}
          <div className="my-auto mx-auto w-full max-w-md py-8">
            {/* Header Text */}
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {mode === "login" ? "مرحباً بك مجدداً 👋" : "ابدأ رحلتك المالية 🚀"}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {mode === "login"
                  ? "سجّل الدخول للوصول إلى لوحة التحكم وحساباتك ومصاريفك"
                  : "أنشئ حسابك الجديد مجاناً وابدأ في تتبع أموالك بذكاء"}
              </p>
            </div>

            {/* Mode Switcher Tabs (Non-default blue colors: emerald & dark slate) */}
            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-900/90 p-1.5 ring-1 ring-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setServerError("");
                  setErrors({});
                }}
                className={`rounded-xl py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  mode === "login"
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                تسجيل الدخول (Sign In)
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setServerError("");
                  setErrors({});
                }}
                className={`rounded-xl py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  mode === "register"
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                حساب جديد (Register)
              </button>
            </div>

            {/* Error Message */}
            {serverError && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs font-semibold text-rose-300"
              >
                ⚠️ {serverError}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="mb-1.5 block text-xs font-semibold text-slate-300"
                  >
                    الاسم بالكامل (Full Name)
                  </label>
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    placeholder="مثال: أحمد محمد"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                      errors.name ? "border-rose-500" : "border-slate-800"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-400">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-1.5 block text-xs font-semibold text-slate-300"
                >
                  البريد الإلكتروني (Email Address)
                </label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.email ? "border-rose-500" : "border-slate-800"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-semibold text-slate-300"
                  >
                    كلمة المرور (Password)
                  </label>
                  {mode === "login" && (
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      نسيت كلمة المرور؟
                    </Link>
                  )}
                </div>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.password ? "border-rose-500" : "border-slate-800"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-400">{errors.password}</p>
                )}
              </div>

              {mode === "register" && (
                <div>
                  <label
                    htmlFor="auth-confirm-password"
                    className="mb-1.5 block text-xs font-semibold text-slate-300"
                  >
                    تأكيد كلمة المرور (Confirm Password)
                  </label>
                  <input
                    id="auth-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                      errors.confirmPassword ? "border-rose-500" : "border-slate-800"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="auth-remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/30"
                  />
                  <label
                    htmlFor="auth-remember"
                    className="text-xs font-medium text-slate-400 cursor-pointer"
                  >
                    تذكر تسجيل دخولي على هذا الجهاز
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    <span>جاري التحقق...</span>
                  </>
                ) : mode === "login" ? (
                  <span>تسجيل الدخول إلى الداش بورد &larr;</span>
                ) : (
                  <span>إنشاء الحساب ودخول الداش بورد &larr;</span>
                )}
              </button>
            </form>

            {/* Quick Demo Login Option */}
            <div className="relative mt-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800/80" />
              </div>
              <span className="relative bg-slate-950 px-4 text-xs font-semibold text-slate-500">
                أو جرب السيستم مباشرة بدون تسجيل
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-emerald-500/40 hover:bg-slate-800/80 hover:text-emerald-400"
            >
              <span>⚡</span>
              <span>دخول تجريبي فوري (Quick Demo Login)</span>
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-xs text-slate-500">
            نظام تتبع وإدارة الأموال الذكي © {new Date().getFullYear()}
          </div>
        </div>

        {/* 2. Right Half: Image & Dashboard Showcase (50% on lg) */}
        <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950/70 p-12 border-r border-slate-800/60">
          {/* Ambient Lighting Gradients */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />

          {/* Top Header Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              معاينة حية للداش بورد
            </span>

            <span className="text-xs font-medium text-slate-400">
              Live Fintech Platform
            </span>
          </div>

          {/* Center: Stunning Dashboard Mockup & Floating Badges */}
          <div className="relative z-10 my-auto py-8">
            <div className="relative mx-auto max-w-lg transition-transform duration-500 hover:scale-[1.02]">
              {/* Glow border ring around mockup */}
              <div className="absolute -inset-1.5 rounded-3xl bg-linear-to-r from-emerald-500/30 via-purple-500/30 to-emerald-500/30 blur-md opacity-70" />

              {/* Dashboard Preview Image */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl">
                <img
                  src={dashboardPreviewImg}
                  alt="Financial Dashboard Preview"
                  className="h-auto w-full object-cover"
                />
              </div>

              {/* Floating Glassmorphic Badges */}
              <div className="absolute -bottom-5 -right-5 z-20 rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-lg">
                    📈
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      صافي المدخرات
                    </span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      +38.5% هذا الشهر
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-5 -left-5 z-20 rounded-2xl border border-purple-500/40 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 text-lg">
                    🏦
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      إجمالي الحسابات
                    </span>
                    <span className="text-sm font-extrabold text-purple-300">
                      Bank • Wallet • Cash
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Promo text */}
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-white">
                تحكّم كامل في أموالك ومصاريفك ومداخيلك
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 max-w-md mx-auto">
                لوحة تحكم ذكية وشاملة تحسب لك الثروة الإجمالية، التدفقات النقدية، وتفاصيل كل حساب ومصروف في مكان واحد وبألوان عصرية.
              </p>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-6 text-center text-xs">
            <div>
              <span className="block font-bold text-emerald-400">⚡ لحظي</span>
              <span className="text-[11px] text-slate-400">تحديث آلي للرصيد</span>
            </div>
            <div>
              <span className="block font-bold text-teal-400">🔒 آمن</span>
              <span className="text-[11px] text-slate-400">تشفير تام للبيانات</span>
            </div>
            <div>
              <span className="block font-bold text-purple-400">📊 تحليلي</span>
              <span className="text-[11px] text-slate-400">رسوم ومخططات بيانية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
