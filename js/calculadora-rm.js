/**
 * Calculadora de Repetición Máxima (RM)
 * Implementación basada en las recomendaciones exactas de la NSCA
 * NSCA's Essentials of Personal Training, Capítulo 15
 */

// Fórmulas para calcular 1RM a partir de submáximos
const formulas1RM = {
  // Fórmula de Brzycki: 1RM = peso / (1.0278 - 0.0278 × reps)
  brzycki: function(peso, reps) {
    return peso / (1.0278 - 0.0278 * reps);
  },
  
  // Fórmula de Epley: 1RM = peso × (1 + 0.0333 × reps)
  epley: function(peso, reps) {
    return peso * (1 + 0.0333 * reps);
  },
  
  // Fórmula de Lander: 1RM = 100 × peso / (101.3 - 2.67123 × reps)
  lander: function(peso, reps) {
    return 100 * peso / (101.3 - 2.67123 * reps);
  },
  
  // Fórmula de Lombardi: 1RM = peso × reps^0.1
  lombardi: function(peso, reps) {
    return peso * Math.pow(reps, 0.1);
  },
  
  // Fórmula de O'Conner: 1RM = peso × (1 + 0.025 × reps)
  oconner: function(peso, reps) {
    return peso * (1 + 0.025 * reps);
  },
  
  // Fórmula de Wathen: 1RM = 100 × peso / (48.8 + 53.8 × e^(-0.075 × reps))
  wathen: function(peso, reps) {
    return 100 * peso / (48.8 + 53.8 * Math.exp(-0.075 * reps));
  },
  
  // Promedio de todas las fórmulas
  promedio: function(peso, reps) {
    const valores = [
      this.brzycki(peso, reps),
      this.epley(peso, reps),
      this.lander(peso, reps),
      this.lombardi(peso, reps),
      this.oconner(peso, reps),
      this.wathen(peso, reps)
    ];
    return valores.reduce((sum, value) => sum + value, 0) / valores.length;
  }
};

// Tablas relacionadas con RPE/RIR para calcular 1RM
// Estas son herramientas modernas, compatibles con NSCA pero no explícitamente descritas en el capítulo 15
const tablaRPEaRIR = {
  10: 0,     // RPE 10 = 0 repeticiones en reserva (fallo muscular)
  9.5: 0.5,  // RPE 9.5 = 0.5 repeticiones en reserva
  9: 1,      // RPE 9 = 1 repetición en reserva
  8.5: 1.5,  // RPE 8.5 = 1.5 repeticiones en reserva
  8: 2,      // RPE 8 = 2 repeticiones en reserva
  7.5: 2.5,  // RPE 7.5 = 2.5 repeticiones en reserva
  7: 3,      // RPE 7 = 3 repeticiones en reserva
  6: 4,      // RPE 6 = 4 repeticiones en reserva
  5: 5,      // RPE 5 = 5 repeticiones en reserva
  4: 6,      // RPE 4 = 6 repeticiones en reserva
  3: 7,      // RPE 3 = 7 repeticiones en reserva
  2: 8,      // RPE 2 = 8 repeticiones en reserva
  1: 9       // RPE 1 = 9 repeticiones en reserva
};

// Tablas de porcentajes para RPE/RIR
const tablaRPEaPorcentaje1RM = {
  1: {10: 100, 9.5: 98, 9: 96, 8.5: 94, 8: 92, 7.5: 90, 7: 88},
  2: {10: 95, 9.5: 93, 9: 91, 8.5: 89, 8: 87, 7.5: 85, 7: 83},
  3: {10: 92, 9.5: 90, 9: 88, 8.5: 86, 8: 84, 7.5: 82, 7: 80},
  4: {10: 89, 9.5: 87, 9: 85, 8.5: 83, 8: 81, 7.5: 79, 7: 77},
  5: {10: 86, 9.5: 84, 9: 82, 8.5: 80, 8: 78, 7.5: 76, 7: 74},
  6: {10: 84, 9.5: 82, 9: 80, 8.5: 78, 8: 76, 7.5: 74, 7: 72},
  7: {10: 82, 9.5: 80, 9: 78, 8.5: 76, 8: 74, 7.5: 72, 7: 70},
  8: {10: 80, 9.5: 78, 9: 76, 8.5: 74, 8: 72, 7.5: 70, 7: 68},
  9: {10: 78, 9.5: 76, 9: 74, 8.5: 72, 8: 70, 7.5: 68, 7: 66},
  10: {10: 76, 9.5: 74, 9: 72, 8.5: 70, 8: 68, 7.5: 66, 7: 64},
  12: {10: 72, 9.5: 70, 9: 68, 8.5: 66, 8: 64, 7.5: 62, 7: 60},
  15: {10: 68, 9.5: 66, 9: 64, 8.5: 62, 8: 60, 7.5: 58, 7: 56}
};

