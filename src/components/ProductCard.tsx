import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/context/StoreContext';
import { useStore } from '@/context/StoreContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [hovered, setHovered] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${hovered ? 'scale-110' : 'scale-100'}`}
          />
        </Link>

        {/* Overlay buttons */}
        <div className={`absolute inset-0 bg-primary/5 flex flex-col items-center justify-end pb-6 gap-2 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => addToCart(product, product.sizes?.[1])}
            className="w-4/5 bg-primary text-primary-foreground py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors duration-200"
          >
            Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="w-4/5 border border-primary bg-background/90 text-center py-3 text-xs tracking-widest uppercase hover:border-accent hover:text-accent transition-colors duration-200">
            Quick View
          </Link>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={isWishlisted ? 'fill-accent text-accent' : ''}
          />
        </button>
      </div>

      {/* Info */}
      <div className="pt-3 pb-2">
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif-display text-base leading-snug hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <p className="font-sans-light text-sm mt-1">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};
