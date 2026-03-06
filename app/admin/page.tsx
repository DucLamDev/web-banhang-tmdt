'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Users, MessageSquare, DollarSign, Eye, ArrowUpRight, Loader2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipping: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    user?: { fullName: string; email: string };
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') { router.push('/'); return; }
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { title: 'Tổng doanh thu', value: formatPrice(data?.totalRevenue || 0), icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { title: 'Tổng đơn hàng', value: String(data?.totalOrders || 0), icon: ShoppingCart, color: 'text-blue-600 bg-blue-100' },
    { title: 'Chờ xử lý', value: String(data?.pendingOrders || 0), icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    { title: 'Sản phẩm', value: String(data?.totalProducts || 0), icon: Package, color: 'text-purple-600 bg-purple-100' },
    { title: 'Khách hàng', value: String(data?.totalUsers || 0), icon: Users, color: 'text-orange-600 bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{stat.title}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-full ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Đơn hàng mới nhất</CardTitle>
              <Link href="/admin/don-hang" className="text-primary text-sm hover:underline flex items-center gap-1">
                Xem tất cả <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.recentOrders?.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Chưa có đơn hàng</p>}
                {data?.recentOrders?.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.user?.fullName || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary text-sm">{formatPrice(order.total)}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <Link href="/admin/san-pham" className="text-primary text-sm hover:underline flex items-center gap-1">
                Xem tất cả <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.topProducts?.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Chưa có dữ liệu</p>}
                {data?.topProducts?.map((product, idx) => (
                  <div key={product._id} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">Đã bán: {product.totalSold}</p>
                    </div>
                    <p className="font-semibold text-sm">{formatPrice(product.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

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
