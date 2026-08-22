import React, { useState, useEffect } from 'react';
import { X, Check, Package, Truck, RefreshCw, Search, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

export interface SavedOrder {
  orderId: string;
  date: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'PROCESSING' | 'IN TRANSIT' | 'DELIVERED';
  trackingNumber: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrackOrder?: (orderId?: string) => void;
  onOpenExchangeModal?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenTrackOrder,
  onOpenExchangeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [email, setEmail] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  // Load orders from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('kora_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
            return;
          }
        }
      } catch {
        // fallback
      }

      // Default sample historical order for instant visualization if no user checkouts yet
      setOrders([
        {
          orderId: 'KR-849204',
          date: 'Aug 20, 2026',
          customerName: 'Studio Member',
          total: 8198,
          status: 'IN TRANSIT',
          trackingNumber: 'AWB-98302194',
          items: [
            {
              id: 'tp-black-m',
              product: {
                id: '1',
                name: 'KORA HEAVYWEIGHT TRACK PANTS',
                category: 'track-pants',
                price: 4299,
                gsm: 420,
                fabric: '100% Japanese Combed Cotton Loopback Terry',
                fit: 'Architectural Boxy Wide Break',
                description: 'Engineered high-density track pants with weighted drape.',
                images: ['/assets/kora_track_pant_upload.png'],
                colors: [{ name: 'Obsidian Black', hex: '#111111', image: '/assets/kora_track_pant_upload.png' }],
                sizes: ['S', 'M', 'L', 'XL'],
                details: ['420 GSM Terry', 'Custom metal aglets', 'Double-welted pockets'],
                isBestSeller: true,
              },
              selectedColor: { name: 'Obsidian Black', hex: '#111111', image: '/assets/kora_track_pant_upload.png' },
              selectedSize: 'M',
              quantity: 1,
            },
            {
              id: 'tee-chalk-l',
              product: {
                id: '2',
                name: 'KORA ARCHITECTURAL T-SHIRT',
                category: 't-shirts',
                price: 3899,
                gsm: 280,
                fabric: '280 GSM Compact Interlock Pima Cotton',
                fit: 'Relaxed Tailored Silhouette',
                description: 'Dense architectural tee with reinforced collar.',
                images: ['/assets/kora_tshirt_upload.png'],
                colors: [{ name: 'Bone White', hex: '#E6E4DD', image: '/assets/kora_tshirt_upload.png' }],
                sizes: ['S', 'M', 'L', 'XL'],
                details: ['280 GSM Interlock', '1.25" memory collar', 'Pre-shrunk structure'],
                isBestSeller: true,
              },
              selectedColor: { name: 'Bone White', hex: '#E6E4DD', image: '/assets/kora_tshirt_upload.png' },
              selectedSize: 'L',
              quantity: 1,
            }
          ]
        }
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSignedIn(true);
      setTimeout(() => {
        setSignedIn(false);
        setActiveTab('orders');
      }, 1500);
    }
  };

  const filteredOrders = orders.filter((o) => 
    o.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.items.some(item => item.product.name.toLowerCase().includes(orderSearchQuery.toLowerCase()))
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#F3F1EC] border border-[#E2DFD7] text-[#111111] p-6 sm:p-8 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#666666] transition-colors cursor-pointer"
          aria-label="Close orders modal"
        >
          <X size={20} />
        </button>

        {/* Header & Tabs */}
        <div className="space-y-3 mb-6 border-b border-[#E2DFD7] pb-4">
          <div className="flex items-center gap-2 text-[10px] font-label text-[#777777] tracking-[0.2em] uppercase">
            <Package size={12} className="text-[#B85D3B]" />
            <span>KORA CLIENT CONCIERGE</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-display font-black tracking-tight text-[#111111]">
              MY ORDERS &amp; CONCIERGE
            </h2>

            {/* Tab navigation */}
            <div className="flex items-center gap-2 bg-[#EAE7DF] p-1 border border-[#D8D4CA]">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 text-[10px] font-label tracking-[0.16em] uppercase transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#111111] text-[#F3F1EC]'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                MY ORDERS ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-1.5 text-[10px] font-label tracking-[0.16em] uppercase transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#111111] text-[#F3F1EC]'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                STUDIO PASS
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH BY ORDER ID (e.g. KR-849204)..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full bg-[#EAE7DF] border border-[#D8D4CA] pl-9 pr-4 py-2.5 text-xs font-mono placeholder:text-[#888888] focus:outline-none focus:border-[#111111]"
              />
              <Search size={14} className="absolute left-3 top-3.5 text-[#888888]" />
            </div>

            {/* Orders List */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-[#EAE7DF] border border-[#D8D4CA] space-y-2">
                  <Package size={24} className="mx-auto text-[#888888]" />
                  <p className="text-xs font-mono font-bold text-[#111111]">NO ORDERS FOUND</p>
                  <p className="text-xs font-sans text-[#666666]">
                    Your completed checkouts will automatically appear here.
                  </p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div 
                    key={ord.orderId}
                    className="p-4 sm:p-5 bg-[#EAE7DF] border border-[#D8D4CA] space-y-4"
                  >
                    {/* Top bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D4CA] pb-3">
                      <div>
                        <span className="text-[9px] font-label text-[#777777] uppercase tracking-wider">
                          ORDER REFERENCE
                        </span>
                        <h3 className="text-sm font-mono font-bold text-[#111111]">
                          {ord.orderId}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-label text-[#777777] uppercase tracking-wider">
                          PLACED ON
                        </span>
                        <p className="text-xs font-mono text-[#444444]">
                          {ord.date}
                        </p>
                      </div>

                      <div className="px-2.5 py-1 bg-[#111111] text-[#F3F1EC] text-[9px] font-mono tracking-wider">
                        {ord.status}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2.5">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-[#D8D4CA] overflow-hidden shrink-0 border border-[#C5C0B4]">
                              <img 
                                src={item.selectedColor?.image || item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-[#111111] text-[11px] truncate max-w-[200px] sm:max-w-[280px]">
                                {item.product.name}
                              </p>
                              <p className="text-[10px] text-[#666666]">
                                SIZE: {item.selectedSize} • COLOR: {item.selectedColor?.name} • QTY: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-[#111111]">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Action Buttons */}
                    <div className="pt-3 border-t border-[#D8D4CA] flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-mono">
                        <span className="text-[#777777]">TOTAL: </span>
                        <span className="font-bold text-[#111111] text-sm">
                          ₹{ord.total.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onOpenTrackOrder && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenTrackOrder(ord.orderId);
                            }}
                            className="px-3 py-2 bg-[#111111] text-[#F3F1EC] text-[10px] font-label tracking-[0.14em] uppercase hover:bg-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck size={12} />
                            <span>TRACK DISPATCH</span>
                          </button>
                        )}

                        {onOpenExchangeModal && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenExchangeModal();
                            }}
                            className="px-3 py-2 bg-[#E2DFD7] border border-[#C5C0B4] text-[#111111] text-[10px] font-label tracking-[0.14em] uppercase hover:bg-[#D8D4CA] transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw size={12} />
                            <span>EXCHANGE</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom concierge contact */}
            <div className="p-3 bg-[#E2DFD7] border border-[#D8D4CA] flex items-center justify-between text-xs font-mono text-[#555555]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#B85D3B]" />
                <span>Complimentary 7-day doorstep exchange on all orders</span>
              </span>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=clothingkora2026@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#111111] font-bold hover:underline"
              >
                Help?
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: STUDIO PASS / PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#EAE7DF] border border-[#D8D4CA] space-y-2">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-[#111111]">
                STUDIO MEMBER PASS
              </h3>
              <p className="text-xs text-[#666666] font-sans leading-relaxed">
                Connect your account to synchronize multi-device order archives, receive private capsule drops 2 hours ahead of public release, and access one-click doorstep exchanges.
              </p>
            </div>

            {signedIn ? (
              <div className="py-8 text-center space-y-3 bg-[#EAE7DF] border border-[#D8D4CA]">
                <div className="w-10 h-10 bg-[#111111] text-[#F3F1EC] rounded-full mx-auto flex items-center justify-center">
                  <Check size={18} />
                </div>
                <p className="text-xs font-label tracking-[0.16em] text-[#111111]">
                  MAGIC AUTHENTICATION LINK SENT TO {email.toUpperCase()}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-label text-[#777777] uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    placeholder="architect@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#EAE7DF] border border-[#D8D4CA] px-3.5 py-3 text-xs font-mono focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111111] text-[#F3F1EC] py-3.5 text-[11px] font-label tracking-[0.2em] uppercase hover:bg-[#2A2A2A] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>REQUEST PASS ACCESS</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
