// Configuración inicial y variables globales
let currentUser = null;
let isAdmin = false;
let appointments = [];
let currentWeek = new Date();
let currentView = 'week';
let editingAppointmentId = null;
let holidays = [];

// Elementos DOM frecuentemente usados
const appointmentGrid = document.getElementById('appointment-grid');
const appointmentForm = document.getElementById('appointment-form');
const currentWeekDisplay = document.getElementById('current-week');
const attendanceModal = document.getElementById('attendance-modal');

// Al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            checkUserRole();
            loadHolidays();
            initializeAgenda();
            setupEventListeners();
        } else {
            // Si no está autenticado, permitir acceso de solo lectura
            isAdmin = false;
            document.body.classList.add('student-view');
            loadHolidays();
            initializeAgenda();
            setupEventListeners();
        }
    });
});

// Verificar el rol del usuario (admin o estudiante)
function checkUserRole() {
    const db = firebase.firestore();
    db.collection('usuarios').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists && doc.data().rol === 'admin') {
                isAdmin = true;
            } else {
                isAdmin = false;
                document.body.classList.add('student-view');
            }
        })
        .catch((error) => {
            console.error("Error al verificar rol de usuario:", error);
            isAdmin = false;
            document.body.classList.add('student-view');
        });
}

// Cargar feriados chilenos
function loadHolidays() {
    // Feriados chilenos de 2025
    holidays = [
        { date: '2025-01-01', name: 'Año Nuevo' },
        { date: '2025-04-18', name: 'Viernes Santo' },
        { date: '2025-04-19', name: 'Sábado Santo' },
        { date: '2025-05-01', name: 'Día del Trabajo' },
        { date: '2025-05-21', name: 'Día de las Glorias Navales' },
        { date: '2025-06-29', name: 'San Pedro y San Pablo' },
        { date: '2025-07-16', name: 'Virgen del Carmen' },
        { date: '2025-08-15', name: 'Asunción de la Virgen' },
        { date: '2025-09-18', name: 'Independencia Nacional' },
        { date: '2025-09-19', name: 'Día de las Glorias del Ejército' },
        { date: '2025-10-12', name: 'Encuentro de Dos Mundos' },
        { date: '2025-10-31', name: 'Día de las Iglesias Evangélicas' },
        { date: '2025-11-01', name: 'Día de Todos los Santos' },
        { date: '2025-12-08', name: 'Inmaculada Concepción' },
        { date: '2025-12-25', name: 'Navidad' }
    ];
}

// Inicializar la agenda
function initializeAgenda() {
    updateWeekDisplay();
    generateAppointmentGrid();
    loadAppointments();
    updateStatistics();
}

// Actualizar la visualización de la semana actual
function updateWeekDisplay() {
    const startOfWeek = getStartOfWeek(currentWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const startDateStr = startOfWeek.toLocaleDateString('es-CL', options);
    const endDateStr = endOfWeek.toLocaleDateString('es-CL', options);
    
    currentWeekDisplay.textContent = `Semana del ${startDateStr} al ${endDateStr}`;
}

// Obtener el primer día de la semana (lunes)
function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajusta cuando el día es domingo
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
}

// Generar la cuadrícula de citas
function generateAppointmentGrid() {
    appointmentGrid.innerHTML = '';
    
    const startOfWeek = getStartOfWeek(currentWeek);
    const therapists = ['nicolas', 'ana-maria', 'gustavo'];
    
    // Crear celdas para cada terapeuta y hora
    for (let hourIndex = 0; hourIndex < 8; hourIndex++) {
        const hour = hourIndex + 9; // Empezamos a las 9:00
        
        for (let therapistIndex = 0; therapistIndex < therapists.length; therapistIndex++) {
            // Para cada día de la semana
            for (let day = 0; day < 5; day++) { // Solo días laborables (lunes a viernes)
                if (currentView === 'week' || (currentView === 'day' && day === currentWeek.getDay() - 1)) {
                    const currentDate = new Date(startOfWeek);
                    currentDate.setDate(startOfWeek.getDate() + day);
                    
                    const dateStr = formatDate(currentDate);
                    const isHoliday = holidays.some(h => h.date === dateStr);
                    
                    const cell = document.createElement('div');
                    cell.className = `appointment-cell${isHoliday ? ' holiday' : ''}`;
                    cell.dataset.date = dateStr;
                    cell.dataset.hour = hour;
                    cell.dataset.therapist = therapists[therapistIndex];
                    
                    if (isAdmin && !isHoliday) {
                        cell.addEventListener('click', () => handleCellClick(dateStr, hour, therapists[therapistIndex]));
                    }
                    
                    appointmentGrid.appendChild(cell);
                }
            }
        }
    }
}

