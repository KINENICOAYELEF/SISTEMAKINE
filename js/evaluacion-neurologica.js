// evaluacion-neurologica.js - Funcionalidades para la evaluación neurológica kinesiológica
// Parte del sistema SISTEMAKINE

// Variables globales
let mapaCorpSensitivoCanvas = null;
let mapaCorpSensitivoCtx = null;
let currentDermatome = "";

// Función para inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todos los acordeones de la evaluación neurológica
  inicializarAcordeones();
  
  // Inicializar funcionalidades específicas si se encuentran en la página
  if (document.getElementById('evaluacion-sensitiva-content')) {
    inicializarEvaluacionSensitiva();
  }
  
  if (document.getElementById('reflejos-content')) {
    inicializarReflejos();
  }
  
  if (document.getElementById('pruebas-neurologicas-content')) {
    inicializarPruebasNeurologicas();
  }
  
  if (document.getElementById('interpretacion-neuro-content')) {
    inicializarInterpretacion();
  }
});

// Función para alternar la visibilidad de los acordeones
function toggleCuestionario(contentId) {
  const content = document.getElementById(contentId);
  if (content) {
    // Toggle display
    if (content.style.display === "none") {
      content.style.display = "block";
      // Cambiar icono del botón
      const header = content.previousElementSibling;
      const icon = header.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-plus-circle');
        icon.classList.add('fa-minus-circle');
      }
    } else {
      content.style.display = "none";
      // Cambiar icono del botón
      const header = content.previousElementSibling;
      const icon = header.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-minus-circle');
        icon.classList.add('fa-plus-circle');
      }
    }
  }
}

// Inicialización general de acordeones
function inicializarAcordeones() {
  // Agregar listener para todos los headers de acordeones
  const headers = document.querySelectorAll('.cuestionario-header');
  headers.forEach(header => {
    header.addEventListener('click', function() {
      const contentId = this.getAttribute('onclick').match(/'(.*?)'/)[1];
      toggleCuestionario(contentId);
    });
  });
}

// ================= EVALUACIÓN SENSITIVA =================

function inicializarEvaluacionSensitiva() {
  // Inicializar selector de regiones
  const selectorRegion = document.getElementById('sensitiva_region');
  if (selectorRegion) {
    selectorRegion.addEventListener('change', actualizarRegionSensitiva);
  }
  
  // Inicializar inputs de sensibilidad para actualizar estados
  const inputsSensibilidad = document.querySelectorAll('[id$="_der"], [id$="_izq"]');
  inputsSensibilidad.forEach(input => {
    if (input.id.includes('discriminacion')) {
      input.addEventListener('change', function() {
        evaluarDiscriminacion(input.id);
      });
    } else {
      input.addEventListener('change', function() {
        evaluarSensibilidad(input.id);
      });
    }
  });
  
  // Inicializar botón de mapa corporal
  const btnMapa = document.querySelector('button[onclick="mostrarMapaSensitivo()"]');
  if (btnMapa) {
    btnMapa.addEventListener('click', mostrarMapaSensitivo);
  }
}

function actualizarRegionSensitiva() {
  const selectorRegion = document.getElementById('sensitiva_region');
  const campoOtraRegion = document.getElementById('sensitiva_region_otra');
  
  if (selectorRegion && campoOtraRegion) {
    if (selectorRegion.value === 'Otro') {
      campoOtraRegion.style.display = 'block';
    } else {
      campoOtraRegion.style.display = 'none';
    }
    
    // Guardar la región/dermatoma seleccionada
    currentDermatome = selectorRegion.value;
  }
}

function evaluarSensibilidad(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  const estadoId = `${inputId}_estado`;
  const estadoElement = document.getElementById(estadoId);
  
  if (estadoElement) {
    // Determinar el estado según el valor seleccionado
    let estado = '';
    let clase = '';
    
    if (input.value === 'Normal') {
      estado = 'Normal';
      clase = 'text-success';
    } else if (input.value === '') {
      estado = '';
      clase = '';
    } else {
      estado = 'Alterado';
      clase = 'text-danger';
    }
    
    // Actualizar el estado
    estadoElement.textContent = estado;
    estadoElement.className = clase;
    
    // Actualizar interpretación
    actualizarInterpretacionSensitiva();
  }
}

function evaluarDiscriminacion(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  const estadoId = `${inputId}_estado`;
  const estadoElement = document.getElementById(estadoId);
  
  if (estadoElement) {
    const valor = parseFloat(input.value);
    let estado = '';
    let clase = '';
    
    // Criterios para discriminación de dos puntos según región
    let regionActual = currentDermatome || '';
    let umbralNormal = 5; // valor predeterminado
    
    // Ajustar umbral según región (valores aproximados)
    if (regionActual.includes('Mediano') || regionActual.includes('C6') || regionActual.includes('C7')) {
      umbralNormal = 4; // Punta de los dedos - sensibilidad alta
    } else if (regionActual.includes('L4') || regionActual.includes('L5') || regionActual.includes('S1')) {
      umbralNormal = 10; // Pie y pierna - sensibilidad menor
    }
    
    // Evaluación
    if (isNaN(valor)) {
      estado = '';
      clase = '';
    } else if (valor <= umbralNormal) {
      estado = 'Normal';
      clase = 'text-success';
    } else {
      estado = 'Alterado';
      clase = 'text-danger';
    }
    
    // Actualizar el estado
    estadoElement.textContent = estado;
    estadoElement.className = clase;
    
    // Actualizar interpretación
    actualizarInterpretacionSensitiva();
  }
}

function mostrarMapaSensitivo() {
  // Implementación de funcionalidad del mapa corporal para sensibilidad
  // Esta es una versión simplificada, podría requerir un componente más complejo
  
  // Mostrar modal o contenedor para el mapa
  alert('La funcionalidad del mapa corporal sensitivo se implementará en una próxima versión');
  
  // Aquí iría la lógica para inicializar y mostrar el mapa corporal
  // con capacidad para marcar alteraciones sensitivas
}

