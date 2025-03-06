// Funcionalidad para los cuestionarios clínicos

// Función para alternar la visibilidad de los cuestionarios
function toggleCuestionario(contentId) {
  const content = document.getElementById(contentId);
  const header = content.previousElementSibling;
  
  if (content.style.display === "none" || !content.style.display) {
    content.style.display = "block";
    header.classList.add("active");
  } else {
    content.style.display = "none";
    header.classList.remove("active");
  }
}

// Función para calcular escala PSFS
function calcularPSFS() {
  const puntuacion1 = document.getElementById('psfs_puntuacion1').value;
  const puntuacion2 = document.getElementById('psfs_puntuacion2').value;
  const puntuacion3 = document.getElementById('psfs_puntuacion3').value;
  
  let valores = [];
  
  if (puntuacion1 !== "") valores.push(parseFloat(puntuacion1));
  if (puntuacion2 !== "") valores.push(parseFloat(puntuacion2));
  if (puntuacion3 !== "") valores.push(parseFloat(puntuacion3));
  
  // Actualizar badge
  const badge = document.getElementById('psfs-badge');
  if (valores.length > 0) {
    badge.textContent = "Completado";
    badge.classList.add("badge-verde");
  } else {
    badge.textContent = "No completado";
    badge.classList.remove("badge-verde");
  }
  
  // Calcular promedio si hay valores
  if (valores.length > 0) {
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const promedioRedondeado = promedio.toFixed(1);
    
    const resultado = document.getElementById('psfs-resultado');
    const valorEl = document.getElementById('psfs-valor');
    const interpretacionEl = document.getElementById('psfs-interpretacion');
    
    valorEl.textContent = promedioRedondeado;
    
    // Interpretación según el valor
    if (promedio < 3) {
      interpretacionEl.textContent = "Limitación severa de la función";
      interpretacionEl.className = "resultado-interpretacion rojo";
    } else if (promedio < 6) {
      interpretacionEl.textContent = "Limitación moderada de la función";
      interpretacionEl.className = "resultado-interpretacion amarillo";
    } else if (promedio < 8) {
      interpretacionEl.textContent = "Limitación leve de la función";
      interpretacionEl.className = "resultado-interpretacion verde-claro";
    } else {
      interpretacionEl.textContent = "Función normal o casi normal";
      interpretacionEl.className = "resultado-interpretacion verde";
    }
  }
}

// Función para calcular GROC
function calcularGROC() {
  const checkedRadio = document.querySelector('input[name="groc"]:checked');
  
  if (checkedRadio) {
    const valorGROC = parseInt(checkedRadio.value);
    
    // Actualizar badge
    const badge = document.getElementById('groc-badge');
    badge.textContent = "Completado";
    badge.classList.add("badge-verde");
    
    const valorEl = document.getElementById('groc-valor');
    const interpretacionEl = document.getElementById('groc-interpretacion');
    
    valorEl.textContent = valorGROC;
    
    // Interpretación según el valor
    if (valorGROC <= -5) {
      interpretacionEl.textContent = "Cambio negativo importante (mucho peor)";
      interpretacionEl.className = "resultado-interpretacion rojo";
    } else if (valorGROC < 0) {
      interpretacionEl.textContent = "Cambio negativo (peor)";
      interpretacionEl.className = "resultado-interpretacion amarillo";
    } else if (valorGROC === 0) {
      interpretacionEl.textContent = "Sin cambios";
      interpretacionEl.className = "resultado-interpretacion";
    } else if (valorGROC <= 3) {
      interpretacionEl.textContent = "Cambio positivo mínimo (un poco mejor)";
      interpretacionEl.className = "resultado-interpretacion verde-claro";
    } else if (valorGROC <= 5) {
      interpretacionEl.textContent = "Cambio positivo moderado (mejor)";
      interpretacionEl.className = "resultado-interpretacion verde";
    } else {
      interpretacionEl.textContent = "Cambio positivo importante (mucho mejor)";
      interpretacionEl.className = "resultado-interpretacion verde";
    }
  }
}

// Función para calcular SANE
function calcularSANE() {
  const puntuacion = document.getElementById('sane_puntuacion').value;
  
  // Actualizar el valor mostrado junto al slider
  document.getElementById('sane_puntuacion_value').textContent = puntuacion;
  
  // Actualizar badge
  const badge = document.getElementById('sane-badge');
  badge.textContent = "Completado";
  badge.classList.add("badge-verde");
  
  const valorEl = document.getElementById('sane-valor');
  const interpretacionEl = document.getElementById('sane-interpretacion');
  
  valorEl.textContent = puntuacion + "%";
  
  // Interpretación según el valor
  if (puntuacion < 30) {
    interpretacionEl.textContent = "Función muy reducida";
    interpretacionEl.className = "resultado-interpretacion rojo";
  } else if (puntuacion < 50) {
    interpretacionEl.textContent = "Función deficiente";
    interpretacionEl.className = "resultado-interpretacion amarillo";
  } else if (puntuacion < 70) {
    interpretacionEl.textContent = "Función moderada";
    interpretacionEl.className = "resultado-interpretacion amarillo";
  } else if (puntuacion < 90) {
    interpretacionEl.textContent = "Buena función";
    interpretacionEl.className = "resultado-interpretacion verde-claro";
  } else {
    interpretacionEl.textContent = "Función normal o casi normal";
    interpretacionEl.className = "resultado-interpretacion verde";
  }
}