// Manejar el clic en una celda
function handleCellClick(date, hour, therapist) {
    // Llenar el formulario con la fecha y hora seleccionadas
    const dateInput = document.getElementById('appointment-date');
    const timeInput = document.getElementById('appointment-time');
    const therapistInput = document.getElementById('therapist');
    
    dateInput.value = date;
    timeInput.value = `${hour.toString().padStart(2, '0')}:00`;
    therapistInput.value = therapist;
    
    // Resetear el modo de edición
    editingAppointmentId = null;
    appointmentForm.reset();
    document.getElementById('cancel-edit').style.display = 'none';
    
    // Enfocar el campo de nombre del paciente
    document.getElementById('patient-name').focus();
}

// Formatear fecha como YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Cargar citas desde Firestore
function loadAppointments() {
    const db = firebase.firestore();
    const startOfWeek = getStartOfWeek(currentWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    // Convertir a objetos Firestore Timestamp
    const startTimestamp = firebase.firestore.Timestamp.fromDate(startOfWeek);
    const endTimestamp = firebase.firestore.Timestamp.fromDate(endOfWeek);
    
    db.collection('citas')
        .where('fecha', '>=', startTimestamp)
        .where('fecha', '<', endTimestamp)
        .get()
        .then((querySnapshot) => {
            appointments = [];
            querySnapshot.forEach((doc) => {
                const appointment = {
                    id: doc.id,
                    ...doc.data(),
                    fecha: doc.data().fecha.toDate()
                };
                appointments.push(appointment);
            });
            renderAppointments();
            updateStatistics();
        })
        .catch((error) => {
            console.error("Error cargando citas:", error);
            // Cargar datos de ejemplo para demostración
            loadSampleAppointments();
        });
}

// Cargar citas de ejemplo para demostración
function loadSampleAppointments() {
    const startOfWeek = getStartOfWeek(currentWeek);
    
    const sampleAppointments = [
        {
            id: '1',
            paciente: 'María González',
            tipo: 'Consulta especializada',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 9, 0), // Lunes 9:00
            duracion: 120, // 2 horas
            terapeuta: 'nicolas',
            web: true
        },
        {
            id: '2',
            paciente: 'Isabel Rodríguez',
            tipo: 'Consulta general',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 10, 0), // Lunes 10:00
            duracion: 120, // 2 horas
            terapeuta: 'ana-maria'
        },
        {
            id: '3',
            paciente: 'Ana Martínez',
            tipo: 'Consulta general',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 11, 0), // Lunes 11:00
            duracion: 60, // 1 hora
            terapeuta: 'nicolas'
        },
        {
            id: '4',
            paciente: 'Carolina García',
            tipo: 'Consulta dermatologia',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 12, 0), // Lunes 12:00
            duracion: 120, // 2 horas
            terapeuta: 'ana-maria'
        },
        {
            id: '5',
            paciente: 'Laura Pérez',
            tipo: 'Examen cardiologico',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 13, 0), // Lunes 13:00
            duracion: 120, // 2 horas
            terapeuta: 'nicolas',
            web: true
        },
        {
            id: '6',
            paciente: 'Julia López',
            tipo: 'Consulta general',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 14, 0), // Lunes 14:00
            duracion: 60, // 1 hora
            terapeuta: 'ana-maria',
            web: true
        },
        {
            id: '7',
            paciente: 'Beatriz Sánchez',
            tipo: 'Consulta general',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 15, 0), // Lunes 15:00
            duracion: 60, // 1 hora
            terapeuta: 'gustavo'
        },
        {
            id: '8',
            paciente: 'Elena Castro',
            tipo: 'Evaluacion fisica',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 9, 0), // Lunes 9:00
            duracion: 120, // 2 horas
            terapeuta: 'gustavo'
        },
        {
            id: '9',
            paciente: 'Sandra Díaz',
            tipo: 'Evaluacion fisica',
            fecha: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate(), 11, 0), // Lunes 11:00
            duracion: 120, // 2 horas
            terapeuta: 'gustavo'
        }
    ];
    
    appointments = sampleAppointments;
    renderAppointments();
    updateStatistics();
}

