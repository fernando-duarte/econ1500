"use client";
import type { State } from "@/lib/game/types";
import { Card } from "@/components/ui/card";
import { NumericFormat } from "react-number-format";
import { formatEconomicValue } from "@/lib/utils/formatting";

export function Dashboard({ prev }: { prev: State }) {
  const formattedK = formatEconomicValue(prev.K, { unitStyle: "long" });
  const formattedA = prev.A; // Assuming A doesn't need complex formatting for now, but could use formatEconomicValue if units make sense
  const formattedL = prev.L; // Assuming L doesn't need complex formatting

  return (
    <div className="space-y-6">
      {/* State Variables in Square Boxes */}
      <div className="flex w-full justify-between gap-4">
        {/* Capital Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center p-2">
          {formattedK ? (
            <>
              <NumericFormat
                value={parseFloat(formattedK.displayValue.replace(/,/g, ""))}
                displayType="text"
                thousandSeparator=","
                decimalScale={(formattedK.displayValue.split(".")[1] || "").length}
                fixedDecimalScale
                className="text-2xl font-semibold"
              />
              <div className="text-muted-foreground mt-auto flex flex-col items-center pb-1 text-xs sm:text-sm">
                <span>Capital</span>
                <span className="text-xs">({formattedK.displayUnit})</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-semibold">N/A</div>
              <div className="text-muted-foreground mt-auto flex flex-col items-center pb-1 text-xs sm:text-sm">
                <span>Capital</span>
                <span className="text-xs">(billions USD)</span>
              </div>
            </>
          )}
        </Card>

        {/* Productivity Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center p-2">
          <div className="text-2xl font-semibold">{formattedA.toFixed(3)}</div>
          <div className="text-muted-foreground mt-auto flex flex-col items-center pb-1 text-xs sm:text-sm">
            <span>Productivity</span>
            <span className="text-xs">(Index, 2017 = 1)</span>
          </div>
        </Card>

        {/* Population Box */}
        <Card className="relative flex aspect-square flex-1 flex-col items-center justify-center p-2">
          <div className="text-2xl font-semibold">{formattedL.toFixed(2)}</div>
          <div className="text-muted-foreground mt-auto flex flex-col items-center pb-1 text-xs sm:text-sm">
            <span>Population</span>
            <span className="text-xs">(millions)</span>
          </div>
        </Card>
      </div>

      {/* Exchange Rate Box */}
      {prev.e !== undefined && prev.e !== null && (
        <Card className="relative flex flex-col items-center justify-center p-4">
          <NumericFormat
            value={prev.e}
            displayType="text"
            decimalScale={2}
            fixedDecimalScale
            className="text-2xl font-semibold"
          />
          <div className="text-muted-foreground flex flex-col items-center text-sm">
            <span>Exchange Rate</span>
            <span className="text-sm">(CNY per USD)</span>
          </div>
        </Card>
      )}
    </div>
  );
}
