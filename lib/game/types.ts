// lib/game/types.ts

import { growthModel } from "../constants";
import type { State as GrowthState, ExogRow as GrowthExogRow } from "../constants";

/** Student‐picked controls each round */
export interface Controls {
  /** savingRate ∈ (0,1) */
  savingRate: number;
  /** must be 0.8, 1.0, or 1.2 */
  exchangePolicy: (typeof growthModel.EXCHANGE_OPTIONS)[number]["value"];
}

/** Endogenous state at each period */
export type State = GrowthState;
/** Exogenous variables row */
export type ExogRow = GrowthExogRow;
