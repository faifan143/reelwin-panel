/* eslint-disable @typescript-eslint/no-explicit-any */
// RewardsManagement.tsx
import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import axios from "axios";
import { GiftOutlined, TagOutlined } from "@ant-design/icons";

// Components
import Header from "./rewards/Header";
import TabButton from "./rewards/TabButton";
import CategoryTable from "./rewards/CategoryTable";
import RewardTable from "./rewards/RewardTable";
import SectionHeader from "./rewards/SectionHeader";
import CategoryFormModal from "./rewards/CategoryFormModal";
import GlobalStyles from "./rewards/GlobalStyles";

// Types
import { Category, Reward } from "./rewards/types";
import RewardFormModal from "./rewards/RewardFormModal";
import useStore from "@/store";

const RewardsManagement: React.FC = () => {
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

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Form instances
  const [categoryForm] = Form.useForm();
  const [rewardForm] = Form.useForm();

  const token = useStore((state) => state.token);

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

  const handleCategorySubmit = async (values: any) => {
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

  const addNewCategory = () => {
    setEditingCategory(null);
    categoryForm.resetFields();
    setCategoryModal(true);
  };

  const addNewReward = () => {
    setEditingReward(null);
    rewardForm.resetFields();
    setRewardModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 max-w-6xl mx-auto">
      {/* Header */}
      <Header />

      <div className="p-4 sm:p-6">
        {/* Tabs */}
        <div className="mb-4 sm:mb-6 flex border-b border-gray-200">
          <TabButton
            active={activeTab === "rewards"}
            icon={<GiftOutlined />}
            label="المكافآت"
            onClick={() => setActiveTab("rewards")}
          />
          <TabButton
            active={activeTab === "categories"}
            icon={<TagOutlined />}
            label="الفئات"
            onClick={() => setActiveTab("categories")}
          />
        </div>

        {/* Rewards Tab Content */}
        {activeTab === "rewards" && (
          <>
            <SectionHeader
              title="قائمة المكافآت"
              addButtonLabel="إضافة مكافأة جديدة"
              onClick={addNewReward}
              isMobile={isMobile}
            />

            <RewardTable
              rewards={rewards}
              categories={categories}
              loading={loadingRewards}
              onEdit={editReward}
              onDelete={handleDeleteReward}
              isMobile={isMobile}
            />

            <RewardFormModal
              visible={rewardModal}
              onCancel={() => setRewardModal(false)}
              onSubmit={handleRewardSubmit}
              editingReward={editingReward}
              form={rewardForm}
              categories={categories}
              loadingCategories={loadingCategories}
              isMobile={isMobile}
            />
          </>
        )}

        {/* Categories Tab Content */}
        {activeTab === "categories" && (
          <>
            <SectionHeader
              title="فئات المكافآت"
              addButtonLabel="إضافة فئة جديدة"
              onClick={addNewCategory}
              isMobile={isMobile}
            />

            <CategoryTable
              categories={categories}
              loading={loadingCategories}
              onEdit={editCategory}
              onDelete={handleDeleteCategory}
              isMobile={isMobile}
            />

            <CategoryFormModal
              visible={categoryModal}
              onCancel={() => setCategoryModal(false)}
              onSubmit={handleCategorySubmit}
              editingCategory={editingCategory}
              form={categoryForm}
              isMobile={isMobile}
            />
          </>
        )}
      </div>

      {/* Global Styles */}
      <GlobalStyles />
    </div>
  );
};

export default RewardsManagement;
