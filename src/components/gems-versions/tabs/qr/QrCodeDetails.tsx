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

  // Render status badge - Dark Theme
  const renderStatusBadge = (status: QrStatus) => {
    switch (status) {
      case QrStatus.ACTIVE:
        return (
          <span className="px-3 py-1.5 text-sm rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center font-medium">
            <Check size={14} className="ml-1" />
            نشط
          </span>
        );
      case QrStatus.INACTIVE:
        return (
          <span className="px-3 py-1.5 text-sm rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 flex items-center font-medium">
            <X size={14} className="ml-1" />
            غير نشط
          </span>
        );
      case QrStatus.COMPLETED:
        return (
          <span className="px-3 py-1.5 text-sm rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center font-medium">
            <Check size={14} className="ml-1" />
            مكتمل
          </span>
        );
      default:
        return null;
    }
  };

  // Render type badge - Dark Theme
  const renderTypeBadge = (type: QrCodeType) => {
    switch (type) {
      case QrCodeType.PERMANENT:
        return (
          <span className="px-3 py-1.5 text-sm rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
            دائم
          </span>
        );
      case QrCodeType.ONCE:
        return (
          <span className="px-3 py-1.5 text-sm rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-medium">
            مرة واحدة
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header - Dark Theme */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-700/30 border-b border-slate-700/50">
        <div className="flex items-center mb-4 md:mb-0">
          <QrCode size={24} className="ml-2 text-blue-400" />
          <h3 className="text-xl font-bold text-white">{qrCode.name}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderTypeBadge(qrCode.type)}
          {renderStatusBadge(qrCode.status)}
        </div>
      </div>

      {/* Tabs - Dark Theme */}
      <div className="border-b border-slate-700/50">
        <nav className="flex">
          <button
            className={`px-4 py-3 border-b-2 font-semibold text-sm transition-all ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
            }`}
            onClick={() => setActiveTab('details')}
          >
            تفاصيل الرمز
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-semibold text-sm transition-all ${
              activeTab === 'scans'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
            }`}
            onClick={() => setActiveTab('scans')}
          >
            عمليات المسح ({qrCode.scansCount})
          </button>
        </nav>
      </div>

      {/* Content - Dark Theme */}
      {activeTab === 'details' ? (
        <div className="p-6">
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">الوصف</h4>
              <p className="text-white">{qrCode.description || 'لا يوجد وصف'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">تاريخ الإنشاء</h4>
              <p className="text-white flex items-center">
                <Clock size={16} className="ml-1 text-slate-400" />
                {new Date(qrCode.createdAt).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>

          {/* Rewards Information - Dark Theme */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات المكافآت</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                <h4 className="text-sm font-medium text-red-400 mb-1">مكافأة 1000 نقطة</h4>
                <p className="text-2xl font-bold text-red-400">{qrCode.reward1000Count}</p>
                <p className="text-xs text-red-500 mt-1">متبقي</p>
              </div>
              
              <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/30">
                <h4 className="text-sm font-medium text-orange-400 mb-1">مكافأة 500 نقطة</h4>
                <p className="text-2xl font-bold text-orange-400">{qrCode.reward500Count}</p>
                <p className="text-xs text-orange-500 mt-1">متبقي</p>
              </div>
              
              <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30">
                <h4 className="text-sm font-medium text-yellow-400 mb-1">مكافأة 250 نقطة</h4>
                <p className="text-2xl font-bold text-yellow-400">{qrCode.reward250Count}</p>
                <p className="text-xs text-yellow-500 mt-1">متبقي</p>
              </div>
              
              <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/30">
                <h4 className="text-sm font-medium text-green-400 mb-1">مكافأة 125 نقطة</h4>
                <p className="text-2xl font-bold text-green-400">{qrCode.reward125Count}</p>
                <p className="text-xs text-green-500 mt-1">متبقي</p>
              </div>
            </div>
            
            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30 mt-4">
              <p className="text-sm text-blue-300">
                <strong>ملاحظة:</strong> بالإضافة إلى المكافآت الخاصة أعلاه، قد يحصل المستخدمون على مكافآت عشوائية بين 1-100 نقطة عند مسح الرمز.
              </p>
            </div>
          </div>

          {/* Actions - Dark Theme */}
          <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-slate-700/50">
            <button
              onClick={() => handleDownloadPdf(qrCode.id)}
              className="px-4 py-2.5 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 border border-green-500/20 transition-all flex items-center gap-2 font-medium"
            >
              <Download size={18} />
              تنزيل PDF
            </button>
            
            {qrCode.status === QrStatus.ACTIVE ? (
              <button
                onClick={() => handleDeactivate(qrCode.id)}
                className="px-4 py-2.5 bg-orange-500/10 text-orange-400 rounded-xl hover:bg-orange-500/20 border border-orange-500/20 transition-all flex items-center gap-2 font-medium"
              >
                <X size={18} />
                تعطيل
              </button>
            ) : qrCode.status === QrStatus.INACTIVE ? (
              <button
                onClick={() => handleActivate(qrCode.id)}
                className="px-4 py-2.5 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 border border-green-500/20 transition-all flex items-center gap-2 font-medium"
              >
                <Check size={18} />
                تفعيل
              </button>
            ) : null}
            
            {qrCode.scansCount > 0 ? (
              <button
                onClick={() => handleLottery(qrCode.id)}
                className="px-4 py-2.5 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 border border-purple-500/20 transition-all flex items-center gap-2 font-medium"
              >
                <Gift size={18} />
                اختيار فائز عشوائي
              </button>
            ) : (
              <button
                onClick={() => handleDelete(qrCode.id)}
                className="px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center gap-2 font-medium"
              >
                <Trash2 size={18} />
                حذف
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Scans - Dark Theme */}
          {qrCode.scans.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto mb-4 text-slate-500" />
              <h3 className="text-lg font-semibold text-white mb-1">لا توجد عمليات مسح بعد</h3>
              <p className="text-slate-400">لم يقم أي مستخدم بمسح هذا الرمز حتى الآن.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700/50">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      النقاط
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      تاريخ المسح
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
                  {qrCode.scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {scan.user?.profilePhoto ? (
                            <img
                              src={scan.user.profilePhoto}
                              alt={scan.user.name}
                              className="h-8 w-8 rounded-full ml-3"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center ml-3">
                              <User size={16} className="text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">{scan.user?.name}</div>
                            <div className="text-sm text-slate-400">{scan.user?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-sm rounded-full font-medium border ${
                          scan.points >= 500
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : scan.points >= 250
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            : scan.points >= 100
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {scan.points} نقطة
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
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