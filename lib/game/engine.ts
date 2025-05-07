// lib/game/engine.ts

import { growthModel } from "../constants";
import type { Controls, State, ExogRow } from "./types";
import { economicValuesSchema } from "@/lib/schema/economicValues";

const { α, δ, g, n, θ, φ, εx, εm, μx, μm, X0, M0, Y0, exogenous } = growthModel;

// 1) Pure equation functions
export function prod(A: number, K: number, L: number, H: number): number {
  return A * K ** α * (L * H) ** (1 - α);
}
export function nextCapital(K: number, I: number): number {
  return (1 - δ) * K + I;
}
export function nextLabor(L: number): number {
  return (1 + n) * L;
}
export function nextTFP(A: number, openness: number, fdiRatio: number): number {
  return A * (1 + g + θ * openness + φ * fdiRatio);
}
export function calcExports(e: number, baseE: number, Ystar: number, baseYs: number): number {
  return X0 * (e / baseE) ** εx * (Ystar / baseYs) ** μx;
}
export function calcImports(e: number, baseE: number, Y: number): number {
  return M0 * (e / baseE) ** -εm * (Y / Y0) ** μm;
}
export function netExports(X: number, M: number): number {
  return X - M;
}
export function opennessRatio(X: number, M: number, Y: number): number {
  if (!isFinite(Y) || Y <= 0) {
    return 0;
  }
  return (X + M) / Y;
}
export function consumption(Y: number, s: number): number {
  return (1 - s) * Y;
}
export function investment(Y: number, s: number, NX: number): number {
  return s * Y - NX;
}
export function nominalE(mult: number, tildeE: number): number {
  return mult * tildeE;
}

// 2) Master runner
export function runRound(prev: State, ctrl: Controls, exog: ExogRow): State {
  const baseExog = exogenous[0] as ExogRow;
  const e = nominalE(ctrl.exchangePolicy, exog.tildeE);
  const Y = prod(prev.A, prev.K, prev.L, exog.H);
  const X = calcExports(e, nominalE(1, baseExog.tildeE), exog.Ystar, baseExog.Ystar);
  const M = calcImports(e, nominalE(1, baseExog.tildeE), Y);
  const NX = netExports(X, M);
  const opp = opennessRatio(X, M, Y);
  const C = consumption(Y, ctrl.savingRate);
  const I = investment(Y, ctrl.savingRate, NX);
  const calculatedA = nextTFP(prev.A, opp, exog.fdiRatio);
  const calculatedK = nextCapital(prev.K, I);

  // ---- ZOD VALIDATION FOR K ----
  const validationInput = { K: calculatedK };
  const validationResult = economicValuesSchema.safeParse(validationInput);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    if (errors.K) {
      const errorMessage = `Invalid calculated Capital (K): ${errors.K.join(", ")}. Value: ${calculatedK}`;
      console.error(`Validation Error for K in year ${exog.year}: ${errorMessage}`);
      throw new Error(errorMessage);
    } else {
      const fullErrorMessage = `Economic values validation failed for year ${exog.year}.`;
      console.error(fullErrorMessage, validationResult.error.format());
      throw new Error(fullErrorMessage);
    }
  }
  // ---- END ZOD VALIDATION ----

  return {
    year: exog.year,
    K: validationResult.data.K,
    L: nextLabor(prev.L),
    A: calculatedA,
    Y,
    X,
    M,
    NX,
    openness: opp,
    C,
    I,
    e,
  };
}

// The following commented-out block uses types (RecursiveState, ExogenousVariables)
// that are not currently defined in lib/game/types.ts.
// It is preserved here for reference if those types are defined in the future.
/*
Example structure if you need a simulateRecursive that uses ExogenousVariables
and calls a slightly different next state function, or adapts ExogenousVariables to ExogRow.

export function simulateRecursiveGeneric(
  initial: State,
  exogVars: ExogenousVariables, // This type includes s, opp, tfpgr, g directly
  periods: number,
  allExogData: ExogRow[] // Full dataset to find matching year data
): RecursiveState[] {
  const history: RecursiveState[] = [
    { ...initial, s: exogVars.s, opp: exogVars.opp, tfpgr: exogVars.tfpgr, g: exogVars.g },
  ];

  let currentYearState = initial;

  for (let t = 1; t < periods; t++) {
    const currentYear = initial.year + t;
    // Find the ExogRow for the current year, or use a default/error handling
    const currentExogRow = allExogData.find(row => row.year === currentYear);
    if (!currentExogRow) {
      throw new Error(`Exogenous data not found for year ${currentYear}`);
    }

    // Create Controls object for runRound based on exogVars or defaults
    const currentControls: Controls = {
        savingRate: exogVars.s,
        exchangePolicy: exogVars.exchangePolicy, // Assuming ExogenousVariables has this
    };

    const nextState = runRound(currentYearState, currentControls, currentExogRow);
    history.push({
        ...nextState,
        s: exogVars.s,
        opp: exogVars.opp, // or nextState.openness if that's intended
        tfpgr: exogVars.tfpgr,
        g: exogVars.g
    });
    currentYearState = nextState;
  }
  return history;
}
*/
