// Funciones para la sección de Patrones de Movimiento Funcionales

// Evaluar patrón de movimiento y actualizar estado visual
function evaluarPatronMovimiento(elemento, idPatron) {
  const valor = elemento.value;
  
  // Si no hay valor seleccionado, salir
  if (!valor) return;
  
  // Actualizar visualmente el estado según la calidad del movimiento
  let color = "";
  let estado = "";
  
  switch (valor) {
    case "5":
      color = "bg-success";
      estado = "Óptima";
      break;
    case "4":
      color = "bg-info";
      estado = "Buena";
      break;
    case "3":
      color = "bg-warning";
      estado = "Regular";
      break;
    case "2":
      color = "bg-danger";
      estado = "Deficiente";
      break;
    case "1":
      color = "bg-dark";
      estado = "Incapaz";
      break;
  }
  
  // Actualizar el badge de resultado general
  document.getElementById("patrones-movimiento-badge").innerHTML = "Evaluado";
  document.getElementById("patrones-movimiento-badge").className = "resultado-badge badge " + color;
  
  // Actualizar resumen visual
  actualizarResumenVisual();
}

// Actualizar impacto funcional del patrón
function actualizarImpactoFuncional(idPatron) {
  const selectImpacto = document.getElementById(idPatron + "_impacto");
  const impactoVisual = document.getElementById(idPatron + "_impacto_visual");
  
  if (!selectImpacto || !impactoVisual) return;
  
  const valor = selectImpacto.value;
  let porcentaje = 0;
  let colorClase = "bg-success";
  
  switch (valor) {
    case "No afecta":
      porcentaje = 0;
      colorClase = "bg-success";
      break;
    case "Afecta AVD":
      porcentaje = 25;
      colorClase = "bg-info";
      break;
    case "Afecta trabajo":
      porcentaje = 50;
      colorClase = "bg-warning";
      break;
    case "Afecta deporte":
      porcentaje = 75;
      colorClase = "bg-warning";
      break;
    case "Incapacitante":
      porcentaje = 100;
      colorClase = "bg-danger";
      break;
  }
  
  // Actualizar barra de progreso
  const barraProgreso = impactoVisual.querySelector('.progress-bar');
  if (barraProgreso) {
    barraProgreso.style.width = porcentaje + "%";
    barraProgreso.className = "progress-bar " + colorClase;
  }
  
  // Actualizar correlación con actividades
  actualizarCorrelacionActividades();
}

// Actualizar resumen visual de patrones afectados
function actualizarResumenVisual() {
  const contenedorResumen = document.getElementById("patrones_resumen_visual");
  if (!contenedorResumen) return;
  
  // Limpiar contenedor
  contenedorResumen.innerHTML = "";
  
  // Recopilar todos los patrones evaluados
  const patrones = [];
  const selectores = document.querySelectorAll('select[id$="_calidad"]');
  
  selectores.forEach(selector => {
    if (selector.value) {
      const idBase = selector.id.replace("_calidad", "");
      const nombre = obtenerNombrePatron(idBase);
      const calidad = parseInt(selector.value);
      const dolor = document.getElementById(idBase + "_dolor") ? document.getElementById(idBase + "_dolor").value : "No";
      const impacto = document.getElementById(idBase + "_impacto") ? document.getElementById(idBase + "_impacto").value : "";
      
      patrones.push({
        id: idBase,
        nombre: nombre,
        calidad: calidad,
        dolor: dolor,
        impacto: impacto
      });
    }
  });
  
  // Ordenar por calidad (ascendente) para mostrar primero los más afectados
  patrones.sort((a, b) => a.calidad - b.calidad);
  
  // Si no hay patrones evaluados, mostrar mensaje
  if (patrones.length === 0) {
    contenedorResumen.innerHTML = '<div class="alert alert-info">Complete la evaluación de patrones para generar un resumen visual.</div>';
    return;
  }
  
  // Crear contenedor para el resumen visual
  const resumenHTML = document.createElement("div");
  resumenHTML.className = "row";
  // Crear tarjetas para cada patrón
  patrones.forEach(patron => {
    let colorClase = "";
    let estadoTexto = "";
    
    switch (patron.calidad) {
      case 5:
        colorClase = "bg-success";
        estadoTexto = "Óptima";
        break;
      case 4:
        colorClase = "bg-info";
        estadoTexto = "Buena";
        break;
      case 3:
        colorClase = "bg-warning";
        estadoTexto = "Regular";
        break;
      case 2:
        colorClase = "bg-danger";
        estadoTexto = "Deficiente";
        break;
      case 1:
        colorClase = "bg-dark";
        estadoTexto = "Incapaz";
        break;
    }
    
    const dolorIcono = patron.dolor !== "No" ? '<i class="fas fa-exclamation-triangle text-warning ml-2" title="Dolor"></i>' : '';
    
    const tarjeta = `
      <div class="col-md-3 mb-3">
        <div class="card">
          <div class="card-header ${colorClase} text-white">
            ${patron.nombre} ${dolorIcono}
          </div>
          <div class="card-body">
            <p class="mb-1"><strong>Calidad:</strong> ${estadoTexto}</p>
            <p class="mb-1"><strong>Dolor:</strong> ${patron.dolor}</p>
            <p class="mb-0"><strong>Impacto:</strong> ${patron.impacto || "No evaluado"}</p>
          </div>
        </div>
      </div>
    `;
    
    resumenHTML.innerHTML += tarjeta;
  });
  
  // Agregar resumen al contenedor
  contenedorResumen.appendChild(resumenHTML);
  
  // Generar interpretación y recomendaciones basadas en los patrones
  generarInterpretacionPatrones(patrones);
}

// Obtener nombre descriptivo del patrón a partir de su ID
function obtenerNombrePatron(idPatron) {
  const mapaPatrones = {
    "locomocion_marcha": "Marcha",
    "locomocion_escaleras": "Escaleras",
    "locomocion_carrera": "Carrera",
    "locomocion_cambios": "Cambios de dirección",
    "locomocion_sentarse": "Sentarse/Levantarse",
    "manipulacion_alcance_sup": "Alcance Superior",
    "manipulacion_alcance_med": "Alcance Medio",
    "manipulacion_alcance_inf": "Alcance Inferior",
    "manipulacion_precisa": "Manipulación Precisa",
    "manipulacion_agarre": "Agarre/Pinza",
    "carga_sentadilla": "Sentadilla",
    "carga_estocada": "Estocada",
    "carga_empuje": "Empuje",
    "carga_traccion": "Tracción",
    "carga_levantamiento": "Levantamiento",
    "carga_rotacion": "Rotación con carga",
    "equilibrio_monopodal": "Apoyo Monopodal",
    "equilibrio_obstaculos": "Superación de Obstáculos",
    "equilibrio_transiciones": "Transiciones Posturales"
  };
  
  return mapaPatrones[idPatron] || idPatron;
}

// Actualizar correlación con actividades cotidianas
function actualizarCorrelacionActividades() {
  const tablaCorrelacion = document.getElementById("actividades_correlacion_tabla");
  if (!tablaCorrelacion) return;
  
  // Limpiar tabla
  tablaCorrelacion.innerHTML = "";
  
  // Recopilar patrones con impacto funcional
  const patronesConImpacto = [];
  const selectoresImpacto = document.querySelectorAll('select[id$="_impacto"]');
  
  selectoresImpacto.forEach(selector => {
    if (selector.value && selector.value !== "No afecta") {
      const idBase = selector.id.replace("_impacto", "");
      const nombre = obtenerNombrePatron(idBase);
      const impacto = selector.value;
      const calidad = document.getElementById(idBase + "_calidad") ? document.getElementById(idBase + "_calidad").value : "";
      
      if (calidad) {
        patronesConImpacto.push({
          id: idBase,
          nombre: nombre,
          impacto: impacto,
          calidad: parseInt(calidad)
        });
      }
    }
  });
  
  // Si no hay patrones con impacto, mostrar mensaje
  if (patronesConImpacto.length === 0) {
    tablaCorrelacion.innerHTML = '<tr><td colspan="4" class="text-center">Complete la evaluación de patrones e indique su impacto funcional para generar correlaciones.</td></tr>';
    return;
  }
  
  // Definir actividades comunes según los patrones afectados
  const actividades = [
    { nombre: "Caminar", patrones: ["locomocion_marcha"] },
    { nombre: "Subir/bajar escaleras", patrones: ["locomocion_escaleras", "carga_sentadilla"] },
    { nombre: "Sentarse/levantarse", patrones: ["locomocion_sentarse", "carga_sentadilla"] },
    { nombre: "Alcanzar objetos altos", patrones: ["manipulacion_alcance_sup"] },
    { nombre: "Manipulación de objetos", patrones: ["manipulacion_precisa", "manipulacion_agarre"] },
    { nombre: "Cargar compras/objetos", patrones: ["carga_levantamiento", "carga_empuje", "carga_traccion"] },
    { nombre: "Actividades de limpieza", patrones: ["manipulacion_alcance_med", "manipulacion_alcance_inf", "carga_rotacion"] },
    { nombre: "Vestirse", patrones: ["equilibrio_monopodal", "manipulacion_alcance_inf"] },
    { nombre: "Conducir", patrones: ["locomocion_sentarse", "manipulacion_agarre", "carga_rotacion"] }
  ];
  
  // Evaluar cada actividad y crear filas en la tabla
  actividades.forEach(actividad => {
    const patronesAfectados = [];
    let dificultadMax = 0;
    
    // Verificar qué patrones de esta actividad están comprometidos
    actividad.patrones.forEach(idPatron => {
      const patronEncontrado = patronesConImpacto.find(p => p.id === idPatron);
      if (patronEncontrado) {
        patronesAfectados.push(patronEncontrado);
        
        // Determinar nivel de dificultad basado en la calidad del patrón (invertido)
        const dificultad = 6 - patronEncontrado.calidad; // 5->1, 4->2, 3->3, 2->4, 1->5
        dificultadMax = Math.max(dificultadMax, dificultad);
      }
    });
    
    // Sólo mostrar actividades con patrones afectados
    if (patronesAfectados.length > 0) {
      // Determinar nivel de dificultad general
      let nivelDificultad = "";
      let colorDificultad = "";
      
      switch (dificultadMax) {
        case 1:
          nivelDificultad = "Mínima";
          colorDificultad = "text-success";
          break;
        case 2:
          nivelDificultad = "Leve";
          colorDificultad = "text-info";
          break;
        case 3:
          nivelDificultad = "Moderada";
          colorDificultad = "text-warning";
          break;
        case 4:
          nivelDificultad = "Severa";
          colorDificultad = "text-danger";
          break;
        case 5:
          nivelDificultad = "Incapacitante";
          colorDificultad = "text-dark";
          break;
      }

    // Generar estrategias de adaptación según nivel de dificultad
      let estrategias = "";
      switch (dificultadMax) {
        case 1:
        case 2:
          estrategias = "Monitorización y corrección de patrones.";
          break;
        case 3:
          estrategias = "Adaptación de la técnica y posible uso de elementos de apoyo.";
          break;
        case 4:
        case 5:
          estrategias = "Asistencia física o uso de ayudas técnicas específicas.";
          break;
      }
      
      // Crear fila para esta actividad
      const fila = document.createElement("tr");
      
      const patronesTexto = patronesAfectados.map(p => `${p.nombre} (${p.calidad}/5)`).join(", ");
      
      fila.innerHTML = `
        <td>${actividad.nombre}</td>
        <td>${patronesTexto}</td>
        <td class="${colorDificultad}"><strong>${nivelDificultad}</strong></td>
        <td>${estrategias}</td>
      `;
      
      tablaCorrelacion.appendChild(fila);
    }
  });
  
  // Si no se encontraron correlaciones, mostrar mensaje
  if (tablaCorrelacion.childElementCount === 0) {
    tablaCorrelacion.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron correlaciones entre los patrones evaluados y actividades cotidianas.</td></tr>';
  }
}

// Generar interpretación y recomendaciones basadas en los patrones evaluados
function generarInterpretacionPatrones(patrones) {
  const interpretacionTexto = document.getElementById("interpretacion-patrones-texto");
  const recomendacionesTexto = document.getElementById("recomendaciones-patrones-texto");
  
  if (!interpretacionTexto || !recomendacionesTexto || patrones.length === 0) return;
  
  // Contar patrones por nivel de calidad
  const conteoCalidad = [0, 0, 0, 0, 0]; // Índices 0-4 correspondientes a calidades 1-5
  
  patrones.forEach(patron => {
    conteoCalidad[patron.calidad - 1]++;
  });
  
  // Determinar severidad global
  let severidadGlobal = "";
  let colorSeveridad = "";
  
  if (conteoCalidad[0] > 0) { // Al menos un patrón incapaz (1/5)
    severidadGlobal = "severa";
    colorSeveridad = "text-danger";
  } else if (conteoCalidad[1] > 0) { // Al menos un patrón deficiente (2/5)
    severidadGlobal = "moderada-severa";
    colorSeveridad = "text-danger";
  } else if (conteoCalidad[2] > 0) { // Al menos un patrón regular (3/5)
    severidadGlobal = "moderada";
    colorSeveridad = "text-warning";
  } else if (conteoCalidad[3] > 0) { // Al menos un patrón bueno (4/5)
    severidadGlobal = "leve";
    colorSeveridad = "text-info";
  } else {
    severidadGlobal = "mínima";
    colorSeveridad = "text-success";
  }
  
  // Identificar patrones más comprometidos (calidades 1-2)
  const patronesComprometidos = patrones.filter(p => p.calidad <= 2).map(p => p.nombre);
  
  // Generar texto de interpretación
  let interpretacion = `<p>La evaluación de patrones de movimiento funcionales muestra una alteración <strong class="${colorSeveridad}">${severidadGlobal}</strong> en la calidad de movimiento, `;
  
  if (patronesComprometidos.length > 0) {
    interpretacion += `con compromiso significativo en los siguientes patrones: <strong>${patronesComprometidos.join(", ")}</strong>. `;
  } else {
    interpretacion += `con limitaciones principalmente en los patrones de calidad regular (3/5). `;
  }
  
  // Añadir interpretación sobre dolor
  const patronesDolorosos = patrones.filter(p => p.dolor !== "No").map(p => p.nombre);
  
  if (patronesDolorosos.length > 0) {
    interpretacion += `Se observa dolor durante la ejecución de ${patronesDolorosos.length} patrones (${patronesDolorosos.join(", ")}), `;
    interpretacion += `lo que sugiere sensibilización neuromuscular y posible perpetuación de patrones sustitutivos. `;
  } else {
    interpretacion += `No se observa dolor significativo durante la ejecución de los patrones evaluados, lo que favorece el pronóstico. `;
  }
  
  // Añadir interpretación sobre impacto funcional
  interpretacion += `El impacto funcional es más evidente en actividades que requieren `;
  
  if (conteoCalidad[0] > 0 || conteoCalidad[1] > 0) {
    interpretacion += `control neuromotor preciso, estabilidad dinámica y adaptación a demandas variables de carga.`;
  } else if (conteoCalidad[2] > 0) {
    interpretacion += `resistencia a la fatiga, precisión en el movimiento y adaptación a diferentes velocidades de ejecución.`;
  } else {
    interpretacion += `velocidad, precisión y resistencia prolongada.`;
  }
  
  // Actualizar texto de interpretación
  interpretacionTexto.innerHTML = interpretacion;
  
  // Generar recomendaciones
  let recomendaciones = "<ul>";
  
  // Recomendaciones según severidad
  if (severidadGlobal === "severa" || severidadGlobal === "moderada-severa") {
    recomendaciones += `
      <li>Priorizar el <strong>reaprendizaje motor</strong> de los patrones más comprometidos, usando estrategias de retroalimentación aumentada.</li>
      <li>Implementar un abordaje <strong>progresivo de control motor</strong> comenzando en entornos controlados y cargas reducidas.</li>
      <li>Integrar <strong>entrenamiento neuromuscular específico</strong> para los patrones de ${patronesComprometidos.join(", ")}.</li>
      <li>Considerar el uso temporal de <strong>ayudas externas o adaptaciones</strong> para actividades cotidianas altamente comprometidas.</li>
      <li>Integrar <strong>estrategias de manejo del dolor</strong> durante la reeducación de patrones si el dolor limita significativamente.</li>
    `;
  } else if (severidadGlobal === "moderada") {
    recomendaciones += `
      <li>Implementar <strong>ejercicios de control motor específicos</strong> para mejorar la calidad de los patrones comprometidos.</li>
      <li>Progresar hacia un <strong>entrenamiento funcional</strong> que integre variabilidad y adaptabilidad de patrones.</li>
      <li>Proporcionar <strong>estrategias de autogestión</strong> para monitorizar la calidad del movimiento en actividades cotidianas.</li>
      <li>Incluir <strong>entrenamiento de fuerza progresivo</strong> para mejorar la capacidad de carga y resistencia a la fatiga.</li>
    `;
  } else {
    recomendaciones += `
      <li>Optimizar la <strong>eficiencia de patrones</strong> mediante entrenamiento de precisión y control.</li>
      <li>Integrar <strong>entrenamiento de potencia y velocidad</strong> para mejorar rendimiento en actividades exigentes.</li>
      <li>Incluir <strong>variabilidad en la ejecución</strong> para promover adaptabilidad del sistema motor.</li>
      <li>Mantener un programa de <strong>ejercicio continuado</strong> orientado a prevención y mantenimiento de la calidad de movimiento.</li>
    `;
  }
  
  recomendaciones += "</ul>";
  
  // Actualizar texto de recomendaciones
  recomendacionesTexto.innerHTML = recomendaciones;
}

