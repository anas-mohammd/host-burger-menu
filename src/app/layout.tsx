import type { Metadata } from 'next';
import { Noto_Kufi_Arabic } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const arabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OrionMenu — قائمة المطعم',
  description: 'تفضل بتصفح قائمة مطعمنا وأرسل طلبك مباشرةً عبر واتساب',
  icons: { icon: [] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={arabic.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body className="min-h-screen bg-[#0f0f0f] text-white antialiased font-arabic" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1c1c1c',
              color: '#fff',
              border: '1px solid #2a2a2a',
              fontFamily: 'var(--font-arabic)',
              direction: 'rtl',
            },
          }}
        />
      </body>
    </html>
  );
}
