// Firebase Configuration for MonkeyMoney
// This file provides compatibility with existing Firebase references
// while the application uses localStorage for data persistence

// Mock Firebase configuration to maintain compatibility
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDYiH8Mzcm0A8fOdNR_x12-FRPXpyqstHQ",
  authDomain: "monkeymoney-58778.firebaseapp.com",
  projectId: "monkeymoney-58778",
  storageBucket: "monkeymoney-58778.appspot.com",
  messagingSenderId: "364864617201",
  appId: "1:364864617201:web:b14eba15737401ca18c750"
};

// Mock Firebase objects for compatibility
const firebase = {
  initializeApp: function(config) {
    console.log('Firebase config initialized (localStorage mode)');
    return this;
  },
  
  firestore: function() {
    return {
      enablePersistence: function() {
        return Promise.resolve();
      }
    };
  },
  
  auth: function() {
    return {
      signInWithEmailAndPassword: function(email, password) {
        // This would typically interface with Firebase Auth
        // For localStorage implementation, we handle auth in auth.js
        return Promise.resolve({ user: { email: email } });
      },
      
      createUserWithEmailAndPassword: function(email, password) {
        return Promise.resolve({ user: { email: email } });
      },
      
      sendPasswordResetEmail: function(email) {
        return Promise.resolve();
      },
      
      signOut: function() {
        return Promise.resolve();
      }
    };
  }
};

// Mock global Firebase references for compatibility
if (typeof window !== 'undefined') {
  window.firebase = firebase;
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Mock persistence enablement
  try {
    db.enablePersistence();
  } catch (err) {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time');
    } else if (err.code == 'unimplemented') {
      console.warn('The current browser does not support offline persistence');
    }
  }
  
  // Make services globally available
  window.db = db;
  window.auth = auth;
}

console.log('Firebase configuration loaded (localStorage implementation)');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebase, firebaseConfig };
}
