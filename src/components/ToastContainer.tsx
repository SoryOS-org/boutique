import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Heart, 
  HeartOff, 
  PackageCheck, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div 
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col gap-2.5 max-w-[calc(100vw-1.5rem)] sm:max-w-sm w-full pointer-events-none select-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const duration = toast.durationMs || 3800;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const renderIcon = () => {
    switch (toast.type) {
      case 'cart':
        return (
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        );
      case 'favorite_add':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/25 flex items-center justify-center shrink-0 animate-bounce">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
        );
      case 'favorite_remove':
        return (
          <div className="w-10 h-10 rounded-xl bg-zinc-500/15 text-zinc-500 border border-zinc-500/25 flex items-center justify-center shrink-0">
            <HeartOff className="w-5 h-5" />
          </div>
        );
      case 'order':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
        );
      case 'coins':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
        );
      case 'coupon':
        return (
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/25 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.22, ease: 'easeOut' } }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="pointer-events-auto relative overflow-hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-950/10 dark:shadow-black/40 p-3.5 flex flex-col gap-2.5 transition-colors group"
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail or Category Icon */}
        {toast.image ? (
          <div className="relative shrink-0">
            <img
              src={toast.image}
              alt=""
              className="w-11 h-11 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-2xs"
            />
            <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-zinc-900 shadow-xs">
              {toast.type === 'cart' && <ShoppingBag className="w-3 h-3 text-orange-500" />}
              {toast.type === 'favorite_add' && <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />}
              {toast.type === 'favorite_remove' && <HeartOff className="w-3 h-3 text-zinc-400" />}
              {toast.type === 'order' && <PackageCheck className="w-3 h-3 text-emerald-500" />}
              {toast.type === 'coins' && <Coins className="w-3 h-3 text-amber-500" />}
            </div>
          </div>
        ) : (
          renderIcon()
        )}

        {/* Content details */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {toast.title}
            </span>
            {toast.badge && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {toast.badge}
              </span>
            )}
          </div>
          {toast.message && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
              {toast.message}
            </p>
          )}

          {/* Quick CTA Action */}
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors cursor-pointer group/btn"
            >
              <span>{toast.action.label}</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Fermer la notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress countdown bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${
            toast.type === 'cart'
              ? 'bg-orange-500'
              : toast.type === 'favorite_add'
              ? 'bg-rose-500'
              : toast.type === 'order'
              ? 'bg-emerald-500'
              : toast.type === 'coins'
              ? 'bg-amber-500'
              : toast.type === 'coupon'
              ? 'bg-violet-500'
              : 'bg-emerald-500'
          }`}
        />
      </div>
    </motion.div>
  );
};
