import React, { useState } from 'react';
import { 

  Mail, 
  Phone, 
  MessageCircle, 
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  // State to track which FAQ item is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle accordion item
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: 'How do I place an order on NovaGems?',
      answer:
        'Simply browse our collections, select your jewelry, choose size or customization (if available), add it to your cart, and proceed to checkout.',
    },
    {
      question: 'Can I buy without creating an account?',
      answer:
        'Yes, guest checkout is available. But creating an account lets you track orders, save a wishlist, and earn rewards.',
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we provide elegant gift packaging upon request at checkout.',
    },
    {
      question: 'Do you deliver outside Kigali?',
      answer:
        'Yes, we deliver across Rwanda. Delivery within Kigali takes 1–3 days, and outside Kigali takes 3–7 days.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, NovaGems ships worldwide. Delivery takes 7–15 days depending on location.',
    },
    {
      question: 'Can I track my package?',
      answer: 'Yes. Once shipped, you’ll get a tracking link via SMS or email.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept Mobile Money (MTN & Airtel), Debit/Credit Cards, PayPal (for international), and Cash on Delivery (Kigali only).',
    },
    {
      question: 'Is payment secure?',
      answer: 'Absolutely! We use SSL encryption and trusted payment gateways for safe transactions.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'Items can be returned within 7 days of delivery if unworn and in original condition. Custom items cannot be returned unless defective.',
    },
    {
      question: 'How long does a refund take?',
      answer: 'Refunds are processed within 5–10 business days after we receive the returned item.',
    },
    {
      question: 'Is NovaGems jewelry authentic?',
      answer:
        'Yes. All our products are crafted with genuine materials. Premium items come with a certificate of authenticity.',
    },
    {
      question: 'Do you offer resizing or customization?',
      answer: 'Yes, we provide resizing for rings and custom engraving options.',
    },
    {
      question: 'How do I find my ring size?',
      answer: 'You can use our online size guide or visit our Kigali shop for professional sizing.',
    },
    {
      question: 'How can I contact NovaGems support?',
      answer:
        'You can reach us via WhatsApp/Phone at +250 7XX XXX XXX, email at <a href="mailto:support@novagems.rw" class="text-primary-600 hover:underline">support@novagems.rw</a>, or Live Chat (Mon–Sat, 9AM–8PM).',
    },
    {
      question: 'Can I earn rewards for shopping?',
      answer: 'Yes! Our loyalty program gives you points for every purchase, redeemable for discounts.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderBanner
        title="NovaGems FAQs"
        subtitle="Home / NovaGems FAQs"
        backgroundStyle="image"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* FAQ Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg shadow-sm bg-white">
                <button
                  className="w-full text-left p-4 flex justify-between items-center hover:bg-primary-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-medium text-gray-700">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary-600" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="p-4 bg-gray-50 text-gray-600 border-t border-gray-200">
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Contact NovaGems Support</h2>
          </div>
          <p className="text-gray-600 mb-4">Didn’t find what you were looking for? Our team is happy to help!</p>
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
          <div className="mt-6">
            <a
              href="mailto:support@novagems.rw"
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

export default FAQ;