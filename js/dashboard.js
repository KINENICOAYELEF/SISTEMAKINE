// Dashboard principal y gestión de módulos
import { auth, db } from './firebase-config.js';
import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    getDocs, 
    where, 
    doc, 
    getDoc, 
    onSnapshot, 
    Timestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Estado global
let activePatient = null;
let currentUser = null;

// Elementos DOM
const mainContent = document.getElementById('main-content');
const welcomeDashboard = document.getElementById('welcome-dashboard');
const userNameElement = document.getElementById('user-name');
const totalPatientsElement = document.getElementById('total-patients');
const activePatientsElement = document.getElementById('active-patients');
const recentPatientsListElement = document.getElementById('recent-patients-list');
const currentPatientInfoElement = document.getElementById('current-patient-info');
const activePatientNameElement = document.getElementById('active-patient-name');
const clearPatientBtn = document.getElementById('clear-patient-btn');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarToggleTop = document.getElementById('sidebarToggleTop');
const sidebar = document.querySelector('.sidebar');
const contentWrapper = document.getElementById('content-wrapper');
const scrollToTop = document.querySelector('.scroll-to-top');
const loadingSpinner = document.getElementById('loading-spinner');

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos del usuario actual
    loadCurrentUser();
    
    // Configurar navegación
    setupNavigation();
    
    // Cargar estadísticas iniciales
    loadDashboardStats();
    
    // Cargar pacientes recientes
    loadRecentPatients();
    
    // Configurar manejo de paciente activo
    setupActivePatientHandling();
});

// Cargar datos del usuario actual
function loadCurrentUser() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
        currentUser = userData;
        userNameElement.textContent = userData.name || userData.email;
    }
}

// Configurar navegación
function setupNavigation() {
    // Manejo de links de navegación
    document.querySelectorAll('[data-module]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadModule(link.getAttribute('data-module'));
        });
    });
    
    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('toggled');
            contentWrapper.classList.toggle('sidebar-toggled');
        });
    }
    
    if (sidebarToggleTop) {
        sidebarToggleTop.addEventListener('click', () => {
            sidebar.classList.toggle('toggled');
        });
    }
    
    // Scroll to top
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollToTop.style.display = 'block';
        } else {
            scrollToTop.style.display = 'none';
        }
    });
    
    scrollToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Cargar estadísticas del dashboard
async function loadDashboardStats() {
    try {
        // Contar total de pacientes
        const patientsQuery = query(collection(db, "patients"));
        const patientsSnapshot = await getDocs(patientsQuery);
        totalPatientsElement.textContent = patientsSnapshot.size;
        
        // Contar pacientes activos (con tratamiento en curso)
        const activeQuery = query(
            collection(db, "patients"), 
            where("status", "==", "active")
        );
        const activeSnapshot = await getDocs(activeQuery);
        activePatientsElement.textContent = activeSnapshot.size;
        
    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        totalPatientsElement.textContent = "Error";
        activePatientsElement.textContent = "Error";
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las estadísticas'
        });
    }
}

// Cargar pacientes recientes
async function loadRecentPatients() {
    try {
        const recentQuery = query(
            collection(db, "patients"),
            orderBy("lastUpdate", "desc"),
            limit(5)
        );
        
        const snapshot = await getDocs(recentQuery);
        
        if (snapshot.empty) {
            recentPatientsListElement.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No hay pacientes registrados</td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const patient = doc.data();
            const lastUpdateDate = patient.lastUpdate ? 
                new Date(patient.lastUpdate.seconds * 1000).toLocaleDateString() : 
                'N/A';
            
            html += `
                <tr>
                    <td>${patient.name || 'Sin nombre'}</td>
                    <td>${patient.diagnosis || 'Sin diagnóstico'}</td>
                    <td>${lastUpdateDate}</td>
                    <td>
                        <button class="btn btn-sm btn-primary select-patient" data-id="${doc.id}">
                            <i class="fas fa-user-check"></i>
                        </button>
                        <button class="btn btn-sm btn-info view-patient" data-id="${doc.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        recentPatientsListElement.innerHTML = html;
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.select-patient').forEach(btn => {
            btn.addEventListener('click', async () => {
                const patientId = btn.getAttribute('data-id');
                await selectActivePatient(patientId);
            });
        });
        
        document.querySelectorAll('.view-patient').forEach(btn => {
            btn.addEventListener('click', () => {
                const patientId = btn.getAttribute('data-id');
                loadModule('records', { patientId: patientId });
            });
        });
    } catch (error) {
        console.error("Error al cargar pacientes recientes:", error);
        recentPatientsListElement.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">Error al cargar pacientes</td>
            </tr>
        `;
    }
}

// Configurar manejo de paciente activo
function setupActivePatientHandling() {
    // Restablecer paciente activo desde localStorage si existe
    const storedPatient = localStorage.getItem('activePatient');
    if (storedPatient) {
        activePatient = JSON.parse(storedPatient);
        updateActivePatientUI();
    }
    
    // Botón para limpiar paciente activo
    if (clearPatientBtn) {
        clearPatientBtn.addEventListener('click', clearActivePatient);
    }
}

// Seleccionar paciente activo
async function selectActivePatient(patientId) {
    try {
        showSpinner();
        
        const patientDoc = await getDoc(doc(db, "patients", patientId));
        
        if (!patientDoc.exists()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Paciente no encontrado'
            });
            return;
        }
        
        const patientData = patientDoc.data();
        activePatient = {
            id: patientId,
            name: patientData.name,
            diagnosis: patientData.diagnosis,
            ...patientData
        };
        
        // Guardar en localStorage
        localStorage.setItem('activePatient', JSON.stringify(activePatient));
        
        // Actualizar UI
        updateActivePatientUI();
        
        Swal.fire({
            icon: 'success',
            title: 'Paciente seleccionado',
            text: `${patientData.name} es ahora el paciente activo`,
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Error al seleccionar paciente:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo seleccionar el paciente'
        });
    } finally {
        hideSpinner();
    }
}

