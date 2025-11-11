# Hugging Face CLI Installation

This document provides installation instructions for the Hugging Face CLI on different platforms.

## Windows Installation

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://hf.co/cli/install.ps1 | iex"
```

## Linux/macOS Installation

### Method 1: Using uvx (Recommended)

First, install uv if not already installed:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Then run the Hugging Face CLI using uvx:
```bash
uvx --from huggingface-hub hf [command]
```

### Method 2: Using pip

Install the huggingface_hub package:
```bash
pip3 install huggingface_hub
```

Then run using:
```bash
python3 -m huggingface_hub.cli.hf [command]
```

Or with uvx:
```bash
uvx --from huggingface-hub hf [command]
```

## Verification

Check the CLI is working:
```bash
uvx --from huggingface-hub hf version
```

## Most Relevant Commands & Usage

### 1. Authentication (First Step)

**Login to Hugging Face:**
```bash
uvx --from huggingface-hub hf auth login
```
You'll be prompted for a token from https://huggingface.co/settings/tokens

**Check who you're logged in as:**
```bash
uvx --from huggingface-hub hf auth whoami
```

**Logout:**
```bash
uvx --from huggingface-hub hf auth logout
```

### 2. Downloading Models & Datasets (Most Common)

**Download entire model:**
```bash
# Example: Download GPT-2
uvx --from huggingface-hub hf download gpt2

# Example: Download Llama 2
uvx --from huggingface-hub hf download meta-llama/Llama-2-7b-hf
```

**Download specific files:**
```bash
# Download only config and tokenizer
uvx --from huggingface-hub hf download bert-base-uncased config.json tokenizer.json

# Download all JSON files (pattern matching)
uvx --from huggingface-hub hf download gpt2 --include "*.json"
```

**Download to specific directory:**
```bash
uvx --from huggingface-hub hf download gpt2 --local-dir ./my-models/gpt2
```

**Download a dataset:**
```bash
uvx --from huggingface-hub hf download --repo-type dataset squad

# Or specific dataset files
uvx --from huggingface-hub hf download --repo-type dataset squad train.json
```

### 3. Uploading Files

**Upload a single file:**
```bash
uvx --from huggingface-hub hf upload username/my-model model.safetensors
```

**Upload entire folder:**
```bash
uvx --from huggingface-hub hf upload username/my-model ./model-folder
```

**Upload to specific path in repo:**
```bash
uvx --from huggingface-hub hf upload username/my-model ./local-file.txt data/remote-file.txt
```

### 4. Repository Management

**Create a new repository:**
```bash
# Create model repo
uvx --from huggingface-hub hf repo create my-awesome-model

# Create dataset repo
uvx --from huggingface-hub hf repo create my-dataset --repo-type dataset

# Create private repo
uvx --from huggingface-hub hf repo create my-private-model --private
```

**Delete a repository:**
```bash
uvx --from huggingface-hub hf repo delete username/my-model
```

### 5. Cache Management

**List cached models:**
```bash
uvx --from huggingface-hub hf cache ls
```

**Remove cached model:**
```bash
uvx --from huggingface-hub hf cache rm gpt2
```

**Prune unused cache:**
```bash
uvx --from huggingface-hub hf cache prune
```

### 6. Useful Options

**Quiet mode (less output):**
```bash
uvx --from huggingface-hub hf download gpt2 --quiet
```

**Specific revision (branch/tag):**
```bash
uvx --from huggingface-hub hf download gpt2 --revision v1.0
```

**Include/exclude patterns:**
```bash
# Download only safetensors files
uvx --from huggingface-hub hf download username/model --include "*.safetensors"

# Exclude large files
uvx --from huggingface-hub hf download username/model --exclude "*.bin"
```

## Quick Reference

| Task | Command |
|------|---------|
| Login | `hf auth login` |
| Download model | `hf download model-name` |
| Download dataset | `hf download --repo-type dataset dataset-name` |
| Upload file | `hf upload username/repo-name file.txt` |
| Create repo | `hf repo create repo-name` |
| List cache | `hf cache ls` |
| Check version | `hf version` |
| Get help | `hf --help` or `hf [command] --help` |

## Pro Tip: Create an Alias

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
alias hf='uvx --from huggingface-hub hf'
```

Then reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

Now you can use shorter commands:
```bash
hf download gpt2
hf auth login
hf upload username/my-model file.txt
```

## Current Installation

- Hugging Face Hub version: **1.1.2**
- Python package: Installed at `/usr/local/lib/python3.11/dist-packages`
- CLI command: `hf` (via uvx)
- Cache location: `~/.cache/huggingface/hub`