// Renderizar citas en la cuadrícula
function renderAppointments() {
    // Limpiar citas anteriores
    const existingAppointments = document.querySelectorAll('.appointment');
    existingAppointments.forEach(el => el.remove());
    
    // Renderizar cada cita
    appointments.forEach(appointment => {
        const date = formatDate(appointment.fecha);
        const startHour = appointment.fecha.getHours();
        const terapeuta = appointment.terapeuta;
        const duration = appointment.duracion || 60; // Duración en minutos
        const durationInHours = duration / 60;
        
        // Encontrar la celda correcta
        const cells = document.querySelectorAll('.appointment-cell');
        let targetCell = null;
        
        for (const cell of cells) {
            if (cell.dataset.date === date && 
                parseInt(cell.dataset.hour) === startHour && 
                cell.dataset.therapist === terapeuta) {
                targetCell = cell;
                break;
            }
        }
        
        if (targetCell) {
            // Crear elemento de cita
            const appointmentEl = document.createElement('div');
            appointmentEl.className = `appointment ${appointment.tipo.replace(/\s+/g, '-').toLowerCase()}`;
            appointmentEl.dataset.id = appointment.id;
            appointmentEl.style.height = `${durationInHours * 60}px`;
            
            // Contenido de la cita
            const nameEl = document.createElement('div');
            nameEl.className = 'patient-name';
            nameEl.textContent = appointment.paciente;
            
            const typeEl = document.createElement('div');
            typeEl.className = 'appointment-type';
            typeEl.textContent = appointment.tipo;
            
            const timeEl = document.createElement('div');
            timeEl.className = 'appointment-time';
            timeEl.textContent = `${startHour.toString().padStart(2, '0')}:00 - ${(startHour + durationInHours).toString().padStart(2, '0')}:00`;
            
            // Indicador de estado
            const statusEl = document.createElement('div');
            statusEl.className = `appointment-status ${appointment.estado || ''}`;
            
            // Indicador de web
            if (appointment.web) {
                const webEl = document.createElement('div');
                webEl.className = 'web-indicator';
                webEl.innerHTML = '<i class="fas fa-globe"></i>';
                appointmentEl.appendChild(webEl);
            }
            
            // Agregar elementos a la cita
            appointmentEl.appendChild(nameEl);
            appointmentEl.appendChild(typeEl);
            appointmentEl.appendChild(timeEl);
            appointmentEl.appendChild(statusEl);
            
            // Evento de clic para editar o marcar asistencia
            appointmentEl.addEventListener('click', (event) => {
                event.stopPropagation();
                handleAppointmentClick(appointment);
            });
            
            // Hacer que las citas sean arrastrables si el usuario es admin
            if (isAdmin) {
                appointmentEl.setAttribute('draggable', 'true');
                appointmentEl.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('text/plain', appointment.id);
                });
            }
            
            // Agregar a la celda
            targetCell.appendChild(appointmentEl);
        }
    });
    
    // Hacer que las celdas puedan recibir elementos arrastrados
    if (isAdmin) {
        const cells = document.querySelectorAll('.appointment-cell:not(.holiday)');
        cells.forEach(cell => {
            cell.addEventListener('dragover', (event) => {
                event.preventDefault();
                cell.classList.add('drag-over');
            });
            
            cell.addEventListener('dragleave', () => {
                cell.classList.remove('drag-over');
            });
            
            cell.addEventListener('drop', (event) => {
                event.preventDefault();
                cell.classList.remove('drag-over');
                
                const appointmentId = event.dataTransfer.getData('text/plain');
                const date = cell.dataset.date;
                const hour = parseInt(cell.dataset.hour);
                const therapist = cell.dataset.therapist;
                
                moveAppointment(appointmentId, date, hour, therapist);
            });
        });
    }
}

