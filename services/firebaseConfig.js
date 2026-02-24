import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAtZ2XAPmf7I24_KJ4gIt4rEPijf-bz_GU",
  authDomain: "chat-app-6ff96.firebaseapp.com",
  projectId: "chat-app-6ff96",
  storageBucket: "chat-app-6ff96.firebasestorage.app",
  messagingSenderId: "715718819093",
  appId: "1:715718819093:web:fcb20a825b6216c9433d1c"
};

const hasPlaceholderFirebaseConfig = Object.values(firebaseConfig).some(
  (value) => !value || String(value).startsWith("YOUR_")
);

if (hasPlaceholderFirebaseConfig) {
  console.warn(
    "Firebase config is using placeholder values. Update services/firebaseConfig.js with your real Firebase project keys to enable real device-to-device chat."
  );
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);