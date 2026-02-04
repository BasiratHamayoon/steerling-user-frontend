import CategoriesSection from "@/components/user/CategoriesSection";
import HeroSection from "@/components/user/HeroSection";
import ProductsSection from "@/components/user/ProductsSection";
import WhatsAppButton from "@/components/user/WhatsAppButton";


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