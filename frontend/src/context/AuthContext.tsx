import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/client";
import type { User } from "../types/user";
import type { AuthContextType } from "./context.types";

/* ------------------ Context Creation ------------------ */

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/* ------------------ Provider Props ------------------ */

type AuthProviderProps = {
  children: ReactNode;
};

/* ------------------ Provider ------------------ */

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [authLoading, setAuthLoading] = useState(false);
const [authError, setAuthError] = useState("");
const [loading, setLoading] = useState(true);

  /* ------------------ Load user from localStorage ------------------ */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
  const parsedUser = JSON.parse(storedUser) as User;
  setUser(parsedUser);
  setIsAuthenticated(true);
} catch {
  localStorage.removeItem("user");
}
    }
    setLoading(false);
  }, []);

  /* ------------------ Register ------------------ */

  const register: AuthContextType["register"] = async (userData) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const { data: existing } = await api.get<User[]>(
        `/users?email=${userData.email}`,
      );

      if (existing.length > 0) {
        throw new Error("Email already registered");
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 4),
        username: userData.username.trim(),
        email: userData.email.trim(),
        password: userData.password,
        role: "user",
        profileImage: "",
        address: [],
        cart: [],
        orders: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isBlocked: false,
      };

      await api.post("/users", newUser);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Registration failed. Try again.");
      }
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  /* ------------------ Login ------------------ */

  const login: AuthContextType["login"] = async (email, password) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const { data: users } = await api.get<User[]>(
        `/users?email=${email}&password=${password}`,
      );

      if (users.length === 0) {
        throw new Error("Invalid email or password");
      }

      if (users[0].isBlocked) {
        throw new Error("Your account has been blocked");
      }

      const loggedInUser = users[0];
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setIsAuthenticated(true);

      return { success: true, user: loggedInUser };
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAuthError(error.message);
      }
      return { success: false, user: undefined };
    } finally {
      setAuthLoading(false);
    }
  };

  /* ------------------ Logout ------------------ */

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  /* ------------------ Provider Value ------------------ */

  const value: AuthContextType = {
    user,
    isAuthenticated,
    authLoading,
    authError,
    login,
    register,
    logout,
    setAuthError,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ------------------ Hook ------------------ */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
