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
  const calculatedY = prod(prev.A, prev.K, prev.L, exog.H);
  const calculatedX = calcExports(e, nominalE(1, baseExog.tildeE), exog.Ystar, baseExog.Ystar);
  const calculatedM = calcImports(e, nominalE(1, baseExog.tildeE), calculatedY);
  const calculatedNX = netExports(calculatedX, calculatedM);
  const opp = opennessRatio(calculatedX, calculatedM, calculatedY);
  const calculatedC = consumption(calculatedY, ctrl.savingRate);
  const calculatedI = investment(calculatedY, ctrl.savingRate, calculatedNX);
  const calculatedA = nextTFP(prev.A, opp, exog.fdiRatio);
  const calculatedK = nextCapital(prev.K, calculatedI);

  // ---- ZOD VALIDATION ----
  const validationInput = {
    K: calculatedK,
    L: nextLabor(prev.L),
    A: calculatedA,
    Y: calculatedY,
    X: calculatedX,
    M: calculatedM,
    NX: calculatedNX,
    openness: opp,
    C: calculatedC,
    I: calculatedI,
    e: e,
    e_tilde: exog.tildeE,
    fdi_ratio: exog.fdiRatio,
    Y_star: exog.Ystar,
    H: exog.H,
  };

  // Attempt to parse all values. Note: L and A are included here assuming they are in the schema.
  // If L or A have separate validation or no validation, they should be handled differently.
  const validationResult = economicValuesSchema.safeParse(validationInput);

  if (!validationResult.success) {
    // Consolidate error reporting for any field
    const flatErrors = validationResult.error.flatten().fieldErrors;
    const errorMessages = Object.entries(flatErrors)
      .map(([field, messages]) => {
        if (messages) {
          // Access the original calculated value for the error message
          // Ensure that 'field' is a key in 'validationInput'
          const value = validationInput[field as keyof typeof validationInput];
          return `${field}: ${messages.join(", ")} (Value: ${value})`;
        }
        return null;
      })
      .filter(Boolean)
      .join("; ");

    const errorMessage = `Economic values validation failed for year ${exog.year}: ${errorMessages}`;
    console.error(errorMessage, validationResult.error.format());
    throw new Error(errorMessage);
  }
  // ---- END ZOD VALIDATION ----

  // Use validated data
  const { K, L, Y, X, M, NX, openness, C, I, A } = validationResult.data;

  return {
    year: prev.year + 5,
    K,
    L,
    A,
    Y,
    X,
    M,
    NX,
    openness,
    C,
    I,
    e,
    tildeE: exog.tildeE,
    savingRate: ctrl.savingRate,
    exchangePolicyValue: ctrl.exchangePolicy,
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
