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
      
      // Actualizar badge de estado
      document.getElementById("rom-evaluation-badge").innerHTML = "En progreso";
      document.getElementById("rom-evaluation-badge").className = "resultado-badge badge bg-warning";
    }
  }
}

// Evaluar estado de rango de movimiento
function evaluarROM(inputId, valorMin, valorModerado, valorNormal) {
  const input = document.getElementById(inputId);
  const estadoElement = document.getElementById(inputId + "_estado");
  
  if (!input || !estadoElement) return;
  
  const valor = parseFloat(input.value);
  
  // Si no hay valor, no evaluar
  if (isNaN(valor)) {
    estadoElement.innerHTML = "";
    estadoElement.className = "";
    return;
  }
  
  // Evaluar estado según valores normativos
  let estado = "";
  let colorClase = "";
  
  if (valor < valorModerado) {
    estado = "Disminuido";
    colorClase = "bg-danger text-white";
  } else if (valor < valorNormal) {
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
  document.getElementById("rom-evaluation-badge").innerHTML = "Evaluado";
  document.getElementById("rom-evaluation-badge").className = "resultado-badge badge bg-success";
  
  // Calcular déficit funcional
  calcularDeficitFuncional(inputId);
}

// Calcular diferencial entre ROM activo y pasivo
function calcularDiferencialAP(baseId) {
  const activoInput = document.getElementById(baseId + "_activo");
  const pasivoInput = document.getElementById(baseId + "_pasivo");
  const diferencialElement = document.getElementById(baseId + "_diferencial");
  
  if (!activoInput || !pasivoInput || !diferencialElement) return;
  
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
  
  // Actualizar elemento de diferencial
  diferencialElement.innerHTML = `${diferencia}° (${estado})`;
  diferencialElement.className = colorClase;
  
  // Interpretar el diferencial
  interpretarDiferencialAP(baseId, diferencia);
}

// Interpretar el significado clínico del diferencial AP
function interpretarDiferencialAP(baseId, diferencia) {
  // Implementar según necesidad del componente de interpretación clínica
  // Esta función se llamaría desde la función de calcularDiferencialAP
  // y actualizaría la sección de interpretación con los hallazgos
}

// Evaluar dolor durante ROM
function evaluarDolorROM() {
  // Implementar según necesidad para actualizar interpretación clínica
  // Esta función se llamaría desde los selectores de dolor
}

// Calcular déficit funcional por articulación
function calcularDeficitFuncional(inputId) {
  // Extraer región de la evaluación actual
  const partes = inputId.split("_");
  const region = partes[0]; // Ej: cervical, hombro, etc.
  
  // Obtener elementos de déficit para esta región
  const deficitTotalElement = document.getElementById(region + "_deficit_total");
  const deficitVisualElement = document.getElementById(region + "_deficit_visual");
  const interpretacionElement = document.getElementById(region + "_deficit_interpretacion");
  const impactoActividadesElement = document.getElementById(region + "_impacto_actividades");
  
  if (!deficitTotalElement || !deficitVisualElement || !interpretacionElement || !impactoActividadesElement) return;
  
  // Recopilar todos los inputs de ROM activo para esta región
  const inputsActivos = document.querySelectorAll(`input[id^="${region}_"][id$="_activo"]`);
  
  // Si no hay inputs suficientes, salir
  if (inputsActivos.length === 0) return;
  
  // Calcular déficit promedio
  let totalDeficit = 0;
  let movimientosEvaluados = 0;
  
  inputsActivos.forEach(input => {
    const valor = parseFloat(input.value);
    if (!isNaN(valor)) {
      // Determinar déficit según el movimiento y región
      const movimiento = input.id.replace(`${region}_`, "").replace("_activo", "");
      const valorNormativo = obtenerValorNormativo(region, movimiento);
      
      if (valorNormativo > 0) {
        const deficitPorcentaje = Math.max(0, Math.min(100, 100 - (valor / valorNormativo * 100)));
        totalDeficit += deficitPorcentaje;
        movimientosEvaluados++;
      }
    }
  });
  
  // Si no hay movimientos evaluados, salir
  if (movimientosEvaluados === 0) return;
  
  // Calcular déficit promedio
  const deficitPromedio = totalDeficit / movimientosEvaluados;
  
  // Actualizar elementos visuales
  deficitTotalElement.value = deficitPromedio.toFixed(1) + "%";
  
  // Actualizar barra visual
  deficitVisualElement.querySelector('.progress-bar').style.width = deficitPromedio + "%";
  
  // Cambiar color según severidad
  let colorClase = "";
  let interpretacion = "";
  
  if (deficitPromedio < 10) {
    colorClase = "bg-success";
    interpretacion = "Limitación mínima";
  } else if (deficitPromedio < 25) {
    colorClase = "bg-info";
    interpretacion = "Limitación leve";
  } else if (deficitPromedio < 50) {
    colorClase = "bg-warning";
    interpretacion = "Limitación moderada";
  } else {
    colorClase = "bg-danger";
    interpretacion = "Limitación severa";
  }
  
  deficitVisualElement.querySelector('.progress-bar').className = `progress-bar ${colorClase}`;
  
  // Actualizar interpretación
  interpretacionElement.innerHTML = '';
  const option = document.createElement('option');
  option.value = interpretacion.toLowerCase().replace(" ", "_");
  option.text = interpretacion;
  option.selected = true;
  interpretacionElement.appendChild(option);
  
  // Actualizar impacto en actividades
  actualizarImpactoActividades(region, deficitPromedio);
}

// Obtener valor normativo para un movimiento específico
function obtenerValorNormativo(region, movimiento) {
  // Mapa de valores normativos según región y movimiento
  const valoresNormativos = {
    "cervical": {
      "flexion": 45,
      "extension": 45,
      "incl_der": 45,
      "incl_izq": 45,
      "rot_der": 70,
      "rot_izq": 70
    },
    "hombro": {
      "flexion": 180,
      "extension": 50,
      "abduccion": 180,
      "aduccion": 30,
      "rot_int": 70,
      "rot_ext": 90
    },
    // Añadir otras regiones según sea necesario
  };
  
  // Retornar valor normativo o 0 si no existe
  return (valoresNormativos[region] && valoresNormativos[region][movimiento]) ? 
    valoresNormativos[region][movimiento] : 0;
}

// Actualizar impacto en actividades según déficit funcional
function actualizarImpactoActividades(region, deficitPromedio) {
  const impactoElement = document.getElementById(region + "_impacto_actividades");
  
  if (!impactoElement) return;
  
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
      
    // Añadir otras regiones según sea necesario
    
    default:
      actividades.push({
        nombre: "Actividades generales",
        impacto: "Posibles limitaciones en actividades que requieren movimientos completos.",
        colorClase: colorClase
      });
  }
  
  return actividades;
}

