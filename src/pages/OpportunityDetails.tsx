import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Opportunity } from '../types';
import toast from 'react-hot-toast';

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then(res => res.json())
      .then(data => {
        setOpportunity(data);
        setLoading(false);
      });
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId: 1, opportunityId: id })
      });
      
      if (res.ok) {
        toast.success('Successfully registered!', {
          icon: '🎉',
          style: {
            borderRadius: '16px',
            background: '#5A5A40',
            color: '#fff',
          },
        });
        navigate('/profile');
      } else {
        toast.error('You are already registered for this event.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!opportunity) return <div className="pt-32 text-center">Opportunity not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-400 hover:text-brand-olive mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium uppercase tracking-widest">Back to Explore</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-[3/4] rounded-[48px] overflow-hidden shadow-2xl"
        >
          <img 
            src={opportunity.imageUrl} 
            alt={opportunity.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-1.5 bg-brand-olive/10 text-brand-olive rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              {opportunity.category}
            </span>
            <h1 className="serif text-5xl md:text-6xl font-semibold mb-6 leading-tight">
              {opportunity.title}
            </h1>
            
            <div className="flex items-center gap-3 mb-8 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Organized by</p>
                <p className="font-serif text-lg font-medium">{opportunity.organization}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-stone-400">
                  <Calendar size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Date</span>
                </div>
                <p className="font-medium">{format(new Date(opportunity.date), 'MMMM do, yyyy')}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-stone-400">
                  <Clock size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Duration</span>
                </div>
                <p className="font-medium">{opportunity.hours} Hours</p>
              </div>
              <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-2 text-stone-400">
                  <MapPin size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Location</span>
                </div>
                <p className="font-medium">{opportunity.location}</p>
              </div>
            </div>

            <div className="prose prose-stone mb-10">
              <p className="text-stone-600 leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            <button
              onClick={handleRegister}
              disabled={registering}
              className="w-full py-5 bg-brand-olive text-white rounded-full font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg shadow-brand-olive/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {registering ? 'Processing...' : (
                <>
                  <CheckCircle2 size={20} />
                  Register as Volunteer
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
