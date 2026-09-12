import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function MainLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
        <Link to="/" className="font-bold text-slate-800 dark:text-white">
          Money Tracker
        </Link>
        <div className="flex items-center gap-4">
          {user?.name && <span className="text-sm text-slate-600 dark:text-slate-300">{user.name}</span>}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>
      <Outlet />
    </>
  );
}

export default MainLayout;