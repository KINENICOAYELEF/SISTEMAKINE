// Archivo main.js para manejo de eventos globales
document.addEventListener('DOMContentLoaded', function() {
    // Prevenir comportamiento default de enlaces con #
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Enlace interceptado:', this.textContent);
        });
    });

    // Agregar manejadores a los botones de acciones rápidas
    const btnNuevoPaciente = document.querySelector('button[id="btnNuevoPaciente"], a[id="btnNuevoPaciente"]');
    if (btnNuevoPaciente) {
        btnNuevoPaciente.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './modules/patient-form.html';
        });
    }

    const btnVerPacientes = document.querySelector('button[id="btnVerPacientes"], a[id="btnVerPacientes"]');
    if (btnVerPacientes) {
        btnVerPacientes.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './modules/records.html';
        });
    }

    const btnDiagnostico = document.querySelector('button[id="btnDiagnostico"], a[id="btnDiagnostico"]');
    if (btnDiagnostico) {
        btnDiagnostico.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './modules/diagnosis.html';
        });
    }

    const btnEvoluciones = document.querySelector('button[id="btnEvoluciones"], a[id="btnEvoluciones"]');
    if (btnEvoluciones) {
        btnEvoluciones.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './modules/evolution.html';
        });
    }

    // Cargar datos de pacientes y otros datos iniciales
    cargarDatosIniciales();

    console.log('Eventos inicializados correctamente');
});

// Función para cargar datos iniciales
function cargarDatosIniciales() {
    // Intentar cargar contador de pacientes
    try {
        const pacientesTotalesElement = document.getElementById('pacientesTotales');
        const pacientesActivosElement = document.getElementById('pacientesActivos');
        
        if (pacientesTotalesElement && pacientesActivosElement) {
            // En un sistema real, aquí cargarías datos desde Firebase
            setTimeout(() => {
                pacientesTotalesElement.textContent = '12';
                pacientesActivosElement.textContent = '8';
            }, 1000);
        }
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
    }
}
