// Copyright 2017-2021 @polkadot/app-llm-calculator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { GPUSpec } from './types';

export const GPU_DATABASE: Record<string, GPUSpec> = {
  'H100': {
    name: 'NVIDIA H100 (80GB)',
    memory: 80,
    bandwidth: 3350, // GB/s (HBM3)
    fp16Tflops: 989,
    fp32Tflops: 67,
    costPerHour: 4.50
  },
  'A100-80GB': {
    name: 'NVIDIA A100 (80GB)',
    memory: 80,
    bandwidth: 2039, // GB/s (HBM2e)
    fp16Tflops: 312,
    fp32Tflops: 19.5,
    costPerHour: 3.00
  },
  'A100-40GB': {
    name: 'NVIDIA A100 (40GB)',
    memory: 40,
    bandwidth: 1555, // GB/s (HBM2)
    fp16Tflops: 312,
    fp32Tflops: 19.5,
    costPerHour: 2.50
  },
  'V100': {
    name: 'NVIDIA V100 (32GB)',
    memory: 32,
    bandwidth: 900, // GB/s (HBM2)
    fp16Tflops: 125,
    fp32Tflops: 15.7,
    costPerHour: 1.50
  },
  'A10G': {
    name: 'NVIDIA A10G (24GB)',
    memory: 24,
    bandwidth: 600, // GB/s
    fp16Tflops: 125,
    fp32Tflops: 31.2,
    costPerHour: 1.00
  },
  'T4': {
    name: 'NVIDIA T4 (16GB)',
    memory: 16,
    bandwidth: 320, // GB/s
    fp16Tflops: 65,
    fp32Tflops: 8.1,
    costPerHour: 0.60
  },
  'P100': {
    name: 'NVIDIA P100 (16GB)',
    memory: 16,
    bandwidth: 732, // GB/s (HBM2)
    fp16Tflops: 21,
    fp32Tflops: 10.6,
    costPerHour: 0.90
  },
  'RTX4090': {
    name: 'NVIDIA RTX 4090 (24GB)',
    memory: 24,
    bandwidth: 1008, // GB/s
    fp16Tflops: 165.2,
    fp32Tflops: 82.6,
    costPerHour: 0.50
  },
  'RTX3090': {
    name: 'NVIDIA RTX 3090 (24GB)',
    memory: 24,
    bandwidth: 936, // GB/s
    fp16Tflops: 71,
    fp32Tflops: 35.6,
    costPerHour: 0.40
  }
};

export const getGPUSpec = (gpuType: string): GPUSpec | undefined => {
  return GPU_DATABASE[gpuType];
};

export const getGPUList = (): string[] => {
  return Object.keys(GPU_DATABASE);
};