// Mover una cita a una nueva fecha/hora/terapeuta
function moveAppointment(appointmentId, date, hour, therapist) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    // Crear nueva fecha a partir de la actual
    const [year, month, day] = date.split('-');
    const newDate = new Date(year, month - 1, day, hour, 0);
    
    // Actualizar la cita en Firestore
    const db = firebase.firestore();
    
    db.collection('citas').doc(appointmentId).update({
        fecha: firebase.firestore.Timestamp.fromDate(newDate),
        terapeuta: therapist
    })
    .then(() => {
        console.log("Cita movida correctamente");
        loadAppointments();
    })
    .catch((error) => {
        console.error("Error moviendo cita:", error);
        
        // Actualizar localmente para demostración
        appointment.fecha = newDate;
        appointment.terapeuta = therapist;
        renderAppointments();
    });
}

// Manejar clic en una cita
function handleAppointmentClick(appointment) {
    if (isAdmin) {
        // Opción para editar o marcar asistencia
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (appointment.fecha < today) {
            // Cita pasada, mostrar modal de asistencia
            showAttendanceModal(appointment);
        } else {
            // Cita futura, permitir edición
            fillEditForm(appointment);
        }
    } else {
        // Estudiantes solo pueden ver detalles
        showAppointmentDetails(appointment);
    }
}

// Llenar formulario para editar cita
function fillEditForm(appointment) {
    editingAppointmentId = appointment.id;
    
    const form = document.getElementById('appointment-form');
    const dateObj = appointment.fecha;
    
    document.getElementById('patient-name').value = appointment.paciente;
    document.getElementById('appointment-type').value = appointment.tipo.replace(/\s+/g, '-').toLowerCase();
    document.getElementById('appointment-date').value = formatDate(dateObj);
    document.getElementById('appointment-time').value = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
    document.getElementById('appointment-duration').value = appointment.duracion;
    document.getElementById('therapist').value = appointment.terapeuta;
    document.getElementById('appointment-notes').value = appointment.notas || '';
    document.getElementById('is-web').checked = appointment.web || false;
    
    document.getElementById('cancel-edit').style.display = 'inline-block';
}

// Mostrar modal de asistencia
function showAttendanceModal(appointment) {
    const modal = document.getElementById('attendance-modal');
    const patientEl = document.getElementById('attendance-patient');
    const dateEl = document.getElementById('attendance-date');
    const timeEl = document.getElementById('attendance-time');
    
    patientEl.textContent = appointment.paciente;
    
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    dateEl.textContent = appointment.fecha.toLocaleDateString('es-CL', options);
    
    const startHour = appointment.fecha.getHours();
    const duration = appointment.duracion || 60;
    const endHour = startHour + (duration / 60);
    timeEl.textContent = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
    
    // Resetear selección de estado
    const statusButtons = document.querySelectorAll('.attendance-btn');
    statusButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Seleccionar el estado actual si existe
    if (appointment.estado) {
        const currentStatusBtn = document.querySelector(`.attendance-btn[data-status="${appointment.estado}"]`);
        if (currentStatusBtn) {
            currentStatusBtn.classList.add('selected');
        }
    }
    
    // Notas de asistencia
    document.getElementById('attendance-notes').value = appointment.notasAsistencia || '';
    
    // Guardar referencia a la cita actual
    modal.dataset.appointmentId = appointment.id;
    
    // Mostrar modal
    modal.style.display = 'block';
}

// Mostrar detalles de cita (vista de estudiante)
function showAppointmentDetails(appointment) {
    alert(`
        Paciente: ${appointment.paciente}
        Tipo: ${appointment.tipo}
        Fecha: ${appointment.fecha.toLocaleDateString('es-CL')}
        Hora: ${appointment.fecha.getHours().toString().padStart(2, '0')}:00
        Terapeuta: ${appointment.terapeuta}
        ${appointment.estado ? 'Estado: ' + appointment.estado : ''}
    `);
}