function actualizarInterpretacionSensitiva() {
  const interpretacionDiv = document.getElementById('interpretacion-sensitiva-texto');
  const recomendacionesDiv = document.getElementById('recomendaciones-sensitiva-texto');
  
  if (!interpretacionDiv || !recomendacionesDiv) return;
  
  // Contar alteraciones por categoría
  let alteracionesSuperficiales = 0;
  let alteracionesProfundas = 0;
  let alteracionesDiscriminativas = 0;
  
  // Sensibilidad superficial
  ['tacto_superficial', 'dolor_superficial', 'temperatura'].forEach(tipo => {
    const derInput = document.getElementById(`${tipo}_der`);
    const izqInput = document.getElementById(`${tipo}_izq`);
    
    if (derInput && derInput.value && derInput.value !== 'Normal') alteracionesSuperficiales++;
    if (izqInput && izqInput.value && izqInput.value !== 'Normal') alteracionesSuperficiales++;
  });
  
  // Sensibilidad profunda
  ['propiocepcion', 'vibracion', 'barestesia'].forEach(tipo => {
    const derInput = document.getElementById(`${tipo}_der`);
    const izqInput = document.getElementById(`${tipo}_izq`);
    
    if (derInput && derInput.value && derInput.value !== 'Normal') alteracionesProfundas++;
    if (izqInput && izqInput.value && izqInput.value !== 'Normal') alteracionesProfundas++;
  });
  
  // Sensibilidad discriminativa
  ['estereognosia', 'grafestesia'].forEach(tipo => {
    const derInput = document.getElementById(`${tipo}_der`);
    const izqInput = document.getElementById(`${tipo}_izq`);
    
    if (derInput && derInput.value && derInput.value !== 'Normal') alteracionesDiscriminativas++;
    if (izqInput && izqInput.value && izqInput.value !== 'Normal') alteracionesDiscriminativas++;
  });
  
  // Discriminación dos puntos
  const discDerInput = document.getElementById('discriminacion_der');
  const discIzqInput = document.getElementById('discriminacion_izq');
  const discDerEstado = document.getElementById('discriminacion_der_estado');
  const discIzqEstado = document.getElementById('discriminacion_izq_estado');
  
  if (discDerEstado && discDerEstado.textContent === 'Alterado') alteracionesDiscriminativas++;
  if (discIzqEstado && discIzqEstado.textContent === 'Alterado') alteracionesDiscriminativas++;
  
  // Generar interpretación
  let interpretacion = '';
  let recomendaciones = '';
  
  // Si no hay suficientes datos para interpretación
  const datosCompletados = document.querySelectorAll('[id$="_der"], [id$="_izq"]');
  const datosCompletadosCount = Array.from(datosCompletados).filter(input => input.value).length;
  
  if (datosCompletadosCount < 5) {
    interpretacion = 'Complete más campos de la evaluación sensitiva para obtener una interpretación clínica.';
    recomendaciones = 'Se generarán recomendaciones basadas en los hallazgos de la evaluación.';
  } else {
    // Interpretación según hallazgos
    if (alteracionesSuperficiales === 0 && alteracionesProfundas === 0 && alteracionesDiscriminativas === 0) {
      interpretacion = 'No se detectan alteraciones sensitivas significativas. La sensibilidad superficial, profunda y discriminativa se encuentran conservadas.';
      recomendaciones = 'No se requieren intervenciones específicas dirigidas al sistema sensitivo.';
    } else {
      // Construir interpretación según alteraciones encontradas
      let detalles = [];
      
      if (alteracionesSuperficiales > 0) {
        detalles.push(`alteraciones en la sensibilidad superficial (${alteracionesSuperficiales} hallazgos)`);
      }
      
      if (alteracionesProfundas > 0) {
        detalles.push(`alteraciones en la sensibilidad profunda (${alteracionesProfundas} hallazgos)`);
      }
      
      if (alteracionesDiscriminativas > 0) {
        detalles.push(`alteraciones en la sensibilidad discriminativa (${alteracionesDiscriminativas} hallazgos)`);
      }
      
      interpretacion = `Se detectan ${detalles.join(' y ')}. `;
      
      // Patrones clínicos comunes
      if (alteracionesSuperficiales > 0 && alteracionesProfundas === 0) {
        interpretacion += 'El patrón de afectación de sensibilidad superficial con preservación de profunda sugiere lesión de vías espinotalámicas laterales o afectación de nervio periférico.';
      } else if (alteracionesSuperficiales === 0 && alteracionesProfundas > 0) {
        interpretacion += 'El patrón de afectación de sensibilidad profunda con preservación de superficial sugiere lesión de cordones posteriores medulares.';
      } else if (alteracionesDiscriminativas > 0 && (alteracionesSuperficiales > 0 || alteracionesProfundas > 0)) {
        interpretacion += 'La combinación de alteraciones discriminativas con otras modalidades sensitivas sugiere una afectación de mayor complejidad, posiblemente involucrando corteza sensorial o vías de asociación.';
      }
      
      // Recomendaciones según hallazgos
      recomendaciones = 'Se recomienda: ';
      let recList = [];
      
      if (alteracionesSuperficiales > 0 || alteracionesProfundas > 0) {
        recList.push('Realizar una evaluación complementaria con neurólogo para descartar patología neurológica específica');
        recList.push('Implementar ejercicios de reeducación sensitiva adaptados a las modalidades alteradas');
      }
      
      if (alteracionesDiscriminativas > 0) {
        recList.push('Incluir entrenamiento de discriminación táctil en el plan terapéutico');
      }
      
      if (recList.length > 0) {
        recomendaciones += recList.join(', ') + '.';
      } else {
        recomendaciones = 'Complete más campos para obtener recomendaciones específicas.';
      }
    }
  }
  
  // Actualizar la interfaz
  interpretacionDiv.textContent = interpretacion;
  recomendacionesDiv.textContent = recomendaciones;
  
  // Actualizar estado del cuestionario en la badge
  actualizarEstadoCuestionario('evaluacion-sensitiva-badge', datosCompletadosCount > 10);
}

// ================= REFLEJOS Y SIGNOS PATOLÓGICOS =================

function inicializarReflejos() {
  // Inicializar selectores de reflejos
  const selectoresReflejos = document.querySelectorAll('[id^="reflejo_"]');
  selectoresReflejos.forEach(selector => {
    if (selector.id.includes('hoffman') || selector.id.includes('babinski') || selector.id.includes('clonus')) {
      selector.addEventListener('change', function() {
        const baseName = selector.id.substring(8).split('_')[0]; // Extraer nombre base del reflejo
        evaluarReflejoPatologico(baseName);
      });
    } else {
      selector.addEventListener('change', function() {
        const baseName = selector.id.substring(8).split('_')[0]; // Extraer nombre base del reflejo
        evaluarReflejo(baseName);
      });
    }
  });
  
  // Inicializar el campo de otros reflejos
  const otrosReflejos = document.getElementById('otros_reflejos');
  if (otrosReflejos) {
    otrosReflejos.addEventListener('change', actualizarInterpretacionReflejos);
  }
}

