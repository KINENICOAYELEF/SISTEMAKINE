// Módulo de Evoluciones
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { loadSidebar, getCurrentPatient, setCurrentPatient, displayPatientBanner } from "./dashboard.js";

// Variables globales
let currentEvolutions = [];
let patientInitialData = {};
let patientTreatmentPlan = {};
let charts = {};

// Inicialización del módulo
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar sidebar
    await loadSidebar();

    // Inicializar elementos
    initializeModuleElements();

    // Cargar paciente actual (si hay uno seleccionado)
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
        await loadPatientData(currentPatient.id);
        displayPatientBanner(currentPatient, document.getElementById('patientInfoBanner'));
        document.getElementById('noPatientSelected').classList.add('d-none');
        document.getElementById('evolutionContainer').classList.remove('d-none');
    }

    // Inicializar eventos
    initializeEvents();
});

// Función para inicializar elementos del módulo
function initializeModuleElements() {
    // Inicialización de tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para inicializar eventos
function initializeEvents() {
    // Eventos para evoluciones
    document.getElementById('newEvolutionBtn').addEventListener('click', showNewEvolutionForm);
    document.getElementById('cancelEvolutionBtn').addEventListener('click', hideNewEvolutionForm);
    document.getElementById('evolutionForm').addEventListener('submit', saveEvolution);
    
    // Eventos para exportar y imprimir
    document.getElementById('exportProgressBtn').addEventListener('click', exportProgressPDF);
    document.getElementById('printProgressBtn').addEventListener('click', printProgress);
}

// Función para cargar datos del paciente
async function loadPatientData(patientId) {
    try {
        const db = getFirestore();
        
        // Cargar datos iniciales del paciente (de la evaluación)
        await loadPatientInitialData(patientId);
        
        // Cargar plan de tratamiento y objetivos
        await loadPatientTreatmentPlan(patientId);
        
        // Cargar evoluciones
        await loadPatientEvolutions(patientId);
        
        // Actualizar métricas y gráficos
        updateProgressVisualization();
        
        // Actualizar tabla comparativa
        updateComparativeTable();
        
    } catch (error) {
        console.error('Error al cargar datos del paciente:', error);
        alert('Hubo un error al cargar los datos del paciente. Por favor intente nuevamente.');
    }
}

// Función para cargar datos iniciales del paciente
async function loadPatientInitialData(patientId) {
    try {
        const db = getFirestore();
        
        // Obtener documento del paciente
        const patientDoc = await getDoc(doc(db, 'patients', patientId));
        
        if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            
            // Extraer datos relevantes de la evaluación inicial
            patientInitialData = {
                evaluationDate: patientData.evaluationDate || '',
                painScale: patientData.evaluation?.pain?.scale || 0,
                psfs: patientData.evaluation?.psfs?.average || 0,
                sane: patientData.evaluation?.sane || 0,
                rangeOfMotion: patientData.evaluation?.rangeOfMotion || {},
                strength: patientData.evaluation?.strength || {},
                functionalTests: patientData.evaluation?.functionalTests || {}
            };
        }
    } catch (error) {
        console.error('Error al cargar datos iniciales del paciente:', error);
        throw error;
    }
}

// Función para cargar plan de tratamiento del paciente
async function loadPatientTreatmentPlan(patientId) {
    try {
        const db = getFirestore();
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Buscar el plan de tratamiento del paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', patientId));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        // Inicializar plan de tratamiento
        patientTreatmentPlan = {
            objectives: [],
            exercises: [],
            sessions: [],
            recommendations: []
        };
        
        if (!treatmentSnapshot.empty) {
            // Cargar datos del plan existente
            const treatmentData = treatmentSnapshot.docs[0].data();
            
            patientTreatmentPlan.objectives = treatmentData.objectives || [];
            patientTreatmentPlan.exercises = treatmentData.exercises || [];
            patientTreatmentPlan.sessions = treatmentData.sessions || [];
            patientTreatmentPlan.recommendations = treatmentData.recommendations || [];
        }
        
        // Mostrar objetivos en el formulario de evolución
        updateObjectivesTable();
        
    } catch (error) {
        console.error('Error al cargar plan de tratamiento:', error);
        throw error;
    }
}

