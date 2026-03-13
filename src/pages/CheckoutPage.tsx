import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

const CheckoutPage = () => {
  const { cart, cartTotal, removeFromCart, setCartOpen } = useStore();
  const { currentUser, placeOrder } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    pincode: currentUser?.pincode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = cartTotal >= 2999 ? 0 : 199;
  const total = cartTotal + shipping;

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Required';
    if (!form.lastName.trim()) newErrors.lastName = 'Required';
    if (!form.email.includes('@')) newErrors.email = 'Invalid email';
    if (form.phone.length < 10) newErrors.phone = 'Invalid phone';
    if (!form.address.trim()) newErrors.address = 'Required';
    if (!form.city.trim()) newErrors.city = 'Required';
    if (!form.state.trim()) newErrors.state = 'Required';
    if (form.pincode.length !== 6) newErrors.pincode = 'Invalid pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === 'card') {
      if (cardForm.number.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number';
      if (!cardForm.expiry) newErrors.expiry = 'Required';
      if (cardForm.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
      if (!cardForm.name.trim()) newErrors.cardName = 'Required';
    } else if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) newErrors.upiId = 'Invalid UPI ID';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;
    const codFee = paymentMethod === 'cod' ? 49 : 0;
    const finalTotal = total + codFee;
    const id = placeOrder({
      userId: currentUser?.id || 'guest',
      userEmail: form.email,
      userName: `${form.firstName} ${form.lastName}`,
      items: cart,
      total: finalTotal,
      subtotal: cartTotal,
      shipping,
      status: 'Processing',
      paymentMethod: paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
      deliveryAddress: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
    });
    setPlacedOrderId(id);
    cart.forEach(item => removeFromCart(item.id));
    setStep('success');
  };

  const inputClass = (field: string) =>
    `w-full border ${errors[field] ? 'border-accent' : 'border-border'} bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors font-sans-light placeholder:text-muted-foreground/60 tracking-wide`;

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Navbar />
        <p className="font-serif-display text-3xl font-light">Your bag is empty</p>
        <Link to="/shop" className="text-xs tracking-widest uppercase border-b border-foreground pb-0.5">Shop Now</Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-8">
              <Check size={28} strokeWidth={1.5} className="text-background" />
            </div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4">Order Confirmed</p>
            <h1 className="font-serif-display text-4xl font-light mb-4">Thank You, {form.firstName || 'Dear'}!</h1>
            {placedOrderId && (
              <p className="text-xs font-mono bg-secondary px-4 py-2 mb-4 inline-block">Order ID: {placedOrderId}</p>
            )}
            <p className="font-sans-light text-sm text-muted-foreground leading-relaxed mb-2">
              Your order has been placed successfully. A confirmation has been sent to <span className="text-foreground">{form.email || 'your email'}</span>.
            </p>
            <p className="font-sans-light text-sm text-muted-foreground leading-relaxed mb-10">
              Estimated delivery: <span className="text-foreground">5–7 business days</span>
            </p>
            <div className="border-t border-border pt-8 mb-8">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Order Summary</p>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-sans-light">Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-sans-light">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-serif-display text-xl border-t border-border pt-3">
                <span>Total Paid</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Link
              to={currentUser ? '/profile' : '/'}
              className="inline-block bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase hover:bg-accent transition-colors"
            >
              {currentUser ? 'View My Orders' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="pt-20 pb-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ChevronLeft size={12} /> Continue Shopping
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            {/* Left: Form */}
            <div>
              {/* Step indicator */}
              <div className="flex items-center gap-4 mb-10">
                {[{ id: 'details', label: 'Delivery' }, { id: 'payment', label: 'Payment' }].map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    {i > 0 && <div className={`h-px w-8 ${step === 'payment' ? 'bg-foreground' : 'bg-border'}`} />}
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all ${step === s.id || (s.id === 'details' && step === 'payment') ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'}`}>
                        {s.id === 'details' && step === 'payment' ? <Check size={10} /> : i + 1}
                      </div>
                      <p className="text-xs tracking-widest uppercase">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {step === 'details' && (
                <div>
                  <h2 className="font-serif-display text-2xl font-light mb-8">Delivery Details</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">First Name *</label>
                      <input className={inputClass('firstName')} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Priya" />
                      {errors.firstName && <p className="text-[10px] text-accent mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Last Name *</label>
                      <input className={inputClass('lastName')} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Sharma" />
                      {errors.lastName && <p className="text-[10px] text-accent mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Email *</label>
                      <input type="email" className={inputClass('email')} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="priya@email.com" />
                      {errors.email && <p className="text-[10px] text-accent mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Phone *</label>
                      <input type="tel" className={inputClass('phone')} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9876543210" />
                      {errors.phone && <p className="text-[10px] text-accent mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Address *</label>
                    <input className={inputClass('address')} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="42 Mehrauli Road, Apt 3B" />
                    {errors.address && <p className="text-[10px] text-accent mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">City *</label>
                      <input className={inputClass('city')} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="New Delhi" />
                      {errors.city && <p className="text-[10px] text-accent mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">State *</label>
                      <input className={inputClass('state')} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="Delhi" />
                      {errors.state && <p className="text-[10px] text-accent mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Pincode *</label>
                      <input className={inputClass('pincode')} value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} placeholder="110030" maxLength={6} />
                      {errors.pincode && <p className="text-[10px] text-accent mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => { if (validateDetails()) setStep('payment'); }}
                    className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase hover:bg-accent transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div>
                  <h2 className="font-serif-display text-2xl font-light mb-8">Payment</h2>

                  {/* Payment method tabs */}
                  <div className="flex gap-0 border border-border mb-8">
                    {[
                      { id: 'card', label: 'Card' },
                      { id: 'upi', label: 'UPI' },
                      { id: 'cod', label: 'Cash on Delivery' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as 'card' | 'upi' | 'cod')}
                        className={`flex-1 py-3 text-xs tracking-widest uppercase transition-all ${paymentMethod === m.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Card Number *</label>
                        <input
                          className={inputClass('cardNumber')}
                          value={cardForm.number}
                          onChange={e => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                            setCardForm(f => ({ ...f, number: formatted }));
                          }}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                        />
                        {errors.cardNumber && <p className="text-[10px] text-accent mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Expiry *</label>
                          <input
                            className={inputClass('expiry')}
                            value={cardForm.expiry}
                            onChange={e => {
                              let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                              setCardForm(f => ({ ...f, expiry: v }));
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiry && <p className="text-[10px] text-accent mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">CVV *</label>
                          <input
                            className={inputClass('cvv')}
                            type="password"
                            value={cardForm.cvv}
                            onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            placeholder="•••"
                            maxLength={4}
                          />
                          {errors.cvv && <p className="text-[10px] text-accent mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">Name on Card *</label>
                        <input className={inputClass('cardName')} value={cardForm.name} onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} placeholder="Priya Sharma" />
                        {errors.cardName && <p className="text-[10px] text-accent mt-1">{errors.cardName}</p>}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-muted-foreground block mb-1.5">UPI ID *</label>
                      <input
                        className={inputClass('upiId')}
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                      />
                      {errors.upiId && <p className="text-[10px] text-accent mt-1">{errors.upiId}</p>}
                      <p className="text-xs text-muted-foreground mt-3 font-sans-light">
                        You'll receive a payment request on your UPI app after placing the order.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="border border-border p-6">
                      <p className="font-serif-display text-lg font-light mb-2">Cash on Delivery</p>
                      <p className="font-sans-light text-sm text-muted-foreground leading-relaxed">
                        Pay when your order arrives at your doorstep. COD is available for orders up to ₹10,000. An additional fee of ₹49 applies.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep('details')}
                      className="flex-1 border border-border py-4 text-xs tracking-widest uppercase hover:border-foreground transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-[2] bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase hover:bg-accent transition-colors"
                    >
                      Place Order · ₹{(total + (paymentMethod === 'cod' ? 49 : 0)).toLocaleString()}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="bg-secondary p-8 h-fit sticky top-24">
              <p className="text-[9px] tracking-[0.4em] uppercase mb-6 text-muted-foreground">Your Order</p>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                    <div className="relative w-16 h-20 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-foreground text-background text-[9px] flex items-center justify-center rounded-full">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-serif-display text-sm leading-snug">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wider">{item.selectedSize && `Size: ${item.selectedSize}`}</p>
                      <p className="text-sm mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-xs tracking-wider">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs tracking-wider">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-xs tracking-wider">
                    <span className="text-muted-foreground">COD Fee</span>
                    <span>₹49</span>
                  </div>
                )}
                <div className="flex justify-between font-serif-display text-xl pt-3 border-t border-border">
                  <span>Total</span>
                  <span>₹{(total + (paymentMethod === 'cod' ? 49 : 0)).toLocaleString()}</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-muted-foreground mt-4 tracking-wider">
                  Add ₹{(2999 - cartTotal).toLocaleString()} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
