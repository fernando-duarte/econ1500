"use client";
import type { State } from "@/lib/game/types";
import { Card } from "@/components/ui/card";

export function Dashboard({ prev, preview }: { prev: State; preview: State }) {
  return (
    <div className="space-y-6">
      {/* State Variables in Square Boxes */}
      <div className="flex w-full justify-between gap-4">
        {/* Capital Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{prev.K.toFixed(2)}</div>
          <div className="text-muted-foreground mt-auto pb-2 text-sm">Capital</div>
        </Card>

        {/* Productivity Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{prev.A.toFixed(3)}</div>
          <div className="text-muted-foreground mt-auto pb-2 text-sm">Productivity</div>
        </Card>

        {/* Population Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{prev.L.toFixed(2)}</div>
          <div className="text-muted-foreground mt-auto flex flex-col items-center pb-2 text-sm">
            <span>Population</span>
            <span className="text-xs">(millions)</span>
          </div>
        </Card>
      </div>

      {/* Preview Values */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h4>Last Period ({prev.year})</h4>
          <p>C: {prev.C?.toFixed(2)}</p>
          <p>I: {prev.I?.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <h4>Preview</h4>
          <p>C: {preview.C?.toFixed(2)}</p>
          <p>I: {preview.I?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
