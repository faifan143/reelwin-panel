import React from 'react';
import Button from '../atoms/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showItemCount?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  showItemCount = true,
  className = '',
}) => {
  // Calculate the range of items being displayed
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems || 0);
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems || 0);
  
  // Function to determine which pages to show in the pagination
  const getPageNumbers = () => {
    const totalPageNumbers = 5;
    
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always show first page, last page, and pages around current page
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      // Show first few pages
      return [...Array.from({ length: 3 }, (_, i) => i + 1), '...', totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      // Show last few pages
      return [1, '...', ...Array.from({ length: 3 }, (_, i) => totalPages - 2 + i)];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      // Show pages around current
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
    
    return [];
  };
  
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-y-4 ${className}`}>
      {/* Mobile pagination */}
      <div className="flex justify-between w-full sm:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          leftIcon={<ChevronRight className="h-4 w-4" />}
        >
          السابق
        </Button>
        
        <span className="text-sm text-gray-700">
          {currentPage} من {totalPages}
        </span>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          rightIcon={<ChevronLeft className="h-4 w-4" />}
        >
          التالي
        </Button>
      </div>
      
      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showItemCount && totalItems !== undefined && (
          <div>
            <p className="text-sm text-gray-700">
              عرض <span className="font-medium">{startItem}</span> إلى{' '}
              <span className="font-medium">{endItem}</span> من{' '}
              <span className="font-medium">{totalItems}</span> عنصر
            </p>
          </div>
        )}
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -gap-px" aria-label="Pagination">
            <Button
              variant="ghost"
              size="sm"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">السابق</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'ghost'}
                  size="sm"
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 border-indigo-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="ghost"
              size="sm"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="sr-only">التالي</span>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;