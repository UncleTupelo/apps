// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

function InputSection ({ className, title, children, collapsible = false }: Props): React.ReactElement {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const toggleExpand = React.useCallback(() => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  }, [collapsible, isExpanded]);

  return (
    <StyledSection className={className}>
      <SectionHeader onClick={toggleExpand} clickable={collapsible}>
        <SectionTitle>{title}</SectionTitle>
        {collapsible && (
          <ExpandIcon className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} />
        )}
      </SectionHeader>
      {isExpanded && <SectionContent>{children}</SectionContent>}
    </StyledSection>
  );
}

const StyledSection = styled.div`
  background: var(--bg-table);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  overflow: hidden;
`;

const SectionHeader = styled.div<{ clickable: boolean }>`
  padding: 1rem 1.5rem;
  background: var(--bg-tabs);
  border-bottom: 1px solid var(--border-table);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};

  &:hover {
    background: ${({ clickable }) => clickable ? 'var(--bg-page)' : 'var(--bg-tabs)'};
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
`;

const ExpandIcon = styled.i`
  font-size: 0.875rem;
  color: var(--color-summary);
`;

const SectionContent = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

export default React.memo(InputSection);
