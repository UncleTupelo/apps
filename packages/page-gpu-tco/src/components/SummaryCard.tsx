// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

function SummaryCard ({ className, title, value, subtitle, icon, trend }: Props): React.ReactElement {
  return (
    <StyledCard className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {icon && <CardIcon className={`fas fa-${icon}`} />}
      </CardHeader>
      <CardValue trend={trend}>{value}</CardValue>
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
    </StyledCard>
  );
}

const StyledCard = styled.div`
  background: var(--bg-table);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 120px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.div`
  font-size: 0.875rem;
  color: var(--color-summary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardIcon = styled.i`
  font-size: 1.25rem;
  color: var(--color-summary);
  opacity: 0.5;
`;

const CardValue = styled.div<{ trend?: 'up' | 'down' | 'neutral' }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ trend }) =>
    trend === 'up' ? 'var(--color-error)' :
    trend === 'down' ? 'var(--color-success)' :
    'var(--color-text)'};
  line-height: 1.2;
`;

const CardSubtitle = styled.div`
  font-size: 0.75rem;
  color: var(--color-label);
  margin-top: auto;
`;

export default React.memo(SummaryCard);
