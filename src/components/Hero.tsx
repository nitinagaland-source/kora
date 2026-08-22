import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import heroImg from '../assets/images/kora_hero_streetwear_1787128110839.jpg';

interface HeroProps {
  onShopDropClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopDropClick, onExploreClick }) => {
  return (
    <section className="relative w-full overflow-hidden pt-4 pb-12 sm:pb-20 lg:pb-28 bg-[#F3F1EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative min-h-[580px] sm:min-h-[680px] lg:min-h-[780px] flex flex-col justify-between">
        
        {/* Top Metadata Row: Left Eyebrow + Right Badge */}
        <div className="w-full flex justify-between items-start pt-4 sm:pt-6 z-20">
          {/* Eyebrow Micro-type (Stacked) */}
          <div className="text-[11px] sm:text-[13px] font-label tracking-[0.24em] text-[#111111] leading-relaxed select-none">
            <p>EASE</p>
            <p>IN MOTION</p>
            <div className="flex items-center gap-2">
              <p>EVERY DAY.</p>
              <div className="w-6 h-[1px] bg-[#111111]"></div>
            </div>
          </div>

          {/* Right Sub-Badge */}
          <div className="hidden sm:block text-right text-[11px] font-label tracking-[0.22em] text-[#555555]">
            <p className="text-[#111111] font-semibold">DROP 04 / CORE</p>
            <p className="text-[10px] text-[#777777]">LIMITED METRIC RUN</p>
          </div>
        </div>

        {/* The Compositional Center: Giant Typographic Layer + Editorial Model */}
        <div className="relative w-full flex items-center justify-center my-auto py-8">
          
          {/* Background Display Wordmark "KORA" */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 px-1 sm:px-4">
            <h1 
              className="text-[19vw] sm:text-[17vw] md:text-[16vw] lg:text-[185px] xl:text-[215px] 2xl:text-[235px] font-display font-black text-[#111111] leading-none tracking-[0.02em] sm:tracking-[0.04em] lg:tracking-[0.05em] whitespace-nowrap opacity-[0.95]"
            >
              KORA
            </h1>
          </div>

          {/* Editorial Model Image intersecting with the letters */}
          <div className="relative z-10 w-[68%] sm:w-[50%] md:w-[42%] lg:w-[34%] max-w-[420px] mx-auto group">
            <div className="relative aspect-[3/4.2] overflow-hidden bg-[#E2DFD7] shadow-[0_20px_50px_rgba(0,0,0,0.09)]">
              {/* High-fashion editorial streetwear model */}
              <img
                src={heroImg}
                alt="KORA AW25 Oversized Streetwear Editorial"
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
              />

              {/* Editorial hairline overlay frame */}
              <div className="absolute inset-0 border border-white/20 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Action CTAs (Left) + Collection Season Metadata (Right) */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4 z-20">
          
          {/* Left Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={onShopDropClick}
              className="bg-[#111111] text-[#F3F1EC] px-8 py-3.5 text-[11px] sm:text-[12px] font-label tracking-[0.2em] uppercase hover:bg-[#2A2A2A] active:scale-[0.99] transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <span>SHOP THE DROP</span>
              <ArrowUpRight size={14} />
            </button>

            <button
              onClick={onExploreClick}
              className="group text-[#111111] text-[11px] sm:text-[12px] font-label tracking-[0.2em] uppercase py-3.5 hover-underline-animation cursor-pointer flex items-center gap-1.5"
            >
              <span>EXPLORE LOOKBOOK</span>
            </button>
          </div>

          {/* Right Micro Collection Tag */}
          <div className="text-left sm:text-right text-[11px] sm:text-[12px] font-label tracking-[0.22em] text-[#111111] select-none">
            <p className="text-[#666666]">AUTUMN / WINTER</p>
            <p className="font-bold">COLLECTION 2025</p>
            <div className="w-12 h-[1px] bg-[#111111] sm:ml-auto mt-1.5"></div>
          </div>

        </div>

      </div>
    </section>
  );
};
