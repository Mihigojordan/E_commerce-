import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

function NewArrivalProduct() {
  const [products, setProducts] = useState([]);

  // Fetch products from backend API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/products");
        const result = await res.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          <span className="text-teal-600">New</span> Arrivals
        </h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <ChevronLeft />
          </button>
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Image Container */}
            <div className="relative bg-gray-100 rounded-t-2xl">
              {!product.availability && (
                <span className="absolute top-3 left-3 px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 z-10">
                  Out of stock
                </span>
              )}
              
              {product.images && product.images.length > 0 ? (
                <img
                  src={`http://localhost:8000${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-2xl">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < (product.review || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-teal-600">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewArrivalProduct;