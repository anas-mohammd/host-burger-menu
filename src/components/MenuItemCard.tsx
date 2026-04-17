'use client';

import { MenuItem, CartItem, Offer } from '@/types';
import { formatPrice } from '@/lib/currencies';
import Image from 'next/image';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface Props {
  item: MenuItem;
  currencyCode: string;
  cart: CartItem[];
  offers: Offer[];
  compact?: boolean;
  onAdd: (item: MenuItem, variantName?: string, variantPrice?: string) => void;
  onRemove: (itemId: string, variantName?: string) => void;
  onOpenDetail: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, currencyCode, cart, offers, compact = false, onAdd, onRemove, onOpenDetail }: Props) {
  const hasVariants = item.variants && item.variants.length > 0;

  const totalQty = cart
    .filter((ci) => ci.item.id === item.id)
    .reduce((s, ci) => s + ci.quantity, 0);

  const applicableOffers = offers.filter(
    (o) => o.applicable_items.length === 0 || o.applicable_items.includes(item.id)
  );

  const displayPrice = hasVariants
    ? Math.min(...item.variants.map((v) => parseFloat(v.price))).toString()
    : item.price;

  const handleAddClick = () => {
    if (hasVariants) onOpenDetail(item);
    else onAdd(item);
  };

  const handleRemoveClick = () => {
    if (hasVariants) onOpenDetail(item);
    else onRemove(item.id);
  };

  const formatOfferLabel = (offer: Offer) =>
    offer.discount_type === 'percentage'
      ? `خصم ${offer.discount_value}%`
      : `خصم ${offer.discount_value}`;

  const basePrice = parseFloat(displayPrice);
  const discountedPrice = applicableOffers.reduce((price, offer) => {
    const val = parseFloat(offer.discount_value);
    return offer.discount_type === 'percentage'
      ? price * (1 - val / 100)
      : Math.max(0, price - val);
  }, basePrice);
  const hasDiscount = applicableOffers.length > 0 && discountedPrice < basePrice;

  /* ── Compact (grid) card ───────────────────────────────────────────── */
  if (compact) {
    return (
      <div className="item-card bg-[#181818] rounded-2xl overflow-hidden border border-white/6 fade-in">
        {/* Square image */}
        <div
          className="relative w-full overflow-hidden cursor-pointer"
          style={{ aspectRatio: '1/1' }}
          onClick={() => onOpenDetail(item)}
        >
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 50vw, 350px"
            />
          ) : (
            <div className="w-full h-full bg-[#222] flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-white/10" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Offer badge */}
          {applicableOffers.length > 0 && (
            <div className="absolute top-1.5 right-1.5">
              <span className="bg-[#DC2626] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg leading-none">
                {formatOfferLabel(applicableOffers[0])}
              </span>
            </div>
          )}

          {/* Size hint */}
          {hasVariants && (
            <div className="absolute bottom-1.5 right-1.5 bg-black/50 backdrop-blur-sm text-white/70 text-[9px] font-medium px-1.5 py-0.5 rounded-full">
              اختر الحجم
            </div>
          )}

          {/* Cart qty badge */}
          {totalQty > 0 && (
            <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-black flex items-center justify-center shadow-lg">
              {totalQty}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5">
          <h3
            className="font-bold text-white text-xs leading-snug line-clamp-2 mb-2 cursor-pointer hover:text-white/90 transition-colors"
            onClick={() => onOpenDetail(item)}
          >
            {item.name}
          </h3>

          <div className="flex items-center justify-between gap-1">
            {/* Price */}
            <div className="min-w-0">
              {hasDiscount ? (
                <span className="text-[#DC2626] font-black text-sm leading-none">
                  {hasVariants ? 'من ' : ''}{formatPrice(discountedPrice, currencyCode)}
                </span>
              ) : (
                <span className="text-white font-black text-sm leading-none">
                  {hasVariants ? 'من ' : ''}{formatPrice(displayPrice, currencyCode)}
                </span>
              )}
            </div>

            {/* Add / qty controls */}
            {totalQty === 0 ? (
              <button
                onClick={handleAddClick}
                className="w-8 h-8 shrink-0 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 rounded-xl flex items-center justify-center transition-all shadow-md shadow-red-900/30"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            ) : hasVariants ? (
              <button
                onClick={() => onOpenDetail(item)}
                className="w-8 h-8 shrink-0 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl flex items-center justify-center"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[#DC2626]" />
              </button>
            ) : (
              <div className="flex items-center shrink-0 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl overflow-hidden">
                <button onClick={handleRemoveClick} className="w-7 h-7 flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all">
                  <Minus className="w-3 h-3 text-[#DC2626]" />
                </button>
                <span className="w-5 text-center text-xs font-black text-white">{totalQty}</span>
                <button onClick={handleAddClick} className="w-7 h-7 flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all">
                  <Plus className="w-3 h-3 text-[#DC2626]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── List card (horizontal) ────────────────────────────────────────── */
  return (
    <div className="item-card bg-[#181818] rounded-2xl overflow-hidden border border-white/6 fade-in flex">

      {/* Image — right side (RTL first child) */}
      <div
        className="relative shrink-0 w-28 self-stretch min-h-[108px] cursor-pointer"
        onClick={() => onOpenDetail(item)}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full bg-[#222] flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-white/10" />
          </div>
        )}

        {/* Offer badge */}
        {applicableOffers.length > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-[#DC2626] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg leading-none">
              {formatOfferLabel(applicableOffers[0])}
            </span>
          </div>
        )}

        {/* Cart qty badge */}
        {totalQty > 0 && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-black flex items-center justify-center shadow-lg">
            {totalQty}
          </div>
        )}

        {/* Size hint */}
        {hasVariants && (
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white/70 text-[9px] font-medium px-1.5 py-0.5 rounded-full">
            اختر الحجم
          </div>
        )}
      </div>

      {/* Content — left side */}
      <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-between">
        <div className="min-w-0">
          <h3
            className="font-bold text-white text-sm leading-snug cursor-pointer hover:text-white/90 transition-colors"
            onClick={() => onOpenDetail(item)}
          >
            {item.name}
          </h3>
          {item.description && (
            <p className="text-white/40 text-xs mt-1 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Price + action row */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex flex-col gap-0.5">
            {hasDiscount ? (
              <>
                <span className="text-white/35 text-xs line-through leading-none">
                  {hasVariants ? 'من ' : ''}{formatPrice(displayPrice, currencyCode)}
                </span>
                <span className="text-[#DC2626] font-black text-base leading-none">
                  {hasVariants ? 'من ' : ''}{formatPrice(discountedPrice, currencyCode)}
                </span>
              </>
            ) : (
              <span className="text-white font-black text-base leading-none">
                {hasVariants ? 'من ' : ''}{formatPrice(displayPrice, currencyCode)}
              </span>
            )}
          </div>

          {hasVariants ? (
            <button
              onClick={() => onOpenDetail(item)}
              className="flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-red-900/30"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              أضف للسلة
            </button>
          ) : totalQty === 0 ? (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-red-900/30"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              أضف للسلة
            </button>
          ) : (
            <div className="flex items-center gap-0 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl overflow-hidden">
              <button onClick={handleRemoveClick} className="w-9 h-9 flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all">
                <Minus className="w-3.5 h-3.5 text-[#DC2626]" />
              </button>
              <span className="w-7 text-center text-sm font-black text-white">{totalQty}</span>
              <button onClick={handleAddClick} className="w-9 h-9 flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all">
                <Plus className="w-3.5 h-3.5 text-[#DC2626]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
