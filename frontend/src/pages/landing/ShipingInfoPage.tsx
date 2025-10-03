import React from 'react';
import { Package, Truck, MapPin, Clock, DollarSign, Mail, Phone, MessageCircle } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';

const ShippingInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderBanner
        title="NovaGems Shipping Information"
        subtitle="Home / Shipping Information"
        backgroundStyle="image"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Shipping Information
            </h2>
          </div>
          <p className="text-gray-600">
            At <strong>NovaGems</strong>, we aim to deliver your jewelry safely, quickly, and with care.
          </p>
        </section>

        {/* Delivery Locations */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Delivery Locations</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Within Kigali</strong> – Fast and reliable delivery straight to your doorstep.</li>
            <li><strong>Across Rwanda</strong> – We deliver to all major cities and districts.</li>
            <li><strong>International Shipping</strong> – Available worldwide.</li>
          </ul>
        </section>

        {/* Estimated Delivery Times */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Estimated Delivery Times</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Kigali</strong>: 1–3 business days</li>
            <li><strong>Other districts in Rwanda</strong>: 3–7 business days</li>
            <li><strong>International orders</strong>: 7–15 business days (depending on location & courier services)</li>
          </ul>
        </section>

        {/* Shipping Costs */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Shipping Costs</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Kigali</strong>: Free delivery for orders above <strong>RWF 50,000</strong>, otherwise a small delivery fee applies.</li>
            <li><strong>Rwanda (outside Kigali)</strong>: Flat rate fee depending on distance.</li>
            <li><strong>International</strong>: Calculated at checkout based on destination and order weight.</li>
          </ul>
        </section>

        {/* Order Tracking */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Order Tracking</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Once your order is shipped, you’ll receive an <strong>SMS/email with a tracking link</strong>.</li>
            <li>You can also check your order status in <strong>My Account → Order History</strong>.</li>
          </ul>
        </section>

        {/* Important Notes */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">Important Notes</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Ensure your delivery address and phone number are correct at checkout.</li>
            <li>Delays may occur during public holidays or unforeseen events (e.g., weather, customs).</li>
            <li>Cash on Delivery is available <strong>only within Kigali</strong>.</li>
          </ul>
        </section>

        {/* Contact Support */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Need Help?</h2>
          </div>
          <p className="text-gray-600 mb-4">If you have questions about shipping or need urgent assistance:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-600" />
              <span><strong>Call/WhatsApp</strong>: +250 791 813 289</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-600" />
              <span><strong>Email</strong>: <a href="mailto:support@novagems.rw" className="text-primary-600 hover:underline">support@novagems.rw</a></span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-600" />
              <span><strong>Live Chat</strong>: 9 AM – 8 PM (Mon–Sat)</span>
            </li>
          </ul>
          <div className="mt-6">
            <a
              href="/contact"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
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

export default ShippingInfo;