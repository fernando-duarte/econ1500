/**
 * Prettier Configuration
 *
 * This file centralizes the Prettier formatting configuration.
 * It exports a configuration object that matches the settings previously in .prettierrc.json
 */

const prettierConfig = {
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
  tabWidth: 2,
  printWidth: 100,
  jsxSingleQuote: false,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default prettierConfig;
