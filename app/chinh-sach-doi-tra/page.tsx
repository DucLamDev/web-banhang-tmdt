'use client';

import Link from 'next/link';
import { ChevronRight, RotateCcw, CheckCircle, XCircle, Phone, Clock, AlertTriangle } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Chính sách đổi trả</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <RotateCcw className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-3">Chính sách đổi trả</h1>
          <p className="text-secondary-100">Đổi trả dễ dàng, hoàn tiền nhanh chóng trong vòng 30 ngày</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="space-y-6">

          {/* Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '30', label: 'ngày', desc: 'Đổi mới không lý do' },
              { icon: '7', label: 'ngày', desc: 'Hoàn tiền toàn bộ' },
              { icon: '100%', label: '', desc: 'Hoàn tiền nếu hàng lỗi' },
            ].map(item => (
              <div key={item.desc} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold text-primary">{item.icon}<span className="text-lg ml-1">{item.label}</span></p>
                <p className="text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Điều kiện đổi trả</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Được đổi/trả khi
                </h3>
                <ul className="space-y-2">
                  {[
                    'Sản phẩm bị lỗi, hỏng khi nhận',
                    'Giao sai sản phẩm, màu sắc, dung lượng',
                    'Sản phẩm không đúng mô tả',
                    'Trong vòng 30 ngày kể từ ngày mua',
                    'Còn đủ phụ kiện, hộp, tem nguyên vẹn',
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
                  <XCircle className="w-5 h-5" /> Không áp dụng khi
                </h3>
                <ul className="space-y-2">
                  {[
                    'Quá 30 ngày kể từ ngày mua',
                    'Sản phẩm đã bị trầy xước, hư hỏng',
                    'Thiếu phụ kiện, hộp, hóa đơn',
                    'Sản phẩm đã kích hoạt bảo hành',
                    'Lỗi do người dùng gây ra',
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
            <h2 className="text-xl font-bold mb-4">Quy trình đổi trả</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Liên hệ MiniShop', desc: 'Gọi hotline 1900 1234 hoặc chat trực tiếp để thông báo yêu cầu đổi/trả' },
                { step: '2', title: 'Gửi sản phẩm về', desc: 'Đóng gói sản phẩm cẩn thận, gửi về địa chỉ kho MiniShop (miễn phí vận chuyển)' },
                { step: '3', title: 'Kiểm tra sản phẩm', desc: 'Đội ngũ kỹ thuật kiểm tra trong vòng 1-2 ngày làm việc' },
                { step: '4', title: 'Đổi mới/Hoàn tiền', desc: 'Giao sản phẩm mới trong 2-3 ngày hoặc hoàn tiền trong 3-5 ngày làm việc' },
              ].map(step => (
                <div key={step.step} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="text-gray-500 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Chi phí vận chuyển đổi/trả do MiniShop chịu nếu lỗi từ chúng tôi</li>
                  <li>• Khách hàng chịu chi phí vận chuyển nếu đổi do không vừa ý</li>
                  <li>• Hoàn tiền về phương thức thanh toán ban đầu trong vòng 5-7 ngày</li>
                  <li>• Liên hệ hotline trước khi gửi hàng để được hỗ trợ tốt nhất</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
