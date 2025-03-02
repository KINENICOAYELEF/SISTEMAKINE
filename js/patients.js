// Funcionalidad para gestión de pacientes (Listado, búsqueda, filtros)
import { db, storage } from './firebase-config.js';
import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    startAfter,
    where,
    getDocs, 
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// Variables globales
let currentUser = null;
let patientsData = [];
let selectedPatient = null;
let currentPage = 1;
let recordsPerPage = 10;
let lastVisible = null;
let totalPatients = 0;
let activeFilters = {
    search: '',
    diagnosis: '',
    status: ''
};

// Elementos DOM
const patientsList = document.getElementById('patients-list');
const searchInput = document.getElementById('search-patient');
const searchBtn = document.getElementById('search-btn');
const filterDiagnosis = document.getElementById('filter-diagnosis');
const filterStatus = document.getElementById('filter-status');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const addPatientBtn = document.getElementById('add-patient-btn');
const showingRecordsSpan = document.getElementById('showing-records');
const totalRecordsSpan = document.getElementById('total-records');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const exportCsvBtn = document.getElementById('export-csv');
const exportPdfBtn = document.getElementById('export-pdf');

// Elementos del Modal de Detalles
const patientDetailsModal = document.getElementById('patientDetailsModal');
const patientDetailsModalLabel = document.getElementById('patientDetailsModalLabel');
const editPatientBtn = document.getElementById('edit-patient-btn');
const selectPatientBtn = document.getElementById('select-patient-btn');
const dischargePatientBtn = document.getElementById('discharge-patient-btn');
const patientTimeline = document.getElementById('patient-timeline');
const patientDocuments = document.getElementById('patient-documents');
const patientNotes = document.getElementById('patient-notes');
const saveNotesBtn = document.getElementById('save-notes-btn');
const viewEvolutionBtn = document.getElementById('view-evolution-btn');
const viewTreatmentBtn = document.getElementById('view-treatment-btn');
const exportRecordBtn = document.getElementById('export-record-btn');

// Campos de detalles del paciente
const detailFields = {
    name: document.getElementById('detail-name'),
    rut: document.getElementById('detail-rut'),
    birthdate: document.getElementById('detail-birthdate'),
    age: document.getElementById('detail-age'),
    gender: document.getElementById('detail-gender'),
    phone: document.getElementById('detail-phone'),
    email: document.getElementById('detail-email'),
    address: document.getElementById('detail-address'),
    diagnosis: document.getElementById('detail-diagnosis'),
    status: document.getElementById('detail-status')
};

// Elementos del Modal de Confirmación de Eliminación
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deletePatientName = document.getElementById('delete-patient-name');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar event listeners
    setupEventListeners();
});

