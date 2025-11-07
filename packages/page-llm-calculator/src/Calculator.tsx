// Copyright 2017-2021 @polkadot/app-llm-calculator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CalculationResults, CalculatorInputs } from './types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Dropdown, Input } from '@polkadot/react-components';

import { calculateTrainingMetrics, formatCurrency, formatDuration, formatNumber } from './calculations';
import { getGPUList, GPU_DATABASE } from './gpuDatabase';

interface Props {
  className?: string;
}

const PRECISION_OPTIONS = [
  { text: 'FP16 (Half Precision)', value: 'fp16' },
  { text: 'FP32 (Full Precision)', value: 'fp32' },
  { text: 'BF16 (Brain Float)', value: 'bf16' }
];

function LLMCalculator ({ className }: Props): React.ReactElement<Props> {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    modelParameters: 7,
    trainingTokens: 1000,
    gpuType: 'A100-80GB',
    numGPUs: 8,
    precision: 'fp16',
    batchSize: 256,
    sequenceLength: 2048,
    epochs: 1
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  // GPU options for dropdown
  const gpuOptions = getGPUList().map((key) => ({
    text: GPU_DATABASE[key].name,
    value: key
  }));

  const updateInput = useCallback((field: keyof CalculatorInputs, value: string | number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const calculate = useCallback(() => {
    const calculatedResults = calculateTrainingMetrics(inputs);

    setResults(calculatedResults);
  }, [inputs]);

  // Auto-calculate on input change
  useEffect(() => {
    calculate();
  }, [calculate]);

  const selectedGPU = GPU_DATABASE[inputs.gpuType];

  return (
    <div className={className}>
      <h1>LLM Training Time and Cost Calculator</h1>

      <div className='calculator-container'>
        <section className='input-section'>
          <h2>Model Configuration</h2>

          <div className='input-group'>
            <label>Model Parameters (Billions)</label>
            <Input
              isDecimal
              label='Model Parameters'
              onChange={(value) => updateInput('modelParameters', parseFloat(value) || 0)}
              value={inputs.modelParameters.toString()}
            />
            <span className='hint'>e.g., 7 for 7B model, 13 for 13B, 70 for 70B</span>
          </div>

          <div className='input-group'>
            <label>Training Tokens (Billions)</label>
            <Input
              isDecimal
              label='Training Tokens'
              onChange={(value) => updateInput('trainingTokens', parseFloat(value) || 0)}
              value={inputs.trainingTokens.toString()}
            />
            <span className='hint'>Total number of tokens to train on</span>
          </div>

          <div className='input-group'>
            <label>Epochs</label>
            <Input
              isDecimal
              label='Epochs'
              onChange={(value) => updateInput('epochs', parseFloat(value) || 1)}
              value={inputs.epochs.toString()}
            />
          </div>

          <h2>Hardware Configuration</h2>

          <div className='input-group'>
            <label>GPU Type</label>
            <Dropdown
              label='GPU Type'
              onChange={(value) => updateInput('gpuType', value)}
              options={gpuOptions}
              value={inputs.gpuType}
            />
          </div>

          {selectedGPU && (
            <div className='gpu-specs'>
              <div className='spec-row'>
                <span>Memory:</span> <strong>{selectedGPU.memory} GB</strong>
              </div>
              <div className='spec-row'>
                <span>Bandwidth:</span> <strong>{selectedGPU.bandwidth} GB/s</strong>
              </div>
              <div className='spec-row'>
                <span>FP16 Performance:</span> <strong>{selectedGPU.fp16Tflops} TFLOPS</strong>
              </div>
              <div className='spec-row'>
                <span>Cost:</span> <strong>{formatCurrency(selectedGPU.costPerHour)}/hour</strong>
              </div>
            </div>
          )}

          <div className='input-group'>
            <label>Number of GPUs</label>
            <Input
              isDecimal
              label='Number of GPUs'
              onChange={(value) => updateInput('numGPUs', parseInt(value) || 1)}
              value={inputs.numGPUs.toString()}
            />
          </div>

          <div className='input-group'>
            <label>Precision</label>
            <Dropdown
              label='Precision'
              onChange={(value) => updateInput('precision', value as 'fp16' | 'fp32' | 'bf16')}
              options={PRECISION_OPTIONS}
              value={inputs.precision}
            />
          </div>

          <div className='input-group'>
            <label>Batch Size</label>
            <Input
              isDecimal
              label='Batch Size'
              onChange={(value) => updateInput('batchSize', parseInt(value) || 1)}
              value={inputs.batchSize.toString()}
            />
          </div>

          <div className='input-group'>
            <label>Sequence Length</label>
            <Input
              isDecimal
              label='Sequence Length'
              onChange={(value) => updateInput('sequenceLength', parseInt(value) || 512)}
              value={inputs.sequenceLength.toString()}
            />
          </div>

          <Button
            icon='refresh'
            label='Recalculate'
            onClick={calculate}
          />
        </section>

        <section className='results-section'>
          <h2>Training Estimates</h2>

          {results ? (
            <div className='results-grid'>
              <div className='result-card highlight'>
                <div className='result-label'>Estimated Training Time</div>
                <div className='result-value'>{formatDuration(results.trainingTimeHours)}</div>
                <div className='result-detail'>
                  {results.trainingTimeHours.toFixed(2)} hours ({results.trainingTimeDays.toFixed(2)} days)
                </div>
              </div>

              <div className='result-card highlight'>
                <div className='result-label'>Estimated Total Cost</div>
                <div className='result-value'>{formatCurrency(results.totalCost)}</div>
                <div className='result-detail'>
                  {formatCurrency(selectedGPU.costPerHour)}/hour × {inputs.numGPUs} GPUs
                </div>
              </div>

              <div className='result-card'>
                <div className='result-label'>Total FLOPs</div>
                <div className='result-value'>{formatNumber(results.totalFLOPs, 2)}</div>
                <div className='result-detail'>Floating point operations</div>
              </div>

              <div className='result-card'>
                <div className='result-label'>Memory Required</div>
                <div className='result-value'>{results.memoryRequired.toFixed(2)} GB</div>
                <div className='result-detail'>
                  {results.memoryPerGPU.toFixed(2)} GB per GPU
                </div>
              </div>

              <div className='result-card'>
                <div className='result-label'>Throughput</div>
                <div className='result-value'>{formatNumber(results.throughputTokensPerSec, 2)}</div>
                <div className='result-detail'>tokens/second</div>
              </div>

              <div className='result-card'>
                <div className='result-label'>GPU Utilization (Est.)</div>
                <div className='result-value'>{results.utilizationPercent.toFixed(1)}%</div>
                <div className='result-detail'>Estimated efficiency</div>
              </div>

              <div className='info-box'>
                <h3>Calculation Notes</h3>
                <ul>
                  <li><strong>FLOPs Formula:</strong> 6 × Parameters × Tokens</li>
                  <li><strong>Factor of 6:</strong> 2 FLOPs for forward pass + 4 FLOPs for backward pass</li>
                  <li><strong>Memory:</strong> Includes model weights, gradients, and optimizer states (×6 multiplier)</li>
                  <li><strong>Training Time:</strong> Theoretical minimum; actual time may vary with overhead</li>
                  <li><strong>Cost:</strong> Based on cloud GPU pricing; on-premise costs will differ</li>
                </ul>
              </div>

              {results.memoryPerGPU > selectedGPU.memory && (
                <div className='warning-box'>
                  <strong>⚠️ Memory Warning:</strong> Required memory per GPU ({results.memoryPerGPU.toFixed(2)} GB) exceeds
                  available GPU memory ({selectedGPU.memory} GB). Consider:
                  <ul>
                    <li>Using more GPUs</li>
                    <li>Reducing batch size or sequence length</li>
                    <li>Using gradient checkpointing or other memory optimization techniques</li>
                    <li>Choosing a GPU with more memory</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className='no-results'>
              <p>Enter your model and hardware configuration to see training estimates.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default React.memo(styled(LLMCalculator)`
  padding: 1.5rem;

  h1 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
  }

  h2 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 500;
  }

  h3 {
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .calculator-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  .input-section {
    padding: 1.5rem;
    background: var(--bg-page);
    border-radius: 0.5rem;
    border: 1px solid var(--border-table);
  }

  .results-section {
    padding: 1.5rem;
    background: var(--bg-page);
    border-radius: 0.5rem;
    border: 1px solid var(--border-table);
  }

  .input-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--color-label);
    }

    .hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.85rem;
      color: var(--color-summary);
    }
  }

  .gpu-specs {
    margin: 1rem 0;
    padding: 1rem;
    background: var(--bg-table);
    border-radius: 0.375rem;
    border: 1px solid var(--border-table);

    .spec-row {
      display: flex;
      justify-content: space-between;
      padding: 0.375rem 0;

      span {
        color: var(--color-summary);
      }

      strong {
        color: var(--color-text);
      }
    }
  }

  .results-grid {
    display: grid;
    gap: 1rem;
  }

  .result-card {
    padding: 1.25rem;
    background: var(--bg-table);
    border-radius: 0.375rem;
    border: 1px solid var(--border-table);

    &.highlight {
      background: var(--bg-tabs);
      border-color: var(--color-button);
      border-width: 2px;
    }

    .result-label {
      font-size: 0.9rem;
      color: var(--color-summary);
      margin-bottom: 0.5rem;
    }

    .result-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 0.25rem;
    }

    .result-detail {
      font-size: 0.85rem;
      color: var(--color-summary);
    }
  }

  .info-box {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--bg-tabs);
    border-radius: 0.375rem;
    border: 1px solid var(--border-table);

    ul {
      margin: 0.5rem 0 0 1.5rem;

      li {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: var(--color-summary);
      }
    }
  }

  .warning-box {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(255, 165, 0, 0.1);
    border-radius: 0.375rem;
    border: 1px solid rgba(255, 165, 0, 0.3);
    color: var(--color-text);

    strong {
      display: block;
      margin-bottom: 0.5rem;
    }

    ul {
      margin: 0.5rem 0 0 1.5rem;

      li {
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
      }
    }
  }

  .no-results {
    padding: 2rem;
    text-align: center;
    color: var(--color-summary);
  }
`);
