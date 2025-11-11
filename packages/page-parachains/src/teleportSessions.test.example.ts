// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Teleport Session Management Test
 * 
 * This file demonstrates how to use the teleport session feature
 */

import { generateSessionId, loadTeleportSession, saveTeleportSession } from './teleportSessions';

// Example usage:
// 1. Save a teleport session
const sessionId = generateSessionId();
console.log('Generated session ID:', sessionId);

saveTeleportSession({
  amount: '1000000000000',
  id: sessionId,
  recipientId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  recipientParaId: 1000,
  senderId: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  timestamp: Date.now()
});

// 2. Load a teleport session
const loadedSession = loadTeleportSession(sessionId);
console.log('Loaded session:', loadedSession);

// 3. Access teleport with session ID via URL
// Navigate to: /teleport?session=session_xxx
// The TeleportWrapper will automatically load the session data

// 4. Example session ID from problem statement
const exampleSessionId = 'session_011CUuDFgkbzYFe1xYAySrhZ';
console.log('Example session ID format:', exampleSessionId);

// Usage:
// claude --teleport session_011CUuDFgkbzYFe1xYAySrhZ
// This would open the teleport modal with the session data pre-populated
// URL: https://polkadot.js.org/apps/#/teleport?session=session_011CUuDFgkbzYFe1xYAySrhZ
