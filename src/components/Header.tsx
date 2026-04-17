'use client';

import Image from 'next/image';
import { Restaurant } from '@/types';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

interface Props {
  restaurant: Restaurant;
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ restaurant, cartCount, onCartClick }: Props) {
  const { theme, toggle } = useTheme();
  const words = restaurant.name.split(' ');
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');

  return (
    <header className="gradient-header border-b border-white/5 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">

          {/* Cart button — right side (RTL) */}
          <button
            onClick={onCartClick}
            className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 hover:bg-white/12 active:scale-95 transition-all border border-white/8"
            aria-label="السلة"
          >
            <ShoppingCart className="w-5 h-5 text-white/80" />
            {cartCount > 0 && (
              <span className="pop absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Restaurant info — center */}
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <Image src={theme === 'light' ? '/logo-light.svg' : '/logo.svg'} alt="logo" width={50} height={50} className="shrink-0" />
            <h1 className="text-lg font-black tracking-wide uppercase leading-tight pt-2">
              <span className="text-[#DC2626]">{firstWord}</span>
              {restWords && <span className="text-white"> {restWords}</span>}
            </h1>
          </div>

          {/* Theme toggle — left side (RTL) */}
          <button
            onClick={toggle}
            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 hover:bg-white/12 active:scale-95 transition-all border border-white/8"
            aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
          >
            {theme === 'dark'
              ? <Sun className="w-[18px] h-[18px] text-white/70" />
              : <Moon className="w-[18px] h-[18px] text-white/70" />
            }
          </button>

        </div>
      </div>
    </header>
  );
}
