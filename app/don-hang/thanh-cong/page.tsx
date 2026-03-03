'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'TG00000000';

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
        </p>

        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-medium">Mã đơn hàng</span>
          </div>
          <p className="text-2xl font-bold text-primary">{orderNumber}</p>
          <p className="text-sm text-gray-500 mt-2">
            Bạn có thể sử dụng mã này để tra cứu đơn hàng
          </p>
        </div>

        <div className="space-y-3">
          <Link href={`/don-hang/tra-cuu?order=${orderNumber}`}>
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Theo dõi đơn hàng
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
          <p className="font-medium mb-1">📞 Hotline hỗ trợ: 1800 1234</p>
          <p>Gọi miễn phí từ 8h - 22h mỗi ngày</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
