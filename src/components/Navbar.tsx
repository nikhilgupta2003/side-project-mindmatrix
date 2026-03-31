import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, Home, PlusCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/add-opportunity', icon: PlusCircle, label: 'Add Event' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 px-6 py-3 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-olive rounded-full flex items-center justify-center text-white">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="hidden md:block font-serif text-2xl font-semibold text-brand-olive">VolunteerConnect</span>
        </Link>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                location.pathname === item.path ? "text-brand-olive" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <item.icon size={24} />
              <span className="text-[10px] uppercase tracking-widest font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
