/* eslint-disable @typescript-eslint/no-explicit-any */
// InterestTableView.tsx
import React from "react";
import { Table, Tag, Tooltip, Space, Popconfirm } from "antd";
import { Edit, Trash2, Calendar } from "lucide-react";
import { Interest } from "./types";

interface InterestTableViewProps {
  interests: Interest[] | undefined;
  onEdit: (interest: Interest) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const InterestTableView: React.FC<InterestTableViewProps> = ({
  interests,
  onEdit,
  onDelete,
  isLoading,
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

  const columns = [
    {
      title: <span className="text-slate-200 font-semibold">الاسم</span>,
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-white">{text}</span>
      ),
    },
    {
      title: <span className="text-slate-200 font-semibold">الجنس المستهدف</span>,
      dataIndex: "targetedGender",
      key: "targetedGender",
      render: (gender: string | null | undefined) => (
        <Tag color={getGenderTagColor(gender)}>
          {getGenderDisplayText(gender)}
        </Tag>
      ),
    },
    {
      title: <span className="text-slate-200 font-semibold">العمر</span>,
      key: "ageRange",
      render: (_: any, record: Interest) => (
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>
            {record.minAge} - {record.maxAge} سنة
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-slate-200 font-semibold">الإجراءات</span>,
      key: "actions",
      align: "center" as const,
      render: (_: any, record: Interest) => (
        <Space size="middle">
          <Tooltip title="تعديل">
            <button
              onClick={() => onEdit(record)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 font-medium"
            >
              <Edit className="w-5 h-5" />
              <span className="text-sm">تعديل</span>
            </button>
          </Tooltip>
          <Popconfirm
            title={<span className="text-white">تأكيد الحذف</span>}
            description={<span className="text-slate-300">هل أنت متأكد من رغبتك في حذف هذا الاهتمام؟</span>}
            onConfirm={() => onDelete(record.id)}
            okText="نعم"
            cancelText="لا"
            placement="topRight"
            overlayClassName="dark-popconfirm"
          >
            <Tooltip title="حذف">
              <button
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 flex items-center justify-center gap-2 font-medium"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm">حذف</span>
              </button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={interests}
      loading={isLoading}
      rowKey="id"
      className="dark-table"
      pagination={{
        position: ["bottomCenter"],
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        locale: { items_per_page: "/ صفحة" },
        className: "dark-pagination",
      }}
      locale={{
        emptyText: (
          <div className="py-12 text-center">
            <div className="text-slate-400 text-lg font-semibold mb-2">لا توجد بيانات</div>
            <div className="text-slate-500">
              لم يتم العثور على أي اهتمامات، يمكنك إضافة اهتمامات جديدة
            </div>
          </div>
        ),
      }}
      columns={columns}
    />
  );
};

export default InterestTableView;
