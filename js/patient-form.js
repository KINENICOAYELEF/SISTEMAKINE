// Funcionalidad para el formulario de pacientes
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando formulario de pacientes...');

    // Configurar botones principales
    setupMainButtons();
    
    // Configurar cálculos automáticos
    setupCalculations();
    
    // Configurar validaciones
    setupValidations();
});

// Configurar botones principales (guardar y limpiar formulario)
function setupMainButtons() {
    // Botón de guardar paciente
    const saveButton = document.getElementById('save-patient-btn');
    if (saveButton) {
        console.log('Botón de guardar configurado');
        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            savePatientData();
        });
    } else {
        console.warn('No se encontró el botón de guardar paciente');
    }
    
    // Botón de limpiar formulario
    const resetButton = document.getElementById('reset-form-btn');
    if (resetButton) {
        console.log('Botón de limpiar configurado');
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            resetForm();
        });
    }
}

// Guardar datos del paciente
function savePatientData() {
    console.log('Intentando guardar datos del paciente...');
    
    // Validar el formulario
    if (!validateForm()) {
        console.log('Validación fallida');
        return;
    }
    
    // Mostrar mensaje de espera
    Swal.fire({
        title: 'Guardando...',
        text: 'Procesando los datos del paciente',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Simular proceso de guardado (reemplaza esto con tu lógica real de Firebase)
    setTimeout(() => {
        // Simular éxito
        Swal.fire({
            title: '¡Guardado!',
            text: 'Los datos del paciente han sido guardados correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
        
        // Opcional: resetear el formulario después de guardar
        // resetForm();
    }, 1500);
}

// Validar formulario
function validateForm() {
    let isValid = true;
    
    // Validar campos obligatorios
    const requiredFields = [
        'therapist-name',
        'evaluation-date',
        'patient-name',
        'patient-rut',
        'patient-birthdate',
        'patient-gender',
        'consultation-reason'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && (field.value === '' || field.value === null)) {
            // Marcar campo como inválido
            field.classList.add('is-invalid');
            isValid = false;
            
            // Si no existe ya un mensaje de error, añadirlo
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                const feedback = document.createElement('div');
                feedback.classList.add('invalid-feedback');
                feedback.textContent = 'Este campo es obligatorio';
                field.parentNode.insertBefore(feedback, field.nextSibling);
            }
        } else if (field) {
            field.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        Swal.fire({
            title: 'Formulario incompleto',
            text: 'Por favor complete todos los campos obligatorios',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    }
    
    return isValid;
}

// Limpiar formulario
function resetForm() {
    console.log('Limpiando formulario...');
    
    Swal.fire({
        title: '¿Está seguro?',
        text: "Se perderán todos los datos no guardados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar todos los campos
            document.querySelectorAll('input:not([readonly]), select, textarea').forEach(field => {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = false;
                } else {
                    field.value = '';
                }
                field.classList.remove('is-invalid');
            });
            
            // Eliminar mensajes de error
            document.querySelectorAll('.invalid-feedback').forEach(feedback => {
                feedback.remove();
            });
            
            Swal.fire(
                '¡Limpiado!',
                'El formulario ha sido restablecido.',
                'success'
            );
        }
    });
}

// Configurar cálculos automáticos
function setupCalculations() {
    // Calcular edad automáticamente
    const birthdateInput = document.getElementById('patient-birthdate');
    const ageInput = document.getElementById('patient-age');
    
    if (birthdateInput && ageInput) {
        console.log('Configurando cálculo automático de edad');
        birthdateInput.addEventListener('change', function() {
            if (this.value) {
                const birthdate = new Date(this.value);
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
        console.log('Configurando cálculo automático de IMC');
        
        const calculateIMC = function() {
            if (weightInput.value && heightInput.value) {
                const weight = parseFloat(weightInput.value);
                const height = parseFloat(heightInput.value) / 100; // convertir a metros
                const imc = weight / (height * height);
                imcInput.value = imc.toFixed(2);
                
                // Clasificación IMC
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

// Configurar validaciones
function setupValidations() {
    // Validación RUT
    const rutInput = document.getElementById('patient-rut');
    if (rutInput) {
        console.log('Configurando validación de RUT');
        rutInput.addEventListener('blur', function() {
            // Aquí puedes agregar la validación de formato RUT chileno
            // Por simplicidad, solo verificamos que tenga el formato XX.XXX.XXX-X o sin puntos
            const rutValue = this.value.trim();
            const rutPattern = /^(\d{1,2}\.?\d{3}\.?\d{3}[-][0-9kK]{1})$/;
            
            if (rutValue && !rutPattern.test(rutValue)) {
                this.classList.add('is-invalid');
                // Añadir mensaje de error si no existe
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.classList.add('invalid-feedback');
                    feedback.textContent = 'Formato de RUT inválido (Ej: 12.345.678-9)';
                    this.parentNode.insertBefore(feedback, this.nextSibling);
                }
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }
    
    // Validación Email
    const emailInput = document.getElementById('patient-email');
    if (emailInput) {
        console.log('Configurando validación de Email');
        emailInput.addEventListener('blur', function() {
            const emailValue = this.value.trim();
            if (emailValue) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailValue)) {
                    this.classList.add('is-invalid');
                    // Añadir mensaje de error si no existe
                    if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
                        const feedback = document.createElement('div');
                        feedback.classList.add('invalid-feedback');
                        feedback.textContent = 'Formato de correo electrónico inválido';
                        this.parentNode.insertBefore(feedback, this.nextSibling);
                    }
                } else {
                    this.classList.remove('is-invalid');
                }
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }
}
