// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { formatNumber } from '../utils/calculations';

interface Props {
  className?: string;
  breakEvenYears: number;
  paybackPeriod: number;
  annualTCO: number;
  costPerGPUHour: number;
}

function ROICard ({ className, breakEvenYears, paybackPeriod, annualTCO, costPerGPUHour }: Props): React.ReactElement {
  // Calculate suggested pricing (with margins)
  const suggestedHourlyRate50 = costPerGPUHour * 1.5; // 50% margin
  const suggestedHourlyRate100 = costPerGPUHour * 2.0; // 100% margin
  const suggestedHourlyRate150 = costPerGPUHour * 2.5; // 150% margin

  return (
    <StyledCard className={className}>
      <CardHeader>
        <CardTitle>Return on Investment Analysis</CardTitle>
      </CardHeader>

      <CardContent>
        <Section>
          <SectionTitle>Break-Even Analysis</SectionTitle>
          {breakEvenYears > 0 ? (
            <>
              <MetricRow>
                <MetricLabel>Break-Even Period:</MetricLabel>
                <MetricValue>{formatNumber(breakEvenYears, 2)} years</MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>Payback Period:</MetricLabel>
                <MetricValue>{formatNumber(paybackPeriod, 2)} years</MetricValue>
              </MetricRow>
              <InfoText>
                Based on assumed 2x revenue markup. Adjust your pricing strategy based on market conditions.
              </InfoText>
            </>
          ) : (
            <InfoText>
              ROI calculations require positive profit margins. Current configuration shows negative ROI
              with standard 2x pricing model.
            </InfoText>
          )}
        </Section>

        <Divider />

        <Section>
          <SectionTitle>Suggested Pricing Strategy</SectionTitle>
          <InfoText>
            Recommended hourly rates per GPU to achieve different profit margins:
          </InfoText>

          <PricingTable>
            <thead>
              <tr>
                <th>Margin</th>
                <th>Hourly Rate</th>
                <th>Monthly (730h)</th>
                <th>Annual Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>50%</td>
                <td>${formatNumber(suggestedHourlyRate50, 2)}</td>
                <td>${formatNumber(suggestedHourlyRate50 * 730, 0)}</td>
                <td>${formatNumber(suggestedHourlyRate50 * 8760, 0)}</td>
              </tr>
              <tr className="highlighted">
                <td>100%</td>
                <td>${formatNumber(suggestedHourlyRate100, 2)}</td>
                <td>${formatNumber(suggestedHourlyRate100 * 730, 0)}</td>
                <td>${formatNumber(suggestedHourlyRate100 * 8760, 0)}</td>
              </tr>
              <tr>
                <td>150%</td>
                <td>${formatNumber(suggestedHourlyRate150, 2)}</td>
                <td>${formatNumber(suggestedHourlyRate150 * 730, 0)}</td>
                <td>${formatNumber(suggestedHourlyRate150 * 8760, 0)}</td>
              </tr>
            </tbody>
          </PricingTable>

          <InfoText>
            <strong>Note:</strong> Rates assume {formatNumber(annualTCO, 0)} annual TCO and competitive market positioning.
            Consider cloud provider pricing and market demand when setting rates.
          </InfoText>
        </Section>
      </CardContent>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  background: var(--bg-table);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1rem 1.5rem;
  background: var(--bg-tabs);
  border-bottom: 1px solid var(--border-table);
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-table);

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-label);
`;

const MetricValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-table);
  margin: 1.5rem 0;
`;

const InfoText = styled.p`
  font-size: 0.75rem;
  color: var(--color-summary);
  margin: 0.75rem 0 0 0;
  line-height: 1.5;
`;

const PricingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.875rem;

  th {
    text-align: left;
    padding: 0.75rem;
    background: var(--bg-page);
    color: var(--color-label);
    font-weight: 600;
    border-bottom: 2px solid var(--border-table);
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-table);
    color: var(--color-text);
  }

  tr.highlighted {
    background: var(--bg-tabs);
    font-weight: 600;
  }

  tbody tr:hover {
    background: var(--bg-page);
  }
`;

export default React.memo(ROICard);
