import React, { useState } from 'react';
import { X, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import { Product, ColorOption } from '../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: ColorOption, size: 'S' | 'M' | 'L' | 'XL') => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [activeImageIndex, setActiveImageIndex] = useState<'primary' | 'secondary' | 'detail'>('primary');
  const [isAdded, setIsAdded] = useState(false);

  const imagesList = [
    { key: 'primary' as const, src: product.images.primary, label: 'FRONT' },
    { key: 'secondary' as const, src: product.images.secondary, label: 'PROFILE' },
    ...(product.images.detail ? [{ key: 'detail' as const, src: product.images.detail, label: 'DETAIL' }] : []),
  ];

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#F3F1EC] text-[#111111] max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E2DFD7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#111111] text-[#F3F1EC] hover:bg-[#333333] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
          
          {/* Left: Imagery Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-[#EAE7DF] overflow-hidden border border-[#E2DFD7]">
              <img
                src={product.images[activeImageIndex] || product.images.primary}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#111111] text-[#F3F1EC] text-[9px] font-label px-2.5 py-1 tracking-[0.16em]">
                {product.edition || 'CORE ARCHIVE'}
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2">
              {imagesList.map((img) => (
                <button
                  key={img.key}
                  onClick={() => setActiveImageIndex(img.key)}
                  className={`flex-1 py-1.5 text-[10px] font-label tracking-[0.16em] border transition-colors cursor-pointer ${
                    activeImageIndex === img.key
                      ? 'bg-[#111111] text-[#F3F1EC] border-[#111111]'
                      : 'bg-[#EAE7DF] text-[#666666] border-[#D8D4CA] hover:text-[#111111]'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Specifications & Purchasing */}
          <div className="flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category & Weight */}
              <div className="flex items-center justify-between text-[10px] font-label text-[#777777] tracking-[0.2em] border-b border-[#E2DFD7] pb-2">
                <span>{product.categoryLabel}</span>
                <span className="text-[#B85D3B] font-bold">{product.fabricGsm}</span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-bold text-[#111111] tracking-tight">
                  {product.name}
                </h2>
                <p className="text-[12px] font-mono text-[#666666]">
                  {product.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="text-xl font-mono font-bold text-[#111111]">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#444444] leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Colorway Selection */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[11px] font-label">
                  <span className="text-[#777777]">COLOR:</span>
                  <span className="font-bold text-[#111111]">{selectedColor.name}</span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-2 border text-[11px] font-sans cursor-pointer transition-all ${
                        selectedColor.name === color.name
                          ? 'border-[#111111] bg-[#111111] text-[#F3F1EC]'
                          : 'border-[#D8D4CA] bg-[#EAE7DF] text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing Selection */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[11px] font-label">
                  <span className="text-[#777777]">SELECT SIZE (TRUE TO OVERSIZED CUT):</span>
                  <span className="font-mono text-[#777777] underline cursor-pointer">FIT GUIDE</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-[12px] font-mono border text-center transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-[#111111] bg-[#111111] text-[#F3F1EC] font-bold'
                          : 'border-[#D8D4CA] bg-[#EAE7DF] text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Details List */}
              <div className="space-y-1.5 pt-3 border-t border-[#E2DFD7] text-[12px] text-[#555555]">
                {product.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#B85D3B] text-[10px] mt-0.5">&bull;</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E2DFD7]">
              <button
                onClick={handleAdd}
                className={`w-full py-4 text-[12px] font-label tracking-[0.2em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#111111] text-[#F3F1EC] hover:bg-[#2A2A2A]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO STUDIO BAG</span>
                  </>
                ) : (
                  <span>ADD TO BAG &bull; ₹{product.price.toLocaleString('en-IN')}</span>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] font-label text-[#777777] px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} /> 100% GOTS / ORGANIC
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw size={13} /> 7-DAY DOORSTEP EXCHANGE
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
