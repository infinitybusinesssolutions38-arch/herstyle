import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';

export const AccessoriesSection = () => {
  // Show Heels and Party Wear (clothing-only categories, no bags/accessories)
  const heelsAndParty = products.filter(p => ['Heels', 'Party Wear'].includes(p.category));

  return (
    <section className="py-24 bg-secondary">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">The Edit</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-light">Party & Heels</h2>
          </div>
          <Link to="/shop?category=Party%20Wear" className="hidden md:block text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors">
            Shop Party Wear
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {heelsAndParty.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
