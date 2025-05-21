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
        {/* Basic Information */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
          <div className="flex items-center text-blue-800 mb-2">
            <Info size={18} className="ml-2" />
            <span className="font-semibold">معلومات الرمز الأساسية</span>
          </div>
          <p className="text-sm text-blue-700">
            رموز QR تسمح للمستخدمين بمسح الرمز للحصول على نقاط. يمكن إنشاء رموز QR دائمة (يمكن مسحها من قبل مستخدمين متعددين) أو لمرة واحدة (يمكن مسحها مرة واحدة فقط).
          </p>
        </div>

        {/* Name & Description */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'الاسم مطلوب' })}
            className={`w-full px-3 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="أدخل اسم الرمز"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="ml-1" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            الوصف
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل وصفاً اختيارياً للرمز"
          />
        </div>

        {/* QR Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع الرمز <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-lg ${
              watchType === QrCodeType.PERMANENT
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-300 hover:bg-gray-50'
            } cursor-pointer transition-all duration-200`}>
              <input
                type="radio"
                {...register('type')}
                value={QrCodeType.PERMANENT}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <QrCodeIcon size={24} className={`mb-2 ${
                  watchType === QrCodeType.PERMANENT ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <span className="text-center font-medium">دائم</span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  يمكن مسحه بواسطة مستخدمين متعددين
                </span>
              </div>
            </label>

            <label className={`flex items-center justify-center p-4 border rounded-lg ${
              watchType === QrCodeType.ONCE
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                : 'border-gray-300 hover:bg-gray-50'
            } cursor-pointer transition-all duration-200`}>
              <input
                type="radio"
                {...register('type')}
                value={QrCodeType.ONCE}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <Package size={24} className={`mb-2 ${
                  watchType === QrCodeType.ONCE ? 'text-purple-600' : 'text-gray-500'
                }`} />
                <span className="text-center font-medium">مرة واحدة</span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  يمكن مسحه مرة واحدة فقط
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Rewards Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات المكافآت</h3>
          <p className="text-sm text-gray-500 mb-4">
            حدد عدد المكافآت الخاصة المتاحة لهذا الرمز. عند مسح الرمز، سيحصل المستخدم على مكافأة عشوائية بناءً على الاحتمالات والتوافر.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reward1000Count" className="block text-sm font-medium text-gray-700 mb-1">
                عدد مكافآت 1000 نقطة
              </label>
              <input
                id="reward1000Count"
                type="number"
                min="0"
                {...register('reward1000Count', { min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                مكافأة نادرة جداً (0.5% احتمالية)
              </p>
            </div>
            
            <div>
              <label htmlFor="reward500Count" className="block text-sm font-medium text-gray-700 mb-1">
                عدد مكافآت 500 نقطة
              </label>
              <input
                id="reward500Count"
                type="number"
                min="0"
                {...register('reward500Count', { min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                مكافأة نادرة (1.5% احتمالية)
              </p>
            </div>
            
            <div>
              <label htmlFor="reward250Count" className="block text-sm font-medium text-gray-700 mb-1">
                عدد مكافآت 250 نقطة
              </label>
              <input
                id="reward250Count"
                type="number"
                min="0"
                {...register('reward250Count', { min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                مكافأة غير شائعة (3% احتمالية)
              </p>
            </div>
            
            <div>
              <label htmlFor="reward125Count" className="block text-sm font-medium text-gray-700 mb-1">
                عدد مكافآت 125 نقطة
              </label>
              <input
                id="reward125Count"
                type="number"
                min="0"
                {...register('reward125Count', { min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                مكافأة غير مألوفة (5% احتمالية)
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>ملاحظة:</strong> بالإضافة إلى المكافآت الخاصة أعلاه، سيحصل المستخدمون على مكافآت عشوائية بين 1-100 نقطة عند مسح الرمز.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            {mutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 ml-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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