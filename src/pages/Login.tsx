import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Briefcase } from "lucide-react";

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen paper-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center border-2 border-ink p-12 bg-white shadow-[8px_8px_0px_0px_#1A1A1A]">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 border-2 border-ink flex items-center justify-center rotate-3">
             <Briefcase size={32} />
          </div>
        </div>
        
        <h1 className="font-serif text-4xl font-bold italic mb-4">Auth Required</h1>
        <p className="text-sm opacity-60 mb-10 tracking-widest uppercase">Please authenticate to access the professional ledger.</p>
        
        <button 
          onClick={loginWithGoogle}
          className="w-full ink-bg text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-4 h-4 invert" />
          Continue with Google
        </button>
        
        <div className="mt-12 pt-8 border-t border-ink/10">
          <p className="text-[9px] uppercase tracking-widest opacity-30 leading-relaxed">
            Access to this terminal is restricted to authorized personnel. 
            Authentication data is managed via secure relay.
          </p>
        </div>
      </div>
    </div>
  );
}
