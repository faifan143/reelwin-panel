"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useStore from "@/store";

import { Plus } from "lucide-react";
import { PageHeader, FilterToggleButton, LoadingSpinner, EmptyState, FormModal, ConfirmDeleteModal, Pagination } from "./SharedComponents";
import { OfferFilterData, Offer, OfferCategory, Store, OfferFormData } from "./store.type";
import { OfferFilters, OfferForm, OffersList } from "./OfferManagmentComponents";

export default function OfferManagementPage() {
  const token = useStore((state) => state.token);
  const queryClient = useQueryClient();

  // State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OfferFilterData>({
    page: 1,
    limit: 10,
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
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

  // Fetch offers with filters
  const {
    data: offersResponse,
    isLoading: offersLoading,
    isError: offersError,
    refetch: refetchOffers,
  } = useQuery({
    queryKey: ["offers", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `/reel-win/api/offers?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
  });

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["offerCategories"],
    queryFn: async () => {
      const response = await axios.get("/reel-win/api/offer-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as OfferCategory[];
    },
  });

  // Fetch stores
  const {
    data: stores,
    isLoading: storesLoading,
  } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axios.get("/reel-win/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as Store[];
    },
  });

  // Create offer mutation
  const createOfferMutation = useMutation({
    mutationFn: async ({
      data,
      files,
    }: {
      data: OfferFormData;
      files: File[];
    }) => {
      const formData = new FormData();

      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "isActive") {
            formData.append(key, value ? "true" : "false");
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Append files
      files.forEach((file) => {
        formData.append("images", file);
      });

      return axios.post("/reel-win/api/offers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setIsFormModalOpen(false);
      alert("تم إنشاء العرض بنجاح");
    },
    onError: (error) => {
      console.error("Create offer error:", error);
      alert("حدث خطأ أثناء إنشاء العرض");
    },
  });

  // Update offer mutation
  const updateOfferMutation = useMutation({
    mutationFn: async ({
      id,
      data,
      files,
    }: {
      id: string;
      data: OfferFormData & { existingImages?: string[] };
      files: File[];
    }) => {
      const formData = new FormData();

      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== "existingImages") {
          if (key === "isActive") {
            formData.append(key, value ? "true" : "false");
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Append existing images if available
      if (data.existingImages) {
        formData.append("images", JSON.stringify(data.existingImages));
      }

      // Append new files
      files.forEach((file) => {
        formData.append("images", file);
      });

      return axios.put(`/reel-win/api/offers/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setIsFormModalOpen(false);
      alert("تم تحديث العرض بنجاح");
    },
    onError: (error) => {
      console.error("Update offer error:", error);
      alert("حدث خطأ أثناء تحديث العرض");
    },
  });

  // Delete offer mutation
  const deleteOfferMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`/reel-win/api/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setIsDeleteModalOpen(false);
      alert("تم حذف العرض بنجاح");
    },
    onError: (error) => {
      console.error("Delete offer error:", error);
      alert("حدث خطأ أثناء حذف العرض");
    },
  });

  // Handle form submission
  const handleFormSubmit = (data: OfferFormData, files: File[]) => {
    if (selectedOffer) {
      // Update existing offer
      updateOfferMutation.mutate({
        id: selectedOffer.id,
        data: data as OfferFormData & { existingImages?: string[] },
        files,
      });
    } else {
      // Create new offer
      createOfferMutation.mutate({ data, files });
    }
  };

  // Handle edit button click
  const handleEditClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsFormModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDeleteModalOpen(true);
  };

  // Handle add new offer
  const handleAddNew = () => {
    setSelectedOffer(null);
    setIsFormModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: OfferFilterData) => {
    setFilters({ ...filters, ...newFilters, page: 1 }); // Reset to first page on filter change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  // Search with current filters
  const searchOffers = () => {
    refetchOffers();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  // Extract pagination data
  const {
    data: offers = [],
    meta = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    }
  } = offersResponse || { data: [], meta: {} };

  // Calculate pagination indices
  const startIndex = (meta.currentPage - 1) * meta.itemsPerPage;
  const endIndex = startIndex + meta.itemsPerPage;

  // Loading state - Show spinner if any of these are loading
  const isLoading = offersLoading || categoriesLoading || storesLoading;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">


      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {meta.totalItems || 0} عرض
              </h2>
              <button
                onClick={handleAddNew}
                className="mr-4 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة عرض جديد
              </button>
            </div>
            <FilterToggleButton
              showFilters={showFilters}
              toggleFilters={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Filters */}
          {showFilters && categories && stores && (
            <OfferFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              onSearch={searchOffers}
              categories={categories}
              stores={stores}
            />
          )}
        </div>

        {/* Offers List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : offersError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.
          </div>
        ) : offers && offers.length > 0 ? (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <OffersList
                offers={offers}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isMobile={isMobile}
              />
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <Pagination
                currentPage={meta.currentPage}
                totalPages={meta.totalPages}
                startIndex={startIndex}
                endIndex={Math.min(endIndex, meta.totalItems)}
                totalItems={meta.totalItems}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <EmptyState
            title="لا توجد عروض"
            message="لم يتم العثور على أي عروض تطابق معايير البحث."
          />
        )}
      </div>

      {/* Offer Form Modal */}
      {(categories && stores) && (
        <FormModal
          isOpen={isFormModalOpen}
          title={selectedOffer ? "تعديل عرض" : "إضافة عرض جديد"}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={() => {
            const form = document.querySelector("form");
            if (form) form.dispatchEvent(new Event("submit", { cancelable: true }));
          }}
          isPending={createOfferMutation.isPending || updateOfferMutation.isPending}
          submitLabel={selectedOffer ? "تحديث العرض" : "إضافة العرض"}
        >
          <OfferForm
            initialData={selectedOffer || undefined}
            categories={categories}
            stores={stores}
            onSubmit={handleFormSubmit}
          />
        </FormModal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="تأكيد الحذف"
        itemName={selectedOffer?.title || ""}
        isDeleting={deleteOfferMutation.isPending}
        onConfirm={() => selectedOffer && deleteOfferMutation.mutate(selectedOffer.id)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}