'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutList, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  badges?: Array<{ text: string; bgColor?: string; color?: string }>;
}

const sortOptions = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
];

const priceRanges = [
  { label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { label: 'Trên 30 triệu', min: 30000000, max: 999999999 },
];

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState('Sản phẩm');
  const [total, setTotal] = useState(0);

  // Fetch all products once (for brand list)
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const catResponse = await categoryApi.getBySlug(params.slug as string);
        if (catResponse.data.category) {
          setCategoryName(catResponse.data.category.name);
        }
        // Get all products to extract brand list
        const allRes = await productApi.getAll({ category: params.slug as string, limit: 200 });
        const allProds = allRes.data.products || allRes.data || [];
        const brands = Array.from(new Set(allProds.map((p: Product) => p.brand).filter(Boolean))) as string[];
        setAllBrands(brands);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };
    fetchCategory();
  }, [params.slug]);

  // Fetch filtered products from API whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const priceRange = priceRanges.find(r => r.label === selectedPrice);
        const params_obj: Record<string, string | number> = {
          category: params.slug as string,
          sort: sortBy,
        };
        if (priceRange) {
          params_obj.minPrice = priceRange.min;
          params_obj.maxPrice = priceRange.max;
        }
        if (selectedBrands.length === 1) {
          params_obj.brand = selectedBrands[0];
        }
        const response = await productApi.getAll(params_obj);
        const data = response.data.products || response.data || [];
        // Client-side brand filter for multi-brand
        const filtered = selectedBrands.length > 1
          ? data.filter((p: Product) => selectedBrands.includes(p.brand))
          : data;
        setProducts(filtered);
        setTotal(response.data.total || filtered.length);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params.slug, selectedPrice, selectedBrands, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedBrands([]);
  };

  const hasActiveFilters = selectedPrice !== null || selectedBrands.length > 0;

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 md:py-3">
          <nav className="flex items-center gap-2 text-xs md:text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
            <span className="text-gray-900">{categoryName}</span>
          </nav>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc sản phẩm
              </h3>
              <button onClick={() => setShowMobileFilter(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-5">
              <div>
                <h4 className="font-semibold mb-3 text-sm">Mức giá</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer py-1">
                      <input type="radio" name="price-mobile" checked={selectedPrice === range.label}
                        onChange={() => setSelectedPrice(selectedPrice === range.label ? null : range.label)}
                        className="w-4 h-4 accent-teal-500" />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {allBrands.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Thương hiệu</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {allBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                        <input type="checkbox" checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 accent-teal-500 rounded" />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { clearFilters(); setShowMobileFilter(false); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-medium">
                  Xóa bộ lọc
                </button>
                <button onClick={() => setShowMobileFilter(false)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium">
                  Xem kết quả ({products.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - desktop only */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl p-4 sticky top-32">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Bộ lọc
              </h3>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Mức giá</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPrice === range.label}
                        onChange={() => setSelectedPrice(selectedPrice === range.label ? null : range.label)}
                        className="w-4 h-4 text-primary accent-yellow-500"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Thương hiệu</h4>
                <div className="space-y-2">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-primary rounded accent-yellow-500"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={clearFilters} disabled={!hasActiveFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-xl p-3 md:p-4 mb-3 md:mb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h1 className="text-base md:text-xl font-bold truncate">{categoryName}</h1>
                  <p className="text-xs md:text-sm text-gray-500">{products.length} sản phẩm</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowMobileFilter(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm font-medium relative"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Lọc
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  {/* View Mode - desktop only */}
                  <div className="hidden md:flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white'}`}
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPrice && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {selectedPrice}
                    <button onClick={() => setSelectedPrice(null)} className="ml-1 font-bold">×</button>
                  </span>
                )}
                {selectedBrands.map(brand => (
                  <span key={brand} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {brand}
                    <button onClick={() => toggleBrand(brand)} className="ml-1 font-bold">×</button>
                  </span>
                ))}
                <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">Xóa tất cả</button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">Không có sản phẩm phù hợp với bộ lọc</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>Xóa bộ lọc</Button>
                )}
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
