import { Card, CardContent } from "@/components/components/ui/card";

interface UsedTimeOffProps {
    usedData: Array<{ typeName: string; used: number }>;
}

export function UsedTimeOffCard({ usedData }: UsedTimeOffProps) {
    const validUsed = usedData.filter(d => d.used > 0);

    return (
        <Card className="w-full h-45 flex flex-col justify-center py-4 px-2">
            <CardContent className="flex flex-col gap-4 max-h-[300px] overflow-y-auto w-full">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Used Time Off</h3>
                    <p className="text-sm text-gray-500">This year</p>
                </div>

                <div className="space-y-2 text-sm w-full">
                    {validUsed.length === 0 ? (
                        <p className="text-gray-400">None used</p>
                    ) : (
                        validUsed.map(d => (
                            <div key={d.typeName} className="flex justify-between gap-4">
                                <span className="text-gray-600">{d.typeName}</span>
                                <span className="font-semibold text-gray-800 text-right">{d.used} days</span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