// Función para agregar un patrón específico personalizado
function agregarPatronEspecifico() {
  const container = document.getElementById("patrones_especificos_container");
  const template = document.getElementById("patron_especifico_template");
  
  if (!container || !template) return;
  
  // Clonar plantilla
  const nuevoPatron = template.cloneNode(true);
  nuevoPatron.style.display = "block";
  nuevoPatron.id = "patron_especifico_" + Date.now();
  
  // Asegurar que los IDs de los elementos sean únicos
  const elementos = nuevoPatron.querySelectorAll('[id]');
  elementos.forEach(elemento => {
    elemento.id = elemento.id + "_" + Date.now();
  });
  
  // Agregar a contenedor
  container.appendChild(nuevoPatron);
}

// Función para eliminar un patrón específico
function eliminarPatronEspecifico(boton) {
  const patronDiv = boton.closest('.patron-especifico');
  if (patronDiv) {
    patronDiv.remove();
  }
}

// Evaluar calidad de un patrón específico
function evaluarPatronEspecifico(elemento) {
  const valor = elemento.value;
  const patronDiv = elemento.closest('.patron-especifico');
  
  if (!valor || !patronDiv) return;
  
  // Actualizar visualmente según calidad
  let colorClase = "";
  
  switch (valor) {
    case "5":
      colorClase = "bg-success";
      break;
    case "4":
      colorClase = "bg-info";
      break;
    case "3":
      colorClase = "bg-warning";
      break;
    case "2":
      colorClase = "bg-danger";
      break;
    case "1":
      colorClase = "bg-dark";
      break;
  }
  
  // Aplicar color de fondo al div contenedor
  patronDiv.className = patronDiv.className.replace(/bg-\w+/g, "");
  patronDiv.className += " " + colorClase + " text-white";
}


// Funciones para la sección de Evaluación Completa de ROM

// Mostrar tabla ROM según región seleccionada
function mostrarTablaROM() {
  const regionSeleccionada = document.getElementById("rom_region").value;
  const tablasROM = document.querySelectorAll(".tabla-rom");
  
  // Ocultar todas las tablas
  tablasROM.forEach(tabla => {
    tabla.style.display = "none";
  });
  
  // Mostrar tabla correspondiente
  if (regionSeleccionada) {
    const tablaSeleccionada = document.getElementById("tabla_rom_" + regionSeleccionada);
    if (tablaSeleccionada) {
      tablaSeleccionada.style.display = "block";
    }
  }
}

// FUNCIÓN MEJORADA: Extraer movimiento desde ID
function extraerMovimientoDesdeId(id) {
  // Separar el ID por guiones bajos
  const partes = id.split('_');
  
  // Caso específico para movimientos bilaterales con lado (izq/der)
  if (partes.length >= 4 && (partes[2] === 'izq' || partes[2] === 'der')) {
    return partes[1]; // Ejemplo: "hombro_flexion_izq_activo" -> "flexion"
  } 
  // Caso específico para rotación interna/externa
  else if (partes[1] === 'rot' && (partes[2] === 'int' || partes[2] === 'ext')) {
    return 'rot_' + partes[2]; // Ejemplo: "hombro_rot_int_activo" -> "rot_int"
  }
  // Caso para inclinación derecha/izquierda
  else if (partes[1] === 'incl' && (partes[2] === 'der' || partes[2] === 'izq')) {
    return 'incl'; // Normalizamos a solo "incl" para valores normativos
  }
  // Caso estándar
  else if (partes.length >= 3) {
    return partes[1]; // Ejemplo: "cervical_flexion_activo" -> "flexion"
  }
  
  // Si no coincide con ningún patrón anterior, devolver solo la parte después de la región
  return id.replace(partes[0] + '_', '').split('_')[0];
}

// FUNCIÓN MEJORADA: Evaluar estado de rango de movimiento
function evaluarROM(inputId, valorMin, valorModerado, valorNormal) {
  try {
    console.log(`Evaluando ROM para ${inputId} con valores: min=${valorMin}, mod=${valorModerado}, normal=${valorNormal}`);
    
    const input = document.getElementById(inputId);
    const estadoElement = document.getElementById(inputId + "_estado");
    
    if (!input || !estadoElement) {
      console.log(`No se encontraron elementos para ${inputId}`);
      return;
    }
    
    const valor = parseFloat(input.value);
    
    // Si no hay valor, no evaluar
    if (isNaN(valor)) {
      estadoElement.innerHTML = "";
      estadoElement.className = "";
      return;
    }
    
    // Obtener valores normativos si no fueron proporcionados
    let valNormal = valorNormal;
    let valModerado = valorModerado;
    
    if (!valorNormal || valorNormal <= 0) {
      const partes = inputId.split('_');
      const region = partes[0]; // Ej: cervical, hombro, etc.
      const movimiento = extraerMovimientoDesdeId(inputId);
      
      valNormal = obtenerValorNormativo(region, movimiento);
      valModerado = valNormal * 0.6;
      
      console.log(`Valores normativos obtenidos para ${region} - ${movimiento}: normal=${valNormal}, moderado=${valModerado}`);
    }
    
    // Evaluar estado según valores normativos
    let estado = "";
    let colorClase = "";
    
    if (valor < valModerado) {
      estado = "Disminuido";
      colorClase = "bg-danger text-white";
    } else if (valor < valNormal) {
      estado = "Limitado";
      colorClase = "bg-warning";
    } else {
      estado = "Normal";
      colorClase = "bg-success text-white";
    }
    
    // Actualizar elemento de estado
    estadoElement.innerHTML = estado;
    estadoElement.className = colorClase;
    
    // Actualizar badge de estado general
    const region = inputId.split('_')[0];
    const romEvaluationBadge = document.getElementById("rom-evaluation-badge") || document.getElementById(`rom-${region}-badge`);
    if (romEvaluationBadge) {
      romEvaluationBadge.innerHTML = "Evaluado";
      romEvaluationBadge.className = "resultado-badge badge bg-success";
    }
    
    // Calcular déficit funcional
    calcularDeficitFuncional(inputId);
    
    // Actualizar recomendaciones para la región
    const regionBase = inputId.split('_')[0]; // Obtiene la región (cervical, etc.)
    actualizarRecomendacionesROM(regionBase);
    
    return true;
  } catch (error) {
    console.error(`Error en evaluarROM para ${inputId}:`, error);
    return false;
  }
}

// FUNCIÓN MEJORADA: Calcular diferencial entre ROM activo y pasivo
function calcularDiferencialAP(baseId) {
  try {
    // Asegurar que el baseId no termina ya en _activo o _pasivo
    if (baseId.endsWith('_activo') || baseId.endsWith('_pasivo')) {
      baseId = baseId.substring(0, baseId.lastIndexOf('_'));
    }
    
    console.log(`Calculando diferencial para ${baseId}`);
    
    const activoInput = document.getElementById(baseId + "_activo");
    const pasivoInput = document.getElementById(baseId + "_pasivo");
    const diferencialElement = document.getElementById(baseId + "_diferencial");
    
    if (!activoInput || !pasivoInput || !diferencialElement) {
      console.log(`No se encontraron elementos para calcular diferencial de ${baseId}`);
      return;
    }
    
    const activoValor = parseFloat(activoInput.value);
    const pasivoValor = parseFloat(pasivoInput.value);
    
    // Si falta algún valor, no calcular
    if (isNaN(activoValor) || isNaN(pasivoValor)) {
      diferencialElement.innerHTML = "";
      diferencialElement.className = "";
      return;
    }
    
    // Calcular diferencia
    const diferencia = pasivoValor - activoValor;
    
    // Clasificar diferencial
    let estado = "";
    let colorClase = "";
    
    if (diferencia <= 5) {
      estado = "Normal";
      colorClase = "bg-success text-white";
    } else if (diferencia <= 15) {
      estado = "Moderado";
      colorClase = "bg-warning";
    } else {
      estado = "Significativo";
      colorClase = "bg-danger text-white";
    }
    
    // Mostrar el diferencial con formato claro
    diferencialElement.innerHTML = `<span class="${colorClase}" style="padding: 2px 6px; border-radius: 4px;">${diferencia}° (${estado})</span>`;
    
    // Interpretar el diferencial
    interpretarDiferencialAP(baseId, diferencia);
    
    return diferencia;
  } catch (error) {
    console.error(`Error en calcularDiferencialAP para ${baseId}:`, error);
    return null;
  }
}

// Interpretar el significado clínico del diferencial AP
function interpretarDiferencialAP(baseId, diferencia) {
  const partes = baseId.split('_');
  const region = partes[0]; // Extraer región (ej: cervical, hombro)
  const movimiento = extraerMovimientoDesdeId(baseId);
  
  // Obtener elementos de interpretación
  const interpretacionElement = document.getElementById(`interpretacion-${region}-texto`);
  if (!interpretacionElement) {
    console.log(`No se encontró elemento de interpretación para región ${region}`);
    return;
  }
  
  // Interpretar según magnitud del diferencial y región específica
  let interpretacion = '';
  
  if (diferencia <= 5) {
    // Diferencial normal: probablemente no haya restricción articular significativa
    return; // No añadir interpretación específica para diferenciales normales
  } else if (diferencia <= 15) {
    // Diferenciales moderados según región
    switch (region) {
      case 'cervical':
        interpretacion = `<p class="alert alert-info">El diferencial activo-pasivo moderado en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        sugiere inhibición neuromuscular protectiva o debilidad de musculatura estabilizadora profunda. Considerar evaluación específica de flexores/extensores profundos cervicales y técnicas de activación muscular.</p>`;
        break;
      case 'hombro':
        interpretacion = `<p class="alert alert-info">El diferencial activo-pasivo moderado en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        indica posible disfunción del ritmo escapulohumeral o inhibición neuromuscular de estabilizadores de escápula. Considerar evaluación de control motor escapular y ejercicios de reclutamiento progresivo.</p>`;
        break;
      case 'lumbar':
        interpretacion = `<p class="alert alert-info">El diferencial activo-pasivo moderado en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        sugiere posible inhibición de musculatura estabilizadora local o alteración del control motor. Evaluar función de multífidos y transverso abdominal.</p>`;
        break;
      default:
        interpretacion = `<p class="alert alert-info">El diferencial activo-pasivo moderado en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        sugiere inhibición neuromuscular o alteración del control motor. Considerar técnicas de activación muscular y ejercicios de control neuromotor.</p>`;
    }
  } else {
    // Diferenciales significativos según región
    switch (region) {
      case 'cervical':
        interpretacion = `<p class="alert alert-warning">El diferencial activo-pasivo significativo en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        indica importante inhibición neuromuscular, posible desacondicionamiento de estabilizadores profundos o alteración del control sensoriomotor cervical. 
        Priorizar reentrenamiento motor con retroalimentación y considerar evaluación de mecanismos de sensibilización central.</p>`;
        break;
      case 'hombro':
        interpretacion = `<p class="alert alert-warning">El diferencial activo-pasivo significativo en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        sugiere marcada disfunción del control neuromuscular, posible inhibición artrogénica o miedo al movimiento. 
        Recomendado abordaje integrado con reeducación del ritmo escapulohumeral y trabajo progresivo de confianza en el movimiento.</p>`;
        break;
      case 'lumbar':
        interpretacion = `<p class="alert alert-warning">El diferencial activo-pasivo significativo en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        indica importante alteración del control motor y posible inhibición por dolor. Considerar evaluación específica de mecanismos centrales de procesamiento del dolor
        y priorizar reentrenamiento de estabilizadores locales con progresión gradual a patrones funcionales.</p>`;
        break;
      default:
        interpretacion = `<p class="alert alert-warning">El diferencial activo-pasivo significativo en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        indica importante alteración del control neuromuscular o posible inhibición por dolor/miedo al movimiento. 
        Considerar enfoque biopsicosocial incluyendo técnicas de exposición gradual al movimiento y reeducación neuromuscular.</p>`;
    }
  }
  
  // Añadir interpretación al elemento existente (sin reemplazar contenido previo)
  // Primero verificar si ya existe una interpretación similar para evitar duplicados
  if (!interpretacionElement.innerHTML.includes(obtenerNombreMovimiento(baseId)) || 
      !interpretacionElement.innerHTML.includes(`${diferencia}°`)) {
    interpretacionElement.innerHTML += interpretacion;
  }
}

// Función auxiliar para obtener nombre descriptivo del movimiento
function obtenerNombreMovimiento(baseId) {
  const partes = baseId.split('_');
  const region = partes[0];
  let movimiento = "";
  
  // Manejar casos especiales
  if (partes.length >= 3 && (partes[1] === 'rot' && (partes[2] === 'int' || partes[2] === 'ext'))) {
    // Caso de rotación interna/externa
    movimiento = partes[1] + '_' + partes[2]; // "rot_int" o "rot_ext"
  } 
  else if (partes.length >= 3 && (partes[1] === 'incl' && (partes[2] === 'der' || partes[2] === 'izq'))) {
    // Caso de inclinación derecha/izquierda
    movimiento = partes[1] + '_' + partes[2]; // "incl_der" o "incl_izq"
  }
  else if (partes.length >= 4 && (partes[2] === 'izq' || partes[2] === 'der')) {
    // Caso de movimiento bilateral con lado
    movimiento = partes[1];
    const lado = partes[2] === 'izq' ? 'izquierdo' : 'derecho';
    region = `${region} ${lado}`;
  }
  else {
    // Caso estándar
    movimiento = extraerMovimientoDesdeId(baseId);
  }
  
  const mapaMovimientos = {
    "flexion": "flexión",
    "extension": "extensión",
    "abduccion": "abducción",
    "aduccion": "aducción",
    "rot_int": "rotación interna",
    "rot_ext": "rotación externa",
    "incl_der": "inclinación derecha",
    "incl_izq": "inclinación izquierda",
    "incl": "inclinación",
    "pron": "pronación",
    "sup": "supinación",
    "desv_rad": "desviación radial",
    "desv_cub": "desviación cubital"
  };
  
  const nombreMovimiento = mapaMovimientos[movimiento] || movimiento;
  
  // Mapeo para nombres de regiones
  const mapaRegiones = {
    "cervical": "columna cervical",
    "dorsal": "columna dorsal",
    "lumbar": "columna lumbar",
    "hombro": "hombro",
    "codo": "codo",
    "muneca": "muñeca",
    "cadera": "cadera",
    "rodilla": "rodilla",
    "tobillo": "tobillo",
    "atm": "ATM"
  };
  
  const nombreRegion = mapaRegiones[region] || region;
  return `${nombreMovimiento} de ${nombreRegion}`;
}

// Evaluar dolor durante ROM
function evaluarDolorROM(selector) {
  try {
    // Colorear el selector
    colorearSelector(selector);
    
    // Actualizar badge de estado
    const region = selector.id.split('_')[0];
    const romBadge = document.getElementById("rom-evaluation-badge") || document.getElementById(`rom-${region}-badge`);
    if (romBadge) {
      romBadge.innerHTML = "Evaluado";
      romBadge.className = "resultado-badge badge bg-success";
    }
    
    // Actualizar recomendaciones
    actualizarRecomendacionesROM(region);
    
    return true;
  } catch (error) {
    console.error(`Error en evaluarDolorROM para ${selector.id}:`, error);
    return false;
  }
}

// Evaluar la funcionalidad del ROM
function evaluarFuncionalidadROM(selector) {
  try {
    // Colorear el selector
    colorearSelector(selector);
    
    // Actualizar badge de estado
    const region = selector.id.split('_')[0];
    const romBadge = document.getElementById("rom-evaluation-badge") || document.getElementById(`rom-${region}-badge`);
    if (romBadge) {
      romBadge.innerHTML = "Evaluado";
      romBadge.className = "resultado-badge badge bg-success";
    }
    
    // Actualizar recomendaciones
    actualizarRecomendacionesROM(region);
    
    return true;
  } catch (error) {
    console.error(`Error en evaluarFuncionalidadROM para ${selector.id}:`, error);
    return false;
  }
}

// FUNCIÓN MEJORADA: Calcular déficit funcional por articulación
function calcularDeficitFuncional(inputId) {
  try {
    // Extraer región de la evaluación actual
    const partes = inputId.split("_");
    const region = partes[0]; // Ej: cervical, hombro, etc.
    
    console.log(`Calculando déficit funcional para región: ${region}`);
    
    // Obtener elementos de déficit para esta región
    const deficitTotalElement = document.getElementById(region + "_deficit_total");
    const deficitVisualElement = document.getElementById(region + "_deficit_visual");
    const interpretacionElement = document.getElementById(region + "_deficit_interpretacion");
    const impactoActividadesElement = document.getElementById(region + "_impacto_actividades");
    
    if (!deficitTotalElement) {
      console.log(`Elemento de déficit total no encontrado para ${region}`);
      return 0;
    }
    
    if (!deficitVisualElement) {
      console.log(`Elemento visual de déficit no encontrado para ${region}`);
      // No salimos de la función, seguimos calculando
    }
    
    // Recopilar todos los inputs de ROM activo para esta región
    // Manejar caso especial para hombro (bilateral)
    let selectorActivos = '';
    if (region === 'hombro') {
      selectorActivos = `input[id^="${region}_"][id*="_activo"]`;
    } else {
      selectorActivos = `input[id^="${region}_"][id$="_activo"]`;
    }
    
    const inputsActivos = document.querySelectorAll(selectorActivos);
    console.log(`Encontrados ${inputsActivos.length} inputs activos para ${region}`);
    
    // Si no hay inputs suficientes, salir
    if (inputsActivos.length === 0) {
      console.log(`No se encontraron inputs activos para ${region}`);
      return 0;
    }
    
    // Calcular déficit promedio
    let totalDeficit = 0;
    let movimientosEvaluados = 0;
    
    inputsActivos.forEach(input => {
      const valor = parseFloat(input.value);
      if (!isNaN(valor)) {
        // Obtener el movimiento base (flexion, extension, etc.)
        const movimiento = extraerMovimientoDesdeId(input.id);
        
        // Obtener valor normativo
        const valorNormativo = obtenerValorNormativo(region, movimiento);
        
        if (valorNormativo > 0) {
          // Calcular déficit en porcentaje
          const deficitPorcentaje = Math.max(0, Math.min(100, 100 - (valor / valorNormativo * 100)));
          totalDeficit += deficitPorcentaje;
          movimientosEvaluados++;
          
          console.log(`  ${input.id}: valor=${valor}, normativo=${valorNormativo}, déficit=${deficitPorcentaje.toFixed(1)}%`);
        } else {
          console.log(`  ${input.id}: No se encontró valor normativo para ${region} - ${movimiento}`);
        }
      }
    });
    
    // Si no hay movimientos evaluados, salir
    if (movimientosEvaluados === 0) {
      console.log(`No hay movimientos evaluados con valor para ${region}`);
      return 0;
    }
    
    // Calcular déficit promedio
    const deficitPromedio = totalDeficit / movimientosEvaluados;
    console.log(`Déficit promedio para ${region}: ${deficitPromedio.toFixed(1)}%`);
    
    // Actualizar elementos visuales
    deficitTotalElement.value = deficitPromedio.toFixed(1) + "%";
    
    // Actualizar barra visual si existe
    if (deficitVisualElement) {
      // Verificar si existe la barra de progreso
      let barraProgreso = deficitVisualElement.querySelector('.progress-bar');
      
      // Si no existe, crearla
      if (!barraProgreso) {
        deficitVisualElement.innerHTML = '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>';
        barraProgreso = deficitVisualElement.querySelector('.progress-bar');
      }
      
      // Actualizar la barra
      if (barraProgreso) {
        barraProgreso.style.width = deficitPromedio + "%";
        
        // Cambiar color según severidad
        let colorClase = "";
        
        if (deficitPromedio < 10) {
          colorClase = "bg-success";
        } else if (deficitPromedio < 25) {
          colorClase = "bg-info";
        } else if (deficitPromedio < 50) {
          colorClase = "bg-warning";
        } else {
          colorClase = "bg-danger";
        }
        
        barraProgreso.className = `progress-bar ${colorClase}`;
      }
    }
    
    // Actualizar interpretación si existe el elemento
    if (interpretacionElement) {
      // Determinar interpretación
      let interpretacion = "";
      
      if (deficitPromedio < 10) {
        interpretacion = "Limitación mínima";
      } else if (deficitPromedio < 25) {
        interpretacion = "Limitación leve";
      } else if (deficitPromedio < 50) {
        interpretacion = "Limitación moderada";
      } else {
        interpretacion = "Limitación severa";
      }
      
      // Limpiar opciones existentes
      interpretacionElement.innerHTML = '';
      const option = document.createElement('option');
      option.value = interpretacion.toLowerCase().replace(" ", "_");
      option.text = interpretacion;
      option.selected = true;
      interpretacionElement.appendChild(option);
    }
    
    // Actualizar impacto en actividades si existe el elemento
    if (impactoActividadesElement) {
      actualizarImpactoActividades(region, deficitPromedio);
    }
    
    // Forzar actualización de recomendaciones
    actualizarRecomendacionesROM(region);
    
    // Devolver el déficit para uso en otras funciones
    return deficitPromedio;
  } catch (error) {
    console.error(`Error en calcularDeficitFuncional para ${inputId}:`, error);
    return 0;
  }
}

// FUNCIÓN MEJORADA: Obtener valor normativo para un movimiento específico
function obtenerValorNormativo(region, movimiento) {
  try {
    // Normalizar el movimiento para casos especiales
    let movNormalizado = movimiento;
    
    // Normalizar inclinaciones
    if (movimiento.includes('incl_')) {
      movNormalizado = 'incl';
    }
    // Normalizar rotaciones
    else if (movimiento.includes('rot_') && !movimiento.includes('rot_int') && !movimiento.includes('rot_ext')) {
      movNormalizado = 'rot';
    }
    
    // Mapa completo de valores normativos según región y movimiento
    const valoresNormativos = {
      "cervical": {
        "flexion": 45,
        "extension": 45,
        "incl": 45,
        "rot": 70
      },
      "hombro": {
        "flexion": 180,
        "extension": 50,
        "abduccion": 180,
        "aduccion": 30,
        "rot_int": 70,
        "rot_ext": 90
      },
      "dorsal": {
        "flexion": 45,
        "extension": 25,
        "incl": 20,
        "rot": 35
      },
      "lumbar": {
        "flexion": 60,
        "extension": 25,
        "incl": 25,
        "rot": 30
      },
      "pelvis": {
        "anteversion": 15,
        "retroversion": 15,
        "elevacion": 10,
        "rotacion": 15
      },
      "codo": {
        "flexion": 150,
        "extension": 0,
        "supinacion": 85,
        "pronacion": 80
      },
      "muneca": {
        "flexion": 80,
        "extension": 70,
        "desv_rad": 20,
        "desv_cub": 30
      },
      "cadera": {
        "flexion": 120,
        "extension": 30,
        "abduccion": 45,
        "aduccion": 30,
        "rot_int": 45,
        "rot_ext": 45
      },
      "rodilla": {
        "flexion": 135,
        "extension": 0
      },
      "tobillo": {
        "dorsiflexion": 20,
        "plantiflexion": 50,
        "inversion": 30,
        "eversion": 20
      },
      "atm": {
        "apertura": 40,
        "lateralizacion": 10,
        "protrusion": 10,
        "retrusion": 5
      }
    };
    
    // Intentar obtener el valor por movimiento normalizado
    if (valoresNormativos[region] && valoresNormativos[region][movNormalizado]) {
      return valoresNormativos[region][movNormalizado];
    }
    
    // Intentar obtener el valor por movimiento original
    if (valoresNormativos[region] && valoresNormativos[region][movimiento]) {
      return valoresNormativos[region][movimiento];
    }
    
    // Si no se encuentra, log y devolver 0
    console.log(`No se encontró valor normativo para ${region} - ${movimiento} (normalizado: ${movNormalizado})`);
    return 0;
  } catch (error) {
    console.error(`Error en obtenerValorNormativo para ${region} - ${movimiento}:`, error);
    return 0;
  }
}

// Obtener valores normativos ajustados por edad y sexo
function obtenerValoresNormativosPorEdadSexo(region, movimiento, edad, sexo) {
  // Valores normativos base (adulto promedio)
  const valoresBase = obtenerValorNormativo(region, movimiento);
  
  // Factores de ajuste según edad (porcentajes de reducción)
  const factoresEdad = {
    'menos30': 1.05, // 5% adicional para menores de 30
    '30-45': 1.0,    // Valor de referencia (adulto promedio)
    '46-60': 0.9,    // 10% de reducción
    '61-75': 0.8,    // 20% de reducción
    'mas75': 0.7     // 30% de reducción
  };
  
  // Determinar factor por edad
  let factorEdad = 1.0;
  if (edad < 30) {
    factorEdad = factoresEdad['menos30'];
  } else if (edad <= 45) {
    factorEdad = factoresEdad['30-45'];
  } else if (edad <= 60) {
    factorEdad = factoresEdad['46-60'];
  } else if (edad <= 75) {
    factorEdad = factoresEdad['61-75'];
  } else {
    factorEdad = factoresEdad['mas75'];
  }
  
  // Factores de ajuste según sexo (ligeras diferencias en algunas regiones)
  const factoresSexoRegiones = {
    'hombro': { 'M': 1.05, 'F': 0.95 },
    'cadera': { 'M': 0.95, 'F': 1.05 }
    // Otras regiones con diferencias significativas pueden añadirse aquí
  };
  
  // Determinar factor por sexo
  let factorSexo = 1.0;
  if (factoresSexoRegiones[region] && factoresSexoRegiones[region][sexo]) {
    factorSexo = factoresSexoRegiones[region][sexo];
  }
  
  // Calcular valor normativo ajustado
  const valorAjustado = valoresBase * factorEdad * factorSexo;
  
  return Math.round(valorAjustado);
}

// Actualizar impacto en actividades según déficit funcional
function actualizarImpactoActividades(region, deficitPromedio) {
  const impactoElement = document.getElementById(region + "_impacto_actividades");
  
  if (!impactoElement) {
    console.log(`No se encontró elemento de impacto para ${region}`);
    return;
  }
  
  // Limpiar lista actual
  impactoElement.innerHTML = "";
  
  // Si déficit es mínimo, mostrar mensaje positivo
  if (deficitPromedio < 10) {
    impactoElement.innerHTML = '<li class="list-group-item list-group-item-success">Sin impacto significativo en actividades diarias.</li>';
    return;
  }
  
  // Definir actividades afectadas según región y nivel de déficit
  const actividades = obtenerActividadesAfectadas(region, deficitPromedio);
  
  // Crear elementos de lista para cada actividad
  actividades.forEach(actividad => {
    const item = document.createElement("li");
    item.className = `list-group-item ${actividad.colorClase}`;
    item.innerHTML = `<strong>${actividad.nombre}:</strong> ${actividad.impacto}`;
    impactoElement.appendChild(item);
  });
}

