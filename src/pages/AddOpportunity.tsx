import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Clock, Building2, Tag, Image as ImageIcon, FileText, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddOpportunity() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization: '',
    date: '',
    location: '',
    category: 'Community',
    image_url: 'https://images.unsplash.com/photo-1559027615-cd26735550b4?auto=format&fit=crop&q=80&w=800',
    hours: 2
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success('Opportunity created successfully!', {
          icon: '✨',
          style: {
            borderRadius: '16px',
            background: '#5A5A40',
            color: '#fff',
          },
        });
        navigate('/');
      } else {
        toast.error('Failed to create opportunity.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-400 hover:text-brand-olive mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium uppercase tracking-widest">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="serif text-4xl font-semibold mb-2">Create Opportunity</h1>
        <p className="text-stone-500 mb-10">Share a new volunteering event with the community.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                <PlusCircle size={14} />
                Title
              </label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                placeholder="e.g. Community Garden Cleanup"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                  <Building2 size={14} />
                  Organization
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.organization}
                  onChange={e => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                  placeholder="Organization name"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                  <Tag size={14} />
                  Category
                </label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all appearance-none"
                >
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Community">Community</option>
                  <option value="Animals">Animals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                  <Calendar size={14} />
                  Date
                </label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                  <Clock size={14} />
                  Hours
                </label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.hours}
                  onChange={e => setFormData({ ...formData, hours: parseInt(e.target.value) })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                  <MapPin size={14} />
                  Location
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                  placeholder="City or Venue"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                <ImageIcon size={14} />
                Image URL
              </label>
              <input 
                type="url" 
                required
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                <FileText size={14} />
                Description
              </label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all min-h-[150px]"
                placeholder="Describe the opportunity and what volunteers will be doing..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-olive text-white rounded-full font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg shadow-brand-olive/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : (
              <>
                <PlusCircle size={20} />
                Create Opportunity
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
