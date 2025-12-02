// Copyright 2017-2025 @polkadot/app-gpu-tco authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Scenario, TCOInputs } from '../types';

const STORAGE_KEY = 'gpu-tco-scenarios';
const CURRENT_CONFIG_KEY = 'gpu-tco-current';

export function saveCurrentConfig (inputs: TCOInputs): void {
  try {
    localStorage.setItem(CURRENT_CONFIG_KEY, JSON.stringify(inputs));
  } catch (error) {
    console.error('Failed to save configuration:', error);
  }
}

export function loadCurrentConfig (): TCOInputs | null {
  try {
    const stored = localStorage.getItem(CURRENT_CONFIG_KEY);

    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load configuration:', error);

    return null;
  }
}

export function saveScenario (scenario: Scenario): void {
  try {
    const scenarios = loadScenarios();

    // Update existing or add new
    const index = scenarios.findIndex((s) => s.id === scenario.id);

    if (index >= 0) {
      scenarios[index] = scenario;
    } else {
      scenarios.push(scenario);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch (error) {
    console.error('Failed to save scenario:', error);
  }
}

export function loadScenarios (): Scenario[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load scenarios:', error);

    return [];
  }
}

export function deleteScenario (id: string): void {
  try {
    const scenarios = loadScenarios().filter((s) => s.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch (error) {
    console.error('Failed to delete scenario:', error);
  }
}

export function clearAllScenarios (): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear scenarios:', error);
  }
}
