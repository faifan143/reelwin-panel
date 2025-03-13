import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

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
      message.success("تمت إضافة الاهتمام بنجاح");
      setIsModalOpen(false);
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
      message.success("تم تحديث الاهتمام بنجاح");
      setIsModalOpen(false);
    },
  });

  const deleteInterestMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/reel-win/api/interests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      message.success("تم حذف الاهتمام بنجاح");
    },
  });

  const handleSubmit = (values: Omit<Interest, "id">) => {
    if (editingInterest) {
      updateInterestMutation.mutate({
        id: editingInterest.id,
        updatedInterest: values,
      });
    } else {
      addInterestMutation.mutate(values);
    }
  };

  const handleEdit = (interest: Interest) => {
    setEditingInterest(interest);
    form.setFieldsValue(interest);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteInterestMutation.mutate(id);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditingInterest(null);
          form.resetFields();
          setIsModalOpen(true);
        }}
      >
        إضافة اهتمام
      </Button>

      <Table
        dataSource={interests}
        loading={isLoading}
        rowKey="id"
        columns={[
          { title: "الاسم", dataIndex: "name", key: "name" },
          {
            title: "الجنس المستهدف",
            dataIndex: "targetedGender",
            key: "targetedGender",
          },
          { title: "العمر الأدنى", dataIndex: "minAge", key: "minAge" },
          { title: "العمر الأقصى", dataIndex: "maxAge", key: "maxAge" },
          {
            title: "الإجراءات",
            render: (_, record: Interest) => (
              <>
                <Button
                  onClick={() => handleEdit(record)}
                  style={{ marginRight: 8 }}
                >
                  تعديل
                </Button>
                <Button onClick={() => handleDelete(record.id)} danger>
                  حذف
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingInterest ? "تعديل الاهتمام" : "إضافة اهتمام"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="الاسم"
            rules={[{ required: true, message: "الاسم مطلوب" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="targetedGender" label="الجنس المستهدف">
            <Select>
              <Option value="MALE">ذكر</Option>
              <Option value="FEMALE">أنثى</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="minAge"
            label="العمر الأدنى"
            rules={[{ required: true, message: "العمر الأدنى مطلوب" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="maxAge"
            label="العمر الأقصى"
            rules={[{ required: true, message: "العمر الأقصى مطلوب" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
