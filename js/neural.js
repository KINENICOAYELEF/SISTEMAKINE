/**
 * Evaluación Neural - Funciones JavaScript
 * Basado en evidencia científica actualizada para la evaluación neurológica en fisioterapia
 */

// ================== FUNCIONES DE EVALUACIÓN DE DERMATOMAS ==================

/**
 * Evalúa los patrones de dermatomas seleccionados para detectar patrones radiculares
 */
function evaluarDermatomas() {
  // Recopilar resultados de todos los dermatomas
  const dermatomas = {
    c3: document.getElementById('dermatoma_c3').value,
    c4: document.getElementById('dermatoma_c4').value,
    c5: document.getElementById('dermatoma_c5').value,
    c6: document.getElementById('dermatoma_c6').value,
    c7: document.getElementById('dermatoma_c7').value,
    c8: document.getElementById('dermatoma_c8').value,
    t1: document.getElementById('dermatoma_t1').value,
    l1: document.getElementById('dermatoma_l1').value,
    l2: document.getElementById('dermatoma_l2').value,
    l3: document.getElementById('dermatoma_l3').value,
    l4: document.getElementById('dermatoma_l4').value,
    l5: document.getElementById('dermatoma_l5').value,
    s1: document.getElementById('dermatoma_s1').value,
    s2_s4: document.getElementById('dermatoma_s2_s4').value
  };
  
  // Conteo de anomalías por tipo
  let alteraciones = {
    hipoestesia: 0,
    hiperestesia: 0,
    anestesia: 0,
    total: 0
  };
  
  // Detectar patrones radiculares específicos
  let patronesRadiculares = [];
  
  // Contar alteraciones
  for (const nivel in dermatomas) {
    if (dermatomas[nivel] !== 'normal') {
      alteraciones[dermatomas[nivel]]++;
      alteraciones.total++;
    }
  }
  
  // Detectar patrones cervicales
  if (dermatomas.c5 !== 'normal' && dermatomas.c6 === 'normal' && alteraciones.total < 3) {
    patronesRadiculares.push("Patrón radicular C5");
  }
  
  if (dermatomas.c6 !== 'normal' && alteraciones.total < 3) {
    patronesRadiculares.push("Patrón radicular C6");
  }
  
  if (dermatomas.c7 !== 'normal' && alteraciones.total < 3) {
    patronesRadiculares.push("Patrón radicular C7");
  }
  
  if (dermatomas.c8 !== 'normal' && dermatomas.t1 !== 'normal' && alteraciones.total < 4) {
    patronesRadiculares.push("Patrón radicular C8-T1");
  }
  
  // Detectar patrones lumbares
  if (dermatomas.l4 !== 'normal' && alteraciones.total < 3) {
    patronesRadiculares.push("Patrón radicular L4");
  }
  
  if (dermatomas.l5 !== 'normal' && alteraciones.total < 3) {
    patronesRadiculares.push("Patrón radicular L5");
  }
  
  if (dermatomas.s1 !== 'normal' && alteraciones.total < 3) {
    patronesRadiculares.push("Patrón radicular S1");
  }
  
  // Análisis de múltiples niveles
  if (alteraciones.total >= 4) {
    patronesRadiculares = ["Afectación multinivel o patrón no radicular específico"];
  }
  
  // Generar resultado
  let resultado = "";
  let color = "secondary";
  
  if (alteraciones.total === 0) {
    resultado = "Sensibilidad dermatómica normal en todos los niveles evaluados.";
  } else {
    // Determinar el color según la severidad
    if (alteraciones.anestesia > 0) {
      color = "danger";
    } else if (alteraciones.total > 3) {
      color = "warning";
    } else {
      color = "info";
    }
    
    resultado = `<strong>Alteraciones sensoriales:</strong> `;
    
    if (alteraciones.hipoestesia > 0) {
      resultado += `Hipoestesia en ${alteraciones.hipoestesia} dermatoma(s). `;
    }
    
    if (alteraciones.hiperestesia > 0) {
      resultado += `Hiperestesia en ${alteraciones.hiperestesia} dermatoma(s). `;
    }
    
    if (alteraciones.anestesia > 0) {
      resultado += `Anestesia en ${alteraciones.anestesia} dermatoma(s). `;
    }
    
    resultado += "<br><strong>Interpretación:</strong> ";
    
    if (patronesRadiculares.length > 0) {
      resultado += patronesRadiculares.join(". ") + ". ";
    } else {
      resultado += "No se identifica un patrón radicular claro. ";
    }
    
    // Añadir indicaciones clínicas
    resultado += "<br><strong>Relevancia clínica:</strong> ";
    
    if (alteraciones.anestesia > 0) {
      resultado += "La presencia de anestesia sugiere compromiso neural significativo. Se recomienda evaluación médica especializada. ";
    } else if (alteraciones.total > 3) {
      resultado += "El patrón difuso de alteración sensorial puede sugerir neuropatía periférica, sensibilización central o patología no neural. ";
    } else {
      resultado += "Alteración sensorial consistente con irritación/compresión neural de nivel leve-moderado. ";
    }
  }
  
  document.getElementById('dermatomas_resultado').innerHTML = resultado;
  document.getElementById('dermatomas_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionNeurosensitiva();
}

// ================== FUNCIONES DE EVALUACIÓN DE MIOTOMAS ==================

/**
 * Evalúa los miotomas para detectar patrones de debilidad radicular
 */
function evaluarMiotomas() {
  // Recopilar resultados de todos los miotomas
  const miotomas = {
    c5: parseInt(document.getElementById('miotoma_c5').value),
    c6: parseInt(document.getElementById('miotoma_c6').value),
    c7: parseInt(document.getElementById('miotoma_c7').value),
    c8: parseInt(document.getElementById('miotoma_c8').value),
    t1: parseInt(document.getElementById('miotoma_t1').value),
    l2: parseInt(document.getElementById('miotoma_l2').value),
    l3: parseInt(document.getElementById('miotoma_l3').value),
    l4: parseInt(document.getElementById('miotoma_l4').value),
    l5: parseInt(document.getElementById('miotoma_l5').value),
    s1: parseInt(document.getElementById('miotoma_s1').value)
  };
  
  // Contar debilidades por severidad
  let debilidad = {
    leve: 0, // Fuerza 4
    moderada: 0, // Fuerza 3
    severa: 0, // Fuerza 0-2
    total: 0
  };
  
  // Detectar patrones radiculares específicos
  let patronesRadiculares = [];
  
  // Analizar cada miotoma
  for (const nivel in miotomas) {
    if (miotomas[nivel] < 5) {
      debilidad.total++;
      
      if (miotomas[nivel] === 4) {
        debilidad.leve++;
      } else if (miotomas[nivel] === 3) {
        debilidad.moderada++;
      } else {
        debilidad.severa++;
      }
    }
  }
  
  // Detectar patrones cervicales
  if (miotomas.c5 < 5 && miotomas.c5 >= 3 && debilidad.total < 3) {
    patronesRadiculares.push("Patrón compatible con radiculopatía C5");
  }
  
  if (miotomas.c6 < 5 && miotomas.c6 >= 3 && debilidad.total < 3) {
    patronesRadiculares.push("Patrón compatible con radiculopatía C6");
  }
  
  if (miotomas.c7 < 5 && miotomas.c7 >= 3 && debilidad.total < 3) {
    patronesRadiculares.push("Patrón compatible con radiculopatía C7");
  }
  
  if (miotomas.c8 < 5 && miotomas.c8 >= 3 && miotomas.t1 < 5 && debilidad.total < 4) {
    patronesRadiculares.push("Patrón compatible con radiculopatía C8-T1");
  }
  
  // Detectar patrones lumbares
  if (miotomas.l2 < 5 && miotomas.l2 >= 3 && miotomas.l3 < 5 && debilidad.total < 4) {
    patronesRadiculares.push("Patrón compatible con radiculopatía L2-L3");
  }
  
  if (miotomas.l4 < 5 && miotomas.l4 >= 3 && debilidad.total < 3) {
    patronesRadiculares.push("Patrón compatible con radiculopatía L4");
  }
  
  if (miotomas.l5 < 5 && miotomas.l5 >= 3 && debilidad.total < 3) {
    patronesRadiculares.push("Patrón compatible con radiculopatía L5");
  }
  
  if (miotomas.s1 < 5 && miotomas.s1 >= 3 && debilidad.total < 3) {
    patronesRadiculares.push("Patrón compatible con radiculopatía S1");
  }
  
  // Análisis de múltiples niveles
  if (debilidad.total >= 4 || debilidad.severa >= 2) {
    patronesRadiculares = ["Debilidad difusa o multinivel que no se corresponde con un patrón radicular único"];
  }
  
  // Generar resultado
  let resultado = "";
  let color = "secondary";
  
  if (debilidad.total === 0) {
    resultado = "Todos los miotomas evaluados presentan fuerza normal (5/5).";
  } else {
    // Determinar el color según la severidad
    if (debilidad.severa > 0) {
      color = "danger";
    } else if (debilidad.moderada > 0) {
      color = "warning";
    } else {
      color = "info";
    }
    
    resultado = `<strong>Hallazgos de fuerza muscular:</strong> `;
    
    if (debilidad.leve > 0) {
      resultado += `Debilidad leve (4/5) en ${debilidad.leve} miotoma(s). `;
    }
    
    if (debilidad.moderada > 0) {
      resultado += `Debilidad moderada (3/5) en ${debilidad.moderada} miotoma(s). `;
    }
    
    if (debilidad.severa > 0) {
      resultado += `Debilidad severa (≤2/5) en ${debilidad.severa} miotoma(s). `;
    }
    
    resultado += "<br><strong>Interpretación:</strong> ";
    
    if (patronesRadiculares.length > 0) {
      resultado += patronesRadiculares.join(". ") + ". ";
    } else {
      resultado += "No se identifica un patrón radicular específico. ";
    }
    
    // Añadir indicaciones clínicas
    resultado += "<br><strong>Relevancia clínica:</strong> ";
    
    if (debilidad.severa > 0) {
      resultado += "La debilidad severa sugiere compromiso neural significativo. Se recomienda evaluación médica especializada. ";
      if (debilidad.severa >= 2) {
        resultado += "El patrón de afectación multinivel puede indicar patología de motoneurona superior o inferior, dependiendo del patrón reflejo asociado. ";
      }
    } else if (debilidad.moderada > 0) {
      resultado += "La debilidad moderada es consistente con compresión/irritación neural de relevancia clínica. Correlacionar con otros hallazgos neurales y funcionales. ";
    } else {
      resultado += "La debilidad leve puede ser compatible con irritación neural leve o fatiga muscular. Correlacionar con síntomas y limitación funcional. ";
    }
  }
  
  document.getElementById('miotomas_resultado').innerHTML = resultado;
  document.getElementById('miotomas_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionNeurosensitiva();
}

// ================== FUNCIONES DE EVALUACIÓN DE REFLEJOS ==================

/**
 * Evalúa los reflejos para detectar patrones de hiperreflexia o hiporreflexia
 */
function evaluarReflejos() {
  // Recopilar resultados de reflejos osteotendinosos
  const reflejos = {
    bicipital: parseInt(document.getElementById('reflejo_bicipital').value),
    estilorradial: parseInt(document.getElementById('reflejo_estilorradial').value),
    tricipital: parseInt(document.getElementById('reflejo_tricipital').value),
    rotuliano: parseInt(document.getElementById('reflejo_rotuliano').value),
    aquileo: parseInt(document.getElementById('reflejo_aquileo').value)
  };
  
  // Recopilar resultados de reflejos patológicos
  const reflejosPatologicos = {
    babinski: document.getElementById('reflejo_babinski').value,
    hoffman: document.getElementById('reflejo_hoffman').value,
    clonus: document.getElementById('reflejo_clonus').value
  };
  
  // Contar anomalías
  let anomalias = {
    hiperreflexia: 0,
    hiporreflexia: 0,
    patologicos: 0,
    total: 0
  };
  
  // Analizar reflejos osteotendinosos
  for (const reflejo in reflejos) {
    if (reflejos[reflejo] > 2) { // Hiperreflexia (3+ o 4+)
      anomalias.hiperreflexia++;
      anomalias.total++;
    } else if (reflejos[reflejo] < 2) { // Hiporreflexia (0 o 1+)
      anomalias.hiporreflexia++;
      anomalias.total++;
    }
  }
  
  // Analizar reflejos patológicos
  if (reflejosPatologicos.babinski === 'positivo') {
    anomalias.patologicos++;
    anomalias.total++;
  }
  
  if (reflejosPatologicos.hoffman === 'positivo') {
    anomalias.patologicos++;
    anomalias.total++;
  }
  
  if (reflejosPatologicos.clonus !== 'negativo') {
    anomalias.patologicos++;
    anomalias.total++;
  }
  
  // Detectar patrones clínicos
  let patrones = [];
  
  // Patrones de motoneurona superior (hiperreflexia)
  if (anomalias.hiperreflexia >= 3 || (anomalias.hiperreflexia >= 2 && anomalias.patologicos >= 1)) {
    patrones.push("Signos de motoneurona superior (hiperreflexia generalizada)");
  }
  
  // Patrones de motoneurona inferior (hiporreflexia)
  if (anomalias.hiporreflexia >= 3) {
    patrones.push("Signos de motoneurona inferior (hiporreflexia generalizada)");
  }
  
  // Patrones radiculares específicos
  if (reflejos.bicipital < 2 && reflejos.estilorradial < 2 && anomalias.hiporreflexia < 3) {
    patrones.push("Patrón compatible con radiculopatía C5-C6");
  }
  
  if (reflejos.tricipital < 2 && anomalias.hiporreflexia < 3) {
    patrones.push("Patrón compatible con radiculopatía C7");
  }
  
  if (reflejos.rotuliano < 2 && anomalias.hiporreflexia < 3) {
    patrones.push("Patrón compatible con radiculopatía L3-L4");
  }
  
  if (reflejos.aquileo < 2 && anomalias.hiporreflexia < 3) {
    patrones.push("Patrón compatible con radiculopatía S1");
  }
  
  // Generar resultado
  let resultado = "";
  let color = "secondary";
  
  if (anomalias.total === 0) {
    resultado = "Todos los reflejos evaluados se encuentran dentro de la normalidad.";
  } else {
    // Determinar el color según la severidad
    if (anomalias.patologicos > 0) {
      color = "danger";
    } else if (anomalias.hiperreflexia > 0) {
      color = "warning";
    } else {
      color = "info";
    }
    
    resultado = `<strong>Hallazgos de reflejos:</strong> `;
    
    if (anomalias.hiperreflexia > 0) {
      resultado += `Hiperreflexia en ${anomalias.hiperreflexia} reflejo(s). `;
    }
    
    if (anomalias.hiporreflexia > 0) {
      resultado += `Hiporreflexia en ${anomalias.hiporreflexia} reflejo(s). `;
    }
    
    if (anomalias.patologicos > 0) {
      resultado += `Reflejos patológicos positivos: `;
      
      if (reflejosPatologicos.babinski === 'positivo') {
        resultado += "Babinski, ";
      }
      
      if (reflejosPatologicos.hoffman === 'positivo') {
        resultado += "Hoffman, ";
      }
      
      if (reflejosPatologicos.clonus !== 'negativo') {
        resultado += `Clonus (${reflejosPatologicos.clonus}), `;
      }
      
      resultado = resultado.slice(0, -2) + ". "; // Eliminar última coma
    }
    
    resultado += "<br><strong>Interpretación:</strong> ";
    
    if (patrones.length > 0) {
      resultado += patrones.join(". ") + ". ";
    } else {
      resultado += "No se identifica un patrón neurológico específico. ";
    }
    
    // Añadir indicaciones clínicas
    resultado += "<br><strong>Relevancia clínica:</strong> ";
    
    if (anomalias.patologicos > 0) {
      resultado += "La presencia de reflejos patológicos sugiere afectación de vías corticoespinales. Requiere evaluación neurológica especializada. ";
    } else if (anomalias.hiperreflexia > 0) {
      resultado += "La hiperreflexia puede indicar compromiso de motoneurona superior o estados de hiperexcitabilidad neural. ";
    } else if (anomalias.hiporreflexia > 0) {
      resultado += "La hiporreflexia es compatible con compromiso radicular o neuropatía periférica. ";
    }
  }
  
  document.getElementById('reflejos_resultado').innerHTML = resultado;
  document.getElementById('reflejos_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación global
  actualizarInterpretacionNeurosensitiva();
}

// ================== INTERPRETACIÓN INTEGRADA DE EXAMEN NEUROSENSITIVO ==================

/**
 * Actualiza la interpretación integrada del examen neurosensitivo
 */
function actualizarInterpretacionNeurosensitiva() {
  // Verificar si se ha completado al menos un tipo de evaluación
  const dermatomasResultado = document.getElementById('dermatomas_resultado');
  const miotomasResultado = document.getElementById('miotomas_resultado');
  const reflejosResultado = document.getElementById('reflejos_resultado');
  
  let evaluacionesCompletadas = 0;
  if (dermatomasResultado && !dermatomasResultado.textContent.includes('Complete')) {
    evaluacionesCompletadas++;
  }
  
  if (miotomasResultado && !miotomasResultado.textContent.includes('Complete')) {
    evaluacionesCompletadas++;
  }
  
  if (reflejosResultado && !reflejosResultado.textContent.includes('Complete')) {
    evaluacionesCompletadas++;
  }
  
  // Si no se ha completado ninguna evaluación, no actualizar
  if (evaluacionesCompletadas === 0) {
    document.getElementById('neurosensitivo_interpretacion').innerHTML = "Complete al menos una evaluación para obtener una interpretación integrada.";
    document.getElementById('neurosensitivo_interpretacion').className = "alert alert-secondary";
    return;
  }
  
  // Analizar si hay patrones radiculares consistentes
  let patronesRadiculares = {
    c5: 0,
    c6: 0,
    c7: 0,
    c8: 0,
    l3l4: 0,
    l4: 0,
    l5: 0,
    s1: 0,
    multiple: 0
  };
  
  // Buscar patrones en dermatomas
  if (dermatomasResultado && !dermatomasResultado.textContent.includes('Complete')) {
    if (dermatomasResultado.textContent.includes('Patrón radicular C5')) patronesRadiculares.c5++;
    if (dermatomasResultado.textContent.includes('Patrón radicular C6')) patronesRadiculares.c6++;
    if (dermatomasResultado.textContent.includes('Patrón radicular C7')) patronesRadiculares.c7++;
    if (dermatomasResultado.textContent.includes('Patrón radicular C8-T1')) patronesRadiculares.c8++;
    if (dermatomasResultado.textContent.includes('Patrón radicular L4')) patronesRadiculares.l4++;
    if (dermatomasResultado.textContent.includes('Patrón radicular L5')) patronesRadiculares.l5++;
    if (dermatomasResultado.textContent.includes('Patrón radicular S1')) patronesRadiculares.s1++;
    if (dermatomasResultado.textContent.includes('Afectación multinivel')) patronesRadiculares.multiple++;
  }
  
  // Buscar patrones en miotomas
  if (miotomasResultado && !miotomasResultado.textContent.includes('Complete')) {
    if (miotomasResultado.textContent.includes('radiculopatía C5')) patronesRadiculares.c5++;
    if (miotomasResultado.textContent.includes('radiculopatía C6')) patronesRadiculares.c6++;
    if (miotomasResultado.textContent.includes('radiculopatía C7')) patronesRadiculares.c7++;
    if (miotomasResultado.textContent.includes('radiculopatía C8-T1')) patronesRadiculares.c8++;
    if (miotomasResultado.textContent.includes('radiculopatía L2-L3')) patronesRadiculares.l3l4++;
    if (miotomasResultado.textContent.includes('radiculopatía L4')) patronesRadiculares.l4++;
    if (miotomasResultado.textContent.includes('radiculopatía L5')) patronesRadiculares.l5++;
    if (miotomasResultado.textContent.includes('radiculopatía S1')) patronesRadiculares.s1++;
    if (miotomasResultado.textContent.includes('Debilidad difusa')) patronesRadiculares.multiple++;
  }
  
  // Buscar patrones en reflejos
  if (reflejosResultado && !reflejosResultado.textContent.includes('Complete')) {
    if (reflejosResultado.textContent.includes('radiculopatía C5-C6')) {
      patronesRadiculares.c5++;
      patronesRadiculares.c6++;
    }
    if (reflejosResultado.textContent.includes('radiculopatía C7')) patronesRadiculares.c7++;
    if (reflejosResultado.textContent.includes('radiculopatía L3-L4')) patronesRadiculares.l3l4++;
    if (reflejosResultado.textContent.includes('radiculopatía S1')) patronesRadiculares.s1++;
    if (reflejosResultado.textContent.includes('motoneurona superior')) patronesRadiculares.multiple++;
    if (reflejosResultado.textContent.includes('motoneurona inferior')) patronesRadiculares.multiple++;
  }
  
  // Detectar banderas rojas o signos de alarma neurológicos
  let banderasRojas = [];
  
  if (miotomasResultado && miotomasResultado.textContent.includes('Debilidad severa')) {
    banderasRojas.push("Debilidad severa que requiere evaluación especializada");
  }
  
  if (reflejosResultado && reflejosResultado.textContent.includes('reflejos patológicos')) {
    banderasRojas.push("Presencia de reflejos patológicos que indica posible afectación de vías corticoespinales");
  }
  
  if (dermatomasResultado && dermatomasResultado.textContent.includes('anestesia')) {
    banderasRojas.push("Anestesia en territorio dermatómico que sugiere compromiso neural severo");
  }
  
  // Generar interpretación
  let interpretacion = "";
  let color = "info";
  
  // Determinar color según gravedad
  if (banderasRojas.length > 0) {
    color = "danger";
  } else if (patronesRadiculares.multiple > 0) {
    color = "warning";
  }
  
  interpretacion = `<strong>Interpretación del Examen Neurosensitivo (${evaluacionesCompletadas} evaluación(es) completada(s)):</strong><br><br>`;
  
  // Determinar patrones consistentes (al menos 2 pruebas)
  let patronesConsistentes = [];
  
  for (const patron in patronesRadiculares) {
    if (patronesRadiculares[patron] >= 2) {
      switch (patron) {
        case 'c5': patronesConsistentes.push("C5"); break;
        case 'c6': patronesConsistentes.push("C6"); break;
        case 'c7': patronesConsistentes.push("C7"); break;
        case 'c8': patronesConsistentes.push("C8"); break;
        case 'l3l4': patronesConsistentes.push("L3-L4"); break;
        case 'l4': patronesConsistentes.push("L4"); break;
        case 'l5': patronesConsistentes.push("L5"); break;
        case 's1': patronesConsistentes.push("S1"); break;
        case 'multiple': patronesConsistentes.push("Multinivel"); break;
      }
    }
  }
  
  if (patronesConsistentes.length > 0) {
    interpretacion += `<strong>Patrón neural consistente:</strong> Afectación a nivel `;
    
    if (patronesConsistentes.includes("Multinivel")) {
      interpretacion += "multinivel o difuso. Este patrón puede sugerir neuropatía periférica, polineuropatía o sensibilización central.<br><br>";
    } else {
      interpretacion += patronesConsistentes.join(", ") + ". ";
      interpretacion += "Este patrón es compatible con radiculopatía o neuropatía periférica a dicho(s) nivel(es).<br><br>";
    }
  } else if (evaluacionesCompletadas >= 2) {
    interpretacion += "<strong>Patrón neural inconsistente:</strong> No se identifica un patrón neural consistente entre las evaluaciones realizadas. Esto puede sugerir un componente no neural o mixto en la sintomatología.<br><br>";
  } else {
    // Si solo se hizo una evaluación, reportar sus hallazgos
    if (dermatomasResultado && !dermatomasResultado.textContent.includes('Complete')) {
      interpretacion += "<strong>Hallazgos sensoriales:</strong> " + dermatomasResultado.textContent.replace("Relevancia clínica:", "<br>Relevancia clínica:") + "<br><br>";
    }
    
    if (miotomasResultado && !miotomasResultado.textContent.includes('Complete')) {
      interpretacion += "<strong>Hallazgos motores:</strong> " + miotomasResultado.textContent.replace("Relevancia clínica:", "<br>Relevancia clínica:") + "<br><br>";
    }
    
    if (reflejosResultado && !reflejosResultado.textContent.includes('Complete')) {
      interpretacion += "<strong>Hallazgos reflejos:</strong> " + reflejosResultado.textContent.replace("Relevancia clínica:", "<br>Relevancia clínica:") + "<br><br>";
    }
  }
  
  // Añadir sección de banderas rojas si existen
  if (banderasRojas.length > 0) {
    interpretacion += "<div class='bandera-roja'><strong>⚠️ BANDERAS ROJAS NEUROLÓGICAS:</strong><br>";
    banderasRojas.forEach(bandera => {
      interpretacion += "- " + bandera + "<br>";
    });
    interpretacion += "</div><br>";
  }
  
  // Añadir recomendaciones clínicas
  interpretacion += "<strong>Recomendaciones:</strong><br>";
  
  if (banderasRojas.length > 0) {
    interpretacion += "- Derivación a especialista (neurología) para evaluación ampliada.<br>";
    interpretacion += "- Considerar estudios complementarios (electromiografía, estudios de conducción nerviosa, resonancia magnética).<br>";
    interpretacion += "- Evitar intervenciones que puedan aumentar la tensión neural hasta evaluación especializada.<br>";
  } else if (patronesConsistentes.length > 0 && !patronesConsistentes.includes("Multinivel")) {
    interpretacion += "- Evaluación neuromusculoesquelética completa centrada en los niveles afectados.<br>";
    interpretacion += "- Considerar tests neurodinámicos para confirmar componente de tensión neural.<br>";
    interpretacion += "- Técnicas de movilización neural progresivas según tolerancia.<br>";
  } else {
    interpretacion += "- Completar la evaluación neurosensitiva para obtener un perfil más completo.<br>";
    interpretacion += "- Correlacionar con hallazgos musculoesqueléticos para determinar relevancia clínica.<br>";
    interpretacion += "- Considerar componentes no neurales como contribuyentes a la sintomatología.<br>";
  }
  
  document.getElementById('neurosensitivo_interpretacion').innerHTML = interpretacion;
  document.getElementById('neurosensitivo_interpretacion').className = `alert alert-${color}`;
  
  // Actualizar interpretación global neural
  actualizarInterpretacionNeural();
}

// ================== FUNCIONES DE EVALUACIÓN DE TESTS NEURODINÁMICOS ==================

/**
 * Evalúa los tests neurodinámicos de miembro superior (ULNT)
 */
function evaluarULNT() {
  // Recopilar resultados de tests neurodinámicos
  const ulnt = {
    ulnt1: {
      respuesta: document.getElementById('ulnt1_respuesta').value,
      diferenciacion: document.getElementById('ulnt1_diferenciacion').checked
    },
    ulnt2a: {
      respuesta: document.getElementById('ulnt2a_respuesta').value,
      diferenciacion: document.getElementById('ulnt2a_diferenciacion').checked
    },
    ulnt2b: {
      respuesta: document.getElementById('ulnt2b_respuesta').value,
      diferenciacion: document.getElementById('ulnt2b_diferenciacion').checked
    },
    ulnt3: {
      respuesta: document.getElementById('ulnt3_respuesta').value,
      diferenciacion: document.getElementById('ulnt3_diferenciacion').checked
    }
  };
  
  // Verificar si hay un test adicional
  const ulntAdicionalNombre = document.getElementById('ulnt_adicional_nombre').value;
  let ulntAdicional = null;
  
  if (ulntAdicionalNombre && ulntAdicionalNombre.trim() !== '') {
    ulntAdicional = {
      nombre: ulntAdicionalNombre,
      respuesta: document.getElementById('ulnt_adicional_respuesta').value,
      diferenciacion: document.getElementById('ulnt_adicional_diferenciacion').checked
    };
  }
  
  // Contar resultados positivos y valorar su relevancia clínica
  let testsPositivos = [];
  let testsPositivosConDiferenciacion = [];
  
  if (ulnt.ulnt1.respuesta === 'sintomatica') {
    testsPositivos.push("ULNT1 (nervio mediano)");
    if (ulnt.ulnt1.diferenciacion) {
      testsPositivosConDiferenciacion.push("ULNT1 (nervio mediano)");
    }
  }
  
  if (ulnt.ulnt2a.respuesta === 'sintomatica') {
    testsPositivos.push("ULNT2a (variante nervio mediano)");
    if (ulnt.ulnt2a.diferenciacion) {
      testsPositivosConDiferenciacion.push("ULNT2a (variante nervio mediano)");
    }
  }
  
  if (ulnt.ulnt2b.respuesta === 'sintomatica') {
    testsPositivos.push("ULNT2b (nervio radial)");
    if (ulnt.ulnt2b.diferenciacion) {
      testsPositivosConDiferenciacion.push("ULNT2b (nervio radial)");
    }
  }
  
  if (ulnt.ulnt3.respuesta === 'sintomatica') {
    testsPositivos.push("ULNT3 (nervio ulnar)");
    if (ulnt.ulnt3.diferenciacion) {
      testsPositivosConDiferenciacion.push("ULNT3 (nervio ulnar)");
    }
  }
  
  if (ulntAdicional && ulntAdicional.respuesta === 'sintomatica') {
    testsPositivos.push(ulntAdicional.nombre);
    if (ulntAdicional.diferenciacion) {
      testsPositivosConDiferenciacion.push(ulntAdicional.nombre);
    }
  }
  
  // Generar resultado
  let resultado = "";
  let color = "secondary";
  
  if (testsPositivos.length === 0) {
    resultado = "No se han identificado respuestas sintomáticas a los tests neurodinámicos de miembro superior evaluados.";
  } else {
    // Determinar el color según hallazgos
    if (testsPositivosConDiferenciacion.length > 0) {
      color = "warning";
    } else {
      color = "info";
    }
    
    resultado = `<strong>Hallazgos neurodinámicos:</strong> `;
    
    if (testsPositivos.length > 0) {
      resultado += `Se obtiene respuesta sintomática en ${testsPositivos.length} test(s): ${testsPositivos.join(", ")}.<br>`;
    }
    
    if (testsPositivosConDiferenciacion.length > 0) {
      resultado += `<strong>Tests con diferenciación estructural positiva:</strong> ${testsPositivosConDiferenciacion.join(", ")}.<br>`;
    }
    
    // Análisis específico de nervios afectados
    resultado += "<br><strong>Interpretación:</strong> ";
    
    let nerviosAfectados = [];
    
    if ((ulnt.ulnt1.respuesta === 'sintomatica' && ulnt.ulnt1.diferenciacion) || 
        (ulnt.ulnt2a.respuesta === 'sintomatica' && ulnt.ulnt2a.diferenciacion)) {
      nerviosAfectados.push("nervio mediano");
    }
    
    if (ulnt.ulnt2b.respuesta === 'sintomatica' && ulnt.ulnt2b.diferenciacion) {
      nerviosAfectados.push("nervio radial");
    }
    
    if (ulnt.ulnt3.respuesta === 'sintomatica' && ulnt.ulnt3.diferenciacion) {
      nerviosAfectados.push("nervio ulnar");
    }
    
    if (nerviosAfectados.length > 0) {
      resultado += `Los hallazgos sugieren mecanosensibilidad neural aumentada del ${nerviosAfectados.join(" y ")}. `;
      
      if (nerviosAfectados.length > 1) {
        resultado += "La afectación de múltiples troncos nerviosos puede indicar una radiculopatía, plexopatía o patología más generalizada. ";
      }
    } else if (testsPositivos.length > 0) {
      resultado += "Aunque hay respuestas sintomáticas, la ausencia de diferenciación estructural positiva reduce la especificidad neural de estos hallazgos. ";
      
      if (testsPositivos.length > 1) {
        resultado += "La provocación de síntomas en múltiples tests sin diferenciación estructural sugiere un posible componente musculoesquelético o de sensibilización central. ";
      }
    }
    
    // Sugerencias clínicas
    resultado += "<br><strong>Relevancia clínica:</strong> ";
    
    if (testsPositivosConDiferenciacion.length > 0) {
      resultado += "La mecanosensibilidad neural aumentada con diferenciación estructural positiva es un indicador clínicamente relevante de componente neural en la sintomatología. ";
      
      if (testsPositivosConDiferenciacion.length > 1) {
        resultado += "La afectación de múltiples nervios sugiere evaluar posibles sitios de compresión proximal (radiculopatía, plexopatía). ";
      }
    } else if (testsPositivos.length > 0) {
      resultado += "La provocación de síntomas sin diferenciación estructural positiva puede reflejar tensión o irritación de estructuras no neurales (musculotendinosas, fasciales) o sensibilización generalizada. ";
    }
  }
  
  document.getElementById('ulnt_resultado').innerHTML = resultado;
  document.getElementById('ulnt_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación de tensión neural
  actualizarInterpretacionTensionNeural();
}

/**
 * Evalúa los tests neurodinámicos de miembro inferior
 */
function evaluarSLR() {
  // Recopilar resultados de tests neurodinámicos de miembro inferior
  const slrAngulo = parseInt(document.getElementById('slr_angulo').value) || 0;
  const slrRespuesta = document.getElementById('slr_respuesta').value;
  const slrDiferenciacion = document.getElementById('slr_diferenciacion').checked;
  const slrCruzado = document.getElementById('slr_cruzado').checked;
  
  const slumpRespuesta = document.getElementById('slump_respuesta').value;
  const slumpDiferenciacion = document.getElementById('slump_diferenciacion').checked;
  
  const pkbAngulo = parseInt(document.getElementById('pkb_angulo').value) || 0;
  const pkbRespuesta = document.getElementById('pkb_respuesta').value;
  const pkbDiferenciacion = document.getElementById('pkb_diferenciacion').checked;
  
  // Verificar si hay un test adicional
  const llntAdicionalNombre = document.getElementById('llnt_adicional_nombre').value;
  let llntAdicional = null;
  
  if (llntAdicionalNombre && llntAdicionalNombre.trim() !== '') {
    llntAdicional = {
      nombre: llntAdicionalNombre,
      respuesta: document.getElementById('llnt_adicional_respuesta').value,
      diferenciacion: document.getElementById('llnt_adicional_diferenciacion').checked
    };
  }
  
  // Contar resultados positivos y valorar su relevancia clínica
  let testsPositivos = [];
  let testsPositivosConDiferenciacion = [];
  let hallazgosSignificativos = [];
  
  // Evaluar SLR
  if (slrRespuesta === 'sintomatica_radiante') {
    testsPositivos.push("SLR (ciática)");
    if (slrDiferenciacion) {
      testsPositivosConDiferenciacion.push("SLR");
    }
    
    // Análisis del ángulo
    if (slrAngulo > 0) {
      if (slrAngulo < 30) {
        hallazgosSignificativos.push(`SLR positivo a ${slrAngulo}° (severa limitación)`);
      } else if (slrAngulo < 45) {
        hallazgosSignificativos.push(`SLR positivo a ${slrAngulo}° (moderada limitación)`);
      }
    }
  } else if (slrRespuesta === 'sintomatica_local') {
    testsPositivos.push("SLR (síntomas locales)");
  }
  
  // Evaluar SLR cruzado
  if (slrCruzado) {
    hallazgosSignificativos.push("SLR cruzado positivo (sugiere herniación discal medial)");
  }
  
  // Evaluar Slump Test
  if (slumpRespuesta === 'sintomatica_radiante') {
    testsPositivos.push("Slump (síntomas radiantes)");
    if (slumpDiferenciacion) {
      testsPositivosConDiferenciacion.push("Slump");
    }
  } else if (slumpRespuesta === 'sintomatica_local') {
    testsPositivos.push("Slump (síntomas locales)");
  }
  
  // Evaluar Tensión Femoral
  if (pkbRespuesta === 'sintomatica_radiante') {
    testsPositivos.push("Tensión Femoral (síntomas radiantes)");
    if (pkbDiferenciacion) {
      testsPositivosConDiferenciacion.push("Tensión Femoral");
    }
    
    // Análisis del ángulo
    if (pkbAngulo > 0) {
      if (pkbAngulo < 60) {
        hallazgosSignificativos.push(`Tensión Femoral positiva a ${pkbAngulo}° (severa limitación)`);
      } else if (pkbAngulo < 90) {
        hallazgosSignificativos.push(`Tensión Femoral positiva a ${pkbAngulo}° (moderada limitación)`);
      }
    }
  } else if (pkbRespuesta === 'sintomatica_local') {
    testsPositivos.push("Tensión Femoral (síntomas locales)");
  }
  
  // Evaluar test adicional
  if (llntAdicional && llntAdicional.respuesta !== 'normal') {
    testsPositivos.push(llntAdicional.nombre);
    if (llntAdicional.respuesta === 'sintomatica_radiante' && llntAdicional.diferenciacion) {
      testsPositivosConDiferenciacion.push(llntAdicional.nombre);
    }
  }
  
  // Generar resultado
  let resultado = "";
  let color = "secondary";
  
  if (testsPositivos.length === 0) {
    resultado = "No se han identificado respuestas sintomáticas a los tests neurodinámicos de miembro inferior evaluados.";
  } else {
    // Determinar el color según hallazgos
    if (hallazgosSignificativos.length > 0 || slrCruzado) {
      color = "danger";
    } else if (testsPositivosConDiferenciacion.length > 0) {
      color = "warning";
    } else {
      color = "info";
    }
    
    resultado = `<strong>Hallazgos neurodinámicos:</strong> `;
    
    if (testsPositivos.length > 0) {
      resultado += `Se obtiene respuesta sintomática en ${testsPositivos.length} test(s): ${testsPositivos.join(", ")}.<br>`;
    }
    
    if (testsPositivosConDiferenciacion.length > 0) {
      resultado += `<strong>Tests con diferenciación estructural positiva:</strong> ${testsPositivosConDiferenciacion.join(", ")}.<br>`;
    }
    
    if (hallazgosSignificativos.length > 0) {
      resultado += `<strong>Hallazgos significativos:</strong> ${hallazgosSignificativos.join(", ")}.<br>`;
    }
    
    // Análisis específico de patrones radiculares
    resultado += "<br><strong>Interpretación:</strong> ";
    
    let patronesRadiculares = [];
    
    if ((slrRespuesta === 'sintomatica_radiante' && slrDiferenciacion) || 
        (slumpRespuesta === 'sintomatica_radiante' && slumpDiferenciacion)) {
      patronesRadiculares.push("raíces lumbares bajas (L5-S1)");
    }
    
    if (pkbRespuesta === 'sintomatica_radiante' && pkbDiferenciacion) {
      patronesRadiculares.push("raíces lumbares altas (L2-L4)");
    }
    
    if (patronesRadiculares.length > 0) {
      resultado += `Los hallazgos sugieren mecanosensibilidad neural aumentada que afecta principalmente a ${patronesRadiculares.join(" y ")}. `;
      
      if (slrCruzado) {
        resultado += "La presencia de SLR cruzado positivo sugiere una herniación discal con compromiso mecánico significativo del saco dural o raíces nerviosas. ";
      }
      
      if (hallazgosSignificativos.length > 0) {
        resultado += "La provocación de síntomas a ángulos reducidos indica una limitación significativa de la movilidad neural. ";
      }
    } else if (testsPositivos.length > 0) {
      resultado += "Aunque hay respuestas sintomáticas, la ausencia de diferenciación estructural positiva reduce la especificidad neural de estos hallazgos. ";
      
      if (testsPositivos.length > 1) {
        resultado += "La provocación de síntomas en múltiples tests sin diferenciación estructural sugiere un posible componente musculoesquelético o de sensibilización. ";
      }
    }
    
    // Sugerencias clínicas
    resultado += "<br><strong>Relevancia clínica:</strong> ";
    
    if (slrCruzado || (slrAngulo > 0 && slrAngulo < 30) || (pkbAngulo > 0 && pkbAngulo < 60)) {
      resultado += "Los hallazgos sugieren un compromiso mecánico significativo de estructuras neurales que requiere evaluación médica especializada. ";
      resultado += "Se recomienda correlacionar con estudios de imagen para descartar herniación discal con compromiso radicular. ";
    } else if (testsPositivosConDiferenciacion.length > 0) {
      resultado += "La mecanosensibilidad neural aumentada con diferenciación estructural positiva indica un componente neural relevante en la sintomatología. ";
      
      if (slrAngulo > 0 && slrAngulo >= 30 && slrAngulo < 60) {
        resultado += "La limitación moderada a la elevación de la pierna recta sugiere irritación neural que puede beneficiarse de técnicas de movilización neural progresivas. ";
      }
    } else if (testsPositivos.length > 0) {
      resultado += "La provocación de síntomas sin diferenciación estructural positiva puede reflejar tensión o irritación de estructuras no neurales (musculotendinosas, fasciales) o sensibilización. ";
    }
  }
  
  document.getElementById('slr_resultado').innerHTML = resultado;
  document.getElementById('slr_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación de tensión neural
  actualizarInterpretacionTensionNeural();
}

/**
 * Actualiza la interpretación integrada de los tests de tensión neural
 */
function actualizarInterpretacionTensionNeural() {
  // Verificar si se ha completado al menos uno de los dos grupos de tests
  const ulntResultado = document.getElementById('ulnt_resultado');
  const slrResultado = document.getElementById('slr_resultado');
  
  let evaluacionesCompletadas = 0;
  if (ulntResultado && !ulntResultado.textContent.includes('Complete') && !ulntResultado.textContent.includes('No se han identificado')) {
    evaluacionesCompletadas++;
  }
  
  if (slrResultado && !slrResultado.textContent.includes('Complete') && !slrResultado.textContent.includes('No se han identificado')) {
    evaluacionesCompletadas++;
  }
  
  // Si no se ha completado ninguna evaluación, no actualizar
  if (evaluacionesCompletadas === 0) {
    document.getElementById('tension_neural_interpretacion').innerHTML = "Complete al menos una evaluación para obtener una interpretación integrada.";
    document.getElementById('tension_neural_interpretacion').className = "alert alert-secondary";
    return;
  }
  
  // Analizar presencia de hallazgos significativos o banderas rojas
  let hallazgosSignificativos = false;
  let banderasRojas = [];
  
  if (slrResultado && slrResultado.textContent.includes('SLR cruzado positivo')) {
    banderasRojas.push("SLR cruzado positivo (indica herniación discal significativa con compromiso radicular)");
    hallazgosSignificativos = true;
  }
  
  if (slrResultado && slrResultado.textContent.includes('severa limitación')) {
    banderasRojas.push("Severa limitación en los tests neurodinámicos (sugiere compromiso neural significativo)");
    hallazgosSignificativos = true;
  }
  
  // Determinar si hay hallazgos positivos
  let hallazgosPositivos = false;
  
  if ((ulntResultado && ulntResultado.textContent.includes('diferenciación estructural positiva')) ||
      (slrResultado && slrResultado.textContent.includes('diferenciación estructural positiva'))) {
    hallazgosPositivos = true;
  }
  
  // Generar interpretación
  let interpretacion = "";
  let color = "info";
  
  // Determinar color según gravedad
  if (banderasRojas.length > 0) {
    color = "danger";
  } else if (hallazgosPositivos) {
    color = "warning";
  }
  
  interpretacion = `<strong>Interpretación de Tests de Tensión Neural (${evaluacionesCompletadas} evaluación(es) completada(s)):</strong><br><br>`;
  
  if (!hallazgosPositivos && evaluacionesCompletadas > 0) {
    interpretacion += "<strong>Tensión neural:</strong> Los tests neurodinámicos no muestran hallazgos específicos de mecanosensibilidad neural aumentada.<br><br>";
    interpretacion += "<strong>Interpretación:</strong> La ausencia de respuestas neurodinámicas positivas sugiere que la sintomatología puede tener un origen predominantemente no neural o que los tests realizados no han sido capaces de estresar suficientemente las estructuras neurales relevantes.<br><br>";
  } else {
    if (ulntResultado && !ulntResultado.textContent.includes('Complete') && !ulntResultado.textContent.includes('No se han identificado')) {
      interpretacion += "<strong>Miembro superior:</strong> " + ulntResultado.textContent.replace("<br><strong>Relevancia clínica:</strong>", "") + "<br>";
    }
    
    if (slrResultado && !slrResultado.textContent.includes('Complete') && !slrResultado.textContent.includes('No se han identificado')) {
      interpretacion += "<strong>Miembro inferior:</strong> " + slrResultado.textContent.replace("<br><strong>Relevancia clínica:</strong>", "") + "<br>";
    }
  }
  
  // Añadir sección de banderas rojas si existen
  if (banderasRojas.length > 0) {
    interpretacion += "<div class='bandera-roja'><strong>⚠️ BANDERAS ROJAS NEURODINÁMICAS:</strong><br>";
    banderasRojas.forEach(bandera => {
      interpretacion += "- " + bandera + "<br>";
    });
    interpretacion += "</div><br>";
  }
  
  // Añadir recomendaciones terapéuticas
  interpretacion += "<strong>Recomendaciones terapéuticas:</strong><br>";
  
  if (banderasRojas.length > 0) {
    interpretacion += "- Derivación a especialista para evaluación ampliada.<br>";
    interpretacion += "- Considerar estudios de imagen (resonancia magnética) para evaluar compromiso discal/radicular.<br>";
    interpretacion += "- Evitar técnicas de tensión neural hasta evaluación especializada.<br>";
  } else if (hallazgosPositivos) {
    interpretacion += "- Técnicas de deslizamiento neural como abordaje inicial (menor estrés mecánico).<br>";
    interpretacion += "- Progresión gradual a técnicas de tensión según tolerancia.<br>";
    interpretacion += "- Abordar interfaces mecánicas (túneles fibroóseos, músculos) que puedan comprometer el deslizamiento neural.<br>";
    interpretacion += "- Educar sobre posturas y actividades que reducen la tensión neural.<br>";
  } else {
    interpretacion += "- Evaluar y abordar componentes no neurales (musculares, articulares) que puedan contribuir a la sintomatología.<br>";
    interpretacion += "- Considerar ampliar la evaluación neural con tests adicionales si existe sospecha clínica de componente neural.<br>";
    interpretacion += "- Integrar hallazgos con el resto de la evaluación para determinar abordaje terapéutico óptimo.<br>";
  }
  
  document.getElementById('tension_neural_interpretacion').innerHTML = interpretacion;
  document.getElementById('tension_neural_interpretacion').className = `alert alert-${color}`;
  
  // Actualizar interpretación global neural
  actualizarInterpretacionNeural();
}

// ================== FUNCIONES DE EVALUACIÓN DE SENSIBILIZACIÓN NEURAL ==================

/**
 * Evalúa los componentes de sensibilización al dolor
 */
function evaluarSensibilizacion() {
  // Recopilar resultados de umbrales de dolor
  const umbralDolorSintomatica = document.getElementById('umbral_dolor_sintomatica').value;
  const umbralDolorControl = document.getElementById('umbral_dolor_control').value;
  const alodinia = document.getElementById('alodinia').value;
  const sumacionTemporal = document.getElementById('sumacion_temporal').value;
  
  // Contar anomalías y valorar patrón de sensibilización
  let anomalias = {
    sensibilizacion_local: 0,
    sensibilizacion_generalizada: 0,
    total: 0
  };
  
  // Evaluar umbral de dolor en zona sintomática
  if (umbralDolorSintomatica === 'disminuido') {
    anomalias.sensibilizacion_local++;
    anomalias.total++;
  } else if (umbralDolorSintomatica === 'muy_disminuido') {
    anomalias.sensibilizacion_local += 2;
    anomalias.total += 2;
  }
  
  // Evaluar umbral de dolor en zona control
  if (umbralDolorControl === 'disminuido') {
    anomalias.sensibilizacion_generalizada++;
    anomalias.total++;
  } else if (umbralDolorControl === 'muy_disminuido') {
    anomalias.sensibilizacion_generalizada += 2;
    anomalias.total += 2;
  }
  
  // Evaluar alodinia
  if (alodinia === 'presente_local') {
    anomalias.sensibilizacion_local++;
    anomalias.total++;
  } else if (alodinia === 'presente_extendida') {
    anomalias.sensibilizacion_generalizada++;
    anomalias.total++;
  }
  
  // Evaluar sumación temporal
  if (sumacionTemporal === 'presente_moderada') {
    anomalias.sensibilizacion_generalizada++;
    anomalias.total++;
  } else if (sumacionTemporal === 'presente_severa') {
    anomalias.sensibilizacion_generalizada += 2;
    anomalias.total += 2;
  }
  
  // Generar resultado
  let resultado = "";
  let color = "secondary";
  
  if (anomalias.total === 0) {
    resultado = "No se identifican signos de sensibilización neural periférica o central.";
  } else {
    // Determinar el color según la severidad
    if (anomalias.total >= 4 || anomalias.sensibilizacion_generalizada >= 3) {
      color = "danger";
    } else if (anomalias.total >= 2 || anomalias.sensibilizacion_generalizada >= 1) {
      color = "warning";
    } else {
      color = "info";
    }
    
    resultado = `<strong>Hallazgos de sensibilización al dolor:</strong><br>`;
    
    // Evaluar umbrales de dolor
    if (umbralDolorSintomatica !== 'normal') {
      resultado += `- Umbral de dolor en zona sintomática: <span class="hallazgo-${umbralDolorSintomatica === 'muy_disminuido' ? 'significativo' : 'alterado'}">${umbralDolorSintomatica === 'muy_disminuido' ? 'Muy disminuido' : 'Disminuido'}</span><br>`;
    }
    
    if (umbralDolorControl !== 'normal') {
      resultado += `- Umbral de dolor en zona control: <span class="hallazgo-${umbralDolorControl === 'muy_disminuido' ? 'significativo' : 'alterado'}">${umbralDolorControl === 'muy_disminuido' ? 'Muy disminuido' : 'Disminuido'}</span><br>`;
    }
    
    // Evaluar alodinia
    if (alodinia !== 'ausente') {
      resultado += `- Alodinia táctil: <span class="hallazgo-${alodinia === 'presente_extendida' ? 'significativo' : 'alterado'}">${alodinia === 'presente_extendida' ? 'Presente en zonas extendidas' : 'Presente localmente'}</span><br>`;
    }
    
    // Evaluar sumación temporal
    if (sumacionTemporal !== 'ausente') {
      resultado += `- Sumación temporal: <span class="hallazgo-${sumacionTemporal === 'presente_severa' ? 'significativo' : 'alterado'}">${sumacionTemporal === 'presente_severa' ? 'Presente severa' : 'Presente moderada'}</span><br>`;
    }
    
    // Interpretación del patrón de sensibilización
    resultado += "<br><strong>Interpretación:</strong> ";
    
    if (anomalias.sensibilizacion_generalizada >= 2) {
      resultado += "El patrón de hallazgos es compatible con sensibilización central. ";
      
      if (anomalias.sensibilizacion_generalizada >= 3) {
        resultado += "La magnitud de las alteraciones sugiere un componente de sensibilización central significativo que requiere un abordaje específico. ";
      }
    } else if (anomalias.sensibilizacion_local >= 2) {
      resultado += "El patrón de hallazgos es compatible con sensibilización periférica localizada. ";
      
      if (anomalias.sensibilizacion_generalizada >= 1) {
        resultado += "Hay indicios de un componente de sensibilización central incipiente. ";
      }
    } else {
      resultado += "El patrón de hallazgos sugiere una alteración leve en el procesamiento del dolor, predominantemente de tipo periférico. ";
    }
    
    // Implicaciones clínicas
    resultado += "<br><strong>Implicaciones clínicas:</strong> ";
    
    if (anomalias.sensibilizacion_generalizada >= 2) {
      resultado += "La presencia de sensibilización central puede limitar la efectividad de intervenciones periféricas aisladas y requiere un abordaje multimodal que incluya educación en neurociencia del dolor, ejercicio gradual y posiblemente farmacoterapia específica. ";
      
      if (anomalias.sensibilizacion_generalizada >= 3) {
        resultado += "Este patrón se asocia con una mayor cronificación y complejidad del cuadro doloroso. ";
      }
    } else if (anomalias.sensibilizacion_local >= 2) {
      resultado += "La sensibilización periférica suele responder bien a intervenciones locales dirigidas a reducir la nocicepción y restaurar la función normal del tejido afectado. ";
      
      if (anomalias.sensibilizacion_generalizada >= 1) {
        resultado += "Se recomienda vigilar la evolución para prevenir la progresión hacia un estado de sensibilización central. ";
      }
    } else {
      resultado += "Estas alteraciones leves suelen ser reversibles con un abordaje adecuado de los factores nociceptivos subyacentes y la restauración de patrones de movimiento normales. ";
    }
  }
  
  document.getElementById('sensibilizacion_resultado').innerHTML = resultado;
  document.getElementById('sensibilizacion_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación de sensibilización neural
  actualizarInterpretacionSensibilizacion();
}

/**
 * Evalúa los componentes de sensibilidad profunda
 */
function evaluarSensibilidadProfunda() {
  // Recopilar resultados de pruebas de sensibilidad profunda
  const sensibilidadVibratoria = document.getElementById('sensibilidad_vibratoria').value;
  const propiocepcion = document.getElementById('propiocepcion').value;
  const discriminacionDosPuntos = document.getElementById('discriminacion_dos_puntos').value;
  const estereognosia = document.getElementById('estereognosia').value;
  
  // Contar anomalías y valorar patrón de afectación
  let anomalias = {
    leves: 0,
    significativas: 0,
    total: 0
  };
  
  // Evaluar sensibilidad vibratoria
  if (sensibilidadVibratoria === 'disminuida') {
    anomalias.leves++;
    anomalias.total++;
  } else if (sensibilidadVibratoria === 'ausente') {
    anomalias.significativas++;
    anomalias.total++;
  }
  
  // Evaluar propiocepción
  if (propiocepcion === 'alterada') {
    anomalias.leves++;
    anomalias.total++;
  } else if (propiocepcion === 'muy_alterada') {
    anomalias.significativas++;
    anomalias.total++;
  }
  
  // Evaluar discriminación entre dos puntos
  if (discriminacionDosPuntos === 'disminuida') {
    anomalias.leves++;
    anomalias.total++;
  } else if (discriminacionDosPuntos === 'ausente') {
    anomalias.significativas++;
    anomalias.total++;
  }
  
  // Evaluar estereognosia
  if (estereognosia === 'alterada') {
    anomalias.leves++;
    anomalias.total++;
  } else if (estereognosia === 'ausente') {
    anomalias.significativas++;
    anomalias.total++;
  }
  
  // Generar resultado
  let resultado = "";
  let color = "secondary";
  
  if (anomalias.total === 0) {
    resultado = "Sensibilidad profunda dentro de límites normales en todas las pruebas realizadas.";
  } else {
    // Determinar el color según la severidad
    if (anomalias.significativas > 0) {
      color = "danger";
    } else if (anomalias.leves > 1) {
      color = "warning";
    } else {
      color = "info";
    }
    
    resultado = `<strong>Hallazgos de sensibilidad profunda:</strong><br>`;
    
    // Evaluar sensibilidad vibratoria
    if (sensibilidadVibratoria !== 'normal') {
      resultado += `- Sensibilidad vibratoria: <span class="hallazgo-${sensibilidadVibratoria === 'ausente' ? 'significativo' : 'alterado'}">${sensibilidadVibratoria === 'ausente' ? 'Ausente' : 'Disminuida'}</span><br>`;
    }
    
    // Evaluar propiocepción
    if (propiocepcion !== 'normal') {
      resultado += `- Propiocepción articular: <span class="hallazgo-${propiocepcion === 'muy_alterada' ? 'significativo' : 'alterado'}">${propiocepcion === 'muy_alterada' ? 'Muy alterada' : 'Alterada'}</span><br>`;
    }
    
    // Evaluar discriminación entre dos puntos
    if (discriminacionDosPuntos !== 'normal') {
      resultado += `- Discriminación entre dos puntos: <span class="hallazgo-${discriminacionDosPuntos === 'ausente' ? 'significativo' : 'alterado'}">${discriminacionDosPuntos === 'ausente' ? 'Ausente' : 'Disminuida'}</span><br>`;
    }
    
    // Evaluar estereognosia
    if (estereognosia !== 'normal') {
      resultado += `- Estereognosia: <span class="hallazgo-${estereognosia === 'ausente' ? 'significativo' : 'alterado'}">${estereognosia === 'ausente' ? 'Ausente' : 'Alterada'}</span><br>`;
    }
    
    // Interpretación del patrón de afectación
    resultado += "<br><strong>Interpretación:</strong> ";
    
    if (anomalias.significativas > 0) {
      resultado += "Los hallazgos indican alteración significativa de la sensibilidad profunda, lo que sugiere afectación de columnas posteriores de la médula espinal, nervios sensitivos de gran diámetro o corteza sensitiva. ";
      
      if (anomalias.significativas > 1) {
        resultado += "El patrón de afectación extensa es compatible con neuropatía periférica, mielopatía o lesión cerebral, dependiendo de la distribución. ";
      }
    } else if (anomalias.leves > 1) {
      resultado += "Las alteraciones detectadas en la sensibilidad profunda sugieren una afectación leve-moderada de las vías sensitivas discriminativas. ";
      
      if (anomalias.leves > 2) {
        resultado += "El patrón de alteraciones múltiples con preservación parcial indica un proceso patológico en evolución que requiere seguimiento. ";
      }
    } else {
      resultado += "La alteración aislada y leve de la sensibilidad profunda puede ser compatible con un proceso neuropático incipiente o con variaciones normales en la sensibilidad. ";
    }
    
    // Implicaciones clínicas
    resultado += "<br><strong>Implicaciones clínicas:</strong> ";
    
    if (anomalias.significativas > 0) {
      resultado += "La alteración significativa de la sensibilidad profunda implica un mayor riesgo de inestabilidad articular, alteraciones del equilibrio y coordinación, y posibles lesiones inadvertidas. ";
      
      if (propiocepcion === 'muy_alterada') {
        resultado += "La afectación severa de la propiocepción requiere intervenciones específicas para la reeducación del control motor y estrategias de compensación. ";
      }
      
      if (anomalias.significativas > 1) {
        resultado += "Se recomienda evaluación neurológica especializada para determinar la etiología y extensión del compromiso neural. ";
      }
    } else if (anomalias.leves > 1) {
      resultado += "Las alteraciones leves-moderadas pueden beneficiarse de intervenciones dirigidas a mejorar la información aferente y la integración sensorial, como el entrenamiento propioceptivo, táctil y de discriminación. ";
    } else {
      resultado += "Las alteraciones leves y aisladas suelen responder bien a la estimulación sensitiva específica y al entrenamiento funcional integrado. ";
    }
  }
  
  document.getElementById('sensibilidad_profunda_resultado').innerHTML = resultado;
  document.getElementById('sensibilidad_profunda_resultado').className = `alert alert-${color}`;
  
  // Actualizar interpretación de sensibilización neural
  actualizarInterpretacionSensibilizacion();
}

/**
 * Actualiza la interpretación integrada de la evaluación de sensibilización neural
 */
function actualizarInterpretacionSensibilizacion() {
  // Verificar si se ha completado al menos una de las dos evaluaciones
  const sensibilizacionResultado = document.getElementById('sensibilizacion_resultado');
  const sensibilidadProfundaResultado = document.getElementById('sensibilidad_profunda_resultado');
  
  let evaluacionesCompletadas = 0;
  if (sensibilizacionResultado && !sensibilizacionResultado.textContent.includes('Complete') && !sensibilizacionResultado.textContent.includes('No se identifican')) {
    evaluacionesCompletadas++;
  }
  
  if (sensibilidadProfundaResultado && !sensibilidadProfundaResultado.textContent.includes('Complete') && !sensibilidadProfundaResultado.textContent.includes('dentro de límites normales')) {
    evaluacionesCompletadas++;
  }
  
  // Si no se ha completado ninguna evaluación, no actualizar
  if (evaluacionesCompletadas === 0) {
    document.getElementById('sensibilizacion_interpretacion').innerHTML = "Complete al menos una evaluación para obtener una interpretación integrada.";
    document.getElementById('sensibilizacion_interpretacion').className = "alert alert-secondary";
    return;
  }
  
  // Analizar presencia de hallazgos significativos o banderas rojas
  let hallazgosSignificativos = false;
  let banderasRojas = [];
  
  if (sensibilizacionResultado && (sensibilizacionResultado.textContent.includes('presente_severa') || sensibilizacionResultado.textContent.includes('sensibilización central significativo'))) {
    banderasRojas.push("Sensibilización central significativa que puede comprometer la eficacia de intervenciones convencionales");
    hallazgosSignificativos = true;
  }
  
  if (sensibilidadProfundaResultado && sensibilidadProfundaResultado.textContent.includes('alteración significativa')) {
    banderasRojas.push("Alteración significativa de la sensibilidad profunda que aumenta el riesgo de lesiones y compromete el control motor");
    hallazgosSignificativos = true;
  }
  
  // Determinar si hay hallazgos positivos no graves
  let hallazgosPositivos = false;
  
  if ((sensibilizacionResultado && (sensibilizacionResultado.textContent.includes('sensibilización periférica') || sensibilizacionResultado.textContent.includes('alteración leve'))) ||
      (sensibilidadProfundaResultado && sensibilidadProfundaResultado.textContent.includes('alteraciones leves'))) {
    hallazgosPositivos = true;
  }
  
  // Generar interpretación
  let interpretacion = "";
  let color = "info";
  
  // Determinar color según gravedad
  if (banderasRojas.length > 0) {
    color = "danger";
  } else if (hallazgosPositivos) {
    color = "warning";
  }
  
  interpretacion = `<strong>Interpretación de Sensibilización Neural (${evaluacionesCompletadas} evaluación(es) completada(s)):</strong><br><br>`;
  
  if (!hallazgosPositivos && !hallazgosSignificativos && evaluacionesCompletadas > 0) {
    interpretacion += "<strong>Procesamiento somatosensorial:</strong> No se identifican alteraciones significativas en el procesamiento somatosensorial.<br><br>";
    interpretacion += "<strong>Interpretación:</strong> La ausencia de signos de sensibilización o alteraciones de la sensibilidad profunda sugiere un procesamiento neural normal, sin evidencia de mecanismos de sensibilización central o periférica relevantes para el cuadro clínico.<br><br>";
  } else {
    if (sensibilizacionResultado && !sensibilizacionResultado.textContent.includes('Complete') && !sensibilizacionResultado.textContent.includes('No se identifican')) {
      interpretacion += "<strong>Sensibilización al dolor:</strong> " + sensibilizacionResultado.textContent.replace("<br><strong>Implicaciones clínicas:</strong>", "") + "<br>";
    }
    
    if (sensibilidadProfundaResultado && !sensibilidadProfundaResultado.textContent.includes('Complete') && !sensibilidadProfundaResultado.textContent.includes('dentro de límites normales')) {
      interpretacion += "<strong>Sensibilidad profunda:</strong> " + sensibilidadProfundaResultado.textContent.replace("<br><strong>Implicaciones clínicas:</strong>", "") + "<br>";
    }
  }
  
  // Añadir sección de banderas rojas si existen
  if (banderasRojas.length > 0) {
    interpretacion += "<div class='bandera-roja'><strong>⚠️ CONSIDERACIONES ESPECIALES:</strong><br>";
    banderasRojas.forEach(bandera => {
      interpretacion += "- " + bandera + "<br>";
    });
    interpretacion += "</div><br>";
  }
  
  // Añadir recomendaciones terapéuticas
  interpretacion += "<strong>Recomendaciones terapéuticas:</strong><br>";
  
  if (sensibilizacionResultado && sensibilizacionResultado.textContent.includes('sensibilización central')) {
    interpretacion += "- Educación en neurociencia del dolor para modificar creencias y cogniciones maladaptativas.<br>";
    interpretacion += "- Abordaje gradual con exposición progresiva a actividades evitadas.<br>";
    interpretacion += "- Técnicas de desensibilización central (ejercicio cardiovascular, actividad gradual).<br>";
    
    if (sensibilizacionResultado.textContent.includes('sensibilización central significativo')) {
      interpretacion += "- Considerar abordaje multidisciplinar con apoyo psicológico y posible farmacoterapia específica.<br>";
    }
  } else if (sensibilizacionResultado && sensibilizacionResultado.textContent.includes('sensibilización periférica')) {
    interpretacion += "- Intervenciones dirigidas a reducir la nocicepción periférica y normalizar la función tisular.<br>";
    interpretacion += "- Técnicas de desensibilización gradual local.<br>";
    interpretacion += "- Educación sobre el proceso de sensibilización y su naturaleza reversible.<br>";
  }
  
  if (sensibilidadProfundaResultado && sensibilidadProfundaResultado.textContent.includes('alteración significativa')) {
    interpretacion += "- Entrenamiento propioceptivo con progresión desde condiciones facilitadas (apoyo, visión) a condiciones desafiantes.<br>";
    interpretacion += "- Estimulación táctil y vibratoria para mejorar el procesamiento sensorial.<br>";
    interpretacion += "- Adaptaciones ambientales y estrategias compensatorias para prevenir lesiones.<br>";
  } else if (sensibilidadProfundaResultado && sensibilidadProfundaResultado.textContent.includes('alteraciones leves')) {
    interpretacion += "- Entrenamiento de discriminación sensitiva y propioceptiva integrado en tareas funcionales.<br>";
    interpretacion += "- Ejercicios de precisión y control motor con feedback aumentado.<br>";
  }
  
  if (!hallazgosPositivos && !hallazgosSignificativos) {
    interpretacion += "- Mantener el enfoque en los aspectos biomecánicos y funcionales de la rehabilitación.<br>";
    interpretacion += "- Monitorizar posibles cambios en la sensibilidad y procesamiento del dolor durante el tratamiento.<br>";
  }
  
  document.getElementById('sensibilizacion_interpretacion').innerHTML = interpretacion;
  document.getElementById('sensibilizacion_interpretacion').className = `alert alert-${color}`;
  
  // Actualizar interpretación global neural
  actualizarInterpretacionNeural();
}

// ================== INTERPRETACIÓN GLOBAL NEURAL ==================

/**
 * Actualiza la interpretación global de la evaluación neural
 */
function actualizarInterpretacionNeural() {
  // Verificar si se ha completado al menos un tipo de evaluación
  const neurosensitivoInterpretacion = document.getElementById('neurosensitivo_interpretacion');
  const tensionNeuralInterpretacion = document.getElementById('tension_neural_interpretacion');
  const sensibilizacionInterpretacion = document.getElementById('sensibilizacion_interpretacion');
  
  let evaluacionesCompletadas = 0;
  if (neurosensitivoInterpretacion && !neurosensitivoInterpretacion.textContent.includes('Complete')) {
    evaluacionesCompletadas++;
  }
  
  if (tensionNeuralInterpretacion && !tensionNeuralInterpretacion.textContent.includes('Complete')) {
    evaluacionesCompletadas++;
  }
  
  if (sensibilizacionInterpretacion && !sensibilizacionInterpretacion.textContent.includes('Complete')) {
    evaluacionesCompletadas++;
  }
  
  // Si no se ha completado ninguna evaluación, no actualizar
  if (evaluacionesCompletadas === 0) {
    document.getElementById('interpretacion-neural-texto').innerHTML = "Complete la evaluación neural para obtener una interpretación clínica integral.";
    document.getElementById('recomendaciones-neural-texto').innerHTML = "Complete la evaluación para obtener recomendaciones específicas basadas en evidencia.";
    document.getElementById('banderas-rojas-neural-texto').innerHTML = "Se mostrarán aquí si se detectan.";
    return;
  }
  
  // Recopilar banderas rojas de todas las secciones
  let banderasRojas = [];
  
  if (neurosensitivoInterpretacion && neurosensitivoInterpretacion.textContent.includes('BANDERAS ROJAS')) {
    const match = neurosensitivoInterpretacion.textContent.match(/BANDERAS ROJAS NEUROLÓGICAS:(.*?)<\/div>/s);
    if (match && match[1]) {
      const items = match[1].split('<br>').filter(item => item.trim().startsWith('-'));
      items.forEach(item => {
        banderasRojas.push(item.trim().substring(2));
      });
    }
  }
  
  if (tensionNeuralInterpretacion && tensionNeuralInterpretacion.textContent.includes('BANDERAS ROJAS')) {
    const match = tensionNeuralInterpretacion.textContent.match(/BANDERAS ROJAS NEURODINÁMICAS:(.*?)<\/div>/s);
    if (match && match[1]) {
      const items = match[1].split('<br>').filter(item => item.trim().startsWith('-'));
      items.forEach(item => {
        banderasRojas.push(item.trim().substring(2));
      });
    }
  }
  
  if (sensibilizacionInterpretacion && sensibilizacionInterpretacion.textContent.includes('CONSIDERACIONES ESPECIALES')) {
    const match = sensibilizacionInterpretacion.textContent.match(/CONSIDERACIONES ESPECIALES:(.*?)<\/div>/s);
    if (match && match[1]) {
      const items = match[1].split('<br>').filter(item => item.trim().startsWith('-'));
      items.forEach(item => {
        banderasRojas.push(item.trim().substring(2));
      });
    }
  }
  
  // Identificar patrones radiculares o neurales consistentes entre evaluaciones
  let patronesIdentificados = [];
  let hallazgosCompensatorios = [];
  
  // Buscar patrones radiculares en evaluación neurosensitiva
  if (neurosensitivoInterpretacion) {
    if (neurosensitivoInterpretacion.textContent.includes('Patrón neural consistente')) {
      const match = neurosensitivoInterpretacion.textContent.match(/Afectación a nivel ([^.]+)\./);
      if (match && match[1]) {
        if (match[1].includes('multinivel')) {
          patronesIdentificados.push("Patrón de afectación neural multinivel");
        } else {
          patronesIdentificados.push("Afectación neural a nivel " + match[1]);
        }
      }
    }
  }
  
  // Buscar patrones consistentes en tests de tensión neural
  if (tensionNeuralInterpretacion) {
    if (tensionNeuralInterpretacion.textContent.includes('mecanosensibilidad neural aumentada')) {
      if (tensionNeuralInterpretacion.textContent.includes('nervio mediano')) {
        patronesIdentificados.push("Mecanosensibilidad aumentada del nervio mediano");
      }
      if (tensionNeuralInterpretacion.textContent.includes('nervio radial')) {
        patronesIdentificados.push("Mecanosensibilidad aumentada del nervio radial");
      }
      if (tensionNeuralInterpretacion.textContent.includes('nervio ulnar')) {
        patronesIdentificados.push("Mecanosensibilidad aumentada del nervio ulnar");
      }
      if (tensionNeuralInterpretacion.textContent.includes('raíces lumbares bajas')) {
        patronesIdentificados.push("Mecanosensibilidad aumentada de raíces lumbares bajas (L5-S1)");
      }
      if (tensionNeuralInterpretacion.textContent.includes('raíces lumbares altas')) {
        patronesIdentificados.push("Mecanosensibilidad aumentada de raíces lumbares altas (L2-L4)");
      }
    }
  }
  
  // Buscar patrones de sensibilización
  if (sensibilizacionInterpretacion) {
    if (sensibilizacionInterpretacion.textContent.includes('sensibilización central')) {
      patronesIdentificados.push("Patrón de sensibilización central");
      hallazgosCompensatorios.push("Procesamiento alterado del dolor a nivel central");
    } else if (sensibilizacionInterpretacion.textContent.includes('sensibilización periférica')) {
      patronesIdentificados.push("Patrón de sensibilización periférica");
    }
    
    if (sensibilizacionInterpretacion.textContent.includes('alteración significativa de la sensibilidad profunda')) {
      hallazgosCompensatorios.push("Alteración de la sensibilidad profunda que puede comprometer el control motor");
    }
  }
  
  // Generar interpretación global
  let interpretacion = "";
  let recomendaciones = "";
  let banderasRojasHTML = "";
  
  // Interpretación clínica global
  interpretacion = `<strong>Interpretación Global de la Evaluación Neural (${evaluacionesCompletadas} componente(s) evaluado(s)):</strong><br><br>`;
  
  if (patronesIdentificados.length > 0) {
    interpretacion += "<strong>Hallazgos principales:</strong><br>";
    
    patronesIdentificados.forEach(patron => {
      interpretacion += `- ${patron}<br>`;
    });
    
    interpretacion += "<br>";
  }
  
  if (hallazgosCompensatorios.length > 0) {
    interpretacion += "<strong>Hallazgos complementarios:</strong><br>";
    
    hallazgosCompensatorios.forEach(hallazgo => {
      interpretacion += `- ${hallazgo}<br>`;
    });
    
    interpretacion += "<br>";
  }
  
  // Análisis integrado
  interpretacion += "<strong>Análisis integrado:</strong><br>";
  
  if (patronesIdentificados.length === 0) {
    interpretacion += "La evaluación neural no ha identificado patrones específicos de disfunción neural, lo que sugiere que los síntomas pueden tener un origen predominantemente no neural o mixto.<br><br>";
  } else {
    // Buscar coincidencias entre patrones para identificar consistencias
    let patronesRadicularesCervicales = patronesIdentificados.filter(p => p.includes("C5") || p.includes("C6") || p.includes("C7") || p.includes("C8"));
    let patronesRadicularesLumbares = patronesIdentificados.filter(p => p.includes("L2") || p.includes("L3") || p.includes("L4") || p.includes("L5") || p.includes("S1"));
    let patronesNeuralMediano = patronesIdentificados.filter(p => p.includes("mediano"));
    let patronesNeuralRadial = patronesIdentificados.filter(p => p.includes("radial"));
    let patronesNeuralUlnar = patronesIdentificados.filter(p => p.includes("ulnar"));
    let patronesSensibilizacion = patronesIdentificados.filter(p => p.includes("sensibilización"));
    
    if (patronesRadicularesCervicales.length > 0) {
      interpretacion += `Los hallazgos en la región cervical son consistentes con ${patronesRadicularesCervicales.join(" con ")}. `;
      
      if (patronesNeuralMediano.length > 0 || patronesNeuralRadial.length > 0 || patronesNeuralUlnar.length > 0) {
        interpretacion += "Este patrón radicular se correlaciona con la mecanosensibilidad aumentada observada en los troncos nerviosos periféricos correspondientes. ";
      }
      
      interpretacion += "<br>";
    }
    
    if (patronesRadicularesLumbares.length > 0) {
      interpretacion += `Los hallazgos en la región lumbar son consistentes con ${patronesRadicularesLumbares.join(" con ")}. `;
      
      if (patronesIdentificados.some(p => p.includes("raíces lumbares"))) {
        interpretacion += "Este patrón radicular se correlaciona con la mecanosensibilidad aumentada observada en los tests neurodinámicos de miembro inferior. ";
      }
      
      interpretacion += "<br>";
    }
    
    if (patronesSensibilizacion.length > 0) {
      interpretacion += `${patronesSensibilizacion.join(" con ")} que puede amplificar y mantener la sintomatología neural. `;
      
      if (hallazgosCompensatorios.some(h => h.includes("sensibilidad profunda"))) {
        interpretacion += "La alteración de la sensibilidad profunda puede contribuir a compensaciones en el control motor que perpetúan el ciclo de dolor y disfunción. ";
      }
      
      interpretacion += "<br>";
    }
  }
  
  // Recomendaciones terapéuticas
  recomendaciones = "<strong>Recomendaciones Terapéuticas:</strong><br>";
  
  if (banderasRojas.length > 0) {
    recomendaciones += "• <strong>Evaluación médica especializada:</strong><br>";
    recomendaciones += "  - Derivación a especialista (neurología, neurocirugía) para evaluación complementaria.<br>";
    recomendaciones += "  - Considerar estudios de imagen (resonancia magnética) y/o electrodiagnósticos según hallazgos específicos.<br>";
    recomendaciones += "  - Evitar técnicas que puedan empeorar compromiso neural hasta evaluación especializada.<br><br>";
  } else if (patronesIdentificados.filter(p => !p.includes("sensibilización")).length > 0) {
    recomendaciones += "• <strong>Tratamiento neurodinámico:</strong><br>";
    
    if (patronesIdentificados.some(p => p.includes("mediano") || p.includes("radial") || p.includes("ulnar") || p.includes("C5") || p.includes("C6") || p.includes("C7") || p.includes("C8"))) {
      recomendaciones += "  - Técnicas de deslizamiento neural para miembro superior, progresando a técnicas de tensión según tolerancia.<br>";
      recomendaciones += "  - Movilización de interfaces neurales (túnel carpiano, canal cubital, escalenos, pectoral menor) según nervio afectado.<br>";
    }
    
    if (patronesIdentificados.some(p => p.includes("lumbares") || p.includes("L2") || p.includes("L3") || p.includes("L4") || p.includes("L5") || p.includes("S1"))) {
      recomendaciones += "  - Técnicas de deslizamiento neural para miembro inferior, progresando a técnicas de tensión según tolerancia.<br>";
      recomendaciones += "  - Abordaje de interfaces neurales lumbares (canal vertebral, piriforme, canal tarsiano) según raíz afectada.<br>";
    }
    
    recomendaciones += "  - Educación del paciente sobre posturas y actividades que reducen la tensión neural.<br><br>";
  }
  
  if (patronesIdentificados.some(p => p.includes("sensibilización central"))) {
    recomendaciones += "• <strong>Manejo de la sensibilización central:</strong><br>";
    recomendaciones += "  - Educación en neurociencia del dolor para modificar creencias y expectativas.<br>";
    recomendaciones += "  - Exposición gradual a actividades evitadas, con progresión basada en funcionalidad, no en dolor.<br>";
    recomendaciones += "  - Ejercicio aeróbico de intensidad moderada para activar mecanismos inhibitorios descendentes.<br>";
    recomendaciones += "  - Considerar abordaje multidisciplinar con apoyo psicológico si está disponible.<br><br>";
  } else if (patronesIdentificados.some(p => p.includes("sensibilización periférica"))) {
    recomendaciones += "• <strong>Manejo de la sensibilización periférica:</strong><br>";
    recomendaciones += "  - Técnicas para reducir la nocicepción periférica (corrección de factores mecánicos, control de inflamación).<br>";
    recomendaciones += "  - Desensibilización gradual de zonas hipersensibles.<br>";
    recomendaciones += "  - Educación sobre el proceso de sensibilización y su naturaleza reversible.<br><br>";
  }
  
  if (hallazgosCompensatorios.some(h => h.includes("sensibilidad profunda"))) {
    recomendaciones += "• <strong>Reeducación sensoriomotora:</strong><br>";
    recomendaciones += "  - Estimulación de mecanorreceptores (tacto, vibración, propiocepción) en zonas con déficit.<br>";
    recomendaciones += "  - Entrenamiento propioceptivo y de discriminación táctil con progresión en dificultad.<br>";
    recomendaciones += "  - Integración de información sensorial en tareas funcionales y específicas.<br><br>";
  }
  
  if (evaluacionesCompletadas > 0 && patronesIdentificados.length === 0) {
    recomendaciones += "• <strong>Abordaje global:</strong><br>";
    recomendaciones += "  - Enfoque en los aspectos musculoesqueléticos y funcionales de la rehabilitación.<br>";
    recomendaciones += "  - Monitorización de la evolución de la sintomatología para detectar posibles componentes neurales emergentes.<br>";
    recomendaciones += "  - Educación sobre mecanismos de dolor y estrategias de autogestión.<br><br>";
  }
  
  recomendaciones += "• <strong>Evaluación y seguimiento:</strong><br>";
  recomendaciones += "  - Reevaluación periódica de los componentes neurales para monitorizar progresión.<br>";
  recomendaciones += "  - Ajuste de intervenciones según respuesta a tratamiento inicial.<br>";
  
  // Generar HTML para banderas rojas
  if (banderasRojas.length > 0) {
    banderasRojasHTML = "<div class='bandera-roja'><strong>⚠️ BANDERAS ROJAS NEUROLÓGICAS:</strong><br>";
    banderasRojas.forEach(bandera => {
      banderasRojasHTML += "- " + bandera + "<br>";
    });
    banderasRojasHTML += "</div>";
  } else {
    banderasRojasHTML = "No se han detectado banderas rojas neurológicas que requieran derivación urgente.";
  }
  
  // Actualizar secciones
  document.getElementById('interpretacion-neural-texto').innerHTML = interpretacion;
  document.getElementById('recomendaciones-neural-texto').innerHTML = recomendaciones;
  document.getElementById('banderas-rojas-neural-texto').innerHTML = banderasRojasHTML;
  
  // Actualizar estado del acordeón
  verificarEstadoCuestionariosNeural();
}

/**
 * Verifica el estado general del cuestionario neural y actualiza el badge
 */
function verificarEstadoCuestionariosNeural() {
  const testsRealizados = [];
  
  // Verificar los principales componentes
  if (document.getElementById('neurosensitivo_interpretacion') && !document.getElementById('neurosensitivo_interpretacion').textContent.includes('Complete')) {
    testsRealizados.push("neurosensitivo");
  }
  
  if (document.getElementById('tension_neural_interpretacion') && !document.getElementById('tension_neural_interpretacion').textContent.includes('Complete')) {
    testsRealizados.push("tension_neural");
  }
  
  if (document.getElementById('sensibilizacion_interpretacion') && !document.getElementById('sensibilizacion_interpretacion').textContent.includes('Complete')) {
    testsRealizados.push("sensibilizacion");
  }
  
  // Actualizar el badge según la cantidad de tests realizados
  const badge = document.getElementById('evaluacion-neural-badge');
  
  if (testsRealizados.length === 0) {
    badge.textContent = "No completado";
    badge.className = "resultado-badge no-completado";
  } else if (testsRealizados.length <= 1) {
    badge.textContent = "Parcial";
    badge.className = "resultado-badge parcial";
  } else {
    badge.textContent = "Completado";
    badge.className = "resultado-badge completado";
  }
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Verificar estado del cuestionario
  verificarEstadoCuestionariosNeural();
});
    
