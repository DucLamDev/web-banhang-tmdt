'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productApi, categoryApi } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  brand: string;
  variants: Array<{ price: number; originalPrice?: number; sku: string }>;
  averageRating?: number;
  totalSold?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function SuggestedProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        const cats = response.data.categories || response.data || [];
        setCategories(cats);
        if (cats.length > 0) {
          setActiveSlug(cats[0].slug);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when active category changes
  useEffect(() => {
    if (!activeSlug) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApi.getAll({ category: activeSlug });
        setProducts(response.data.products || response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeSlug]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Gợi ý cho bạn</h2>
      </div>

      {/* Tabs */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 border-b mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveSlug(cat.slug)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors rounded-t-lg ${
                activeSlug === cat.slug
                  ? 'text-primary border-b-2 border-primary bg-primary-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      
      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Không có sản phẩm</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* View More */}
      {activeSlug && (
        <div className="text-center mt-6">
          <Link
            href={`/danh-muc/${activeSlug}`}
            className="inline-block px-8 py-2 border border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors font-medium"
          >
            Xem thêm {categories.find(c => c.slug === activeSlug)?.name}
          </Link>
        </div>
      )}
    </div>
  );
}
