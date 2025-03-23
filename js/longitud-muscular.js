// Funciones para la Evaluación de Longitud/Extensibilidad Muscular

// Mostrar/Ocultar el contenido del cuestionario (función ya existente en tu sistema)
function toggleCuestionario(contentId) {
  const content = document.getElementById(contentId);
  if (content) {
    if (content.style.display === "none") {
      content.style.display = "block";
      // Cambiar icono de más a menos
      content.previousElementSibling.querySelector('i').classList.remove('fa-plus-circle');
      content.previousElementSibling.querySelector('i').classList.add('fa-minus-circle');
    } else {
      content.style.display = "none";
      // Cambiar icono de menos a más
      content.previousElementSibling.querySelector('i').classList.remove('fa-minus-circle');
      content.previousElementSibling.querySelector('i').classList.add('fa-plus-circle');
    }
  }
}

// Filtrar pruebas por región anatómica
function filtrarPruebasPorRegion() {
  const regionSeleccionada = document.getElementById('filtro_region').value;
  const regionCards = document.querySelectorAll('.region-card');
  
  if (regionSeleccionada === 'todas') {
    regionCards.forEach(card => {
      card.style.display = 'block';
    });
  } else {
    regionCards.forEach(card => {
      if (card.getAttribute('data-region') === regionSeleccionada) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// Función principal para actualizar todos los resultados de longitud muscular
function actualizarResultadosLongitud() {
  // Actualizar resultados individuales de cada test
  actualizarTestThomas();
  actualizarTestOber();
  actualizarTestPopliteo();
  actualizarTest9090();
  actualizarTestSilfverskiold();
  actualizarTestLunge();
  
  // Actualizar tabla de resumen
  actualizarTablaResumen();
  
  // Actualizar interpretación clínica y recomendaciones
  actualizarInterpretacionClinica();
  
  // Actualizar el badge de estado general
  actualizarBadgeEstado();
}

// Actualizar badge de estado general
function actualizarBadgeEstado() {
  const badge = document.getElementById('longitud-muscular-badge');
  const resultados = obtenerResultadosTests();
  
  // Contar las restricciones por niveles
  let restricciones = {
    leve: 0,
    moderada: 0,
    severa: 0
  };
  
  resultados.forEach(test => {
    if (test.estadoIzq === 'Restricción leve') restricciones.leve++;
    if (test.estadoDer === 'Restricción leve') restricciones.leve++;
    if (test.estadoIzq === 'Restricción moderada') restricciones.moderada++;
    if (test.estadoDer === 'Restricción moderada') restricciones.moderada++;
    if (test.estadoIzq === 'Restricción severa') restricciones.severa++;
    if (test.estadoDer === 'Restricción severa') restricciones.severa++;
  });
  
  if (restricciones.severa > 0) {
    badge.textContent = 'Restricciones importantes';
    badge.className = 'resultado-badge badge bg-danger';
  } else if (restricciones.moderada > 0) {
    badge.textContent = 'Restricciones moderadas';
    badge.className = 'resultado-badge badge bg-warning text-dark';
  } else if (restricciones.leve > 0) {
    badge.textContent = 'Restricciones leves';
    badge.className = 'resultado-badge badge bg-info';
  } else {
    badge.textContent = 'Rangos funcionales';
    badge.className = 'resultado-badge badge bg-success';
  }
}

// Función para actualizar la tabla de resumen
function actualizarTablaResumen() {
  const tabla = document.getElementById('tabla-resumen-longitud');
  const resultados = obtenerResultadosTests();
  
  // Limpiar tabla
  tabla.innerHTML = '';
  
  // Si no hay resultados, mostrar mensaje
  if (resultados.length === 0) {
    tabla.innerHTML = '<tr><td colspan="4" class="text-center">Complete la evaluación para ver el resumen</td></tr>';
    return;
  }
  
  // Agregar filas por cada test
  resultados.forEach(test => {
    const fila = document.createElement('tr');
    
    // Determinar clase CSS según nivel de restricción
    if (test.estadoIzq === 'Restricción severa' || test.estadoDer === 'Restricción severa') {
      fila.className = 'restriccion-severa';
    } else if (test.estadoIzq === 'Restricción moderada' || test.estadoDer === 'Restricción moderada') {
      fila.className = 'restriccion-moderada';
    } else if (test.estadoIzq === 'Restricción leve' || test.estadoDer === 'Restricción leve') {
      fila.className = 'restriccion-leve';
    }
    
    // Crear celdas
    fila.innerHTML = `
      <td>${test.nombre}</td>
      <td class="text-center">${test.resultadoIzq}</td>
      <td class="text-center">${test.resultadoDer}</td>
      <td>
        ${getBadgeHTML(test.estadoIzq)} / ${getBadgeHTML(test.estadoDer)}
      </td>
    `;
    
    tabla.appendChild(fila);
  });
}

// Obtener HTML para badge de estado
function getBadgeHTML(estado) {
  let badgeClass = 'bg-success';
  
  if (estado === 'Restricción leve') {
    badgeClass = 'bg-warning text-dark';
  } else if (estado === 'Restricción moderada') {
    badgeClass = 'bg-orange';
  } else if (estado === 'Restricción severa') {
    badgeClass = 'bg-danger';
  }
  
  return `<span class="badge ${badgeClass}" style="font-size: 0.7rem;">${estado}</span>`;
}

// Función para obtener todos los resultados de los tests
function obtenerResultadosTests() {
  const resultados = [];
  
  // Test de Thomas
  resultados.push({
    nombre: 'Test de Thomas',
    resultadoIzq: `${document.getElementById('thomas_psoas_izq').value}°/${document.getElementById('thomas_recto_izq').value}°`,
    resultadoDer: `${document.getElementById('thomas_psoas_der').value}°/${document.getElementById('thomas_recto_der').value}°`,
    estadoIzq: document.getElementById('thomas-result-izq').querySelector('.badge').textContent,
    estadoDer: document.getElementById('thomas-result-der').querySelector('.badge').textContent
  });
  
  // Test de Ober
  resultados.push({
    nombre: 'Test de Ober',
    resultadoIzq: `${document.getElementById('ober_izq').value}°`,
    resultadoDer: `${document.getElementById('ober_der').value}°`,
    estadoIzq: document.getElementById('ober-result-izq').querySelector('.badge').textContent,
    estadoDer: document.getElementById('ober-result-der').querySelector('.badge').textContent
  });
  
  // Test del ángulo poplíteo
  resultados.push({
    nombre: 'Test del ángulo poplíteo',
    resultadoIzq: `${document.getElementById('popliteo_izq').value}°`,
    resultadoDer: `${document.getElementById('popliteo_der').value}°`,
    estadoIzq: document.getElementById('popliteo-result-izq').querySelector('.badge').textContent,
    estadoDer: document.getElementById('popliteo-result-der').querySelector('.badge').textContent
  });
  
  // Test 90-90
  resultados.push({
    nombre: 'Test 90-90',
    resultadoIzq: `${document.getElementById('test9090_izq').value}°`,
    resultadoDer: `${document.getElementById('test9090_der').value}°`,
    estadoIzq: document.getElementById('test9090-result-izq').querySelector('.badge').textContent,
    estadoDer: document.getElementById('test9090-result-der').querySelector('.badge').textContent
  });
  
  // Test de Silfverskiöld
  resultados.push({
    nombre: 'Test de Silfverskiöld',
    resultadoIzq: `${document.getElementById('silfverskiold_ext_izq').value}°/${document.getElementById('silfverskiold_flex_izq').value}°`,
    resultadoDer: `${document.getElementById('silfverskiold_ext_der').value}°/${document.getElementById('silfverskiold_flex_der').value}°`,
    estadoIzq: document.getElementById('silfverskiold-result-izq').querySelector('.badge').textContent,
    estadoDer: document.getElementById('silfverskiold-result-der').querySelector('.badge').textContent
  });
  
  // Test de Lunge
  resultados.push({
    nombre: 'Test de Lunge',
    resultadoIzq: `${document.getElementById('lunge_izq').value} cm`,
    resultadoDer: `${document.getElementById('lunge_der').value} cm`,
    estadoIzq: document.getElementById('lunge-result-izq').querySelector('.badge').textContent,
    estadoDer: document.getElementById('lunge-result-der').querySelector('.badge').textContent
  });
  
  return resultados;
}

// Actualizar interpretación clínica y recomendaciones
function actualizarInterpretacionClinica() {
  const resultados = obtenerResultadosTests();
  const resumenElement = document.getElementById('resumen_longitud');
  const interpretacionElement = document.getElementById('interpretacion-longitud-texto');
  const implicacionesElement = document.getElementById('implicaciones-texto');
  const recomendacionesElement = document.getElementById('recomendaciones-longitud-texto');
  const consideracionesElement = document.getElementById('consideraciones-adicionales-texto');
  
  // Contar restricciones por niveles y áreas
  let restriccionesPorNivel = {
    leve: 0,
    moderada: 0,
    severa: 0
  };
  
  let restriccionesPorArea = {
    miembroInferior: 0,
    miembroSuperior: 0,
    columnaTronco: 0
  };
  
  // Identificar patrones específicos
  let patronesIdentificados = {
    caderaAnterior: false,
    caderaLateral: false,
    caderaPosterior: false,
    rodilla: false,
    tobillo: false
  };
  
  // Analizar resultados
  resultados.forEach(test => {
    // Contar restricciones por nivel
    if (test.estadoIzq === 'Restricción leve' || test.estadoDer === 'Restricción leve') {
      restriccionesPorNivel.leve++;
    }
    if (test.estadoIzq === 'Restricción moderada' || test.estadoDer === 'Restricción moderada') {
      restriccionesPorNivel.moderada++;
    }
    if (test.estadoIzq === 'Restricción severa' || test.estadoDer === 'Restricción severa') {
      restriccionesPorNivel.severa++;
    }
    
    // Identificar patrones específicos
    if (test.nombre === 'Test de Thomas') {
      if (test.estadoIzq !== 'Normal' || test.estadoDer !== 'Normal') {
        patronesIdentificados.caderaAnterior = true;
        restriccionesPorArea.miembroInferior++;
      }
    }
    if (test.nombre === 'Test de Ober') {
      if (test.estadoIzq !== 'Normal' || test.estadoDer !== 'Normal') {
        patronesIdentificados.caderaLateral = true;
        restriccionesPorArea.miembroInferior++;
      }
    }
    if (test.nombre === 'Test del ángulo poplíteo' || test.nombre === 'Test 90-90') {
      if (test.estadoIzq !== 'Normal' || test.estadoDer !== 'Normal') {
        patronesIdentificados.caderaPosterior = true;
        patronesIdentificados.rodilla = true;
        restriccionesPorArea.miembroInferior++;
      }
    }
    if (test.nombre === 'Test de Silfverskiöld' || test.nombre === 'Test de Lunge') {
      if (test.estadoIzq !== 'Normal' || test.estadoDer !== 'Normal') {
        patronesIdentificados.tobillo = true;
        restriccionesPorArea.miembroInferior++;
      }
    }
  });
  
  // Establecer resumen general
  if (restriccionesPorNivel.severa > 0) {
    resumenElement.className = 'alert alert-danger';
    resumenElement.innerHTML = `<strong><i class="fas fa-exclamation-triangle"></i> Restricciones importantes:</strong> Se han detectado ${restriccionesPorNivel.severa} restricciones severas que requieren intervención prioritaria.`;
  } else if (restriccionesPorNivel.moderada > 0) {
    resumenElement.className = 'alert alert-warning';
    resumenElement.innerHTML = `<strong><i class="fas fa-exclamation-circle"></i> Restricciones moderadas:</strong> Se han detectado ${restriccionesPorNivel.moderada} restricciones moderadas que requieren atención.`;
  } else if (restriccionesPorNivel.leve > 0) {
    resumenElement.className = 'alert alert-info';
    resumenElement.innerHTML = `<strong><i class="fas fa-info-circle"></i> Restricciones leves:</strong> Se han detectado ${restriccionesPorNivel.leve} restricciones leves que pueden ser abordadas.`;
  } else {
    resumenElement.className = 'alert alert-success';
    resumenElement.innerHTML = `<strong><i class="fas fa-check-circle"></i> Rangos funcionales:</strong> No se detectaron restricciones significativas en la extensibilidad muscular.`;
  }
  
  // Generar interpretación clínica
  let interpretacionText = '';
  
  if (restriccionesPorNivel.severa + restriccionesPorNivel.moderada + restriccionesPorNivel.leve === 0) {
    interpretacionText = 'La evaluación de la longitud/extensibilidad muscular muestra rangos funcionales adecuados en todos los grupos musculares evaluados. No se detectan restricciones significativas que pudieran limitar el movimiento funcional o aumentar el riesgo de lesiones.';
  } else {
    interpretacionText = 'La evaluación de la longitud/extensibilidad muscular muestra ';
    
    if (restriccionesPorNivel.severa > 0) {
      interpretacionText += `restricciones severas (${restriccionesPorNivel.severa}) `;
    }
    if (restriccionesPorNivel.moderada > 0) {
      if (restriccionesPorNivel.severa > 0) interpretacionText += 'y ';
      interpretacionText += `restricciones moderadas (${restriccionesPorNivel.moderada}) `;
    }
    if (restriccionesPorNivel.leve > 0 && (restriccionesPorNivel.severa > 0 || restriccionesPorNivel.moderada > 0)) {
      interpretacionText += `así como restricciones leves (${restriccionesPorNivel.leve}) `;
    } else if (restriccionesPorNivel.leve > 0) {
      interpretacionText += `restricciones leves (${restriccionesPorNivel.leve}) `;
    }
    
    interpretacionText += 'en la extensibilidad muscular. ';
    
    // Detalles por áreas afectadas
    if (patronesIdentificados.caderaAnterior || patronesIdentificados.caderaLateral || patronesIdentificados.caderaPosterior) {
      interpretacionText += 'Se evidencian alteraciones en la extensibilidad muscular a nivel de la cadera';
      
      if (patronesIdentificados.caderaAnterior) {
        interpretacionText += ' en la cadena anterior (psoas, recto femoral)';
      }
      if (patronesIdentificados.caderaLateral) {
        if (patronesIdentificados.caderaAnterior) interpretacionText += ',';
        interpretacionText += ' en la cadena lateral (TFL, banda iliotibial)';
      }
      if (patronesIdentificados.caderaPosterior) {
        if (patronesIdentificados.caderaAnterior || patronesIdentificados.caderaLateral) interpretacionText += ',';
        interpretacionText += ' en la cadena posterior (isquiotibiales)';
      }
      interpretacionText += '. ';
    }
    
    if (patronesIdentificados.rodilla) {
      interpretacionText += 'Se detectan restricciones que afectan la biomecánica de la rodilla. ';
    }
    
    if (patronesIdentificados.tobillo) {
      interpretacionText += 'Existen limitaciones en la movilidad funcional del tobillo que pueden afectar la marcha y actividades funcionales. ';
    }
  }
  
  interpretacionElement.textContent = interpretacionText;
  
  // Generar implicaciones biomecánicas
  let implicacionesText = '';
  
  if (restriccionesPorNivel.severa + restriccionesPorNivel.moderada + restriccionesPorNivel.leve === 0) {
    implicacionesText = 'Los rangos funcionales adecuados permiten una biomecánica eficiente en las actividades funcionales cotidianas y deportivas, reduciendo el riesgo de compensaciones y lesiones asociadas.';
  } else {
    implicacionesText = 'Las restricciones identificadas pueden generar las siguientes implicaciones biomecánicas:\n\n';
    
    if (patronesIdentificados.caderaAnterior) {
      implicacionesText += '• La restricción en la cadena anterior de cadera puede generar anteversión pélvica, hiperlordosis lumbar y sobrecarga en la región lumbar.\n';
    }
    
    if (patronesIdentificados.caderaLateral) {
      implicacionesText += '• La restricción en la cadena lateral puede alterar la biomecánica durante la fase de apoyo en la marcha, afectar la estabilidad lateral de rodilla y generar compensaciones en el plano frontal.\n';
    }
    
    if (patronesIdentificados.caderaPosterior) {
      implicacionesText += '• La restricción en la cadena posterior puede limitar la flexión de cadera, provocar retroversión pélvica en actividades funcionales y alterar la transmisión de fuerzas durante la marcha y carrera.\n';
    }
    
    if (patronesIdentificados.tobillo) {
      implicacionesText += '• La limitación en la dorsiflexión de tobillo puede comprometer la mecánica de absorción de impactos, limitar la sentadilla profunda y generar compensaciones proximales durante la marcha y actividades deportivas.\n';
    }
  }
  
  implicacionesElement.textContent = implicacionesText;
  
  // Generar recomendaciones para el plan de tratamiento
  let recomendacionesText = '';
  
  if (restriccionesPorNivel.severa + restriccionesPorNivel.moderada + restriccionesPorNivel.leve === 0) {
    recomendacionesText = 'Se recomienda mantener un programa de mantenimiento de la movilidad general y enfocarse en los objetivos funcionales del paciente. No se requieren intervenciones específicas para mejorar la extensibilidad muscular.';
  } else {
    recomendacionesText = 'Basado en la evidencia científica, se recomienda:\n\n';
    
    if (patronesIdentificados.caderaAnterior) {
      recomendacionesText += '• Para la cadena anterior: Implementar técnicas de liberación miofascial específicas para psoas y recto femoral, seguidas de elongación activa mantenida (30-60 segundos, 3-5 repeticiones) y ejercicios de fortalecimiento en rangos completos que involucren extensión de cadera controlada.\n';
    }
    
    if (patronesIdentificados.caderaLateral) {
      recomendacionesText += '• Para la cadena lateral: Técnicas de liberación miofascial para TFL y banda iliotibial (foam roller con evidencia de efectividad), junto con ejercicios de fortalecimiento del glúteo medio en descarga y posteriormente en carga.\n';
    }
    
    if (patronesIdentificados.caderaPosterior) {
      recomendacionesText += '• Para la cadena posterior: Técnicas de elongación neurodinamia con deslizamientos neurales (sliders), elongación excéntrica de isquiotibiales y ejercicios de control motor en rangos limitados progresando a rangos completos.\n';
    }
    
    if (patronesIdentificados.tobillo) {
      recomendacionesText += '• Para la restricción de tobillo: Movilización con movimiento (MWM) según Mulligan, ejercicios de dorsiflexión en carga con banda de resistencia y estrategias de movilización activa seguidas de entrenamiento funcional específico que requiera dorsiflexión controlada.\n';
    }
    
    recomendacionesText += '\nSe recomienda priorizar intervenciones en las restricciones severas, utilizando un enfoque combinado de terapia manual, ejercicio terapéutico y educación del paciente para estrategias de automanejo.';
  }
  
  recomendacionesElement.textContent = recomendacionesText;
  
  // Generar consideraciones adicionales
  let consideracionesText = '';
  
  if (restriccionesPorNivel.severa + restriccionesPorNivel.moderada + restriccionesPorNivel.leve === 0) {
    consideracionesText = 'No se requieren evaluaciones complementarias específicas para la extensibilidad muscular. Se sugiere enfocar la evaluación en otros aspectos funcionales relevantes para los objetivos del paciente.';
  } else {
    consideracionesText = 'Para complementar esta evaluación, se sugiere:\n\n';
    
    if (patronesIdentificados.caderaAnterior || patronesIdentificados.caderaLateral || patronesIdentificados.caderaPosterior) {
      consideracionesText += '• Realizar una evaluación detallada del control motor lumbopélvico y la capacidad de disociación lumbopélvica.\n';
    }
    
    if (patronesIdentificados.rodilla) {
      consideracionesText += '• Evaluar el control neuromuscular de rodilla durante tareas funcionales como sentadilla, escalón o aterrizaje de salto, según corresponda al perfil del paciente.\n';
    }
    
    if (patronesIdentificados.tobillo) {
      consideracionesText += '• Complementar con evaluación de la marcha y/o carrera para identificar compensaciones específicas relacionadas con la limitación de la dorsiflexión.\n';
    }
    
    consideracionesText += '• Correlacionar estos hallazgos con la evaluación postural y análisis de movimiento funcional para determinar el impacto real en las actividades relevantes para el paciente.\n';
    
    consideracionesText += '• Considerar factores contribuyentes como postura mantenida, calzado habitual, y demandas ocupacionales/deportivas específicas.';
  }
  
  consideracionesElement.textContent = consideracionesText;
}

// Actualización de resultados del Test de Thomas
function actualizarTestThomas() {
  // Obtener valores
  const psoasIzq = parseFloat(document.getElementById('thomas_psoas_izq').value);
  const psoasDer = parseFloat(document.getElementById('thomas_psoas_der').value);
  const rectoIzq = parseFloat(document.getElementById('thomas_recto_izq').value);
  const rectoDer = parseFloat(document.getElementById('thomas_recto_der').value);
  
  // Evaluar psoas (elevación sobre plano)
  let estadoPsoasIzq, estadoPsoasDer;
  if (psoasIzq > 10) {
    estadoPsoasIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (psoasIzq > 5) {
    estadoPsoasIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (psoasIzq > 0) {
    estadoPsoasIzq = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoPsoasIzq = { texto: 'Normal', clase: 'bg-success' };
  }
  
  if (psoasDer > 10) {
    estadoPsoasDer = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (psoasDer > 5) {
    estadoPsoasDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (psoasDer > 0) {
    estadoPsoasDer = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoPsoasDer = { texto: 'Normal', clase: 'bg-success' };
  }
  
  // Evaluar recto femoral (flexión rodilla)
  let estadoRectoIzq, estadoRectoDer;
  if (rectoIzq < 70) {
    estadoRectoIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (rectoIzq < 80) {
    estadoRectoIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (rectoIzq < 90) {
    estadoRectoIzq = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoRectoIzq = { texto: 'Normal', clase: 'bg-success' };
  }
  
  if (rectoDer < 70) {
    estadoRectoDer = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (rectoDer < 80) {
    estadoRectoDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (rectoDer < 90) {
    estadoRectoDer = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoRectoDer = { texto: 'Normal', clase: 'bg-success' };
  }
  
  // Determinar estado combinado (peor de los dos)
  const estadoIzq = estadoPsoasIzq.texto !== 'Normal' ? estadoPsoasIzq : estadoRectoIzq;
  const estadoDer = estadoPsoasDer.texto !== 'Normal' ? estadoPsoasDer : estadoRectoDer;
  
  // Actualizar badges
  document.getElementById('thomas-result-izq').innerHTML = `<span class="badge ${estadoIzq.clase}">${estadoIzq.texto}</span>`;
  document.getElementById('thomas-result-der').innerHTML = `<span class="badge ${estadoDer.clase}">${estadoDer.texto}</span>`;
}

// Actualización de resultados del Test de Ober
function actualizarTestOber() {
  // Obtener valores
  const oberIzq = parseFloat(document.getElementById('ober_izq').value);
  const oberDer = parseFloat(document.getElementById('ober_der').value);
  const criterio = document.getElementById('ober_criterio').value;
  
  // Establecer umbrales según criterio
  let umbral;
  switch (criterio) {
    case 'liberal':
      umbral = -5;
      break;
    case 'deportivo':
      umbral = -15;
      break;
    default: // conservador
      umbral = -10;
  }
  
  // Evaluar restricción
  let estadoIzq, estadoDer;
  
  if (oberIzq > -3) {
    estadoIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (oberIzq > umbral * 0.5) {
    estadoIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (oberIzq > umbral) {
    estadoIzq = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoIzq = { texto: 'Normal', clase: 'bg-success' };
  }
  
  if (oberDer > -3) {
    estadoDer = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (oberDer > umbral * 0.5) {
    estadoDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (oberDer > umbral) {
    estadoDer = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoDer = { texto: 'Normal', clase: 'bg-success' };
  }
  
  // Actualizar badges
  document.getElementById('ober-result-izq').innerHTML = `<span class="badge ${estadoIzq.clase}">${estadoIzq.texto}</span>`;
  document.getElementById('ober-result-der').innerHTML = `<span class="badge ${estadoDer.clase}">${estadoDer.texto}</span>`;
}

// Actualización de resultados del Test del ángulo poplíteo
function actualizarTestPopliteo() {
  // Obtener valores
  const popliteoIzq = parseFloat(document.getElementById('popliteo_izq').value);
  const popliteoDer = parseFloat(document.getElementById('popliteo_der').value);
  const criterio = document.getElementById('popliteo_criterio').value;
  
  // Establecer umbrales según criterio
  let umbral;
  switch (criterio) {
    case 'deportivo':
      umbral = 15;
      break;
    case 'alto_rendimiento':
      umbral = 10;
      break;
    default: // general
      umbral = 20;
  }
  
  // Evaluar restricción
  let estadoIzq, estadoDer;
  
  if (popliteoIzq > umbral * 2) {
    estadoIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (popliteoIzq > umbral * 1.5) {
    estadoIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (popliteoIzq > umbral) {
    estadoIzq = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoIzq = { texto: 'Normal', clase: 'bg-success' };
  }
  
  if (popliteoDer > umbral * 2) {
    estadoDer = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (popliteoDer > umbral * 1.5) {
    estadoDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (popliteoDer > umbral) {
    estadoDer = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoDer = { texto: 'Normal', clase: 'bg-success' };
  }
  
  // Actualizar badges
  document.getElementById('popliteo-result-izq').innerHTML = `<span class="badge ${estadoIzq.clase}">${estadoIzq.texto}</span>`;
  document.getElementById('popliteo-result-der').innerHTML = `<span class="badge ${estadoDer.clase}">${estadoDer.texto}</span>`;
}

// Actualización de resultados del Test 90-90
function actualizarTest9090() {
  // Obtener valores
  const test9090Izq = parseFloat(document.getElementById('test9090_izq').value);
  const test9090Der = parseFloat(document.getElementById('test9090_der').value);
  const criterio = document.getElementById('test9090_criterio').value;
  
  // Establecer umbrales según criterio
  let umbral;
  switch (criterio) {
    case 'deportivo':
      umbral = -15;
      break;
    case 'alto_rendimiento':
      umbral = -10;
      break;
    default: // general
      umbral = -20;
  }
  
  // Evaluar restricción
  let estadoIzq, estadoDer;
  
  if (test9090Izq < umbral * 2) {
    estadoIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (test9090Izq < umbral * 1.5) {
    estadoIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (test9090Izq < umbral) {
    estadoIzq = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoIzq = { texto: 'Normal', clase: 'bg-success' };
  }
  
  if (test9090Der < umbral * 2) {
    estadoDer = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (test9090Der < umbral * 1.5) {
    estadoDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (test9090Der < umbral) {
    estadoDer = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoDer = { texto: 'Normal', clase: 'bg-success' };
  }
  
  // Actualizar badges
  document.getElementById('test9090-result-izq').innerHTML = `<span class="badge ${estadoIzq.clase}">${estadoIzq.texto}</span>`;
  document.getElementById('test9090-result-der').innerHTML = `<span class="badge ${estadoDer.clase}">${estadoDer.texto}</span>`;
}

// Actualización de resultados del Test de Silfverskiöld
function actualizarTestSilfverskiold() {
  // Obtener valores
  const extIzq = parseFloat(document.getElementById('silfverskiold_ext_izq').value);
  const extDer = parseFloat(document.getElementById('silfverskiold_ext_der').value);
  const flexIzq = parseFloat(document.getElementById('silfverskiold_flex_izq').value);
  const flexDer = parseFloat(document.getElementById('silfverskiold_flex_der').value);
  
  // Evaluar restricción
  let estadoIzq, estadoDer;
  
  // Evaluar gastrocnemios (rodilla extendida)
  if (extIzq < 0) {
    estadoIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (extIzq < 5) {
    estadoIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (extIzq < 10) {
    estadoIzq = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    // Evaluar sóleo (rodilla flexionada)
    if (flexIzq < 10) {
      estadoIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
    } else if (flexIzq < 15) {
      estadoIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
    } else if (flexIzq < 20) {
      estadoIzq = { texto: 'Restricción leve', clase: 'bg-info' };
    } else {
      estadoIzq = { texto: 'Normal', clase: 'bg-success' };
    }
  }
  
  if (extDer < 0) {
    estadoDer = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (extDer < 5) {
    estadoDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (extDer < 10) {
    estadoDer = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    // Evaluar sóleo (rodilla flexionada)
    if (flexDer < 10) {
      estadoDer = { texto: 'Restricción severa', clase: 'bg-danger' };
    } else if (flexDer < 15) {
      estadoDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
    } else if (flexDer < 20) {
      estadoDer = { texto: 'Restricción leve', clase: 'bg-info' };
    } else {
      estadoDer = { texto: 'Normal', clase: 'bg-success' };
    }
  }
  
  // Actualizar badges
  document.getElementById('silfverskiold-result-izq').innerHTML = `<span class="badge ${estadoIzq.clase}">${estadoIzq.texto}</span>`;
  document.getElementById('silfverskiold-result-der').innerHTML = `<span class="badge ${estadoDer.clase}">${estadoDer.texto}</span>`;
}

// Actualización de resultados del Test de Lunge
function actualizarTestLunge() {
  // Obtener valores
  const lungeIzq = parseFloat(document.getElementById('lunge_izq').value);
  const lungeDer = parseFloat(document.getElementById('lunge_der').value);
  const criterio = document.getElementById('lunge_criterio').value;
  
  // Establecer umbrales según criterio
  let umbral;
  switch (criterio) {
    case 'deportivo':
      umbral = 10;
      break;
    case 'alto_rendimiento':
      umbral = 12;
      break;
    default: // general
      umbral = 8;
  }
  
  // Evaluar restricción
  let estadoIzq, estadoDer;
  
  if (lungeIzq < umbral * 0.6) {
    estadoIzq = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (lungeIzq < umbral * 0.8) {
    estadoIzq = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (lungeIzq < umbral) {
    estadoIzq = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoIzq = { texto: 'Normal', clase: 'bg-success' };
  }
  
  if (lungeDer < umbral * 0.6) {
    estadoDer = { texto: 'Restricción severa', clase: 'bg-danger' };
  } else if (lungeDer < umbral * 0.8) {
    estadoDer = { texto: 'Restricción moderada', clase: 'bg-warning text-dark' };
  } else if (lungeDer < umbral) {
    estadoDer = { texto: 'Restricción leve', clase: 'bg-info' };
  } else {
    estadoDer = { texto: 'Normal', clase: 'bg-success' };
  }
  
  // Actualizar badges
  document.getElementById('lunge-result-izq').innerHTML = `<span class="badge ${estadoIzq.clase}">${estadoIzq.texto}</span>`;
  document.getElementById('lunge-result-der').innerHTML = `<span class="badge ${estadoDer.clase}">${estadoDer.texto}</span>`;
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Activar tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Inicializar resultados
  actualizarResultadosLongitud();
});
