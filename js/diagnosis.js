// Funcionalidad para el diagnóstico kinesiológico
import { db } from './firebase-config.js';
import { 
    collection, 
    doc, 
    getDoc, 
    setDoc,
    updateDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Variables globales
let currentUser = null;
let activePatient = null;
let diagnosisDocRef = null;
let editMode = false;
let hypothesisList = [];

// Elementos DOM
const patientInfoContainer = document.getElementById('patient-info');
const selectedPatientName = document.getElementById('selected-patient-name');
const selectedPatientRut = document.getElementById('selected-patient-rut');
const selectedPatientAge = document.getElementById('selected-patient-age');
const changePatientBtn = document.getElementById('change-patient-btn');
const saveDiagnosisBtn = document.getElementById('save-diagnosis-btn');
const diagnosisForm = document.getElementById('diagnosis-form');

// Elementos para hipótesis diagnósticas
const hypothesisInput = document.getElementById('hypothesis-input');
const addHypothesisBtn = document.getElementById('add-hypothesis-btn');
const hypothesisTableBody = document.getElementById('hypothesis-list');

// Elementos para banderas
const redFlagsContainer = document.getElementById('red-flags-container');
const yellowFlagsContainer = document.getElementById('yellow-flags-container');
const blueFlagsContainer = document.getElementById('blue-flags-container');
const blackFlagsContainer = document.getElementById('black-flags-container');

// Elementos para cuestionarios de dolor
const showDn4Btn = document.getElementById('show-dn4-btn');
const showPaindetectBtn = document.getElementById('show-paindetect-btn');
const showCentralBtn = document.getElementById('show-central-btn');
const painQuestionnairesContainer = document.getElementById('pain-questionnaires-container');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar event listeners
    setupEventListeners();
});

// Event listener para cuando el módulo está listo (cargado desde dashboard.js)
document.addEventListener('moduleReady', (event) => {
    const data = event.detail;
    
    if (data.module === 'diagnosis') {
        // Cargar usuario actual
        currentUser = window.app.getCurrentUser();
        
        // Verificar si hay un paciente activo
        activePatient = data.activePatient;
        
        if (activePatient) {
            updatePatientInfo(activePatient);
            loadPatientFlags(activePatient.id);
            checkExistingDiagnosis(activePatient.id);
        } else {
            // Mostrar mensaje de que se requiere seleccionar un paciente
            Swal.fire({
                icon: 'warning',
                title: 'Paciente requerido',
                text: 'Debe seleccionar un paciente para realizar un diagnóstico',
                confirmButtonText: 'Seleccionar paciente'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.app.loadModule('records');
                }
            });
        }
    }
});

// Configurar event listeners
function setupEventListeners() {
    // Cambiar paciente
    if (changePatientBtn) {
        changePatientBtn.addEventListener('click', () => {
            window.app.loadModule('records');
        });
    }
    
    // Guardar diagnóstico
    if (saveDiagnosisBtn) {
        saveDiagnosisBtn.addEventListener('click', saveDiagnosis);
    }
    
    // Agregar hipótesis
    if (addHypothesisBtn && hypothesisInput) {
        addHypothesisBtn.addEventListener('click', addHypothesis);
        hypothesisInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                addHypothesis();
            }
        });
    }
    
    // Mostrar cuestionarios de dolor
    if (showDn4Btn) {
        showDn4Btn.addEventListener('click', () => showPainQuestionnaire('dn4'));
    }
    
    if (showPaindetectBtn) {
        showPaindetectBtn.addEventListener('click', () => showPainQuestionnaire('paindetect'));
    }
    
    if (showCentralBtn) {
        showCentralBtn.addEventListener('click', () => showPainQuestionnaire('central'));
    }
    
    // Inicializar visualización CIF
    initCifVisualization();
}

// Actualizar información del paciente en la UI
function updatePatientInfo(patient) {
    if (!patientInfoContainer) return;
    
    if (selectedPatientName) selectedPatientName.textContent = patient.name || 'Sin nombre';
    if (selectedPatientRut) selectedPatientRut.textContent = patient.rut || 'Sin RUT';
    if (selectedPatientAge) selectedPatientAge.textContent = patient.age ? `${patient.age} años` : 'Edad no registrada';
    
    patientInfoContainer.classList.remove('d-none');
}

