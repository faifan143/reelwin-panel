import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QrCodeType, CreateQrCodeDto } from '../../types';
import { createQrCode } from '../../api';
import { Info, AlertCircle, Package, QrCode as QrCodeIcon } from 'lucide-react';

interface QrCodeFormProps {
  onClose: () => void;
}

const QrCodeForm: React.FC<QrCodeFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<CreateQrCodeDto>({
    defaultValues: {
      name: '',
      description: '',
      type: QrCodeType.PERMANENT,
      reward1000Count: 0,
      reward500Count: 0,
      reward250Count: 0,
      reward125Count: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateQrCodeDto) => createQrCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrCodes'] });
      onClose();
    },
  });

  const onSubmit = (data: CreateQrCodeDto) => {
    mutation.mutate(data);
  };

  const watchType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Basic Information - Dark Theme */}
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30 mb-6">
          <div className="flex items-center text-blue-400 mb-2">
            <Info size={18} className="ml-2" />
            <span className="font-semibold">معلومات الرمز الأساسية</span>
          </div>
          <p className="text-sm text-blue-300">
            رموز QR تسمح للمستخدمين بمسح الرمز للحصول على نقاط. يمكن إنشاء رموز QR دائمة (يمكن مسحها من قبل مستخدمين متعددين) أو لمرة واحدة (يمكن مسحها مرة واحدة فقط).
          </p>
        </div>

        {/* Name & Description - Dark Theme */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
            الاسم <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'الاسم مطلوب' })}
            className={`w-full px-4 py-3 bg-slate-700/50 border ${
              errors.name ? 'border-red-500' : 'border-slate-600/50'
            } rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="أدخل اسم الرمز"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <AlertCircle size={14} className="ml-1" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-2">
            الوصف
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="أدخل وصفاً اختيارياً للرمز"
          />
        </div>

        {/* QR Type - Dark Theme */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            نوع الرمز <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-xl ${
              watchType === QrCodeType.PERMANENT
                ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30'
                : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
            } cursor-pointer transition-all duration-200`}>
              <input
                type="radio"
                {...register('type')}
                value={QrCodeType.PERMANENT}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <QrCodeIcon size={24} className={`mb-2 ${
                  watchType === QrCodeType.PERMANENT ? 'text-blue-400' : 'text-slate-400'
                }`} />
                <span className="text-center font-medium text-white">دائم</span>
                <span className="text-xs text-slate-400 text-center mt-1">
                  يمكن مسحه بواسطة مستخدمين متعددين
                </span>
              </div>
            </label>

            <label className={`flex items-center justify-center p-4 border rounded-xl ${
              watchType === QrCodeType.ONCE
                ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/30'
                : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
            } cursor-pointer transition-all duration-200`}>
              <input
                type="radio"
                {...register('type')}
                value={QrCodeType.ONCE}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <Package size={24} className={`mb-2 ${
                  watchType === QrCodeType.ONCE ? 'text-purple-400' : 'text-slate-400'
                }`} />
                <span className="text-center font-medium text-white">مرة واحدة</span>
                <span className="text-xs text-slate-400 text-center mt-1">
                  يمكن مسحه مرة واحدة فقط
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Rewards Settings - Dark Theme */}
        <div className="border-t border-slate-700/50 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">إعدادات المكافآت</h3>
          <p className="text-sm text-slate-400 mb-4">
            حدد عدد المكافآت الخاصة المتاحة لهذا الرمز. عند مسح الرمز، سيحصل المستخدم على مكافأة عشوائية بناءً على الاحتمالات والتوافر.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reward1000Count" className="block text-sm font-medium text-slate-200 mb-2">
                عدد مكافآت 1000 نقطة
              </label>
              <input
                id="reward1000Count"
                type="number"
                min="0"
                {...register('reward1000Count', { min: 0 })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                مكافأة نادرة جداً (0.5% احتمالية)
              </p>
            </div>
            
            <div>
              <label htmlFor="reward500Count" className="block text-sm font-medium text-slate-200 mb-2">
                عدد مكافآت 500 نقطة
              </label>
              <input
                id="reward500Count"
                type="number"
                min="0"
                {...register('reward500Count', { min: 0 })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                مكافأة نادرة (1.5% احتمالية)
              </p>
            </div>
            
            <div>
              <label htmlFor="reward250Count" className="block text-sm font-medium text-slate-200 mb-2">
                عدد مكافآت 250 نقطة
              </label>
              <input
                id="reward250Count"
                type="number"
                min="0"
                {...register('reward250Count', { min: 0 })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                مكافأة غير شائعة (3% احتمالية)
              </p>
            </div>
            
            <div>
              <label htmlFor="reward125Count" className="block text-sm font-medium text-slate-200 mb-2">
                عدد مكافآت 125 نقطة
              </label>
              <input
                id="reward125Count"
                type="number"
                min="0"
                {...register('reward125Count', { min: 0 })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                مكافأة غير مألوفة (5% احتمالية)
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-4">
            <p className="text-sm text-yellow-400">
              <strong>ملاحظة:</strong> بالإضافة إلى المكافآت الخاصة أعلاه، سيحصل المستخدمون على مكافآت عشوائية بين 1-100 نقطة عند مسح الرمز.
            </p>
          </div>
        </div>

        {/* Submit Button - Dark Theme */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-700/50 text-slate-200 rounded-xl hover:bg-slate-700/70 border border-slate-600/50 transition-all font-medium"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2 font-semibold disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الإنشاء...
              </>
            ) : (
              'إنشاء الرمز'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default QrCodeForm;