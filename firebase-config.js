// ════════════════════════════════════════════════════════
//  firebase-config.js  —  GAVLE Restaurant
//  يُحمَّل في كل الصفحات قبل أي ملف آخر
//  يستخدم Firebase Compat SDK (لا يحتاج import/module)
// ════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyDKjtWLdp2yOLI_9bKHKSe366h5aKnUXxI",
  authDomain:        "gavle-1ad17.firebaseapp.com",
  projectId:         "gavle-1ad17",
  storageBucket:     "gavle-1ad17.firebasestorage.app",
  messagingSenderId: "416938519562",
  appId:             "1:416938519562:web:8475aaa8c4647b78f6c3f3"
};

// تهيئة Firebase مرة واحدة فقط
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
