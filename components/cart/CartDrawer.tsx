'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (!isOpen) return null;

  const total = getTotal();
  const shippingFee = total >= 2000000 ? 0 : 30000;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
            <ShoppingBag className="w-5 h-5" />
            Giỏ hàng ({items.length} sản phẩm)
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 mb-2 font-medium">Giỏ hàng trống</p>
              <p className="text-sm text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
              <Button onClick={onClose} variant="outline" className="border-primary text-primary">
                Tiếp tục mua sắm
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📱</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 text-gray-800">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>
                    )}
                    <p className="text-red-500 font-bold mt-1 text-sm">{formatPrice(item.price)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3 bg-gray-50">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({items.length} SP):</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Tổng tiền:</span>
                <span className="text-red-500 text-lg">{formatPrice(total + shippingFee)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/gio-hang" onClick={onClose}>
                <Button variant="outline" className="w-full border-gray-300">
                  Xem giỏ hàng
                </Button>
              </Link>
              <Link href="/thanh-toan" onClick={onClose}>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Đặt hàng
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
