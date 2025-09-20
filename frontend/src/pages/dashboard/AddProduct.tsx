/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Upload, X, Eye, Plus, Check, Package, Tag, DollarSign, Layers } from 'lucide-react';
import MaterialService, { type Category } from '../../services/materialsService';
import type { AxiosResponse } from 'axios';
import productService from '../../services/ProductService';

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

  const sizeOptions = [
    { value: 'XS', label: 'Extra Small', fullName: 'Extra Small' },
    { value: 'S', label: 'Small', fullName: 'Small' },
    { value: 'M', label: 'Medium', fullName: 'Medium' },
    { value: 'L', label: 'Large', fullName: 'Large' },
    { value: 'XL', label: 'Extra Large', fullName: 'Extra Large' },
    { value: 'XXL', label: '2X Large', fullName: '2X Large' },
    { value: 'XXXL', label: '3X Large', fullName: '3X Large' },
  ];

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
    fetchCategories();
  }, []);

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
    const sizeOption = sizeOptions.find(opt => opt.value === sizeValue);
    const fullSizeName = sizeOption ? sizeOption.fullName : sizeValue;
    handleInputChange('size', fullSizeName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
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

  const removeFile = (index: number) => {
    setFiles(prev => ({
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewFiles(prev => ({
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    let trimmedTag = newTag.trim();
    // Prepend # if not present
    if (!trimmedTag.startsWith('#')) {
      trimmedTag = `#${trimmedTag}`;
    }
    // Validate tag: must start with #, no spaces, non-empty
    if (trimmedTag && !trimmedTag.includes(' ') && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setNewTag('');
      // Delay focus to ensure input is ready after render
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
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!files.images.length && !existingFiles.images.length) {
      newErrors.images = 'At least one product image is required';
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
      if (formData.subDescription) formDataToSend.append('subDescription', formData.subDescription);
      formDataToSend.append('categoryId', String(formData.categoryId));
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('availability', String(formData.availability ?? true));

      files.images?.forEach((file: File) => formDataToSend.append('images', file));

      // Log FormData contents for debugging
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await productService.createProduct(formDataToSend);

      console.log('API Response:', response);

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

  const SizeSection: React.FC = () => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Layers className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Size</h3>
          <p className="text-xs text-gray-500">Choose product size</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {sizeOptions.map((option) => (
          <div key={option.value} className="relative">
            <input
              type="radio"
              id={`size-${option.value}`}
              name="size"
              value={option.value}
              checked={formData.size === option.fullName}
              onChange={() => handleSizeChange(option.value)}
              className="sr-only"
            />
            <label
              htmlFor={`size-${option.value}`}
              className={`block w-full py-2.5 text-center text-xs font-medium rounded-lg border-2 cursor-pointer transition-all ${
                formData.size === option.fullName
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {option.value}
            </label>
          </div>
        ))}
      </div>
      {errors.size && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors.size}
        </p>
      )}
    </div>
  );

  const FileUpload: React.FC = () => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Upload className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Product Images</h3>
          <p className="text-xs text-gray-500">Upload high-quality images</p>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 hover:bg-primary-50/20 transition-all cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="images"
        />
        <label htmlFor="images" className="cursor-pointer">
          <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto group-hover:bg-primary-100 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 group-hover:text-primary-500" />
          </div>
          <p className="mt-3 font-medium text-gray-900">Drop images here or click to browse</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each</p>
        </label>
      </div>

      {previewFiles.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {previewFiles.images.map((preview, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <img src={preview} alt={`Preview ${index}`} className="h-24 w-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => window.open(preview)}
                  className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {errors.images && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors.images}
        </p>
      )}
    </div>
  );

  const TagsSection: React.FC = () => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Tag className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Product Tags</h3>
          <p className="text-xs text-gray-500">Add searchable hashtags (e.g., #ProductTag, no spaces)</p>
        </div>
      </div>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          ref={tagInputRef}
          className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter hashtag (e.g., #ProductTag)"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {errors.tags && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors.tags}
        </p>
      )}
      
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-xs rounded-full border border-primary-200"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-0.5 hover:bg-primary-200 rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CategorySection: React.FC = () => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-green-50 rounded-lg">
          <Layers className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Category</h3>
          <p className="text-xs text-gray-500">Choose product category</p>
        </div>
      </div>
      
      <select
        value={formData.categoryId}
        onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
        className="w-full px-3 py-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
      >
        <option value="0">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {errors.categoryId && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors.categoryId}
        </p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Saving product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
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
            <FileUpload />
            <TagsSection />
            <CategorySection />
            <SizeSection />
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
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.subDescription}
                    onChange={(e) => handleInputChange('subDescription', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Provide comprehensive details about the product including features, specifications, materials, care instructions, etc. This will help customers make informed decisions."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">Detailed product information for customers</p>
                    <span className="text-xs text-gray-400">{formData.subDescription.length} characters</span>
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
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleSuccess = (response: any) => {
    console.log("Product saved successfully:", response);
    setShowForm(false);
  };

  const handleCancel = () => {
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