// Mostrar interpretación del patrón capsular
function mostrarInterpretacionCapsular(region) {
  const patronSelect = document.getElementById(region + "_patron_capsular");
  const interpretacionElement = document.getElementById(region + "_interpretacion_capsular");
  const patronOtroContainer = document.getElementById(region + "_patron_otro_container");
  
  if (!patronSelect || !interpretacionElement) return;
  
  // Mostrar/ocultar campo para "otro" patrón
  if (patronOtroContainer) {
    patronOtroContainer.style.display = patronSelect.value === "Otro" ? "block" : "none";
  }
  
  // Si no hay selección, mostrar mensaje por defecto
  if (!patronSelect.value) {
    interpretacionElement.innerHTML = "<p>Seleccione un patrón de restricción para obtener la interpretación clínica.</p>";
    return;
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
    return;
  }
  
  // Interpretaciones específicas para cada patrón
  let interpretacion = "";
  
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
      
    case "Extensión > Inclinación lateral > Rotación":
      interpretacion = `
        <p>Este patrón de restricción sugiere <strong>afectación de estructuras anteriores del segmento cervical</strong>, incluyendo el complejo disco-uncovertebral.</p>
        <p>Estructuras potencialmente involucradas:</p>
        <ul>
          <li>Disco intervertebral (principalmente porción anterior)</li>
          <li>Ligamento longitudinal anterior</li>
          <li>Articulaciones uncovertebrales</li>
        </ul>
        <p>Enfoque terapéutico recomendado (basado en evidencia):</p>
        <ul>
          <li>Abordaje gradual para restaurar la extensión con técnicas de movilización posteroanterior</li>
          <li>Ejercicios de control neuromuscular para estabilización cervical media</li>
          <li>Corrección postural para minimizar la carga anterior prolongada</li>
        </ul>
      `;
      break;
      
    case "Flexión > Inclinación lateral > Rotación":
      interpretacion = `
        <p>Este patrón de restricción sugiere <strong>afectación de estructuras posteriores del segmento cervical</strong>, como el complejo ligamentoso posterior.</p>
        <p>Estructuras potencialmente involucradas:</p>
        <ul>
          <li>Ligamento interespinoso y supraespinoso</li>
          <li>Cápsula posterior de articulaciones facetarias</li>
          <li>Ligamento amarillo</li>
        </ul>
        <p>Enfoque terapéutico recomendado (basado en evidencia):</p>
        <ul>
          <li>Técnicas de movilización suave en flexión con progresión gradual</li>
          <li>Ejercicios de elongación controlada de cadena posterior</li>
          <li>Integración de control motor para minimizar compensaciones durante la flexión</li>
        </ul>
      `;
      break;
      
    case "Inclinación lateral > Rotación > Flexión/Extensión":
      interpretacion = `
        <p>Este patrón de restricción es consistente con <strong>disfunción unilateral del complejo articular cervical</strong>, afectando principalmente los componentes laterales.</p>
        <p>Estructuras potencialmente involucradas:</p>
        <ul>
          <li>Articulaciones uncovertebrales unilateralmente</li>
          <li>Músculos escalenos y/o elevador de la escápula</li>
          <li>Articulaciones facetarias unilaterales</li>
        </ul>
        <p>Enfoque terapéutico recomendado (basado en evidencia):</p>
        <ul>
          <li>Técnicas de movilización lateral específica para el lado afectado</li>
          <li>Ejercicios de estabilidad neuromuscular con énfasis en control rotacional</li>
          <li>Abordaje miofascial de la cadena lateral afectada</li>
        </ul>
      `;
      break;
      
    default:
      interpretacion = `
        <p>El patrón de restricción identificado no corresponde con los patrones capsulares clásicos, lo que podría indicar una combinación de factores o un mecanismo no típico.</p>
        <p>Consideraciones clínicas:</p>
        <ul>
          <li>Evaluar factores neuromusculares y propioceptivos</li>
          <li>Considerar influencias de segmentos adyacentes</li>
          <li>Valorar aspectos posturales globales que puedan influir</li>
        </ul>
        <p>Se recomienda un abordaje integrado que combine técnicas articulares, neurodinámicas y de control motor adaptadas a las restricciones específicas observadas.</p>
      `;
  }
  
  // Actualizar elemento de interpretación
  interpretacionElement.innerHTML = interpretacion;
}
// Inicialización cuando el documento está listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar estado de los acordeones
    actualizarEstadoAcordeones();
    
    // Añadir event listeners a selectores principales
    const romRegionSelect = document.getElementById('rom_region');
    if (romRegionSelect) {
        romRegionSelect.addEventListener('change', mostrarTablaROM);
    }
    
    // Inicializar tooltips y popovers si usas Bootstrap
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Pre-cargar estados visuales si hay datos guardados
    cargarDatosGuardados();

   // Inicializar estado de los acordeones
  actualizarEstadoAcordeones();
  
  // Añadir event listeners a selectores principales
  const romRegionSelect = document.getElementById('rom_region');
  if (romRegionSelect) {
    romRegionSelect.addEventListener('change', mostrarTablaROM);
  }
  
  // Inicializar tooltips y popovers si usas Bootstrap
  if (typeof bootstrap !== 'undefined') {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  
  // AÑADIR AQUÍ EL CÓDIGO DEL PASO 4
  // Inicializar colores de selectores
  const inicializarColoresSelectores = () => {
    document.querySelectorAll('.dolor-selector, .funcionalidad-selector').forEach(selector => {
      colorearSelector(selector);
    });
  };
  
  // Llamar a la función durante la carga de la página
  inicializarColoresSelectores();
  
  // Pre-cargar estados visuales si hay datos guardados
  cargarDatosGuardados();
});
  
});

