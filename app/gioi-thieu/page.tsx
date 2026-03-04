'use client';

import Link from 'next/link';
import { ChevronRight, ShoppingBag, Users, Shield, Truck, Star, Award } from 'lucide-react';

const milestones = [
  { year: '2020', title: 'Thành lập MiniShop', desc: 'Ra mắt nền tảng mua sắm trực tuyến đầu tiên' },
  { year: '2021', title: 'Mở rộng danh mục', desc: 'Bổ sung Laptop, Tablet và Phụ kiện chính hãng' },
  { year: '2022', title: '100.000 khách hàng', desc: 'Chạm mốc 100.000 khách hàng tin tưởng' },
  { year: '2023', title: 'Nâng cấp dịch vụ', desc: 'Triển khai giao hàng 2 giờ tại TP.HCM và Hà Nội' },
  { year: '2024', title: 'Phủ sóng toàn quốc', desc: 'Giao hàng toàn quốc với mạng lưới đối tác vận chuyển' },
];

const values = [
  { icon: Shield, title: 'Hàng chính hãng 100%', desc: 'Cam kết chỉ bán sản phẩm chính hãng từ các nhà phân phối uy tín' },
  { icon: Truck, title: 'Giao hàng nhanh chóng', desc: 'Giao hàng trong 2-4 giờ tại nội thành, toàn quốc 1-3 ngày' },
  { icon: Star, title: 'Giá cả cạnh tranh', desc: 'Cam kết hoàn tiền nếu tìm được giá thấp hơn tại nơi khác' },
  { icon: Users, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi' },
  { icon: Award, title: 'Bảo hành chính hãng', desc: 'Bảo hành theo đúng quy định của nhà sản xuất, đổi mới trong 30 ngày' },
  { icon: ShoppingBag, title: 'Mua sắm dễ dàng', desc: 'Giao diện thân thiện, thanh toán đa dạng, trải nghiệm mượt mà' },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Giới thiệu MiniShop</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Về MiniShop</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Hệ thống mua sắm điện tử trực tuyến uy tín, chính hãng, giá tốt nhất Việt Nam
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission */}
        <div className="bg-white rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            MiniShop ra đời với sứ mệnh mang đến cho người tiêu dùng Việt Nam những sản phẩm công nghệ chính hãng 
            với giá cả tốt nhất, dịch vụ hoàn hảo nhất. Chúng tôi tin rằng mọi người đều xứng đáng được trải nghiệm 
            những sản phẩm chất lượng mà không phải lo lắng về nguồn gốc hay giá cả.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Với đội ngũ hơn 500 nhân viên tâm huyết, chúng tôi không ngừng cải tiến để mang lại 
            trải nghiệm mua sắm tốt nhất cho hàng triệu khách hàng trên khắp Việt Nam.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { number: '500K+', label: 'Khách hàng tin tưởng' },
            { number: '10K+', label: 'Sản phẩm chính hãng' },
            { number: '63', label: 'Tỉnh thành giao hàng' },
            { number: '99%', label: 'Khách hàng hài lòng' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Hành trình phát triển</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-8">
              {milestones.map((m, idx) => (
                <div key={m.year} className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-md">
                    <span className="text-white font-bold text-xs">{m.year}</span>
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="font-bold text-gray-900 text-lg">{m.title}</h3>
                    <p className="text-gray-500 mt-1">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
