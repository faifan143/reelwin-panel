import { translations } from "./translations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Error Display using shadcn/ui
export const ErrorDisplay: React.FC<{ message?: string }> = ({ message = translations.error }) => (
    <div className="py-10 flex justify-center">
        <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    </div>
);
