import React, { useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
        p.fabricGsm.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.colors.some((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 pt-16 sm:pt-24">
      <div 
        className="w-full max-w-2xl bg-[#F3F1EC] shadow-2xl border border-[#E2DFD7] text-[#111111] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-6 border-b border-[#E2DFD7] flex items-center gap-3">
          <Search size={22} className="text-[#888888] shrink-0" />
          <input
            type="text"
            placeholder="SEARCH BY SILHOUETTE, FABRIC (e.g. 420 GSM), OR COLORWAY..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-[13px] sm:text-[14px] font-mono tracking-tight placeholder:text-[#999999] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#111111] hover:text-[#666666] cursor-pointer"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="bg-[#EAE7DF] px-6 py-2.5 border-b border-[#D8D4CA] flex items-center gap-2 overflow-x-auto text-[10px] font-label">
          <span className="text-[#888888]">POPULAR:</span>
          {['TRACK PANTS', 'OVERSIZE TEE', 'HOODIES', '280 GSM TEE', 'JAPANESE POPLIN', 'WASHED CHARCOAL'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-[#F3F1EC] text-[#111111] border border-[#DDD9CE] hover:border-[#111111] transition-colors whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 divide-y divide-[#E2DFD7]">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-[#777777] text-xs font-mono">
              TYPE TO SEARCH THE KORA ARCHIVE...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-[#777777] text-xs font-mono">
              NO PIECES MATCHING "{query}". TRY 'TRACK PANTS', 'SHIRTS', OR 'COTTON'.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="py-3 flex items-center justify-between group cursor-pointer hover:bg-[#EAE7DF]/60 px-2 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-14 bg-[#EAE7DF] border border-[#DDD9CE] overflow-hidden shrink-0">
                    <img
                      src={item.images.primary}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-sans font-medium text-[#111111] group-hover:underline">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-mono text-[#777777]">
                      {item.categoryLabel} &bull; {item.fabricGsm}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-mono font-bold">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <ArrowUpRight size={15} className="text-[#888888] group-hover:text-[#111111]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
