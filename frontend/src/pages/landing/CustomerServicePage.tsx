import React from 'react';
import { Mail, Phone, MessageCircle, MapPin, Clock, Globe, Heart } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';

const CustomerService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderBanner
        title="Peace Bijouterie Customer Service"
        subtitle="Home / Customer Service"
        backgroundStyle="image"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Customer Service</h2>
          </div>
          <p className="text-gray-600">
            At <strong>Peace Bijouterie</strong>, our goal is to make your shopping experience smooth and worry-free. Our customer service team is always here to help with orders, product questions, returns, and more.
          </p>
        </section>

        {/* How to Reach Us */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">How to Reach Us</h2>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-600" />
              <span><strong>Phone / WhatsApp</strong>: +250 7XX XXX XXX</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-600" />
              <span><strong>Email</strong>: <a href="mailto:support@peacebijouterie.rw" className="text-primary-600 hover:underline">support@peacebijouterie.rw</a></span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-600" />
              <span><strong>Live Chat</strong>: Available on our website (9 AM – 8 PM, Mon–Sat)</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span><strong>In-Store Support</strong>: Visit us at our <strong>Kigali shop</strong> for direct assistance.</span>
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

        {/* Service Hours */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Service Hours</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Monday – Saturday</strong>: 9 AM – 8 PM</li>
            <li><strong>Sunday</strong>: Closed (online inquiries still accepted and answered the next business day).</li>
          </ul>
        </section>

        {/* What We Can Help You With */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">What We Can Help You With</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Tracking your order and delivery updates</li>
            <li>Questions about product sizing, materials, or authenticity</li>
            <li>Returns, exchanges, and refunds</li>
            <li>Payment issues (failed transaction, duplicate charges, etc.)</li>
            <li>Custom order requests and special designs</li>
            <li>Loyalty program & rewards support</li>
          </ul>
        </section>

        {/* Languages We Support */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Languages We Support</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Kinyarwanda</strong></li>
            <li><strong>English</strong></li>
            <li><strong>French</strong></li>
          </ul>
        </section>

        {/* Our Promise */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Our Promise</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Friendly and responsive communication</li>
            <li>Secure handling of your personal details</li>
            <li>Clear and honest answers to all your jewelry-related questions</li>
            <li>Quick solutions for any issues with your order</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-600 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>✨ Thank you for choosing Peace Bijouterie – Your sparkle, our passion!</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerService;