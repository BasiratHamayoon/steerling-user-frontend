import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import ProductsSection from '@/components/ProductsSection';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection />
      <WhatsAppButton />
    </>
  );
}