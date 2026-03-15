export type UnitSystem = "imperial" | "metric";

interface UnitConversion {
  metricUnit: string;
  convert: (val: number) => number;
  backConvert: (val: number) => number;
}

const CONVERSIONS: Record<string, UnitConversion> = {
  cup: {
    metricUnit: "ml",
    convert: (v) => Math.round(v * 237),
    backConvert: (v) => v / 237,
  },
  cups: {
    metricUnit: "ml",
    convert: (v) => Math.round(v * 237),
    backConvert: (v) => v / 237,
  },
  tbsp: {
    metricUnit: "ml",
    convert: (v) => Math.round(v * 14.8),
    backConvert: (v) => v / 14.8,
  },
  tsp: {
    metricUnit: "ml",
    convert: (v) => parseFloat((v * 4.93).toFixed(1)),
    backConvert: (v) => v / 4.93,
  },
  oz: {
    metricUnit: "g",
    convert: (v) => Math.round(v * 28.35),
    backConvert: (v) => v / 28.35,
  },
  lb: {
    metricUnit: "g",
    convert: (v) => Math.round(v * 453.6),
    backConvert: (v) => v / 453.6,
  },
  lbs: {
    metricUnit: "g",
    convert: (v) => Math.round(v * 453.6),
    backConvert: (v) => v / 453.6,
  },
  "°F": {
    metricUnit: "°C",
    convert: (v) => Math.round(((v - 32) * 5) / 9),
    backConvert: (v) => (v * 9) / 5 + 32,
  },
};

export function convertUnit(
  amount: number,
  unit: string,
  system: UnitSystem
): { amount: number; unit: string } {
  if (system === "imperial") return { amount, unit };

  // g and ml are already metric
  if (["g", "kg", "ml", "l"].includes(unit)) return { amount, unit };

  const conv = CONVERSIONS[unit];
  if (!conv) return { amount, unit };

  return { amount: conv.convert(amount), unit: conv.metricUnit };
}

export function getDisplayUnit(unit: string, system: UnitSystem): string {
  if (system === "imperial") return unit;
  const conv = CONVERSIONS[unit];
  return conv ? conv.metricUnit : unit;
}
