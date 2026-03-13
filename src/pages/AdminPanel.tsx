import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Plus,
  Pencil, Trash2, X, Check, ChevronDown, LogOut, Menu, TrendingUp
} from 'lucide-react';
import { useAuth, Order } from '@/context/AuthContext';
import { products as seedProducts, categories } from '@/data/products';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers';

const statusOptions: Order['status'][] = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColor: Record<string, string> = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const PIE_COLORS = ['#1a1a1a', '#c0392b', '#7f8c8d', '#2c3e50', '#e74c3c'];

const AdminPanel = () => {
  const { currentUser, isAdmin, orders, users, adminProducts, logout, updateOrderStatus, addAdminProduct, updateAdminProduct, deleteAdminProduct } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productModal, setProductModal] = useState<{ open: boolean; editId?: number }>({ open: false });
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: '', image: '', description: '',
    colors: '', sizes: '', stock: '0', isActive: true,
  });
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Merge seed products with admin-added products
  const allProducts = useMemo(() => {
    const seedMapped = seedProducts.map(p => ({
      ...p,
      stock: 50,
      isActive: true,
      createdAt: new Date().toISOString(),
    }));
    return [...adminProducts, ...seedMapped];
  }, [adminProducts]);

  // Sales data for charts
  const salesByMonth = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(month => ({ month, sales: 0, orders: 0 }));
    orders.forEach(o => {
      const m = new Date(o.placedAt).getMonth();
      data[m].sales += o.total;
      data[m].orders += 1;
    });
    return data;
  }, [orders]);

  const salesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(i => {
      map[i.category] = (map[i.category] || 0) + i.price * i.quantity;
    }));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => !u.isAdmin).length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed').length;

  // Product modal helpers
  const openAdd = () => {
    setProductForm({ name: '', price: '', category: '', image: '', description: '', colors: '', sizes: '', stock: '0', isActive: true });
    setProductModal({ open: true });
  };

  const openEdit = (id: number) => {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    setProductForm({
      name: p.name, price: String(p.price), category: p.category,
      image: p.image || '', description: p.description || '',
      colors: (p.colors || []).join(', '), sizes: (p.sizes || []).join(', '),
      stock: String(p.stock), isActive: p.isActive,
    });
    setProductModal({ open: true, editId: id });
  };

  const saveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category) return;
    const data = {
      name: productForm.name,
      price: Number(productForm.price),
      category: productForm.category,
      image: productForm.image,
      images: productForm.image ? [productForm.image] : [],
      description: productForm.description,
      colors: productForm.colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(productForm.stock),
      isActive: productForm.isActive,
    };
    if (productModal.editId) {
      updateAdminProduct(productModal.editId, data);
    } else {
      addAdminProduct(data);
    }
    setProductModal({ open: false });
  };

  const inputCls = 'w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground transition-colors font-sans-light';

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Products', icon: Package },
    { id: 'orders' as AdminTab, label: 'Orders', icon: ShoppingBag },
    { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
  ];

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.userEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.userName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCustomers = users.filter(u => !u.isAdmin && (
    u.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(customerSearch.toLowerCase())
  ));

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-serif-display text-3xl font-light mb-4">Access Denied</p>
          <p className="text-muted-foreground text-sm mb-6">Admin credentials required</p>
          <Link to="/login" className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-foreground text-background flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-background/10">
          {sidebarOpen && (
            <img src={logoImg} alt="Her Style" className="h-10 w-auto object-contain brightness-0 invert" />
          )}
          <button onClick={() => setSidebarOpen(s => !s)} className="text-background/60 hover:text-background transition-colors ml-auto">
            <Menu size={18} />
          </button>
        </div>
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-background/10">
            <p className="text-[9px] tracking-widest text-background/40 uppercase">Admin Panel</p>
            <p className="text-xs text-background/70 font-sans-light truncate">{currentUser.email}</p>
          </div>
        )}
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase transition-all ${tab === item.id ? 'bg-background/10 text-background' : 'text-background/50 hover:text-background hover:bg-background/5'}`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {sidebarOpen && item.label}
              {sidebarOpen && item.id === 'orders' && pendingOrders > 0 && (
                <span className="ml-auto bg-accent text-accent-foreground text-[9px] px-1.5 py-0.5 rounded-full">{pendingOrders}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-background/10 space-y-2">
          <Link to="/" className={`flex items-center gap-3 text-[10px] tracking-widest uppercase text-background/50 hover:text-background transition-colors ${!sidebarOpen && 'justify-center'}`}>
            <BarChart3 size={14} />
            {sidebarOpen && 'View Site'}
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className={`flex items-center gap-3 text-[10px] tracking-widest uppercase text-background/50 hover:text-accent transition-colors ${!sidebarOpen && 'justify-center'}`}>
            <LogOut size={14} />
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground mb-1">Overview</p>
              <h1 className="font-serif-display text-3xl font-light">Dashboard</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: `${totalOrders} orders`, icon: TrendingUp },
                { label: 'Total Orders', value: totalOrders, sub: `${pendingOrders} pending`, icon: ShoppingBag },
                { label: 'Customers', value: totalCustomers, sub: 'Registered', icon: Users },
                { label: 'Avg Order Value', value: `₹${Math.round(avgOrderValue).toLocaleString()}`, sub: 'Per order', icon: BarChart3 },
              ].map(stat => (
                <div key={stat.label} className="bg-background border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] tracking-widest uppercase text-muted-foreground">{stat.label}</p>
                    <stat.icon size={14} className="text-muted-foreground" />
                  </div>
                  <p className="font-serif-display text-3xl font-light mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-sans-light">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-background border border-border p-6">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-6">Monthly Revenue</p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={salesByMonth}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#salesGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-background border border-border p-6">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-6">Sales by Category</p>
                {salesByCategory.length === 0 ? (
                  <div className="h-[240px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground font-sans-light text-center">Place orders to see data</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                        {salesByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Orders chart */}
            <div className="bg-background border border-border p-6 mb-6">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-6">Monthly Orders</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                  <Tooltip formatter={(v: number) => [v, 'Orders']} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Orders */}
            <div className="bg-background border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xs tracking-widest uppercase text-muted-foreground">Recent Orders</p>
                <button onClick={() => setTab('orders')} className="text-xs tracking-widest uppercase hover:text-accent transition-colors">View All →</button>
              </div>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground font-sans-light text-center py-8">No orders yet — they'll appear here once customers place orders</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left py-3 pr-6 text-[9px] tracking-widest uppercase text-muted-foreground font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                          <td className="py-3 pr-6 font-mono">{o.id}</td>
                          <td className="py-3 pr-6">{o.userName}</td>
                          <td className="py-3 pr-6">₹{o.total.toLocaleString()}</td>
                          <td className="py-3 pr-6">
                            <span className={`text-[9px] tracking-widest uppercase px-2 py-1 ${statusColor[o.status]}`}>{o.status}</span>
                          </td>
                          <td className="py-3 pr-6 text-muted-foreground">{new Date(o.placedAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground mb-1">Inventory</p>
                <h1 className="font-serif-display text-3xl font-light">Products</h1>
              </div>
              <button onClick={openAdd} className="flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors">
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div className="bg-background border border-border mb-6 px-4 py-3 flex items-center gap-3">
              <input
                className="flex-1 bg-transparent text-sm outline-none font-sans-light placeholder:text-muted-foreground"
                placeholder="Search products by name or category..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
              />
            </div>

            <div className="bg-background border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-secondary">
                  <tr className="border-b border-border">
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Source', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-4 text-[9px] tracking-widest uppercase text-muted-foreground font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm font-sans-light">No products found</td></tr>
                  ) : filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover flex-shrink-0 bg-secondary" />
                          ) : (
                            <div className="w-10 h-10 bg-secondary flex-shrink-0 flex items-center justify-center text-muted-foreground text-xs">IMG</div>
                          )}
                          <span className="font-medium truncate max-w-[140px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3">₹{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] tracking-widest uppercase px-2 py-1 ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-secondary text-muted-foreground'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] tracking-widest uppercase px-2 py-1 ${adminProducts.find(ap => ap.id === p.id) ? 'bg-blue-100 text-blue-800' : 'bg-secondary text-muted-foreground'}`}>
                          {adminProducts.find(ap => ap.id === p.id) ? 'Admin' : 'Catalog'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p.id)} className="hover:text-accent transition-colors" title="Edit"><Pencil size={13} /></button>
                          {adminProducts.find(ap => ap.id === p.id) && (
                            <button onClick={() => deleteAdminProduct(p.id)} className="hover:text-destructive transition-colors" title="Delete"><Trash2 size={13} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-border bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">
                  {allProducts.length} total products · {adminProducts.length} admin-added · {seedProducts.length} from catalog
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="p-8">
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground mb-1">Management</p>
              <h1 className="font-serif-display text-3xl font-light">Orders</h1>
            </div>

            <div className="bg-background border border-border mb-6 px-4 py-3">
              <input
                className="w-full bg-transparent text-sm outline-none font-sans-light placeholder:text-muted-foreground"
                placeholder="Search by order ID, customer name or email..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
              />
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-background border border-border p-16 text-center">
                <ShoppingBag size={40} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
                <p className="font-serif-display text-2xl font-light mb-2">No orders found</p>
                <p className="text-sm text-muted-foreground font-sans-light">Orders placed by customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-background border border-border p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-mono text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-muted-foreground font-sans-light">
                          {order.userName} · {order.userEmail}
                        </p>
                        <p className="text-xs text-muted-foreground font-sans-light mt-0.5">
                          {new Date(order.placedAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif-display text-xl">₹{order.total.toLocaleString()}</span>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`text-[9px] tracking-widest uppercase border px-3 py-2 appearance-none pr-7 cursor-pointer outline-none ${statusColor[order.status]}`}
                          >
                            {statusOptions.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-2 bg-secondary p-2 min-w-[180px]">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-border flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.selectedSize && `S: ${item.selectedSize}`} {item.selectedColor && `C: ${item.selectedColor}`}</p>
                            <p className="text-[11px]">₹{item.price.toLocaleString()} ×{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[10px] text-muted-foreground font-sans-light">
                        📍 {order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
                        · Payment: {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {tab === 'customers' && (
          <div className="p-8">
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground mb-1">CRM</p>
              <h1 className="font-serif-display text-3xl font-light">Customers</h1>
            </div>

            <div className="bg-background border border-border mb-6 px-4 py-3">
              <input
                className="w-full bg-transparent text-sm outline-none font-sans-light placeholder:text-muted-foreground"
                placeholder="Search customers by name or email..."
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
              />
            </div>

            <div className="bg-background border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-secondary">
                  <tr className="border-b border-border">
                    {['Customer', 'Email', 'Phone', 'Location', 'Orders', 'Total Spent', 'Joined'].map(h => (
                      <th key={h} className="text-left px-4 py-4 text-[9px] tracking-widest uppercase text-muted-foreground font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm font-sans-light">
                        No customers yet — they'll appear here once users sign up
                      </td>
                    </tr>
                  ) : filteredCustomers.map(u => {
                    const userOrders = orders.filter(o => o.userId === u.id);
                    const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
                    return (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.phone || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.city || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${userOrders.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {userOrders.length}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={totalSpent > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                            ₹{totalSpent.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-border bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">{filteredCustomers.length} customers total</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── PRODUCT MODAL ── */}
      {productModal.open && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background">
              <h2 className="font-serif-display text-xl font-light">{productModal.editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setProductModal({ open: false })} className="hover:text-accent transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Product Name *</label>
                  <input className={inputCls} value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Floral Midi Dress" />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Price (₹) *</label>
                  <input type="number" className={inputCls} value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="3499" />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Category *</label>
                  <select className={inputCls} value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Image URL</label>
                  <input className={inputCls} value={productForm.image} onChange={e => setProductForm(f => ({ ...f, image: e.target.value }))} placeholder="https://images.unsplash.com/..." />
                  {productForm.image && (
                    <div className="mt-2 w-20 h-20 border border-border overflow-hidden">
                      <img src={productForm.image} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Description</label>
                  <textarea className={inputCls + ' resize-none'} rows={3} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Colors (comma-separated)</label>
                  <input className={inputCls} value={productForm.colors} onChange={e => setProductForm(f => ({ ...f, colors: e.target.value }))} placeholder="Black, White, Red" />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Sizes (comma-separated)</label>
                  <input className={inputCls} value={productForm.sizes} onChange={e => setProductForm(f => ({ ...f, sizes: e.target.value }))} placeholder="XS, S, M, L, XL" />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Stock</label>
                  <input type="number" className={inputCls} value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="isActive" checked={productForm.isActive} onChange={e => setProductForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4" />
                  <label htmlFor="isActive" className="text-xs tracking-widest uppercase cursor-pointer">Active (visible in shop)</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setProductModal({ open: false })} className="flex-1 border border-border py-3 text-xs tracking-widest uppercase hover:border-foreground transition-colors">Cancel</button>
                <button
                  onClick={saveProduct}
                  disabled={!productForm.name || !productForm.price || !productForm.category}
                  className="flex-[2] bg-foreground text-background py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} /> {productModal.editId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