// Obtener actividades afectadas según región y déficit
function obtenerActividadesAfectadas(region, deficitPromedio) {
  const actividades = [];
  let colorClase = "";
  
  // Determinar color según déficit
  if (deficitPromedio < 25) {
    colorClase = "list-group-item-info";
  } else if (deficitPromedio < 50) {
    colorClase = "list-group-item-warning";
  } else {
    colorClase = "list-group-item-danger";
  }
  
  // Definir actividades según la región
  switch (region) {
    case "cervical":
      if (deficitPromedio >= 25) {
        actividades.push({
          nombre: "Conducción",
          impacto: "Dificultad para verificar puntos ciegos y realizar cambios de carril seguros.",
          colorClase: colorClase
        });
      }
      
      if (deficitPromedio >= 15) {
        actividades.push({
          nombre: "Uso de dispositivos",
          impacto: "Posible fatiga y dolor al usar computadoras o teléfonos por períodos prolongados.",
          colorClase: colorClase
        });
      }
      
      if (deficitPromedio >= 40) {
        actividades.push({
          nombre: "Actividades laborales",
          impacto: "Limitación significativa en trabajos que requieren movimientos frecuentes de cabeza.",
          colorClase: colorClase
        });
      }
      break;
      
    case "hombro":
      if (deficitPromedio >= 25) {
        actividades.push({
          nombre: "Vestirse",
          impacto: "Dificultad para colocarse prendas por encima de la cabeza o abrocharse detrás.",
          colorClase: colorClase
        });
      }
      
      if (deficitPromedio >= 15) {
        actividades.push({
          nombre: "Alcanzar objetos",
          impacto: "Limitación para alcanzar objetos en estantes altos o detrás del cuerpo.",
          colorClase: colorClase
        });
      }
      
      if (deficitPromedio >= 40) {
        actividades.push({
          nombre: "Cargar objetos",
          impacto: "Dificultad para levantar y transportar cargas por encima del nivel del hombro.",
          colorClase: colorClase
        });
      }
      break;
      
    // Otras regiones
    case "lumbar":
      if (deficitPromedio >= 25) {
        actividades.push({
          nombre: "Permanecer de pie",
          impacto: "Dificultad para mantener postura de pie prolongada sin dolor o fatiga.",
          colorClase: colorClase
        });
      }
      
      if (deficitPromedio >= 20) {
        actividades.push({
          nombre: "Actividades del hogar",
          impacto: "Limitación para barrer, limpiar, levantar objetos del suelo sin compensaciones.",
          colorClase: colorClase
        });
      }
      break;
      
    case "cadera":
      if (deficitPromedio >= 25) {
        actividades.push({
          nombre: "Caminar distancias",
          impacto: "Dificultad para recorrer distancias prolongadas sin fatiga o dolor.",
          colorClase: colorClase
        });
      }
      
      if (deficitPromedio >= 20) {
        actividades.push({
          nombre: "Subir escaleras",
          impacto: "Limitación para subir escaleras con patrón recíproco normal.",
          colorClase: colorClase
        });
      }
      break;
    
    default:
      actividades.push({
        nombre: "Actividades generales",
        impacto: "Posibles limitaciones en actividades que requieren movimientos completos.",
        colorClase: colorClase
      });
  }
  
  return actividades;
}

// FUNCIÓN MEJORADA: Actualizar las recomendaciones basadas en la evaluación
function actualizarRecomendacionesROM(region) {
  try {
    console.log(`Actualizando recomendaciones para ${region}`);
    
    // Elementos de interpretación y recomendaciones
    const interpretacionElement = document.getElementById(`interpretacion-${region}-texto`);
    const recomendacionesElement = document.getElementById(`recomendaciones-${region}-texto`);
    const consideracionesElement = document.getElementById(`consideraciones-${region}-texto`);
    
    if (!interpretacionElement) {
      console.log(`No se encontró elemento interpretacion-${region}-texto`);
      return false;
    }
    if (!recomendacionesElement) {
      console.log(`No se encontró elemento recomendaciones-${region}-texto`);
      return false;
    }
    
    // Recopilar todos los datos para esta región
    const datos = recopilarDatosROM(region);
    console.log(`Datos recopilados para actualizar recomendaciones de ${region}:`, datos);
    
    // Verificar si hay algún dato disponible (incluso solo dolor o funcionalidad)
    const hayDatos = 
      Object.keys(datos.rangosActivos).length > 0 || 
      Object.keys(datos.dolores).length > 0 || 
      Object.keys(datos.funcionalidades).length > 0;
    
    // Si no hay ningún dato, mostrar mensaje básico y salir
    if (!hayDatos) {
      interpretacionElement.innerHTML = `<p class="alert alert-info">Complete la evaluación de ${region} para generar interpretaciones.</p>`;
      recomendacionesElement.innerHTML = `<p>Añada valores de rango de movimiento, dolor o funcionalidad para obtener recomendaciones.</p>`;
      if (consideracionesElement) {
        consideracionesElement.innerHTML = `<p>Complete la evaluación para recibir consideraciones específicas.</p>`;
      }
      return false;
    }
    
    // Generar interpretación
    let interpretacion = generarInterpretacionROM(region, datos);
    interpretacionElement.innerHTML = interpretacion;
    
    // Generar recomendaciones
    let recomendaciones = generarRecomendacionesROM(region, datos);
    recomendacionesElement.innerHTML = recomendaciones;
    
    // Generar consideraciones si existe el elemento
    if (consideracionesElement) {
      let consideraciones = generarConsideracionesROM(region, datos);
      consideracionesElement.innerHTML = consideraciones;
    }
    
    // Actualizar badge de estado
    const romBadge = document.getElementById("rom-evaluation-badge") || document.getElementById(`rom-${region}-badge`);
    if (romBadge) {
      romBadge.innerHTML = "Evaluado";
      romBadge.className = "resultado-badge badge bg-success";
    }
    
    console.log(`Recomendaciones actualizadas para ${region}`);
    return true;
  } catch (error) {
    console.error(`Error en actualizarRecomendacionesROM para ${region}:`, error);
    return false;
  }
}
// FUNCIÓN MEJORADA: Recopilar datos ROM
function recopilarDatosROM(region) {
  try {
    console.log(`Recopilando datos para región: ${region}`);
    
    const datos = {
      rangosActivos: {},
      rangosPasivos: {},
      diferenciales: {},
      dolores: {},
      funcionalidades: {},
      movimientosAccesorios: {}
    };
    
    // RECOPILACIÓN MEJORADA DE DOLOR
    // Para regiones bilaterales como hombro, los selectores de dolor no tienen indicación de lado
    let selectoresDolor;
    
    if (region === 'hombro' || region === 'cadera') {
      // Enfoque especial para regiones bilaterales
      // Buscamos los selectores de dolor que NO tienen _izq_ o _der_ en su ID
      selectoresDolor = document.querySelectorAll(`select[id^="${region}_"][id$="_dolor"]:not([id*="_izq_"]):not([id*="_der_"])`);
    } else {
      // Enfoque estándar para otras regiones
      selectoresDolor = document.querySelectorAll(`select[id^="${region}_"][id$="_dolor"]`);
    }
    
    console.log(`Encontrados ${selectoresDolor.length} selectores de dolor para ${region}`);
    
    selectoresDolor.forEach(select => {
      if (select.value) {
        // Extraer el movimiento del ID (parte entre 'region_' y '_dolor')
        const idCompleto = select.id;
        const movimientoCompleto = idCompleto.replace(`${region}_`, '').replace('_dolor', '');
        
        datos.dolores[movimientoCompleto] = select.value;
        console.log(`Dolor en ${movimientoCompleto}: ${select.value}`);
      }
    });
    
    // RECOPILACIÓN MEJORADA DE FUNCIONALIDAD
    // Similar al enfoque para dolor
    let selectoresFuncionalidad;
    
    if (region === 'hombro' || region === 'cadera') {
      selectoresFuncionalidad = document.querySelectorAll(`select[id^="${region}_"][id$="_funcionalidad"]:not([id*="_izq_"]):not([id*="_der_"])`);
    } else {
      selectoresFuncionalidad = document.querySelectorAll(`select[id^="${region}_"][id$="_funcionalidad"]`);
    }
    
    console.log(`Encontrados ${selectoresFuncionalidad.length} selectores de funcionalidad para ${region}`);
    
    selectoresFuncionalidad.forEach(select => {
      if (select.value) {
        const idCompleto = select.id;
        const movimientoCompleto = idCompleto.replace(`${region}_`, '').replace('_funcionalidad', '');
        
        datos.funcionalidades[movimientoCompleto] = select.value;
        console.log(`Funcionalidad en ${movimientoCompleto}: ${select.value}`);
      }
    });
    
    // RECOPILACIÓN DE RANGOS ACTIVOS Y PASIVOS
    // Para hombro y otras regiones bilaterales, necesitamos manejar ambos lados
    let selectorActivos = '';
    
    if (region === 'hombro' || region === 'cadera') {
      // Para hombro buscamos patrones que incluyan _izq_ o _der_
      selectorActivos = `input[id^="${region}_"][id*="_activo"]`;
    } else {
      // Para otras regiones usamos el patrón estándar
      selectorActivos = `input[id^="${region}_"][id$="_activo"]`;
    }
    
    const inputsActivos = document.querySelectorAll(selectorActivos);
    console.log(`Encontrados ${inputsActivos.length} inputs activos para ${region}`);
    
    inputsActivos.forEach(input => {
      if (input.value) {
        const valor = parseFloat(input.value);
        let movimientoCompleto = '';
        
        // Manejar diferentes patrones de IDs
        if (input.id.includes('_izq_') || input.id.includes('_der_')) {
          // Caso con lado (hombro)
          const partes = input.id.split('_');
          const indiceLado = partes.findIndex(p => p === 'izq' || p === 'der');
          
          if (indiceLado > 0) {
            // Extraer movimiento y lado
            const movimiento = partes[1]; // Asumimos que el movimiento es siempre la segunda parte
            const lado = partes[indiceLado];
            movimientoCompleto = `${movimiento}_${lado}`;
          }
        } else {
          // Caso estándar
          movimientoCompleto = input.id.replace(`${region}_`, '').replace('_activo', '');
        }
        
        if (movimientoCompleto) {
          // Guardar valor activo
          datos.rangosActivos[movimientoCompleto] = valor;
          
          // Buscar y guardar valor pasivo correspondiente
          const idPasivo = input.id.replace('_activo', '_pasivo');
          const inputPasivo = document.getElementById(idPasivo);
          
          if (inputPasivo && inputPasivo.value) {
            const valorPasivo = parseFloat(inputPasivo.value);
            datos.rangosPasivos[movimientoCompleto] = valorPasivo;
            
            // Calcular diferencial
            datos.diferenciales[movimientoCompleto] = valorPasivo - valor;
          }
          
          console.log(`Rango activo para ${movimientoCompleto}: ${valor}`);
        }
      }
    });
    
    // RECOPILACIÓN DE MOVIMIENTOS ACCESORIOS
    const selectoresAccesorios = document.querySelectorAll(`select[id^="${region}_acc_"][id$="_calidad"]`);
    console.log(`Encontrados ${selectoresAccesorios.length} selectores de movimientos accesorios para ${region}`);
    
    selectoresAccesorios.forEach(select => {
      if (select.value) {
        const idBase = select.id.replace("_calidad", "");
        const nombre = idBase.replace(`${region}_acc_`, "");
        const dolorSelector = document.getElementById(idBase + "_dolor");
        const dolor = dolorSelector ? dolorSelector.value : "No";
        
        datos.movimientosAccesorios[nombre] = {
          calidad: select.value,
          dolor: dolor
        };
        
        console.log(`Movimiento accesorio ${nombre}: calidad=${select.value}, dolor=${dolor}`);
      }
    });
    
    console.log(`Datos completamente recopilados para ${region}:`, datos);
    return datos;
  } catch (error) {
    console.error(`Error en recopilarDatosROM para ${region}:`, error);
    // Devolver datos vacíos en caso de error
    return {
      rangosActivos: {},
      rangosPasivos: {},
      diferenciales: {},
      dolores: {},
      funcionalidades: {},
      movimientosAccesorios: {}
    };
  }
}

