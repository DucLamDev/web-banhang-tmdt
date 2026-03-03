'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, Heart, ShoppingCart, Shield, Truck, RotateCcw, ChevronRight, Minus, Plus, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useAuthStore, useUIStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { productApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Variant {
  name: string;
  color: string;
  colorCode: string;
  storage: string;
  price: number;
  originalPrice: number;
  stock: number;
  sku: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  shortDescription?: string;
  description: string;
  images: string[];
  thumbnail: string;
  variants: Variant[];
  specifications?: { group: string; items: { label: string; value: string }[] }[];
  badges?: { text: string; bgColor: string; color: string }[];
  promotions?: { type: string; title: string; description: string }[];
  warranty?: { months: number; description: string };
  averageRating?: number;
  totalReviews?: number;
  totalSold?: number;
}


export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useUIStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productApi.getBySlug(params.slug as string);
        const productData = response.data.product || response.data;
        setProduct(productData);
        if (productData?.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
          setSelectedStorage(productData.variants[0].storage || '');
          setSelectedColor(productData.variants[0].color || '');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const storages = Array.from(new Set(product?.variants?.map(v => v.storage).filter(Boolean) || []));
  const colors = Array.from(new Set(product?.variants?.filter(v => v.storage === selectedStorage).map(v => v.color) || []));

  useEffect(() => {
    if (product && selectedStorage && selectedColor) {
      const variant = product.variants.find(v => v.storage === selectedStorage && v.color === selectedColor);
      if (variant) setSelectedVariant(variant);
    }
  }, [selectedStorage, selectedColor, product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      openLoginModal();
      return;
    }
    addItem({
      id: `${product._id}-${selectedVariant.sku}`,
      productId: product._id,
      name: product.name,
      image: product.thumbnail,
      variant: selectedVariant.name,
      variantSku: selectedVariant.sku,
      price: selectedVariant.price,
      quantity,
    });
    toast.success('Đã thêm vào giỏ hàng!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const discount = selectedVariant && selectedVariant.originalPrice > selectedVariant.price ? Math.round((1 - selectedVariant.price / selectedVariant.originalPrice) * 100) : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/danh-muc/dien-thoai" className="text-gray-500 hover:text-primary">Điện thoại</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white rounded-xl p-6 border">
              <div className="relative w-full h-[320px]">
                <Image
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt="" fill className="object-contain p-1" sizes="64px" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              {product.badges && product.badges.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  {product.badges.map((badge, idx) => (
                    <Badge key={idx} style={{ backgroundColor: badge.bgColor, color: badge.color }}>{badge.text}</Badge>
                  ))}
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.averageRating}</span>
                  <span className="text-gray-500">({product.totalReviews} đánh giá)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">Đã bán {(product.totalSold || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">{formatPrice(selectedVariant?.price || 0)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(selectedVariant?.originalPrice || 0)}</span>
                    <Badge variant="destructive">-{discount}%</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Storage Selection */}
            {storages.length > 1 && (
              <div>
                <h3 className="font-medium mb-3">Dung lượng</h3>
                <div className="flex flex-wrap gap-2">
                  {storages.map(storage => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${selectedStorage === storage ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-3">Màu sắc: <span className="text-primary">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => {
                  const variant = product.variants.find(v => v.storage === selectedStorage && v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${selectedColor === color ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: variant?.colorCode }} />
                      <span className="text-sm">{color}</span>
                      {selectedColor === color && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Số lượng</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">Còn {selectedVariant?.stock || 0} sản phẩm</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 h-14 text-lg" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Thêm vào giỏ
              </Button>
              <Button size="lg" variant="outline" className="h-14">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Promotions */}
            {product.promotions && product.promotions.length > 0 && (
              <div className="bg-white rounded-xl border p-4 space-y-3">
                <h3 className="font-semibold text-primary">🎁 Khuyến mãi</h3>
                {product.promotions.map((promo, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">{promo.title}</span>
                      {promo.description && <span className="text-gray-500"> - {promo.description}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Services */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-xl border">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-gray-600">Miễn phí giao hàng</p>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-gray-600">Bảo hành {product.warranty?.months || 12} tháng</p>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-gray-600">Đổi trả 30 ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
        <div className="mt-8 bg-white rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium">{spec.group}</div>
                {spec.items.map((item, i) => (
                  <div key={i} className="flex px-4 py-2 border-t">
                    <span className="w-1/2 text-gray-500">{item.label}</span>
                    <span className="w-1/2">{item.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mt-8 bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
