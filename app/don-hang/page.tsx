'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Search, Eye, RotateCcw, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { orderApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
};

const tabs = ['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
const tabLabels: Record<string, string> = {
  all: 'Tất cả',
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{ name: string; thumbnail?: string; price: number; quantity: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress?: { fullName: string };
}

export default function MyOrdersPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) { setLoading(false); return; }
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.data.orders || res.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'all' || o.status === activeTab;
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-6">Đăng nhập để xem lịch sử đơn hàng của bạn</p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary-600">Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Đơn hàng của tôi</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Đơn hàng của tôi</h1>
                <p className="text-sm text-gray-500 mt-1">Xin chào, {user?.fullName}</p>
              </div>
              <Link href="/don-hang/tra-cuu">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Tra cứu đơn hàng
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 whitespace-nowrap text-sm border-b-2 transition-colors ${
                  activeTab === tab ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tabLabels[tab]}
                <span className="ml-1 text-xs text-gray-400">
                  ({tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length})
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm theo mã đơn hàng..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Orders */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="font-medium text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-sm text-gray-400 mb-6">Hãy mua sắm ngay để có đơn hàng đầu tiên!</p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary-600">Mua sắm ngay</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map(order => (
                <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary text-lg">{formatPrice(order.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-2 mb-4">
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-contain p-1 rounded-lg" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="text-gray-500">x{item.quantity} · {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="text-sm text-gray-400">+{order.items.length - 2} sản phẩm khác</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/don-hang/${order._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </Button>
                    </Link>
                    {order.status === 'pending' && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Hủy đơn
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-600">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Mua lại
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
