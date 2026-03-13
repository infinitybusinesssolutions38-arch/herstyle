import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: number[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, size: string | undefined, delta: number) => void;
  toggleWishlist: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product: Product, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map(i => i.id === product.id && i.selectedSize === size ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, size: string | undefined, delta: number) => {
    setCart(prev => prev
      .map(i => i.id === id && i.selectedSize === size ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleWishlist, cartCount, cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};
