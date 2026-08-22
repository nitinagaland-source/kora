import React from 'react';
import { X, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface PrivacyProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyProtocolModal: React.FC<PrivacyProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-[#F3F1EC] border border-[#E2DFD7] text-[#111111] p-6 sm:p-8 shadow-2xl relative my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#111111] hover:text-[#666666] transition-colors cursor-pointer z-10"
          aria-label="Close terms and conditions modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-4 border-b border-[#E2DFD7] pb-4 pr-8">
          <div className="flex items-center gap-2 text-[10px] font-label text-[#777777] tracking-[0.2em] uppercase">
            <ShieldCheck size={12} className="text-[#B85D3B]" />
            <span>KORA ARCHITECTURAL LABS &bull; LEGAL &amp; PROTOCOL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#111111]">
            TERMS &amp; CONDITIONS
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
            Welcome to KORA. These Terms &amp; Conditions govern your use of the KORA website and your purchase of our apparel, including T-shirts, oversized T-shirts, shirts, hoodies, track pants, and other products. By accessing our website or placing an order, you agree to these Terms.
          </p>
        </div>

        {/* Scrollable Terms Content */}
        <div className="overflow-y-auto pr-2 space-y-6 text-xs text-[#333333] font-sans leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              1. ABOUT KORA
            </h3>
            <p>
              KORA is an online apparel brand offering fashion and lifestyle clothing. Product availability, designs, colours, sizes, and collections may change from time to time without prior notice.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              2. PRODUCT INFORMATION
            </h3>
            <p>
              We make reasonable efforts to display accurate product images, colours, sizes, descriptions, and specifications. However, slight differences may occur due to screen settings, lighting, photography, or manufacturing variations.
            </p>
            <p className="text-[#666666]">
              Product measurements may also have minor variations.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              3. PRICES
            </h3>
            <p>
              All prices are displayed in Indian Rupees (INR) unless otherwise stated.
            </p>
            <p>
              Prices may change without prior notice. Applicable taxes, shipping charges, or other fees, if any, will be displayed during checkout.
            </p>
            <p>
              In case of an obvious pricing or technical error, KORA reserves the right to cancel the affected order and provide an appropriate resolution.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              4. ORDERS
            </h3>
            <p>
              Placing an order constitutes a request to purchase the selected products. An order confirmation does not guarantee acceptance in every circumstance.
            </p>
            <p>KORA may cancel or decline an order due to:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#555555]">
              <li>Product unavailability.</li>
              <li>Incorrect pricing or product information.</li>
              <li>Payment issues.</li>
              <li>Suspected fraudulent activity.</li>
              <li>Technical errors.</li>
              <li>Incorrect customer or delivery information.</li>
            </ul>
            <p>
              If payment has already been received for a cancelled order, the applicable amount will be refunded.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              5. PAYMENT
            </h3>
            <p>
              KORA may offer payment options such as credit/debit cards, UPI, net banking, wallets, Cash on Delivery, or other methods available at checkout.
            </p>
            <p>
              Payments may be processed through third-party payment providers. Customers are responsible for providing accurate and authorized payment information.
            </p>
            <p>
              KORA is not responsible for payment failures caused by banks, payment gateways, networks, or circumstances beyond our reasonable control.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              6. SHIPPING &amp; DELIVERY
            </h3>
            <p>
              We aim to dispatch and deliver orders within the estimated timeframe displayed during checkout.
            </p>
            <p>
              Delivery timelines may be affected by weather, holidays, courier delays, high order volumes, logistical issues, or circumstances beyond our control.
            </p>
            <p>
              Customers are responsible for providing a complete and accurate delivery address and contact information. KORA is not responsible for delivery failures caused by incorrect or incomplete information provided by the customer.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              7. CANCELLATION
            </h3>
            <p>
              Order cancellation may be available only before the order is processed or shipped. Once an order has been dispatched, cancellation may no longer be possible.
            </p>
            <p>
              Where cancellation is approved, any applicable refund will be processed according to the payment method used.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              8. EXCHANGE, DAMAGED OR INCORRECT PRODUCTS
            </h3>
            <p>
              If KORA offers exchanges, they will be subject to the applicable conditions displayed on the website.
            </p>
            <p>
              If you receive a damaged, defective, or incorrect product, please contact KORA within the specified time period and provide your order details and supporting photographs or videos where required.
            </p>
            <p>
              Products may be inspected before an exchange, replacement, or other resolution is approved.
            </p>
            <p className="text-[#666666]">
              Issues caused by misuse, improper washing, alterations, accidental damage, or normal wear and tear may not qualify for an exchange or replacement.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              9. PRODUCT CARE
            </h3>
            <p>
              Customers should follow the washing and care instructions provided with the product.
            </p>
            <p>
              KORA is not responsible for damage caused by improper washing, unsuitable detergents, excessive heat, bleaching, improper ironing, alterations, or normal wear and tear.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              10. PROMOTIONS &amp; DISCOUNTS
            </h3>
            <p>
              KORA may offer promotional codes, discounts, sales, or other offers. Each offer may have separate terms, validity periods, minimum order requirements, product exclusions, or usage restrictions.
            </p>
            <p>
              KORA reserves the right to modify or withdraw promotional offers where permitted by law.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              11. INTELLECTUAL PROPERTY
            </h3>
            <p>
              All KORA logos, brand names, photographs, designs, graphics, product descriptions, videos, website content, and other original materials belong to or are licensed to KORA.
            </p>
            <p>
              You may not copy, reproduce, modify, distribute, publish, or commercially use KORA's intellectual property without prior written permission.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              12. PROHIBITED USE
            </h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#555555]">
              <li>Use the website for unlawful or fraudulent purposes.</li>
              <li>Attempt unauthorized access to our systems.</li>
              <li>Introduce viruses or malicious code.</li>
              <li>Copy or scrape website content without permission.</li>
              <li>Misuse promotional offers or payment systems.</li>
              <li>Impersonate another person or entity.</li>
              <li>Interfere with the operation or security of the website.</li>
            </ul>
            <p>
              KORA may restrict or terminate access in case of misuse.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              13. WEBSITE AVAILABILITY
            </h3>
            <p>
              We aim to keep the KORA website available and functioning properly, but uninterrupted access cannot be guaranteed.
            </p>
            <p>
              The website may occasionally be unavailable due to maintenance, technical issues, updates, security measures, network problems, or circumstances beyond our control.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              14. PRIVACY
            </h3>
            <p>
              Your use of the KORA website is also governed by our Privacy Policy. We may collect and process information necessary to process orders, provide customer support, improve our services, and operate the website in accordance with applicable law.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              15. LIMITATION OF LIABILITY
            </h3>
            <p>
              To the maximum extent permitted by applicable law, KORA shall not be liable for indirect, incidental, or consequential losses arising from the use of the website or purchase of products.
            </p>
            <p>
              Nothing in these Terms limits any liability or consumer right that cannot legally be excluded under applicable law.
            </p>
          </section>

          {/* Section 16 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              16. CHANGES TO THESE TERMS
            </h3>
            <p>
              KORA may update these Terms &amp; Conditions from time to time. Any updated version will be published on this page with a revised Last Updated date.
            </p>
            <p>
              Your continued use of the website after changes are published constitutes acceptance of the updated Terms, subject to applicable law.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-1.5">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              17. GOVERNING LAW
            </h3>
            <p>
              These Terms are governed by the applicable laws of India. Any disputes will be handled in accordance with applicable Indian laws and the jurisdiction of the appropriate courts or authorities.
            </p>
          </section>

          {/* Section 18 */}
          <section className="space-y-2.5 p-4 bg-[#EAE7DF] border border-[#D8D4CA]">
            <h3 className="font-display font-black text-sm text-[#111111] uppercase tracking-wide">
              18. CUSTOMER SUPPORT
            </h3>
            <p>For questions, complaints, orders, or other assistance, please contact:</p>
            <div className="space-y-1.5 font-mono text-[11px] text-[#444444] pt-1">
              <p className="font-bold text-[#111111]">KORA ARCHITECTURAL LABS</p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#B85D3B]" />
                <span>Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=clothingkora2026@gmail.com" target="_blank" rel="noopener noreferrer" className="text-[#111111] underline">clothingkora2026@gmail.com</a></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#B85D3B]" />
                <span>Phone / WhatsApp: <a href="https://wa.me/916003023292" target="_blank" rel="noopener noreferrer" className="text-[#111111] underline">+91 6003023292</a></span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-[#B85D3B]" />
                <span>Address: Guwahati, Assam, India</span>
              </p>
              <p className="text-[#777777] text-[10px] pt-1">
                Customer Support Hours: Mon – Sat, 10:00 AM – 7:00 PM IST
              </p>
            </div>
          </section>

          {/* Section 19 */}
          <section className="space-y-1.5 p-4 bg-[#111111] text-[#F3F1EC]">
            <h3 className="font-display font-black text-sm text-[#F3F1EC] uppercase tracking-wide">
              19. ACKNOWLEDGEMENT
            </h3>
            <p className="text-[#CCCCCC] text-xs">
              By accessing the KORA website or placing an order, you confirm that you have read, understood, and agreed to these Terms &amp; Conditions, subject to your rights under applicable law.
            </p>
          </section>

        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-[#E2DFD7] flex items-center justify-between text-[11px] font-mono text-[#777777]">
          <span>LAST UPDATED: AUGUST 2026</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-[#111111] text-[#F3F1EC] font-label text-[10px] uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
          >
            I UNDERSTAND &amp; AGREE
          </button>
        </div>
      </div>
    </div>
  );
};

