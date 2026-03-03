import HeroBanner from '@/components/home/HeroBanner';
import FlashSale from '@/components/home/FlashSale';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromotionBanners from '@/components/home/PromotionBanners';
import SuggestedProducts from '@/components/home/SuggestedProducts';
import BrandShowcase from '@/components/home/BrandShowcase';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CategoryBanners from '@/components/home/CategoryBanners';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Slider */}
      <HeroBanner />

      {/* Flash Sale - Deal chồng Deal */}
      <section className="container-custom pt-4 pb-2">
        <FlashSale />
      </section>

      {/* Gian hàng ưu đãi */}
      <section className="container-custom py-4">
        <PromotionBanners />
      </section>

      {/* Why Choose Us - Trust Badges */}
      <section className="container-custom py-4">
        <WhyChooseUs />
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="container-custom py-4">
        <FeaturedProducts />
      </section>

      {/* Danh mục nổi bật - Category Banners */}
      <section className="container-custom py-4">
        <CategoryBanners />
      </section>

      {/* Thương hiệu */}
      <section className="container-custom py-4 bg-white rounded-2xl shadow-sm">
        <div className="py-2">
          <BrandShowcase />
        </div>
      </section>

      {/* Gợi ý cho bạn - Tab theo danh mục */}
      <section className="container-custom py-4">
        <SuggestedProducts />
      </section>

      {/* Newsletter */}
      <section className="container-custom py-4 pb-8">
        <NewsletterSection />
      </section>
    </div>
  );
}
