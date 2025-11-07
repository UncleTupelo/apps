# LLM Training Time and Cost Calculator

A comprehensive calculator to estimate training time, cost, and resource requirements for Large Language Models (LLMs).

## Features

- **Accurate Training Time Estimation**: Uses the industry-standard formula `C = 6 × N × D` where C is total FLOPs, N is the number of parameters, and D is the dataset size in tokens
- **Cost Calculation**: Estimates total training costs based on GPU type, quantity, and training duration
- **Memory Requirements**: Calculates GPU memory needed including model weights, gradients, and optimizer states
- **Multiple GPU Support**: Includes specifications for H100, A100, V100, A10G, T4, P100, RTX 4090, and RTX 3090
- **Precision Options**: Supports FP16, FP32, and BF16 training precision
- **Real-time Calculations**: Auto-updates results as you adjust parameters
- **Memory Warnings**: Alerts when memory requirements exceed available GPU memory

## Usage

### Input Parameters

#### Model Configuration
- **Model Parameters**: Size of your model in billions (e.g., 7 for LLaMA-7B, 70 for LLaMA-70B)
- **Training Tokens**: Total number of tokens to train on in billions (e.g., 1000 for 1 trillion tokens)
- **Epochs**: Number of complete passes through the dataset

#### Hardware Configuration
- **GPU Type**: Select from various NVIDIA GPUs (H100, A100, V100, etc.)
- **Number of GPUs**: How many GPUs you'll use for distributed training
- **Precision**: Training precision (FP16, FP32, or BF16)
- **Batch Size**: Number of samples per training batch
- **Sequence Length**: Maximum sequence length for the model

### Output Metrics

- **Training Time**: Estimated time in hours, days, weeks, or months
- **Total Cost**: Estimated cloud training cost in USD
- **Total FLOPs**: Total floating-point operations required
- **Memory Required**: Total and per-GPU memory requirements
- **Throughput**: Tokens processed per second
- **GPU Utilization**: Estimated GPU efficiency

## Calculation Methodology

### Training FLOPs

The calculator uses the standard formula for LLM training compute:

```
C = 6 × N × D
```

Where:
- **C**: Total compute in FLOPs
- **N**: Number of model parameters
- **D**: Number of training tokens
- **6**: Multiplier accounting for forward pass (2×) and backward pass (4×)

### Training Time

```
T = C / (num_GPUs × GPU_throughput)
```

Where:
- **T**: Training time in seconds
- **GPU_throughput**: Peak TFLOPS based on precision (FP16 or FP32)

### Memory Requirements

```
M = N × bytes_per_param × 6
```

Where:
- **M**: Total memory in bytes
- **bytes_per_param**: 2 for FP16/BF16, 4 for FP32
- **6**: Multiplier for model + gradients + optimizer states (Adam)

### Cost Estimation

```
Cost = T × num_GPUs × cost_per_hour
```

## Example Scenarios

### Example 1: Training LLaMA-7B

- Model: 7B parameters
- Tokens: 1 trillion (1000B)
- GPUs: 8× A100 80GB
- Precision: FP16
- **Result**: ~26 days, ~$150,000

### Example 2: Training GPT-3 Scale (175B)

- Model: 175B parameters
- Tokens: 300B
- GPUs: 1024× A100 80GB
- Precision: FP16
- **Result**: ~34 days, ~$25M

### Example 3: Fine-tuning 13B Model

- Model: 13B parameters
- Tokens: 100B
- GPUs: 4× A100 40GB
- Precision: FP16
- **Result**: ~5 days, ~$12,000

## GPU Database

The calculator includes specifications for the following GPUs:

| GPU | Memory | Bandwidth | FP16 TFLOPS | Typical Cost/hr |
|-----|--------|-----------|-------------|-----------------|
| H100 80GB | 80 GB | 3350 GB/s | 989 | $4.50 |
| A100 80GB | 80 GB | 2039 GB/s | 312 | $3.00 |
| A100 40GB | 40 GB | 1555 GB/s | 312 | $2.50 |
| V100 32GB | 32 GB | 900 GB/s | 125 | $1.50 |
| A10G 24GB | 24 GB | 600 GB/s | 125 | $1.00 |
| T4 16GB | 16 GB | 320 GB/s | 65 | $0.60 |
| RTX 4090 | 24 GB | 1008 GB/s | 165 | $0.50 |
| RTX 3090 | 24 GB | 936 GB/s | 71 | $0.40 |

## Important Notes

1. **Theoretical Minimum**: Calculated training times represent theoretical minimums. Actual training times will be longer due to:
   - Data loading overhead
   - Gradient synchronization in distributed training
   - Checkpointing and logging
   - Network latency

2. **Memory Overhead**: The calculator uses a 6× multiplier for memory (model + gradients + optimizer states). For other optimizers or techniques (e.g., gradient checkpointing, CPU offloading), actual requirements may vary.

3. **Cost Estimates**: Costs are based on typical cloud GPU pricing. On-premise hardware costs and considerations differ significantly.

4. **Scaling Efficiency**: The calculator assumes perfect linear scaling. In practice, scaling efficiency decreases with more GPUs due to communication overhead.

## References

- [The FLOPs Calculus of Language Model Training](https://medium.com/@dzmitrybahdanau/the-flops-calculus-of-language-model-training-3b19c1f025e4)
- [Transformer Arithmetic](https://medium.com/@kailaspsudheer/the-transformers-arithmetic-527111099527)
- [Estimating Training Costs](https://arxiv.org/html/2408.04693v1)

## License

Apache-2.0
