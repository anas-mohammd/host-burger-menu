'use client';

import { Offer } from '@/types';
import { Tag, Percent, Sparkles } from 'lucide-react';

interface Props {
  offers: Offer[];
  currencySymbol: string;
}

export default function OffersBanner({ offers, currencySymbol }: Props) {
  if (!offers.length) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/5" />
        <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#DC2626]" />
          العروض
        </h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      {/* Cards grid */}
      <div className={`grid gap-3 ${offers.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative overflow-hidden flex items-start gap-3 bg-gradient-to-br from-[#DC2626]/12 to-[#DC2626]/4 border border-[#DC2626]/20 rounded-2xl p-3.5"
          >
            {/* Icon */}
            <div className="w-9 h-9 rounded-xl bg-[#DC2626]/15 flex items-center justify-center shrink-0 mt-0.5">
              {offer.discount_type === 'percentage' ? (
                <Percent className="w-4 h-4 text-[#DC2626]" />
              ) : (
                <Tag className="w-4 h-4 text-[#DC2626]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-black text-white text-sm leading-tight">{offer.title}</p>
              <p className="text-[#DC2626] text-xs font-bold mt-1">
                {offer.discount_type === 'percentage'
                  ? `خصم ${offer.discount_value}%`
                  : `خصم ${offer.discount_value} ${currencySymbol}`}
              </p>
              {offer.applicable_items.length === 0 && (
                <p className="text-white/30 text-[10px] mt-0.5">على كامل الطلب</p>
              )}
            </div>

            {/* Decorative circle */}
            <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-[#DC2626]/6 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
