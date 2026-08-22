import React from 'react';
import { Check, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedItems: CartItem[];
  orderId: string;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  isOpen,
  onClose,
  purchasedItems,
  orderId,
}) => {
  if (!isOpen) return null;

  const totalAmount = purchasedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-[#F3F1EC] border border-[#E2DFD7] text-[#111111] p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Minimal Checkmark */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-[#111111] text-[#F3F1EC] mx-auto flex items-center justify-center">
            <Check size={24} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-label text-[#888888] tracking-[0.24em]">
              ORDER CONFIRMED &bull; STUDIO DISPATCH
            </span>
            <h2 className="text-2xl font-display font-bold">
              ORDER {orderId}
            </h2>
          </div>
          <p className="text-xs text-[#555555] font-sans max-w-xs mx-auto">
            Thank you for curating with KORA. Your garment is being prepared with custom matte tissue and vacuum-sealed dispatch.
          </p>
        </div>

        {/* Item Summary */}
        <div className="bg-[#EAE7DF] p-4 border border-[#D8D4CA] max-h-48 overflow-y-auto divide-y divide-[#D8D4CA] text-xs font-mono">
          {purchasedItems.map((item) => (
            <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center">
              <div>
                <p className="font-sans font-medium text-[#111111]">{item.product.name}</p>
                <p className="text-[10px] text-[#777777]">
                  {item.selectedColor.name} &bull; SIZE {item.selectedSize} &times; {item.quantity}
                </p>
              </div>
              <span className="font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="pt-2 flex justify-between font-bold text-sm text-[#111111]">
            <span>TOTAL PAID</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Studio Guarantee */}
        <div className="flex items-center gap-2 text-[10px] font-label text-[#777777] bg-[#E5E1D6] p-2.5">
          <ShieldCheck size={14} className="text-[#111111] shrink-0" />
          <span>COMPLIMENTARY 7-DAY DOORSTEP EXCHANGE POLICY ACTIVE</span>
        </div>

        {/* Action */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#111111] text-[#F3F1EC] py-3 text-[11px] font-label tracking-[0.18em] uppercase hover:bg-[#2A2A2A] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>RETURN TO ARCHIVE</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
