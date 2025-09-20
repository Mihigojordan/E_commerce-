import React, { useEffect, useState } from 'react';

function BestSellProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg shadow-md p-4 flex flex-col items-center"
        >
          {product.images.length > 0 ? (
            <img
              src={`http://localhost:8000${product.images[0]}`}
              alt={product.name}
              className="w-full h-72 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              No Image
            </div>
          )}

          <div className="w-full text-left">
            <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>
            <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
            <p className="font-bold text-green-600 mb-2">${product.price}</p>

            {/* Rating Stars */}
            <div className="flex justify-left mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.075 9.384c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>

            {/* Add to Cart Button */}
        
          </div>
        </div>
      ))}
    </div>
  );
}

export default BestSellProduct;
