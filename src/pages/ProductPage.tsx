import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronLeft } from 'lucide-react';
import { products as seedProducts } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { adminProducts } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState(0);

  const allProducts = useMemo(() => {
    const activeAdminProducts = adminProducts
      .filter(p => p.isActive)
      .map(p => ({
        id: p.id, name: p.name, price: p.price, category: p.category,
        image: p.image, images: p.images, description: p.description,
        colors: p.colors, sizes: p.sizes,
      }));
    return [...activeAdminProducts, ...seedProducts];
  }, [adminProducts]);

  const product = allProducts.find(p => p.id === Number(id));
  const related = allProducts.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif-display text-3xl font-light mb-4">Product not found</p>
        <Link to="/shop" className="text-xs tracking-widest uppercase border-b border-foreground pb-0.5">Back to Shop</Link>
      </div>
    </div>
  );

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div>
      <Navbar />
      <CartDrawer />

      <main className="pt-20">
        <div className="px-6 md:px-16 py-6 max-w-screen-xl mx-auto">
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={12} /> Back to Shop
          </Link>
        </div>

        <div className="px-6 md:px-16 max-w-screen-xl mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Images */}
            <div>
              <div className="aspect-[3/4] overflow-hidden bg-secondary mb-3">
                <img
                  src={product.images?.[mainImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(i)}
                      className={`w-20 h-24 overflow-hidden border-2 transition-all ${mainImage === i ? 'border-foreground' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="md:pt-4">
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">{product.category}</p>
              <h1 className="font-serif-display text-4xl md:text-5xl font-light leading-tight mb-4">{product.name}</h1>
              <p className="font-serif-display text-2xl mb-8">₹{product.price.toLocaleString()}</p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] tracking-widest uppercase mb-3">Color: <span className="text-muted-foreground">{selectedColor || product.colors[0]}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-1.5 text-xs border transition-all tracking-wider ${selectedColor === color ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
                <div className="mb-8">
                  <p className="text-[10px] tracking-widest uppercase mb-3">Size: <span className="text-muted-foreground">{selectedSize || 'Select size'}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-10 text-xs border transition-all tracking-wider ${selectedSize === size ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => addToCart(product, selectedSize || product.sizes?.[0], selectedColor || product.colors?.[0])}
                  className="flex-1 bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase hover:bg-accent transition-colors duration-300"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 border flex items-center justify-center transition-colors ${isWishlisted ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground'}`}
                >
                  <Heart size={16} strokeWidth={1.5} className={isWishlisted ? 'fill-accent text-accent' : ''} />
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-border pt-6">
                  <p className="font-sans-light text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Shipping */}
              <div className="border-t border-border pt-6 mt-6 space-y-2">
                {['Free shipping on orders above ₹2,999', 'Easy 15-day returns & exchanges', 'Authenticity guaranteed'].map(item => (
                  <p key={item} className="text-xs text-muted-foreground flex items-center gap-2 tracking-wider">
                    <span className="text-accent">—</span> {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-24">
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">You May Also Like</p>
                <h2 className="font-serif-display text-3xl font-light">Related Pieces</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
