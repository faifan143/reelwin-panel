import { FormSectionProps } from "./type";

export const FormSection = ({
  title,
  icon,
  bgColor,
  children,
}: FormSectionProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-colors">
    <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4 border-b pb-3">
      <div className={`${bgColor} p-2 rounded-lg mx-3`}>{icon}</div>
      {title}
    </h4>
    {children}
  </div>
);
