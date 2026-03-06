'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

const menuItems = [
  { icon: User, label: 'Thông tin tài khoản', href: '/tai-khoan', active: true },
  { icon: Package, label: 'Đơn hàng của tôi', href: '/tai-khoan/don-hang' },
  { icon: MapPin, label: 'Sổ địa chỉ', href: '/tai-khoan/dia-chi' },
  { icon: Heart, label: 'Sản phẩm yêu thích', href: '/tai-khoan/yeu-thich' },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleSave = () => {
    updateUser(form);
    setIsEditing(false);
    toast.success('Cập nhật thông tin thành công!');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Đăng xuất thành công!');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Tài khoản</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Sidebar - hidden on mobile (BottomNav handles nav) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Thông tin tài khoản</h1>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ tên</label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input value={form.email} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSave}>Lưu thay đổi</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                      <p className="font-medium">{user?.fullName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                      <p className="font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Loại tài khoản</p>
                      <p className="font-medium capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Mobile quick nav - shown only on mobile */}
        <div className="lg:hidden mt-4 bg-white rounded-xl p-3">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.filter(i => !i.active).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 border border-gray-100"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg border border-red-100 hover:bg-red-50 col-span-2"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
