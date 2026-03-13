import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

export const CategorySection = () => {
  return (
    <section className="py-24 px-6 md:px-16 max-w-screen-xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Explore</p>
        <h2 className="font-serif-display text-4xl md:text-5xl font-light">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="group flex flex-col items-center gap-3 p-6 border border-border hover:border-foreground transition-all duration-300 hover:bg-secondary"
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-[10px] tracking-widest uppercase text-center group-hover:text-accent transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
