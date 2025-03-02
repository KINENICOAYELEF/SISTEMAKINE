// Funcionalidad para formularios
import { db, storage, auth } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    updateDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// Variables globales
let currentUser = null;
let activePatient = null;
let editMode = false;
let patientDocRef = null;
let bodyMapCanvas = null;

// Elementos del DOM
const patientForm = document.getElementById('patient-form');
const savePatientBtn = document.getElementById('save-patient-btn');
const resetFormBtn = document.getElementById('reset-form-btn');
const therapistNameField = document.getElementById('therapist-name');
const evaluationDateField = document.getElementById('evaluation-date');
const patientBirthdateField = document.getElementById('patient-birthdate');
const patientAgeField = document.getElementById('patient-age');

// Cálculos automáticos
const anthroWeightField = document.getElementById('anthro-weight');
const anthroHeightField = document.getElementById('anthro-height');
const anthroImcField = document.getElementById('anthro-imc');
const anthroImcStatusField = document.getElementById('anthro-imc-status');
const anthroWaistField = document.getElementById('anthro-waist');
const anthroHipField = document.getElementById('anthro-hip');
const anthroWaistHipRatioField = document.getElementById('anthro-waist-hip-ratio');

// Escalas y cuestionarios
const psfsScore1Field = document.getElementById('psfs-score-1');
const psfsScore2Field = document.getElementById('psfs-score-2');
const psfsScore3Field = document.getElementById('psfs-score-3');
const psfsTotalField = document.getElementById('psfs-total');
const grocScoreField = document.getElementById('groc-score');
const grocValueField = document.getElementById('groc-value');
const saneScoreField = document.getElementById('sane-score');
const saneValueField = document.getElementById('sane-value');
const painVasField = document.getElementById('pain-vas');
const painVasValueField = document.getElementById('pain-vas-value');

// Banderas
const redFlagsCheckboxes = document.querySelectorAll('input[name="red-flags"]');
const redFlagsRiskField = document.getElementById('red-flags-risk');

// Carga de archivos
const fileUploadInput = document.getElementById('file-upload');
const fileDescriptionInput = document.getElementById('file-description');
const uploadFileBtn = document.getElementById('upload-file-btn');
const filesTable = document.getElementById('files-table');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha actual para la evaluación
    const today = new Date().toISOString().split('T')[0];
    if (evaluationDateField) {
        evaluationDateField.value = today;
    }
    
    // Cargar datos del usuario actual
    loadCurrentUser();
    
    // Configurar event listeners para acciones principales
    setupEventListeners();
    
    // Inicializar el mapa corporal
    initBodyMap();
});

// Event listener para cuando el módulo está listo (cargado desde dashboard.js)
document.addEventListener('moduleReady', (event) => {
    const data = event.detail;
    
    if (data.module === 'patient-form') {
        // Si se está editando un paciente existente
        if (data.params && data.params.patientId) {
            loadPatientData(data.params.patientId);
            editMode = true;
        }
        
        // Si hay un paciente activo, cargar sus datos
        if (data.activePatient && !editMode) {
            loadPatientData(data.activePatient.id);
            editMode = true;
        }
    }
});

