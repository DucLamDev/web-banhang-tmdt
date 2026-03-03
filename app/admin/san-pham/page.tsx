'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

const mockProducts = [
  { id: '1', name: 'iPhone 16 Pro Max 256GB', category: 'Điện thoại', price: 34990000, stock: 50, status: 'active', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png' },
  { id: '2', name: 'Samsung Galaxy S24 Ultra', category: 'Điện thoại', price: 29990000, stock: 35, status: 'active', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-ultra_1__1.png' },
  { id: '3', name: 'MacBook Pro 14 M3 Pro', category: 'Laptop', price: 49990000, stock: 15, status: 'active', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-pro-14-inch-m3-pro-2023.png' },
  { id: '4', name: 'AirPods Pro 2', category: 'Phụ kiện', price: 5990000, stock: 100, status: 'active', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_170_1_.png' },
  { id: '5', name: 'iPad Pro M2 12.9', category: 'Tablet', price: 29990000, stock: 0, status: 'out_of_stock', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-pro-13-inch-m4-wifi.png' },
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [products] = useState(mockProducts);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-gray-500">Tổng cộng {products.length} sản phẩm</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select className="border rounded-lg px-3">
            <option value="">Tất cả danh mục</option>
            <option value="dien-thoai">Điện thoại</option>
            <option value="laptop">Laptop</option>
            <option value="tablet">Tablet</option>
            <option value="phu-kien">Phụ kiện</option>
          </select>
          <select className="border rounded-lg px-3">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="out_of_stock">Hết hàng</option>
            <option value="inactive">Ngừng bán</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">Sản phẩm</th>
              <th className="text-left p-4 font-medium">Danh mục</th>
              <th className="text-left p-4 font-medium">Giá</th>
              <th className="text-left p-4 font-medium">Tồn kho</th>
              <th className="text-left p-4 font-medium">Trạng thái</th>
              <th className="text-right p-4 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={product.image} alt={product.name} width={48} height={48} className="object-contain" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{product.category}</td>
                <td className="p-4 font-semibold text-primary">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <span className={product.stock === 0 ? 'text-red-500' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <Badge className={product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {product.status === 'active' ? 'Đang bán' : 'Hết hàng'}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Xem">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Sửa">
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Xóa">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-gray-500">Hiển thị 1-{filteredProducts.length} của {products.length} sản phẩm</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Sau</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
