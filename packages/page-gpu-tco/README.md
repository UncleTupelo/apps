# @polkadot/app-gpu-tco

GPU Datacenter Total Cost of Ownership (TCO) Dashboard

## Overview

This package provides a comprehensive dashboard for calculating and analyzing the Total Cost of Ownership for GPU datacenters. It includes:

- **Capital Expenditure (CapEx)**: Hardware costs, setup, and installation
- **Operating Expenditure (OpEx)**: Power, cooling, maintenance, and staffing
- **ROI Analysis**: Return on investment calculations and break-even projections
- **GPU Comparisons**: Compare different GPU models and configurations
- **Scenario Planning**: Save, load, and compare multiple "what-if" scenarios
- **Visual Analytics**: Charts and graphs for cost breakdown and trends
- **Data Persistence**: Auto-save configurations with localStorage
- **Export Capabilities**: Export reports in CSV and JSON formats

## Features

### Core Functionality
- **Real-time TCO calculations** with instant updates
- **Multiple GPU model presets**: NVIDIA A100, H100, V100, L40, AMD MI250X
- **Customizable cost parameters** for all CapEx and OpEx items
- **Input validation** to ensure data integrity
- **Mobile responsive** design for use on any device

### ROI Analysis
- Break-even period calculations
- Payback period projections
- Suggested pricing strategies with different profit margins
- Revenue projections based on utilization rates

### Scenario Management
- **Save scenarios** with custom names
- **Load saved scenarios** for comparison
- **Export scenarios** to JSON or CSV
- **Import scenarios** from JSON files
- **Delete scenarios** when no longer needed
- Auto-saved current configuration

### Export Options
- **CSV Export**: Detailed report with all inputs and results
- **JSON Export**: Full configuration data for sharing and backup
- **Import**: Load previously exported JSON configurations

### Data Persistence
- Automatic localStorage save of current configuration
- Configuration restored on page reload
- Multiple saved scenarios stored locally

## Usage

Access the dashboard through the navigation menu under "GPU TCO Dashboard" or navigate to `/gpu-tco`.

### Quick Start
1. Select your GPU model from the dropdown
2. Configure GPU count and utilization rate
3. Adjust CapEx and OpEx values as needed
4. View real-time TCO calculations and ROI analysis
5. Save your scenario for future reference
6. Export results as CSV or JSON

### Managing Scenarios
- Click **"Save Scenario"** to save current configuration
- Use scenario list to **load, export, or delete** saved scenarios
- Click **"Reset to Defaults"** to start fresh

### Exporting Data
- **Export JSON**: Full configuration data for backup or sharing
- **Export CSV**: Formatted report ready for spreadsheet analysis
- **Import JSON**: Load previously saved configurations

## Technical Details

### Components
- `index.tsx`: Main dashboard application
- `SummaryCard.tsx`: Metric display cards
- `InputSection.tsx`: Collapsible input sections
- `CostBreakdownChart.tsx`: Visual cost breakdown
- `ROICard.tsx`: ROI analysis and pricing suggestions
- `ScenarioManager.tsx`: Scenario save/load/export UI

### Utilities
- `calculations.ts`: TCO calculation engine
- `storage.ts`: localStorage persistence
- `export.ts`: CSV and JSON export/import functions
