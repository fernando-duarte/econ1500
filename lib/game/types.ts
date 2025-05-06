// lib/game/types.ts

import type { growthModel } from "../constants";

/** Student‐picked controls each round */
export interface Controls {
  /** savingRate ∈ (0,1) */
  savingRate: number;
  /** must be 0.8, 1.0, or 1.2 */
  exchangePolicy: (typeof growthModel.EXCHANGE_OPTIONS)[number]["value"];
}

/** Endogenous state at each period */
export type State = growthModel.State;
/** Exogenous variables row */
export type ExogRow = growthModel.ExogRow;
