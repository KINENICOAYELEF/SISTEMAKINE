// Archivo principal de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log("Aplicación inicializada");
    
    // Inicializar los botones de acción rápida
    initActionButtons();
    
    // Cargar datos iniciales
    loadInitialData();
});

// Función para inicializar los botones
function initActionButtons() {
    // Botón Nuevo Paciente
    const btnNuevoPaciente = document.querySelector('.btn-nuevo-paciente');
    if (btnNuevoPaciente) {
        btnNuevoPaciente.addEventListener('click', function() {
            window.location.href = 'modules/patient-form.html';
        });
    }
    
    // Botón Ver Pacientes
    const btnVerPacientes = document.querySelector('.btn-ver-pacientes');
    if (btnVerPacientes) {
        btnVerPacientes.addEventListener('click', function() {
            window.location.href = 'modules/records.html';
        });
    }
    
    // Botón Diagnóstico
    const btnDiagnostico = document.querySelector('.btn-diagnostico');
    if (btnDiagnostico) {
        btnDiagnostico.addEventListener('click', function() {
            window.location.href = 'modules/diagnosis.html';
        });
    }
    
    // Botón Evoluciones
    const btnEvoluciones = document.querySelector('.btn-evoluciones');
    if (btnEvoluciones) {
        btnEvoluciones.addEventListener('click', function() {
            window.location.href = 'modules/evolution.html';
        });
    }
    
    // Enlaces del menú lateral
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
}

// Función para cargar datos iniciales
function loadInitialData() {
    // Intentar cargar contadores
    try {
        // Simular carga de datos (en producción sería desde Firebase)
        setTimeout(() => {
            const pacientesTotales = document.querySelector('.pacientes-totales');
            const pacientesActivos = document.querySelector('.pacientes-activos');
            
            if (pacientesTotales) {
                pacientesTotales.textContent = '12';
            }
            
            if (pacientesActivos) {
                pacientesActivos.textContent = '8';
            }
            
            // Ocultar mensajes de carga
            document.querySelectorAll('.cargando-mensaje').forEach(el => {
                el.style.display = 'none';
            });
        }, 1000);
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
    }
}
