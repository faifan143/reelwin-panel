"use client";
import useStore from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, FilterToggleButton, LoadingSpinner, EmptyState, FormModal, ConfirmDeleteModal } from "./SharedComponents";
import { StoreFilterData, Store, StoreFormData } from "./store.type";
import { StoreFilters, StoresList, StoreForm } from "./StoreManagment";

export default function StoreManagementPage() {
  const token = useStore((state) => state.token);
  const queryClient = useQueryClient();

  // State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<StoreFilterData>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
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

  // Fetch stores with filters
  const {
    data: stores,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["stores", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.name) params.append("name", filters.name);
      if (filters.city) params.append("city", filters.city);

      const response = await axios.get(
        `/reel-win/api/stores?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data as Store[];
    },
  });

  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: StoreFormData;
      file: File | null;
    }) => {
      const formData = new FormData();

      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append file if exists
      if (file) {
        formData.append("image", file);
      }

      return axios.post("/reel-win/api/stores", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setIsFormModalOpen(false);
      alert("تم إنشاء المتجر بنجاح");
    },
    onError: (error) => {
      console.error("Create store error:", error);
      alert("حدث خطأ أثناء إنشاء المتجر");
    },
  });

  // Update store mutation
  const updateStoreMutation = useMutation({
    mutationFn: async ({
      id,
      data,
      file,
    }: {
      id: string;
      data: StoreFormData;
      file: File | null;
    }) => {
      const formData = new FormData();

      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append file if exists
      if (file) {
        formData.append("image", file);
      }

      return axios.put(`/reel-win/api/stores/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setIsFormModalOpen(false);
      alert("تم تحديث المتجر بنجاح");
    },
    onError: (error) => {
      console.error("Update store error:", error);
      alert("حدث خطأ أثناء تحديث المتجر");
    },
  });

  // Delete store mutation
  const deleteStoreMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/reel-win/api/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setIsDeleteModalOpen(false);
      alert("تم حذف المتجر بنجاح");
    },
    onError: (error: any) => {
      console.error("Delete store error:", error);

      // Handle conflict error (store has associated offers/content)
      if (error.response?.status === 409) {
        alert("لا يمكن حذف المتجر لأنه يحتوي على عروض أو محتوى مرتبط به");
      } else {
        alert("حدث خطأ أثناء حذف المتجر");
      }
    },
  });

  // Handle form submission
  const handleFormSubmit = (data: StoreFormData, file: File | null) => {
    if (selectedStore) {
      // Update existing store
      updateStoreMutation.mutate({
        id: selectedStore.id,
        data,
        file,
      });
    } else {
      // Create new store
      createStoreMutation.mutate({ data, file });
    }
  };

  // Handle edit button click
  const handleEditClick = (store: Store) => {
    setSelectedStore(store);
    setIsFormModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (store: Store) => {
    setSelectedStore(store);
    setIsDeleteModalOpen(true);
  };

  // Handle add new store
  const handleAddNew = () => {
    setSelectedStore(null);
    setIsFormModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: StoreFilterData) => {
    setFilters(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };

  // Search with current filters
  const searchStores = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">


      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {stores?.length || 0} متجر
              </h2>
              <button
                onClick={handleAddNew}
                className="mr-4 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة متجر جديد
              </button>
            </div>
            <FilterToggleButton
              showFilters={showFilters}
              toggleFilters={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <StoreFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              onSearch={searchStores}
            />
          )}
        </div>

        {/* Stores List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.
          </div>
        ) : stores && stores.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <StoresList
              stores={stores}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isMobile={isMobile}
            />
          </div>
        ) : (
          <EmptyState
            title="لا توجد متاجر"
            message="لم يتم العثور على أي متاجر تطابق معايير البحث."
          />
        )}
      </div>

      {/* Store Form Modal */}
      <FormModal
        isOpen={isFormModalOpen}
        title={selectedStore ? "تعديل متجر" : "إضافة متجر جديد"}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={() => { }} // Form has its own submit handling
        isPending={createStoreMutation.isPending || updateStoreMutation.isPending}
        submitLabel={selectedStore ? "تحديث المتجر" : "إضافة المتجر"}
      >
        <StoreForm
          initialData={selectedStore || undefined}
          onSubmit={handleFormSubmit}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="تأكيد الحذف"
        itemName={selectedStore?.name || ""}
        isDeleting={deleteStoreMutation.isPending}
        onConfirm={() => selectedStore && deleteStoreMutation.mutate(selectedStore.id)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}