import { createContext, useContext, useState } from "react";
import { loginUser, registerUser, logoutUser, quickDevLogin } from "../services/authServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token) {
      try {
        return storedUser ? JSON.parse(storedUser) : { authenticated: true };
      } catch {
        return { authenticated: true };
      }
    }
    return null;
  });

  const login = async (email, password) => {
    const response = await loginUser(email, password);
    const userData = response.data?.user || { email, authenticated: true };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return response;
  };

  const register = async (name, email, password) => {
    const response = await registerUser(name, email, password);
    const userData = response.data?.user || { name, email, authenticated: true };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return response;
  };

  const devLogin = async () => {
    const res = await quickDevLogin();
    const userData = res.user || { name: "مستخدم تجريبي", email: "student1@example.com", authenticated: true };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return res;
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        devLogin,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
