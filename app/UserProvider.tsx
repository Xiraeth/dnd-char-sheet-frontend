"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Initialize from localStorage after mount
    const savedUser = localStorage.getItem("dnd-char-sheet-user");

    // Check if the user is authenticated via the custom header
    const authStatus = document
      .querySelector('meta[name="auth-status"]')
      ?.getAttribute("content");

    // If the user is not authenticated according to the server but exists in localStorage,
    // clear the user from localStorage
    if (authStatus === "unauthenticated" && savedUser) {
      console.log(
        "User is not authenticated according to server, clearing from localStorage"
      );
      localStorage.removeItem("dnd-char-sheet-user");
    } else if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("dnd-char-sheet-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("dnd-char-sheet-user");
    }
  }, [user]);

  const logout = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        sessionStorage.setItem("userLoggedOut", "true");
        setUser(null);
      } else {
        throw new Error("Failed to log out");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url,
          headers: error.config?.headers,
        });
      } else {
        console.error("Error:", error);
      }
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
