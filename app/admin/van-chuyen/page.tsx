'use client';

import { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Phone, Clock, CheckCircle, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Chờ lấy hàng', color: 'bg-blue-100 text-blue-700' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
};

interface Order {
  _id: string;
  orderNumber: string;
  user?: { fullName: string; phone: string };
  shippingAddress?: { fullName: string; phone: string; province: string; district: string; ward: string; street: string };
  total: number;
  status: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export default function AdminShippingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders relevant to shipping: confirmed, shipping, delivered
      const results: Order[] = [];
      for (const status of ['confirmed', 'shipping', 'delivered']) {
        const res = await adminApi.getOrders({ status, limit: 50 });
        results.push(...(res.data.orders || []));
      }
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(results);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, { status: newStatus, note: `Cập nhật vận chuyển: ${statusConfig[newStatus]?.label}` });
      toast.success('Cập nhật trạng thái thành công!');
      fetchOrders();
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === 'all' || o.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const getAddress = (o: Order) => {
    const a = o.shippingAddress;
    if (!a) return 'N/A';
    return [a.street, a.ward, a.district, a.province].filter(Boolean).join(', ');
  };

  const stats = [
    { label: 'Tổng đơn vận chuyển', value: orders.length, icon: Package, color: 'text-blue-600 bg-blue-100' },
    { label: 'Đang giao', value: orders.filter(o => o.status === 'shipping').length, icon: Truck, color: 'text-purple-600 bg-purple-100' },
    { label: 'Đã giao', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { label: 'Chờ lấy hàng', value: orders.filter(o => o.status === 'confirmed').length, icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý vận chuyển</h1>
        <p className="text-gray-500">Theo dõi và quản lý đơn hàng đang vận chuyển</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm mã đơn, khách hàng..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={activeStatus} onChange={e => setActiveStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Đơn hàng</th>
                  <th className="text-left p-4 font-medium text-sm">Khách hàng</th>
                  <th className="text-left p-4 font-medium text-sm">Địa chỉ giao</th>
                  <th className="text-left p-4 font-medium text-sm">Tổng tiền</th>
                  <th className="text-left p-4 font-medium text-sm">Dự kiến giao</th>
                  <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-sm">#{o.orderNumber}</p>
                      <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-sm">{o.shippingAddress?.fullName || o.user?.fullName || 'N/A'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />{o.shippingAddress?.phone || o.user?.phone || 'N/A'}
                      </p>
                    </td>
                    <td className="p-4 max-w-[250px]">
                      <p className="text-sm text-gray-600 truncate flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                        {getAddress(o)}
                      </p>
                    </td>
                    <td className="p-4 font-semibold text-primary text-sm">{formatPrice(o.total)}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {o.estimatedDelivery ? new Date(o.estimatedDelivery).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="p-4">
                      <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border-0 font-medium cursor-pointer ${statusConfig[o.status]?.color || 'bg-gray-100'}`}>
                        {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">Không tìm thấy vận đơn nào</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
