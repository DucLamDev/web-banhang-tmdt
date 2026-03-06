'use client';

import Link from 'next/link';
import Image from 'next/image';

const promotions = [
  {
    id: 1,
    label: 'GIẢM 2.000.000Đ',
    labelBg: 'bg-red-500',
    title: 'iPhone 17 Pro Max',
    subtitle: 'Cam · Titan Đen · Trắng',
    price: 'Từ 35.990.000đ',
    image: '/images/promotions/iphone-17-pro-max-cam.png',
    bgColor: 'bg-gradient-to-br from-slate-800 to-slate-900',
    link: '/san-pham/iphone-17-pro-max',
  },
  {
    id: 2,
    label: 'TRẢ GÓP 0%',
    labelBg: 'bg-blue-500',
    title: 'MacBook Air M4',
    subtitle: 'Xanh Đen · Bạc · Vàng',
    price: 'Từ 28.990.000đ',
    image: '/images/promotions/macbook-air-13-inch-m4.png',
    bgColor: 'bg-gradient-to-br from-blue-800 to-blue-950',
    link: '/san-pham/macbook-air-13-m4',
  },
  {
    id: 3,
    label: 'GIÁ TỐT',
    labelBg: 'bg-orange-500',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Sa Mạc · Trắng · Đen',
    price: 'Từ 33.990.000đ',
    image: '/images/promotions/iphone-16-pro-max-sa-mac.png',
    bgColor: 'bg-gradient-to-br from-amber-700 to-orange-900',
    link: '/san-pham/iphone-16-pro-max',
  },
  {
    id: 4,
    label: 'SIÊU RẺ',
    labelBg: 'bg-green-500',
    title: 'iPhone 14 Plus',
    subtitle: 'Xanh · Đen · Tím',
    price: 'Từ 20.990.000đ',
    image: '/images/promotions/iPhone-14-plus-thumb-xanh.png',
    bgColor: 'bg-gradient-to-br from-indigo-700 to-purple-900',
    link: '/san-pham/iphone-14-plus',
  },
];

export default function PromotionBanners() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Gian hàng ưu đãi</h2>
        <Link href="/danh-muc/dien-thoai" className="text-sm text-blue-600 hover:underline">
          Xem tất cả →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {promotions.map((promo) => (
          <Link
            key={promo.id}
            href={promo.link}
            className={`${promo.bgColor} rounded-2xl p-4 text-white overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-200 flex flex-col`}
          >
            {/* Badge */}
            <span className={`${promo.labelBg} text-white text-[10px] font-black px-2 py-0.5 rounded-full self-start mb-2 tracking-wide`}>
              {promo.label}
            </span>
            
            {/* Product image */}
            <div className="relative w-full aspect-square mb-3 max-h-[120px]">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            {/* Text */}
            <div className="mt-auto">
              <h3 className="font-bold text-sm leading-tight">{promo.title}</h3>
              <p className="text-white/70 text-xs mt-0.5">{promo.subtitle}</p>
              <p className="text-yellow-300 font-bold text-sm mt-1">{promo.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
