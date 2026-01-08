import { FormSectionProps } from "./type";

export const FormSection = ({
  title,
  icon,
  bgColor,
  children,
}: FormSectionProps) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
    <h4 className="flex items-center text-xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
      <div className={`${bgColor} p-3 rounded-xl mx-3 shadow-lg`}>{icon}</div>
      {title}
    </h4>
    {children}
  </div>
);
