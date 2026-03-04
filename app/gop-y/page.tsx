'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, MessageSquare, Send, CheckCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '', type: 'feedback' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.message) { toast.error('Vui lòng điền đầy đủ thông tin'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">Gửi thành công!</h2>
          <p className="text-gray-500 mb-6 max-w-sm">Cảm ơn bạn đã góp ý. Chúng tôi sẽ xem xét và phản hồi trong vòng 24 giờ.</p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary-600">Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">Gửi góp ý, khiếu nại</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Kênh hỗ trợ</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Hotline</p>
                    <a href="tel:19001234" className="text-primary font-bold">1900 1234</a>
                    <p className="text-xs text-gray-500">8:00 - 22:00 hàng ngày</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:support@minishop.vn" className="text-primary text-sm">support@minishop.vn</a>
                    <p className="text-xs text-gray-500">Phản hồi trong 24h</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3">
                  <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Chat trực tiếp</p>
                    <p className="text-sm text-gray-500">Nhấn biểu tượng chat</p>
                    <p className="text-xs text-gray-500">ở góc phải màn hình</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Gửi góp ý / Khiếu nại</h1>
                  <p className="text-sm text-gray-500">Chúng tôi luôn lắng nghe bạn</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                    <Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0901234567" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại phản hồi</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="feedback">Góp ý chung</option>
                    <option value="complaint">Khiếu nại sản phẩm</option>
                    <option value="delivery">Khiếu nại giao hàng</option>
                    <option value="refund">Yêu cầu hoàn tiền</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Tiêu đề ngắn gọn về vấn đề của bạn" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Mô tả chi tiết vấn đề, góp ý hoặc khiếu nại của bạn..."
                    rows={6}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={loading}>
                  {loading ? 'Đang gửi...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Gửi phản hồi
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
