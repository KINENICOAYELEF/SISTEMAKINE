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

// Elementos del DOM
const patientForm = document.getElementById('patient-form');
const savePatientBtn = document.getElementById('save-patient-btn');
const clearFormBtn = document.getElementById('clear-form-btn');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Obtener usuario actual
    const userJSON = localStorage.getItem('currentUser');
    if (userJSON) {
        currentUser = JSON.parse(userJSON);
    }
    
    // Configurar event listeners
    setupEventListeners();
    
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
    if (savePatientBtn) {
        savePatientBtn.addEventListener('click', savePatient);
    }
    
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', clearForm);
    }
    
    // Otros event listeners específicos del formulario pueden agregarse aquí
}

// Cargar datos del paciente para edición
async function loadPatientData(patientId) {
    try {
        // Mostrar spinner de carga
        showSpinner();
        
        // Obtener datos del paciente
        const patientRef = doc(db, "patients", patientId);
        const patientDoc = await getDoc(patientRef);
        
        if (!patientDoc.exists()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Paciente no encontrado'
            });
            return;
        }
        
        // Guardar datos originales
        originalPatientData = patientDoc.data();
        
        // Llenar formulario con datos del paciente
        fillFormWithPatientData(originalPatientData);
        
        // Cambiar título y botones para modo edición
        document.querySelector('h1').textContent = 'Editar Paciente';
        if (savePatientBtn) savePatientBtn.textContent = 'Actualizar Paciente';
        
    } catch (error) {
        console.error("Error al cargar datos del paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los datos del paciente'
        });
    } finally {
        // Ocultar spinner
        hideSpinner();
    }
}

// Llenar formulario con datos del paciente
function fillFormWithPatientData(patientData) {
    // Datos básicos
    setFormValue('nombre-completo', patientData.name);
    setFormValue('rut', patientData.rut);
    setFormValue('fecha-nacimiento', patientData.birthdate);
    setFormValue('edad', patientData.age);
    setFormValue('genero', patientData.gender);
    
    // Información de contacto
    setFormValue('telefono', patientData.phone);
    setFormValue('email', patientData.email);
    setFormValue('direccion', patientData.address);
    setFormValue('ciudad', patientData.city);
    
    // Datos sociodemográficos
    setFormValue('nacionalidad', patientData.nationality);
    setFormValue('estado-civil', patientData.maritalStatus);
    setFormValue('nivel-educacional', patientData.educationLevel);
    
    // Información laboral
    setFormValue('ocupacion', patientData.occupation);
    setFormValue('lugar-trabajo', patientData.workplace);
    
    // Motivo de consulta
    setFormValue('motivo-consulta', patientData.consultReason);
    setFormValue('diagnostico-medico', patientData.medicalDiagnosis);
    setFormValue('fecha-inicio', patientData.onsetDate);
    setFormValue('mecanismo-lesion', patientData.injuryMechanism);
    
    // Otros campos pueden agregarse según sea necesario
}

// Función auxiliar para establecer valores en el formulario
function setFormValue(id, value) {
    const element = document.getElementById(id);
    if (!element || value === undefined || value === null) return;
    
    if (element.type === 'checkbox') {
        element.checked = value;
    } else if (element.type === 'radio') {
        const radioGroup = document.querySelectorAll(`input[name="${element.name}"]`);
        radioGroup.forEach(radio => {
            radio.checked = (radio.value === value);
        });
    } else if (element.tagName === 'SELECT') {
        element.value = value;
    } else if (element.tagName === 'TEXTAREA') {
        element.value = value;
    } else {
        element.value = value;
    }
}

// Guardar paciente
async function savePatient(e) {
    if (e) e.preventDefault();
    
    try {
        // Validar formulario
        if (!validateForm()) {
            return;
        }
        
        // Mostrar spinner
        showSpinner();
        
        // Recopilar datos del formulario
        const patientData = collectFormData();
        
        // Agregar metadatos
        patientData.lastUpdate = serverTimestamp();
        
        if (isEditMode) {
            // Actualizar paciente existente
            patientData.updatedBy = {
                uid: currentUser.uid,
                name: currentUser.name || currentUser.email
            };
            
            // Actualizar documento
            await setDoc(doc(db, "patients", patientId), patientData, { merge: true });
            
            Swal.fire({
                icon: 'success',
                title: 'Paciente actualizado',
                text: 'Los datos del paciente se han actualizado correctamente',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Redirigir a la lista de pacientes
                window.location.href = 'dashboard.html';
            });
        } else {
            // Crear nuevo paciente
            patientData.createdAt = serverTimestamp();
            patientData.createdBy = {
                uid: currentUser.uid,
                name: currentUser.name || currentUser.email
            };
            patientData.status = 'active'; // Por defecto, el paciente está activo
            
            // Crear nuevo documento con ID automático
            const newPatientRef = doc(collection(db, "patients"));
            await setDoc(newPatientRef, patientData);
            
            Swal.fire({
                icon: 'success',
                title: 'Paciente registrado',
                text: 'El paciente ha sido registrado correctamente',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Limpiar formulario o redirigir
                clearForm();
            });
        }
        
    } catch (error) {
        console.error("Error al guardar paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar el paciente. Intente nuevamente.'
        });
    } finally {
        // Ocultar spinner
        hideSpinner();
    }
}

// Recopilar datos del formulario
function collectFormData() {
    const data = {};
    
    // Datos básicos
    data.name = getFormValue('nombre-completo');
    data.rut = getFormValue('rut');
    data.birthdate = getFormValue('fecha-nacimiento');
    data.age = getFormValue('edad');
    data.gender = getFormValue('genero');
    
    // Información de contacto
    data.phone = getFormValue('telefono');
    data.email = getFormValue('email');
    data.address = getFormValue('direccion');
    data.city = getFormValue('ciudad');
    
    // Datos sociodemográficos
    data.nationality = getFormValue('nacionalidad');
    data.maritalStatus = getFormValue('estado-civil');
    data.educationLevel = getFormValue('nivel-educacional');
    
    // Información laboral
    data.occupation = getFormValue('ocupacion');
    data.workplace = getFormValue('lugar-trabajo');
    
    // Motivo de consulta
    data.consultReason = getFormValue('motivo-consulta');
    data.medicalDiagnosis = getFormValue('diagnostico-medico');
    data.onsetDate = getFormValue('fecha-inicio');
    data.injuryMechanism = getFormValue('mecanismo-lesion');
    
    // Otros campos pueden agregarse según sea necesario
    
    return data;
}

// Función auxiliar para obtener valores del formulario
function getFormValue(id) {
    const element = document.getElementById(id);
    if (!element) return null;
    
    if (element.type === 'checkbox') {
        return element.checked;
    } else if (element.type === 'radio') {
        const checkedRadio = document.querySelector(`input[name="${element.name}"]:checked`);
        return checkedRadio ? checkedRadio.value : null;
    } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        return element.value;
    }
    
    return null;
}

// Validar formulario
function validateForm() {
    // Campos requeridos
    const requiredFields = ['nombre-completo', 'rut', 'fecha-nacimiento', 'edad', 'genero'];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos obligatorios'
            });
            
            if (field) {
                field.focus();
                field.classList.add('is-invalid');
            }
            
            return false;
        } else {
            if (field) field.classList.remove('is-invalid');
        }
    }
    
    return true;
}

// Limpiar formulario
function clearForm() {
    if (patientForm) {
        patientForm.reset();
    } else {
        // Si no hay referencia al formulario, limpiar campos individualmente
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }
    
    // Restablecer modo
    isEditMode = false;
    patientId = null;
    originalPatientData = null;
    
    // Restablecer título y botones
    document.querySelector('h1').textContent = 'Formulario de Ingreso';
    if (savePatientBtn) savePatientBtn.textContent = 'Guardar Paciente';
}

// Mostrar spinner de carga
function showSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.remove('d-none');
    }
}

// Ocultar spinner de carga
function hideSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.add('d-none');
    }
}

// Exportar funciones públicas
export {
    savePatient,
    clearForm
};
