import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardTemplate from '../templates/DashboardTemplate';
import Button from '../atoms/Button';
import ContentFilter from '../organisms/ContentFilter';
import ContentTable from '../organisms/ContentTable';
import Pagination from '../molecules/Pagination';
import Modal from '../molecules/Modal';
import ContentForm from '../organisms/ContentForm';
import ContentCard from '../organisms/ContentCard';
import { MediaItem, SearchFilters, Content, ContentFormData } from '@/types/content';
import { useContentList } from '@/hooks/queries/useContent';
import { useInterests } from '@/hooks/queries/useInterests';
import { useStores } from '@/hooks/queries/useStores';
import { useUpdateContent, useDeleteContent, useCreateContent } from '@/hooks/mutations/useContentMutations';
import { useGenerateGem } from '@/hooks/mutations/useGemMutations';
import { message } from 'antd';

const ContentManagementPage: React.FC = () => {
  // State
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [gemPoints, setGemPoints] = useState<number>(50);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isGemModalOpen, setIsGemModalOpen] = useState(false);
  
  // Queries
  const { data: contentData, isLoading, refetch } = useContentList(filters);
  const { data: interests = [] } = useInterests();
  const { data: stores = [] } = useStores();
  
  // Mutations
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  const deleteMutation = useDeleteContent();
  const generateGemMutation = useGenerateGem();
  
  // Handlers
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };
  
  const handleSearch = () => {
    refetch();
    setCurrentPage(1);
  };
  
  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };
  
  const handleEditClick = (content: Content) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (content: Content) => {
    setSelectedContent(content);
    setIsDeleteModalOpen(true);
  };
  
  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };
  
  const handleGemClick = (content: Content) => {
    setSelectedContent(content);
    setGemPoints(50);
    setIsGemModalOpen(true);
  };
  
  const handleCreateContent = (data: ContentFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        message.success('تم إضافة المحتوى بنجاح');
        setIsCreateModalOpen(false);
        refetch();
      },
      onError: (error) => {
        console.error('Create error:', error);
        message.error('حدث خطأ أثناء إضافة المحتوى');
      },
    });
  };
  
  const handleUpdateContent = (data: ContentFormData) => {
    if (selectedContent) {
      updateMutation.mutate({ id: selectedContent.id, data }, {
        onSuccess: () => {
          message.success('تم تحديث المحتوى بنجاح');
          setIsEditModalOpen(false);
          refetch();
        },
        onError: (error) => {
          console.error('Update error:', error);
          message.error('حدث خطأ أثناء تحديث المحتوى');
        },
      });
    }
  };
  
  const handleDeleteContent = () => {
    if (selectedContent) {
      deleteMutation.mutate(selectedContent.id, {
        onSuccess: () => {
          message.success('تم حذف المحتوى بنجاح');
          setIsDeleteModalOpen(false);
          refetch();
        },
        onError: (error) => {
          console.error('Delete error:', error);
          message.error('حدث خطأ أثناء حذف المحتوى');
        },
      });
    }
  };
  
  const handleGenerateGem = () => {
    if (selectedContent && gemPoints > 0) {
      generateGemMutation.mutate(
        { contentId: selectedContent.id, points: gemPoints },
        {
          onSuccess: (data) => {
            message.success(`تم إنشاء جائزة بقيمة ${data.gem.points} نقطة`);
            setIsGemModalOpen(false);
          },
          onError: (error) => {
            console.error('Generate gem error:', error);
            message.error('حدث خطأ أثناء إنشاء الجائزة');
          },
        }
      );
    }
  };
  
  // Format content data for pagination
  const totalItems = contentData?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = contentData?.slice(startIndex, endIndex) || [];
  
  return (
    <DashboardTemplate
      title="إدارة المحتوى"
      subtitle="عرض وتعديل وحذف المحتوى الموجود في النظام"
      action={
        <Button
          variant="primary"
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          إضافة محتوى جديد
        </Button>
      }
    >
      {/* Filters */}
      <ContentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleResetFilters}
        interests={interests}
        isLoading={isLoading}
      />
      
      {/* Content List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : totalItems > 0 ? (
        <>
          {/* Desktop Table View */}
          <ContentTable
            contentItems={currentItems}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onMediaClick={handleMediaClick}
            onGemClick={handleGemClick}
            className="mb-4"
          />
          
          {/* Mobile Card Grid View */}
          <div className="md:hidden grid grid-cols-1 gap-4 mb-4">
            {currentItems.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onEdit={() => handleEditClick(content)}
                onDelete={() => handleDeleteClick(content)}
                onMediaClick={(index) => handleMediaClick(content.mediaUrls[index])}
                onGemClick={() => handleGemClick(content)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={pageSize}
          />
        </>
      ) : (
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
      )}
      
      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة محتوى جديد"
        size="lg"
      >
        <ContentForm
          interests={interests}
          stores={stores}
          onSubmit={handleCreateContent}
          isSubmitting={createMutation.isPending}
          submitText="إضافة المحتوى"
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل المحتوى"
        size="lg"
      >
        {selectedContent && (
          <ContentForm
            initialData={{
              title: selectedContent.title,
              description: selectedContent.description,
              ownerType: selectedContent.ownerType,
              ownerName: selectedContent.ownerName || '',
              ownerNumber: selectedContent.ownerNumber || '',
              storeId: selectedContent.storeId || '',
              intervalHours: selectedContent.intervalHours,
              endValidationDate: new Date(selectedContent.endValidationDate).toISOString().slice(0, 16),
              interestIds: selectedContent.interests.map((interest) => interest.id),
              type: selectedContent.type,
            }}
            interests={interests}
            stores={stores}
            onSubmit={handleUpdateContent}
            isSubmitting={updateMutation.isPending}
            submitText="حفظ التغييرات"
          />
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
        size="sm"
        footer={
          <>
            <Button
              variant="danger"
              onClick={handleDeleteContent}
              isLoading={deleteMutation.isPending}
            >
              نعم، حذف المحتوى
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              إلغاء
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          {selectedContent && `هل أنت متأكد من رغبتك في حذف المحتوى "${selectedContent.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        </p>
      </Modal>
      
      {/* Media Preview Modal */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title="عرض الوسائط"
        size="md"
      >
        {selectedMedia && (
          <div className="mt-2 bg-gray-100 rounded-lg overflow-hidden">
            {selectedMedia.type === "IMAGE" ? (
              <img
                src={selectedMedia.url}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
            ) : (
              <video
                src={selectedMedia.url}
                poster={selectedMedia.poster}
                controls
                autoPlay
                className="w-full h-auto max-h-96"
              />
            )}
          </div>
        )}
      </Modal>
      
      {/* Gem Creation Modal */}
      <Modal
        isOpen={isGemModalOpen}
        onClose={() => setIsGemModalOpen(false)}
        title="إنشاء جائزة جديدة"
        size="sm"
        footer={
          <>
            <Button
              variant="warning"
              onClick={handleGenerateGem}
              isLoading={generateGemMutation.isPending}
            >
              إنشاء جائزة
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsGemModalOpen(false)}
            >
              إلغاء
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-500 mb-4">
          ستتم إضافة جائزة لهذا المحتوى يمكن للمستخدمين الحصول عليها
        </p>

        <div className="mb-4">
          <label
            htmlFor="gemPoints"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            عدد النقاط
          </label>
          <input
            type="number"
            id="gemPoints"
            min={1}
            value={gemPoints}
            onChange={(e) => setGemPoints(parseInt(e.target.value))}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </Modal>
    </DashboardTemplate>
  );
};

export default ContentManagementPage;