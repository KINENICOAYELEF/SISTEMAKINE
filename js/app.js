// Importar las dependencias de Firebase necesarias
import { auth, db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Inicialización cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Aplicación inicializada");
    
    // Inicializar los botones de acción rápida
    initActionButtons();
    
    // Cargar datos iniciales
    loadInitialData();
});

// Función para inicializar todos los botones de acción
function initActionButtons() {
    console.log("Inicializando botones de acción");
    
    // Botón Nuevo Paciente
    const btnNuevoPaciente = document.querySelector('.btn-nuevo-paciente');
    if (btnNuevoPaciente) {
        btnNuevoPaciente.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Clic en Nuevo Paciente");
            window.location.href = 'modules/patient-form.html';
        });
    } else {
        console.warn("Botón Nuevo Paciente no encontrado");
    }
    
    // Botón Ver Pacientes
    const btnVerPacientes = document.querySelector('.btn-ver-pacientes');
    if (btnVerPacientes) {
        btnVerPacientes.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Clic en Ver Pacientes");
            window.location.href = 'modules/records.html';
        });
    } else {
        console.warn("Botón Ver Pacientes no encontrado");
    }
    
    // Botón Diagnóstico
    const btnDiagnostico = document.querySelector('.btn-diagnostico');
    if (btnDiagnostico) {
        btnDiagnostico.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Clic en Diagnóstico");
            window.location.href = 'modules/diagnosis.html';
        });
    } else {
        console.warn("Botón Diagnóstico no encontrado");
    }
    
    // Botón Evoluciones
    const btnEvoluciones = document.querySelector('.btn-evoluciones');
    if (btnEvoluciones) {
        btnEvoluciones.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Clic en Evoluciones");
            window.location.href = 'modules/evolution.html';
        });
    } else {
        console.warn("Botón Evoluciones no encontrado");
    }
    
    // Si los botones no están disponibles por clases, intentar con selectores alternativos
    initializeAlternativeButtons();
    
    // Enlaces del menú lateral
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                console.log("Clic en enlace del menú:", href);
                // No prevenimos el comportamiento por defecto aquí para permitir la navegación normal
            }
        });
    });
}

// Función para inicializar botones usando selectores alternativos
function initializeAlternativeButtons() {
    // Intentar por ID o texto
    document.querySelectorAll('button, a').forEach(button => {
        const text = button.textContent.trim().toLowerCase();
        
        if (text.includes('nuevo paciente')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Enlace interceptado: Nuevo Paciente");
                window.location.href = 'modules/patient-form.html';
            });
        } else if (text.includes('ver pacientes')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Enlace interceptado: Ver Pacientes");
                window.location.href = 'modules/records.html';
            });
        } else if (text.includes('diagnóstico') || text.includes('diagnostico')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Enlace interceptado: Diagnóstico");
                window.location.href = 'modules/diagnosis.html';
            });
        } else if (text.includes('evoluciones')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Enlace interceptado: Evoluciones");
                window.location.href = 'modules/evolution.html';
            });
        }
    });
}

// Función para cargar datos iniciales
async function loadInitialData() {
    console.log("Cargando datos iniciales");
    
    try {
        // Verificar si el usuario está autenticado
        if (auth.currentUser) {
            console.log("Usuario autenticado:", auth.currentUser.email);
            
            try {
                // Obtener conteo de pacientes desde Firebase
                const patientsRef = collection(db, "patients");
                const patientsSnapshot = await getDocs(patientsRef);
                
                const patientsCount = patientsSnapshot.size;
                const activePatientsCount = patientsSnapshot.docs.filter(doc => 
                    doc.data().status === 'active').length;
                
                updateCounters(patientsCount, activePatientsCount);
                
            } catch (firestoreError) {
                console.error("Error al consultar Firestore:", firestoreError);
                // Si hay error con Firestore, usar datos simulados
                simulateData();
            }
        } else {
            console.log("No hay usuario autenticado, usando datos simulados");
            simulateData();
        }
    } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        // En caso de error, usar datos simulados
        simulateData();
    }
}

// Función para actualizar contadores en la UI
function updateCounters(totalPatients, activePatients) {
    console.log(`Actualizando contadores: Total=${totalPatients}, Activos=${activePatients}`);
    
    // Actualizar contador de pacientes totales
    const totalElement = document.getElementById('pacientesTotales');
    if (totalElement) {
        totalElement.textContent = totalPatients.toString();
    }
    
    // Actualizar contador de pacientes activos
    const activeElement = document.getElementById('pacientesActivos');
    if (activeElement) {
        activeElement.textContent = activePatients.toString();
    }
    
    // Ocultar mensajes de carga
    document.querySelectorAll('.cargando-mensaje').forEach(el => {
        el.classList.add('d-none');
    });
}

// Función para simular datos cuando no hay conexión a Firebase
function simulateData() {
    console.log("Generando datos simulados");
    
    // Simular carga de datos
    setTimeout(() => {
        updateCounters(12, 8);
    }, 1000);
}
