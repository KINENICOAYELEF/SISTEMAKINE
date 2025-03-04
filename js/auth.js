// Sistema de autenticación

// Función para registrar un nuevo usuario
function registrarUsuario(email, password, displayName) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Actualizar el perfil del usuario
      return userCredential.user.updateProfile({
        displayName: displayName
      }).then(() => {
        // Crear documento de usuario en Firestore
        return db.collection('usuarios').doc(userCredential.user.uid).set({
          email: email,
          displayName: displayName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          role: 'kinesiologo' // Por defecto, todos los nuevos usuarios son kinesiólogos
        });
      });
    });
}

// Función para iniciar sesión
function iniciarSesion(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// Función para cerrar sesión
function cerrarSesion() {
  return auth.signOut();
}

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        // Si no está en la página de inicio, redirigir al login
        if (window.location.pathname !== '/index.html' && 
            window.location.pathname !== '/' && 
            window.location.pathname !== '/sistemakine/' && 
            window.location.pathname !== '/sistemakine/index.html') {
          window.location.href = 'index.html';
          reject(new Error('Usuario no autenticado'));
        } else {
          resolve(null);
        }
      }
    }, reject);
  });
}

// Función para obtener el usuario actual
function obtenerUsuarioActual() {
  return auth.currentUser;
}

// Escuchar cambios en el estado de autenticación
auth.onAuthStateChanged(user => {
  // Actualizar la interfaz según el estado de autenticación
  const loginElements = document.querySelectorAll('.login-only');
  const appElements = document.querySelectorAll('.app-only');
  
  if (user) {
    // Usuario autenticado
    loginElements.forEach(el => el.style.display = 'none');
    appElements.forEach(el => el.style.display = 'block');
    
    // Actualizar información del usuario en la interfaz
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
      el.textContent = user.displayName || user.email;
    });
  } else {
    // Usuario no autenticado
    loginElements.forEach(el => el.style.display = 'block');
    appElements.forEach(el => el.style.display = 'none');
  }
});
