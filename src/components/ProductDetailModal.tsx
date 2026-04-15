'use client';

import { useState, useEffect } from 'react';
import { MenuItem, CartItem, ItemVariant } from '@/types';
import { formatPrice } from '@/lib/currencies';
import Image from 'next/image';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';

interface Props {
  item: MenuItem | null;
  open: boolean;
  currencyCode: string;
  cart: CartItem[];
  onClose: () => void;
  onAdd: (item: MenuItem, variantName?: string, variantPrice?: string) => void;
  onRemove: (itemId: string, variantName?: string) => void;
}

export default function ProductDetailModal({
  item, open, currencyCode, cart, onClose, onAdd, onRemove,
}: Props) {
  const hasVariants = !!item?.variants?.length;
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);

  // Reset selected variant when item changes
  useEffect(() => {
    if (item && hasVariants) {
      setSelectedVariant(item.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [item]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!item) return null;

  const cartKey = selectedVariant
    ? `${item.id}::${selectedVariant.name}`
    : item.id;
  const cartItem = cart.find((ci) =>
    (ci.variantName ? `${ci.item.id}::${ci.variantName}` : ci.item.id) === cartKey
  );
  const qty = cartItem?.quantity ?? 0;

  const displayPrice = selectedVariant ? selectedVariant.price : item.price;

  const handleAdd = () => {
    onAdd(item, selectedVariant?.name, selectedVariant?.price);
  };

  const handleRemove = () => {
    onRemove(item.id, selectedVariant?.name);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto backdrop-in' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white rounded-t-3xl max-w-lg mx-auto overflow-hidden max-h-[90vh] flex flex-col">

          {/* Product image */}
          <div className="relative w-full shrink-0" style={{ aspectRatio: '16/9' }}>
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-300" />
              </div>
            )}

            {/* Close button overlaid on image */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1">
            <div className="px-5 pt-5 pb-6 space-y-4">

              {/* Name + price */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black text-gray-900 leading-snug flex-1">
                  {item.name}
                </h2>
                <div className="shrink-0 text-left">
                  <p className="text-xl font-black text-[#DC2626]">
                    {formatPrice(displayPrice, currencyCode)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Divider */}
              {hasVariants && <div className="h-px bg-gray-100" />}

              {/* Variant selector */}
              {hasVariants && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">الحجم / النوع</p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">اختياري</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.variants.map((v) => {
                      const isSelected = selectedVariant?.name === v.name;
                      return (
                        <button
                          key={v.name}
                          onClick={() => setSelectedVariant(v)}
                          className={`flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-150 ${
                            isSelected
                              ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-md shadow-red-200'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xs font-bold leading-none">{v.name}</span>
                          <span className={`text-[10px] leading-none mt-0.5 ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                            {formatPrice(v.price, currencyCode)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer — fixed add/remove */}
          <div className="px-5 py-4 border-t border-gray-100 bg-white shrink-0">
            {qty === 0 ? (
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2.5 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-98 text-white font-black text-sm py-4 rounded-2xl transition-all shadow-lg shadow-red-200"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                أضف للسلة — {formatPrice(displayPrice, currencyCode)}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0 bg-gray-100 rounded-2xl overflow-hidden flex-1">
                  <button
                    onClick={handleRemove}
                    className="flex-1 h-12 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="w-10 text-center text-lg font-black text-gray-900">{qty}</span>
                  <button
                    onClick={handleAdd}
                    className="flex-1 h-12 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white font-black text-sm rounded-2xl transition-all shadow-md shadow-red-200"
                >
                  <ShoppingCart className="w-4 h-4" />
                  تم
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
