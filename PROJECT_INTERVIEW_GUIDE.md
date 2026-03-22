# Cross-Chat — Interview Project Guide

## 1) Project Overview

**Cross-Chat** is a real-time mobile chat application built with **React Native CLI** and **Firebase Firestore**.  
It focuses on quick peer connection through short codes, WhatsApp-style chat UX, and practical engineering patterns like real-time listeners, optimistic chat metadata updates, unread tracking, and theme persistence.

### Elevator Pitch (30 seconds)
I built a WhatsApp-inspired React Native chat app called Cross-Chat. Users can connect instantly with a generated code, start one-to-one or group chats, and exchange real-time messages backed by Firestore. The app includes unread counters, read receipts, date separators, connection mode handling (Internet/Wi-Fi/Bluetooth UI), diagnostics checks, and dark/light mode with persistent user preference.

---

## 2) Problem Statement

Most simple demo chat apps are either too basic (no stateful chat metadata) or too complex to onboard users quickly. I designed Cross-Chat with two priorities:
1. **Fast onboarding**: connect using short code + name
2. **Practical architecture**: scalable chat metadata model and clear modular service layer

---

## 3) Core Features

### A. Quick Connect
- Generate a short, unique connect code
- Share code with another user
- Join chat by entering code
- Auto-creates deterministic chat identity from participants + connection type

### B. Group Chat (Advanced)
- Enter multiple participant IDs
- Optional custom chat title
- Open/reopen deterministic group room

### C. Recent Chats (Primary Surface)
- Shows existing chats for current user
- Last message preview + latest time
- Connection type badge (Internet/Wi-Fi/Bluetooth)
- Unread count bubble (per-user)

### D. Real-Time Messaging
- Firestore snapshot listener for message stream
- Firestore snapshot listener for chat metadata
- Server timestamps for ordering and receipts

### E. Read Receipts and Date Separators
- Single/double tick behavior based on seen state
- Daily message grouping with labels: Today / Yesterday / Date

### F. Connection Awareness
- Connection mode selector (Internet, Wi-Fi, Bluetooth)
- Runtime checks before sending:
  - Internet availability
  - Wi-Fi validation for Wi-Fi mode
  - Bluetooth mode explicitly marked as not yet implemented transport

### G. Diagnostics
- Firestore write-read-delete ping test to validate connectivity and permissions

### H. Dark/Light Theme
- Theme context with centralized color tokens
- Runtime toggle from top-right menu
- Persisted with AsyncStorage

---

## 4) Tech Stack

- **Framework**: React Native CLI (0.81.5)
- **Language**: JavaScript (functional React components + hooks)
- **Navigation**: React Navigation (Native Stack)
- **Backend**: Firebase Firestore (real-time)
- **State**: Local hook state + Firestore subscription state
- **Utility libs**:
  - `@react-native-clipboard/clipboard`
  - `@react-native-community/netinfo`
  - `@react-native-async-storage/async-storage`

---

## 5) Architecture and Folder Design

- `screens/`
  - `ChatListScreen.js`: landing, quick connect, recent chats, top-right actions
  - `ChatScreen.js`: chat thread, send flow, receipts, date separators
- `components/`
  - `MessageBubble.js`: reusable message UI + tick rendering
- `styles/`
  - Screen/component style factories receiving theme colors
- `services/`
  - Firebase config
  - Connect code operations
  - Connection diagnostics
- `utils/`
  - Chat ID/participant normalization helpers
- `constants/`
  - Connection types, labels, collection names, accents
- `context/`
  - Theme provider and dark/light palette management

This separation keeps business logic out of UI where possible and allows independent evolution of features.

---

## 6) Firestore Data Model

### Collections

#### `chats/{chatId}`
Main chat metadata document:
- `participants: string[]`
- `participantNames: Record<string, string>`
- `title: string`
- `connectionType: "internet" | "wifi" | "bluetooth"`
- `lastMessageText: string`
- `lastMessageSenderId: string`
- `lastMessageCreatedAt: serverTimestamp`
- `updatedAt: serverTimestamp`
- `lastSeenBy.{userId}: timestamp`
- `unreadBy.{userId}: number`

#### `chats/{chatId}/messages/{messageId}`
- `text: string`
- `senderId: string`
- `senderName: string`
- `createdAt: serverTimestamp`

#### `chatConnectCodes/{code}`
- `ownerUserId`
- `ownerUserName`
- `preferredConnectionType`
- `createdAt`