function evaluarReflejo(nombreReflejo) {
  const reflejoDer = document.getElementById(`reflejo_${nombreReflejo}_der`);
  const reflejoIzq = document.getElementById(`reflejo_${nombreReflejo}_izq`);
  
  if (!reflejoDer || !reflejoIzq) return;
  
  // Actualizar la interpretación de reflejos
  actualizarInterpretacionReflejos();
}

function evaluarReflejoPatologico(nombreReflejo) {
  // Para reflejos patológicos como Hoffman y Babinski
  const reflejoDer = document.getElementById(`reflejo_${nombreReflejo}_der`);
  const reflejoIzq = document.getElementById(`reflejo_${nombreReflejo}_izq`);
  
  if (!reflejoDer || !reflejoIzq) return;
  
  // Actualizar la interpretación de reflejos
  actualizarInterpretacionReflejos();
}

function actualizarInterpretacionReflejos() {
  const interpretacionDiv = document.getElementById('interpretacion-reflejos-texto');
  const recomendacionesDiv = document.getElementById('recomendaciones-reflejos-texto');
  
  if (!interpretacionDiv || !recomendacionesDiv) return;
  
  // Contar datos de reflejos
  let reflejosMSSuperior = { hiper: 0, hipo: 0, normal: 0, total: 0 };
  let reflejosMSInferior = { hiper: 0, hipo: 0, normal: 0, total: 0 };
  let reflejosPatologicos = { positivos: 0, total: 0 };
  
  // Reflejos miembro superior
  ['bicipital', 'estilorradial', 'tricipital', 'flexor'].forEach(reflejo => {
    const derValue = document.getElementById(`reflejo_${reflejo}_der`)?.value;
    const izqValue = document.getElementById(`reflejo_${reflejo}_izq`)?.value;
    
    // Contar reflejos derecha
    if (derValue) {
      reflejosMSSuperior.total++;
      const valor = parseInt(derValue);
      if (valor === 0 || valor === 1) reflejosMSSuperior.hipo++;
      else if (valor === 2) reflejosMSSuperior.normal++;
      else if (valor === 3 || valor === 4) reflejosMSSuperior.hiper++;
    }
    
    // Contar reflejos izquierda
    if (izqValue) {
      reflejosMSSuperior.total++;
      const valor = parseInt(izqValue);
      if (valor === 0 || valor === 1) reflejosMSSuperior.hipo++;
      else if (valor === 2) reflejosMSSuperior.normal++;
      else if (valor === 3 || valor === 4) reflejosMSSuperior.hiper++;
    }
  });
  
  // Reflejos miembro inferior
  ['patelar', 'aquileo', 'mediopubiano'].forEach(reflejo => {
    const derValue = document.getElementById(`reflejo_${reflejo}_der`)?.value;
    const izqValue = document.getElementById(`reflejo_${reflejo}_izq`)?.value;
    
    // Contar reflejos derecha
    if (derValue) {
      reflejosMSInferior.total++;
      const valor = parseInt(derValue);
      if (valor === 0 || valor === 1) reflejosMSInferior.hipo++;
      else if (valor === 2) reflejosMSInferior.normal++;
      else if (valor === 3 || valor === 4) reflejosMSInferior.hiper++;
    }
    
    // Contar reflejos izquierda
    if (izqValue) {
      reflejosMSInferior.total++;
      const valor = parseInt(izqValue);
      if (valor === 0 || valor === 1) reflejosMSInferior.hipo++;
      else if (valor === 2) reflejosMSInferior.normal++;
      else if (valor === 3 || valor === 4) reflejosMSInferior.hiper++;
    }
  });
  
  // Reflejos patológicos
  ['hoffman', 'babinski'].forEach(reflejo => {
    const derValue = document.getElementById(`reflejo_${reflejo}_der`)?.value;
    const izqValue = document.getElementById(`reflejo_${reflejo}_izq`)?.value;
    
    if (derValue) {
      reflejosPatologicos.total++;
      if (derValue === 'Presente') reflejosPatologicos.positivos++;
    }
    
    if (izqValue) {
      reflejosPatologicos.total++;
      if (izqValue === 'Presente') reflejosPatologicos.positivos++;
    }
  });
  
  // Clonus (tratamiento especial)
  const clonusDer = document.getElementById('reflejo_clonus_der')?.value;
  const clonusIzq = document.getElementById('reflejo_clonus_izq')?.value;
  
  if (clonusDer) {
    reflejosPatologicos.total++;
    if (clonusDer === 'Inagotable' || clonusDer === 'Agotable') reflejosPatologicos.positivos++;
  }
  
  if (clonusIzq) {
    reflejosPatologicos.total++;
    if (clonusIzq === 'Inagotable' || clonusIzq === 'Agotable') reflejosPatologicos.positivos++;
  }
  
  // Generar interpretación
  let interpretacion = '';
  let recomendaciones = '';
  
  // Si no hay suficientes datos para interpretación
  const datosCompletados = reflejosMSSuperior.total + reflejosMSInferior.total + reflejosPatologicos.total;
  
  if (datosCompletados < 5) {
    interpretacion = 'Complete más campos de la evaluación de reflejos para obtener una interpretación clínica.';
    recomendaciones = 'Se generarán recomendaciones basadas en los hallazgos de la evaluación.';
  } else {
    // Interpretación según hallazgos
    let patronesMS = [];
    let patronesMI = [];
    let patronesPatologicos = [];
    
    // Interpretar miembro superior
    if (reflejosMSSuperior.total > 0) {
      if (reflejosMSSuperior.hiper > reflejosMSSuperior.normal && reflejosMSSuperior.hiper > reflejosMSSuperior.hipo) {
        patronesMS.push("hiperreflexia en miembro superior");
      } else if (reflejosMSSuperior.hipo > reflejosMSSuperior.normal && reflejosMSSuperior.hipo > reflejosMSSuperior.hiper) {
        patronesMS.push("hiporreflexia en miembro superior");
      } else if (reflejosMSSuperior.normal > reflejosMSSuperior.hiper && reflejosMSSuperior.normal > reflejosMSSuperior.hipo) {
        patronesMS.push("reflejos normales en miembro superior");
      }
    }
    
    // Interpretar miembro inferior
    if (reflejosMSInferior.total > 0) {
      if (reflejosMSInferior.hiper > reflejosMSInferior.normal && reflejosMSInferior.hiper > reflejosMSInferior.hipo) {
        patronesMI.push("hiperreflexia en miembro inferior");
      } else if (reflejosMSInferior.hipo > reflejosMSInferior.normal && reflejosMSInferior.hipo > reflejosMSInferior.hiper) {
        patronesMI.push("hiporreflexia en miembro inferior");
      } else if (reflejosMSInferior.normal > reflejosMSInferior.hiper && reflejosMSInferior.normal > reflejosMSInferior.hipo) {
        patronesMI.push("reflejos normales en miembro inferior");
      }
    }
    
    // Interpretar reflejos patológicos
    if (reflejosPatologicos.total > 0) {
      if (reflejosPatologicos.positivos > 0) {
        patronesPatologicos.push(`presencia de ${reflejosPatologicos.positivos} reflejos patológicos positivos`);
      } else {
        patronesPatologicos.push("ausencia de reflejos patológicos");
      }
    }
    
    // Construir interpretación
    let patrones = [...patronesMS, ...patronesMI, ...patronesPatologicos];
    if (patrones.length > 0) {
      interpretacion = `La evaluación de reflejos muestra ${patrones.join(', ')}. `;
      
      // Agregar interpretación clínica adicional
      if ((reflejosMSSuperior.hiper > 0 || reflejosMSInferior.hiper > 0) && reflejosPatologicos.positivos > 0) {
        interpretacion += 'El patrón de hiperreflexia con signos patológicos positivos sugiere síndrome de neurona motora superior (lesión de vía piramidal).';
      } else if (reflejosMSSuperior.hipo > 0 || reflejosMSInferior.hipo > 0) {
        interpretacion += 'La hiporreflexia sugiere compromiso de neurona motora inferior, raíz nerviosa o nervio periférico.';
      } else if ((reflejosMSSuperior.normal > 0 || reflejosMSInferior.normal > 0) && reflejosPatologicos.positivos === 0) {
        interpretacion += 'Los hallazgos sugieren normalidad del sistema de reflejos.';
      }
    } else {
      interpretacion = 'Evaluación de reflejos incompleta. Complete más campos para obtener una interpretación clínica detallada.';
    }
    
    // Recomendaciones según hallazgos
    recomendaciones = 'Se recomienda: ';
    let recList = [];
    
    if ((reflejosMSSuperior.hiper > 0 || reflejosMSInferior.hiper > 0) && reflejosPatologicos.positivos > 0) {
      recList.push('Realizar evaluación médica neurológica para investigar posible lesión de vía piramidal');
      recList.push('Incluir técnicas de neuromodulación y manejo de espasticidad en el plan terapéutico');
    } else if (reflejosMSSuperior.hipo > 0 || reflejosMSInferior.hipo > 0) {
      recList.push('Evaluar fuerza muscular y control motor voluntario en los segmentos con hiporreflexia');
      recList.push('Considerar técnicas de facilitación neuromuscular en el plan terapéutico');
    } else if ((reflejosMSSuperior.normal > 0 || reflejosMSInferior.normal > 0) && reflejosPatologicos.positivos === 0) {
      recList.push('No se requieren intervenciones específicas dirigidas al sistema de reflejos');
    }
    
    if (recList.length > 0) {
      recomendaciones += recList.join(', ') + '.';
    } else {
      recomendaciones = 'Complete más campos para obtener recomendaciones específicas.';
    }
  }
  
  // Actualizar la interfaz
  interpretacionDiv.textContent = interpretacion;
  recomendacionesDiv.textContent = recomendaciones;
  
  // Actualizar estado del cuestionario en la badge
  actualizarEstadoCuestionario('reflejos-badge', datosCompletados > 5);
}

