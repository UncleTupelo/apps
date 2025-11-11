// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CapitalExpenditure, OperatingExpenditure, TCOInputs, TCOResults } from '../types';

export function calculateCapex (capex: CapitalExpenditure): number {
  return (
    capex.gpuCount * capex.gpuUnitCost +
    capex.serverCount * capex.serverUnitCost +
    capex.networkingCost +
    capex.rackingCost +
    capex.installationCost +
    capex.facilityCost
  );
}

export function calculatePowerConsumption (
  gpuCount: number,
  gpuTDP: number,
  serverCount: number,
  utilizationRate: number
): { totalWatts: number; annualKWh: number } {
  // GPU power consumption
  const gpuWatts = gpuCount * gpuTDP * utilizationRate;

  // Server base power (CPUs, memory, storage, fans) - estimate ~500W per server
  const serverBaseWatts = serverCount * 500;

  // Total power
  const totalWatts = gpuWatts + serverBaseWatts;

  // Annual kWh (24 hours * 365 days / 1000 to convert W to kW)
  const annualKWh = (totalWatts * 24 * 365) / 1000;

  return { totalWatts, annualKWh };
}

export function calculateAnnualOpex (
  opex: OperatingExpenditure,
  powerConsumptionKWh: number
): number {
  // Power cost
  const powerCost = powerConsumptionKWh * opex.powerCostPerKWh;

  // Cooling cost (percentage overhead of power cost)
  const coolingCost = powerCost * opex.coolingOverhead;

  // Total annual OpEx
  return (
    powerCost +
    coolingCost +
    opex.maintenanceCostPerYear +
    opex.staffCostPerYear +
    opex.softwareLicensesPerYear +
    opex.networkBandwidthPerYear +
    opex.facilityLeasePerYear
  );
}

export function calculateTCO (inputs: TCOInputs): TCOResults {
  // Calculate CapEx
  const totalCapex = calculateCapex(inputs.capex);

  // Calculate power consumption
  const powerConsumption = calculatePowerConsumption(
    inputs.capex.gpuCount,
    inputs.gpuModel.tdp,
    inputs.capex.serverCount,
    inputs.utilizationRate
  );

  // Calculate annual power cost
  const annualPowerCost = powerConsumption.annualKWh * inputs.opex.powerCostPerKWh;

  // Calculate annual OpEx
  const annualOpex = calculateAnnualOpex(inputs.opex, powerConsumption.annualKWh);

  // Total OpEx over timeframe
  const totalOpex = annualOpex * inputs.timeframe;

  // Total TCO
  const totalTCO = totalCapex + totalOpex;

  // Annual TCO (amortized)
  const annualTCO = totalTCO / inputs.timeframe;

  // Cost per GPU
  const costPerGPUPerYear = annualTCO / inputs.capex.gpuCount;
  const costPerGPUHour = costPerGPUPerYear / (365 * 24);

  // ROI calculations
  // Assuming revenue or value generated per GPU hour - placeholder for now
  const assumedRevenuePerGPUHour = costPerGPUHour * 2; // 2x markup
  const annualRevenue = assumedRevenuePerGPUHour * 365 * 24 * inputs.capex.gpuCount * inputs.utilizationRate;
  const annualProfit = annualRevenue - annualTCO;
  const breakEvenYears = annualProfit > 0 ? totalCapex / annualProfit : -1;
  const paybackPeriod = breakEvenYears;

  return {
    totalCapex,
    annualOpex,
    totalOpex,
    totalTCO,
    annualTCO,
    costPerGPUPerYear,
    costPerGPUHour,
    powerConsumption: {
      totalWatts: powerConsumption.totalWatts,
      annualKWh: powerConsumption.annualKWh,
      annualCost: annualPowerCost
    },
    roi: {
      breakEvenYears,
      paybackPeriod
    }
  };
}

export function formatCurrency (value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber (value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

export function formatPower (watts: number): string {
  if (watts >= 1000) {
    return `${formatNumber(watts / 1000, 1)} kW`;
  }

  return `${formatNumber(watts, 0)} W`;
}

export function calculateCloudComparison (
  hourlyRate: number,
  gpuCount: number,
  utilizationRate: number,
  timeframe: number
): { monthlyRate: number; annualRate: number; totalCost: number } {
  const hoursPerMonth = 730; // Average
  const hoursPerYear = 8760;

  const monthlyRate = hourlyRate * hoursPerMonth * gpuCount * utilizationRate;
  const annualRate = hourlyRate * hoursPerYear * gpuCount * utilizationRate;
  const totalCost = annualRate * timeframe;

  return { monthlyRate, annualRate, totalCost };
}
