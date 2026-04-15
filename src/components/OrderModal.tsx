'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { CartItem, OrderPayload } from '@/types';
import { formatPrice } from '@/lib/currencies';
import { X, MessageCircle, User, Phone, FileText, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  items: CartItem[];
  currencyCode: string;
  total: number;
  discountAmount?: number;
  onClose: () => void;
  onSubmit: (payload: OrderPayload) => Promise<void>;
}

export default function OrderModal({ open, items, currencyCode, total, discountAmount = 0, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    if (phone.trim().length < 7) {
      toast.error('رقم الجوال يجب أن يتكون من 7 أرقام على الأقل');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        items: items.map((ci) => ({
          item_id: ci.item.id,
          quantity: ci.quantity,
          ...(ci.variantName ? { variant_name: ci.variantName } : {}),
        })),
        notes: notes.trim() || undefined,
      });
      setName(''); setPhone(''); setNotes('');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-60 slide-up">
        <div className="bg-[#1a1a1a] rounded-t-3xl border-t border-white/10 max-w-lg mx-auto px-5 py-6">

          {/* Handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

          {/* Title */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white">تفاصيل الطلب</h2>
              <p className="text-white/40 text-xs mt-0.5">سيُرسَل طلبك عبر واتساب</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Order summary */}
          <div className="bg-white/5 rounded-2xl p-3 mb-5 space-y-1.5">
            {items.map((ci) => {
              const price = parseFloat(ci.variantPrice ?? ci.item.price);
              const key = ci.variantName ? `${ci.item.id}::${ci.variantName}` : ci.item.id;
              return (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-white/70">
                    {ci.item.name}{ci.variantName ? ` (${ci.variantName})` : ''} × {ci.quantity}
                  </span>
                  <span className="text-white/50">
                    {formatPrice(price * ci.quantity, currencyCode)}
                  </span>
                </div>
              );
            })}
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-green-400">
                <span>الخصم</span>
                <span>-{formatPrice(discountAmount, currencyCode)}</span>
              </div>
            )}
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-between">
              <span className="text-white/60 text-sm font-medium">الإجمالي</span>
              <div className="text-right">
                {discountAmount > 0 && (
                  <span className="text-white/30 text-xs line-through block">
                    {formatPrice(total + discountAmount, currencyCode)}
                  </span>
                )}
                <span className="text-amber-400 font-bold text-sm">
                  {formatPrice(total, currencyCode)}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="الاسم الكامل *"
                value={name}
                onChange={(e) => { e.target.setCustomValidity(''); setName(e.target.value); }}
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('يرجى إدخال اسمك')}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#DC2626]/50 focus:ring-1 focus:ring-[#DC2626]/15 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="tel"
                placeholder="رقم الجوال *"
                value={phone}
                onChange={(e) => { e.target.setCustomValidity(''); setPhone(e.target.value); }}
                onInvalid={(e) => {
                  const el = e.target as HTMLInputElement;
                  if (el.validity.valueMissing) {
                    el.setCustomValidity('يرجى إدخال رقم الجوال');
                  } else if (el.validity.tooShort) {
                    el.setCustomValidity(`رقم الجوال يجب أن يتكون من 7 أرقام على الأقل (أدخلت ${el.value.length} أرقام)`);
                  }
                }}
                required
                minLength={7}
                dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#DC2626]/50 focus:ring-1 focus:ring-[#DC2626]/15 transition-all text-right"
              />
            </div>

            {/* Notes */}
            <div className="relative">
              <FileText className="absolute right-3 top-3.5 w-4 h-4 text-white/30" />
              <textarea
                placeholder="ملاحظات إضافية (اختياري)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#DC2626]/50 focus:ring-1 focus:ring-[#DC2626]/15 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bc58] active:scale-98 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-500/20 text-sm disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4" />
              )}
              {loading ? 'جاري الإرسال...' : 'أرسل الطلب عبر واتساب'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
