// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

export interface TeleportSession {
  id: string;
  timestamp: number;
  senderId: string | null;
  recipientId: string | null;
  recipientParaId: number;
  amount: string; // BN serialized as string
  completed?: boolean;
}

const STORAGE_KEY = 'polkadot-teleport-sessions';

export function generateSessionId (): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}${random}`;
}

export function saveTeleportSession (session: TeleportSession): void {
  try {
    const sessions = loadAllTeleportSessions();
    sessions[session.id] = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save teleport session:', error);
  }
}

export function loadTeleportSession (sessionId: string): TeleportSession | null {
  try {
    const sessions = loadAllTeleportSessions();
    return sessions[sessionId] || null;
  } catch (error) {
    console.error('Failed to load teleport session:', error);
    return null;
  }
}

export function loadAllTeleportSessions (): Record<string, TeleportSession> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load teleport sessions:', error);
    return {};
  }
}

export function deleteTeleportSession (sessionId: string): void {
  try {
    const sessions = loadAllTeleportSessions();
    delete sessions[sessionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to delete teleport session:', error);
  }
}

export function markSessionCompleted (sessionId: string): void {
  try {
    const sessions = loadAllTeleportSessions();
    if (sessions[sessionId]) {
      sessions[sessionId].completed = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  } catch (error) {
    console.error('Failed to mark session completed:', error);
  }
}
