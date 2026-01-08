import { Card as ShadcnCard, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Card component wrapper for shadcn/ui
export const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = "" }) => (
    <ShadcnCard className={cn(className)}>
        <CardContent className="p-5">
            {children}
        </CardContent>
    </ShadcnCard>
);
