import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    address: '', city: '', state: '', pincode: '',
  });

  const inputCls = 'w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors font-sans-light placeholder:text-muted-foreground/60 tracking-wide';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(loginForm.email, loginForm.password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { confirmPassword, ...rest } = signupForm;
    const result = signup(rest);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center relative overflow-hidden">
        <div className="text-center text-background p-12">
          {/* Logo removed */}
          <div className="w-12 h-px bg-background/30 mx-auto mb-6" />
          <p className="font-sans-light text-sm text-background/60 leading-relaxed max-w-xs">
            Premium fashion crafted for the modern Indian woman. A style for every story.
          </p>
          <div className="mt-8 text-[10px] tracking-widest uppercase text-background/30">
            हर स्टाइल · A Style for Every Story
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--accent)/0.15)_0%,_transparent_60%)]" />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={12} /> Back
        </Link>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            {/* Logo removed */}
          </div>

          {/* Tab switcher */}
          <div className="flex border border-border mb-10">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-3 text-xs tracking-widest uppercase transition-all ${mode === m ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div className="border border-accent/30 bg-accent/5 px-4 py-3 mb-6">
              <p className="text-xs text-accent font-sans-light">{error}</p>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Email Address</label>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="you@email.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={inputCls + ' pr-12'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <div className="border border-border/50 bg-secondary p-4 rounded-sm mt-4">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Demo Admin Access</p>
                <button
                  type="button"
                  onClick={() => setLoginForm({ email: 'admin@herstyle.com', password: 'admin123' })}
                  className="text-xs text-accent underline hover:text-foreground transition-colors"
                >
                  admin@herstyle.com / admin123
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">First Name *</label>
                  <input className={inputCls} placeholder="Priya" value={signupForm.firstName} onChange={e => setSignupForm(f => ({ ...f, firstName: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Last Name *</label>
                  <input className={inputCls} placeholder="Sharma" value={signupForm.lastName} onChange={e => setSignupForm(f => ({ ...f, lastName: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Email *</label>
                  <input type="email" className={inputCls} placeholder="priya@email.com" value={signupForm.email} onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Phone *</label>
                  <input type="tel" className={inputCls} placeholder="9876543210" value={signupForm.phone} onChange={e => setSignupForm(f => ({ ...f, phone: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Password *</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} className={inputCls + ' pr-10'} placeholder="Min 6 chars" value={signupForm.password} onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))} required />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye size={13} /></button>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Confirm Password *</label>
                  <input type="password" className={inputCls} placeholder="••••••••" value={signupForm.confirmPassword} onChange={e => setSignupForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Address</label>
                <input className={inputCls} placeholder="Street Address" value={signupForm.address} onChange={e => setSignupForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">City</label>
                  <input className={inputCls} placeholder="Mumbai" value={signupForm.city} onChange={e => setSignupForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">State</label>
                  <input className={inputCls} placeholder="MH" value={signupForm.state} onChange={e => setSignupForm(f => ({ ...f, state: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Pincode</label>
                  <input className={inputCls} placeholder="400001" maxLength={6} value={signupForm.pincode} onChange={e => setSignupForm(f => ({ ...f, pincode: e.target.value }))} />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
