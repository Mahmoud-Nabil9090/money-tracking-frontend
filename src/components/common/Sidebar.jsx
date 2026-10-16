import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

/* ── Sidebar Navigation Items ── */
const MENU_ITEMS = [
  {
    section: "القائمة",
    items: [
      { to: "/dashboard", icon: "📊", label: "لوحة التحكم" },
      { to: "/income", icon: "💰", label: "الإيرادات" },
      { to: "/expenses", icon: "💸", label: "المصروفات" },
      { to: "/accounts", icon: "🏦", label: "الحسابات" },
    ],
  },
  {
    section: "عام",
    items: [
      { to: "/expenses/categories", icon: "🏷️", label: "التصنيفات" },
      { to: "/income/list", icon: "📋", label: "قائمة الدخل" },
    ],
  },
];

export default function Sidebar({ userName = "المستخدم", onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className="fixed right-0 top-0 z-40 flex h-screen flex-col border-l overflow-y-auto transition-colors duration-200"
      style={{
        width: "var(--sidebar-width)",
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      {/* ── Logo / Brand ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-black text-white shadow-md shadow-emerald-500/20">
            M
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight" style={{ color: "var(--text-heading)" }}>
              Money<span className="text-emerald-500">Tracking</span>
            </h1>
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-tertiary)" }}>
              إدارة مالية ذكية
            </p>
          </div>
        </div>
        {/* Theme Toggle at top */}
        <ThemeToggle compact />
      </div>

      {/* ── Navigation Sections ── */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {MENU_ITEMS.map((section) => (
          <div key={section.section}>
            <p
              className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--sidebar-section-label)" }}
            >
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                      active
                        ? ""
                        : "hover:translate-x-[-2px]"
                    }`}
                    style={{
                      backgroundColor: active ? "var(--sidebar-item-active-bg)" : "transparent",
                      color: active ? "var(--sidebar-item-active-text)" : "var(--text-secondary)",
                      borderRight: active ? "3px solid var(--sidebar-item-active-border)" : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "var(--sidebar-item-hover)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }
                    }}
                  >
                    <span className={`text-base transition-transform duration-200 ${!active ? "group-hover:scale-110" : ""}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {active && (
                      <span className="mr-auto h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom Section: User ── */}
      <div className="border-t px-4 py-4" style={{ borderColor: "var(--border-primary)" }}>
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
              {userName}
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              حساب نشط
            </p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg p-1.5 text-xs transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              style={{ color: "var(--text-tertiary)" }}
              title="تسجيل الخروج"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
