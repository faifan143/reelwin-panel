import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { api } from "./api";
import { translations } from "./translations";
import { Card } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";

// CategoryForm component
export const CategoryForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: api.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setName('');
            onSuccess();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ name });
    };

    return (
        <Card className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800 text-right">
                {translations.addNewCategory}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    icon={<Plus size={18} className="mx-1" />}
                    className="sm:flex-shrink-0 order-2 sm:order-2"
                >
                    {mutation.isPending ? translations.adding : translations.add}
                </Button>
                <Input
                    name="name"
                    placeholder={translations.categoryName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow order-1 sm:order-1"
                    required
                />
            </form>
            {mutation.isError && (
                <p className="text-red-500 mt-3 text-sm text-right">{translations.error}</p>
            )}
        </Card>
    );
};