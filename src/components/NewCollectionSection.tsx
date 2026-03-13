import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';

export const NewCollectionSection = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Curated</p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light">New Collection</h2>
        </div>
        <Link to="/collections" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 text-center md:hidden">
        <Link to="/collections" className="text-xs tracking-widest uppercase border-b border-foreground pb-0.5">View All</Link>
      </div>
    </section>
  );
};
