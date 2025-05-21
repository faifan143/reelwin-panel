import React from 'react';
import { Edit, Eye, ThumbsUp, MessageCircle, Calendar, Clock, User, Phone, Store as StoreIcon, Trash2, Gem } from 'lucide-react';
import { Content } from '@/types/content';
import MediaPreview from '../molecules/MediaPreview';
import Button from '../atoms/Button';
import InterestTag from '../molecules/InterestTag';

export interface ContentTableProps {
  contentItems: Content[];
  onEdit?: (content: Content) => void;
  onDelete?: (content: Content) => void;
  onMediaClick?: (media: Content['mediaUrls'][0]) => void;
  onGemClick?: (content: Content) => void;
  className?: string;
}

const ContentTable: React.FC<ContentTableProps> = ({
  contentItems,
  onEdit,
  onDelete,
  onMediaClick,
  onGemClick,
  className = '',
}) => {
  if (!contentItems.length) {
    return (
      <div className="bg-white p-6 text-center rounded-lg shadow-sm">
        <div className="text-gray-500 my-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            لا يوجد محتوى
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على أي محتوى يطابق معايير البحث.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`hidden md:block bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                معرف المحتوى
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العنوان
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوسائط
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المالك
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإعدادات
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإحصائيات
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contentItems.map((content) => (
              <tr key={content.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 font-mono">{content.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {content.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {content.description}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {content.interests.map((interest) => (
                        <InterestTag
                          key={interest.id}
                          interest={interest}
                        />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1">
                    {content.mediaUrls.map((media, index) => (
                      <MediaPreview
                        key={index}
                        media={media}
                        iconOnly
                        onClick={() => onMediaClick && onMediaClick(media)}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    {content.ownerType === "INDIVIDUAL" ? (
                      <>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <User className="h-4 w-4 ml-1 text-gray-400" />
                          {content.ownerName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 ml-1 text-gray-400" />
                          {content.ownerNumber}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <StoreIcon className="h-4 w-4 ml-1 text-gray-400" />
                        {content.store?.name || "متجر"}
                      </div>
                    )}
                    <div className="text-xs mt-1 px-2 py-1 bg-gray-100 rounded text-gray-600 inline-block w-fit">
                      {content.ownerType === "INDIVIDUAL" ? "فردي" : "متجر"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 ml-1 text-gray-400" />
                      {content.intervalHours} ساعة
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 ml-1 text-gray-400" />
                      {new Date(content.endValidationDate).toLocaleDateString("ar")}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-600 flex items-center">
                      <Eye className="h-4 w-4 ml-1 text-gray-400" />
                      {content._count?.viewedBy || 0} مشاهدة
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <ThumbsUp className="h-4 w-4 ml-1 text-gray-400" />
                      {content._count?.likedBy || 0} إعجاب
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <MessageCircle className="h-4 w-4 ml-1 text-gray-400" />
                      {content._count?.whatsappedBy || 0} تواصل
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    {onGemClick && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        onClick={() => onGemClick(content)}
                        title="إنشاء جائزة"
                      >
                        <Gem className="h-5 w-5" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        onClick={() => onEdit(content)}
                        title="تعديل"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900 p-1"
                        onClick={() => onDelete(content)}
                        title="حذف"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentTable;