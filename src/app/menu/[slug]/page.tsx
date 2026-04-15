import MenuPageContent from '@/components/MenuPageContent';

// قائمة المطاعم — أضف slug كل مطعم جديد هنا أو عبر متغير البيئة
export function generateStaticParams() {
  const env = process.env.NEXT_PUBLIC_RESTAURANT_SLUGS ?? 'host-burger';
  const slugs = env.split(',').map((s) => s.trim()).filter(Boolean);
  return slugs.map((slug) => ({ slug }));
}

export default function Page() {
  return <MenuPageContent />;
}
