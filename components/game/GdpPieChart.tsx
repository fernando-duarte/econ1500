"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Sector,
} from "recharts";
import type { State } from "@/lib/game/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

type GdpComponent = {
  name: string;
  value: number;
  percentage: string;
  color: string;
  shortName: string;
  index: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

export function GdpPieChart({ data }: { data: State }) {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);

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
      index: 0,
    },
    {
      name: "Investment (I)",
      shortName: "I",
      value: I,
      percentage: formatPercentage(I),
      color: COLORS[1],
      index: 1,
    },
    {
      name: "Net Exports (NX)",
      shortName: "NX",
      value: NX,
      percentage: formatPercentage(NX),
      color: COLORS[2],
      index: 2,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex([index]);
  };

  const onPieLeave = () => {
    setActiveIndex([]);
  };

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
        <div className="rounded-md bg-white p-2 shadow-md select-none">
          <p className="text-sm font-semibold">{item.name}</p>
          <p className="text-xs">Value: {item.value.toFixed(2)} billions USD</p>
          <p className="text-xs">Share of GDP: {item.percentage}</p>
        </div>
      );
    }
    return null;
  };

  // Custom active shape for the pie slices (when hovered)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Custom label for the pie slices that also acts as a hover target
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, payload } = props;

    // Safe access to properties
    const index = typeof payload === "object" && payload !== null ? payload.index || 0 : 0;
    const shortName =
      typeof payload === "object" && payload !== null ? payload.shortName || "" : "";
    const percentage =
      typeof payload === "object" && payload !== null ? payload.percentage || "0%" : "0%";
    const color =
      typeof payload === "object" && payload !== null ? payload.color || "#000" : "#000";

    const RADIAN = Math.PI / 180;
    // Positioning label outside the pie
    const radius = outerRadius * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate text anchor based on angle
    const textAnchor = x > cx ? "start" : "end";

    // Create a larger hit area for the label that will also trigger the tooltip
    const isActive = activeIndex.includes(index);

    return (
      <g
        onMouseEnter={() => setActiveIndex([index])}
        onMouseLeave={() => setActiveIndex([])}
        style={{ cursor: "pointer" }}
        className="select-none"
      >
        <text
          x={x}
          y={y}
          fill={isActive ? "#FF0000" : color}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize="16"
          fontWeight="bold"
          className="select-none"
        >
          {`${shortName}: ${percentage}`}
        </text>
      </g>
    );
  };

  return (
    <div className="recharts-wrapper">
      <style jsx global>{`
        .recharts-wrapper .recharts-surface,
        .recharts-wrapper .recharts-layer,
        .recharts-wrapper .recharts-sector,
        .recharts-wrapper path,
        .recharts-wrapper .recharts-pie,
        .recharts-wrapper .recharts-pie-sector {
          outline: none !important;
          box-shadow: none !important;
        }
        .recharts-wrapper .recharts-pie-sector:focus,
        .recharts-wrapper .recharts-sector:focus {
          outline: none !important;
        }
      `}</style>
      <Card
        className="pointer-events-auto select-none focus:ring-0 focus:outline-none"
        tabIndex={-1}
      >
        <CardHeader className="select-none">
          <CardTitle className="text-center text-xl select-none">GDP Composition</CardTitle>
          <CardDescription className="text-center text-base select-none">
            <Popover>
              <PopoverTrigger className="cursor-help select-none focus:ring-0 focus:outline-none">
                Y = C+I+NX
              </PopoverTrigger>
              <PopoverContent className="text-left select-none">
                <div className="space-y-1 text-sm">
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
        <CardContent className="select-none focus:outline-none">
          <div
            className="h-[250px] w-full select-none focus:outline-none"
            style={{ outline: "none" }}
          >
            <ResponsiveContainer width="100%" height="100%" className="select-none">
              <PieChart className="select-none" style={{ outline: "none" }}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={gdpComponents}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  label={renderCustomizedLabel}
                  className="select-none"
                  style={{ outline: "none" }}
                >
                  {gdpComponents.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="select-none" />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={<CustomTooltip />}
                  active={activeIndex.length > 0}
                  payload={
                    activeIndex.length > 0 &&
                    activeIndex[0] !== undefined &&
                    gdpComponents[activeIndex[0]]
                      ? [{ payload: gdpComponents[activeIndex[0]] }]
                      : []
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
