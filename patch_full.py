import re

# ── 1. PATCH App.tsx ──────────────────────────────────────────────────────────
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# Update the onOrderSuccess signature in Storefront to accept customer details
old_sig = "  const handleOrderSuccess = async (orderId: string, purchasedItems: CartItem[], customerName: string) => {"
new_sig = "  const handleOrderSuccess = async (orderId: string, purchasedItems: CartItem[], customerName: string, customerDetails?: { phone: string; email: string; city: string; streetAddress: string; zipCode: string; paymentMethod: string }) => {"
app = app.replace(old_sig, new_sig, 1)

# Update the setDoc call to include customerDetails
old_setdoc = """      await setDoc(doc(db, 'orders', orderId), {
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
      });"""

new_setdoc = """      await setDoc(doc(db, 'orders', orderId), {
        orderId,
        customerName: customerName || 'Studio Member',
        email: customerDetails?.email || '',
        phone: customerDetails?.phone || '',
        city: customerDetails?.city || '',
        streetAddress: customerDetails?.streetAddress || '',
        zipCode: customerDetails?.zipCode || '',
        paymentMethod: customerDetails?.paymentMethod || '',
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
      });"""

if old_setdoc in app:
    app = app.replace(old_setdoc, new_setdoc, 1)
    print("SUCCESS: App.tsx setDoc patched with customer details")
else:
    print("WARNING: setDoc block not found exactly - check App.tsx manually")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

print("App.tsx written")

# ── 2. PATCH CheckoutPage.tsx ─────────────────────────────────────────────────
with open('src/components/CheckoutPage.tsx', 'r', encoding='utf-8') as f:
    checkout = f.read()

# Update onOrderSuccess prop type
old_prop = "  onOrderSuccess: (orderId: string, purchasedItems: CartItem[], customerName: string) => void;"
new_prop = "  onOrderSuccess: (orderId: string, purchasedItems: CartItem[], customerName: string, customerDetails?: { phone: string; email: string; city: string; streetAddress: string; zipCode: string; paymentMethod: string }) => void;"
checkout = checkout.replace(old_prop, new_prop, 1)

# Update the call inside handlePlaceOrder
old_call = "      onOrderSuccess(generatedOrderId, [...cartItems], buyerName);"
new_call = """      onOrderSuccess(generatedOrderId, [...cartItems], buyerName, {
        phone,
        email,
        city,
        streetAddress,
        zipCode,
        paymentMethod,
      });"""
if old_call in checkout:
    checkout = checkout.replace(old_call, new_call, 1)
    print("SUCCESS: CheckoutPage onOrderSuccess call patched")
else:
    print("WARNING: onOrderSuccess call not found - check CheckoutPage.tsx")

with open('src/components/CheckoutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(checkout)

print("CheckoutPage.tsx written")
