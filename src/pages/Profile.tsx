import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
import { Calendar, Clock, Award, CheckCircle2, MapPin, UserCircle, Edit2, Camera, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Volunteer } from '../types';

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
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', profile_picture_url: '' });

  const volunteerId = 1; // Mock current user

  const fetchData = async () => {
    const [volRes, regRes, statRes] = await Promise.all([
      fetch(`/api/volunteer/${volunteerId}`),
      fetch(`/api/volunteer/${volunteerId}/registrations`),
      fetch(`/api/volunteer/${volunteerId}/stats`)
    ]);
    const volData = await volRes.json();
    const regData = await regRes.json();
    const statData = await statRes.json();
    
    setVolunteer(volData);
    setEditForm({ 
      name: volData.name || '', 
      bio: volData.bio || '', 
      profile_picture_url: volData.profile_picture_url || '' 
    });
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/volunteer/${volunteerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchData();
    } else {
      toast.error('Failed to update profile');
    }
  };

  const isProfileIncomplete = volunteer && (!volunteer.bio || !volunteer.profile_picture_url);

  if (loading) return <div className="pt-32 text-center serif italic">Loading your profile...</div>;

  const totalHours = registrations
    .filter(r => r.status === 'completed')
    .reduce((acc, curr) => acc + curr.hours, 0);

  const upcomingEvents = registrations.filter(r => r.status === 'registered');
  const completedEvents = registrations.filter(r => r.status === 'completed');

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
      {isProfileIncomplete && !isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-amber-50 border border-amber-100 p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-amber-900">Complete your profile</h3>
              <p className="text-amber-700/70 text-sm">Add a bio and profile picture to help organizations know you better.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-amber-600 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-sm"
          >
            Complete Now
          </button>
        </motion.div>
      )}

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            {volunteer?.profile_picture_url ? (
              <img 
                src={volunteer.profile_picture_url} 
                alt={volunteer.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 bg-stone-100 text-stone-300 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <UserCircle size={64} />
              </div>
            )}
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-2 bg-white text-stone-600 rounded-full shadow-sm border border-stone-100 hover:text-brand-olive transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="serif text-5xl font-light mb-2"
            >
              Hello, <span className="italic">{volunteer?.name.split(' ')[0]}</span>.
            </motion.h1>
            <p className="text-stone-500 max-w-md">
              {volunteer?.bio || "You haven't added a bio yet. Tell us about yourself!"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-3 hover:bg-stone-50 transition-colors"
          >
            <div className="w-10 h-10 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center">
              <Edit2 size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Profile</p>
              <p className="text-sm font-serif font-bold">Edit Info</p>
            </div>
          </button>
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

      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm"
        >
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl overflow-hidden relative">
            <h2 className="serif text-3xl font-semibold mb-8">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Profile Picture URL</label>
                <input 
                  type="url" 
                  value={editForm.profile_picture_url}
                  onChange={e => setEditForm({ ...editForm, profile_picture_url: e.target.value })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="mt-1 text-[10px] text-stone-400">Use a link to an image (e.g., from Unsplash or your social media)</p>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Short Bio</label>
                <textarea 
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all min-h-[120px]"
                  placeholder="Tell us about your background and why you volunteer..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-brand-olive text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-stone-700 transition-all shadow-lg shadow-brand-olive/20"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-stone-100 text-stone-600 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

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
