'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, 
  Settings, ChevronLeft, Menu, LogOut, Tag, Image as ImageIcon
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Sản phẩm', href: '/admin/san-pham' },
  { icon: Tag, label: 'Danh mục', href: '/admin/danh-muc' },
  { icon: ShoppingCart, label: 'Đơn hàng', href: '/admin/don-hang' },
  { icon: Users, label: 'Khách hàng', href: '/admin/khach-hang' },
  { icon: ImageIcon, label: 'Banner', href: '/admin/banner' },
  { icon: MessageSquare, label: 'Chat', href: '/admin/chat' },
  { icon: Settings, label: 'Cài đặt', href: '/admin/cai-dat' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!collapsed && <span className="font-bold text-xl">TGDD Admin</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-800 rounded-lg">
            {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
