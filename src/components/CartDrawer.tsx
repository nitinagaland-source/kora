import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2999;
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 250;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'KORA10' || promoCode.trim().toUpperCase() === 'FIRSTDROP') {
      setAppliedDiscount(0.1);
      setPromoMessage('10% STUDIO PRIVILEGE APPLIED');
    } else {
      setPromoMessage('INVALID CODE (TRY: KORA10)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#F3F1EC] h-full shadow-2xl flex flex-col justify-between border-l border-[#E2DFD7] text-[#111111] animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E2DFD7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-display font-bold tracking-tight">STUDIO BAG</h2>
            <span className="text-[11px] font-mono bg-[#111111] text-[#F3F1EC] px-2 py-0.5">
              {items.reduce((sum, item) => sum + item.quantity, 0)} PIECES
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#111111] hover:text-[#666666] transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#EAE7DF] px-6 py-3 border-b border-[#D8D4CA] text-[11px] font-label">
          {remainingForFreeShipping === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Check size={14} />
              <span>COMPLIMENTARY SHIPPING UNLOCKED</span>
            </div>
          ) : (
            <div>
              <p className="text-[#555555]">
                ADD <span className="text-[#111111] font-bold font-mono">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> MORE FOR FREE DISPATCH
              </p>
              <div className="w-full h-1 bg-[#D0CCC2] mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#111111] transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E2DFD7]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-12 h-12 rounded-full border border-[#D8D4CA] flex items-center justify-center text-[#888888]">
                &empty;
              </div>
              <p className="text-sm font-label text-[#777777] tracking-[0.16em]">
                YOUR BAG IS CURRENTLY EMPTY
              </p>
              <button
                onClick={onClose}
                className="bg-[#111111] text-[#F3F1EC] px-6 py-2.5 text-[11px] font-label tracking-[0.2em] uppercase hover:bg-[#2A2A2A] cursor-pointer"
              >
                DISCOVER PIECES
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-[#EAE7DF] shrink-0 border border-[#E2DFD7] overflow-hidden">
                  <img
                    src={item.product.images.primary}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[13px] font-sans font-medium text-[#111111] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#999999] hover:text-red-700 p-1 cursor-pointer transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#777777]">
                      <span className="flex items-center gap-1">
                        <span 
                          className="w-2 h-2 rounded-full border border-black/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                      <span>&bull;</span>
                      <span className="font-bold text-[#111111]">SIZE {item.selectedSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#D8D4CA] bg-[#EAE7DF]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-[#DDD9CE] cursor-pointer text-[#111111]"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 text-[11px] font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-[#DDD9CE] cursor-pointer text-[#111111]"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-[13px] font-mono font-bold text-[#111111]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E2DFD7] bg-[#EAE7DF] space-y-4">
            
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. KORA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-[#F3F1EC] border border-[#D8D4CA] px-3 py-2 text-[11px] font-mono uppercase placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-[#111111] text-[#F3F1EC] px-3 py-2 text-[10px] font-label tracking-[0.14em] hover:bg-[#2A2A2A] cursor-pointer"
              >
                APPLY
              </button>
            </div>
            {promoMessage && (
              <p className="text-[10px] font-mono text-[#B85D3B]">{promoMessage}</p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-[12px] font-mono pt-2 border-t border-[#D8D4CA]">
              <div className="flex justify-between text-[#666666]">
                <span>SUBTOTAL</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#B85D3B]">
                  <span>STUDIO PRIVILEGE (10%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#666666]">
                <span>DISPATCH FREIGHT</span>
                <span>{shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#D0CCC2]">
                <span>ESTIMATED TOTAL</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-[#111111] text-[#F3F1EC] py-4 text-[12px] font-label tracking-[0.2em] uppercase hover:bg-[#2A2A2A] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={15} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-label text-[#777777]">
              <ShieldCheck size={13} />
              <span>ENCRYPTED CHECKOUT &bull; ALL MAJOR CARDS &amp; UPI</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
