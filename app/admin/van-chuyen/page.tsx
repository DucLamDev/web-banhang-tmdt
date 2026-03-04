'use client';

import { useState } from 'react';
import { Truck, Package, MapPin, Phone, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

const mockShipments = [
  { id: 'SH001', orderNumber: 'MS17091234', customer: 'Nguyễn Văn A', phone: '0901234567', address: '123 Nguyễn Huệ, Q1, TP.HCM', total: 34990000, carrier: 'GHN', trackingCode: 'GHN123456789', status: 'shipping', estimatedDate: '2024-01-24', assignedTo: 'Tài xế Minh' },
  { id: 'SH002', orderNumber: 'MS17091235', customer: 'Trần Thị B', phone: '0909876543', address: '456 Lê Lợi, Q3, TP.HCM', total: 29990000, carrier: 'GHTK', trackingCode: 'GHTK987654321', status: 'delivered', estimatedDate: '2024-01-23', assignedTo: 'Tài xế Hùng' },
  { id: 'SH003', orderNumber: 'MS17091236', customer: 'Lê Văn C', phone: '0912345678', address: '789 Võ Văn Tần, Q3, TP.HCM', total: 5990000, carrier: 'GHN', trackingCode: 'GHN111222333', status: 'pending', estimatedDate: '2024-01-25', assignedTo: '' },
  { id: 'SH004', orderNumber: 'MS17091237', customer: 'Phạm Thị D', phone: '0923456789', address: '321 Điện Biên Phủ, Q10, TP.HCM', total: 49990000, carrier: 'Viettel Post', trackingCode: 'VTP444555666', status: 'confirmed', estimatedDate: '2024-01-25', assignedTo: 'Tài xế Nam' },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  pending: { label: 'Chờ lấy hàng', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

const carriers = ['Tất cả', 'GHN', 'GHTK', 'Viettel Post', 'J&T Express'];

export default function AdminShippingPage() {
  const [search, setSearch] = useState('');
  const [activeCarrier, setActiveCarrier] = useState('Tất cả');
  const [activeStatus, setActiveStatus] = useState('all');

  const filtered = mockShipments.filter(s => {
    const matchSearch = !search || s.orderNumber.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase()) || s.trackingCode.toLowerCase().includes(search.toLowerCase());
    const matchCarrier = activeCarrier === 'Tất cả' || s.carrier === activeCarrier;
    const matchStatus = activeStatus === 'all' || s.status === activeStatus;
    return matchSearch && matchCarrier && matchStatus;
  });

  const stats = [
    { label: 'Tổng đơn vận chuyển', value: mockShipments.length, icon: Package, color: 'text-blue-600 bg-blue-100' },
    { label: 'Đang giao', value: mockShipments.filter(s => s.status === 'shipping').length, icon: Truck, color: 'text-purple-600 bg-purple-100' },
    { label: 'Đã giao', value: mockShipments.filter(s => s.status === 'delivered').length, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { label: 'Chờ xử lý', value: mockShipments.filter(s => s.status === 'pending').length, icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý vận chuyển</h1>
        <p className="text-gray-500">Theo dõi và quản lý vận đơn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm mã đơn, khách hàng, mã vận đơn..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={activeStatus} onChange={e => setActiveStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="flex gap-2">
            {carriers.map(c => (
              <button key={c} onClick={() => setActiveCarrier(c)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${activeCarrier === c ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-sm">Đơn hàng</th>
              <th className="text-left p-4 font-medium text-sm">Khách hàng</th>
              <th className="text-left p-4 font-medium text-sm">Địa chỉ</th>
              <th className="text-left p-4 font-medium text-sm">Đơn vị vận chuyển</th>
              <th className="text-left p-4 font-medium text-sm">Tài xế</th>
              <th className="text-left p-4 font-medium text-sm">Dự kiến giao</th>
              <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
              <th className="text-right p-4 font-medium text-sm">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(s => {
              const status = statusConfig[s.status];
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">#{s.orderNumber}</p>
                      <p className="text-xs text-gray-400">Mã VĐ: {s.trackingCode}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{s.customer}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 max-w-[200px]">
                    <p className="text-sm text-gray-600 truncate flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                      {s.address}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">{s.carrier}</span>
                  </td>
                  <td className="p-4">
                    {s.assignedTo ? (
                      <span className="text-sm">{s.assignedTo}</span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">{s.estimatedDate}</span>
                  </td>
                  <td className="p-4">
                    <select value={s.status} onChange={() => {}}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${status.color}`}>
                      {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="text-primary">Chi tiết</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">Không tìm thấy vận đơn nào</div>
        )}
      </div>
    </div>
  );
}