#### `connectionDiagnostics/{id}`
Temporary docs for read/write diagnostics.

---

## 7) Key Engineering Decisions

### Deterministic Chat IDs
I generate chat IDs by sorting participant IDs + connection type. That guarantees the same pair/group resolves to the same room and avoids duplicate rooms caused by order differences.

### Metadata-Driven Recent Chat UX
Instead of querying last message every time for list cards, metadata fields are updated on send, which improves list rendering performance and simplifies recent-chat queries.

### Per-User Unread Map
Unread counts are stored as `unreadBy.{userId}` and incremented for all other participants on message send. This enables direct unread badge rendering without expensive aggregation logic.

### Seen Tracking for Read Receipts
Read receipts are inferred from `lastSeenBy.{userId}` timestamps compared against message timestamps. It is lightweight and avoids per-message read documents.

### Theme Tokenization
All styles are generated from a colors object in theme context, making dark/light parity maintainable and reducing hard-coded style drift.

---

## 8) Main User Flows

### Flow 1: Quick Connect
1. User enters own name
2. Taps “Generate My Code”
3. Shares code with friend
4. Friend enters code and taps join
5. App reads code owner from Firestore
6. App builds deterministic chat ID and opens chat

### Flow 2: Send Message
1. Validate message input
2. Validate connection constraints (mode + network)
3. Add message document with server timestamp
4. Update chat metadata + unread map + last seen for sender
5. Message appears in real-time listener stream

### Flow 3: Read Receipt Update
1. Chat opens/listener receives updates
2. Current user marks `lastSeenBy.userId`
3. Sender computes receipt state by comparing timestamps
4. Bubble ticks update to delivered/read

---

## 9) UI/UX Highlights

- WhatsApp-like visual hierarchy and spacing
- Sticky top-level “Recent Chats” as primary area
- Floating `+` action button to reveal composer
- 3-dots menu overlay with backdrop dismiss
- Connection mode chip and menu actions
- Inline status messages for quick connect actions
- Date separators and clean message bubble metadata row

---

## 10) Reliability and Error Handling

- Firestore listener errors surfaced via alerts and logs
- Defensive checks for missing name/code
- Retry messaging for code generation failure
- Network/transport checks before send
- Diagnostic endpoint to verify Firestore read/write path

---

## 11) Security and Production Notes

Current project is optimized for development speed. For production readiness:
- Move Firebase keys/config to secure environment strategy
- Enforce strict Firestore rules (user auth + document-level access)
- Add authentication (Firebase Auth or custom auth)
- Add abuse controls/rate limits for connect codes
- Consider code expiry and one-time-use behavior

---

## 12) Performance Considerations

- Real-time listeners scoped per chat and per relevant chats query
- Chat metadata denormalization for fast list rendering
- Conditional auto-scroll only when user near bottom
- Memoized style factories and computed arrays to reduce rerenders

---

## 13) Testing Strategy (What I would present in interview)

### Implemented manually
- End-to-end chat send/receive on emulator
- Connection mode validation behavior
- Connect code generation and join flow
- Theme toggle persistence across app restarts

### Recommended automated tests next
- Unit tests for `chatUtils` and connect-code normalization
- Integration tests for metadata update and unread counters
- Snapshot tests for message bubble/read tick states

---

## 14) Challenges and How I Solved Them

1. **Connect flow felt too complex**
   - Introduced Quick Connect as primary flow and moved group setup to advanced section.

2. **Need WhatsApp-like behavior with clean architecture**
   - Separated screens/services/utils/styles; used metadata maps for unread and seen states.

3. **Expo vs native emulator requirement**
   - Migrated to React Native CLI workflow and validated native run scripts.

4. **Theme consistency across screens/components**
   - Added centralized ThemeContext and style factory pattern.

---

## 15) Known Limitations

- Bluetooth transport is UI-level only (actual BLE messaging not implemented yet)
- No auth/identity backend; display name is user-provided
- No media/file message support yet
- No push notifications yet

---

## 16) Future Roadmap

- Firebase Auth integration + user profiles
- End-to-end encryption model design
- BLE transport implementation for true Bluetooth mode
- Push notifications (FCM)
- Message status per participant in large groups
- Search, media sharing, typing indicators, message reactions

---

## 17) Interview Q&A Cheat Sheet

### Firebase/Firestore/Auth Short Prep (with File Map)

If asked about Firebase technologies, you can answer like this in short:

