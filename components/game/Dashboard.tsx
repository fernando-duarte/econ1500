"use client";
import type { State } from "@/lib/game/types";
import { Card } from "@/components/ui/card";

export function Dashboard({ prev }: { prev: State }) {
  return (
    <div className="space-y-6">
      {/* State Variables in Square Boxes */}
      <div className="flex w-full justify-between gap-4">
        {/* Capital Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{prev.K.toFixed(2)}</div>
          <div className="text-muted-foreground mt-auto flex flex-col items-center pb-2 text-sm">
            <span>Capital</span>
            <span className="text-sm">(billions USD)</span>
          </div>
        </Card>

        {/* Productivity Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{prev.A.toFixed(3)}</div>
          <div className="text-muted-foreground mt-auto flex flex-col items-center pb-2 text-sm">
            <span>Productivity</span>
            <span className="text-sm">(Index, 2017 = 1)</span>
          </div>
        </Card>

        {/* Population Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{prev.L.toFixed(2)}</div>
          <div className="text-muted-foreground mt-auto flex flex-col items-center pb-2 text-sm">
            <span>Population</span>
            <span className="text-sm">(millions)</span>
          </div>
        </Card>
      </div>

      {/* Exchange Rate Box */}
      {prev.e && (
        <Card className="relative flex flex-col items-center justify-center p-4">
          <div className="text-2xl font-semibold">{prev.e.toFixed(2)}</div>
          <div className="text-muted-foreground flex flex-col items-center text-sm">
            <span>Exchange Rate</span>
            <span className="text-sm">(CNY per USD)</span>
          </div>
        </Card>
      )}
    </div>
  );
}
