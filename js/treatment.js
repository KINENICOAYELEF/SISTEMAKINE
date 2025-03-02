// Módulo de Plan de Tratamiento
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

// Inicialización del módulo
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar sidebar
    await loadSidebar();

    // Inicializar elementos
    initializeModuleElements();

    // Cargar paciente actual (si hay uno seleccionado)
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
        await loadPatientTreatmentPlan(currentPatient.id);
        displayPatientBanner(currentPatient, document.getElementById('patientInfoBanner'));
        document.getElementById('noPatientSelected').classList.add('d-none');
        document.getElementById('treatmentPlanContainer').classList.remove('d-none');
    }

    // Inicializar eventos
    initializeEvents();
    
    // Inicializar timeline
    initializeTimeline();
    
    // Generar recomendaciones basadas en el diagnóstico
    if (currentPatient) {
        generateEvidenceBasedRecommendations(currentPatient.id);
    }
});

// Función para inicializar eventos
function initializeEvents() {
    // Eventos para objetivos SMART
    document.getElementById('addSmartObjectiveBtn').addEventListener('click', () => openSmartObjectiveModal());
    document.getElementById('saveSmartObjectiveBtn').addEventListener('click', saveSmartObjective);
    
    // Eventos para ejercicios
    document.getElementById('addExerciseBtn').addEventListener('click', () => openExerciseModal());
    document.getElementById('saveExerciseBtn').addEventListener('click', saveExercise);
    
    // Eventos para sesiones
    document.getElementById('addSessionBtn').addEventListener('click', () => openSessionModal());
    document.getElementById('saveSessionBtn').addEventListener('click', saveSession);
    document.getElementById('treatmentFrequency').addEventListener('change', updateSessionSchedule);
    document.getElementById('estimatedSessions').addEventListener('change', updateSessionSchedule);
    
    // Eventos para timeline
    document.getElementById('timelineZoomIn').addEventListener('click', () => zoomTimeline(1.2));
    document.getElementById('timelineZoomOut').addEventListener('click', () => zoomTimeline(0.8));
    document.getElementById('timelineExport').addEventListener('click', exportTimeline);
    
    // Eventos para recomendaciones
    document.getElementById('customRecommendationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addCustomRecommendation();
    });
    
    // Evento para exportar plan de tratamiento
    document.getElementById('exportTreatmentPlanBtn').addEventListener('click', exportTreatmentPlan);
}

// Función para inicializar elementos del módulo
function initializeModuleElements() {
    // Inicialización de tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicialización de calendario de sesiones
    initializeSessionsCalendar();
}

// Variable para almacenar el plan de tratamiento actual
let currentTreatmentPlan = {
    objectives: [],
    exercises: [],
    sessions: [],
    recommendations: [],
    frequency: '',
    estimatedSessions: 0,
    sessionDuration: 0
};

// --------------------------------
// FUNCIONES PARA OBJETIVOS SMART
// --------------------------------

// Función para abrir el modal de objetivo SMART
function openSmartObjectiveModal(objectiveId = null) {
    const modal = new bootstrap.Modal(document.getElementById('smartObjectiveModal'));
    const form = document.getElementById('smartObjectiveForm');
    form.reset();
    
    // Si se proporciona un ID, es edición
    if (objectiveId) {
        const objective = currentTreatmentPlan.objectives.find(obj => obj.id === objectiveId);
        if (objective) {
            document.getElementById('objectiveId').value = objective.id;
            document.getElementById('objectiveTitle').value = objective.title;
            document.getElementById('objectivePriority').value = objective.priority;
            document.getElementById('objectiveSpecific').value = objective.specific;
            document.getElementById('objectiveMeasurable').value = objective.measurable;
            document.getElementById('objectiveAchievable').value = objective.achievable;
            document.getElementById('objectiveRelevant').value = objective.relevant;
            
            // Separar valor y unidad de tiempo
            const timeParts = objective.timebound.split(' ');
            document.getElementById('objectiveTimeValue').value = timeParts[0];
            document.getElementById('objectiveTimeUnit').value = timeParts[1];
            
            document.getElementById('objectiveExpectedDate').value = objective.expectedDate;
            document.getElementById('objectiveCategory').value = objective.category;
            document.getElementById('objectiveNotes').value = objective.notes || '';
            
            document.getElementById('smartObjectiveModalLabel').textContent = 'Editar Objetivo SMART';
        }
    } else {
        document.getElementById('objectiveId').value = '';
        document.getElementById('smartObjectiveModalLabel').textContent = 'Agregar Objetivo SMART';
        
        // Establecer fecha actual como default para fecha estimada
        const today = new Date();
        const twoMonthsLater = new Date(today.setMonth(today.getMonth() + 2));
        document.getElementById('objectiveExpectedDate').value = twoMonthsLater.toISOString().split('T')[0];
    }
    
    modal.show();
}

// Función para guardar un objetivo SMART
async function saveSmartObjective() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        const db = getFirestore();
        const form = document.getElementById('smartObjectiveForm');
        
        // Validar formulario
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Obtener datos del formulario
        const objectiveId = document.getElementById('objectiveId').value;
        const title = document.getElementById('objectiveTitle').value;
        const priority = document.getElementById('objectivePriority').value;
        const specific = document.getElementById('objectiveSpecific').value;
        const measurable = document.getElementById('objectiveMeasurable').value;
        const achievable = document.getElementById('objectiveAchievable').value;
        const relevant = document.getElementById('objectiveRelevant').value;
        const timeValue = document.getElementById('objectiveTimeValue').value;
        const timeUnit = document.getElementById('objectiveTimeUnit').value;
        const timebound = `${timeValue} ${timeUnit}`;
        const expectedDate = document.getElementById('objectiveExpectedDate').value;
        const category = document.getElementById('objectiveCategory').value;
        const notes = document.getElementById('objectiveNotes').value;
        
        // Crear objeto con los datos
        const objective = {
            title,
            priority,
            specific,
            measurable,
            achievable,
            relevant,
            timebound,
            expectedDate,
            category,
            notes,
            createdAt: new Date().toISOString(),
            status: 'En progreso',
            progress: 0
        };
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Verificar si ya existe un plan de tratamiento para este paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', currentPatient.id));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        if (treatmentSnapshot.empty) {
            // Crear nuevo plan de tratamiento
            await addDoc(treatmentsRef, {
                patientId: currentPatient.id,
                objectives: [objective],
                exercises: [],
                sessions: [],
                recommendations: [],
                frequency: '',
                estimatedSessions: 0,
                sessionDuration: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            // Agregar objetivo al array local
            objective.id = Date.now().toString(); // ID provisional
            currentTreatmentPlan.objectives.push(objective);
        } else {
            // Actualizar plan existente
            const treatmentDoc = treatmentSnapshot.docs[0];
            const treatmentData = treatmentDoc.data();
            let objectives = treatmentData.objectives || [];
            
            if (objectiveId) {
                // Actualizar objetivo existente
                const index = objectives.findIndex(obj => obj.id === objectiveId);
                if (index !== -1) {
                    objective.id = objectiveId;
                    objectives[index] = objective;
                    
                    // Actualizar en array local
                    const localIndex = currentTreatmentPlan.objectives.findIndex(obj => obj.id === objectiveId);
                    if (localIndex !== -1) {
                        currentTreatmentPlan.objectives[localIndex] = objective;
                    }
                }
            } else {
                // Agregar nuevo objetivo
                objective.id = Date.now().toString();
                objectives.push(objective);
                
                // Agregar al array local
                currentTreatmentPlan.objectives.push(objective);
            }
            
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                objectives,
                updatedAt: new Date().toISOString()
            });
        }
        
        // Cerrar modal y refrescar lista
        document.getElementById('smartObjectiveForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('smartObjectiveModal')).hide();
        displaySmartObjectives();
        
        // Actualizar timeline
        updateTimeline();
        
        // Actualizar lista de objetivos en modal de ejercicios
        updateObjectivesInExerciseModal();
        
        // Actualizar resumen
        updateTreatmentSummary();
        
    } catch (error) {
        console.error('Error al guardar objetivo SMART:', error);
        alert('Hubo un error al guardar el objetivo. Por favor intente nuevamente.');
    }
}

