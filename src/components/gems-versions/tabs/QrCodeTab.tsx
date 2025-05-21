import React, { useState } from 'react';
import { QrCode, Package, Search, Filter, Plus, Download, RefreshCw, Gift, Eye, Edit, Trash2, Check, X, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QrCodeType, QrStatus, QrCodeWithScans, CreateQrCodeDto } from '../types';
import { getAllQrCodes, activateQrCode, deactivateQrCode, deleteQrCode, selectRandomWinner, generateQrCodePdf } from '../api';
import QrCodeForm from './qr/QrCodeForm';
import QrCodeDetails from './qr/QrCodeDetails';

const QrCodeTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<QrCodeWithScans | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['qrCodes', currentPage],
    queryFn: () => getAllQrCodes(currentPage, 10),
  });

  // Mutations
  const activateMutation = useMutation({
    mutationFn: (id: string) => activateQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrCodes'] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrCodes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrCodes'] });
    },
  });

  const lotteryMutation = useMutation({
    mutationFn: (id: string) => selectRandomWinner(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['qrCodes'] });
      alert(`The winner is: ${data.winner.name}`);
    },
  });

  const pdfMutation = useMutation({
    mutationFn: (id: string) => generateQrCodePdf(id),
    onSuccess: (data, id) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qr-code-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateQrCode = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewDetails = (qrCode: QrCodeWithScans) => {
    setSelectedQrCode(qrCode);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedQrCode(null);
  };

  const handleActivate = (id: string) => {
    activateMutation.mutate(id);
  };

  const handleDeactivate = (id: string) => {
    deactivateMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف رمز QR هذا؟')) {
      deleteMutation.mutate(id);
    }
  };

  const handleLottery = (id: string) => {
    if (window.confirm('هل أنت متأكد من تحديد فائز عشوائي؟ سيتم تعطيل رمز QR هذا بعد ذلك.')) {
      lotteryMutation.mutate(id);
    }
  };

  const handleDownloadPdf = (id: string) => {
    pdfMutation.mutate(id);
  };

  // Render status badge
  const renderStatusBadge = (status: QrStatus) => {
    switch (status) {
      case QrStatus.ACTIVE:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
            <Check size={12} className="ml-1" />
            نشط
          </span>
        );
      case QrStatus.INACTIVE:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 flex items-center">
            <X size={12} className="ml-1" />
            غير نشط
          </span>
        );
      case QrStatus.COMPLETED:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
            <Check size={12} className="ml-1" />
            مكتمل
          </span>
        );
      default:
        return null;
    }
  };

  // Render type badge
  const renderTypeBadge = (type: QrCodeType) => {
    switch (type) {
      case QrCodeType.PERMANENT:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
            دائم
          </span>
        );
      case QrCodeType.ONCE:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
            مرة واحدة
          </span>
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">جاري تحميل رموز QR...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full p-8 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <h3 className="text-lg font-bold mb-2">حدث خطأ</h3>
        <p>{error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل رموز QR'}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['qrCodes'] })}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="w-full" dir="rtl">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center text-xl font-bold mb-2">
          <QrCode className="ml-2" size={24} />
          <h2>إدارة رموز QR</h2>
        </div>
        <p className="text-gray-600 mb-6">
          إنشاء وإدارة رموز QR التي يمكن للمستخدمين مسحها للحصول على نقاط
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center border-t border-gray-200 pt-4">
          <div className="flex gap-2 mb-4 md:mb-0">
            <button
              onClick={handleCreateQrCode}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus size={16} className="ml-2" />
              إنشاء رمز QR جديد
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center">
              <Filter size={16} className="ml-2" />
              فلترة
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['qrCodes'] })}
            >
              <RefreshCw size={16} className="ml-2" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* QR Codes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاسم
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النوع
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المسح
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الإنشاء
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((qrCode) => (
                <tr key={qrCode.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <QrCode size={20} className="ml-2 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{qrCode.name}</div>
                        {qrCode.description && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">{qrCode.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderTypeBadge(qrCode.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(qrCode.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <Users size={16} className="ml-1 text-gray-500" />
                      <span>{qrCode.scansCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(qrCode.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleViewDetails(qrCode)}
                        className="text-blue-600 hover:text-blue-900"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(qrCode.id)}
                        className="text-green-600 hover:text-green-900"
                        title="تنزيل PDF"
                      >
                        <Download size={18} />
                      </button>
                      {qrCode.status === QrStatus.ACTIVE ? (
                        <button
                          onClick={() => handleDeactivate(qrCode.id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="تعطيل"
                        >
                          <X size={18} />
                        </button>
                      ) : qrCode.status === QrStatus.INACTIVE ? (
                        <button
                          onClick={() => handleActivate(qrCode.id)}
                          className="text-green-600 hover:text-green-900"
                          title="تفعيل"
                        >
                          <Check size={18} />
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleLottery(qrCode.id)}
                        className="text-purple-600 hover:text-purple-900"
                        title="اختيار فائز عشوائي"
                        disabled={qrCode.scansCount === 0}
                      >
                        <Gift size={18} className={qrCode.scansCount === 0 ? 'opacity-50 cursor-not-allowed' : ''} />
                      </button>
                      <button
                        onClick={() => handleDelete(qrCode.id)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                        disabled={qrCode.scansCount > 0}
                      >
                        <Trash2 size={18} className={qrCode.scansCount > 0 ? 'opacity-50 cursor-not-allowed' : ''} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  عرض <span className="font-medium">{(data.pagination.page - 1) * data.pagination.limit + 1}</span>{' '}
                  إلى{' '}
                  <span className="font-medium">
                    {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}
                  </span>{' '}
                  من <span className="font-medium">{data.pagination.total}</span> عنصر
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    السابق
                  </button>

                  {/* Page numbers */}
                  {[...Array(data.pagination.pages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === index + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(data.pagination.pages, currentPage + 1))}
                    disabled={currentPage === data.pagination.pages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === data.pagination.pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    التالي
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create QR Code Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">إنشاء رمز QR جديد</h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <QrCodeForm onClose={handleCloseModals} />
            </div>
          </div>
        </div>
      )}

      {/* QR Code Details Modal */}
      {isDetailsModalOpen && selectedQrCode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">تفاصيل رمز QR</h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <QrCodeDetails qrCode={selectedQrCode} onClose={handleCloseModals} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeTab;