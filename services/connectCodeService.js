import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { FIRESTORE_COLLECTIONS } from "../constants/appConstants";

export function normalizeConnectCode(value) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
}

function createRandomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    result += alphabet[randomIndex];
  }

  return result;
}

export async function generateConnectCode({
  currentUserId,
  currentUserName,
  preferredConnectionType,
  maxAttempts = 5,
}) {
  let generatedCode = "";

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidateCode = createRandomCode(6);
    const candidateRef = doc(db, FIRESTORE_COLLECTIONS.CONNECT_CODES, candidateCode);
    const candidateSnapshot = await getDoc(candidateRef);

    if (!candidateSnapshot.exists()) {
      await setDoc(candidateRef, {
        ownerUserId: currentUserId,
        ownerUserName: currentUserName,
        preferredConnectionType,
        createdAt: serverTimestamp(),
      });

      generatedCode = candidateCode;
      break;
    }
  }

  return generatedCode;
}

export async function getConnectCodeDetails(connectCode) {
  const codeRef = doc(db, FIRESTORE_COLLECTIONS.CONNECT_CODES, connectCode);
  const codeSnapshot = await getDoc(codeRef);

  if (!codeSnapshot.exists()) {
    return null;
  }

  return codeSnapshot.data();
}
