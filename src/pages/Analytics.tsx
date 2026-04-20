import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { jobService, JobApplication } from "../services/db";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Analytics() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      return jobService.subscribeToUserJobs(
        user.uid, 
        (data) => {
          setJobs(data);
          setLoading(false);
        },
        (err) => {
          console.error("Analytics subscription failed:", err);
          setError(err.message || "Failed to process behavioral insights.");
          setLoading(false);
        }
      );
    }
  }, [user]);

  const statusData = useMemo(() => {
    const counts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  const COLORS = ['#1A1A1A', '#4A4A4A', '#8A8A8A', '#CACACA'];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center font-sans">
        <div className="w-12 h-12 border-2 border-ink border-t-transparent animate-spin mb-4 rotate-12"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 animate-pulse">Computing Data Points...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 md:p-12 lg:px-24">
        <div className="max-w-md w-full border-2 border-ink p-8 text-center bg-white shadow-[6px_6px_0px_0px_#1A1A1A]">
          <h3 className="text-ink font-bold uppercase text-xs tracking-widest mb-4">Processing Error</h3>
          <p className="text-sm italic font-serif mb-6 opacity-60">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full ink-bg text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:opacity-90 transition-all"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-ink/20 pb-8">
          <h2 className="font-serif text-4xl italic font-bold">Behavioral Insights</h2>
          <p className="text-sm opacity-50 uppercase tracking-widest mt-2">Quantitative analysis of your application success rate.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Status Distribution */}
          <div className="border border-ink p-8 bg-dashed-grid">
            <h3 className="text-xs uppercase font-bold tracking-widest mb-8 text-center bg-white py-1 border border-ink -mt-12 w-fit mx-auto px-4">Status Distribution</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #1A1A1A',
                      fontFamily: 'Inter',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Over Time (Simplified) */}
          <div className="border border-ink p-8 bg-dashed-grid">
            <h3 className="text-xs uppercase font-bold tracking-widest mb-8 text-center bg-white py-1 border border-ink -mt-12 w-fit mx-auto px-4">Application Velocity</h3>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={{ stroke: '#1A1A1A' }}
                    tick={{ fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis 
                   axisLine={{ stroke: '#1A1A1A' }}
                   tick={{ fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip 
                     cursor={{ fill: 'rgba(26, 26, 26, 0.05)' }}
                     contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #1A1A1A',
                      fontFamily: 'Inter',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="value" fill="#1A1A1A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 border border-ink italic opacity-70 serif text-center max-w-2xl mx-auto">
          "The data suggests that persistence is proportional to outcomes. Continue your trajectory with measured resolve."
        </div>
      </div>
    </div>
  );
}