// Event listener para cuando el módulo está listo (cargado desde dashboard.js)
document.addEventListener('moduleReady', (event) => {
    const data = event.detail;
    
    if (data.module === 'records') {
        // Cargar usuario actual
        currentUser = window.app.getCurrentUser();
        
        // Cargar diagnósticos para el filtro
        loadDiagnosisOptions();
        
        // Cargar lista de pacientes
        loadPatients();
        
        // Si se proporciona un ID de paciente específico, abrir sus detalles
        if (data.params && data.params.patientId) {
            openPatientDetails(data.params.patientId);
        }
    }
});

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda y filtros
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            activeFilters.search = searchInput.value.trim();
            resetPagination();
            loadPatients();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                activeFilters.search = searchInput.value.trim();
                resetPagination();
                loadPatients();
            }
        });
    }
    
    if (filterDiagnosis) {
        filterDiagnosis.addEventListener('change', () => {
            activeFilters.diagnosis = filterDiagnosis.value;
            resetPagination();
            loadPatients();
        });
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', () => {
            activeFilters.status = filterStatus.value;
            resetPagination();
            loadPatients();
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Paginación
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                loadPatients(false); // No resetear lastVisible
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            loadPatients(true); // Usar lastVisible
        });
    }
    
    // Exportación
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportPatientsToCsv();
        });
    }
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportPatientsToPdf();
        });
    }
    
    // Nuevo paciente
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', () => {
            window.app.loadModule('patient-form');
        });
    }
    
    // Modal de detalles
    if (patientDetailsModal) {
        patientDetailsModal.addEventListener('show.bs.modal', (e) => {
            const button = e.relatedTarget;
            if (button && button.getAttribute('data-patient-id')) {
                const patientId = button.getAttribute('data-patient-id');
                loadPatientDetails(patientId);
            }
        });
    }
    
    if (editPatientBtn) {
        editPatientBtn.addEventListener('click', () => {
            if (selectedPatient) {
                window.app.loadModule('patient-form', { patientId: selectedPatient.id });
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(patientDetailsModal);
                if (modal) modal.hide();
            }
        });
    }
    
    if (selectPatientBtn) {
        selectPatientBtn.addEventListener('click', async () => {
            if (selectedPatient) {
                await window.app.setActivePatient(selectedPatient.id);
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(patientDetailsModal);
                if (modal) modal.hide();
            }
        });
    }
    
    if (dischargePatientBtn) {
        dischargePatientBtn.addEventListener('click', () => {
            if (selectedPatient) {
                showDischargeConfirmation(selectedPatient);
            }
        });
    }
    
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', savePatientNotes);
    }
    
    if (viewEvolutionBtn) {
        viewEvolutionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (selectedPatient) {
                window.app.loadModule('evolution');
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(patientDetailsModal);
                if (modal) modal.hide();
            }
        });
    }
    
    if (viewTreatmentBtn) {
        viewTreatmentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (selectedPatient) {
                window.app.loadModule('treatment');
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(patientDetailsModal);
                if (modal) modal.hide();
            }
        });
    }
    
    if (exportRecordBtn) {
        exportRecordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (selectedPatient) {
                exportPatientRecord(selectedPatient.id);
            }
        });
    }
    
    // Modal de confirmación de eliminación
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteSelectedPatient);
    }
}

// Cargar opciones de diagnóstico para el filtro
async function loadDiagnosisOptions() {
    if (!filterDiagnosis) return;
    
    try {
        // Obtener diagnósticos únicos de pacientes
        const diagnosisSet = new Set();
        
        const patientsQuery = query(collection(db, "patients"));
        const querySnapshot = await getDocs(patientsQuery);
        
        querySnapshot.forEach((doc) => {
            const patientData = doc.data();
            if (patientData.diagnosis) {
                diagnosisSet.add(patientData.diagnosis);
            }
        });
        
        // Ordenar diagnósticos alfabéticamente
        const diagnosisList = Array.from(diagnosisSet).sort();
        
        // Generar opciones HTML
        let optionsHtml = '<option value="">Todos los diagnósticos</option>';
        diagnosisList.forEach(diagnosis => {
            optionsHtml += `<option value="${diagnosis}">${diagnosis}</option>`;
        });
        
        filterDiagnosis.innerHTML = optionsHtml;
        
    } catch (error) {
        console.error("Error al cargar opciones de diagnóstico:", error);
    }
}

