'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Package,
  User,
  X,
  Phone,
  Laptop,
  Watch,
  Tablet,
  Headphones,
  MonitorSmartphone,
  CreditCard,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '@/lib/store';

const categories = [
  { name: 'Điện thoại', slug: 'dien-thoai', icon: Phone },
  { name: 'Laptop', slug: 'laptop', icon: Laptop },
  { name: 'Phụ kiện', slug: 'phu-kien', icon: Headphones },
  { name: 'Smartwatch', slug: 'smartwatch', icon: Watch },
  { name: 'Đồng hồ', slug: 'dong-ho', icon: Watch },
  { name: 'Tablet', slug: 'tablet', icon: Tablet },
  { name: 'Máy cũ, Thu cũ', slug: 'may-cu', icon: MonitorSmartphone },
  { name: 'Màn hình, Máy in', slug: 'man-hinh', icon: MonitorSmartphone },
  { name: 'Sim, Thẻ cào', slug: 'sim-the-cao', icon: CreditCard },
  { name: 'Dịch vụ tiện ích', slug: 'dich-vu', icon: Wrench },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const { itemCount } = useCartStore();
  const { openCartDrawer, openLoginModal } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setShowCategories(false);
  }, [pathname]);

  if (!mounted) return null;
  if (pathname?.startsWith('/admin')) return null;

  const cartCount = itemCount();
  const isHome = pathname === '/';
  const isCat = pathname?.startsWith('/danh-muc') || pathname?.startsWith('/san-pham') || pathname?.startsWith('/tim-kiem');
  const isOrders = pathname?.startsWith('/don-hang');
  const isAccount = pathname?.startsWith('/tai-khoan') || pathname?.startsWith('/yeu-thich');

  return (
    <>
      {/* Categories sheet */}
      {showCategories && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCategories(false)}
          />
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Danh mục sản phẩm</h3>
              <button
                onClick={() => setShowCategories(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pb-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/danh-muc/${cat.slug}`}
                  onClick={() => setShowCategories(false)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 active:scale-95 transition-all"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 leading-tight flex-1">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch h-16">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
              isHome ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isHome ? 'bg-primary/10' : ''}`}>
              <Home className="w-[22px] h-[22px]" />
            </div>
            <span className={`text-[10px] font-medium ${isHome ? 'text-primary' : 'text-gray-400'}`}>
              Trang chủ
            </span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => setShowCategories(true)}
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
              isCat ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isCat ? 'bg-primary/10' : ''}`}>
              <LayoutGrid className="w-[22px] h-[22px]" />
            </div>
            <span className={`text-[10px] font-medium ${isCat ? 'text-primary' : 'text-gray-400'}`}>
              Danh mục
            </span>
          </button>

          {/* Cart - center featured */}
          <button
            onClick={openCartDrawer}
            className="flex flex-col items-center justify-center flex-1 gap-0.5 relative"
          >
            <div className="relative w-12 h-12 -mt-4 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-white">
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-0.5 border border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-400 mt-0.5">Giỏ hàng</span>
          </button>

          {/* Orders */}
          <Link
            href={isAuthenticated ? '/don-hang' : '#'}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                openLoginModal();
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
              isOrders ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isOrders ? 'bg-primary/10' : ''}`}>
              <Package className="w-[22px] h-[22px]" />
            </div>
            <span className={`text-[10px] font-medium ${isOrders ? 'text-primary' : 'text-gray-400'}`}>
              Đơn hàng
            </span>
          </Link>

          {/* Account */}
          <Link
            href={isAuthenticated ? '/tai-khoan' : '#'}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                openLoginModal();
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
              isAccount ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isAccount ? 'bg-primary/10' : ''}`}>
              <User className="w-[22px] h-[22px]" />
            </div>
            <span className={`text-[10px] font-medium ${isAccount ? 'text-primary' : 'text-gray-400'}`}>
              Tài khoản
            </span>
          </Link>
        </div>

        {/* iOS safe area */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white" />
      </nav>
    </>
  );
}
