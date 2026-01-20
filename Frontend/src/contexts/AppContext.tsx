// /**
//  * =============================================================================
//  * APP CONTEXT - Global state management for the application
//  * =============================================================================
//  * 
//  * This context provides:
//  * - User authentication state
//  * - Current user role (with ability to switch for demo)
//  * - Mock data mode toggle
//  * - Theme preferences
//  */

// import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
// import { UserRole } from "@/types/booking";
// import { setUseMockData, getUseMockData, login as apiLogin, logout as apiLogout } from "@/api/api";

// // =============================================================================
// // TYPES
// // =============================================================================

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: UserRole;
// }

// interface AppContextType {
//   // User state
//   user: User | null;
//   isAuthenticated: boolean;
//   currentRole: UserRole;
  
//   // Actions
//   login: (email: string, password: string, role: UserRole) => Promise<void>;
//   logout: () => void;
//   switchRole: (role: UserRole) => void;
  
//   // Mock data mode
//   isMockMode: boolean;
//   setMockMode: (value: boolean) => void;
// }

// // =============================================================================
// // CONTEXT
// // =============================================================================

// const AppContext = createContext<AppContextType | undefined>(undefined);

// // =============================================================================
// // PROVIDER
// // =============================================================================

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CUSTOMER);
//   const [isMockMode, setIsMockMode] = useState(true);

//   useEffect(() => {
//   const storedUser = localStorage.getItem("homeserve_user");
//   const storedRole = localStorage.getItem("homeserve_role");
//   const token = localStorage.getItem("auth_token");

//   if (storedUser && storedRole && token) {
//     setUser(JSON.parse(storedUser));
//     setCurrentRole(storedRole as UserRole);
//   }
// }, []);

//   // Initialize from localStorage on mount
//   useEffect(() => {
//     const savedUser = localStorage.getItem("homeserve_user");
//     const savedRole = localStorage.getItem("homeserve_role");
//     const savedMockMode = localStorage.getItem("homeserve_mock_mode");

//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (e) {
//         localStorage.removeItem("homeserve_user");
//       }
//     }

//     if (savedRole) {
//       setCurrentRole(savedRole as UserRole);
//     }

//     if (savedMockMode !== null) {
//       const mockMode = savedMockMode === "true";
//       setIsMockMode(mockMode);
//       setUseMockData(mockMode);
//     }
//   }, []);

//   // Login handler - role is used locally for navigation/UI, backend determines role from user data
//   const login = useCallback(async (email: string, password: string, role: UserRole) => {
//     try {
//       const response = await apiLogin(email, password);
//       const loggedInUser: User = {
//         id: response.user.id,
//         email: response.user.email,
//         name: response.user.name,
//         role: response.user.role || role, // Use role from backend response, fallback to provided role
//       };
      
//       setUser(loggedInUser);
//       setCurrentRole(loggedInUser.role);
      
//       localStorage.setItem("homeserve_user", JSON.stringify(loggedInUser));
//       localStorage.setItem("homeserve_role", loggedInUser.role);
//       localStorage.setItem("auth_token", response.token);
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     }
//   }, []);

//   // Logout handler
//   const logout = useCallback(() => {
//     apiLogout();
//     setUser(null);
//     setCurrentRole(UserRole.CUSTOMER);
//     localStorage.removeItem("homeserve_user");
//     localStorage.removeItem("homeserve_role");
//     localStorage.removeItem("auth_token");
//   }, []);

//   // Switch role (for demo purposes)
//   const switchRole = useCallback((role: UserRole) => {
//     setCurrentRole(role);
//     localStorage.setItem("homeserve_role", role);
    
//     // Update user role if logged in
//     if (user) {
//       const updatedUser = { ...user, role };
//       setUser(updatedUser);
//       localStorage.setItem("homeserve_user", JSON.stringify(updatedUser));
//     }
//   }, [user]);

//   // Toggle mock mode
//   const setMockMode = useCallback((value: boolean) => {
//     setIsMockMode(value);
//     setUseMockData(value);
//     localStorage.setItem("homeserve_mock_mode", String(value));
//   }, []);

//   const value: AppContextType = {
//     user,
//     isAuthenticated: !!user,
//     currentRole,
//     login,
//     logout,
//     switchRole,
//     isMockMode,
//     setMockMode,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// }

// // =============================================================================
// // HOOK
// // =============================================================================

// export function useApp() {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error("useApp must be used within an AppProvider");
//   }
//   return context;
// }


import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { UserRole } from "@/types/booking";
import { setUseMockData, login as apiLogin, logout as apiLogout } from "@/api/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  currentRole: UserRole;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isMockMode: boolean;
  setMockMode: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isMockMode, setIsMockMode] = useState(false); // 🔴 default false
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ SINGLE hydration effect (ONLY ONE)
  useEffect(() => {
    const storedUser = localStorage.getItem("homeserve_user");
    const storedRole = localStorage.getItem("homeserve_role");
    const token = localStorage.getItem("auth_token");
    const savedMockMode = localStorage.getItem("homeserve_mock_mode");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setCurrentRole((storedRole as UserRole) || parsedUser.role);
      setIsAuthenticated(true);
    }

    if (savedMockMode !== null) {
      const mock = savedMockMode === "true";
      setIsMockMode(mock);
      setUseMockData(mock);
    }

    setHydrated(true);
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    const response = await apiLogin(email, password);

    const loggedInUser: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      role: response.user.role || role,
    };

    setUser(loggedInUser);
    setCurrentRole(loggedInUser.role);
    setIsAuthenticated(true);

    localStorage.setItem("homeserve_user", JSON.stringify(loggedInUser));
    localStorage.setItem("homeserve_role", loggedInUser.role);
    localStorage.setItem("auth_token", response.token);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentRole(UserRole.CUSTOMER);

    localStorage.removeItem("homeserve_user");
    localStorage.removeItem("homeserve_role");
    localStorage.removeItem("auth_token");
  }, []);

  const switchRole = useCallback(
    (role: UserRole) => {
      setCurrentRole(role);
      localStorage.setItem("homeserve_role", role);

      if (user) {
        const updated = { ...user, role };
        setUser(updated);
        localStorage.setItem("homeserve_user", JSON.stringify(updated));
      }
    },
    [user]
  );

  const setMockMode = useCallback((value: boolean) => {
    setIsMockMode(value);
    setUseMockData(value);
    localStorage.setItem("homeserve_mock_mode", String(value));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        hydrated,
        currentRole,
        login,
        logout,
        switchRole,
        isMockMode,
        setMockMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
