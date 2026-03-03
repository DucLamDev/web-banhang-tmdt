'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroBanners = [
  {
    id: 1,
    title: 'iPhone 17 Pro Max - Cam',
    image: 'https://cdn.tgdd.vn/Products/Images/42/342679/iphone-17-pro-max-cam-thumb-600x600.jpg',
    badge: 'HOT',
    badgeColor: 'bg-red-500',
    headline: 'iPhone 17 Pro Max',
    subline: 'Chỉ từ 35.990.000đ',
    bgColor: 'bg-gradient-to-r from-gray-800 to-gray-900',
    link: '/san-pham/iphone-17-pro-max',
  },
  {
    id: 2,
    title: 'iPhone 16 Pro Max - Sa Mạc',
    image: 'https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-sa-mac-thumb-1-600x600.jpg',
    badge: 'GIẢM 2TR',
    badgeColor: 'bg-yellow-500',
    headline: 'iPhone 16 Pro Max',
    subline: 'Giảm đến 2.000.000đ',
    bgColor: 'bg-gradient-to-r from-amber-700 to-orange-800',
    link: '/san-pham/iphone-16-pro-max',
  },
  {
    id: 3,
    title: 'MacBook Air 13 M4',
    image: 'https://cdn.tgdd.vn/Products/Images/44/335362/macbook-air-13-inch-m4-xanh-den-600x600.jpg',
    badge: 'MỚI',
    badgeColor: 'bg-blue-500',
    headline: 'MacBook Air M4',
    subline: 'Chip M4 mạnh mẽ',
    bgColor: 'bg-gradient-to-r from-slate-700 to-blue-900',
    link: '/san-pham/macbook-air-13-m4',
  },
];

const sideBanners = [
  {
    id: 1,
    title: 'iPhone 15 Plus',
    subtitle: 'Giảm 1.000.000đ',
    image: 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-den-thumb-600x600.jpg',
    bgColor: 'from-indigo-500 to-indigo-700',
    link: '/san-pham/iphone-15-plus-128gb',
  },
  {
    id: 2,
    title: 'iPhone 14 Plus',
    subtitle: 'Trả góp 0%',
    image: 'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-plus-thumb-xanh-600x600.jpg',
    bgColor: 'from-sky-500 to-blue-700',
    link: '/san-pham/iphone-14-plus',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  return (
    <div className="container-custom py-4">
      <div className="flex gap-3">
        {/* Main Banner Slider */}
        <div className="flex-1 relative rounded-2xl overflow-hidden min-w-0">
          {/* Slides */}
          <div className="relative h-[220px] md:h-[300px] lg:h-[380px]">
            {heroBanners.map((b, index) => (
              <Link
                key={b.id}
                href={b.link}
                className={`absolute inset-0 transition-opacity duration-700 ${b.bgColor} flex items-center justify-between px-8 md:px-12 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Text side */}
                <div className="text-white max-w-[55%] z-10">
                  <span className={`inline-block ${b.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3`}>
                    {b.badge}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">{b.headline}</h2>
                  <p className="text-base md:text-lg mt-2 opacity-90 font-medium">{b.subline}</p>
                  <div className="mt-4 inline-block bg-white text-gray-800 font-semibold px-5 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors">
                    Mua ngay
                  </div>
                </div>
                {/* Product image */}
                <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[280px] lg:h-[280px] flex-shrink-0">
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 180px, (max-width: 1024px) 220px, 280px"
                    priority={index === 0}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors z-20"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors z-20"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${index === currentSlide ? 'w-6 h-2 bg-white rounded-full' : 'w-2 h-2 bg-white/50 rounded-full'}`}
              />
            ))}
          </div>
        </div>

        {/* Side Banners */}
        <div className="hidden lg:flex flex-col gap-3 w-[220px] flex-shrink-0">
          {sideBanners.map((sb) => (
            <Link
              key={sb.id}
              href={sb.link}
              className={`relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-br ${sb.bgColor} hover:scale-[1.02] transition-transform flex items-center justify-between px-4`}
            >
              <div className="text-white z-10">
                <p className="text-xs opacity-80">{sb.subtitle}</p>
                <h3 className="text-base font-bold mt-0.5 leading-tight">{sb.title}</h3>
                <span className="mt-2 inline-block bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30">
                  Xem ngay →
                </span>
              </div>
              <div className="relative w-[85px] h-[85px] flex-shrink-0">
                <Image
                  src={sb.image}
                  alt={sb.title}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="85px"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
