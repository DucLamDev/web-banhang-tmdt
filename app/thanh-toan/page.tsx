'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, MapPin, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore, useAuthStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { id: 'banking', name: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', name: 'Ví MoMo', icon: '📱' },
  { id: 'vnpay', name: 'VNPay', icon: '💳' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    province: '',
    district: '',
    ward: '',
    street: '',
    note: '',
  });

  const subtotal = getTotal();
  const shippingFee = subtotal >= 2000000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.fullName || !form.phone || !form.province || !form.district || !form.street) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setIsProcessing(true);
    
    // Simulate order creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderNumber = `TG${Date.now().toString().slice(-8)}`;
    clearCart();
    toast.success('Đặt hàng thành công!');
    router.push(`/don-hang/thanh-cong?order=${orderNumber}`);
  };

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  if (items.length === 0) {
    router.push('/gio-hang');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/gio-hang" className="text-gray-500 hover:text-primary">Giỏ hàng</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Thanh toán</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  Địa chỉ giao hàng
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ tên *</label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0901234567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố *</label>
                    <Input
                      value={form.province}
                      onChange={(e) => setForm({ ...form, province: e.target.value })}
                      placeholder="Chọn tỉnh/thành phố"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quận/Huyện *</label>
                    <Input
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      placeholder="Chọn quận/huyện"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                    <Input
                      value={form.ward}
                      onChange={(e) => setForm({ ...form, ward: e.target.value })}
                      placeholder="Chọn phường/xã"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Địa chỉ cụ thể *</label>
                    <Input
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Ghi chú</label>
                    <Input
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Ghi chú cho người giao hàng"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Phương thức thanh toán
                </h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                      {paymentMethod === method.id && (
                        <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 sticky top-4">
                <h2 className="text-lg font-bold mb-4">Đơn hàng của bạn</h2>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} width={64} height={64} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.variant}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">x{item.quantity}</span>
                          <span className="text-sm font-semibold text-primary">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span>{shippingFee === 0 ? <span className="text-green-600">Miễn phí</span> : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-4 h-12 text-base"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Bằng cách đặt hàng, bạn đồng ý với các điều khoản sử dụng của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
