// Variables globales
let valorRM = 0;
let historialRMs = [];
let metodoActual = "formula";

// Cuando el documento esté listo
document.addEventListener("DOMContentLoaded", function() {
    // Configurar evento para mostrar/ocultar el campo de "otro ejercicio"
    const rmEjercicioSelect = document.getElementById('rm_ejercicio');
    const rmEjercicioOtro = document.getElementById('rm_ejercicio_otro');
    
    if (rmEjercicioSelect && rmEjercicioOtro) {
        rmEjercicioSelect.addEventListener('change', function() {
            rmEjercicioOtro.style.display = this.value === 'Otro' ? 'block' : 'none';
        });
    }
    
    // Configurar evento para cambiar de método
    const metodoSelect = document.getElementById('rm_metodo');
    if (metodoSelect) {
        metodoSelect.addEventListener('change', cambiarMetodoCalculo);
        cambiarMetodoCalculo(); // Inicializar estado
    }
    
    // Cargar historial de RMs desde localStorage si existe
    cargarHistorialRMs();
});

// Función para cambiar el método de cálculo
function cambiarMetodoCalculo() {
    const metodo = document.getElementById('rm_metodo').value;
    metodoActual = metodo;
    
    // Mostrar/ocultar secciones según método seleccionado
    document.getElementById('seccion_formula').style.display = metodo === 'formula' ? 'block' : 'none';
    document.getElementById('seccion_rpe').style.display = metodo === 'rpe' ? 'block' : 'none';
    document.getElementById('seccion_rir').style.display = metodo === 'rir' ? 'block' : 'none';
    
    // Mostrar/ocultar ayuda para RPE/RIR
    document.getElementById('ayuda_rpe_rir').style.display = (metodo === 'rpe' || metodo === 'rir') ? 'block' : 'none';
}

// Función para calcular 1RM
function calcular1RM() {
    // Obtener valores comunes del formulario
    const ejercicioSelect = document.getElementById('rm_ejercicio');
    const ejercicioOtro = document.getElementById('rm_ejercicio_otro');
    const peso = parseFloat(document.getElementById('rm_peso').value);
    const repeticiones = parseInt(document.getElementById('rm_repeticiones').value);
    const nivelUsuario = document.getElementById('rm_nivel').value;
    const tipoEjercicio = document.getElementById('rm_tipo_ejercicio').value;
    
    // Validar datos de entrada
    if (!peso || peso <= 0 || !repeticiones || repeticiones <= 0) {
        alert('Por favor, ingrese valores válidos para peso y repeticiones.');
        return;
    }
    
    // Determinar el ejercicio
    let ejercicio = ejercicioSelect.value;
    if (ejercicio === 'Otro') {
        ejercicio = ejercicioOtro.value;
        if (!ejercicio) {
            alert('Por favor, especifique el ejercicio.');
            return;
        }
    }
    
    // Obtener método y calcular 1RM
    const metodo = document.getElementById('rm_metodo').value;
    
    switch(metodo) {
        case 'formula':
            const formula = document.getElementById('rm_formula').value;
            if (formula === 'promedio') {
                // Calcular promedio de todas las fórmulas
                const formulas = ['brzycki', 'epley', 'lander', 'lombardi', 'oconner', 'wathen'];
                let suma = 0;
                formulas.forEach(f => {
                    suma += calcularSegunFormula(f, peso, repeticiones);
                });
                valorRM = suma / formulas.length;
            } else {
                valorRM = calcularSegunFormula(formula, peso, repeticiones);
            }
            break;
            
        case 'rpe':
            const rpe = parseFloat(document.getElementById('rm_rpe').value);
            valorRM = calcular1RM_RPE(peso, repeticiones, rpe);
            break;
            
        case 'rir':
            const rir = parseInt(document.getElementById('rm_rir').value);
            valorRM = calcular1RM_RIR(peso, repeticiones, rir);
            break;
    }
    
    // Si no se pudo calcular
    if (!valorRM) {
        alert('No se pudo calcular el 1RM con los datos proporcionados.');
        return;
    }
    
    valorRM = Math.round(valorRM * 10) / 10; // Redondear a 1 decimal
    
    // Mostrar el resultado
    document.getElementById('valor_1rm').textContent = valorRM + ' kg';
    document.getElementById('resultado_1rm_container').style.display = 'block';
    
    // Generar tabla de cargas basada en el tipo de ejercicio
    generarTablaCargas(valorRM, tipoEjercicio);
    
    // Generar recomendaciones personalizadas
    generarRecomendacionesPersonalizadas(valorRM, ejercicio, nivelUsuario, tipoEjercicio, repeticiones, metodo);
    
    // Evaluar y mostrar fiabilidad del cálculo
    mostrarFiabilidadCalculo(repeticiones, metodo);
    
    // Actualizar estado del badge
    document.getElementById('rm-calculator-badge').textContent = 'Completado';
    document.getElementById('rm-calculator-badge').className = 'resultado-badge bg-success text-white';
}