// Función para mostrar objetivos SMART
function displaySmartObjectives() {
    const container = document.getElementById('smartObjectivesList');
    container.innerHTML = '';
    
    if (currentTreatmentPlan.objectives.length === 0) {
        container.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> No hay objetivos SMART definidos para este paciente.
            </div>
        `;
        return;
    }
    
    // Ordenar por prioridad
    const sortedObjectives = [...currentTreatmentPlan.objectives].sort((a, b) => {
        const priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    sortedObjectives.forEach(objective => {
        const priorityClass = {
            'Alta': 'priority-high',
            'Media': 'priority-medium',
            'Baja': 'priority-low'
        }[objective.priority];
        
        const card = document.createElement('div');
        card.className = 'card smart-objective-card';
        card.innerHTML = `
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    ${objective.title}
                    <span class="badge ${priorityClass} priority-badge">Prioridad ${objective.priority}</span>
                </h6>
                <div class="actions">
                    <button class="btn btn-sm btn-outline-primary toggle-details-btn" data-id="${objective.id}">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary edit-objective-btn" data-id="${objective.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-objective-btn" data-id="${objective.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="progress mb-2">
                    <div class="progress-bar" role="progressbar" style="width: ${objective.progress}%;" 
                         aria-valuenow="${objective.progress}" aria-valuemin="0" aria-valuemax="100">
                        ${objective.progress}%
                    </div>
                </div>
                <p class="mb-0"><strong>Estado:</strong> ${objective.status}</p>
                <div class="smart-details">
                    <hr>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <h6>Específico</h6>
                            <p>${objective.specific}</p>
                        </div>
                        <div class="col-md-6 mb-2">
                            <h6>Medible</h6>
                            <p>${objective.measurable}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <h6>Alcanzable</h6>
                            <p>${objective.achievable}</p>
                        </div>
                        <div class="col-md-6 mb-2">
                            <h6>Relevante</h6>
                            <p>${objective.relevant}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <h6>Temporal</h6>
                            <p>${objective.timebound}</p>
                        </div>
                        <div class="col-md-6 mb-2">
                            <h6>Fecha Estimada</h6>
                            <p>${formatDate(objective.expectedDate)}</p>
                        </div>
                    </div>
                    ${objective.notes ? `
                    <div class="row">
                        <div class="col-12 mb-2">
                            <h6>Notas</h6>
                            <p>${objective.notes}</p>
                        </div>
                    </div>
                    ` : ''}
                    <div class="smart-category">
                        <span class="badge bg-secondary">${objective.category}</span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Agregar eventos a los botones
        card.querySelector('.toggle-details-btn').addEventListener('click', (e) => {
            const targetCard = e.currentTarget.closest('.smart-objective-card');
            targetCard.classList.toggle('expanded');
            const icon = e.currentTarget.querySelector('i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
        
        card.querySelector('.edit-objective-btn').addEventListener('click', (e) => {
            const objectiveId = e.currentTarget.getAttribute('data-id');
            openSmartObjectiveModal(objectiveId);
        });
        
        card.querySelector('.delete-objective-btn').addEventListener('click', (e) => {
            const objectiveId = e.currentTarget.getAttribute('data-id');
            deleteSmartObjective(objectiveId);
        });
    });
}

// Función para eliminar un objetivo SMART
async function deleteSmartObjective(objectiveId) {
    if (!confirm('¿Está seguro de eliminar este objetivo? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
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
            
            // Filtrar el objetivo a eliminar
            const objectives = treatmentData.objectives.filter(obj => obj.id !== objectiveId);
            
            // Actualizar en Firestore
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                objectives,
                updatedAt: new Date().toISOString()
            });
            
            // Actualizar array local
            currentTreatmentPlan.objectives = currentTreatmentPlan.objectives.filter(obj => obj.id !== objectiveId);
            
            // Refrescar lista
            displaySmartObjectives();
            
            // Actualizar timeline
            updateTimeline();
            
            // Actualizar lista de objetivos en modal de ejercicios
            updateObjectivesInExerciseModal();
            
            // Actualizar resumen
            updateTreatmentSummary();
        }
    } catch (error) {
        console.error('Error al eliminar objetivo SMART:', error);
        alert('Hubo un error al eliminar el objetivo. Por favor intente nuevamente.');
    }
}

// --------------------------------
// FUNCIONES PARA EJERCICIOS
// --------------------------------

// Función para abrir el modal de ejercicio
function openExerciseModal(exerciseId = null) {
    const modal = new bootstrap.Modal(document.getElementById('exerciseModal'));
    const form = document.getElementById('exerciseForm');
    form.reset();
    
    // Cargar objetivos SMART en el select
    updateObjectivesInExerciseModal();
    
    // Si se proporciona un ID, es edición
    if (exerciseId) {
        const exercise = currentTreatmentPlan.exercises.find(ex => ex.id === exerciseId);
        if (exercise) {
            document.getElementById('exerciseId').value = exercise.id;
            document.getElementById('exerciseName').value = exercise.name;
            document.getElementById('exerciseCategory').value = exercise.category;
            document.getElementById('exerciseDescription').value = exercise.description;
            document.getElementById('exerciseSets').value = exercise.sets;
            document.getElementById('exerciseReps').value = exercise.reps;
            document.getElementById('exerciseFrequency').value = exercise.frequency;
            document.getElementById('exerciseIntensity').value = exercise.intensity;
            document.getElementById('exerciseProgressionPlan').value = exercise.progressionPlan || '';
            document.getElementById('exerciseContraindications').value = exercise.contraindications || '';
            document.getElementById('exerciseObjectiveLink').value = exercise.objectiveId || '';
            
            document.getElementById('exerciseModalLabel').textContent = 'Editar Ejercicio';
        }
    } else {
        document.getElementById('exerciseId').value = '';
        document.getElementById('exerciseModalLabel').textContent = 'Agregar Ejercicio';
    }
    
    modal.show();
}

// Función para actualizar la lista de objetivos en el modal de ejercicios
function updateObjectivesInExerciseModal() {
    const selectElement = document.getElementById('exerciseObjectiveLink');
    selectElement.innerHTML = '<option value="">Ninguno</option>';
    
    currentTreatmentPlan.objectives.forEach(objective => {
        const option = document.createElement('option');
        option.value = objective.id;
        option.textContent = objective.title;
        selectElement.appendChild(option);
    });
}

// Función para guardar un ejercicio
async function saveExercise() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        const db = getFirestore();
        const form = document.getElementById('exerciseForm');
        
        // Validar formulario
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Obtener datos del formulario
        const exerciseId = document.getElementById('exerciseId').value;
        const name = document.getElementById('exerciseName').value;
        const category = document.getElementById('exerciseCategory').value;
        const description = document.getElementById('exerciseDescription').value;
        const sets = parseInt(document.getElementById('exerciseSets').value);
        const reps = parseInt(document.getElementById('exerciseReps').value);
        const frequency = document.getElementById('exerciseFrequency').value;
        const intensity = document.getElementById('exerciseIntensity').value;
        const progressionPlan = document.getElementById('exerciseProgressionPlan').value;
        const contraindications = document.getElementById('exerciseContraindications').value;
        const objectiveId = document.getElementById('exerciseObjectiveLink').value;
        
        // Crear objeto con los datos
        const exercise = {
            name,
            category,
            description,
            sets,
            reps,
            frequency,
            intensity,
            progressionPlan,
            contraindications,
            objectiveId: objectiveId || null,
            createdAt: new Date().toISOString()
        };
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Verificar si ya existe un plan de tratamiento para este paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', currentPatient.id));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        if (treatmentSnapshot.empty) {
            // Crear nuevo plan de tratamiento
            exercise.id = Date.now().toString();
            await addDoc(treatmentsRef, {
                patientId: currentPatient.id,
                objectives: [],
                exercises: [exercise],
                sessions: [],
                recommendations: [],
                frequency: '',
                estimatedSessions: 0,
                sessionDuration: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            // Agregar ejercicio al array local
            currentTreatmentPlan.exercises.push(exercise);
        } else {
            // Actualizar plan existente
            const treatmentDoc = treatmentSnapshot.docs[0];
            const treatmentData = treatmentDoc.data();
            let exercises = treatmentData.exercises || [];
            
            if (exerciseId) {
                // Actualizar ejercicio existente
                const index = exercises.findIndex(ex => ex.id === exerciseId);
                if (index !== -1) {
                    exercise.id = exerciseId;
                    exercises[index] = exercise;
                    
                    // Actualizar en array local
                    const localIndex = currentTreatmentPlan.exercises.findIndex(ex => ex.id === exerciseId);
                    if (localIndex !== -1) {
                        currentTreatmentPlan.exercises[localIndex] = exercise;
                    }
                }
            } else {
                // Agregar nuevo ejercicio
                exercise.id = Date.now().toString();
                exercises.push(exercise);
                
                // Agregar al array local
                currentTreatmentPlan.exercises.push(exercise);
            }
            
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                exercises,
                updatedAt: new Date().toISOString()
            });
        }
        
        // Cerrar modal y refrescar lista
        document.getElementById('exerciseForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('exerciseModal')).hide();
        displayExercises();
        
        // Actualizar lista de ejercicios en modal de sesiones
        updateExercisesInSessionModal();
        
        // Actualizar resumen
        updateTreatmentSummary();
        
    } catch (error) {
        console.error('Error al guardar ejercicio:', error);
        alert('Hubo un error al guardar el ejercicio. Por favor intente nuevamente.');
    }
}

