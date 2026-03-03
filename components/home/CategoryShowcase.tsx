'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Tablet, 
  Camera,
  Tv,
  Gamepad2,
  Printer,
  HardDrive,
  Loader2,
  Package
} from 'lucide-react';
import { categoryApi } from '@/lib/api';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'dien-thoai': Smartphone,
  'laptop': Laptop,
  'tablet': Tablet,
  'am-thanh': Headphones,
  'phu-kien': HardDrive,
  'smartwatch': Watch,
  'camera': Camera,
  'tivi': Tv,
  'gaming': Gamepad2,
  'may-in': Printer,
};

const colorMap: Record<string, string> = {
  'dien-thoai': 'bg-blue-500',
  'laptop': 'bg-purple-500',
  'tablet': 'bg-green-500',
  'am-thanh': 'bg-red-500',
  'phu-kien': 'bg-gray-500',
  'smartwatch': 'bg-orange-500',
  'camera': 'bg-pink-500',
  'tivi': 'bg-indigo-500',
  'gaming': 'bg-yellow-500',
  'may-in': 'bg-teal-500',
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
}

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data.categories || response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
      
      <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
        {categories.map((category) => {
          const IconComponent = iconMap[category.slug] || Package;
          const bgColor = colorMap[category.slug] || 'bg-gray-500';
          return (
            <Link
              key={category._id}
              href={`/danh-muc/${category.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs text-center font-medium text-gray-700 group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
