'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Package, MapPin, Phone, Loader2, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { orderApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const statusSteps = [
  { key: 'pending', label: 'Chờ xác nhận', icon: Clock },
  { key: 'confirmed', label: 'Đã xác nhận', icon: CheckCircle },
  { key: 'shipping', label: 'Đang giao hàng', icon: Truck },
  { key: 'delivered', label: 'Đã giao hàng', icon: CheckCircle },
];

const statusOrder = ['pending', 'confirmed', 'shipping', 'delivered'];

interface OrderItem {
  name: string;
  thumbnail?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    province: string;
  };
}

export default function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) { setError('Vui lòng nhập mã đơn hàng'); return; }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await orderApi.tracking(orderNumber.trim());
      setOrder(res.data.order || res.data);
    } catch {
      setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? statusOrder.indexOf(order.status) : -1;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/don-hang" className="text-gray-500 hover:text-primary">Đơn hàng</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Tra cứu đơn hàng</span>
        </nav>

        {/* Lookup Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Tra cứu đơn hàng</h1>
              <p className="text-sm text-gray-500">Nhập mã đơn hàng để kiểm tra trạng thái</p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng *</label>
              <Input
                placeholder="Ví dụ: MS17091234"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại (tuỳ chọn)</label>
              <Input
                placeholder="Số điện thoại đặt hàng"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="h-11"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary-600" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Tra cứu ngay
            </Button>
          </form>
        </div>

        {/* Order Result */}
        {order && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-primary/5 border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">#{order.orderNumber}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="font-bold text-secondary text-xl">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {/* Progress Steps */}
            {order.status !== 'cancelled' && (
              <div className="p-6 border-b">
                <h3 className="font-medium mb-6">Trạng thái đơn hàng</h3>
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const done = idx <= currentStep;
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${
                            done ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className={`text-xs mt-2 text-center max-w-[70px] ${done ? 'text-primary font-medium' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="p-6 border-b">
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                  <XCircle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Đơn hàng đã bị hủy</p>
                    <p className="text-sm text-red-500">Nếu có thắc mắc, vui lòng liên hệ 1900 1234</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="p-6 border-b">
                <h3 className="font-medium mb-3">Địa chỉ giao hàng</h3>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.shippingAddress.phone}
                    </p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="p-6">
              <h3 className="font-medium mb-4">Sản phẩm ({order.items?.length})</h3>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0">
                      {item.thumbnail && <img src={item.thumbnail} alt={item.name} className="w-full h-full object-contain p-1" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-medium text-secondary">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold">Tổng cộng</span>
                <span className="font-bold text-xl text-secondary">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
