"use client";
import type { State } from "@/lib/game/types";

export function History({ data }: { data: State[] }) {
  return (
    <div className="p-4">
      <h4>History</h4>
      <ul className="list-inside list-disc">
        {data.map((s, i) => (
          <li key={i}>
            {s.year}: K={s.K.toFixed(1)}, L={s.L.toFixed(1)}, A={s.A.toFixed(3)}, C=
            {s.C?.toFixed(1)}, I={s.I?.toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
}
