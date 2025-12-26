import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      // Check localStorage for session (temporary - will be httpOnly cookie later)
      const sessionData = localStorage.getItem("admin_session");
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          // Check if session expired (24 hours)
          const now = Date.now();
          if (session.expiresAt > now) {
            setUser(session.user);
          } else {
            localStorage.removeItem("admin_session");
          }
        } catch (error) {
          console.error("Invalid session data");
          localStorage.removeItem("admin_session");
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    // MOCK AUTHENTICATION
    // TODO: Replace with real API call in Phase 9
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation
    if (email === "admin@example.com" && password === "admin123") {
      const mockUser: User = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      };

      // Create session (expires in 24 hours)
      const session = {
        user: mockUser,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      // Store in localStorage (temporary - will be httpOnly cookie later)
      localStorage.setItem("admin_session", JSON.stringify(session));

      setUser(mockUser);
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error("Invalid email or password");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
