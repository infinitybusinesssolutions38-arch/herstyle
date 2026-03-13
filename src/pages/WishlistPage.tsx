import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { products } from '@/data/products';

const WishlistPage = () => {
  const { wishlist } = useStore();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="pt-20">
        <div className="px-6 md:px-16 py-14 max-w-screen-xl mx-auto border-b border-border">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">My</p>
          <h1 className="font-serif-display text-5xl md:text-6xl font-light flex items-center gap-4">
            Wishlist
            {wishlistProducts.length > 0 && (
              <span className="text-2xl text-muted-foreground font-light">({wishlistProducts.length})</span>
            )}
          </h1>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <Heart size={40} strokeWidth={1} className="text-muted-foreground/30" />
              <div>
                <p className="font-serif-display text-3xl font-light text-muted-foreground mb-2">Your wishlist is empty</p>
                <p className="font-sans-light text-sm text-muted-foreground/70 tracking-wide">Save pieces you love and come back to them anytime.</p>
              </div>
              <Link
                to="/collections"
                className="mt-4 border border-foreground px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {wishlistProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  to="/shop"
                  className="text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