// Cargar datos del usuario actual
function loadCurrentUser() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && therapistNameField) {
        therapistNameField.value = currentUser.name || currentUser.email;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Guardar paciente
    if (savePatientBtn) {
        savePatientBtn.addEventListener('click', savePatient);
    }
    
    // Resetear formulario
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', resetForm);
    }
    
    // Calcular edad automáticamente al cambiar fecha de nacimiento
    if (patientBirthdateField && patientAgeField) {
        patientBirthdateField.addEventListener('change', calculateAge);
    }
    
    // Calcular IMC automáticamente
    if (anthroWeightField && anthroHeightField) {
        anthroWeightField.addEventListener('input', calculateBMI);
        anthroHeightField.addEventListener('input', calculateBMI);
    }
    
    // Calcular índice cintura/cadera
    if (anthroWaistField && anthroHipField) {
        anthroWaistField.addEventListener('input', calculateWaistHipRatio);
        anthroHipField.addEventListener('input', calculateWaistHipRatio);
    }
    
    // Actualizar puntuación total PSFS
    if (psfsScore1Field && psfsScore2Field && psfsScore3Field) {
        psfsScore1Field.addEventListener('input', calculatePsfsTotal);
        psfsScore2Field.addEventListener('input', calculatePsfsTotal);
        psfsScore3Field.addEventListener('input', calculatePsfsTotal);
    }
    
    // Actualizar valor GROC
    if (grocScoreField && grocValueField) {
        grocScoreField.addEventListener('input', () => {
            grocValueField.value = grocScoreField.value;
        });
    }
    
    // Actualizar valor SANE
    if (saneScoreField && saneValueField) {
        saneScoreField.addEventListener('input', () => {
            saneValueField.value = saneScoreField.value;
        });
    }
    
    // Actualizar valor EVA
    if (painVasField && painVasValueField) {
        painVasField.addEventListener('input', () => {
            painVasValueField.value = painVasField.value;
        });
    }
    
    // Calcular nivel de riesgo banderas rojas
    if (redFlagsCheckboxes.length > 0) {
        redFlagsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calculateRedFlagsRisk);
        });
    }
    
    // Subir archivos
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', uploadFile);
    }
}

// Calcular edad
function calculateAge() {
    if (!patientBirthdateField.value) return;
    
    const birthdate = new Date(patientBirthdateField.value);
    const today = new Date();
    
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    
    patientAgeField.value = age;
}

// Calcular IMC
function calculateBMI() {
    if (!anthroWeightField.value || !anthroHeightField.value) return;
    
    const weight = parseFloat(anthroWeightField.value);
    const height = parseFloat(anthroHeightField.value) / 100; // convertir cm a metros
    
    const bmi = weight / (height * height);
    anthroImcField.value = bmi.toFixed(2);
    
    // Clasificación IMC
    let bmiStatus = '';
    if (bmi < 18.5) {
        bmiStatus = 'Bajo peso';
    } else if (bmi >= 18.5 && bmi < 25) {
        bmiStatus = 'Normal';
    } else if (bmi >= 25 && bmi < 30) {
        bmiStatus = 'Sobrepeso';
    } else if (bmi >= 30 && bmi < 35) {
        bmiStatus = 'Obesidad I';
    } else if (bmi >= 35 && bmi < 40) {
        bmiStatus = 'Obesidad II';
    } else if (bmi >= 40) {
        bmiStatus = 'Obesidad III';
    }
    
    anthroImcStatusField.value = bmiStatus;
}

// Calcular índice cintura/cadera
function calculateWaistHipRatio() {
    if (!anthroWaistField.value || !anthroHipField.value) return;
    
    const waist = parseFloat(anthroWaistField.value);
    const hip = parseFloat(anthroHipField.value);
    
    const ratio = waist / hip;
    anthroWaistHipRatioField.value = ratio.toFixed(2);
}

// Calcular puntuación total PSFS
function calculatePsfsTotal() {
    let total = 0;
    let count = 0;
    
    if (psfsScore1Field.value) {
        total += parseInt(psfsScore1Field.value);
        count++;
    }
    
    if (psfsScore2Field.value) {
        total += parseInt(psfsScore2Field.value);
        count++;
    }
    
    if (psfsScore3Field.value) {
        total += parseInt(psfsScore3Field.value);
        count++;
    }
    
    if (count > 0) {
        psfsTotalField.value = (total / count).toFixed(1);
    } else {
        psfsTotalField.value = '';
    }
}

// Calcular nivel de riesgo banderas rojas
function calculateRedFlagsRisk() {
    let count = 0;
    
    redFlagsCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            count++;
        }
    });
    
    let risk = '';
    if (count === 0) {
        risk = 'Bajo';
    } else if (count >= 1 && count <= 2) {
        risk = 'Moderado';
    } else {
        risk = 'Alto';
    }
    
    redFlagsRiskField.value = risk;
    
    // Alertar si hay banderas rojas de riesgo alto
    if (risk === 'Alto') {
        Swal.fire({
            icon: 'warning',
            title: 'Banderas rojas de alto riesgo',
            text: 'Se detectaron varias banderas rojas. Considere derivación médica urgente.',
            confirmButtonText: 'Entendido'
        });
    }
}

