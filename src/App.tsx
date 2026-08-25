import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
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
import { useFirestoreProducts } from './lib/firestoreHooks';
import { db } from './lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { AdminLayout } from './admin/AdminLayout';
import { AdminGuard } from './admin/AdminGuard';
import { LoginPage } from './admin/pages/LoginPage';
import { DashboardPage } from './admin/pages/DashboardPage';
import { ProductsPage } from './admin/pages/ProductsPage';
import { CategoriesPage } from './admin/pages/CategoriesPage';
import { CollectionsPage } from './admin/pages/CollectionsPage';
import { OrdersPage } from './admin/pages/OrdersPage';
import { CustomersPage } from './admin/pages/CustomersPage';
import { HomepageStudioPage } from './admin/pages/HomepageStudioPage';
import { ReviewsPage } from './admin/pages/ReviewsPage';
import { AnalyticsPage } from './admin/pages/AnalyticsPage';
import { MarketingPage } from './admin/pages/MarketingPage';
import { MediaLibraryPage } from './admin/pages/MediaLibraryPage';
import { SettingsPage } from './admin/pages/SettingsPage';
import { AuditLogPage } from './admin/pages/AuditLogPage';

const queryClient = new QueryClient();

function Storefront() {
  const { products: fsProducts, loading: fsLoading } = useFirestoreProducts();

  const mergedProducts: Product[] = React.useMemo(() => {
    if (fsProducts.length === 0) return PRODUCTS;
    return PRODUCTS.map(p => {
      const fs = fsProducts.find(f => f.name === p.name);
      if (!fs) return p;
      return {
        ...p,
        price: fs.price,
        originalPrice: fs.originalPrice || p.originalPrice,
        description: fs.description || p.description,
        fabricGsm: fs.fabricGsm || p.fabricGsm,
        composition: fs.composition || p.composition,
        silhouette: fs.silhouette || p.silhouette,
        isNew: fs.isNew,
        isBestseller: fs.isBestseller,
        edition: fs.edition || p.edition,
        images: {
          primary: fs.primaryImage || p.images.primary,
          secondary: fs.secondaryImage || p.images.secondary,
          detail: fs.detailImage || p.images.detail,
        },
      };
    });
  }, [fsProducts]);

  const [currentView, setCurrentView] = useState<'store' | 'checkout'>('store');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try { const s = localStorage.getItem('kora_cart'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try { const s = localStorage.getItem('kora_wishlist'); return s ? JSON.parse(s) : []; } catch { return []; }
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

  useEffect(() => { try { localStorage.setItem('kora_cart', JSON.stringify(cartItems)); } catch {} }, [cartItems]);
  useEffect(() => { try { localStorage.setItem('kora_wishlist', JSON.stringify(wishlist)); } catch {} }, [wishlist]);

  const handleAddToCart = (product: Product, color: ColorOption, size: 'S' | 'M' | 'L' | 'XL') => {
    const itemKey = product.id + '-' + color.name + '-' + size;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === itemKey);
      if (existing) return prev.map(item => item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: itemKey, product, selectedColor: color, selectedSize: size, quantity: 1 }];
    });
  };
  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) setCartItems(prev => prev.filter(item => item.id !== id));
    else setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };
  const handleRemoveItem = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => prev.some(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);
  };
  const isWishlisted = (productId: string) => wishlist.some(p => p.id === productId);
  const scrollToProducts = () => { const el = document.getElementById('products-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
  const scrollToLookbook = () => { const el = document.getElementById('lookbook-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrderSuccess = async (orderId: string, purchasedItems: CartItem[], customerName: string) => {
    const totalAmount = purchasedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const trackingNumber = 'AWB-' + Math.floor(10000000 + Math.random() * 90000000);
    const newOrder: SavedOrder = { orderId, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), customerName: customerName || 'Studio Member', items: purchasedItems, total: totalAmount, status: 'PROCESSING', trackingNumber };
    try { const existing = localStorage.getItem('kora_orders'); const ordersList: SavedOrder[] = existing ? JSON.parse(existing) : []; localStorage.setItem('kora_orders', JSON.stringify([newOrder, ...ordersList])); } catch {}
    try {
      await setDoc(doc(db, 'orders', orderId), {
        orderId,
        customerName: customerName || 'Studio Member',
        email: '',
        total: totalAmount,
        status: 'PROCESSING',
        paymentStatus: 'PENDING',
        trackingNumber,
        items: purchasedItems.map(i => ({
          name: i.product.name,
          qty: i.quantity,
          price: i.product.price,
          color: i.selectedColor.name,
          size: i.selectedSize,
        })),
        createdAt: serverTimestamp(),
      });
    } catch (err) { console.error('Order save to Firestore failed:', err); }
    setCheckoutData({ items: purchasedItems, orderId });
    setCartItems([]);
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'checkout') {
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#111111] font-sans antialiased relative">
        <CheckoutPage cartItems={cartItems} wishlistCount={wishlist.length} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onBackToShopping={() => { setCurrentView('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onOpenSearch={() => setIsSearchOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)} onOpenAccount={() => setIsAccountOpen(true)} onOrderSuccess={handleOrderSuccess} />
        <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={wishlist} onRemoveWishlist={handleToggleWishlist} onQuickView={p => setQuickViewProduct(p)} />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={mergedProducts} onSelectProduct={p => { setQuickViewProduct(p); setIsSearchOpen(false); }} />
        <TrackOrderModal isOpen={isTrackOrderOpen} onClose={() => setIsTrackOrderOpen(false)} />
        <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        <ProductQuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F1EC] text-[#111111] font-sans antialiased relative">
      <AnnouncementBar onTrackOrderClick={() => setIsTrackOrderOpen(true)} />
      <Navbar activeCategory={activeCategory} onSelectCategory={cat => setActiveCategory(cat)} onOpenSearch={() => setIsSearchOpen(true)} onOpenCart={() => setIsCartOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)} onOpenAccount={() => setIsAccountOpen(true)} cartCount={totalCartCount} wishlistCount={wishlist.length} />
      <Hero onShopDropClick={scrollToProducts} onExploreClick={scrollToLookbook} />
      <CategoryStrip onSelectCategory={cat => setActiveCategory(cat)} />
      <HeavyweightStreetwearSection onSelectCategory={cat => setActiveCategory(cat)} />
      <TrustStrip />
      <ProductGrid products={mergedProducts} activeCategory={activeCategory} onSelectCategory={setActiveCategory} onQuickView={p => setQuickViewProduct(p)} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isWishlisted={isWishlisted} />
      <LookbookSection onShopLook={() => { const el = document.getElementById('products-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} />
      <BrandPhilosophy />
      <Footer onSelectCategory={setActiveCategory} onOpenTrackOrder={() => { setTrackOrderId(''); setIsTrackOrderOpen(true); }} onOpenAccount={() => setIsAccountOpen(true)} onOpenExchangeModal={() => setIsExchangeModalOpen(true)} onOpenFabricationModal={() => setIsFabricationModalOpen(true)} onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)} />
      <ProductQuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onCheckout={() => { setIsCartOpen(false); setCurrentView('checkout'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={wishlist} onRemoveWishlist={handleToggleWishlist} onQuickView={p => setQuickViewProduct(p)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={mergedProducts} onSelectProduct={p => setQuickViewProduct(p)} />
      <TrackOrderModal isOpen={isTrackOrderOpen} onClose={() => { setIsTrackOrderOpen(false); setTrackOrderId(''); }} initialOrderId={trackOrderId} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} onOpenTrackOrder={ordId => { setTrackOrderId(ordId || ''); setIsTrackOrderOpen(true); }} onOpenExchangeModal={() => setIsExchangeModalOpen(true)} />
      <ExchangePolicyModal isOpen={isExchangeModalOpen} onClose={() => setIsExchangeModalOpen(false)} onOpenMyOrders={() => setIsAccountOpen(true)} />
      <FabricationGuideModal isOpen={isFabricationModalOpen} onClose={() => setIsFabricationModalOpen(false)} />
      <PrivacyProtocolModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      <CheckoutSuccessModal isOpen={!!checkoutData} onClose={() => setCheckoutData(null)} purchasedItems={checkoutData?.items || []} orderId={checkoutData?.orderId || ''} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="homepage" element={<HomepageStudioPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="marketing" element={<MarketingPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit" element={<AuditLogPage />} />
          </Route>
          <Route path="/*" element={<Storefront />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
