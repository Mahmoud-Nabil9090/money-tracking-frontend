import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("من فضلك املأ جميع البيانات");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setLoading(true);

      await register(name, email, password);

      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409) {
        setError("البريد الإلكتروني مستخدم بالفعل");
      } else {
        setError(
          message || "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى."
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

        {/* Register Form */}
        <div className="flex items-center justify-center bg-white px-6 py-10 text-slate-900">
          <div className="w-full max-w-md">

            <div className="mb-7">
              <h1 className="text-3xl font-bold">
                إنشاء حساب جديد
              </h1>

              <p className="mt-2 text-slate-500">
                أنشئ حسابك وابدأ في إدارة أموالك بسهولة
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

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  الاسم
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="اكتب اسمك"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Email */}
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

              {/* Password */}
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
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  تأكيد كلمة المرور
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>

            </form>

            <div className="mt-7 text-center text-sm text-slate-500">
              <span>لديك حساب بالفعل؟ </span>

              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                تسجيل الدخول
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
                ابدأ رحلتك المالية
                <br />
                مع Money Tracking
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                أنشئ حسابك وتابع دخلك ومصاريفك وحساباتك
                وحركتك المالية من مكان واحد.
              </p>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">

              <Feature
                title="إدارة الدخل"
                description="سجل مصادر دخلك وتابع إجمالي دخلك بسهولة."
              />

              <Feature
                title="تتبع المصروفات"
                description="اعرف مصاريفك وتصنيفها وتحركات أموالك."
              />

              <Feature
                title="حساباتك"
                description="تابع البنوك والمحافظ والأرصدة المختلفة."
              />

              <Feature
                title="لوحة تحكم واحدة"
                description="شوف حالتك المالية بالكامل من Dashboard واحدة."
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