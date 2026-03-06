'use client';

import { useState, useEffect } from 'react';
import { Gift, Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Voucher {
  _id: string;
  code: string;
  description: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm: { code: string; description: string; type: 'percent' | 'fixed'; value: number; minOrderValue: number; maxDiscount: number; usageLimit: number; startDate: string; endDate: string; isActive: boolean } = { code: '', description: '', type: 'percent', value: 0, minOrderValue: 0, maxDiscount: 0, usageLimit: 100, startDate: '', endDate: '', isActive: true };

export default function AdminPromotionsPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getVouchers();
      setVouchers(res.data || []);
    } catch {
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVouchers(); }, []);

  const getStatus = (v: Voucher) => {
    if (!v.isActive) return 'disabled';
    if (v.endDate && new Date(v.endDate) < new Date()) return 'expired';
    return 'active';
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700' },
    expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-700' },
    disabled: { label: 'Tạm dừng', color: 'bg-gray-100 text-gray-700' },
  };

  const filtered = vouchers.filter(v => {
    const matchSearch = !search || v.code.toLowerCase().includes(search.toLowerCase()) || v.description?.toLowerCase().includes(search.toLowerCase());
    const st = getStatus(v);
    const matchStatus = filterStatus === 'all' || st === filterStatus;
    return matchSearch && matchStatus;
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const handleEdit = (v: Voucher) => {
    setForm({
      code: v.code, description: v.description || '', type: v.type, value: v.value,
      minOrderValue: v.minOrderValue, maxDiscount: v.maxDiscount || 0, usageLimit: v.usageLimit,
      startDate: v.startDate ? v.startDate.split('T')[0] : '', endDate: v.endDate ? v.endDate.split('T')[0] : '',
      isActive: v.isActive,
    });
    setEditingId(v._id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.code || !form.value) { toast.error('Vui lòng điền mã và giá trị'); return; }
    try {
      if (editingId) {
        await adminApi.updateVoucher(editingId, form);
        toast.success('Cập nhật thành công!');
      } else {
        await adminApi.createVoucher(form);
        toast.success('Tạo mã giảm giá thành công!');
      }
      resetForm();
      fetchVouchers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Xóa mã "${code}"?`)) return;
    try {
      await adminApi.deleteVoucher(id);
      toast.success('Đã xóa');
      fetchVouchers();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
          <p className="text-gray-500">Tổng cộng {vouchers.length} mã giảm giá</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo mã giảm giá
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editingId ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá mới'}</h3>
            <button onClick={resetForm}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã *</label>
              <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="VD: SALE20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loại *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="percent">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá trị *</label>
              <Input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả khuyến mãi" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đơn tối thiểu</label>
              <Input type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giảm tối đa</label>
              <Input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giới hạn sử dụng</label>
              <Input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
              <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
              <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                Kích hoạt
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit}>{editingId ? 'Cập nhật' : 'Tạo mới'}</Button>
            <Button variant="outline" onClick={resetForm}>Hủy</Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">{vouchers.filter(v => getStatus(v) === 'active').length}</p>
              <p className="text-xs text-gray-500">Đang hoạt động</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100"><XCircle className="w-5 h-5 text-red-600" /></div>
            <div>
              <p className="text-2xl font-bold">{vouchers.filter(v => getStatus(v) === 'expired').length}</p>
              <p className="text-xs text-gray-500">Hết hạn</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100"><Gift className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{vouchers.reduce((s, v) => s + (v.usedCount || 0), 0)}</p>
              <p className="text-xs text-gray-500">Tổng lượt sử dụng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-3 items-center flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Tìm mã giảm giá..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        {[{ key: 'all', label: 'Tất cả' }, ...Object.entries(statusConfig).map(([k, v]) => ({ key: k, label: v.label }))].map(f => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${filterStatus === f.key ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Mã</th>
                  <th className="text-left p-4 font-medium text-sm">Mô tả</th>
                  <th className="text-left p-4 font-medium text-sm">Loại</th>
                  <th className="text-left p-4 font-medium text-sm">Đơn tối thiểu</th>
                  <th className="text-left p-4 font-medium text-sm">Sử dụng</th>
                  <th className="text-left p-4 font-medium text-sm">Thời hạn</th>
                  <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
                  <th className="text-right p-4 font-medium text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(v => {
                  const st = getStatus(v);
                  return (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">{v.code}</span>
                      </td>
                      <td className="p-4 text-sm">{v.description || '—'}</td>
                      <td className="p-4 text-sm font-medium">
                        {v.type === 'percent' ? `${v.value}%` : formatPrice(v.value)}
                      </td>
                      <td className="p-4 text-sm">{formatPrice(v.minOrderValue)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[80px]">
                            <div className="h-2 bg-primary rounded-full" style={{ width: `${v.usageLimit ? Math.min((v.usedCount / v.usageLimit) * 100, 100) : 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{v.usedCount || 0}/{v.usageLimit || '∞'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-gray-600">
                        {v.startDate ? new Date(v.startDate).toLocaleDateString('vi-VN') : '—'} → {v.endDate ? new Date(v.endDate).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[st]?.color}`}>
                          {statusConfig[st]?.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Sửa" onClick={() => handleEdit(v)}>
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Xóa" onClick={() => handleDelete(v._id, v.code)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">Không tìm thấy mã giảm giá nào</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
