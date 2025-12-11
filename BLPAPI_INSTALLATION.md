# Bloomberg API (blpapi) Installation

## Issue
The blpapi Python package requires authentication to access Bloomberg's private repository.

## Error Details
- Repository URL: `https://blpapi.bloomberg.com/repository/releases/python/simple/`
- Error: HTTP 403 Forbidden
- This indicates that credentials are required to access the Bloomberg package repository

## Installation Options

### Option 1: Bloomberg Terminal Access
If you have access to a Bloomberg Terminal and proper credentials:

```bash
python -m pip install --index-url=https://blpapi.bloomberg.com/repository/releases/python/simple/ blpapi
```

You may need to configure authentication credentials with Bloomberg first.

### Option 2: Download Directly
Download the package directly from Bloomberg's website (requires Bloomberg credentials):
- Visit: https://www.bloomberg.com/professional/support/api-library/
- Download the appropriate wheel file for your Python version and platform
- Install using: `pip install /path/to/downloaded/blpapi-*.whl`

### Option 3: Use Bloomberg-Provided Credentials
If your organization has Bloomberg API access, contact your Bloomberg representative for:
- Repository access credentials
- Configuration instructions for pip authentication
- Appropriate `.pypirc` or `pip.conf` setup

## System Requirements
- Python 3.11.14 (current environment)
- Linux x86_64 (current platform)
- Valid Bloomberg license and credentials

## Next Steps
1. Obtain Bloomberg API credentials from your organization
2. Configure pip authentication (if using repository method)
3. Install the package using one of the methods above
4. Verify installation with: `python -c "import blpapi; print(blpapi.__version__)"`