// Función para calcular resultados del Inventario Breve de Dolor (BPI)
function calcularBPI() {
  // Recoger valores de intensidad del dolor
  const dolorActual = parseInt(document.getElementById('bpi_dolor_actual').value) || 0;
  const dolorPromedio = parseInt(document.getElementById('bpi_dolor_promedio').value) || 0;
  const dolorPeor = parseInt(document.getElementById('bpi_dolor_peor').value) || 0;
  const dolorMenor = parseInt(document.getElementById('bpi_dolor_menor').value) || 0;
  
  // Calcular promedio de intensidad del dolor
  const intensidadTotal = (dolorActual + dolorPromedio + dolorPeor + dolorMenor) / 4;
  const intensidadRedondeada = Math.round(intensidadTotal * 10) / 10; // Redondear a 1 decimal
  
  // Recoger valores de interferencia
  const interferencia_actividad = parseInt(document.getElementById('bpi_interferencia_actividad').value) || 0;
  const interferencia_animo = parseInt(document.getElementById('bpi_interferencia_animo').value) || 0;
  const interferencia_caminar = parseInt(document.getElementById('bpi_interferencia_caminar').value) || 0;
  const interferencia_trabajo = parseInt(document.getElementById('bpi_interferencia_trabajo').value) || 0;
  const interferencia_relaciones = parseInt(document.getElementById('bpi_interferencia_relaciones').value) || 0;
  const interferencia_sueno = parseInt(document.getElementById('bpi_interferencia_sueno').value) || 0;
  const interferencia_vida = parseInt(document.getElementById('bpi_interferencia_vida').value) || 0;
  
  // Calcular promedio de interferencia
  const totalInterferencias = interferencia_actividad + interferencia_animo + interferencia_caminar + 
                            interferencia_trabajo + interferencia_relaciones + interferencia_sueno + 
                            interferencia_vida;
  const numInterferencias = 7; // Total de items de interferencia
  const interferenciaProm = totalInterferencias / numInterferencias;
  const interferenciaRedondeada = Math.round(interferenciaProm * 10) / 10; // Redondear a 1 decimal
  
  // Mostrar resultados
  document.getElementById('bpi-intensidad-valor').textContent = intensidadRedondeada.toFixed(1) + '/10';
  document.getElementById('bpi-interferencia-valor').textContent = interferenciaRedondeada.toFixed(1) + '/10';
  
  // Interpretación de la intensidad del dolor
  let intensidadInterpretacion = '';
  let intensidadColor = '';
  let nivelGravedad = '';
  
  if (intensidadRedondeada < 1) {
    intensidadInterpretacion = 'Sin dolor';
    intensidadColor = 'verde';
  } else if (intensidadRedondeada < 4) {
    intensidadInterpretacion = 'Dolor leve';
    intensidadColor = 'verde-claro';
  } else if (intensidadRedondeada < 7) {
    intensidadInterpretacion = 'Dolor moderado';
    intensidadColor = 'amarillo';
  } else {
    intensidadInterpretacion = 'Dolor severo';
    intensidadColor = 'rojo';
  }
  
  // Interpretación de la interferencia
  let interferenciaInterpretacion = '';
  let interferenciaColor = '';
  
  if (interferenciaRedondeada < 1) {
    interferenciaInterpretacion = 'Sin interferencia';
    interferenciaColor = 'verde';
  } else if (interferenciaRedondeada < 4) {
    interferenciaInterpretacion = 'Interferencia leve';
    interferenciaColor = 'verde-claro';
  } else if (interferenciaRedondeada < 7) {
    interferenciaInterpretacion = 'Interferencia moderada';
    interferenciaColor = 'amarillo';
  } else {
    interferenciaInterpretacion = 'Interferencia severa';
    interferenciaColor = 'rojo';
  }
  
  // Aplicar interpretación y colores
  const intensidadInterpretacionEl = document.getElementById('bpi-intensidad-interpretacion');
  intensidadInterpretacionEl.textContent = intensidadInterpretacion;
  intensidadInterpretacionEl.className = 'resultado-interpretacion ' + intensidadColor;
  
  const interferenciaInterpretacionEl = document.getElementById('bpi-interferencia-interpretacion');
  interferenciaInterpretacionEl.textContent = interferenciaInterpretacion;
  interferenciaInterpretacionEl.className = 'resultado-interpretacion ' + interferenciaColor;
  
  // Actualizar el badge y el color del contenedor
  const bpiBadge = document.getElementById('bpi-badge');
  const resultadoContainer = document.getElementById('bpi-resultado');
  
  // Verificar si se han completado suficientes campos para una interpretación válida
  const intensidadCompletada = dolorActual || dolorPromedio || dolorPeor || dolorMenor;
  const interferenciaCompletada = interferencia_actividad || interferencia_animo || interferencia_caminar || 
                                interferencia_trabajo || interferencia_relaciones || interferencia_sueno || 
                                interferencia_vida;
  
  // Determinar nivel y estilos según gravedad
  if (intensidadCompletada && interferenciaCompletada) {
    if (intensidadRedondeada >= 7 || interferenciaRedondeada >= 7) {
      nivelGravedad = 'severo';
      bpiBadge.textContent = 'Severo';
      bpiBadge.className = 'resultado-badge badge-rojo';
      resultadoContainer.className = 'resultado-container nivel-severo';
    } else if (intensidadRedondeada >= 4 || interferenciaRedondeada >= 4) {
      nivelGravedad = 'moderado';
      bpiBadge.textContent = 'Moderado';
      bpiBadge.className = 'resultado-badge badge-amarillo';
      resultadoContainer.className = 'resultado-container nivel-moderado';
    } else {
      nivelGravedad = 'leve';
      bpiBadge.textContent = 'Leve';
      bpiBadge.className = 'resultado-badge badge-verde';
      resultadoContainer.className = 'resultado-container nivel-leve';
    }
    
    // Actualizar interpretación clínica
    const interpretacionClinicaEl = document.getElementById('bpi-interpretacion-clinica');
    if (interpretacionClinicaEl) {
      interpretacionClinicaEl.innerHTML = `
        <p>El paciente presenta un dolor de intensidad <strong>${intensidadInterpretacion.toLowerCase()}</strong> 
        (${intensidadRedondeada.toFixed(1)}/10) con una interferencia <strong>${interferenciaInterpretacion.toLowerCase()}</strong> 
        (${interferenciaRedondeada.toFixed(1)}/10) en sus actividades diarias.</p>
        <p>Este patrón sugiere un impacto <strong>${nivelGravedad}</strong> del dolor en la calidad de vida 
        del paciente, afectando principalmente ${getAreasAfectadas([
          { area: 'actividad general', valor: interferencia_actividad },
          { area: 'estado de ánimo', valor: interferencia_animo },
          { area: 'capacidad para caminar', valor: interferencia_caminar },
          { area: 'trabajo habitual', valor: interferencia_trabajo },
          { area: 'relaciones sociales', valor: interferencia_relaciones },
          { area: 'sueño', valor: interferencia_sueno },
          { area: 'disfrute de la vida', valor: interferencia_vida }
        ])}.</p>
      `;
    }
    
    // Actualizar recomendaciones terapéuticas
    const recomendacionesEl = document.getElementById('bpi-recomendaciones');
    if (recomendacionesEl) {
      if (nivelGravedad === 'severo') {
        recomendacionesEl.innerHTML = `
          <p>Considerar un enfoque multidisciplinar que incluya:</p>
          <ul>
            <li>Evaluación por especialista en dolor para posible ajuste farmacológico</li>
            <li>Combinar terapia manual con modalidades analgésicas</li>
            <li>Educación en neurociencia del dolor y estrategias de afrontamiento</li>
            <li>Programa de ejercicios graduados con progresión cuidadosa</li>
            <li>Valorar impacto psicológico y posible derivación a psicología</li>
            <li>Seguimiento frecuente para ajustar intervenciones según respuesta</li>
          </ul>
        `;
      } else if (nivelGravedad === 'moderado') {
        recomendacionesEl.innerHTML = `
          <p>Se recomienda:</p>
          <ul>
            <li>Combinar terapia manual y ejercicio terapéutico</li>
            <li>Educación sobre manejo del dolor y pacing de actividades</li>
            <li>Implementar estrategias de autorregulación (respiración, relajación)</li>
            <li>Programa de ejercicios para mejorar la funcionalidad</li>
            <li>Revisar impacto en actividades diarias y plantear modificaciones</li>
            <li>Seguimiento para evaluar evolución</li>
          </ul>
        `;
      } else {
        recomendacionesEl.innerHTML = `
          <p>Se sugiere:</p>
          <ul>
            <li>Terapia manual enfocada en zonas específicas de dolor</li>
            <li>Programa de ejercicios para mantener y mejorar funcionalidad</li>
            <li>Educación sobre factores moduladores del dolor</li>
            <li>Estrategias de autocuidado y manejo de síntomas</li>
            <li>Fomentar retorno gradual a actividades normales</li>
          </ul>
        `;
      }
    }
  } else {
    bpiBadge.textContent = 'No completado';
    bpiBadge.className = 'resultado-badge';
    resultadoContainer.className = 'resultado-container';
    
    // Mensajes para datos incompletos
    if (document.getElementById('bpi-interpretacion-clinica')) {
      document.getElementById('bpi-interpretacion-clinica').textContent = 
        "Complete ambas secciones del cuestionario para obtener una interpretación clínica detallada.";
    }
    
    if (document.getElementById('bpi-recomendaciones')) {
      document.getElementById('bpi-recomendaciones').textContent = 
        "Complete el cuestionario para recibir recomendaciones terapéuticas personalizadas.";
    }
  }
}

