import { translations } from "./translations";

// Error Display
export const ErrorDisplay: React.FC<{ message?: string }> = ({ message = translations.error }) => (
    <div className="py-10 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg py-4 px-6 inline-block mx-auto">
            <p className="text-red-600">{message}</p>
        </div>
    </div>
);
