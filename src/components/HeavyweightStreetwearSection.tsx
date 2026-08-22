import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';
import oversizeTshirtImg from '../assets/images/kora_oversize_tshirt_upload.png';
import hoodieImg from '../assets/images/kora_hoodie_metropolis_upload.png';

interface HeavyweightStreetwearSectionProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const HeavyweightStreetwearSection: React.FC<HeavyweightStreetwearSectionProps> = ({
  onSelectCategory,
}) => {
  const categories = [
    {
      id: 'oversize-tshirts' as ProductCategory,
      number: '04',
      title: 'OVERSIZE T-SHIRTS',
      subtitle: 'Exaggerated boxy cut with weighted drop-shoulder drape.',
      specs: '320 GSM Compact Cotton',
      image: oversizeTshirtImg,
    },
    {
      id: 'hoodies' as ProductCategory,
      number: '05',
      title: 'HOODIES',
      subtitle: 'Double-layer structured crossover hood with zero drawstrings.',
      specs: '480 GSM Loopback Terry',
      image: hoodieImg,
    },
  ];

  return (
    <section className="w-full bg-[#111111] text-[#F3F1EC] py-14 sm:py-20 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#262626]">
          <div className="space-y-1">
            <span className="text-[10px] font-label text-[#888888] tracking-[0.24em] block">
              EXPANDED SILHOUETTES
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#F3F1EC]">
              HEAVYWEIGHT FORM
            </h2>
          </div>
          <span className="text-[11px] font-label text-[#666666] tracking-[0.2em] hidden sm:block">
            320 GSM COTTON &amp; 480 GSM FRENCH TERRY
          </span>
        </div>

        {/* 2-Column Grid matching the Category Strip exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#262626] last:border-r-0 pb-8 md:pb-0 md:pr-8 last:pr-0 transition-colors"
            >
              <div>
                {/* Image Container with Exact Same Aspect Ratio & Badges */}
                <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-[#1D1D1D] mb-6">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#111111]/80 backdrop-blur-xs text-[#F3F1EC] text-[9px] font-label px-2 py-0.5 tracking-[0.16em]">
                    {cat.number}
                  </div>
                </div>

                {/* Typography & Details */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-display font-bold tracking-tight text-[#F3F1EC] group-hover:text-[#E2DFD7] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[13px] text-[#A0A0A0] leading-relaxed font-sans max-w-md">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              {/* Shop CTA Link */}
              <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-[11px] font-label tracking-[0.2em] text-[#E2DFD7] group-hover:text-[#B85D3B] transition-colors">
                <span>SHOP {cat.title}</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
