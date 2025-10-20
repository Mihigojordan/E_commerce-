import React from 'react';
import { Ruler, Heart, Mail } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';

const SizeGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderBanner
        title="Peace Bijouterie Size Guide"
        subtitle="Home / Size Guide"
        backgroundStyle="image"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Size Guide</h2>
          </div>
          <p className="text-gray-600">
            Choosing the right size ensures your jewelry fits comfortably and looks perfect. Use this guide to find the right size before placing your order.
          </p>
        </section>

        {/* Ring Size Guide */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">Ring Size Guide</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Measure with a String or Paper Strip</h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>Wrap a strip of paper or string around the base of your finger.</li>
                <li>Mark where it overlaps.</li>
                <li>Measure the length with a ruler (in millimeters).</li>
                <li>Compare with the chart below.</li>
              </ol>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="border border-gray-200 p-2 text-left text-gray-700">Finger Circumference (mm)</th>
                    <th className="border border-gray-200 p-2 text-left text-gray-700">Ring Size (US)</th>
                    <th className="border border-gray-200 p-2 text-left text-gray-700">Ring Size (Rwanda/EU)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-2 text-gray-600">51.5 mm</td>
                    <td className="border border-gray-200 p-2 text-gray-600">6</td>
                    <td className="border border-gray-200 p-2 text-gray-600">52</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 text-gray-600">54.4 mm</td>
                    <td className="border border-gray-200 p-2 text-gray-600">7</td>
                    <td className="border border-gray-200 p-2 text-gray-600">54</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 text-gray-600">57 mm</td>
                    <td className="border border-gray-200 p-2 text-gray-600">8</td>
                    <td className="border border-gray-200 p-2 text-gray-600">57</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 text-gray-600">59.5 mm</td>
                    <td className="border border-gray-200 p-2 text-gray-600">9</td>
                    <td className="border border-gray-200 p-2 text-gray-600">60</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 text-gray-600">62 mm</td>
                    <td className="border border-gray-200 p-2 text-gray-600">10</td>
                    <td className="border border-gray-200 p-2 text-gray-600">62</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-2 text-gray-600">64.5 mm</td>
                    <td className="border border-gray-200 p-2 text-gray-600">11</td>
                    <td className="border border-gray-200 p-2 text-gray-600">65</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 italic">
              💡 <strong>Tip:</strong> Measure your finger at the end of the day when it’s slightly larger for the most accurate fit.
            </p>
          </div>
        </section>

        {/* Necklace Length Guide */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">Necklace Length Guide</h2>
          </div>
          <p className="text-gray-600 mb-4">Necklace sizes vary by style. Here’s how different lengths look when worn:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>14–16 inches (35–40 cm)</strong> → Choker (fits closely around the neck)</li>
            <li><strong>18 inches (45 cm)</strong> → Standard (sits at the collarbone)</li>
            <li><strong>20 inches (50 cm)</strong> → Princess (falls just below the collarbone)</li>
            <li><strong>22–24 inches (55–60 cm)</strong> → Matinee (rests on the chest)</li>
            <li><strong>28–36 inches (70–90 cm)</strong> → Opera (long and elegant, mid-chest to waist)</li>
            <li><strong>36+ inches (90+ cm)</strong> → Rope (wraps around for layered looks)</li>
          </ul>
        </section>

        {/* Bracelet Size Guide */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">Bracelet Size Guide</h2>
          </div>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Use a measuring tape or string to measure around your wrist just above the wrist bone.</li>
            <li>Add extra length depending on the fit you prefer:</li>
          </ol>
          <ul className="list-disc list-inside text-gray-600 pl-6 space-y-2">
            <li><strong>Snug Fit</strong>: Add 1 cm</li>
            <li><strong>Comfort Fit</strong>: Add 1.5 cm</li>
            <li><strong>Loose Fit</strong>: Add 2 cm</li>
          </ul>
          <p className="text-gray-600">
            <strong>Example</strong>: If your wrist measures 16 cm, order a 17.5 cm bracelet for comfort fit.
          </p>
        </section>

        {/* Assistance */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Peace Bijouterie Assistance</h2>
          </div>
          <p className="text-gray-600 mb-4">Not sure about your size?</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Visit our <strong>Kigali shop</strong> for professional sizing.</li>
            <li>Contact our <strong>Customer Service</strong> for help choosing the right fit.</li>
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
          <p>✨ Thank you for choosing Peace Bijouterie – Your sparkle, our passion!</p>
        </div>
      </footer>
    </div>
  );
};

export default SizeGuide;