// Función auxiliar para identificar las áreas más afectadas
function getAreasAfectadas(areas) {
  // Filtrar áreas con valor ≥ 5 (afectación moderada-alta)
  const areasAfectadas = areas.filter(area => area.valor >= 5)
                              .sort((a, b) => b.valor - a.valor) // Ordenar por valor descendente
                              .map(area => area.area);
  
  if (areasAfectadas.length === 0) {
    return "ningún área en particular";
  } else if (areasAfectadas.length === 1) {
    return `principalmente ${areasAfectadas[0]}`;
  } else if (areasAfectadas.length === 2) {
    return `principalmente ${areasAfectadas[0]} y ${areasAfectadas[1]}`;
  } else {
    const ultimaArea = areasAfectadas.pop();
    return `principalmente ${areasAfectadas.join(', ')} y ${ultimaArea}`;
  }
}

// Función para calcular resultados del Cuestionario de Dolor Neuropático (DN4)
function calcularDN4() {
  // Preguntas de la parte 1 (entrevista al paciente)
  const quemazon = obtenerValorRadio('dn4_quemazon');
  const frio = obtenerValorRadio('dn4_frio');
  const descargas = obtenerValorRadio('dn4_descargas');
  const hormigueo = obtenerValorRadio('dn4_hormigueo');
  const alfileres = obtenerValorRadio('dn4_alfileres');
  const entumecimiento = obtenerValorRadio('dn4_entumecimiento');
  const picazon = obtenerValorRadio('dn4_picazon');
  
  // Preguntas de la parte 2 (examen del paciente)
  const hipoestesia = obtenerValorRadio('dn4_hipoestesia');
  const hipoestesiaPinchazo = obtenerValorRadio('dn4_hipoestesia_pinchazo');
  const cepillado = obtenerValorRadio('dn4_cepillado');
  
  // Calcular puntuación total (de 0 a 10)
  let puntuacionTotal = 0;
  
  // Solo sumamos si el valor es 0 o 1 (no -1, que significa no contestado)
  if (quemazon !== -1) puntuacionTotal += quemazon;
  if (frio !== -1) puntuacionTotal += frio;
  if (descargas !== -1) puntuacionTotal += descargas;
  if (hormigueo !== -1) puntuacionTotal += hormigueo;
  if (alfileres !== -1) puntuacionTotal += alfileres;
  if (entumecimiento !== -1) puntuacionTotal += entumecimiento;
  if (picazon !== -1) puntuacionTotal += picazon;
  if (hipoestesia !== -1) puntuacionTotal += hipoestesia;
  if (hipoestesiaPinchazo !== -1) puntuacionTotal += hipoestesiaPinchazo;
  if (cepillado !== -1) puntuacionTotal += cepillado;
  
  // Verificar si el cuestionario está completo
  const itemsCompletados = [quemazon, frio, descargas, hormigueo, alfileres, 
                          entumecimiento, picazon, hipoestesia, hipoestesiaPinchazo, cepillado]
                          .filter(val => val !== -1).length;
  
  const estaCompleto = itemsCompletados === 10; // Son 10 ítems en total
  
  // Mostrar puntuación
  document.getElementById('dn4-valor').textContent = puntuacionTotal + '/10';
  
  // Interpretación y color según puntuación
  let interpretacion = '';
  let color = '';
  let esNeuropatico = puntuacionTotal >= 4;
  
  // Actualizar el badge y el contenedor
  const dn4Badge = document.getElementById('dn4-badge');
  const resultadoContainer = document.getElementById('dn4-resultado');
  
  if (!estaCompleto) {
    interpretacion = 'Complete todos los campos para obtener un resultado preciso';
    dn4Badge.textContent = 'No completado';
    dn4Badge.className = 'resultado-badge';
    resultadoContainer.className = 'resultado-container';
  } else if (esNeuropatico) {
    interpretacion = 'Sugiere dolor neuropático (≥4 puntos)';
    color = 'rojo';
    dn4Badge.textContent = 'Positivo';
    dn4Badge.className = 'resultado-badge badge-rojo';
    resultadoContainer.className = 'resultado-container nivel-alerta';
  } else {
    interpretacion = 'No sugiere dolor neuropático (<4 puntos)';
    color = 'verde';
    dn4Badge.textContent = 'Negativo';
    dn4Badge.className = 'resultado-badge badge-verde';
    resultadoContainer.className = 'resultado-container nivel-leve';
  }
  
  // Aplicar interpretación y color
  const interpretacionEl = document.getElementById('dn4-interpretacion');
  interpretacionEl.textContent = interpretacion;
  if (color) {
    interpretacionEl.className = 'resultado-interpretacion ' + color;
  } else {
    interpretacionEl.className = 'resultado-interpretacion';
  }
  
  // Actualizar interpretación clínica y recomendaciones
  const interpretacionClinicaEl = document.getElementById('dn4-interpretacion-clinica');
  const recomendacionesEl = document.getElementById('dn4-recomendaciones');
  
  if (estaCompleto && interpretacionClinicaEl && recomendacionesEl) {
    // Obtener síntomas positivos
    const sintomasPositivos = [];
    if (quemazon === 1) sintomasPositivos.push("sensación de quemazón");
    if (frio === 1) sintomasPositivos.push("sensación de frío doloroso");
    if (descargas === 1) sintomasPositivos.push("descargas eléctricas");
    if (hormigueo === 1) sintomasPositivos.push("hormigueo");
    if (alfileres === 1) sintomasPositivos.push("sensación de alfileres y agujas");
    if (entumecimiento === 1) sintomasPositivos.push("entumecimiento");
    if (picazon === 1) sintomasPositivos.push("picazón");
    if (hipoestesia === 1) sintomasPositivos.push("hipoestesia al tacto");
    if (hipoestesiaPinchazo === 1) sintomasPositivos.push("hipoestesia al pinchazo");
    if (cepillado === 1) sintomasPositivos.push("dolor al cepillado");
    
    // Formato adecuado para el texto de síntomas
    let textoSintomas = "";
    if (sintomasPositivos.length === 0) {
      textoSintomas = "no presenta síntomas característicos de dolor neuropático";
    } else if (sintomasPositivos.length === 1) {
      textoSintomas = `presenta ${sintomasPositivos[0]}`;
    } else if (sintomasPositivos.length === 2) {
      textoSintomas = `presenta ${sintomasPositivos[0]} y ${sintomasPositivos[1]}`;
    } else {
      const ultimoSintoma = sintomasPositivos.pop();
      textoSintomas = `presenta ${sintomasPositivos.join(', ')} y ${ultimoSintoma}`;
    }
    
    // Actualizar interpretación clínica
    if (esNeuropatico) {
      interpretacionClinicaEl.innerHTML = `
        <p>Con una puntuación de <strong>${puntuacionTotal}/10</strong>, el DN4 <strong>sugiere la presencia de un componente neuropático</strong> 
        en el dolor del paciente.</p>
        <p>El paciente ${textoSintomas}, que son características frecuentes del dolor neuropático.</p>
        <p>Este resultado indica que el dolor probablemente tenga un componente de sensibilización central o periférica, 
        lo que puede influir en la elección del tratamiento y en el pronóstico.</p>
      `;
    } else {
      interpretacionClinicaEl.innerHTML = `
        <p>Con una puntuación de <strong>${puntuacionTotal}/10</strong>, el DN4 <strong>no sugiere la presencia de un componente neuropático</strong> 
        en el dolor del paciente.</p>
        <p>El paciente ${textoSintomas}.</p>
        <p>Este resultado indica que el dolor probablemente sea predominantemente nociceptivo o de otro origen no neuropático.</p>
      `;
    }
    
    // Actualizar recomendaciones terapéuticas
    if (esNeuropatico) {
      recomendacionesEl.innerHTML = `
        <p>Para el manejo del dolor con componente neuropático, se recomienda:</p>
        <ul>
          <li>Considerar el uso de fármacos específicos para dolor neuropático (gabapentinoides, antidepresivos tricíclicos, IRSN) en coordinación con el médico tratante</li>
          <li>Técnicas de neuromodulación: TENS, estimulación eléctrica</li>
          <li>Educación en neurociencia del dolor enfocada en sensibilización central/periférica</li>
          <li>Terapia manual suave, no provocadora de dolor</li>
          <li>Ejercicio terapéutico graduado con énfasis en la exposición gradual</li>
          <li>Técnicas de desensibilización para áreas hipersensibles</li>
          <li>Valorar posible derivación a unidad especializada en dolor</li>
        </ul>
      `;
    } else {
      recomendacionesEl.innerHTML = `
        <p>Para el manejo del dolor predominantemente nociceptivo, se recomienda:</p>
        <ul>
          <li>Terapia manual dirigida a estructuras específicas</li>
          <li>Ejercicio terapéutico para mejorar fuerza, flexibilidad y función</li>
          <li>Educación sobre manejo del dolor y autocuidado</li>
          <li>Modalidades físicas según corresponda (termoterapia, crioterapia)</li>
          <li>Técnicas de control motor y reeducación postural</li>
          <li>Valorar factores biomecánicos y ergonómicos</li>
        </ul>
      `;
    }
  } else if (interpretacionClinicaEl && recomendacionesEl) {
    // Mensajes para cuestionario incompleto
    interpretacionClinicaEl.textContent = "Complete todas las preguntas del cuestionario para obtener una interpretación clínica detallada.";
    recomendacionesEl.textContent = "Complete el cuestionario para recibir recomendaciones terapéuticas personalizadas.";
  }
}