// FUNCIÓN MEJORADA: Generar interpretación basada en los datos
function generarInterpretacionROM(region, datos) {
  try {
    let interpretacion = "";
    let limitacionesSeveras = 0;
    let limitacionesModeradas = 0;
    let limitacionesLeves = 0;
    let movimientosDolorosos = 0;
    let diferencialSignificativo = false;
    
    // Contar limitaciones por severidad
    for (const movimiento in datos.funcionalidades) {
      switch (datos.funcionalidades[movimiento]) {
        case "Limitación severa":
          limitacionesSeveras++;
          break;
        case "Limitación moderada":
          limitacionesModeradas++;
          break;
        case "Limitación leve":
          limitacionesLeves++;
          break;
      }
    }

    // Contar movimientos dolorosos
    for (const movimiento in datos.dolores) {
      if (datos.dolores[movimiento] !== "No") {
        movimientosDolorosos++;
      }
    }
    
    // Verificar diferenciales significativos
    for (const movimiento in datos.diferenciales) {
      if (datos.diferenciales[movimiento] > 15) {
        diferencialSignificativo = true;
        break;
      }
    }
    
    // Construir interpretación basada en CUALQUIER dato disponible
    
    // Si hay datos de funcionalidad
    if (limitacionesSeveras > 0 || limitacionesModeradas > 0 || limitacionesLeves > 0) {
      if (limitacionesSeveras > 0) {
        interpretacion += `<p class="alert alert-danger">Se observa limitación severa en ${limitacionesSeveras} movimiento(s) de ${region}, `;
        interpretacion += `indicando un compromiso importante de la movilidad con potencial impacto funcional significativo.</p>`;
      } else if (limitacionesModeradas > 0) {
        interpretacion += `<p class="alert alert-warning">Se observa limitación moderada en ${limitacionesModeradas} movimiento(s) de ${region}, `;
        interpretacion += `sugiriendo restricción de movilidad con impacto funcional moderado.</p>`;
      } else if (limitacionesLeves > 0) {
        interpretacion += `<p class="alert alert-info">Se observa limitación leve en ${limitacionesLeves} movimiento(s) de ${region}, `;
        interpretacion += `indicando restricciones menores que podrían impactar algunas actividades específicas.</p>`;
      }
    } 
    // Si no hay datos de funcionalidad pero hay rangos medidos
    else if (Object.keys(datos.rangosActivos).length > 0) {
      // Verificar si hay déficit según rangos medidos
      let movimientosLimitados = 0;
      for (const movimiento in datos.rangosActivos) {
        // Extraer el movimiento base para verificar valor normativo
        let movimientoBase = movimiento;
        
        // Para movimientos con lado (izq/der), extraer solo la parte del movimiento
        if (movimiento.includes('_izq') || movimiento.includes('_der')) {
          movimientoBase = movimiento.split('_').slice(0, -1).join('_');
        }
        
        const valorNormativo = obtenerValorNormativo(region, movimientoBase);
        if (valorNormativo > 0 && datos.rangosActivos[movimiento] < valorNormativo * 0.9) {
          movimientosLimitados++;
        }
      }
      
      if (movimientosLimitados > 0) {
        interpretacion += `<p class="alert alert-info">Se detectan ${movimientosLimitados} movimiento(s) con rangos por debajo de valores normativos. `;
        interpretacion += `Se recomienda completar la evaluación de funcionalidad para una interpretación más precisa.</p>`;
      } else {
        interpretacion += `<p class="alert alert-success">Los rangos de movimiento de ${region} se encuentran dentro de parámetros normales o funcionales.</p>`;
      }
    } 
   // Si solo hay datos de dolor
    else if (movimientosDolorosos > 0) {
      interpretacion += `<p class="alert alert-warning">Se ha reportado dolor en ${movimientosDolorosos} movimiento(s) de ${region}. `;
      interpretacion += `Se recomienda completar la evaluación de rangos y funcionalidad para una interpretación más completa.</p>`;
    } 
    // Si no hay datos concretos, pero se inició la evaluación
    else {
      interpretacion += `<p class="alert alert-info">Se ha iniciado la evaluación de ${region}. Complete los campos de rango de movimiento, funcionalidad o dolor para generar una interpretación detallada.</p>`;
    }
    
    // Añadir interpretación sobre dolor si hay datos
    if (movimientosDolorosos > 0 && (limitacionesSeveras > 0 || limitacionesModeradas > 0 || limitacionesLeves > 0 || Object.keys(datos.rangosActivos).length > 0)) {
      interpretacion += `<p>Se evidencia dolor durante ${movimientosDolorosos} movimiento(s), lo que sugiere componente inflamatorio o sensibilización.</p>`;
    }
    
    // Añadir interpretación sobre diferenciales si hay datos
    if (diferencialSignificativo) {
      interpretacion += `<p>El diferencial activo-pasivo significativo sugiere posible inhibición neuromuscular o debilidad muscular específica.</p>`;
    }

    // Interpretar movimientos accesorios si hay datos
    if (datos.movimientosAccesorios && Object.keys(datos.movimientosAccesorios).length > 0) {
      interpretacion += `<p><strong>Movimientos accesorios:</strong> `;
      
      const moveHipomoviles = [];
      const moveHipermoviles = [];
      const moveBloqueados = [];
      
      for (const mov in datos.movimientosAccesorios) {
        const calidad = datos.movimientosAccesorios[mov].calidad;
        const nombreMov = mov.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (calidad === "Hipomóvil") {
          moveHipomoviles.push(nombreMov);
        } else if (calidad === "Hipermóvil") {
          moveHipermoviles.push(nombreMov);
        } else if (calidad === "Bloqueado") {
          moveBloqueados.push(nombreMov);
        }
      }
      
      if (moveBloqueados.length > 0) {
        interpretacion += `Se detecta bloqueo en: ${moveBloqueados.join(", ")}. `;
      }
      
      if (moveHipomoviles.length > 0) {
        interpretacion += `Movilidad reducida en: ${moveHipomoviles.join(", ")}. `;
      }
      
      if (moveHipermoviles.length > 0) {
        interpretacion += `Hipermobilidad en: ${moveHipermoviles.join(", ")}. `;
      }
      
      interpretacion += `</p>`;
    }
    
    return interpretacion;
  } catch (error) {
    console.error(`Error en generarInterpretacionROM para ${region}:`, error);
    return "<p class='alert alert-danger'>Error al generar la interpretación. Por favor, inténtelo de nuevo o contacte al soporte técnico.</p>";
  }
}

// FUNCIÓN MEJORADA: Generar recomendaciones basadas en los datos
function generarRecomendacionesROM(region, datos) {
  try {
    let recomendaciones = "<ul>";
    let limitacionesSeveras = 0;
    let limitacionesModeradas = 0;
    let limitacionesLeves = 0;
    let movimientosDolorosos = 0;
    let diferencialSignificativo = false;
    
    // Contar limitaciones por severidad
    for (const movimiento in datos.funcionalidades) {
      switch (datos.funcionalidades[movimiento]) {
        case "Limitación severa":
          limitacionesSeveras++;
          break;
        case "Limitación moderada":
          limitacionesModeradas++;
          break;
        case "Limitación leve":
          limitacionesLeves++;
          break;
      }
    }
    
    // Contar movimientos dolorosos
    for (const movimiento in datos.dolores) {
      if (datos.dolores[movimiento] !== "No") {
        movimientosDolorosos++;
      }
    }
    
    // Verificar diferenciales significativos
    for (const movimiento in datos.diferenciales) {
      if (datos.diferenciales[movimiento] > 15) {
        diferencialSignificativo = true;
        break;
      }
    }

    // Construir recomendaciones basadas en CUALQUIER dato disponible
    
    // Si hay datos de funcionalidad
    if (limitacionesSeveras > 0 || limitacionesModeradas > 0 || limitacionesLeves > 0) {
      if (limitacionesSeveras > 0) {
        recomendaciones += `<li>Priorizar técnicas para <strong>recuperación progresiva de la movilidad</strong> con abordaje gradual.</li>`;
        recomendaciones += `<li>Considerar tratamiento <strong>multimodal</strong> que incluya movilizaciones articulares y ejercicio terapéutico.</li>`;
        recomendaciones += `<li>Implementar programa de <strong>ejercicios domiciliarios</strong> con progresión controlada.</li>`;
      } else if (limitacionesModeradas > 0) {
        recomendaciones += `<li>Implementar técnicas de <strong>movilización articular específica</strong> para los movimientos comprometidos.</li>`;
        recomendaciones += `<li>Diseñar <strong>ejercicios de control motor</strong> con énfasis en calidad más que en rango.</li>`;
        recomendaciones += `<li>Monitorizar la <strong>progresión</strong> enfocándose en mejorar la funcionalidad para actividades diarias.</li>`;
      } else if (limitacionesLeves > 0) {
        recomendaciones += `<li>Realizar <strong>ejercicios de movilidad</strong> enfocados en los movimientos limitados.</li>`;
        recomendaciones += `<li>Integrar <strong>entrenamiento funcional</strong> que incluya los patrones de movimiento comprometidos.</li>`;
        recomendaciones += `<li>Educar sobre <strong>ergonomía y posturas</strong> para prevenir limitaciones adicionales.</li>`;
      }
    } 
    // Si solo hay datos de dolor
    else if (movimientosDolorosos > 0) {
      recomendaciones += `<li>Implementar <strong>evaluación detallada del dolor</strong> para identificar sus mecanismos y características.</li>`;
      recomendaciones += `<li>Considerar <strong>técnicas de neuromodulación</strong> y educación en neurociencia del dolor.</li>`;
      recomendaciones += `<li>Completar la evaluación de rangos para determinar el impacto del dolor en la movilidad funcional.</li>`;
    }
    // Si solo hay datos de rango
    else if (Object.keys(datos.rangosActivos).length > 0) {
      recomendaciones += `<li>Completar evaluación de funcionalidad y dolor para un abordaje terapéutico más específico.</li>`;
      recomendaciones += `<li>Implementar <strong>evaluación cualitativa</strong> de los movimientos además de la medición cuantitativa.</li>`;
      recomendaciones += `<li>Considerar impacto funcional de los rangos observados en actividades cotidianas.</li>`;
    }
    // Si no hay datos específicos
    else {
      recomendaciones += `<li>Complete la evaluación con datos de rangos de movimiento, dolor o funcionalidad para generar recomendaciones específicas.</li>`;
    }
    
    // Añadir recomendaciones específicas para dolor si hay datos
    if (movimientosDolorosos > 0 && (limitacionesSeveras > 0 || limitacionesModeradas > 0 || limitacionesLeves > 0)) {
      recomendaciones += `<li>Implementar estrategias de <strong>modulación del dolor</strong> durante las técnicas terapéuticas.</li>`;
      recomendaciones += `<li>Considerar <strong>dosificación gradual</strong> de la intensidad para no exacerbar síntomas.</li>`;
    }
    
    // Añadir recomendaciones para diferenciales si hay datos
    if (diferencialSignificativo) {
      recomendaciones += `<li>Incluir <strong>ejercicios de activación muscular</strong> específicos para mejorar el control neuromuscular.</li>`;
      recomendaciones += `<li>Considerar técnicas de <strong>facilitación neuromuscular propioceptiva</strong> para optimizar patrones de movimiento.</li>`;
    }
    
    recomendaciones += "</ul>";
    return recomendaciones;
  } catch (error) {
    console.error(`Error en generarRecomendacionesROM para ${region}:`, error);
    return "<p>Error al generar recomendaciones. Por favor, intente actualizar los datos o contacte al soporte técnico.</p>";
  }
}

// Generar consideraciones adicionales
function generarConsideracionesROM(region, datos) {
  try {
    // Consideraciones específicas según la región
    let consideraciones = "<ul>";
    
    switch (region) {
      case "cervical":
        consideraciones += `
          <li>Correlacionar los hallazgos con la evaluación postural de cabeza y cuello.</li>
          <li>Valorar la función de la musculatura profunda (flexores/extensores profundos) además de los rangos.</li>
          <li>Considerar la influencia de factores ergonómicos y posturales en el trabajo/actividades diarias.</li>
          <li>Evaluar la relación entre la movilidad cervical y la función vestibular/oculomotora en caso de síntomas asociados.</li>
          <li>Valorar posibles compensaciones de la cintura escapular durante los movimientos cervicales.</li>
        `;
        break;
      case "dorsal":
        consideraciones += `
          <li>Evaluar la relación con la mecánica respiratoria y expansión torácica.</li>
          <li>Considerar la interacción con la función de la cintura escapular y postura de hombros.</li>
          <li>Valorar posibles compensaciones lumbares o cervicales durante los movimientos.</li>
          <li>Relacionar los hallazgos con la evaluación postural global, especialmente cifosis.</li>
        `;
        break;
      case "lumbar":
        consideraciones += `
          <li>Correlacionar los hallazgos con el patrón de activación de la musculatura profunda local.</li>
          <li>Evaluar el efecto de la posición pélvica en la movilidad lumbar.</li>
          <li>Considerar factores de carga y ergonómicos en actividades cotidianas y laborales.</li>
          <li>Valorar la influencia de la flexibilidad de cadenas miofasciales en la movilidad.</li>
        `;
        break;
      case "hombro":
        consideraciones += `
          <li>Analizar la calidad del ritmo escapulohumeral durante los movimientos.</li>
          <li>Evaluar la estabilidad dinámica durante actividades funcionales.</li>
          <li>Considerar el efecto de la postura cervical y dorsal en la mecánica del hombro.</li>
          <li>Valorar patrones de reclutamiento muscular y posibles compensaciones.</li>
        `;
        break;
      // Otras regiones...
      default:
        consideraciones += `
          <li>Complete más datos de la evaluación para obtener consideraciones específicas.</li>
          <li>Correlacione los hallazgos con la historia clínica y mecanismos de lesión.</li>
          <li>Considere el impacto funcional en las actividades relevantes para el paciente.</li>
        `;
    }
    
    consideraciones += "</ul>";
    return consideraciones;
  } catch (error) {
    console.error(`Error en generarConsideracionesROM para ${region}:`, error);
    return "<ul><li>Error al generar consideraciones. Por favor, complete la evaluación e intente de nuevo.</li></ul>";
  }
}

