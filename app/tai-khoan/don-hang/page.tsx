'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Eye, Clock, CheckCircle, Truck, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { orderApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{className?: string}> }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  shipping: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const tabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

interface OrderItem {
  name: string;
  thumbnail?: string;
  variant?: { name?: string; color?: string; storage?: string };
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    const fetchOrders = async () => {
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

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/tai-khoan" className="text-gray-500 hover:text-primary">Tài khoản</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Đơn hàng</span>
        </nav>

        <div className="bg-white rounded-xl">
          <div className="border-b px-4">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                  className={`py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.value ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                  <span className="ml-1 text-xs text-gray-400">
                    ({tab.value === 'all' ? orders.length : orders.filter(o => o.status === tab.value).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="divide-y">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Không có đơn hàng nào</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700', icon: Package };
                  const StatusIcon = status.icon;
                  return (
                    <div key={order._id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">#{order.orderNumber}</span>
                          <Badge className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 mb-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={item.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <Package className="w-8 h-8 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.variant?.storage && item.variant.storage}{item.variant?.color && ` - ${item.variant.color}`}
                            </p>
                            <p className="text-sm">x{item.quantity}</p>
                          </div>
                          <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-gray-500">Tổng tiền: </span>
                          <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
                        </div>
                        <Link href={`/don-hang/${order._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
