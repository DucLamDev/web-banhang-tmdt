'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore, useAuthStore, useUIStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useUIStore();
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotal();
  const shippingFee = subtotal >= 2000000 ? 0 : 30000;
  const total = subtotal - discount + shippingFee;

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'GIAM10') {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      toast.success('Áp dụng mã giảm giá thành công!');
    } else {
      toast.error('Mã giảm giá không hợp lệ');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openLoginModal();
      toast.error('Vui lòng đăng nhập để tiếp tục');
      return;
    }
    window.location.href = '/thanh-toan';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
        <Link href="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Giỏ hàng ({items.length} sản phẩm)</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Giỏ hàng của bạn</h1>
                <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
                  Xóa tất cả
                </button>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/san-pham/${item.productId}`} className="font-medium hover:text-primary line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                      <p className="text-primary font-semibold mt-2">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Voucher */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Mã giảm giá
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyVoucher}>Áp dụng</Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Thử mã: GIAM10</p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính ({items.length} sản phẩm)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? <span className="text-green-600">Miễn phí</span> : formatPrice(shippingFee)}</span>
                </div>
                
                {shippingFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ
                  </p>
                )}
                
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button className="w-full mt-4 h-12 text-base" onClick={handleCheckout}>
                Tiến hành đặt hàng
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-primary/5 to-yellow-50 rounded-xl p-4">
              <h4 className="font-medium mb-2">🎁 Ưu đãi khi mua hàng</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Miễn phí giao hàng đơn từ 2 triệu</li>
                <li>✓ Đổi trả trong 30 ngày</li>
                <li>✓ Bảo hành chính hãng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
