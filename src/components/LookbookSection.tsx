import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LOOKBOOK_ITEMS } from '../data/products';

interface LookbookSectionProps {
  onShopLook: (itemNames: string[]) => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({ onShopLook }) => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const activeLook = LOOKBOOK_ITEMS[activeLookIndex];

  return (
    <section id="lookbook-section" className="w-full bg-[#111111] text-[#F3F1EC] py-16 sm:py-24 border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#262626] gap-4">
          <div>
            <div className="text-[10px] font-label text-[#888888] tracking-[0.24em] mb-1">
              EDITORIAL ARCHIVE
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-[#F3F1EC]">
              THE SUNDAY UNIFORM
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-label tracking-[0.16em]">
            {LOOKBOOK_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveLookIndex(idx)}
                className={`px-3 py-1.5 transition-all cursor-pointer ${
                  activeLookIndex === idx
                    ? 'bg-[#F3F1EC] text-[#111111] font-bold'
                    : 'text-[#888888] hover:text-white border border-[#333333]'
                }`}
              >
                {item.lookNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Magazine Spread Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Visual Look (7 cols) */}
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] bg-[#1C1C1C] overflow-hidden group">
            <img
              src={activeLook.image}
              alt={activeLook.title}
              className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-102"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xs text-[#F3F1EC] text-[10px] font-label tracking-[0.2em] px-3 py-1 border border-white/10">
              {activeLook.season} &bull; {activeLook.lookNumber}
            </div>
          </div>

          {/* Look Breakdown & Story (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 pl-0 lg:pl-4">
            
            <div className="space-y-3">
              <span className="text-[10px] font-label text-[#B85D3B] tracking-[0.22em] flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>CURATED ENSEMBLE</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#F3F1EC]">
                {activeLook.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#9E9E9E] leading-relaxed font-sans">
                A study in proportion, weighted drape, and tactile silence. The pieces interact 
                seamlessly to create a silhouette that commands presence without demanding attention.
              </p>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={() => onShopLook(activeLook.itemsFeatured)}
                className="w-full sm:w-auto bg-[#F3F1EC] text-[#111111] px-8 py-3.5 text-[11px] font-label tracking-[0.2em] uppercase hover:bg-white active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SHOP NOW</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
