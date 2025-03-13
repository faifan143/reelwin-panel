import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

const { Option } = Select;

const fetchInterests = async () => {
  const response = await axios.get("/reel-win/api/interests/list");
  return response.data;
};

export default function ManageInterests() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState(null);
  const [form] = Form.useForm();

  const { data: interests, isLoading } = useQuery({
    queryKey: ["interests"],
    queryFn: fetchInterests,
  });

  const addInterestMutation = useMutation({
    mutationFn: (newInterest) => axios.post("/reel-win/api/interests", newInterest),
    onSuccess: () => {
      queryClient.invalidateQueries(["interests"]);
      message.success("Interest added successfully");
      setIsModalOpen(false);
    },
  });

  const updateInterestMutation = useMutation({
    mutationFn: ({ id, updatedInterest }) => axios.put(`/reel-win/api/interests/${id}`, updatedInterest),
    onSuccess: () => {
      queryClient.invalidateQueries(["interests"]);
      message.success("Interest updated successfully");
      setIsModalOpen(false);
    },
  });

  const deleteInterestMutation = useMutation({
    mutationFn: (id) => axios.delete(`/reel-win/api/interests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["interests"]);
      message.success("Interest deleted successfully");
    },
  });

  const handleSubmit = (values) => {
    if (editingInterest) {
      updateInterestMutation.mutate({ id: editingInterest.id, updatedInterest: values });
    } else {
      addInterestMutation.mutate(values);
    }
  };

  const handleEdit = (interest) => {
    setEditingInterest(interest);
    form.setFieldsValue(interest);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteInterestMutation.mutate(id);
  };

  return (
    <div>
      <Button type="primary" onClick={() => { setEditingInterest(null); form.resetFields(); setIsModalOpen(true); }}>
        Add Interest
      </Button>

      <Table
        dataSource={interests}
        loading={isLoading}
        rowKey="id"
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          { title: "Targeted Gender", dataIndex: "targetedGender", key: "targetedGender" },
          { title: "Min Age", dataIndex: "minAge", key: "minAge" },
          { title: "Max Age", dataIndex: "maxAge", key: "maxAge" },
          {
            title: "Actions",
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
                <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingInterest ? "Edit Interest" : "Add Interest"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="targetedGender" label="Targeted Gender"> 
            <Select>
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item name="minAge" label="Min Age" rules={[{ required: true, message: "Min age is required" }]}> 
            <Input type="number" />
          </Form.Item>
          <Form.Item name="maxAge" label="Max Age" rules={[{ required: true, message: "Max age is required" }]}> 
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}