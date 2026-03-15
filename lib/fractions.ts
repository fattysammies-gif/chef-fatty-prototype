const FRACTIONS: [number, string][] = [
  [1 / 8, "⅛"],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [3 / 8, "⅜"],
  [1 / 2, "½"],
  [5 / 8, "⅝"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
  [7 / 8, "⅞"],
];

export function formatAmount(value: number): string {
  if (value === 0) return "0";

  const whole = Math.floor(value);
  const decimal = value - whole;

  if (decimal < 0.05) return whole === 0 ? "" : String(whole);

  // Find closest fraction
  let bestFrac = "";
  let bestDiff = Infinity;
  for (const [frac, symbol] of FRACTIONS) {
    const diff = Math.abs(decimal - frac);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestFrac = symbol;
    }
  }

  if (bestDiff < 0.1) {
    return whole === 0 ? bestFrac : `${whole} ${bestFrac}`;
  }

  // Fall back to 1 decimal place
  return value.toFixed(1).replace(/\.0$/, "");
}

export function scaleAmount(
  baseAmount: number | null,
  baseServings: number,
  targetServings: number
): number | null {
  if (baseAmount === null) return null;
  return (baseAmount / baseServings) * targetServings;
}
