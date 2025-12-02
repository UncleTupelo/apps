// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import type { Scenario, TCOInputs, TCOResults } from '../types';

import { formatCurrency } from '../utils/calculations';
import { exportToCSV, exportToJSON, importFromJSON } from '../utils/export';
import { deleteScenario, loadScenarios, saveScenario } from '../utils/storage';

interface Props {
  className?: string;
  currentInputs: TCOInputs;
  currentResults: TCOResults;
  onLoadScenario: (inputs: TCOInputs) => void;
}

function ScenarioManager ({ className, currentInputs, currentResults, onLoadScenario }: Props): React.ReactElement {
  const [scenarios, setScenarios] = useState<Scenario[]>(loadScenarios());
  const [scenarioName, setScenarioName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSaveScenario = useCallback(() => {
    if (!scenarioName.trim()) {
      alert('Please enter a scenario name');

      return;
    }

    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName.trim(),
      inputs: currentInputs,
      results: currentResults,
      createdAt: new Date()
    };

    saveScenario(newScenario);
    setScenarios(loadScenarios());
    setScenarioName('');
    setShowSaveForm(false);
  }, [scenarioName, currentInputs, currentResults]);

  const handleLoadScenario = useCallback((scenario: Scenario) => {
    onLoadScenario(scenario.inputs);
  }, [onLoadScenario]);

  const handleDeleteScenario = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      deleteScenario(id);
      setScenarios(loadScenarios());
    }
  }, []);

  const handleExportJSON = useCallback((scenario?: Scenario) => {
    const inputs = scenario?.inputs || currentInputs;
    const results = scenario?.results || currentResults;
    const name = scenario?.name || 'Current Configuration';

    exportToJSON(inputs, results, name);
  }, [currentInputs, currentResults]);

  const handleExportCSV = useCallback((scenario?: Scenario) => {
    const inputs = scenario?.inputs || currentInputs;
    const results = scenario?.results || currentResults;
    const name = scenario?.name || 'Current Configuration';

    exportToCSV(inputs, results, name);
  }, [currentInputs, currentResults]);

  const handleImportJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    importFromJSON(file)
      .then(({ inputs, scenarioName: name }) => {
        onLoadScenario(inputs);
        alert(`Loaded configuration: ${name}`);
      })
      .catch((error) => {
        alert(`Failed to import: ${error.message}`);
      });

    // Reset input
    e.target.value = '';
  }, [onLoadScenario]);

  return (
    <StyledContainer className={className}>
      <Header>
        <Title>Scenario Management</Title>
      </Header>

      <Content>
        {/* Current Configuration Export */}
        <Section>
          <SectionTitle>Current Configuration</SectionTitle>
          <ButtonGroup>
            <Button onClick={() => setShowSaveForm(!showSaveForm)}>
              <Icon className="fas fa-save" />
              Save Scenario
            </Button>
            <Button onClick={() => handleExportJSON()}>
              <Icon className="fas fa-file-export" />
              Export JSON
            </Button>
            <Button onClick={() => handleExportCSV()}>
              <Icon className="fas fa-file-csv" />
              Export CSV
            </Button>
            <Button as="label" htmlFor="import-json">
              <Icon className="fas fa-file-import" />
              Import JSON
              <HiddenInput
                id="import-json"
                type="file"
                accept=".json"
                onChange={handleImportJSON}
              />
            </Button>
          </ButtonGroup>

          {showSaveForm && (
            <SaveForm>
              <Input
                type="text"
                placeholder="Enter scenario name..."
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveScenario()}
              />
              <Button onClick={handleSaveScenario}>Save</Button>
              <Button onClick={() => setShowSaveForm(false)} secondary>Cancel</Button>
            </SaveForm>
          )}
        </Section>

        {/* Saved Scenarios */}
        {scenarios.length > 0 && (
          <Section>
            <SectionTitle>Saved Scenarios ({scenarios.length})</SectionTitle>
            <ScenarioList>
              {scenarios.map((scenario) => (
                <ScenarioItem key={scenario.id}>
                  <ScenarioInfo>
                    <ScenarioName>{scenario.name}</ScenarioName>
                    <ScenarioDetails>
                      <Detail>{scenario.inputs.gpuModel.name}</Detail>
                      <Detail>{scenario.inputs.capex.gpuCount} GPUs</Detail>
                      <Detail>{formatCurrency(scenario.results.totalTCO)} TCO</Detail>
                      <Detail>{new Date(scenario.createdAt).toLocaleDateString()}</Detail>
                    </ScenarioDetails>
                  </ScenarioInfo>
                  <ScenarioActions>
                    <IconButton
                      onClick={() => handleLoadScenario(scenario)}
                      title="Load scenario"
                    >
                      <i className="fas fa-folder-open" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleExportJSON(scenario)}
                      title="Export JSON"
                    >
                      <i className="fas fa-file-export" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleExportCSV(scenario)}
                      title="Export CSV"
                    >
                      <i className="fas fa-file-csv" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteScenario(scenario.id)}
                      title="Delete scenario"
                      danger
                    >
                      <i className="fas fa-trash" />
                    </IconButton>
                  </ScenarioActions>
                </ScenarioItem>
              ))}
            </ScenarioList>
          </Section>
        )}
      </Content>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  background: var(--bg-table);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1rem 1.5rem;
  background: var(--bg-tabs);
  border-bottom: 1px solid var(--border-table);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-label);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ secondary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-input);
  border-radius: 0.25rem;
  background: ${({ secondary }) => secondary ? 'var(--bg-page)' : 'var(--bg-input)'};
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tabs);
    border-color: var(--color-label);
  }
`;

const Icon = styled.i`
  font-size: 0.875rem;
`;

const SaveForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-page);
  border-radius: 0.25rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-input);
  border-radius: 0.25rem;
  background: var(--bg-input);
  color: var(--color-text);

  &:focus {
    outline: none;
    border-color: var(--color-label);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ScenarioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ScenarioItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-page);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-label);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ScenarioInfo = styled.div`
  flex: 1;
`;

const ScenarioName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const ScenarioDetails = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Detail = styled.span`
  font-size: 0.75rem;
  color: var(--color-summary);
`;

const ScenarioActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button<{ danger?: boolean }>`
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--border-input);
  border-radius: 0.25rem;
  background: var(--bg-input);
  color: ${({ danger }) => danger ? 'var(--color-error)' : 'var(--color-text)'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ danger }) => danger ? 'var(--color-error)' : 'var(--bg-tabs)'};
    color: ${({ danger }) => danger ? '#fff' : 'var(--color-text)'};
    border-color: ${({ danger }) => danger ? 'var(--color-error)' : 'var(--color-label)'};
  }

  i {
    font-size: 0.875rem;
  }
`;

export default React.memo(ScenarioManager);
