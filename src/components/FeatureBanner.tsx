import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import editorialMotionImg from '../assets/images/kora_feature_editorial_upload.png';

interface FeatureBannerProps {
  onExploreCollection: () => void;
}

export const FeatureBanner: React.FC<FeatureBannerProps> = ({ onExploreCollection }) => {
  return (
    <section className="w-full bg-[#EAE7DF] border-b border-[#D8D4CA] overflow-hidden py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Statement (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 pr-0 lg:pr-6">
            
            <div className="space-y-4">
              <div className="text-[10px] sm:text-[11px] font-label text-[#666666] tracking-[0.24em] flex items-center gap-2">
                <span>NEW SEASON</span>
                <span className="w-4 h-[1px] bg-[#888888]"></span>
                <span className="text-[#111111]">AW'25 EDITORIAL</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#111111] leading-[0.95] tracking-[-0.03em]">
                FORM<br />
                FOLLOWS<br />
                MOTION.
              </h2>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#444444] leading-relaxed font-sans max-w-md">
              We stripped away unnecessary hardware, overt branding, and temporary hype. 
              KORA is designed for the modern uniform — architectural silhouettes engineered in 
              high-weight Japanese cottons and organic French terry.
            </p>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#D8D4CA] text-[11px] font-label">
              <div>
                <span className="text-[#777777] block text-[9px]">FABRIC DENSITY</span>
                <span className="text-[#111111] font-bold tracking-[0.14em]">280 – 420 GSM</span>
              </div>
              <div>
                <span className="text-[#777777] block text-[9px]">CUT ARCHETYPE</span>
                <span className="text-[#111111] font-bold tracking-[0.14em]">BOXY & DRAPED</span>
              </div>
            </div>

            <div>
              <button
                onClick={onExploreCollection}
                className="bg-[#111111] text-[#F3F1EC] px-8 py-4 text-[11px] sm:text-[12px] font-label tracking-[0.2em] uppercase hover:bg-[#2A2A2A] active:scale-[0.99] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

          </div>

          {/* Right Column: High-contrast Lifestyle Editorial Image (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3.2] sm:aspect-[16/11] w-full overflow-hidden bg-[#D8D4CA] shadow-[0_15px_40px_rgba(0,0,0,0.06)] group">
              <img
                src={editorialMotionImg}
                alt="KORA editorial portrait"
                className="w-full h-full object-cover object-[center_30%] transition-transform duration-1000 group-hover:scale-103"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              
              {/* Corner badge */}
              <div className="absolute top-4 right-4 bg-[#111111]/85 backdrop-blur-xs text-[#F3F1EC] text-[9px] font-label tracking-[0.2em] px-3 py-1.5 border border-white/10">
                STUDIO CAMPAIGN 04
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
