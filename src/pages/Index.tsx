import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { HeroSection } from '@/components/HeroSection';
import { NewCollectionSection } from '@/components/NewCollectionSection';
import { AccessoriesSection } from '@/components/AccessoriesSection';
import { EditorialSection } from '@/components/EditorialSection';
import { CategorySection } from '@/components/CategorySection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <NewCollectionSection />
        <EditorialSection />
        <AccessoriesSection />
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
