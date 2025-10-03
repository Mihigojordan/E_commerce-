import React from 'react';
import { 
  Package, 
  RefreshCw, 
  CreditCard, 
  Gem, 
  Gift, 
  User, 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin
} from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';
const HelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderBanner
        title="NovaGems Help Center"
        subtitle="Home / NovaGems Help Center"
        backgroundStyle="image"
      />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Orders & Shipping */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Orders & Shipping</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">How do I place an order?</h3>
              <ol className="list-decimal list-inside text-gray-600">
                <li>Browse our collection of necklaces, rings, bracelets, and earrings.</li>
                <li>Select your preferred size, style, or gemstone.</li>
                <li>Add the item to your cart and proceed to checkout.</li>
                <li>Enter your delivery details and complete payment.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Where do you deliver?</h3>
              <p className="text-gray-600">We deliver across <strong>Kigali</strong> and other major cities in Rwanda. International delivery is also available (shipping costs vary).</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">How long does delivery take?</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Kigali: <strong>1–3 business days</strong></li>
                <li>Other districts in Rwanda: <strong>3–7 business days</strong></li>
                <li>International: <strong>7–15 business days</strong></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Can I track my order?</h3>
              <p className="text-gray-600">Yes. After purchase, you'll receive a tracking link via email/SMS to monitor your delivery.</p>
            </div>
          </div>
        </section>

        {/* Returns & Exchanges */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Returns & Exchanges</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">What is your return policy?</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Items can be returned within <strong>7 days</strong> of delivery.</li>
                <li>Jewelry must be unworn, in original packaging, and with proof of purchase.</li>
                <li>Personalized/custom-made items cannot be returned unless defective.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">How do I request a return?</h3>
              <p className="text-gray-600">Go to <strong>My Account → Returns & Refunds</strong>, submit your order number and reason for return. Our team will guide you on pickup/drop-off.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">When will I get my refund?</h3>
              <p className="text-gray-600">Refunds are processed within <strong>5–10 business days</strong> after receiving your returned item.</p>
            </div>
          </div>
        </section>

        {/* Payments & Billing */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Payments & Billing</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">What payment methods do you accept?</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Mobile Money (MTN MoMo, Airtel Money)</li>
                <li>Debit/Credit Cards (Visa, MasterCard)</li>
                <li>PayPal (for international orders)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Is payment secure?</h3>
              <p className="text-gray-600">Yes, NovaGems uses <strong>SSL encryption</strong> and trusted payment gateways to keep your details safe.</p>
            </div>
          </div>
        </section>

        {/* Jewelry Care & Sizing */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Gem className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Jewelry Care & Sizing</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">How do I find my ring size?</h3>
              <p className="text-gray-600">Use our <strong>online ring size guide</strong> or visit our Kigali shop for professional sizing.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">How do I care for my jewelry?</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Keep jewelry away from perfumes, lotions, and harsh chemicals.</li>
                <li>Store in a soft pouch or box to avoid scratches.</li>
                <li>Clean with a soft cloth or mild soap solution for shine.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Information */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Product Information</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Are your products authentic?</h3>
              <p className="text-gray-600">Yes. NovaGems jewelry is made with <strong>genuine gemstones</strong> and <strong>quality metals</strong>. Certificates of authenticity are available for premium items.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Do you offer custom designs?</h3>
              <p className="text-gray-600">Yes! You can order custom-made rings, necklaces, or engravings. Contact us for details.</p>
            </div>
          </div>
        </section>

        {/* Account & Membership */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Account & Membership</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600">
            <li><strong>Create an account</strong> to manage orders, save favorites, and receive exclusive offers.</li>
            <li><strong>Wishlist</strong> lets you save items for later.</li>
            <li><strong>Rewards Program</strong>: Earn points every time you shop, redeemable for discounts.</li>
          </ul>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions (FAQs)</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Do you ship outside Rwanda?</h3>
              <p className="text-gray-600">Yes, international delivery is available.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Can I pay on delivery?</h3>
              <p className="text-gray-600">Yes, cash on delivery is available in Kigali only.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">What if my order arrives damaged?</h3>
              <p className="text-gray-600">Contact us immediately with photos, and we'll arrange a replacement or refund.</p>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact NovaGems Support</h2>
          <p className="text-gray-600 mb-4">Didn't find what you were looking for? Our team is happy to help!</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-600" />
              <span><strong>Email</strong>: <a href="mailto:support@novagems.rw" className="text-primary-600 hover:underline">support@novagems.rw</a></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-600" />
              <span><strong>Phone/WhatsApp</strong>: +250 791 813 289</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-600" />
              <span><strong>Live Chat</strong>: Available 9 AM – 8 PM (Mon–Sat)</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span><strong>Visit Us</strong>: NovaGems Shop, Kigali City</span>
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-600 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>✨ Thank you for choosing NovaGems – Your sparkle, our passion!</p>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;