// Limpiar paciente activo
function clearActivePatient() {
    activePatient = null;
    localStorage.removeItem('activePatient');
    currentPatientInfoElement.classList.add('d-none');
    
    Swal.fire({
        icon: 'info',
        title: 'Paciente desactivado',
        text: 'Ya no hay un paciente activo',
        timer: 1500,
        showConfirmButton: false
    });
}

// Actualizar UI con paciente activo
function updateActivePatientUI() {
    if (activePatient) {
        activePatientNameElement.textContent = activePatient.name;
        currentPatientInfoElement.classList.remove('d-none');
    } else {
        currentPatientInfoElement.classList.add('d-none');
    }
}

// Cargar módulo específico
async function loadModule(moduleName, params = {}) {
    try {
        showSpinner();
        
        // Verificar si el módulo requiere paciente activo
        const modulesRequiringPatient = ['diagnosis', 'treatment', 'evolution'];
        if (modulesRequiringPatient.includes(moduleName) && !activePatient) {
            Swal.fire({
                icon: 'warning',
                title: 'Paciente requerido',
                text: 'Debes seleccionar un paciente primero',
                confirmButtonText: 'Seleccionar paciente'
            }).then((result) => {
                if (result.isConfirmed) {
                    loadModule('records');
                }
            });
            hideSpinner();
            return;
        }
        
        // Cargar el HTML del módulo
        const response = await fetch(`modules/${moduleName}.html`);
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar el módulo: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Ocultar dashboard de bienvenida
        welcomeDashboard.classList.add('d-none');
        
        // Agregar contenido del módulo
        const moduleContainer = document.createElement('div');
        moduleContainer.className = 'col-12 module-container';
        moduleContainer.id = `${moduleName}-module`;
        moduleContainer.innerHTML = html;
        
        // Reemplazar contenido anterior
        const existingModule = document.querySelector('.module-container');
        if (existingModule) {
            mainContent.replaceChild(moduleContainer, existingModule);
        } else {
            mainContent.appendChild(moduleContainer);
        }
        
        // Cargar script del módulo si existe
        loadModuleScript(moduleName, params);
        
        // Actualizar navegación activa
        updateActiveNavigation(moduleName);
        
    } catch (error) {
        console.error(`Error al cargar módulo ${moduleName}:`, error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo cargar el módulo ${moduleName}`
        });
    } finally {
        hideSpinner();
    }
}

// Cargar script específico del módulo
function loadModuleScript(moduleName, params) {
    const scriptMapping = {
        'patient-form': 'forms.js',
        'records': 'patients.js',
        'diagnosis': 'diagnosis.js',
        'treatment': 'treatment.js',
        'evolution': 'evolution.js',
        'analysis': 'dashboard.js'
    };
    
    if (scriptMapping[moduleName]) {
        // Crear un evento personalizado para notificar que el módulo está listo
        const moduleReadyEvent = new CustomEvent('moduleReady', {
            detail: {
                module: moduleName,
                params: params,
                activePatient: activePatient
            }
        });
        
        // Disparar el evento para que lo escuche el script del módulo
        document.dispatchEvent(moduleReadyEvent);
    }
}

// Actualizar navegación activa en el sidebar
function updateActiveNavigation(moduleName) {
    // Quitar clase active de todos los items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al item correspondiente
    const navLink = document.querySelector(`.nav-link[data-module="${moduleName}"]`);
    if (navLink) {
        navLink.closest('.nav-item').classList.add('active');
    }
}

// Mostrar spinner de carga
function showSpinner() {
    if (loadingSpinner) {
        loadingSpinner.classList.remove('d-none');
    }
}

// Ocultar spinner de carga
function hideSpinner() {
    if (loadingSpinner) {
        loadingSpinner.classList.add('d-none');
    }
}

// Funciones de utilidad para acceso global
window.app = {
    getActivePatient: () => activePatient,
    setActivePatient: selectActivePatient,
    clearActivePatient: clearActivePatient,
    showSpinner: showSpinner,
    hideSpinner: hideSpinner,
    loadModule: loadModule,
    getCurrentUser: () => currentUser
};

// Exportar funciones útiles para otros módulos
export {
    loadModule,
    selectActivePatient,
    clearActivePatient,
    getActivePatient: () => activePatient,
    getCurrentUser: () => currentUser,
    showSpinner,
    hideSpinner
};
// Función para cargar el sidebar
export async function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;
    
    // Obtener la página actual
    const currentPage = window.location.pathname.split('/').pop();
    
    sidebarContainer.innerHTML = `
        <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div class="sidebar-sticky pt-3">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'dashboard.html' ? 'active' : ''}" href="../dashboard.html">
                            <i class="fas fa-home"></i> Inicio
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'patient-form.html' ? 'active' : ''}" href="patient-form.html">
                            <i class="fas fa-user-plus"></i> Formulario de Ingreso
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'records.html' ? 'active' : ''}" href="records.html">
                            <i class="fas fa-users"></i> Pacientes
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'diagnosis.html' ? 'active' : ''}" href="diagnosis.html">
                            <i class="fas fa-stethoscope"></i> Diagnóstico
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'treatment.html' ? 'active' : ''}" href="treatment.html">
                            <i class="fas fa-clipboard-list"></i> Plan de Tratamiento
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'evolution.html' ? 'active' : ''}" href="evolution.html">
                            <i class="fas fa-chart-line"></i> Evoluciones
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'dashboard-analysis.html' ? 'active' : ''}" href="dashboard-analysis.html">
                            <i class="fas fa-chart-bar"></i> Dashboard y Análisis
                        </a>
                    </li>
                </ul>
                
                <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                    <span>Paciente Actual</span>
                </h6>
                <div id="current-patient-info" class="px-3 py-2">
                    <div class="text-muted small" id="no-patient-selected">
                        <i class="fas fa-info-circle"></i> Ningún paciente seleccionado
                    </div>
                    <div class="d-none" id="patient-selected">
                        <div id="patient-name" class="font-weight-bold"></div>
                        <div id="patient-details" class="small text-muted"></div>
                        <button class="btn btn-sm btn-outline-secondary mt-2" id="change-patient-btn">
                            <i class="fas fa-exchange-alt"></i> Cambiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Verificar si hay un paciente seleccionado
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
        document.getElementById('no-patient-selected').classList.add('d-none');
        document.getElementById('patient-selected').classList.remove('d-none');
        document.getElementById('patient-name').textContent = `${currentPatient.firstName} ${currentPatient.lastName}`;
        document.getElementById('patient-details').textContent = `RUT: ${currentPatient.rut || 'N/A'}`;
        
        // Evento para cambiar paciente
        document.getElementById('change-patient-btn').addEventListener('click', () => {
            window.location.href = 'records.html'; // Redirigir a la página de pacientes
        });
    }
}

// Función para obtener el paciente actual
export function getCurrentPatient() {
    const patientString = localStorage.getItem('currentPatient');
    return patientString ? JSON.parse(patientString) : null;
}

// Función para establecer el paciente actual
export function setCurrentPatient(patient) {
    localStorage.setItem('currentPatient', JSON.stringify(patient));
}

// Función para mostrar banner de información del paciente
export function displayPatientBanner(patient, container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="patient-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="ms-2">
                <div class="patient-name">${patient.firstName} ${patient.lastName}</div>
                <div class="patient-info">
                    <span class="badge bg-secondary">${patient.gender || 'N/A'}</span>
                    <span class="badge bg-light text-dark">${patient.age || 'N/A'} años</span>
                    <span class="badge bg-light text-dark">RUT: ${patient.rut || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
}

// Otras funciones comunes para el dashboard pueden agregarse aquí