// Función para mostrar ejercicios
function displayExercises() {
    const categories = {
        'strength': document.getElementById('strengthExercisesList'),
        'flexibility': document.getElementById('flexibilityExercisesList'),
        'proprioception': document.getElementById('proprioceptionExercisesList'),
        'functional': document.getElementById('functionalExercisesList')
    };
    
    // Limpiar contenedores
    Object.values(categories).forEach(container => {
        container.innerHTML = '';
    });
    
    // Verificar si hay ejercicios
    if (currentTreatmentPlan.exercises.length === 0) {
        Object.values(categories).forEach(container => {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i> No hay ejercicios en esta categoría.
                </div>
            `;
        });
        return;
    }
    
    // Agrupar ejercicios por categoría
    const exercisesByCategory = {
        'strength': [],
        'flexibility': [],
        'proprioception': [],
        'functional': []
    };
    
    currentTreatmentPlan.exercises.forEach(exercise => {
        if (exercisesByCategory[exercise.category]) {
            exercisesByCategory[exercise.category].push(exercise);
        }
    });
    
    // Mostrar ejercicios por categoría
    Object.entries(exercisesByCategory).forEach(([category, exercises]) => {
        const container = categories[category];
        
        if (exercises.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i> No hay ejercicios en esta categoría.
                </div>
            `;
            return;
        }
        
        exercises.forEach(exercise => {
            const card = document.createElement('div');
            card.className = `card exercise-card exercise-${exercise.category} mb-3`;
            
            // Obtener nombre del objetivo relacionado, si existe
            let objectiveName = '';
            if (exercise.objectiveId) {
                const relatedObjective = currentTreatmentPlan.objectives.find(obj => obj.id === exercise.objectiveId);
                if (relatedObjective) {
                    objectiveName = relatedObjective.title;
                }
            }
            
            card.innerHTML = `
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">${exercise.name}</h6>
                    <div class="actions">
                        <button class="btn btn-sm btn-outline-secondary edit-exercise-btn" data-id="${exercise.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-exercise-btn" data-id="${exercise.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p>${exercise.description}</p>
                    <div class="exercise-dosage">
                        <span><i class="fas fa-layer-group"></i> ${exercise.sets} series</span>
                        <span><i class="fas fa-redo"></i> ${exercise.reps} repeticiones</span>
                        <span><i class="fas fa-calendar-alt"></i> ${exercise.frequency}</span>
                        <span><i class="fas fa-fire"></i> Intensidad: ${exercise.intensity}</span>
                    </div>
                    
                    ${exercise.progressionPlan ? `
                    <div class="exercise-progression">
                        <strong>Progresión:</strong> ${exercise.progressionPlan}
                    </div>
                    ` : ''}
                    
                    ${exercise.contraindications ? `
                    <div class="exercise-contraindications">
                        <strong>Contraindicaciones:</strong> ${exercise.contraindications}
                    </div>
                    ` : ''}
                    
                    ${objectiveName ? `
                    <div class="mt-2">
                        <span class="badge bg-info">Objetivo: ${objectiveName}</span>
                    </div>
                    ` : ''}
                </div>
            `;
            
            container.appendChild(card);
            
            // Agregar eventos a los botones
            card.querySelector('.edit-exercise-btn').addEventListener('click', (e) => {
                const exerciseId = e.currentTarget.getAttribute('data-id');
                openExerciseModal(exerciseId);
            });
            
            card.querySelector('.delete-exercise-btn').addEventListener('click', (e) => {
                const exerciseId = e.currentTarget.getAttribute('data-id');
                deleteExercise(exerciseId);
            });
        });
    });
}

// Función para eliminar un ejercicio
async function deleteExercise(exerciseId) {
    if (!confirm('¿Está seguro de eliminar este ejercicio? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
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
            
            // Filtrar el ejercicio a eliminar
            const exercises = treatmentData.exercises.filter(ex => ex.id !== exerciseId);
            
            // Actualizar en Firestore
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                exercises,
                updatedAt: new Date().toISOString()
            });
            
            // Actualizar array local
            currentTreatmentPlan.exercises = currentTreatmentPlan.exercises.filter(ex => ex.id !== exerciseId);
            
            // Refrescar lista
            displayExercises();
            
            // Actualizar lista de ejercicios en modal de sesiones
            updateExercisesInSessionModal();
            
            // Actualizar resumen
            updateTreatmentSummary();
        }
    } catch (error) {
        console.error('Error al eliminar ejercicio:', error);
        alert('Hubo un error al eliminar el ejercicio. Por favor intente nuevamente.');
    }
}

// --------------------------------
// FUNCIONES PARA SESIONES
// --------------------------------

// Función para inicializar el calendario de sesiones
function initializeSessionsCalendar() {
    const calendar = document.getElementById('sessionsCalendar');
    calendar.innerHTML = '<div class="text-center py-4">Configure la frecuencia y número de sesiones para visualizar el calendario.</div>';
}

// Función para actualizar el calendario de sesiones
function updateSessionSchedule() {
    const frequency = document.getElementById('treatmentFrequency').value;
    const estimatedSessions = parseInt(document.getElementById('estimatedSessions').value) || 0;
    const sessionDuration = parseInt(document.getElementById('sessionDuration').value) || 60;
    
    // Guardar en variables globales
    currentTreatmentPlan.frequency = frequency;
    currentTreatmentPlan.estimatedSessions = estimatedSessions;
    currentTreatmentPlan.sessionDuration = sessionDuration;
    
    // Actualizar en Firebase
    saveTreatmentPlanSettings();
    
    // Renderizar calendario
    renderSessionsCalendar(frequency, estimatedSessions);
    
    // Actualizar resumen
    updateTreatmentSummary();
}

// Función para guardar configuración del plan de tratamiento
async function saveTreatmentPlanSettings() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            return;
        }
        
        const db = getFirestore();
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Verificar si ya existe un plan de tratamiento para este paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', currentPatient.id));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        if (treatmentSnapshot.empty) {
            // Crear nuevo plan de tratamiento
            await addDoc(treatmentsRef, {
                patientId: currentPatient.id,
                objectives: [],
                exercises: [],
                sessions: [],
                recommendations: [],
                frequency: currentTreatmentPlan.frequency,
                estimatedSessions: currentTreatmentPlan.estimatedSessions,
                sessionDuration: currentTreatmentPlan.sessionDuration,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        } else {
            // Actualizar plan existente
            const treatmentDoc = treatmentSnapshot.docs[0];
            
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                frequency: currentTreatmentPlan.frequency,
                estimatedSessions: currentTreatmentPlan.estimatedSessions,
                sessionDuration: currentTreatmentPlan.sessionDuration,
                updatedAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Error al guardar configuración del plan de tratamiento:', error);
    }
}

