import React from 'react';

export const BrandPhilosophy: React.FC = () => {
  return (
    <section id="manifesto-section" className="w-full bg-[#F3F1EC] py-20 sm:py-28 border-b border-[#E2DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Editorial Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-[10px] sm:text-[11px] font-label text-[#888888] tracking-[0.28em] block">
            STUDIO MANIFESTO &bull; VOLUME 01
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#111111] leading-[1.08] tracking-tight">
            "NOT LOUD STREETWEAR. NOT CORPORATE RETAIL. THE ARCHITECT’S WARDROBE."
          </h2>

          <p className="text-[14px] sm:text-[15px] text-[#555555] font-sans leading-relaxed pt-2">
            KORA exists in the space between structural discipline and relaxed ease. 
            We engineer three foundational garments with obsessive attention to weight, 
            collar tension, and drape.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#E2DFD7]">
          
          <div className="space-y-3 pr-4">
            <div className="text-[11px] font-mono text-[#B85D3B] font-bold">
              01 / FABRICATION DENSITY
            </div>
            <h3 className="text-lg font-display font-bold text-[#111111]">
              HEAVYWEIGHT BY DESIGN
            </h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              We specify 280 GSM compact cottons and 420 GSM loopback French terry. 
              The weight ensures the garment holds an intentional architectural structure 
              off the body rather than clinging.
            </p>
          </div>

          <div className="space-y-3 pr-4">
            <div className="text-[11px] font-mono text-[#B85D3B] font-bold">
              02 / SILHOUETTE MATHEMATICS
            </div>
            <h3 className="text-lg font-display font-bold text-[#111111]">
              PRECISION PROPORTIONS
            </h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              Every drop shoulder, cuff break, and knife pleat is drafted with exact 
              ratios to create a sharp, intentional silhouette that moves fluidly from dawn 
              to midnight.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-mono text-[#B85D3B] font-bold">
              03 / RESTRAINED HARDWARE
            </div>
            <h3 className="text-lg font-display font-bold text-[#111111]">
              NO OVERT BRANDING
            </h3>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              Smoked mother-of-pearl buttons, blind plackets, matte zinc eyelets, and tonal 
              micro-embroidery. Confidence that speaks through material substance rather than 
              logos.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
