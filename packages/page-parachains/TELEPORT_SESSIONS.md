# Teleport Session Management

This feature allows users to save, load, and share teleport transaction sessions.

## Features

1. **Save Sessions**: Save current teleport transaction details for later use
2. **Load Sessions**: Resume a saved teleport transaction
3. **Session IDs**: Each session has a unique identifier
4. **URL Parameters**: Share sessions via URL with session ID parameter
5. **Persistent Storage**: Sessions are stored in browser's localStorage

## Usage

### Saving a Session

1. Open the Teleport modal
2. Fill in the transaction details (sender, recipient, amount, destination chain)
3. Click "Save Session" button
4. The session ID will be displayed and saved to localStorage

### Loading a Session

**Option 1: Via URL Parameter**
Navigate to the teleport page with a session ID:
```
/teleport?session=session_011CUuDFgkbzYFe1xYAySrhZ
```

**Option 2: Direct Session Access**
The session data includes:
- Sender account ID
- Recipient account ID
- Recipient parachain ID
- Transfer amount
- Timestamp

### Session ID Format

Session IDs follow the format: `session_<timestamp><random>`

Example: `session_011CUuDFgkbzYFe1xYAySrhZ`

### Clearing a Session

After saving a session, you can clear it by clicking the "Clear Session" button. This removes the session from localStorage and resets the form.

### Session Completion

When a teleport transaction is successfully submitted, the session is automatically marked as completed.

## Technical Details

### Storage

Sessions are stored in `localStorage` under the key `polkadot-teleport-sessions`.

### Session Data Structure

```typescript
interface TeleportSession {
  id: string;
  timestamp: number;
  senderId: string | null;
  recipientId: string | null;
  recipientParaId: number;
  amount: string; // BN serialized as string
  completed?: boolean;
}
```

### Files Modified

1. `packages/page-parachains/src/teleportSessions.ts` - Session management utilities
2. `packages/page-parachains/src/Teleport.tsx` - Updated Teleport component with session support
3. `packages/page-parachains/src/TeleportWrapper.tsx` - URL parameter handling
4. `packages/apps-routing/src/teleport.ts` - Updated routing to use TeleportWrapper

## Examples

### Command Line Style Access

While there isn't a CLI interface, the session feature supports a similar workflow:

```bash
# Conceptual usage (via URL)
claude --teleport session_011CUuDFgkbzYFe1xYAySrhZ

# Actual usage - navigate to:
https://polkadot.js.org/apps/#/teleport?session=session_011CUuDFgkbzYFe1xYAySrhZ
```

### Programmatic Usage

```typescript
import { 
  generateSessionId, 
  saveTeleportSession, 
  loadTeleportSession,
  markSessionCompleted 
} from './teleportSessions';

// Create a new session
const sessionId = generateSessionId();

// Save session data
saveTeleportSession({
  id: sessionId,
  timestamp: Date.now(),
  senderId: '5FHneW46...',
  recipientId: '5GrwvaEF...',
  recipientParaId: 1000,
  amount: '1000000000000'
});

// Load session later
const session = loadTeleportSession(sessionId);

// Mark as completed after transaction
markSessionCompleted(sessionId);
```

## Benefits

1. **Resume Transactions**: Save a transaction and complete it later
2. **Share Transactions**: Share a pre-filled teleport form via URL
3. **Audit Trail**: Keep track of teleport transactions with timestamps
4. **User Experience**: Avoid re-entering transaction details