// Función para renderizar el calendario de sesiones
function renderSessionsCalendar(frequency, estimatedSessions) {
    const calendar = document.getElementById('sessionsCalendar');
    
    if (!frequency || estimatedSessions <= 0) {
        calendar.innerHTML = '<div class="text-center py-4">Configure la frecuencia y número de sesiones para visualizar el calendario.</div>';
        return;
    }
    
    // Calcular fechas de sesiones
    const sessionDates = calculateSessionDates(frequency, estimatedSessions);
    
    // Crear calendario
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    
    // Crear contenedor de meses
    calendar.innerHTML = '';
    const monthsContainer = document.createElement('div');
    monthsContainer.className = 'row';
    
    // Generar 3 meses
    for (let m = 0; m < 3; m++) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() + m, 1);
        const monthEl = createMonthCalendar(monthDate, sessionDates);
        
        const monthCol = document.createElement('div');
        monthCol.className = 'col-md-4 mb-3';
        monthCol.appendChild(monthEl);
        monthsContainer.appendChild(monthCol);
    }
    
    calendar.appendChild(monthsContainer);
    
    // Marcar sesiones existentes
    currentTreatmentPlan.sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        const dateString = sessionDate.toISOString().split('T')[0];
        const dayEl = calendar.querySelector(`[data-date="${dateString}"]`);
        
        if (dayEl) {
            dayEl.classList.add('has-session');
            dayEl.setAttribute('title', `Sesión ${session.number}: ${session.objective}`);
        }
    });
}

// Función para calcular fechas de sesiones según frecuencia
function calculateSessionDates(frequency, estimatedSessions) {
    const dates = [];
    const startDate = new Date();
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < estimatedSessions; i++) {
        // Agregar días según frecuencia
        switch (frequency) {
            case 'Diario':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case '3 veces por semana':
                // Lunes, miércoles, viernes
                currentDate.setDate(currentDate.getDate() + 
                    (currentDate.getDay() === 1 ? 2 : // Lunes -> Miércoles (+2)
                    currentDate.getDay() === 3 ? 2 : // Miércoles -> Viernes (+2)
                    currentDate.getDay() === 5 ? 3 : // Viernes -> Lunes (+3)
                    1)); // Otro día -> siguiente día
                break;
            case '2 veces por semana':
                // Martes y jueves
                currentDate.setDate(currentDate.getDate() + 
                    (currentDate.getDay() === 2 ? 2 : // Martes -> Jueves (+2)
                    currentDate.getDay() === 4 ? 5 : // Jueves -> Martes (+5)
                    1)); // Otro día -> siguiente día
                break;
            case 'Semanal':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'Quincenal':
                currentDate.setDate(currentDate.getDate() + 14);
                break;
            default:
                currentDate.setDate(currentDate.getDate() + 1);
        }
        
        dates.push(new Date(currentDate));
    }
    
    return dates;
}

// Función para crear un calendario mensual
function createMonthCalendar(date, sessionDates) {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const monthEl = document.createElement('div');
    monthEl.className = 'calendar-month';
    
    // Título del mes
    const monthTitle = document.createElement('h6');
    monthTitle.className = 'text-center mb-2';
    monthTitle.textContent = `${monthNames[month]} ${year}`;
    monthEl.appendChild(monthTitle);
    
    // Días de la semana
    const weekDaysRow = document.createElement('div');
    weekDaysRow.className = 'd-flex justify-content-between mb-1';
    
    dayNames.forEach(day => {
        const dayNameEl = document.createElement('div');
        dayNameEl.className = 'calendar-weekday text-center';
        dayNameEl.style.width = '2.5rem';
        dayNameEl.textContent = day;
        weekDaysRow.appendChild(dayNameEl);
    });
    
    monthEl.appendChild(weekDaysRow);
    
    // Días del mes
    const daysContainer = document.createElement('div');
    daysContainer.className = 'd-flex flex-wrap';
    
    // Ajustar primer día (0 es domingo, 1 es lunes en JS)
    let firstWeekday = firstDay.getDay();
    firstWeekday = firstWeekday === 0 ? 7 : firstWeekday; // Convertir domingo (0) a 7
    
    // Espacios en blanco para los días antes del primer día del mes
    for (let i = 1; i < firstWeekday; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day invisible';
        emptyDay.style.width = '2.5rem';
        daysContainer.appendChild(emptyDay);
    }
    
    // Días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayDate = new Date(year, month, i);
        const dateString = dayDate.toISOString().split('T')[0];
        
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = i;
        dayEl.setAttribute('data-date', dateString);
        
        // Marcar días de sesión
        const isSessionDay = sessionDates.some(sessionDate => 
            sessionDate.getFullYear() === year && 
            sessionDate.getMonth() === month && 
            sessionDate.getDate() === i
        );
        
        if (isSessionDay) {
            dayEl.classList.add('has-session');
        }
        
        // Evento de clic para agregar/editar sesión
        dayEl.addEventListener('click', () => {
            const selectedDate = new Date(year, month, i);
            openSessionModal(null, selectedDate);
        });
        
        daysContainer.appendChild(dayEl);
    }
    
    monthEl.appendChild(daysContainer);
    
    return monthEl;
}

