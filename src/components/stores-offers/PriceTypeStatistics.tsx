import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp } from "lucide-react";
import { api } from "./api";
import { Card } from "./Card";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { CURRENCY_NAMES, CURRENCY_SYMBOLS } from "./types";

interface PriceTypeStats {
    priceType: string;
    count: number;
    averagePrice: number;
    averageDiscount: number;
}

export const PriceTypeStatistics: React.FC = () => {
    const { data: stats, isLoading, isError } = useQuery<PriceTypeStats[]>({
        queryKey: ['offer-stats-price-types'],
        queryFn: api.getOfferStatsByPriceType
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorDisplay message="خطأ في تحميل الإحصائيات" />;

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <BarChart3 className="ml-2 text-indigo-600" />
                    إحصائيات العروض حسب نوع العملة
                </h3>
                <TrendingUp className="text-gray-400" size={20} />
            </div>

            {stats && stats.length > 0 ? (
                <div className="space-y-4">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.priceType}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-bold text-indigo-600">
                                        {CURRENCY_SYMBOLS[stat.priceType as keyof typeof CURRENCY_SYMBOLS]}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {CURRENCY_NAMES[stat.priceType as keyof typeof CURRENCY_NAMES]}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {stat.count} عرض
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-left">
                                <div className="text-sm text-gray-500">متوسط السعر</div>
                                <div className="font-semibold text-gray-900">
                                    {stat.averagePrice?.toFixed(2)} {CURRENCY_SYMBOLS[stat.priceType as keyof typeof CURRENCY_SYMBOLS]}
                                </div>
                                <div className="text-xs text-green-600">
                                    خصم: {stat.averageDiscount?.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    لا توجد إحصائيات متاحة
                </div>
            )}
        </Card>
    );
};