// Mostrar interpretación del patrón capsular
function mostrarInterpretacionCapsular(region) {
  try {
    const patronSelect = document.getElementById(region + "_patron_capsular");
    const interpretacionElement = document.getElementById(region + "_interpretacion_capsular");
    const patronOtroContainer = document.getElementById(region + "_patron_otro_container");
    
    if (!patronSelect || !interpretacionElement) {
      console.log(`No se encontraron elementos para patrón capsular de ${region}`);
      return false;
    }
    
    // Mostrar/ocultar campo para "otro" patrón
    if (patronOtroContainer) {
      patronOtroContainer.style.display = patronSelect.value === "Otro" ? "block" : "none";
    }
    
    // Si no hay selección, mostrar mensaje por defecto
    if (!patronSelect.value) {
      interpretacionElement.innerHTML = "<p>Seleccione un patrón de restricción para obtener la interpretación clínica.</p>";
      return false;
    }
    
    // Si seleccionó "No presenta", mostrar mensaje correspondiente
    if (patronSelect.value === "No presenta") {
      interpretacionElement.innerHTML = `
        <p>No se identifica un patrón de restricción capsular, lo que sugiere que la limitación del movimiento probablemente no sea de origen capsular/articular.</p>
        <p>Considere evaluar:</p>
        <ul>
        <li>Factores neuromusculares (activación muscular, control motor)</li>
          <li>Aspectos propioceptivos o de confianza en el movimiento</li>
          <li>Factores posturales o compensatorios</li>
        </ul>
      `;
      return true;
    }
    
    // Interpretaciones específicas para cada patrón
    let interpretacion = "";
    
    // Patrones específicos según la región
    if (region === "cervical") {
      switch (patronSelect.value) {
        case "Rotación contralateral > Inclinación lateral contralateral > Extensión":
          interpretacion = `
            <p>Este patrón de restricción es consistente con <strong>disfunción de las articulaciones cigapofisarias (facetarias) C2-C7</strong>, particularmente en su componente de deslizamiento.</p>
            <p>Estructuras potencialmente involucradas:</p>
            <ul>
              <li>Cápsula articular facetaria (especialmente su porción posterior)</li>
              <li>Ligamentos longitudinales y potencialmente uncoarticulares</li>
            </ul>
            <p>Enfoque terapéutico recomendado (basado en evidencia):</p>
            <ul>
              <li>Técnicas de movilización articular específica para restaurar el deslizamiento facetario</li>
              <li>Ejercicios de control motor cervical con énfasis en rotación e inclinación lateral</li>
              <li>Reeducación neuromuscular con retroalimentación</li>
            </ul>
          `;
          break;
        // Otros casos cervicales pueden agregarse aquí
        default:
          interpretacion = `
            <p>El patrón de restricción identificado no corresponde con los patrones capsulares clásicos cervicales, lo que podría indicar una combinación de factores o un mecanismo no típico.</p>
            <p>Consideraciones clínicas:</p>
            <ul>
              <li>Evaluar factores neuromusculares y propioceptivos</li>
              <li>Considerar influencias de segmentos adyacentes</li>
              <li>Valorar aspectos posturales globales que puedan influir</li>
            </ul>
            <p>Se recomienda un abordaje integrado que combine técnicas articulares, neurodinámicas y de control motor adaptadas a las restricciones específicas observadas.</p>
          `;
      }
    } 
    // Patrones para el hombro (muy importantes)
    else if (region === "hombro") {
      switch (patronSelect.value) {
        case "Rotación externa > Abducción > Rotación interna":
          interpretacion = `
            <p>Este patrón de restricción es consistente con <strong>capsulitis adhesiva o "hombro congelado"</strong> en fase inicial-intermedia, con compromiso predominante de la cápsula anteroinferior.</p>
            <p>Estructuras potencialmente involucradas:</p>
            <ul>
              <li>Cápsula articular glenohumeral (especialmente porción anteroinferior)</li>
              <li>Ligamento glenohumeral inferior</li>
              <li>Receso axilar de la cápsula</li>
            </ul>
            <p>Enfoque terapéutico recomendado (basado en evidencia):</p>
            <ul>
              <li>Técnicas de movilización articular específicas para la cápsula anteroinferior</li>
              <li>Ejercicios pendulares y de deslizamiento gradual</li>
              <li>Progresión cautelosa respetando el umbral de dolor para evitar exacerbaciones</li>
              <li>Consideración de técnicas neuromoduladoras en casos de dolor severo</li>
            </ul>
          `;
          break;
          
        case "Rotación interna > Extensión > Rotación externa":
          interpretacion = `
            <p>Este patrón de restricción sugiere <strong>compromiso de la cápsula posterior</strong>, frecuentemente asociado a patologías que afectan el espacio posterior como:</p>
            <p>Estructuras potencialmente involucradas:</p>
            <ul>
              <li>Cápsula glenohumeral posterior</li>
              <li>Intervalo rotador posterior</li>
              <li>Posible tensión adaptativa en músculos rotadores externos</li>
            </ul>
            <p>Enfoque terapéutico recomendado (basado en evidencia):</p>
            <ul>
              <li>Técnicas de deslizamiento posterior y movilización específica del intervalo posterior</li>
              <li>Ejercicios de estiramiento gradual para la cápsula posterior</li>
              <li>Normalización del ritmo escapulohumeral y activación de estabilizadores escapulares</li>
              <li>En deportistas de lanzamiento, incluir programa de prevención específico</li>
            </ul>
          `;
          break;
          
        case "Flexión > Abducción > Rotación externa":
          interpretacion = `
            <p>Este patrón de restricción es compatible con <strong>compromiso de la cápsula inferior y anteroinferior</strong>, frecuentemente observado en:</p>
            <p>Estructuras potencialmente involucradas:</p>
            <ul>
              <li>Cápsula glenohumeral inferior</li>
              <li>Ligamento glenohumeral inferior (banda anterior)</li>
              <li>Posibles adherencias en el receso axilar</li>
            </ul>
            <p>Enfoque terapéutico recomendado (basado en evidencia):</p>
            <ul>
              <li>Técnicas de movilización con énfasis en el deslizamiento inferior y anterior</li>
              <li>Restauración progresiva de la movilidad respetando la irritabilidad articular</li>
              <li>Ejercicios de control motor para normalizar la artrocinemática</li>
              <li>Valoración y tratamiento de la función escapular asociada</li>
            </ul>
          `;
          break;
          
        default:
          interpretacion = `
            <p>El patrón de restricción identificado no corresponde con los patrones capsulares clásicos del hombro, lo que podría sugerir:</p>
            <ul>
              <li>Combinación de factores capsulares y no capsulares</li>
              <li>Mecanismos compensatorios por disfunción de la articulación escapulotorácica</li>
              <li>Posible implicación neurodinámica o alteración del control motor</li>
            </ul>
            <p>Se recomienda un abordaje que incluya:</p>
            <ul>
              <li>Evaluación completa del ritmo escapulohumeral</li>
              <li>Valoración de elementos neuromiofasciales regionales</li>
              <li>Técnicas combinadas articulares y neurodinámicas</li>
              <li>Reeducación del control motor del complejo del hombro</li>
            </ul>
          `;
      }
    }
    // Caso por defecto para otras regiones
    else {
      interpretacion = `<p>Seleccione un patrón de restricción para obtener una interpretación específica para esta región.</p>`;
    }
    
    // Actualizar elemento de interpretación
    interpretacionElement.innerHTML = interpretacion;
    return true;
  } catch (error) {
    console.error(`Error en mostrarInterpretacionCapsular para ${region}:`, error);
    return false;
  }
}

// Colorear selectores según su selección
function colorearSelector(selector) {
  try {
    // Obtener el color del atributo data-color de la opción seleccionada
    const opcionSeleccionada = selector.options[selector.selectedIndex];
    if (!opcionSeleccionada) return false;
    
    const colorClase = opcionSeleccionada.getAttribute('data-color');
    
    // Resetear todas las clases de color
    selector.className = selector.className.replace(/bg-\w+/g, '').trim();
    selector.classList.remove('text-white');
    
    // Añadir la clase base de formulario si no existe
    if (!selector.className.includes('form-select') && !selector.className.includes('form-control')) {
      selector.className += ' form-select';
    }
    
    // Añadir la clase de color según la selección
    if (colorClase) {
      selector.classList.add('bg-' + colorClase);
      
      // Si es un color oscuro, añadir texto blanco
      if (colorClase === 'primary' || colorClase === 'secondary' || colorClase === 'danger' || colorClase === 'dark' || colorClase === 'success') {
        selector.classList.add('text-white');
      }
    }
    
    // Actualizar las recomendaciones si es un selector relacionado con ROM
    if (selector.id.includes('_dolor') || selector.id.includes('_funcionalidad')) {
      const region = selector.id.split('_')[0]; // Obtiene la región (cervical, etc.)
      actualizarRecomendacionesROM(region);
    }
    
    return true;
  } catch (error) {
    console.error(`Error en colorearSelector para ${selector.id}:`, error);
    return false;
  }
}

// Función para actualizar estado de los acordeones
function actualizarEstadoAcordeones() {
  try {
    // Verificar estado del acordeón de patrones de movimiento
    const patronesInputs = document.querySelectorAll('#patrones-movimiento-content select[id$="_calidad"]');
    let patronesCompletados = 0;
    
    patronesInputs.forEach(input => {
      if (input.value) {
        patronesCompletados++;
      }
    });
    
    const patronesBadge = document.getElementById('patrones-movimiento-badge');
    if (patronesBadge) {
      if (patronesCompletados > 0) {
        patronesBadge.innerHTML = patronesCompletados + " evaluados";
        patronesBadge.className = "resultado-badge badge bg-info";
      } else {
        patronesBadge.innerHTML = "No completado";
        patronesBadge.className = "resultado-badge badge bg-secondary";
      }
    }
    
    // Verificar estado del acordeón de ROM
    const romInputs = document.querySelectorAll('.tabla-rom input[type="number"]');
    let romCompletados = 0;
    
    romInputs.forEach(input => {
      if (input.value) {
        romCompletados++;
      }
    });
    
    const romBadge = document.getElementById('rom-evaluation-badge');
    if (romBadge) {
      if (romCompletados > 0) {
        romBadge.innerHTML = "En progreso";
        romBadge.className = "resultado-badge badge bg-info";
      } else {
        romBadge.innerHTML = "No completado";
        romBadge.className = "resultado-badge badge bg-secondary";
      }
    }
    
    // Verificar estado de los subacordeones de regiones
    const regiones = ['cervical', 'dorsal', 'lumbar', 'pelvis', 'hombro', 'codo', 'muneca', 'cadera', 'rodilla', 'tobillo', 'atm'];
    
    regiones.forEach(region => {
      const regionInputs = document.querySelectorAll(`input[id^="${region}_"][type="number"]`);
      let regionCompletados = 0;
      
      regionInputs.forEach(input => {
        if (input.value) {
          regionCompletados++;
        }
      });
      
      const regionBadge = document.getElementById(`rom-${region}-badge`);
      if (regionBadge) {
        if (regionCompletados > 0) {
          regionBadge.innerHTML = "Evaluado";
          regionBadge.className = "resultado-badge badge bg-success";
        } else {
          regionBadge.innerHTML = "No completado";
          regionBadge.className = "resultado-badge badge bg-secondary";
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error en actualizarEstadoAcordeones:", error);
    return false;
  }
}

// Función para cargar datos guardados (si existen)
function cargarDatosGuardados() {
  try {
    // Esta función debería implementarse según tu sistema de almacenamiento
    // Podría recuperar datos de localStorage, sessionStorage o de tu backend
    
    // Ejemplo para localStorage:
    const datosGuardados = localStorage.getItem('datos_patrones_movimiento');
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados);
        // Restaurar valores en los campos
        for (const id in datos) {
          const elemento = document.getElementById(id);
          if (elemento) {
            if (elemento.type === 'checkbox') {
              elemento.checked = datos[id];
            } else {
              elemento.value = datos[id];
            }
            
            // Trigger change events para actualizar UI
            if (elemento.tagName === 'SELECT') {
              if (id.endsWith('_calidad')) {
                evaluarPatronMovimiento(elemento, id.replace('_calidad', ''));
              } else if (id.endsWith('_impacto')) {
                actualizarImpactoFuncional(id.replace('_impacto', ''));
              } else if (id.endsWith('_dolor') || id.endsWith('_funcionalidad')) {
                colorearSelector(elemento);
              }
            } else if (elemento.tagName === 'INPUT' && elemento.type === 'number') {
              // Trigger evaluación para inputs numéricos
              if (id.endsWith('_activo')) {
                evaluarROM(id);
              } else if (id.endsWith('_pasivo')) {
                const baseId = id.replace('_pasivo', '');
                calcularDiferencialAP(baseId);
              }
            }
          }
        }
        
        // Actualizar interpretaciones y visualizaciones
        actualizarResumenVisual();
        
        // Actualizar todos los cálculos de déficit
        const regiones = ['cervical', 'dorsal', 'lumbar', 'pelvis', 'hombro', 'codo', 'muneca', 'cadera', 'rodilla', 'tobillo', 'atm'];
        regiones.forEach(region => {
          // Usar cualquier input activo como referencia
          const primerInput = document.querySelector(`input[id^="${region}_"][id$="_activo"]`);
          if (primerInput) {
            calcularDeficitFuncional(primerInput.id);
            actualizarRecomendacionesROM(region);
          }
        });
        
        console.log("Datos cargados correctamente");
        return true;
      } catch (error) {
        console.error("Error al cargar datos guardados:", error);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error("Error en cargarDatosGuardados:", error);
    return false;
  }
}

// Sistema de puntuación global
function calcularPuntuacionGlobal() {
  try {
    const regiones = ['cervical', 'dorsal', 'lumbar', 'pelvis', 'hombro', 'codo', 'muneca', 'cadera', 'rodilla', 'tobillo', 'atm'];
    const puntuaciones = {};
    let puntuacionTotal = 0;
    let regionesEvaluadas = 0;
    
    // Recorrer cada región
    regiones.forEach(region => {
      const deficitElement = document.getElementById(`${region}_deficit_total`);
      if (deficitElement && deficitElement.value) {
        // Extraer el valor numérico del déficit (eliminar el símbolo %)
        const deficitValue = parseFloat(deficitElement.value.replace('%', ''));
        if (!isNaN(deficitValue)) {
          // Convertir déficit a puntuación (mayor déficit = menor puntuación)
          const puntuacion = Math.max(0, 100 - deficitValue);
          puntuaciones[region] = puntuacion;
          puntuacionTotal += puntuacion;
          regionesEvaluadas++;
        }
      }
    });
    
    // Calcular promedio si hay regiones evaluadas
    const puntuacionPromedio = regionesEvaluadas > 0 ? puntuacionTotal / regionesEvaluadas : 0;
    
    // Actualizar UI con puntuación global
    const puntuacionGlobalElement = document.getElementById('puntuacion_global');
    if (puntuacionGlobalElement) {
      puntuacionGlobalElement.value = puntuacionPromedio.toFixed(1) + '/100';
      
      // Actualizar barra visual
      const barraGlobal = document.getElementById('puntuacion_global_visual');
      if (barraGlobal && barraGlobal.querySelector('.progress-bar')) {
        barraGlobal.querySelector('.progress-bar').style.width = puntuacionPromedio + "%";
        
        // Asignar color según puntuación
        let colorClase = '';
        if (puntuacionPromedio >= 80) {
          colorClase = 'bg-success';
        } else if (puntuacionPromedio >= 60) {
          colorClase = 'bg-info';
        } else if (puntuacionPromedio >= 40) {
          colorClase = 'bg-warning';
        } else {
          colorClase = 'bg-danger';
        }
        
        barraGlobal.querySelector('.progress-bar').className = `progress-bar ${colorClase}`;
      }
    }
    
    // Actualizar tabla de puntuaciones por región
    actualizarTablaPuntuacionesRegion(puntuaciones);
    
    return {
      puntuaciones: puntuaciones,
      puntuacionPromedio: puntuacionPromedio
    };
  } catch (error) {
    console.error("Error en calcularPuntuacionGlobal:", error);
    return {
      puntuaciones: {},
      puntuacionPromedio: 0
    };
  }
}

function actualizarTablaPuntuacionesRegion(puntuaciones) {
  try {
    const tablaBody = document.getElementById('tabla_puntuaciones_cuerpo');
    if (!tablaBody) return false;
    
    // Limpiar tabla
    tablaBody.innerHTML = '';
    
    // Mapeo de nombres descriptivos
    const nombresRegiones = {
      'cervical': 'Columna Cervical',
      'dorsal': 'Columna Dorsal',
      'lumbar': 'Columna Lumbar',
      'pelvis': 'Pelvis/Sacroilíaca',
      'hombro': 'Hombro',
      'codo': 'Codo y Antebrazo',
      'muneca': 'Muñeca y Mano',
      'cadera': 'Cadera',
      'rodilla': 'Rodilla',
      'tobillo': 'Tobillo y Pie',
      'atm': 'ATM'
    };
    
    // Ordenar regiones por puntuación (menor a mayor)
    const regionesOrdenadas = Object.keys(puntuaciones).sort((a, b) => puntuaciones[a] - puntuaciones[b]);
    
    // Crear filas para cada región
    regionesOrdenadas.forEach(region => {
      const puntuacion = puntuaciones[region];
      const fila = document.createElement('tr');
      
      // Determinar color según puntuación
      let colorClase = '';
      let estadoTexto = '';
      
      if (puntuacion >= 80) {
        colorClase = 'table-success';
        estadoTexto = 'Óptimo';
      } else if (puntuacion >= 60) {
        colorClase = 'table-info';
        estadoTexto = 'Funcional';
      } else if (puntuacion >= 40) {
        colorClase = 'table-warning';
        estadoTexto = 'Limitado';
      } else {
        colorClase = 'table-danger';
        estadoTexto = 'Disfuncional';
      }
      
      fila.className = colorClase;
      
      fila.innerHTML = `
        <td>${nombresRegiones[region] || region}</td>
        <td>${puntuacion.toFixed(1)}/100</td>
        <td>${estadoTexto}</td>
      `;
      
      tablaBody.appendChild(fila);
    });
    
    return true;
  } catch (error) {
    console.error("Error en actualizarTablaPuntuacionesRegion:", error);
    return false;
  }
}

// Generador automático de objetivos terapéuticos
function generarObjetivosTerapeuticos() {
  try {
    // Obtener datos de todas las regiones evaluadas
    const puntuacionesGlobales = calcularPuntuacionGlobal();
    const objetivosContainer = document.getElementById('objetivos_terapeuticos_container');
    
    if (!objetivosContainer || !puntuacionesGlobales.puntuaciones) return false;
    
    // Limpiar contenedor
    objetivosContainer.innerHTML = '';
    
    // Si no hay regiones evaluadas, mostrar mensaje
    if (Object.keys(puntuacionesGlobales.puntuaciones).length === 0) {
      objetivosContainer.innerHTML = '<div class="alert alert-info">Complete la evaluación de rangos de movimiento para generar objetivos terapéuticos automáticos.</div>';
      return false;
    }
    
    // Ordenar regiones por prioridad (menor puntuación = mayor prioridad)
    const regionesPriorizadas = Object.keys(puntuacionesGlobales.puntuaciones)
      .sort((a, b) => puntuacionesGlobales.puntuaciones[a] - puntuacionesGlobales.puntuaciones[b]);
    
    // Crear sección de objetivos
    const objetivosHTML = document.createElement('div');
    objetivosHTML.className = 'objetivos-terapeuticos';
    
    // Crear lista de objetivos generales
    let objetivosGenerales = '<h5>Objetivos Generales</h5><ul>';
    
    // Identificar regiones con mayor disfunción (puntuación < 60)
    const regionesConDisfuncion = regionesPriorizadas.filter(r => puntuacionesGlobales.puntuaciones[r] < 60);
    
    if (regionesConDisfuncion.length > 0) {
      objetivosGenerales += `<li>Restaurar la movilidad funcional en ${regionesConDisfuncion.length} segmento(s) identificados con limitación significativa.</li>`;
      objetivosGenerales += '<li>Mejorar la calidad del movimiento y reducir el dolor asociado a los rangos de movimiento.</li>';
      objetivosGenerales += '<li>Optimizar la funcionalidad en actividades de vida diaria afectadas por las limitaciones de movilidad.</li>';
    } else {
      objetivosGenerales += '<li>Optimizar los patrones de movimiento para maximizar la eficiencia biomecánica.</li>';
      objetivosGenerales += '<li>Prevenir limitaciones funcionales mediante programas de mantenimiento de movilidad.</li>';
    }
    
    objetivosGenerales += '</ul>';
    
    // Crear lista de objetivos específicos por región (máximo 3 regiones prioritarias)
    let objetivosEspecificos = '<h5>Objetivos Específicos</h5><ul>';
    
    const regionesPrioritarias = regionesPriorizadas.slice(0, 3);
    
    // Mapeo de nombres descriptivos para mostrar en lugar de los IDs
    const nombresRegiones = {
      'cervical': 'Columna Cervical',
      'dorsal': 'Columna Dorsal',
      'lumbar': 'Columna Lumbar',
      'pelvis': 'Articulación Sacroilíaca/Pelvis',
      'hombro': 'Complejo del Hombro',
      'codo': 'Codo y Antebrazo',
      'muneca': 'Muñeca y Mano',
      'cadera': 'Articulación de Cadera',
      'rodilla': 'Articulación de Rodilla',
      'tobillo': 'Tobillo y Pie',
      'atm': 'ATM'
    };
    
    regionesPrioritarias.forEach(region => {
      const puntuacion = puntuacionesGlobales.puntuaciones[region];
      const nombreRegion = nombresRegiones[region] || region.charAt(0).toUpperCase() + region.slice(1);
      
      // Objetivos específicos según región y nivel de disfunción
      switch (region) {
        case 'cervical':
          if (puntuacion < 40) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Restaurar rangos de movimiento funcionales priorizando rotación e inclinación lateral. Abordar factores neuromusculares que limitan el movimiento activo.</li>`;
          } else if (puntuacion < 60) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Mejorar la movilidad en los planos de movimiento limitados y optimizar el control neuromuscular durante movimientos combinados.</li>`;
          } else {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Optimizar la calidad de movimiento y resistencia a la fatiga en rangos funcionales completos.</li>`;
          }
          break;
          
        case 'hombro':
          if (puntuacion < 40) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Restaurar la movilidad funcional priorizando elevación y rotaciones. Abordar limitaciones en el ritmo escapulohumeral y factores neuromusculares.</li>`;
          } else if (puntuacion < 60) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Mejorar rangos funcionales para actividades por encima de la cabeza y optimizar control neuromuscular del complejo del hombro.</li>`;
          } else {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Optimizar la coordinación de movimientos complejos y estabilidad dinámica en diferentes planos.</li>`;
          }
          break;
          
        // Casos para otras regiones
        case 'lumbar':
          if (puntuacion < 40) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Restaurar movilidad segmentaria y control motor básico. Abordar inhibición neuromuscular de estabilizadores locales.</li>`;
          } else if (puntuacion < 60) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Mejorar coordinación de movimientos funcionales y resistencia de estabilizadores globales.</li>`;
          } else {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Optimizar control de cargas y movimientos complejos con enfoque preventivo.</li>`;
          }
          break;
          
        case 'cadera':
          if (puntuacion < 40) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Recuperar rangos de movimiento en planos principales y mejorar disociación lumbopélvica.</li>`;
          } else if (puntuacion < 60) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Optimizar control neuromuscular durante actividades como marcha, escaleras y transiciones.</li>`;
          } else {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Potenciar la estabilidad dinámica durante actividades funcionales de alta demanda.</li>`;
          }
          break;
          
        // Caso por defecto para otras regiones
        default:
          if (puntuacion < 40) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Restaurar rangos de movimiento funcionales y abordar factores que limitan la movilidad activa.</li>`;
          } else if (puntuacion < 60) {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Mejorar la calidad del movimiento y optimizar el control neuromuscular durante actividades funcionales.</li>`;
          } else {
            objetivosEspecificos += `<li><strong>${nombreRegion}:</strong> Optimizar la eficiencia del movimiento y prevenir limitaciones futuras.</li>`;
          }
      }
    });
    
    objetivosEspecificos += '</ul>';
    
    // Crear sección de estrategias basadas en evidencia
    let estrategiasEvidencia = '<h5>Estrategias Basadas en Evidencia</h5><ul>';
    // Estrategias generales según puntuación global media
    if (puntuacionesGlobales.puntuacionPromedio < 40) {
      estrategiasEvidencia += '<li>Priorizar técnicas de movilización articular específica para restaurar rangos básicos de movimiento.</li>';
      estrategiasEvidencia += '<li>Implementar programas de ejercicio progresivo con énfasis inicial en control motor y calidad sobre cantidad.</li>';
      estrategiasEvidencia += '<li>Considerar enfoques de neuromodulación para abordar componentes de dolor e inhibición que limitan el movimiento.</li>';
    } else if (puntuacionesGlobales.puntuacionPromedio < 60) {
      estrategiasEvidencia += '<li>Implementar programas de ejercicio terapéutico con progresión de control motor a fortalecimiento funcional.</li>';
      estrategiasEvidencia += '<li>Integrar entrenamiento propioceptivo y de estabilidad dinámica en diferentes posiciones.</li>';
      estrategiasEvidencia += '<li>Utilizar técnicas de movilización con movimiento para optimizar patrones neuromotores.</li>';
    } else {
      estrategiasEvidencia += '<li>Enfocar en entrenamiento neuromuscular avanzado con variabilidad de tareas y contextos.</li>';
      estrategiasEvidencia += '<li>Implementar programas de prevención con ejercicios multiplanares y adaptabilidad a diferentes demandas.</li>';
      estrategiasEvidencia += '<li>Integrar estrategias de autorregulación y gestión de carga para mantener movilidad óptima a largo plazo.</li>';
    }
    
    estrategiasEvidencia += '</ul>';
    
    // Combinar todas las secciones
    objetivosHTML.innerHTML = objetivosGenerales + objetivosEspecificos + estrategiasEvidencia;
    
    // Añadir al contenedor
    objetivosContainer.appendChild(objetivosHTML);
    return true;
  } catch (error) {
    console.error("Error en generarObjetivosTerapeuticos:", error);
    return false;
  }
}

