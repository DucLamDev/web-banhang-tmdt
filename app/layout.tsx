import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ChatWidget from '@/components/chat/ChatWidget';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'MiniShop - Điện thoại, Laptop, Tablet, Phụ kiện chính hãng',
  description: 'MiniShop - Hệ thống bán lẻ điện thoại, laptop, tablet, phụ kiện chính hãng giá tốt nhất',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'MiniShop' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2AACA7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 bg-background pb-16 md:pb-0">
            {children}
          </main>
          <div className="hidden md:block">
            <Footer />
          </div>
          <BottomNav />
          <ChatWidget />
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
