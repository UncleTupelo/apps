// Copyright 2017-2021 @polkadot/app-llm-calculator authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface GPUSpec {
  name: string;
  memory: number; // GB
  bandwidth: number; // GB/s
  fp16Tflops: number; // TFLOPS
  fp32Tflops: number; // TFLOPS
  costPerHour: number; // USD per hour
}

export interface CalculatorInputs {
  modelParameters: number; // in billions
  trainingTokens: number; // in billions
  gpuType: string;
  numGPUs: number;
  precision: 'fp16' | 'fp32' | 'bf16';
  batchSize: number;
  sequenceLength: number;
  epochs: number;
}

export interface CalculationResults {
  totalFLOPs: number;
  trainingTimeHours: number;
  trainingTimeDays: number;
  totalCost: number;
  memoryPerGPU: number;
  memoryRequired: number;
  throughputTokensPerSec: number;
  utilizationPercent: number;
}
