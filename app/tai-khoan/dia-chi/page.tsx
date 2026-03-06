'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Plus, Edit2, Trash2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store';
import { userApi } from '@/lib/api';
import { fetchProvinces, fetchDistricts, fetchWards, Province, District, Ward } from '@/lib/vietnamAddress';
import toast from 'react-hot-toast';

const menuItems = [
  { icon: User, label: 'Thông tin tài khoản', href: '/tai-khoan' },
  { icon: Package, label: 'Đơn hàng của tôi', href: '/tai-khoan/don-hang' },
  { icon: MapPin, label: 'Sổ địa chỉ', href: '/tai-khoan/dia-chi', active: true },
  { icon: Heart, label: 'Sản phẩm yêu thích', href: '/tai-khoan/yeu-thich' },
];

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export default function AddressPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated) { router.push('/'); return; }
    loadAddresses();
    fetchProvinces().then(setProvinces);
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedProvinceCode) {
      fetchDistricts(selectedProvinceCode).then(setDistricts);
      setWards([]);
      setForm(prev => ({ ...prev, district: '', ward: '' }));
      setSelectedDistrictCode(null);
    }
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (selectedDistrictCode) {
      fetchWards(selectedDistrictCode).then(setWards);
      setForm(prev => ({ ...prev, ward: '' }));
    }
  }, [selectedDistrictCode]);

  const loadAddresses = async () => {
    try {
      const res = await userApi.getMe();
      setAddresses(res.data.addresses || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ fullName: '', phone: '', province: '', district: '', ward: '', street: '', isDefault: false });
    setSelectedProvinceCode(null);
    setSelectedDistrictCode(null);
    setDistricts([]);
    setWards([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.province || !form.district || !form.street) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      if (editingId) {
        await userApi.updateAddress(editingId, form);
        toast.success('Cập nhật địa chỉ thành công!');
      } else {
        await userApi.addAddress(form);
        toast.success('Thêm địa chỉ thành công!');
      }
      await loadAddresses();
      resetForm();
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward || '',
      street: addr.street,
      isDefault: addr.isDefault,
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await userApi.deleteAddress(id);
      toast.success('Đã xóa địa chỉ');
      await loadAddresses();
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    const province = provinces.find(p => p.code === code);
    if (province) {
      setSelectedProvinceCode(code);
      setForm(prev => ({ ...prev, province: province.name }));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    const district = districts.find(d => d.code === code);
    if (district) {
      setSelectedDistrictCode(code);
      setForm(prev => ({ ...prev, district: district.name }));
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    const ward = wards.find(w => w.code === code);
    if (ward) {
      setForm(prev => ({ ...prev, ward: ward.name }));
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Đăng xuất thành công!');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/tai-khoan" className="text-gray-500 hover:text-primary">Tài khoản</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Sổ địa chỉ</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-3 pb-4 border-b mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left text-red-500 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Sổ địa chỉ</h1>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm địa chỉ
                  </Button>
                )}
              </div>

              {/* Address Form */}
              {showForm && (
                <div className="border rounded-xl p-4 mb-6 bg-gray-50">
                  <h3 className="font-medium mb-4">{editingId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Họ tên *</label>
                      <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                      <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0901234567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố *</label>
                      <select value={selectedProvinceCode || ''} onChange={handleProvinceChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quận/Huyện *</label>
                      <select value={selectedDistrictCode || ''} onChange={handleDistrictChange} disabled={!selectedProvinceCode}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100">
                        <option value="">Chọn quận/huyện</option>
                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                      <select onChange={handleWardChange} disabled={!selectedDistrictCode}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100">
                        <option value="">Chọn phường/xã</option>
                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Địa chỉ cụ thể *</label>
                      <Input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} placeholder="Số nhà, tên đường" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="rounded" />
                      <label htmlFor="isDefault" className="text-sm">Đặt làm địa chỉ mặc định</label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={handleSubmit}>{editingId ? 'Cập nhật' : 'Thêm địa chỉ'}</Button>
                    <Button variant="outline" onClick={resetForm}>Hủy</Button>
                  </div>
                </div>
              )}

              {/* Address List */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">Bạn chưa có địa chỉ nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr._id} className={`border rounded-xl p-4 ${addr.isDefault ? 'border-primary bg-primary/5' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{addr.fullName}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-600">{addr.phone}</span>
                            {addr.isDefault && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                                <Star className="w-3 h-3" /> Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{addr.street}</p>
                          <p className="text-sm text-gray-500">{[addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(addr)} className="p-2 hover:bg-gray-100 rounded-lg" title="Sửa">
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </button>
                          {!addr.isDefault && (
                            <button onClick={() => handleDelete(addr._id)} className="p-2 hover:bg-gray-100 rounded-lg" title="Xóa">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
