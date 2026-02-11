
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug: Log config status (values will be undefined if env vars are missing)
console.log('[Firebase Config Check]', {
    apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ MISSING',
    authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ MISSING',
    projectId: firebaseConfig.projectId ? '✅ Set' : '❌ MISSING',
    storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ MISSING',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ MISSING',
    appId: firebaseConfig.appId ? '✅ Set' : '❌ MISSING',
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, updateProfile, storage, ref, uploadBytes, getDownloadURL };