// ================= PRUEBAS ESPECIALES NEUROLÓGICAS =================

function inicializarPruebasNeurologicas() {
  // Inicializar selectores de pruebas de tensión neural
  document.querySelectorAll('[id$="_der"], [id$="_izq"], [id$="_resultado"]').forEach(selector => {
    if (selector.id.includes('slump') || selector.id.includes('slr') || 
        selector.id.includes('ulnt') || selector.id.includes('spurling') || 
        selector.id.includes('distraccion') || selector.id.includes('valsalva') || 
        selector.id.includes('neri')) {
      selector.addEventListener('change', function() {
        const baseName = selector.id.split('_')[0]; // Extraer nombre base de la prueba
        evaluarTensionNeural(baseName);
      });
    } else if (selector.id.includes('tinel') || selector.id.includes('phalen') || 
              selector.id.includes('comp_cubital') || selector.id.includes('finkelstein')) {
      selector.addEventListener('change', function() {
        const baseName = selector.id.split('_')[0] + (selector.id.includes('cubital') ? '_cubital' : '');
        if (selector.id.includes('tinel_mediano')) baseName = 'tinel_mediano';
        if (selector.id.includes('tinel_cubital')) baseName = 'tinel_cubital';
        evaluarCompresionNerviosa(baseName);
      });
    }
  });
  
  // Inicializar el campo de otras pruebas
  const otrasPruebas = document.getElementById('otras_pruebas_neuro');
  if (otrasPruebas) {
    otrasPruebas.addEventListener('change', actualizarInterpretacionPruebasNeuro);
  }
}

function evaluarTensionNeural(nombrePrueba) {
  // Actualizar la interpretación de pruebas neurológicas
  actualizarInterpretacionPruebasNeuro();
}

function evaluarCompresionNerviosa(nombrePrueba) {
  // Actualizar la interpretación de pruebas neurológicas
  actualizarInterpretacionPruebasNeuro();
}

function actualizarInterpretacionPruebasNeuro() {
  const interpretacionDiv = document.getElementById('interpretacion-pruebas-neuro-texto');
  const recomendacionesDiv = document.getElementById('recomendaciones-pruebas-neuro-texto');
  
  if (!interpretacionDiv || !recomendacionesDiv) return;
  
  // Contar resultados de pruebas
  let tensionNeuralPositivos = 0;
  let tensionNeuralTotal = 0;
  let provocacionRadicularPositivos = 0;
  let provocacionRadicularTotal = 0;
  let compresionNerviosaPositivos = 0;
  let compresionNerviosaTotal = 0;
  
  // Tests de tensión neural
  ['slump', 'ulnt1', 'ulnt2', 'ulnt3'].forEach(test => {
    const derValue = document.getElementById(`${test}_der`)?.value;
    const izqValue = document.getElementById(`${test}_izq`)?.value;
    
    if (derValue) {
      tensionNeuralTotal++;
      if (derValue.includes('Positivo')) tensionNeuralPositivos++;
    }
    
    if (izqValue) {
      tensionNeuralTotal++;
      if (izqValue.includes('Positivo')) tensionNeuralPositivos++;
    }
  });
  
  // SLR especial
  const slrDerResult = document.getElementById('slr_der_resultado')?.value;
  const slrIzqResult = document.getElementById('slr_izq_resultado')?.value;
  
  if (slrDerResult) {
    tensionNeuralTotal++;
    if (slrDerResult === 'Positivo') tensionNeuralPositivos++;
  }
  
  if (slrIzqResult) {
    tensionNeuralTotal++;
    if (slrIzqResult === 'Positivo') tensionNeuralPositivos++;
  }
  
  // Tests de provocación radicular
  ['spurling', 'distraccion', 'valsalva', 'neri'].forEach(test => {
    const resultado = document.getElementById(`${test}_resultado`)?.value;
    
    if (resultado) {
      provocacionRadicularTotal++;
      if (resultado.includes('Positivo') || (test === 'distraccion' && resultado.includes('Alivio'))) {
        provocacionRadicularPositivos++;
      }
    }
  });
  
  // Tests de compresión nerviosa
  ['tinel_mediano', 'phalen', 'tinel_cubital', 'comp_cubital', 'finkelstein'].forEach(test => {
    const derValue = document.getElementById(`${test}_der`)?.value;
    const izqValue = document.getElementById(`${test}_izq`)?.value;
    
    if (derValue) {
      compresionNerviosaTotal++;
      if (derValue === 'Positivo') compresionNerviosaPositivos++;
    }
    
    if (izqValue) {
      compresionNerviosaTotal++;
      if (izqValue === 'Positivo') compresionNerviosaPositivos++;
    }
  });
  
  // Generar interpretación
  let interpretacion = '';
  let recomendaciones = '';
  
  // Si no hay suficientes datos para interpretación
  const datosCompletados = tensionNeuralTotal + provocacionRadicularTotal + compresionNerviosaTotal;
  
  if (datosCompletados < 3) {
    interpretacion = 'Complete más campos de pruebas neurológicas para obtener una interpretación clínica.';
    recomendaciones = 'Se generarán recomendaciones basadas en los hallazgos de la evaluación.';
  } else {
    // Interpretación según hallazgos
    let hallazgos = [];
    
    if (tensionNeuralTotal > 0) {
      const porcentaje = Math.round((tensionNeuralPositivos / tensionNeuralTotal) * 100);
      if (tensionNeuralPositivos > 0) {
        hallazgos.push(`tests de tensión neural positivos (${porcentaje}% de los evaluados)`);
      } else {
        hallazgos.push('ausencia de hallazgos en tests de tensión neural');
      }
    }
    
    if (provocacionRadicularTotal > 0) {
      const porcentaje = Math.round((provocacionRadicularPositivos / provocacionRadicularTotal) * 100);
      if (provocacionRadicularPositivos > 0) {
        hallazgos.push(`tests de provocación radicular positivos (${porcentaje}% de los evaluados)`);
      } else {
        hallazgos.push('ausencia de hallazgos en tests de provocación radicular');
      }
    }
    
    if (compresionNerviosaTotal > 0) {
      const porcentaje = Math.round((compresionNerviosaPositivos / compresionNerviosaTotal) * 100);
      if (compresionNerviosaPositivos > 0) {
        hallazgos.push(`tests de compresión nerviosa positivos (${porcentaje}% de los evaluados)`);
      } else {
        hallazgos.push('ausencia de hallazgos en tests de compresión nerviosa');
      }
    }
    
    if (hallazgos.length > 0) {
      interpretacion = `La evaluación de pruebas neurológicas muestra ${hallazgos.join(', ')}. `;
      
      // Patrones clínicos
      if (tensionNeuralPositivos > 0 && provocacionRadicularPositivos > 0) {
        interpretacion += 'La combinación de tests de tensión neural y provocación radicular positivos aumenta la probabilidad de radiculopatía.';
      } else if (tensionNeuralPositivos > 0 && compresionNerviosaPositivos > 0) {
        interpretacion += 'La presencia de tests de tensión neural y compresión nerviosa positivos sugiere una neuropatía periférica.';
      } else if (tensionNeuralPositivos === 0 && provocacionRadicularPositivos === 0 && compresionNerviosaPositivos === 0) {
        interpretacion += 'La ausencia de hallazgos positivos en las pruebas neurológicas sugiere baja probabilidad de compromiso neural.';
      }
    } else {
      interpretacion = 'Evaluación de pruebas neurológicas incompleta. Complete más campos para obtener una interpretación clínica detallada.';
    }
    
    // Recomendaciones según hallazgos
    recomendaciones = 'Se recomienda: ';
    let recList = [];
    
    if (tensionNeuralPositivos > 0 || provocacionRadicularPositivos > 0) {
      recList.push('Incluir técnicas de movilización neural en el plan terapéutico');
      recList.push('Considerar correlación con hallazgos imagenológicos (cuando estén disponibles)');
    }
    
    if (compresionNerviosaPositivos > 0) {
      recList.push('Implementar técnicas de deslizamiento y movilización específicas para los nervios comprometidos');
      recList.push('Evaluar factores posturales y ergonómicos que puedan contribuir a la compresión nerviosa');
    }
    
    if (recList.length > 0) {
      recomendaciones += recList.join(', ') + '.';
    } else {
      recomendaciones = 'Complete más campos para obtener recomendaciones específicas.';
    }
  }
  
  // Actualizar la interfaz
  interpretacionDiv.textContent = interpretacion;
  recomendacionesDiv.textContent = recomendaciones;
  
  // Actualizar estado del cuestionario en la badge
  actualizarEstadoCuestionario('pruebas-neurologicas-badge', datosCompletados > 3);
}

