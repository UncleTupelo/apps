// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TCOInputs, TCOResults } from '../types';

export function exportToJSON (inputs: TCOInputs, results: TCOResults, scenarioName: string): void {
  const exportData = {
    scenarioName,
    exportDate: new Date().toISOString(),
    inputs,
    results
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `gpu-tco-${scenarioName.replace(/\s+/g, '-')}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV (inputs: TCOInputs, results: TCOResults, scenarioName: string): void {
  const rows = [
    ['GPU TCO Analysis Report'],
    ['Scenario Name', scenarioName],
    ['Export Date', new Date().toLocaleString()],
    [''],
    ['=== GPU CONFIGURATION ==='],
    ['GPU Model', inputs.gpuModel.name],
    ['GPU Count', inputs.capex.gpuCount],
    ['GPU Unit Cost', `$${inputs.capex.gpuUnitCost}`],
    ['Utilization Rate', `${(inputs.utilizationRate * 100).toFixed(1)}%`],
    ['TDP (per GPU)', `${inputs.gpuModel.tdp}W`],
    ['Memory (per GPU)', `${inputs.gpuModel.memory}GB`],
    ['Compute Performance', `${inputs.gpuModel.computePerformance} TFLOPS`],
    [''],
    ['=== CAPITAL EXPENDITURE ==='],
    ['GPU Hardware', `$${(inputs.capex.gpuCount * inputs.capex.gpuUnitCost).toLocaleString()}`],
    ['Server Count', inputs.capex.serverCount],
    ['Server Unit Cost', `$${inputs.capex.serverUnitCost.toLocaleString()}`],
    ['Total Server Cost', `$${(inputs.capex.serverCount * inputs.capex.serverUnitCost).toLocaleString()}`],
    ['Networking Cost', `$${inputs.capex.networkingCost.toLocaleString()}`],
    ['Racking Cost', `$${inputs.capex.rackingCost.toLocaleString()}`],
    ['Installation Cost', `$${inputs.capex.installationCost.toLocaleString()}`],
    ['Facility Cost', `$${inputs.capex.facilityCost.toLocaleString()}`],
    ['Total CapEx', `$${results.totalCapex.toLocaleString()}`],
    [''],
    ['=== OPERATING EXPENDITURE (ANNUAL) ==='],
    ['Power Cost per kWh', `$${inputs.opex.powerCostPerKWh}`],
    ['Cooling Overhead', `${(inputs.opex.coolingOverhead * 100).toFixed(1)}%`],
    ['Power Consumption', `${results.powerConsumption.totalWatts.toLocaleString()}W`],
    ['Annual kWh', `${results.powerConsumption.annualKWh.toLocaleString()}`],
    ['Annual Power Cost', `$${results.powerConsumption.annualCost.toLocaleString()}`],
    ['Annual Cooling Cost', `$${(results.powerConsumption.annualCost * inputs.opex.coolingOverhead).toLocaleString()}`],
    ['Annual Maintenance', `$${inputs.opex.maintenanceCostPerYear.toLocaleString()}`],
    ['Annual Staff Cost', `$${inputs.opex.staffCostPerYear.toLocaleString()}`],
    ['Annual Software Licenses', `$${inputs.opex.softwareLicensesPerYear.toLocaleString()}`],
    ['Annual Network Bandwidth', `$${inputs.opex.networkBandwidthPerYear.toLocaleString()}`],
    ['Annual Facility Lease', `$${inputs.opex.facilityLeasePerYear.toLocaleString()}`],
    ['Total Annual OpEx', `$${results.annualOpex.toLocaleString()}`],
    [''],
    ['=== TCO SUMMARY ==='],
    ['Timeframe', `${inputs.timeframe} years`],
    ['Depreciation Period', `${inputs.depreciationPeriod} years`],
    ['Total Capital Expenditure', `$${results.totalCapex.toLocaleString()}`],
    ['Total Operating Expenditure', `$${results.totalOpex.toLocaleString()}`],
    ['Total Cost of Ownership', `$${results.totalTCO.toLocaleString()}`],
    ['Annual TCO (Amortized)', `$${results.annualTCO.toLocaleString()}`],
    ['Cost per GPU per Year', `$${results.costPerGPUPerYear.toLocaleString()}`],
    ['Cost per GPU per Hour', `$${results.costPerGPUHour.toFixed(3)}`],
    [''],
    ['=== ROI ANALYSIS ==='],
    ['Break-even Years', results.roi.breakEvenYears > 0 ? results.roi.breakEvenYears.toFixed(2) : 'N/A'],
    ['Payback Period', results.roi.paybackPeriod > 0 ? `${results.roi.paybackPeriod.toFixed(2)} years` : 'N/A']
  ];

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `gpu-tco-${scenarioName.replace(/\s+/g, '-')}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON (file: File): Promise<{ inputs: TCOInputs; scenarioName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        resolve({
          inputs: data.inputs,
          scenarioName: data.scenarioName || 'Imported Configuration'
        });
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
