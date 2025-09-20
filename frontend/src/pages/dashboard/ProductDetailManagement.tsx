import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import productService from "../../services/productService";

interface Product {
  id: string;
  name: string;
  images: string[];
  brand: string;
  size: string;
  quantity: number;
  price: number;
  perUnit: string;
  description: string;
  subDescription: string;
  review: number;
  availability: boolean;
  tags: string[];
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
}

const API_BASE_URL = "http://localhost:8000"; // change this to your backend domain

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await productService.getProductById(productId);
      if (response.success) {
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(getProductImage(response.data.images[0]));
        }
      } else {
        setError("Product not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (path: string): string => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-6 h-6 ${i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!product) return <p className="p-4">No product found</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>

      {/* Product Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="object-contain h-full w-full" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {product.images.slice(0, 3).map((img, index) => (
              <img
                key={index}
                src={getProductImage(img)}
                alt={`${product.name} ${index}`}
                className={`w-24 h-24 object-contain border rounded cursor-pointer ${
                  getProductImage(img) === mainImage ? "border-blue-500" : "border-gray-200"
                }`}
                onClick={() => setMainImage(getProductImage(img))}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
          <p className="text-gray-600 mb-2">Category: {product.category?.name}</p>
          <p className="text-xl font-semibold text-green-600 mb-4">${product.price.toFixed(2)}</p>

          <div className="flex items-center gap-2 mb-4">
            {renderStars(product.review || 0)}
            <span className="text-gray-600 text-sm">({product.review || 0} reviews)</span>
          </div>

          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-500 mb-2">Size: {product.size}</p>
          <p className="text-gray-500 mb-2">Quantity: {product.quantity}</p>
          <p className={`mb-4 ${product.availability ? "text-green-600" : "text-red-600"}`}>
            {product.availability ? "In Stock" : "Out of Stock"}
          </p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {product.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 text-sm bg-gray-200 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Reviews</h2>
        {product.review && product.review > 0 ? (
          <p className="text-gray-600">There are {product.review} reviews for this product.</p>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
