// Copyright 2017-2021 @polkadot/app-llm-calculator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CalculationResults, CalculatorInputs } from './types';

import { getGPUSpec } from './gpuDatabase';

/**
 * Calculate training time and cost for LLM training
 *
 * Key formula: C = 6 × N × D
 * Where:
 * - C = Total compute (FLOPs)
 * - N = Number of parameters
 * - D = Number of tokens in dataset
 * - Factor of 6 accounts for forward pass (2×), backward pass (4×)
 *
 * Training time: T = C / (num_GPUs × GPU_throughput)
 * Memory required: M = N × bytes_per_param × memory_multiplier
 * - memory_multiplier = 6 for mixed precision training (model + gradients + optimizer states)
 */
export function calculateTrainingMetrics(inputs: CalculatorInputs): CalculationResults | null {
  const gpuSpec = getGPUSpec(inputs.gpuType);

  if (!gpuSpec) {
    return null;
  }

  // Convert billions to actual numbers
  const numParameters = inputs.modelParameters * 1e9;
  const numTokens = inputs.trainingTokens * 1e9;

  // Calculate total FLOPs required
  // Formula: 6 × N × D (where 6 = 2 for forward + 4 for backward)
  const totalFLOPs = 6 * numParameters * numTokens;

  // Get GPU throughput based on precision
  let gpuThroughput: number;
  let bytesPerParameter: number;

  switch (inputs.precision) {
    case 'fp32':
      gpuThroughput = gpuSpec.fp32Tflops * 1e12; // Convert TFLOPS to FLOPS
      bytesPerParameter = 4;
      break;
    case 'fp16':
    case 'bf16':
      gpuThroughput = gpuSpec.fp16Tflops * 1e12;
      bytesPerParameter = 2;
      break;
    default:
      gpuThroughput = gpuSpec.fp16Tflops * 1e12;
      bytesPerParameter = 2;
  }

  // Calculate training time in seconds
  const totalThroughput = inputs.numGPUs * gpuThroughput;
  const trainingTimeSeconds = totalFLOPs / totalThroughput;
  const trainingTimeHours = trainingTimeSeconds / 3600;
  const trainingTimeDays = trainingTimeHours / 24;

  // Calculate total cost
  const totalCost = trainingTimeHours * inputs.numGPUs * gpuSpec.costPerHour;

  // Calculate memory requirements
  // Memory = parameters × bytes_per_param × memory_multiplier
  // memory_multiplier = 6 for training (model + gradients + optimizer states)
  const memoryMultiplier = 6;
  const totalMemoryGB = (numParameters * bytesPerParameter * memoryMultiplier) / 1e9;
  const memoryPerGPU = totalMemoryGB / inputs.numGPUs;

  // Calculate throughput (tokens per second)
  const throughputTokensPerSec = numTokens / trainingTimeSeconds;

  // Calculate GPU utilization (simplified estimation)
  // Actual utilization is complex and depends on many factors
  // This is a rough estimate based on memory bandwidth vs compute
  const memoryBandwidthUtilization = Math.min(100, (totalMemoryGB / gpuSpec.memory) * 100);
  const utilizationPercent = Math.min(85, memoryBandwidthUtilization); // 85% is a typical max for training

  return {
    totalFLOPs,
    trainingTimeHours,
    trainingTimeDays,
    totalCost,
    memoryPerGPU,
    memoryRequired: totalMemoryGB,
    throughputTokensPerSec,
    utilizationPercent
  };
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number, decimals = 2): string {
  if (num >= 1e15) {
    return (num / 1e15).toFixed(decimals) + 'P';
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(decimals) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K';
  }

  return num.toFixed(decimals);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Format time duration
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);

    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (hours < 24) {
    return `${hours.toFixed(2)} hours`;
  } else if (hours < 24 * 7) {
    const days = hours / 24;

    return `${days.toFixed(2)} days`;
  } else if (hours < 24 * 30) {
    const weeks = hours / (24 * 7);

    return `${weeks.toFixed(2)} weeks`;
  } else if (hours < 24 * 365) {
    const months = hours / (24 * 30);

    return `${months.toFixed(2)} months`;
  } else {
    const years = hours / (24 * 365);

    return `${years.toFixed(2)} years`;
  }
}