// Función para añadir escucha a eventos para actualizar objetivos y puntuación global
function inicializarSistemaDeObjetivos() {
  try {
    // Añadir listener a todos los inputs de ROM para actualizar objetivos cuando cambien
    document.querySelectorAll('.rom-input, .dolor-selector, .funcionalidad-selector').forEach(elemento => {
      elemento.addEventListener('change', function() {
        // Esperar un momento para que se actualicen todos los cálculos de déficit
        setTimeout(() => {
          calcularPuntuacionGlobal();
          generarObjetivosTerapeuticos();
        }, 500);
      });
    });
    
    // Añadir botón para actualizar objetivos manualmente
    const botonActualizar = document.getElementById('actualizar_objetivos');
    if (botonActualizar) {
      botonActualizar.addEventListener('click', function() {
        calcularPuntuacionGlobal();
        generarObjetivosTerapeuticos();
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error en inicializarSistemaDeObjetivos:", error);
    return false;
  }
}

// Funciones para manejar los acordeones y secciones plegables
function toggleCuestionario(id) {
  try {
    const contenido = document.getElementById(id);
    if (contenido) {
      if (contenido.style.display === "none") {
        contenido.style.display = "block";
        // Cambiar icono del botón si existe
        const boton = contenido.previousElementSibling;
        if (boton && boton.querySelector('i.fas')) {
          boton.querySelector('i.fas').className = boton.querySelector('i.fas').className.replace('fa-plus-circle', 'fa-minus-circle');
        }
      } else {
        contenido.style.display = "none";
        // Cambiar icono del botón si existe
        const boton = contenido.previousElementSibling;
        if (boton && boton.querySelector('i.fas')) {
          boton.querySelector('i.fas').className = boton.querySelector('i.fas').className.replace('fa-minus-circle', 'fa-plus-circle');
        }
      }
    }
    return true;
  } catch (error) {
    console.error(`Error en toggleCuestionario para ${id}:`, error);
    return false;
  }
}

function toggleSeccion(id) {
  try {
    const contenido = document.getElementById(id);
    if (contenido) {
      if (contenido.style.display === "none") {
        contenido.style.display = "block";
        // Cambiar icono del botón si existe
        const boton = contenido.previousElementSibling;
        if (boton && boton.querySelector('i.fas')) {
          boton.querySelector('i.fas').className = boton.querySelector('i.fas').className.replace('fa-angle-down', 'fa-angle-up');
        }
      } else {
        contenido.style.display = "none";
        // Cambiar icono del botón si existe
        const boton = contenido.previousElementSibling;
        if (boton && boton.querySelector('i.fas')) {
          boton.querySelector('i.fas').className = boton.querySelector('i.fas').className.replace('fa-angle-up', 'fa-angle-down');
        }
      }
    }
    return true;
  } catch (error) {
    console.error(`Error en toggleSeccion para ${id}:`, error);
    return false;
  }
}

// FUNCIONES ADICIONALES PARA SOLUCIONAR PROBLEMAS ESPECÍFICOS
// Función para actualizar manualmente todos los cálculos de una región
function actualizarCalculosRegion(region) {
  try {
    alert(`Actualizando cálculos para región ${region}...`);
    const resultado = forzarActualizacionRegion(region);
    
    if (resultado) {
      alert(`Cálculos e interpretaciones de ${region} actualizados correctamente`);
    } else {
      alert(`Hubo problemas al actualizar ${region}. Asegúrate de haber ingresado al menos un tipo de dato (ángulos, dolor o funcionalidad)`);
    }
    
    return resultado;
  } catch (error) {
    console.error(`Error en actualizarCalculosRegion para ${region}:`, error);
    alert(`Error al actualizar ${region}. Intenta recargar la página.`);
    return false;
  }
}

// Función para añadir botones de actualización manual a todas las regiones
function agregarBotonesActualizacionManual() {
  try {
    const regiones = ['cervical', 'dorsal', 'lumbar', 'pelvis', 'hombro', 'codo', 'muneca', 'cadera', 'rodilla', 'tobillo', 'atm'];
    
    regiones.forEach(region => {
      // Buscar contenedor para esta región
      const contenedor = document.getElementById(`rom-${region}-content`);
      if (!contenedor) return;
      
      // Verificar si ya existe botón
      if (document.getElementById(`btn_actualizar_${region}`)) return;
      
      // Crear botón
      const boton = document.createElement('button');
      boton.id = `btn_actualizar_${region}`;
      boton.className = 'btn btn-primary mt-3 mb-3';
      boton.innerHTML = `<i class="fas fa-sync"></i> Actualizar Cálculos e Interpretación de ${region.charAt(0).toUpperCase() + region.slice(1)}`;
      boton.style.width = '100%';
      
      // Añadir funcionalidad
      boton.onclick = function() {
        actualizarCalculosRegion(region);
        alert(`Cálculos e interpretaciones de ${region} actualizados correctamente`);
        return false;
      };
      
      // Añadir al contenedor
      contenedor.appendChild(boton);
    });
    
    console.log("Botones de actualización manual añadidos");
    return true;
  } catch (error) {
    console.error("Error en agregarBotonesActualizacionManual:", error);
    return false;
  }
}

// Función para actualizar manualmente todos los cálculos de todas las regiones
function actualizarTodosLosCalculos() {
  try {
    console.log("Actualizando todos los cálculos");
    
    const regiones = ['cervical', 'dorsal', 'lumbar', 'pelvis', 'hombro', 'codo', 'muneca', 'cadera', 'rodilla', 'tobillo', 'atm'];
    
    regiones.forEach(region => {
      // Forzar actualización completa de la región
      forzarActualizacionRegion(region);
    });
    
    // Actualizar puntuación global y objetivos
    calcularPuntuacionGlobal();
    generarObjetivosTerapeuticos();
    
    console.log("Todos los cálculos actualizados");
    alert("Actualización completa. Si no ves actualizaciones, revisa que hayas ingresado datos en al menos uno de estos campos: ángulos, dolor o funcionalidad.");
    return true;
  } catch (error) {
    console.error("Error en actualizarTodosLosCalculos:", error);
    alert("Ocurrió un error durante la actualización. Intenta recargar la página.");
    return false;
  }
}

// Función específica para el hombro
function inicializarEventListenersHombro() {
  try {
    // Seleccionar todos los inputs de rango para hombro
    const inputsHombro = document.querySelectorAll('input[id^="hombro_"][type="number"]');
    
    inputsHombro.forEach(input => {
      // Agregar listener con manejo de evento
      input.addEventListener('input', function() {
        console.log('Cambio en input de hombro:', this.id, 'valor:', this.value);
        
        // Para inputs activos, evaluar ROM y calcular déficit
        if (this.id.endsWith('_activo')) {
          const region = 'hombro';
          const movimiento = extraerMovimientoDesdeId(this.id);
          const valorNormal = obtenerValorNormativo(region, movimiento);
          const valorModerado = valorNormal * 0.6;
          
          console.log(`Evaluando ROM ${movimiento} con valor normal ${valorNormal}`);
          evaluarROM(this.id, 0, valorModerado, valorNormal);
          
          // Forzar cálculo de déficit después de un breve retraso
          setTimeout(() => {
            calcularDeficitFuncional(this.id);
            actualizarRecomendacionesROM('hombro');
          }, 100);
        }
        
        // Para inputs pasivos, calcular diferencial
        if (this.id.endsWith('_pasivo')) {
          const baseId = this.id.replace('_pasivo', '');
          const activoId = baseId + '_activo';
          const activoInput = document.getElementById(activoId);
          
          if (activoInput && activoInput.value) {
            calcularDiferencialAP(baseId);
            
            // Forzar actualización de recomendaciones
            setTimeout(() => {
              actualizarRecomendacionesROM('hombro');
            }, 100);
          }
        }
      });
      
      // También agregar listener para evento change (cuando pierde foco)
      input.addEventListener('change', function() {
        // Forzar actualización global después de cambios
        setTimeout(() => {
          calcularDeficitFuncional(this.id);
          actualizarRecomendacionesROM('hombro');
          
          // Actualizar objetivos y puntuación global
          calcularPuntuacionGlobal();
          generarObjetivosTerapeuticos();
        }, 200);
      });
    });
    
    console.log('Event listeners para hombro inicializados');
    return true;
  } catch (error) {
    console.error("Error en inicializarEventListenersHombro:", error);
    return false;
  }
}

// Función para agregar botón global de actualización
function agregarBotonActualizacionGlobal() {
  try {
    // Crear botón si no existe
    if (!document.getElementById('btn_actualizar_global')) {
      // Buscar contenedor adecuado
      const contenedor = document.querySelector('.acordeones-container') || 
                         document.querySelector('.container') || 
                         document.body;
      
      if (!contenedor) return false;
      
      // Crear elemento contenedor para botón
      const botonContainer = document.createElement('div');
      botonContainer.className = 'row mt-4 mb-3';
      botonContainer.innerHTML = `
        <div class="col-12">
          <div class="card">
            <div class="card-body text-center">
              <h4>Herramientas de mantenimiento</h4>
              <button id="btn_actualizar_global" class="btn btn-success btn-lg m-2">
                <i class="fas fa-sync-alt"></i> Actualizar TODOS los cálculos e interpretaciones
              </button>
              <p class="mt-2 small text-muted">Utilice este botón si alguna sección no muestra correctamente los cálculos o interpretaciones</p>
            </div>
          </div>
        </div>
      `;
      
      // Añadir al inicio del contenedor
      contenedor.insertBefore(botonContainer, contenedor.firstChild);
      
      // Añadir funcionalidad
      document.getElementById('btn_actualizar_global').addEventListener('click', function() {
        actualizarTodosLosCalculos();
        alert("Todos los cálculos e interpretaciones han sido actualizados correctamente");
        return false;
      });
      
      console.log("Botón de actualización global añadido");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error en agregarBotonActualizacionGlobal:", error);
    return false;
  }
}

// Inicialización cuando el documento está listo
document.addEventListener('DOMContentLoaded', function() {
  try {
    console.log("Iniciando SISTEMAKINE...");
    
    // Añadir botón de actualización global
    agregarBotonActualizacionGlobal();
    
    // Inicializar estado de los acordeones
    actualizarEstadoAcordeones();
    
    // Añadir botones de actualización manual para cada región
    agregarBotonesActualizacionManual();
    
    // Añadir event listeners específicos para hombro
    inicializarEventListenersHombro();
    
    // Añadir listener al selector de región ROM
    const romRegionSelect = document.getElementById('rom_region');
    if (romRegionSelect) {
      romRegionSelect.addEventListener('change', mostrarTablaROM);
      
      // Mostrar la tabla ROM por defecto si hay región seleccionada
      if (romRegionSelect.value) {
        mostrarTablaROM();
      }
    }
    
    // Inicializar tooltips y popovers si usas Bootstrap
    if (typeof bootstrap !== 'undefined') {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
    
    // Inicializar colores de selectores
    const inicializarColoresSelectores = () => {
      document.querySelectorAll('.dolor-selector, .funcionalidad-selector').forEach(selector => {
        // No colorear los selectores que tienen "No" como valor inicial
        if (selector.value !== "No") {
          colorearSelector(selector);
        } else {
          // Eliminar cualquier color que pueda tener
          selector.className = selector.className.replace(/bg-\w+/g, '').trim();
          // Asegurar que conserva las clases necesarias
          if (!selector.className.includes('form-select')) {
            selector.className += ' form-select';
          }
          if (!selector.className.includes('dolor-selector') && selector.id.includes('_dolor')) {
            selector.className += ' dolor-selector';
          } else if (!selector.className.includes('funcionalidad-selector') && selector.id.includes('_funcionalidad')) {
            selector.className += ' funcionalidad-selector';
          }
        }
      });
    };
    
    // Llamar a la función durante la carga de la página
    inicializarColoresSelectores();
    
    // Inicializar sistema de objetivos terapéuticos
    inicializarSistemaDeObjetivos();
    
    // CORRECCIÓN: Establecer el acordeón principal de rangos a "No completado"
    const romBadge = document.getElementById('rom-evaluation-badge');
    if (romBadge) {
      romBadge.innerHTML = "No completado";
      romBadge.className = "resultado-badge badge bg-secondary";
    }
    
    // Event listeners para inputs de número
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', function() {
        try {
          // Extraer la región del ID (por ejemplo, "cervical_flexion_activo" -> "cervical")
          const region = this.id.split('_')[0];
          
          // Buscar el badge de la región
          const regionBadge = document.querySelector(`#${region}_badge, [id*="${region}"][class*="badge"]`);
          
          // Si existe y tiene valor, cambiar a evaluado
          if (regionBadge && this.value) {
            regionBadge.innerHTML = "Evaluado";
            regionBadge.className = regionBadge.className.replace(/bg-\w+/g, "bg-success");
          }
          
          // Si es un input activo, evaluarlo según valores normativos
          if (this.id.endsWith("_activo")) {
            const region = this.id.split('_')[0];
            const movimiento = extraerMovimientoDesdeId(this.id);
            const valorMin = 0;
            const valorModerado = obtenerValorNormativo(region, movimiento) * 0.6;
            const valorNormal = obtenerValorNormativo(region, movimiento);
            
            evaluarROM(this.id, valorMin, valorModerado, valorNormal);
          }
          
          // Si es un input pasivo, calcular diferencial si existe el activo correspondiente
          if (this.id.endsWith("_pasivo")) {
            const baseId = this.id.replace("_pasivo", "");
            const activoId = baseId + "_activo";
            const activoInput = document.getElementById(activoId);
            
            if (activoInput && activoInput.value) {
              calcularDiferencialAP(baseId);
            }
          }
        } catch (error) {
          console.error(`Error en event listener para ${this.id}:`, error);
        }
      });
    });
    
    // Event listeners para selectores de dolor y funcionalidad
    document.querySelectorAll('select[id*="_dolor"], select[id*="_funcionalidad"]').forEach(select => {
      select.addEventListener('change', function() {
        try {
          // Extraer la región del ID
          const region = this.id.split('_')[0];
          
          // Buscar el badge de la región
          const regionBadge = document.querySelector(`#${region}_badge, [id*="${region}"][class*="badge"]`);
          
          // Si existe y tiene valor distinto del predeterminado, cambiar a evaluado
          if (regionBadge && this.value && this.value !== "No" && this.value !== "Normal") {
            regionBadge.innerHTML = "Evaluado";
            regionBadge.className = regionBadge.className.replace(/bg-\w+/g, "bg-success");
          }
          
          // Colorear selector y actualizar
          if (this.id.includes("_dolor")) {
            evaluarDolorROM(this);
          } else if (this.id.includes("_funcionalidad")) {
            evaluarFuncionalidadROM(this);
          }
        } catch (error) {
          console.error(`Error en event listener para ${this.id}:`, error);
        }
      });
    });
    
    // Event listeners para patrones capsulares
    document.querySelectorAll('select[id$="_patron_capsular"]').forEach(select => {
      select.addEventListener('change', function() {
        try {
          const region = this.id.split('_')[0];
          mostrarInterpretacionCapsular(region);
        } catch (error) {
          console.error(`Error en event listener para ${this.id}:`, error);
        }
      });
    });
    
    // Pre-cargar estados visuales si hay datos guardados
    cargarDatosGuardados();
    
    console.log("Inicialización de SISTEMAKINE completada");
  } catch (error) {
    console.error("Error en inicialización:", error);
    alert("Se produjo un error durante la inicialización. Por favor, recargue la página o contacte al soporte técnico.");
  }
});

// FUNCIÓN PARA DEPURACIÓN
function diagnosticarSistema() {
  console.log("Iniciando diagnóstico del sistema");
  
  // Comprobar si estamos en un navegador compatible
  console.log("Entorno: " + (typeof window !== 'undefined' ? "Navegador" : "Otro"));
  
  // Contar elementos críticos
  const acordeones = document.querySelectorAll('.cuestionario-item').length;
  const tablas = document.querySelectorAll('.tabla-rom').length;
  const inputs = document.querySelectorAll('input[type="number"]').length;
  const selectores = document.querySelectorAll('select').length;
  
  console.log(`Elementos en la página: ${acordeones} acordeones, ${tablas} tablas ROM, ${inputs} inputs numéricos, ${selectores} selectores`);
  
  // Comprobar regiones disponibles
  const regiones = ['cervical', 'dorsal', 'lumbar', 'pelvis', 'hombro', 'codo', 'muneca', 'cadera', 'rodilla', 'tobillo', 'atm'];
  regiones.forEach(region => {
    const contenido = document.getElementById(`rom-${region}-content`);
    const badge = document.getElementById(`rom-${region}-badge`);
    if (contenido && badge) {
      console.log(`Región ${region}: OK`);
    } else {
      console.log(`Región ${region}: ${contenido ? "Contenido OK" : "Sin contenido"}, ${badge ? "Badge OK" : "Sin badge"}`);
    }
  });
  
  // Comprobar elementos críticos para la función principal
  const interpretaciones = document.querySelectorAll('[id$="-texto"]').length;
  console.log(`Elementos de interpretación encontrados: ${interpretaciones}`);
  
  // Ver si alguna función crítica está definida
  const funcionesCriticas = [
    'evaluarROM', 
    'calcularDeficitFuncional', 
    'actualizarRecomendacionesROM', 
    'recopilarDatosROM',
    'obtenerValorNormativo',
    'generarInterpretacionROM',
    'generarRecomendacionesROM'
  ];
  
  funcionesCriticas.forEach(funcion => {
    console.log(`Función ${funcion}: ${typeof window[funcion] === 'function' ? "Definida" : "NO definida"}`);
  });
  
  console.log("Diagnóstico completado");
  
  // Retornar información para facilitar el soporte
  return {
    acordeones,
    tablas,
    inputs,
    selectores,
    interpretaciones,
    navegador: navigator.userAgent,
    funcionesDisponibles: funcionesCriticas.filter(f => typeof window[f] === 'function')
  };
}

// Función mejorada para forzar la actualización de una región
function forzarActualizacionRegion(region) {
  try {
    console.log(`Forzando actualización para región ${region}`);
    
    // 1. Recopilar todos los datos disponibles
    const datos = recopilarDatosROM(region);
    console.log("Datos recopilados:", datos);
    
    // 2. Procesar datos de dolor (si no hay ángulos)
    if (Object.keys(datos.dolores).length > 0 && Object.keys(datos.rangosActivos).length === 0) {
      console.log(`Región ${region} tiene datos de dolor pero no de ángulos. Procesando solo dolor.`);
      
      // Buscar elementos de interpretación
      const interpretacionElement = document.getElementById(`interpretacion-${region}-texto`);
      const recomendacionesElement = document.getElementById(`recomendaciones-${region}-texto`);
      
      if (interpretacionElement && recomendacionesElement) {
        // Generar interpretación basada solo en dolor
        let interpretacion = `<p class="alert alert-warning">Se ha reportado dolor en ${Object.keys(datos.dolores).length} movimiento(s) de ${region}. `;
        interpretacion += `Se recomienda completar la evaluación de rangos y funcionalidad para una interpretación más completa.</p>`;
        
        interpretacionElement.innerHTML = interpretacion;
        
        // Generar recomendaciones básicas para dolor
        let recomendaciones = "<ul>";
        recomendaciones += `<li>Implementar <strong>evaluación detallada del dolor</strong> para identificar sus mecanismos y características.</li>`;
        recomendaciones += `<li>Considerar <strong>técnicas de neuromodulación</strong> y educación en neurociencia del dolor.</li>`;
        recomendaciones += `<li>Completar la evaluación de rangos para determinar el impacto del dolor en la movilidad funcional.</li>`;
        recomendaciones += "</ul>";
        
        recomendacionesElement.innerHTML = recomendaciones;
      }
    }
    
    // 3. Procesar datos de funcionalidad (si no hay ángulos)
    if (Object.keys(datos.funcionalidades).length > 0 && Object.keys(datos.rangosActivos).length === 0) {
      console.log(`Región ${region} tiene datos de funcionalidad pero no de ángulos. Procesando solo funcionalidad.`);
      actualizarRecomendacionesROM(region);
    }
    
    // 4. Actualizar cálculos de ángulos si existen
    if (Object.keys(datos.rangosActivos).length > 0) {
      // Evaluar todos los valores de rango activo
      for (const movimiento in datos.rangosActivos) {
        const inputId = `${region}_${movimiento}_activo`;
        const input = document.getElementById(inputId);
        if (input) {
          console.log(`Evaluando ROM para ${inputId}`);
          evaluarROM(inputId);
        }
      }
      
      // Calcular diferenciales
      for (const movimiento in datos.rangosPasivos) {
        const baseId = `${region}_${movimiento}`;
        const activoId = baseId + '_activo';
        const activoInput = document.getElementById(activoId);
        
        if (activoInput && activoInput.value) {
          console.log(`Calculando diferencial para ${baseId}`);
          calcularDiferencialAP(baseId);
        }
      }
      
      // Calcular déficit funcional
      console.log(`Calculando déficit funcional para ${region}`);
      calcularDeficitFuncional(`${region}_cualquier_movimiento_activo`); // El ID exacto no importa, solo la región
    }
    
    // 5. Forzar actualización de recomendaciones siempre
    console.log(`Actualizando recomendaciones para ${region}`);
    actualizarRecomendacionesROM(region);
    
    // 6. Actualizar badges de estado
    const regionBadge = document.getElementById(`rom-${region}-badge`);
    if (regionBadge) {
      regionBadge.innerHTML = "Evaluado";
      regionBadge.className = "resultado-badge badge bg-success";
    }
    
    return true;
  } catch (error) {
    console.error(`Error en forzarActualizacionRegion para ${region}:`, error);
    return false;
  }
}
