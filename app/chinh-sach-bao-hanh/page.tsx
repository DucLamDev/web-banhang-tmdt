'use client';

import Link from 'next/link';
import { ChevronRight, Shield, CheckCircle, XCircle, Phone, Clock } from 'lucide-react';

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Chính sách bảo hành</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-3">Chính sách bảo hành</h1>
          <p className="text-primary-100">Cam kết bảo hành chính hãng, bảo vệ quyền lợi khách hàng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="space-y-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Thời gian bảo hành
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { category: 'Điện thoại', time: '12 - 24 tháng' },
                { category: 'Laptop', time: '12 - 24 tháng' },
                { category: 'Tablet', time: '12 - 24 tháng' },
                { category: 'Smartwatch', time: '12 tháng' },
                { category: 'Tai nghe / Loa', time: '12 tháng' },
                { category: 'Phụ kiện', time: '3 - 6 tháng' },
              ].map(item => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">{item.category}</span>
                  <span className="text-primary font-bold">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Điều kiện bảo hành
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Được bảo hành khi
                </h3>
                <ul className="space-y-2">
                  {[
                    'Sản phẩm bị lỗi do nhà sản xuất',
                    'Hỏng hóc không do tác động ngoại lực',
                    'Còn trong thời hạn bảo hành',
                    'Có phiếu bảo hành hoặc hóa đơn mua hàng',
                    'Tem niêm phong còn nguyên vẹn',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Không được bảo hành khi
                </h3>
                <ul className="space-y-2">
                  {[
                    'Sản phẩm bị vỡ, nứt màn hình',
                    'Hư hỏng do nước, ẩm ướt',
                    'Tem bảo hành bị rách hoặc can thiệp',
                    'Sản phẩm đã qua sửa chữa bên ngoài',
                    'Hao mòn tự nhiên theo thời gian',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Quy trình bảo hành
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              {[
                { step: '1', title: 'Tiếp nhận', desc: 'Mang sản phẩm đến cửa hàng hoặc gọi hotline để được hỗ trợ' },
                { step: '2', title: 'Kiểm tra', desc: 'Kỹ thuật viên kiểm tra và xác định lỗi sản phẩm' },
                { step: '3', title: 'Xử lý', desc: 'Sửa chữa hoặc đổi sản phẩm mới nếu không sửa được' },
                { step: '4', title: 'Hoàn trả', desc: 'Nhận lại sản phẩm trong vòng 7-14 ngày làm việc' },
              ].map(step => (
                <div key={step.step} className="flex-1 text-center p-4 bg-primary/5 rounded-xl">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-primary">Liên hệ bảo hành</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Hotline bảo hành</p>
                  <p className="text-primary font-bold">1900 5678</p>
                  <p className="text-sm text-gray-500">(8:00 - 22:00 hàng ngày)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Thời gian xử lý</p>
                  <p className="text-gray-700">7 - 14 ngày làm việc</p>
                  <p className="text-sm text-gray-500">Tùy theo tình trạng sản phẩm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
