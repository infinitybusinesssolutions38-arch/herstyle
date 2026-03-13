import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, User, LayoutDashboard } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { cartCount, setCartOpen, wishlist } = useStore();
  const { currentUser, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/about' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    } else {
      navigate('/search');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <Link key={link.label} to={link.href} className="font-sans-light text-xs tracking-widest-custom uppercase hover:text-accent transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo centered */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              {/* Logo removed */}
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-5 ml-auto">
              <button onClick={() => setSearchOpen(s => !s)} className="hover:text-accent transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>
              <Link to="/wishlist" className="relative hover:text-accent transition-colors">
                <Heart size={18} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-accent text-accent-foreground text-[8px] flex items-center justify-center rounded-full">{wishlist.length}</span>
                )}
              </Link>
              <button onClick={() => setCartOpen(true)} className="relative hover:text-accent transition-colors">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-accent text-accent-foreground text-[8px] flex items-center justify-center rounded-full">{cartCount}</span>
                )}
              </button>

              {/* User menu */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(s => !s)}
                  className="hover:text-accent transition-colors flex items-center gap-1"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-8 w-52 bg-background border border-border shadow-lg z-50">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-[9px] tracking-widest uppercase text-muted-foreground">Signed in as</p>
                          <p className="text-xs font-medium truncate">{currentUser.firstName} {currentUser.lastName}</p>
                        </div>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs hover:bg-secondary transition-colors">
                          <User size={12} /> My Profile
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs hover:bg-secondary transition-colors text-accent">
                            <LayoutDashboard size={12} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs hover:bg-secondary transition-colors border-t border-border text-left"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs hover:bg-secondary transition-colors">
                          Sign In
                        </Link>
                        <Link to="/login" state={{ mode: 'signup' }} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs hover:bg-secondary transition-colors border-t border-border">
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button className="md:hidden" onClick={() => setMobileOpen(s => !s)}>
                {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4 fade-in">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for dresses, heels, co-ord sets..."
                className="w-full bg-transparent border-b border-border pb-2 text-sm font-sans-light tracking-wide outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background fade-in flex flex-col items-center justify-center gap-8">
          <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6">
            <X size={22} strokeWidth={1.5} />
          </button>
          {/* Logo removed */}
          {navLinks.map(link => (
            <Link key={link.label} to={link.href} onClick={() => setMobileOpen(false)} className="font-serif-display text-4xl font-light tracking-wide hover:text-accent transition-colors">
              {link.label}
            </Link>
          ))}
          <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="font-serif-display text-2xl font-light tracking-wide hover:text-accent transition-colors">
            Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </Link>
          {currentUser ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="font-serif-display text-2xl font-light tracking-wide hover:text-accent transition-colors">
                My Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="font-serif-display text-xl font-light tracking-wide text-accent">
                  Admin Panel
                </Link>
              )}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="font-sans-light text-sm text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="font-sans-light text-sm uppercase tracking-widest border-b border-foreground pb-0.5 hover:text-accent transition-colors">
              Sign In / Register
            </Link>
          )}
        </div>
      )}

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
};
