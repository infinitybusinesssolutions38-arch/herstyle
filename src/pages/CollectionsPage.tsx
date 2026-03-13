import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { products as seedProducts, categories, editorialBannerImg } from '@/data/products';

const CollectionsPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const { adminProducts } = useAuth();

  const allProducts = useMemo(() => {
    const activeAdminProducts = adminProducts
      .filter(p => p.isActive)
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        images: p.images,
        description: p.description,
        colors: p.colors,
        sizes: p.sizes,
      }));
    return [...activeAdminProducts, ...seedProducts];
  }, [adminProducts]);

  const filtered = activeCategory ? allProducts.filter(p => p.category === activeCategory) : allProducts;

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        {/* Hero Banner */}
        <div className="relative h-[50vh] overflow-hidden">
          <img src={editorialBannerImg} alt="Collections" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center text-center">
            <div className="text-primary-foreground">
              <p className="text-[10px] tracking-[0.5em] uppercase mb-4 opacity-80">Spring / Summer 2026</p>
              <h1 className="font-serif-display text-5xl md:text-7xl font-light">The Collection</h1>
              <p className="font-sans-light text-sm tracking-widest opacity-70 mt-4">A Style for Every Story</p>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="border-b border-border sticky top-[64px] md:top-[80px] bg-background z-30">
          <div className="max-w-screen-xl mx-auto px-6 md:px-16 overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              <button
                onClick={() => setActiveCategory('')}
                className={`px-6 py-4 text-[10px] tracking-[0.3em] uppercase border-b-2 transition-all whitespace-nowrap ${!activeCategory ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                All Pieces
              </button>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-6 py-4 text-[10px] tracking-[0.3em] uppercase border-b-2 transition-all whitespace-nowrap ${activeCategory === cat.name ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif-display text-3xl font-light">
                {activeCategory || 'All Pieces'}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 tracking-wider">{filtered.length} items</p>
            </div>
            <Link
              to="/shop"
              className="hidden md:block text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              View with Filters
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>

        {/* Category showcase */}
        {!activeCategory && (
          <div className="max-w-screen-xl mx-auto px-6 md:px-16 pb-24">
            <div className="border-t border-border pt-16 mb-10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Explore By</p>
              <h2 className="font-serif-display text-4xl font-light">Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(cat => {
                const catProducts = allProducts.filter(p => p.category === cat.name);
                if (!catProducts.length) return null;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className="group relative aspect-square overflow-hidden bg-secondary"
                  >
                    <img
                      src={catProducts[0].image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/50 transition-colors flex items-end p-6">
                      <div className="text-primary-foreground text-left">
                        <p className="text-xl font-serif-display font-light">{cat.name}</p>
                        <p className="text-[10px] tracking-widest uppercase opacity-70 mt-0.5">{catProducts.length} pieces</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage;
