/**
 * Application constants
 *
 * This file contains constants used throughout the application,
 * including external URLs and UTM tracking parameters.
 */

// Campaign UTM parameters
export const UTM_PARAMS = {
  CREATE_NEXT_APP:
    "utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
};

// External URLs
export const EXTERNAL_URLS = {
  VERCEL_DEPLOY: `https://vercel.com/new?${UTM_PARAMS.CREATE_NEXT_APP}`,
  NEXTJS_DOCS: `https://nextjs.org/docs?${UTM_PARAMS.CREATE_NEXT_APP}`,
  NEXTJS_LEARN: `https://nextjs.org/learn?${UTM_PARAMS.CREATE_NEXT_APP}`,
  VERCEL_TEMPLATES: `https://vercel.com/templates?framework=next.js&${UTM_PARAMS.CREATE_NEXT_APP}`,
  NEXTJS_HOME: `https://nextjs.org?${UTM_PARAMS.CREATE_NEXT_APP}`,
};

/**
 * Growth‐Model Constants & Data for Game
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace growthModel {
  // 1. Parameters
  export const α = 0.3;
  export const δ = 0.1;
  export const g = 0.005;
  export const n = 0.00717;
  export const θ = 0.1453;
  export const φ = 0.1;

  // 2. Trade elasticities & initial levels
  export const εx = 1.5;
  export const εm = 1.2;
  export const μx = 1.0;
  export const μm = 1.0;
  export const X0 = 18.1;
  export const M0 = 14.5;
  export const Y0 = 191.15;
  export const K0 = 2050.1;
  export const L0 = 428.3;
  export const A0 = 0.203;

  // 3. Exchange‐rate policy options
  export const EXCHANGE_OPTIONS = [
    { label: "Undervalued (×1.2)", value: 1.2 },
    { label: "Market (×1.0)", value: 1.0 },
    { label: "Overvalued (×0.8)", value: 0.8 },
  ] as const;

  // 4. Exogenous variables path (five‐year steps)
  export interface ExogRow {
    year: number;
    tildeE: number;
    fdiRatio: number;
    Ystar: number;
    H: number;
  }
  export const exogenous: ExogRow[] = [
    { year: 1980, tildeE: 0.78, fdiRatio: 0.001, Ystar: 1000, H: 1.58 },
    { year: 1985, tildeE: 1.53, fdiRatio: 0.001, Ystar: 1159.27, H: 1.77 },
    { year: 1990, tildeE: 2.48, fdiRatio: 0.02, Ystar: 1343.92, H: 1.8 },
    { year: 1995, tildeE: 4.34, fdiRatio: 0.02, Ystar: 1557.97, H: 2.02 },
    { year: 2000, tildeE: 5.23, fdiRatio: 0.02, Ystar: 1806.11, H: 2.24 },
    { year: 2005, tildeE: 4.75, fdiRatio: 0.02, Ystar: 2093.78, H: 2.43 },
    { year: 2010, tildeE: 5.61, fdiRatio: 0.02, Ystar: 2427.26, H: 2.61 },
    { year: 2015, tildeE: 7.27, fdiRatio: 0.02, Ystar: 2813.86, H: 2.6 },
    { year: 2020, tildeE: 7.0, fdiRatio: 0.02, Ystar: 3262.04, H: 6.71 },
    { year: 2025, tildeE: 6.41, fdiRatio: 0.02, Ystar: 3781.6, H: 6.49 },
  ];

  // 5. Endogenous state type & initial state (1980)
  export interface State {
    year: number;
    K: number;
    L: number;
    A: number;
    X?: number;
    M?: number;
    NX?: number;
    openness?: number;
    C?: number;
    I?: number;
    e?: number;
  }
  export const initialState: State = {
    year: 1980,
    K: K0,
    L: L0,
    A: A0,
  };
}