// Función para cargar evoluciones del paciente
async function loadPatientEvolutions(patientId) {
    try {
        const db = getFirestore();
        
        // Referencia a la colección de evoluciones
        const evolutionsRef = collection(db, 'evolutions');
        
        // Buscar evoluciones del paciente ordenadas por fecha
        const evolutionsQuery = query(
            evolutionsRef, 
            where('patientId', '==', patientId),
            orderBy('date', 'desc')
        );
        
        const evolutionsSnapshot = await getDocs(evolutionsQuery);
        
        // Reiniciar array de evoluciones
        currentEvolutions = [];
        
        if (!evolutionsSnapshot.empty) {
            // Cargar evoluciones encontradas
            evolutionsSnapshot.docs.forEach(doc => {
                const evolutionData = doc.data();
                currentEvolutions.push({
                    id: doc.id,
                    ...evolutionData
                });
            });
        }
        
        // Mostrar evoluciones en la lista
        displayEvolutionsList();
        
        // Sugerir número de sesión para nueva evolución
        suggestNextSessionNumber();
        
    } catch (error) {
        console.error('Error al cargar evoluciones:', error);
        throw error;
    }
}

// Función para mostrar lista de evoluciones
function displayEvolutionsList() {
    const container = document.getElementById('evolutionsList');
    container.innerHTML = '';
    
    if (currentEvolutions.length === 0) {
        container.innerHTML = `
            <div class="list-group-item text-center py-4">
                <i class="fas fa-clipboard-list fa-2x mb-2 text-muted"></i>
                <p class="mb-0 text-muted">No hay evoluciones registradas</p>
            </div>
        `;
        return;
    }
    
    // Ordenar evoluciones por fecha (más reciente primero)
    const sortedEvolutions = [...currentEvolutions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedEvolutions.forEach(evolution => {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'list-group-item list-group-item-action evolution-item';
        item.setAttribute('data-id', evolution.id);
        
        // Formatear fecha
        const evolutionDate = new Date(evolution.date);
        const formattedDate = evolutionDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Clase para respuesta al tratamiento
        const responseClass = `evolution-response-${evolution.response.replace(' ', '')}`;
        
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span class="evolution-session">Sesión ${evolution.sessionNumber}</span>
                <span class="evolution-date">${formattedDate}</span>
            </div>
            <div class="evolution-response ${responseClass}">
                <i class="fas fa-circle-check me-1"></i> ${evolution.response}
            </div>
        `;
        
        // Evento de clic para mostrar detalles
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase activa de todos los items
            document.querySelectorAll('.evolution-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // Agregar clase activa al item seleccionado
            item.classList.add('active');
            
            // Mostrar detalles de la evolución
            showEvolutionDetails(evolution.id);
        });
        
        container.appendChild(item);
    });
}

// Función para mostrar detalles de una evolución
function showEvolutionDetails(evolutionId) {
    const container = document.getElementById('evolutionDetailContainer');
    const evolution = currentEvolutions.find(ev => ev.id === evolutionId);
    
    if (!evolution) {
        console.error('Evolución no encontrada:', evolutionId);
        return;
    }
    
    // Actualizar título
    document.getElementById('evolutionDetailTitle').textContent = `Detalles de Evolución - Sesión ${evolution.sessionNumber}`;
    
    // Formatear fecha
    const evolutionDate = new Date(evolution.date);
    const formattedDate = evolutionDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Construir HTML de detalles
    const detailsHTML = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-1">Fecha: ${formattedDate}</h6>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-1 edit-evolution-btn" data-id="${evolution.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-evolution-btn" data-id="${evolution.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="evolution-detail-card">
            <div class="evolution-detail-header">Subjetivo</div>
            <div class="evolution-detail-content">${evolution.subjective}</div>
        </div>
        
        <div class="evolution-detail-card">
            <div class="evolution-detail-header">Objetivo</div>
            <div class="evolution-detail-content">${evolution.objective}</div>
        </div>
        
        <div class="evolution-detail-card">
            <div class="evolution-detail-header">Análisis</div>
            <div class="evolution-detail-content">${evolution.analysis}</div>
        </div>
        
        <div class="evolution-detail-card">
            <div class="evolution-detail-header">Plan</div>
            <div class="evolution-detail-content">${evolution.plan}</div>
        </div>
        
        <div class="evolution-metrics">
            <h6 class="mb-3">Métricas Cuantitativas</h6>
            <div class="row">
                <div class="col-md-4">
                    <div class="metric-item">
                        <div class="metric-label">PSFS:</div>
                        <div class="metric-value">${evolution.metrics?.psfs || 'N/A'}/10</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="metric-item">
                        <div class="metric-label">GROC:</div>
                        <div class="metric-value">${evolution.metrics?.groc || 'N/A'}</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="metric-item">
                        <div class="metric-label">SANE:</div>
                        <div class="metric-value">${evolution.metrics?.sane || 'N/A'}/100</div>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-4">
                    <div class="metric-item">
                        <div class="metric-label">Dolor:</div>
                        <div class="metric-value">${evolution.metrics?.pain || 'N/A'}/10</div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="metric-item">
                        <div class="metric-label">Rangos de Movimiento:</div>
                        <div class="metric-value">${evolution.metrics?.rom || 'N/A'}</div>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-6">
                    <div class="metric-item">
                        <div class="metric-label">Fuerza Muscular:</div>
                        <div class="metric-value">${evolution.metrics?.strength || 'N/A'}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="metric-item">
                        <div class="metric-label">Tests Funcionales:</div>
                        <div class="metric-value">${evolution.metrics?.functionalTests || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="evolution-techniques">
            <strong>Técnicas Aplicadas:</strong> ${evolution.techniques}
        </div>
        
        <div class="evolution-response ${evolution.response.replace(' ', '')}">
            Respuesta al Tratamiento: ${evolution.response}
        </div>
        
        ${evolution.notes ? `
        <div class="mt-3">
            <strong>Notas Adicionales:</strong>
            <p>${evolution.notes}</p>
        </div>
        ` : ''}
        
        <div class="mt-3">
            <h6 class="mb-2">Progreso de Objetivos</h6>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Objetivo</th>
                            <th>Progreso</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${evolution.objectivesProgress.map(obj => `
                            <tr>
                                <td>${obj.title}</td>
                                <td>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style="width: ${obj.progress}%;" 
                                             aria-valuenow="${obj.progress}" aria-valuemin="0" aria-valuemax="100">
                                            ${obj.progress}%
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="objective-status ${obj.status.toLowerCase().replace(' ', '-')}">
                                        ${obj.status}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Actualizar contenedor
    container.innerHTML = detailsHTML;
    
    // Ocultar formulario de nueva evolución
    hideNewEvolutionForm();
    
    // Agregar eventos a los botones
    container.querySelector('.edit-evolution-btn').addEventListener('click', () => {
        editEvolution(evolutionId);
    });
    
    container.querySelector('.delete-evolution-btn').addEventListener('click', () => {
        deleteEvolution(evolutionId);
    });
}

// Función para sugerir siguiente número de sesión
function suggestNextSessionNumber() {
    // Si no hay evoluciones, sugerir sesión 1
    if (currentEvolutions.length === 0) {
        document.getElementById('evolutionSessionNumber').value = 1;
        return;
    }
    
    // Buscar el número de sesión más alto
    const maxSessionNumber = Math.max(...currentEvolutions.map(ev => ev.sessionNumber));
    document.getElementById('evolutionSessionNumber').value = maxSessionNumber + 1;
}

// Función para mostrar formulario de nueva evolución
function showNewEvolutionForm() {
    // Ocultar detalles
    document.getElementById('evolutionDetailContainer').classList.add('d-none');
    
    // Mostrar formulario
    document.getElementById('newEvolutionForm').classList.remove('d-none');
    
    // Actualizar título
    document.getElementById('evolutionDetailTitle').textContent = 'Nueva Evolución';
    
    // Resetear formulario
    document.getElementById('evolutionForm').reset();
    document.getElementById('evolutionId').value = '';
    
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('evolutionDate').value = today;
    
    // Sugerir número de sesión
    suggestNextSessionNumber();
    
    // Actualizar tabla de objetivos
    updateObjectivesTable();
}

// Función para ocultar formulario de nueva evolución
function hideNewEvolutionForm() {
    // Ocultar formulario
    document.getElementById('newEvolutionForm').classList.add('d-none');
    
    // Mostrar detalles
    document.getElementById('evolutionDetailContainer').classList.remove('d-none');
    
    // Actualizar título
    document.getElementById('evolutionDetailTitle').textContent = 'Detalles de Evolución';
    
    // Verificar si hay una evolución seleccionada
    const activeEvolution = document.querySelector('.evolution-item.active');
    if (activeEvolution) {
        showEvolutionDetails(activeEvolution.getAttribute('data-id'));
    } else {
        // Mostrar mensaje de selección
        document.getElementById('evolutionDetailContainer').innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="fas fa-clipboard-list fa-3x mb-3"></i>
                <p>Seleccione una evolución de la lista o cree una nueva para ver detalles.</p>
            </div>
        `;
    }
}

// Función para actualizar tabla de objetivos
function updateObjectivesTable() {
    const container = document.getElementById('objectivesProgressTable');
    container.innerHTML = '';
    
    if (!patientTreatmentPlan.objectives || patientTreatmentPlan.objectives.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">
                    No hay objetivos definidos en el plan de tratamiento.
                </td>
            </tr>
        `;
        return;
    }
    
    patientTreatmentPlan.objectives.forEach(objective => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${objective.title}</td>
            <td style="width: 40%;">
                <input type="range" class="form-range objective-progress-input" 
                       min="0" max="100" step="5" value="${objective.progress || 0}" 
                       data-objective-id="${objective.id}">
                <div class="d-flex justify-content-between">
                    <small>0%</small>
                    <small>50%</small>
                    <small>100%</small>
                </div>
            </td>
            <td>
                <select class="form-select form-select-sm objective-status-select" data-objective-id="${objective.id}">
                    <option value="En progreso" ${objective.status === 'En progreso' ? 'selected' : ''}>En progreso</option>
                    <option value="Completado" ${objective.status === 'Completado' ? 'selected' : ''}>Completado</option>
                    <option value="Retrasado" ${objective.status === 'Retrasado' ? 'selected' : ''}>Retrasado</option>
                    <option value="Estancado" ${objective.status === 'Estancado' ? 'selected' : ''}>Estancado</option>
                </select>
            </td>
        `;
        
        container.appendChild(row);
    });
    
    // Actualizar eventos de los controles de progreso
    const progressInputs = document.querySelectorAll('.objective-progress-input');
    progressInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const objectiveId = e.target.getAttribute('data-objective-id');
            const progress = parseInt(e.target.value);
            
            // Si el progreso es 100%, cambiar estado a completado
            if (progress === 100) {
                const statusSelect = document.querySelector(`.objective-status-select[data-objective-id="${objectiveId}"]`);
                if (statusSelect) {
                    statusSelect.value = 'Completado';
                }
            }
        });
    });
}

// Función para guardar evolución
async function saveEvolution(e) {
    e.preventDefault();
    
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        const db = getFirestore();
        
        // Obtener datos del formulario
        const evolutionId = document.getElementById('evolutionId').value;
        const date = document.getElementById('evolutionDate').value;
        const sessionNumber = parseInt(document.getElementById('evolutionSessionNumber').value);
        const subjective = document.getElementById('evolutionSubjective').value;
        const objective = document.getElementById('evolutionObjective').value;
        const analysis = document.getElementById('evolutionAnalysis').value;
        const plan = document.getElementById('evolutionPlan').value;
        const techniques = document.getElementById('evolutionTechniques').value;
        const response = document.getElementById('evolutionResponse').value;
        const notes = document.getElementById('evolutionNotes').value;
        
        // Métricas cuantitativas
        const psfs = document.getElementById('evolutionPSFS').value ? parseFloat(document.getElementById('evolutionPSFS').value) : null;
        const groc = document.getElementById('evolutionGROC').value ? parseInt(document.getElementById('evolutionGROC').value) : null;
        const sane = document.getElementById('evolutionSANE').value ? parseInt(document.getElementById('evolutionSANE').value) : null;
        const pain = document.getElementById('evolutionPain').value ? parseInt(document.getElementById('evolutionPain').value) : null;
        const rom = document.getElementById('evolutionROM').value;
        const strength = document.getElementById('evolutionStrength').value;
        const functionalTests = document.getElementById('evolutionFunctionalTests').value;
        
        // Objetivos y progreso
        const objectivesProgress = [];
        patientTreatmentPlan.objectives.forEach(objective => {
            const progressInput = document.querySelector(`.objective-progress-input[data-objective-id="${objective.id}"]`);
            const statusSelect = document.querySelector(`.objective-status-select[data-objective-id="${objective.id}"]`);
            
            if (progressInput && statusSelect) {
                objectivesProgress.push({
                    id: objective.id,
                    title: objective.title,
                    progress: parseInt(progressInput.value),
                    status: statusSelect.value
                });
            }
        });
        
        // Crear objeto de evolución
        const evolution = {
            patientId: currentPatient.id,
            date,
            sessionNumber,
            subjective,
            objective,
            analysis,
            plan,
            techniques,
            response,
            notes,
            metrics: {
                psfs,
                groc,
                sane,
                pain,
                rom,
                strength,
                functionalTests
            },
            objectivesProgress,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Referencia a la colección de evoluciones
        const evolutionsRef = collection(db, 'evolutions');
        
        if (evolutionId) {
            // Actualizar evolución existente
            await updateDoc(doc(db, 'evolutions', evolutionId), evolution);
            
            // Actualizar en array local
            const index = currentEvolutions.findIndex(ev => ev.id === evolutionId);
            if (index !== -1) {
                currentEvolutions[index] = {
                    id: evolutionId,
                    ...evolution
                };
            }
        } else {
            // Crear nueva evolución
            const newEvolutionDoc = await addDoc(evolutionsRef, evolution);
            
            // Agregar a array local
            currentEvolutions.push({
                id: newEvolutionDoc.id,
                ...evolution
            });
        }
        
        // Actualizar objetivos en el plan de tratamiento
        await updateTreatmentPlanObjectives(objectivesProgress);
        
        // Actualizar lista de evoluciones
        displayEvolutionsList();
        
        // Ocultar formulario y mostrar detalles
        hideNewEvolutionForm();
        
        // Actualizar métricas y gráficos
        updateProgressVisualization();
        
        // Actualizar tabla comparativa
        updateComparativeTable();
        
    } catch (error) {
        console.error('Error al guardar evolución:', error);
        alert('Hubo un error al guardar la evolución. Por favor intente nuevamente.');
    }
}

// Función para editar evolución
function editEvolution(evolutionId) {
    const evolution = currentEvolutions.find(ev => ev.id === evolutionId);
    
    if (!evolution) {
        console.error('Evolución no encontrada:', evolutionId);
        return;
    }
    
    // Mostrar formulario
    document.getElementById('evolutionDetailContainer').classList.add('d-none');
    document.getElementById('newEvolutionForm').classList.remove('d-none');
    
    // Actualizar título
    document.getElementById('evolutionDetailTitle').textContent = `Editar Evolución - Sesión ${evolution.sessionNumber}`;
    
    // Completar formulario con datos
    document.getElementById('evolutionId').value = evolution.id;
    document.getElementById('evolutionDate').value = evolution.date;
    document.getElementById('evolutionSessionNumber').value = evolution.sessionNumber;
    document.getElementById('evolutionSubjective').value = evolution.subjective;
    document.getElementById('evolutionObjective').value = evolution.objective;
    document.getElementById('evolutionAnalysis').value = evolution.analysis;
    document.getElementById('evolutionPlan').value = evolution.plan;
    document.getElementById('evolutionTechniques').value = evolution.techniques;
    document.getElementById('evolutionResponse').value = evolution.response;
    document.getElementById('evolutionNotes').value = evolution.notes || '';
    
    // Métricas cuantitativas
    document.getElementById('evolutionPSFS').value = evolution.metrics?.psfs || '';
    document.getElementById('evolutionGROC').value = evolution.metrics?.groc || '';
    document.getElementById('evolutionSANE').value = evolution.metrics?.sane || '';
    document.getElementById('evolutionPain').value = evolution.metrics?.pain || '';
    document.getElementById('evolutionROM').value = evolution.metrics?.rom || '';
    document.getElementById('evolutionStrength').value = evolution.metrics?.strength || '';
    document.getElementById('evolutionFunctionalTests').value = evolution.metrics?.functionalTests || '';
    
    // Actualizar tabla de objetivos
    updateObjectivesTable();
    
    // Actualizar progreso de objetivos
    if (evolution.objectivesProgress && evolution.objectivesProgress.length > 0) {
        evolution.objectivesProgress.forEach(obj => {
            const progressInput = document.querySelector(`.objective-progress-input[data-objective-id="${obj.id}"]`);
            const statusSelect = document.querySelector(`.objective-status-select[data-objective-id="${obj.id}"]`);
            
            if (progressInput) {
                progressInput.value = obj.progress;
            }
            
            if (statusSelect) {
                statusSelect.value = obj.status;
            }
        });
    }
}

// Función para eliminar evolución
async function deleteEvolution(evolutionId) {
    if (!confirm('¿Está seguro de eliminar esta evolución? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const db = getFirestore();
        
        // Eliminar de Firestore
        await deleteDoc(doc(db, 'evolutions', evolutionId));
        
        // Eliminar de array local
        currentEvolutions = currentEvolutions.filter(ev => ev.id !== evolutionId);
        
        // Actualizar lista
        displayEvolutionsList();
        
        // Ocultar detalles
        hideNewEvolutionForm();
        
        // Actualizar gráficos
        updateProgressVisualization();
        
        // Actualizar tabla comparativa
        updateComparativeTable();
        
    } catch (error) {
        console.error('Error al eliminar evolución:', error);
        alert('Hubo un error al eliminar la evolución. Por favor intente nuevamente.');
    }
}

// Función para actualizar objetivos en el plan de tratamiento
async function updateTreatmentPlanObjectives(objectivesProgress) {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            return;
        }
        
        const db = getFirestore();
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Buscar el plan de tratamiento del paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', currentPatient.id));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        if (!treatmentSnapshot.empty) {
            const treatmentDoc = treatmentSnapshot.docs[0];
            const treatmentData = treatmentDoc.data();
            
            // Actualizar objetivos con el progreso
            const updatedObjectives = treatmentData.objectives.map(objective => {
                const updatedObjective = objectivesProgress.find(obj => obj.id === objective.id);
                
                if (updatedObjective) {
                    return {
                        ...objective,
                        progress: updatedObjective.progress,
                        status: updatedObjective.status
                    };
                }
                
                return objective;
            });
            
            // Actualizar en Firestore
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                objectives: updatedObjectives,
                updatedAt: new Date().toISOString()
            });
            
            // Actualizar en variable local
            patientTreatmentPlan.objectives = updatedObjectives;
        }
    } catch (error) {
        console.error('Error al actualizar objetivos en plan de tratamiento:', error);
        throw error;
    }
}

// --------------------------------
// FUNCIONES PARA VISUALIZACIÓN DE PROGRESO
// --------------------------------

// Función para actualizar visualización de progreso
function updateProgressVisualization() {
    // Destruir gráficos existentes
    if (charts.painChart) {
        charts.painChart.destroy();
    }
    
    if (charts.functionalChart) {
        charts.functionalChart.destroy();
    }
    
    // Verificar si hay evoluciones
    if (currentEvolutions.length === 0) {
        document.getElementById('painChart').getContext('2d').clearRect(0, 0, document.getElementById('painChart').width, document.getElementById('painChart').height);
        document.getElementById('functionalChart').getContext('2d').clearRect(0, 0, document.getElementById('functionalChart').width, document.getElementById('functionalChart').height);
        return;
    }
    
    // Preparar datos para gráficos
    const evolutionDates = [];
    const painValues = [];
    const psfsValues = [];
    const saneValues = [];
    
    // Ordenar evoluciones por fecha (más antigua primero)
    const sortedEvolutions = [...currentEvolutions].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    // Extraer datos
    sortedEvolutions.forEach(evolution => {
        const date = new Date(evolution.date);
        const dateString = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        
        evolutionDates.push(dateString);
        painValues.push(evolution.metrics?.pain !== undefined ? evolution.metrics.pain : null);
        psfsValues.push(evolution.metrics?.psfs !== undefined ? evolution.metrics.psfs : null);
        saneValues.push(evolution.metrics?.sane !== undefined ? evolution.metrics.sane : null);
    });
    
    // Gráfico de dolor
    const painCtx = document.getElementById('painChart').getContext('2d');
    charts.painChart = new Chart(painCtx, {
        type: 'line',
        data: {
            labels: evolutionDates,
            datasets: [{
                label: 'Dolor (0-10)',
                data: painValues,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#dc3545',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolución del Dolor',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Intensidad del Dolor'
                    }
                }
            }
        }
    });
    
    // Gráfico funcional
    const functionalCtx = document.getElementById('functionalChart').getContext('2d');
    charts.functionalChart = new Chart(functionalCtx, {
        type: 'line',
        data: {
            labels: evolutionDates,
            datasets: [
                {
                    label: 'PSFS (0-10)',
                    data: psfsValues,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#28a745',
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'SANE (0-100)',
                    data: saneValues,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#007bff',
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolución Funcional',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'PSFS (0-10)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    max: 100,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'SANE (0-100)'
                    }
                }
            }
        }
    });
}

// Función para actualizar tabla comparativa
function updateComparativeTable() {
    const container = document.getElementById('comparativeTable');
    container.innerHTML = '';
    
    // Verificar si hay evoluciones
    if (currentEvolutions.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    No hay evoluciones registradas para realizar comparaciones.
                </td>
            </tr>
        `;
        return;
    }
    
    // Obtener última evolución (la más reciente)
    const lastEvolution = [...currentEvolutions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    })[0];
    
    // Definir valores mínimos clínicamente importantes (MCID)
    const mcidValues = {
        pain: -2, // Reducción de 2 puntos en dolor es clínicamente significativo
        psfs: 2,  // Aumento de 2 puntos en PSFS es clínicamente significativo
        groc: 3,  // Cambio de 3 en GROC es clínicamente significativo
        sane: 15  // Aumento de 15 puntos en SANE es clínicamente significativo
    };
    
    // Metricas para comparar
    const metricsToCompare = [
        {
            name: 'Dolor',
            initial: patientInitialData.painScale || 'N/A',
            current: lastEvolution.metrics?.pain || 'N/A',
            mcid: mcidValues.pain,
            isPositiveChange: false, // Para dolor, la disminución es positiva
            unit: '/10'
        },
        {
            name: 'PSFS',
            initial: patientInitialData.psfs || 'N/A',
            current: lastEvolution.metrics?.psfs || 'N/A',
            mcid: mcidValues.psfs,
            isPositiveChange: true, // Para PSFS, el aumento es positivo
            unit: '/10'
        },
        {
            name: 'SANE',
            initial: patientInitialData.sane || 'N/A',
            current: lastEvolution.metrics?.sane || 'N/A',
            mcid: mcidValues.sane,
            isPositiveChange: true, // Para SANE, el aumento es positivo
            unit: '/100'
        }
    ];
    
    // Generar filas para cada métrica
    metricsToCompare.forEach(metric => {
        // Calcular cambio si ambos valores son números
        let change = 'N/A';
        let changeClass = '';
        let mcidAchieved = false;
        
        if (metric.initial !== 'N/A' && metric.current !== 'N/A') {
            const changeValue = metric.current - metric.initial;
            change = changeValue.toFixed(1);
            
            // Determinar si el cambio es positivo según la métrica
            if (metric.isPositiveChange) {
                changeClass = changeValue > 0 ? 'positive-change' : (changeValue < 0 ? 'negative-change' : 'no-change');
                mcidAchieved = changeValue >= metric.mcid;
            } else {
                changeClass = changeValue < 0 ? 'positive-change' : (changeValue > 0 ? 'negative-change' : 'no-change');
                mcidAchieved = changeValue <= metric.mcid;
            }
        }
        
        const row = document.createElement('tr');
        row.className = mcidAchieved ? 'mcid-achieved' : '';
        
        row.innerHTML = `
            <td>${metric.name}</td>
            <td>${metric.initial}${metric.unit}</td>
            <td>${metric.current}${metric.unit}</td>
            <td class="${changeClass}">${change}</td>
            <td>${Math.abs(metric.mcid)}${metric.unit}</td>
            <td>${mcidAchieved ? 
                '<span class="badge bg-success">Alcanzado</span>' : 
                '<span class="badge bg-secondary">No alcanzado</span>'}</td>
        `;
        
        container.appendChild(row);
    });
    
    // Agregar fila para GROC (solo disponible en evoluciones)
    if (lastEvolution.metrics?.groc !== undefined) {
        const grocValue = parseInt(lastEvolution.metrics.groc);
        const mcidAchieved = grocValue >= mcidValues.groc;
        
        const row = document.createElement('tr');
        row.className = mcidAchieved ? 'mcid-achieved' : '';
        
        // Determinar clase de cambio según valor de GROC
        let changeClass = 'no-change';
        if (grocValue > 0) {
            changeClass = 'positive-change';
        } else if (grocValue < 0) {
            changeClass = 'negative-change';
        }
        
        row.innerHTML = `
            <td>GROC</td>
            <td>0</td>
            <td>${grocValue}</td>
            <td class="${changeClass}">${grocValue}</td>
            <td>${mcidValues.groc}</td>
            <td>${mcidAchieved ? 
                '<span class="badge bg-success">Alcanzado</span>' : 
                '<span class="badge bg-secondary">No alcanzado</span>'}</td>
        `;
        
        container.appendChild(row);
    }
}

// Función para exportar progreso a PDF
async function exportProgressPDF() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        // Preparar contenedor para exportación
        const progressContent = document.createElement('div');
        progressContent.style.padding = '20px';
        progressContent.style.backgroundColor = 'white';
        progressContent.style.width = '800px';
        
        // Agregar título y fecha
        progressContent.innerHTML = `
            <h4 style="text-align: center; margin-bottom: 20px;">Evolución del Paciente</h4>
            <div style="text-align: right; margin-bottom: 20px;">
                <strong>Paciente:</strong> ${currentPatient.firstName} ${currentPatient.lastName}<br>
                <strong>RUT:</strong> ${currentPatient.rut || 'N/A'}<br>
                <strong>Fecha:</strong> ${new Date().toLocaleDateString()}
            </div>
        `;
        
        // Capturar gráficos
        const painCanvas = document.getElementById('painChart');
        const functionalCanvas = document.getElementById('functionalChart');
        
        // Crear un contenedor para los gráficos
        const chartsContainer = document.createElement('div');
        chartsContainer.style.display = 'flex';
        chartsContainer.style.flexDirection = 'column';
        chartsContainer.style.gap = '20px';
        chartsContainer.style.marginBottom = '20px';
        
        // Añadir los gráficos como imágenes
        if (charts.painChart) {
            const painChartImg = document.createElement('img');
            painChartImg.src = painCanvas.toDataURL('image/png');
            painChartImg.style.width = '100%';
            painChartImg.style.maxHeight = '300px';
            chartsContainer.appendChild(painChartImg);
        }
        
        if (charts.functionalChart) {
            const functionalChartImg = document.createElement('img');
            functionalChartImg.src = functionalCanvas.toDataURL('image/png');
            functionalChartImg.style.width = '100%';
            functionalChartImg.style.maxHeight = '300px';
            chartsContainer.appendChild(functionalChartImg);
        }
        
        progressContent.appendChild(chartsContainer);
        
        // Clonar tabla comparativa
        const comparativeTableClone = document.querySelector('.table-responsive').cloneNode(true);
        progressContent.appendChild(comparativeTableClone);
        
        // Agregar al DOM temporalmente para la captura (fuera de la vista)
        progressContent.style.position = 'absolute';
        progressContent.style.left = '-9999px';
        document.body.appendChild(progressContent);
        
        // Usar html2canvas para capturar el contenido
        const canvas = await html2canvas(progressContent);
        
        // Eliminar el contenedor temporal
        document.body.removeChild(progressContent);
        
        // Crear PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        
        // Determinar escala para ajustar al ancho de la página
        const imgWidth = 595; // Ancho de A4 en puntos
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Agregar imagen al PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Añadir más páginas si el contenido es muy largo
        if (imgHeight > 842) { // Altura de A4 en puntos
            let remainingHeight = imgHeight;
            let currentPage = 1;
            
            while (remainingHeight > 842) {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, -842 * currentPage, imgWidth, imgHeight);
                remainingHeight -= 842;
                currentPage++;
            }
        }
        
        // Guardar PDF
        pdf.save(`evolucion_${currentPatient.lastName}_${currentPatient.firstName}.pdf`);
        
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        alert('Hubo un error al exportar el PDF. Por favor intente nuevamente.');
    }
}