// RIR a porcentaje (simplificado de RPE)
const tablaRIRaPorcentaje1RM = {
  1: {0: 100, 1: 96, 2: 92, 3: 88, 4: 85, 5: 82, 6: 80},
  2: {0: 95, 1: 91, 2: 87, 3: 83, 4: 80, 5: 77, 6: 75},
  3: {0: 92, 1: 88, 2: 84, 3: 80, 4: 77, 5: 74, 6: 72},
  4: {0: 89, 1: 85, 2: 81, 3: 77, 4: 74, 5: 71, 6: 69},
  5: {0: 86, 1: 82, 2: 78, 3: 74, 4: 71, 5: 68, 6: 66},
  6: {0: 84, 1: 80, 2: 76, 3: 72, 4: 69, 5: 66, 6: 64},
  7: {0: 82, 1: 78, 2: 74, 3: 70, 4: 67, 5: 64, 6: 62},
  8: {0: 80, 1: 76, 2: 72, 3: 68, 4: 65, 5: 62, 6: 60},
  9: {0: 78, 1: 74, 2: 70, 3: 66, 4: 63, 5: 60, 6: 58},
  10: {0: 76, 1: 72, 2: 68, 3: 64, 4: 61, 5: 58, 6: 56},
  12: {0: 72, 1: 68, 2: 64, 3: 60, 4: 57, 5: 54, 6: 52},
  15: {0: 68, 1: 64, 2: 60, 3: 56, 4: 53, 5: 50, 6: 48}
};

// Clasificación de ejercicios según NSCA (pág. 400-401)
const clasificacionEjercicios = {
  // Ejercicios principales (core exercises)
  "Press banca": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Sentadilla": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  "Peso muerto": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  "Press hombro": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Leg press": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  "Remo con barra": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Dominadas": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Press de banca inclinado": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Hip thrust": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  
  // Ejercicios de asistencia (assistance exercises)
  "Curl bíceps": { tipo: "assistance", grupoMuscular: "upper", multiarticular: false },
  "Extensión tríceps": { tipo: "assistance", grupoMuscular: "upper", multiarticular: false },
  "Extensión rodilla": { tipo: "assistance", grupoMuscular: "lower", multiarticular: false },
  "Flexión rodilla": { tipo: "assistance", grupoMuscular: "lower", multiarticular: false },
  "Curl de piernas": { tipo: "assistance", grupoMuscular: "lower", multiarticular: false }
};

// Objetivos de entrenamiento según NSCA con rangos porcentuales exactos (Tabla 15.6, pág. 409)
const objetivosEntrenamiento = {
  "Fuerza máxima": {
    rangoMin: 85,
    rangoMax: 100,
    repeticiones: "1-6",
    series: "1-3 (novato), 3+ (intermedio/avanzado)",
    descanso: "2-5 minutos",
    frecuencia: "2-3 veces/semana",
    descripcion: "Desarrollo de la capacidad para generar máxima tensión muscular",
    color: "danger" // Rojo en sistema de semáforo (alta intensidad)
  },
  "Hipertrofia": {
    rangoMin: 67,
    rangoMax: 85,
    repeticiones: "6-12",
    series: "1-3 (novato), 3+ (intermedio/avanzado)",
    descanso: "≥2-3 min (ejercicios multiarticulares), 60-90 segundos (ejercicios monoarticulares)",
    frecuencia: "2-3 veces/semana por grupo muscular",
    descripcion: "Aumento del tamaño muscular y tono",
    color: "warning" // Amarillo en sistema de semáforo (intensidad media)
  },
  "Resistencia muscular": {
    rangoMin: 50,
    rangoMax: 67,
    repeticiones: "12-20+",
    series: "1-3 (novato), 3+ (intermedio/avanzado)",
    descanso: "≤30 segundos",
    frecuencia: "2-3 veces/semana por grupo muscular",
    descripcion: "Mejora de la capacidad para realizar esfuerzos repetidos",
    color: "success" // Verde en sistema de semáforo (baja intensidad)
  },
  "Potencia": {
    rangoMin: 30,
    rangoMax: 60,
    repeticiones: "3-6",
    series: "1-3 (novato), 3-6 (intermedio/avanzado)",
    descanso: "2-5 minutos",
    frecuencia: "2-3 veces/semana",
    caracteristica: "Máxima velocidad de ejecución",
    descripcion: "Desarrollo de la velocidad y capacidad explosiva",
    color: "primary" // Azul (diferenciado, enfoque en velocidad de ejecución)
  }
};

// Recomendaciones de frecuencia según nivel exactamente como en NSCA (Tabla 15.2, pág. 399)
const frecuenciaEntrenamiento = {
  "Novato o principiante": "2-3 sesiones por semana (cuerpo completo)",
  "Intermedio": "3 sesiones si usa entrenamiento de cuerpo completo, 4 sesiones si usa rutina dividida",
  "Avanzado": "3-6 sesiones por semana"
};

