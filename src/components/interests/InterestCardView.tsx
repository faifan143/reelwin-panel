// InterestCardView.tsx
import { Card, Popconfirm, Space, Tag, Tooltip } from "antd";
import { Calendar, Edit, Trash2 } from "lucide-react";
import React from "react";
import { Interest } from "./types";

interface InterestCardViewProps {
  interests: Interest[] | undefined;
  onEdit: (interest: Interest) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean; // Made optional to avoid the warning
}

const InterestCardView: React.FC<InterestCardViewProps> = ({
  interests,
  onEdit,
  onDelete,
}) => {
  const getGenderDisplayText = (gender: string | null | undefined) => {
    if (gender === "MALE") return "ذكر";
    if (gender === "FEMALE") return "أنثى";
    return "الكل";
  };

  const getGenderTagColor = (gender: string | null | undefined) => {
    if (gender === "MALE") return "blue";
    if (gender === "FEMALE") return "magenta";
    return "default";
  };

  if (!interests || interests.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-slate-400 text-lg font-semibold mb-2">لا توجد بيانات</div>
        <div className="text-slate-500">
          لم يتم العثور على أي اهتمامات، يمكنك إضافة اهتمامات جديدة
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {interests.map((interest) => (
        <Card
          key={interest.id}
          className="w-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          styles={{ body: { padding: "16px" } }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3 text-white">
                {interest.name}
              </h3>

              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Tag
                  color={getGenderTagColor(interest.targetedGender)}
                  className="rounded-lg"
                >
                  {getGenderDisplayText(interest.targetedGender)}
                </Tag>

                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">
                    {interest.minAge} - {interest.maxAge} سنة
                  </span>
                </div>
              </div>
            </div>

            <Space direction="vertical" size="middle">
              <Tooltip title="تعديل">
                <button
                  onClick={() => onEdit(interest)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 font-medium w-full min-w-[120px]"
                >
                  <Edit className="w-5 h-5" />
                  <span className="text-sm">تعديل</span>
                </button>
              </Tooltip>
              <Popconfirm
                title={<span className="text-white">تأكيد الحذف</span>}
                description={<span className="text-slate-300">هل أنت متأكد من رغبتك في حذف هذا الاهتمام؟</span>}
                onConfirm={() => onDelete(interest.id)}
                okText="نعم"
                cancelText="لا"
                placement="left"
                overlayClassName="dark-popconfirm"
              >
                <Tooltip title="حذف">
                  <button
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 flex items-center justify-center gap-2 font-medium w-full min-w-[120px]"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm">حذف</span>
                  </button>
                </Tooltip>
              </Popconfirm>
            </Space>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InterestCardView;
