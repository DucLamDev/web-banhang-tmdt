'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Search, Loader2 } from 'lucide-react';
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

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const response = await productApi.search(query);
        setProducts(response.data.products || response.data || []);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };
    searchProducts();
  }, [query]);

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Tìm kiếm: "{query}"</span>
        </nav>

        {/* Results */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-gray-400" />
            <h1 className="text-xl font-bold">
              Kết quả tìm kiếm cho "{query}"
            </h1>
            {!loading && <span className="text-gray-500">({products.length} sản phẩm)</span>}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-600 mb-2">Không tìm thấy sản phẩm</h2>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