// Recomendaciones de progresión según nivel (adaptado directamente de NSCA, capítulo 15)
const recomendacionesProgresion = {
  "Principiante": {
    // Datos basados en la clasificación NSCA (pág. 396, tabla 15.1)
    experiencia: "Menos de 2 meses de entrenamiento regular",
    frecuencia: "2-3 días por semana (cuerpo completo)",
    // Datos de incremento de cargas basados en pág. 410, tabla 15.7
    incrementoAbsoluto: {
      upper: {
        core: "2.5-5 lb (1-2 kg)",
        assistance: "1.25-2.5 lb (0.5-1 kg)"
      },
      lower: {
        core: "10-15 lb (4-7 kg)",
        assistance: "5-10 lb (2-4 kg)"
      }
    },
    incrementoRelativo: {
      upper: {
        core: "2.5%",
        assistance: "1-2%"
      },
      lower: {
        core: "5%",
        assistance: "2.5-5%"
      }
    },
    consideraciones: "Enfoque en la técnica correcta, aprender patrones básicos de movimiento. Use la regla 2-for-2 para progresión."
  },
  "Intermedio": {
    // Datos basados en la clasificación NSCA (pág. 396, tabla 15.1)
    experiencia: "De 2 meses a 1 año de entrenamiento regular",
    frecuencia: "3-4 días por semana (cuerpo completo o rutina dividida)",
    // Datos de incremento de cargas basados en pág. 410, tabla 15.7
    incrementoAbsoluto: {
      upper: {
        core: "5-10+ lb (2-4+ kg)",
        assistance: "5-10 lb (2-4 kg)"
      },
      lower: {
        core: "15-20+ lb (7-9+ kg)",
        assistance: "10-15 lb (4-7 kg)"
      }
    },
    incrementoRelativo: {
      upper: {
        core: "2.5-5+%",
        assistance: "2.5-5%"
      },
      lower: {
        core: "5-10+%",
        assistance: "5-10%"
      }
    },
    consideraciones: "Implementar rutinas divididas, variar volumen e intensidad. Seguir la regla 2-for-2 para progresión."
  },
  "Avanzado": {
    // Datos basados en la clasificación NSCA (pág. 396, tabla 15.1)
    experiencia: "Más de 1 año de entrenamiento regular",
    frecuencia: "3-6 días por semana (generalmente rutina dividida)",
    // El PDF no especifica incrementos absolutos para avanzados, pero menciona menores incrementos
    consideraciones: "Usar periodización compleja, variación planificada, mayor especificidad. Implementar ciclos de carga-descarga con ratio 3:1 o 2:1."
  }
};

// Ajustes de cargas usando la regla 2-for-2 (pág. 411, tabla 15.8)
const regla2For2 = {
  descripcion: "Incrementar el peso cuando el cliente pueda realizar 2 repeticiones más que el objetivo en 2 sesiones consecutivas",
  ejemplo: "Si el objetivo es 10 repeticiones y el cliente realiza 12 repeticiones en dos sesiones consecutivas, incrementar el peso para la siguiente sesión"
};

// Historial de RM
let historialRM = [];

/**
 * Función para desplegar/colapsar el contenido del cuestionario
 * Esta función es común con otras secciones de la aplicación
 */
function toggleCuestionario(contentId) {
  const content = document.getElementById(contentId);
  if (content) {
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    
    // Cambiar el ícono
    const header = content.previousElementSibling;
    if (header) {
      const icon = header.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-plus-circle');
        icon.classList.toggle('fa-minus-circle');
      }
    }
  }
}

/**
 * Calcula 1RM usando la fórmula seleccionada basado en repeticiones
 */
function calcular1RM() {
  // Obtener los valores del formulario
  const ejercicio = document.getElementById('rm_ejercicio').value;
  const ejercicioOtro = document.getElementById('rm_ejercicio_otro').value;
  const ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
  
  const peso = parseFloat(document.getElementById('rm_peso').value);
  const repeticiones = parseInt(document.getElementById('rm_repeticiones').value);
  const formulaSeleccionada = document.getElementById('rm_formula').value;
  const nivelSeleccionado = document.getElementById('rm_nivel').value;
  
  // Validar la entrada
  if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || peso <= 0 || repeticiones <= 0) {
    alert('Por favor, complete todos los campos con valores válidos.');
    return;
  }
  
  // Limitar repeticiones a un máximo de 15 para mayor precisión
  if (repeticiones > 15) {
    alert('Para mayor precisión, ingrese un número de repeticiones entre 1 y 15.');
    return;
  }
  
  // Calcular 1RM con la fórmula seleccionada
  let valor1RM = 0;
  
  if (formulaSeleccionada === 'promedio') {
    valor1RM = formulas1RM.promedio(peso, repeticiones);
  } else {
    valor1RM = formulas1RM[formulaSeleccionada](peso, repeticiones);
  }
  
  // Redondear a 1 decimal para facilitar la visualización
  valor1RM = Math.round(valor1RM * 10) / 10;
  
  // Actualizar la interfaz
  document.getElementById('valor_1rm').textContent = valor1RM + ' kg';
  document.getElementById('metodo_calculo').textContent = `Basado en la fórmula: ${formulaSeleccionada}`;
  
  // Generar tabla de cargas de entrenamiento
  generarTablaCargas(valor1RM, ejercicioNombre);
  
  // Generar recomendaciones basadas en NSCA
  generarRecomendaciones(valor1RM, ejercicioNombre, peso, repeticiones, nivelSeleccionado, 'formula');
  
  // Mostrar el contenedor de resultados
  document.getElementById('resultado_1rm_container').style.display = 'block';
}

/**
 * Calcula 1RM usando el método RPE (Rating of Perceived Exertion)
 */
