'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Star, Heart, ShoppingCart, Shield, Truck, RotateCcw, ChevronRight, Minus, Plus, Check, Loader2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useAuthStore, useUIStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { productApi, userApi, voucherApi } from '@/lib/api';
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
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
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

interface PublicVoucher {
  _id: string;
  code: string;
  description: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
}

type WarrantyOption = 'standard' | 'accidental';


export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyOption>('standard');
  const [availableVouchers, setAvailableVouchers] = useState<PublicVoucher[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const { addItem, appliedVoucher, applyVoucher, removeVoucher } = useCartStore();
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

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!product?.category?.slug) {
        setAvailableVouchers([]);
        return;
      }

      try {
        const response = await voucherApi.getPublic({
          displayLocation: 'product_detail',
          categorySlug: product.category.slug,
        });
        setAvailableVouchers(response.data || []);
      } catch {
        setAvailableVouchers([]);
      }
    };

    fetchVouchers();
  }, [product?.category?.slug]);

  const getDiscountAmount = (voucher: PublicVoucher | null, subtotal: number) => {
    if (!voucher || subtotal < voucher.minOrderValue) return 0;

    let discountValue = voucher.type === 'percent'
      ? subtotal * (voucher.value / 100)
      : voucher.value;

    if (voucher.maxDiscount && discountValue > voucher.maxDiscount) {
      discountValue = voucher.maxDiscount;
    }

    return Math.max(0, discountValue);
  };

  const handleApplyVoucher = (code?: string) => {
    const normalizedCode = (code || voucherCode).trim().toUpperCase();
    if (!normalizedCode) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    const voucher = availableVouchers.find((item) => item.code === normalizedCode);
    if (!voucher) {
      toast.error('Mã giảm giá không hợp lệ hoặc không áp dụng cho sản phẩm này');
      return;
    }

    const subtotal = (selectedVariant?.price || 0) * quantity;
    if (subtotal < voucher.minOrderValue) {
      toast.error(`Đơn tối thiểu ${formatPrice(voucher.minOrderValue)} để dùng mã này`);
      return;
    }

    applyVoucher({
      code: voucher.code,
      description: voucher.description,
      type: voucher.type,
      value: voucher.value,
      minOrderValue: voucher.minOrderValue,
      maxDiscount: voucher.maxDiscount,
    });
    setVoucherCode(voucher.code);
    toast.success(`Đã áp dụng mã ${voucher.code}`);
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập!'); openLoginModal(); return; }
    if (!product) return;
    try {
      await userApi.toggleWishlist(product._id);
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích!');
    } catch { toast.error('Có lỗi xảy ra'); }
  };

  const handleBuyNow = () => {
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
    router.push('/thanh-toan');
  };

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
  const lineSubtotal = (selectedVariant?.price || 0) * quantity;
  const currentVoucher = appliedVoucher && availableVouchers.some((voucher) => voucher.code === appliedVoucher.code)
    ? {
        _id: appliedVoucher.code,
        code: appliedVoucher.code,
        description: appliedVoucher.description || '',
        type: appliedVoucher.type,
        value: appliedVoucher.value,
        minOrderValue: appliedVoucher.minOrderValue,
        maxDiscount: appliedVoucher.maxDiscount,
      }
    : null;
  const voucherDiscount = currentVoucher ? getDiscountAmount(currentVoucher, lineSubtotal) : 0;
  const finalPrice = Math.max(0, lineSubtotal - voucherDiscount);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 md:py-3">
          <nav className="flex items-center gap-1 md:gap-2 text-xs md:text-sm overflow-x-auto whitespace-nowrap">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
            <Link href="/danh-muc/laptop" className="text-gray-500 hover:text-primary">Laptop</Link>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 truncate max-w-[150px] md:max-w-none">{product.brand}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6 pb-24 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left: Images */}
          <div className="lg:col-span-5 space-y-3 md:space-y-4">
            <div className="bg-white rounded-xl p-3 md:p-4 border">
              <div className="relative w-full h-[250px] md:h-[360px]">
                <Image
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedImage === idx ? 'ring-2 ring-primary border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image src={img} alt="" fill className="object-contain p-1" sizes="80px" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Store commitments - fills blank space below image */}
            <div className="hidden lg:block bg-white rounded-xl border p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Cam kết của MiniShop
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Hàng chính hãng 100%</p>
                    <p className="text-xs text-gray-500">Xuất xứ rõ ràng, tem chính hãng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Giao hàng nhanh toàn quốc</p>
                    <p className="text-xs text-gray-500">Giao trong 2 giờ nội thành</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Đổi trả 30 ngày dễ dàng</p>
                    <p className="text-xs text-gray-500">Hoàn tiền nếu không đúng mô tả</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Bảo hành tại MiniShop</p>
                    <p className="text-xs text-gray-500">{product.warranty?.months || 12} tháng bảo hành chính hãng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Purchase Section */}
          <div className="lg:col-span-7 space-y-3 md:space-y-4">
            <div>
              {product.badges && product.badges.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  {product.badges.map((badge, idx) => (
                    <Badge key={idx} style={{ backgroundColor: badge.bgColor, color: badge.color }}>{badge.text}</Badge>
                  ))}
                </div>
              )}
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
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

            {/* Price Box */}
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-secondary">{formatPrice(finalPrice)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice((selectedVariant?.originalPrice || 0) * quantity)}</span>
                    <Badge className="bg-secondary text-white">-{discount}%</Badge>
                  </>
                )}
              </div>
              {voucherDiscount > 0 && currentVoucher && (
                <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm text-green-700">
                  <Tag className="w-4 h-4" />
                  <span>Đã áp dụng {currentVoucher.code} - giảm {formatPrice(voucherDiscount)}</span>
                </div>
              )}
              {quantity > 1 && (
                <p className="text-sm text-gray-500">Đơn giá: {formatPrice(selectedVariant?.price || 0)} × {quantity}</p>
              )}
            </div>

            {/* Voucher area */}
            {availableVouchers.length > 0 && (
              <div className="bg-white rounded-xl border p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Mã giảm giá áp dụng cho {product.category?.name?.toLowerCase() || 'sản phẩm'}
                  </h3>
                  {appliedVoucher && (
                    <button
                      onClick={() => {
                        removeVoucher();
                        setVoucherCode('');
                        toast.success('Đã bỏ mã giảm giá');
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Bỏ mã
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button variant="outline" onClick={() => handleApplyVoucher()}>
                    Áp mã
                  </Button>
                </div>

                <div className="space-y-2">
                  {availableVouchers.map((voucher, idx) => {
                    const previewDiscount = getDiscountAmount(voucher, lineSubtotal);

                    return (
                      <div key={voucher._id || voucher.code} className={`rounded-xl border p-3 ${idx % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' : 'bg-gradient-to-r from-primary/5 to-emerald-50 border-primary/20'}`}>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleApplyVoucher(voucher.code)}
                            className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap"
                          >
                            {voucher.code}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">{voucher.description || 'Mã giảm giá cho sản phẩm này'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {voucher.type === 'percent' ? `Giảm ${voucher.value}%` : `Giảm ${formatPrice(voucher.value)}`}
                              {voucher.maxDiscount ? ` · Tối đa ${formatPrice(voucher.maxDiscount)}` : ''}
                              {voucher.minOrderValue > 0 ? ` · Đơn từ ${formatPrice(voucher.minOrderValue)}` : ''}
                            </p>
                            {previewDiscount > 0 && (
                              <p className="text-xs text-green-600 mt-1">Tiết kiệm ngay {formatPrice(previewDiscount)} với cấu hình hiện tại</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

            {/* Warranty Options */}
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Chọn 1 trong các khuyến mãi:
              </h3>
              <div className="space-y-2">
                <label className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${selectedWarranty === 'standard' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="warranty"
                    checked={selectedWarranty === 'standard'}
                    onChange={() => setSelectedWarranty('standard')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Bảo hành theo nhà sản xuất - 24 tháng</p>
                    <p className={`text-sm font-bold ${selectedWarranty === 'standard' ? 'text-secondary' : 'text-gray-600'}`}>14.990.000₫</p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${selectedWarranty === 'accidental' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="warranty"
                    checked={selectedWarranty === 'accidental'}
                    onChange={() => setSelectedWarranty('accidental')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Kèm gói bảo hiểm rơi vỡ - 6 tháng</p>
                    <p className={`text-sm ${selectedWarranty === 'accidental' ? 'text-secondary font-bold' : 'text-gray-600'}`}>15.877.000₫</p>
                    <p className="text-xs text-gray-500">MIỄN PHÍ sửa chữa hoặc ĐỔI MỚI nếu hư hỏng (Khách hàng bù 25%)</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Promotion Details */}
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3 text-primary">🎁 Khuyến mãi trị giá 2.190.000₫</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p>Giảm ngay 700.000₫</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p>Tặng Microsoft 365 Personal</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p>Tặng PMH 100.000₫ mua bàn,túi chống sốc</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p>Tặng Phiếu mua hàng trị giá 300.000₫ Áp dụng mua Máy in</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <p>Tặng Phiếu mua hàng Màn hình máy tính trị giá 300.000₫</p>
                </div>
              </div>
            </div>

            {/* Actions - hidden on mobile (shown in sticky bar) */}
            <div className="hidden md:flex gap-3">
              <Button size="lg" className="flex-1 h-14 text-lg bg-secondary hover:bg-secondary-600" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Thêm vào giỏ
              </Button>
              <Button size="lg" className="flex-1 h-14 text-lg bg-primary hover:bg-primary-600" onClick={handleBuyNow}>
                Mua ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`h-14 w-14 flex-shrink-0 flex flex-col gap-0.5 border-2 transition-colors ${
                  isWishlisted ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-300 hover:text-red-400'
                }`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </Button>
            </div>


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

      {/* Mobile sticky CTA - above bottom nav */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 px-3 py-2.5 flex gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <button
          onClick={handleToggleWishlist}
          className="w-11 h-11 flex-shrink-0 rounded-xl border-2 border-gray-200 flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-secondary text-secondary' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 h-11 rounded-xl bg-secondary text-white font-semibold text-sm flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 h-11 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}
