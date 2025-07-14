import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  storeId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);

        // Persist auth state
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.user));

        return true;
      } else {
        const error = await response.json();
        console.error("Login failed:", error);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return {
    user,
    token,
    login,
    logout,
    isLoading,
  };
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

// API wrapper with authentication
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const url = endpoint.startsWith("/")
    ? endpoint
    : `/api/protected/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

export { AuthContext };
