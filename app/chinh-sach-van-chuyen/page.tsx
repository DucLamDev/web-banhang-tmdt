'use client';

import Link from 'next/link';
import { ChevronRight, Truck, Clock, MapPin, Package } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Chính sách vận chuyển</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Truck className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-3">Chính sách vận chuyển</h1>
          <p className="text-primary-100">Giao hàng nhanh, đúng hẹn, an toàn trên toàn quốc</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="space-y-6">

          {/* Delivery Times */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Thời gian giao hàng
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="text-left p-3 rounded-l-lg font-semibold">Khu vực</th>
                    <th className="text-left p-3 font-semibold">Thời gian</th>
                    <th className="text-left p-3 font-semibold">Phí ship</th>
                    <th className="text-left p-3 rounded-r-lg font-semibold">Miễn phí từ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { area: 'Nội thành TP.HCM, Hà Nội', time: '2-4 giờ', fee: '20.000đ', free: '500.000đ' },
                    { area: 'Tỉnh thành lân cận', time: '1-2 ngày', fee: '30.000đ', free: '1.000.000đ' },
                    { area: 'Tỉnh xa, vùng sâu vùng xa', time: '3-5 ngày', fee: '40.000đ', free: '2.000.000đ' },
                    { area: 'Hải đảo, vùng đặc biệt', time: '5-7 ngày', fee: 'Liên hệ', free: 'Liên hệ' },
                  ].map(row => (
                    <tr key={row.area} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{row.area}</td>
                      <td className="p-3 text-primary font-semibold">{row.time}</td>
                      <td className="p-3 text-gray-600">{row.fee}</td>
                      <td className="p-3 text-green-600 font-medium">{row.free}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Carriers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Đơn vị vận chuyển</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['GHN', 'GHTK', 'Viettel Post', 'J&T Express'].map(carrier => (
                <div key={carrier} className="border rounded-xl p-4 text-center hover:border-primary transition-colors">
                  <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">{carrier}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Điều khoản vận chuyển</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>• Thời gian giao hàng tính từ khi đơn hàng được xác nhận thành công.</p>
              <p>• Miễn phí vận chuyển cho đơn hàng đạt giá trị tối thiểu theo khu vực (áp dụng hàng ngày).</p>
              <p>• Đơn hàng được đóng gói cẩn thận, có chống sốc đặc biệt cho các sản phẩm điện tử.</p>
              <p>• Kiểm tra hàng trước khi ký nhận, từ chối nhận nếu hàng có dấu hiệu bị mở/hỏng.</p>
              <p>• MiniShop bồi thường 100% giá trị đơn hàng nếu mất hàng trong quá trình vận chuyển.</p>
              <p>• Giao hàng thất bại 2 lần, đơn sẽ bị hủy và hoàn tiền trong vòng 3-5 ngày làm việc.</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Theo dõi đơn hàng</h2>
            </div>
            <p className="text-gray-600 mb-4">Bạn có thể theo dõi trạng thái đơn hàng theo các cách sau:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/don-hang/tra-cuu" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition-shadow">
                <Package className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">Tra cứu đơn hàng online</span>
              </Link>
              <a href="tel:19001234" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition-shadow">
                <Truck className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">Gọi hotline 1900 1234</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
