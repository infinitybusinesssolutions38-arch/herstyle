import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from './StoreContext';

export interface UserProfile {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  avatar?: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  placedAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  colors?: string[];
  sizes?: string[];
  stock: number;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  users: UserProfile[];
  orders: Order[];
  adminProducts: AdminProduct[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: Omit<UserProfile, 'id' | 'createdAt' | 'isAdmin'>) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  placeOrder: (order: Omit<Order, 'id' | 'placedAt' | 'updatedAt'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addAdminProduct: (product: Omit<AdminProduct, 'id' | 'createdAt'>) => void;
  updateAdminProduct: (id: number, data: Partial<AdminProduct>) => void;
  deleteAdminProduct: (id: number) => void;
  getUserOrders: (userId?: string) => Order[];
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

const STORAGE_KEYS = {
  USERS: 'herstyle_users',
  CURRENT_USER: 'herstyle_current_user',
  ORDERS: 'herstyle_orders',
  ADMIN_PRODUCTS: 'herstyle_admin_products',
};

const ADMIN_EMAIL = 'admin@herstyle.com';
const ADMIN_PASS = 'admin123';

const defaultAdmin: UserProfile = {
  id: 'admin-001',
  email: ADMIN_EMAIL,
  password: ADMIN_PASS,
  firstName: 'Admin',
  lastName: 'Her Style',
  phone: '9999999999',
  address: '10 Fashion Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  createdAt: new Date().toISOString(),
  isAdmin: true,
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const stored = load<UserProfile[]>(STORAGE_KEYS.USERS, []);
    const hasAdmin = stored.some(u => u.isAdmin);
    if (!hasAdmin) {
      const withAdmin = [defaultAdmin, ...stored];
      save(STORAGE_KEYS.USERS, withAdmin);
      return withAdmin;
    }
    return stored;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    load<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null)
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    load<Order[]>(STORAGE_KEYS.ORDERS, [])
  );

  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>(() =>
    load<AdminProduct[]>(STORAGE_KEYS.ADMIN_PRODUCTS, [])
  );

  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => { save(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { save(STORAGE_KEYS.CURRENT_USER, currentUser); }, [currentUser]);
  useEffect(() => { save(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { save(STORAGE_KEYS.ADMIN_PRODUCTS, adminProducts); }, [adminProducts]);

  const login = useCallback((email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password' };
    setCurrentUser(user);
    return { success: true };
  }, [users]);

  const signup = useCallback((data: Omit<UserProfile, 'id' | 'createdAt' | 'isAdmin'>) => {
    const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { success: false, error: 'Email already registered' };
    const newUser: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isAdmin: false,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === currentUser?.id ? { ...u, ...data } : u));
    setCurrentUser(prev => prev ? { ...prev, ...data } : prev);
  }, [currentUser]);

  const placeOrder = useCallback((order: Omit<Order, 'id' | 'placedAt' | 'updatedAt'>) => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    const newOrder: Order = { ...order, id, placedAt: now, updatedAt: now };
    setOrders(prev => [newOrder, ...prev]);
    return id;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId
      ? { ...o, status, updatedAt: new Date().toISOString() }
      : o
    ));
  }, []);

  const addAdminProduct = useCallback((product: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    const newProduct: AdminProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setAdminProducts(prev => [newProduct, ...prev]);
  }, []);

  const updateAdminProduct = useCallback((id: number, data: Partial<AdminProduct>) => {
    setAdminProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const deleteAdminProduct = useCallback((id: number) => {
    setAdminProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getUserOrders = useCallback((userId?: string) => {
    const uid = userId || currentUser?.id;
    if (!uid) return [];
    return orders.filter(o => o.userId === uid);
  }, [orders, currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser, isAdmin, users, orders, adminProducts,
      login, signup, logout, updateProfile,
      placeOrder, updateOrderStatus,
      addAdminProduct, updateAdminProduct, deleteAdminProduct,
      getUserOrders,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
