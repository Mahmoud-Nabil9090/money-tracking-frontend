import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("من فضلك اكتب البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      setLoading(true);

      await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403 && message === "ACCOUNT_SUSPENDED") {
        setError("الحساب موقوف حاليًا. تواصل مع الإدارة.");
      } else if (status === 429) {
        setError(
          message || "محاولات تسجيل دخول كثيرة. حاول مرة أخرى لاحقًا."
        );
      } else if (status === 401) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError(
          message || "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-950 text-white"
    >
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Login Section */}
        <div className="flex items-center justify-center bg-white px-6 py-12 text-slate-900">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                تسجيل الدخول
              </h1>

              <p className="mt-2 text-slate-500">
                ادخل إلى حسابك لإدارة أموالك بسهولة
              </p>
            </div>

            {error && (
              <div
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  البريد الإلكتروني
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  كلمة المرور
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span>تذكرني</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  نسيت كلمة المرور؟
                </Link>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>

            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              <span>ليس لديك حساب؟ </span>

              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                إنشاء حساب
              </Link>
            </div>

          </div>
        </div>

        {/* System Introduction */}
        <div className="hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 lg:flex">
          <div className="flex w-full flex-col justify-center px-12 xl:px-20">

            <div className="mb-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold">
                  M
                </div>

                <span className="text-2xl font-bold">
                  Money Tracking
                </span>
              </div>

              <h2 className="max-w-xl text-4xl font-bold leading-tight xl:text-5xl">
                سيطر على أموالك،
                <br />
                وخلي قراراتك المالية أذكى.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                نظام متكامل يساعدك تتابع دخلك ومصاريفك وحساباتك
                وتحركات أموالك من مكان واحد.
              </p>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">

              <Feature
                title="متابعة الدخل"
                description="سجل دخلك واعرف وضعك المالي بشكل واضح."
              />

              <Feature
                title="إدارة المصروفات"
                description="تابع مصاريفك واعرف فلوسك بتروح فين."
              />

              <Feature
                title="إدارة الحسابات"
                description="تابع أرصدة حساباتك والبنوك والمحافظ."
              />

              <Feature
                title="رؤية مالية واضحة"
                description="اعرف إجمالي أموالك وحركتك المالية بسهولة."
              />

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm">
          ✓
        </div>

        <h3 className="font-semibold">
          {title}
        </h3>
      </div>

      <p className="text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}