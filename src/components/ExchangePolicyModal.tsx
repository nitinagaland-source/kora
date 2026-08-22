import React from 'react';
import { X, RefreshCw, Truck, CheckCircle2, ShieldCheck, Mail, Phone, ArrowRight } from 'lucide-react';

interface ExchangePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMyOrders?: () => void;
}

export const ExchangePolicyModal: React.FC<ExchangePolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenMyOrders,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#F3F1EC] border border-[#E2DFD7] text-[#111111] p-6 sm:p-8 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#666666] transition-colors cursor-pointer"
          aria-label="Close exchange policy modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6 border-b border-[#E2DFD7] pb-5">
          <div className="flex items-center gap-2 text-[10px] font-label text-[#777777] tracking-[0.2em] uppercase">
            <RefreshCw size={12} className="text-[#B85D3B]" />
            <span>KORA STUDIO CONCIERGE PROTOCOL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#111111]">
            7-DAY DOORSTEP EXCHANGE
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-sans leading-relaxed">
            Every KORA garment is designed for architectural precision. If the proportion, drape, or sizing isn't exact, our seamless doorstep exchange protocol ensures a zero-friction replacement.
          </p>
        </div>

        {/* 3-Step Protocol */}
        <div className="space-y-6">
          <div className="text-[11px] font-label font-bold text-[#111111] tracking-[0.18em]">
            EXCHANGE PROTOCOL WORKFLOW
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#EAE7DF] border border-[#D8D4CA] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#B85D3B]">01 / INITIATE</span>
              <h3 className="text-xs font-bold font-display uppercase">Select Alternate Size</h3>
              <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                Open "My Orders" or contact our concierge with your Order ID and requested replacement size or silhouette.
              </p>
            </div>

            <div className="p-4 bg-[#EAE7DF] border border-[#D8D4CA] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#B85D3B]">02 / DOORSTEP PICKUP</span>
              <h3 className="text-xs font-bold font-display uppercase">Complimentary Courier</h3>
              <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                Our logistics partner conducts a reverse pickup directly at your address within 24–48 hours across India.
              </p>
            </div>

            <div className="p-4 bg-[#EAE7DF] border border-[#D8D4CA] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#B85D3B]">03 / RAPID DISPATCH</span>
              <h3 className="text-xs font-bold font-display uppercase">Priority Delivery</h3>
              <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                Your freshly inspected replacement garment is dispatched via Priority Air courier with zero return shipping charges.
              </p>
            </div>
          </div>

          {/* Conditions Matrix */}
          <div className="p-4 bg-[#EAE7DF] border border-[#D8D4CA] space-y-3">
            <div className="text-[10px] font-label font-bold text-[#111111] tracking-[0.16em]">
              ELIGIBILITY STANDARDS
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#555555]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                <span>Original brand hangtags attached</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                <span>Unworn, unwashed &amp; unaltered</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                <span>Within 7 calendar days of delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                <span>Original cotton dust-bag included</span>
              </li>
            </ul>
          </div>

          {/* Concierge Contact & Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-[#666666] space-y-1 text-center sm:text-left">
              <p className="text-[#111111] font-bold">NEED IMMEDIATE ASSISTANCE?</p>
              <div className="flex flex-wrap items-center gap-3">
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=clothingkora2026@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#111111] hover:text-[#B85D3B] underline underline-offset-2 flex items-center gap-1"
                >
                  <Mail size={12} /> clothingkora2026@gmail.com
                </a>
                <a 
                  href="tel:+916003023292"
                  className="text-[#111111] hover:text-[#B85D3B] flex items-center gap-1"
                >
                  <Phone size={12} /> +91 6003023292
                </a>
              </div>
            </div>

            {onOpenMyOrders && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMyOrders();
                }}
                className="w-full sm:w-auto bg-[#111111] text-[#F3F1EC] px-6 py-3 text-[11px] font-label tracking-[0.2em] uppercase hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>VIEW MY ORDERS</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
