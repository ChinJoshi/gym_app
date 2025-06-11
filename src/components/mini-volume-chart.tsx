"use client";
import { Bar, BarChart, CartesianGrid } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
const chartConfig = {
    volume: {
        label: "Volume",
        color: "#2563eb",
    },
} satisfies ChartConfig;

export default function MiniVolumeChart(props: {
    volumes: Array<{ volume: number }>;
}) {
    return (
        <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
            <BarChart accessibilityLayer data={props.volumes}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <CartesianGrid vertical={false} />
                <Bar dataKey="volume" fill="var(--chart-5)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
