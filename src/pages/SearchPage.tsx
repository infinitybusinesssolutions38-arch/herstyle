import { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data/products';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.colors?.some(c => c.toLowerCase().includes(q))
    );
  }, [query]);

  const suggestions = ['Dresses', 'Handbags', 'Heels', 'Black', 'Evening', 'Co-ord', 'Gold', 'Silk'];

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        {/* Search bar */}
        <div className="border-b border-border py-10 px-6 md:px-16">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 border-b-2 border-foreground pb-3">
              <Search size={20} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for dresses, bags, heels..."
                className="flex-1 bg-transparent text-lg font-sans-light outline-none placeholder:text-muted-foreground/40 tracking-wide"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-12">
          {!query && (
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-5">Popular Searches</p>
              <div className="flex flex-wrap gap-2 mb-16">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs tracking-wider border border-border px-4 py-2 hover:border-foreground hover:bg-secondary transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-5">Browse Categories</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setQuery(cat.name)}
                    className="group flex flex-col items-center gap-2 p-5 border border-border hover:border-foreground hover:bg-secondary transition-all"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[10px] tracking-widest uppercase text-center group-hover:text-accent transition-colors">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <Search size={32} strokeWidth={1} className="text-muted-foreground/30" />
              <p className="font-serif-display text-3xl font-light text-muted-foreground">No results for "{query}"</p>
              <p className="font-sans-light text-sm text-muted-foreground/70">Try a different keyword or browse our categories.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {suggestions.map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-xs tracking-wider border border-border px-4 py-2 hover:border-foreground transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="font-serif-display text-3xl font-light">{results.length} result{results.length !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wider">for "{query}"</p>
                </div>
                <Link to="/shop" className="hidden md:block text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors">
                  Browse All with Filters
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {results.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
