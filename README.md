# Cross-Chat

## Features

- Group chats (2+ participants)
- Recent chat list
- Unique connect code for 1-to-1 pairing
- Connection mode per chat:
	- `Internet`: works on mobile data or Wi-Fi
	- `Wi-Fi`: send is allowed only when device is on Wi-Fi
	- `Bluetooth`: visible in UI, but cross-device Bluetooth transport is not supported in Expo Go

## Project structure (easy to modify)

- `screens/` → UI screens (`ChatListScreen`, `ChatScreen`)
- `components/` → reusable UI parts (`MessageBubble`)
- `styles/` → separated styles (`chatListStyles`, `chatScreenStyles`, `messageBubbleStyles`)
- `utils/` → pure helpers (`chatUtils`)
- `services/` → Firebase + feature services (`firebaseConfig`, `connectCodeService`, `connectionDiagnosticsService`)

## Connect with Code (1-to-1)

1. User A enters their name and taps **Generate My Code**.
2. User A shares the generated code with User B.
3. User B enters their name, pastes the code, and taps **Connect Now**.
4. Both users are routed to the same private chat room.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add Firebase project credentials in `services/firebaseConfig.js`:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

3. Start Expo:

```bash
npm run start:tunnel
```

Use **Expo Go** on your phone to scan the QR code.

## Real device-to-device connection (required steps)

If you want two real phones to chat with each other, complete this checklist first:

1. Create a Firebase project and enable **Firestore Database**.
2. Replace placeholders in `services/firebaseConfig.js` with your real Firebase values.
3. In Firestore Rules (for development), use temporary test rules:

```txt
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /{document=**} {
			allow read, write: if true;
		}
	}
}
```

4. Start app with tunnel (works even when phones are on different networks):

```bash
npm run start:tunnel
```

5. Open app on both phones (Expo Go):
	- (Optional) Tap **Run Connection Test** once to confirm Firestore read/write works
	 - Phone A: enter name, generate code, share code
	 - Phone B: enter name, enter code, tap Connect Now

After testing, tighten Firestore security rules before production.

## If Expo Go does not connect

- Keep phone and computer on stable internet
- Try `npm run start:tunnel` (best when LAN has restrictions)
- If using LAN, ensure both devices are on the same Wi-Fi
- Disable VPN/proxy/firewall temporarily and retry
- Clear cache: `npx expo start -c`

## Running from mobile in GitHub Codespaces

When you use Codespaces on mobile, Expo Go can fail with:

- `java.io.IOException: failed to download remote update`

because the app is running on a remote container, not your phone's local network.

### Option A (preferred for native): Expo Go + tunnel

```bash
npm run start:tunnel
```

Then in Expo Go on your phone, use **Enter URL manually** and paste the `exp://...` URL shown in terminal.

If tunnel fails with ngrok errors (`remote gone away`), use Option B.

### Option B (reliable fallback): Web on mobile browser

```bash
npm run start:web
```

For this Codespace, open:

- `https://automatic-eureka-wwq99gr949j35xg6-19007.app.github.dev`

If page doesn't load, make sure port `19007` is forwarded and set to **Public** in Codespaces Ports tab.

## Firebase notes

- If Firebase config values are placeholders, Firestore will not connect
- Ensure Firestore Database is created in your Firebase project
- Set Firestore security rules for your test/development use case

## Bluetooth mode note

This project runs in Expo managed workflow. Cross-device Bluetooth chat transport requires native BLE integration (for example with `react-native-ble-plx`) and a development build, not Expo Go. The app currently blocks send in Bluetooth mode and shows guidance.