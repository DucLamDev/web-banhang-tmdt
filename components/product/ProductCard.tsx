'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id?: string;
    _id?: string;
    name: string;
    slug: string;
    thumbnail?: string;
    image?: string;
    brand?: string;
    price?: number;
    originalPrice?: number;
    variants?: Array<{
      price: number;
      originalPrice?: number;
      sku: string;
    }>;
    rating?: number;
    averageRating?: number;
    soldCount?: number;
    totalSold?: number;
    badges?: Array<{
      text: string;
      bgColor?: string;
      color?: string;
    }>;
    flashSaleStock?: number;
    flashSaleSold?: number;
  };
  isFlashSale?: boolean;
}

export default function ProductCard({ product, isFlashSale = false }: ProductCardProps) {
  const mainVariant = product.variants?.[0];
  const price = product.price || mainVariant?.price || 0;
  const originalPrice = product.originalPrice || mainVariant?.originalPrice;
  const discount = originalPrice ? calculateDiscount(originalPrice, price) : 0;
  const rating = product.rating || product.averageRating || 0;
  const soldCount = product.soldCount || product.totalSold || 0;
  const imageUrl = product.thumbnail || product.image;

  const stockPercentage = isFlashSale && product.flashSaleStock 
    ? ((product.flashSaleStock - (product.flashSaleSold || 0)) / product.flashSaleStock) * 100
    : 100;

  return (
    <Link href={`/san-pham/${product.slug}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-lg hover:border-primary transition-all duration-200 h-full flex flex-col">
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.badges.map((badge, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 rounded"
                style={{ 
                  backgroundColor: badge.bgColor || '#fee2e2', 
                  color: badge.color || '#dc2626' 
                }}
              >
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">📱</span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-2">
            <p className="text-red-500 font-bold text-lg">
              {formatPrice(price)}
            </p>
            {originalPrice && originalPrice > price && (
              <p className="text-gray-400 text-sm line-through">
                {formatPrice(originalPrice)}
              </p>
            )}
          </div>

          {/* Flash Sale Progress */}
          {isFlashSale && (
            <div className="mb-2">
              <div className="h-4 bg-red-100 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${100 - stockPercentage}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-red-700">
                  Còn {product.flashSaleStock! - (product.flashSaleSold || 0)}/{product.flashSaleStock} suất
                </span>
              </div>
            </div>
          )}

          {/* Rating & Sold */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
            )}
            {soldCount > 0 && (
              <span>• Đã bán {soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}</span>
            )}
          </div>
        </div>

        {/* Buy Button */}
        <button className="mt-3 w-full bg-primary hover:bg-primary-600 text-primary-foreground py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Mua ngay
        </button>
      </div>
    </Link>
  );
}
