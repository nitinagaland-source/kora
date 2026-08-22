import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Truck, Package, Clock } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ 
  isOpen, 
  onClose,
  initialOrderId = '',
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialOrderId) {
        setOrderNumber(initialOrderId);
        setSearched(true);
      } else {
        setSearched(false);
      }
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearched(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#F3F1EC] border border-[#E2DFD7] text-[#111111] p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#111111] hover:text-[#666666] cursor-pointer"
          aria-label="Close track order modal"
        >
          <X size={18} />
        </button>

        <div className="space-y-2 mb-6">
          <div className="text-[10px] font-label text-[#777777] tracking-[0.2em]">
            LOGISTICS &bull; DISPATCH CONCIERGE
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold">
            TRACK STUDIO DISPATCH
          </h2>
          <p className="text-xs text-[#666666] font-sans">
            Enter your 8-digit KORA Order Reference ID or AWB Tracking Number.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. KR-849204"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 bg-[#EAE7DF] border border-[#D8D4CA] px-3.5 py-2.5 text-xs font-mono tracking-wider focus:outline-none focus:border-[#111111]"
              required
            />
            <button
              type="submit"
              className="bg-[#111111] text-[#F3F1EC] px-5 py-2.5 text-[11px] font-label tracking-[0.16em] hover:bg-[#2A2A2A] cursor-pointer flex items-center gap-1.5"
            >
              <Search size={14} />
              <span>LOCATE</span>
            </button>
          </div>
        </form>

        {searched && (
          <div className="mt-6 pt-6 border-t border-[#E2DFD7] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between bg-[#EAE7DF] p-3 border border-[#D8D4CA]">
              <div>
                <span className="text-[9px] font-label text-[#777777]">STATUS:</span>
                <p className="text-xs font-mono font-bold text-emerald-800">IN TRANSIT &bull; PRIORITY AIR</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-label text-[#777777]">EST. ARRIVAL:</span>
                <p className="text-xs font-mono font-bold">TOMORROW, BY 18:00</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pl-2 text-xs font-mono text-[#555555]">
              <div className="flex items-center gap-3 text-[#111111]">
                <Truck size={15} className="text-[#B85D3B]" />
                <span>Out for Delivery from Regional Logistics Hub — 08:30 AM</span>
              </div>
              <div className="flex items-center gap-3">
                <Package size={15} className="text-[#888888]" />
                <span>Quality Inspection &amp; Studio Packaged — Yesterday</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={15} className="text-[#888888]" />
                <span>Order Verified &amp; Cut Reserved ({orderNumber.toUpperCase() || 'KR-849204'})</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
