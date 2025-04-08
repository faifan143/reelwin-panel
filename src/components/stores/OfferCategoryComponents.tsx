// components/categories/CategoryList.tsx
import React, { useState } from "react";
import { Edit, Hash, Tag, Trash2 } from "lucide-react";


interface CategoryListProps {
    categories: OfferCategory[];
    onEdit: (category: OfferCategory) => void;
    onDelete: (category: OfferCategory) => void;
    isMobile: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    onEdit,
    onDelete,
    isMobile,
}) => {
    if (isMobile) {
        return (
            <div className="grid grid-cols-1 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                    <Tag className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                            </div>
                            <div className="flex space-x-1 space-x-reverse">
                                <button
                                    onClick={() => onEdit(category)}
                                    className="text-indigo-600 hover:text-indigo-900 p-1"
                                    title="تعديل"
                                >
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => onDelete(category)}
                                    className="text-red-600 hover:text-red-900 p-1"
                                    title="حذف"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between text-sm text-gray-500 mt-3 border-t pt-2">
                            <div className="flex items-center">
                                <Hash className="h-4 w-4 ml-1 text-gray-400" />
                                {category._count?.offers || 0} عروض
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            الفئة
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            عدد العروض
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            الإجراءات
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-full ml-3">
                                        <Tag className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                    {category._count?.offers || 0} عرض
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2 space-x-reverse">
                                    <button
                                        onClick={() => onEdit(category)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="تعديل"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(category)}
                                        className="text-red-600 hover:text-red-900"
                                        title="حذف"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// components/categories/CategoryForm.tsx

interface CategoryFormProps {
    initialData?: OfferCategory;
    onSubmit: (name: string) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    onSubmit
}) => {
    const [name, setName] = useState(initialData?.name || "");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("اسم الفئة مطلوب");
            return;
        }

        onSubmit(name);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الفئة <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError(null);
                    }}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${error ? "border-red-500" : ""
                        }`}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        </form>
    );
};

// components/categories/CategoryFilters.tsx
import { Search, X } from "lucide-react";
import { CategoryFilterData, OfferCategory } from "./store.type";

interface CategoryFiltersProps {
    filters: CategoryFilterData;
    onFilterChange: (filters: CategoryFilterData) => void;
    onReset: () => void;
    onSearch: () => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
    filters,
    onFilterChange,
    onReset,
    onSearch,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الفئة
                </label>
                <input
                    type="text"
                    name="name"
                    value={filters.name || ""}
                    onChange={(e) => onFilterChange({ name: e.target.value })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="البحث حسب اسم الفئة"
                />
            </div>

            <div className="flex items-end space-x-2 space-x-reverse">
                <button
                    onClick={onSearch}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Search className="h-4 w-4 ml-2" />
                    بحث
                </button>
                <button
                    onClick={onReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <X className="h-4 w-4 ml-2" />
                    مسح
                </button>
            </div>
        </div>
    )
}