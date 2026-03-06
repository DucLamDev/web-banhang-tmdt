'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Eye, Star, UserCheck, UserX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (userId: string) => {
    try {
      const res = await adminApi.toggleUserStatus(userId);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.phone?.includes(search);
    const matchFilter = filter === 'all' || (filter === 'active' && u.isActive) || (filter === 'inactive' && !u.isActive) || (filter === 'admin' && u.role === 'admin');
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'Tổng người dùng', value: users.length, icon: Users, color: 'text-primary bg-primary/10' },
    { label: 'Đang hoạt động', value: users.filter(u => u.isActive).length, icon: UserCheck, color: 'text-green-600 bg-green-100' },
    { label: 'Vô hiệu hóa', value: users.filter(u => !u.isActive).length, icon: UserX, color: 'text-red-600 bg-red-100' },
    { label: 'Admin', value: users.filter(u => u.role === 'admin').length, icon: Star, color: 'text-yellow-600 bg-yellow-100' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <p className="text-gray-500">Xem và quản lý tài khoản người dùng</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => {
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

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-3 items-center flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Tìm tên, email, SĐT..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'active', label: 'Hoạt động' },
          { key: 'inactive', label: 'Vô hiệu hóa' },
          { key: 'admin', label: 'Admin' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${filter === f.key ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Người dùng</th>
                  <th className="text-left p-4 font-medium text-sm">Liên hệ</th>
                  <th className="text-left p-4 font-medium text-sm">Vai trò</th>
                  <th className="text-left p-4 font-medium text-sm">Ngày tham gia</th>
                  <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
                  <th className="text-right p-4 font-medium text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">{u.fullName?.[0] || '?'}</span>
                        </div>
                        <p className="font-medium text-sm">{u.fullName}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{u.email}</p>
                      <p className="text-xs text-gray-500">{u.phone || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {u.role !== 'admin' && (
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(u._id)}
                            className={u.isActive ? 'text-red-400 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
                            title={u.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
                            {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">Không tìm thấy người dùng nào</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
