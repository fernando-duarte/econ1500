"use client";
import type { State } from "@/lib/game/types";

export function Dashboard({ prev, preview }: { prev: State; preview: State }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="card p-4">
        <h4>Last Period ({prev.year})</h4>
        <p>K: {prev.K.toFixed(2)}</p>
        <p>L: {prev.L.toFixed(2)}</p>
        <p>A: {prev.A.toFixed(3)}</p>
      </div>
      <div className="card p-4">
        <h4>Preview</h4>
        <p>C: {preview.C?.toFixed(2)}</p>
        <p>I: {preview.I?.toFixed(2)}</p>
      </div>
    </div>
  );
}
