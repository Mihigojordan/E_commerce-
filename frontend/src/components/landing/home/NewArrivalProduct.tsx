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
    <div className="p-6">
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
          <div key={product.id} className="rounded-2xl shadow-md bg-white">
            <div className="p-4 flex flex-col items-center">
              {/* Badge - show availability */}
              {!product.availability && (
                <span className="px-3 py-1 text-xs rounded-full mb-2 bg-red-100 text-red-600">
                  Out of stock
                </span>
              )}

              {/* Image */}
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-32 object-contain mb-4"
                />
              ) : (
                <div className="h-32 w-full flex items-center justify-center bg-gray-100 text-gray-400 mb-4">
                  No Image
                </div>
              )}

              {/* Title */}
              <h3 className="font-medium text-center mb-2">{product.name}</h3>

              {/* Rating */}
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < product.review
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* Price */}
              <div className="flex gap-2 items-center">
                <span className="text-lg font-bold text-teal-600">
                  ${product.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewArrivalProduct;
