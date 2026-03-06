import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  avatar?: string;
  vipPoints: number;
}

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    thumbnail: string;
    brand: string;
  };
  variant: {
    sku: string;
    name: string;
    color: string;
    storage: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  voucher?: {
    code: string;
    discount: number;
  };
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface SimpleCartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  variant: string;
  variantSku: string;
  price: number;
  quantity: number;
}

interface AppliedVoucher {
  code: string;
  description?: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
}

interface CartStore {
  cart: CartState;
  items: SimpleCartItem[];
  appliedVoucher: AppliedVoucher | null;
  setCart: (cart: CartState) => void;
  addItem: (item: SimpleCartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyVoucher: (voucher: AppliedVoucher) => void;
  removeVoucher: () => void;
  getVoucherDiscount: (subtotal?: number) => number;
  itemCount: () => number;
  getTotal: () => number;
}

interface UIStore {
  isChatOpen: boolean;
  isLoginModalOpen: boolean;
  isCartDrawerOpen: boolean;
  searchQuery: string;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  setSearchQuery: (query: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
      },
      items: [],
      appliedVoucher: null,
      setCart: (cart) => set({ cart }),
      addItem: (item) => set((state) => {
        const existingIndex = state.items.findIndex(i => i.id === item.id);
        if (existingIndex >= 0) {
          const newItems = [...state.items];
          newItems[existingIndex].quantity += item.quantity;
          return { items: newItems };
        }
        return { items: [...state.items, item] };
      }),
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter(i => i.id !== id) };
        }
        return { items: state.items.map(i => i.id === id ? { ...i, quantity } : i) };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      clearCart: () => set({
        cart: { items: [], subtotal: 0, discount: 0, total: 0 },
        items: [],
        appliedVoucher: null,
      }),
      applyVoucher: (voucher) => set({ appliedVoucher: voucher }),
      removeVoucher: () => set({ appliedVoucher: null }),
      getVoucherDiscount: (subtotal) => {
        const voucher = get().appliedVoucher;
        const effectiveSubtotal = subtotal ?? get().getTotal();

        if (!voucher || effectiveSubtotal < voucher.minOrderValue) {
          return 0;
        }

        let discount = voucher.type === 'percent'
          ? effectiveSubtotal * (voucher.value / 100)
          : voucher.value;

        if (voucher.maxDiscount && discount > voucher.maxDiscount) {
          discount = voucher.maxDiscount;
        }

        return Math.max(0, discount);
      },
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useUIStore = create<UIStore>()((set) => ({
  isChatOpen: false,
  isLoginModalOpen: false,
  isCartDrawerOpen: false,
  searchQuery: '',
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