// Función para actualizar estado de los acordeones
function actualizarEstadoAcordeones() {
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
}

// Función para cargar datos guardados (si existen)
function cargarDatosGuardados() {
    // Esta función debería implementarse según tu sistema de almacenamiento
    // Podría recuperar datos de localStorage, sessionStorage o de tu backend
    
    // Ejemplo para localStorage:
    const datosGuardados = localStorage.getItem('datos_patrones_movimiento');
    if (datosGuardados) {
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
                    }
                }
            }
        }
        
        // Actualizar interpretaciones y visualizaciones
        actualizarResumenVisual();
    }
}

// Completar la función interpretarDiferencialAP
function interpretarDiferencialAP(baseId, diferencia) {
    const region = baseId.split('_')[0]; // Extraer región (ej: cervical, hombro)
    
    // Obtener elementos de interpretación
    const interpretacionElement = document.getElementById(`interpretacion-${region}-texto`);
    if (!interpretacionElement) return;
    
    // Interpretar según magnitud del diferencial
    let interpretacion = '';
    
    if (diferencia <= 5) {
        // Diferencial normal: probablemente no haya restricción articular significativa
        return; // No añadir interpretación específica
    } else if (diferencia <= 15) {
        // Diferencial moderado
        interpretacion = `<p class="alert alert-info">El diferencial activo-pasivo moderado en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        sugiere inhibición neuromuscular protectiva o debilidad muscular. Considerar técnicas de activación muscular y ejercicios de control motor.</p>`;
    } else {
        // Diferencial significativo
        interpretacion = `<p class="alert alert-warning">El diferencial activo-pasivo significativo en ${obtenerNombreMovimiento(baseId)} (${diferencia}°) 
        indica posible inhibición refleja por dolor, debilidad muscular significativa o alteración en el control motor. 
        Priorizar la reeducación neuromuscular y considerar técnicas de neuromodulación.</p>`;
    }
    
    // Añadir interpretación al elemento existente (sin reemplazar contenido previo)
    interpretacionElement.innerHTML += interpretacion;
}

