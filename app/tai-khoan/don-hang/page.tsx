'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

const mockOrders = [
  {
    id: '1',
    orderNumber: 'TG17091234',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'delivered',
    total: 35020000,
    items: [
      { name: 'iPhone 16 Pro Max 256GB', variant: '256GB - Titan Đen', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png', quantity: 1, price: 34990000 },
    ]
  },
  {
    id: '2',
    orderNumber: 'TG17095678',
    createdAt: '2024-01-20T14:45:00Z',
    status: 'shipping',
    total: 6020000,
    items: [
      { name: 'AirPods Pro 2', variant: 'Trắng', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_170_1_.png', quantity: 1, price: 5990000 },
    ]
  },
  {
    id: '3',
    orderNumber: 'TG17099999',
    createdAt: '2024-01-22T09:15:00Z',
    status: 'pending',
    total: 30020000,
    items: [
      { name: 'Samsung Galaxy S24 Ultra', variant: '256GB - Xám', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-ultra_1__1.png', quantity: 1, price: 29990000 },
    ]
  },
];

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
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = activeTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(o => o.status === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/tai-khoan" className="text-gray-500 hover:text-primary">Tài khoản</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Đơn hàng</span>
        </nav>

        <div className="bg-white rounded-xl">
          {/* Tabs */}
          <div className="border-b px-4">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.value
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div className="divide-y">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Không có đơn hàng nào</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <div key={order.id} className="p-4">
                    {/* Order Header */}
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

                    {/* Order Items */}
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 mb-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <Image src={item.image} alt={item.name} width={80} height={80} className="object-contain" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.variant}</p>
                          <p className="text-sm">x{item.quantity}</p>
                        </div>
                        <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                      </div>
                    ))}

                    {/* Order Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-gray-500">Tổng tiền: </span>
                        <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
                      </div>
                      <Link href={`/don-hang/tra-cuu?order=${order.orderNumber}`}>
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
        </div>
      </div>
    </div>
  );
}