// Función para abrir el modal de sesión
function openSessionModal(sessionId = null, selectedDate = null) {
    const modal = new bootstrap.Modal(document.getElementById('sessionModal'));
    const form = document.getElementById('sessionForm');
    form.reset();
    
    // Cargar ejercicios en el modal
    updateExercisesInSessionModal();
    
    // Si se proporciona un ID, es edición
    if (sessionId) {
        const session = currentTreatmentPlan.sessions.find(s => s.id === sessionId);
        if (session) {
            document.getElementById('sessionId').value = session.id;
            document.getElementById('sessionDate').value = session.date;
            document.getElementById('sessionNumber').value = session.number;
            document.getElementById('sessionObjective').value = session.objective;
            document.getElementById('sessionTechniques').value = session.techniques;
            document.getElementById('sessionNotes').value = session.notes || '';
            
            // Marcar ejercicios incluidos
            session.exercises.forEach(exId => {
                const checkbox = document.querySelector(`input[name="sessionExercise"][value="${exId}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            
            document.getElementById('sessionModalLabel').textContent = 'Editar Sesión';
        }
    } else {
        document.getElementById('sessionId').value = '';
        document.getElementById('sessionModalLabel').textContent = 'Agregar Sesión';
        
        // Si se proporciona una fecha, establecerla
        if (selectedDate) {
            document.getElementById('sessionDate').value = selectedDate.toISOString().split('T')[0];
        }
        
        // Sugerir número de sesión
        const nextSessionNumber = currentTreatmentPlan.sessions.length > 0 ? 
            Math.max(...currentTreatmentPlan.sessions.map(s => s.number)) + 1 : 1;
        document.getElementById('sessionNumber').value = nextSessionNumber;
    }
    
    modal.show();
}

// Función para actualizar la lista de ejercicios en el modal de sesiones
function updateExercisesInSessionModal() {
    const container = document.getElementById('sessionExercisesList');
    container.innerHTML = '';
    
    if (currentTreatmentPlan.exercises.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay ejercicios definidos. Agregue ejercicios en la pestaña "Ejercicios".</p>';
        return;
    }
    
    // Agrupar ejercicios por categoría
    const exercisesByCategory = {
        'strength': { name: 'Fuerza', exercises: [] },
        'flexibility': { name: 'Flexibilidad', exercises: [] },
        'proprioception': { name: 'Propiocepción', exercises: [] },
        'functional': { name: 'Funcionales', exercises: [] }
    };
    
    currentTreatmentPlan.exercises.forEach(exercise => {
        if (exercisesByCategory[exercise.category]) {
            exercisesByCategory[exercise.category].exercises.push(exercise);
        }
    });
    
    // Crear checkboxes por categoría
    Object.entries(exercisesByCategory).forEach(([category, data]) => {
        if (data.exercises.length > 0) {
            const categoryTitle = document.createElement('h6');
            categoryTitle.className = 'mt-2 mb-1';
            categoryTitle.textContent = data.name;
            container.appendChild(categoryTitle);
            
            data.exercises.forEach(exercise => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'form-check';
                checkboxDiv.innerHTML = `
                    <input class="form-check-input" type="checkbox" name="sessionExercise" value="${exercise.id}" id="exercise${exercise.id}">
                    <label class="form-check-label" for="exercise${exercise.id}">
                        ${exercise.name}
                    </label>
                `;
                container.appendChild(checkboxDiv);
            });
        }
    });
}

// Función para guardar una sesión
async function saveSession() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        const db = getFirestore();
        const form = document.getElementById('sessionForm');
        
        // Validar formulario
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Obtener datos del formulario
        const sessionId = document.getElementById('sessionId').value;
        const date = document.getElementById('sessionDate').value;
        const number = parseInt(document.getElementById('sessionNumber').value);
        const objective = document.getElementById('sessionObjective').value;
        const techniques = document.getElementById('sessionTechniques').value;
        const notes = document.getElementById('sessionNotes').value;
        
        // Obtener ejercicios seleccionados
        const exerciseCheckboxes = document.querySelectorAll('input[name="sessionExercise"]:checked');
        const exercises = Array.from(exerciseCheckboxes).map(cb => cb.value);
        
        // Crear objeto con los datos
        const session = {
            date,
            number,
            objective,
            techniques,
            notes,
            exercises,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Verificar si ya existe un plan de tratamiento para este paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', currentPatient.id));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        if (treatmentSnapshot.empty) {
            // Crear nuevo plan de tratamiento
            session.id = Date.now().toString();
            await addDoc(treatmentsRef, {
                patientId: currentPatient.id,
                objectives: [],
                exercises: [],
                sessions: [session],
                recommendations: [],
                frequency: currentTreatmentPlan.frequency,
                estimatedSessions: currentTreatmentPlan.estimatedSessions,
                sessionDuration: currentTreatmentPlan.sessionDuration,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            // Agregar sesión al array local
            currentTreatmentPlan.sessions.push(session);
        } else {
            // Actualizar plan existente
            const treatmentDoc = treatmentSnapshot.docs[0];
            const treatmentData = treatmentDoc.data();
            let sessions = treatmentData.sessions || [];
            
            if (sessionId) {
                // Actualizar sesión existente
                const index = sessions.findIndex(s => s.id === sessionId);
                if (index !== -1) {
                    session.id = sessionId;
                    sessions[index] = session;
                    
                    // Actualizar en array local
                    const localIndex = currentTreatmentPlan.sessions.findIndex(s => s.id === sessionId);
                    if (localIndex !== -1) {
                        currentTreatmentPlan.sessions[localIndex] = session;
                    }
                }
            } else {
                // Agregar nueva sesión
                session.id = Date.now().toString();
                sessions.push(session);
                
                // Agregar al array local
                currentTreatmentPlan.sessions.push(session);
            }
            
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                sessions,
                updatedAt: new Date().toISOString()
            });
        }
        
        // Cerrar modal y refrescar lista
        document.getElementById('sessionForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('sessionModal')).hide();
        displaySessions();
        
        // Actualizar calendario
        renderSessionsCalendar(currentTreatmentPlan.frequency, currentTreatmentPlan.estimatedSessions);
        
        // Actualizar timeline
        updateTimeline();
        
        // Actualizar resumen
        updateTreatmentSummary();
        
    } catch (error) {
        console.error('Error al guardar sesión:', error);
        alert('Hubo un error al guardar la sesión. Por favor intente nuevamente.');
    }
}

// Función para mostrar sesiones
function displaySessions() {
    const tableBody = document.getElementById('sessionsTableBody');
    tableBody.innerHTML = '';
    
    if (currentTreatmentPlan.sessions.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="text-center">
                No hay sesiones planificadas. Agregue sesiones utilizando el botón "Agregar Sesión".
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    // Ordenar sesiones por fecha y número
    const sortedSessions = [...currentTreatmentPlan.sessions].sort((a, b) => {
        if (a.date !== b.date) {
            return new Date(a.date) - new Date(b.date);
        }
        return a.number - b.number;
    });
    
    sortedSessions.forEach(session => {
        const row = document.createElement('tr');
        row.className = session.completed ? 'table-success' : '';
        
        // Obtener nombres de ejercicios incluidos
        const exerciseNames = session.exercises.map(exId => {
            const exercise = currentTreatmentPlan.exercises.find(ex => ex.id === exId);
            return exercise ? exercise.name : '';
        }).filter(name => name).join(', ');
        
        row.innerHTML = `
            <td>${formatDate(session.date)}</td>
            <td>${session.number}</td>
            <td>${session.objective}</td>
            <td>
                <span class="d-inline-block text-truncate" style="max-width: 150px;" title="${session.techniques}">
                    ${session.techniques}
                </span>
                ${exerciseNames ? `<br><small class="text-muted">Ejercicios: ${exerciseNames}</small>` : ''}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-secondary edit-session-btn" data-id="${session.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-session-btn" data-id="${session.id}">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-outline-success toggle-complete-btn" data-id="${session.id}" title="${session.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                    <i class="fas ${session.completed ? 'fa-times' : 'fa-check'}"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Agregar eventos a los botones
        row.querySelector('.edit-session-btn').addEventListener('click', (e) => {
            const sessionId = e.currentTarget.getAttribute('data-id');
            openSessionModal(sessionId);
        });
        
        row.querySelector('.delete-session-btn').addEventListener('click', (e) => {
            const sessionId = e.currentTarget.getAttribute('data-id');
            deleteSession(sessionId);
        });
        
        row.querySelector('.toggle-complete-btn').addEventListener('click', (e) => {
            const sessionId = e.currentTarget.getAttribute('data-id');
            toggleSessionCompletion(sessionId);
        });
    });
}

// Función para eliminar una sesión
async function deleteSession(sessionId) {
    if (!confirm('¿Está seguro de eliminar esta sesión? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
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
            
            // Filtrar la sesión a eliminar
            const sessions = treatmentData.sessions.filter(s => s.id !== sessionId);
            
            // Actualizar en Firestore
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                sessions,
                updatedAt: new Date().toISOString()
            });
            
            // Actualizar array local
            currentTreatmentPlan.sessions = currentTreatmentPlan.sessions.filter(s => s.id !== sessionId);
            
            // Refrescar lista
            displaySessions();
            
            // Actualizar calendario
            renderSessionsCalendar(currentTreatmentPlan.frequency, currentTreatmentPlan.estimatedSessions);
            
            // Actualizar timeline
            updateTimeline();
            
            // Actualizar resumen
            updateTreatmentSummary();
        }
    } catch (error) {
        console.error('Error al eliminar sesión:', error);
        alert('Hubo un error al eliminar la sesión. Por favor intente nuevamente.');
    }
}

// Función para cambiar el estado de completado de una sesión
async function toggleSessionCompletion(sessionId) {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
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
            const sessions = [...treatmentData.sessions];
            
            // Encontrar la sesión y cambiar su estado
            const sessionIndex = sessions.findIndex(s => s.id === sessionId);
            if (sessionIndex !== -1) {
                sessions[sessionIndex].completed = !sessions[sessionIndex].completed;
                
                // Actualizar en Firestore
                await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                    sessions,
                    updatedAt: new Date().toISOString()
                });
                
                // Actualizar array local
                const localIndex = currentTreatmentPlan.sessions.findIndex(s => s.id === sessionId);
                if (localIndex !== -1) {
                    currentTreatmentPlan.sessions[localIndex].completed = sessions[sessionIndex].completed;
                }
                
                // Refrescar lista
                displaySessions();
                
                // Actualizar timeline
                updateTimeline();
            }
        }
    } catch (error) {
        console.error('Error al cambiar estado de sesión:', error);
        alert('Hubo un error al actualizar la sesión. Por favor intente nuevamente.');
    }
}

// --------------------------------
// FUNCIONES PARA TIMELINE
// --------------------------------

