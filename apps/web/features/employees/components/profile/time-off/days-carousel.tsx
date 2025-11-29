"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/components/ui/carousel";
import { Progress } from "@/components/components/ui/progress";

// --- Types ---
interface CardState {
    days: number;
    title: string;
    description: string;
}

interface DaysOffCarouselProps {
    cardStates: CardState[];
}

export default function DaysOffCarousel({ cardStates }: DaysOffCarouselProps) {
    const [api, setApi] = React.useState<any>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    const progress = count > 0 ? (current * 100) / count : 0;

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div className="mx-auto">
            <Carousel setApi={setApi} className="max-w-xs">
                <CarouselContent className="h-47">
                    {cardStates.map((card, index) => (
                        <CarouselItem key={index} className="py-0">
                            <Card className="py-0">
                                <CardContent className="flex aspect-video items-center justify-center space-x-4 py-0">
                                    <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center text-blue-600 font-bold text-xl">
                                        {card.days}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{card.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="top-[calc(100%+0.5rem)] translate-y-0 left-0" />
                <CarouselNext className="top-[calc(100%+0.5rem)] translate-y-0 left-2 translate-x-full" />
            </Carousel>

            <Progress value={progress} className="mt-4 w-24 ml-auto" />
        </div>
    );
}
