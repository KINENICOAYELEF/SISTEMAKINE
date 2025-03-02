// Reemplaza todo el contenido de js/auth.js con este código
import { auth } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Función para registrar un nuevo usuario
export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario registrado:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        throw error;
    }
}

// Función para iniciar sesión
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Inicio de sesión exitoso:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
}

// Función para cerrar sesión
export async function logoutUser() {
    try {
        await signOut(auth);
        console.log("Sesión cerrada exitosamente");
        return true;
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
    }
}

// Función para verificar si hay un usuario autenticado
export function getCurrentUser() {
    return auth.currentUser;
}

// Función para escuchar cambios en el estado de autenticación
export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// Inicialización para verificar sesión al cargar
document.addEventListener('DOMContentLoaded', function() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario ha iniciado sesión
            console.log("Usuario autenticado:", user.email);
            
            // Si estamos en index.html (página de login), redirigir al dashboard
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname.endsWith('/')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Usuario no ha iniciado sesión
            console.log("No hay usuario autenticado");
            
            // Si no estamos en index.html, redirigir al login
            if (!window.location.pathname.includes('index.html') && 
                !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }
    });
});
