'use client';

import { useState } from 'react';
import { Save, Settings, Store, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('MiniShop');
  const [hotline, setHotline] = useState('1800 1234');
  const [email, setEmail] = useState('support@minishop.vn');
  const [address, setAddress] = useState('Hà Nội');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    toast.success('Đã lưu cấu hình giao diện quản trị');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-gray-500">Quản lý thông tin chung hiển thị trong hệ thống quản trị</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Thông tin cửa hàng</h2>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tên cửa hàng</label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hotline</label>
            <Input value={hotline} onChange={(e) => setHotline(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email hỗ trợ</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Tùy chọn hệ thống</h2>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <p className="font-medium">Trạng thái hệ thống</p>
            </div>
            <p className="text-sm text-gray-500">Các cài đặt chuyên sâu như thanh toán, email, và tích hợp dịch vụ ngoài có thể được mở rộng tại đây sau.</p>
          </div>

          <div className="rounded-lg border p-4 text-sm text-gray-500">
            <p>- Trang này hiện là khung cài đặt cơ bản cho admin.</p>
            <p>- Có thể mở rộng thêm cấu hình logo, SEO, tích hợp API, email SMTP.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