// Calcular 1RM según la fórmula seleccionada
function calcularSegunFormula(formula, peso, repeticiones) {
    switch(formula) {
        case 'brzycki':
            return peso / (1.0278 - 0.0278 * repeticiones);
        case 'epley':
            return peso * (1 + 0.0333 * repeticiones);
        case 'lander':
            return (100 * peso) / (101.3 - 2.67123 * repeticiones);
        case 'lombardi':
            return peso * Math.pow(repeticiones, 0.1);
        case 'oconner':
            return peso * (1 + 0.025 * repeticiones);
        case 'wathen':
            return 100 * peso / (48.8 + 53.8 * Math.exp(-0.075 * repeticiones));
        default:
            return peso / (1.0278 - 0.0278 * repeticiones); // Brzycki por defecto
    }
}

// Calcular 1RM basado en RPE (Rating of Perceived Exertion)
function calcular1RM_RPE(peso, repeticiones, rpe) {
    // Basado en la tabla de investigación de Mike Tuchscherer y referencias NSCA
    const rpeTable = {
        // [repeticiones]: [RPE10, RPE9.5, RPE9, RPE8.5, RPE8, RPE7.5, RPE7, RPE6.5, RPE6]
        1: [1, 0.978, 0.955, 0.939, 0.922, 0.906, 0.889, 0.873, 0.856],
        2: [0.955, 0.939, 0.922, 0.906, 0.889, 0.873, 0.856, 0.84, 0.823],
        3: [0.922, 0.906, 0.889, 0.873, 0.856, 0.84, 0.823, 0.807, 0.79],
        4: [0.889, 0.873, 0.856, 0.84, 0.823, 0.807, 0.79, 0.774, 0.757],
        5: [0.856, 0.84, 0.823, 0.807, 0.79, 0.774, 0.757, 0.741, 0.724],
        6: [0.823, 0.807, 0.79, 0.774, 0.757, 0.741, 0.724, 0.708, 0.691],
        7: [0.79, 0.774, 0.757, 0.741, 0.724, 0.708, 0.691, 0.675, 0.658],
        8: [0.757, 0.741, 0.724, 0.708, 0.691, 0.675, 0.658, 0.642, 0.625],
        9: [0.724, 0.708, 0.691, 0.675, 0.658, 0.642, 0.625, 0.609, 0.592],
        10: [0.691, 0.675, 0.658, 0.642, 0.625, 0.609, 0.592, 0.576, 0.559],
        11: [0.675, 0.658, 0.642, 0.625, 0.609, 0.592, 0.576, 0.559, 0.542],
        12: [0.658, 0.642, 0.625, 0.609, 0.592, 0.576, 0.559, 0.542, 0.525],
        15: [0.625, 0.609, 0.592, 0.576, 0.559, 0.542, 0.525, 0.508, 0.492],
        20: [0.592, 0.576, 0.559, 0.542, 0.525, 0.508, 0.492, 0.475, 0.458]
    };
    
    // Ajustar repeticiones a un valor que exista en la tabla
    let repsAjustadas = repeticiones;
    if (repeticiones > 12 && repeticiones < 15) repsAjustadas = 12;
    if (repeticiones > 15 && repeticiones < 20) repsAjustadas = 15;
    if (repeticiones > 20) repsAjustadas = 20;
    if (!(repsAjustadas in rpeTable)) {
        repsAjustadas = Object.keys(rpeTable).reduce((prev, curr) => {
            return (Math.abs(curr - repeticiones) < Math.abs(prev - repeticiones) ? curr : prev);
        });
    }
    
    // Convertimos RPE a índice de la tabla (RPE 10 = índice 0, RPE 9.5 = índice 1, etc.)
    const rpeIndex = Math.round((10 - rpe) * 2);
    
    // Si el RPE está fuera del rango soportado (6-10)
    if (rpeIndex < 0 || rpeIndex > 8) {
        return null;
    }
    
    // Calculamos el 1RM
    const percentage = rpeTable[repsAjustadas][rpeIndex];
    return peso / percentage;
}

