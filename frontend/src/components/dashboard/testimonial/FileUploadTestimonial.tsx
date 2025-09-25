import React, { useState } from 'react';
import { Upload, Eye, X } from 'lucide-react';

interface FileUploadTestimonialProps {
  previewFile: string | null;
  existingFile: string | null;
  errors: { profileImage?: string | null };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: () => void;
}

const FileUploadTestimonial: React.FC<FileUploadTestimonialProps> = ({
  previewFile,
  existingFile,
  errors,
  handleFileChange,
  removeFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const syntheticEvent = {
          target: { files: [file] },
        } as any;
        handleFileChange(syntheticEvent);
      } else {
        console.error('Please drop a valid image file');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Upload className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Profile Image</h3>
          <p className="text-xs text-gray-500">Upload one high-quality image</p>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/20'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="profileImage"
        />
        <label htmlFor="profileImage" className="cursor-pointer">
          <div
            className={`p-3 rounded-full w-fit mx-auto transition-colors ${
              isDragging ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-primary-100'
            }`}
          >
            <Upload
              className={`h-8 w-8 ${
                isDragging ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'
              }`}
            />
          </div>
          <p className="mt-3 font-medium text-gray-900">
            {isDragging ? 'Drop image here' : 'Drop image here or click to browse'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
        </label>
      </div>

      {(previewFile || existingFile) && (
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="relative group rounded-lg overflow-hidden border border-gray-200">
            <img
              src={previewFile || existingFile || ''}
              alt="Profile image"
              className="h-24 w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => window.open(previewFile || existingFile!)}
                className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Eye className="h-4 w-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={removeFile}
                className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {errors.profileImage && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors.profileImage}
        </p>
      )}
    </div>
  );
};

export default FileUploadTestimonial;