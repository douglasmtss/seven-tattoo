import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";
import { getPublicGallery, getSettings } from "@/lib/data";

export default function Home() {
  const gallery = getPublicGallery();
  const settings = getSettings();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection
          title={settings.about.title}
          content={settings.about.content}
        />
        <GallerySection items={gallery} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
