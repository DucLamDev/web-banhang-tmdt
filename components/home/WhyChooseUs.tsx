'use client';

import { Shield, Truck, RotateCcw, Headphones, CreditCard, Award } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    desc: 'Đơn hàng từ 2 triệu',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Bảo hành chính hãng',
    desc: '12 - 24 tháng tại MiniShop',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả dễ dàng',
    desc: '30 ngày đổi - 1 đổi 1 lỗi',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: CreditCard,
    title: 'Trả góp 0%',
    desc: 'Qua thẻ tín dụng',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    desc: 'Hotline 1800 1234',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    icon: Award,
    title: 'Sản phẩm chính hãng',
    desc: '100% hàng chính hãng',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
];

export default function WhyChooseUs() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">Tại sao chọn MiniShop?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center gap-2 group">
            <div className={`w-14 h-14 ${f.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <f.icon className={`w-7 h-7 ${f.iconColor}`} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800 leading-tight">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
