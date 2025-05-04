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
