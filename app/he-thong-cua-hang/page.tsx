'use client';

import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Clock, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const stores = [
  { id: 1, name: 'MiniShop Quận 1', address: '123 Nguyễn Huệ, P.Bến Nghé, Q.1, TP.HCM', phone: '028 3812 5960', hours: '8:00 - 22:00', district: 'Quận 1', city: 'TP.HCM' },
  { id: 2, name: 'MiniShop Quận 3', address: '456 Võ Văn Tần, P.5, Q.3, TP.HCM', phone: '028 3812 5961', hours: '8:00 - 22:00', district: 'Quận 3', city: 'TP.HCM' },
  { id: 3, name: 'MiniShop Gò Vấp', address: '789 Quang Trung, P.11, Q.Gò Vấp, TP.HCM', phone: '028 3812 5962', hours: '8:00 - 21:30', district: 'Gò Vấp', city: 'TP.HCM' },
  { id: 4, name: 'MiniShop Bình Thạnh', address: '321 Đinh Tiên Hoàng, P.3, Q.Bình Thạnh, TP.HCM', phone: '028 3812 5963', hours: '8:00 - 21:30', district: 'Bình Thạnh', city: 'TP.HCM' },
  { id: 5, name: 'MiniShop Hoàn Kiếm', address: '55 Hàng Bài, Q.Hoàn Kiếm, Hà Nội', phone: '024 3912 5960', hours: '8:00 - 22:00', district: 'Hoàn Kiếm', city: 'Hà Nội' },
  { id: 6, name: 'MiniShop Cầu Giấy', address: '88 Xuân Thủy, Q.Cầu Giấy, Hà Nội', phone: '024 3912 5961', hours: '8:00 - 21:30', district: 'Cầu Giấy', city: 'Hà Nội' },
  { id: 7, name: 'MiniShop Hải Châu', address: '99 Lê Duẩn, Q.Hải Châu, Đà Nẵng', phone: '0236 391 2500', hours: '8:00 - 21:30', district: 'Hải Châu', city: 'Đà Nẵng' },
  { id: 8, name: 'MiniShop Ninh Kiều', address: '150 Hai Bà Trưng, Q.Ninh Kiều, Cần Thơ', phone: '0292 391 2500', hours: '8:00 - 21:30', district: 'Ninh Kiều', city: 'Cần Thơ' },
];

const cities = ['Tất cả', 'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];

export default function StoreSystemPage() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tất cả');

  const filtered = stores.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase());
    const matchCity = selectedCity === 'Tất cả' || s.city === selectedCity;
    return matchSearch && matchCity;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Hệ thống cửa hàng</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-3">Hệ thống cửa hàng MiniShop</h1>
          <p className="text-primary-100">{stores.length} cửa hàng trên toàn quốc</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm cửa hàng, địa chỉ..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {cities.map(city => (
              <button key={city} onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${selectedCity === city ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {city} {city !== 'Tất cả' && `(${stores.filter(s => s.city === city).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(store => (
            <div key={store.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{store.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{store.city}</span>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">{store.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{store.hours}</span>
                </div>
              </div>

              <button className="mt-4 w-full text-center text-sm text-primary hover:text-primary-700 font-medium py-2 border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                Xem bản đồ →
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Không tìm thấy cửa hàng phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
