import React, { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import Button from '../atoms/Button';
import useStore from '@/store';

export interface DashboardTemplateProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const logout = useStore((state) => state.logout);
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="mt-2 text-blue-100">{subtitle}</p>}
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-blue-600"
            leftIcon={<LogOut className="h-5 w-5" />}
            onClick={handleLogout}
          >
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {action && (
          <div className="flex justify-end mb-4">
            {action}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default DashboardTemplate;