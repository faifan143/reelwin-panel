import React from 'react';
import { Content } from '@/types/content';
import { Eye, ThumbsUp, MessageCircle, Calendar, Clock, User, Phone, Store as StoreIcon, Edit, Trash2, Gem } from 'lucide-react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import MediaPreview from '../molecules/MediaPreview';
import InterestTag from '../molecules/InterestTag';

export interface ContentCardProps {
  content: Content;
  onEdit?: () => void;
  onDelete?: () => void;
  onMediaClick?: (mediaIndex: number) => void;
  onGemClick?: () => void;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onEdit,
  onDelete,
  onMediaClick,
  onGemClick,
  className = '',
}) => {
  return (
    <Card className={`transition-shadow hover:shadow-md ${className}`}>
      {/* Card Header */}
      <div className="flex justify-between flex-wrap items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900">
          {content.title}
        </h3>
        <div className="text-xs text-gray-500 font-mono mt-1 w-full">
          معرف: {content.id}
        </div>
        <div className="flex gap-1">
          {onGemClick && (
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-600 hover:text-yellow-900 p-1"
              onClick={onGemClick}
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
              onClick={onEdit}
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
              onClick={onDelete}
              title="حذف"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {content.description}
      </p>

      {/* Tags/Interests */}
      <div className="flex flex-wrap gap-1 mb-3">
        {content.interests.map((interest) => (
          <InterestTag key={interest.id} interest={interest} />
        ))}
      </div>

      {/* Media, Owner, and Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Media */}
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs font-medium text-gray-500 mb-1">
            الوسائط
          </div>
          <div className="flex gap-1 gap-reverse">
            {content.mediaUrls.map((media, index) => (
              <MediaPreview
                key={index}
                media={media}
                iconOnly
                onClick={() => onMediaClick && onMediaClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Owner */}
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs font-medium text-gray-500 mb-1">
            المالك ({content.ownerType === "INDIVIDUAL" ? "فردي" : "متجر"})
          </div>
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
        </div>
      </div>

      {/* Settings and Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Settings */}
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs font-medium text-gray-500 mb-1">
            الإعدادات
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Clock className="h-4 w-4 ml-1 text-gray-400" />
            {content.intervalHours} ساعة
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Calendar className="h-4 w-4 ml-1 text-gray-400" />
            {new Date(content.endValidationDate).toLocaleDateString(
              "ar"
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs font-medium text-gray-500 mb-1">
            الإحصائيات
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="text-xs text-center">
              <div className="flex justify-center">
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
              <div>{content._count?.viewedBy || 0}</div>
            </div>
            <div className="text-xs text-center">
              <div className="flex justify-center">
                <ThumbsUp className="h-4 w-4 text-gray-400" />
              </div>
              <div>{content._count?.likedBy || 0}</div>
            </div>
            <div className="text-xs text-center">
              <div className="flex justify-center">
                <MessageCircle className="h-4 w-4 text-gray-400" />
              </div>
              <div>{content._count?.whatsappedBy || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentCard;