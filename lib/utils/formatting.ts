interface FormattedEconomicValue {
  value: number;
  unitBase: "million" | "billion" | "trillion";
  displayValue: string; // The number part, formatted with commas and desired precision
  displayUnit: string; // e.g., "mil USD", "billions USD"
  fullString: string; // e.g., "123.4 mil USD", "123.4 billions USD"
}

interface FormatOptions {
  unitStyle?: "short" | "long";
}

/**
 * Formats an economic value (assumed to be in billions USD initially)
 * for display with appropriate unit scaling (millions, billions, trillions)
 * and adaptive precision (0 or 1 decimal place).
 *
 * @param valueInBillions The numeric value in billions of USD.
 * @param options Formatting options, including unitStyle ('short' or 'long').
 * @returns A FormattedEconomicValue object or null.
 */
export function formatEconomicValue(
  valueInBillions: number | undefined | null,
  options?: FormatOptions
): FormattedEconomicValue | null {
  if (valueInBillions === undefined || valueInBillions === null || !isFinite(valueInBillions)) {
    // Handle non-numeric, null, undefined, NaN, or Infinity gracefully
    // Depending on how you want to display these, you might return a default string or null
    return null; // Or { value: 0, unitBase: 'billion', displayValue: "N/A", displayUnit: "bn USD", fullString: "N/A" }
  }

  const unitStyle = options?.unitStyle || "short"; // Default to short

  let scaledValue: number;
  let unitBase: FormattedEconomicValue["unitBase"];
  let shortUnit: string;
  let longUnitSingular: string;
  let longUnitPlural: string;

  if (Math.abs(valueInBillions) >= 1000) {
    scaledValue = valueInBillions / 1000;
    unitBase = "trillion";
    shortUnit = "tril";
    longUnitSingular = "trillion";
    longUnitPlural = "trillions";
  } else if (Math.abs(valueInBillions) < 1 && Math.abs(valueInBillions) !== 0) {
    scaledValue = valueInBillions * 1000;
    unitBase = "million";
    shortUnit = "mil";
    longUnitSingular = "million";
    longUnitPlural = "millions";
  } else {
    scaledValue = valueInBillions;
    unitBase = "billion";
    shortUnit = "bn";
    longUnitSingular = "billion";
    longUnitPlural = "billions";
  }

  // Determine fraction digits: 0 if integer part is >= 100 or value is 0, else 1
  // This helps keep the total string length somewhat consistent.
  const integerPartOfScaledValue = Math.floor(Math.abs(scaledValue));
  const fractionDigits =
    integerPartOfScaledValue >= 100 ||
    scaledValue === 0 ||
    integerPartOfScaledValue === Math.abs(scaledValue)
      ? 0
      : 1;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: true, // This enables thousands separators
  });

  const formattedNumberString = formatter.format(scaledValue);

  let displayUnitLabel: string;
  if (unitStyle === "long") {
    const isSingular = Math.abs(parseFloat(formattedNumberString.replace(/,/g, ""))) === 1;
    displayUnitLabel = `${isSingular ? longUnitSingular : longUnitPlural} USD`;
  } else {
    displayUnitLabel = `${shortUnit} USD`;
  }

  return {
    value: valueInBillions, // Original value
    unitBase,
    displayValue: formattedNumberString,
    displayUnit: displayUnitLabel,
    fullString: `${formattedNumberString} ${displayUnitLabel}`,
  };
}

// Example Usage (for testing):
// console.log("Short form:");
// console.log(formatEconomicValue(0.001));     // Short: 1.0 mil USD
// console.log(formatEconomicValue(1));         // Short: 1.0 bn USD
// console.log(formatEconomicValue(1234.5));    // Short: 1.2 tril USD
// console.log(formatEconomicValue(2000));      // Short: 2.0 tril USD
// console.log(formatEconomicValue(0.5));       // Short: 500.0 mil USD

// console.log("\nLong form:");
// console.log(formatEconomicValue(0.001, { unitStyle: 'long' }));    // Long: 1.0 million USD
// console.log(formatEconomicValue(1, { unitStyle: 'long' }));        // Long: 1.0 billion USD
// console.log(formatEconomicValue(1234.5, { unitStyle: 'long' }));   // Long: 1.2 trillions USD
// console.log(formatEconomicValue(2000, { unitStyle: 'long' }));     // Long: 2.0 trillions USD
// console.log(formatEconomicValue(0.5, { unitStyle: 'long' }));      // Long: 500.0 millions USD
// console.log(formatEconomicValue(1.9, { unitStyle: 'long' }));     // Long: 1.9 billions USD
// console.log(formatEconomicValue(0.0019, { unitStyle: 'long' }));  // Long: 1.9 millions USD
// console.log(formatEconomicValue(1900, { unitStyle: 'long' }));    // Long: 1.9 trillions USD
