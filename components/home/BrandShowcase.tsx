'use client';

import Link from 'next/link';
import Image from 'next/image';

const brands = [
  { name: 'Apple', slug: 'Apple', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/2-apple-180x180.png', bgColor: 'bg-gray-100' },
  { name: 'Samsung', slug: 'Samsung', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/samsung-180x180.png', bgColor: 'bg-blue-50' },
  { name: 'ASUS', slug: 'ASUS', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/asus-180x180.png', bgColor: 'bg-blue-50' },
  { name: 'Dell', slug: 'Dell', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/dell-180x180.png', bgColor: 'bg-gray-50' },
  { name: 'Lenovo', slug: 'Lenovo', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/lenovo-180x180.png', bgColor: 'bg-red-50' },
  { name: 'HP', slug: 'HP', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/hp-180x180.png', bgColor: 'bg-blue-50' },
  { name: 'Xiaomi', slug: 'Xiaomi', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/xiaomi-180x180.png', bgColor: 'bg-orange-50' },
  { name: 'OPPO', slug: 'OPPO', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/oppo-180x180.png', bgColor: 'bg-green-50' },
  { name: 'Sony', slug: 'Sony', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/sony-180x180.png', bgColor: 'bg-gray-50' },
  { name: 'JBL', slug: 'JBL', logo: 'https://cdn.tgdd.vn/Brand/1/Logo/jbl-180x180.png', bgColor: 'bg-orange-50' },
];

export default function BrandShowcase() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Thương hiệu nổi bật</h2>
        <Link href="/danh-muc/dien-thoai" className="text-sm text-blue-600 hover:underline">Xem thêm →</Link>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/tim-kiem?q=${brand.slug}`}
            className={`${brand.bgColor} rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-105 hover:shadow-md transition-all duration-200 aspect-square`}
          >
            <div className="relative w-10 h-10">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
