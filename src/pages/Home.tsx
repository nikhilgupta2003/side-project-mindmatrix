import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import OpportunityCard from '../components/OpportunityCard';
import { Opportunity } from '../types';
import { Search, Filter } from 'lucide-react';

export default function Home() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/opportunities')
      .then(res => res.json())
      .then(data => {
        setOpportunities(data);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Environment', 'Education', 'Health', 'Community', 'Animals'];

  const filtered = opportunities.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || 
                         o.organization.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || o.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="serif text-5xl md:text-7xl font-light mb-4"
        >
          Make an <span className="italic">impact</span> today.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-stone-500 max-w-lg"
        >
          Connect with local NGOs and community groups. Discover opportunities that match your skills and passion.
        </motion.p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search opportunities..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-olive/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat 
                ? 'bg-brand-olive text-white' 
                : 'bg-white text-stone-500 border border-stone-200 hover:border-brand-olive'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-white rounded-[32px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(opportunity => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-stone-400 italic">No opportunities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
