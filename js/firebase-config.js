// firebase-config.js
// Importar las funciones que necesitamos de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYaNbZWHUS-Pvm49kmMtHw9LqqxUDySYA",
  authDomain: "base-de-datos-poli.firebaseapp.com",
  projectId: "base-de-datos-poli",
  storageBucket: "base-de-datos-poli.firebasestorage.app",
  messagingSenderId: "954754202697",
  appId: "1:954754202697:web:e06171f6b0ade314259398"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportar para uso en otros archivos
export { app, auth, db, storage };
