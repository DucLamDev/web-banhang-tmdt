import axios from 'axios';

const API_URL = "https://web-banhang-tmdt-backend.onrender.com/api"
// const API_URL = "http://localhost:3001/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Product APIs
export const productApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getFlashSale: () => api.get('/products/flash-sale'),
  search: (keyword: string) => api.get('/products', { params: { search: keyword, limit: 50 } }),
};

// Category APIs
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getTree: () => api.get('/categories/tree'),
  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
};

// User APIs
export const userApi = {
  register: (data: { email: string; password: string; fullName: string; phone?: string }) =>
    api.post('/users/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/users/login', data),
  getMe: () => api.get('/users/me'),
  updateProfile: (data: { fullName?: string; phone?: string; avatar?: string }) =>
    api.put('/users/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/password', data),
  getAddresses: () => api.get('/users/me'),
  addAddress: (data: Record<string, unknown>) => api.post('/users/addresses', data),
  updateAddress: (addressId: string, data: Record<string, unknown>) =>
    api.put(`/users/addresses/${addressId}`, data),
  deleteAddress: (addressId: string) => api.delete(`/users/addresses/${addressId}`),
  getWishlist: () => api.get('/users/wishlist'),
  toggleWishlist: (productId: string) => api.post(`/users/wishlist/${productId}`),
  removeWishlist: (productId: string) => api.delete(`/users/wishlist/${productId}`),
  googleLogin: (credential: string) => api.post('/users/google-login', { credential }),
};

// Cart APIs
export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (data: { productId: string; variantSku: string; quantity?: number }) =>
    api.post('/cart/items', data),
  updateItem: (itemId: string, data: { quantity: number }) =>
    api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  applyVoucher: (code: string) => api.post('/cart/voucher', { code }),
  removeVoucher: () => api.delete('/cart/voucher'),
  clear: () => api.delete('/cart'),
};

// Order APIs
export const orderApi = {
  create: (data: Record<string, unknown>) => api.post('/orders', data),
  getMyOrders: (params?: Record<string, unknown>) => api.get('/orders/my-orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  tracking: (orderNumber: string) => api.get(`/orders/tracking/${orderNumber}`),
  cancel: (id: string, reason?: string) => api.put(`/orders/${id}/cancel`, { reason }),
};

// Admin APIs
export const adminApi = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  // Orders
  getOrders: (params?: Record<string, unknown>) => api.get('/orders', { params }),
  updateOrderStatus: (id: string, data: { status: string; note?: string }) => api.put(`/orders/${id}/status`, data),
  // Products
  getProducts: (params?: Record<string, unknown>) => api.get('/products', { params: { ...params, includeInactive: true } }),
  createProduct: (data: Record<string, unknown>) => api.post('/products', data),
  updateProduct: (id: string, data: Record<string, unknown>) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  // Categories
  createCategory: (data: Record<string, unknown>) => api.post('/categories', data),
  updateCategory: (id: string, data: Record<string, unknown>) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
  // Users
  getUsers: () => api.get('/users'),
  toggleUserStatus: (id: string) => api.put(`/users/${id}/toggle-status`),
  // Vouchers
  getVouchers: () => api.get('/vouchers'),
  createVoucher: (data: Record<string, unknown>) => api.post('/vouchers', data),
  updateVoucher: (id: string, data: Record<string, unknown>) => api.put(`/vouchers/${id}`, data),
  deleteVoucher: (id: string) => api.delete(`/vouchers/${id}`),
};

// Chat APIs
export const chatApi = {
  createSession: () => api.post('/chat/session'),
  getSession: (sessionId: string) => api.get(`/chat/session/${sessionId}`),
  getHistory: (params?: Record<string, unknown>) => api.get('/chat/history', { params }),
  requestAdmin: (sessionId: string, reason?: string) =>
    api.post(`/chat/session/${sessionId}/request-admin`, { reason }),
  closeSession: (sessionId: string) => api.post(`/chat/session/${sessionId}/close`),
};

// Banner APIs
export const bannerApi = {
  getAll: (position?: string) => api.get('/banners', { params: { position } }),
};

export default api;