// Calcular 1RM basado en RIR (Repeticiones en Reserva)
function calcular1RM_RIR(peso, repeticiones, rir) {
    // La tabla de conversión RIR-RPE es: RPE = 10 - RIR
    const rpe = 10 - rir;
    return calcular1RM_RPE(peso, repeticiones, rpe);
}

// Generar tabla de cargas basada en porcentajes de 1RM
function generarTablaCargas(rm, tipoEjercicio) {
    const tablaBody = document.getElementById('tabla_cargas');
    tablaBody.innerHTML = '';
    
    // Definir las filas de la tabla basadas en las recomendaciones de la NSCA
    // Ajustar según el tipo de ejercicio (core vs assistance)
    const filas = [];
    
    if (tipoEjercicio === 'core') {
        // Para ejercicios multiarticulares principales (core)
        filas.push(
            { porcentaje: 95, reps: "1-2", aplicacion: "Fuerza máxima", clase: "table-danger" },
            { porcentaje: 90, reps: "2-3", aplicacion: "Fuerza máxima", clase: "table-danger" },
            { porcentaje: 85, reps: "4-6", aplicacion: "Fuerza máxima", clase: "table-danger" },
            { porcentaje: 80, reps: "6-8", aplicacion: "Fuerza/Hipertrofia", clase: "table-warning" },
            { porcentaje: 75, reps: "8-10", aplicacion: "Hipertrofia", clase: "table-warning" },
            { porcentaje: 70, reps: "10-12", aplicacion: "Hipertrofia", clase: "table-warning" },
            { porcentaje: 65, reps: "12-15", aplicacion: "Hipertrofia/Resistencia", clase: "table-success" },
            { porcentaje: 60, reps: "15-18", aplicacion: "Resistencia muscular", clase: "table-success" },
            { porcentaje: 50, reps: "18-20+", aplicacion: "Resistencia/Potencia", clase: "table-primary" },
            { porcentaje: 40, reps: "≥20", aplicacion: "Potencia (velocidad)", clase: "table-primary" },
            { porcentaje: 30, reps: "≥25", aplicacion: "Potencia máxima", clase: "table-primary" }
        );
    } else {
        // Para ejercicios monoarticulares o asistencia (assistance)
        filas.push(
            { porcentaje: 90, reps: "1-3", aplicacion: "Fuerza máxima", clase: "table-danger" },
            { porcentaje: 85, reps: "4-6", aplicacion: "Fuerza máxima", clase: "table-danger" },
            { porcentaje: 80, reps: "6-8", aplicacion: "Fuerza", clase: "table-warning" },
            { porcentaje: 75, reps: "8-10", aplicacion: "Hipertrofia", clase: "table-warning" },
            { porcentaje: 70, reps: "10-12", aplicacion: "Hipertrofia", clase: "table-warning" },
            { porcentaje: 65, reps: "12-15", aplicacion: "Hipertrofia", clase: "table-success" },
            { porcentaje: 60, reps: "15-18", aplicacion: "Resistencia muscular", clase: "table-success" },
            { porcentaje: 55, reps: "18-20", aplicacion: "Resistencia muscular", clase: "table-success" },
            { porcentaje: 50, reps: "20-25", aplicacion: "Resistencia/Técnica", clase: "table-primary" },
            { porcentaje: 40, reps: "≥25", aplicacion: "Técnica/Rehabilitación", clase: "table-primary" }
        );
    }
    
    // Llenar la tabla
    filas.forEach(fila => {
        const pesoCalculado = Math.round(rm * fila.porcentaje / 100 * 2) / 2; // Redondear a 0.5 kg más cercano
        const tr = document.createElement('tr');
        tr.className = fila.clase;
        
        tr.innerHTML = `
            <td>${fila.porcentaje}%</td>
            <td>${pesoCalculado} kg</td>
            <td>${fila.reps}</td>
            <td>${fila.aplicacion}</td>
        `;
        
        tablaBody.appendChild(tr);
    });
}

