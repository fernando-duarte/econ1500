// lib/game/engine.ts

import { growthModel } from "../constants";
import type { Controls, State, ExogRow } from "./types";

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
  return s * Y + NX;
}
export function nominalE(mult: number, tildeE: number): number {
  return mult * tildeE;
}

// 2) Master runner
export function runRound(prev: State, ctrl: Controls, exog: ExogRow): State {
  const baseExog = exogenous[0] as ExogRow; // 1980 row, will always exist
  const e = nominalE(ctrl.exchangePolicy, exog.tildeE);
  const Y = prod(prev.A, prev.K, prev.L, exog.H);
  const X = calcExports(e, nominalE(1, baseExog.tildeE), exog.Ystar, baseExog.Ystar);
  const M = calcImports(e, nominalE(1, baseExog.tildeE), Y);
  const NX = netExports(X, M);
  const opp = opennessRatio(X, M, Y);
  const C = consumption(Y, ctrl.savingRate);
  const I = investment(Y, ctrl.savingRate, NX);

  return {
    year: exog.year,
    K: nextCapital(prev.K, I),
    L: nextLabor(prev.L),
    A: nextTFP(prev.A, opp, exog.fdiRatio),
    X,
    M,
    NX,
    openness: opp,
    C,
    I,
    e,
  };
}
