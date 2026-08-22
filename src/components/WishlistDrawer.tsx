import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onQuickView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#F3F1EC] h-full shadow-2xl flex flex-col justify-between border-l border-[#E2DFD7] text-[#111111]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E2DFD7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-display font-bold tracking-tight">SAVED PIECES</h2>
            <span className="text-[11px] font-mono bg-[#111111] text-[#F3F1EC] px-2 py-0.5">
              {wishlistItems.length} SAVED
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#111111] hover:text-[#666666] transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E2DFD7]">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-12 h-12 rounded-full border border-[#D8D4CA] flex items-center justify-center text-[#888888]">
                &hearts;
              </div>
              <p className="text-sm font-label text-[#777777] tracking-[0.16em]">
                NO SAVED PIECES IN YOUR ARCHIVE
              </p>
              <p className="text-xs text-[#888888] max-w-xs font-sans">
                Click the heart icon on any garment card to bookmark it for later review.
              </p>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <div className="w-20 h-24 bg-[#EAE7DF] shrink-0 border border-[#E2DFD7] overflow-hidden">
                  <img
                    src={product.images.primary}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-[13px] font-sans font-medium text-[#111111] line-clamp-1">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveWishlist(product)}
                        className="text-[#999999] hover:text-red-700 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-[#777777]">{product.fabricGsm}</p>
                    <div className="text-[13px] font-mono font-bold text-[#111111] mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="w-full bg-[#111111] text-[#F3F1EC] text-[10px] font-label py-2 px-3 hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag size={12} />
                      <span>SELECT SIZE &amp; ADD</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EAE7DF] border-t border-[#D8D4CA] text-center text-[10px] font-label text-[#777777]">
          SAVED ITEMS PERSIST AUTOMATICALLY IN YOUR LOCAL STUDIO SESSION
        </div>
      </div>
    </div>
  );
};