// Generar recomendaciones personalizadas basadas en NSCA
function generarRecomendacionesPersonalizadas(rm, ejercicio, nivel, tipoEjercicio, repeticiones, metodo) {
    const container = document.getElementById('recomendaciones_container');
    const contenido = document.getElementById('recomendaciones_contenido');
    
    // Determinar el tipo de ejercicio
    const esMultiarticular = tipoEjercicio === 'core';
    
    // Clasificación del ejercicio - específica de la NSCA
    let categoriaEjercicio = '';
    if (['Press banca', 'Sentadilla', 'Peso muerto', 'Press hombro', 'Leg press'].includes(ejercicio)) {
        categoriaEjercicio = 'multiarticular principal';
    } else if (['Curl bíceps', 'Extensión tríceps', 'Extensión rodilla', 'Flexión rodilla'].includes(ejercicio)) {
        categoriaEjercicio = 'monoarticular asistencia';
    } else {
        categoriaEjercicio = esMultiarticular ? 'multiarticular' : 'monoarticular';
    }
    
    // Recomendaciones de progresión según nivel (basado en NSCA)
    let recomendacionProgresion = '';
    switch(nivel) {
        case 'principiante':
            recomendacionProgresion = `
                <p>Para principiantes, la NSCA recomienda:</p>
                <ul>
                    <li>Frecuencia: 2-3 sesiones por semana para el mismo grupo muscular</li>
                    <li>Progresión: Incrementos de carga semanales de ${esMultiarticular ? '2.5-5 kg' : '1-2.5 kg'}</li>
                    <li>Volumen: 1-2 series por ejercicio inicialmente, progresando a 2-3 series</li>
                    <li>Enfoque: Técnica correcta, control motor y adaptación neuromuscular</li>
                </ul>
            `;
            break;
            
        case 'intermedio':
            recomendacionProgresion = `
                <p>Para nivel intermedio, la NSCA recomienda:</p>
                <ul>
                    <li>Frecuencia: 2-4 sesiones por semana por grupo muscular</li>
                    <li>Progresión: Incrementos de carga quincenales de ${esMultiarticular ? '1.5-2.5 kg' : '0.5-1.5 kg'}</li>
                    <li>Volumen: 3-4 series por ejercicio</li>
                    <li>Periodización: Considerar periodización lineal, variando la carga cada 3-4 semanas</li>
                </ul>
            `;
            break;
            
        case 'avanzado':
            recomendacionProgresion = `
                <p>Para nivel avanzado, la NSCA recomienda:</p>
                <ul>
                    <li>Frecuencia: Hasta 6 sesiones por semana (usando splits musculares)</li>
                    <li>Progresión: Periodización no-lineal u ondulada</li>
                    <li>Volumen: 3-6 series por ejercicio, con múltiples ejercicios por grupo muscular</li>
                    <li>Especialización: Considerar ciclos específicos de fuerza, hipertrofia o resistencia</li>
                </ul>
            `;
            break;
    }
    
    // Recomendaciones basadas en el método de evaluación (según NSCA)
    let recomendacionMetodo = '';
    switch(metodo) {
        case 'formula':
            recomendacionMetodo = `
                <p>Según la NSCA, para el uso de fórmulas predictivas:</p>
                <ul>
                    <li>La precisión disminuye a medida que aumentan las repeticiones (ideal: ≤5 repeticiones)</li>
                    <li>Las fórmulas suelen sobreestimar el 1RM en personas desentrenadas</li>
                    <li>Para mayor precisión, reevaluar periódicamente utilizando el mismo método</li>
                </ul>
            `;
            break;
            
        case 'rpe':
        case 'rir':
            recomendacionMetodo = `
                <p>Según la NSCA, para el uso de escalas RPE/RIR:</p>
                <ul>
                    <li>Excelente para autorregular el entrenamiento, adaptándose a la fatiga diaria</li>
                    <li>Iniciar con RPE 6-8 (RIR 2-4) para principiantes para priorizar técnica y control</li>
                    <li>Utilizar RPE 7-9 (RIR 1-3) para objetivos de fuerza e hipertrofia</li>
                    <li>Mantener RPE 5-7 (RIR 3-5) para técnica, velocidad y rehabilitación</li>
                </ul>
            `;
            break;
    }
    
    // Ajustes específicos según tipo de ejercicio
    let ajustesEspecificos = '';
    if (ejercicio === 'Press banca') {
        ajustesEspecificos = `
            <div class="alert alert-warning">
                <strong>Ajustes específicos para Press Banca:</strong>
                <ul>
                    <li>La NSCA recomienda realizar este ejercicio con un asegurador, especialmente con cargas altas</li>
                    <li>Mantener las escápulas retraídas y deprimidas durante toda la ejecución</li>
                    <li>Para fines terapéuticos, considerar variantes con mancuernas o máquina Smith para reducir riesgo</li>
                </ul>
            </div>
        `;
    } else if (ejercicio === 'Sentadilla') {
        ajustesEspecificos = `
            <div class="alert alert-warning">
                <strong>Ajustes específicos para Sentadilla:</strong>
                <ul>
                    <li>La NSCA recomienda lograr profundidad adecuada (muslos paralelos al suelo) antes de incrementar carga</li>
                    <li>Asegurar que las rodillas sigan la dirección de los pies, sin colapso medial</li>
                    <li>Utilizar progresiones adecuadas para principiantes: sentadilla con peso corporal → goblet → barra</li>
                </ul>
            </div>
        `;
    } else if (ejercicio === 'Peso muerto') {
        ajustesEspecificos = `
            <div class="alert alert-warning">
                <strong>Ajustes específicos para Peso Muerto:</strong>
                <ul>
                    <li>La NSCA indica que este ejercicio tiene alta demanda técnica y metabólica</li>
                    <li>Limitar el volumen total (2-3 series) para reducir fatiga excesiva</li>
                    <li>Establecer posición neutral de columna antes de cada repetición</li>
                    <li>Considerar variantes como peso muerto rumano o sumo según objetivos y anatomía</li>
                </ul>
            </div>
        `;
    }
    
    // Recomendaciones de seguridad (según NSCA)
    let recomendacionSeguridad = `
        <h6 class="mt-3 mb-2">Consideraciones de seguridad (NSCA):</h6>
        <div class="alert alert-danger">
            <ul>
                <li>Mantener técnica correcta es prioridad sobre incrementar carga</li>
                <li>Realizar calentamiento específico (50-70% 1RM) antes de cargas altas</li>
                <li>Las sensaciones de "tirantez" muscular son normales, pero el dolor articular no lo es</li>
                <li>Mantener control excéntrico en todas las repeticiones</li>
                ${nivel === 'principiante' ? '<li>Utilizar aseguradores para ejercicios principales como sentadilla y press banca</li>' : ''}
            </ul>
        </div>
    `;
    
    // Tabla de progresión recomendada (según NSCA)
    const pesoActual = valorRM;
    let tablaProgresion = `
        <h6 class="mt-4 mb-2">Progresión recomendada para ${ejercicio} (NSCA):</h6>
        <table class="table table-sm table-bordered mt-2">
            <thead>
                <tr>
                    <th>Semana</th>
                    <th>1RM Estimado</th>
                    <th>Zona de entrenamiento recomendada</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Tasas de progresión según nivel (basado en NSCA)
    let tasaProgresion = 0;
    switch(nivel) {
        case 'principiante':
            tasaProgresion = esMultiarticular ? 0.025 : 0.02; // 2.5% vs 2% semanal
            break;
        case 'intermedio':
            tasaProgresion = esMultiarticular ? 0.015 : 0.01; // 1.5% vs 1% semanal
            break;
        case 'avanzado':
            tasaProgresion = esMultiarticular ? 0.0075 : 0.005; // 0.75% vs 0.5% semanal
            break;
    }
    
    // Generar tabla de progresión para 6 semanas
    for (let i = 0; i < 6; i++) {
        const nuevoPeso = Math.round((pesoActual * (1 + tasaProgresion * i)) * 10) / 10;
        
        let zonaRecomendada = '';
        if (i < 2) {
            zonaRecomendada = nivel === 'principiante' ? '65-75% (técnica)' : '70-80% (acumulación)';
        } else if (i < 4) {
            zonaRecomendada = nivel === 'principiante' ? '70-80% (fuerza)' : '75-85% (intensificación)';
        } else {
            zonaRecomendada = nivel === 'principiante' ? '75-85% (pico)' : '80-90% (realización)';
        }
        
        tablaProgresion += `
            <tr>
                <td>Semana ${i+1}</td>
                <td>${nuevoPeso} kg</td>
                <td>${zonaRecomendada}</td>
            </tr>
        `;
    }
    
    tablaProgresion += `
            </tbody>
        </table>
        <p class="text-muted small">* Esta progresión es una estimación basada en las directrices de la NSCA. Ajuste según respuesta individual.</p>
    `;
    
    // Combinar todo el contenido
    contenido.innerHTML = `
        <h5 class="mb-3">Recomendaciones personalizadas para ${ejercicio}</h5>
        <p>Basado en su evaluación, se ha estimado un 1RM de <strong>${rm} kg</strong> 
           para este ejercicio ${categoriaEjercicio}. A continuación, recomendaciones específicas:</p>
        
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">Prescripción según nivel (${nivel})</div>
            <div class="card-body">
                ${recomendacionProgresion}
            </div>
        </div>
        
        <div class="card mb-3">
            <div class="card-header bg-info text-white">Consideraciones del método de evaluación</div>
            <div class="card-body">
                ${recomendacionMetodo}
            </div>
        </div>
        
        ${ajustesEspecificos}
        
        ${recomendacionSeguridad}
        
        ${tablaProgresion}
    `;
    
    // Mostrar el contenedor
    container.style.display = 'block';
}

// Función para evaluar la fiabilidad del cálculo (sistema semáforo)
function mostrarFiabilidadCalculo(repeticiones, metodo) {
    let fiabilidad = { color: '', mensaje: '' };
    
    // Determinar fiabilidad basada en repeticiones y método (según NSCA)
    if (metodo === 'formula') {
        if (repeticiones <= 5) {
            fiabilidad = { 
                color: 'success', 
                mensaje: 'Alta fiabilidad (NSCA recomienda ≤5 repeticiones para máxima precisión)'
            };
        } else if (repeticiones <= 10) {
            fiabilidad = { 
                color: 'warning', 
                mensaje: 'Fiabilidad moderada (NSCA recomienda ≤10 repeticiones para buena precisión)'
            };
        } else {
            fiabilidad = { 
                color: 'danger', 
                mensaje: 'Baja fiabilidad - NSCA recomienda usar menos repeticiones para mayor precisión'
            };
        }
    } else if (metodo === 'rpe' || metodo === 'rir') {
        if (repeticiones <= 5) {
            fiabilidad = { 
                color: 'success', 
                mensaje: 'Alta fiabilidad - NSCA: Excelente precisión con RPE/RIR en rangos bajos de repeticiones'
            };
        } else if (repeticiones <= 10) {
            fiabilidad = { 
                color: 'success', 
                mensaje: 'Buena fiabilidad - NSCA: El método RPE/RIR puede ser más preciso que fórmulas con repeticiones moderadas'
            };
        } else {
            fiabilidad = { 
                color: 'warning', 
                mensaje: 'Fiabilidad moderada - NSCA: Incluso con RPE/RIR, usar menos de 10 repeticiones para mayor precisión'
            };
        }
    }
    
    // Mostrar mensaje de fiabilidad
    const mensajeDiv = document.getElementById('mensaje_fiabilidad');
    mensajeDiv.className = `alert alert-${fiabilidad.color}`;
    mensajeDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${fiabilidad.mensaje}`;
}