- **Firebase** is Google’s backend platform. In this app I use Firebase mainly for **Firestore real-time database** features.
- **Firestore** is a NoSQL document database. Data is stored as collections/documents and supports realtime listeners.
- **Firebase Auth** is Firebase’s authentication module (email/password, OTP, Google, etc.).
- In **my current app**, Firestore is implemented and Auth is **not implemented yet** (planned next step).

#### File map for quick learning

- **Firebase initialization**: `services/firebaseConfig.js`
  - `initializeApp(firebaseConfig)` and `getFirestore(app)`
  - Exports `db` used everywhere for Firestore operations

- **Firestore collections and constants**: `constants/appConstants.js`
  - `FIRESTORE_COLLECTIONS.CHATS`
  - `FIRESTORE_COLLECTIONS.CONNECT_CODES`
  - `FIRESTORE_COLLECTIONS.CONNECTION_DIAGNOSTICS`

- **Connect code read/write logic**: `services/connectCodeService.js`
  - `generateConnectCode(...)` writes code docs
  - `getConnectCodeDetails(...)` reads code docs

- **Connection diagnostic write-read-delete check**: `services/connectionDiagnosticsService.js`
  - `runConnectionDiagnostics(...)`

- **Realtime chat listeners + message write**: `screens/ChatScreen.js`
  - `onSnapshot(...)` for chat metadata + messages
  - `addDoc(...)` for sending messages
  - `setDoc(..., { merge: true })` for chat metadata/unread/read updates

- **Recent chat realtime list**: `screens/ChatListScreen.js`
  - `onSnapshot(...)` query for user-related chats

#### Interview-ready short answers

**Q: What Firebase services did you use?**  
A: I used Firebase Firestore for realtime chat data, connect-code mapping, and connection diagnostics. Firebase Auth is not integrated yet in this version.

**Q: Why Firestore instead of SQL?**  
A: Firestore gave me realtime listeners and flexible document modeling, which fits chat updates and metadata maps like `unreadBy` and `lastSeenBy`.

**Q: How do realtime updates work in your app?**  
A: I subscribe using `onSnapshot` on chat docs and message subcollections. UI updates automatically whenever Firestore data changes.

**Q: What is your Firestore schema?**  
A: `chats/{chatId}` stores metadata, `chats/{chatId}/messages/{messageId}` stores messages, `chatConnectCodes/{code}` stores temporary connect mapping.

**Q: How would you add Firebase Auth next?**  
A: I’d integrate `firebase/auth`, add sign-in (Google/Email/OTP), and replace manual `myName` identity with authenticated `uid` plus profile display name.

**Q: How would security improve with Auth?**  
A: Firestore rules can validate `request.auth.uid` and allow access only to chats where that UID exists in `participants`.

**Q: Is your Firebase config key secret?**  
A: The config object is not a private server secret, but security must come from strict Firestore rules and authentication.

### Q: Why Firestore for this app?
Firestore gives real-time listeners out of the box, simple document modeling, and fast iteration speed for mobile chat prototypes.

### Q: How do unread counts work?
On send, unread count increments for all participants except sender using `unreadBy.{userId}`; receiver opening chat sets own unread to 0.

### Q: How are read receipts calculated?
Each user writes `lastSeenBy.{userId}` timestamps; sender compares message timestamp against each recipient’s seen timestamp.

### Q: How do you prevent duplicate 1:1 rooms?
Deterministic chat IDs from sorted participant IDs + connection type ensures same combination always maps to same chat.

### Q: What’s your approach to scaling?
Denormalized chat metadata for list performance, modular services, and clear extension points for auth, notifications, and transport adapters.

---

## 18) Run and Demo Commands

```bash
npm install
npm start
npm run android
```

If Metro cache is stale:
```bash
npx react-native start --reset-cache
```

---

## 19) One-Minute Demo Script

1. Open app, enter your name in Quick Connect.
2. Generate connect code and copy it.
3. Join from another user/code path and open chat instantly.
4. Send messages and show read tick behavior.
5. Show recent chats with unread badges and mode tags.
6. Toggle dark/light mode from 3-dots menu and restart app to show persistence.

---

## 20) Resume-Friendly Project Description

Built **Cross-Chat**, a WhatsApp-style real-time messaging app using **React Native CLI + Firebase Firestore**, featuring connect-code onboarding, deterministic chat room generation, unread/read-tracking with metadata maps, connection-mode validation, diagnostics tooling, and persistent dark/light theming. Designed modular architecture (`screens/services/utils/context`) and implemented production-oriented patterns for maintainability and scalability.
