import React from 'react';
import { FileText, Mail } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderBanner
        title="NovaGems Terms and Conditions"
        subtitle="Home / Terms and Conditions"
        backgroundStyle="image"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Terms and Conditions</h2>
          </div>
          <p className="text-gray-600 mb-4">
            <strong>Effective Date:</strong> October 3, 2025
          </p>
          <p className="text-gray-600">
            Welcome to <strong>NovaGems</strong>! By accessing or using our website (<a href="http://www.novagems.rw" className="text-teal-600 hover:underline">www.novagems.rw</a>) and services, you agree to comply with and be bound by the following Terms and Conditions.
          </p>
        </section>

        {/* General Information */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">1. General Information</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>NovaGems is an online jewelry retailer based in Kigali, Rwanda.</li>
            <li>These Terms and Conditions apply to all visitors, users, and customers of the website.</li>
            <li>By placing an order, you agree to these terms.</li>
          </ul>
        </section>

        {/* Orders & Payment */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">2. Orders & Payment</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>All orders are subject to acceptance and availability.</li>
            <li>Payment must be completed at checkout using our accepted methods: <strong>Mobile Money (MTN/Airtel), Debit/Credit Cards, PayPal</strong>, or <strong>Cash on Delivery</strong> (Kigali only).</li>
            <li>Prices are displayed in <strong>Rwandan Francs (RWF)</strong> unless otherwise stated.</li>
            <li>NovaGems reserves the right to refuse or cancel any order for reasons including stock unavailability, payment issues, or suspected fraud.</li>
          </ul>
        </section>

        {/* Shipping & Delivery */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">3. Shipping & Delivery</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Delivery is available across Rwanda and internationally (fees vary).</li>
            <li>Estimated delivery times:</li>
            <ul className="list-circle list-inside pl-6 space-y-2">
              <li>Kigali: 1–3 business days</li>
              <li>Other districts in Rwanda: 3–7 business days</li>
              <li>International: 7–15 business days</li>
            </ul>
            <li>NovaGems is not responsible for delays caused by external factors such as courier issues, weather, or customs clearance.</li>
          </ul>
        </section>

        {/* Returns & Refunds */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">4. Returns & Refunds</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Items can be returned within <strong>7 days</strong> of delivery if unworn, in original packaging, and with proof of purchase.</li>
            <li>Personalized/custom orders cannot be returned unless defective.</li>
            <li>Refunds are processed within <strong>5–10 business days</strong> after we receive the returned item.</li>
          </ul>
        </section>

        {/* Product Information */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">5. Product Information</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>NovaGems strives to ensure all product descriptions, images, and pricing are accurate.</li>
            <li>Colors of jewelry may slightly vary due to photography or screen differences.</li>
            <li>All jewelry is made from genuine materials. Certificates of authenticity are provided for premium items.</li>
          </ul>
        </section>

        {/* User Accounts */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">6. User Accounts</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Users must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree to notify NovaGems immediately of any unauthorized use of your account.</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">7. Intellectual Property</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>All content on the NovaGems website, including images, designs, logos, and text, is protected by copyright and intellectual property laws.</li>
            <li>Users may not reproduce, distribute, or use content without prior written permission.</li>
          </ul>
        </section>

        {/* Privacy & Data Protection */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">8. Privacy & Data Protection</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>NovaGems collects personal information for order processing, shipping, and marketing purposes.</li>
            <li>Your data is protected according to our <strong>Privacy Policy</strong>.</li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">9. Limitation of Liability</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>NovaGems is not liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or products.</li>
            <li>Jewelry use is at the customer’s own discretion, and NovaGems is not responsible for damage caused by misuse.</li>
          </ul>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">10. Governing Law</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>These Terms and Conditions are governed by the laws of <strong>Rwanda</strong>.</li>
            <li>Any disputes will be resolved in the courts of Kigali, Rwanda.</li>
          </ul>
        </section>

        {/* Changes to Terms */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">11. Changes to Terms</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>NovaGems reserves the right to update or modify these Terms and Conditions at any time.</li>
            <li>Updated terms will be posted on the website with a new effective date.</li>
          </ul>
        </section>

        {/* Acknowledgment */}
        <section className="mb-12">
          <p className="text-gray-600 italic">
            By using NovaGems services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>
        </section>

        {/* Contact Support */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Need Help?</h2>
          </div>
          <p className="text-gray-600 mb-4">If you have any questions about these Terms and Conditions, contact us:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-600" />
              <span><strong>Email</strong>: <a href="mailto:support@novagems.rw" className="text-teal-600 hover:underline">support@novagems.rw</a></span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span><strong>Phone/WhatsApp</strong>: +250 7XX XXX XXX</span>
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>✨ Thank you for choosing NovaGems – Your sparkle, our passion!</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;