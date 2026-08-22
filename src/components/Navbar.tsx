import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  cartCount: number;
  wishlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  cartCount,
  wishlistCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (cat: ProductCategory | 'all', sectionId?: string) => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F3F1EC]/95 backdrop-blur-md border-b border-[#E2DFD7] py-3.5 shadow-[0_2px_15px_rgba(0,0,0,0.03)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Left: Category Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[11px] font-label text-[#111111] tracking-[0.16em]">
            <button
              onClick={() => handleNavClick('track-pants', 'products-section')}
              className="hover-underline-animation text-left cursor-pointer transition-colors hover:text-[#111111]"
            >
              TRACK PANTS
            </button>
            <button
              onClick={() => handleNavClick('t-shirts', 'products-section')}
              className="hover-underline-animation text-left cursor-pointer transition-colors hover:text-[#111111]"
            >
              T-SHIRTS
            </button>
            <button
              onClick={() => handleNavClick('shirts', 'products-section')}
              className="hover-underline-animation text-left cursor-pointer transition-colors hover:text-[#111111]"
            >
              SHIRTS
            </button>
            <button
              onClick={() => handleNavClick('oversize-tshirts', 'products-section')}
              className="hover-underline-animation text-left cursor-pointer transition-colors hover:text-[#111111]"
            >
              OVERSIZE TEES
            </button>
            <button
              onClick={() => handleNavClick('hoodies', 'products-section')}
              className="hover-underline-animation text-left cursor-pointer transition-colors hover:text-[#111111]"
            >
              HOODIES
            </button>
            <a
              href="#lookbook-section"
              className="hover-underline-animation text-left cursor-pointer transition-colors hover:text-[#111111]"
            >
              LOOKBOOK
            </a>
            <a
              href="#manifesto-section"
              className="hover-underline-animation text-left cursor-pointer transition-colors text-[#666666] hover:text-[#111111]"
            >
              MANIFESTO
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#111111] hover:text-[#444] cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center: Brand Wordmark */}
          <div className="flex-1 lg:flex-none text-center">
            <a
              href="#"
              className="inline-block text-2xl sm:text-3xl font-display font-extrabold tracking-[-0.05em] text-[#111111] leading-none select-none hover:opacity-90 transition-opacity"
            >
              K O R A
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[#111111]">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 text-[11px] font-label tracking-[0.14em] hover:text-[#B85D3B] transition-colors cursor-pointer group"
              aria-label="Search collection"
            >
              <Search size={18} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              <span className="hidden md:inline">SEARCH</span>
            </button>

            <button
              onClick={onOpenAccount}
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-label tracking-[0.14em] hover:text-[#B85D3B] transition-colors cursor-pointer group"
              aria-label="Studio account"
            >
              <User size={18} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              <span className="hidden md:inline">ACCOUNT</span>
            </button>

            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1.5 text-[11px] font-label tracking-[0.14em] hover:text-[#B85D3B] transition-colors cursor-pointer relative group"
              aria-label="Saved pieces"
            >
              <Heart size={18} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#B85D3B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 text-[11px] font-label tracking-[0.14em] hover:text-[#B85D3B] transition-colors cursor-pointer group"
              aria-label="Shopping bag"
            >
              <div className="relative">
                <ShoppingBag size={18} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#111111] text-[#F3F1EC] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-label">BAG ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-sm flex justify-start">
          <div className="w-full max-w-xs bg-[#F3F1EC] h-full p-6 flex flex-col justify-between shadow-2xl border-r border-[#E2DFD7]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E2DFD7]">
                <span className="text-xl font-display font-extrabold tracking-tight">K O R A</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#111111] hover:text-red-700 cursor-pointer"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-5 text-sm font-label tracking-[0.18em]">
                <button
                  onClick={() => handleNavClick('all', 'products-section')}
                  className="text-left py-1 hover:text-[#B85D3B] transition-colors"
                >
                  ALL PIECES
                </button>
                <button
                  onClick={() => handleNavClick('track-pants', 'products-section')}
                  className="text-left py-1 hover:text-[#B85D3B] transition-colors"
                >
                  TRACK PANTS
                </button>
                <button
                  onClick={() => handleNavClick('t-shirts', 'products-section')}
                  className="text-left py-1 hover:text-[#B85D3B] transition-colors"
                >
                  T-SHIRTS
                </button>
                <button
                  onClick={() => handleNavClick('shirts', 'products-section')}
                  className="text-left py-1 hover:text-[#B85D3B] transition-colors"
                >
                  SHIRTS
                </button>
                <button
                  onClick={() => handleNavClick('oversize-tshirts', 'products-section')}
                  className="text-left py-1 hover:text-[#B85D3B] transition-colors"
                >
                  OVERSIZE T-SHIRTS
                </button>
                <button
                  onClick={() => handleNavClick('hoodies', 'products-section')}
                  className="text-left py-1 hover:text-[#B85D3B] transition-colors"
                >
                  HOODIES
                </button>
                <a
                  href="#lookbook-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left py-1 hover:text-[#B85D3B] transition-colors"
                >
                  LOOKBOOK AW'25
                </a>
                <a
                  href="#manifesto-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left py-1 text-[#666666] hover:text-[#111111] transition-colors"
                >
                  STUDIO MANIFESTO
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2DFD7] text-[11px] font-label text-[#777777] space-y-2">
              <p>FREE SHIPPING ABOVE ₹2,999</p>
              <p className="text-[#111111]">
                STUDIO CONCIERGE:{' '}
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=clothingkora2026@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline transition-all"
                >
                  CLOTHINGKORA2026@GMAIL.COM
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
