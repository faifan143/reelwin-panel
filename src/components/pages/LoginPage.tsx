import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import { message } from 'antd';
import useStore from '@/store';
import AuthTemplate from '../templates/AuthTemplate';
import { login } from '@/services/auth';
import { LoginFormData } from '@/types/auth';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const storeLogin = useStore((state) => state.login);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      phone: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    
    try {
      // Make an API call to authenticate the user
      const response = await login(data);
      
      // Get the token from the response
      const token = response.token;
      
      // Store the token in Zustand state
      storeLogin(token);
      
      // Success message
      message.success('تم تسجيل الدخول بنجاح');
    } catch (error) {
      console.error('Login error:', error);
      message.error('خطأ في تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthTemplate title="تسجيل الدخول">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          id="phone"
          label="رقم الهاتف"
          type="text"
          required
          leftIcon={<UserOutlined className="text-gray-400" />}
          placeholder="09XXXXXXXX"
          error={errors.phone?.message}
          {...register('phone', {
            required: 'الرجاء إدخال رقم الهاتف',
            pattern: {
              value: /^09\d{8}$/,
              message: 'يجب أن يكون الرقم بالتنسيق السوري (09XXXXXXXX)',
            },
          })}
        />
        
        <FormField
          id="password"
          label="كلمة المرور"
          type="password"
          required
          leftIcon={<LockOutlined className="text-gray-400" />}
          placeholder="كلمة المرور"
          error={errors.password?.message}
          {...register('password', {
            required: 'الرجاء إدخال كلمة المرور',
          })}
        />
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          fullWidth
          className="h-12 text-lg"
        >
          تسجيل الدخول
        </Button>
      </form>
    </AuthTemplate>
  );
};

export default LoginPage;