// Función auxiliar para obtener nombre descriptivo del movimiento
function obtenerNombreMovimiento(baseId) {
    const partes = baseId.split('_');
    const region = partes[0];
    const movimiento = partes.slice(1).join('_');
    
    const mapaMovimientos = {
        "flexion": "flexión",
        "extension": "extensión",
        "abduccion": "abducción",
        "aduccion": "aducción",
        "rot_int": "rotación interna",
        "rot_ext": "rotación externa",
        "incl_der": "inclinación derecha",
        "incl_izq": "inclinación izquierda",
        "pron": "pronación",
        "sup": "supinación",
        "desv_rad": "desviación radial",
        "desv_cub": "desviación cubital"
    };
    
    const nombreMovimiento = mapaMovimientos[movimiento] || movimiento;
    return `${nombreMovimiento} de ${region}`;
}

// Colorear selectores según su selección
function colorearSelector(selector) {
  // Obtener el color del atributo data-color de la opción seleccionada
  const opcionSeleccionada = selector.options[selector.selectedIndex];
  const colorClase = opcionSeleccionada.getAttribute('data-color');
  
  // Resetear todas las clases de color
  selector.className = selector.className.replace(/bg-\w+/g, '').trim();
  
  // Añadir la clase de color según la selección
  if (colorClase) {
    selector.classList.add('bg-' + colorClase);
    
    // Si es un color oscuro, añadir texto blanco
    if (colorClase === 'primary' || colorClase === 'secondary' || colorClase === 'danger' || colorClase === 'dark') {
      selector.classList.add('text-white');
    } else {
      selector.classList.remove('text-white');
    }
  }
  
  // Actualizar las recomendaciones
  actualizarRecomendacionesROM(selector.id.split('_')[0]); // Obtiene la región (cervical, etc.)
}

