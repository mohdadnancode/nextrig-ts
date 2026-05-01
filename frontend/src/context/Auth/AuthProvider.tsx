import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import api from "../../api/client";
import { AuthContext } from "./AuthContext";
import type { User } from "../../types/user";
import type { AuthContextType } from "../context.types";
import axios from "axios";

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
  const accessTokenRef = useRef<string | null>(null);

  /* ------------------ Fetch current user profile ------------------ */

  const fetchUser = useCallback(async (token: string) => {
    const res = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = res.data;

    if (userData.isBlocked) {
      accessTokenRef.current = null;
      setUser(null);
      setIsAuthenticated(false);
      setAuthError("Account is blocked by admin");
      return;
    }

    setUser(userData);
  }, []);

  /* ------------------ Request interceptor ------------------ */

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      const token = accessTokenRef.current;
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, []);

  /* ------------------ Response interceptor ------------------ */

  useEffect(() => {
    let isRefreshing = false;

    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as typeof error.config & {
          _retry?: boolean;
        };

        const isRefreshEndpoint = originalRequest.url?.includes(
          "/users/refresh-token",
        );

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isRefreshEndpoint
        ) {
          if (isRefreshing) return Promise.reject(error);

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const res = await api.post("/users/refresh-token");
            const newToken: string = res.data.accessToken;

            accessTokenRef.current = newToken;
            setIsAuthenticated(true);
            await fetchUser(newToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return api(originalRequest);
          } catch {
            // Refresh failed — user must log in again
            accessTokenRef.current = null;
            setIsAuthenticated(false);
            setUser(null);
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [fetchUser]);

  /* ------------------ Initialize auth (refresh token) ------------------ */

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/users/refresh-token");
        const token: string = res.data.accessToken;

        accessTokenRef.current = token;
        setIsAuthenticated(true);
        await fetchUser(token);
      } catch {
        accessTokenRef.current = null;
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUser]);

  /* ------------------ Logout in all tabs ------------------ */

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "logout") {
        accessTokenRef.current = null;
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* ------------------ Register ------------------ */

  const register: AuthContextType["register"] = async (userData) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await api.post("/users/register", userData);
      return { success: true, email: res.data.email };
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "Registration failed";

      setAuthError(msg);

      return {
        success: false,
        message: msg,
        field: axios.isAxiosError(error)
          ? error.response?.data?.field
          : undefined,
      };
    } finally {
      setAuthLoading(false);
    }
  };

  /* ------------------ Verify OTP ------------------ */

  const verifyOTP: AuthContextType["verifyOTP"] = async (email, otp) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await api.post("/users/verify-otp", { email, otp });
      const token: string = res.data.accessToken;

      accessTokenRef.current = token;
      setIsAuthenticated(true);
      await fetchUser(token);

      return { success: true };
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "OTP verification failed";
      setAuthError(msg);
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  /* ------------------ Resend OTP ------------------ */

  const resendOTP: AuthContextType["resendOTP"] = async (email) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      await api.post("/users/resend-otp", { email });
      return { success: true };
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to resend OTP";
      setAuthError(msg);
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
      const res = await api.post("/users/login", { email, password });
      const token: string = res.data.accessToken;

      accessTokenRef.current = token;
      setIsAuthenticated(true);
      await fetchUser(token);

      return { success: true };
    } catch (error: unknown) {
      const msg =
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || "Login failed"
          : "Login failed";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  /* ------------------ Logout ------------------ */

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {
      console.error(err);
    }

    accessTokenRef.current = null;
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem("logout", Date.now().toString());
  };

  /* ------------------ Provider Value ------------------ */

  const value: AuthContextType = {
    user,
    isAuthenticated,
    authLoading,
    authError,
    loading,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    setAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