function calcular1RMporRPE() {
  // Obtener los valores del formulario
  const ejercicio = document.getElementById('rpe_ejercicio').value;
  const ejercicioOtro = document.getElementById('rpe_ejercicio_otro') ? document.getElementById('rpe_ejercicio_otro').value : '';
  const ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
  
  const peso = parseFloat(document.getElementById('rpe_peso').value);
  const repeticiones = parseInt(document.getElementById('rpe_repeticiones').value);
  const rpeValor = parseFloat(document.getElementById('rpe_valor').value);
  
  // Validar la entrada
  if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rpeValor) || 
      peso <= 0 || repeticiones <= 0 || rpeValor < 1 || rpeValor > 10) {
    alert('Por favor, complete todos los campos con valores válidos. RPE debe estar entre 1 y 10.');
    return;
  }
  
  // Limitar repeticiones a un máximo de 15 para mayor precisión
  if (repeticiones > 15) {
    alert('Para mayor precisión, ingrese un número de repeticiones entre 1 y 15.');
    return;
  }
  
  // Determinar el porcentaje de 1RM basado en RPE y repeticiones
  let porcentaje = 0;
  
  // Ajustar las repeticiones a las disponibles en la tabla
  let repsAjustadas = repeticiones;
  if (repeticiones > 10 && repeticiones < 15) {
    repsAjustadas = 12;
  } else if (repeticiones > 12) {
    repsAjustadas = 15;
  }
  
  // Ajustar el RPE a los valores disponibles en la tabla
  let rpeAjustado = Math.floor(rpeValor * 2) / 2; // Redondear a 0.5 más cercano
  if (rpeAjustado < 7) rpeAjustado = 7; // Valor mínimo en nuestra tabla
  if (rpeAjustado > 10) rpeAjustado = 10; // Valor máximo en nuestra tabla
  
  // Obtener el porcentaje de la tabla
  if (tablaRPEaPorcentaje1RM[repsAjustadas] && tablaRPEaPorcentaje1RM[repsAjustadas][rpeAjustado]) {
    porcentaje = tablaRPEaPorcentaje1RM[repsAjustadas][rpeAjustado];
  } else {
    // Calcular un valor aproximado si no está en la tabla
    // Encontrar los valores más cercanos
    const repsDisponibles = Object.keys(tablaRPEaPorcentaje1RM).map(Number);
    const repCercana = repsDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - repeticiones) < Math.abs(prev - repeticiones) ? curr : prev)
    );
    
    const rpesDisponibles = Object.keys(tablaRPEaPorcentaje1RM[repCercana]).map(Number);
    const rpeCercano = rpesDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - rpeValor) < Math.abs(prev - rpeValor) ? curr : prev)
    );
    
    porcentaje = tablaRPEaPorcentaje1RM[repCercana][rpeCercano];
  }
  
  // Calcular 1RM basado en el porcentaje
  const valor1RM = Math.round((peso / (porcentaje / 100)) * 10) / 10;
  
  // Actualizar la interfaz
  document.getElementById('valor_1rm').textContent = valor1RM + ' kg';
  document.getElementById('metodo_calculo').textContent = `Basado en RPE: ${rpeValor} con ${repeticiones} repeticiones`;
  
  // Generar tabla de cargas de entrenamiento
  generarTablaCargas(valor1RM, ejercicioNombre);
  
  // Generar recomendaciones basadas en NSCA
  generarRecomendaciones(valor1RM, ejercicioNombre, peso, repeticiones, 'Intermedio', 'rpe');
  
  // Mostrar el contenedor de resultados
  document.getElementById('resultado_1rm_container').style.display = 'block';
}

/**
 * Calcula 1RM usando el método RIR (Repetitions in Reserve)
 */
