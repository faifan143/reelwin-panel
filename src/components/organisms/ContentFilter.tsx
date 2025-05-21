import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { Interest } from '@/types/interests';
import { SearchFilters } from '@/types/content';

export interface ContentFilterProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  interests: Interest[];
  isLoading?: boolean;
}

const ContentFilter: React.FC<ContentFilterProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  interests,
  isLoading = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          فلترة المحتوى
        </h2>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Filter className="h-4 w-4" />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المالك
            </label>
            <Input
              type="text"
              name="ownerName"
              value={filters.ownerName || ''}
              onChange={handleChange}
              placeholder="البحث حسب اسم المالك"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف
            </label>
            <Input
              type="text"
              name="ownerNumber"
              value={filters.ownerNumber || ''}
              onChange={handleChange}
              placeholder="09XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الفئة
            </label>
            <select
              name="interestId"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={filters.interestId || ''}
              onChange={handleChange}
            >
              <option value="">جميع الفئات</option>
              {interests.map((interest) => (
                <option key={interest.id} value={interest.id}>
                  {interest.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="primary"
              leftIcon={<Search className="h-4 w-4" />}
              onClick={onSearch}
              isLoading={isLoading}
            >
              بحث
            </Button>
            <Button
              variant="secondary"
              leftIcon={<X className="h-4 w-4" />}
              onClick={onReset}
            >
              مسح
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentFilter;