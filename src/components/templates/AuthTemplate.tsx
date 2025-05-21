import React, { ReactNode } from 'react';
import Card from '../atoms/Card';

export interface AuthTemplateProps {
  children: ReactNode;
  title: string;
  logo?: ReactNode;
  subtitle?: string;
  footer?: ReactNode;
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title,
  logo,
  subtitle,
  footer,
}) => {
  const defaultLogo = (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-8 px-6 text-center">
      <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-white text-3xl font-bold">R</span>
      </div>
      <h1 className="text-2xl font-bold text-white">Radar</h1>
      <p className="text-blue-200 mt-2">لوحة الإدارة</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card
        className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden border-0"
      >
        {logo || defaultLogo}
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {title}
          </h2>
          
          {subtitle && <p className="text-gray-600 mb-6 text-center">{subtitle}</p>}
          
          {children}
          
          {footer && (
            <div className="text-center mt-6">
              {footer}
            </div>
          )}
          
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              © Radar {new Date().getFullYear()} - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthTemplate;