# Extraction Log

## GPU TCO Dashboard - Extracted to Python Repository

**Date:** November 16, 2025

### Summary
The GPU datacenter Total Cost of Ownership (TCO) dashboard has been removed from this repository. This feature was originally added by Claude in November 2025 and is being extracted to a separate Python repository for better maintainability and platform independence.

### Commits Removed
The following commits authored by Claude and copilot-swe-agent[bot] after the Polkadot integration (commit `0adc140d96`) have been reverted:

1. **50f144fbb5** - Claude (Nov 4, 2025): "Add GPU datacenter TCO dashboard"
   - Added comprehensive TCO calculation dashboard for GPU infrastructure
   - Supported multiple GPU models (NVIDIA A100, H100, V100, L40, AMD MI250X)
   - Implemented CapEx and OpEx tracking
   - Created interactive visualizations and cost breakdowns

2. **1be15f6705** - Claude (Nov 5, 2025): "Fix peer dependencies for GPU TCO dashboard"
   - Fixed peer dependency issues for styled-components

3. **e49d9245b6** - copilot-swe-agent[bot] (Nov 16, 2025): "Initial plan"
   - Empty commit for planning purposes

### Files Removed
- `packages/page-gpu-tco/` - Entire package directory (13 files)
- `packages/apps-routing/src/gpu-tco.ts` - Routing configuration

### Files Modified
- `packages/apps-routing/src/index.ts` - Removed import and route reference
- `tsconfig.json` - Removed path mappings for `@polkadot/app-gpu-tco`

### Migration to Python
The GPU TCO functionality will be reimplemented in Python with the following recommendations:
- **Framework:** Flask/FastAPI for backend, Streamlit/Dash for UI
- **Data Models:** Pydantic for type definitions
- **Visualization:** Plotly or Matplotlib
- **Features:** All calculation logic and UI components to be ported

### Rationale
The GPU TCO dashboard was determined to be outside the core scope of the Polkadot Apps repository, which focuses on blockchain interaction and wallet functionality. Moving this to a standalone Python repository will:
1. Allow for independent development and versioning
2. Provide better portability across different platforms
3. Enable easier integration with Python-based data science tools
4. Maintain cleaner separation of concerns in this repository

### Reference
The original implementation has been preserved in `/tmp/gpu-tco-extraction/` for migration purposes, including:
- Full source code
- Commit patches
- Migration documentation

For questions about the Python implementation, please refer to the new repository (to be created).
