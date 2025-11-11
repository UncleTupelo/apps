// Copyright 2017-2021 @polkadot/app-llm-calculator authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Simple test to verify calculations
import { calculateTrainingMetrics, formatCurrency, formatDuration } from './calculations';
import type { CalculatorInputs } from './types';

// Test Case 1: Training a 7B model (similar to LLaMA-7B)
const test1: CalculatorInputs = {
  modelParameters: 7,
  trainingTokens: 1000,
  gpuType: 'A100-80GB',
  numGPUs: 8,
  precision: 'fp16',
  batchSize: 256,
  sequenceLength: 2048,
  epochs: 1
};

console.log('Test 1: Training 7B model with 1T tokens on 8x A100');
const result1 = calculateTrainingMetrics(test1);

if (result1) {
  console.log(`- Total FLOPs: ${result1.totalFLOPs.toExponential(2)}`);
  console.log(`- Training Time: ${formatDuration(result1.trainingTimeHours)}`);
  console.log(`- Total Cost: ${formatCurrency(result1.totalCost)}`);
  console.log(`- Memory per GPU: ${result1.memoryPerGPU.toFixed(2)} GB`);
  console.log('');
}

// Test Case 2: Training a 70B model
const test2: CalculatorInputs = {
  modelParameters: 70,
  trainingTokens: 2000,
  gpuType: 'A100-80GB',
  numGPUs: 64,
  precision: 'fp16',
  batchSize: 256,
  sequenceLength: 4096,
  epochs: 1
};

console.log('Test 2: Training 70B model with 2T tokens on 64x A100');
const result2 = calculateTrainingMetrics(test2);

if (result2) {
  console.log(`- Total FLOPs: ${result2.totalFLOPs.toExponential(2)}`);
  console.log(`- Training Time: ${formatDuration(result2.trainingTimeHours)}`);
  console.log(`- Total Cost: ${formatCurrency(result2.totalCost)}`);
  console.log(`- Memory per GPU: ${result2.memoryPerGPU.toFixed(2)} GB`);
  console.log('');
}

// Test Case 3: Fine-tuning 13B model
const test3: CalculatorInputs = {
  modelParameters: 13,
  trainingTokens: 100,
  gpuType: 'A100-40GB',
  numGPUs: 4,
  precision: 'fp16',
  batchSize: 128,
  sequenceLength: 2048,
  epochs: 1
};

console.log('Test 3: Fine-tuning 13B model with 100B tokens on 4x A100');
const result3 = calculateTrainingMetrics(test3);

if (result3) {
  console.log(`- Total FLOPs: ${result3.totalFLOPs.toExponential(2)}`);
  console.log(`- Training Time: ${formatDuration(result3.trainingTimeHours)}`);
  console.log(`- Total Cost: ${formatCurrency(result3.totalCost)}`);
  console.log(`- Memory per GPU: ${result3.memoryPerGPU.toFixed(2)} GB`);
}

export {};
