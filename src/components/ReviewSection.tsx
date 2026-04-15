'use client';

import { useState } from 'react';
import { ReviewCreate } from '@/types';
import { menuApi } from '@/lib/api';
import { Star, Send, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  slug: string;
  cartVisible?: boolean;
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

export default function ReviewSection({ slug, cartVisible = false }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ReviewCreate>({ customer_name: '', rating: 0, comment: '' });

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

  return (
    <>
      {/* Floating FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 z-40 rounded-full bg-[#1a1a1a] border border-white/10 hover:border-[#DC2626]/40 hover:bg-[#DC2626]/10 active:scale-95 text-white/50 hover:text-[#DC2626] shadow-xl transition-all flex flex-col items-center justify-center gap-0.5"
        aria-label="أضف تقييمك"
        style={{
          width: '52px',
          height: '52px',
          bottom: cartVisible ? '88px' : '24px',
          transition: 'bottom 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Star className="w-5 h-5" />
        <span className="text-[9px] font-bold leading-none">تقييم</span>
      </button>

      {/* Modal overlay */}
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
