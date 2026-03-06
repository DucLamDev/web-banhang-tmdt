'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, MapPin, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore, useAuthStore } from '@/lib/store';
import { orderApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { fetchProvinces, fetchDistricts, fetchWards, Province, District, Ward } from '@/lib/vietnamAddress';
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
  const [mounted, setMounted] = useState(false);
  
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    province: '',
    district: '',
    ward: '',
    street: '',
    note: '',
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvinceCode) {
      fetchDistricts(selectedProvinceCode).then(setDistricts);
      setDistricts([]);
      setWards([]);
      setForm(prev => ({ ...prev, district: '', ward: '' }));
    }
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (selectedDistrictCode) {
      fetchWards(selectedDistrictCode).then(setWards);
      setWards([]);
      setForm(prev => ({ ...prev, ward: '' }));
    }
  }, [selectedDistrictCode]);

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

  const subtotal = getTotal();
  const shippingFee = subtotal >= 2000000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/');
    } else if (items.length === 0) {
      router.push('/gio-hang');
    }
  }, [mounted, isAuthenticated, items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.fullName || !form.phone || !form.province || !form.district || !form.street) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await orderApi.create({
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          province: form.province,
          district: form.district,
          ward: form.ward,
          street: form.street,
        },
        paymentMethod,
        note: form.note,
        items: items.map((item) => ({
          productId: item.productId,
          variantSku: item.variantSku,
          variant: item.variant,
          quantity: item.quantity,
        })),
      });

      const order = response.data;
      clearCart();
      toast.success('Đặt hàng thành công!');
      router.push(`/don-hang/thanh-cong?order=${order.orderNumber}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted || !isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-6 pb-32 md:pb-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-4 md:mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/gio-hang" className="text-gray-500 hover:text-primary">Giỏ hàng</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Thanh toán</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-4 md:p-6">
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
                    <select
                      value={selectedProvinceCode || ''}
                      onChange={handleProvinceChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map(p => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quận/Huyện *</label>
                    <select
                      value={selectedDistrictCode || ''}
                      onChange={handleDistrictChange}
                      required
                      disabled={!selectedProvinceCode}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map(d => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                    <select
                      onChange={handleWardChange}
                      disabled={!selectedDistrictCode}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map(w => (
                        <option key={w.code} value={w.code}>{w.name}</option>
                      ))}
                    </select>
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
              <div className="bg-white rounded-xl p-4 md:p-6">
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

            {/* Right Column - Order Summary - desktop only */}
            <div className="hidden lg:block space-y-4">
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

      {/* Mobile sticky order bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Tổng đơn hàng</p>
            <p className="text-base font-bold text-primary">{formatPrice(total)}</p>
          </div>
          <Button
            type="submit"
            form="checkout-form"
            className="h-11 px-6 text-sm flex-shrink-0"
            disabled={isProcessing}
            onClick={handleSubmit}
          >
            {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
          </Button>
        </div>
      </div>
    </div>
  );
}