// Función para imprimir progreso
function printProgress() {
    try {
        // Abrir ventana de impresión
        const printWindow = window.open('', '_blank');
        
        // Crear contenido para impresión
        const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Evolución del Paciente</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .patient-info {
                    text-align: right;
                    margin-bottom: 20px;
                }
                .chart-container {
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                table, th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
                .positive-change {
                    color: green;
                }
                .negative-change {
                    color: red;
                }
                .mcid-achieved {
                    background-color: rgba(40, 167, 69, 0.1);
                }
                @media print {
                    img {
                        max-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <h1>Evolución del Paciente</h1>
            
            <div class="patient-info">
                <strong>Paciente:</strong> ${getCurrentPatient().firstName} ${getCurrentPatient().lastName}<br>
                <strong>RUT:</strong> ${getCurrentPatient().rut || 'N/A'}<br>
                <strong>Fecha:</strong> ${new Date().toLocaleDateString()}
            </div>
            
            <div class="chart-container">
                <h3>Evolución del Dolor</h3>
                <img src="${document.getElementById('painChart').toDataURL()}" alt="Gráfico de Dolor">
            </div>
            
            <div class="chart-container">
                <h3>Evolución Funcional</h3>
                <img src="${document.getElementById('functionalChart').toDataURL()}" alt="Gráfico Funcional">
            </div>
            
            <h3>Comparativa con Evaluación Inicial</h3>
            ${document.querySelector('.table-responsive').innerHTML}
        </body>
        </html>
        `;
        
        // Escribir contenido en la ventana
        printWindow.document.open();
        printWindow.document.write(content);
        printWindow.document.close();
        
        // Esperar a que se carguen las imágenes
        printWindow.onload = function() {
            printWindow.print();
            printWindow.onafterprint = function() {
                printWindow.close();
            };
        };
        
    } catch (error) {
        console.error('Error al imprimir progreso:', error);
        alert('Hubo un error al preparar la impresión. Por favor intente nuevamente.');
    }
}