function calcular1RMporRIR() {
  // Obtener los valores del formulario
  const ejercicio = document.getElementById('rir_ejercicio').value;
  const ejercicioOtro = document.getElementById('rir_ejercicio_otro') ? document.getElementById('rir_ejercicio_otro').value : '';
  const ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
  
  const peso = parseFloat(document.getElementById('rir_peso').value);
  const repeticiones = parseInt(document.getElementById('rir_repeticiones').value);
  const rirValor = parseInt(document.getElementById('rir_valor').value);
  
  // Validar la entrada
  if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rirValor) || 
      peso <= 0 || repeticiones <= 0 || rirValor < 0 || rirValor > 6) {
    alert('Por favor, complete todos los campos con valores válidos. RIR debe estar entre 0 y 6.');
    return;
  }
  
  // Limitar repeticiones a un máximo de 15 para mayor precisión
  if (repeticiones > 15) {
    alert('Para mayor precisión, ingrese un número de repeticiones entre 1 y 15.');
    return;
  }
  
  // Determinar el porcentaje de 1RM basado en RIR y repeticiones
  let porcentaje = 0;
  
  // Ajustar las repeticiones a las disponibles en la tabla
  let repsAjustadas = repeticiones;
  if (repeticiones > 10 && repeticiones < 15) {
    repsAjustadas = 12;
  } else if (repeticiones > 12) {
    repsAjustadas = 15;
  }
  
  // Obtener el porcentaje de la tabla
  if (tablaRIRaPorcentaje1RM[repsAjustadas] && tablaRIRaPorcentaje1RM[repsAjustadas][rirValor]) {
    porcentaje = tablaRIRaPorcentaje1RM[repsAjustadas][rirValor];
  } else {
    // Calcular un valor aproximado si no está en la tabla
    // Encontrar los valores más cercanos
    const repsDisponibles = Object.keys(tablaRIRaPorcentaje1RM).map(Number);
    const repCercana = repsDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - repeticiones) < Math.abs(prev - repeticiones) ? curr : prev)
    );
    
    const rirsDisponibles = Object.keys(tablaRIRaPorcentaje1RM[repCercana]).map(Number);
    const rirCercano = rirsDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - rirValor) < Math.abs(prev - rirValor) ? curr : prev)
    );
    
    porcentaje = tablaRIRaPorcentaje1RM[repCercana][rirCercano];
  }
  
  // Calcular 1RM basado en el porcentaje
  const valor1RM = Math.round((peso / (porcentaje / 100)) * 10) / 10;
  
  // Actualizar la interfaz
  document.getElementById('valor_1rm').textContent = valor1RM + ' kg';
  document.getElementById('metodo_calculo').textContent = `Basado en RIR: ${rirValor} con ${repeticiones} repeticiones`;
  
  // Generar tabla de cargas de entrenamiento
  generarTablaCargas(valor1RM, ejercicioNombre);
  
  // Generar recomendaciones basadas en NSCA
  generarRecomendaciones(valor1RM, ejercicioNombre, peso, repeticiones, 'Intermedio', 'rir');
  
  // Mostrar el contenedor de resultados
  document.getElementById('resultado_1rm_container').style.display = 'block';
}

/**
 * Genera la tabla de cargas de entrenamiento basada en el 1RM calculado
 * Siguiendo exactamente los rangos de la NSCA (tabla 15.6, pág. 409)
 */
function generarTablaCargas(rm, ejercicio) {
  const tablaCargas = document.getElementById('tabla_cargas');
  tablaCargas.innerHTML = '';
  
  // Determinar si el ejercicio es multiarticular o de asistencia
  let tipoEjercicio = "assistance"; // Por defecto
  if (clasificacionEjercicios[ejercicio]) {
    tipoEjercicio = clasificacionEjercicios[ejercicio].tipo;
  }
  
  // Generar filas para cada objetivo de entrenamiento
  for (const [objetivo, datos] of Object.entries(objetivosEntrenamiento)) {
    // Calcular el punto medio del rango
    const porcentajeMedio = (datos.rangoMin + datos.rangoMax) / 2;
    const cargaMedia = Math.round(rm * porcentajeMedio / 100);
    
    // Añadir fila a la tabla
    const row = document.createElement('tr');
    row.className = `table-${datos.color}`;
    
    row.innerHTML = `
      <td><strong>${objetivo}</strong></td>
      <td>${datos.rangoMin}-${datos.rangoMax}%</td>
      <td>${cargaMedia} kg</td>
      <td>${datos.repeticiones}</td>
      <td>${datos.descripcion}</td>
    `;
    
    tablaCargas.appendChild(row);
  }
}

/**
 * Genera recomendaciones personalizadas basadas en NSCA
 */
