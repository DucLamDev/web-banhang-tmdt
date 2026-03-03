# Thế Giới Di Động Clone - E-commerce Website

Website TMĐT e-commerce tích hợp chatbot AI, clone giao diện thegioididong.com.

## 🚀 Công nghệ sử dụng

### Frontend
- **Next.js 14** - React framework với App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - UI components
- **Zustand** - State management
- **Socket.IO Client** - Realtime communication

### Backend
- **Node.js + Express.js** - API server
- **MongoDB + Mongoose** - Database
- **Socket.IO** - Realtime chat
- **JWT** - Authentication
- **Multer** - File upload

### Chatbot AI (Phát triển riêng)
- FastAPI (Python)
- RAG với FAISS/Chroma
- Tool calling

## 📁 Cấu trúc dự án

```
web-banhang/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Header, Footer
│   ├── home/             # Homepage sections
│   ├── product/          # Product components
│   ├── cart/             # Cart components
│   ├── auth/             # Authentication
│   └── chat/             # Chat widget
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   ├── store.ts          # Zustand stores
│   ├── socket.ts         # Socket.IO client
│   └── utils.ts          # Helper functions
├── server/               # Express backend
│   ├── index.js          # Server entry
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── socket/           # Socket.IO handlers
│   └── seeders/          # Database seeders
└── public/               # Static files
```

## 🛠️ Cài đặt

### Yêu cầu
- Node.js 18+
- MongoDB 6+
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies

```bash
cd web-banhang
npm install
```

### Bước 2: Cấu hình môi trường

Tạo file `.env` (đã có sẵn) và cập nhật các giá trị:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tgdd_clone
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Bước 3: Seed dữ liệu mẫu

```bash
npm run seed
```

### Bước 4: Chạy development server

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📱 Tính năng

### Người dùng
- [x] Đăng ký / Đăng nhập
- [x] Xem danh sách sản phẩm
- [x] Tìm kiếm sản phẩm
- [x] Xem chi tiết sản phẩm
- [x] Thêm vào giỏ hàng
- [x] Quản lý giỏ hàng
- [x] Đặt hàng
- [x] Theo dõi đơn hàng
- [x] Chat với admin

### Admin
- [x] Quản lý sản phẩm
- [x] Quản lý danh mục
- [x] Quản lý đơn hàng
- [x] Chat hỗ trợ khách hàng

### Realtime Chat
- [x] Chat realtime với Socket.IO
- [x] Chuyển đổi giữa bot và admin
- [x] Lưu lịch sử chat
- [x] Thông báo tin nhắn mới

## 📡 API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/slug/:slug` - Lấy sản phẩm theo slug
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/flash-sale` - Sản phẩm flash sale

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/tree` - Cây danh mục

### Users
- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/me` - Thông tin user hiện tại

### Cart
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/items` - Thêm vào giỏ
- `PUT /api/cart/items/:id` - Cập nhật số lượng
- `DELETE /api/cart/items/:id` - Xóa khỏi giỏ

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/my-orders` - Đơn hàng của tôi
- `GET /api/orders/tracking/:orderNumber` - Tra cứu đơn hàng

### Chat
- `POST /api/chat/session` - Tạo phiên chat
- `GET /api/chat/session/:sessionId` - Lấy phiên chat
- `POST /api/chat/session/:sessionId/request-admin` - Yêu cầu gặp admin

## 🔌 Socket.IO Events

### Client -> Server
- `join_chat` - Tham gia phòng chat
- `leave_chat` - Rời phòng chat
- `send_message` - Gửi tin nhắn
- `typing_start` - Bắt đầu gõ
- `typing_stop` - Ngừng gõ

### Server -> Client
- `new_message` - Tin nhắn mới
- `admin_joined` - Admin tham gia
- `admin_left` - Admin rời đi
- `user_typing` - Trạng thái đang gõ

## 🧪 Test Accounts

```
Admin:
- Email: admin@tgdd.vn
- Password: Admin@123

User:
- Email: user@test.com
- Password: User@123
```

## 📝 License

MIT License

## 👨‍💻 Tác giả

Dự án được phát triển cho mục đích học tập.
