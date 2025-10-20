import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// ============================================
// GOOGLE SIGN-IN CONFIGURATION
// ============================================

/**
 * Initialize Google Sign-In
 */

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '466950805571-87ili3c30q1mstppkrlvdr0jal4cme05.apps.googleusercontent.com',
    offlineAccess: true, // If you want to access user data later
  });
};

// ============================================
// FIREBASE INSTANCES
// ============================================
export const firebaseAuth = auth;
export const firebaseDb = firestore;

// ============================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================

/**
 * Sign up with email and password
 * Creates a new user account and stores additional data in Firestore
 */

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    // Update user profile with display name
    await userCredential.user.updateProfile({
      displayName: name,
    });

    // Save user data to Firestore
    await firebaseDb().collection('users').doc(userCredential.user.uid).set({
      name,
      email,
      authProvider: 'email',
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with email and password
 */

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ============================================
// GOOGLE SIGN-IN AUTHENTICATION
// ============================================

export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play Services (Android)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Trigger Google Sign-In flow
    const signInResult = await GoogleSignin.signIn();

    // Get ID token from the result
    // Handle both old and new versions of the library
    let idToken = signInResult.data?.idToken;

    if (!idToken) {
      throw new Error('No Id Token found');
    }

    // Create a Firebase credential with the Google token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);

    // Store/update user information in Firestore
    const user = userCredential.user;
    await firebaseDb()
      .collection('users')
      .doc(user.uid)
      .set(
        {
          name: user.displayName || 'User',
          email: user.email,
          authProvider: 'google',
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    return user;
  } catch (error: any) {
    // Handle specific error codes
    if (error.code === 'SIGN_IN_CANCELLED') {
      throw new Error('Sign-in was cancelled');
    } else if (error.code === 'IN_PROGRESS') {
      throw new Error('Sign-in already in progress');
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      throw new Error('Google Play Services not available');
    }
    throw new Error(error.message);
  }
};

/**
 * Check if user has previously signed in with Google
 */
export const hasPreviousGoogleSignIn = (): boolean => {
  return GoogleSignin.hasPreviousSignIn();
};

/**
 * Get current Google user (synchronous)
 */
export const getCurrentGoogleUser = async () => {
  return GoogleSignin.getCurrentUser();
};

/**
 * Try to sign in silently (restore previous session)
 * This is useful when app starts to check if user is already signed in
 */
export const signInSilently = async () => {
  try {
    const response = await GoogleSignin.signInSilently();

    if (response.type === 'success') {
      // User is signed in, return user data
      return response.data;
    } else if (response.type === 'noSavedCredentialFound') {
      // User has not signed in yet or revoked access
      return null;
    }
  } catch (error: any) {
    // Handle error (network issue, etc.)
    console.error('Silent sign-in failed:', error);
    return null;
  }
};

// ============================================
// SIGN OUT
// ============================================

export const signOut = async () => {
  try {
    // Check if user previously signed in with Google
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
    // Sign out from Firebase
    await auth().signOut();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Revoke Google access (complete disconnect)
 */
export const revokeGoogleAccess = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await auth().signOut();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get current Firebase user
 */
export const getCurrentUser = () => {
  return auth().currentUser;
};

/**
 * Check if user is authenticated
 * Checks both Firebase and Google Sign-In
 */
export const isUserAuthenticated = (): boolean => {
  const firebaseUser = auth().currentUser;
  const hasGoogleSignIn = GoogleSignin.hasPreviousSignIn();

  return firebaseUser !== null || hasGoogleSignIn;
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string) => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string) => {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
