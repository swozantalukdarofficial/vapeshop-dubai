import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!getApps().length) {
  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else if (process.env.NODE_ENV !== "production") {
    // In local dev without credentials, this will fail if we try to use it,
    // but we allow it to initialize empty so the build doesn't crash.
    // The user needs to add the env vars.
    initializeApp();
  } else {
    throw new Error(
      "Firebase Admin credentials are missing. Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your environment variables."
    );
  }
}

export const adminAuth = getAuth();
