'use client';

import Link from 'next/link';
import { ChevronRight, Briefcase, MapPin, Clock, DollarSign, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const jobs = [
  { id: 1, title: 'Nhân viên tư vấn bán hàng', dept: 'Kinh doanh', location: 'TP.HCM, Hà Nội', type: 'Full-time', salary: '8-15 triệu/tháng', deadline: '31/03/2024' },
  { id: 2, title: 'Kỹ thuật viên bảo hành điện thoại', dept: 'Kỹ thuật', location: 'TP.HCM', type: 'Full-time', salary: '10-18 triệu/tháng', deadline: '31/03/2024' },
  { id: 3, title: 'Chuyên viên Marketing Online', dept: 'Marketing', location: 'TP.HCM (Remote)', type: 'Full-time', salary: '12-20 triệu/tháng', deadline: '15/04/2024' },
  { id: 4, title: 'Lập trình viên Frontend (React/Next.js)', dept: 'Công nghệ', location: 'Remote', type: 'Full-time', salary: '20-40 triệu/tháng', deadline: '30/04/2024' },
  { id: 5, title: 'Chuyên viên Chăm sóc khách hàng', dept: 'CSKH', location: 'TP.HCM', type: 'Full-time / Part-time', salary: '7-12 triệu/tháng', deadline: '30/04/2024' },
  { id: 6, title: 'Quản lý kho vận', dept: 'Logistics', location: 'TP.HCM', type: 'Full-time', salary: '12-18 triệu/tháng', deadline: '30/04/2024' },
];

const benefits = [
  { icon: DollarSign, title: 'Lương cạnh tranh', desc: 'Lương thỏa thuận theo năng lực + thưởng KPI hấp dẫn' },
  { icon: Heart, title: 'Bảo hiểm đầy đủ', desc: 'BHXH, BHYT, BHTN đầy đủ theo quy định pháp luật' },
  { icon: Clock, title: 'Làm việc linh hoạt', desc: 'Chính sách làm việc hybrid/remote với nhiều vị trí' },
  { icon: Users, title: 'Môi trường năng động', desc: 'Đội ngũ trẻ trung, sáng tạo, cơ hội thăng tiến rõ ràng' },
];

export default function RecruitmentPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Tuyển dụng</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">Cơ hội việc làm tại MiniShop</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Gia nhập đội ngũ hơn 500 nhân viên tâm huyết, cùng nhau xây dựng nền tảng mua sắm điện tử hàng đầu Việt Nam
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Tại sao chọn MiniShop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(b => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Listings */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Vị trí đang tuyển dụng ({jobs.length})</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{job.dept}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />{job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />{job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />{job.salary}
                      </span>
                      <span className="text-gray-400">Hạn: {job.deadline}</span>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary-600 whitespace-nowrap">
                    Ứng tuyển ngay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-white rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold mb-3">Không tìm thấy vị trí phù hợp?</h2>
          <p className="text-gray-500 mb-6">Gửi CV của bạn, chúng tôi sẽ liên hệ khi có vị trí phù hợp</p>
          <a href="mailto:tuyen-dung@minishop.vn">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Gửi CV đến tuyen-dung@minishop.vn
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
