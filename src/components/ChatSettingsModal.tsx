import React from 'react';
import { X, Moon, Sun, Globe, Bell, Palette, Eye } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface ChatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
  bubbleColor: string;
  onBubbleColorChange: (color: string) => void;
  visibilityStatus: 'online' | 'offline' | 'busy';
  onVisibilityStatusChange: (status: 'online' | 'offline' | 'busy') => void;
}

export const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  bubbleColor,
  onBubbleColorChange,
  visibilityStatus,
  onVisibilityStatusChange,
}) => {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const colors = [
    { name: 'emerald', class: 'bg-emerald-600' },
    { name: 'blue', class: 'bg-blue-600' },
    { name: 'rose', class: 'bg-rose-600' },
    { name: 'purple', class: 'bg-purple-600' },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold dark:text-white">
            {language === 'fr' ? 'Paramètres du Chat' : 'Chat Settings'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full dark:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 dark:text-gray-200">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              <span>{language === 'fr' ? 'Mode sombre' : 'Dark mode'}</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
                theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 dark:text-gray-200">
              <Globe size={20} />
              <span>{language === 'fr' ? 'Langue' : 'Language'}</span>
            </div>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as 'fr' | 'en')}
              className="bg-transparent dark:text-gray-400 focus:outline-none"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Visibility Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 dark:text-gray-200">
              <Eye size={20} />
              <span>{language === 'fr' ? 'Visibilité' : 'Visibility'}</span>
            </div>
            <select
              value={visibilityStatus}
              onChange={(e) => onVisibilityStatusChange(e.target.value as 'online' | 'offline' | 'busy')}
              className="bg-transparent dark:text-gray-400 focus:outline-none"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="busy">Busy</option>
            </select>
          </div>

          {/* Bubble Color */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 dark:text-gray-200">
              <Palette size={20} />
              <span>{language === 'fr' ? 'Couleur des bulles' : 'Bubble color'}</span>
            </div>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onBubbleColorChange(c.name)}
                  className={`w-8 h-8 rounded-full ${c.class} ${bubbleColor === c.name ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-emerald-500' : ''}`}
                />
              ))}
            </div>
          </div>
          
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 dark:text-gray-200">
              <Bell size={20} />
              <span>{language === 'fr' ? 'Notifications' : 'Notifications'}</span>
            </div>
            <input type="checkbox" className="toggle toggle-emerald" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};
