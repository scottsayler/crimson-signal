/**
 * Downtime calculator verification scenarios.
 * Run: npx tsx scripts/test-downtime-calculator.ts
 */
import {
  calculateDowntimeCost,
  DOWNTIME_COST_DEFAULTS,
  type DowntimeCostInputs,
  type DowntimeCostResults,
} from "../src/lib/tools/downtime-cost";

const TOLERANCE = 1;

interface Scenario {
  name: string;
  inputs: DowntimeCostInputs;
  expected: Partial<DowntimeCostResults>;
}

export const DOWNTIME_COST_TEST_SCENARIOS: Scenario[] = [
  {
    name: "base formula (single location, no optional losses)",
    inputs: {
      locationsAffected: 1,
      dailyRevenuePerLocation: 10000,
      operatingHoursPerDay: 10,
      peakRevenueMultiplier: 2,
      outageDurationMinutes: 60,
      salesDependentOnSystemsPct: 90,
      laborCostPerHour: 20,
      employeesAffectedPerLocation: 8,
      recoveryTimeMinutes: 20,
      lostOnlineOrdersPct: 0,
      deliveryPlatformDependencyPct: 0,
    },
    expected: {
      hourlyRevenuePerLocation: 1000,
      adjustedHourlyRevenuePerLocation: 2000,
      revenueAtRisk: 2000,
      lostRevenueEstimate: 1800,
      onlineOrdersLoss: 0,
      deliveryPlatformLoss: 0,
      laborWaste: 160,
      recoveryCost: 53.33,
      totalImpact: 2013.33,
      impactPerLocation: 2013.33,
    },
  },
  {
    name: "multi-location base formula",
    inputs: {
      locationsAffected: 5,
      dailyRevenuePerLocation: 5000,
      operatingHoursPerDay: 12,
      peakRevenueMultiplier: 1.5,
      outageDurationMinutes: 30,
      salesDependentOnSystemsPct: 80,
      laborCostPerHour: 15,
      employeesAffectedPerLocation: 4,
      recoveryTimeMinutes: 15,
      lostOnlineOrdersPct: 0,
      deliveryPlatformDependencyPct: 0,
    },
    expected: {
      revenueAtRisk: 1562.5,
      lostRevenueEstimate: 1250,
      laborWaste: 150,
      recoveryCost: 75,
      totalImpact: 1475,
      impactPerLocation: 295,
    },
  },
  {
    name: "optional online and delivery are additive",
    inputs: {
      locationsAffected: 1,
      dailyRevenuePerLocation: 10000,
      operatingHoursPerDay: 10,
      peakRevenueMultiplier: 2,
      outageDurationMinutes: 60,
      salesDependentOnSystemsPct: 90,
      laborCostPerHour: 20,
      employeesAffectedPerLocation: 8,
      recoveryTimeMinutes: 20,
      lostOnlineOrdersPct: 20,
      deliveryPlatformDependencyPct: 10,
    },
    expected: {
      lostRevenueEstimate: 1800,
      onlineOrdersLoss: 400,
      deliveryPlatformLoss: 200,
      totalImpact: 2613.33,
    },
  },
  {
    name: "default values use base formula only",
    inputs: DOWNTIME_COST_DEFAULTS,
    expected: {
      revenueAtRisk: 771.43,
      lostRevenueEstimate: 655.71,
      onlineOrdersLoss: 0,
      deliveryPlatformLoss: 0,
      laborWaste: 81,
      recoveryCost: 54,
      totalImpact: 790.71,
    },
  },
];

function near(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= TOLERANCE;
}

function runScenarios(): boolean {
  let passed = true;

  for (const scenario of DOWNTIME_COST_TEST_SCENARIOS) {
    const results = calculateDowntimeCost(scenario.inputs);
    const failures: string[] = [];

    for (const [key, expectedValue] of Object.entries(scenario.expected)) {
      const actual = results[key as keyof DowntimeCostResults];
      if (typeof actual !== "number" || typeof expectedValue !== "number") continue;
      if (!near(actual, expectedValue)) {
        failures.push(
          `  ${key}: expected ${expectedValue.toFixed(2)}, got ${actual.toFixed(2)}`
        );
      }
    }

    if (failures.length > 0) {
      passed = false;
      console.error(`FAIL: ${scenario.name}`);
      console.error(failures.join("\n"));
    } else {
      console.log(`PASS: ${scenario.name}`);
    }
  }

  const defaultsWithOptional = calculateDowntimeCost(DOWNTIME_COST_DEFAULTS);
  if (defaultsWithOptional.totalImpact > 950) {
    passed = false;
    console.error(
      `FAIL: default values produce misleadingly high estimate (${defaultsWithOptional.totalImpact.toFixed(2)}). Optional losses should default to 0.`
    );
  } else {
    console.log("PASS: default values stay within reasonable base-formula range");
  }

  return passed;
}

const ok = runScenarios();
if (!ok) process.exit(1);
console.log("\nAll downtime calculator scenarios passed.");