// Cargar lista de pacientes
async function loadPatients(useLastVisible = false) {
    try {
        window.app.showSpinner();
        
        if (patientsList) {
            patientsList.innerHTML = '<tr><td colspan="8" class="text-center">Cargando pacientes...</td></tr>';
        }
        
        // Construir query con filtros
        let patientsQuery = collection(db, "patients");
        let constraints = [];
        
        // Filtro por estado
        if (activeFilters.status) {
            constraints.push(where("status", "==", activeFilters.status));
        }
        
        // Filtro por diagnóstico
        if (activeFilters.diagnosis) {
            constraints.push(where("diagnosis", "==", activeFilters.diagnosis));
        }
        
        // Ordenar por última actualización
        constraints.push(orderBy("lastUpdate", "desc"));
        
        // Si estamos paginando con lastVisible
        if (useLastVisible && lastVisible) {
            constraints.push(startAfter(lastVisible));
        }
        
        // Limitar resultados por página
        constraints.push(limit(recordsPerPage));
        
        // Aplicar todos los constraints
        patientsQuery = query(patientsQuery, ...constraints);
        
        // Ejecutar consulta
        const querySnapshot = await getDocs(patientsQuery);
        
        // Actualizar lastVisible para paginación
        if (querySnapshot.size > 0) {
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        } else {
            lastVisible = null;
        }
        
        // Procesar resultados
        patientsData = [];
        
        querySnapshot.forEach((doc) => {
            const patient = {
                id: doc.id,
                ...doc.data()
            };
            
            // Filtro por búsqueda (cliente)
            if (activeFilters.search) {
                const searchLower = activeFilters.search.toLowerCase();
                const nameMatch = patient.name && patient.name.toLowerCase().includes(searchLower);
                const rutMatch = patient.rut && patient.rut.toLowerCase().includes(searchLower);
                const phoneMatch = patient.phone && patient.phone.includes(searchLower);
                
                if (!nameMatch && !rutMatch && !phoneMatch) {
                    return; // Saltar este paciente si no coincide con la búsqueda
                }
            }
            
            patientsData.push(patient);
        });
        
        // Controlar paginación
        updatePaginationControls();
        
        // Actualizar UI
        renderPatientsList();
        
        // Contar total de pacientes
        await countTotalPatients();
        
    } catch (error) {
        console.error("Error al cargar pacientes:", error);
        if (patientsList) {
            patientsList.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle"></i> Error al cargar pacientes
                    </td>
                </tr>
            `;
        }
    } finally {
        window.app.hideSpinner();
    }
}

// Renderizar lista de pacientes
function renderPatientsList() {
    if (!patientsList) return;
    
    if (patientsData.length === 0) {
        patientsList.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No se encontraron pacientes</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    patientsData.forEach(patient => {
        // Formatear fecha de última visita
        let lastVisitDate = 'No registrado';
        if (patient.lastUpdate && patient.lastUpdate instanceof Timestamp) {
            lastVisitDate = new Date(patient.lastUpdate.seconds * 1000).toLocaleDateString();
        }
        
        // Status badge
        let statusBadge = '';
        switch (patient.status) {
            case 'active':
                statusBadge = '<span class="badge bg-success">Activo</span>';
                break;
            case 'discharged':
                statusBadge = '<span class="badge bg-primary">Alta</span>';
                break;
            case 'abandoned':
                statusBadge = '<span class="badge bg-danger">Abandonó</span>';
                break;
            default:
                statusBadge = '<span class="badge bg-secondary">No definido</span>';
        }
        
        html += `
            <tr>
                <td>${patient.name || 'N/A'}</td>
                <td>${patient.rut || 'N/A'}</td>
                <td>${patient.age || 'N/A'}</td>
                <td>${patient.diagnosis || 'Sin diagnóstico'}</td>
                <td>${patient.phone || 'N/A'}</td>
                <td>${statusBadge}</td>
                <td>${lastVisitDate}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-info" 
                            data-bs-toggle="modal" data-bs-target="#patientDetailsModal" data-patient-id="${patient.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-primary edit-patient" data-patient-id="${patient.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-success select-patient" data-patient-id="${patient.id}">
                            <i class="fas fa-user-check"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger delete-patient" data-patient-id="${patient.id}" data-patient-name="${patient.name || 'N/A'}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    patientsList.innerHTML = html;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-patient').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const patientId = e.currentTarget.getAttribute('data-patient-id');
            window.app.loadModule('patient-form', { patientId: patientId });
        });
    });
    
    document.querySelectorAll('.select-patient').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const patientId = e.currentTarget.getAttribute('data-patient-id');
            await window.app.setActivePatient(patientId);
        });
    });
    
    document.querySelectorAll('.delete-patient').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const patientId = e.currentTarget.getAttribute('data-patient-id');
            const patientName = e.currentTarget.getAttribute('data-patient-name');
            
            // Mostrar modal de confirmación
            showDeleteConfirmation(patientId, patientName);
        });
    });
    
    // Actualizar contador de registros mostrados
    if (showingRecordsSpan) {
        showingRecordsSpan.textContent = patientsData.length;
    }
}

