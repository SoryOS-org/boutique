import React, { useState, useEffect } from 'react';

interface ScrollProgressBarProps {
  /** Optional custom container selector or ID to track specifically. Defaults to the document scroll */
  targetId?: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ targetId }) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const calculateProgress = () => {
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          const rect = target.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalHeight = rect.height;
          // Progress from when top of catalog hits viewport top until bottom hits bottom
          const currentScroll = window.scrollY - target.offsetTop;
          const scrollableDistance = totalHeight - windowHeight;

          if (scrollableDistance > 0) {
            const pct = (currentScroll / scrollableDistance) * 100;
            setScrollProgress(Math.min(100, Math.max(0, pct)));
            setIsVisible(currentScroll > 10);
            ticking = false;
            return;
          }
        }
      }

      // Default: track whole document scroll through the product catalog
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollableDistance = scrollHeight - clientHeight;

      if (scrollableDistance <= 0) {
        setScrollProgress(0);
        setIsVisible(false);
      } else {
        const pct = (scrollTop / scrollableDistance) * 100;
        setScrollProgress(Math.min(100, Math.max(0, pct)));
        setIsVisible(scrollTop > 20);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetId]);

  return (
    <div
      role="progressbar"
      aria-label="Progression du défilement du catalogue"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-[49] pointer-events-none select-none"
    >
      {/* Background track */}
      <div className="w-full h-1 bg-zinc-200/50 dark:bg-zinc-800/60 backdrop-blur-xs overflow-hidden">
        {/* Animated Gradient Fill */}
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 transition-[width] duration-150 ease-out relative shadow-[0_0_10px_rgba(249,115,22,0.7)]"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Subtle glowing leading pulse at the right tip of the bar */}
          {scrollProgress > 0 && scrollProgress < 100 && (
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-200 shadow-md shadow-orange-500/80 animate-pulse pointer-events-none"
              style={{ transform: 'translate(50%, -50%)' }}
            />
          )}
        </div>
      </div>

      {/* Floating mini indicator badge on the top-right when actively scrolling */}
      <div
        className={`absolute top-2 right-4 transition-all duration-300 pointer-events-none ${
          isVisible && scrollProgress > 1
            ? 'opacity-90 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-1 scale-95'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 dark:bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider shadow-sm border border-zinc-700/40 dark:border-zinc-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span>{Math.round(scrollProgress)}%</span>
        </span>
      </div>
    </div>
  );
};
