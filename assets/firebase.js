import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

export const firebaseReady = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith("REPLACE_") &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.startsWith("REPLACE_") &&
  firebaseConfig.appId &&
  !firebaseConfig.appId.startsWith("REPLACE_")
);

const app = firebaseReady ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