function generarRecomendaciones(rm, ejercicio, pesoActual, repeticionesActuales, nivelSeleccionado, metodo) {
  const containerRecomendaciones = document.getElementById('recomendaciones_rm');
  
  // Determinar tipo de ejercicio y grupo muscular
  let tipoEjercicio = "assistance";
  let grupoMuscular = "upper";
  let esMultiarticular = false;
  
  if (clasificacionEjercicios[ejercicio]) {
    tipoEjercicio = clasificacionEjercicios[ejercicio].tipo;
    grupoMuscular = clasificacionEjercicios[ejercicio].grupoMuscular;
    esMultiarticular = clasificacionEjercicios[ejercicio].multiarticular;
  }
  
  // Determinar nivel de entrenamiento
  let nivel = nivelSeleccionado;
  let nivelNormalizado = "Principiante";
  
  if (nivel === "Intermedio") {
    nivelNormalizado = "Intermedio";
  } else if (nivel === "Avanzado") {
    nivelNormalizado = "Avanzado";
  }
  
  // Si se usó RPE o RIR, estimar nivel basado en eso también
  if (metodo === 'rpe' || metodo === 'rir') {
    // Los usuarios de RPE/RIR suelen ser al menos de nivel intermedio
    if (nivelNormalizado === 'Principiante') {
      nivelNormalizado = 'Intermedio';
    }
  }
  
  // Recomendaciones específicas de incremento basadas en NSCA (tabla 15.7, pág. 410)
  const recomendacionIncremento = recomendacionesProgresion[nivelNormalizado].incrementoAbsoluto ?
    recomendacionesProgresion[nivelNormalizado].incrementoAbsoluto[grupoMuscular][tipoEjercicio] :
    "Incrementos personalizados basados en adaptación";
  
  const recomendacionIncrementoPorcentaje = recomendacionesProgresion[nivelNormalizado].incrementoRelativo ?
    recomendacionesProgresion[nivelNormalizado].incrementoRelativo[grupoMuscular][tipoEjercicio] :
    "Incrementos pequeños (1-2.5%)";
  
  // Generar HTML con recomendaciones
  let recomendacionesHTML = `
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Recomendaciones para Prescripción según NSCA</h5>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <strong>1RM Estimado:</strong> ${rm} kg para ${ejercicio}<br>
          <strong>Nivel:</strong> ${nivel}<br>
          <strong>Tipo de Ejercicio:</strong> ${tipoEjercicio === "core" ? "Ejercicio Principal" : "Ejercicio de Asistencia"}<br>
          <strong>Grupo Muscular:</strong> ${grupoMuscular === "upper" ? "Tren Superior" : "Tren Inferior"}<br>
          <strong>Método de Cálculo:</strong> ${metodo === 'formula' ? 'Fórmula tradicional' : (metodo === 'rpe' ? 'RPE (Valoración de Esfuerzo Percibido)' : 'RIR (Repeticiones en Reserva)')}
        </div>
        
        <h6>Recomendaciones de Entrenamiento (NSCA)</h6>
        <ul class="list-group mb-3">
          <li class="list-group-item">
            <strong>Frecuencia:</strong> ${frecuenciaEntrenamiento[nivel === "Principiante" ? "Novato o principiante" : nivelNormalizado]}
          </li>
          <li class="list-group-item">
            <strong>Incremento de Carga Recomendado:</strong> ${recomendacionIncremento} (${recomendacionIncrementoPorcentaje} del peso actual)
          </li>
          <li class="list-group-item">
            <strong>Progresión:</strong> Siga la regla 2-for-2: Aumente el peso cuando pueda realizar 2 repeticiones más que el objetivo en 2 sesiones consecutivas.
          </li>
          <li class="list-group-item">
            <strong>Consideraciones:</strong> ${recomendacionesProgresion[nivelNormalizado].consideraciones}
          </li>
        </ul>
  `;
  
  // Añadir recomendaciones específicas basadas en el tipo de ejercicio (NSCA, pág. 400-401)
  if (tipoEjercicio === "core" && esMultiarticular) {
    recomendacionesHTML += `
      <div class="alert alert-success">
        <h6><i class="fas fa-check-circle"></i> Recomendaciones Específicas (NSCA):</h6>
        <p>Este es un ejercicio multiarticular principal. Según la NSCA, estos ejercicios son más efectivos para el desarrollo general porque reclutan grandes músculos mientras activan sinergistas.</p>
        <p>Para seguir las recomendaciones de la NSCA:</p>
        <ul>
          <li>Coloque este ejercicio al inicio de su rutina cuando hay menos fatiga (pág. 402)</li>
          <li>Utilice un volumen adecuado: ${objetivosEntrenamiento["Fuerza máxima"].series} series para desarrollo de fuerza</li>
          <li>Descanso entre series: ${objetivosEntrenamiento["Fuerza máxima"].descanso} para ejercicios de fuerza máxima</li>
          <li>Orden de ejercicios recomendado: Potencia → Core → Asistencia (pág. 402, Tabla 15.3)</li>
          ${grupoMuscular === "lower" ? '<li>Para entrenamiento dividido (split), coordine los días de entrenamiento para permitir recuperación adecuada</li>' : '<li>Permita al menos 48 horas de recuperación antes de entrenar el mismo grupo muscular nuevamente</li>'}
        </ul>
      </div>
    `;
  } else {
    recomendacionesHTML += `
      <div class="alert alert-warning">
        <h6><i class="fas fa-info-circle"></i> Recomendaciones Específicas (NSCA):</h6>
        <p>Este es un ejercicio de asistencia. Según la NSCA, estos ejercicios son suplementarios y generalmente involucran un solo grupo muscular o articulación (pág. 401).</p>
        <p>Para seguir las recomendaciones de la NSCA:</p>
        <ul>
          <li>Realice este ejercicio después de los ejercicios principales multiarticulares (pág. 402)</li>
          <li>Considere un volumen moderado: ${objetivosEntrenamiento["Hipertrofia"].series} series para desarrollo de hipertrofia</li>
          <li>Descanso entre series: ${objetivosEntrenamiento["Hipertrofia"].descanso} para ejercicios de hipertrofia</li>
          <li>Para ejercicios de asistencia, considere cargas menores: aproximadamente 8RM para ejercicios de asistencia (pág. 409)</li>
          <li>Utilice este ejercicio para corregir desequilibrios o reforzar músculos específicos</li>
        </ul>
      </div>
    `;
  }
  
  // Añadir recomendaciones específicas para el método de cálculo utilizado
  if (metodo === 'rpe') {
    recomendacionesHTML += `
      <div class="alert alert-info">
        <h6><i class="fas fa-tachometer-alt"></i> Sobre el uso de RPE:</h6>
        <p>El uso de RPE (Rating of Perceived Exertion) no está explícitamente descrito en el capítulo 15 de NSCA, pero es compatible con el método de Repeticiones en Reserva (RIR) mencionado en la pág. 407:</p>
        <ul>
          <li>RPE 10 corresponde a 0 RIR (fallo muscular)</li>
          <li>RPE 9 corresponde a 1 RIR</li>
          <li>RPE 8 corresponde a 2 RIR</li>
          <li>RPE 7 corresponde a 3 RIR</li>
        </ul>
        <p>Esto puede utilizarse junto con el método de RM para prescripción de cargas.</p>
      </div>
    `;
  } else if (metodo === 'rir') {
    recomendacionesHTML += `
      <div class="alert alert-info">
        <h6><i class="fas fa-battery-three-quarters"></i> Sobre el uso de RIR:</h6>
        <p>La NSCA describe el método de Repeticiones en Reserva (RIR) en la pág. 407 como "repeticiones en reserva" o "entrenamiento sin fallo":</p>
        <ul>
          <li>0 RIR significa entrenamiento hasta el fallo muscular</li>
          <li>1-3 RIR es ideal para desarrollo de fuerza e hipertrofia</li>
          <li>Según la pág. 407, "entrenar a pocas repeticiones del fallo produce menores niveles de fatiga o dolor muscular"</li>
          <li>Para principiantes, la NSCA recomienda no entrenar hasta el fallo frecuentemente</li>
        </ul>
      </div>
    `;
  }
  
  // Añadir recomendaciones de seguridad de NSCA (pág. 405)
  recomendacionesHTML += `
    <div class="alert alert-danger">
      <h6><i class="fas fa-exclamation-triangle"></i> Consideraciones de Seguridad (NSCA):</h6>
      <ul>
        <li>Las estimaciones de 1RM varían en precisión según el tipo de ejercicio, población y nivel de entrenamiento.</li>
        <li>Estas estimaciones son menos precisas cuando las repeticiones superan las 10 (pág. 406).</li>
        <li>"Si el cliente no puede realizar correctamente un ejercicio, las regresiones, máquinas asistidas o mecánica adecuada deben ser prioridad" (pág. 405).</li>
        <li>La NSCA enfatiza en la pág. 409: "Aunque puede haber beneficios de entrenar hasta el fallo, es prudente secuenciar el entrenamiento del cliente."</li>
        <li>Según la pág. 405: "El esfuerzo individual del cliente debe ser monitorizado para asegurar que las últimas repeticiones sean desafiantes pero no comprometan la técnica adecuada."</li>
      </ul>
    </div>
  `;
  
  recomendacionesHTML += `
      </div>
    </div>
  `;
  
  // Actualizar el contenedor
  containerRecomendaciones.innerHTML = recomendacionesHTML;
  containerRecomendaciones.style.display = 'block';
}

