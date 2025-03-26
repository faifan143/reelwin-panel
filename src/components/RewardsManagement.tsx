import {
  DeleteOutlined,
  EditOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

// Types based on DTOs
interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  categoryId: string;
  isActive: boolean;
  category?: Category;
}

export default function RewardsManagement() {
  // States for data
  const [categories, setCategories] = useState<Category[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingRewards, setLoadingRewards] = useState(false);

  // States for modals
  const [categoryModal, setCategoryModal] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState("rewards");

  // Form instances
  const [categoryForm] = Form.useForm();
  const [rewardForm] = Form.useForm();

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchRewards();
  }, []);

  // API calls
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get("/reel-win/api/rewards/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("فشل في جلب فئات المكافآت");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchRewards = async () => {
    setLoadingRewards(true);
    try {
      const response = await axios.get("/reel-win/api/rewards");
      setRewards(response.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      message.error("فشل في جلب المكافآت");
    } finally {
      setLoadingRewards(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCategorySubmit = async (values: any) => {
    const token = localStorage.getItem("reelWinToken");

    try {
      if (editingCategory) {
        await axios.put(
          `/reel-win/api/rewards/categories/${editingCategory.id}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("تم تحديث الفئة بنجاح");
      } else {
        await axios.post("/reel-win/api/rewards/categories", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("تم إنشاء الفئة بنجاح");
      }

      setCategoryModal(false);
      fetchCategories();
      categoryForm.resetFields();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("فشل في حفظ الفئة");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRewardSubmit = async (values: any) => {
    const token = localStorage.getItem("reelWinToken");

    try {
      if (editingReward) {
        await axios.put(`/reel-win/api/rewards/${editingReward.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("تم تحديث المكافأة بنجاح");
      } else {
        await axios.post("/reel-win/api/rewards", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("تم إنشاء المكافأة بنجاح");
      }

      setRewardModal(false);
      fetchRewards();
      rewardForm.resetFields();
    } catch (error) {
      console.error("Error saving reward:", error);
      message.error("فشل في حفظ المكافأة");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const token = localStorage.getItem("reelWinToken");

    try {
      await axios.delete(`/reel-win/api/rewards/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("تم حذف الفئة بنجاح");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("فشل في حذف الفئة");
    }
  };

  const handleDeleteReward = async (id: string) => {
    const token = localStorage.getItem("reelWinToken");

    try {
      await axios.delete(`/reel-win/api/rewards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("تم حذف المكافأة بنجاح");
      fetchRewards();
    } catch (error) {
      console.error("Error deleting reward:", error);
      message.error("فشل في حذف المكافأة");
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    categoryForm.setFieldsValue({
      name: category.name,
      isActive: category.isActive,
    });
    setCategoryModal(true);
  };

  const editReward = (reward: Reward) => {
    setEditingReward(reward);
    rewardForm.setFieldsValue({
      title: reward.title,
      description: reward.description,
      pointsCost: reward.pointsCost,
      categoryId: reward.categoryId,
      isActive: reward.isActive,
    });
    setRewardModal(true);
  };

  // Table Columns
  const categoryColumns = [
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "الحالة",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">نشط</Tag>
        ) : (
          <Tag color="red">غير نشط</Tag>
        ),
    },
    {
      title: "الإجراءات",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => editCategory(record)}
            type="primary"
            size="small"
            className="bg-blue-500 border-blue-500"
          />
          <Popconfirm
            title="هل أنت متأكد من حذف هذه الفئة؟"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="نعم"
            cancelText="لا"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rewardColumns = [
    {
      title: "العنوان",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "الوصف",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: "النقاط",
      dataIndex: "pointsCost",
      key: "pointsCost",
      render: (points: number) => <Tag color="blue">{points} نقطة</Tag>,
    },
    {
      title: "الفئة",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : "غير معروف";
      },
    },
    {
      title: "الحالة",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">نشط</Tag>
        ) : (
          <Tag color="red">غير نشط</Tag>
        ),
    },
    {
      title: "الإجراءات",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Reward) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => editReward(record)}
            type="primary"
            size="small"
            className="bg-blue-500 border-blue-500"
          />
          <Popconfirm
            title="هل أنت متأكد من حذف هذه المكافأة؟"
            onConfirm={() => handleDeleteReward(record.id)}
            okText="نعم"
            cancelText="لا"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 px-8 py-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <GiftOutlined className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-white">إدارة المكافآت</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex border-b border-gray-200">
          <div
            className={`tab-button ${
              activeTab === "rewards" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("rewards")}
          >
            <GiftOutlined className="ml-2" />
            المكافآت
          </div>
          <div
            className={`tab-button ${
              activeTab === "categories" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <TagOutlined className="ml-2" />
            الفئات
          </div>
        </div>

        {activeTab === "rewards" && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-lg font-semibold">قائمة المكافآت</div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingReward(null);
                  rewardForm.resetFields();
                  setRewardModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                إضافة مكافأة جديدة
              </Button>
            </div>

            <Card className="w-full shadow-sm">
              {loadingRewards ? (
                <div className="flex justify-center items-center py-20">
                  <Spin size="large" />
                </div>
              ) : rewards.length === 0 ? (
                <Empty
                  description="لا توجد مكافآت متاحة"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Table
                  columns={rewardColumns}
                  dataSource={rewards.map((reward) => ({
                    ...reward,
                    key: reward.id,
                  }))}
                  pagination={{ pageSize: 10 }}
                  className="rtl-table"
                />
              )}
            </Card>

            <Modal
              title={
                <div className="flex items-center">
                  <GiftOutlined className="text-purple-500 ml-2" />
                  <span>
                    {editingReward ? "تعديل المكافأة" : "إضافة مكافأة جديدة"}
                  </span>
                </div>
              }
              open={rewardModal}
              onCancel={() => setRewardModal(false)}
              footer={null}
              width={600}
              destroyOnClose
            >
              <Form
                form={rewardForm}
                layout="vertical"
                onFinish={handleRewardSubmit}
                initialValues={{
                  isActive: true,
                }}
              >
                <Form.Item
                  name="title"
                  label="العنوان"
                  rules={[{ required: true, message: "العنوان مطلوب" }]}
                >
                  <Input
                    placeholder="أدخل عنوان المكافأة"
                    prefix={<InfoCircleOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="الوصف"
                  rules={[{ required: true, message: "الوصف مطلوب" }]}
                >
                  <Input.TextArea
                    placeholder="أدخل وصف تفصيلي للمكافأة"
                    rows={4}
                  />
                </Form.Item>

                <Form.Item
                  name="pointsCost"
                  label="عدد النقاط المطلوبة"
                  rules={[
                    { required: true, message: "عدد النقاط مطلوب" },
                    {
                      type: "number",
                      min: 1,
                      message: "يجب أن يكون عدد النقاط أكبر من صفر",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="أدخل عدد النقاط"
                    className="w-full"
                    addonAfter="نقطة"
                  />
                </Form.Item>

                <Form.Item
                  name="categoryId"
                  label="الفئة"
                  rules={[{ required: true, message: "الفئة مطلوبة" }]}
                >
                  <Select
                    placeholder="اختر الفئة"
                    className="w-full"
                    loading={loadingCategories}
                  >
                    {categories.map((category) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                        {!category.isActive && " (غير نشط)"}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="isActive"
                  label="الحالة"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="نشط" unCheckedChildren="غير نشط" />
                </Form.Item>

                <Form.Item className="mb-0 flex justify-end">
                  <Button
                    onClick={() => setRewardModal(false)}
                    className="ml-2"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {editingReward ? "تحديث" : "إضافة"}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}

        {activeTab === "categories" && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-lg font-semibold">فئات المكافآت</div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingCategory(null);
                  categoryForm.resetFields();
                  setCategoryModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                إضافة فئة جديدة
              </Button>
            </div>

            <Card className="w-full shadow-sm">
              {loadingCategories ? (
                <div className="flex justify-center items-center py-20">
                  <Spin size="large" />
                </div>
              ) : categories.length === 0 ? (
                <Empty
                  description="لا توجد فئات متاحة"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Table
                  columns={categoryColumns}
                  dataSource={categories.map((category) => ({
                    ...category,
                    key: category.id,
                  }))}
                  pagination={{ pageSize: 10 }}
                  className="rtl-table"
                />
              )}
            </Card>

            <Modal
              title={
                <div className="flex items-center">
                  <TagOutlined className="text-purple-500 ml-2" />
                  <span>
                    {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
                  </span>
                </div>
              }
              open={categoryModal}
              onCancel={() => setCategoryModal(false)}
              footer={null}
              width={500}
              destroyOnClose
            >
              <Form
                form={categoryForm}
                layout="vertical"
                onFinish={handleCategorySubmit}
                initialValues={{
                  isActive: true,
                }}
              >
                <Form.Item
                  name="name"
                  label="اسم الفئة"
                  rules={[{ required: true, message: "اسم الفئة مطلوب" }]}
                >
                  <Input
                    placeholder="أدخل اسم الفئة"
                    prefix={<TagOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="isActive"
                  label="الحالة"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="نشط" unCheckedChildren="غير نشط" />
                </Form.Item>

                <Form.Item className="mb-0 flex justify-end">
                  <Button
                    onClick={() => setCategoryModal(false)}
                    className="ml-2"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {editingCategory ? "تحديث" : "إضافة"}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </div>

      <style jsx global>{`
        .tab-button {
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
          min-width: 140px;
        }

        .tab-button:hover {
          color: #8b5cf6;
          background-color: rgba(139, 92, 246, 0.05);
        }

        .tab-button.active-tab {
          color: #8b5cf6;
          border-bottom-color: #8b5cf6;
          background-color: rgba(139, 92, 246, 0.1);
        }

        .rtl-table .ant-table-thead > tr > th,
        .rtl-table .ant-table-tbody > tr > td {
          text-align: right;
        }
      `}</style>
    </div>
  );
}
