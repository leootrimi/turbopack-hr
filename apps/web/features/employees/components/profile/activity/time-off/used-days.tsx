import { Card, CardContent } from "@/components/components/ui/card";

interface UsedTimeOffProps {
    used: {
        vacation: number;
        sick: number;
        personal: number;
    };
}

export function UsedTimeOffCard({ used }: UsedTimeOffProps) {
    return (
        <Card className="w-full max-w-xs h-45 flex flex-col justify-center py-0">
            <CardContent className="flex flex-col gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Used Time Off</h3>
                    <p className="text-sm text-gray-500">This year</p>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Vacation</span>
                        <span className="font-semibold text-gray-800">{used.vacation} days</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Sick</span>
                        <span className="font-semibold text-gray-800">{used.sick} days</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Personal</span>
                        <span className="font-semibold text-gray-800">{used.personal} days</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
