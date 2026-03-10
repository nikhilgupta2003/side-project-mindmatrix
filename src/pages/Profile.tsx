import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
import { Calendar, Clock, Award, CheckCircle2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Registration {
  id: number;
  title: string;
  date: string;
  location: string;
  hours: number;
  status: 'registered' | 'completed';
}

interface Stat {
  date: string;
  hours: number;
}

export default function Profile() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const volunteerId = 1; // Mock current user

  const fetchData = async () => {
    const [regRes, statRes] = await Promise.all([
      fetch(`/api/volunteer/${volunteerId}/registrations`),
      fetch(`/api/volunteer/${volunteerId}/stats`)
    ]);
    const regData = await regRes.json();
    const statData = await statRes.json();
    setRegistrations(regData);
    setStats(statData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleComplete = async (regId: number) => {
    const res = await fetch(`/api/registrations/${regId}/complete`, { method: 'POST' });
    if (res.ok) {
      toast.success('Activity marked as completed!');
      fetchData();
    }
  };

  const totalHours = registrations
    .filter(r => r.status === 'completed')
    .reduce((acc, curr) => acc + curr.hours, 0);

  const upcomingEvents = registrations.filter(r => r.status === 'registered');
  const completedEvents = registrations.filter(r => r.status === 'completed');

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="serif text-5xl font-light mb-2"
          >
            Hello, <span className="italic">Alex</span>.
          </motion.h1>
          <p className="text-stone-500">You've made a difference in your community.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-olive/10 text-brand-olive rounded-full flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total Hours</p>
              <p className="text-xl font-serif font-bold">{totalHours}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Impact Level</p>
              <p className="text-xl font-serif font-bold">{totalHours > 10 ? 'Gold' : 'Silver'}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm">
            <h2 className="serif text-2xl font-semibold mb-6">Activity Tracking</h2>
            <div className="h-[300px] w-full">
              {stats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#A8A29E' }}
                      tickFormatter={(val) => format(new Date(val), 'MMM d')}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A8A29E' }} />
                    <Tooltip 
                      cursor={{ fill: '#f5f5f0' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="hours" radius={[10, 10, 0, 0]}>
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#5A5A40" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-stone-400 italic">
                  No completed activities yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="serif text-2xl font-semibold mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map(reg => (
                <motion.div 
                  key={reg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-serif text-xl font-medium mb-1">{reg.title}</h3>
                    <div className="flex items-center gap-4 text-stone-400 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{format(new Date(reg.date), 'MMM do')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{reg.location}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleComplete(reg.id)}
                    className="px-4 py-2 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-olive hover:text-white transition-all"
                  >
                    Mark Complete
                  </button>
                </motion.div>
              )) : (
                <p className="text-stone-400 italic">No upcoming events. Go explore!</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-brand-olive p-8 rounded-[40px] text-white">
            <h2 className="serif text-2xl font-semibold mb-4">Community Impact</h2>
            <p className="text-white/70 text-sm mb-6">
              Your contribution has helped 5 local organizations and impacted approximately 120 lives.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span>Monthly Goal</span>
                <span>80%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[80%] rounded-full" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="serif text-2xl font-semibold mb-6">History</h2>
            <div className="space-y-4">
              {completedEvents.map(reg => (
                <div key={reg.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-50">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-serif font-medium">{reg.title}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">{reg.hours} Hours • {format(new Date(reg.date), 'MMM yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
