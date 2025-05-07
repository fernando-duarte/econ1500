"use client";
import type { State } from "@/lib/game/types";
import { formatEconomicValue } from "@/lib/utils/formatting";

export function History({ data }: { data: State[] }) {
  return (
    <div className="p-4">
      <h4>History</h4>
      <ul className="list-inside list-disc">
        {data.map((s, i) => {
          const formattedK = formatEconomicValue(s.K);
          const formattedY = formatEconomicValue(s.Y);
          const formattedX = formatEconomicValue(s.X);
          const formattedM = formatEconomicValue(s.M);
          const formattedNX = formatEconomicValue(s.NX);
          const formattedC = formatEconomicValue(s.C);
          const formattedI = formatEconomicValue(s.I);

          // L and A are not typically represented in Billions/Trillions for this model context,
          // so they retain their original formatting for now.
          // Population (L) is in millions, TFP (A) is an index.
          const formattedL = s.L?.toFixed(1) ?? "N/A";
          const formattedA = s.A?.toFixed(3) ?? "N/A";
          const formattedOpenness =
            s.openness !== undefined && s.openness !== null
              ? `${(s.openness * 100).toFixed(1)}%`
              : "N/A";

          return (
            <li key={i}>
              {s.year}: K={formattedK ? formattedK.fullString : "N/A"}, L={formattedL}, A=
              {formattedA}, Y={formattedY ? formattedY.fullString : "N/A"}, C=
              {formattedC ? formattedC.fullString : "N/A"}, I=
              {formattedI ? formattedI.fullString : "N/A"}, X=
              {formattedX ? formattedX.fullString : "N/A"}, M=
              {formattedM ? formattedM.fullString : "N/A"}, NX=
              {formattedNX ? formattedNX.fullString : "N/A"}, Openness={formattedOpenness}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