// Verificar si ya existe un diagnóstico para el paciente
async function checkExistingDiagnosis(patientId) {
    try {
        window.app.showSpinner();
        
        // Buscar diagnóstico existente
        const diagnosisRef = doc(db, "patients", patientId, "diagnosis", "current");
        const diagnosisDoc = await getDoc(diagnosisRef);
        
        if (diagnosisDoc.exists()) {
            // Guardar referencia al documento
            diagnosisDocRef = diagnosisRef;
            editMode = true;
            
            // Cargar datos del diagnóstico existente
            const diagnosisData = diagnosisDoc.data();
            fillDiagnosisForm(diagnosisData);
            
            // Mostrar notificación
            Swal.fire({
                icon: 'info',
                title: 'Diagnóstico existente',
                text: 'Se ha cargado un diagnóstico existente para este paciente',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            // Crear referencia para nuevo diagnóstico
            diagnosisDocRef = diagnosisRef;
            editMode = false;
            
            // Limpiar formulario
            resetDiagnosisForm();
        }
        
    } catch (error) {
        console.error("Error al verificar diagnóstico existente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo verificar si existe un diagnóstico previo'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Llenar formulario con datos de diagnóstico existente
function fillDiagnosisForm(diagnosisData) {
    // Razonamiento Clínico
    if (diagnosisData.mainProblem) {
        document.getElementById('main-problem').value = diagnosisData.mainProblem;
    }
    
    if (diagnosisData.clinicalTests) {
        document.getElementById('clinical-tests').value = diagnosisData.clinicalTests;
    }
    
    if (diagnosisData.finalDiagnosis) {
        document.getElementById('final-diagnosis').value = diagnosisData.finalDiagnosis;
    }
    
    if (diagnosisData.scientificEvidence) {
        document.getElementById('scientific-evidence').value = diagnosisData.scientificEvidence;
    }
    
    // Hipótesis diagnósticas
    if (diagnosisData.hypotheses && Array.isArray(diagnosisData.hypotheses)) {
        hypothesisList = [...diagnosisData.hypotheses];
        renderHypothesisList();
    }
    
    // Categorización CIF
    if (diagnosisData.cif) {
        const cif = diagnosisData.cif;
        
        if (cif.deficiency) {
            document.getElementById('cif-deficiency-description').value = cif.deficiency.description || '';
            document.getElementById('cif-deficiency-code').value = cif.deficiency.code || '';
        }
        
        if (cif.activity) {
            document.getElementById('cif-activity-description').value = cif.activity.description || '';
            document.getElementById('cif-activity-level').value = cif.activity.level || '';
            document.getElementById('cif-activity-code').value = cif.activity.code || '';
        }
        
        if (cif.participation) {
            document.getElementById('cif-participation-description').value = cif.participation.description || '';
            document.getElementById('cif-participation-level').value = cif.participation.level || '';
            document.getElementById('cif-participation-code').value = cif.participation.code || '';
        }
        
        if (cif.contextual) {
            document.getElementById('cif-facilitators').value = cif.contextual.facilitators || '';
            document.getElementById('cif-barriers').value = cif.contextual.barriers || '';
            document.getElementById('cif-facilitators-code').value = cif.contextual.facilitatorsCode || '';
            document.getElementById('cif-barriers-code').value = cif.contextual.barriersCode || '';
        }
        
        // Actualizar visualización CIF
        updateCifVisualization();
    }
    
    // Modelo de Dolor
    if (diagnosisData.painModel) {
        const painModel = diagnosisData.painModel;
        
        if (painModel.mechanism) {
            const mechanismRadio = document.querySelector(`input[name="pain-mechanism"][value="${painModel.mechanism}"]`);
            if (mechanismRadio) mechanismRadio.checked = true;
        }
        
        if (painModel.biopsychosocial) {
            document.getElementById('bio-factors').value = painModel.biopsychosocial.bio || '';
            document.getElementById('psycho-factors').value = painModel.biopsychosocial.psycho || '';
            document.getElementById('social-factors').value = painModel.biopsychosocial.social || '';
        }
        
        if (painModel.neuroscience) {
            document.getElementById('pain-neuroscience').value = painModel.neuroscience;
        }
    }
    
    // Recomendaciones según banderas
    if (diagnosisData.flagsRecommendations) {
        document.getElementById('flags-recommendations').value = diagnosisData.flagsRecommendations;
    }
}

// Resetear formulario de diagnóstico
function resetDiagnosisForm() {
    if (!diagnosisForm) return;
    
    diagnosisForm.reset();
    
    // Limpiar hipótesis
    hypothesisList = [];
    renderHypothesisList();
    
    // Limpiar visualización CIF
    updateCifVisualization();
}

// Guardar diagnóstico
async function saveDiagnosis() {
    try {
        // Validar formulario
        if (!validateDiagnosisForm()) {
            return;
        }
        
        window.app.showSpinner();
        
        // Recopilar datos del formulario
        const diagnosisData = collectDiagnosisData();
        
        // Agregar metadatos
        diagnosisData.updatedBy = {
            uid: currentUser.uid,
            name: currentUser.name || currentUser.email
        };
        diagnosisData.updatedAt = serverTimestamp();
        
        if (!editMode) {
            // Agregar datos de creación para nuevo diagnóstico
            diagnosisData.createdBy = {
                uid: currentUser.uid,
                name: currentUser.name || currentUser.email
            };
            diagnosisData.createdAt = serverTimestamp();
        }
        
        // Guardar en Firestore
        if (editMode) {
            await updateDoc(diagnosisDocRef, diagnosisData);
        } else {
            await setDoc(diagnosisDocRef, diagnosisData);
        }
        
        // Actualizar status del paciente si no estaba ya activo
        if (activePatient && activePatient.status !== 'active') {
            const patientRef = doc(db, "patients", activePatient.id);
            await updateDoc(patientRef, {
                status: 'active',
                lastUpdate: serverTimestamp()
            });
        }
        
        // Actualizar diagnóstico principal en la ficha del paciente
        if (diagnosisData.finalDiagnosis) {
            const patientRef = doc(db, "patients", activePatient.id);
            await updateDoc(patientRef, {
                diagnosis: diagnosisData.finalDiagnosis,
                lastUpdate: serverTimestamp()
            });
        }
        
        Swal.fire({
            icon: 'success',
            title: 'Diagnóstico guardado',
            text: 'El diagnóstico kinesiológico se ha guardado correctamente',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Actualizar estado para permitir edición
        editMode = true;
        
    } catch (error) {
        console.error("Error al guardar diagnóstico:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar el diagnóstico. Intente nuevamente.'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Validar formulario de diagnóstico
function validateDiagnosisForm() {
    const mainProblem = document.getElementById('main-problem');
    const finalDiagnosis = document.getElementById('final-diagnosis');
    
    let isValid = true;
    
    // Validar problema principal
    if (!mainProblem || !mainProblem.value.trim()) {
        mainProblem.classList.add('is-invalid');
        isValid = false;
        
        // Seleccionar pestaña correspondiente
        document.getElementById('reasoning-tab').click();
    } else {
        mainProblem.classList.remove('is-invalid');
    }
    
    // Validar diagnóstico final
    if (!finalDiagnosis || !finalDiagnosis.value.trim()) {
        finalDiagnosis.classList.add('is-invalid');
        isValid = false;
        
        // Seleccionar pestaña correspondiente si no se hizo antes
        if (isValid) {
            document.getElementById('reasoning-tab').click();
        }
    } else {
        finalDiagnosis.classList.remove('is-invalid');
    }
    
    if (!isValid) {
        Swal.fire({
            icon: 'warning',
            title: 'Formulario incompleto',
            text: 'Por favor complete los campos requeridos para el diagnóstico'
        });
    }
    
    return isValid;
}

// Recopilar datos del formulario de diagnóstico
function collectDiagnosisData() {
    const diagnosisData = {};
    
    // Razonamiento Clínico
    diagnosisData.mainProblem = document.getElementById('main-problem').value;
    diagnosisData.clinicalTests = document.getElementById('clinical-tests').value;
    diagnosisData.finalDiagnosis = document.getElementById('final-diagnosis').value;
    diagnosisData.scientificEvidence = document.getElementById('scientific-evidence').value;
    
    // Hipótesis diagnósticas
    diagnosisData.hypotheses = hypothesisList;
    
    // Categorización CIF
    diagnosisData.cif = {
        deficiency: {
            description: document.getElementById('cif-deficiency-description').value,
            code: document.getElementById('cif-deficiency-code').value
        },
        activity: {
            description: document.getElementById('cif-activity-description').value,
            level: document.getElementById('cif-activity-level').value,
            code: document.getElementById('cif-activity-code').value
        },
        participation: {
            description: document.getElementById('cif-participation-description').value,
            level: document.getElementById('cif-participation-level').value,
            code: document.getElementById('cif-participation-code').value
        },
        contextual: {
            facilitators: document.getElementById('cif-facilitators').value,
            barriers: document.getElementById('cif-barriers').value,
            facilitatorsCode: document.getElementById('cif-facilitators-code').value,
            barriersCode: document.getElementById('cif-barriers-code').value
        }
    };
    
    // Modelo de Dolor
    const painMechanism = document.querySelector('input[name="pain-mechanism"]:checked');
    
    diagnosisData.painModel = {
        mechanism: painMechanism ? painMechanism.value : null,
        biopsychosocial: {
            bio: document.getElementById('bio-factors').value,
            psycho: document.getElementById('psycho-factors').value,
            social: document.getElementById('social-factors').value
        },
        neuroscience: document.getElementById('pain-neuroscience').value
    };
    
    // Recomendaciones según banderas
    diagnosisData.flagsRecommendations = document.getElementById('flags-recommendations').value;
    
    return diagnosisData;
}

// Agregar hipótesis diagnóstica
function addHypothesis() {
    if (!hypothesisInput || !hypothesisInput.value.trim()) return;
    
    const hypothesis = {
        text: hypothesisInput.value.trim(),
        probability: hypothesisList.length === 0 ? 'alta' : 'media'
    };
    
    hypothesisList.push(hypothesis);
    hypothesisInput.value = '';
    hypothesisInput.focus();
    
    renderHypothesisList();
}

// Renderizar lista de hipótesis
function renderHypothesisList() {
    if (!hypothesisTableBody) return;
    
    if (hypothesisList.length === 0) {
        hypothesisTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay hipótesis agregadas</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    hypothesisList.forEach((hypothesis, index) => {
        const probabilityBadge = getProbabilityBadge(hypothesis.probability);
        
        html += `
            <tr>
                <td>${hypothesis.text}</td>
                <td>${probabilityBadge}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary probability-btn" data-index="${index}" data-probability="alta">
                            Alta
                        </button>
                        <button type="button" class="btn btn-outline-primary probability-btn" data-index="${index}" data-probability="media">
                            Media
                        </button>
                        <button type="button" class="btn btn-outline-primary probability-btn" data-index="${index}" data-probability="baja">
                            Baja
                        </button>
                        <button type="button" class="btn btn-outline-danger delete-hypothesis-btn" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    hypothesisTableBody.innerHTML = html;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.probability-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            const probability = e.currentTarget.getAttribute('data-probability');
            
            if (index >= 0 && index < hypothesisList.length) {
                hypothesisList[index].probability = probability;
                renderHypothesisList();
            }
        });
        
        // Marcar botón activo según probabilidad actual
        const index = parseInt(btn.getAttribute('data-index'));
        const probability = btn.getAttribute('data-probability');
        
        if (index >= 0 && index < hypothesisList.length && 
            hypothesisList[index].probability === probability) {
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-primary');
        }
    });
    
    document.querySelectorAll('.delete-hypothesis-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            
            if (index >= 0 && index < hypothesisList.length) {
                hypothesisList.splice(index, 1);
                renderHypothesisList();
            }
        });
    });
}

// Obtener badge para probabilidad
function getProbabilityBadge(probability) {
    switch (probability) {
        case 'alta':
            return '<span class="badge bg-success">Alta</span>';
        case 'media':
            return '<span class="badge bg-warning text-dark">Media</span>';
        case 'baja':
            return '<span class="badge bg-danger">Baja</span>';
        default:
            return '<span class="badge bg-secondary">No definida</span>';
    }
}

// Cargar banderas del paciente
async function loadPatientFlags(patientId) {
    try {
        if (!redFlagsContainer || !yellowFlagsContainer || !blueFlagsContainer || !blackFlagsContainer) return;
        
        // Mostrar mensaje de carga
        redFlagsContainer.innerHTML = '<p class="text-center">Analizando datos...</p>';
        yellowFlagsContainer.innerHTML = '<p class="text-center">Analizando datos...</p>';
        blueFlagsContainer.innerHTML = '<p class="text-center">Analizando datos...</p>';
        blackFlagsContainer.innerHTML = '<p class="text-center">Analizando datos...</p>';
        
        // Obtener datos del paciente
        const patientRef = doc(db, "patients", patientId);
        const patientDoc = await getDoc(patientRef);
        
        if (!patientDoc.exists()) {
            throw new Error('Paciente no encontrado');
        }
        
        const patientData = patientDoc.data();
        
        // Analizar banderas rojas
        let redFlags = [];
        if (patientData.flags && patientData.flags.red) {
            redFlags = patientData.flags.red;
        }
        
        // Analizar otras banderas basadas en datos del paciente
        const yellowFlags = analyzeYellowFlags(patientData);
        const blueFlags = analyzeBlueFlags(patientData);
        const blackFlags = analyzeBlackFlags(patientData);
        
        // Actualizar UI
        updateFlagsUI(redFlags, yellowFlags, blueFlags, blackFlags);
        
    } catch (error) {
        console.error("Error al cargar banderas del paciente:", error);
        
        // Mostrar mensaje de error
        redFlagsContainer.innerHTML = '<p class="text-center text-danger">Error al analizar banderas</p>';
        yellowFlagsContainer.innerHTML = '<p class="text-center text-danger">Error al analizar banderas</p>';
        blueFlagsContainer.innerHTML = '<p class="text-center text-danger">Error al analizar banderas</p>';
        blackFlagsContainer.innerHTML = '<p class="text-center text-danger">Error al analizar banderas</p>';
    }
}

// Analizar banderas amarillas (factores psicosociales)
function analyzeYellowFlags(patientData) {
    const yellowFlags = [];
    
    // Ejemplos de análisis
    if (patientData.alicia && patientData.alicia.intensity > 7) {
        yellowFlags.push('Dolor de alta intensidad (> 7/10)');
    }
    
    if (patientData.sinss && patientData.sinss.stage === 'chronic') {
        yellowFlags.push('Dolor crónico (> 3 meses)');
    }
    
    // Ansiedad/depresión mencionada
    if (patientData['mental-emotional-state'] && 
        (patientData['mental-emotional-state'].toLowerCase().includes('ansie') || 
         patientData['mental-emotional-state'].toLowerCase().includes('depre'))) {
        yellowFlags.push('Posible ansiedad o depresión mencionada');
    }
    
    // Miedo al movimiento/actividad física
    if ((patientData['physical-activity-current'] === '' || patientData['physical-activity-current'] === null) && 
        patientData['physical-activity-past'] && patientData['physical-activity-past'] !== '') {
        yellowFlags.push('Abandono de actividad física anterior');
    }
    
    // Dificultades en AVD mencionadas
    if (patientData['daily-activities-difficulties'] && 
        patientData['daily-activities-difficulties'] !== '') {
        yellowFlags.push('Dificultades en actividades de la vida diaria reportadas');
    }
    
    return yellowFlags;
}

// Analizar banderas azules (factores laborales)
function analyzeBlueFlags(patientData) {
    const blueFlags = [];
    
    // Ejemplos de análisis
    // Trabajo físicamente demandante
    if (patientData['patient-job-description'] && 
        (patientData['patient-job-description'].toLowerCase().includes('pesad') || 
         patientData['patient-job-description'].toLowerCase().includes('esfuerz') ||
         patientData['patient-job-description'].toLowerCase().includes('carg'))) {
        blueFlags.push('Trabajo físicamente demandante');
    }
    
    // Tiempo prolongado en posición estática
    if (patientData['patient-sedentary-time'] && parseInt(patientData['patient-sedentary-time']) > 6) {
        blueFlags.push('Tiempo prolongado en posición sedentaria (> 6 horas)');
    }
    
    return blueFlags;
}

// Analizar banderas negras (factores contextuales)
function analyzeBlackFlags(patientData) {
    const blackFlags = [];
    
    // Ejemplos de análisis
    // Sin red de apoyo social
    if (patientData['social-support'] && 
        (patientData['social-support'].toLowerCase().includes('no tien') ||
         patientData['social-support'].toLowerCase().includes('sin apo') ||
         patientData['social-support'] === '')) {
        blackFlags.push('Posible ausencia de red de apoyo social');
    }
    
    return blackFlags;
}

// Actualizar UI de banderas
function updateFlagsUI(redFlags, yellowFlags, blueFlags, blackFlags) {
    // Banderas rojas
    if (redFlagsContainer) {
        if (redFlags.length === 0) {
            redFlagsContainer.innerHTML = '<p>No se detectaron banderas rojas.</p>';
        } else {
            let html = '<ul class="list-group">';
            redFlags.forEach(flag => {
                html += `<li class="list-group-item text-danger"><i class="fas fa-exclamation-triangle me-2"></i>${getFlagDescription(flag, 'red')}</li>`;
            });
            html += '</ul>';
            redFlagsContainer.innerHTML = html;
        }
    }
    
    // Banderas amarillas
    if (yellowFlagsContainer) {
        if (yellowFlags.length === 0) {
            yellowFlagsContainer.innerHTML = '<p>No se detectaron banderas amarillas.</p>';
        } else {
            let html = '<ul class="list-group">';
            yellowFlags.forEach(flag => {
                html += `<li class="list-group-item text-warning"><i class="fas fa-exclamation-circle me-2"></i>${flag}</li>`;
            });
            html += '</ul>';
            yellowFlagsContainer.innerHTML = html;
        }
    }
    
    // Banderas azules
    if (blueFlagsContainer) {
        if (blueFlags.length === 0) {
            blueFlagsContainer.innerHTML = '<p>No se detectaron banderas azules.</p>';
        } else {
            let html = '<ul class="list-group">';
            blueFlags.forEach(flag => {
                html += `<li class="list-group-item text-primary"><i class="fas fa-briefcase me-2"></i>${flag}</li>`;
            });
            html += '</ul>';
            blueFlagsContainer.innerHTML = html;
        }
    }
    
    // Banderas negras
    if (blackFlagsContainer) {
        if (blackFlags.length === 0) {
            blackFlagsContainer.innerHTML = '<p>No se detectaron banderas negras.</p>';
        } else {
            let html = '<ul class="list-group">';
            blackFlags.forEach(flag => {
                html += `<li class="list-group-item text-dark"><i class="fas fa-gavel me-2"></i>${flag}</li>`;
            });
            html += '</ul>';
            blackFlagsContainer.innerHTML = html;
        }
    }
    
    // Generar recomendaciones automáticas basadas en banderas
    generateFlagsRecommendations(redFlags, yellowFlags, blueFlags, blackFlags);
}

// Obtener descripción de bandera roja
function getFlagDescription(flag, type) {
    if (type === 'red') {
        switch (flag) {
            case 'severe-night-pain':
                return 'Dolor severo nocturno';
            case 'progressive-pain':
                return 'Dolor progresivo no mecánico';
            case 'general-weakness':
                return 'Debilidad generalizada';
            case 'neurological-symptoms':
                return 'Síntomas neurológicos progresivos';
            case 'unexplained-weight-loss':
                return 'Pérdida de peso inexplicada';
            case 'saddle-anesthesia':
                return 'Anestesia en silla de montar';
            case 'bladder-dysfunction':
                return 'Disfunción vesical/intestinal';
            case 'cancer-history':
                return 'Historia de cáncer';
            case 'fever':
                return 'Fiebre/escalofríos';
            case 'bilateral-symptoms':
                return 'Síntomas neurológicos bilaterales';
            default:
                return flag;
        }
    }
    
    return flag;
}

// Generar recomendaciones automáticas basadas en banderas
function generateFlagsRecommendations(redFlags, yellowFlags, blueFlags, blackFlags) {
    const recommendationsField = document.getElementById('flags-recommendations');
    if (!recommendationsField) return;
    
    let recommendations = '';
    
    // Recomendaciones para banderas rojas
    if (redFlags.length > 0) {
        recommendations += "BANDERAS ROJAS - Recomendaciones:\n";
        
        if (redFlags.length >= 3) {
            recommendations += "• Se recomienda derivación médica urgente debido a múltiples banderas rojas.\n";
        } else {
            recommendations += "• Considerar derivación médica para evaluación adicional.\n";
        }
        
        recommendations += "• Monitorizar cuidadosamente los síntomas, especialmente si empeoran.\n";
        recommendations += "• Documentar detalladamente la evolución en cada sesión.\n\n";
    }
    
    // Recomendaciones para banderas amarillas
    if (yellowFlags.length > 0) {
        recommendations += "BANDERAS AMARILLAS - Recomendaciones:\n";
        recommendations += "• Incorporar educación en neurociencia del dolor.\n";
        recommendations += "• Enfatizar la importancia del movimiento y actividad progresiva.\n";
        recommendations += "• Considerar derivación a psicología si hay signos de ansiedad/depresión severos.\n";
        recommendations += "• Establecer objetivos funcionales realistas y alcanzables a corto plazo.\n\n";
    }
    
    // Recomendaciones para banderas azules
    if (blueFlags.length > 0) {
        recommendations += "BANDERAS AZULES - Recomendaciones:\n";
        recommendations += "• Considerar adaptaciones ergonómicas al entorno laboral.\n";
        recommendations += "• Diseñar programa de ejercicios específico para demandas laborales.\n";
        recommendations += "• Educar sobre pautas de higiene postural y microdescansos.\n\n";
    }
    
    // Recomendaciones para banderas negras
    if (blackFlags.length > 0) {
        recommendations += "BANDERAS NEGRAS - Recomendaciones:\n";
        recommendations += "• Coordinar con trabajo social si es necesario.\n";
        recommendations += "• Identificar recursos comunitarios de apoyo disponibles.\n";
        recommendations += "• Adaptar plan de tratamiento a las limitaciones contextuales del paciente.\n";
    }
    
    recommendationsField.value = recommendations;
}

// Inicializar visualización CIF
function initCifVisualization() {
    const cifVisualization = document.getElementById('cif-visualization');
    if (!cifVisualization) return;
    
    // Agregar event listeners para actualizar visualización al cambiar campos CIF
    const cifFields = [
        'cif-deficiency-description', 'cif-deficiency-code',
        'cif-activity-description', 'cif-activity-level', 'cif-activity-code',
        'cif-participation-description', 'cif-participation-level', 'cif-participation-code',
        'cif-facilitators', 'cif-barriers', 'cif-facilitators-code', 'cif-barriers-code'
    ];
    
    cifFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateCifVisualization);
        }
    });
    
    // Inicializar visualización vacía
    updateCifVisualization();
}

// Actualizar visualización CIF
function updateCifVisualization() {
    const cifVisualization = document.getElementById('cif-visualization');
    if (!cifVisualization) return;
    
    // Obtener valores actuales
    const deficiencyDescription = document.getElementById('cif-deficiency-description').value;
    const activityDescription = document.getElementById('cif-activity-description').value;
    const participationDescription = document.getElementById('cif-participation-description').value;
    const facilitators = document.getElementById('cif-facilitators').value;
    const barriers = document.getElementById('cif-barriers').value;
    
    // Crear visualización simple
    let html = `
        <div class="cif-diagram">
            <h5 class="text-center mb-4">Modelo CIF (Clasificación Internacional del Funcionamiento)</h5>
            
            <div class="row">
                <div class="col-md-4">
                    <div class="card bg-light mb-3">
                        <div class="card-header bg-primary text-white">Condición de Salud</div>
                        <div class="card-body">
                            <p class="card-text">${activePatient?.diagnosis || 'No definido'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card bg-light mb-3">
                                <div class="card-header bg-info text-white">Funciones y Estructuras Corporales</div>
                                <div class="card-body">
                                    <p class="card-text">${deficiencyDescription || 'No definido'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card bg-light mb-3">
                                <div class="card-header bg-success text-white">Actividades</div>
                                <div class="card-body">
                                    <p class="card-text">${activityDescription || 'No definido'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card bg-light mb-3">
                                <div class="card-header bg-warning text-dark">Participación</div>
                                <div class="card-body">
                                    <p class="card-text">${participationDescription || 'No definido'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-header bg-success text-white">Factores Ambientales: Facilitadores</div>
                        <div class="card-body">
                            <p class="card-text">${facilitators || 'No definido'}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-header bg-danger text-white">Factores Ambientales: Barreras</div>
                        <div class="card-body">
                            <p class="card-text">${barriers || 'No definido'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cifVisualization.innerHTML = html;
}

// Mostrar cuestionario de dolor
function showPainQuestionnaire(type) {
    if (!painQuestionnairesContainer) return;
    
    let html = '';
    
    switch (type) {
        case 'dn4':
            html = createDn4Questionnaire();
            break;
        case 'paindetect':
            html = createPaindetectQuestionnaire();
            break;
        case 'central':
            html = createCentralSensitizationQuestionnaire();
            break;
        default:
            html = '<div class="alert alert-warning">Cuestionario no disponible</div>';
    }
    
    painQuestionnairesContainer.innerHTML = html;
    
    // Agregar event listeners para calculadora
    document.querySelectorAll('.pain-questionnaire input').forEach(input => {
        input.addEventListener('change', () => {
            calculateQuestionnaireScore(type);
        });
    });
}

// Crear cuestionario DN4
function createDn4Questionnaire() {
    return `
        <div class="pain-questionnaire" id="dn4-questionnaire">
            <h5>Cuestionario DN4 para Dolor Neuropático</h5>
            <p class="text-muted">Responda las siguientes preguntas basadas en los síntomas del paciente</p>
            
            <div class="card mb-3">
                <div class="card-header">ENTREVISTA AL PACIENTE</div>
                <div class="card-body">
                    <div class="mb-3">
                        <p><strong>Pregunta 1:</strong> ¿Tiene el dolor una o más de las siguientes características?</p>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-burning" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-burning">Quemazón</label>
                        </div>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-painful-cold" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-painful-cold">Sensación de frío doloroso</label>
                        </div>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-electric-shocks" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-electric-shocks">Descargas eléctricas</label>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <p><strong>Pregunta 2:</strong> ¿Está asociado el dolor con uno o más de los siguientes síntomas en la misma zona?</p>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-tingling" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-tingling">Hormigueo</label>
                        </div>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-pins-needles" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-pins-needles">Sensación de alfileres y agujas</label>
                        </div>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-numbness" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-numbness">Entumecimiento</label>
                        </div>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-itching" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-itching">Picazón</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mb-3">
                <div class="card-header">EXPLORACIÓN DEL PACIENTE</div>
                <div class="card-body">
                    <div class="mb-3">
                        <p><strong>Pregunta 3:</strong> ¿Está el dolor localizado en una zona donde el examen físico puede mostrar una o más de las siguientes características?</p>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-hypoesthesia-touch" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-hypoesthesia-touch">Hipoestesia al tacto</label>
                        </div>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-hypoesthesia-pinprick" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-hypoesthesia-pinprick">Hipoestesia al pinchazo</label>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <p><strong>Pregunta 4:</strong> ¿Puede el dolor ser causado o incrementado por?</p>
                        <div class="form-check ms-3">
                            <input class="form-check-input" type="checkbox" id="dn4-brushing" name="dn4-questionnaire">
                            <label class="form-check-label" for="dn4-brushing">El roce</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Resultado</div>
                        <div class="card-body">
                            <p>Puntaje total: <span id="dn4-score">0</span>/10</p>
                            <p>Interpretación: <span id="dn4-interpretation">No indicativo de dolor neuropático</span></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Criterio Diagnóstico</div>
                        <div class="card-body">
                            <p>Un puntaje de 4 o más sugiere dolor neuropático.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Crear cuestionario PainDETECT
function createPaindetectQuestionnaire() {
    return `
        <div class="pain-questionnaire" id="paindetect-questionnaire">
            <h5>Cuestionario PainDETECT para Dolor Neuropático</h5>
            <p class="text-muted">Este cuestionario complementa los resultados del DN4 para dolor neuropático</p>
            
            <div class="alert alert-info">
                El cuestionario completo requiere implementación interactiva. Se muestra una versión simplificada.
            </div>
        </div>
    `;
}

// Crear cuestionario de Sensibilización Central
function createCentralSensitizationQuestionnaire() {
    return `
        <div class="pain-questionnaire" id="central-questionnaire">
            <h5>Cuestionario de Sensibilización Central (CSI)</h5>
            <p class="text-muted">Este cuestionario evalúa la presencia de sensibilización central</p>
            
            <div class="alert alert-info">
                El cuestionario completo requiere implementación interactiva. Se muestra una versión simplificada.
            </div>
        </div>
    `;
}

// Calcular puntaje de cuestionario
function calculateQuestionnaireScore(type) {
    if (type === 'dn4') {
        const checkedItems = document.querySelectorAll('#dn4-questionnaire input[type="checkbox"]:checked').length;
        const scoreElement = document.getElementById('dn4-score');
        const interpretationElement = document.getElementById('dn4-interpretation');
        
        if (scoreElement) scoreElement.textContent = checkedItems;
        
        if (interpretationElement) {
            if (checkedItems >= 4) {
                interpretationElement.textContent = 'Indicativo de dolor neuropático';
                interpretationElement.className = 'text-success fw-bold';
            } else {
                interpretationElement.textContent = 'No indicativo de dolor neuropático';
                interpretationElement.className = 'text-secondary';
            }
        }
    }
}

// Exportar funciones públicas
export {
    saveDiagnosis,
    updatePatientInfo,
    loadPatientFlags
};
