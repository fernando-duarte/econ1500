"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import type { State } from "@/lib/game/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type GdpComponent = {
  name: string;
  value: number;
  percentage: string;
  color: string;
  shortName: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

export function GdpPieChart({ data }: { data: State }) {
  // Handle potentially undefined values
  const Y = data.Y ?? 0;
  const C = data.C ?? 0;
  const I = data.I ?? 0;
  const NX = data.NX ?? 0;

  // Calculate GDP components as percentages - ensure string return type
  const formatPercentage = (value: number): string => {
    if (Y <= 0) return "0%";
    return `${((value / Y) * 100).toFixed(1)}%`;
  };

  // Calculate GDP components as percentages
  const gdpComponents: GdpComponent[] = [
    {
      name: "Consumption (C)",
      shortName: "C",
      value: C,
      percentage: formatPercentage(C),
      color: COLORS[0],
    } as GdpComponent,
    {
      name: "Investment (I)",
      shortName: "I",
      value: I,
      percentage: formatPercentage(I),
      color: COLORS[1],
    } as GdpComponent,
    {
      name: "Net Exports (NX)",
      shortName: "NX",
      value: NX,
      percentage: formatPercentage(NX),
      color: COLORS[2],
    } as GdpComponent,
  ];

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: GdpComponent }>;
  }) => {
    if (active && payload && payload.length > 0 && payload[0]?.payload) {
      const item = payload[0].payload;
      return (
        <div className="rounded-md bg-white p-2 shadow-md">
          <p className="font-semibold">{item.name}</p>
          <p>Value: {item.value.toFixed(2)} bn USD</p>
          <p>Share of GDP: {item.percentage}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label for the pie slices
  const renderCustomizedLabel = (props: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    shortName: string;
    percentage: string;
    color: string;
  }) => {
    const { cx, cy, midAngle, outerRadius, shortName, percentage, color } = props;
    const RADIAN = Math.PI / 180;
    // Positioning label outside the pie
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate text anchor based on angle
    const textAnchor = x > cx ? "start" : "end";

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${shortName} ${percentage}`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl">GDP Composition</CardTitle>
        <CardDescription className="text-center text-base">
          <Popover>
            <PopoverTrigger className="cursor-help">Y = C+I+NX</PopoverTrigger>
            <PopoverContent className="text-left">
              <div className="space-y-1">
                <p>
                  <strong>Y</strong> is GDP
                </p>
                <p>
                  <strong>C</strong> is Consumption
                </p>
                <p>
                  <strong>I</strong> is Investment
                </p>
                <p>
                  <strong>NX</strong> are Net Exports
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gdpComponents}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={renderCustomizedLabel}
              >
                {gdpComponents.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