// Guardar una cita (nueva o editada)
function saveAppointment(appointmentData) {
    const db = firebase.firestore();
    
    if (editingAppointmentId) {
        // Actualizar cita existente
        db.collection('citas').doc(editingAppointmentId).update(appointmentData)
            .then(() => {
                console.log("Cita actualizada correctamente");
                resetForm();
                loadAppointments();
            })
            .catch((error) => {
                console.error("Error actualizando cita:", error);
                
                // Para demostración, actualizamos localmente
                const index = appointments.findIndex(a => a.id === editingAppointmentId);
                if (index !== -1) {
                    appointments[index] = {
                        ...appointments[index],
                        ...appointmentData
                    };
                    renderAppointments();
                    updateStatistics();
                }
                
                resetForm();
            });
    } else {
        // Crear nueva cita
        db.collection('citas').add(appointmentData)
            .then(() => {
                console.log("Cita creada correctamente");
                resetForm();
                loadAppointments();
            })
            .catch((error) => {
                console.error("Error creando cita:", error);
                
                // Para demostración, agregamos localmente
                const newAppointment = {
                    id: 'temp-' + Date.now(),
                    ...appointmentData
                };
                appointments.push(newAppointment);
                renderAppointments();
                updateStatistics();
                
                resetForm();
            });
    }
}

// Resetear formulario
function resetForm() {
    appointmentForm.reset();
    editingAppointmentId = null;
    document.getElementById('cancel-edit').style.display = 'none';
}

// Guardar asistencia
function saveAttendance(appointmentId, status, notes) {
    const db = firebase.firestore();
    
    db.collection('citas').doc(appointmentId).update({
        estado: status,
        notasAsistencia: notes
    })
    .then(() => {
        console.log("Asistencia registrada correctamente");
        closeAttendanceModal();
        loadAppointments();
    })
    .catch((error) => {
        console.error("Error registrando asistencia:", error);
        
        // Para demostración, actualizamos localmente
        const index = appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
            appointments[index].estado = status;
            appointments[index].notasAsistencia = notes;
            renderAppointments();
            updateStatistics();
        }
        
        closeAttendanceModal();
    });
}

// Cerrar modal de asistencia
function closeAttendanceModal() {
    const modal = document.getElementById('attendance-modal');
    modal.style.display = 'none';
}

