// Firebase initialization (optional)
// Provide env vars to enable: REACT_APP_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, APP_ID
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app = null;
let auth = null;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  ) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (err) {
  // If initialization fails, leave auth null (app will fallback to local auth)
  console.error('Firebase init error:', err);
}

export { app as firebaseApp, auth };