// Función para inicializar el timeline
function initializeTimeline() {
    const timelineContainer = document.getElementById('treatmentTimeline');
    timelineContainer.innerHTML = '<div class="text-center py-4">No hay eventos para mostrar en la línea de tiempo.</div>';
}

// Función para actualizar el timeline
function updateTimeline() {
    const timelineContainer = document.getElementById('treatmentTimeline');
    
    // Verificar si hay eventos para mostrar
    const hasObjectives = currentTreatmentPlan.objectives.length > 0;
    const hasSessions = currentTreatmentPlan.sessions.length > 0;
    
    if (!hasObjectives && !hasSessions) {
        timelineContainer.innerHTML = '<div class="text-center py-4">No hay eventos para mostrar en la línea de tiempo.</div>';
        return;
    }
    
    // Recopilar todos los eventos para la línea de tiempo
    const events = [];
    
    // Agregar objetivos
    currentTreatmentPlan.objectives.forEach(objective => {
        events.push({
            type: 'objective',
            date: new Date(objective.expectedDate),
            title: objective.title,
            details: `Objetivo: ${objective.specific}`,
            id: objective.id,
            color: '#28a745' // Verde
        });
    });
    
    // Agregar sesiones
    currentTreatmentPlan.sessions.forEach(session => {
        events.push({
            type: 'session',
            date: new Date(session.date),
            title: `Sesión ${session.number}`,
            details: session.objective,
            id: session.id,
            completed: session.completed,
            color: session.completed ? '#6c757d' : '#007bff' // Gris si completada, azul si pendiente
        });
    });
    
    // Ordenar eventos por fecha
    events.sort((a, b) => a.date - b.date);
    
    // Crear línea de tiempo
    const timelineTrack = document.createElement('div');
    timelineTrack.className = 'timeline-track';
    
    // Calcular rango de fechas
    const firstDate = events[0].date;
    const lastDate = events[events.length - 1].date;
    const totalDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Crear eventos en la línea de tiempo
    events.forEach(event => {
        const daysFromStart = Math.ceil((event.date - firstDate) / (1000 * 60 * 60 * 24));
        const position = (daysFromStart / totalDays) * 100;
        
        const eventEl = document.createElement('div');
        eventEl.className = 'timeline-event';
        eventEl.style.left = `${position}%`;
        eventEl.setAttribute('data-id', event.id);
        eventEl.setAttribute('data-type', event.type);
        eventEl.setAttribute('data-bs-toggle', 'tooltip');
        eventEl.setAttribute('title', `${event.title}: ${event.details}`);
        
        const eventDot = document.createElement('div');
        eventDot.className = 'timeline-event-dot';
        eventDot.style.backgroundColor = event.color;
        
        const eventLabel = document.createElement('div');
        eventLabel.className = 'timeline-event-label';
        eventLabel.textContent = event.title;
        
        eventEl.appendChild(eventDot);
        eventEl.appendChild(eventLabel);
        timelineTrack.appendChild(eventEl);
        
        // Agregar evento de clic
        eventEl.addEventListener('click', () => {
            if (event.type === 'objective') {
                openSmartObjectiveModal(event.id);
            } else if (event.type === 'session') {
                openSessionModal(event.id);
            }
        });
    });
    
    // Agregar marcas de tiempo
    const timeMarks = 5; // Número de marcas de tiempo a mostrar
    for (let i = 0; i <= timeMarks; i++) {
        const position = (i / timeMarks) * 100;
        const daysFromStart = Math.floor((totalDays * i) / timeMarks);
        const markDate = new Date(firstDate);
        markDate.setDate(markDate.getDate() + daysFromStart);
        
        const timeMark = document.createElement('div');
        timeMark.className = 'timeline-time-mark';
        timeMark.style.left = `${position}%`;
        timeMark.style.position = 'absolute';
        timeMark.style.bottom = '-25px';
        timeMark.style.transform = 'translateX(-50%)';
        timeMark.textContent = formatDate(markDate.toISOString().split('T')[0]);
        
        timelineTrack.appendChild(timeMark);
    }
    
    // Limpiar y mostrar línea de tiempo
    timelineContainer.innerHTML = '';
    timelineContainer.appendChild(timelineTrack);
    
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para hacer zoom en el timeline
function zoomTimeline(factor) {
    const timelineTrack = document.querySelector('.timeline-track');
    if (!timelineTrack) return;
    
    const currentWidth = timelineTrack.style.width || '100%';
    const newWidth = parseInt(currentWidth) * factor + '%';
    
    timelineTrack.style.width = newWidth;
}

// Función para exportar el timeline
async function exportTimeline() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        // Preparar el contenedor para exportación
        const timelineContainer = document.getElementById('treatmentTimeline');
        
        // Usar html2canvas para capturar la línea de tiempo
        const canvas = await html2canvas(timelineContainer);
        
        // Crear PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('landscape', 'pt', 'a4');
        
        // Agregar título
        pdf.setFontSize(16);
        pdf.text(`Línea de Tiempo - Plan de Tratamiento: ${currentPatient.firstName} ${currentPatient.lastName}`, 40, 40);
        
        // Agregar imagen de la línea de tiempo
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 40, 60, canvas.width * 0.75, canvas.height * 0.75);
        
        // Guardar PDF
        pdf.save(`linea_tiempo_${currentPatient.lastName}_${currentPatient.firstName}.pdf`);
        
    } catch (error) {
        console.error('Error al exportar línea de tiempo:', error);
        alert('Hubo un error al exportar la línea de tiempo. Por favor intente nuevamente.');
    }
}

// --------------------------------
// FUNCIONES PARA RECOMENDACIONES
// --------------------------------

