import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, LayoutDashboard, BarChart3, Briefcase } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return <>{children}</>;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col selection:bg-ink selection:text-paper font-sans paper-bg border-ink">
      <header className="flex justify-between items-end border-b-2 border-ink p-8 md:px-12 pb-6 mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-60">Index No. 2024-AT-LOG</span>
          <Link to="/" className="font-serif text-4xl md:text-5xl font-bold italic tracking-tighter mt-2 hover:opacity-80 transition-opacity">
            Application Ledger
          </Link>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all ${isActive("/") ? "opacity-100 underline underline-offset-4" : "opacity-40 hover:opacity-100"}`}
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link 
            to="/analytics" 
            className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all ${isActive("/analytics") ? "opacity-100 underline underline-offset-4" : "opacity-40 hover:opacity-100"}`}
          >
            <BarChart3 size={14} />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 hover:text-red-600 transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </nav>
      </header>

      {children}
      
      <footer className="mt-auto p-8 md:px-12 text-[9px] uppercase tracking-[0.4em] opacity-20 flex flex-col md:flex-row justify-between gap-4 border-t border-ink/5 pt-4">
        <span>Doc Ref: JOB-LOG-TRK-2026-PRO</span>
        <span>Verified Virtual Stationery Standard v4.0</span>
        <span className="italic">Authorized User: {user.email}</span>
      </footer>
    </div>
  );
}