// ================= INTERPRETACIÓN Y BANDERAS ROJAS =================

function inicializarInterpretacion() {
  // Inicializar checkbox de banderas rojas
  document.querySelectorAll('input[name="banderas_rojas[]"]').forEach(checkbox => {
    checkbox.addEventListener('change', actualizarBanderasRojas);
  });
  
  // Inicializar campos de observaciones
  const obsManual = document.getElementById('interpretacion_manual');
  const recsManual = document.getElementById('recomendaciones_manuales');
  
  if (obsManual) obsManual.addEventListener('change', actualizarInterpretacionGlobal);
  if (recsManual) recsManual.addEventListener('change', actualizarRecomendacionesGlobales);
  
  // Inicializar interpretación inicial
  actualizarInterpretacionGlobal();
  actualizarBanderasRojas();
}

function actualizarBanderasRojas() {
  const banderasContainer = document.getElementById('banderas_rojas_container');
  if (!banderasContainer) return;
  
  // Obtener banderas rojas seleccionadas
  const checkboxes = document.querySelectorAll('input[name="banderas_rojas[]"]:checked');
  const banderasSeleccionadas = Array.from(checkboxes).map(cb => cb.value);
  
  // Determinar mensaje según banderas seleccionadas
  let contenido = '';
  
  if (banderasSeleccionadas.length === 0) {
    contenido = `
      <div class="alert alert-success">
        <p><i class="fas fa-check-circle"></i> <strong>No se han identificado banderas rojas neurológicas.</strong></p>
        <p>La ausencia de banderas rojas neurológicas sugiere bajo riesgo de patología neurológica grave o progresiva.</p>
      </div>
    `;
  } else {
    contenido = `
      <div class="alert alert-danger">
        <p><i class="fas fa-exclamation-triangle"></i> <strong>Se han identificado ${banderasSeleccionadas.length} banderas rojas neurológicas:</strong></p>
        <ul>
          ${banderasSeleccionadas.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <p><strong>Acción recomendada:</strong> Derivación médica urgente para evaluación neurológica especializada.</p>
      </div>
    `;
  }
  
  // Actualizar contenido
  banderasContainer.innerHTML = contenido;
  
  // Actualizar recomendaciones globales
  actualizarRecomendacionesGlobales();
  
  // Actualizar estado del cuestionario en la badge
  actualizarEstadoCuestionario('interpretacion-neuro-badge', true);
}

function actualizarInterpretacionGlobal() {
  const container = document.getElementById('interpretacion_global_container');
  if (!container) return;
  
  // Buscar datos de las otras secciones para interpretación global
  let haySensitiva = document.getElementById('interpretacion-sensitiva-texto') && 
                    document.getElementById('interpretacion-sensitiva-texto').textContent !== 'Complete la evaluación sensitiva para obtener recomendaciones clínicas.';
  
  let hayReflejos = document.getElementById('interpretacion-reflejos-texto') && 
                   document.getElementById('interpretacion-reflejos-texto').textContent !== 'Complete la evaluación de reflejos para obtener recomendaciones clínicas.';
  
  let hayPruebas = document.getElementById('interpretacion-pruebas-neuro-texto') && 
                  document.getElementById('interpretacion-pruebas-neuro-texto').textContent !== 'Complete la evaluación de pruebas neurológicas para obtener recomendaciones clínicas.';
  
  let totalSecciones = (haySensitiva ? 1 : 0) + (hayReflejos ? 1 : 0) + (hayPruebas ? 1 : 0);
  
  // Crear contenido según datos disponibles
  let contenido = '';
  
  if (totalSecciones === 0) {
    contenido = `
      <div class="alert alert-warning">
        <p><i class="fas fa-info-circle"></i> <strong>Interpretación pendiente</strong></p>
        <p>Complete al menos una de las secciones de la evaluación neurológica (sensitiva, reflejos o pruebas especiales) para generar una interpretación global.</p>
      </div>
    `;
  } else {
    let resumen = [];
    
    if (haySensitiva) {
      const texto = document.getElementById('interpretacion-sensitiva-texto').textContent;
      resumen.push(`<strong>Evaluación Sensitiva:</strong> ${texto}`);
    }
    
    if (hayReflejos) {
      const texto = document.getElementById('interpretacion-reflejos-texto').textContent;
      resumen.push(`<strong>Reflejos y Signos Patológicos:</strong> ${texto}`);
    }
    
    if (hayPruebas) {
      const texto = document.getElementById('interpretacion-pruebas-neuro-texto').textContent;
      resumen.push(`<strong>Pruebas Neurológicas:</strong> ${texto}`);
    }
    
    contenido = `
      <div class="alert alert-info">
        <p><i class="fas fa-clipboard-check"></i> <strong>Interpretación global de la evaluación neurológica</strong></p>
        <div class="mt-2">
          ${resumen.map(r => `<p>${r}</p>`).join('')}
        </div>
      </div>
    `;
  }
  
  // Actualizar contenido
  container.innerHTML = contenido;
}

