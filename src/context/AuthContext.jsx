import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser } from "../services/authServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const token = localStorage.getItem("token");
		return token ? { authenticated: true } : null;
	});

	const login = async (email, password) => {
		const response = await loginUser(email, password);
		setUser(response.data?.user ?? { authenticated: true });
		return response;
	};

	const logout = () => {
		logoutUser();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
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