// Función para generar recomendaciones basadas en evidencia
async function generateEvidenceBasedRecommendations(patientId) {
    try {
        const db = getFirestore();
        
        // Obtener diagnóstico del paciente
        const diagnosisQuery = query(collection(db, 'diagnoses'), where('patientId', '==', patientId));
        const diagnosisSnapshot = await getDocs(diagnosisQuery);
        
        if (diagnosisSnapshot.empty) {
            // No hay diagnóstico, mostrar mensaje
            document.getElementById('recommendationsList').innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i> No se encontró un diagnóstico para este paciente. 
                    Complete la evaluación y diagnóstico para recibir recomendaciones basadas en evidencia.
                </div>
            `;
            return;
        }
        
        // Obtener datos del diagnóstico
        const diagnosisData = diagnosisSnapshot.docs[0].data();
        const diagnosis = diagnosisData.diagnosis || '';
        const cifComponents = diagnosisData.cifComponents || {};
        
        // Verificar si ya hay recomendaciones en el plan de tratamiento
        if (currentTreatmentPlan.recommendations && currentTreatmentPlan.recommendations.length > 0) {
            // Ya hay recomendaciones, mostrarlas
            displayRecommendations();
            return;
        }
        
        // Generar recomendaciones basadas en el diagnóstico
        // En un sistema real, aquí se consultaría una base de datos de evidencia
        // Para este ejemplo, usaremos algunas recomendaciones genéricas
        
        const recommendations = [];
        
        // Recomendaciones generales
        recommendations.push({
            id: Date.now().toString() + '1',
            title: 'Educación al paciente',
            description: 'Proporcionar información clara sobre el diagnóstico, pronóstico y plan de tratamiento. La educación al paciente es un componente esencial de cualquier intervención kinesiológica.',
            evidence: 'Alta',
            reference: 'Louw A, et al. (2016). The clinical application of teaching people about pain. Physiother Theory Pract, 32(5).',
            type: 'auto'
        });
        
        // Recomendaciones según diagnóstico
        if (diagnosis.toLowerCase().includes('lumbal') || diagnosis.toLowerCase().includes('lumbar')) {
            recommendations.push({
                id: Date.now().toString() + '2',
                title: 'Ejercicios de control motor lumbar',
                description: 'Implementar ejercicios progresivos de control motor para la columna lumbar, enfocados en la activación apropiada de la musculatura profunda y la coordinación con los patrones respiratorios.',
                evidence: 'Moderada',
                reference: 'Saragiotto BT, et al. (2016). Motor control exercise for chronic non-specific low-back pain. Cochrane Database Syst Rev.',
                type: 'auto'
            });
        }
        
        if (diagnosis.toLowerCase().includes('hombro') || diagnosis.toLowerCase().includes('manguito rotador')) {
            recommendations.push({
                id: Date.now().toString() + '3',
                title: 'Ejercicios progresivos para manguito rotador',
                description: 'Prescribir ejercicios de fortalecimiento progresivo para el manguito rotador, comenzando con ejercicios isométricos y avanzando a ejercicios con resistencia a través de rangos completos de movimiento.',
                evidence: 'Alta',
                reference: 'Littlewood C, et al. (2015). Exercise for rotator cuff tendinopathy: a systematic review. Physiotherapy, 101(1).',
                type: 'auto'
            });
        }
        
        if (diagnosis.toLowerCase().includes('rodilla') || diagnosis.toLowerCase().includes('ligamento')) {
            recommendations.push({
                id: Date.now().toString() + '4',
                title: 'Entrenamiento neuromuscular para extremidad inferior',
                description: 'Implementar entrenamiento neuromuscular progresivo con énfasis en el control de la alineación de la extremidad inferior durante tareas funcionales como sentadillas, escalones y equilibrio.',
                evidence: 'Alta',
                reference: 'Ageberg E, et al. (2015). Principles of neuromuscular training for knee and shoulder injury prevention. BMC Sports Sci Med Rehabil, 7(1).',
                type: 'auto'
            });
        }
        
        // Recomendaciones según componentes CIF
        if (cifComponents.activity && cifComponents.activity.includes('equilibrio')) {
            recommendations.push({
                id: Date.now().toString() + '5',
                title: 'Entrenamiento de equilibrio',
                description: 'Implementar ejercicios de equilibrio progresivos, comenzando con base de apoyo amplia en superficie estable y avanzando a base estrecha en superficies inestables.',
                evidence: 'Alta',
                reference: 'Lesinski M, et al. (2015). Effects of Balance Training on Balance Performance in Healthy Older Adults. Sports Med, 45(12).',
                type: 'auto'
            });
        }
        
        // Guardar recomendaciones en el plan de tratamiento
        const treatmentsRef = collection(db, 'treatments');
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', patientId));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        if (treatmentSnapshot.empty) {
            // Crear nuevo plan de tratamiento con recomendaciones
            await addDoc(treatmentsRef, {
                patientId,
                objectives: [],
                exercises: [],
                sessions: [],
                recommendations,
                frequency: '',
                estimatedSessions: 0,
                sessionDuration: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        } else {
            // Actualizar plan existente con recomendaciones
            const treatmentDoc = treatmentSnapshot.docs[0];
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                recommendations,
                updatedAt: new Date().toISOString()
            });
        }
        
        // Actualizar array local
        currentTreatmentPlan.recommendations = recommendations;
        
        // Mostrar recomendaciones
        displayRecommendations();
        
    } catch (error) {
        console.error('Error al generar recomendaciones:', error);
        document.getElementById('recommendationsList').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> Error al generar recomendaciones. Intente nuevamente más tarde.
            </div>
        `;
    }
}

// Función para agregar una recomendación personalizada
async function addCustomRecommendation() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        const db = getFirestore();
        const form = document.getElementById('customRecommendationForm');
        
        // Validar formulario
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Obtener datos del formulario
        const title = document.getElementById('customRecommendationTitle').value;
        const description = document.getElementById('customRecommendationDescription').value;
        const evidence = document.getElementById('customRecommendationEvidence').value;
        const reference = document.getElementById('customRecommendationReference').value;
        
        // Crear objeto con los datos
        const recommendation = {
            id: Date.now().toString(),
            title,
            description,
            evidence,
            reference,
            type: 'custom',
            createdAt: new Date().toISOString()
        };
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Verificar si ya existe un plan de tratamiento para este paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', currentPatient.id));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        if (treatmentSnapshot.empty) {
            // Crear nuevo plan de tratamiento con recomendación
            await addDoc(treatmentsRef, {
                patientId: currentPatient.id,
                objectives: [],
                exercises: [],
                sessions: [],
                recommendations: [recommendation],
                frequency: '',
                estimatedSessions: 0,
                sessionDuration: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            // Agregar recomendación al array local
            currentTreatmentPlan.recommendations = [recommendation];
        } else {
            // Actualizar plan existente con nueva recomendación
            const treatmentDoc = treatmentSnapshot.docs[0];
            const treatmentData = treatmentDoc.data();
            const recommendations = [...(treatmentData.recommendations || []), recommendation];
            
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                recommendations,
                updatedAt: new Date().toISOString()
            });
            
            // Actualizar array local
            currentTreatmentPlan.recommendations = recommendations;
        }
        
        // Limpiar formulario
        form.reset();
        
        // Mostrar recomendaciones
        displayRecommendations();
        
        // Actualizar resumen
        updateTreatmentSummary();
        
    } catch (error) {
        console.error('Error al agregar recomendación personalizada:', error);
        alert('Hubo un error al agregar la recomendación. Por favor intente nuevamente.');
    }
}

// Función para mostrar recomendaciones
function displayRecommendations() {
    const container = document.getElementById('recommendationsList');
    container.innerHTML = '';
    
    if (!currentTreatmentPlan.recommendations || currentTreatmentPlan.recommendations.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No hay recomendaciones disponibles. Agregue recomendaciones personalizadas o complete el diagnóstico para recibir sugerencias automáticas.
            </div>
        `;
        return;
    }
    
    // Ordenar recomendaciones por nivel de evidencia
    const evidenceOrder = { 'Alta': 1, 'Moderada': 2, 'Baja': 3, 'Consenso Experto': 4 };
    const sortedRecommendations = [...currentTreatmentPlan.recommendations].sort((a, b) => {
        return evidenceOrder[a.evidence] - evidenceOrder[b.evidence];
    });
    
    sortedRecommendations.forEach(recommendation => {
        const evidenceClass = {
            'Alta': 'evidence-high',
            'Moderada': 'evidence-moderate',
            'Baja': 'evidence-low',
            'Consenso Experto': 'evidence-expert'
        }[recommendation.evidence];
        
        const card = document.createElement('div');
        card.className = 'card recommendation-card mb-3';
        card.innerHTML = `
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    ${recommendation.title}
                    <span class="badge ${evidenceClass} evidence-badge ms-2">Evidencia ${recommendation.evidence}</span>
                </h6>
                ${recommendation.type === 'custom' ? `
                <button class="btn btn-sm btn-outline-danger delete-recommendation-btn" data-id="${recommendation.id}">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </div>
            <div class="card-body">
                <p>${recommendation.description}</p>
                ${recommendation.reference ? `
                <div class="recommendation-reference">
                    Referencia: ${recommendation.reference}
                </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(card);
        
        // Agregar evento al botón de eliminar (solo para recomendaciones personalizadas)
        if (recommendation.type === 'custom') {
            card.querySelector('.delete-recommendation-btn').addEventListener('click', (e) => {
                const recommendationId = e.currentTarget.getAttribute('data-id');
                deleteRecommendation(recommendationId);
            });
        }
    });
}

// Función para eliminar una recomendación
async function deleteRecommendation(recommendationId) {
    if (!confirm('¿Está seguro de eliminar esta recomendación? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
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
            
            // Filtrar la recomendación a eliminar
            const recommendations = treatmentData.recommendations.filter(r => r.id !== recommendationId);
            
            // Actualizar en Firestore
            await updateDoc(doc(db, 'treatments', treatmentDoc.id), {
                recommendations,
                updatedAt: new Date().toISOString()
            });
            
            // Actualizar array local
            currentTreatmentPlan.recommendations = currentTreatmentPlan.recommendations.filter(r => r.id !== recommendationId);
            
            // Refrescar lista
            displayRecommendations();
            
            // Actualizar resumen
            updateTreatmentSummary();
        }
    } catch (error) {
        console.error('Error al eliminar recomendación:', error);
        alert('Hubo un error al eliminar la recomendación. Por favor intente nuevamente.');
    }
}

// --------------------------------
// FUNCIONES PARA RESUMEN DEL PLAN
// --------------------------------

