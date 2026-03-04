import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Tổng đài hỗ trợ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-600">Gọi mua: </span>
                <a href="tel:19001234" className="text-primary font-medium">1900 1234</a>
                <span className="text-gray-400">(8:00 - 22:00)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-600">Khiếu nại: </span>
                <a href="tel:19005678" className="text-primary font-medium">1900 5678</a>
                <span className="text-gray-400">(8:00 - 22:00)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-600">Email: </span>
                <a href="mailto:support@minishop.vn" className="text-primary font-medium">support@minishop.vn</a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Về công ty</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gioi-thieu" className="text-gray-600 hover:text-primary">
                  Giới thiệu MiniShop
                </Link>
              </li>
              <li>
                <Link href="/tuyen-dung" className="text-gray-600 hover:text-primary">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/gop-y" className="text-gray-600 hover:text-primary">
                  Gửi góp ý, khiếu nại
                </Link>
              </li>
              <li>
                <Link href="/he-thong-cua-hang" className="text-gray-600 hover:text-primary">
                  Hệ thống cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chinh-sach-bao-hanh" className="text-gray-600 hover:text-primary">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="text-gray-600 hover:text-primary">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-thanh-toan" className="text-gray-600 hover:text-primary">
                  Chính sách thanh toán
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-van-chuyen" className="text-gray-600 hover:text-primary">
                  Chính sách vận chuyển
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Kết nối với chúng tôi</h3>
            <p className="text-sm text-gray-600 mb-4">
              Theo dõi MiniShop để cập nhật tin tức và khuyến mãi mới nhất
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-700 transition-colors">
                <Facebook className="w-8 h-8" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary-700 transition-colors">
                <Youtube className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          <p>© 2024 MiniShop. All rights reserved.</p>
          <p className="mt-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.Hồ Chí Minh
          </p>
          <p className="mt-1">
            Điện thoại: 1900 1234 | Email: support@minishop.vn
          </p>
        </div>
      </div>
    </footer>
  );
}