function actualizarRecomendacionesGlobales() {
  const container = document.getElementById('recomendaciones_neuro_container');
  if (!container) return;
  
  // Verificar si hay banderas rojas
  const hayBanderasRojas = document.querySelectorAll('input[name="banderas_rojas[]"]:checked').length > 0;
  
  // Buscar recomendaciones de las otras secciones
  let recomendacionesSensitiva = document.getElementById('recomendaciones-sensitiva-texto')?.textContent || '';
  let recomendacionesReflejos = document.getElementById('recomendaciones-reflejos-texto')?.textContent || '';
  let recomendacionesPruebas = document.getElementById('recomendaciones-pruebas-neuro-texto')?.textContent || '';
  
  // Filtrar recomendaciones vacías o pendientes
  if (recomendacionesSensitiva.includes('Complete la evaluación')) recomendacionesSensitiva = '';
  if (recomendacionesReflejos.includes('Complete la evaluación')) recomendacionesReflejos = '';
  if (recomendacionesPruebas.includes('Complete la evaluación')) recomendacionesPruebas = '';
  
  let tieneRecomendaciones = recomendacionesSensitiva || recomendacionesReflejos || recomendacionesPruebas;
  
  // Crear contenido según datos disponibles
  let contenido = '';
  
  if (hayBanderasRojas) {
    contenido = `
      <div class="alert alert-danger">
        <p><i class="fas fa-exclamation-circle"></i> <strong>ACCIÓN PRIORITARIA</strong></p>
        <p>Debido a la presencia de banderas rojas neurológicas, se recomienda:</p>
        <ol>
          <li>Derivación médica urgente para evaluación neurológica especializada.</li>
          <li>Suspender intervenciones kinesiológicas que puedan agravar los síntomas neurológicos.</li>
          <li>Documentar detalladamente los hallazgos para facilitar el diagnóstico médico.</li>
        </ol>
      </div>
    `;
  } else if (tieneRecomendaciones) {
    let resumen = [];
    
    if (recomendacionesSensitiva) {
      resumen.push(`<strong>Recomendaciones para alteraciones sensitivas:</strong> ${recomendacionesSensitiva}`);
    }
    
    if (recomendacionesReflejos) {
      resumen.push(`<strong>Recomendaciones para alteraciones de reflejos:</strong> ${recomendacionesReflejos}`);
    }
    
    if (recomendacionesPruebas) {
      resumen.push(`<strong>Recomendaciones para pruebas neurológicas:</strong> ${recomendacionesPruebas}`);
    }
    
    contenido = `
      <div class="alert alert-info">
        <p><i class="fas fa-list-check"></i> <strong>Recomendaciones para el plan de tratamiento</strong></p>
        <div class="mt-2">
          ${resumen.map(r => `<p>${r}</p>`).join('')}
        </div>
      </div>
    `;
  } else {
    contenido = `
      <div class="alert alert-warning">
        <p><i class="fas fa-info-circle"></i> <strong>Recomendaciones pendientes</strong></p>
        <p>Complete la evaluación neurológica para generar recomendaciones específicas para el plan de tratamiento.</p>
      </div>
    `;
  }
  
  // Actualizar contenido
  container.innerHTML = contenido;
}

// ================= FUNCIONES AUXILIARES =================

function actualizarEstadoCuestionario(badgeId, completado) {
  const badge = document.getElementById(badgeId);
  if (!badge) return;
  
  if (completado) {
    badge.textContent = 'Completado';
    badge.classList.remove('bg-danger');
    badge.classList.add('bg-success');
  } else {
    badge.textContent = 'No completado';
    badge.classList.remove('bg-success');
    badge.classList.add('bg-danger');
  }
}

// ================= GUARDADO DE DATOS EN FIREBASE =================

// Esta función será llamada desde pacientes.js al guardar los datos
function prepararDatosEvaluacionNeurologica() {
  // Recopilar datos de todas las secciones de evaluación neurológica
  let datos = {
    evaluacionSensitiva: obtenerDatosSensitivos(),
    reflejos: obtenerDatosReflejos(),
    pruebasNeurologicas: obtenerDatosPruebasNeurologicas(),
    interpretacion: obtenerDatosInterpretacion()
  };
  
  return datos;
}

function obtenerDatosSensitivos() {
  // Recopilar datos de evaluación sensitiva
  let datos = {
    region: document.getElementById('sensitiva_region')?.value || '',
    regionOtra: document.getElementById('sensitiva_region_otra')?.value || '',
    
    // Sensibilidad superficial
    tactoSuperficial: {
      derecha: document.getElementById('tacto_superficial_der')?.value || '',
      izquierda: document.getElementById('tacto_superficial_izq')?.value || '',
      observaciones: document.getElementById('tacto_superficial_obs')?.value || ''
    },
    dolorSuperficial: {
      derecha: document.getElementById('dolor_superficial_der')?.value || '',
      izquierda: document.getElementById('dolor_superficial_izq')?.value || '',
      observaciones: document.getElementById('dolor_superficial_obs')?.value || ''
    },
    temperatura: {
      derecha: document.getElementById('temperatura_der')?.value || '',
      izquierda: document.getElementById('temperatura_izq')?.value || '',
      observaciones: document.getElementById('temperatura_obs')?.value || ''
    },
    
    // Sensibilidad profunda
    propiocepcion: {
      derecha: document.getElementById('propiocepcion_der')?.value || '',
      izquierda: document.getElementById('propiocepcion_izq')?.value || '',
      observaciones: document.getElementById('propiocepcion_obs')?.value || ''
    },
    vibracion: {
      derecha: document.getElementById('vibracion_der')?.value || '',
      izquierda: document.getElementById('vibracion_izq')?.value || '',
      observaciones: document.getElementById('vibracion_obs')?.value || ''
    },
    barestesia: {
      derecha: document.getElementById('barestesia_der')?.value || '',
      izquierda: document.getElementById('barestesia_izq')?.value || '',
      observaciones: document.getElementById('barestesia_obs')?.value || ''
    },
    
    // Sensibilidad discriminativa
    discriminacionDosPuntos: {
      derecha: document.getElementById('discriminacion_der')?.value || '',
      izquierda: document.getElementById('discriminacion_izq')?.value || '',
      observaciones: document.getElementById('discriminacion_obs')?.value || ''
    },
    estereognosia: {
      derecha: document.getElementById('estereognosia_der')?.value || '',
      izquierda: document.getElementById('estereognosia_izq')?.value || '',
      observaciones: document.getElementById('estereognosia_obs')?.value || ''
    },
    grafestesia: {
      derecha: document.getElementById('grafestesia_der')?.value || '',
      izquierda: document.getElementById('grafestesia_izq')?.value || '',
      observaciones: document.getElementById('grafestesia_obs')?.value || ''
    },
    
    // Interpretación
    interpretacion: document.getElementById('interpretacion-sensitiva-texto')?.textContent || '',
    recomendaciones: document.getElementById('recomendaciones-sensitiva-texto')?.textContent || ''
  };
  
  return datos;
}