// Función para guardar RM en el historial
function guardarRM() {
    if (!valorRM || valorRM <= 0) {
        alert('Primero debe calcular un valor de 1RM válido.');
        return;
    }
    
    // Obtener datos actuales
    const ejercicioSelect = document.getElementById('rm_ejercicio');
    const ejercicioOtro = document.getElementById('rm_ejercicio_otro');
    const peso = parseFloat(document.getElementById('rm_peso').value);
    const repeticiones = parseInt(document.getElementById('rm_repeticiones').value);
    const nivel = document.getElementById('rm_nivel').value;
    const metodo = document.getElementById('rm_metodo').value;
    
    // Obtener detalles específicos del método
    let metodoDatos = {};
    switch(metodo) {
        case 'formula':
            metodoDatos = { formula: document.getElementById('rm_formula').value };
            break;
        case 'rpe':
            metodoDatos = { rpe: document.getElementById('rm_rpe').value };
            break;
        case 'rir':
            metodoDatos = { rir: document.getElementById('rm_rir').value };
            break;
    }
    
    // Determinar el ejercicio
    let ejercicio = ejercicioSelect.value;
    if (ejercicio === 'Otro') {
        ejercicio = ejercicioOtro.value;
    }
    
    // Crear objeto para el historial
    const fechaActual = new Date();
    const registro = {
        id: Date.now(), // ID único basado en timestamp
        ejercicio: ejercicio,
        fecha: fechaActual.toLocaleDateString(),
        peso: peso,
        repeticiones: repeticiones,
        rm: valorRM,
        metodo: metodo,
        metodoDatos: metodoDatos,
        nivel: nivel
    };
    
    // Añadir al historial
    historialRMs.push(registro);
    
    // Guardar en localStorage
    guardarHistorialRMs();
    
    // Actualizar tabla de historial
    actualizarTablaHistorial();
    
    alert('Evaluación guardada correctamente');
}

