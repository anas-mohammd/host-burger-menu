'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ReviewCreate, Restaurant } from '@/types';
import { menuApi } from '@/lib/api';
import { Star, Send, Loader2, X, Info, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  slug: string;
  cartVisible?: boolean;
  restaurant?: Restaurant;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="cursor-pointer"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                active ? 'fill-[#DC2626] text-[#DC2626]' : 'fill-transparent text-white/20'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.522 5.849L0 24l6.351-1.498A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.667-.502-5.198-1.381l-.373-.221-3.87.913.975-3.764-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

export default function ReviewSection({ slug, cartVisible = false, restaurant }: Props) {
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ReviewCreate>({ customer_name: '', rating: 0, comment: '' });

  const reviewBottom = cartVisible ? 88 : 24;
  const infoBottom = reviewBottom + 52 + 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast.error('يرجى اختيار عدد النجوم');
      return;
    }
    if (!form.customer_name.trim()) {
      toast.error('يرجى إدخال اسمك');
      return;
    }
    setSubmitting(true);
    try {
      await menuApi.submitReview(slug, {
        customer_name: form.customer_name,
        rating: form.rating,
        comment: form.comment || undefined,
      });
      toast.success('شكراً! تم إرسال تقييمك');
      setForm({ customer_name: '', rating: 0, comment: '' });
      setOpen(false);
    } catch {
      toast.error('تعذّر إرسال التقييم، حاول مجدداً');
    } finally {
      setSubmitting(false);
    }
  };

  const hasSocial = restaurant && (restaurant.whatsapp_number || restaurant.instagram_url || restaurant.phone_number);

  return (
    <>
      {/* Info FAB — above review button */}
      {restaurant && (
        <button
          onClick={() => setInfoOpen(true)}
          className="fixed right-4 z-40 rounded-full bg-[#1a1a1a] border border-white/10 hover:border-white/25 hover:bg-white/8 active:scale-95 text-white/40 hover:text-white/80 shadow-xl transition-all flex flex-col items-center justify-center gap-0.5"
          aria-label="معلومات المطعم"
          style={{
            width: '44px',
            height: '44px',
            bottom: `${infoBottom}px`,
            transition: 'bottom 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Info className="w-4 h-4" />
          <span className="text-[8px] font-bold leading-none">معلومات</span>
        </button>
      )}

      {/* Review FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 z-40 rounded-full bg-[#1a1a1a] border border-white/10 hover:border-[#DC2626]/40 hover:bg-[#DC2626]/10 active:scale-95 text-white/50 hover:text-[#DC2626] shadow-xl transition-all flex flex-col items-center justify-center gap-0.5"
        aria-label="أضف تقييمك"
        style={{
          width: '52px',
          height: '52px',
          bottom: `${reviewBottom}px`,
          transition: 'bottom 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Star className="w-5 h-5" />
        <span className="text-[9px] font-bold leading-none">تقييم</span>
      </button>

      {/* Info Modal */}
      {infoOpen && restaurant && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setInfoOpen(false); }}
        >
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-t-3xl pb-8 overflow-hidden">
            {/* Close bar */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-sm font-bold text-white/70">معلومات المطعم</h3>
              <button
                onClick={() => setInfoOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Logo */}
            {restaurant.logo_url && (
              <div className="flex justify-center pt-2 pb-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <Image
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </div>
            )}

            {/* Name */}
            <p className="text-center text-white font-black text-base px-5 mb-1">{restaurant.name}</p>

            {/* Description */}
            {restaurant.description && (
              <p className="text-center text-white/40 text-xs px-6 mb-5 leading-relaxed">
                {restaurant.description}
              </p>
            )}

            {/* Social links */}
            {hasSocial && (
              <div className="flex items-center justify-center gap-3 px-5 pt-2">
                {restaurant.whatsapp_number && (
                  <a
                    href={`https://wa.me/${restaurant.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 hover:bg-green-500/18 border border-green-500/15 text-green-400 text-xs font-semibold transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    واتساب
                  </a>
                )}
                {restaurant.instagram_url && (
                  <a
                    href={restaurant.instagram_url.startsWith('http') ? restaurant.instagram_url : `https://instagram.com/${restaurant.instagram_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 hover:bg-pink-500/18 border border-pink-500/15 text-pink-400 text-xs font-semibold transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    انستقرام
                  </a>
                )}
                {restaurant.phone_number && (
                  <a
                    href={`tel:${restaurant.phone_number}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/18 border border-blue-500/15 text-blue-400 text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    اتصال
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-t-3xl p-5 space-y-4 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-[#DC2626]" />
                أضف تقييمك
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Stars */}
              <div className="flex flex-col items-center gap-2 py-2">
                <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                <span className="text-xs text-white/30">
                  {form.rating === 0 ? 'اختر تقييمك' : ['', 'سيء', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'][form.rating]}
                </span>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs text-white/40">اسمك</label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="أحمد محمد"
                  maxLength={100}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#DC2626]/50"
                />
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="text-xs text-white/40">تعليق (اختياري)</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="شاركنا تجربتك..."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#DC2626]/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    إرسال التقييم
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
