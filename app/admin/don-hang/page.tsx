'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Đang xử lý', color: 'bg-cyan-100 text-cyan-700' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
};

const tabs = ['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
const tabLabels: Record<string, string> = {
  all: 'Tất cả', pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận',
  shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy',
};

interface Order {
  _id: string;
  orderNumber: string;
  user?: { fullName: string; email: string; phone: string };
  items: Array<{ name: string; quantity: number }>;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (activeTab !== 'all') params.status = activeTab;
      const res = await adminApi.getOrders(params);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [activeTab, page]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, { status: newStatus, note: `Admin cập nhật trạng thái: ${statusConfig[newStatus]?.label}` });
      toast.success('Cập nhật trạng thái thành công!');
      fetchOrders();
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const filtered = orders.filter(o => {
    if (!search) return true;
    const s = search.toLowerCase();
    return o.orderNumber?.toLowerCase().includes(s) || o.user?.fullName?.toLowerCase().includes(s) || o.user?.phone?.includes(s);
  });
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-gray-500">Tổng cộng {total} đơn hàng</p>
      </div>

      <div className="bg-white rounded-xl mb-6">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`px-6 py-3 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm theo mã đơn, tên, SĐT..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Mã đơn hàng</th>
                  <th className="text-left p-4 font-medium text-sm">Khách hàng</th>
                  <th className="text-left p-4 font-medium text-sm">Số SP</th>
                  <th className="text-left p-4 font-medium text-sm">Tổng tiền</th>
                  <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
                  <th className="text-left p-4 font-medium text-sm">Ngày đặt</th>
                  <th className="text-right p-4 font-medium text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-sm">#{order.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-medium text-sm">{order.user?.fullName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.user?.phone || order.user?.email || ''}</p>
                    </td>
                    <td className="p-4 text-sm">{order.items?.length || 0}</td>
                    <td className="p-4 font-semibold text-primary text-sm">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border-0 cursor-pointer ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                        {Object.entries(statusConfig).map(([value, { label }]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">Không tìm thấy đơn hàng nào</div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-t">
                <p className="text-sm text-gray-500">Trang {page}/{totalPages} · {total} đơn hàng</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</Button>
                  <div className="flex items-center gap-1 flex-wrap">
                    {pageNumbers.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNumber)}
                        className="min-w-9"
                      >
                        {pageNumber}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
