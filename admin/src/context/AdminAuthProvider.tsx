import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import axiosInstance from "../utils/axiosInstance";

interface Admin {
    adminName: string;
  adminEmail: string;
  role: string;
  
  // Add other properties returned by your API
}

interface AdminContextType {
  loginAdmin: Admin | null;
  loading: boolean;
  logoutAdmin: () => Promise<void>;
  // Added a way to update the state after a successful login mutation
  setAdminData: (admin: Admin) => void; 
}

// Exporting is fine, but standard practice is to export the provider and a custom hook
const AdminContext = createContext<AdminContextType | null>(null);

interface AdminAuthProps {
  children: ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [loginAdmin, setLoginAdmin] = useState<Admin | null>(null);
  
  // Default to true to prevent premature redirects in protected routes
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const getAdmin = async () => {
      try {
        // No need to set loading to true here since it defaults to true
        const response = await axiosInstance.get("/get/admin");

        if (response.status === 200 || response.status === 304) {
          setLoginAdmin(response.data.loggedInAdmin);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setLoginAdmin(null); // Ensure state is cleared on 401/403
      } finally {
        setLoading(false);
      }
    };

    getAdmin();
  }, []);

  const logoutAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/admin/logout");

      if (response.status === 200 || response.status === 304) {
        setLoginAdmin(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const setAdminData = useCallback((admin: Admin) => {
    setLoginAdmin(admin);
  }, []);

  const value = useMemo(
    () => ({
      loginAdmin,
      loading,
      logoutAdmin,
      setAdminData,
    }),
    [loginAdmin, loading, logoutAdmin, setAdminData]
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook for cleaner consumption
// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuth provider");
  }
  return context;
}