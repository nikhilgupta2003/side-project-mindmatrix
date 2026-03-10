import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Opportunity } from '../types';

interface Props {
  opportunity: Opportunity;
  key?: React.Key;
}

export default function OpportunityCard({ opportunity }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-stone-100 group"
    >
      <Link to={`/opportunity/${opportunity.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={opportunity.imageUrl}
            alt={opportunity.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-olive">
              {opportunity.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="serif text-2xl font-semibold mb-2 group-hover:text-brand-olive transition-colors">
            {opportunity.title}
          </h3>
          <p className="text-stone-500 text-sm mb-4 line-clamp-2">
            {opportunity.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <Calendar size={14} />
              <span>{format(new Date(opportunity.date), 'MMMM do, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <MapPin size={14} />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <Clock size={14} />
              <span>{opportunity.hours} Hours</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
