'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productApi } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  brand: string;
  variants: Array<{ price: number; originalPrice?: number; sku: string }>;
  averageRating?: number;
  totalSold?: number;
  badges?: Array<{ text: string; bgColor?: string; color?: string }>;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productApi.getFeatured();
        setProducts(response.data.products || response.data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
        <Link href="/san-pham" className="text-primary hover:underline text-sm font-medium">
          Xem tất cả →
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Không có sản phẩm</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
