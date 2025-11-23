# Teleport Session Flow Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       User Interface                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Teleport Modal (Teleport.tsx)                 │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Sender Account:    [Input]                         │  │  │
│  │  │  Destination Chain: [Dropdown]                      │  │  │
│  │  │  Recipient Address: [Input]                         │  │  │
│  │  │  Amount:           [Input]                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │ Save Session │  │Clear Session │  │   Teleport   │    │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │  │
│  │         │                 │                               │  │
│  │         v                 v                               │  │
│  │  Session ID: session_011CUuDFgkbzYFe1xYAySrhZ            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              v
┌─────────────────────────────────────────────────────────────────┐
│                    URL Parameter Handling                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          TeleportWrapper.tsx                              │  │
│  │                                                            │  │
│  │  URL: /teleport?session=session_011CUuDFgkbzYFe1xYAySrhZ │  │
│  │                                                            │  │
│  │  1. Parse URL query parameters                            │  │
│  │  2. Extract session ID                                    │  │
│  │  3. Pass to Teleport component                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              v
┌─────────────────────────────────────────────────────────────────┐
│                    Session Management Layer                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          teleportSessions.ts                              │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ generateSessionId()                                  │  │  │
│  │  │   Returns: session_<timestamp><random>              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ saveTeleportSession(session)                        │  │  │
│  │  │   Saves to localStorage                             │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ loadTeleportSession(sessionId)                      │  │  │
│  │  │   Loads from localStorage                           │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ markSessionCompleted(sessionId)                     │  │  │
│  │  │   Updates completion status                         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              v
┌─────────────────────────────────────────────────────────────────┐
│                      Browser Storage                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  localStorage['polkadot-teleport-sessions'] = {                 │
│    "session_011CUuDFgkbzYFe1xYAySrhZ": {                        │
│      "id": "session_011CUuDFgkbzYFe1xYAySrhZ",                  │
│      "timestamp": 1699123456789,                                │
│      "senderId": "5FHneW46...",                                 │
│      "recipientId": "5GrwvaEF...",                              │
│      "recipientParaId": 1000,                                   │
│      "amount": "1000000000000",                                 │
│      "completed": false                                         │
│    }                                                             │
│  }                                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow

### Scenario 1: Saving a New Session

```
User Opens Teleport
       │
       v
Fills Transaction Details
       │
       v
Clicks "Save Session"
       │
       v
generateSessionId() creates ID
       │
       v
saveTeleportSession() stores data
       │
       v
Session ID displayed to user
       │
       v
User can share URL with session ID
```

### Scenario 2: Loading an Existing Session

```
User Receives URL
/teleport?session=session_011CUuDFgkbzYFe1xYAySrhZ
       │
       v
TeleportWrapper parses URL
       │
       v
Extracts session ID
       │
       v
Passes to Teleport component
       │
       v
useEffect triggers loadTeleportSession()
       │
       v
Session data loaded from localStorage
       │
       v
Form fields auto-populated
       │
       v
User reviews and executes transaction
```

### Scenario 3: Completing a Transaction

```
User Submits Teleport
       │
       v
handleTeleportSuccess() called
       │
       v
markSessionCompleted() updates session
       │
       v
Modal closes
       │
       v
Session marked as completed in storage
```

## Data Flow

```
┌──────────┐         ┌──────────────┐         ┌──────────────┐
│          │         │              │         │              │
│   User   │────────▶│  Component   │────────▶│   Storage    │
│  Input   │         │    State     │         │  (localStorage)
│          │         │              │         │              │
└──────────┘         └──────────────┘         └──────────────┘
                            │                        │
                            │                        │
                            v                        v
                     ┌──────────────┐         ┌──────────────┐
                     │              │         │              │
                     │ Session Data │◀────────│ Load Session │
                     │   (Props)    │         │  on Mount    │
                     │              │         │              │
                     └──────────────┘         └──────────────┘
```

## Session ID Format

```
session_<timestamp><random>
   │       │          │
   │       │          └─ Random string for uniqueness
   │       └─ Timestamp in base36 for readability
   └─ Prefix for identification
```

Example: `session_011CUuDFgkbzYFe1xYAySrhZ`
