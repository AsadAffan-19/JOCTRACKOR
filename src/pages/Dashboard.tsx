import { useState, useMemo, useEffect, FormEvent, ReactNode } from 'react';
import { Trash2, Briefcase, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { jobService, JobApplication, Status } from '../services/db';

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [newApp, setNewApp] = useState({ company: '', role: '' });
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setError(null);
      const unsubscribe = jobService.subscribeToUserJobs(user.uid, 
        (data) => {
          setApplications(data);
          setLoading(false);
        },
        (err) => {
          console.error("Dashboard subscription failed:", err);
          setError(err.message || "Failed to sync with the permanent ledger. Please check your connection or permissions.");
          setLoading(false);
        }
      );
      return unsubscribe;
    }
  }, [user]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      nextStage: applications.filter(a => a.status === 'Interview').length,
    };
  }, [applications]);

  const filteredApps = useMemo(() => {
    if (filter === 'All') return applications;
    return applications.filter(a => a.status === filter);
  }, [applications, filter]);

  const addApplication = async (e: FormEvent) => {
    e.preventDefault();
    if (!newApp.company || !newApp.role || !user) return;

    try {
      await jobService.addJob({
        userId: user.uid,
        company: newApp.company,
        role: newApp.role,
        status: 'Applied',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      });
      setNewApp({ company: '', role: '' });
    } catch (error) {
      console.error("Failed to add job", error);
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    try {
      await jobService.updateJob(id, { status });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const deleteApplication = async (id: string) => {
    if (confirm("Clear this record from the permanent ledger?")) {
      try {
        await jobService.deleteJob(id);
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 border-2 border-ink border-t-transparent animate-spin mb-4 rotate-12"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 animate-pulse">Synchronizing Ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 md:p-12 lg:px-24">
        <div className="max-w-md w-full border-2 border-red-500 p-8 text-center bg-red-50/50">
          <h3 className="text-red-600 font-bold uppercase text-xs tracking-widest mb-4">Sync Error</h3>
          <p className="text-sm italic font-serif mb-6 opacity-80">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-red-700 transition-colors"
          >
            Attempt Re-authentication
          </button>
          {error.includes("index") && (
            <div className="mt-6 pt-6 border-t border-red-200 text-left">
              <p className="text-[9px] uppercase font-bold text-red-600 mb-2">Note to Developer:</p>
              <p className="text-[9px] leading-relaxed opacity-60">
                Firestore requires a composite index for this query. Check the browser console (F12) for a link to automatically generate it.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex flex-col space-y-10">
          <div className="flex md:hidden justify-between border border-ink p-4 mb-4">
             <div className="text-right">
              <span className="text-[9px] uppercase opacity-40 tracking-widest font-bold">Total</span>
              <div className="text-2xl font-light">{stats.total.toString().padStart(3, '0')}</div>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase opacity-40 tracking-widest font-bold">Next Stage</span>
              <div className="text-2xl font-light">{stats.nextStage.toString().padStart(2, '0')}</div>
            </div>
          </div>

          <section>
            <h3 className="text-xs uppercase font-bold border-b border-ink/20 pb-2 mb-6 tracking-widest">New Entry</h3>
            <form onSubmit={addApplication} className="space-y-6">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase mb-1 opacity-50 font-bold tracking-tighter">Company Name</label>
                <input 
                  type="text" 
                  value={newApp.company}
                  onChange={e => setNewApp({ ...newApp, company: e.target.value })}
                  placeholder="e.g. Acme Corp" 
                  className="bg-transparent border-b border-ink py-2 focus:outline-none placeholder:italic placeholder:opacity-30 text-sm font-serif"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] uppercase mb-1 opacity-50 font-bold tracking-tighter">Position / Role</label>
                <input 
                  type="text" 
                  value={newApp.role}
                  onChange={e => setNewApp({ ...newApp, role: e.target.value })}
                  placeholder="Software Eng" 
                  className="bg-transparent border-b border-ink py-2 focus:outline-none placeholder:italic placeholder:opacity-30 text-sm font-serif"
                />
              </div>
              <button className="ink-bg text-white w-full py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all">
                Register Application
              </button>
            </form>
          </section>

          <section>
            <h3 className="text-xs uppercase font-bold border-b border-ink/20 pb-2 mb-6 tracking-widest">Search & Sort</h3>
            <div className="space-y-2">
              {(['All', 'Applied', 'Interview', 'Offer', 'Rejected'] as const).map((f, idx) => {
                const count = f === 'All' ? applications.length : applications.filter(a => a.status === f).length;
                return (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`w-full flex justify-between items-center text-[10px] uppercase px-3 py-2 border tracking-widest transition-all ${filter === f ? 'ink-bg text-white border-ink' : 'border-ink/10 hover:border-ink/50'}`}
                  >
                    <span>{idx + 1}. {f}</span>
                    <span className="opacity-60">{count.toString().padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        {/* Main Log Table */}
        <div className="flex-1 flex flex-col lg:border-l border-ink/10 lg:pl-12 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-[10px] uppercase font-bold tracking-[0.3em] border-b border-ink">
                <tr>
                  <th className="pb-5 font-bold">Status</th>
                  <th className="pb-5 font-bold">Company</th>
                  <th className="pb-5 font-bold">Role</th>
                  <th className="pb-5 text-right font-bold">Date Logged</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-ink/5">
                <AnimatePresence mode="popLayout">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center italic opacity-30 font-serif">
                        No entries found in ledger for current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={app.id}
                        className="group hover:bg-ink/[0.02] transition-colors"
                      >
                        <td className="py-6 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            {app.status === 'Interview' ? (
                              <span className="stamp">Interview</span>
                            ) : app.status === 'Offer' ? (
                              <span className="stamp border-ink text-ink italic">Selected</span>
                            ) : app.status === 'Rejected' ? (
                              <span className="text-[10px] uppercase line-through opacity-30 tracking-widest font-bold">Rejected</span>
                            ) : (
                              <span className="text-[10px] uppercase opacity-40 tracking-widest font-bold">Applied</span>
                            )}
                          </div>
                        </td>
                        <td className="py-6 font-semibold font-serif text-lg">{app.company}</td>
                        <td className="py-6 opacity-60 italic">{app.role}</td>
                        <td className="py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="font-mono text-[10px] opacity-40">{app.date}</span>
                            <div className="flex border border-ink/10 rounded-sm overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                              <StatusBtn active={app.status === 'Applied'} onClick={() => updateStatus(app.id, 'Applied')} icon={<Clock size={10} />} />
                              <StatusBtn active={app.status === 'Interview'} onClick={() => updateStatus(app.id, 'Interview')} icon={<Briefcase size={10} />} />
                              <StatusBtn active={app.status === 'Offer'} onClick={() => updateStatus(app.id, 'Offer')} icon={<CheckCircle2 size={10} />} />
                              <StatusBtn active={app.status === 'Rejected'} onClick={() => updateStatus(app.id, 'Rejected')} icon={<XCircle size={10} />} />
                              <button 
                                onClick={() => deleteApplication(app.id)}
                                className="px-2 py-1 hover:bg-red-500 hover:text-white transition-colors border-l border-ink/10"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="mt-12 p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-ink/10 pt-8">
            <p className="text-[10px] uppercase opacity-30 max-w-sm leading-relaxed tracking-wider">
              This application ledger is a formal record of professional trajectory. Data is archived remotely on Firebase Southeast-1 Cluster.
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse"></div>
              <span className="text-[10px] uppercase font-bold tracking-widest">Real-time DB Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBtn({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 transition-all border-r border-ink/10 last:border-r-0 ${active ? 'ink-bg text-white' : 'hover:bg-ink/10'}`}
    >
      {icon}
    </button>
  );
}
