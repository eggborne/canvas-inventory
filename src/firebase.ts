import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User, UserCredential } from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAYF9GaBpvV3B1UGFuLN4zdbz-Olhvu00A",
  authDomain: "visionary-tools.firebaseapp.com",
  projectId: "visionary-tools",
  storageBucket: "visionary-tools.firebasestorage.app",
  messagingSenderId: "149311907487",
  appId: "1:149311907487:web:ab7d3cd83485713c2b64aa",
  measurementId: "G-N6S8NNL32E"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in
//     console.log('User is already logged in:', user);

//   } else {
//     // No user is signed in
//     console.log('No user logged in');
//   }
// });

const signInWithGoogle = async (): Promise<User> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('Successfully signed in with Google:', user);
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export { auth, signInWithGoogle };