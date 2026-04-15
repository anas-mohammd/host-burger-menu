'use client';

import { CartItem } from '@/types';
import { formatPrice } from '@/lib/currencies';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface Props {
  open: boolean;
  items: CartItem[];
  currencyCode: string;
  discountAmount?: number;
  onClose: () => void;
  onAdd: (itemId: string, variantName?: string) => void;
  onRemove: (itemId: string, variantName?: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.522 5.849L0 24l6.351-1.498A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.667-.502-5.198-1.381l-.373-.221-3.87.913.975-3.764-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

export default function CartDrawer({
  open, items, currencyCode, discountAmount = 0, onClose, onAdd, onRemove, onClear, onCheckout,
}: Props) {
  const effectivePrice = (ci: CartItem) => parseFloat(ci.variantPrice ?? ci.item.price);
  const rawTotal = items.reduce((sum, ci) => sum + effectivePrice(ci) * ci.quantity, 0);
  const total = rawTotal - discountAmount;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer — slides from RIGHT (RTL convention) */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-[#141414] border-l border-white/6 flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DC2626]/12 border border-[#DC2626]/15 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#DC2626]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">سلة الطلب</h2>
              {items.length > 0 && (
                <p className="text-[10px] text-white/35">
                  {items.length} {items.length === 1 ? 'صنف' : 'أصناف'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 text-xs text-white/25 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/8"
              >
                <Trash2 className="w-3 h-3" />
                مسح الكل
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/4 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-white/15" />
              </div>
              <div>
                <p className="text-white/35 text-sm font-semibold">السلة فارغة</p>
                <p className="text-white/20 text-xs mt-1">أضف بعض الأصناف لتبدأ طلبك</p>
              </div>
            </div>
          ) : (
            items.map((ci) => {
              const key = ci.variantName ? `${ci.item.id}::${ci.variantName}` : ci.item.id;
              const price = effectivePrice(ci);
              return (
                <div key={key} className="flex items-center gap-3 bg-white/4 hover:bg-white/6 rounded-2xl p-3 transition-colors">
                  {ci.item.image_url && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/6">
                      <Image
                        src={ci.item.image_url}
                        alt={ci.item.name}
                        width={56} height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold leading-snug truncate">{ci.item.name}</p>
                    {ci.variantName && (
                      <p className="text-white/35 text-[10px] mt-0.5">{ci.variantName}</p>
                    )}
                    <p className="text-white font-black text-sm mt-1">
                      {formatPrice(price * ci.quantity, currencyCode)}
                    </p>
                  </div>
                  {/* Qty controls */}
                  <div className="flex items-center gap-0 bg-white/6 rounded-xl overflow-hidden shrink-0">
                    <button
                      onClick={() => onRemove(ci.item.id, ci.variantName)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/8 active:scale-90 transition-all"
                    >
                      <Minus className="w-3 h-3 text-white/60" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-white">{ci.quantity}</span>
                    <button
                      onClick={() => onAdd(ci.item.id, ci.variantName)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/8 active:scale-90 transition-all"
                    >
                      <Plus className="w-3 h-3 text-[#DC2626]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-white/6 space-y-3 bg-[#0f0f0f]">
            {discountAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-white/35 text-xs">قبل الخصم</span>
                <span className="text-white/35 text-xs line-through">
                  {formatPrice(rawTotal, currencyCode)}
                </span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-green-400 text-xs font-semibold">الخصم المطبق</span>
                <span className="text-green-400 text-xs font-bold">
                  -{formatPrice(discountAmount, currencyCode)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="text-white/50 text-sm">الإجمالي</span>
              <span className="text-white font-black text-xl">
                {formatPrice(total, currencyCode)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="wa-pulse w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bc58] active:scale-98 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-900/30 text-sm"
            >
              <WhatsAppIcon className="w-4.5 h-4.5" />
              إرسال الطلب عبر واتساب
            </button>
          </div>
        )}
      </div>
    </>
  );
}
