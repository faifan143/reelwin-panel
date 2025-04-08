"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useStore from "@/store";

import { Plus } from "lucide-react";
import { CategoryFilters, CategoryList, CategoryForm } from "./OfferCategoryComponents";
import { PageHeader, FilterToggleButton, LoadingSpinner, EmptyState, FormModal, ConfirmDeleteModal } from "./SharedComponents";
import { CategoryFilterData, OfferCategory } from "./store.type";

export default function CategoryManagementPage() {
  const token = useStore((state) => state.token);
  const queryClient = useQueryClient();

  // State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CategoryFilterData>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch categories with filters
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["offerCategories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.name) params.append("name", filters.name);

      const response = await axios.get(
        `/reel-win/api/offer-categories?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data as OfferCategory[];
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      return axios.post(
        "/reel-win/api/offer-categories",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerCategories"] });
      setIsFormModalOpen(false);
      alert("تم إنشاء الفئة بنجاح");
    },
    onError: (error) => {
      console.error("Create category error:", error);
      alert("حدث خطأ أثناء إنشاء الفئة");
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return axios.put(
        `/reel-win/api/offer-categories/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerCategories"] });
      setIsFormModalOpen(false);
      alert("تم تحديث الفئة بنجاح");
    },
    onError: (error) => {
      console.error("Update category error:", error);
      alert("حدث خطأ أثناء تحديث الفئة");
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/reel-win/api/offer-categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerCategories"] });
      setIsDeleteModalOpen(false);
      alert("تم حذف الفئة بنجاح");
    },
    onError: (error: any) => {
      console.error("Delete category error:", error);

      // Handle conflict error (category has associated offers)
      if (error.response?.status === 409) {
        alert("لا يمكن حذف الفئة لأنها تحتوي على عروض مرتبطة بها");
      } else {
        alert("حدث خطأ أثناء حذف الفئة");
      }
    },
  });

  // Handle form submission
  const handleFormSubmit = (name: string) => {
    if (selectedCategory) {
      // Update existing category
      updateCategoryMutation.mutate({
        id: selectedCategory.id,
        name,
      });
    } else {
      // Create new category
      createCategoryMutation.mutate(name);
    }
  };

  // Handle edit button click
  const handleEditClick = (category: OfferCategory) => {
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (category: OfferCategory) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Handle add new category
  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: CategoryFilterData) => {
    setFilters(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };

  // Search with current filters
  const searchCategories = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <PageHeader
        title="إدارة فئات العروض"
        subtitle="عرض وتعديل وحذف فئات العروض في النظام"
      />

      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {categories?.length || 0} فئة
              </h2>
              <button
                onClick={handleAddNew}
                className="mr-4 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة فئة جديدة
              </button>
            </div>
            <FilterToggleButton
              showFilters={showFilters}
              toggleFilters={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <CategoryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              onSearch={searchCategories}
            />
          )}
        </div>

        {/* Categories List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <CategoryList
              categories={categories}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isMobile={isMobile}
            />
          </div>
        ) : (
          <EmptyState
            title="لا توجد فئات"
            message="لم يتم العثور على أي فئات تطابق معايير البحث."
          />
        )}
      </div>

      {/* Category Form Modal */}
      <FormModal
        isOpen={isFormModalOpen}
        title={selectedCategory ? "تعديل فئة" : "إضافة فئة جديدة"}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={() => {
          const form = document.querySelector("form");
          if (form) form.dispatchEvent(new Event("submit", { cancelable: true }));
        }}
        isPending={createCategoryMutation.isPending || updateCategoryMutation.isPending}
        submitLabel={selectedCategory ? "تحديث الفئة" : "إضافة الفئة"}
      >
        <CategoryForm
          initialData={selectedCategory || undefined}
          onSubmit={handleFormSubmit}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="تأكيد الحذف"
        itemName={selectedCategory?.name || ""}
        isDeleting={deleteCategoryMutation.isPending}
        onConfirm={() => selectedCategory && deleteCategoryMutation.mutate(selectedCategory.id)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}