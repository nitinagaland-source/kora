import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add firebase imports after useFirestoreProducts import
old_import = "import { useFirestoreProducts } from './lib/firestoreHooks';"
new_import = """import { useFirestoreProducts } from './lib/firestoreHooks';
import { db } from './lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';"""
content = content.replace(old_import, new_import, 1)

# 2. Replace handleOrderSuccess - find and replace the whole function
old_fn = """  const handleOrderSuccess = (orderId: string, purchasedItems: CartItem[], customerName: string) => {
    const totalAmount = purchasedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: SavedOrder = { orderId, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), customerName: customerName || 'Studio Member', items: purchasedItems, total: totalAmount, status: 'PROCESSING', trackingNumber: 'AWB-' + Math.floor(10000000 + Math.random() * 90000000) };
    try { const existing = localStorage.getItem('kora_orders'); const ordersList: SavedOrder[] = existing ? JSON.parse(existing) : []; localStorage.setItem('kora_orders', JSON.stringify([newOrder, ...ordersList])); } catch {}
    setCheckoutData({ items: purchasedItems, orderId });
    setCartItems([]);
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };"""

new_fn = """  const handleOrderSuccess = async (orderId: string, purchasedItems: CartItem[], customerName: string) => {
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
  };"""

if old_fn in content:
    content = content.replace(old_fn, new_fn, 1)
    print("SUCCESS: handleOrderSuccess patched")
else:
    print("ERROR: handleOrderSuccess not found - check exact whitespace")

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done writing App.tsx")
