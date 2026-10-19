import React, { useState } from 'react';
import { X, Search, UserPlus, ShieldCheck, Sparkles, MessageCircle, Check } from 'lucide-react';
import { UserAccount } from '../types';
import { GoogleIcon } from './GoogleIcon';

interface NewUserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userName: string, userEmail: string, avatarBg: string) => void;
  language: 'fr' | 'en';
}

const PRESET_USERS = [
  { name: 'SoryOS Factory Support', email: 'support@soryos.store', role: 'Support Officiel 24/7', avatarBg: 'bg-orange-600', online: true },
  { name: 'AliExpress Global Logistics', email: 'logistics@aliexpress.com', role: 'Entrepôt & Douanes', avatarBg: 'bg-blue-600', online: true },
  { name: 'Aminata Diallo', email: 'aminata.diallo@example.com', role: 'VIP Gold Member', avatarBg: 'bg-emerald-600', online: true },
  { name: 'Mamadou Barry', email: 'mamadou.barry@example.com', role: 'Membre Diamant', avatarBg: 'bg-purple-600', online: false },
  { name: 'Fatoumata Camara', email: 'fatoumata.camara@example.com', role: 'Membre Gold', avatarBg: 'bg-rose-600', online: true },
  { name: 'Ibrahim Touré', email: 'ibrahim.toure@example.com', role: 'Membre Standard', avatarBg: 'bg-amber-600', online: false },
];

export const NewUserSearchModal: React.FC<NewUserSearchModalProps> = ({
  isOpen,
  onClose,
  onStartChat,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredUsers = PRESET_USERS.filter(
    u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomUserCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    onStartChat(name, customEmail.trim(), 'bg-indigo-600');
    setSuccessMsg(language === 'fr' ? 'Discussion ouverte avec succès !' : 'Chat opened successfully!');
    setTimeout(() => {
      setSuccessMsg(null);
      setCustomEmail('');
      setCustomName('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-4 transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'fr' ? 'Rechercher un utilisateur / Vendeur' : 'Search User or Seller'}
              </h3>
              <p className="text-[11px] text-emerald-100">
                {language === 'fr' ? 'Comme sur Messenger & WhatsApp' : 'Like Messenger & WhatsApp'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher par nom, email ou service...' : 'Search by name, email or service...'}
              className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Preset Users List */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2.5">
              {language === 'fr' ? 'Utilisateurs et Vendeurs suggérés' : 'Suggested Users & Sellers'}
            </h4>

            <div className="space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-400">
                  {language === 'fr' ? 'Aucun utilisateur trouvé.' : 'No users found.'}
                </div>
              ) : (
                filteredUsers.map((u, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onStartChat(u.name, u.email, u.avatarBg);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 bg-zinc-50/60 dark:bg-zinc-800/50 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${u.avatarBg} text-white font-bold flex items-center justify-center text-xs relative`}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        {u.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900"></span>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">
                          {u.name}
                        </h5>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{u.role} · <span className="font-mono">{u.email}</span></p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Discuter' : 'Chat'}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add User by Email (Messenger / WhatsApp Global Directory Search) */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>{language === 'fr' ? 'Trouver par Email ou ID exact' : 'Find by Exact Email or ID'}</span>
            </h4>

            <form onSubmit={handleCustomUserCreate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Nom du contact (optionnel)' : 'Contact name (optional)'}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="email"
                  required
                  placeholder={language === 'fr' ? 'adresse@email.com' : 'user@email.com'}
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-950 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>{language === 'fr' ? 'Démarrer la discussion avec cet utilisateur' : 'Start chat with this user'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
