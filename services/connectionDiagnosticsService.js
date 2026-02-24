import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { FIRESTORE_COLLECTIONS } from "../constants/appConstants";

export async function runConnectionDiagnostics(currentUserId) {
  const testDocId = `${currentUserId}_${Date.now()}`;
  const testRef = doc(db, FIRESTORE_COLLECTIONS.CONNECTION_DIAGNOSTICS, testDocId);

  await setDoc(testRef, {
    fromUserId: currentUserId,
    status: "ping",
    createdAt: serverTimestamp(),
  });

  const readBack = await getDoc(testRef);

  if (!readBack.exists()) {
    throw new Error("write_succeeded_read_failed");
  }

  await deleteDoc(testRef);
}