// Guardar historial en localStorage
function guardarHistorialRMs() {
    localStorage.setItem('historialRMs', JSON.stringify(historialRMs));
}

// Cargar historial desde localStorage
function cargarHistorialRMs() {
    const historialGuardado = localStorage.getItem('historialRMs');
    if (historialGuardado) {
        historialRMs = JSON.parse(historialGuardado);
        actualizarTablaHistorial();
    }
}

// Actualizar tabla de historial
function actualizarTablaHistorial() {
    const tablaBody = document.getElementById('historial_rm');
    tablaBody.innerHTML = '';
    
    // Ordenar historial por fecha descendente
    historialRMs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Llenar la tabla con los datos
    historialRMs.forEach(registro => {
        const tr = document.createElement('tr');
        
        // Determinar el método utilizado para mostrar
        let metodoTexto = '';
        switch(registro.metodo) {
            case 'formula':
                metodoTexto = `Fórmula: ${getFormulaName(registro.metodoDatos.formula)}`;
                break;
            case 'rpe':
                metodoTexto = `RPE: ${registro.metodoDatos.rpe}`;
                break;
            case 'rir':
                metodoTexto = `RIR: ${registro.metodoDatos.rir}`;
                break;
            default:
                metodoTexto = registro.metodo || 'Fórmula';
        }
        
        // Crear la fila con todos los datos
        tr.innerHTML = `
            <td>${registro.ejercicio}</td>
            <td>${registro.fecha}</td>
            <td>${registro.peso} kg</td>
            <td>${registro.repeticiones}</td>
            <td>${registro.rm} kg</td>
            <td>${metodoTexto}</td>
            <td>${registro.nivel || 'No especificado'}</td>
            <td>
                <button class="btn btn-sm btn-info mr-1" onclick="cargarRegistroRM(${registro.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarRegistroRM(${registro.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tablaBody.appendChild(tr);
    });
}

// Cargar un registro existente para reutilizarlo/editarlo
function cargarRegistroRM(id) {
    const registro = historialRMs.find(r => r.id === id);
    if (!registro) return;
    
    // Cargar los datos en el formulario
    document.getElementById('rm_ejercicio').value = registro.ejercicio;
    if (registro.ejercicio === 'Otro') {
        document.getElementById('rm_ejercicio_otro').value = registro.ejercicio;
        document.getElementById('rm_ejercicio_otro').style.display = 'block';
    }
    
    document.getElementById('rm_peso').value = registro.peso;
    document.getElementById('rm_repeticiones').value = registro.repeticiones;
    document.getElementById('rm_nivel').value = registro.nivel || 'principiante';
    document.getElementById('rm_metodo').value = registro.metodo;
    
    // Cambiar método y cargar datos específicos
    cambiarMetodoCalculo();
    
    switch(registro.metodo) {
        case 'formula':
            if (registro.metodoDatos?.formula) {
                document.getElementById('rm_formula').value = registro.metodoDatos.formula;
            }
            break;
        case 'rpe':
            if (registro.metodoDatos?.rpe) {
                document.getElementById('rm_rpe').value = registro.metodoDatos.rpe;
            }
            break;
        case 'rir':
            if (registro.metodoDatos?.rir) {
                document.getElementById('rm_rir').value = registro.metodoDatos.rir;
            }
            break;
    }
    
    // Desplazarse hasta el formulario
    document.querySelector('.card-header').scrollIntoView({ behavior: 'smooth' });
}

// Eliminar registro del historial
function eliminarRegistroRM(id) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        historialRMs = historialRMs.filter(registro => registro.id !== id);
        guardarHistorialRMs();
        actualizarTablaHistorial();
    }
}

// Obtener nombre completo de la fórmula
function getFormulaName(formulaKey) {
    const formulas = {
        'brzycki': 'Brzycki',
        'epley': 'Epley',
        'lander': 'Lander',
        'lombardi': 'Lombardi',
        'oconner': 'O\'Conner',
        'wathen': 'Wathen',
        'promedio': 'Promedio'
    };
    
    return formulas[formulaKey] || formulaKey;
}

// Función auxiliar para alternar la visualización de secciones
function toggleCuestionario(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}
