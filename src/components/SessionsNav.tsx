import React from 'react';
import { Flame, BedDouble, Shirt, Headphones, Coffee, LayoutGrid } from 'lucide-react';

interface SessionItem {
  id: string;
  label: string;
  badge?: string;
  icon: React.ElementType;
}

const SESSIONS: SessionItem[] = [
  { id: 'flash-section', label: 'Ventes Flash', badge: '-70%', icon: Flame },
  { id: 'session-textile', label: 'Maison & Linge de Lit', badge: 'Draps & Rideaux', icon: BedDouble },
  { id: 'session-mode', label: 'Mode & Caftans', badge: 'Artisanat', icon: Shirt },
  { id: 'session-tech', label: 'High-Tech & Audio', badge: 'Direct Usine', icon: Headphones },
  { id: 'session-lifestyle', label: 'Lifestyle & Barista', badge: 'Premium', icon: Coffee },
  { id: 'catalog-section', label: 'Tout le Catalogue', badge: 'Filtres', icon: LayoutGrid },
];

interface SessionsNavProps {
  activeSession?: string;
}

export const SessionsNav: React.FC<SessionsNavProps> = () => {
  const scrollToSession = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-zinc-100/80 dark:bg-zinc-900/90 border-b border-zinc-200/80 dark:border-zinc-800 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mr-2 hidden md:flex">
            <span>Rayons & Sessions :</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scroll-smooth scrollbar-subtle py-1 w-full">
            {SESSIONS.map((session) => {
              const Icon = session.icon;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => scrollToSession(session.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-750 hover:text-orange-700 dark:hover:text-orange-400 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-orange-300 dark:hover:border-orange-500/50 text-xs font-semibold shadow-2xs transition-all shrink-0 cursor-pointer active:scale-95 group"
                >
                  <Icon className="w-3.5 h-3.5 text-orange-600 dark:text-orange-500 group-hover:scale-110 transition-transform" />
                  <span>{session.label}</span>
                  {session.badge && (
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/60 text-zinc-600 dark:text-zinc-300 group-hover:text-orange-700 dark:group-hover:text-orange-400 px-1.5 py-0.2 rounded font-medium ml-0.5">
                      {session.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