// Función para actualizar el resumen del plan de tratamiento
function updateTreatmentSummary() {
    const container = document.getElementById('treatmentPlanSummary');
    const currentPatient = getCurrentPatient();
    
    if (!currentPatient) {
        container.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> No hay un paciente seleccionado.
            </div>
        `;
        return;
    }
    
    // Construir resumen HTML
    let html = `
        <div class="summary-section">
            <h5 class="summary-heading">Información General</h5>
            <div class="row">
                <div class="col-md-6">
                    <div class="summary-item">
                        <strong>Paciente:</strong> ${currentPatient.firstName} ${currentPatient.lastName}
                    </div>
                    <div class="summary-item">
                        <strong>RUT:</strong> ${currentPatient.rut || 'No disponible'}
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="summary-item">
                        <strong>Frecuencia de Tratamiento:</strong> ${currentTreatmentPlan.frequency || 'No definida'}
                    </div>
                    <div class="summary-item">
                        <strong>Sesiones Estimadas:</strong> ${currentTreatmentPlan.estimatedSessions || '0'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Sección de objetivos SMART
    html += `
        <div class="summary-section">
            <h5 class="summary-heading">Objetivos SMART</h5>
    `;
    
    if (currentTreatmentPlan.objectives && currentTreatmentPlan.objectives.length > 0) {
        const sortedObjectives = [...currentTreatmentPlan.objectives].sort((a, b) => {
            const priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        sortedObjectives.forEach(objective => {
            html += `
                <div class="summary-item">
                    <strong>${objective.title}</strong> 
                    <span class="badge ${objective.priority === 'Alta' ? 'bg-danger' : (objective.priority === 'Media' ? 'bg-warning' : 'bg-success')}">
                        ${objective.priority}
                    </span>
                    <div class="small text-muted">
                        ${objective.specific}
                    </div>
                    <div class="progress mt-1" style="height: 10px;">
                        <div class="progress-bar" role="progressbar" style="width: ${objective.progress}%;" 
                             aria-valuenow="${objective.progress}" aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        html += `
            <div class="summary-item text-muted">
                No hay objetivos SMART definidos.
            </div>
        `;
    }
    
    html += `</div>`;
    
    // Sección de ejercicios
    html += `
        <div class="summary-section">
            <h5 class="summary-heading">Ejercicios Terapéuticos</h5>
    `;
    
    if (currentTreatmentPlan.exercises && currentTreatmentPlan.exercises.length > 0) {
        const exerciseCategories = {
            'strength': 'Fuerza',
            'flexibility': 'Flexibilidad',
            'proprioception': 'Propiocepción',
            'functional': 'Funcionales'
        };
        
        // Agrupar ejercicios por categoría
        const exercisesByCategory = {};
        currentTreatmentPlan.exercises.forEach(exercise => {
            if (!exercisesByCategory[exercise.category]) {
                exercisesByCategory[exercise.category] = [];
            }
            exercisesByCategory[exercise.category].push(exercise);
        });
        
        // Mostrar ejercicios por categoría
        Object.entries(exercisesByCategory).forEach(([category, exercises]) => {
            html += `
                <div class="summary-item">
                    <strong>${exerciseCategories[category] || category}</strong>
                    <ul class="mt-1 mb-0">
            `;
            
            exercises.forEach(exercise => {
                html += `
                    <li>
                        ${exercise.name}: ${exercise.sets} series x ${exercise.reps} repeticiones (${exercise.frequency})
                    </li>
                `;
            });
            
            html += `
                    </ul>
                </div>
            `;
        });
    } else {
        html += `
            <div class="summary-item text-muted">
                No hay ejercicios definidos.
            </div>
        `;
    }
    
    html += `</div>`;
    
    // Sección de sesiones
    html += `
        <div class="summary-section">
            <h5 class="summary-heading">Sesiones Planificadas</h5>
    `;
    
    if (currentTreatmentPlan.sessions && currentTreatmentPlan.sessions.length > 0) {
        const sortedSessions = [...currentTreatmentPlan.sessions].sort((a, b) => {
            if (a.date !== b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            return a.number - b.number;
        });
        
        // Mostrar solo las próximas 5 sesiones
        const upcomingSessions = sortedSessions.filter(s => !s.completed).slice(0, 5);
        
        if (upcomingSessions.length > 0) {
            upcomingSessions.forEach(session => {
                html += `
                    <div class="summary-item">
                        <strong>Sesión ${session.number}</strong> - ${formatDate(session.date)}
                        <div>${session.objective}</div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="summary-item text-muted">
                    No hay próximas sesiones planificadas.
                </div>
            `;
        }
    } else {
        html += `
            <div class="summary-item text-muted">
                No hay sesiones planificadas.
            </div>
        `;
    }
    
    html += `</div>`;
    
    // Sección de recomendaciones
    html += `
        <div class="summary-section">
            <h5 class="summary-heading">Recomendaciones Principales</h5>
    `;
    
    if (currentTreatmentPlan.recommendations && currentTreatmentPlan.recommendations.length > 0) {
        // Mostrar solo recomendaciones de alta evidencia (máximo 3)
        const highEvidenceRecommendations = currentTreatmentPlan.recommendations
            .filter(r => r.evidence === 'Alta')
            .slice(0, 3);
        
        if (highEvidenceRecommendations.length > 0) {
            highEvidenceRecommendations.forEach(recommendation => {
                html += `
                    <div class="summary-item">
                        <strong>${recommendation.title}</strong>
                        <div>${recommendation.description}</div>
                    </div>
                `;
            });
        } else {
            // Si no hay de alta evidencia, mostrar las primeras 2
            currentTreatmentPlan.recommendations.slice(0, 2).forEach(recommendation => {
                html += `
                    <div class="summary-item">
                        <strong>${recommendation.title}</strong>
                        <div>${recommendation.description}</div>
                    </div>
                `;
            });
        }
    } else {
        html += `
            <div class="summary-item text-muted">
                No hay recomendaciones definidas.
            </div>
        `;
    }
    
    html += `</div>`;
    
    // Actualizar contenedor
    container.innerHTML = html;
}

// Función para exportar el plan de tratamiento a PDF
async function exportTreatmentPlan() {
    try {
        const currentPatient = getCurrentPatient();
        if (!currentPatient) {
            alert('No hay un paciente seleccionado');
            return;
        }
        
        // Preparar contenido para PDF
        const summaryContainer = document.getElementById('treatmentPlanSummary');
        
        // Crear una copia para manipularla sin afectar la visualización
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = summaryContainer.innerHTML;
        tempContainer.style.padding = '20px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.width = '800px';
        
        // Agregar título y fecha
        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = `
            <h4 style="text-align: center; margin-bottom: 20px;">Plan de Tratamiento Kinesiológico</h4>
            <div style="text-align: right; margin-bottom: 20px;">
                Fecha de generación: ${new Date().toLocaleDateString()}
            </div>
        `;
        tempContainer.insertBefore(titleDiv, tempContainer.firstChild);
        
        // Agregar al DOM temporalmente para la captura (fuera de la vista)
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);
        
        // Usar html2canvas para capturar el contenido
        const canvas = await html2canvas(tempContainer);
        
        // Eliminar el contenedor temporal
        document.body.removeChild(tempContainer);
        
        // Crear PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        
        // Determinar escala para ajustar al ancho de la página
        const imgWidth = 595; // Ancho de A4 en puntos
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Agregar imagen al PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Agregar más páginas si el contenido es muy largo
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
        pdf.save(`plan_tratamiento_${currentPatient.lastName}_${currentPatient.firstName}.pdf`);
        
    } catch (error) {
        console.error('Error al exportar plan de tratamiento:', error);
        alert('Hubo un error al exportar el plan de tratamiento. Por favor intente nuevamente.');
    }
}

// --------------------------------
// FUNCIONES AUXILIARES
// --------------------------------

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return '';
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para cargar plan de tratamiento de un paciente
async function loadPatientTreatmentPlan(patientId) {
    try {
        const db = getFirestore();
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Buscar el plan de tratamiento del paciente
        const treatmentQuery = query
