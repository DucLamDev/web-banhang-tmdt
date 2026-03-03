'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { userApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: '',
  });

  const { setAuth } = useAuthStore();
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const scriptId = 'google-gsi-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [isOpen]);

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('Google login chưa được cấu hình. Vui lòng dùng email/mật khẩu.');
      return;
    }
    if (!window.google) {
      toast.error('Đang tải Google SDK, vui lòng thử lại.');
      return;
    }
    setGoogleLoading(true);
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        try {
          const res = await userApi.googleLogin(response.credential);
          const { user, token } = res.data;
          setAuth(user, token);
          toast.success('Đăng nhập Google thành công!');
          onClose();
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || 'Đăng nhập Google thất bại');
        } finally {
          setGoogleLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await userApi.login({
          email: formData.email,
          password: formData.password,
        });
        
        const { user, token } = response.data;
        setAuth(user, token);
        toast.success('Đăng nhập thành công!');
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
        }

        const response = await userApi.register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
        });

        const { user, token } = response.data;
        setAuth(user, token);
        toast.success('Đăng ký thành công!');
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phone: '',
      confirmPassword: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <Input
                  type="text"
                  placeholder="Nhập họ tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required={!isLogin}
                minLength={6}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-600 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">HOẶC</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-50 flex items-center gap-3"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span>Tiếp tục với Google</span>
        </Button>

        <div className="mt-3 text-center text-sm">
          {isLogin ? (
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => {
                  setIsLogin(false);
                  resetForm();
                }}
                className="text-primary hover:underline font-medium"
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <button
                onClick={() => {
                  setIsLogin(true);
                  resetForm();
                }}
                className="text-primary hover:underline font-medium"
              >
                Đăng nhập
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
