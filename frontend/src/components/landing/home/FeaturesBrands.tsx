import React from 'react';

const brands = [
  { id: 1, name: 'Brand 1', logo: '/logos/brand1.png' },
  { id: 2, name: 'Brand 2', logo: '/logos/brand2.png' },
  { id: 3, name: 'Brand 3', logo: '/logos/brand3.png' },
  { id: 4, name: 'Brand 4', logo: '/logos/brand4.png' },
];

function FeaturesBrands() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Our Featured Brands</h2>
        <p className="text-gray-600 mb-10">
          We collaborate with top brands to bring you the best products.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center">
          {brands.map((brand) => (
            <div key={brand.id} className="flex justify-center">
              <img src={brand.logo} alt={brand.name} className="h-16 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesBrands;
