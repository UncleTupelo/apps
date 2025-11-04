// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import CostBreakdownChart from './components/CostBreakdownChart';
import InputSection from './components/InputSection';
import SummaryCard from './components/SummaryCard';
import { DEFAULT_INPUTS, GPU_PRESETS } from './types';
import type { CapitalExpenditure, GPUModel, OperatingExpenditure, TCOInputs } from './types';
import { calculateTCO, formatCurrency, formatNumber, formatPower } from './utils/calculations';

interface Props {
  basePath: string;
  className?: string;
}

function GpuTcoApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const [inputs, setInputs] = useState<TCOInputs>(DEFAULT_INPUTS);

  // Calculate TCO results
  const results = useMemo(() => calculateTCO(inputs), [inputs]);

  // Handler for GPU model selection
  const handleGPUModelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const gpuModel = GPU_PRESETS[e.target.value];

    setInputs((prev) => ({
      ...prev,
      gpuModel,
      capex: {
        ...prev.capex,
        gpuUnitCost: gpuModel.msrp
      }
    }));
  }, []);

  // Handler for CapEx changes
  const handleCapexChange = useCallback((field: keyof CapitalExpenditure, value: number) => {
    setInputs((prev) => ({
      ...prev,
      capex: {
        ...prev.capex,
        [field]: value
      }
    }));
  }, []);

  // Handler for OpEx changes
  const handleOpexChange = useCallback((field: keyof OperatingExpenditure, value: number) => {
    setInputs((prev) => ({
      ...prev,
      opex: {
        ...prev.opex,
        [field]: value
      }
    }));
  }, []);

  // Handler for general input changes
  const handleInputChange = useCallback((field: keyof TCOInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Prepare chart data for CapEx breakdown
  const capexChartData = useMemo(() => [
    { label: 'GPU Hardware', value: inputs.capex.gpuCount * inputs.capex.gpuUnitCost, color: '#3498db' },
    { label: 'Servers', value: inputs.capex.serverCount * inputs.capex.serverUnitCost, color: '#2ecc71' },
    { label: 'Networking', value: inputs.capex.networkingCost, color: '#9b59b6' },
    { label: 'Racking', value: inputs.capex.rackingCost, color: '#f39c12' },
    { label: 'Installation', value: inputs.capex.installationCost, color: '#e74c3c' },
    { label: 'Facility', value: inputs.capex.facilityCost, color: '#1abc9c' }
  ].filter(item => item.value > 0), [inputs.capex]);

  // Prepare chart data for OpEx breakdown
  const opexChartData = useMemo(() => [
    { label: 'Power', value: results.powerConsumption.annualCost, color: '#e74c3c' },
    { label: 'Cooling', value: results.powerConsumption.annualCost * inputs.opex.coolingOverhead, color: '#3498db' },
    { label: 'Maintenance', value: inputs.opex.maintenanceCostPerYear, color: '#f39c12' },
    { label: 'Staff', value: inputs.opex.staffCostPerYear, color: '#9b59b6' },
    { label: 'Software Licenses', value: inputs.opex.softwareLicensesPerYear, color: '#2ecc71' },
    { label: 'Network Bandwidth', value: inputs.opex.networkBandwidthPerYear, color: '#1abc9c' },
    { label: 'Facility Lease', value: inputs.opex.facilityLeasePerYear, color: '#34495e' }
  ].filter(item => item.value > 0), [inputs.opex, results.powerConsumption.annualCost]);

  return (
    <StyledMain className={className}>
      <Header>
        <Title>GPU Datacenter TCO Dashboard</Title>
        <Subtitle>Total Cost of Ownership Analysis and Planning</Subtitle>
      </Header>

      {/* Summary Cards */}
      <SummaryGrid>
        <SummaryCard
          title="Total TCO"
          value={formatCurrency(results.totalTCO)}
          subtitle={`Over ${inputs.timeframe} years`}
          icon="dollar-sign"
        />
        <SummaryCard
          title="Annual TCO"
          value={formatCurrency(results.annualTCO)}
          subtitle="Per year average"
          icon="calendar-alt"
        />
        <SummaryCard
          title="Cost per GPU"
          value={formatCurrency(results.costPerGPUPerYear)}
          subtitle="Per year"
          icon="microchip"
        />
        <SummaryCard
          title="Cost per GPU Hour"
          value={`$${formatNumber(results.costPerGPUHour, 2)}`}
          subtitle="Hourly rate"
          icon="clock"
        />
        <SummaryCard
          title="Power Consumption"
          value={formatPower(results.powerConsumption.totalWatts)}
          subtitle={`${formatNumber(results.powerConsumption.annualKWh, 0)} kWh/year`}
          icon="bolt"
          trend="up"
        />
        <SummaryCard
          title="Annual Power Cost"
          value={formatCurrency(results.powerConsumption.annualCost)}
          subtitle={`At $${inputs.opex.powerCostPerKWh}/kWh`}
          icon="plug"
          trend="up"
        />
      </SummaryGrid>

      {/* Input Configuration */}
      <ConfigSection>
        <InputSection title="GPU Configuration">
          <InputGroup>
            <Label>GPU Model</Label>
            <Select value={inputs.gpuModel.name} onChange={handleGPUModelChange}>
              {Object.keys(GPU_PRESETS).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>GPU Count</Label>
            <Input
              type="number"
              value={inputs.capex.gpuCount}
              onChange={(e) => handleCapexChange('gpuCount', Number(e.target.value))}
              min={1}
            />
          </InputGroup>
          <InputGroup>
            <Label>GPU Unit Cost ($)</Label>
            <Input
              type="number"
              value={inputs.capex.gpuUnitCost}
              onChange={(e) => handleCapexChange('gpuUnitCost', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Utilization Rate (%)</Label>
            <Input
              type="number"
              value={inputs.utilizationRate * 100}
              onChange={(e) => handleInputChange('utilizationRate', Number(e.target.value) / 100)}
              min={0}
              max={100}
            />
          </InputGroup>
          <InfoBox>
            <InfoText>
              <strong>{inputs.gpuModel.name}</strong> - {inputs.gpuModel.memory}GB VRAM
              <br />
              TDP: {inputs.gpuModel.tdp}W | Performance: {inputs.gpuModel.computePerformance} TFLOPS
            </InfoText>
          </InfoBox>
        </InputSection>

        <InputSection title="Capital Expenditure (CapEx)" collapsible>
          <InputGroup>
            <Label>Server Count</Label>
            <Input
              type="number"
              value={inputs.capex.serverCount}
              onChange={(e) => handleCapexChange('serverCount', Number(e.target.value))}
              min={1}
            />
          </InputGroup>
          <InputGroup>
            <Label>Server Unit Cost ($)</Label>
            <Input
              type="number"
              value={inputs.capex.serverUnitCost}
              onChange={(e) => handleCapexChange('serverUnitCost', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Networking Cost ($)</Label>
            <Input
              type="number"
              value={inputs.capex.networkingCost}
              onChange={(e) => handleCapexChange('networkingCost', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Racking Cost ($)</Label>
            <Input
              type="number"
              value={inputs.capex.rackingCost}
              onChange={(e) => handleCapexChange('rackingCost', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Installation Cost ($)</Label>
            <Input
              type="number"
              value={inputs.capex.installationCost}
              onChange={(e) => handleCapexChange('installationCost', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Facility Cost ($)</Label>
            <Input
              type="number"
              value={inputs.capex.facilityCost}
              onChange={(e) => handleCapexChange('facilityCost', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
        </InputSection>

        <InputSection title="Operating Expenditure (OpEx)" collapsible>
          <InputGroup>
            <Label>Power Cost ($/kWh)</Label>
            <Input
              type="number"
              value={inputs.opex.powerCostPerKWh}
              onChange={(e) => handleOpexChange('powerCostPerKWh', Number(e.target.value))}
              min={0}
              step={0.01}
            />
          </InputGroup>
          <InputGroup>
            <Label>Cooling Overhead (%)</Label>
            <Input
              type="number"
              value={inputs.opex.coolingOverhead * 100}
              onChange={(e) => handleOpexChange('coolingOverhead', Number(e.target.value) / 100)}
              min={0}
              max={100}
            />
          </InputGroup>
          <InputGroup>
            <Label>Maintenance ($/year)</Label>
            <Input
              type="number"
              value={inputs.opex.maintenanceCostPerYear}
              onChange={(e) => handleOpexChange('maintenanceCostPerYear', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Staff Cost ($/year)</Label>
            <Input
              type="number"
              value={inputs.opex.staffCostPerYear}
              onChange={(e) => handleOpexChange('staffCostPerYear', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Software Licenses ($/year)</Label>
            <Input
              type="number"
              value={inputs.opex.softwareLicensesPerYear}
              onChange={(e) => handleOpexChange('softwareLicensesPerYear', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Network Bandwidth ($/year)</Label>
            <Input
              type="number"
              value={inputs.opex.networkBandwidthPerYear}
              onChange={(e) => handleOpexChange('networkBandwidthPerYear', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
          <InputGroup>
            <Label>Facility Lease ($/year)</Label>
            <Input
              type="number"
              value={inputs.opex.facilityLeasePerYear}
              onChange={(e) => handleOpexChange('facilityLeasePerYear', Number(e.target.value))}
              min={0}
            />
          </InputGroup>
        </InputSection>

        <InputSection title="Analysis Parameters">
          <InputGroup>
            <Label>Timeframe (years)</Label>
            <Input
              type="number"
              value={inputs.timeframe}
              onChange={(e) => handleInputChange('timeframe', Number(e.target.value))}
              min={1}
              max={10}
            />
          </InputGroup>
          <InputGroup>
            <Label>Depreciation Period (years)</Label>
            <Input
              type="number"
              value={inputs.depreciationPeriod}
              onChange={(e) => handleInputChange('depreciationPeriod', Number(e.target.value))}
              min={1}
              max={10}
            />
          </InputGroup>
        </InputSection>
      </ConfigSection>

      {/* Cost Breakdown Charts */}
      <ChartsSection>
        <CostBreakdownChart
          title="Capital Expenditure Breakdown"
          items={capexChartData}
          totalLabel="Total CapEx"
        />
        <CostBreakdownChart
          title="Annual Operating Expenditure Breakdown"
          items={opexChartData}
          totalLabel="Total Annual OpEx"
        />
      </ChartsSection>

      {/* TCO Summary Table */}
      <TableSection>
        <InputSection title="TCO Summary">
          <SummaryTable>
            <tbody>
              <tr>
                <td>Total Capital Expenditure</td>
                <td>{formatCurrency(results.totalCapex)}</td>
              </tr>
              <tr>
                <td>Annual Operating Expenditure</td>
                <td>{formatCurrency(results.annualOpex)}</td>
              </tr>
              <tr>
                <td>Total Operating Expenditure ({inputs.timeframe} years)</td>
                <td>{formatCurrency(results.totalOpex)}</td>
              </tr>
              <tr className="total">
                <td><strong>Total Cost of Ownership ({inputs.timeframe} years)</strong></td>
                <td><strong>{formatCurrency(results.totalTCO)}</strong></td>
              </tr>
              <tr>
                <td>Annual TCO (Amortized)</td>
                <td>{formatCurrency(results.annualTCO)}</td>
              </tr>
              <tr>
                <td>Cost per GPU per Year</td>
                <td>{formatCurrency(results.costPerGPUPerYear)}</td>
              </tr>
              <tr>
                <td>Cost per GPU per Hour</td>
                <td>${formatNumber(results.costPerGPUHour, 3)}</td>
              </tr>
            </tbody>
          </SummaryTable>
        </InputSection>
      </TableSection>
    </StyledMain>
  );
}

const StyledMain = styled.main`
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--color-summary);
  margin: 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ConfigSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-label);
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-input);
  border-radius: 0.25rem;
  background: var(--bg-input);
  color: var(--color-text);
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-label);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-input);
  border-radius: 0.25rem;
  background: var(--bg-input);
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-label);
  }
`;

const InfoBox = styled.div`
  grid-column: 1 / -1;
  padding: 1rem;
  background: var(--bg-page);
  border-radius: 0.25rem;
  border-left: 3px solid var(--color-label);
`;

const InfoText = styled.div`
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.6;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TableSection = styled.div`
  margin-bottom: 2rem;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  grid-column: 1 / -1;

  td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-table);
    font-size: 0.875rem;

    &:first-child {
      color: var(--color-label);
    }

    &:last-child {
      text-align: right;
      font-weight: 600;
      color: var(--color-text);
    }
  }

  tr.total {
    background: var(--bg-tabs);
    border-top: 2px solid var(--border-table);

    td {
      padding: 1rem 0.75rem;
      font-size: 1rem;
    }
  }
`;

export default React.memo(GpuTcoApp);
