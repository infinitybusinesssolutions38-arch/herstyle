import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Heart, LogOut, Edit2, Check, X, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';

type Tab = 'orders' | 'profile' | 'wishlist';

const statusColors: Record<string, string> = {
  Processing: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
  Shipped: 'text-purple-600 bg-purple-50 border-purple-200',
  Delivered: 'text-green-600 bg-green-50 border-green-200',
  Cancelled: 'text-red-600 bg-red-50 border-red-200',
};

const ProfilePage = () => {
  const { currentUser, logout, updateProfile, getUserOrders } = useAuth();
  const { wishlist } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('orders');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    pincode: currentUser?.pincode || '',
  });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const orders = getUserOrders();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateProfile(form);
    setEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.current !== currentUser?.password) {
      setPwError('Current password is incorrect');
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('Passwords do not match');
      return;
    }
    updateProfile({ password: pwForm.next });
    setPwSuccess('Password updated successfully');
    setPwForm({ current: '', next: '', confirm: '' });
  };

  const inputCls = 'w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors font-sans-light placeholder:text-muted-foreground/60';

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'orders' as Tab, label: 'My Orders', icon: Package },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'wishlist' as Tab, label: 'Wishlist', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <main className="pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="border-b border-border pb-8 mb-10 flex items-end justify-between">
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground mb-2">Welcome back</p>
              <h1 className="font-serif-display text-4xl font-light">{currentUser.firstName} {currentUser.lastName}</h1>
              <p className="font-sans-light text-sm text-muted-foreground mt-1">{currentUser.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
            {/* Sidebar */}
            <div className="space-y-1">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs tracking-widest uppercase transition-all ${tab === t.id ? 'bg-foreground text-background' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                >
                  <div className="flex items-center gap-3">
                    <t.icon size={14} />
                    {t.label}
                  </div>
                  {tab === t.id && <ChevronRight size={12} />}
                </button>
              ))}
            </div>

            {/* Content */}
            <div>
              {/* ORDERS */}
              {tab === 'orders' && (
                <div>
                  <h2 className="font-serif-display text-2xl font-light mb-8">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-border">
                      <Package size={32} className="text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                      <p className="font-serif-display text-xl font-light mb-2">No orders yet</p>
                      <p className="text-sm text-muted-foreground font-sans-light mb-6">Your order history will appear here</p>
                      <button onClick={() => navigate('/shop')} className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors">
                        Shop Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border border-border p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                              <p className="font-serif-display text-lg font-light mb-1">{order.id}</p>
                              <p className="text-xs text-muted-foreground font-sans-light">
                                Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-[10px] tracking-widest uppercase border px-3 py-1 ${statusColors[order.status] || ''}`}>
                                {order.status}
                              </span>
                              <span className="font-serif-display text-lg">₹{order.total.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 bg-secondary p-3">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium truncate">{item.name}</p>
                                  <p className="text-[10px] text-muted-foreground font-sans-light">{item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && `· ${item.selectedColor}`}</p>
                                  <p className="text-xs mt-1">₹{item.price.toLocaleString()} × {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-border">
                            <p className="text-[10px] text-muted-foreground font-sans-light">
                              Delivery to: {order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE */}
              {tab === 'profile' && (
                <div className="space-y-10">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="font-serif-display text-2xl font-light">Personal Details</h2>
                      {!editing ? (
                        <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-xs tracking-widest uppercase hover:text-accent transition-colors">
                          <Edit2 size={12} /> Edit
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                            <X size={12} /> Cancel
                          </button>
                          <button onClick={handleSaveProfile} className="flex items-center gap-1 text-xs tracking-widest uppercase bg-foreground text-background px-4 py-2 hover:bg-accent transition-colors">
                            <Check size={12} /> Save
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'First Name', key: 'firstName' as const },
                        { label: 'Last Name', key: 'lastName' as const },
                        { label: 'Phone', key: 'phone' as const },
                        { label: 'Address', key: 'address' as const },
                        { label: 'City', key: 'city' as const },
                        { label: 'State', key: 'state' as const },
                        { label: 'Pincode', key: 'pincode' as const },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">{label}</label>
                          {editing ? (
                            <input className={inputCls} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                          ) : (
                            <p className="text-sm font-sans-light py-3 border-b border-border">{currentUser[key] || '—'}</p>
                          )}
                        </div>
                      ))}
                      <div>
                        <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Email</label>
                        <p className="text-sm font-sans-light py-3 border-b border-border text-muted-foreground">{currentUser.email} (cannot change)</p>
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div>
                    <h3 className="font-serif-display text-xl font-light mb-6 pt-6 border-t border-border">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Current Password', key: 'current' as const },
                        { label: 'New Password', key: 'next' as const },
                        { label: 'Confirm New', key: 'confirm' as const },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">{label}</label>
                          <input type="password" className={inputCls} value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} required />
                        </div>
                      ))}
                      <div className="md:col-span-3 flex items-center gap-6">
                        <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors">
                          Update Password
                        </button>
                        {pwError && <p className="text-xs text-accent">{pwError}</p>}
                        {pwSuccess && <p className="text-xs text-green-600">{pwSuccess}</p>}
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* WISHLIST */}
              {tab === 'wishlist' && (
                <div>
                  <h2 className="font-serif-display text-2xl font-light mb-8">Saved Items</h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-border">
                      <Heart size={32} className="text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                      <p className="font-serif-display text-xl font-light mb-2">No saved items</p>
                      <p className="text-sm text-muted-foreground font-sans-light mb-6">Items you heart will appear here</p>
                      <button onClick={() => navigate('/shop')} className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors">
                        Browse Shop
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground font-sans-light mb-4">You have {wishlist.length} saved item{wishlist.length > 1 ? 's' : ''}</p>
                      <button onClick={() => navigate('/wishlist')} className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:bg-accent transition-colors">
                        View Wishlist
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
