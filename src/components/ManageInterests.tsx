import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Tooltip,
  Space,
  Popconfirm,
  InputNumber,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Option } = Select;

// تعريف الأنواع
interface Interest {
  id: string;
  name: string;
  targetedGender?: "MALE" | "FEMALE" | null;
  minAge: number;
  maxAge: number;
}

const fetchInterests = async (): Promise<Interest[]> => {
  const response = await axios.get("/reel-win/api/interests/list");
  return response.data;
};

export default function ManageInterests() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [form] = Form.useForm<Interest>();

  const { data: interests, isLoading } = useQuery<Interest[]>({
    queryKey: ["interests"],
    queryFn: fetchInterests,
  });

  const addInterestMutation = useMutation({
    mutationFn: (newInterest: Omit<Interest, "id">) =>
      axios.post("/reel-win/api/interests", newInterest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      message.success({
        content: "تمت إضافة الاهتمام بنجاح",
        className: "custom-message-rtl",
      });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      console.error("Error adding interest:", error);
      message.error({
        content: "حدث خطأ أثناء إضافة الاهتمام",
        className: "custom-message-rtl",
      });
    },
  });

  const updateInterestMutation = useMutation({
    mutationFn: ({
      id,
      updatedInterest,
    }: {
      id: string;
      updatedInterest: Partial<Interest>;
    }) => axios.put(`/reel-win/api/interests/${id}`, updatedInterest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      message.success({
        content: "تم تحديث الاهتمام بنجاح",
        className: "custom-message-rtl",
      });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      console.error("Error updating interest:", error);
      message.error({
        content: "حدث خطأ أثناء تحديث الاهتمام",
        className: "custom-message-rtl",
      });
    },
  });

  const deleteInterestMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/reel-win/api/interests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      message.success({
        content: "تم حذف الاهتمام بنجاح",
        className: "custom-message-rtl",
      });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    console.log("Form values before processing:", values);

    // Normalize the values to ensure correct types
    const processedValues = {
      ...values,
      minAge:
        typeof values.minAge === "number"
          ? values.minAge
          : parseInt(values.minAge || "0"),
      maxAge:
        typeof values.maxAge === "number"
          ? values.maxAge
          : parseInt(values.maxAge || "100"),
    };

    console.log("Processed values:", processedValues);

    if (editingInterest) {
      updateInterestMutation.mutate({
        id: editingInterest.id,
        updatedInterest: processedValues,
      });
    } else {
      addInterestMutation.mutate(processedValues);
    }
  };

  const handleEdit = (interest: Interest) => {
    setEditingInterest(interest);
    form.setFieldsValue({
      name: interest.name,
      targetedGender: interest.targetedGender,
      minAge: interest.minAge,
      maxAge: interest.maxAge,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteInterestMutation.mutate(id);
  };

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-md" dir="rtl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <UsergroupAddOutlined
            style={{ marginLeft: "12px", color: "#3b82f6" }}
          />
          إدارة الاهتمامات
        </h2>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setEditingInterest(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 border-0 rounded-lg hover:from-blue-700 hover:to-indigo-800 h-10"
          size="large"
        >
          إضافة اهتمام جديد
        </Button>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg mb-6 text-blue-800 text-sm border border-blue-200 flex items-start">
        <InfoCircleOutlined style={{ marginLeft: "8px", fontSize: "16px" }} />
        <span>
          قم بإدارة الاهتمامات التي سيتم استخدامها لتصنيف المحتوى واستهداف
          المستخدمين المناسبين.
        </span>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <Table
          dataSource={interests}
          loading={isLoading}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            locale: { items_per_page: "/ صفحة" },
          }}
          locale={{
            emptyText: (
              <div className="py-8 text-center">
                <div className="text-gray-400 text-lg mb-2">لا توجد بيانات</div>
                <div className="text-gray-500">
                  لم يتم العثور على أي اهتمامات، يمكنك إضافة اهتمامات جديدة
                </div>
              </div>
            ),
          }}
          columns={[
            {
              title: "الاسم",
              dataIndex: "name",
              key: "name",
              render: (text) => (
                <span className="font-semibold text-gray-800">{text}</span>
              ),
            },
            {
              title: "الجنس المستهدف",
              dataIndex: "targetedGender",
              key: "targetedGender",
              render: (gender) => (
                <Tag color={getGenderTagColor(gender)}>
                  {getGenderDisplayText(gender)}
                </Tag>
              ),
            },
            {
              title: "العمر",
              key: "ageRange",
              render: (_, record) => (
                <div className="flex items-center">
                  <CalendarOutlined
                    style={{ color: "#6b7280", marginLeft: "6px" }}
                  />
                  <span>
                    {record.minAge} - {record.maxAge} سنة
                  </span>
                </div>
              ),
            },
            {
              title: "الإجراءات",
              key: "actions",
              align: "center",
              render: (_, record: Interest) => (
                <Space size="small">
                  <Tooltip title="تعديل">
                    <Button
                      onClick={() => handleEdit(record)}
                      icon={<EditOutlined />}
                      type="primary"
                      className="bg-blue-500 hover:bg-blue-600 border-0"
                    />
                  </Tooltip>
                  <Popconfirm
                    title="تأكيد الحذف"
                    description="هل أنت متأكد من رغبتك في حذف هذا الاهتمام؟"
                    onConfirm={() => handleDelete(record.id)}
                    okText="نعم"
                    cancelText="لا"
                    placement="topRight"
                  >
                    <Button icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </div>

      <Modal
        title={
          <div className="flex items-center text-lg font-bold text-blue-700 border-b pb-3">
            {editingInterest ? (
              <>
                <EditOutlined style={{ marginLeft: "8px" }} />
                تعديل الاهتمام
              </>
            ) : (
              <>
                <PlusCircleOutlined style={{ marginLeft: "8px" }} />
                إضافة اهتمام جديد
              </>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // Remove default footer buttons
        style={{ direction: "rtl" }}
        maskClosable={false}
        destroyOnClose
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
          validateMessages={{
            required: "${label} مطلوب",
            types: {
              number: "${label} يجب أن يكون رقماً",
            },
            number: {
              min: "${label} يجب أن يكون أكبر من أو يساوي ${min}",
              max: "${label} يجب أن يكون أقل من أو يساوي ${max}",
            },
          }}
        >
          <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
            <Input
              placeholder="أدخل اسم الاهتمام"
              className="py-2"
              maxLength={50}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="targetedGender"
            label="الجنس المستهدف"
            initialValue={null}
          >
            <Select
              placeholder="اختر الجنس المستهدف"
              className="w-full text-right"
            >
              <Option value={null}>الكل</Option>
              <Option value="MALE">ذكر</Option>
              <Option value="FEMALE">أنثى</Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="minAge"
              label="العمر الأدنى"
              rules={[{ required: true }, { type: "number", min: 0, max: 100 }]}
              initialValue={0}
              normalize={(value) => (value === "" ? 0 : Number(value))}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                controls={{
                  upIcon: (
                    <span className="ant-input-number-handler-up-inner" />
                  ),
                  downIcon: (
                    <span className="ant-input-number-handler-down-inner" />
                  ),
                }}
              />
            </Form.Item>

            <Form.Item
              name="maxAge"
              label="العمر الأقصى"
              rules={[{ required: true }, { type: "number", min: 0, max: 100 }]}
              initialValue={100}
              normalize={(value) => (value === "" ? 100 : Number(value))}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                controls={{
                  upIcon: (
                    <span className="ant-input-number-handler-up-inner" />
                  ),
                  downIcon: (
                    <span className="ant-input-number-handler-down-inner" />
                  ),
                }}
              />
            </Form.Item>
          </div>

          {/* Custom form buttons */}
          <Form.Item className="mt-6 flex justify-end">
            <Button className="ml-2" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 border-0"
              loading={
                addInterestMutation.isPending ||
                updateInterestMutation.isPending
              }
            >
              {editingInterest ? "تحديث" : "إضافة"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .custom-message-rtl {
          direction: rtl;
          text-align: right;
        }

        .ant-select-selection-item,
        .ant-select-item-option-content {
          text-align: right;
        }

        .ant-modal-close {
          right: auto;
          left: 17px;
        }

        .ant-form-item-label {
          text-align: right;
        }

        /* Fix InputNumber in RTL */
        .ant-input-number {
          direction: ltr;
        }

        .ant-input-number-handler-wrap {
          direction: ltr;
        }

        /* Add hover effects to table rows */
        .ant-table-tbody > tr.ant-table-row:hover > td {
          background-color: rgba(59, 130, 246, 0.05);
        }

        /* Improve table head styling */
        .ant-table-thead > tr > th {
          background-color: #f0f9ff;
          color: #1e40af;
          font-weight: bold;
        }

        /* Make the scrollbar pretty */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #bfdbfe;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #93c5fd;
        }
      `}</style>
    </div>
  );
}
