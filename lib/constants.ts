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
// Growth model parameters and types
export interface ExogRow {
  year: number;
  tildeE: number;
  fdiRatio: number;
  Ystar: number;
  H: number;
}

export interface State {
  year: number;
  K: number;
  L: number;
  A: number;
  X?: number;
  M?: number;
  NX?: number;
  Y?: number;
  openness?: number;
  C?: number;
  I?: number;
  e?: number;
}

export const growthModel = {
  // 1. Parameters
  α: 0.3,
  δ: 0.1,
  g: 0.005,
  n: 0.00717,
  θ: 0.1453,
  φ: 0.1,

  // 2. Trade elasticities & initial levels
  εx: 1.5,
  εm: 1.2,
  μx: 1.0,
  μm: 1.0,
  X0: 18.1,
  M0: 14.5,
  Y0: 191.15,
  K0: 2050.1,
  L0: 428.3,
  A0: 0.203,

  // 3. Exchange‐rate policy options
  EXCHANGE_OPTIONS: [
    { label: "Undervalued (×1.2)", value: 1.2 },
    { label: "Market (×1.0)", value: 1.0 },
    { label: "Overvalued (×0.8)", value: 0.8 },
  ] as const,

  // 4. Exogenous variables path (five‐year steps)
  exogenous: [
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
  ] as ExogRow[],

  // 5. Initial state (1980)
  initialState: {
    year: 1980,
    K: 2050.1, // K0
    L: 428.3, // L0
    A: 0.203, // A0
  } as State,
};
