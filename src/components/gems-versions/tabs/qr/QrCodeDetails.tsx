import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { QrCodeWithScans, QrStatus, QrCodeType } from '../../types';
import { activateQrCode, deactivateQrCode, generateQrCodePdf, deleteQrCode, selectRandomWinner } from '../../api';
import { QrCode, Download, Users, Gift, Check, X, Trash2, Clock, User } from 'lucide-react';

interface QrCodeDetailsProps {
  qrCode: QrCodeWithScans;
  onClose: () => void;
}

const QrCodeDetails: React.FC<QrCodeDetailsProps> = ({ qrCode, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'scans'>('details');
  const queryClient = useQueryClient();

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
      onClose();
    },
  });

  const lotteryMutation = useMutation({
    mutationFn: (id: string) => selectRandomWinner(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['qrCodes'] });
      alert(`الفائز هو: ${data.winner.name}`);
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
          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 flex items-center">
            <Check size={14} className="ml-1" />
            نشط
          </span>
        );
      case QrStatus.INACTIVE:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 flex items-center">
            <X size={14} className="ml-1" />
            غير نشط
          </span>
        );
      case QrStatus.COMPLETED:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 flex items-center">
            <Check size={14} className="ml-1" />
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
          <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800">
            دائم
          </span>
        );
      case QrCodeType.ONCE:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-800">
            مرة واحدة
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center mb-4 md:mb-0">
          <QrCode size={24} className="ml-2 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">{qrCode.name}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderTypeBadge(qrCode.type)}
          {renderStatusBadge(qrCode.status)}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex">
          <button
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            تفاصيل الرمز
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'scans'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('scans')}
          >
            عمليات المسح ({qrCode.scansCount})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'details' ? (
        <div className="p-6">
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">الوصف</h4>
              <p className="text-gray-900">{qrCode.description || 'لا يوجد وصف'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">تاريخ الإنشاء</h4>
              <p className="text-gray-900 flex items-center">
                <Clock size={16} className="ml-1 text-gray-400" />
                {new Date(qrCode.createdAt).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>

          {/* Rewards Information */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات المكافآت</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="text-sm font-medium text-red-800 mb-1">مكافأة 1000 نقطة</h4>
                <p className="text-2xl font-bold text-red-600">{qrCode.reward1000Count}</p>
                <p className="text-xs text-red-500 mt-1">متبقي</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h4 className="text-sm font-medium text-orange-800 mb-1">مكافأة 500 نقطة</h4>
                <p className="text-2xl font-bold text-orange-600">{qrCode.reward500Count}</p>
                <p className="text-xs text-orange-500 mt-1">متبقي</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">مكافأة 250 نقطة</h4>
                <p className="text-2xl font-bold text-yellow-600">{qrCode.reward250Count}</p>
                <p className="text-xs text-yellow-500 mt-1">متبقي</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="text-sm font-medium text-green-800 mb-1">مكافأة 125 نقطة</h4>
                <p className="text-2xl font-bold text-green-600">{qrCode.reward125Count}</p>
                <p className="text-xs text-green-500 mt-1">متبقي</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
              <p className="text-sm text-blue-800">
                <strong>ملاحظة:</strong> بالإضافة إلى المكافآت الخاصة أعلاه، قد يحصل المستخدمون على مكافآت عشوائية بين 1-100 نقطة عند مسح الرمز.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t">
            <button
              onClick={() => handleDownloadPdf(qrCode.id)}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
            >
              <Download size={16} className="ml-2" />
              تنزيل PDF
            </button>
            
            {qrCode.status === QrStatus.ACTIVE ? (
              <button
                onClick={() => handleDeactivate(qrCode.id)}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 flex items-center"
              >
                <X size={16} className="ml-2" />
                تعطيل
              </button>
            ) : qrCode.status === QrStatus.INACTIVE ? (
              <button
                onClick={() => handleActivate(qrCode.id)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
              >
                <Check size={16} className="ml-2" />
                تفعيل
              </button>
            ) : null}
            
            {qrCode.scansCount > 0 ? (
              <button
                onClick={() => handleLottery(qrCode.id)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 flex items-center"
              >
                <Gift size={16} className="ml-2" />
                اختيار فائز عشوائي
              </button>
            ) : (
              <button
                onClick={() => handleDelete(qrCode.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center"
              >
                <Trash2 size={16} className="ml-2" />
                حذف
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Scans */}
          {qrCode.scans.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد عمليات مسح بعد</h3>
              <p className="text-gray-500">لم يقم أي مستخدم بمسح هذا الرمز حتى الآن.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النقاط
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ المسح
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qrCode.scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {scan.user?.profilePhoto ? (
                            <img
                              src={scan.user.profilePhoto}
                              alt={scan.user.name}
                              className="h-8 w-8 rounded-full ml-3"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-3">
                              <User size={16} className="text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{scan.user?.name}</div>
                            <div className="text-sm text-gray-500">{scan.user?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-sm rounded-full ${
                          scan.points >= 500
                            ? 'bg-red-100 text-red-800'
                            : scan.points >= 250
                            ? 'bg-orange-100 text-orange-800'
                            : scan.points >= 100
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {scan.points} نقطة
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(scan.scannedAt).toLocaleString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QrCodeDetails;