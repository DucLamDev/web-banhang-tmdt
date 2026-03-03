'use client';

import { useState } from 'react';
import { Mail, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      toast.success('Đăng ký nhận thông báo thành công! 🎉');
      setEmail('');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 rounded-2xl overflow-hidden">
      <div className="px-6 py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <Bell className="w-6 h-6" />
            <h2 className="text-xl font-bold">Nhận ưu đãi đặc biệt</h2>
          </div>
          <p className="text-white/80 text-sm max-w-sm">
            Đăng ký để nhận thông báo khuyến mãi hot, flash sale và sản phẩm mới nhất từ TGDD
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto min-w-0 md:min-w-[400px]">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn..."
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors whitespace-nowrap disabled:opacity-70"
          >
            {loading ? 'Đang gửi...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
}
