import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import IncomeSummary from "./pages/Income/IncomeSummary";
import NewIncomePage from "./pages/Income/IncomeForm";
import EditIncomePage from "./pages/Income/EditIncome";
import IncomeList from "./pages/Income/IncomeList";

import Expenses from "./pages/Expenses/Expenses";

function SuccessToast() {
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.toast || "";

  useEffect(() => {
    if (!message) return;

    const timeoutId = setTimeout(() => {
      const nextState = {
        ...(location.state || {}),
      };

      delete nextState.toast;

      navigate(
        `${location.pathname}${location.search}${location.hash}`,
        {
          replace: true,
          state:
            Object.keys(nextState).length > 0
              ? nextState
              : null,
        }
      );
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [
    message,
    location.pathname,
    location.search,
    location.hash,
    location.state,
    navigate,
  ]);

  if (!message) return null;

  return (
    <div
      className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 text-green-700 shadow-lg"
      role="status"
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600"
        aria-hidden="true"
      >
        ✓
      </span>

      <span>{message}</span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SuccessToast />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/forgot"
          element={<ForgotPassword />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/income"
          element={<IncomeSummary />}
        />

        <Route
          path="/income/list"
          element={<IncomeList />}
        />

        <Route
          path="/income/new"
          element={<NewIncomePage />}
        />

        <Route
          path="/income/:id/edit"
          element={<EditIncomePage />}
        />

        <Route
          path="/expenses"
          element={<Expenses />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
