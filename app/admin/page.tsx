'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Users, MessageSquare, TrendingUp, DollarSign, Eye, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

const stats = [
  { title: 'Tổng doanh thu', value: '₫2.5B', change: '+12%', icon: DollarSign, color: 'text-green-600 bg-green-100' },
  { title: 'Đơn hàng mới', value: '156', change: '+8%', icon: ShoppingCart, color: 'text-blue-600 bg-blue-100' },
  { title: 'Sản phẩm', value: '1,234', change: '+5%', icon: Package, color: 'text-purple-600 bg-purple-100' },
  { title: 'Khách hàng', value: '8,549', change: '+15%', icon: Users, color: 'text-orange-600 bg-orange-100' },
];

const recentOrders = [
  { id: 'TG17091234', customer: 'Nguyễn Văn A', total: 34990000, status: 'pending', date: '2024-01-22' },
  { id: 'TG17091235', customer: 'Trần Thị B', total: 29990000, status: 'shipping', date: '2024-01-22' },
  { id: 'TG17091236', customer: 'Lê Văn C', total: 5990000, status: 'delivered', date: '2024-01-21' },
  { id: 'TG17091237', customer: 'Phạm Thị D', total: 49990000, status: 'confirmed', date: '2024-01-21' },
];

const topProducts = [
  { name: 'iPhone 16 Pro Max', sold: 156, revenue: 5458440000 },
  { name: 'Samsung Galaxy S24 Ultra', sold: 98, revenue: 2939020000 },
  { name: 'MacBook Pro 14 M3', sold: 45, revenue: 2249550000 },
  { name: 'AirPods Pro 2', sold: 234, revenue: 1401660000 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipping: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Chào mừng trở lại, {user?.fullName}</p>
          </div>
          <Link href="/" className="text-primary hover:underline flex items-center gap-1">
            <Eye className="w-4 h-4" />
            Xem trang chủ
          </Link>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change} so với tháng trước
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Đơn hàng mới</CardTitle>
              <Link href="/admin/don-hang" className="text-primary text-sm hover:underline flex items-center gap-1">
                Xem tất cả <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <Link href="/admin/san-pham" className="text-primary text-sm hover:underline flex items-center gap-1">
                Xem tất cả <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div key={product.name} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Đã bán: {product.sold}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(product.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Link href="/admin/san-pham" className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Sản phẩm</p>
              <p className="text-sm text-gray-500">Quản lý</p>
            </div>
          </Link>
          <Link href="/admin/don-hang" className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-medium">Đơn hàng</p>
              <p className="text-sm text-gray-500">Quản lý</p>
            </div>
          </Link>
          <Link href="/admin/khach-hang" className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-500" />
            <div>
              <p className="font-medium">Khách hàng</p>
              <p className="text-sm text-gray-500">Quản lý</p>
            </div>
          </Link>
          <Link href="/admin/chat" className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-medium">Chat</p>
              <p className="text-sm text-gray-500">Hỗ trợ</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
