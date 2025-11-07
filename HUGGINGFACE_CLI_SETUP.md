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

## Common Commands

- `hf auth` - Manage authentication (login, logout, etc.)
- `hf download` - Download files from the Hub
- `hf upload` - Upload a file or folder to the Hub
- `hf repo` - Manage repos on the Hub
- `hf --help` - Show all available commands

## Current Installation

- Hugging Face Hub version: **1.1.2**
- Python package: Installed at `/usr/local/lib/python3.11/dist-packages`
- CLI command: `hf` (via uvx)
