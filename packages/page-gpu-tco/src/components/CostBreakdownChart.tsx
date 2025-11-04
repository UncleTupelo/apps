// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { formatCurrency } from '../utils/calculations';

interface CostItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  className?: string;
  title: string;
  items: CostItem[];
  totalLabel?: string;
}

function CostBreakdownChart ({ className, title, items, totalLabel = 'Total' }: Props): React.ReactElement {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <StyledChart className={className}>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        <ChartTotal>{formatCurrency(total)}</ChartTotal>
      </ChartHeader>
      <ChartContent>
        <BarContainer>
          {items.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;

            return (
              <BarSegment
                key={index}
                color={item.color}
                width={percentage}
                title={`${item.label}: ${formatCurrency(item.value)} (${percentage.toFixed(1)}%)`}
              />
            );
          })}
        </BarContainer>
        <Legend>
          {items.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;

            return (
              <LegendItem key={index}>
                <LegendColor color={item.color} />
                <LegendLabel>{item.label}</LegendLabel>
                <LegendValue>{formatCurrency(item.value)}</LegendValue>
                <LegendPercent>({percentage.toFixed(1)}%)</LegendPercent>
              </LegendItem>
            );
          })}
        </Legend>
      </ChartContent>
    </StyledChart>
  );
}

const StyledChart = styled.div`
  background: var(--bg-table);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  padding: 1.5rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
`;

const ChartTotal = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
`;

const ChartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BarContainer = styled.div`
  display: flex;
  height: 40px;
  border-radius: 0.25rem;
  overflow: hidden;
  background: var(--bg-page);
`;

const BarSegment = styled.div<{ color: string; width: number }>`
  background: ${({ color }) => color};
  width: ${({ width }) => width}%;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LegendItem = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background: ${({ color }) => color};
`;

const LegendLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text);
`;

const LegendValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: right;
`;

const LegendPercent = styled.div`
  font-size: 0.875rem;
  color: var(--color-summary);
  width: 60px;
  text-align: right;
`;

export default React.memo(CostBreakdownChart);
