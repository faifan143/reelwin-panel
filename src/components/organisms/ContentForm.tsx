import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import { ContentFormData } from '@/types/content';
import { Interest } from '@/types/interests';
import { Store } from '@/types/stores';

export interface ContentFormProps {
  initialData?: Partial<ContentFormData>;
  interests: Interest[];
  stores: Store[];
  onSubmit: (data: ContentFormData) => void;
  isSubmitting?: boolean;
  submitText?: string;
  className?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({
  initialData,
  interests,
  stores,
  onSubmit,
  isSubmitting = false,
  submitText = 'حفظ',
  className = '',
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      ownerType: initialData?.ownerType || 'INDIVIDUAL',
      ownerName: initialData?.ownerName || '',
      ownerNumber: initialData?.ownerNumber || '',
      storeId: initialData?.storeId || '',
      intervalHours: initialData?.intervalHours || 24,
      endValidationDate: initialData?.endValidationDate || '',
      interestIds: initialData?.interestIds || [],
      type: 'REEL',
    },
  });

  // Watch for owner type changes
  const watchedOwnerType = watch('ownerType');

  // Handle owner type change
  const handleOwnerTypeChange = (type: 'INDIVIDUAL' | 'STORE') => {
    setValue('ownerType', type);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="title"
          label="العنوان"
          type="text"
          required
          error={errors.title?.message}
          {...register('title', {
            required: 'العنوان مطلوب',
          })}
        />

        <div className="md:col-span-2">
          <FormField
            id="description"
            label="الوصف"
            required
            error={errors.description?.message}
            as="textarea"
            rows={3}
            {...register('description', {
              required: 'الوصف مطلوب',
            })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع المالك
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="INDIVIDUAL"
                checked={watchedOwnerType === 'INDIVIDUAL'}
                onChange={() => handleOwnerTypeChange('INDIVIDUAL')}
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2">فردي</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="STORE"
                checked={watchedOwnerType === 'STORE'}
                onChange={() => handleOwnerTypeChange('STORE')}
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2">متجر</span>
            </label>
          </div>
        </div>

        {watchedOwnerType === 'STORE' && (
          <div className="md:col-span-2">
            <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">
              اختر المتجر
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="storeId"
              control={control}
              rules={{
                required: watchedOwnerType === 'STORE' ? 'يجب اختيار متجر' : false,
              }}
              render={({ field }) => {
                const storeOptions = stores?.map(store => ({
                  value: store.id,
                  label: store.name,
                })) || [];

                return (
                  <Select
                    {...field}
                    options={storeOptions}
                    placeholder="اختر المتجر"
                    isLoading={!stores}
                    value={storeOptions.find(option => option.value === field.value) || null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.value : '');
                    }}
                    className={errors.storeId ? 'border-red-500' : ''}
                    classNamePrefix="react-select"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#4f46e5',
                        primary25: '#eef2ff',
                      },
                    })}
                  />
                );
              }}
            />
            {errors.storeId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.storeId.message}
              </p>
            )}
          </div>
        )}

        {watchedOwnerType === 'INDIVIDUAL' && (
          <>
            <FormField
              id="ownerName"
              label="اسم المالك"
              type="text"
              required={watchedOwnerType === 'INDIVIDUAL'}
              error={errors.ownerName?.message}
              {...register('ownerName', {
                required: watchedOwnerType === 'INDIVIDUAL' ? 'اسم المالك مطلوب' : false,
              })}
            />

            <FormField
              id="ownerNumber"
              label="رقم الهاتف"
              type="text"
              required={watchedOwnerType === 'INDIVIDUAL'}
              error={errors.ownerNumber?.message}
              {...register('ownerNumber', {
                required: watchedOwnerType === 'INDIVIDUAL' ? 'رقم الهاتف مطلوب' : false,
                pattern: {
                  value: /^09\d{8}$/,
                  message: 'يجب أن يكون الرقم بالتنسيق السوري (09XXXXXXXX)',
                },
              })}
            />
          </>
        )}

        <FormField
          id="intervalHours"
          label="ساعات الفاصل"
          type="number"
          min={1}
          required
          error={errors.intervalHours?.message}
          {...register('intervalHours', {
            required: 'ساعات الفاصل مطلوبة',
            min: {
              value: 1,
              message: 'يجب أن تكون القيمة 1 على الأقل',
            },
          })}
        />

        <FormField
          id="endValidationDate"
          label="تاريخ انتهاء الصلاحية"
          type="datetime-local"
          required
          error={errors.endValidationDate?.message}
          {...register('endValidationDate', {
            required: 'تاريخ انتهاء الصلاحية مطلوب',
          })}
        />

        <div className="md:col-span-2">
          <label htmlFor="interestIds" className="block text-sm font-medium text-gray-700 mb-1">
            الاهتمامات
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="interestIds"
            control={control}
            rules={{ required: 'يجب اختيار اهتمام واحد على الأقل' }}
            render={({ field }) => {
              const options = interests
                ? interests.map((interest) => ({
                    value: interest.id,
                    label: interest.name,
                  }))
                : [];

              return (
                <Select
                  {...field}
                  isMulti
                  options={options}
                  classNamePrefix="react-select"
                  placeholder="اختر الاهتمامات"
                  noOptionsMessage={() => 'لا توجد خيارات متاحة'}
                  loadingMessage={() => 'جاري التحميل...'}
                  value={options.filter((option) => field.value?.includes(option.value))}
                  onChange={(selectedOptions) => {
                    field.onChange(selectedOptions.map((option) => option.value));
                  }}
                  className={errors.interestIds ? 'border-red-500' : ''}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#4f46e5',
                      primary25: '#eef2ff',
                    },
                  })}
                />
              );
            }}
          />
          {errors.interestIds && (
            <p className="mt-1 text-sm text-red-600">
              {errors.interestIds.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;