// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface GPUModel {
  name: string;
  manufacturer: string;
  memory: number; // GB
  tdp: number; // Watts
  msrp: number; // USD
  computePerformance: number; // TFLOPS
  memoryBandwidth: number; // GB/s
}

export interface CapitalExpenditure {
  gpuCount: number;
  gpuUnitCost: number;
  serverCount: number;
  serverUnitCost: number;
  networkingCost: number;
  rackingCost: number;
  installationCost: number;
  facilityCost: number;
}

export interface OperatingExpenditure {
  powerCostPerKWh: number;
  coolingOverhead: number; // Percentage (e.g., 0.3 for 30%)
  maintenanceCostPerYear: number;
  staffCostPerYear: number;
  softwareLicensesPerYear: number;
  networkBandwidthPerYear: number;
  facilityLeasePerYear: number;
}

export interface TCOInputs {
  gpuModel: GPUModel;
  capex: CapitalExpenditure;
  opex: OperatingExpenditure;
  utilizationRate: number; // Percentage (0-1)
  timeframe: number; // Years
  depreciationPeriod: number; // Years
}

export interface TCOResults {
  totalCapex: number;
  annualOpex: number;
  totalOpex: number;
  totalTCO: number;
  annualTCO: number;
  costPerGPUPerYear: number;
  costPerGPUHour: number;
  powerConsumption: {
    totalWatts: number;
    annualKWh: number;
    annualCost: number;
  };
  roi: {
    breakEvenYears: number;
    paybackPeriod: number;
  };
}

export interface CloudProviderComparison {
  provider: string;
  instanceType: string;
  gpuCount: number;
  hourlyRate: number;
  monthlyRate: number;
  annualRate: number;
}

export interface Scenario {
  id: string;
  name: string;
  inputs: TCOInputs;
  results: TCOResults;
  createdAt: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export const GPU_PRESETS: Record<string, GPUModel> = {
  'NVIDIA A100': {
    name: 'NVIDIA A100 80GB',
    manufacturer: 'NVIDIA',
    memory: 80,
    tdp: 400,
    msrp: 15000,
    computePerformance: 312,
    memoryBandwidth: 2039
  },
  'NVIDIA H100': {
    name: 'NVIDIA H100 80GB',
    manufacturer: 'NVIDIA',
    memory: 80,
    tdp: 700,
    msrp: 30000,
    computePerformance: 756,
    memoryBandwidth: 3350
  },
  'NVIDIA V100': {
    name: 'NVIDIA V100 32GB',
    manufacturer: 'NVIDIA',
    memory: 32,
    tdp: 300,
    msrp: 9000,
    computePerformance: 125,
    memoryBandwidth: 900
  },
  'NVIDIA L40': {
    name: 'NVIDIA L40 48GB',
    manufacturer: 'NVIDIA',
    memory: 48,
    tdp: 300,
    msrp: 7500,
    computePerformance: 181,
    memoryBandwidth: 864
  },
  'AMD MI250X': {
    name: 'AMD MI250X 128GB',
    manufacturer: 'AMD',
    memory: 128,
    tdp: 560,
    msrp: 12000,
    computePerformance: 362,
    memoryBandwidth: 3277
  }
};

export const DEFAULT_INPUTS: TCOInputs = {
  gpuModel: GPU_PRESETS['NVIDIA A100'],
  capex: {
    gpuCount: 8,
    gpuUnitCost: 15000,
    serverCount: 1,
    serverUnitCost: 5000,
    networkingCost: 10000,
    rackingCost: 5000,
    installationCost: 5000,
    facilityCost: 0
  },
  opex: {
    powerCostPerKWh: 0.12,
    coolingOverhead: 0.3,
    maintenanceCostPerYear: 10000,
    staffCostPerYear: 150000,
    softwareLicensesPerYear: 5000,
    networkBandwidthPerYear: 12000,
    facilityLeasePerYear: 50000
  },
  utilizationRate: 0.8,
  timeframe: 3,
  depreciationPeriod: 5
};
