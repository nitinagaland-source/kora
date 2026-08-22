import React, { useState } from 'react';
import { Heart, Eye, Plus, Check } from 'lucide-react';
import { Product, ProductCategory, ColorOption } from '../types';

interface ProductGridProps {
  products: Product[];
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, color: ColorOption, size: 'S' | 'M' | 'L' | 'XL') => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  // Local state for hover preview images & selected swatches
  const [selectedColors, setSelectedColors] = useState<Record<string, ColorOption>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, 'S' | 'M' | 'L' | 'XL'>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const color = selectedColors[product.id] || product.colors[0];
    const size = selectedSizes[product.id] || 'M';
    onAddToCart(product, color, size);
    
    setAddedNotice(product.id);
    setTimeout(() => {
      setAddedNotice(null);
    }, 1800);
  };

  return (
    <section id="products-section" className="w-full bg-[#F3F1EC] py-16 sm:py-24 border-b border-[#E2DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 pb-6 border-b border-[#E2DFD7] gap-6">
          <div>
            <div className="text-[10px] font-label text-[#777777] tracking-[0.24em] mb-1">
              CURATED SELECTION &bull; 2025
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[#111111] tracking-tight">
              BEST OF KORA
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-label tracking-[0.16em]">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#111111] text-[#F3F1EC] font-semibold'
                  : 'bg-transparent text-[#666666] hover:text-[#111111] border border-[#DDD9CE]'
              }`}
            >
              ALL PIECES ({products.length})
            </button>
            <button
              onClick={() => onSelectCategory('track-pants')}
              className={`px-4 py-2 transition-all cursor-pointer ${
                activeCategory === 'track-pants'
                  ? 'bg-[#111111] text-[#F3F1EC] font-semibold'
                  : 'bg-transparent text-[#666666] hover:text-[#111111] border border-[#DDD9CE]'
              }`}
            >
              TRACK PANTS
            </button>
            <button
              onClick={() => onSelectCategory('t-shirts')}
              className={`px-4 py-2 transition-all cursor-pointer ${
                activeCategory === 't-shirts'
                  ? 'bg-[#111111] text-[#F3F1EC] font-semibold'
                  : 'bg-transparent text-[#666666] hover:text-[#111111] border border-[#DDD9CE]'
              }`}
            >
              T-SHIRTS
            </button>
            <button
              onClick={() => onSelectCategory('shirts')}
              className={`px-4 py-2 transition-all cursor-pointer ${
                activeCategory === 'shirts'
                  ? 'bg-[#111111] text-[#F3F1EC] font-semibold'
                  : 'bg-transparent text-[#666666] hover:text-[#111111] border border-[#DDD9CE]'
              }`}
            >
              SHIRTS
            </button>
            <button
              onClick={() => onSelectCategory('oversize-tshirts')}
              className={`px-4 py-2 transition-all cursor-pointer ${
                activeCategory === 'oversize-tshirts'
                  ? 'bg-[#111111] text-[#F3F1EC] font-semibold'
                  : 'bg-transparent text-[#666666] hover:text-[#111111] border border-[#DDD9CE]'
              }`}
            >
              OVERSIZE T-SHIRTS
            </button>
            <button
              onClick={() => onSelectCategory('hoodies')}
              className={`px-4 py-2 transition-all cursor-pointer ${
                activeCategory === 'hoodies'
                  ? 'bg-[#111111] text-[#F3F1EC] font-semibold'
                  : 'bg-transparent text-[#666666] hover:text-[#111111] border border-[#DDD9CE]'
              }`}
            >
              HOODIES
            </button>
          </div>
        </div>

        {/* Product Grid (4 columns desktop, 2 columns mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
          {filteredProducts.map((product) => {
            const currentColor = selectedColors[product.id] || product.colors[0];
            const currentSize = selectedSizes[product.id] || 'M';
            const wishlisted = isWishlisted(product.id);
            const isJustAdded = addedNotice === product.id;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between"
              >
                {/* Image & Hover Action Container */}
                <div className="relative aspect-[3/4] w-full bg-[#EAE7DF] overflow-hidden mb-4 cursor-pointer">
                  {/* Primary Image */}
                  <img
                    src={product.images.primary}
                    alt={product.name}
                    className="w-full h-full object-cover object-center product-image-zoom group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onClick={() => onQuickView(product)}
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    {product.isNew && (
                      <span className="bg-[#111111] text-[#F3F1EC] text-[8px] sm:text-[9px] font-label px-2 py-0.5 tracking-[0.16em]">
                        NEW
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-[#EAE7DF] text-[#111111] border border-[#111111] text-[8px] sm:text-[9px] font-label px-2 py-0.5 tracking-[0.16em]">
                        CORE
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center transition-colors cursor-pointer z-10 ${
                      wishlisted
                        ? 'bg-[#B85D3B] text-white'
                        : 'bg-white/80 backdrop-blur-xs text-[#111111] hover:bg-white'
                    }`}
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      size={15}
                      strokeWidth={1.7}
                      className={wishlisted ? 'fill-current' : ''}
                    />
                  </button>

                  {/* Quick View & Quick Add Slide-up on Desktop Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex gap-1.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="flex-1 bg-[#F3F1EC] text-[#111111] text-[10px] font-label py-2.5 px-2 hover:bg-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span className="hidden sm:inline">QUICK VIEW</span>
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`flex-1 text-[10px] font-label py-2.5 px-2 transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#111111] text-[#F3F1EC] hover:bg-[#2A2A2A]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={13} />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <Plus size={13} />
                          <span>BAG ({currentSize})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Info Block */}
                <div className="space-y-2">
                  {/* Category & Fabric tag */}
                  <div className="flex items-center justify-between text-[10px] font-label text-[#777777] tracking-[0.16em]">
                    <span>{product.categoryLabel}</span>
                    <span className="text-[#999999]">{product.fabricGsm.split(' ')[0]} GSM</span>
                  </div>

                  {/* Product Title */}
                  <h3 
                    onClick={() => onQuickView(product)}
                    className="text-[13px] sm:text-[14px] font-sans font-medium text-[#111111] leading-snug line-clamp-1 cursor-pointer hover:underline"
                  >
                    {product.name}
                  </h3>

                  {/* Price Row */}
                  <div className="flex items-center gap-2 text-[13px] sm:text-[14px] font-mono tracking-tight text-[#111111]">
                    <span className="font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-[#888888] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Interactive Swatches & Sizing */}
                  <div className="pt-2 border-t border-[#E2DFD7] flex items-center justify-between">
                    {/* Colorway dots */}
                    <div className="flex items-center gap-1.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColors({ ...selectedColors, [product.id]: c })}
                          title={c.name}
                          className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                            currentColor.name === c.name
                              ? 'border-[#111111] ring-1 ring-[#111111] scale-110'
                              : 'border-black/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>

                    {/* Size Selector Pills */}
                    <div className="flex items-center gap-1">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSizes({ ...selectedSizes, [product.id]: s })}
                          className={`text-[9px] font-mono px-1.5 py-0.5 border transition-colors cursor-pointer ${
                            currentSize === s
                              ? 'bg-[#111111] text-[#F3F1EC] border-[#111111]'
                              : 'bg-transparent text-[#777777] border-transparent hover:border-[#CCCCCC]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
