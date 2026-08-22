/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryStrip } from './components/CategoryStrip';
import { HeavyweightStreetwearSection } from './components/HeavyweightStreetwearSection';
import { TrustStrip } from './components/TrustStrip';
import { ProductGrid } from './components/ProductGrid';
import { LookbookSection } from './components/LookbookSection';
import { BrandPhilosophy } from './components/BrandPhilosophy';
import { Footer } from './components/Footer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AccountModal, SavedOrder } from './components/AccountModal';
import { ExchangePolicyModal } from './components/ExchangePolicyModal';
import { FabricationGuideModal } from './components/FabricationGuideModal';
import { PrivacyProtocolModal } from './components/PrivacyProtocolModal';
import { CheckoutSuccessModal } from './components/CheckoutSuccessModal';
import { CheckoutPage } from './components/CheckoutPage';
import { PRODUCTS } from './data/products';
import { Product, ProductCategory, ColorOption, CartItem } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'checkout'>('store');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isFabricationModalOpen, setIsFabricationModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{ items: CartItem[]; orderId: string } | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kora_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kora_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Cart operations
  const handleAddToCart = (product: Product, color: ColorOption, size: 'S' | 'M' | 'L' | 'XL') => {
    const itemKey = `${product.id}-${color.name}-${size}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Checkout navigation & processing
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderId: string, purchasedItems: CartItem[], customerName: string) => {
    const totalAmount = purchasedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: SavedOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: customerName || 'Studio Member',
      items: purchasedItems,
      total: totalAmount,
      status: 'PROCESSING',
      trackingNumber: `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    try {
      const existing = localStorage.getItem('kora_orders');
      const ordersList: SavedOrder[] = existing ? JSON.parse(existing) : [];
      localStorage.setItem('kora_orders', JSON.stringify([newOrder, ...ordersList]));
    } catch {
      // ignore
    }

    setCheckoutData({
      items: purchasedItems,
      orderId,
    });
    setCartItems([]);
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lookbook interaction
  const handleShopLook = (itemNames: string[]) => {
    // Find matching products or scroll to collection
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLookbook = () => {
    const el = document.getElementById('lookbook-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (currentView === 'checkout') {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-sans antialiased relative selection:bg-[#111111] selection:text-[#F3F1EC]">
        <CheckoutPage
          cartItems={cartItems}
          wishlistCount={wishlist.length}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onBackToShopping={() => {
            setCurrentView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Global Drawers / Modals accessible during checkout */}
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistItems={wishlist}
          onRemoveWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={PRODUCTS}
          onSelectProduct={(p) => {
            setQuickViewProduct(p);
            setIsSearchOpen(false);
          }}
        />

        <TrackOrderModal
          isOpen={isTrackOrderOpen}
          onClose={() => setIsTrackOrderOpen(false)}
        />

        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
        />

        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F1EC] text-[#111111] font-sans antialiased relative selection:bg-[#111111] selection:text-[#F3F1EC]">
      
      {/* 1. Announcement Bar */}
      <AnnouncementBar onTrackOrderClick={() => setIsTrackOrderOpen(true)} />

      {/* 2. Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
      />

      {/* 3. Hero Section (Asymmetric Graphic Typographic Layer) */}
      <Hero
        onShopDropClick={scrollToProducts}
        onExploreClick={scrollToLookbook}
      />

      {/* 4. Category Strip (High-Contrast Dark Section: Track Pants, T-Shirts, Shirts) */}
      <CategoryStrip
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* 4b. Heavyweight Streetwear Section (Oversize T-Shirts & Hoodies) */}
      <HeavyweightStreetwearSection
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* 5. Trust Strip */}
      <TrustStrip />

      {/* 7. Product Grid ("BEST OF KORA") */}
      <ProductGrid
        products={PRODUCTS}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isWishlisted}
      />

      {/* 8. Lookbook Section */}
      <LookbookSection onShopLook={handleShopLook} />

      {/* 9. Brand Philosophy & Studio Manifesto */}
      <BrandPhilosophy />

      {/* 10. Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenTrackOrder={() => {
          setTrackOrderId('');
          setIsTrackOrderOpen(true);
        }}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenExchangeModal={() => setIsExchangeModalOpen(true)}
        onOpenFabricationModal={() => setIsFabricationModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Modals and Drawers */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => {
          setIsTrackOrderOpen(false);
          setTrackOrderId('');
        }}
        initialOrderId={trackOrderId}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenTrackOrder={(ordId) => {
          setTrackOrderId(ordId || '');
          setIsTrackOrderOpen(true);
        }}
        onOpenExchangeModal={() => setIsExchangeModalOpen(true)}
      />

      <ExchangePolicyModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        onOpenMyOrders={() => setIsAccountOpen(true)}
      />

      <FabricationGuideModal
        isOpen={isFabricationModalOpen}
        onClose={() => setIsFabricationModalOpen(false)}
      />

      <PrivacyProtocolModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <CheckoutSuccessModal
        isOpen={!!checkoutData}
        onClose={() => setCheckoutData(null)}
        purchasedItems={checkoutData?.items || []}
        orderId={checkoutData?.orderId || ''}
      />

    </div>
  );
}
