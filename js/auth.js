// Funcionalidad de autenticación
import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Elementos del DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Alternar entre formularios de login y registro
if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('d-none');
        registerForm.classList.remove('d-none');
    });
}

if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('d-none');
        loginForm.classList.remove('d-none');
    });
}

// Funcionalidad de registro
if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        // Validación básica
        if (!name || !email || !password || !confirmPassword) {
            showError(registerError, 'Por favor completa todos los campos');
            return;
        }
        
        if (password !== confirmPassword) {
            showError(registerError, 'Las contraseñas no coinciden');
            return;
        }
        
        if (password.length < 6) {
            showError(registerError, 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        try {
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Guardar información adicional en Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                role: "kinesiologo", // Rol por defecto
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });
            
            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Redirigiendo al sistema...',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'dashboard.html';
            });
            
        } catch (error) {
            console.error("Error en registro:", error);
            let errorMessage = 'Error al crear la cuenta';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este correo electrónico ya está registrado';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Correo electrónico inválido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es demasiado débil';
                    break;
                default:
                    errorMessage = `Error: ${error.message}`;
            }
            
            showError(registerError, errorMessage);
        }
    });
}

// Funcionalidad de login
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Validación básica
        if (!email || !password) {
            showError(loginError, 'Por favor ingresa tu correo y contraseña');
            return;
        }
        
        try {
            // Iniciar sesión en Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Actualizar último inicio de sesión
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });
            
            // Persistencia (opcional según checkbox)
            // auth.setPersistence(rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION);
            
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error("Error en login:", error);
            let errorMessage = 'Error al iniciar sesión';
            
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = 'Correo o contraseña incorrectos';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Correo electrónico inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                default:
                    errorMessage = `Error: ${error.message}`;
            }
            
            showError(loginError, errorMessage);
        }
    });
}

// Verificar estado de autenticación
onAuthStateChanged(auth, async (user) => {
    // Si estamos en la página de inicio y el usuario está autenticado, redirigir al dashboard
    if (user && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    // Si estamos en el dashboard y el usuario no está autenticado, redirigir al login
    if (!user && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
    
    // Si el usuario está autenticado, podemos cargar sus datos
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                // Guardar datos del usuario en localStorage para uso en la aplicación
                localStorage.setItem('currentUser', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    name: userData.name,
                    role: userData.role
                }));
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    }
});

// Función para cerrar sesión (se usará en el dashboard)
window.logOut = async function() {
    try {
        await signOut(auth);
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cerrar sesión. Intenta nuevamente.'
        });
    }
};

// Función para mostrar errores
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('d-none');
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        element.classList.add('d-none');
    }, 5000);
}
