'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { menuApi } from '@/lib/api';
import { getCurrencySymbol } from '@/lib/currencies';
import { CartItem, MenuItem, PublicMenuResponse } from '@/types';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import MenuItemCard from '@/components/MenuItemCard';
import CartDrawer from '@/components/CartDrawer';
import OrderModal from '@/components/OrderModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import ReviewSection from '@/components/ReviewSection';
import SplashScreen from '@/components/SplashScreen';
import toast from 'react-hot-toast';
import { UtensilsCrossed, ShoppingCart } from 'lucide-react';


export default function MenuPageContent() {
  const { slug } = useParams<{ slug: string }>();

  const [data, setData] = useState<PublicMenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [splashDone, setSplashDone] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  // Product detail modal state
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Active category (for sticky nav highlight)
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});
  const scrollLock = useRef(false);

  // ── Load menu ────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viewMode') as 'list' | 'grid' | null;
      if (saved) setViewMode(saved);
    } catch {}
    menuApi.getMenu(slug)
      .then((d) => {
        setData(d);
        setActiveCatId(d.categories[0]?.id ?? null);
      })
      .catch(() => setError('تعذّر تحميل القائمة. تحقق من الرابط أو حاول مجدداً.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Intersection observer for active category ────────────────────────────
  useEffect(() => {
    if (!data) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (scrollLock.current) return;
        for (const e of entries) {
          if (e.isIntersecting) setActiveCatId(e.target.id.replace('cat-', ''));
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    Object.values(sectionRefs.current).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [data]);

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const cartKey = (itemId: string, variantName?: string) =>
    variantName ? `${itemId}::${variantName}` : itemId;

  const addToCart = useCallback((item: MenuItem, variantName?: string, variantPrice?: string) => {
    setCart((prev) => {
      const key = cartKey(item.id, variantName);
      const existing = prev.find((ci) => cartKey(ci.item.id, ci.variantName) === key);
      if (existing) {
        return prev.map((ci) =>
          cartKey(ci.item.id, ci.variantName) === key
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { item, quantity: 1, variantName, variantPrice }];
    });
  }, []);

  const addByKeyToCart = useCallback((itemId: string, variantName?: string) => {
    setCart((prev) => {
      const key = cartKey(itemId, variantName);
      return prev.map((ci) =>
        cartKey(ci.item.id, ci.variantName) === key
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      );
    });
  }, []);

  const removeFromCart = useCallback((itemId: string, variantName?: string) => {
    setCart((prev) => {
      const key = cartKey(itemId, variantName);
      const existing = prev.find((ci) => cartKey(ci.item.id, ci.variantName) === key);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((ci) => cartKey(ci.item.id, ci.variantName) !== key);
      return prev.map((ci) =>
        cartKey(ci.item.id, ci.variantName) === key
          ? { ...ci, quantity: ci.quantity - 1 }
          : ci
      );
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, ci) => s + ci.quantity, 0);

  const itemEffectivePrice = (ci: CartItem) =>
    parseFloat(ci.variantPrice ?? ci.item.price);

  const cartRawTotal = cart.reduce((s, ci) => s + itemEffectivePrice(ci) * ci.quantity, 0);

  const cartDiscount = (() => {
    if (!data?.offers.length) return 0;
    let discount = 0;
    for (const offer of data.offers) {
      const discValue = parseFloat(offer.discount_value);
      if (offer.applicable_items.length === 0) {
        discount += offer.discount_type === 'percentage'
          ? cartRawTotal * discValue / 100
          : Math.min(discValue, cartRawTotal);
      } else {
        const applicable = new Set(offer.applicable_items);
        const base = cart
          .filter((ci) => applicable.has(ci.item.id))
          .reduce((s, ci) => s + itemEffectivePrice(ci) * ci.quantity, 0);
        discount += offer.discount_type === 'percentage'
          ? base * discValue / 100
          : Math.min(discValue, base);
      }
    }
    return Math.min(discount, cartRawTotal);
  })();

  const cartTotal = cartRawTotal - cartDiscount;

  // ── Category nav click ────────────────────────────────────────────────────
  const scrollToCategory = (catId: string) => {
    setActiveCatId(catId);
    scrollLock.current = true;
    sectionRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { scrollLock.current = false; }, 800);
  };

  // ── Product detail modal ──────────────────────────────────────────────────
  const openDetail = useCallback((item: MenuItem) => {
    setDetailItem(item);
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setTimeout(() => setDetailItem(null), 350);
  }, []);

  // ── Place order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async (payload: Parameters<typeof menuApi.placeOrder>[1]) => {
    try {
      const result = await menuApi.placeOrder(slug, payload);
      setOrderOpen(false);
      setCartOpen(false);
      clearCart();
      toast.success('تم إنشاء طلبك! سيتم فتح واتساب الآن...');
      setTimeout(() => window.open(result.whatsapp_link, '_blank'), 500);
    } catch {
      toast.error('حدث خطأ أثناء إرسال الطلب، حاول مجدداً');
      throw new Error('order failed');
    }
  };

  // ── Render states ─────────────────────────────────────────────────────────
  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white/30"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
          <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(-6px);opacity:1}}`}</style>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8 text-white/15" />
        </div>
        <h2 className="text-white font-bold text-lg">مطعم غير موجود</h2>
        <p className="text-white/30 text-sm">{error ?? 'تحقق من الرابط وحاول مجدداً'}</p>
      </div>
    );
  }

  const { restaurant, categories, items, offers } = data;
  const currencyCode = restaurant.currency_code || 'IQD';
  const currencySymbol = getCurrencySymbol(currencyCode);
  return (
    <>
      <Header restaurant={restaurant} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <CategoryNav
        categories={categories}
        activeId={activeCatId}
        viewMode={viewMode}
        onSelect={scrollToCategory}
        onViewChange={(mode) => { setViewMode(mode); try { localStorage.setItem('viewMode', mode); } catch {} }}
      />

      <main className="max-w-3xl mx-auto px-4 pb-32 pt-5 space-y-10">

        {/* Menu sections */}
        {categories.map((cat) => {
          const catItems = items.filter((it) => it.category_id === cat.id);
          if (!catItems.length) return null;
          return (
            <section
              key={cat.id}
              id={`cat-${cat.id}`}
              ref={(el) => { if (el) sectionRefs.current[cat.id] = el; }}
              className="scroll-mt-28"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] shrink-0">
                  {cat.name}
                </h2>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              {cat.description && (
                <p className="text-white/25 text-xs mb-5 -mt-3 text-center">{cat.description}</p>
              )}

              {/* Items grid */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-4'}>
                {catItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    currencyCode={currencyCode}
                    cart={cart}
                    offers={offers}
                    compact={viewMode === 'grid'}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                    onOpenDetail={openDetail}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating review FAB */}
      <ReviewSection slug={slug} cartVisible={cartCount > 0 && !cartOpen && !detailOpen} restaurant={restaurant} />

      {/* Floating cart button */}
      {cartCount > 0 && !cartOpen && !detailOpen && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-40 px-4">
          <button
            onClick={() => setCartOpen(true)}
            className="slide-up flex items-center gap-3 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white font-black px-5 py-4 rounded-2xl shadow-xl shadow-red-900/40 transition-all max-w-sm w-full justify-between"
          >
            <span className="flex items-center justify-center w-7 h-7 bg-white/15 rounded-xl text-xs font-black">
              {cartCount}
            </span>
            <span className="text-sm">عرض سلة الطلب</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black">{cartTotal.toFixed(0)} {currencySymbol}</span>
              <ShoppingCart className="w-4 h-4 opacity-70" />
            </div>
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={detailItem}
        open={detailOpen}
        currencyCode={currencyCode}
        cart={cart}
        onClose={closeDetail}
        onAdd={addToCart}
        onRemove={removeFromCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        items={cart}
        currencyCode={currencyCode}
        discountAmount={cartDiscount}
        onClose={() => setCartOpen(false)}
        onAdd={(itemId, variantName) => addByKeyToCart(itemId, variantName)}
        onRemove={(itemId, variantName) => removeFromCart(itemId, variantName)}
        onClear={clearCart}
        onCheckout={() => { setCartOpen(false); setOrderOpen(true); }}
      />

      {/* Order Modal */}
      <OrderModal
        open={orderOpen}
        items={cart}
        currencyCode={currencyCode}
        total={cartTotal}
        discountAmount={cartDiscount}
        onClose={() => setOrderOpen(false)}
        onSubmit={handlePlaceOrder}
      />
    </>
  );
}