// Mostrar confirmación de eliminación
function showDeleteConfirmation(patientId, patientName) {
    // Guardar ID de paciente seleccionado
    selectedPatient = { id: patientId, name: patientName };
    
    // Actualizar nombre en el modal
    if (deletePatientName) {
        deletePatientName.textContent = patientName;
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(deleteConfirmModal);
    modal.show();
}

// Mostrar confirmación de alta
function showDischargeConfirmation(patient) {
    Swal.fire({
        title: 'Dar de Alta',
        html: `¿Está seguro que desea dar de alta al paciente <strong>${patient.name}</strong>?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, dar de alta',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await dischargePatient(patient.id);
        }
    });
}

// Dar de alta a un paciente
async function dischargePatient(patientId) {
    try {
        window.app.showSpinner();
        
        const patientRef = doc(db, "patients", patientId);
        await updateDoc(patientRef, {
            status: 'discharged',
            dischargeDate: serverTimestamp(),
            dischargedBy: {
                uid: currentUser.uid,
                name: currentUser.name || currentUser.email
            },
            lastUpdate: serverTimestamp()
        });
        
        Swal.fire({
            icon: 'success',
            title: 'Paciente dado de alta',
            text: 'El paciente ha sido dado de alta correctamente',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(patientDetailsModal);
        if (modal) modal.hide();
        
        // Recargar lista
        await loadPatients();
        
    } catch (error) {
        console.error("Error al dar de alta al paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo dar de alta al paciente. Intente nuevamente.'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Eliminar paciente seleccionado
async function deleteSelectedPatient() {
    if (!selectedPatient) return;
    
    try {
        window.app.showSpinner();
        
        // Cerrar modal de confirmación
        const confirmModal = bootstrap.Modal.getInstance(deleteConfirmModal);
        if (confirmModal) confirmModal.hide();
        
        // Eliminar paciente
        await deleteDoc(doc(db, "patients", selectedPatient.id));
        
        Swal.fire({
            icon: 'success',
            title: 'Paciente eliminado',
            text: 'El paciente ha sido eliminado correctamente',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Recargar lista
        await loadPatients();
        
    } catch (error) {
        console.error("Error al eliminar paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el paciente. Intente nuevamente.'
        });
    } finally {
        window.app.hideSpinner();
        selectedPatient = null;
    }
}

// Cargar detalles de un paciente
async function loadPatientDetails(patientId) {
    try {
        window.app.showSpinner();
        
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
        
        const patientData = patientDoc.data();
        selectedPatient = {
            id: patientId,
            ...patientData
        };
        
        // Actualizar título del modal
        if (patientDetailsModalLabel) {
            patientDetailsModalLabel.textContent = `Detalles del Paciente: ${patientData.name || 'Sin nombre'}`;
        }
        
        // Actualizar campos de detalles
        updateDetailFields(patientData);
        
        // Cargar historial
        loadPatientTimeline(patientId);
        
        // Cargar documentos
        loadPatientDocuments(patientId);
        
        // Cargar notas
        if (patientNotes && patientData.notes) {
            patientNotes.value = patientData.notes;
        }
        
    } catch (error) {
        console.error("Error al cargar detalles del paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles del paciente'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Actualizar campos de detalles
function updateDetailFields(patientData) {
    // Comprobar si tenemos los campos de detalle
    if (!detailFields.name) return;
    
    // Actualizar cada campo
    detailFields.name.textContent = patientData.name || 'N/A';
    detailFields.rut.textContent = patientData.rut || 'N/A';
    
    // Formatear fecha de nacimiento
    let formattedBirthdate = 'N/A';
    if (patientData.birthdate) {
        formattedBirthdate = patientData.birthdate;
    }
    detailFields.birthdate.textContent = formattedBirthdate;
    
    detailFields.age.textContent = patientData.age || 'N/A';
    
    // Formatear género
    let formattedGender = 'N/A';
    if (patientData.gender) {
        switch (patientData.gender) {
            case 'masculino':
                formattedGender = 'Masculino';
                break;
            case 'femenino':
                formattedGender = 'Femenino';
                break;
            case 'otro':
                formattedGender = 'Otro';
                break;
            default:
                formattedGender = patientData.gender;
        }
    }
    detailFields.gender.textContent = formattedGender;
    
    detailFields.phone.textContent = patientData.phone || 'N/A';
    detailFields.email.textContent = patientData.email || 'N/A';
    
    // Formatear dirección completa
    let fullAddress = 'N/A';
    if (patientData.address) {
        fullAddress = patientData.address;
        if (patientData.city) {
            fullAddress += `, ${patientData.city}`;
        }
    }
    detailFields.address.textContent = fullAddress;
    
    detailFields.diagnosis.textContent = patientData.diagnosis || 'Sin diagnóstico';
    
    // Formatear estado
    let formattedStatus = 'No definido';
    if (patientData.status) {
        switch (patientData.status) {
            case 'active':
                formattedStatus = '<span class="badge bg-success">Activo</span>';
                break;
            case 'discharged':
                formattedStatus = '<span class="badge bg-primary">Alta</span>';
                break;
            case 'abandoned':
                formattedStatus = '<span class="badge bg-danger">Abandonó</span>';
                break;
            default:
                formattedStatus = `<span class="badge bg-secondary">${patientData.status}</span>`;
        }
    }
    detailFields.status.innerHTML = formattedStatus;
}

// Cargar historial del paciente
async function loadPatientTimeline(patientId) {
    if (!patientTimeline) return;
    
    try {
        patientTimeline.innerHTML = '<p class="text-center">Cargando historial...</p>';
        
        // Aquí iría el código para cargar evoluciones, diagnósticos, etc.
        // Para simplificar, mostraremos datos simulados
        
        let timelineHtml = '';
        
        // Verificar si hay datos en el paciente seleccionado
        if (selectedPatient) {
            // Creación
            if (selectedPatient.createdAt) {
                const creationDate = new Date(selectedPatient.createdAt.seconds * 1000);
                timelineHtml += `
                    <div class="timeline-item">
                        <div class="timeline-point timeline-point-primary">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="timeline-event">
                            <div class="timeline-heading">
                                <h6 class="mb-0">Registro del paciente</h6>
                                <small class="text-muted">${creationDate.toLocaleString()}</small>
                            </div>
                            <div class="timeline-body">
                                <p>Paciente registrado por ${selectedPatient.createdBy?.name || 'Usuario desconocido'}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Actualización
            if (selectedPatient.lastUpdate && (!selectedPatient.createdAt || 
                selectedPatient.lastUpdate.seconds !== selectedPatient.createdAt.seconds)) {
                const updateDate = new Date(selectedPatient.lastUpdate.seconds * 1000);
                timelineHtml += `
                    <div class="timeline-item">
                        <div class="timeline-point timeline-point-info">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="timeline-event">
                            <div class="timeline-heading">
                                <h6 class="mb-0">Actualización de datos</h6>
                                <small class="text-muted">${updateDate.toLocaleString()}</small>
                            </div>
                            <div class="timeline-body">
                                <p>Datos actualizados por ${selectedPatient.updatedBy?.name || 'Usuario desconocido'}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Alta
            if (selectedPatient.dischargeDate) {
                const dischargeDate = new Date(selectedPatient.dischargeDate.seconds * 1000);
                timelineHtml += `
                    <div class="timeline-item">
                        <div class="timeline-point timeline-point-success">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div class="timeline-event">
                            <div class="timeline-heading">
                                <h6 class="mb-0">Alta médica</h6>
                                <small class="text-muted">${dischargeDate.toLocaleString()}</small>
                            </div>
                            <div class="timeline-body">
                                <p>Paciente dado de alta por ${selectedPatient.dischargedBy?.name || 'Usuario desconocido'}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        if (timelineHtml === '') {
            timelineHtml = '<p class="text-center">No hay eventos en el historial</p>';
        }
        
        patientTimeline.innerHTML = timelineHtml;
        
    } catch (error) {
        console.error("Error al cargar historial del paciente:", error);
        patientTimeline.innerHTML = '<p class="text-center text-danger">Error al cargar historial</p>';
    }
}

// Cargar documentos del paciente
async function loadPatientDocuments(patientId) {
    if (!patientDocuments) return;
    
    try {
        patientDocuments.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Cargando documentos...</td>
            </tr>
        `;
        
        // Aquí iría el código para cargar documentos desde Firebase Storage
        
        // Mostrar mensaje provisional
        patientDocuments.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Esta funcionalidad requiere implementación con Firebase Storage
                </td>
            </tr>
        `;
        
    } catch (error) {
        console.error("Error al cargar documentos del paciente:", error);
        patientDocuments.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Error al cargar documentos
                </td>
            </tr>
        `;
    }
}

// Guardar notas del paciente
async function savePatientNotes() {
    if (!selectedPatient || !patientNotes) return;
    
    try {
        window.app.showSpinner();
        
        const notesText = patientNotes.value.trim();
        
        const patientRef = doc(db, "patients", selectedPatient.id);
        await updateDoc(patientRef, {
            notes: notesText,
            lastUpdate: serverTimestamp(),
            updatedBy: {
                uid: currentUser.uid,
                name: currentUser.name || currentUser.email
            }
        });
        
        Swal.fire({
            icon: 'success',
            title: 'Notas guardadas',
            text: 'Las notas se han guardado correctamente',
            timer: 2000,
            showConfirmButton: false
        });
        
    } catch (error) {
        console.error("Error al guardar notas:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron guardar las notas. Intente nuevamente.'
        });
    } finally {
        window.app.hideSpinner();
    }
}

// Exportar ficha de paciente
function exportPatientRecord(patientId) {
    Swal.fire({
        title: 'Función en desarrollo',
        text: 'La exportación de fichas individuales estará disponible próximamente',
        icon: 'info'
    });
}

// Exportar pacientes a CSV
function exportPatientsToCsv() {
    try {
        // Verificar si hay datos para exportar
        if (patientsData.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin datos',
                text: 'No hay pacientes para exportar'
            });
            return;
        }
        
        // Definir encabezados
        const headers = ['Nombre', 'RUT', 'Edad', 'Género', 'Teléfono', 'Email', 'Dirección', 'Diagnóstico', 'Estado'];
        
        // Convertir datos a formato CSV
        let csvContent = headers.join(',') + '\n';
        
        patientsData.forEach(patient => {
            const row = [
                `"${patient.name || ''}"`,
                `"${patient.rut || ''}"`,
                `"${patient.age || ''}"`,
                `"${patient.gender || ''}"`,
                `"${patient.phone || ''}"`,
                `"${patient.email || ''}"`,
                `"${patient.address || ''}"`,
                `"${patient.diagnosis || ''}"`,
                `"${patient.status || ''}"`
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        // Crear blob y descargar
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `pacientes_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error("Error al exportar a CSV:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo exportar a CSV. Intente nuevamente.'
        });
    }
}

// Exportar pacientes a PDF
function exportPatientsToPdf() {
    Swal.fire({
        title: 'Función en desarrollo',
        text: 'La exportación a PDF estará disponible próximamente',
        icon: 'info'
    });
}

// Contar total de pacientes
async function countTotalPatients() {
    try {
        // Construir query con filtros (excepto paginación)
        let patientsQuery = collection(db, "patients");
        let constraints = [];
        
        // Filtro por estado
        if (activeFilters.status) {
            constraints.push(where("status", "==", activeFilters.status));
        }
        
        // Filtro por diagnóstico
        if (activeFilters.diagnosis) {
            constraints.push(where("diagnosis", "==", activeFilters.diagnosis));
        }
        
        // Aplicar constraints
        if (constraints.length > 0) {
            patientsQuery = query(patientsQuery, ...constraints);
        }
        
        // Ejecutar consulta
        const querySnapshot = await getDocs(patientsQuery);
        
        // Filtrar manualmente por búsqueda si es necesario
        let filteredCount = querySnapshot.size;
        
        if (activeFilters.search) {
            filteredCount = 0;
            const searchLower = activeFilters.search.toLowerCase();
            
            querySnapshot.forEach((doc) => {
                const patient = doc.data();
                const nameMatch = patient.name && patient.name.toLowerCase().includes(searchLower);
                const rutMatch = patient.rut && patient.rut.toLowerCase().includes(searchLower);
                const phoneMatch = patient.phone && patient.phone.includes(searchLower);
                
                if (nameMatch || rutMatch || phoneMatch) {
                    filteredCount++;
                }
            });
        }
        
        totalPatients = filteredCount;
        
        // Actualizar UI
        if (totalRecordsSpan) {
            totalRecordsSpan.textContent = totalPatients;
        }
        
    } catch (error) {
        console.error("Error al contar pacientes:", error);
    }
}

// Actualizar controles de paginación
function updatePaginationControls() {
    if (!prevPageBtn || !nextPageBtn) return;
    
    // Deshabilitar botón anterior si estamos en la primera página
    if (currentPage <= 1) {
        prevPageBtn.parentElement.classList.add('disabled');
    } else {
        prevPageBtn.parentElement.classList.remove('disabled');
    }
    
    // Deshabilitar botón siguiente si no hay más resultados
    if (!lastVisible || patientsData.length < recordsPerPage) {
        nextPageBtn.parentElement.classList.add('disabled');
    } else {
        nextPageBtn.parentElement.classList.remove('disabled');
    }
    
    // Actualizar página actual
    const pageItems = document.querySelectorAll('.pagination .page-item:not(:first-child):not(:last-child)');
    pageItems.forEach(item => item.remove());
    
    const pageItem = document.createElement('li');
    pageItem.className = 'page-item active';
    pageItem.innerHTML = `<a class="page-link" href="#">${currentPage}</a>`;
    
    nextPageBtn.parentElement.parentElement.insertBefore(pageItem, nextPageBtn.parentElement);
}

// Resetear filtros
function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (filterDiagnosis) filterDiagnosis.value = '';
    if (filterStatus) filterStatus.value = '';
    
    activeFilters = {
        search: '',
        diagnosis: '',
        status: ''
    };
    
    resetPagination();
    loadPatients();
}

// Resetear paginación
function resetPagination() {
    currentPage = 1;
    lastVisible = null;
}

// Abrir detalles de un paciente
async function openPatientDetails(patientId) {
    try {
        // Mostrar spinning
        window.app.showSpinner();
        
        // Verificar si el paciente existe
        const patientRef = doc(db, "patients", patientId);
        const patientDoc = await getDoc(patientRef);
        
        if (!patientDoc.exists()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Paciente no encontrado'
            });
            window.app.hideSpinner();
            return;
        }
        
        // Abrir modal de detalles
        loadPatientDetails(patientId);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(patientDetailsModal);
        modal.show();
        
    } catch (error) {
        console.error("Error al abrir detalles del paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles del paciente'
        });
        window.app.hideSpinner();
    }
}

// Exportar funciones públicas
export {
    loadPatients,
    resetFilters,
    openPatientDetails
};
