'use client';

import { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

const mockOrders = [
  { id: 'TG17091234', customer: 'Nguyễn Văn A', phone: '0901234567', total: 34990000, status: 'pending', date: '2024-01-22 10:30', items: 1 },
  { id: 'TG17091235', customer: 'Trần Thị B', phone: '0909876543', total: 29990000, status: 'confirmed', date: '2024-01-22 09:15', items: 1 },
  { id: 'TG17091236', customer: 'Lê Văn C', phone: '0912345678', total: 5990000, status: 'shipping', date: '2024-01-21 16:45', items: 1 },
  { id: 'TG17091237', customer: 'Phạm Thị D', phone: '0923456789', total: 49990000, status: 'delivered', date: '2024-01-21 14:20', items: 2 },
  { id: 'TG17091238', customer: 'Hoàng Văn E', phone: '0934567890', total: 21990000, status: 'cancelled', date: '2024-01-20 11:00', items: 1 },
];

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

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = mockOrders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                        o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === 'all' || o.status === activeTab;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log('Update order', orderId, 'to', newStatus);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-gray-500">Tổng cộng {mockOrders.length} đơn hàng</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl mb-6">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-primary text-primary font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabLabels[tab]}
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {tab === 'all' ? mockOrders.length : mockOrders.filter(o => o.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm theo mã đơn hàng, tên khách hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">Mã đơn hàng</th>
              <th className="text-left p-4 font-medium">Khách hàng</th>
              <th className="text-left p-4 font-medium">Số SP</th>
              <th className="text-left p-4 font-medium">Tổng tiền</th>
              <th className="text-left p-4 font-medium">Trạng thái</th>
              <th className="text-left p-4 font-medium">Ngày đặt</th>
              <th className="text-right p-4 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">#{order.id}</td>
                <td className="p-4">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </div>
                </td>
                <td className="p-4">{order.items}</td>
                <td className="p-4 font-semibold text-primary">{formatPrice(order.total)}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-sm px-3 py-1 rounded-full border-0 ${statusConfig[order.status].color}`}
                  >
                    {Object.entries(statusConfig).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-gray-600">{order.date}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Chi tiết
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
}
