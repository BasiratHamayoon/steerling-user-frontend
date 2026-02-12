import CategoriesSection from "@/components/user/CategoriesSection";
import HeroSection from "@/components/user/HeroSection";
import ProductsSection from "@/components/user/ProductsSection";
import AboutSection from "@/components/user/AboutSection"; // Import the new component
import WhatsAppButton from "@/components/user/WhatsAppButton";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection /> 
      <CategoriesSection />
      <ProductsSection />
      <WhatsAppButton />
    </>
  );
}