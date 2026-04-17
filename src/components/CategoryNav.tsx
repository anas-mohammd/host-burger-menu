'use client';

import { Category } from '@/types';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { UtensilsCrossed, List, LayoutGrid } from 'lucide-react';

interface Props {
  categories: Category[];
  activeId: string | null;
  viewMode: 'list' | 'grid';
  onSelect: (id: string) => void;
  onViewChange: (mode: 'list' | 'grid') => void;
}

export default function CategoryNav({ categories, activeId, viewMode, onSelect, onViewChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !activeId) return;
    const btn = ref.current.querySelector(`[data-cat="${activeId}"]`) as HTMLElement;
    btn?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="sticky top-[61px] z-30 bg-[#0a0a0a]/92 backdrop-blur-md border-b border-white/5">
      <div className="max-w-3xl mx-auto flex items-center">

        {/* Categories scrollable area */}
        <div
          ref={ref}
          className="flex-1 flex gap-4 overflow-x-auto no-scrollbar py-3 px-4"
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
                <div
                  className={`relative w-14 h-14 rounded-2xl overflow-hidden transition-all duration-200 ${
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
                  {isActive && (
                    <div className="absolute inset-0 bg-[#DC2626]/15 pointer-events-none" />
                  )}
                </div>
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

        {/* View toggle — fixed on left side (RTL) */}
        <div className="shrink-0 flex items-center px-3 border-l border-white/5 self-stretch">
          <div className="flex flex-col items-center gap-0.5 bg-[#1a1a1a] border border-white/8 rounded-xl p-1">
            <button
              onClick={() => onViewChange('list')}
              className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-[#DC2626] text-white' : 'text-white/40 hover:text-white/70'
              }`}
              aria-label="عرض شريطي"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewChange('grid')}
              className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#DC2626] text-white' : 'text-white/40 hover:text-white/70'
              }`}
              aria-label="عرض شبكة"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
