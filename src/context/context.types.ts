import type { Dispatch, SetStateAction } from "react";
import type { User } from "../types/user";

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    user?: User;
  }>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean }>;
  logout: () => void;
  setAuthError: Dispatch<SetStateAction<string>>;
};
