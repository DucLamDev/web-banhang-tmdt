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
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Gọi mua: </span>
                <a href="tel:19002460" className="text-blue-600 font-medium">1900 232 460</a>
                <span className="text-gray-400">(8:00 - 21:30)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Khiếu nại: </span>
                <a href="tel:18001062" className="text-blue-600 font-medium">1800.1062</a>
                <span className="text-gray-400">(8:00 - 21:30)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Bảo hành: </span>
                <a href="tel:19002464" className="text-blue-600 font-medium">1900 232 464</a>
                <span className="text-gray-400">(8:00 - 21:00)</span>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Về công ty</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gioi-thieu" className="text-gray-600 hover:text-blue-600">
                  Giới thiệu công ty (MWG.vn)
                </Link>
              </li>
              <li>
                <Link href="/tuyen-dung" className="text-gray-600 hover:text-blue-600">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/gop-y" className="text-gray-600 hover:text-blue-600">
                  Gửi góp ý, khiếu nại
                </Link>
              </li>
              <li>
                <Link href="/he-thong-cua-hang" className="text-gray-600 hover:text-blue-600">
                  Tìm siêu thị (2.956 shop)
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Thông tin khác</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tich-diem" className="text-gray-600 hover:text-blue-600">
                  Tích điểm Quà tặng VIP
                </Link>
              </li>
              <li>
                <Link href="/lich-su-mua-hang" className="text-gray-600 hover:text-blue-600">
                  Lịch sử mua hàng
                </Link>
              </li>
              <li>
                <Link href="/tra-cham" className="text-gray-600 hover:text-blue-600">
                  Tìm hiểu về mua trả chậm
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-hanh" className="text-gray-600 hover:text-blue-600">
                  Chính sách bảo hành
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Website cùng tập đoàn</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">topzone</span>
              <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">dienmayxanh</span>
              <span className="px-3 py-1 bg-green-700 text-white text-xs rounded-full">bachhoaxanh</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                <Facebook className="w-8 h-8" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                <Youtube className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          <p>© 2018. Công Ty Cổ Phần Đầu Tư Điện Máy Xanh.</p>
          <p className="mt-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Địa chỉ: 128 Trần Quang Khải, P.Tân Định, TP.Hồ Chí Minh
          </p>
          <p className="mt-1">
            Điện thoại: 028 38125960 | Email: hotrotmdt@thegioididong.com
          </p>
        </div>
      </div>
    </footer>
  );
}