/**
 * Guarda la evaluación actual en el historial
 */
function guardarRM() {
  // Determinar qué método está siendo utilizado
  let ejercicioNombre, peso, valor, metodo, valor1RM;
  
  // Pestaña activa
  const pestanaActiva = document.querySelector('.tab-pane.active');
  const idPestana = pestanaActiva.id;
  
  if (idPestana === 'reps-content') {
    const ejercicio = document.getElementById('rm_ejercicio').value;
    const ejercicioOtro = document.getElementById('rm_ejercicio_otro').value;
    ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
    
    peso = parseFloat(document.getElementById('rm_peso').value);
    const repeticiones = parseInt(document.getElementById('rm_repeticiones').value);
    const formula = document.getElementById('rm_formula').value;
    
    valor = `${repeticiones} reps`;
    metodo = `Fórmula: ${formula}`;
    
    // Validar datos
    if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || peso <= 0 || repeticiones <= 0) {
      alert('Complete todos los campos antes de guardar la evaluación.');
      return;
    }
    
    // Calcular 1RM
    if (formula === 'promedio') {
      valor1RM = formulas1RM.promedio(peso, repeticiones);
    } else {
      valor1RM = formulas1RM[formula](peso, repeticiones);
    }
  } 
  else if (idPestana === 'rpe-content') {
    const ejercicio = document.getElementById('rpe_ejercicio').value;
    const ejercicioOtro = document.getElementById('rpe_ejercicio_otro') ? document.getElementById('rpe_ejercicio_otro').value : '';
    ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
    
    peso = parseFloat(document.getElementById('rpe_peso').value);
    const repeticiones = parseInt(document.getElementById('rpe_repeticiones').value);
    const rpeValor = parseFloat(document.getElementById('rpe_valor').value);
    
    valor = `${repeticiones} reps, RPE ${rpeValor}`;
    metodo = 'RPE';
    
    // Validar datos
    if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rpeValor) || peso <= 0 || repeticiones <= 0) {
      alert('Complete todos los campos antes de guardar la evaluación.');
      return;
    }
    
    // Usar el valor 1RM ya calculado (si existe)
    const rmText = document.getElementById('valor_1rm').textContent;
    valor1RM = parseFloat(rmText.replace(' kg', ''));
  }
  else if (idPestana === 'rir-content') {
    const ejercicio = document.getElementById('rir_ejercicio').value;
    const ejercicioOtro = document.getElementById('rir_ejercicio_otro') ? document.getElementById('rir_ejercicio_otro').value : '';
    ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
    
    peso = parseFloat(document.getElementById('rir_peso').value);
    const repeticiones = parseInt(document.getElementById('rir_repeticiones').value);
    const rirValor = parseInt(document.getElementById('rir_valor').value);
    
    valor = `${repeticiones} reps, RIR ${rirValor}`;
    metodo = 'RIR';
    
    // Validar datos
    if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rirValor) || peso <= 0 || repeticiones <= 0) {
      alert('Complete todos los campos antes de guardar la evaluación.');
      return;
    }
    
    // Usar el valor 1RM ya calculado (si existe)
    const rmText = document.getElementById('valor_1rm').textContent;
    valor1RM = parseFloat(rmText.replace(' kg', ''));
  }
  else {
    alert('No se pudo determinar el método de cálculo activo.');
    return;
  }
  
  // Si aún no tenemos un valor 1RM válido, salir
  if (isNaN(valor1RM) || valor1RM <= 0) {
    alert('Primero debe calcular el 1RM antes de guardar.');
    return;
  }
  
  valor1RM = Math.round(valor1RM * 10) / 10;
  
  // Fecha actual
  const fechaActual = new Date().toLocaleDateString();
  
  // Crear objeto para el historial
  const nuevoRegistro = {
    ejercicio: ejercicioNombre,
    fecha: fechaActual,
    peso: peso,
    valor: valor,
    rm1: valor1RM,
    metodo: metodo,
    id: Date.now() // Para tener un identificador único
  };
  
  // Agregar al historial
  historialRM.push(nuevoRegistro);
  
  // Actualizar la tabla de historial
  actualizarTablaHistorial();
  
  // Actualizar el badge global
  const badge = document.getElementById('rm-calculator-badge');
  if (badge) {
    badge.textContent = 'Completado';
    badge.className = 'resultado-badge badge bg-success';
  }
  
  alert('Evaluación guardada correctamente.');
}

