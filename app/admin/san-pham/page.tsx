'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminApi, categoryApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  thumbnail: string;
  category?: { name: string; slug: string };
  brand: string;
  variants: Array<{ price: number; stock: number }>;
  isActive: boolean;
  totalSold: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const res = await adminApi.getProducts(params);
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data.categories || res.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(); }, [page, categoryFilter]);

  const handleSearch = () => { setPage(1); fetchProducts(); };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Đã xóa sản phẩm');
      fetchProducts();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  const getStock = (p: Product) => p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const getPrice = (p: Product) => p.variants?.[0]?.price || 0;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-gray-500">Tổng cộng {total} sản phẩm</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm kiếm sản phẩm..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10" />
          </div>
          <select className="border rounded-lg px-3 text-sm" value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
          </select>
          <Button onClick={handleSearch}>Tìm</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Sản phẩm</th>
                  <th className="text-left p-4 font-medium text-sm">Danh mục</th>
                  <th className="text-left p-4 font-medium text-sm">Giá</th>
                  <th className="text-left p-4 font-medium text-sm">Tồn kho</th>
                  <th className="text-left p-4 font-medium text-sm">Đã bán</th>
                  <th className="text-left p-4 font-medium text-sm">Trạng thái</th>
                  <th className="text-right p-4 font-medium text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <span className="text-gray-300 text-xs">N/A</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{product.category?.name || 'N/A'}</td>
                    <td className="p-4 font-semibold text-primary text-sm">{formatPrice(getPrice(product))}</td>
                    <td className="p-4">
                      <span className={`text-sm ${getStock(product) === 0 ? 'text-red-500 font-medium' : ''}`}>
                        {getStock(product)}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{product.totalSold || 0}</td>
                    <td className="p-4">
                      <Badge className={product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/san-pham/${product._id}`} target="_blank">
                          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Xem"><Eye className="w-4 h-4 text-gray-500" /></button>
                        </Link>
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Xóa" onClick={() => handleDelete(product._id, product.name)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500">Không tìm thấy sản phẩm nào</div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-t">
                <p className="text-sm text-gray-500">Trang {page}/{totalPages} · {total} sản phẩm</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</Button>
                  <div className="flex items-center gap-1 flex-wrap">
                    {pageNumbers.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNumber)}
                        className="min-w-9"
                      >
                        {pageNumber}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
