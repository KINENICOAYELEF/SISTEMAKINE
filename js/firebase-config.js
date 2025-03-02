‎js/firebase-config.js
+4
-2
Original file line number	Diff line number	Diff line change
@@ -1,10 +1,11 @@
// Usando una versión estable de Firebase
// firebase-config.js
// Importar las funciones que necesitamos de los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Configuración de Firebase
// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYaNbZWHUS-Pvm49kmMtHw9LqqxUDySYA",
  authDomain: "base-de-datos-poli.firebaseapp.com",
@@ -20,4 +21,5 @@ const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportar para uso en otros archivos
export { app, auth, db, storage };
