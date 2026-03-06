'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit2, Loader2, Plus, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi, categoryApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order?: number;
  parent?: string | null;
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  order: 0,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data.categories || res.data || []);
    } catch {
      setCategories([]);
      toast.error('Không tải được danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [categories]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Vui lòng nhập tên và slug danh mục');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, form);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await adminApi.createCategory(form);
        toast.success('Tạo danh mục thành công');
      }
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lưu danh mục thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      icon: category.icon || '',
      order: category.order || 0,
    });
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Bạn có chắc muốn ẩn danh mục "${category.name}"?`)) return;
    try {
      await adminApi.deleteCategory(category._id);
      toast.success('Đã ẩn danh mục');
      if (editingId === category._id) resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Xóa danh mục thất bại');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <p className="text-gray-500">Tạo, chỉnh sửa và ẩn danh mục sản phẩm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editingId ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
            {editingId && (
              <Button variant="outline" size="sm" onClick={resetForm}>Hủy</Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên danh mục</label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <Input value={form.icon} onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))} placeholder="Ví dụ: 📱" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
              <Input type="number" value={form.order} onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-28 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Đang lưu...' : editingId ? 'Cập nhật danh mục' : 'Tạo danh mục'}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Danh sách danh mục</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sortedCategories.length === 0 ? (
            <div className="text-center py-16 text-gray-500">Chưa có danh mục nào</div>
          ) : (
            <div className="divide-y">
              {sortedCategories.map((category) => (
                <div key={category._id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon || '🏷️'}</span>
                      <p className="font-medium truncate">{category.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">/{category.slug}</p>
                    {category.description && <p className="text-sm text-gray-500 mt-1 truncate">{category.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">Thứ tự: {category.order || 0}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => handleEdit(category)}>
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => handleDelete(category)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