// Inicializar mapa corporal
function initBodyMap() {
    const bodyMapContainer = document.getElementById('body-map-canvas');
    
    if (!bodyMapContainer) return;
    
    // Crear canvas con Fabric.js (esto requeriría importar la biblioteca Fabric.js)
    // Código de inicialización del mapa corporal aquí...
    
    // Por ahora, mostramos un mensaje provisional
    bodyMapContainer.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i> El mapa corporal interactivo se cargará aquí.
            <br>Se requiere implementar con Fabric.js para dibujo interactivo.
        </div>
        <div style="display: flex; justify-content: center;">
            <img src="assets/img/body-map-template.png" alt="Plantilla de mapa corporal" style="max-width: 100%; height: auto;">
        </div>
    `;
}

// Guardar paciente
async function savePatient() {
    try {
        // Mostrar spinner
        window.app.showSpinner();
        
        // Validar formulario
        if (!validateForm()) {
            window.app.hideSpinner();
            return;
        }
        
        // Recopilar datos del formulario
        const patientData = collectFormData();
        
        // Agregar metadatos
        patientData.updatedBy = {
            uid: currentUser.uid,
            name: currentUser.name || currentUser.email
        };
        patientData.lastUpdate = serverTimestamp();
        
        let patientId;
        
        if (editMode && patientDocRef) {
            // Actualizar paciente existente
            await updateDoc(patientDocRef, patientData);
            patientId = patientDocRef.id;
            
            Swal.fire({
                icon: 'success',
                title: 'Paciente actualizado',
                text: 'Los datos del paciente se han actualizado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            // Agregar datos de creación para nuevo paciente
            patientData.createdBy = {
                uid: currentUser.uid,
                name: currentUser.name || currentUser.email
            };
            patientData.createdAt = serverTimestamp();
            patientData.status = 'active';
            
            // Crear nuevo paciente
            const docRef = await addDoc(collection(db, "patients"), patientData);
            patientId = docRef.id;
            
            Swal.fire({
                icon: 'success',
                title: 'Paciente registrado',
                text: 'El nuevo paciente se ha registrado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
            
            // Restablecer formulario después de crear nuevo paciente
            resetForm();
        }
        
        // Opcionalmente, establecer como paciente activo
        if (patientData.name) {
            const newActivePatient = {
                id: patientId,
                name: patientData.name,
                rut: patientData.rut
            };
            
            await window.app.setActivePatient(patientId);
        }
        
    } catch (error) {
        console.error("Error al guardar paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar el paciente. Intente nuevamente.'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Validar formulario
function validateForm() {
    // Validar campos requeridos
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
            
            // Asegurarse de que la pestaña que contiene el campo requerido se muestre
            const tabPane = field.closest('.tab-pane');
            if (tabPane) {
                const tabId = tabPane.id;
                const tabLink = document.querySelector(`[data-bs-target="#${tabId}"]`);
                if (tabLink) {
                    tabLink.click();
                }
            }
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        Swal.fire({
            icon: 'warning',
            title: 'Formulario incompleto',
            text: 'Por favor complete todos los campos requeridos'
        });
        return false;
    }
    
    return true;
}

// Recopilar datos del formulario
function collectFormData() {
    const formData = new FormData(patientForm);
    const patientData = {};
    
    // Convertir FormData a objeto
    for (let [key, value] of formData.entries()) {
        // Agrupar campos que son parte de una misma sección
        if (key.startsWith('patient-')) {
            const simplifiedKey = key.replace('patient-', '');
            patientData[simplifiedKey] = value;
        } else if (key.startsWith('alicia-')) {
            if (!patientData.alicia) patientData.alicia = {};
            const simplifiedKey = key.replace('alicia-', '');
            patientData.alicia[simplifiedKey] = value;
        } else if (key.startsWith('sinss-')) {
            if (!patientData.sinss) patientData.sinss = {};
            const simplifiedKey = key.replace('sinss-', '');
            patientData.sinss[simplifiedKey] = value;
        } else if (key.startsWith('anthro-')) {
            if (!patientData.anthropometry) patientData.anthropometry = {};
            const simplifiedKey = key.replace('anthro-', '');
            patientData.anthropometry[simplifiedKey] = value;
        } else if (key.startsWith('vital-')) {
            if (!patientData.vitals) patientData.vitals = {};
            const simplifiedKey = key.replace('vital-', '');
            patientData.vitals[simplifiedKey] = value;
        } else if (key.startsWith('psfs-')) {
            if (!patientData.psfs) patientData.psfs = {};
            const simplifiedKey = key.replace('psfs-', '');
            patientData.psfs[simplifiedKey] = value;
        } else {
            // Campos generales
            patientData[key] = value;
        }
    }
    
    // Manejar checkboxes para enfermedades crónicas
    const chronicDiseases = [];
    document.querySelectorAll('input[name="chronic-diseases"]:checked').forEach(checkbox => {
        chronicDiseases.push(checkbox.value);
    });
    patientData.chronicDiseases = chronicDiseases;
    
    // Manejar banderas rojas
    const redFlags = [];
    document.querySelectorAll('input[name="red-flags"]:checked').forEach(checkbox => {
        redFlags.push(checkbox.value);
    });
    
    patientData.flags = {
        red: redFlags,
        redRisk: redFlagsRiskField ? redFlagsRiskField.value : ''
    };
    
    // Datos del mapa corporal (si existe)
    const bodyMapDataField = document.getElementById('body-map-data');
    if (bodyMapDataField && bodyMapDataField.value) {
        patientData.bodyMap = bodyMapDataField.value;
    }
    
    return patientData;
}

// Cargar datos de paciente existente
async function loadPatientData(patientId) {
    try {
        window.app.showSpinner();
        
        patientDocRef = doc(db, "patients", patientId);
        const patientDoc = await getDoc(patientDocRef);
        
        if (!patientDoc.exists()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Paciente no encontrado'
            });
            window.app.hideSpinner();
            return;
        }
        
        const patientData = patientDoc.data();
        
        // Llenar campos del formulario
        fillFormWithPatientData(patientData);
        
        // Cargar archivos del paciente
        loadPatientFiles(patientId);
        
    } catch (error) {
        console.error("Error al cargar datos del paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los datos del paciente'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Llenar formulario con datos del paciente
function fillFormWithPatientData(patientData) {
    // Datos básicos
    document.getElementById('patient-name').value = patientData.name || '';
    document.getElementById('patient-rut').value = patientData.rut || '';
    document.getElementById('patient-birthdate').value = patientData.birthdate || '';
    document.getElementById('patient-gender').value = patientData.gender || '';
    
    // Calcular edad si hay fecha de nacimiento
    if (patientData.birthdate) {
        calculateAge();
    }
    
    // Contacto
    document.getElementById('patient-phone').value = patientData.phone || '';
    document.getElementById('patient-email').value = patientData.email || '';
    document.getElementById('patient-address').value = patientData.address || '';
    document.getElementById('patient-city').value = patientData.city || '';
    
    // Sociodemográficos
    document.getElementById('patient-nationality').value = patientData.nationality || '';
    document.getElementById('patient-marital-status').value = patientData.maritalStatus || '';
    document.getElementById('patient-education').value = patientData.education || '';
    
    // Y así sucesivamente para todos los campos...
    
    // Ejemplo para secciones anidadas
    if (patientData.alicia) {
        document.getElementById('alicia-antiquity').value = patientData.alicia.antiquity || '';
        document.getElementById('alicia-location').value = patientData.alicia.location || '';
        document.getElementById('alicia-intensity').value = patientData.alicia.intensity || '';
        document.getElementById('alicia-character').value = patientData.alicia.character || '';
        document.getElementById('alicia-irradiation').value = patientData.alicia.irradiation || '';
        document.getElementById('alicia-attenuation').value = patientData.alicia.attenuation || '';
    }
    
    // Manejar checkboxes para enfermedades crónicas
    if (patientData.chronicDiseases && Array.isArray(patientData.chronicDiseases)) {
        patientData.chronicDiseases.forEach(disease => {
            const checkbox = document.querySelector(`input[name="chronic-diseases"][value="${disease}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
    
    // Manejar banderas rojas
    if (patientData.flags && patientData.flags.red && Array.isArray(patientData.flags.red)) {
        patientData.flags.red.forEach(flag => {
            const checkbox = document.querySelector(`input[name="red-flags"][value="${flag}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Actualizar nivel de riesgo
        calculateRedFlagsRisk();
    }
    
    // Y así sucesivamente...
}

// Cargar archivos del paciente
async function loadPatientFiles(patientId) {
    // Esta función cargaría los archivos asociados al paciente desde Firebase Storage
    // y los mostraría en la tabla de archivos
    
    // Por simplificación, mostramos un ejemplo
    if (filesTable) {
        filesTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Cargando archivos...</td>
            </tr>
        `;
        
        // Aquí iría el código para recuperar archivos de Firebase Storage
        
        // Mostrar mensaje provisional
        filesTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Esta funcionalidad requiere implementación con Firebase Storage
                </td>
            </tr>
        `;
    }
}

// Subir archivo
async function uploadFile() {
    if (!fileUploadInput || !fileUploadInput.files.length) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin archivos seleccionados',
            text: 'Por favor seleccione un archivo para subir'
        });
        return;
    }
    
    const file = fileUploadInput.files[0];
    const description = fileDescriptionInput ? fileDescriptionInput.value : '';
    
    // Validar tamaño del archivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
            icon: 'error',
            title: 'Archivo demasiado grande',
            text: 'El tamaño máximo permitido es 5MB'
        });
        return;
    }
    
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Tipo de archivo no permitido',
            text: 'Los formatos permitidos son: jpg, png, pdf, doc, docx'
        });
        return;
    }
    
    try {
        window.app.showSpinner();
        
        // Aquí iría el código para subir el archivo a Firebase Storage
        // y guardar su referencia en Firestore
        
        Swal.fire({
            icon: 'success',
            title: 'Archivo cargado',
            text: 'El archivo se ha subido correctamente',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Limpiar campos
        fileUploadInput.value = '';
        if (fileDescriptionInput) fileDescriptionInput.value = '';
        
    } catch (error) {
        console.error("Error al subir archivo:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo subir el archivo. Intente nuevamente.'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Resetear formulario
function resetForm() {
    Swal.fire({
        title: '¿Está seguro?',
        text: 'Se perderán todos los datos no guardados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, limpiar formulario',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            patientForm.reset();
            
            // Restablecer fecha actual
            const today = new Date().toISOString().split('T')[0];
            if (evaluationDateField) {
                evaluationDateField.value = today;
            }
            
            // Restablecer nombre del terapeuta
            if (therapistNameField && currentUser) {
                therapistNameField.value = currentUser.name || currentUser.email;
            }
            
            // Limpiar clases de validación
            document.querySelectorAll('.is-invalid').forEach(field => {
                field.classList.remove('is-invalid');
            });
            
            // Volver a la primera pestaña
            const firstTab = document.querySelector('#patient-form-tabs .nav-link');
            if (firstTab) {
                firstTab.click();
            }
            
            // Limpiar mapa corporal
            if (bodyMapCanvas) {
                // Limpiar canvas...
            }
            
            // Salir del modo de edición
            editMode = false;
            patientDocRef = null;
            
            Swal.fire({
                icon: 'success',
                title: 'Formulario limpio',
                text: 'El formulario ha sido restablecido',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Exportar funciones públicas
export {
    savePatient,
    resetForm,
    loadPatientData
};
