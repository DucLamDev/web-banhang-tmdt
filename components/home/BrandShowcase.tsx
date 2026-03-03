'use client';

import Link from 'next/link';
import Image from 'next/image';

const brands = [
  { name: 'Apple', slug: 'Apple', logo: '/images/logo/y-nghia-logo-apple-2.jpg', bgColor: 'bg-gray-100' },
  { name: 'Samsung', slug: 'Samsung', logo: '/images/logo/samsung-company-logo-south-korean-260nw-2394493913.webp', bgColor: 'bg-blue-50' },
  { name: 'ASUS', slug: 'ASUS', logo: '/images/logo/logo-asus-inkythuatso-2-01-26-09-21-11.jpg', bgColor: 'bg-blue-50' },
  { name: 'Dell', slug: 'Dell', logo: '/images/logo/logo-dell-1.jpg', bgColor: 'bg-gray-50' },
  { name: 'Lenovo', slug: 'Lenovo', logo: '/images/logo/lenovo-logo-brand-phone-symbol-name-black-design-china-mobile-illustration-free-vector.jpg', bgColor: 'bg-red-50' },
  { name: 'HP', slug: 'HP', logo: '/images/logo/logo-hp.png', bgColor: 'bg-blue-50' },
  { name: 'Xiaomi', slug: 'Xiaomi', logo: '/images/logo/Xiaomi_logo_(2021-).svg.png', bgColor: 'bg-orange-50' },
  { name: 'OPPO', slug: 'OPPO', logo: '/images/logo/new-oppo-logo_600x173.png', bgColor: 'bg-green-50' },
  { name: 'Sony', slug: 'Sony', logo: '/images/logo/logo-sony.png', bgColor: 'bg-gray-50' },
  { name: 'JBL', slug: 'JBL', logo: '/images/logo/logo-jbl.png', bgColor: 'bg-orange-50' },
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
            href={`/tim-kiem?brand=${brand.slug}`}
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
