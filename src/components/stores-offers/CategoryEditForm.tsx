import { useState } from "react";
import { Category } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "./Input";
import { translations } from "./translations";
import { Button } from "./Button";
import { api } from "./api";

// CategoryEditForm component
export const CategoryEditForm: React.FC<{
    category: Category;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ category, onClose, onSuccess }) => {
    const [name, setName] = useState(category.name);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: { name: string }) => api.updateCategory(category.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            onSuccess();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ name });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label={translations.categoryName}
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <div className="flex justify-end gap-3 gap-reverse mt-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={mutation.isPending}
                    >
                        {translations.cancel}
                    </Button>
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? translations.saving : translations.save}
                    </Button>
                </div>
            </form>
            {mutation.isError && (
                <p className="text-red-500 mt-3 text-sm text-right">{translations.updateFailed}</p>
            )}
        </div>
    );
};
