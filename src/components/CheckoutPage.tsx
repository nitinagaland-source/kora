import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Search as SearchIcon, 
  X, 
  Edit3, 
  Check, 
  ArrowLeft,
  ShieldCheck,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  wishlistCount: number;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onBackToShopping: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOrderSuccess: (orderId: string, purchasedItems: CartItem[], customerName: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  wishlistCount,
  onUpdateQuantity,
  onRemoveItem,
  onBackToShopping,
  onOpenSearch,
  onOpenWishlist,
  onOpenAccount,
  onOrderSuccess,
}) => {
  // Customer Info State
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Shipping Address State
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Consent & Account
  const [consentPersonalData, setConsentPersonalData] = useState(true);
  const [createAccount, setCreateAccount] = useState(false);

  // Edit Purchases Mode
  const [isEditingPurchases, setIsEditingPurchases] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Totals calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free complimentary studio shipping
  const total = subtotal + shipping;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage('Your bag is currently empty.');
      return;
    }

    if (!consentPersonalData) {
      setErrorMessage('Please consent to the processing of personal data to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      const generatedOrderId = `KR-${Math.floor(100000 + Math.random() * 900000)}`;
      const buyerName = fullName.trim() || 'Client';
      onOrderSuccess(generatedOrderId, [...cartItems], buyerName);
      setIsSubmitting(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-sans flex flex-col justify-between selection:bg-[#111111] selection:text-[#F3F1EC]">
      
      {/* 1. Header Bar (Matched exactly from reference) */}
      <header className="w-full border-b border-[#E8E4DA] bg-[#FBF9F5] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Hamburger Menu */}
          <button 
            type="button"
            onClick={onBackToShopping}
            className="p-2 -ml-2 text-[#111111] hover:text-[#555555] transition-colors cursor-pointer flex items-center gap-2 group"
            title="Return to Store"
          >
            <Menu size={20} className="stroke-[1.5]" />
            <span className="text-xs font-label tracking-wider hidden sm:inline-block text-[#666666] group-hover:text-[#111111]">
              STORE
            </span>
          </button>

          {/* Center: Brand Name */}
          <button
            type="button"
            onClick={onBackToShopping}
            className="text-xl sm:text-2xl font-serif tracking-[0.25em] font-medium text-[#111111] hover:opacity-80 transition-opacity uppercase cursor-pointer"
          >
            KORA
          </button>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6 text-[#111111]">
            <button 
              type="button"
              onClick={onOpenSearch}
              className="p-1 hover:text-[#666666] transition-colors cursor-pointer"
              title="Search Archive"
            >
              <Search size={18} className="stroke-[1.5]" />
            </button>
            <button 
              type="button"
              onClick={onOpenAccount}
              className="p-1 hover:text-[#666666] transition-colors cursor-pointer"
              title="Account"
            >
              <User size={18} className="stroke-[1.5]" />
            </button>
            <button 
              type="button"
              onClick={onOpenWishlist}
              className="p-1 hover:text-[#666666] transition-colors relative cursor-pointer"
              title="Wishlist"
            >
              <Heart size={18} className="stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#111111] text-[#FBF9F5] text-[9px] font-mono rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              type="button"
              onClick={onBackToShopping}
              className="p-1 hover:text-[#666666] transition-colors relative cursor-pointer"
              title="Your Bag"
            >
              <ShoppingBag size={18} className="stroke-[1.5]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#111111] text-[#FBF9F5] text-[9px] font-mono rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Checkout Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 w-full flex-1">
        
        {/* Breadcrumb: SHOPPING CART | CHECKOUT */}
        <div className="mb-6 flex items-center gap-2 text-[11px] font-label tracking-[0.2em] text-[#88847C] uppercase">
          <button 
            type="button"
            onClick={onBackToShopping}
            className="hover:text-[#111111] transition-colors cursor-pointer"
          >
            SHOPPING CART
          </button>
          <span>|</span>
          <span className="text-[#111111] font-semibold">CHECKOUT</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#111111] mb-10 tracking-tight">
          Checkout
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-[#E8E4DA] p-12 text-center my-8 rounded-none max-w-lg mx-auto">
            <ShoppingBag size={36} className="mx-auto mb-4 text-[#888888] stroke-[1]" />
            <h2 className="text-lg font-serif font-medium mb-2">Your Bag is Empty</h2>
            <p className="text-xs text-[#666666] mb-6">Explore the latest architectural garments and select pieces to checkout.</p>
            <button
              type="button"
              onClick={onBackToShopping}
              className="bg-[#111111] text-[#F3F1EC] px-6 py-3 text-xs font-label tracking-[0.2em] hover:bg-black transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              RETURN TO ARCHIVE
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* LEFT COLUMN: Customer Info, Shipping Address, Payment */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* SECTION: Customer Info */}
              <div className="space-y-4">
                <h2 className="text-base font-medium text-[#111111]">Customer info</h2>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Shipping Address */}
              <div className="space-y-4 pt-2">
                <h2 className="text-base font-medium text-[#111111]">Shipping Address</h2>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors pr-10"
                      required
                    />
                    <SearchIcon size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#99948B] pointer-events-none" />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Payment */}
              <div className="space-y-4 pt-2">
                <h2 className="text-base font-medium text-[#111111]">Payment</h2>
                
                {/* Payment Method Radio Group */}
                <div className="flex flex-wrap items-center gap-6 py-1 text-sm">
                  
                  {/* Credit Card Option */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-[#111111] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal text-[#111111]">Credit Card</span>
                    {/* Card Logos */}
                    <div className="flex items-center gap-1.5 ml-1">
                      <span className="bg-[#EB001B] text-white text-[8px] font-bold px-1 py-0.5 rounded-xs leading-none">MC</span>
                      <span className="bg-[#1A1F71] text-white text-[8px] font-bold px-1 py-0.5 rounded-xs leading-none">VISA</span>
                    </div>
                  </label>

                  {/* Paypal Option */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="accent-[#111111] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal text-[#111111]">Paypal</span>
                  </label>

                  {/* UPI / Net Banking Option */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-[#111111] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal text-[#111111]">UPI / COD</span>
                  </label>

                </div>

                {/* Card Fields (or alternative fields) */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                        className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Expire Date (MM/YY)"
                        value={expireDate}
                        onChange={(e) => setExpireDate(e.target.value)}
                        maxLength={5}
                        className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVC/CVC (123)"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        maxLength={4}
                        className="w-full bg-white border border-[#DCD7CD] focus:border-[#111111] px-4 py-3 text-sm text-[#111111] placeholder:text-[#99948B] outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="bg-white border border-[#DCD7CD] p-4 text-xs space-y-2">
                    <p className="text-[#333333]">Instant QR scan or Cash on Doorstep delivery upon receipt.</p>
                    <input 
                      type="text"
                      placeholder="UPI ID (e.g. user@okhdfcbank)"
                      className="w-full bg-[#FAF9F5] border border-[#DCD7CD] px-3 py-2.5 text-xs text-[#111111] outline-none"
                    />
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="bg-white border border-[#DCD7CD] p-4 text-xs text-[#555555]">
                    You will be directed to PayPal to complete your payment securely.
                  </div>
                )}

                {/* Consent and Create Account Checkboxes */}
                <div className="space-y-2.5 pt-3">
                  <label className="flex items-center gap-2.5 text-xs text-[#444444] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentPersonalData}
                      onChange={(e) => setConsentPersonalData(e.target.checked)}
                      className="accent-[#111111] w-4 h-4 cursor-pointer"
                    />
                    <span>I give my consent to the processing of personal data</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-[#444444] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="accent-[#111111] w-4 h-4 cursor-pointer"
                    />
                    <span>Create an account</span>
                  </label>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Your purchases & Order Summary */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* SECTION: Your purchases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-medium text-[#111111]">Your purchases</h2>
                  <button
                    type="button"
                    onClick={() => setIsEditingPurchases(!isEditingPurchases)}
                    className="text-xs text-[#666666] hover:text-[#111111] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>{isEditingPurchases ? 'Done' : 'Edit'}</span>
                  </button>
                </div>

                {/* List of Cart Items (matched from reference styling) */}
                <div className="space-y-4 divide-y divide-[#E8E4DA]">
                  {cartItems.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                      
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-16 bg-[#EBE7DF] overflow-hidden flex-shrink-0 border border-[#E0DCD2]">
                          <img
                            src={item.product.images.primary}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xs font-medium text-[#111111] leading-snug line-clamp-1">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-[#77746E]">
                            {/* Color Dot Swatch */}
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                              style={{ backgroundColor: item.selectedColor.hex }}
                              title={item.selectedColor.name}
                            />
                            <span>{item.selectedSize}</span>
                            <span>&bull;</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          {isEditingPurchases && (
                            <div className="flex items-center gap-2 pt-1 text-xs">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-5 h-5 bg-[#E8E4DA] flex items-center justify-center hover:bg-[#DCD7CD] cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-mono text-xs">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 bg-[#E8E4DA] flex items-center justify-center hover:bg-[#DCD7CD] cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Price & Remove Button */}
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-xs font-mono font-medium text-[#111111]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#99948B] hover:text-[#111111] transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: Order Summary (Enclosed outlined box matching reference) */}
              <div className="border border-[#DCD7CD] p-6 bg-white/70 space-y-4">
                <h3 className="text-base font-medium text-[#111111]">Order Summary</h3>
                
                <div className="space-y-2.5 text-xs text-[#555555] font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#111111] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#111111] font-medium">
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DCD7CD] flex justify-between items-baseline">
                  <span className="text-xs font-medium text-[#111111] uppercase tracking-wider">Total</span>
                  <span className="text-lg font-serif font-bold text-[#111111]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>

                {errorMessage && (
                  <p className="text-[11px] font-mono text-red-600 bg-red-50 p-2 border border-red-200">
                    {errorMessage}
                  </p>
                )}

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-[#F3F1EC] py-3.5 text-xs font-label tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-[0.99]"
                >
                  {isSubmitting ? 'PROCESSING ORDER...' : 'PROCEED TO CHECKOUT'}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#77746E] pt-1">
                  <ShieldCheck size={13} />
                  <span>256-Bit SSL Encrypted Studio Checkout</span>
                </div>

              </div>

            </div>

          </form>
        )}

      </main>

      {/* 3. Footer (Faithful recreation from the reference layout) */}
      <footer className="w-full border-t border-[#E8E4DA] bg-[#FBF9F5] mt-16 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E8E4DA]">
            
            {/* Col 1: Brand & Contact Info (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <h2 className="text-xl font-serif tracking-[0.2em] font-medium text-[#111111]">
                KORA
              </h2>
              <div className="space-y-1.5 text-xs text-[#66645E]">
                <p>+91 (800) 543-21-09</p>
                <p>concierge@kora-archive.com</p>
                <p className="text-[11px] text-[#88847C] pt-1">Industrial Design Studio &bull; Heavyweight Streetwear</p>
              </div>
            </div>

            {/* Col 2: COMPANY (2-3 cols) */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-[10px] font-label tracking-[0.2em] uppercase text-[#88847C] font-semibold">
                COMPANY
              </h4>
              <ul className="space-y-1.5 text-xs text-[#555555]">
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">About us</button></li>
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">Testimonials</button></li>
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">FAQs</button></li>
              </ul>
            </div>

            {/* Col 3: ASSISTANCE (3 cols) */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="text-[10px] font-label tracking-[0.2em] uppercase text-[#88847C] font-semibold">
                ASSISTANCE
              </h4>
              <ul className="space-y-1.5 text-xs text-[#555555]">
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">Delivery</button></li>
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">Corporate Orders</button></li>
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">Payment</button></li>
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">Shipping &amp; Return</button></li>
                <li><button type="button" onClick={onBackToShopping} className="hover:text-[#111111] transition-colors cursor-pointer">Terms &amp; Conditions</button></li>
              </ul>
            </div>

            {/* Col 4: SOCIAL (2 cols) */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-[10px] font-label tracking-[0.2em] uppercase text-[#88847C] font-semibold">
                SOCIAL
              </h4>
              <ul className="space-y-1.5 text-xs text-[#555555]">
                <li><a href="#instagram" className="hover:text-[#111111] transition-colors">Instagram</a></li>
                <li><a href="#youtube" className="hover:text-[#111111] transition-colors">Youtube</a></li>
                <li><a href="#facebook" className="hover:text-[#111111] transition-colors">Facebook</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 text-[11px] text-[#88847C]">
            <p>&copy; Copyright 2026. KORA</p>
          </div>

        </div>
      </footer>

    </div>
  );
};
