/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Check, Package, DollarSign, AlertTriangle, ShoppingBag, X, Plus } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import MaterialService from '../../../services/materialsService';
import productService, { type Product } from '../../../services/ProductService';
import { useNavigate, useParams } from 'react-router-dom';
import SizeSection from '../../../components/dashboard/product/SizeSection';
import FileUpload from '../../../components/dashboard/product/FileUpload';
import TagsSection from '../../../components/dashboard/product/TagsSection';
import CategorySection from '../../../components/dashboard/product/CategorySection';

interface ProductFormData {
  name: string;
  brand: string;
  size: string;
  quantity: number | '';
  price: number;
  unitPrice: number | '';
  perUnit: string;
  description: string;
  subDescription: string;
  availability: boolean;
  tags: string[];
  categoryId: number;
  images?: File[];
}

interface FileState {
  images: File[];
}

interface PreviewFileState {
  images: string[];
}

interface RemovedFileState {
  images: string[];
}

interface Errors {
  [key: string]: string | null;
}

interface Category {
  id: number;
  name: string;
}

const ProductForm: React.FC<{
  productId?: string;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}> = ({ productId, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    size: '',
    quantity: '',
    price: 0,
    unitPrice: '',
    perUnit: '',
    description: '',
    subDescription: '',
    availability: true,
    tags: [],
    categoryId: 0,
    images: [],
  });
  
  const [files, setFiles] = useState<FileState>({ images: [] });
  const [previewFiles, setPreviewFiles] = useState<PreviewFileState>({ images: [] });
  const [existingFiles, setExistingFiles] = useState<PreviewFileState>({ images: [] });
  const [removedFiles, setRemovedFiles] = useState<RemovedFileState>({ images: [] });
  const [newTag, setNewTag] = useState<string>('');
  const tagInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8000"; // Adjust to your backend domain

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await MaterialService.getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setErrors(prev => ({ ...prev, general: 'Failed to load categories' }));
      }
    };

    const fetchProduct = async () => {
      if (productId) {
        setIsLoading(true);
        try {
          const product = await productService.getProductById(productId);
          setFormData({
            name: product.name || '',
            brand: product.brand || '',
            size: product.size || '',
            quantity: product.quantity || '',
            price: product.price || 0,
            unitPrice: product.price / (product.quantity || 1) || '',
            perUnit: product.perUnit || '',
            description: product.description || '',
            subDescription: product.subDescription || '',
            availability: product.availability ?? true,
            tags: product.tags || [],
            categoryId: product.categoryId || 0,
            images: [],
          });
          setExistingFiles({
            images: product.images?.map(img => img.startsWith('http') ? img : `${API_BASE_URL}${img}`) || [],
          });
        } catch (error: any) {
          setErrors(prev => ({ ...prev, general: error.message || 'Failed to load product data' }));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();
    fetchProduct();
  }, [productId]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean | '') => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'unitPrice' || field === 'quantity') {
        const unitPrice = field === 'unitPrice' ? (value as number) : prev.unitPrice;
        const quantity = field === 'quantity' ? (value as number) : prev.quantity;
        newData.price = (typeof unitPrice === 'number' && typeof quantity === 'number')
          ? unitPrice * quantity
          : 0;
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSizeChange = (sizeValue: string) => {
    const sizeOption = [
      { value: 'XS', fullName: 'Extra Small' },
      { value: 'S', fullName: 'Small' },
      { value: 'M', fullName: 'Medium' },
      { value: 'L', fullName: 'Large' },
      { value: 'XL', fullName: 'Extra Large' },
      { value: 'XXL', fullName: '2X Large' },
      { value: 'XXXL', fullName: '3X Large' },
    ].find(opt => opt.value === sizeValue);
    const fullSizeName = sizeOption ? sizeOption.fullName : sizeValue;
    handleInputChange('size', fullSizeName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
    const totalImages = existingFiles.images.length + files.images.length + newFiles.length;
    
    if (totalImages > 4) {
      setErrors(prev => ({ ...prev, images: 'Maximum 4 images allowed' }));
      return;
    }

    setFiles(prev => ({ images: [...prev.images, ...newFiles] }));
    
    const newPreviews = newFiles.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
      });
    });

    Promise.all(newPreviews).then(results => {
      setPreviewFiles(prev => ({ images: [...prev.images, ...results] }));
    });

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: null }));
    }
  };

  const removeFile = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingFiles(prev => {
        const removedImage = prev.images[index];
        setRemovedFiles(prev => ({ images: [...prev.images, removedImage] }));
        return { images: prev.images.filter((_, i) => i !== index) };
      });
    } else {
      setFiles(prev => ({
        images: prev.images.filter((_, i) => i !== index),
      }));
      setPreviewFiles(prev => ({
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const addTag = () => {
    let trimmedTag = newTag.trim();
    if (!trimmedTag.startsWith('#')) {
      trimmedTag = `#${trimmedTag}`;
    }
    if (trimmedTag && !trimmedTag.includes(' ') && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setNewTag('');
      setTimeout(() => {
        tagInputRef.current?.focus();
      }, 0);
      setErrors(prev => ({ ...prev, tags: null }));
    } else if (trimmedTag && trimmedTag.includes(' ')) {
      setErrors(prev => ({ ...prev, tags: 'Tags must start with # and contain no spaces' }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.size.trim()) newErrors.size = 'Size is required';
    if (formData.quantity === '' || (typeof formData.quantity === 'number' && formData.quantity < 0)) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    if (formData.unitPrice === '' || (typeof formData.unitPrice === 'number' && formData.unitPrice <= 0)) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }
    if (!formData.perUnit.trim()) newErrors.perUnit = 'Unit is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.subDescription.trim()) newErrors.subDescription = 'Detailed description is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!files.images.length && !existingFiles.images.length) {
      newErrors.images = 'At least one product image is required';
    }
    if (files.images.length + existingFiles.images.length > 4) {
      newErrors.images = 'Maximum 4 images allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('quantity', String(formData.quantity ?? 0));
      formDataToSend.append('price', String(formData.unitPrice ?? 0));
      formDataToSend.append('perUnit', formData.perUnit);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('subDescription', formData.subDescription);
      formDataToSend.append('categoryId', String(formData.categoryId));
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('availability', String(formData.availability ?? true));
      
      if (productId) {
        const keepImages = existingFiles.images.map(img => 
          img.startsWith(API_BASE_URL) ? img.replace(API_BASE_URL, '') : img
        );
        formDataToSend.append('keepImages', JSON.stringify(keepImages));
      }

      files.images?.forEach((file: File) => formDataToSend.append('images', file));

      let response;
      if (productId) {
        response = await productService.updateProduct(productId, formDataToSend);
      } else {
        response = await productService.createProduct(formDataToSend);
      }

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, general: error.message || 'Failed to save product' }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">{productId ? 'Loading product...' : 'Saving product...'}</p>
        </div>
      </div>
    );
  }

  if (categories?.length === 0 || !categories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-lg w-full">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Prerequisites Required
          </h2>
          
          <div className="text-gray-600 mb-6 space-y-3">
            <p className="font-medium">
              {!categories
                ? "Categories could not be loaded. Please try refreshing the page."
                : "No categories found in the system."
              }
            </p>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-primary-800 mb-2">To add products, you need:</h3>
              <ul className="space-y-2 text-sm text-primary-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">1.</span>
                  <span><strong>Product Categories:</strong> Create at least one category to organize your products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">2.</span>
                  <span><strong>Product Management Page:</strong> Navigate to the products section to add individual items</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">3.</span>
                  <span><strong>Product Details:</strong> Each product requires a category, name, price, and description</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-500">
              Products must be assigned to categories for proper organization and filtering.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!categories ? (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <Package className="h-4 w-4" />
                Reload Page
              </button>
            ) : null}
            
            <button
              onClick={() => navigate('/admin/dashboard/category-management')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Categories First
            </button>
            
            <button
              onClick={() => navigate('/admin/dashboard/product-management')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!categories || categories.length === 0}
              title={!categories || categories.length === 0 ? "Create categories first" : "Go to product management"}
            >
              <ShoppingBag className="h-4 w-4" />
              Manage Products
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center">
                  <span className="text-yellow-700 font-semibold">1</span>
                </div>
                <span>Categories</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">2</span>
                </div>
                <span>Products</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">3</span>
                </div>
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              {productId ? 'Update Product' : 'Add New Product'}
            </h1>
            <p className="text-primary-100 text-xs mt-1">
              Fill in the details to {productId ? 'update' : 'create'} your product listing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-6">
            <FileUpload
              previewFiles={previewFiles}
              existingFiles={existingFiles}
              errors={errors}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
            />
            <TagsSection
              tags={formData.tags}
              errors={errors}
              newTag={newTag}
              setNewTag={setNewTag}
              addTag={addTag}
              removeTag={removeTag}
            />
            <CategorySection
              categoryId={formData.categoryId}
              categories={categories}
              errors={errors}
              handleInputChange={handleInputChange}
            />
            <SizeSection
              size={formData.size}
              errors={errors}
              handleSizeChange={handleSizeChange}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Package className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Product Information</h2>
                </div>
                <p className="text-xs text-gray-500">Enter the basic details about your product</p>
              </div>

              <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><X className="h-3 w-3" />{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter brand name"
                    />
                    {errors.brand && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><X className="h-3 w-3" />{errors.brand}</p>}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing & Inventory
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Unit Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => handleInputChange('unitPrice', e.target.value ? parseFloat(e.target.value) : '')}
                        className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter unit price"
                      />
                      {errors.unitPrice && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><X className="h-3 w-3" />{errors.unitPrice}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value ? parseInt(e.target.value) : '')}
                        className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter quantity"
                      />
                      {errors.quantity && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><X className="h-3 w-3" />{errors.quantity}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Total Price
                      </label>
                      <div className="px-3 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium">
                        ${formData.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Per Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.perUnit}
                    onChange={(e) => handleInputChange('perUnit', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., piece, gram, set, pair"
                  />
                  {errors.perUnit && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><X className="h-3 w-3" />{errors.perUnit}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief product description (1-2 lines)"
                    maxLength={120}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description ? (
                      <p className="text-xs text-red-600 flex items-center gap-1"><X className="h-3 w-3" />{errors.description}</p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">{formData.description.length}/120</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    value={formData.subDescription}
                    onChange={(value) => handleInputChange('subDescription', value)}
                    theme="snow"
                    className="w-full text-sm border border-gray-200 rounded-lg"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                        ['clean'],
                      ],
                    }}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.subDescription ? (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.subDescription}
                      </p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">{formData.subDescription.replace(/<[^>]+>/g, '').length} characters</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <input
                    type="checkbox"
                    id="availability"
                    checked={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                  />
                  <label htmlFor="availability" className="text-xs font-medium text-green-800">
                    Product is available for sale
                  </label>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium bg-gradient-to-r from-primary-600 to-primary-600 text-white rounded-lg hover:from-primary-700 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    <Check className="h-4 w-4" />
                    <span>{productId ? 'Update Product' : 'Create Product'}</span>
                  </button>
                </div>
              </div>

              {errors.general && (
                <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600 flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {errors.general}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductFormExample: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const { id: editingProductId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = (response: any) => {
    navigate('/admin/dashboard/product-management');
    console.log("Product saved successfully:", response);
    setShowForm(false);
  };

  const handleCancel = () => {
    navigate('/admin/dashboard/product-management');
    console.log("Form cancelled");
  };

  return (
    <ProductForm
      productId={editingProductId || undefined}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default ProductFormExample;