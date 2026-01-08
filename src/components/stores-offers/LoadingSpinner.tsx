import { Loader2 } from "lucide-react";

// Loading Spinner
export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
);
