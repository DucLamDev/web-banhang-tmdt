'use client';

import { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Search, Calendar, Percent, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

const mockPromotions = [
  { id: 'P001', code: 'SALE50', name: 'Giảm 50% tất cả điện thoại', type: 'percent', value: 50, minOrder: 5000000, maxDiscount: 2000000, used: 128, total: 500, startDate: '2024-01-01', endDate: '2024-03-31', status: 'active' },
  { id: 'P002', code: 'LAPTOP200K', name: 'Giảm 200k mua Laptop', type: 'fixed', value: 200000, minOrder: 10000000, maxDiscount: 200000, used: 45, total: 200, startDate: '2024-01-15', endDate: '2024-02-15', status: 'active' },
  { id: 'P003', code: 'FREESHIP', name: 'Miễn phí vận chuyển', type: 'shipping', value: 100, minOrder: 500000, maxDiscount: 50000, used: 320, total: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
  { id: 'P004', code: 'TET2024', name: 'Flash Sale Tết - Giảm 30%', type: 'percent', value: 30, minOrder: 2000000, maxDiscount: 1500000, used: 500, total: 500, startDate: '2024-01-10', endDate: '2024-02-10', status: 'expired' },
];

const typeConfig: Record<string, { label: string; color: string }> = {
  percent: { label: 'Phần trăm', color: 'bg-blue-100 text-blue-700' },
  fixed: { label: 'Cố định', color: 'bg-green-100 text-green-700' },
  shipping: { label: 'Miễn phí ship', color: 'bg-purple-100 text-purple-700' },
};

export default function AdminPromotionsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = mockPromotions.filter(p => {
    const matchSearch = !search || p.code.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'Tổng mã KM', value: mockPromotions.length, icon: Tag, color: 'text-primary bg-primary/10' },
    { label: 'Đang hoạt động', value: mockPromotions.filter(p => p.status === 'active').length, icon: Gift, color: 'text-green-600 bg-green-100' },
    { label: 'Đã dùng', value: mockPromotions.reduce((acc, p) => acc + p.used, 0), icon: Percent, color: 'text-blue-600 bg-blue-100' },
    { label: 'Hết hạn', value: mockPromotions.filter(p => p.status === 'expired').length, icon: Calendar, color: 'text-gray-600 bg-gray-100' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
          <p className="text-gray-500">Tạo và quản lý mã giảm giá, chương trình khuyến mãi</p>
        </div>
        <Button className="bg-primary hover:bg-primary-600">
          <Plus className="w-4 h-4 mr-2" />
          Tạo mã mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => {
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
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Tìm mã khuyến mãi..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        {['all', 'active', 'expired'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${filter === f ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {f === 'all' ? 'Tất cả' : f === 'active' ? 'Đang hoạt động' : 'Hết hạn'}
          </button>
        ))}
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-sm">Mã / Tên</th>
              <th className="text-left p-4 font-medium text-sm">Loại</th>
              <th className="text-left p-4 font-medium text-sm">Giá trị</th>
              <th className="text-left p-4 font-medium text-sm">Đơn tối thiểu</th>
              <th className="text-left p-4 font-medium text-sm">Đã dùng</th>
              <th className="text-left p-4 font-medium text-sm">Thời hạn</th>
              <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
              <th className="text-right p-4 font-medium text-sm">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold font-mono text-primary">{p.code}</p>
                  <p className="text-sm text-gray-500">{p.name}</p>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${typeConfig[p.type]?.color}`}>
                    {typeConfig[p.type]?.label}
                  </span>
                </td>
                <td className="p-4 font-medium">
                  {p.type === 'percent' ? `${p.value}%` : formatPrice(p.value)}
                  {p.maxDiscount && p.type === 'percent' && (
                    <p className="text-xs text-gray-400">Max: {formatPrice(p.maxDiscount)}</p>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-600">{formatPrice(p.minOrder)}</td>
                <td className="p-4">
                  <div>
                    <p className="font-medium">{p.used}/{p.total}</p>
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(p.used/p.total)*100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <p>{p.startDate}</p>
                  <p>→ {p.endDate}</p>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status === 'active' ? 'Hoạt động' : 'Hết hạn'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">Không tìm thấy khuyến mãi nào</div>
        )}
      </div>
    </div>
  );
}
