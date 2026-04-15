'use client';

import { Category } from '@/types';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { UtensilsCrossed } from 'lucide-react';

interface Props {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryNav({ categories, activeId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !activeId) return;
    const btn = ref.current.querySelector(`[data-cat="${activeId}"]`) as HTMLElement;
    btn?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="sticky top-[61px] z-30 bg-[#0a0a0a]/92 backdrop-blur-md border-b border-white/5">
      <div
        ref={ref}
        className="max-w-3xl mx-auto px-4 flex gap-4 overflow-x-auto no-scrollbar py-3"
      >
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              onClick={() => onSelect(cat.id)}
              className="shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-all duration-200"
            >
              {/* Dish circle */}
              <div
                className={`relative w-14 h-14 rounded-full overflow-hidden transition-all duration-200 ${
                  isActive
                    ? 'ring-2 ring-[#DC2626] ring-offset-2 ring-offset-[#0a0a0a] shadow-lg shadow-red-900/40'
                    : 'ring-1 ring-white/10'
                }`}
              >
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-base font-black transition-colors ${
                    isActive ? 'bg-[#DC2626]/20 text-[#DC2626]' : 'bg-white/6 text-white/30'
                  }`}>
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                )}

                {/* Active overlay tint */}
                {isActive && (
                  <div className="absolute inset-0 bg-[#DC2626]/15 pointer-events-none" />
                )}
              </div>

              {/* Category name */}
              <span
                className={`text-[10px] font-bold tracking-wide text-center leading-tight max-w-[64px] truncate transition-colors ${
                  isActive ? 'text-[#DC2626]' : 'text-white/45'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
