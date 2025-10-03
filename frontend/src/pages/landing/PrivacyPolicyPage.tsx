import React from 'react';
import { Lock, Mail, Phone, MapPin } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderBanner
        title="NovaGems Privacy Policy"
        subtitle="Home / Privacy Policy"
        backgroundStyle="image"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Privacy Policy</h2>
          </div>
          <p className="text-gray-600 mb-4">
            <strong>Effective Date:</strong> October 3, 2025
          </p>
          <p className="text-gray-600">
            At <strong>NovaGems</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website (<a href="http://www.novagems.rw" className="text-teal-600 hover:underline">www.novagems.rw</a>) and services.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">1. Information We Collect</h3>
          <p className="text-gray-600 mb-2">When you interact with NovaGems, we may collect the following information:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Personal Information</strong>: Name, email address, phone number, shipping & billing address.</li>
            <li><strong>Account Information</strong>: Login credentials, wishlist, order history.</li>
            <li><strong>Payment Information</strong>: Credit/debit card details, Mobile Money information (processed securely via payment gateways).</li>
            <li><strong>Device & Usage Data</strong>: IP address, browser type, pages visited, and interactions on our website.</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">2. How We Use Your Information</h3>
          <p className="text-gray-600 mb-2">We use your information to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Process and fulfill orders.</li>
            <li>Communicate order confirmations, shipping updates, and support requests.</li>
            <li>Improve website experience and personalize content.</li>
            <li>Send promotional emails or offers (only if you opt-in).</li>
            <li>Prevent fraud and ensure secure transactions.</li>
          </ul>
        </section>

        {/* Sharing Your Information */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">3. Sharing Your Information</h3>
          <p className="text-gray-600 mb-2">We respect your privacy. We <strong>do not sell or trade</strong> your personal data. We may share your information only in the following cases:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>With <strong>shipping and payment partners</strong> to process orders.</li>
            <li>With <strong>legal authorities</strong> if required by law.</li>
            <li>During a <strong>business transfer</strong>, e.g., acquisition or merger.</li>
          </ul>
        </section>

        {/* Cookies & Tracking */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">4. Cookies & Tracking</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>NovaGems uses cookies and similar technologies to enhance website functionality, track browsing behavior, and improve the shopping experience.</li>
            <li>You can manage cookies in your browser settings, but some features may not work if cookies are disabled.</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">5. Data Security</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Your personal information is protected using <strong>encryption, secure servers, and industry-standard practices</strong>.</li>
            <li>We regularly review security measures to protect against unauthorized access, disclosure, or misuse.</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">6. Your Rights</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Access</strong>: Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction</strong>: Update inaccurate or incomplete data.</li>
            <li><strong>Deletion</strong>: Ask us to remove your personal information.</li>
            <li><strong>Opt-Out</strong>: Unsubscribe from marketing emails at any time.</li>
          </ul>
          <p className="text-gray-600 mt-2">
            To exercise these rights, contact us at <a href="mailto:support@novagems.rw" className="text-teal-600 hover:underline">support@novagems.rw</a>.
          </p>
        </section>

        {/* Children’s Privacy */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">7. Children’s Privacy</h3>
          <p className="text-gray-600">
            NovaGems does not knowingly collect personal information from children under 18. If you are under 18, please do not use our services.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">8. Changes to Privacy Policy</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>We may update this Privacy Policy occasionally.</li>
            <li>Updated versions will be posted on the website with the new effective date.</li>
          </ul>
        </section>

        {/* Contact Us */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
          </div>
          <p className="text-gray-600 mb-4">For questions about this Privacy Policy or how your data is handled:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-600" />
              <span><strong>Email</strong>: <a href="mailto:support@novagems.rw" className="text-teal-600 hover:underline">support@novagems.rw</a></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-teal-600" />
              <span><strong>Phone/WhatsApp</strong>: +250 7XX XXX XXX</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span><strong>Address</strong>: NovaGems Shop, Kigali, Rwanda</span>
            </li>
          </ul>
          <div className="mt-6">
            <a
              href="mailto:support@novagems.rw"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
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

export default PrivacyPolicy;