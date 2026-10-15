import React from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between"
        >
          {/* Media Showcase Placeholder (4:3) */}
          <div className="relative aspect-[4/3] bg-zinc-200/80 dark:bg-zinc-800 overflow-hidden">
            {/* Shimmer effect bar */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
            
            {/* Tag pill placeholder */}
            <div className="absolute top-3 left-3 w-14 h-5 bg-zinc-300/80 dark:bg-zinc-700 rounded-md" />
            
            {/* Wishlist button placeholder */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-zinc-300/80 dark:bg-zinc-700 rounded-full" />
          </div>

          {/* Card Body Details Box */}
          <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white dark:bg-zinc-900 space-y-3.5">
            <div>
              {/* Category & Sales Count row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-750 rounded" />
                <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-750 rounded" />
              </div>

              {/* Title 2-lines placeholder */}
              <div className="space-y-2 mb-3">
                <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-750 rounded-md" />
                <div className="w-3/4 h-4 bg-zinc-200 dark:bg-zinc-750 rounded-md" />
              </div>

              {/* Seller info line */}
              <div className="w-28 h-3 bg-zinc-200/90 dark:bg-zinc-750 rounded mb-3" />

              {/* Star Rating placeholder */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-5 bg-amber-100/70 dark:bg-amber-950/40 rounded" />
                <div className="w-14 h-3 bg-zinc-200 dark:bg-zinc-750 rounded" />
              </div>
            </div>

            {/* Price and Action Section */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="w-20 h-6 bg-zinc-200 dark:bg-zinc-750 rounded-md" />
                  <div className="w-12 h-4 bg-zinc-200/80 dark:bg-zinc-750 rounded" />
                </div>
                <div className="w-10 h-4 bg-emerald-100/80 dark:bg-emerald-950/40 rounded" />
              </div>

              {/* Logistics tag line */}
              <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-750 rounded" />

              {/* Full width button placeholder */}
              <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-750 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