function obtenerDatosReflejos() {
  // Recopilar datos de reflejos
  let datos = {
    // Reflejos miembro superior
    bicipital: {
      derecha: document.getElementById('reflejo_bicipital_der')?.value || '',
      izquierda: document.getElementById('reflejo_bicipital_izq')?.value || ''
    },
    estilorradial: {
      derecha: document.getElementById('reflejo_estilorradial_der')?.value || '',
      izquierda: document.getElementById('reflejo_estilorradial_izq')?.value || ''
    },
    tricipital: {
      derecha: document.getElementById('reflejo_tricipital_der')?.value || '',
      izquierda: document.getElementById('reflejo_tricipital_izq')?.value || ''
    },
    flexor: {
      derecha: document.getElementById('reflejo_flexor_der')?.value || '',
      izquierda: document.getElementById('reflejo_flexor_izq')?.value || ''
    },
    hoffman: {
      derecha: document.getElementById('reflejo_hoffman_der')?.value || '',
      izquierda: document.getElementById('reflejo_hoffman_izq')?.value || ''
    },
    
    // Reflejos miembro inferior
    patelar: {
      derecha: document.getElementById('reflejo_patelar_der')?.value || '',
      izquierda: document.getElementById('reflejo_patelar_izq')?.value || ''
    },
    aquileo: {
      derecha: document.getElementById('reflejo_aquileo_der')?.value || '',
      izquierda: document.getElementById('reflejo_aquileo_izq')?.value || ''
    },
    mediopubiano: {
      derecha: document.getElementById('reflejo_mediopubiano_der')?.value || '',
      izquierda: document.getElementById('reflejo_mediopubiano_izq')?.value || ''
    },
    babinski: {
      derecha: document.getElementById('reflejo_babinski_der')?.value || '',
      izquierda: document.getElementById('reflejo_babinski_izq')?.value || ''
    },
    clonus: {
      derecha: document.getElementById('reflejo_clonus_der')?.value || '',
      izquierda: document.getElementById('reflejo_clonus_izq')?.value || ''
    },
    
    // Otros reflejos
    otrosReflejos: document.getElementById('otros_reflejos')?.value || '',
    
    // Interpretación
    interpretacion: document.getElementById('interpretacion-reflejos-texto')?.textContent || '',
    recomendaciones: document.getElementById('recomendaciones-reflejos-texto')?.textContent || ''
  };
  
  return datos;
}

function obtenerDatosPruebasNeurologicas() {
  // Recopilar datos de pruebas neurológicas
  let datos = {
    // Tests de tensión neural
    slump: {
      derecha: document.getElementById('slump_der')?.value || '',
      izquierda: document.getElementById('slump_izq')?.value || '',
      observaciones: document.getElementById('slump_obs')?.value || ''
    },
    slr: {
      derechaResultado: document.getElementById('slr_der_resultado')?.value || '',
      derechaGrados: document.getElementById('slr_der_grados')?.value || '',
      izquierdaResultado: document.getElementById('slr_izq_resultado')?.value || '',
      izquierdaGrados: document.getElementById('slr_izq_grados')?.value || '',
      observaciones: document.getElementById('slr_obs')?.value || ''
    },
    ulnt1: {
      derecha: document.getElementById('ulnt1_der')?.value || '',
      izquierda: document.getElementById('ulnt1_izq')?.value || '',
      observaciones: document.getElementById('ulnt1_obs')?.value || ''
    },
    ulnt2: {
      derecha: document.getElementById('ulnt2_der')?.value || '',
      izquierda: document.getElementById('ulnt2_izq')?.value || '',
      observaciones: document.getElementById('ulnt2_obs')?.value || ''
    },
    ulnt3: {
      derecha: document.getElementById('ulnt3_der')?.value || '',
      izquierda: document.getElementById('ulnt3_izq')?.value || '',
      observaciones: document.getElementById('ulnt3_obs')?.value || ''
    },
    
    // Tests de provocación radicular
    spurling: {
      resultado: document.getElementById('spurling_resultado')?.value || '',
      observaciones: document.getElementById('spurling_obs')?.value || ''
    },
    distraccion: {
      resultado: document.getElementById('distraccion_resultado')?.value || '',
      observaciones: document.getElementById('distraccion_obs')?.value || ''
    },
    valsalva: {
      resultado: document.getElementById('valsalva_resultado')?.value || '',
      observaciones: document.getElementById('valsalva_obs')?.value || ''
    },
    neri: {
      resultado: document.getElementById('neri_resultado')?.value || '',
      observaciones: document.getElementById('neri_obs')?.value || ''
    },
    
    // Tests de compresión nerviosa
    tinelMediano: {
      derecha: document.getElementById('tinel_mediano_der')?.value || '',
      izquierda: document.getElementById('tinel_mediano_izq')?.value || '',
      observaciones: document.getElementById('tinel_mediano_obs')?.value || ''
    },
    phalen: {
      derecha: document.getElementById('phalen_der')?.value || '',
      izquierda: document.getElementById('phalen_izq')?.value || '',
      observaciones: document.getElementById('phalen_obs')?.value || ''
    },
    tinelCubital: {
      derecha: document.getElementById('tinel_cubital_der')?.value || '',
      izquierda: document.getElementById('tinel_cubital_izq')?.value || '',
      observaciones: document.getElementById('tinel_cubital_obs')?.value || ''
    },
    compCubital: {
      derecha: document.getElementById('comp_cubital_der')?.value || '',
      izquierda: document.getElementById('comp_cubital_izq')?.value || '',
      observaciones: document.getElementById('comp_cubital_obs')?.value || ''
    },
    finkelstein: {
      derecha: document.getElementById('finkelstein_der')?.value || '',
      izquierda: document.getElementById('finkelstein_izq')?.value || '',
      observaciones: document.getElementById('finkelstein_obs')?.value || ''
    },
    
    // Otras pruebas
    otrasPruebas: document.getElementById('otras_pruebas_neuro')?.value || '',
    
    // Interpretación
    interpretacion: document.getElementById('interpretacion-pruebas-neuro-texto')?.textContent || '',
    recomendaciones: document.getElementById('recomendaciones-pruebas-neuro-texto')?.textContent || ''
  };
  
  return datos;
}

function obtenerDatosInterpretacion() {
  // Recopilar datos de interpretación y banderas rojas
  let banderasRojas = [];
  document.querySelectorAll('input[name="banderas_rojas[]"]:checked').forEach(checkbox => {
    banderasRojas.push(checkbox.value);
  });
  
  let datos = {
    interpretacionGlobal: document.getElementById('interpretacion_global_container')?.innerHTML || '',
    interpretacionManual: document.getElementById('interpretacion_manual')?.value || '',
    banderasRojas: banderasRojas,
    recomendacionesGlobales: document.getElementById('recomendaciones_neuro_container')?.innerHTML || '',
    recomendacionesManuales: document.getElementById('recomendaciones_manuales')?.value || ''
  };
  
  return datos;
}
