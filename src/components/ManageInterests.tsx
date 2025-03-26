/* eslint-disable @typescript-eslint/no-explicit-any */
// ManageInterests.tsx
import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Components
import InterestTableView from "./interests/InterestTableView";
import InterestCardView from "./interests/InterestCardView";
import InterestFormModal from "./interests/InterestFormModal";
import Header from "./interests/Header";
import GlobalStyles from "./interests/GlobalStyles";

// Types
import { Interest } from "./interests/types";

// API functions
const fetchInterests = async (): Promise<Interest[]> => {
  const response = await axios.get("/reel-win/api/interests");
  return response.data;
};

const ManageInterests: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [form] = Form.useForm<Interest>();
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    onError: (error) => {
      console.error("Error deleting interest:", error);
      message.error({
        content: "حدث خطأ أثناء حذف الاهتمام",
        className: "custom-message-rtl",
      });
    },
  });

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

  const handleAddNew = () => {
    setEditingInterest(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  return (
    <div
      className="bg-white p-4 sm:p-6 rounded-xl shadow-md max-w-6xl mx-auto"
      dir="rtl"
    >
      {/* Header and info */}
      <Header onAdd={handleAddNew} isMobile={isMobile} />

      {/* Content Area - Table or Cards based on device */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        {isMobile ? (
          <InterestCardView
            interests={interests}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        ) : (
          <InterestTableView
            interests={interests}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Modal Form */}
      <InterestFormModal
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingInterest={editingInterest}
        form={form}
        isPending={
          addInterestMutation.isPending || updateInterestMutation.isPending
        }
        isMobile={isMobile}
      />

      {/* Global Styles */}
      <GlobalStyles />
    </div>
  );
};

export default ManageInterests;
