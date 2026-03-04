'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  MapPin, 
  Menu,
  Phone,
  Laptop,
  Watch,
  Tablet,
  Headphones,
  MonitorSmartphone,
  CreditCard,
  Wrench,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore, useCartStore, useUIStore } from '@/lib/store';
import LoginModal from '@/components/auth/LoginModal';
import CartDrawer from '@/components/cart/CartDrawer';

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

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const { 
    isLoginModalOpen, 
    openLoginModal, 
    closeLoginModal,
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer 
  } = useUIStore();

  const cartItemCount = itemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-500 text-white text-center py-1 text-sm">
          <span>🎉 KHAI XUÂN NĂM MÃ - SĂN DEAL CỰC ĐÃ - GIẢM ĐẾN 50% 🎉</span>
        </div>

        {/* Main Header */}
        <div className="bg-primary">
          <div className="container-custom py-3">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image src="/logo.svg" alt="MiniShop" width={120} height={40} priority className="h-10 w-auto" />
              </Link>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Bạn tìm gì..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-2.5 rounded-lg bg-white border-0 focus:ring-2 focus:ring-white/50"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Search className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </form>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Login/User */}
                {isAuthenticated && user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      <User className="w-5 h-5" />
                      <span className="hidden md:block text-sm font-medium truncate max-w-24">
                        {user.fullName}
                      </span>
                      <ChevronDown className="w-4 h-4 hidden md:block" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {user.role === 'admin' && (
                        <>
                          <Link href="/admin" className="block px-4 py-2 hover:bg-gray-50 text-primary text-sm font-medium">
                            🔧 Quản trị Admin
                          </Link>
                          <hr className="my-1" />
                        </>
                      )}
                      <Link href="/tai-khoan" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                        Tài khoản của tôi
                      </Link>
                      <Link href="/don-hang" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                        Đơn hàng của tôi
                      </Link>
                      <Link href="/yeu-thich" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                        Sản phẩm yêu thích
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={openLoginModal}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium">Đăng nhập</span>
                  </button>
                )}

                {/* Cart */}
                <button 
                  onClick={openCartDrawer}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors relative"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-0.5 shadow-md">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">Giỏ hàng</span>
                </button>

                {/* Location */}
                <button className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Hồ Chí Minh</span>
                </button>

                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Navigation */}
          <nav className="hidden lg:block border-t border-primary-600">
            <div className="container-custom">
              <ul className="flex items-center gap-1 py-2 overflow-x-auto">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link 
                      href={`/danh-muc/${category.slug}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-b shadow-lg">
            <div className="container-custom py-4">
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link 
                      href={`/danh-muc/${category.slug}`}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <category.icon className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </>
  );
}