// Evaluar la funcionalidad del ROM
function evaluarFuncionalidadROM(selector) {
  // Actualizar badge de estado
  document.getElementById("rom-evaluation-badge").innerHTML = "Evaluado";
  document.getElementById("rom-evaluation-badge").className = "resultado-badge badge bg-success";
  
  // Actualizar recomendaciones
  const region = selector.id.split('_')[0]; // Ej: cervical
  actualizarRecomendacionesROM(region);
}

// Evaluar el dolor durante ROM
function evaluarDolorROM(selector) {
  // Actualizar recomendaciones
  const region = selector.id.split('_')[0]; // Ej: cervical
  actualizarRecomendacionesROM(region);
}

// Actualizar las recomendaciones basadas en la evaluación
function actualizarRecomendacionesROM(region) {
  // Elementos de interpretación y recomendaciones
  const interpretacionElement = document.getElementById(`interpretacion-${region}-texto`);
  const recomendacionesElement = document.getElementById(`recomendaciones-${region}-texto`);
  const consideracionesElement = document.getElementById(`consideraciones-${region}-texto`);
  
  if (!interpretacionElement || !recomendacionesElement || !consideracionesElement) return;
  
  // Recopilar todos los datos para esta región
  const datos = recopilarDatosROM(region);
  
  // Si no hay datos suficientes, salir
  if (Object.keys(datos.rangosActivos).length === 0) return;
  
  // Generar interpretación
  let interpretacion = generarInterpretacionROM(region, datos);
  interpretacionElement.innerHTML = interpretacion;
  
  // Generar recomendaciones
  let recomendaciones = generarRecomendacionesROM(region, datos);
  recomendacionesElement.innerHTML = recomendaciones;
  
  // Generar consideraciones
  let consideraciones = generarConsideracionesROM(region, datos);
  consideracionesElement.innerHTML = consideraciones;
}

// Recopilar todos los datos de ROM para una región
function recopilarDatosROM(region) {
  const datos = {
    rangosActivos: {},
    rangosPasivos: {},
    diferenciales: {},
    dolores: {},
    funcionalidades: {}
  };
  
  // Buscar todos los inputs de rango activo para esta región
  const inputsActivos = document.querySelectorAll(`input[id^="${region}_"][id$="_activo"]`);
  
  inputsActivos.forEach(input => {
    const movimiento = input.id.replace(`${region}_`, '').replace('_activo', '');
    const valor = parseFloat(input.value);
    
    if (!isNaN(valor)) {
      datos.rangosActivos[movimiento] = valor;
      
      // Buscar el rango pasivo correspondiente
      const inputPasivo = document.getElementById(`${region}_${movimiento}_pasivo`);
      if (inputPasivo) {
        const valorPasivo = parseFloat(inputPasivo.value);
        if (!isNaN(valorPasivo)) {
          datos.rangosPasivos[movimiento] = valorPasivo;
          
          // Calcular diferencial
          datos.diferenciales[movimiento] = valorPasivo - valor;
        }
      }
      
      // Buscar el dolor correspondiente
      const selectDolor = document.getElementById(`${region}_${movimiento}_dolor`);
      if (selectDolor) {
        datos.dolores[movimiento] = selectDolor.value;
      }
      
      // Buscar la funcionalidad correspondiente
      const selectFuncionalidad = document.getElementById(`${region}_${movimiento}_funcionalidad`);
      if (selectFuncionalidad) {
        datos.funcionalidades[movimiento] = selectFuncionalidad.value;
      }
    }
  });
  
  return datos;
}

