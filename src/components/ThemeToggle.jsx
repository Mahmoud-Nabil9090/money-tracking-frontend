import { useEffect, useState } from "react";

function ThemeToggle({ className = "", compact = false }) {
  const [theme, setTheme] = useState(() => {
    // التحقق من القيمة المحفوظة في المتصفح أو تفضيلات النظام
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تبديل الوضع الليلي / النهاري"
      className={`group relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 active:scale-95 ${
        isDark
          ? "border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 hover:border-slate-600"
          : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300"
      } ${className}`}
      title={isDark ? "تفعيل الوضع الفاتح (Light Mode)" : "تفعيل الوضع الداكن (Dark Mode)"}
    >
      {/* Toggle Track */}
      <div className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
        isDark ? "bg-emerald-600" : "bg-slate-300"
      }`}>
        {/* Toggle Knob */}
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-4" : "translate-x-0.5"
        }`}>
          {/* Icon inside knob */}
          {isDark ? (
            <svg className="h-4 w-4 p-0.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.06 1.06l1.06 1.06Z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 p-0.5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      {!compact && (
        <span className="hidden sm:inline font-medium">
          {isDark ? "فاتح" : "داكن"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
