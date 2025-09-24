import React, { useRef } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagsSectionProps {
  tags: string[];
  errors: { tags?: string | null };
  newTag: string;
  setNewTag: (value: string) => void;
  addTag: () => void;
  removeTag: (index: number) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  errors,
  newTag,
  setNewTag,
  addTag,
  removeTag,
}) => {
  const tagInputRef = useRef<HTMLInputElement>(null);

  return (
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
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
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
};

export default TagsSection;