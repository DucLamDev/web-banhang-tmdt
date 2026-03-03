'use client';

import Link from 'next/link';
import Image from 'next/image';

const categoryBanners = [
  {
    title: 'Laptop Gaming',
    subtitle: 'Chinh phục mọi tựa game',
    badge: 'Giảm đến 4 triệu',
    image: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/333430/acer-nitro-v-15-anv15-41-r2up-r5-nhqpgsv004-638774737367845195-600x600.jpg',
    link: '/danh-muc/laptop',
    bg: 'bg-gradient-to-br from-slate-900 to-gray-800',
    textColor: 'text-white',
    badgeBg: 'bg-red-500',
  },
  {
    title: 'Đồng hồ thời trang',
    subtitle: 'Casio • Orient • Citizen',
    badge: 'Từ 490.000đ',
    image: 'https://cdn.tgdd.vn/Products/Images/7264/313969/casio-lw-204-4adf-nu-thumb-fix-600x600.jpg',
    link: '/danh-muc/dong-ho',
    bg: 'bg-gradient-to-br from-amber-600 to-yellow-700',
    textColor: 'text-white',
    badgeBg: 'bg-white text-amber-700',
  },
  {
    title: 'Máy tính bảng',
    subtitle: 'iPad • Xiaomi • Samsung',
    badge: 'Trả góp 0%',
    image: 'https://cdn.tgdd.vn/Products/Images/522/358082/ipad-pro-m5-wifi-11-inch-black-thumb-600x600.jpg',
    link: '/danh-muc/tablet',
    bg: 'bg-gradient-to-br from-blue-600 to-indigo-800',
    textColor: 'text-white',
    badgeBg: 'bg-yellow-400 text-gray-900',
  },
];

export default function CategoryBanners() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh mục nổi bật</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryBanners.map((b) => (
          <Link
            key={b.title}
            href={b.link}
            className={`${b.bg} rounded-2xl p-5 flex items-center justify-between overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] min-h-[140px]`}
          >
            <div className={`${b.textColor} z-10`}>
              <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-2 ${b.badgeBg}`}>
                {b.badge}
              </span>
              <h3 className="text-lg font-bold leading-tight">{b.title}</h3>
              <p className="text-sm opacity-80 mt-0.5">{b.subtitle}</p>
              <span className="mt-3 inline-block text-xs font-semibold bg-white/20 border border-white/30 px-3 py-1 rounded-full">
                Xem ngay →
              </span>
            </div>
            <div className="relative w-24 h-24 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Image src={b.image} alt={b.title} fill className="object-contain drop-shadow-lg" sizes="96px" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
