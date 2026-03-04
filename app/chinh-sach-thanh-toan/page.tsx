'use client';

import Link from 'next/link';
import { ChevronRight, CreditCard, Banknote, Smartphone, Shield } from 'lucide-react';

const paymentMethods = [
  {
    icon: CreditCard,
    title: 'Thẻ tín dụng / Ghi nợ',
    methods: ['Visa', 'Mastercard', 'JCB', 'Amex'],
    desc: 'Thanh toán an toàn qua cổng thanh toán VNPay, ZaloPay',
  },
  {
    icon: Smartphone,
    title: 'Ví điện tử',
    methods: ['MoMo', 'ZaloPay', 'VNPay', 'ShopeePay'],
    desc: 'Thanh toán nhanh chóng qua ví điện tử',
  },
  {
    icon: Banknote,
    title: 'Chuyển khoản ngân hàng',
    methods: ['Vietcombank', 'Techcombank', 'MB Bank', 'VPBank'],
    desc: 'Chuyển khoản qua Internet Banking hoặc ATM',
  },
  {
    icon: Banknote,
    title: 'Thanh toán khi nhận hàng (COD)',
    methods: [],
    desc: 'Thanh toán tiền mặt khi nhận hàng, áp dụng cho đơn dưới 50 triệu đồng',
  },
];

export default function PaymentPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Chính sách thanh toán</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-3">Chính sách thanh toán</h1>
          <p className="text-primary-100">Đa dạng phương thức thanh toán, bảo mật tuyệt đối</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              return (
                <div key={method.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-900">{method.title}</h3>
                  </div>
                  {method.methods.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {method.methods.map(m => (
                        <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{m}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">{method.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Bảo mật thanh toán
            </h2>
            <div className="space-y-3">
              {[
                'Tất cả giao dịch được mã hóa SSL 256-bit',
                'Không lưu trữ thông tin thẻ tín dụng của khách hàng',
                'Cổng thanh toán được chứng nhận PCI DSS',
                'Xác thực 2 bước (OTP) cho mọi giao dịch',
                'Giám sát giao dịch 24/7 để phát hiện gian lận',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Điều khoản thanh toán</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>• Giá hiển thị trên website là giá đã bao gồm VAT.</p>
              <p>• Đơn hàng COD có thể bị thu thêm phí xử lý 15.000đ - 25.000đ tùy khu vực.</p>
              <p>• Thanh toán online sẽ được xác nhận trong vòng 5-10 phút sau khi giao dịch thành công.</p>
              <p>• MiniShop không chịu trách nhiệm với các khoản phí phát sinh từ ngân hàng bên thứ ba.</p>
              <p>• Trong trường hợp thanh toán thất bại, vui lòng liên hệ hotline 1900 1234 để được hỗ trợ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
