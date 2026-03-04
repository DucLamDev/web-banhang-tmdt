'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronRight, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore, useCartStore, useUIStore } from '@/lib/store';
import { userApi, productApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  brand: string;
  variants: Array<{ price: number; originalPrice?: number; sku: string; stock: number }>;
  averageRating?: number;
  totalSold?: number;
}

export default function WishlistPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { addItem } = useCartStore();
  const { openLoginModal } = useUIStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) { setLoading(false); return; }
      try {
        const res = await userApi.getMe();
        const wishlistIds: string[] = res.data.user?.wishlist || res.data.wishlist || [];
        if (wishlistIds.length === 0) { setProducts([]); setLoading(false); return; }
        const productRes = await productApi.getAll({ ids: wishlistIds.join(','), limit: 100 });
        setProducts(productRes.data.products || productRes.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      await userApi.toggleWishlist(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) { openLoginModal(); return; }
    const variant = product.variants[0];
    if (!variant) return;
    addItem({
      id: `${product._id}-${variant.sku}`,
      productId: product._id,
      name: product.name,
      price: variant.price,
      image: product.thumbnail || '',
      variant: '',
      variantSku: variant.sku,
      quantity: 1,
    });
    toast.success('Đã thêm vào giỏ hàng!');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-6">Đăng nhập để xem sản phẩm yêu thích của bạn</p>
          <Button onClick={openLoginModal} className="bg-primary hover:bg-primary-600">Đăng nhập</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Sản phẩm yêu thích</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center gap-3">
            <Heart className="w-6 h-6 text-secondary fill-secondary" />
            <div>
              <h1 className="text-xl font-bold">Sản phẩm yêu thích</h1>
              {!loading && <p className="text-sm text-gray-500">{products.length} sản phẩm</p>}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="font-medium text-gray-600 mb-2">Chưa có sản phẩm yêu thích</h3>
              <p className="text-sm text-gray-400 mb-6">Thêm sản phẩm vào danh sách để mua sau</p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary-600">Khám phá sản phẩm</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {products.map(product => {
                const variant = product.variants[0];
                const price = variant?.price || 0;
                const originalPrice = variant?.originalPrice;
                const discount = originalPrice && originalPrice > price
                  ? Math.round((1 - price / originalPrice) * 100)
                  : 0;

                return (
                  <div key={product._id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <Link href={`/san-pham/${product.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {product.thumbnail ? (
                          <Image src={product.thumbnail} alt={product.name} width={80} height={80} className="object-contain p-1 w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📱</div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/san-pham/${product.slug}`}>
                        <h3 className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-secondary">{formatPrice(price)}</span>
                        {discount > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice!)}</span>
                            <span className="text-xs bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">-{discount}%</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary hover:bg-primary-600 text-white"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Thêm vào giỏ
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(product._id)}
                        disabled={removing === product._id}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        {removing === product._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
