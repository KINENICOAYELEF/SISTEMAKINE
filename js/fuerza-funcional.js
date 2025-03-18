/**
 * SISTEMAKINE - Evaluación de Fuerza Funcional
 * Funciones para la evaluación de fuerza, potencia y capacidad funcional
 * Basado en evidencia científica actualizada
 */

// ============= FUNCIONES DE NAVEGACIÓN =============
function toggleCuestionario(id) {
  const content = document.getElementById(id);
  const header = content.previousElementSibling;
  const icon = header.querySelector('i.fas');
  
  if (content.style.display === "none") {
    content.style.display = "block";
    if (icon) {
      icon.className = icon.className.replace("fa-plus-circle", "fa-minus-circle");
    }
  } else {
    content.style.display = "none";
    if (icon) {
      icon.className = icon.className.replace("fa-minus-circle", "fa-plus-circle");
    }
  }
  verificarEstadoCuestionarios();
}

function toggleSubcuestionario(id) {
  const content = document.getElementById(id);
  const header = content.previousElementSibling;
  const icon = header.querySelector('i.fas');
  
  if (content.style.display === "none") {
    content.style.display = "block";
    if (icon) {
      icon.className = icon.className.replace("fa-plus-circle", "fa-minus-circle");
    }
  } else {
    content.style.display = "none";
    if (icon) {
      icon.className = icon.className.replace("fa-minus-circle", "fa-plus-circle");
    }
  }
}

// ============= TESTS FUNCIONALES ESTÁNDAR =============

/**
 * Evalúa el test de Sit-to-Stand según valores normativos por edad y género
 * Basado en: Bohannon (2006), Rikli & Jones (2013)
 */
function evaluarTestFuncional(test) {
  if (test === 'sit_to_stand') {
    const repeticiones = parseInt(document.getElementById('sit_to_stand_repeticiones').value);
    const edad = parseInt(document.getElementById('sit_to_stand_edad').value);
    const genero = document.getElementById('sit_to_stand_genero').value;
    
    if (!repeticiones || !edad || !genero) {
      document.getElementById('sit_to_stand_resultado').innerHTML = "Complete todos los campos para obtener una evaluación.";
      document.getElementById('sit_to_stand_resultado').className = "alert alert-secondary";
      return;
    }
    
    let resultado = "";
    let color = "";
    
    // Valores normativos según Rikli & Jones (2013)
    const normativosMasculino = {
      '60-64': {excelente: 16, bueno: 14, promedio: 12, bajo: 10},
      '65-69': {excelente: 15, bueno: 13, promedio: 11, bajo: 9},
      '70-74': {excelente: 14, bueno: 12, promedio: 10, bajo: 8},
      '75-79': {excelente: 13, bueno: 11, promedio: 9, bajo: 7},
      '80-84': {excelente: 12, bueno: 10, promedio: 8, bajo: 6},
      '85-89': {excelente: 11, bueno: 9, promedio: 7, bajo: 5},
      '90+': {excelente: 10, bueno: 8, promedio: 6, bajo: 4}
    };
    
    const normativosFemenino = {
      '60-64': {excelente: 15, bueno: 13, promedio: 11, bajo: 9},
      '65-69': {excelente: 14, bueno: 12, promedio: 10, bajo: 8},
      '70-74': {excelente: 13, bueno: 11, promedio: 9, bajo: 7},
      '75-79': {excelente: 12, bueno: 10, promedio: 8, bajo: 6},
      '80-84': {excelente: 11, bueno: 9, promedio: 7, bajo: 5},
      '85-89': {excelente: 10, bueno: 8, promedio: 6, bajo: 4},
      '90+': {excelente: 9, bueno: 7, promedio: 5, bajo: 3}
    };
    
    let rangoEdad = '';
    if (edad < 60) {
      // Para menores de 60 años, usar criterios diferentes
      if (genero === 'Masculino') {
        if (repeticiones >= 18) {
          resultado = "Excelente: Por encima del promedio para adultos sanos";
          color = "success";
        } else if (repeticiones >= 15) {
          resultado = "Bueno: Dentro del rango esperado para adultos sanos";
          color = "success";
        } else if (repeticiones >= 12) {
          resultado = "Promedio: Dentro del rango promedio poblacional";
          color = "warning";
        } else {
          resultado = "Bajo: Por debajo del promedio, indicando posible debilidad";
          color = "danger";
        }
      } else {
        if (repeticiones >= 16) {
          resultado = "Excelente: Por encima del promedio para adultos sanos";
          color = "success";
        } else if (repeticiones >= 13) {
          resultado = "Bueno: Dentro del rango esperado para adultos sanos";
          color = "success";
        } else if (repeticiones >= 10) {
          resultado = "Promedio: Dentro del rango promedio poblacional";
          color = "warning";
        } else {
          resultado = "Bajo: Por debajo del promedio, indicando posible debilidad";
          color = "danger";
        }
      }
    } else {
      // Para adultos mayores, usar los rangos de Rikli & Jones
      if (edad >= 60 && edad <= 64) rangoEdad = '60-64';
      else if (edad >= 65 && edad <= 69) rangoEdad = '65-69';
      else if (edad >= 70 && edad <= 74) rangoEdad = '70-74';
      else if (edad >= 75 && edad <= 79) rangoEdad = '75-79';
      else if (edad >= 80 && edad <= 84) rangoEdad = '80-84';
      else if (edad >= 85 && edad <= 89) rangoEdad = '85-89';
      else rangoEdad = '90+';
      
      const normativos = genero === 'Masculino' ? normativosMasculino : normativosFemenino;
      
      if (repeticiones >= normativos[rangoEdad].excelente) {
        resultado = "Excelente: Fuerza funcional superior al promedio para su edad y género";
        color = "success";
      } else if (repeticiones >= normativos[rangoEdad].bueno) {
        resultado = "Bueno: Fuerza funcional por encima del promedio para su edad y género";
        color = "success";
      } else if (repeticiones >= normativos[rangoEdad].promedio) {
        resultado = "Promedio: Fuerza funcional dentro del rango esperado para su edad y género";
        color = "warning";
      } else if (repeticiones >= normativos[rangoEdad].bajo) {
        resultado = "Por debajo del promedio: Fuerza funcional ligeramente disminuida";
        color = "warning";
      } else {
        resultado = "Bajo: Fuerza funcional significativamente disminuida. Considere programa de fortalecimiento";
        color = "danger";
      }
    }
    
    document.getElementById('sit_to_stand_resultado').innerHTML = resultado;
    document.getElementById('sit_to_stand_resultado').className = `alert alert-${color}`;
    
    // Actualizar interpretación global
    actualizarInterpretacionGlobal();
    
  } else if (test === 'push_up') {
    const repeticiones = parseInt(document.getElementById('push_up_repeticiones').value);
    const edad = parseInt(document.getElementById('push_up_edad').value);
    const genero = document.getElementById('push_up_genero').value;
    
    if (!repeticiones || !edad || !genero) {
      document.getElementById('push_up_resultado').innerHTML = "Complete todos los campos para obtener una evaluación.";
      document.getElementById('push_up_resultado').className = "alert alert-secondary";
      return;
    }
    
    let resultado = "";
    let color = "";
    
    // Valores normativos según ACSM (actualizado)
    const normativosMasculino = {
      '20-29': {excelente: 36, bueno: 29, promedio: 22, bajo: 17},
      '30-39': {excelente: 30, bueno: 22, promedio: 17, bajo: 12},
      '40-49': {excelente: 25, bueno: 17, promedio: 13, bajo: 10},
      '50-59': {excelente: 21, bueno: 13, promedio: 10, bajo: 7},
      '60+': {excelente: 18, bueno: 11, promedio: 8, bajo: 5}
    };
    
    const normativosFemenino = {
      '20-29': {excelente: 30, bueno: 21, promedio: 15, bajo: 10},
      '30-39': {excelente: 27, bueno: 20, promedio: 13, bajo: 8},
      '40-49': {excelente: 24, bueno: 15, promedio: 11, bajo: 6},
      '50-59': {excelente: 21, bueno: 11, promedio: 9, bajo: 4},
      '60+': {excelente: 17, bueno: 12, promedio: 5, bajo: 2}
    };
    
    let rangoEdad = '';
    if (edad >= 20 && edad <= 29) rangoEdad = '20-29';
    else if (edad >= 30 && edad <= 39) rangoEdad = '30-39';
    else if (edad >= 40 && edad <= 49) rangoEdad = '40-49';
    else if (edad >= 50 && edad <= 59) rangoEdad = '50-59';
    else rangoEdad = '60+';
    
    const normativos = genero === 'Masculino' ? normativosMasculino : normativosFemenino;
    
    if (repeticiones >= normativos[rangoEdad].excelente) {
      resultado = "Excelente: Fuerza-resistencia superior para su edad y género";
      color = "success";
    } else if (repeticiones >= normativos[rangoEdad].bueno) {
      resultado = "Bueno: Fuerza-resistencia por encima del promedio";
      color = "success";
    } else if (repeticiones >= normativos[rangoEdad].promedio) {
      resultado = "Promedio: Fuerza-resistencia dentro del rango esperado";
      color = "warning";
    } else if (repeticiones >= normativos[rangoEdad].bajo) {
      resultado = "Por debajo del promedio: Fuerza-resistencia ligeramente disminuida";
      color = "warning";
    } else {
      resultado = "Bajo: Fuerza-resistencia significativamente disminuida. Recomendado programa de fortalecimiento";
      color = "danger";
    }
    
    document.getElementById('push_up_resultado').innerHTML = resultado;
    document.getElementById('push_up_resultado').className = `alert alert-${color}`;
    
    // Actualizar interpretación global
    actualizarInterpretacionGlobal();
  }
}

// ============= TESTS DE RESISTENCIA MUSCULAR =============

/**
 * Evalúa los test de McGill de resistencia del core
 * Basado en: McGill et al. (1999, 2006)
 */