/**
 * Actualiza la tabla de historial con los registros guardados
 */
function actualizarTablaHistorial() {
  const historialContainer = document.getElementById('historial_rm');
  
  // Limpiar tabla
  historialContainer.innerHTML = '';
  
  if (historialRM.length === 0) {
    // Mostrar mensaje si no hay registros
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="7" class="text-center">No hay evaluaciones guardadas</td>';
    historialContainer.appendChild(emptyRow);
    return;
  }
  
  // Agregar cada registro a la tabla
  historialRM.forEach(registro => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${registro.ejercicio}</td>
      <td>${registro.fecha}</td>
      <td>${registro.peso} kg</td>
      <td>${registro.valor}</td>
      <td>${registro.rm1} kg</td>
      <td>${registro.metodo}</td>
      <td>
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarRegistroRM(${registro.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    historialContainer.appendChild(row);
  });
}

/**
 * Elimina un registro del historial de RM
 */
function eliminarRegistroRM(id) {
  if (confirm('¿Está seguro de que desea eliminar este registro?')) {
    // Filtrar el registro con el ID correspondiente
    historialRM = historialRM.filter(registro => registro.id !== id);
    
    // Actualizar la tabla
    actualizarTablaHistorial();
    
    // Actualizar el badge si ya no hay registros
    if (historialRM.length === 0) {
      const badge = document.getElementById('rm-calculator-badge');
      if (badge) {
        badge.textContent = 'No completado';
        badge.className = 'resultado-badge badge bg-secondary';
      }
    }
  }
}

/**
 * Manejador para mostrar/ocultar el campo de "otro ejercicio"
 */
function manejarCambioEjercicio(selectId, otroId) {
  const ejercicio = document.getElementById(selectId);
  const otroEjercicio = document.getElementById(otroId);
  
  if (ejercicio && otroEjercicio) {
    if (ejercicio.value === 'Otro') {
      otroEjercicio.style.display = 'block';
    } else {
      otroEjercicio.style.display = 'none';
    }
  }
}

/**
 * Inicialización de la calculadora
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando calculadora RM...');
  
  // Configurar eventos para campos de ejercicio
  document.getElementById('rm_ejercicio').addEventListener('change', function() {
    manejarCambioEjercicio('rm_ejercicio', 'rm_ejercicio_otro');
  });
  
  if (document.getElementById('rpe_ejercicio')) {
    document.getElementById('rpe_ejercicio').addEventListener('change', function() {
      manejarCambioEjercicio('rpe_ejercicio', 'rpe_ejercicio_otro');
    });
  }
  
  if (document.getElementById('rir_ejercicio')) {
    document.getElementById('rir_ejercicio').addEventListener('change', function() {
      manejarCambioEjercicio('rir_ejercicio', 'rir_ejercicio_otro');
    });
  }
  
  // Inicializar estados
  manejarCambioEjercicio('rm_ejercicio', 'rm_ejercicio_otro');
  if (document.getElementById('rpe_ejercicio')) {
    manejarCambioEjercicio('rpe_ejercicio', 'rpe_ejercicio_otro');
  }
  if (document.getElementById('rir_ejercicio')) {
    manejarCambioEjercicio('rir_ejercicio', 'rir_ejercicio_otro');
  }
  
  console.log('Calculadora RM inicializada correctamente.');
});
