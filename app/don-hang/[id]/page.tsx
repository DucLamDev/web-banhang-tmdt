'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Loader2, MapPin, Package, CreditCard, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { orderApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  product?: string;
  name: string;
  thumbnail?: string;
  variant?: {
    name?: string;
    color?: string;
    storage?: string;
    sku?: string;
  };
  price: number;
  quantity: number;
}

interface StatusHistory {
  status: string;
  note?: string;
  updatedAt: string;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  paymentMethod: string;
  paymentStatus?: string;
  status: string;
  note?: string;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward?: string;
    street: string;
  };
  statusHistory?: StatusHistory[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  processing: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700', icon: Package },
  shipping: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const paymentMethodLabels: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  banking: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
};

export default function OrderDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await orderApi.getById(params.id as string);
        setOrder(res.data.order || res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Không tải được chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [isAuthenticated, params.id]);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-6">Đăng nhập để xem chi tiết đơn hàng của bạn</p>
          <Link href="/">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/don-hang" className="text-gray-500 hover:text-primary">Đơn hàng của tôi</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">Chi tiết đơn hàng</span>
        </nav>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !order ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-500 mb-6">{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền xem.'}</p>
            <Link href="/don-hang">
              <Button>Quay lại danh sách đơn hàng</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">#{order.orderNumber}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Đặt lúc {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  {(() => {
                    const status = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700', icon: Package };
                    const StatusIcon = status.icon;
                    return (
                      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Sản phẩm trong đơn
                  </h2>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="flex gap-4 border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {item.thumbnail ? (
                            <Image src={item.thumbnail} alt={item.name} width={80} height={80} className="w-full h-full object-contain p-1" />
                          ) : (
                            <Package className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {[item.variant?.name, item.variant?.storage, item.variant?.color].filter(Boolean).join(' - ') || 'Phiên bản tiêu chuẩn'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                          <p className="text-sm text-gray-500 mt-1">Thành tiền: {formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Thông tin giao hàng
                  </h2>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><span className="font-medium">Người nhận:</span> {order.shippingAddress?.fullName || '-'}</p>
                    <p><span className="font-medium">Số điện thoại:</span> {order.shippingAddress?.phone || '-'}</p>
                    <p>
                      <span className="font-medium">Địa chỉ:</span>{' '}
                      {[order.shippingAddress?.street, order.shippingAddress?.ward, order.shippingAddress?.district, order.shippingAddress?.province]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </p>
                    {order.note && <p><span className="font-medium">Ghi chú:</span> {order.note}</p>}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">Lịch sử trạng thái</h2>
                  <div className="space-y-4">
                    {(order.statusHistory && order.statusHistory.length > 0 ? order.statusHistory : [{ status: order.status, note: 'Đơn hàng hiện tại', updatedAt: order.createdAt }])
                      .slice()
                      .reverse()
                      .map((entry, index) => {
                        const status = statusConfig[entry.status] || { label: entry.status, color: 'bg-gray-100 text-gray-700', icon: Package };
                        const StatusIcon = status.icon;
                        return (
                          <div key={`${entry.status}-${index}`} className="flex gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">{status.label}</p>
                              <p className="text-sm text-gray-500">{entry.note || 'Cập nhật trạng thái đơn hàng'}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(entry.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Thanh toán
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phương thức</span>
                      <span className="font-medium">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tạm tính</span>
                      <span>{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phí vận chuyển</span>
                      <span>{formatPrice(order.shippingFee || 0)}</span>
                    </div>
                    {!!order.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span>-{formatPrice(order.discount || 0)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/don-hang">
                  <Button variant="outline" className="w-full">Quay lại đơn hàng của tôi</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