function evaluarMcGillTests() {
  const planchaFrontal = parseInt(document.getElementById('mcgill_plancha_frontal').value) || 0;
  const planchaLateralDerecha = parseInt(document.getElementById('mcgill_plancha_lateral_derecha').value) || 0;
  const planchaLateralIzquierda = parseInt(document.getElementById('mcgill_plancha_lateral_izquierda').value) || 0;
  const extensionLumbar = parseInt(document.getElementById('mcgill_extension_lumbar').value) || 0;
  const genero = document.getElementById('mcgill_genero').value;
  
  if (!genero || (planchaFrontal === 0 && planchaLateralDerecha === 0 && planchaLateralIzquierda === 0 && extensionLumbar === 0)) {
    document.getElementById('mcgill_resultado').innerHTML = "Complete al menos un test y seleccione el género para obtener una evaluación.";
    document.getElementById('mcgill_resultado').className = "alert alert-secondary";
    return;
  }
  
  // Valores de referencia según McGill (1999, actualizado)
  const referenciasMasculino = {
    planchaFrontal: 136,
    planchaLateral: 95,
    extensionLumbar: 161
  };
  
  const referenciasFemenino = {
    planchaFrontal: 134,
    planchaLateral: 75,
    extensionLumbar: 185
  };
  
  const referencias = genero === 'Masculino' ? referenciasMasculino : referenciasFemenino;
  
  let resultado = "<strong>Resultados de los tests de McGill:</strong><br>";
  
  // Evaluación de plancha frontal
  if (planchaFrontal > 0) {
    const porcentajeFrontal = (planchaFrontal / referencias.planchaFrontal) * 100;
    resultado += `<span class="badge ${getColorMcGill(porcentajeFrontal)}">Plancha Frontal: ${porcentajeFrontal.toFixed(0)}% del valor de referencia</span><br>`;
  }
  
  // Evaluación de planchas laterales
  if (planchaLateralDerecha > 0 && planchaLateralIzquierda > 0) {
    const porcentajeDerecha = (planchaLateralDerecha / referencias.planchaLateral) * 100;
    const porcentajeIzquierda = (planchaLateralIzquierda / referencias.planchaLateral) * 100;
    resultado += `<span class="badge ${getColorMcGill(porcentajeDerecha)}">Plancha Lateral Derecha: ${porcentajeDerecha.toFixed(0)}% del valor de referencia</span><br>`;
    resultado += `<span class="badge ${getColorMcGill(porcentajeIzquierda)}">Plancha Lateral Izquierda: ${porcentajeIzquierda.toFixed(0)}% del valor de referencia</span><br>`;
    
    // Ratio de simetría lateral
    const ratioLateral = Math.min(planchaLateralDerecha, planchaLateralIzquierda) / Math.max(planchaLateralDerecha, planchaLateralIzquierda);
    const colorRatioLateral = ratioLateral >= 0.95 ? "bg-success" : ratioLateral >= 0.85 ? "bg-warning" : "bg-danger";
    resultado += `<span class="badge ${colorRatioLateral}">Ratio Simetría Lateral: ${(ratioLateral * 100).toFixed(0)}% (ideal >95%)</span><br>`;
  }
  
  // Evaluación de extensión lumbar
  if (extensionLumbar > 0) {
    const porcentajeExtension = (extensionLumbar / referencias.extensionLumbar) * 100;
    resultado += `<span class="badge ${getColorMcGill(porcentajeExtension)}">Extensión Lumbar: ${porcentajeExtension.toFixed(0)}% del valor de referencia</span><br>`;
  }
  
  // Ratios de equilibrio muscular
  if (planchaFrontal > 0 && extensionLumbar > 0) {
    const ratioFlexExt = planchaFrontal / extensionLumbar;
    const colorRatioFlexExt = ratioFlexExt <= 1.0 ? "bg-success" : ratioFlexExt <= 1.2 ? "bg-warning" : "bg-danger";
    resultado += `<span class="badge ${colorRatioFlexExt}">Ratio Flexores/Extensores: ${ratioFlexExt.toFixed(2)} (ideal <1.0)</span><br>`;
  }
  
  document.getElementById('mcgill_resultado').innerHTML = resultado;
  document.getElementById('mcgill_resultado').className = "alert alert-info";
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Determina el color para la interpretación de los tests de McGill
 */
function getColorMcGill(porcentaje) {
  if (porcentaje >= 90) return "bg-success";
  if (porcentaje >= 70) return "bg-warning";
  return "bg-danger";
}

/**
 * Evalúa el Wall Sit Test (test de la pared)
 * Basado en valores normativos actualizados
 */
function evaluarWallSitTest() {
  const tiempo = parseInt(document.getElementById('wall_sit_tiempo').value);
  const edad = parseInt(document.getElementById('wall_sit_edad').value);
  const genero = document.getElementById('wall_sit_genero').value;
  
  if (!tiempo || !edad || !genero) {
    document.getElementById('wall_sit_resultado').innerHTML = "Complete todos los campos para obtener una evaluación.";
    document.getElementById('wall_sit_resultado').className = "alert alert-secondary";
    return;
  }
  
  // Valores normativos (en segundos)
  const normativosMasculino = {
    '18-25': {excelente: 102, bueno: 76, promedio: 58, bajo: 30},
    '26-35': {excelente: 84, bueno: 66, promedio: 50, bajo: 25},
    '36-45': {excelente: 75, bueno: 59, promedio: 44, bajo: 24},
    '46-55': {excelente: 68, bueno: 51, promedio: 39, bajo: 20},
    '56-65': {excelente: 55, bueno: 43, promedio: 33, bajo: 19},
    '65+': {excelente: 45, bueno: 38, promedio: 28, bajo: 15}
  };
  
  const normativosFemenino = {
    '18-25': {excelente: 82, bueno: 60, promedio: 44, bajo: 23},
    '26-35': {excelente: 65, bueno: 50, promedio: 37, bajo: 20},
    '36-45': {excelente: 55, bueno: 41, promedio: 31, bajo: 18},
    '46-55': {excelente: 44, bueno: 35, promedio: 28, bajo: 16},
    '56-65': {excelente: 36, bueno: 30, promedio: 23, bajo: 15},
    '65+': {excelente: 30, bueno: 25, promedio: 19, bajo: 10}
  };
  
  let rangoEdad = '';
  if (edad >= 18 && edad <= 25) rangoEdad = '18-25';
  else if (edad >= 26 && edad <= 35) rangoEdad = '26-35';
  else if (edad >= 36 && edad <= 45) rangoEdad = '36-45';
  else if (edad >= 46 && edad <= 55) rangoEdad = '46-55';
  else if (edad >= 56 && edad <= 65) rangoEdad = '56-65';
  else rangoEdad = '65+';
  
  const normativos = genero === 'Masculino' ? normativosMasculino : normativosFemenino;
  let resultado = "";
  let color = "";
  
  if (tiempo >= normativos[rangoEdad].excelente) {
    resultado = "Excelente: Resistencia muscular de cuádriceps superior";
    color = "success";
  } else if (tiempo >= normativos[rangoEdad].bueno) {
    resultado = "Bueno: Resistencia muscular de cuádriceps por encima del promedio";
    color = "success";
  } else if (tiempo >= normativos[rangoEdad].promedio) {
    resultado = "Promedio: Resistencia muscular de cuádriceps adecuada";
    color = "warning";
  } else if (tiempo >= normativos[rangoEdad].bajo) {
    resultado = "Por debajo del promedio: Resistencia muscular de cuádriceps reducida";
    color = "warning";
  } else {
    resultado = "Bajo: Resistencia muscular de cuádriceps deficiente";
    color = "danger";
  }
  
  document.getElementById('wall_sit_resultado').innerHTML = resultado;
  document.getElementById('wall_sit_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Evalúa el Pull-up/Chin-up Test
 * Basado en valores normativos actualizados
 */
function evaluarPullUpTest() {
  const tipo = document.getElementById('pullup_tipo').value;
  const repeticiones = parseInt(document.getElementById('pullup_repeticiones').value);
  const edad = parseInt(document.getElementById('pullup_edad').value);
  const genero = document.getElementById('pullup_genero').value;
  
  if (!repeticiones || !edad || !genero) {
    document.getElementById('pullup_resultado').innerHTML = "Complete todos los campos para obtener una evaluación.";
    document.getElementById('pullup_resultado').className = "alert alert-secondary";
    return;
  }
  
  // Valores normativos para Pull-up (agarre prono)
  const pullupMasculino = {
    '18-29': {excelente: 13, bueno: 9, promedio: 5, bajo: 1},
    '30-39': {excelente: 11, bueno: 7, promedio: 3, bajo: 1},
    '40-49': {excelente: 9, bueno: 5, promedio: 2, bajo: 1},
    '50-59': {excelente: 7, bueno: 3, promedio: 1, bajo: 0},
    '60+': {excelente: 5, bueno: 2, promedio: 1, bajo: 0}
  };
  
  const pullupFemenino = {
    '18-29': {excelente: 5, bueno: 3, promedio: 1, bajo: 0},
    '30-39': {excelente: 4, bueno: 2, promedio: 1, bajo: 0},
    '40-49': {excelente: 3, bueno: 1, promedio: 1, bajo: 0},
    '50-59': {excelente: 2, bueno: 1, promedio: 0, bajo: 0},
    '60+': {excelente: 1, bueno: 1, promedio: 0, bajo: 0}
  };
  
  // Valores normativos para Chin-up (agarre supino) - ligeramente más fáciles
  const chinupMasculino = {
    '18-29': {excelente: 15, bueno: 11, promedio: 6, bajo: 2},
    '30-39': {excelente: 13, bueno: 9, promedio: 4, bajo: 1},
    '40-49': {excelente: 11, bueno: 7, promedio: 3, bajo: 1},
    '50-59': {excelente: 9, bueno: 5, promedio: 2, bajo: 1},
    '60+': {excelente: 7, bueno: 3, promedio: 1, bajo: 0}
  };
  
  const chinupFemenino = {
    '18-29': {excelente: 7, bueno: 4, promedio: 2, bajo: 1},
    '30-39': {excelente: 6, bueno: 3, promedio: 1, bajo: 0},
    '40-49': {excelente: 5, bueno: 2, promedio: 1, bajo: 0},
    '50-59': {excelente: 3, bueno: 1, promedio: 1, bajo: 0},
    '60+': {excelente: 2, bueno: 1, promedio: 0, bajo: 0}
  };
  
  let normativosMasculino = tipo === 'Pull-up' ? pullupMasculino : chinupMasculino;
  let normativosFemenino = tipo === 'Pull-up' ? pullupFemenino : chinupFemenino;
  
  let rangoEdad = '';
  if (edad >= 18 && edad <= 29) rangoEdad = '18-29';
  else if (edad >= 30 && edad <= 39) rangoEdad = '30-39';
  else if (edad >= 40 && edad <= 49) rangoEdad = '40-49';
  else if (edad >= 50 && edad <= 59) rangoEdad = '50-59';
  else rangoEdad = '60+';
  
  const normativos = genero === 'Masculino' ? normativosMasculino : normativosFemenino;
  let resultado = "";
  let color = "";
  
  if (repeticiones >= normativos[rangoEdad].excelente) {
    resultado = "Excelente: Fuerza-resistencia de espalda y brazos superior";
    color = "success";
  } else if (repeticiones >= normativos[rangoEdad].bueno) {
    resultado = "Bueno: Fuerza-resistencia de espalda y brazos por encima del promedio";
    color = "success";
  } else if (repeticiones >= normativos[rangoEdad].promedio) {
    resultado = "Promedio: Fuerza-resistencia de espalda y brazos adecuada";
    color = "warning";
  } else if (repeticiones >= normativos[rangoEdad].bajo) {
    resultado = "Por debajo del promedio: Fuerza-resistencia de espalda y brazos reducida";
    color = "warning";
  } else {
    resultado = "Bajo: Fuerza-resistencia de espalda y brazos deficiente";
    color = "danger";
  }
  
  document.getElementById('pullup_resultado').innerHTML = resultado;
  document.getElementById('pullup_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

// ============= TESTS PARA REINTEGRO DEPORTIVO =============

/**
 * Cambia las etiquetas del Hop Test según el tipo seleccionado
 */
function cambiarTipoHopTest() {
  const tipoTest = document.getElementById('hop_test_tipo').value;
  
  if (tipoTest === 'timed') {
    document.getElementById('hop_label_lado_sano').textContent = 'Lado Sano (segundos)';
    document.getElementById('hop_label_lado_afectado').textContent = 'Lado Afectado (segundos)';
  } else {
    document.getElementById('hop_label_lado_sano').textContent = 'Lado Sano (cm)';
    document.getElementById('hop_label_lado_afectado').textContent = 'Lado Afectado (cm)';
  }
  
  evaluarHopTest();
}

/**
 * Evalúa el Hop Test para reintegro deportivo
 * Basado en: Noyes et al. (1991), Logerstedt et al. (2012)
 */
function evaluarHopTest() {
  const tipoTest = document.getElementById('hop_test_tipo').value;
  const ladoSano = parseFloat(document.getElementById('hop_lado_sano').value);
  const ladoAfectado = parseFloat(document.getElementById('hop_lado_afectado').value);
  
  if (!ladoSano || !ladoAfectado) {
    document.getElementById('hop_resultado').innerHTML = "Complete todos los campos para obtener una evaluación.";
    document.getElementById('hop_resultado').className = "alert alert-secondary";
    return;
  }
  
  let lsi = 0;
  let resultado = "";
  let color = "";
  
  // Para el test cronometrado, un valor menor es mejor, por lo que la fórmula se invierte
  if (tipoTest === 'timed') {
    lsi = (ladoSano / ladoAfectado) * 100;
  } else {
    lsi = (ladoAfectado / ladoSano) * 100;
  }
  
  if (lsi >= 90) {
    resultado = `<strong>LSI: ${lsi.toFixed(1)}%</strong> - Simetría excelente. Criterio de retorno deportivo satisfecho.`;
    color = "success";
  } else if (lsi >= 85) {
    resultado = `<strong>LSI: ${lsi.toFixed(1)}%</strong> - Buena simetría. Próximo a criterio de retorno deportivo.`;
    color = "success";
  } else if (lsi >= 80) {
    resultado = `<strong>LSI: ${lsi.toFixed(1)}%</strong> - Simetría aceptable. Retorno deportivo con precaución y progresión controlada.`;
    color = "warning";
  } else if (lsi >= 70) {
    resultado = `<strong>LSI: ${lsi.toFixed(1)}%</strong> - Asimetría significativa. No recomendado para retorno deportivo completo.`;
    color = "warning";
  } else {
    resultado = `<strong>LSI: ${lsi.toFixed(1)}%</strong> - Asimetría severa. Contraindicado para retorno deportivo. Continuar rehabilitación.`;
    color = "danger";
  }
  
  // Añadir recomendaciones específicas según el tipo de test
  resultado += "<br><br><strong>Recomendaciones:</strong><br>";
  
  if (tipoTest === 'single') {
    resultado += "- Evalúa principalmente la potencia y confianza en salto único.<br>";
    resultado += "- Considere complementar con triple hop y crossover para evaluación completa.";
  } else if (tipoTest === 'triple') {
    resultado += "- Evalúa la potencia repetitiva y estabilidad durante saltos consecutivos.<br>";
    resultado += "- Buen predictor de rendimiento funcional global de extremidad inferior.";
  } else if (tipoTest === 'crossover') {
    resultado += "- Evalúa estabilidad en plano frontal y control rotacional.<br>";
    resultado += "- Especialmente relevante para deportes con cambios de dirección.";
  } else if (tipoTest === 'timed') {
    resultado += "- Evalúa agilidad y confianza en desplazamiento rápido.<br>";
    resultado += "- Importante para deportes que requieren sprints y aceleraciones.";
  }
  
  document.getElementById('hop_resultado').innerHTML = resultado;
  document.getElementById('hop_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
  
  // Actualizar sistema de decisión clínica
  actualizarDecisionClinica();
}

/**
 * Evalúa la batería de saltos (potencia)
 * Basado en valores normativos de deportistas
 */
function evaluarBateriaSaltos() {
  const squat_jump = parseFloat(document.getElementById('salto_sj').value) || 0;
  const cmj = parseFloat(document.getElementById('salto_cmj').value) || 0;
  const dj_altura = parseFloat(document.getElementById('salto_dj_altura').value) || 0;
  const dj_contacto = parseFloat(document.getElementById('salto_dj_contacto').value) || 0;
  const abalakov = parseFloat(document.getElementById('salto_abalakov').value) || 0;
  const genero = document.getElementById('salto_genero').value;
  const deporte = document.getElementById('salto_deporte').value;
  
  if ((squat_jump === 0 && cmj === 0 && dj_altura === 0 && abalakov === 0) || !genero) {
    document.getElementById('salto_resultado').innerHTML = "Complete al menos un test de salto y el género para obtener resultados.";
    document.getElementById('salto_resultado').className = "alert alert-secondary";
    return;
  }
  
  let resultado = "<strong>Resultados de la batería de saltos:</strong><br>";
  let tipoDeportista = "";
  let saltoPromedio = 0;
  let contadorSaltos = 0;
  
  // Evaluación de Squat Jump (SJ)
  if (squat_jump > 0) {
    let colorSJ = evaluarAlturaSalto(squat_jump, genero, 'SJ');
    resultado += `<span class="badge ${colorSJ.color}">Squat Jump: ${squat_jump} cm - ${colorSJ.nivel}</span><br>`;
    saltoPromedio += squat_jump;
    contadorSaltos++;
  }
  
  // Evaluación de Counter Movement Jump (CMJ)
  if (cmj > 0) {
    let colorCMJ = evaluarAlturaSalto(cmj, genero, 'CMJ');
    resultado += `<span class="badge ${colorCMJ.color}">CMJ: ${cmj} cm - ${colorCMJ.nivel}</span><br>`;
    saltoPromedio += cmj;
    contadorSaltos++;
  }
  
  // Índice de elasticidad
  if (squat_jump > 0 && cmj > 0) {
    const indiceElasticidad = ((cmj - squat_jump) / squat_jump) * 100;
    let colorElasticidad = "";
    let interpretacionElasticidad = "";
    
    if (indiceElasticidad > 15) {
      colorElasticidad = "bg-success";
      interpretacionElasticidad = "Excelente capacidad elástica";
      tipoDeportista += "alta elasticidad, ";
    } else if (indiceElasticidad > 10) {
      colorElasticidad = "bg-success";
      interpretacionElasticidad = "Buena capacidad elástica";
      tipoDeportista += "buena elasticidad, ";
    } else if (indiceElasticidad > 5) {
      colorElasticidad = "bg-warning";
      interpretacionElasticidad = "Capacidad elástica moderada";
      tipoDeportista += "elasticidad moderada, ";
    } else {
      colorElasticidad = "bg-danger";
      interpretacionElasticidad = "Baja capacidad elástica";
      tipoDeportista += "baja elasticidad, ";
    }
    
    resultado += `<span class="badge ${colorElasticidad}">Índice de Elasticidad: ${indiceElasticidad.toFixed(1)}% - ${interpretacionElasticidad}</span><br>`;
  }
  
  // Evaluación de Drop Jump (DJ) y RSI
  if (dj_altura > 0 && dj_contacto > 0) {
    let colorDJ = evaluarAlturaSalto(dj_altura, genero, 'DJ');
    resultado += `<span class="badge ${colorDJ.color}">Drop Jump: ${dj_altura} cm - ${colorDJ.nivel}</span><br>`;
    
    const rsi = dj_altura / (dj_contacto / 1000); // Convertir ms a segundos
    let colorRSI = "";
    let interpretacionRSI = "";
    
    if (rsi > 2.5) {
      colorRSI = "bg-success";
      interpretacionRSI = "Excelente reactividad";
      tipoDeportista += "alta reactividad, ";
    } else if (rsi > 2.0) {
      colorRSI = "bg-success";
      interpretacionRSI = "Buena reactividad";
      tipoDeportista += "buena reactividad, ";
    } else if (rsi > 1.5) {
      colorRSI = "bg-warning";
      interpretacionRSI = "Reactividad moderada";
      tipoDeportista += "reactividad moderada, ";
    } else if (rsi > 1.0) {
      colorRSI = "bg-warning";
      interpretacionRSI = "Reactividad baja";
      tipoDeportista += "baja reactividad, ";
    } else {
      colorRSI = "bg-danger";
      interpretacionRSI = "Reactividad deficiente";
      tipoDeportista += "reactividad deficiente, ";
    }
    
    resultado += `<span class="badge ${colorRSI}">RSI: ${rsi.toFixed(2)} - ${interpretacionRSI}</span><br>`;
    saltoPromedio += dj_altura;
    contadorSaltos++;
  }
  
  // Evaluación de Abalakov
  if (abalakov > 0) {
    let colorAbalakov = evaluarAlturaSalto(abalakov, genero, 'Abalakov');
    resultado += `<span class="badge ${colorAbalakov.color}">Abalakov: ${abalakov} cm - ${colorAbalakov.nivel}</span><br>`;
    saltoPromedio += abalakov;
    contadorSaltos++;
  }
  
  // Índice de utilización de brazos
  if (cmj > 0 && abalakov > 0) {
    const indiceUtilizacionBrazos = ((abalakov - cmj) / cmj) * 100;
    let colorUtilizacion = "";
    let interpretacionUtilizacion = "";
    
    if (indiceUtilizacionBrazos > 15) {
      colorUtilizacion = "bg-success";
      interpretacionUtilizacion = "Excelente utilización de brazos";
      tipoDeportista += "excelente coordinación brazos, ";
    } else if (indiceUtilizacionBrazos > 10) {
      colorUtilizacion = "bg-success";
      interpretacionUtilizacion = "Buena utilización de brazos";
      tipoDeportista += "buena coordinación brazos, ";
    } else if (indiceUtilizacionBrazos > 5) {
      colorUtilizacion = "bg-warning";
      interpretacionUtilizacion = "Moderada utilización de brazos";
      tipoDeportista += "moderada coordinación brazos, ";
    } else {
      colorUtilizacion = "bg-danger";
      interpretacionUtilizacion = "Deficiente utilización de brazos";
      tipoDeportista += "deficiente coordinación brazos, ";
    }
    
    resultado += `<span class="badge ${colorUtilizacion}">Índice Utilización de Brazos: ${indiceUtilizacionBrazos.toFixed(1)}% - ${interpretacionUtilizacion}</span><br>`;
  }
  
  // Perfil del deportista
  if (contadorSaltos > 0) {
    saltoPromedio = saltoPromedio / contadorSaltos;
    
    if (tipoDeportista) {
      tipoDeportista = tipoDeportista.slice(0, -2); // Eliminar última coma y espacio
      resultado += `<br><strong>Perfil del deportista:</strong> Atleta con ${tipoDeportista}.<br>`;
      
      // Sugerencias de entrenamiento
      resultado += "<br><strong>Sugerencias de entrenamiento:</strong><br>";
      
      if (tipoDeportista.includes("baja elasticidad")) {
        resultado += "- Énfasis en entrenamiento pliométrico progresivo.<br>";
      }
      
      if (tipoDeportista.includes("reactividad deficiente") || tipoDeportista.includes("baja reactividad")) {
        resultado += "- Ejercicios de saltos reactivos con tiempo de contacto reducido.<br>";
      }
      
      if (tipoDeportista.includes("deficiente coordinación")) {
        resultado += "- Ejercicios coordinativos con utilización de miembros superiores.<br>";
      }
      
      // Sugerencias específicas por nivel
      if (saltoPromedio < evaluarNivelPromedio(genero, deporte)) {
        resultado += "- Entrenamiento básico de fuerza para mejorar potencia general.<br>";
      } else {
        resultado += "- Entrenamiento específico de potencia para optimizar rendimiento.<br>";
      }
    }
  }
  
  document.getElementById('salto_resultado').innerHTML = resultado;
  document.getElementById('salto_resultado').className = "alert alert-info";
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Evalúa altura de salto según género y tipo
 */
function evaluarAlturaSalto(altura, genero, tipo) {
  // Valores de referencia para hombres
  const referenciasMasculino = {
    'SJ': {excelente: 45, bueno: 38, promedio: 31, bajo: 25},
    'CMJ': {excelente: 50, bueno: 43, promedio: 35, bajo: 29},
    'DJ': {excelente: 48, bueno: 41, promedio: 33, bajo: 27},
    'Abalakov': {excelente: 55, bueno: 48, promedio: 40, bajo: 33}
  };
  
  // Valores de referencia para mujeres
  const referenciasFemenino = {
    'SJ': {excelente: 35, bueno: 30, promedio: 25, bajo: 20},
    'CMJ': {excelente: 40, bueno: 35, promedio: 28, bajo: 23},
    'DJ': {excelente: 38, bueno: 32, promedio: 26, bajo: 21},
    'Abalakov': {excelente: 45, bueno: 38, promedio: 31, bajo: 25}
  };
  
  const referencias = genero === 'Masculino' ? referenciasMasculino : referenciasFemenino;
  
  let nivel = "";
  let color = "";
  
  if (altura >= referencias[tipo].excelente) {
    nivel = "Excelente";
    color = "bg-success";
  } else if (altura >= referencias[tipo].bueno) {
    nivel = "Bueno";
    color = "bg-success";
  } else if (altura >= referencias[tipo].promedio) {
    nivel = "Promedio";
    color = "bg-warning";
  } else if (altura >= referencias[tipo].bajo) {
    nivel = "Por debajo del promedio";
    color = "bg-warning";
  } else {
    nivel = "Bajo";
    color = "bg-danger";
  }
  
  return {nivel, color};
}

/**
 * Evalúa nivel promedio esperado para un deporte
 */
function evaluarNivelPromedio(genero, deporte) {
  // Valores promedio aproximados por deporte y género (CMJ en cm)
  if (genero === 'Masculino') {
    switch(deporte) {
      case 'fútbol': return 38;
      case 'baloncesto': return 45;
      case 'voleibol': return 50;
      case 'atletismo': return 45;
      default: return 35;
    }
  } else {
    switch(deporte) {
      case 'fútbol': return 30;
      case 'baloncesto': return 35;
      case 'voleibol': return 38;
      case 'atletismo': return 35;
      default: return 28;
    }
  }
}

// ============= TESTS PARA ADULTO MAYOR =============

/**
 * Evalúa el Timed Up and Go (TUG) test
 * Basado en: Shumway-Cook et al. (2000), Bohannon (2006)
 */
function evaluarTUG() {
  const tiempo = parseFloat(document.getElementById('tug_tiempo').value);
  const edad = parseInt(document.getElementById('tug_edad').value);
  
  if (!tiempo || !edad) {
    document.getElementById('tug_resultado').innerHTML = "Complete todos los campos para obtener una evaluación.";
    document.getElementById('tug_resultado').className = "alert alert-secondary";
    return;
  }
  
  let resultado = "";
  let color = "";
  
  // Valores de corte basados en evidencia actualizada
  // Rangos para adultos mayores basados en meta-análisis (Bohannon, 2006)
  let rangoNormal = 0;
  
  if (edad >= 60 && edad <= 69) {
    rangoNormal = 8.1;
  } else if (edad >= 70 && edad <= 79) {
    rangoNormal = 9.2;
  } else if (edad >= 80 && edad <= 99) {
    rangoNormal = 11.3;
  }
  
  // Evaluación del riesgo de caídas
  if (tiempo < 8) {
    resultado = `<strong>Tiempo: ${tiempo} segundos</strong> - Movilidad completamente independiente, sin riesgo de caídas.`;
    color = "success";
  } else if (tiempo < 10) {
    resultado = `<strong>Tiempo: ${tiempo} segundos</strong> - Movilidad independiente en la mayoría de actividades, riesgo bajo de caídas.`;
    color = "success";
  } else if (tiempo < 14) {
    resultado = `<strong>Tiempo: ${tiempo} segundos</strong> - Movilidad con cierta independencia, riesgo moderado de caídas.`;
    color = "warning";
  } else {
    resultado = `<strong>Tiempo: ${tiempo} segundos</strong> - Movilidad reducida, alto riesgo de caídas. Requiere evaluación e intervención.`;
    color = "danger";
  }
  
  // Comparación con valores esperados por edad
  if (rangoNormal > 0) {
    if (tiempo <= rangoNormal) {
      resultado += `<br>El tiempo está dentro del rango normal para personas de ${edad} años.`;
    } else {
      resultado += `<br>El tiempo está por encima del rango normal (${rangoNormal} segundos) para personas de ${edad} años.`;
    }
  }
  
  // Recomendaciones específicas
  resultado += "<br><br><strong>Recomendaciones:</strong><br>";
  
  if (tiempo >= 14) {
    resultado += "- Programa de prevención de caídas multifactorial.<br>";
    resultado += "- Evaluación del entorno domiciliario para eliminar riesgos.<br>";
    resultado += "- Considerar ayudas técnicas para la marcha si es necesario.<br>";
    resultado += "- Ejercicios de fortalecimiento y equilibrio supervisados.";
  } else if (tiempo >= 10) {
    resultado += "- Ejercicios de equilibrio y fortalecimiento de miembros inferiores.<br>";
    resultado += "- Entrenamiento de estrategias de equilibrio.<br>";
    resultado += "- Revisión de factores de riesgo en el hogar.";
  } else {
    resultado += "- Mantenimiento de actividad física regular.<br>";
    resultado += "- Ejercicios preventivos de equilibrio y fuerza.";
  }
  
  document.getElementById('tug_resultado').innerHTML = resultado;
  document.getElementById('tug_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
  
  // Actualizar estratificación de riesgo
  actualizarEstrategiaRiesgo();
}

/**
 * Evalúa el Senior Fitness Test completo
 * Basado en: Rikli & Jones (2013)
 */
function evaluarSeniorFitnessTest() {
  const chairStand = parseInt(document.getElementById('sft_chair_stand').value) || 0;
  const armCurl = parseInt(document.getElementById('sft_arm_curl').value) || 0;
  const step = parseInt(document.getElementById('sft_2min_step').value) || 0;
  const sitReach = parseFloat(document.getElementById('sft_chair_sit_reach').value) || 0;
  const backScratch = parseFloat(document.getElementById('sft_back_scratch').value) || 0;
  const upGo = parseFloat(document.getElementById('sft_8foot_up_go').value) || 0;
  const edad = parseInt(document.getElementById('sft_edad').value) || 0;
  const genero = document.getElementById('sft_genero').value;
  
  if (!edad || !genero || (chairStand === 0 && armCurl === 0 && step === 0 && sitReach === 0 && backScratch === 0 && upGo === 0)) {
    document.getElementById('sft_resultado').innerHTML = "Complete al menos un test y los datos personales para obtener una evaluación.";
    document.getElementById('sft_resultado').className = "alert alert-secondary";
    return;
  }
  
  let resultado = "<strong>Resultados del Senior Fitness Test:</strong><br>";
  let contadorTests = 0;
  let contadorBuenos = 0;
  
  // Chair Stand Test (30 segundos)
  if (chairStand > 0) {
    const evalChairStand = evaluarSFT('chairStand', chairStand, edad, genero);
    resultado += `<span class="badge ${evalChairStand.color}">Chair Stand: ${chairStand} reps - ${evalChairStand.nivel}</span><br>`;
    contadorTests++;
    if (evalChairStand.nivel === "Bueno" || evalChairStand.nivel === "Por encima del promedio") contadorBuenos++;
  }
  
  // Arm Curl Test (30 segundos)
  if (armCurl > 0) {
    const evalArmCurl = evaluarSFT('armCurl', armCurl, edad, genero);
    resultado += `<span class="badge ${evalArmCurl.color}">Arm Curl: ${armCurl} reps - ${evalArmCurl.nivel}</span><br>`;
    contadorTests++;
    if (evalArmCurl.nivel === "Bueno" || evalArmCurl.nivel === "Por encima del promedio") contadorBuenos++;
  }
  
  // 2-Minute Step Test
  if (step > 0) {
    const evalStep = evaluarSFT('step', step, edad, genero);
    resultado += `<span class="badge ${evalStep.color}">2-Min Step: ${step} pasos - ${evalStep.nivel}</span><br>`;
    contadorTests++;
    if (evalStep.nivel === "Bueno" || evalStep.nivel === "Por encima del promedio") contadorBuenos++;
  }
  
  // Chair Sit & Reach Test
  if (sitReach !== 0) {
    const evalSitReach = evaluarSFT('sitReach', sitReach, edad, genero);
    resultado += `<span class="badge ${evalSitReach.color}">Chair Sit & Reach: ${sitReach} cm - ${evalSitReach.nivel}</span><br>`;
    contadorTests++;
    if (evalSitReach.nivel === "Bueno" || evalSitReach.nivel === "Por encima del promedio") contadorBuenos++;
  }
  
  // Back Scratch Test
  if (backScratch !== 0) {
    const evalBackScratch = evaluarSFT('backScratch', backScratch, edad, genero);
    resultado += `<span class="badge ${evalBackScratch.color}">Back Scratch: ${backScratch} cm - ${evalBackScratch.nivel}</span><br>`;
    contadorTests++;
    if (evalBackScratch.nivel === "Bueno" || evalBackScratch.nivel === "Por encima del promedio") contadorBuenos++;
  }
  
  // 8-Foot Up & Go Test
  if (upGo > 0) {
    const evalUpGo = evaluarSFT('upGo', upGo, edad, genero);
    resultado += `<span class="badge ${evalUpGo.color}">8-Foot Up & Go: ${upGo} seg - ${evalUpGo.nivel}</span><br>`;
    contadorTests++;
    if (evalUpGo.nivel === "Bueno" || evalUpGo.nivel === "Por encima del promedio") contadorBuenos++;
  }
  
  // Evaluación global
  if (contadorTests >= 3) {
    const porcentajeBuenos = (contadorBuenos / contadorTests) * 100;
    
    resultado += "<br><strong>Evaluación global:</strong> ";
    
    if (porcentajeBuenos >= 80) {
      resultado += "Excelente condición física funcional para su edad. Mantiene un nivel de independencia óptimo.";
    } else if (porcentajeBuenos >= 60) {
      resultado += "Buena condición física funcional. Probabilidad alta de mantener independencia.";
    } else if (porcentajeBuenos >= 40) {
      resultado += "Condición física funcional moderada. Áreas específicas requieren mejora.";
    } else {
      resultado += "Condición física funcional por debajo del promedio. Riesgo de pérdida de independencia.";
    }
    
    // Recomendaciones específicas
    resultado += "<br><br><strong>Recomendaciones:</strong><br>";
    
    if (chairStand > 0 && evaluarSFT('chairStand', chairStand, edad, genero).nivel.includes("debajo")) {
      resultado += "- Fortalecimiento de miembros inferiores: sentadillas, estocadas asistidas.<br>";
    }
    
    if (armCurl > 0 && evaluarSFT('armCurl', armCurl, edad, genero).nivel.includes("debajo")) {
      resultado += "- Fortalecimiento de miembros superiores: curl de bíceps, ejercicios con bandas elásticas.<br>";
    }
    
    if (step > 0 && evaluarSFT('step', step, edad, genero).nivel.includes("debajo")) {
      resultado += "- Mejora de resistencia cardiovascular: caminata, bicicleta estática, natación.<br>";
    }
    
    if (sitReach !== 0 && evaluarSFT('sitReach', sitReach, edad, genero).nivel.includes("debajo")) {
      resultado += "- Mejora de flexibilidad de isquiotibiales: estiramientos específicos.<br>";
    }
    
    if (backScratch !== 0 && evaluarSFT('backScratch', backScratch, edad, genero).nivel.includes("debajo")) {
      resultado += "- Mejora de flexibilidad de hombros: estiramientos y movilidad articular.<br>";
    }
    
    if (upGo > 0 && evaluarSFT('upGo', upGo, edad, genero).nivel.includes("debajo")) {
      resultado += "- Mejora de agilidad y equilibrio: ejercicios de transferencia de peso, marcha con obstáculos.";
    }
  }
  
  document.getElementById('sft_resultado').innerHTML = resultado;
  document.getElementById('sft_resultado').className = "alert alert-info";
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
  
  // Actualizar estratificación de riesgo
  actualizarEstrategiaRiesgo();
}

/**
 * Evalúa cada componente del Senior Fitness Test
 */
function evaluarSFT(test, valor, edad, genero) {
  // Valores normativos según Rikli & Jones (2013)
  const normativas = {
    chairStand: {
      Masculino: {
        '60-64': {bueno: 16, promedio: 14, bajo: 12},
        '65-69': {bueno: 15, promedio: 12, bajo: 10},
        '70-74': {bueno: 14, promedio: 12, bajo: 10},
        '75-79': {bueno: 13, promedio: 11, bajo: 8},
        '80-84': {bueno: 12, promedio: 10, bajo: 8},
        '85-89': {bueno: 11, promedio: 8, bajo: 7},
        '90+': {bueno: 9, promedio: 7, bajo: 4}
      },
      Femenino: {
        '60-64': {bueno: 15, promedio: 12, bajo: 10},
        '65-69': {bueno: 14, promedio: 11, bajo: 9},
        '70-74': {bueno: 13, promedio: 10, bajo: 8},
        '75-79': {bueno: 12, promedio: 10, bajo: 8},
        '80-84': {bueno: 11, promedio: 9, bajo: 7},
        '85-89': {bueno: 10, promedio: 8, bajo: 6},
        '90+': {bueno: 8, promedio: 4, bajo: 3}
      }
    },
    armCurl: {
      Masculino: {
        '60-64': {bueno: 19, promedio: 16, bajo: 13},
        '65-69': {bueno: 18, promedio: 15, bajo: 12},
        '70-74': {bueno: 17, promedio: 14, bajo: 12},
        '75-79': {bueno: 16, promedio: 13, bajo: 11},
        '80-84': {bueno: 15, promedio: 13, bajo: 10},
        '85-89': {bueno: 14, promedio: 11, bajo: 9},
        '90+': {bueno: 13, promedio: 10, bajo: 8}
      },
      Femenino: {
        '60-64': {bueno: 17, promedio: 14, bajo: 11},
        '65-69': {bueno: 17, promedio: 13, bajo: 10},
        '70-74': {bueno: 16, promedio: 12, bajo: 10},
        '75-79': {bueno: 15, promedio: 11, bajo: 9},
        '80-84': {bueno: 14, promedio: 10, bajo: 8},
        '85-89': {bueno: 13, promedio: 9, bajo: 7},
        '90+': {bueno: 11, promedio: 8, bajo: 6}
      }
    },
    step: {
      Masculino: {
        '60-64': {bueno: 113, promedio: 103, bajo: 86},
        '65-69': {bueno: 110, promedio: 99, bajo: 84},
        '70-74': {bueno: 106, promedio: 94, bajo: 80},
        '75-79': {bueno: 101, promedio: 92, bajo: 72},
        '80-84': {bueno: 92, promedio: 82, bajo: 68},
        '85-89': {bueno: 81, promedio: 73, bajo: 59},
        '90+': {bueno: 75, promedio: 60, bajo: 50}
      },
      Femenino: {
        '60-64': {bueno: 107, promedio: 93, bajo: 79},
        '65-69': {bueno: 104, promedio: 90, bajo: 76},
        '70-74': {bueno: 100, promedio: 86, bajo: 72},
        '75-79': {bueno: 94, promedio: 79, bajo: 68},
        '80-84': {bueno: 88, promedio: 72, bajo: 60},
        '85-89': {bueno: 78, promedio: 68, bajo: 55},
        '90+': {bueno: 68, promedio: 55, bajo: 44}
      }
    },
    sitReach: {
      Masculino: {
        '60-64': {bueno: 5, promedio: 0, bajo: -5},
        '65-69': {bueno: 3, promedio: -1, bajo: -5},
        '70-74': {bueno: 3, promedio: -1, bajo: -6},
        '75-79': {bueno: 2, promedio: -2, bajo: -7},
        '80-84': {bueno: 1, promedio: -3, bajo: -8},
        '85-89': {bueno: 0, promedio: -5, bajo: -10},
        '90+': {bueno: -1, promedio: -6, bajo: -13}
      },
      Femenino: {
        '60-64': {bueno: 7, promedio: 2, bajo: -3},
        '65-69': {bueno: 7, promedio: 1, bajo: -3},
        '70-74': {bueno: 6, promedio: 0, bajo: -4},
        '75-79': {bueno: 5, promedio: -1, bajo: -5},
        '80-84': {bueno: 4, promedio: -2, bajo: -6},
        '85-89': {bueno: 3, promedio: -3, bajo: -8},
        '90+': {bueno: 2, promedio: -4, bajo: -10}
      }
    },
    backScratch: {
      Masculino: {
        '60-64': {bueno: 0, promedio: -6, bajo: -12},
        '65-69': {bueno: -1, promedio: -8, bajo: -15},
        '70-74': {bueno: -3, promedio: -10, bajo: -16},
        '75-79': {bueno: -4, promedio: -12, bajo: -18},
        '80-84': {bueno: -6, promedio: -15, bajo: -21},
        '85-89': {bueno: -8, promedio: -16, bajo: -24},
        '90+': {bueno: -11, promedio: -18, bajo: -26}
      },
      Femenino: {
        '60-64': {bueno: 2, promedio: -3, bajo: -8},
        '65-69': {bueno: 1, promedio: -4, bajo: -9},
        '70-74': {bueno: 0, promedio: -5, bajo: -11},
        '75-79': {bueno: -1, promedio: -6, bajo: -12},
        '80-84': {bueno: -2, promedio: -7, bajo: -14},
        '85-89': {bueno: -4, promedio: -9, bajo: -16},
        '90+': {bueno: -6, promedio: -10, bajo: -18}
      }
    },
    upGo: {
      Masculino: {
        '60-64': {bueno: 4.8, promedio: 5.6, bajo: 7.2},
        '65-69': {bueno: 5.1, promedio: 5.9, bajo: 7.6},
        '70-74': {bueno: 5.4, promedio: 6.2, bajo: 8.0},
        '75-79': {bueno: 5.9, promedio: 7.2, bajo: 9.4},
        '80-84': {bueno: 6.4, promedio: 7.6, bajo: 10.2},
        '85-89': {bueno: 7.2, promedio: 8.6, bajo: 12.0},
        '90+': {bueno: 8.5, promedio: 10.2, bajo: 14.0}
      },
      Femenino: {
        '60-64': {bueno: 5.2, promedio: 6.0, bajo: 7.8},
        '65-69': {bueno: 5.4, promedio: 6.4, bajo: 8.2},
        '70-74': {bueno: 5.7, promedio: 7.1, bajo: 9.2},
        '75-79': {bueno: 6.1, promedio: 7.4, bajo: 10.0},
        '80-84': {bueno: 6.8, promedio: 8.2, bajo: 11.5},
        '85-89': {bueno: 7.5, promedio: 9.0, bajo: 13.0},
        '90+': {bueno: 9.0, promedio: 11.2, bajo: 15.0}
      }
    }
  };
  
  // Determinar rango de edad
  let rangoEdad = '';
  if (edad >= 60 && edad <= 64) rangoEdad = '60-64';
  else if (edad >= 65 && edad <= 69) rangoEdad = '65-69';
  else if (edad >= 70 && edad <= 74) rangoEdad = '70-74';
  else if (edad >= 75 && edad <= 79) rangoEdad = '75-79';
  else if (edad >= 80 && edad <= 84) rangoEdad = '80-84';
  else if (edad >= 85 && edad <= 89) rangoEdad = '85-89';
  else rangoEdad = '90+';
  
  const normas = normativas[test][genero][rangoEdad];
  let nivel = "";
  let color = "";
  
  // En 8-Foot Up & Go, menor valor es mejor
  if (test === 'upGo') {
    if (valor < normas.bueno) {
      nivel = "Por encima del promedio";
      color = "bg-success";
    } else if (valor < normas.promedio) {
      nivel = "Bueno";
      color = "bg-success";
    } else if (valor < normas.bajo) {
      nivel = "Promedio";
      color = "bg-warning";
    } else {
      nivel = "Por debajo del promedio";
      color = "bg-danger";
    }
  } else {
    // Para el resto de pruebas, mayor valor es mejor
    if (test === 'sitReach' || test === 'backScratch') {
      // Para pruebas con posibles valores negativos
      if (valor >= normas.bueno) {
        nivel = "Por encima del promedio";
        color = "bg-success";
      } else if (valor >= normas.promedio) {
        nivel = "Bueno";
        color = "bg-success";
      } else if (valor >= normas.bajo) {
        nivel = "Promedio";
        color = "bg-warning";
      } else {
        nivel = "Por debajo del promedio";
        color = "bg-danger";
      }
    } else {
      // Para pruebas con valores siempre positivos
      if (valor > normas.bueno) {
        nivel = "Por encima del promedio";
        color = "bg-success";
      } else if (valor >= normas.promedio) {
        nivel = "Bueno";
        color = "bg-success";
      } else if (valor >= normas.bajo) {
        nivel = "Promedio";
        color = "bg-warning";
      } else {
        nivel = "Por debajo del promedio";
        color = "bg-danger";
      }
    }
  }
  
  return {nivel, color};
}

// ============= TESTS DE RIESGO DE LESIÓN =============

/**
 * Evalúa el LESS (Landing Error Scoring System)
 * Basado en: Padua et al. (2009, 2015)
 */
function evaluarLESS() {
  // Obtener valores de los 10 ítems
  const puntajeTotal = [
    parseInt(document.getElementById('less_item1').value) || 0,
    parseInt(document.getElementById('less_item2').value) || 0,
    parseInt(document.getElementById('less_item3').value) || 0,
    parseInt(document.getElementById('less_item4').value) || 0,
    parseInt(document.getElementById('less_item5').value) || 0,
    parseInt(document.getElementById('less_item6').value) || 0,
    parseInt(document.getElementById('less_item7').value) || 0,
    parseInt(document.getElementById('less_item8').value) || 0,
    parseInt(document.getElementById('less_item9').value) || 0,
    parseInt(document.getElementById('less_item10').value) || 0
  ].reduce((suma, actual) => suma + actual, 0);
  
  const genero = document.getElementById('less_genero').value;
  
  if (!genero) {
    document.getElementById('less_resultado').innerHTML = "Seleccione el género para obtener una evaluación completa.";
    document.getElementById('less_resultado').className = "alert alert-secondary";
    return;
  }
  
  let resultado = `<strong>Puntuación total: ${puntajeTotal} puntos</strong><br>`;
  let color = "";
  let interpretacion = "";
  
  // Interpretación según Padua (valores actualizados)
  if (puntajeTotal <= 4) {
    interpretacion = "Bajo riesgo de lesión de LCA";
    color = "success";
  } else if (puntajeTotal <= 6) {
    interpretacion = "Riesgo moderado de lesión de LCA";
    color = "warning";
  } else {
    interpretacion = "Alto riesgo de lesión de LCA";
    color = "danger";
  }
  
  resultado += `<strong>Interpretación:</strong> ${interpretacion}<br><br>`;
  
  // Análisis de componentes específicos
  resultado += "<strong>Análisis por componentes:</strong><br>";
  
  // Análisis del valgo de rodilla
  const valgoRodilla = parseInt(document.getElementById('less_item5').value) || 0;
  if (valgoRodilla >= 2) {
    resultado += "- <span class='text-danger'>Valgo dinámico de rodilla significativo.</span> Factor de riesgo crítico para lesión de LCA.<br>";
  } else if (valgoRodilla === 1) {
    resultado += "- <span class='text-warning'>Valgo dinámico de rodilla moderado.</span> Factor de riesgo para lesión de LCA.<br>";
  }
  
  // Análisis de la flexión inicial
  const flexionRodilla = parseInt(document.getElementById('less_item1').value) || 0;
  const flexionCadera = parseInt(document.getElementById('less_item2').value) || 0;
  const flexionTronco = parseInt(document.getElementById('less_item3').value) || 0;
  
  if (flexionRodilla + flexionCadera + flexionTronco >= 2) {
    resultado += "- <span class='text-danger'>Postura rígida durante el aterrizaje.</span> Aumenta las fuerzas de impacto y el riesgo de lesión.<br>";
  }
  
  // Análisis de asimetrías
  const asimetria = parseInt(document.getElementById('less_item10').value) || 0;
  if (asimetria === 1) {
    resultado += "- <span class='text-danger'>Asimetría en rodillas durante el aterrizaje.</span> Predispone a sobrecarga unilateral.<br>";
  }
  
  // Recomendaciones basadas en el riesgo
  resultado += "<br><strong>Recomendaciones específicas:</strong><br>";
  
  if (puntajeTotal > 6) {
    resultado += "- Programa de prevención neuromuscular enfocado en control del valgo dinámico.<br>";
    resultado += "- Entrenamiento de aterrizajes suaves con mayor flexión de rodilla y cadera.<br>";
    resultado += "- Trabajo de estabilidad del core y control lumbopélvico.<br>";
    resultado += "- Reevaluación después de 6-8 semanas de intervención.";
  } else if (puntajeTotal > 4) {
    resultado += "- Entrenamiento de la técnica de aterrizaje con feedback visual.<br>";
    resultado += "- Ejercicios de control neuromuscular de rodilla.<br>";
    resultado += "- Fortalecimiento de cadena posterior (glúteos, isquiotibiales).<br>";
    resultado += "- Reevaluación después de 4-6 semanas.";
  } else {
    resultado += "- Mantener un buen control neuromuscular con ejercicios preventivos.<br>";
    resultado += "- Incluir entrenamiento pliométrico progresivo en la preparación física.";
  }
  
  // Factor de riesgo adicional por género
  if (genero === 'Femenino' && puntajeTotal > 4) {
    resultado += "<br><br><strong>Nota:</strong> El género femenino presenta un riesgo inherentemente mayor de lesión de LCA por factores anatómicos y hormonales. Se recomienda atención especial a los programas preventivos.";
  }
  
  document.getElementById('less_resultado').innerHTML = resultado;
  document.getElementById('less_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
  
  // Actualizar estratificación de riesgo
  actualizarEstrategiaRiesgo();
  
  // Actualizar sistema de decisión clínica
  actualizarDecisionClinica();
}

/**
 * Actualiza el panel de estratificación de riesgo global
 */
function actualizarEstrategiaRiesgo() {
  // Obtener resultados de los principales tests que evalúan riesgo
  const testsRealizados = [];
  const factoresRiesgo = [];
  
  // Verificar LESS
  const lessItem5 = document.getElementById('less_item5');
  if (lessItem5 && lessItem5.value) {
    const valgoRodilla = parseInt(lessItem5.value);
    testsRealizados.push("LESS");
    if (valgoRodilla >= 2) {
      factoresRiesgo.push({factor: "Valgo dinámico severo de rodilla", nivel: "Alto", color: "danger"});
    } else if (valgoRodilla === 1) {
      factoresRiesgo.push({factor: "Valgo dinámico moderado de rodilla", nivel: "Moderado", color: "warning"});
    }
  }
  
  // Verificar Hop Tests
  const hopResultado = document.getElementById('hop_resultado');
  if (hopResultado && hopResultado.textContent.includes("LSI:")) {
    testsRealizados.push("Hop Test");
    const lsiMatch = hopResultado.textContent.match(/LSI: (\d+\.\d+)%/);
    if (lsiMatch) {
      const lsi = parseFloat(lsiMatch[1]);
      if (lsi < 80) {
        factoresRiesgo.push({factor: "Asimetría significativa entre miembros inferiores", nivel: "Alto", color: "danger"});
      } else if (lsi < 90) {
        factoresRiesgo.push({factor: "Asimetría moderada entre miembros inferiores", nivel: "Moderado", color: "warning"});
      }
    }
  }
  
  // Verificar McGill Tests
  const mcgillResultado = document.getElementById('mcgill_resultado');
  if (mcgillResultado && !mcgillResultado.textContent.includes("Complete")) {
    testsRealizados.push("McGill Core Tests");
    if (mcgillResultado.textContent.includes("Ratio Flexores/Extensores") && mcgillResultado.textContent.includes("bg-danger")) {
      factoresRiesgo.push({factor: "Desequilibrio crítico en la musculatura del core", nivel: "Alto", color: "danger"});
    } else if (mcgillResultado.textContent.includes("Ratio Flexores/Extensores") && mcgillResultado.textContent.includes("bg-warning")) {
      factoresRiesgo.push({factor: "Desequilibrio moderado en la musculatura del core", nivel: "Moderado", color: "warning"});
    }
    
    if (mcgillResultado.textContent.includes("Ratio Simetría Lateral") && mcgillResultado.textContent.includes("bg-danger")) {
      factoresRiesgo.push({factor: "Asimetría severa en la musculatura lateral del core", nivel: "Alto", color: "danger"});
    } else if (mcgillResultado.textContent.includes("Ratio Simetría Lateral") && mcgillResultado.textContent.includes("bg-warning")) {
      factoresRiesgo.push({factor: "Asimetría moderada en la musculatura lateral del core", nivel: "Moderado", color: "warning"});
    }
  }
  
  // Verificar TUG (riesgo de caídas para adultos mayores)
  const tugTiempo = document.getElementById('tug_tiempo');
  if (tugTiempo && tugTiempo.value) {
    testsRealizados.push("TUG");
    const tiempo = parseFloat(tugTiempo.value);
    if (tiempo >= 14) {
      factoresRiesgo.push({factor: "Alto riesgo de caídas", nivel: "Alto", color: "danger"});
    } else if (tiempo >= 10) {
      factoresRiesgo.push({factor: "Riesgo moderado de caídas", nivel: "Moderado", color: "warning"});
    }
  }
  
  // Verificar batería de saltos
  const saltoResultado = document.getElementById('salto_resultado');
  if (saltoResultado && !saltoResultado.textContent.includes("Complete")) {
    testsRealizados.push("Batería de Saltos");
    if (saltoResultado.textContent.includes("baja elasticidad") || saltoResultado.textContent.includes("reactividad deficiente")) {
      factoresRiesgo.push({factor: "Perfil neuromuscular de alto riesgo", nivel: "Moderado", color: "warning"});
    }
  }
  
  // Generar el informe de estratificación de riesgo
  let estratificacion = "";
  
  if (testsRealizados.length < 3) {
    estratificacion = "Complete al menos 3 test para obtener una estratificación de riesgo global.";
    document.getElementById('estratificacion_riesgo').innerHTML = estratificacion;
    document.getElementById('estratificacion_riesgo').className = "alert alert-secondary";
    return;
  }
  
  estratificacion = `<strong>Análisis de factores de riesgo basado en ${testsRealizados.length} tests:</strong><br><br>`;
  
  if (factoresRiesgo.length === 0) {
    estratificacion += "<span class='badge bg-success'>Perfil de bajo riesgo</span> - No se han identificado factores de riesgo significativos.<br><br>";
    estratificacion += "Recomendación: Continuar con entrenamiento preventivo general y mantener buena técnica de movimiento.";
  } else {
    // Ordenar factores de riesgo por nivel (Alto primero)
    factoresRiesgo.sort((a, b) => {
      if (a.nivel === "Alto" && b.nivel !== "Alto") return -1;
      if (a.nivel !== "Alto" && b.nivel === "Alto") return 1;
      return 0;
    });
    
    const factoresAlto = factoresRiesgo.filter(f => f.nivel === "Alto").length;
    const factoresModerado = factoresRiesgo.filter(f => f.nivel === "Moderado").length;
    
    if (factoresAlto >= 2) {
      estratificacion += "<span class='badge bg-danger'>Perfil de alto riesgo</span> - Se han identificado múltiples factores de riesgo significativos.<br><br>";
    } else if (factoresAlto === 1 || factoresModerado >= 2) {
      estratificacion += "<span class='badge bg-warning'>Perfil de riesgo moderado</span> - Se han identificado factores de riesgo que requieren atención.<br><br>";
    } else {
      estratificacion += "<span class='badge bg-warning'>Perfil de riesgo bajo-moderado</span> - Se han identificado factores de riesgo menores.<br><br>";
    }
    
    estratificacion += "<strong>Factores de riesgo identificados:</strong><br>";
    factoresRiesgo.forEach(factor => {
      estratificacion += `- <span class='text-${factor.color}'>${factor.factor}</span> (Nivel: ${factor.nivel})<br>`;
    });
    
    estratificacion += "<br><strong>Perfil de riesgo multifactorial:</strong><br>";
    if (factoresAlto >= 2) {
      estratificacion += "Requiere intervención inmediata y específica en múltiples áreas antes de retorno a actividad de alta demanda.";
    } else if (factoresAlto === 1 || factoresModerado >= 2) {
      estratificacion += "Requiere intervención específica centrada en los factores de riesgo identificados antes de progresión a actividades de alta demanda.";
    } else {
      estratificacion += "Puede continuar con actividad controlada mientras se abordan los factores de riesgo identificados.";
    }
  }
  
  document.getElementById('estratificacion_riesgo').innerHTML = estratificacion;
  document.getElementById('estratificacion_riesgo').className = "alert alert-info";
}

/**
 * Actualiza el sistema de decisión clínica
 */
function actualizarDecisionClinica() {
  // Obtener información de tests relevantes para decisiones clínicas
  const testsRealizados = [];
  const criterios = [];
  let nivelLesion = ""; // ACL, tobillo, hombro, etc.
  let faseRehab = ""; // Aguda, subaguda, funcional, retorno
  let perfilRiesgo = ""; // Alto, moderado, bajo
  
  // Verificar LESS para decidir si es lesión de rodilla
  const lessResultado = document.getElementById('less_resultado');
  if (lessResultado && !lessResultado.textContent.includes("Seleccione")) {
    testsRealizados.push("LESS");
    if (lessResultado.textContent.includes("Alto riesgo")) {
      nivelLesion = "rodilla";
      perfilRiesgo = "alto";
    } else if (lessResultado.textContent.includes("Riesgo moderado")) {
      nivelLesion = "rodilla";
      perfilRiesgo = "moderado";
    } else {
      nivelLesion = "rodilla";
      perfilRiesgo = "bajo";
    }
  }
  
  // Verificar Hop Tests para fase de rehabilitación y deportiva
  const hopResultado = document.getElementById('hop_resultado');
  if (hopResultado && hopResultado.textContent.includes("LSI:")) {
    testsRealizados.push("Hop Test");
    const lsiMatch = hopResultado.textContent.match(/LSI: (\d+\.\d+)%/);
    if (lsiMatch) {
      const lsi = parseFloat(lsiMatch[1]);
      criterios.push({criterio: "LSI", valor: lsi, umbral: 90, unidad: "%"});
      
      if (lsi >= 90) {
        faseRehab = "retorno";
      } else if (lsi >= 80) {
        faseRehab = "funcional";
      } else {
        faseRehab = "subaguda";
      }
    }
  }
  
  // Verificar batería de saltos para criterios de rendimiento
  const saltoResultado = document.getElementById('salto_resultado');
  const saltoCMJ = document.getElementById('salto_cmj');
  if (saltoResultado && !saltoResultado.textContent.includes("Complete") && saltoCMJ && saltoCMJ.value) {
    testsRealizados.push("Batería de Saltos");
    const cmj = parseFloat(saltoCMJ.value);
    criterios.push({criterio: "CMJ", valor: cmj, umbral: 35, unidad: "cm"});
  }
  
  // Generar recomendaciones basadas en los criterios
  let decision = "";
  
  if (testsRealizados.length === 0) {
    decision = "Complete los test relevantes para obtener recomendaciones específicas.";
    document.getElementById('decision_clinica').innerHTML = decision;
    document.getElementById('decision_clinica').className = "alert alert-secondary";
    return;
  }
  
  decision = "<strong>Sistema de Decisión Clínica:</strong><br><br>";
  
  // Si tenemos suficiente información para evaluar fase de retorno
  if (testsRealizados.includes("Hop Test") || testsRealizados.includes("Batería de Saltos")) {
    decision += "<strong>Criterios de retorno deportivo:</strong><br>";
    
    // Tabla para criterios
    decision += "<table class='table table-sm table-bordered mt-2 mb-3'>";
    decision += "<thead><tr><th>Criterio</th><th>Valor</th><th>Objetivo</th><th>Estado</th></tr></thead>";
    decision += "<tbody>";
    
    criterios.forEach(c => {
      const estado = c.valor >= c.umbral ? 
        "<span class='badge bg-success'>Alcanzado</span>" : 
        (c.valor >= c.umbral * 0.9 ? 
          "<span class='badge bg-warning'>Cercano</span>" : 
          "<span class='badge bg-danger'>No alcanzado</span>");
      
      decision += `<tr>
        <td>${c.criterio}</td>
        <td>${c.valor.toFixed(1)} ${c.unidad}</td>
        <td>≥ ${c.umbral} ${c.unidad}</td>
        <td>${estado}</td>
      </tr>`;
    });
    
    decision += "</tbody></table>";
    
    // Recomendaciones según fase
    decision += "<strong>Plan de progresión:</strong><br>";
    
    if (faseRehab === "retorno" && perfilRiesgo !== "alto") {
      decision += "✅ <strong>Criterios para retorno deportivo alcanzados.</strong><br>";
      decision += "Recomendaciones:<br>";
      decision += "1. Retorno gradual a entrenamiento específico del deporte<br>";
      decision += "2. Integración progresiva a situaciones competitivas<br>";
      decision += "3. Monitoreo continuo de síntomas y rendimiento<br>";
      decision += "4. Mantenimiento de programa preventivo";
    } else if (faseRehab === "retorno" && perfilRiesgo === "alto") {
      decision += "⚠️ <strong>Criterios cuantitativos alcanzados, pero perfil de riesgo elevado.</strong><br>";
      decision += "Recomendaciones:<br>";
      decision += "1. Corrección de patrones de movimiento de alto riesgo<br>";
      decision += "2. Retorno condicionado a mejora de calidad de movimiento<br>";
      decision += "3. Entrenamiento neuromuscular intensificado<br>";
      decision += "4. Reevaluación en 2-3 semanas";
    } else if (faseRehab === "funcional") {
      decision += "🔄 <strong>Fase funcional - Próximo a criterios de retorno.</strong><br>";
      decision += "Recomendaciones:<br>";
      decision += "1. Entrenamiento específico para optimizar LSI<br>";
      decision += "2. Ejercicios de potencia y pliometría controlada<br>";
      decision += "3. Entrenamiento neuromuscular avanzado<br>";
      decision += "4. Inicio de habilidades deportivas específicas sin oposición<br>";
      decision += "5. Reevaluación en 2-4 semanas";
    } else {
      decision += "⚠️ <strong>Fase de rehabilitación temprana - No alcanza criterios de retorno.</strong><br>";
      decision += "Recomendaciones:<br>";
      decision += "1. Fortalecimiento progresivo de cadena cinética<br>";
      decision += "2. Desarrollo de control neuromuscular básico<br>";
      decision += "3. Ejercicios de propiocepción y estabilidad<br>";
      decision += "4. No recomendado para actividades deportivas<br>";
      decision += "5. Reevaluación en 4-6 semanas";
    }
  } else {
    decision += "Complete pruebas funcionales (Hop Tests o Batería de Saltos) para obtener recomendaciones de progresión completas.";
  }
  
  document.getElementById('decision_clinica').innerHTML = decision;
  document.getElementById('decision_clinica').className = "alert alert-info";
}

// ============= TAREAS ESPECÍFICAS DEL PACIENTE =============

/**
 * Agrega una tarea específica personalizada
 */
function agregarTareaEspecifica() {
  const container = document.getElementById('tareas_especificas_container');
  const numTarea = document.querySelectorAll('.tarea-especifica').length + 1;
  
  const nuevaTarea = document.createElement('div');
  nuevaTarea.className = 'tarea-especifica mb-4';
  nuevaTarea.id = `tarea_${numTarea}`;
  
  nuevaTarea.innerHTML = `
    <div class="card">
      <div class="card-body">
        <div class="form-row mb-3">
          <div class="form-col form-col-md-12">
            <div class="form-group">
              <label for="tarea_nombre_${numTarea}" class="form-label">Nombre de la Tarea</label>
              <input type="text" id="tarea_nombre_${numTarea}" name="tarea_nombre_${numTarea}" class="form-control" placeholder="Ej: Sentadilla con peso, Alcance funcional, etc.">
            </div>
          </div>
        </div>
        
        <div class="form-row mb-3">
          <div class="form-col form-col-md-6">
            <div class="form-group">
              <label for="tarea_descripcion_${numTarea}" class="form-label">Descripción</label>
              <textarea id="tarea_descripcion_${numTarea}" name="tarea_descripcion_${numTarea}" class="form-control" rows="2" placeholder="Describe brevemente la tarea y su relevancia para este paciente"></textarea>
            </div>
          </div>
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="tarea_contexto_${numTarea}" class="form-label">Contexto</label>
              <select id="tarea_contexto_${numTarea}" name="tarea_contexto_${numTarea}" class="form-select">
                <option value="AVD">Actividades Vida Diaria</option>
                <option value="Laboral">Laboral</option>
                <option value="Deportivo">Deportivo</option>
                <option value="Recreativo">Recreativo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="tarea_rpe_${numTarea}" class="form-label">RPE (0-10)</label>
              <input type="number" id="tarea_rpe_${numTarea}" name="tarea_rpe_${numTarea}" class="form-control" min="0" max="10" step="1">
            </div>
          </div>
        </div>
        
        <div class="form-row mb-3">
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="tarea_resultado_${numTarea}" class="form-label">Resultado</label>
              <input type="text" id="tarea_resultado_${numTarea}" name="tarea_resultado_${numTarea}" class="form-control" placeholder="Ej: 10 kg, 5 repeticiones, etc.">
            </div>
          </div>
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="tarea_capacidad_${numTarea}" class="form-label">Capacidad Funcional</label>
              <select id="tarea_capacidad_${numTarea}" name="tarea_capacidad_${numTarea}" class="form-select" onchange="actualizarTareaEspecifica(${numTarea})">
                <option value="">Seleccionar</option>
                <option value="Normal">Normal (100%)</option>
                <option value="Levemente limitada">Levemente limitada (75%)</option>
                <option value="Moderadamente limitada">Moderadamente limitada (50%)</option>
                <option value="Severamente limitada">Severamente limitada (25%)</option>
                <option value="Incapaz">Incapaz (0%)</option>
              </select>
            </div>
          </div>
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="tarea_dolor_${numTarea}" class="form-label">Dolor (0-10)</label>
              <input type="number" id="tarea_dolor_${numTarea}" name="tarea_dolor_${numTarea}" class="form-control" min="0" max="10" step="1" onchange="actualizarTareaEspecifica(${numTarea})">
            </div>
          </div>
          <div class="form-col form-col-md-3 d-flex align-items-end">
            <button type="button" class="btn btn-outline-danger btn-sm mt-3" onclick="eliminarTareaEspecifica(${numTarea})">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-col form-col-md-12">
            <div id="tarea_resumen_${numTarea}" class="alert alert-secondary">
              Complete los campos para obtener una evaluación.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(nuevaTarea);
  
  // Eliminar mensaje inicial si existe
  const mensajeInicial = container.querySelector('p.text-muted');
  if (mensajeInicial) {
    mensajeInicial.remove();
  }
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Actualiza el resultado de una tarea específica
 */
function actualizarTareaEspecifica(numTarea) {
  const capacidad = document.getElementById(`tarea_capacidad_${numTarea}`).value;
  const dolor = document.getElementById(`tarea_dolor_${numTarea}`).value;
  const nombre = document.getElementById(`tarea_nombre_${numTarea}`).value;
  
  if (!capacidad && !dolor) {
    document.getElementById(`tarea_resumen_${numTarea}`).innerHTML = "Complete los campos para obtener una evaluación.";
    document.getElementById(`tarea_resumen_${numTarea}`).className = "alert alert-secondary";
    return;
  }
  
  let resumen = "";
  let color = "";
  
  // Evaluación según capacidad funcional
  if (capacidad) {
    switch (capacidad) {
      case "Normal":
        resumen = "Capacidad funcional normal. ";
        color = "success";
        break;
      case "Levemente limitada":
        resumen = "Capacidad funcional levemente limitada. ";
        color = "success";
        break;
      case "Moderadamente limitada":
        resumen = "Capacidad funcional moderadamente limitada. ";
        color = "warning";
        break;
      case "Severamente limitada":
        resumen = "Capacidad funcional severamente limitada. ";
        color = "danger";
        break;
      case "Incapaz":
        resumen = "Incapaz de realizar la tarea. ";
        color = "danger";
        break;
    }
  }
  
  // Añadir información sobre dolor
  if (dolor) {
    const dolorNum = parseInt(dolor);
    if (dolorNum >= 7) {
      resumen += `Dolor severo (${dolor}/10) durante la ejecución.`;
      color = "danger";
    } else if (dolorNum >= 4) {
      resumen += `Dolor moderado (${dolor}/10) durante la ejecución.`;
      color = color === "success" ? "warning" : color;
    } else if (dolorNum >= 1) {
      resumen += `Dolor leve (${dolor}/10) durante la ejecución.`;
    } else {
      resumen += "Sin dolor durante la ejecución.";
    }
  }
  
  document.getElementById(`tarea_resumen_${numTarea}`).innerHTML = resumen;
  document.getElementById(`tarea_resumen_${numTarea}`).className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Elimina una tarea específica
 */
function eliminarTareaEspecifica(numTarea) {
  const tarea = document.getElementById(`tarea_${numTarea}`);
  if (tarea) {
    tarea.remove();
  }
  
  // Verificar si no quedan tareas y mostrar mensaje inicial
  const container = document.getElementById('tareas_especificas_container');
  const tareas = container.querySelectorAll('.tarea-especifica');
  
  if (tareas.length === 0) {
    const mensajeInicial = document.createElement('div');
    mensajeInicial.className = 'form-row mb-3';
    mensajeInicial.innerHTML = `
      <div class="form-col form-col-md-12">
        <p class="text-muted">Utilice el botón "Agregar Tarea Específica" para añadir tareas funcionales relevantes para este paciente.</p>
      </div>
    `;
    container.appendChild(mensajeInicial);
  }
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Agrega un test funcional personalizado
 */
function agregarTestFuncional() {
  const container = document.getElementById('otros_tests_funcionales_container');
  const numTest = document.querySelectorAll('.otro-test-funcional').length + 1;
  
  const nuevoTest = document.createElement('div');
  nuevoTest.className = 'otro-test-funcional mb-4';
  nuevoTest.id = `otro_test_${numTest}`;
  
  nuevoTest.innerHTML = `
    <hr class="my-3">
    <div class="form-row mb-4">
      <div class="form-col form-col-md-12">
        <div class="form-group">
          <label for="otro_test_nombre_${numTest}" class="form-label">Nombre del Test</label>
          <div class="input-group">
            <input type="text" id="otro_test_nombre_${numTest}" name="otro_test_nombre_${numTest}" class="form-control" placeholder="Ej: Single-leg Bridge Test, Y-Balance Test, etc.">
            <button type="button" class="btn btn-outline-danger" onclick="eliminarTestFuncional(${numTest})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="form-row mb-4">
      <div class="form-col form-col-md-3">
        <div class="form-group">
          <label for="otro_test_resultado_${numTest}" class="form-label">Resultado</label>
          <input type="text" id="otro_test_resultado_${numTest}" name="otro_test_resultado_${numTest}" class="form-control" placeholder="Ej: 10 seg, 15 cm, etc.">
        </div>
      </div>
      <div class="form-col form-col-md-3">
        <div class="form-group">
          <label for="otro_test_referencia_${numTest}" class="form-label">Valor de Referencia</label>
          <input type="text" id="otro_test_referencia_${numTest}" name="otro_test_referencia_${numTest}" class="form-control" placeholder="Ej: >15 seg, 80-90%, etc.">
        </div>
      </div>
      <div class="form-col form-col-md-2">
        <div class="form-group">
          <label for="otro_test_rpe_${numTest}" class="form-label">RPE (0-10)</label>
          <input type="number" id="otro_test_rpe_${numTest}" name="otro_test_rpe_${numTest}" class="form-control" min="0" max="10" step="1">
        </div>
      </div>
      <div class="form-col form-col-md-4">
        <div class="form-group">
          <label for="otro_test_evaluacion_${numTest}" class="form-label">Evaluación</label>
          <select id="otro_test_evaluacion_${numTest}" name="otro_test_evaluacion_${numTest}" class="form-select" onchange="actualizarOtroTest(${numTest})">
            <option value="">Seleccionar</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Promedio">Promedio</option>
            <option value="Por debajo del promedio">Por debajo del promedio</option>
            <option value="Deficiente">Deficiente</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="form-row mb-4">
      <div class="form-col form-col-md-12">
        <div class="form-group">
          <label for="otro_test_observacion_${numTest}" class="form-label">Observaciones</label>
          <textarea id="otro_test_observacion_${numTest}" name="otro_test_observacion_${numTest}" class="form-control" rows="2" placeholder="Observaciones clínicas, calidad del movimiento, compensaciones, etc."></textarea>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(nuevoTest);
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Elimina un test funcional personalizado
 */
function eliminarTestFuncional(numTest) {
  const test = document.getElementById(`otro_test_${numTest}`);
  if (test) {
    test.remove();
  }
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Actualiza la evaluación de un test funcional personalizado
 */
function actualizarOtroTest(numTest) {
  const evaluacion = document.getElementById(`otro_test_evaluacion_${numTest}`).value;
  if (!evaluacion) return;
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

/**
 * Actualiza la interpretación global y recomendaciones basadas en todos los tests realizados
 */
function actualizarInterpretacionGlobal() {
  const testsRealizados = [];
  const hallazgos = [];
  
  // Verificar Sit-to-Stand
  const sitToStandResultado = document.getElementById('sit_to_stand_resultado');
  if (sitToStandResultado && !sitToStandResultado.textContent.includes("Complete")) {
    testsRealizados.push("Sit-to-Stand");
    
    if (sitToStandResultado.className.includes("alert-danger")) {
      hallazgos.push("Fuerza funcional de miembros inferiores significativamente disminuida");
    } else if (sitToStandResultado.className.includes("alert-warning")) {
      hallazgos.push("Fuerza funcional de miembros inferiores por debajo del promedio");
    }
  }
  
  // Verificar Push-up Test
  const pushUpResultado = document.getElementById('push_up_resultado');
  if (pushUpResultado && !pushUpResultado.textContent.includes("Complete")) {
    testsRealizados.push("Push-up Test");
    
    if (pushUpResultado.className.includes("alert-danger")) {
      hallazgos.push("Fuerza-resistencia de miembros superiores significativamente disminuida");
    } else if (pushUpResultado.className.includes("alert-warning")) {
      hallazgos.push("Fuerza-resistencia de miembros superiores por debajo del promedio");
    }
  }
  
  // Verificar McGill Tests
  const mcgillResultado = document.getElementById('mcgill_resultado');
  if (mcgillResultado && !mcgillResultado.textContent.includes("Complete")) {
    testsRealizados.push("McGill Core Tests");
    
    if (mcgillResultado.textContent.includes("bg-danger")) {
      if (mcgillResultado.textContent.includes("Ratio Flexores/Extensores") && mcgillResultado.textContent.includes("bg-danger")) {
        hallazgos.push("Desequilibrio crítico entre flexores y extensores del tronco");
      }
      if (mcgillResultado.textContent.includes("Ratio Simetría Lateral") && mcgillResultado.textContent.includes("bg-danger")) {
        hallazgos.push("Asimetría severa en la musculatura lateral del core");
      }
      if (mcgillResultado.textContent.includes("Plancha Frontal") && mcgillResultado.textContent.includes("bg-danger")) {
        hallazgos.push("Resistencia deficiente de la musculatura flexora del tronco");
      }
      if (mcgillResultado.textContent.includes("Extensión Lumbar") && mcgillResultado.textContent.includes("bg-danger")) {
        hallazgos.push("Resistencia deficiente de la musculatura extensora del tronco");
      }
    }
  }
  
  // Verificar Wall Sit Test
  const wallSitResultado = document.getElementById('wall_sit_resultado');
  if (wallSitResultado && !wallSitResultado.textContent.includes("Complete")) {
    testsRealizados.push("Wall Sit Test");
    
    if (wallSitResultado.className.includes("alert-danger")) {
      hallazgos.push("Resistencia de cuádriceps deficiente");
    } else if (wallSitResultado.className.includes("alert-warning")) {
      hallazgos.push("Resistencia de cuádriceps por debajo del promedio");
    }
  }
  
  // Verificar Pull-up Test
  const pullupResultado = document.getElementById('pullup_resultado');
  if (pullupResultado && !pullupResultado.textContent.includes("Complete")) {
    testsRealizados.push("Pull-up/Chin-up Test");
    
    if (pullupResultado.className.includes("alert-danger")) {
      hallazgos.push("Fuerza-resistencia de espalda y brazos deficiente");
    } else if (pullupResultado.className.includes("alert-warning")) {
      hallazgos.push("Fuerza-resistencia de espalda y brazos por debajo del promedio");
    }
  }
  
  // Verificar Hop Tests
  const hopResultado = document.getElementById('hop_resultado');
  if (hopResultado && !hopResultado.textContent.includes("Complete")) {
    testsRealizados.push("Hop Test");
    
    if (hopResultado.className.includes("alert-danger") || hopResultado.className.includes("alert-warning")) {
      const tipoTest = document.getElementById('hop_test_tipo').value;
      let tipoTexto = "";
      
      switch (tipoTest) {
        case 'single': tipoTexto = "salto único"; break;
        case 'triple': tipoTexto = "triple salto"; break;
        case 'crossover': tipoTexto = "salto con cambio de dirección"; break;
        case 'timed': tipoTexto = "agilidad"; break;
      }
      
      hallazgos.push(`Asimetría en la capacidad de ${tipoTexto} entre miembros inferiores`);
    }
  }
  
  // Verificar Batería de Saltos
  const saltoResultado = document.getElementById('salto_resultado');
  if (saltoResultado && !saltoResultado.textContent.includes("Complete")) {
    testsRealizados.push("Batería de Saltos");
    
    if (saltoResultado.textContent.includes("baja elasticidad")) {
      hallazgos.push("Capacidad elástica reducida en miembros inferiores");
    }
    if (saltoResultado.textContent.includes("reactividad deficiente") || saltoResultado.textContent.includes("baja reactividad")) {
      hallazgos.push("Capacidad reactiva reducida en miembros inferiores");
    }
    if (saltoResultado.textContent.includes("deficiente coordinación")) {
      hallazgos.push("Coordinación deficiente en la utilización de brazos durante el salto");
    }
  }
  
  // Verificar TUG
  const tugResultado = document.getElementById('tug_resultado');
  if (tugResultado && !tugResultado.textContent.includes("Complete")) {
    testsRealizados.push("TUG");
    
    if (tugResultado.className.includes("alert-danger")) {
      hallazgos.push("Alto riesgo de caídas y movilidad reducida");
    } else if (tugResultado.className.includes("alert-warning")) {
      hallazgos.push("Riesgo moderado de caídas y movilidad limitada");
    }
  }
  
  // Verificar Senior Fitness Test
  const sftResultado = document.getElementById('sft_resultado');
  if (sftResultado && !sftResultado.textContent.includes("Complete")) {
    testsRealizados.push("Senior Fitness Test");
    
    if (sftResultado.textContent.includes("por debajo del promedio")) {
      if (sftResultado.textContent.includes("Chair Stand") && sftResultado.textContent.includes("por debajo del promedio")) {
        hallazgos.push("Fuerza de miembros inferiores por debajo del promedio para la edad");
      }
      if (sftResultado.textContent.includes("Arm Curl") && sftResultado.textContent.includes("por debajo del promedio")) {
        hallazgos.push("Fuerza de miembros superiores por debajo del promedio para la edad");
      }
      if (sftResultado.textContent.includes("2-Min Step") && sftResultado.textContent.includes("por debajo del promedio")) {
        hallazgos.push("Resistencia cardiorrespiratoria por debajo del promedio para la edad");
      }
      if (sftResultado.textContent.includes("Chair Sit & Reach") && sftResultado.textContent.includes("por debajo del promedio")) {
        hallazgos.push("Flexibilidad de miembros inferiores por debajo del promedio para la edad");
      }
      if (sftResultado.textContent.includes("Back Scratch") && sftResultado.textContent.includes("por debajo del promedio")) {
        hallazgos.push("Flexibilidad de miembros superiores por debajo del promedio para la edad");
      }
      if (sftResultado.textContent.includes("8-Foot Up & Go") && sftResultado.textContent.includes("por debajo del promedio")) {
        hallazgos.push("Agilidad y equilibrio dinámico por debajo del promedio para la edad");
      }
    }
  }
  
  // Verificar LESS
  const lessResultado = document.getElementById('less_resultado');
  if (lessResultado && !lessResultado.textContent.includes("Seleccione")) {
    testsRealizados.push("LESS");
    
    if (lessResultado.className.includes("alert-danger")) {
      hallazgos.push("Alto riesgo de lesión de LCA por técnica de aterrizaje deficiente");
    } else if (lessResultado.className.includes("alert-warning")) {
      hallazgos.push("Riesgo moderado de lesión de LCA por técnica de aterrizaje");
    }
  }
  
  // Generar la interpretación clínica
  let interpretacion = "";
  let recomendaciones = "";
  
  if (testsRealizados.length === 0) {
    interpretacion = "Complete la evaluación de fuerza funcional para obtener recomendaciones clínicas.";
    recomendaciones = "Complete la evaluación para obtener recomendaciones específicas.";
  } else {
    interpretacion = `Basado en los resultados de ${testsRealizados.length} test${testsRealizados.length > 1 ? 's' : ''} de fuerza funcional (${testsRealizados.join(", ")}), se identifican los siguientes hallazgos clínicos:<br><br>`;
    
    if (hallazgos.length === 0) {
      interpretacion += "✅ No se identifican déficits significativos en la fuerza funcional evaluada.<br>";
      interpretacion += "✅ Los resultados sugieren una buena capacidad funcional en las áreas evaluadas.<br>";
      
      recomendaciones = "Basado en los resultados obtenidos, se recomienda:<br><br>";
      recomendaciones += "✅ Continuar con programa de mantenimiento de fuerza funcional.<br>";
      recomendaciones += "✅ Progresión gradual en demandas funcionales según objetivos específicos del paciente.<br>";
      
      if (testsRealizados.includes("Batería de Saltos") || testsRealizados.includes("Hop Test")) {
        recomendaciones += "✅ Optimización de patrones de movimiento en actividades deportivas.<br>";
      }
      
      if (testsRealizados.includes("McGill Core Tests")) {
        recomendaciones += "✅ Mantenimiento de la estabilidad del core en actividades cotidianas y deportivas.<br>";
      }
      
      if (testsRealizados.includes("TUG") || testsRealizados.includes("Senior Fitness Test")) {
        recomendaciones += "✅ Mantenimiento de actividad física regular para preservar la funcionalidad en el adulto mayor.<br>";
      }
    } else {
      // Ordenar hallazgos por frecuencia de palabras clave para agrupar los relacionados
      hallazgos.sort();
      
      interpretacion += `<ul class="mb-0">`;
      hallazgos.forEach(hallazgo => {
        interpretacion += `<li>${hallazgo}.</li>`;
      });
      interpretacion += `</ul>`;
      
      // Recomendaciones basadas en los hallazgos
      recomendaciones = "Basado en los hallazgos clínicos, se recomienda:<br><br>";
      
      // Recomendaciones para miembros inferiores
      if (hallazgos.some(h => h.includes("miembros inferiores") || h.includes("cuádriceps"))) {
        recomendaciones += "• <strong>Fortalecimiento de miembros inferiores</strong>:<br>";
        recomendaciones += "  - Ejercicios funcionales progresivos (sentadillas, estocadas, puentes).<br>";
        recomendaciones += "  - Entrenamiento de cadena cinética cerrada con énfasis en calidad de movimiento.<br>";
        if (hallazgos.some(h => h.includes("asimetría"))) {
          recomendaciones += "  - Trabajo unilateral con énfasis en equilibrar asimetrías.<br>";
        }
      }
      
      // Recomendaciones para miembros superiores
      if (hallazgos.some(h => h.includes("miembros superiores") || h.includes("espalda y brazos"))) {
        recomendaciones += "• <strong>Fortalecimiento de miembros superiores</strong>:<br>";
        recomendaciones += "  - Ejercicios progresivos de empuje y tracción.<br>";
        recomendaciones += "  - Integración de patrones funcionales multidireccionales.<br>";
      }
      
      // Recomendaciones para core
      if (hallazgos.some(h => h.includes("core") || h.includes("tronco"))) {
        recomendaciones += "• <strong>Estabilización del core</strong>:<br>";
        recomendaciones += "  - Programa progresivo de estabilización según principios de McGill.<br>";
        recomendaciones += "  - Énfasis en corrección de desequilibrios identificados.<br>";
        if (hallazgos.some(h => h.includes("asimetría"))) {
          recomendaciones += "  - Trabajo específico para corregir asimetrías laterales.<br>";
        }
      }
      
      // Recomendaciones para capacidad de salto
      if (hallazgos.some(h => h.includes("elasticidad") || h.includes("reactiva") || h.includes("salto"))) {
        recomendaciones += "• <strong>Entrenamiento neuromuscular y pliométrico</strong>:<br>";
        recomendaciones += "  - Programa progresivo de pliometría adaptado al nivel del paciente.<br>";
        if (hallazgos.some(h => h.includes("elasticidad"))) {
          recomendaciones += "  - Ejercicios de ciclo estiramiento-acortamiento enfocados en mejorar elasticidad.<br>";
        }
        if (hallazgos.some(h => h.includes("reactividad"))) {
          recomendaciones += "  - Ejercicios de tiempo de contacto reducido para mejorar reactividad.<br>";
        }
        if (hallazgos.some(h => h.includes("coordinación"))) {
          recomendaciones += "  - Ejercicios de coordinación de miembros superiores durante saltos.<br>";
        }
      }
      
      // Recomendaciones para riesgo de lesión
      if (hallazgos.some(h => h.includes("lesión"))) {
        recomendaciones += "• <strong>Prevención de lesiones</strong>:<br>";
        recomendaciones += "  - Programa de control neuromuscular específico.<br>";
        recomendaciones += "  - Entrenamiento de la técnica de aterrizaje y cambios de dirección.<br>";
        recomendaciones += "  - Corrección de patrones de movimiento disfuncionales.<br>";
      }
      
      // Recomendaciones para adulto mayor / riesgo de caídas
      if (hallazgos.some(h => h.includes("caídas") || h.includes("edad"))) {
        recomendaciones += "• <strong>Prevención de caídas y mantenimiento funcional</strong>:<br>";
        recomendaciones += "  - Programa multifactorial de prevención de caídas.<br>";
        recomendaciones += "  - Entrenamiento de equilibrio estático y dinámico.<br>";
        recomendaciones += "  - Fortalecimiento específico para mantener independencia funcional.<br>";
      }
      
      // Recomendación general de monitoreo
      recomendaciones += "<br>• <strong>Seguimiento</strong>: Reevaluación periódica para monitorizar progreso y ajustar intervenciones según resultados.";
    }
  }
  
  // Actualizar los contenedores de interpretación y recomendaciones
  document.getElementById('interpretacion-fuerza-funcional-texto').innerHTML = interpretacion;
  document.getElementById('recomendaciones-fuerza-funcional-texto').innerHTML = recomendaciones;
  
  // Actualizar el estado del cuestionario
  verificarEstadoCuestionarios();
}

/**
 * Verifica el estado general de los cuestionarios y actualiza el badge
 */
function verificarEstadoCuestionarios() {
  const testsRealizados = [];
  
  // Verificar los principales tests
  if (document.getElementById('sit_to_stand_resultado') && !document.getElementById('sit_to_stand_resultado').textContent.includes("Complete")) {
    testsRealizados.push("sit_to_stand");
  }
  if (document.getElementById('push_up_resultado') && !document.getElementById('push_up_resultado').textContent.includes("Complete")) {
    testsRealizados.push("push_up");
  }
  if (document.getElementById('mcgill_resultado') && !document.getElementById('mcgill_resultado').textContent.includes("Complete")) {
    testsRealizados.push("mcgill");
  }
  if (document.getElementById('wall_sit_resultado') && !document.getElementById('wall_sit_resultado').textContent.includes("Complete")) {
    testsRealizados.push("wall_sit");
  }
  if (document.getElementById('pullup_resultado') && !document.getElementById('pullup_resultado').textContent.includes("Complete")) {
    testsRealizados.push("pullup");
  }
  if (document.getElementById('hop_resultado') && !document.getElementById('hop_resultado').textContent.includes("Complete")) {
    testsRealizados.push("hop");
  }
  if (document.getElementById('salto_resultado') && !document.getElementById('salto_resultado').textContent.includes("Complete")) {
    testsRealizados.push("salto");
  }
  if (document.getElementById('tug_resultado') && !document.getElementById('tug_resultado').textContent.includes("Complete")) {
    testsRealizados.push("tug");
  }
  if (document.getElementById('sft_resultado') && !document.getElementById('sft_resultado').textContent.includes("Complete")) {
    testsRealizados.push("sft");
  }
  if (document.getElementById('less_resultado') && !document.getElementById('less_resultado').textContent.includes("Seleccione")) {
    testsRealizados.push("less");
  }
  
  // Actualizar el badge según la cantidad de tests realizados
  const badge = document.getElementById('fuerza-funcional-badge');
  
  if (testsRealizados.length === 0) {
    badge.textContent = "No completado";
    badge.className = "resultado-badge no-completado";
  } else if (testsRealizados.length <= 2) {
    badge.textContent = "Parcial";
    badge.className = "resultado-badge parcial";
  } else {
    badge.textContent = "Completado";
    badge.className = "resultado-badge completado";
  }
}

// Añadir event listeners para inicializar los acordeones cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todos los acordeones con display none
  const subcuestionarios = document.querySelectorAll('.subcuestionario-content');
  subcuestionarios.forEach(function(content) {
    content.style.display = 'none';
  });
  
  // Verificar el estado del cuestionario principal
  verificarEstadoCuestionarios();
});
