import { X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

export const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, cartTotal } = useStore();

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[60]"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background z-[70] flex flex-col shadow-2xl transition-transform duration-400 ease-in-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <span className="font-serif-display text-xl tracking-wide">Your Bag ({cart.length})</span>
          <button onClick={() => setCartOpen(false)} className="hover:text-accent transition-colors">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <span className="text-5xl">🛍️</span>
              <p className="font-sans-light text-sm tracking-wider">Your bag is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-secondary" />
                <div className="flex-1">
                  <p className="font-serif-display text-base">{item.name}</p>
                  <p className="text-xs text-muted-foreground tracking-wider mt-1">{item.selectedSize && `Size: ${item.selectedSize}`}</p>
                  <p className="text-sm mt-2">₹{item.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="hover:text-accent transition-colors self-start mt-1">
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-8 py-6 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-sans-light text-xs tracking-widest uppercase">Total</span>
              <span className="font-serif-display text-xl">₹{cartTotal.toLocaleString()}</span>
            </div>
            <Link to="/checkout" onClick={() => setCartOpen(false)} className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase font-sans hover:bg-accent transition-colors duration-300 block text-center">
              Proceed to Checkout
            </Link>
            <button onClick={() => setCartOpen(false)} className="w-full border border-border py-3 text-xs tracking-widest uppercase hover:border-foreground transition-colors duration-200">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};
