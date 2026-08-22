import React from 'react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (category: ProductCategory | 'all') => void;
  onOpenTrackOrder: () => void;
  onOpenAccount: () => void;
  onOpenExchangeModal?: () => void;
  onOpenFabricationModal?: () => void;
  onOpenPrivacyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTrackOrder,
  onOpenAccount,
  onOpenExchangeModal,
  onOpenFabricationModal,
  onOpenPrivacyModal,
}) => {
  const handleCategoryNav = (cat: ProductCategory | 'all') => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    onSelectCategory(cat);
  };

  return (
    <footer className="w-full bg-[#111111] text-[#F3F1EC] pt-16 sm:pt-24 pb-12 overflow-hidden border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-[#262626]">
          
          {/* Col 1: Brand & Contact Info (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-2xl font-display font-extrabold tracking-tight text-[#F3F1EC]">
                K O R A
              </span>
              <p className="text-[11px] font-label text-[#888888] tracking-[0.2em]">
                FORM FOLLOWS MOTION &bull; AW'25
              </p>
            </div>
            
            <div className="text-[12px] font-mono text-[#A0A0A0] space-y-2.5 leading-relaxed max-w-md">
              <p className="tracking-wide">
                <span className="text-[#777777] uppercase text-[11px]">Studio Archive:</span>{' '}
                <span className="text-[#E2DFD7] font-medium">Guwahati</span>
              </p>
              <p className="tracking-wide">
                <span className="text-[#777777] uppercase text-[11px]">Email ID:</span>{' '}
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=clothingkora2026@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E2DFD7] hover:text-white transition-colors underline underline-offset-4 decoration-[#444444]"
                  title="Compose email to clothingkora2026@gmail.com in Gmail"
                >
                  clothingkora2026@gmail.com
                </a>
              </p>
              <p className="tracking-wide">
                <span className="text-[#777777] uppercase text-[11px]">Contact Number:</span>{' '}
                <a href="tel:+916003023292" className="text-[#E2DFD7] hover:text-white transition-colors">
                  +91 6003023292
                </a>
              </p>
            </div>
          </div>

          {/* Col 2: Shop Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-label font-bold text-[#E2DFD7] tracking-[0.22em]">
              CATALOG
            </h4>
            <ul className="space-y-2.5 text-[12px] font-mono text-[#8E8E8E]">
              <li>
                <button
                  onClick={() => handleCategoryNav('all')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  ALL PIECES (06)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('track-pants')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  TRACK PANTS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('t-shirts')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  T-SHIRTS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('shirts')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  STRUCTURED SHIRTS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('oversize-tshirts')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  OVERSIZE T-SHIRTS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('hoodies')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  HEAVYWEIGHT HOODIES
                </button>
              </li>
              <li>
                <a href="#lookbook-section" className="hover:text-white transition-colors text-left block">
                  AW'25 LOOKBOOK
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio & Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-label font-bold text-[#E2DFD7] tracking-[0.22em]">
              CONCIERGE
            </h4>
            <ul className="space-y-2.5 text-[12px] font-mono text-[#8E8E8E]">
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                >
                  TRACK DISPATCH
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAccount}
                  className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                >
                  MY ORDERS
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenExchangeModal}
                  className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                >
                  7-DAY DOORSTEP EXCHANGE
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                >
                  TERMS &amp; CONDITIONS
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Giant Repeating Watermark + Fine Print */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] font-mono text-[#666666]">
          <p>&copy; 2025 KORA ARCHITECTURAL LABS. ALL RIGHTS RESERVED.</p>
          
          <div className="flex items-center gap-6">
            <span className="text-[#888888]">CURRENCY: INR (₹)</span>
            <span>&bull;</span>
            <span className="text-[#888888]">SERVER TIME: IST</span>
          </div>
        </div>

        {/* Ghost Wordmark spanning screen width with full letter visibility */}
        <div className="w-full overflow-hidden mt-8 select-none pointer-events-none opacity-10 flex items-center justify-center px-2 sm:px-4">
          <div className="text-[15vw] sm:text-[13.5vw] md:text-[12vw] lg:text-[140px] xl:text-[160px] font-display font-black text-center tracking-[0.04em] text-white leading-none whitespace-nowrap">
            KORA
          </div>
        </div>

      </div>
    </footer>
  );
};
