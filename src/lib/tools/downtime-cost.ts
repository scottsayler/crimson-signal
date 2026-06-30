export interface DowntimeCostInputs {
  locationsAffected: number;
  dailyRevenuePerLocation: number;
  operatingHoursPerDay: number;
  peakRevenueMultiplier: number;
  outageDurationMinutes: number;
  salesDependentOnSystemsPct: number;
  laborCostPerHour: number;
  employeesAffectedPerLocation: number;
  recoveryTimeMinutes: number;
  lostOnlineOrdersPct: number;
  deliveryPlatformDependencyPct: number;
}

export interface DowntimeCostResults {
  hourlyRevenuePerLocation: number;
  adjustedHourlyRevenuePerLocation: number;
  revenueAtRisk: number;
  lostRevenueEstimate: number;
  onlineOrdersLoss: number;
  deliveryPlatformLoss: number;
  laborWaste: number;
  recoveryCost: number;
  totalImpact: number;
  impactPerLocation: number;
  annualizedMonthly: number;
  annualizedQuarterly: number;
  outageHours: number;
  recoveryHours: number;
}

export const DOWNTIME_COST_DEFAULTS: DowntimeCostInputs = {
  locationsAffected: 1,
  dailyRevenuePerLocation: 8000,
  operatingHoursPerDay: 14,
  peakRevenueMultiplier: 1.8,
  outageDurationMinutes: 45,
  salesDependentOnSystemsPct: 85,
  laborCostPerHour: 18,
  employeesAffectedPerLocation: 6,
  recoveryTimeMinutes: 30,
  lostOnlineOrdersPct: 0,
  deliveryPlatformDependencyPct: 0,
};

function clampNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateDowntimeCost(inputs: DowntimeCostInputs): DowntimeCostResults {
  const locations = clampNonNegative(inputs.locationsAffected);
  const dailyRevenue = clampNonNegative(inputs.dailyRevenuePerLocation);
  const operatingHours = clampNonNegative(inputs.operatingHoursPerDay) || 1;
  const peakMultiplier = clampNonNegative(inputs.peakRevenueMultiplier) || 1;
  const outageHours = clampNonNegative(inputs.outageDurationMinutes) / 60;
  const recoveryHours = clampNonNegative(inputs.recoveryTimeMinutes) / 60;
  const dependencyPct = Math.min(100, clampNonNegative(inputs.salesDependentOnSystemsPct)) / 100;
  const laborCost = clampNonNegative(inputs.laborCostPerHour);
  const employees = clampNonNegative(inputs.employeesAffectedPerLocation);
  const onlineOrdersPct = Math.min(100, clampNonNegative(inputs.lostOnlineOrdersPct)) / 100;
  const deliveryPct = Math.min(100, clampNonNegative(inputs.deliveryPlatformDependencyPct)) / 100;

  const hourlyRevenuePerLocation = dailyRevenue / operatingHours;
  const adjustedHourlyRevenuePerLocation = hourlyRevenuePerLocation * peakMultiplier;
  const revenueAtRisk = adjustedHourlyRevenuePerLocation * outageHours * locations;
  const lostRevenueEstimate = revenueAtRisk * dependencyPct;

  const onlineOrdersLoss =
    onlineOrdersPct > 0
      ? adjustedHourlyRevenuePerLocation * outageHours * locations * onlineOrdersPct
      : 0;

  const deliveryPlatformLoss =
    deliveryPct > 0
      ? adjustedHourlyRevenuePerLocation * outageHours * locations * deliveryPct
      : 0;

  const laborWaste = employees * laborCost * outageHours * locations;
  const recoveryCost = employees * laborCost * recoveryHours * locations;
  const totalImpact =
    lostRevenueEstimate + onlineOrdersLoss + deliveryPlatformLoss + laborWaste + recoveryCost;
  const impactPerLocation = locations > 0 ? totalImpact / locations : totalImpact;

  return {
    hourlyRevenuePerLocation,
    adjustedHourlyRevenuePerLocation,
    revenueAtRisk,
    lostRevenueEstimate,
    onlineOrdersLoss,
    deliveryPlatformLoss,
    laborWaste,
    recoveryCost,
    totalImpact,
    impactPerLocation,
    annualizedMonthly: totalImpact * 12,
    annualizedQuarterly: totalImpact * 4,
    outageHours,
    recoveryHours,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
