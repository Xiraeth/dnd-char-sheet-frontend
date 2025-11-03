/* eslint-disable no-console */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
}

/**
 * Validates that a parsed object from localStorage matches the User interface structure
 * @param user - The object to validate
 * @returns true if valid, false otherwise
 */
const isValidUser = (user: unknown): user is User => {
  if (!user || typeof user !== "object") {
    return false;
  }

  const userObj = user as Record<string, unknown>;

  return (
    typeof userObj.id === "string" &&
    userObj.id.length > 0 &&
    typeof userObj.username === "string" &&
    userObj.username.length > 0 &&
    !("password" in userObj) // Ensure password is never stored
  );
};

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  handleNoToken: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleNoToken = () => {
    toast.error("You must be logged in to view this page");
    localStorage.removeItem("dnd-char-sheet-user");
    router.push("/");
    setUser(null);
  };

  useEffect(() => {
    /**
     * Verifies user authentication with the server and sets user state
     * Always verifies with server before trusting localStorage
     */
    const verifyAndSetUser = async () => {
      try {
        const userFromLocalStorage = localStorage.getItem(
          "dnd-char-sheet-user"
        );

        // If there's a user in localStorage, verify it with the server
        if (userFromLocalStorage) {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/user`,
              {
                withCredentials: true,
              }
            );

            if (response.status === 200 && response.data.user) {
              // Server confirms user is authenticated, set user from server response
              const serverUser = response.data.user;
              if (isValidUser(serverUser)) {
                setUser(serverUser);
              } else {
                // Server returned invalid user data, clear localStorage
                localStorage.removeItem("dnd-char-sheet-user");
                setUser(null);
              }
            } else {
              // Invalid response, clear localStorage
              localStorage.removeItem("dnd-char-sheet-user");
              setUser(null);
            }
          } catch (err) {
            // Server verification failed, clear localStorage
            if (axios.isAxiosError(err)) {
              if (err.response?.status === 401) {
                localStorage.removeItem("dnd-char-sheet-user");
                setUser(null);
              }
            }
            // Clear localStorage on any error to prevent stale auth state
            localStorage.removeItem("dnd-char-sheet-user");
            setUser(null);
          }
        } else {
          // No user in localStorage, verify with server anyway to check for valid session
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/user`,
              {
                withCredentials: true,
              }
            );

            if (response.status === 200 && response.data.user) {
              const serverUser = response.data.user;
              if (isValidUser(serverUser)) {
                setUser(serverUser);
              }
            }
          } catch {
            // No valid session, user remains null
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndSetUser();
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
        toast.success("Logged out successfully");
        localStorage.removeItem("dnd-char-sheet-user");
        router.push("/");
        window.location.reload();
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
    handleNoToken,
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
