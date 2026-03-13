import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { products as seedProducts, categories } from '@/data/products';
import { X, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const priceRanges = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 – ₹8,000', min: 5000, max: 8000 },
  { label: 'Above ₹8,000', min: 8000, max: Infinity },
];

const allSizes = ['XS', 'S', 'M', 'L', 'XL', '36', '37', '38', '39', '40', '41', 'One Size'];
const allColors = ['Black', 'White', 'Red', 'Ivory', 'Blush', 'Sage', 'Midnight Navy', 'Burgundy', 'Camel', 'Gold', 'Silver', 'Nude', 'Rose Gold', 'Lilac', 'Mint', 'Champagne', 'Clear'];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const { adminProducts } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Merge admin-added products (active only) with seed products
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

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) result = result.filter(p => p.price >= range.min && p.price < range.max);
    }
    if (selectedSizes.length > 0) result = result.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    if (selectedColors.length > 0) result = result.filter(p => p.colors?.some(c => selectedColors.includes(c)));
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [allProducts, selectedCategory, selectedPriceRange, selectedSizes, selectedColors, sortBy]);

  const clearAll = () => {
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const hasFilters = selectedCategory || selectedPriceRange || selectedSizes.length > 0 || selectedColors.length > 0;

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase mb-4 text-muted-foreground">Category</p>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedCategory('')}
              className={`text-xs tracking-wider w-full text-left py-1 transition-colors ${!selectedCategory ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All ({allProducts.length})
            </button>
          </li>
          {categories.map(cat => {
            const count = allProducts.filter(p => p.category === cat.name).length;
            return (
              <li key={cat.name}>
                <button
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`text-xs tracking-wider w-full text-left py-1 flex items-center justify-between transition-colors ${selectedCategory === cat.name ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="text-muted-foreground/60">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase mb-4 text-muted-foreground">Price</p>
        <ul className="space-y-2">
          {priceRanges.map(r => (
            <li key={r.label}>
              <button
                onClick={() => setSelectedPriceRange(selectedPriceRange === r.label ? '' : r.label)}
                className={`text-xs tracking-wider w-full text-left py-1 transition-colors ${selectedPriceRange === r.label ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase mb-4 text-muted-foreground">Size</p>
        <div className="flex flex-wrap gap-2">
          {allSizes.map(s => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`text-[10px] px-2.5 py-1.5 border transition-all tracking-wider ${selectedSizes.includes(s) ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase mb-4 text-muted-foreground">Color</p>
        <div className="flex flex-wrap gap-2">
          {allColors.map(c => (
            <button
              key={c}
              onClick={() => toggleColor(c)}
              className={`text-[10px] px-2.5 py-1.5 border transition-all tracking-wider ${selectedColors.includes(c) ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        {/* Page Header */}
        <div className="px-6 md:px-16 py-14 max-w-screen-xl mx-auto border-b border-border">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Her Style</p>
          <h1 className="font-serif-display text-5xl md:text-6xl font-light">
            {selectedCategory || 'Shop All'}
          </h1>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFiltersOpen(o => !o)}
                className="flex items-center gap-2 text-xs tracking-widest uppercase border border-border px-4 py-2 hover:border-foreground transition-colors md:hidden"
              >
                <SlidersHorizontal size={12} /> Filters
              </button>
              <p className="text-xs text-muted-foreground tracking-wider">{filtered.length} items</p>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-accent tracking-wider flex items-center gap-1 hover:underline">
                  <X size={10} /> Clear all
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs tracking-wider border border-border bg-background px-3 py-2 outline-none hover:border-foreground transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Active filters chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory && (
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider border border-foreground px-3 py-1.5">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}><X size={10} /></button>
                </span>
              )}
              {selectedPriceRange && (
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider border border-foreground px-3 py-1.5">
                  {selectedPriceRange}
                  <button onClick={() => setSelectedPriceRange('')}><X size={10} /></button>
                </span>
              )}
              {selectedSizes.map(s => (
                <span key={s} className="flex items-center gap-1.5 text-[10px] tracking-wider border border-foreground px-3 py-1.5">
                  Size: {s}<button onClick={() => toggleSize(s)}><X size={10} /></button>
                </span>
              ))}
              {selectedColors.map(c => (
                <span key={c} className="flex items-center gap-1.5 text-[10px] tracking-wider border border-foreground px-3 py-1.5">
                  {c}<button onClick={() => toggleColor(c)}><X size={10} /></button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-12">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-52 shrink-0">
              <FilterPanel />
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                  <p className="font-serif-display text-3xl font-light text-muted-foreground">No items found</p>
                  <button onClick={clearAll} className="text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filtered.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-[80] md:hidden">
            <div className="absolute inset-0 bg-foreground/30" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-background overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-8">
                <p className="font-serif-display text-xl">Filters</p>
                <button onClick={() => setFiltersOpen(false)}><X size={18} strokeWidth={1.5} /></button>
              </div>
              <FilterPanel />
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full mt-8 bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase"
              >
                Apply Filters ({filtered.length})
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
