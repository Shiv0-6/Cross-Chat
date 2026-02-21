# Cross-Chat

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