// Generar interpretación basada en los datos
function generarInterpretacionROM(region, datos) {
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
  
  // Construir interpretación basada en hallazgos
  if (limitacionesSeveras > 0) {
    interpretacion += `<p class="alert alert-danger">Se observa limitación severa en ${limitacionesSeveras} movimiento(s) de ${region}, `;
    interpretacion += `indicando un compromiso importante de la movilidad con potencial impacto funcional significativo.</p>`;
  } else if (limitacionesModeradas > 0) {
    interpretacion += `<p class="alert alert-warning">Se observa limitación moderada en ${limitacionesModeradas} movimiento(s) de ${region}, `;
    interpretacion += `sugiriendo restricción de movilidad con impacto funcional moderado.</p>`;
  } else if (limitacionesLeves > 0) {
    interpretacion += `<p class="alert alert-info">Se observa limitación leve en ${limitacionesLeves} movimiento(s) de ${region}, `;
    interpretacion += `indicando restricciones menores que podrían impactar algunas actividades específicas.</p>`;
  } else {
    interpretacion += `<p class="alert alert-success">Los rangos de movimiento de ${region} se encuentran dentro de parámetros normales o funcionales.</p>`;
  }
  
  // Añadir interpretación sobre dolor
  if (movimientosDolorosos > 0) {
    interpretacion += `<p>Se evidencia dolor durante ${movimientosDolorosos} movimiento(s), lo que sugiere componente inflamatorio o sensibilización.</p>`;
  }
  
  // Añadir interpretación sobre diferenciales
  if (diferencialSignificativo) {
    interpretacion += `<p>El diferencial activo-pasivo significativo sugiere posible inhibición neuromuscular o debilidad muscular específica.</p>`;
  }
  
  return interpretacion;
}

// Generar recomendaciones basadas en los datos
function generarRecomendacionesROM(region, datos) {
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
  
  // Construir recomendaciones según hallazgos
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
  
  // Añadir recomendaciones para dolor
  if (movimientosDolorosos > 0) {
    recomendaciones += `<li>Implementar estrategias de <strong>modulación del dolor</strong> durante las técnicas terapéuticas.</li>`;
    recomendaciones += `<li>Considerar <strong>dosificación gradual</strong> de la intensidad para no exacerbar síntomas.</li>`;
  }
  
  // Añadir recomendaciones para diferenciales
  if (diferencialSignificativo) {
    recomendaciones += `<li>Incluir <strong>ejercicios de activación muscular</strong> específicos para mejorar el control neuromuscular.</li>`;
    recomendaciones += `<li>Considerar técnicas de <strong>facilitación neuromuscular propioceptiva</strong> para optimizar patrones de movimiento.</li>`;
  }
  
  recomendaciones += "</ul>";
  return recomendaciones;
}

// Generar consideraciones adicionales
function generarConsideracionesROM(region, datos) {
  // Consideraciones específicas según la región
  let consideraciones = "<ul>";
  
  switch (region) {
    case "cervical":
      consideraciones += `
        <li>Correlacionar los hallazgos con la evaluación postural de cabeza y cuello.</li>
        <li>Valorar la función de la musculatura profunda (flexores/extensores profundos) además de los rangos.</li>
        <li>Considerar la influencia de factores ergonómicos y posturales en el trabajo/actividades diarias.</li>
        <li>Evaluar la relación entre la movilidad cervical y la función vestibular/oculomotora en caso de síntomas asociados.</li>
      `;
      break;
    case "dorsal":
      consideraciones += `
        <li>Evaluar la relación con la mecánica respiratoria.</li>
        <li>Considerar la interacción con la función de la cintura escapular.</li>
      `;
      break;
    // Añadir más regiones según sea necesario
  }
  
  consideraciones += "</ul>";
  return consideraciones;
}

// Modificar la función evaluarROM para actualizar las recomendaciones
function evaluarROM(inputId, valorMin, valorModerado, valorNormal) {
  // Código existente para evaluarROM
  
  // Añadir esta línea al final de la función:
  actualizarRecomendacionesROM(inputId.split('_')[0]); // Obtiene la región (cervical, etc.)
}
