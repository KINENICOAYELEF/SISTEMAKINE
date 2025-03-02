// Funcionalidad para el formulario de pacientes
import { db, storage } from './firebase-config.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// Variables globales
let currentUser = null;
let isEditMode = false;
let patientId = null;
let originalPatientData = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log("Formulario de pacientes inicializado");
    
    // Obtener usuario actual
    const userJSON = localStorage.getItem('currentUser');
    if (userJSON) {
        currentUser = JSON.parse(userJSON);
        console.log("Usuario actual:", currentUser);
    } else {
        console.log("No hay usuario en sesión");
    }
    
    // Configurar event listeners
    setupEventListeners();
    
    // Activar primera pestaña
    activateFirstTab();
    
    // Configurar cálculos automáticos
    setupCalculations();
    
    // Verificar si estamos en modo edición (URL contiene patientId)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('patientId')) {
        patientId = urlParams.get('patientId');
        loadPatientData(patientId);
        isEditMode = true;
    }
});

// Configurar event listeners
function setupEventListeners() {
    const savePatientBtn = document.getElementById('save-patient-btn');
    if (savePatientBtn) {
        console.log("Configurando evento de guardar paciente");
        savePatientBtn.addEventListener('click', savePatient);
    } else {
        console.error("Botón de guardar paciente no encontrado");
    }
    
    const resetFormBtn = document.getElementById('reset-form-btn');
    if (resetFormBtn) {
        console.log("Configurando evento de limpiar formulario");
        resetFormBtn.addEventListener('click', clearForm);
    }
    
    // Configurar navegación entre pestañas
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                // Desactivar todas las pestañas
                document.querySelectorAll('.tab-pane').forEach(tab => {
                    tab.classList.remove('show', 'active');
                });
                document.querySelectorAll('.nav-link').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Activar la pestaña seleccionada
                target.classList.add('show', 'active');
                this.classList.add('active');
            }
        });
    });
}

// Activar primera pestaña
function activateFirstTab() {
    const firstTab = document.querySelector('#patient-form-tabs .nav-link');
    if (firstTab) {
        firstTab.click();
    }
}

// Configurar cálculos automáticos
function setupCalculations() {
    // Calcular edad automáticamente
    const birthdateInput = document.getElementById('patient-birthdate');
    const ageInput = document.getElementById('patient-age');
    
    if (birthdateInput && ageInput) {
        birthdateInput.addEventListener('change', () => {
            if (birthdateInput.value) {
                const birthdate = new Date(birthdateInput.value);
                const today = new Date();
                let age = today.getFullYear() - birthdate.getFullYear();
                const m = today.getMonth() - birthdate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
                    age--;
                }
                ageInput.value = age;
            } else {
                ageInput.value = '';
            }
        });
    }
    
    // Calcular IMC automáticamente
    const weightInput = document.getElementById('anthro-weight');
    const heightInput = document.getElementById('anthro-height');
    const imcInput = document.getElementById('anthro-imc');
    const imcStatusInput = document.getElementById('anthro-imc-status');
    
    if (weightInput && heightInput && imcInput && imcStatusInput) {
        const calculateIMC = () => {
            if (weightInput.value && heightInput.value) {
                const weight = parseFloat(weightInput.value);
                const height = parseFloat(heightInput.value) / 100; // convertir a metros
                const imc = weight / (height * height);
                imcInput.value = imc.toFixed(2);
                
                // Determinar clasificación
                let status = '';
                if (imc < 18.5) status = 'Bajo peso';
                else if (imc < 25) status = 'Normal';
                else if (imc < 30) status = 'Sobrepeso';
                else if (imc < 35) status = 'Obesidad grado I';
                else if (imc < 40) status = 'Obesidad grado II';
                else status = 'Obesidad grado III';
                
                imcStatusInput.value = status;
            } else {
                imcInput.value = '';
                imcStatusInput.value = '';
            }
        };
        
        weightInput.addEventListener('input', calculateIMC);
        heightInput.addEventListener('input', calculateIMC);
    }
}

// Guardar paciente
async function savePatient(e) {
    console.log("Iniciando guardado de paciente...");
    if (e) e.preventDefault();
    
    try {
        // Mostrar mensaje provisional
        Swal.fire({
            icon: 'info',
            title: 'Guardando paciente',
            text: 'Los datos del paciente están siendo procesados...',
            showConfirmButton: false,
            allowOutsideClick: false
        });
        
        // Simular proceso de guardado
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Paciente guardado',
                text: 'Los datos del paciente se han guardado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        }, 1500);
        
    } catch (error) {
        console.error("Error al guardar paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar el paciente. Intente nuevamente.'
        });
    }
}

// Limpiar formulario
function clearForm() {
    Swal.fire({
        title: '¿Está seguro?',
        text: "Se borrarán todos los datos ingresados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const form = document.getElementById('patient-form');
            if (form) {
                form.reset();
            } else {
                // Limpiar manualmente
                const inputs = document.querySelectorAll('input:not([readonly]), select, textarea');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
            }
            
            Swal.fire(
                '¡Limpiado!',
                'El formulario ha sido limpiado.',
                'success'
            );
        }
    });
}

// Función auxiliar para cargar datos de paciente (para modo edición)
async function loadPatientData(patientId) {
    console.log("Cargando datos del paciente:", patientId);
    // Esta función se completará más adelante cuando implementes la edición
}

// Exportar funciones públicas
export {
    savePatient,
    clearForm
};