// Actualizar estadísticas
function updateStatistics() {
    if (appointments.length === 0) {
        return;
    }
    
    // Calcular asistencia semanal
    const totalPastAppointments = appointments.filter(a => {
        const now = new Date();
        return a.fecha < now;
    }).length;
    
    const attendedAppointments = appointments.filter(a => a.estado === 'attended').length;
    
    const attendanceRate = totalPastAppointments > 0 
        ? Math.round((attendedAppointments / totalPastAppointments) * 100) 
        : 0;
    
    // Citas por hora
    const appointmentsByHour = {};
    appointments.forEach(a => {
        const hour = a.fecha.getHours();
        appointmentsByHour[hour] = (appointmentsByHour[hour] || 0) + 1;
    });
    
    // Encontrar la hora más ocupada
    let busiestHour = 9; // Por defecto 9:00
    let maxAppointments = 0;
    
    for (const hour in appointmentsByHour) {
        if (appointmentsByHour[hour] > maxAppointments) {
            busiestHour = parseInt(hour);
            maxAppointments = appointmentsByHour[hour];
        }
    }
    
    // Citas por terapeuta
    const appointmentsByTherapist = {
        'nicolas': 0,
        'ana-maria': 0,
        'gustavo': 0
    };
    
    appointments.forEach(a => {
        const therapist = a.terapeuta;
        if (appointmentsByTherapist[therapist] !== undefined) {
            appointmentsByTherapist[therapist]++;
        }
    });
    
    // Actualizar DOM
    const statValues = document.querySelectorAll('.stat-value');
    statValues[0].textContent = `${attendanceRate}%`;
    statValues[1].textContent = appointments.length;
    statValues[2].textContent = `${busiestHour}:00 - ${busiestHour + 1}:00`;
    
    // Actualizar gráfico de terapeutas
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartValues = document.querySelectorAll('.chart-value');
    
    const maxTherapistAppointments = Math.max(
        appointmentsByTherapist['nicolas'],
        appointmentsByTherapist['ana-maria'],
        appointmentsByTherapist['gustavo'],
        1 // Evitar división por cero
    );
    
    chartBars[0].style.height = `${(appointmentsByTherapist['nicolas'] / maxTherapistAppointments) * 100}%`;
    chartValues[0].textContent = appointmentsByTherapist['nicolas'];
    
    chartBars[1].style.height = `${(appointmentsByTherapist['ana-maria'] / maxTherapistAppointments) * 100}%`;
    chartValues[1].textContent = appointmentsByTherapist['ana-maria'];
    
    chartBars[2].style.height = `${(appointmentsByTherapist['gustavo'] / maxTherapistAppointments) * 100}%`;
    chartValues[2].textContent = appointmentsByTherapist['gustavo'];
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de navegación
    document.getElementById('prev-week').addEventListener('click', () => {
        currentWeek.setDate(currentWeek.getDate() - 7);
        initializeAgenda();
    });
    
    document.getElementById('next-week').addEventListener('click', () => {
        currentWeek.setDate(currentWeek.getDate() + 7);
        initializeAgenda();
    });
    
    // Botones de vista
    document.getElementById('day-view').addEventListener('click', () => {
        currentView = 'day';
        document.getElementById('day-view').classList.add('active');
        document.getElementById('week-view').classList.remove('active');
        document.getElementById('month-view').classList.remove('active');
        initializeAgenda();
    });
    
    document.getElementById('week-view').addEventListener('click', () => {
        currentView = 'week';
        document.getElementById('day-view').classList.remove('active');
        document.getElementById('week-view').classList.add('active');
        document.getElementById('month-view').classList.remove('active');
        initializeAgenda();
    });
    
    document.getElementById('month-view').addEventListener('click', () => {
        currentView = 'month';
        document.getElementById('day-view').classList.remove('active');
        document.getElementById('week-view').classList.remove('active');
        document.getElementById('month-view').classList.add('active');
        alert('La vista de mes está en desarrollo.');
        currentView = 'week';
        document.getElementById('week-view').classList.add('active');
        document.getElementById('month-view').classList.remove('active');
    });
    
    // Formulario de cita
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const patientName = document.getElementById('patient-name').value;
        const appointmentType = document.getElementById('appointment-type').value;
        const appointmentDate = document.getElementById('appointment-date').value;
        const appointmentTime = document.getElementById('appointment-time').value;
        const appointmentDuration = parseInt(document.getElementById('appointment-duration').value);
        const therapist = document.getElementById('therapist').value;
        const notes = document.getElementById('appointment-notes').value;
        const isWeb = document.getElementById('is-web').checked;
        
        // Crear objeto de fecha
        const [year, month, day] = appointmentDate.split('-');
        const [hours, minutes] = appointmentTime.split(':');
        const fecha = new Date(year, month - 1, day, hours, minutes);
        
        // Verificar si es feriado
        const dateStr = formatDate(fecha);
        if (holidays.some(h => h.date === dateStr)) {
            alert('No se pueden agendar citas en días feriados.');
            return;
        }
        
        // Datos de la cita
        const appointmentData = {
            paciente: patientName,
            tipo: document.getElementById('appointment-type').options[document.getElementById('appointment-type').selectedIndex].text,
            fecha: fecha,
            duracion: appointmentDuration,
            terapeuta: therapist,
            notas: notes,
            web: isWeb,
            creado: new Date(),
            creadoPor: currentUser ? currentUser.uid : 'demo-user'
        };
        
        saveAppointment(appointmentData);
    });
    
    // Botón cancelar edición
    document.getElementById('cancel-edit').addEventListener('click', () => {
        resetForm();
    });
    
    // Modal de asistencia
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', closeAttendanceModal);
    
    // Botones de estado de asistencia
    const attendanceButtons = document.querySelectorAll('.attendance-btn');
    attendanceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deseleccionar todos los botones
            attendanceButtons.forEach(b => b.classList.remove('selected'));
            // Seleccionar el botón actual
            btn.classList.add('selected');
        });
    });
    
    // Guardar asistencia
    document.getElementById('save-attendance').addEventListener('click', () => {
        const appointmentId = attendanceModal.dataset.appointmentId;
        const selectedBtn = document.querySelector('.attendance-btn.selected');
        
        if (!selectedBtn) {
            alert('Por favor selecciona un estado de asistencia.');
            return;
        }
        
        const status = selectedBtn.dataset.status;
        const notes = document.getElementById('attendance-notes').value;
        
        saveAttendance(appointmentId, status, notes);
    });
    
    // Cancelar asistencia
    document.getElementById('cancel-attendance').addEventListener('click', closeAttendanceModal);
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === attendanceModal) {
            closeAttendanceModal();
        }
    });
}
