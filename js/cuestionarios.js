// Funcionalidad para los cuestionarios clínicos

// Función para alternar la visibilidad de los cuestionarios
function toggleCuestionario(contentId) {
  const content = document.getElementById(contentId);
  if (!content) {
    console.error('Elemento no encontrado:', contentId);
    return;
  }
  
  const header = content.previousElementSibling;
  
  if (content.style.display === "none" || !content.style.display) {
    content.style.display = "block";
    if (header) header.classList.add("active");
  } else {
    content.style.display = "none";
    if (header) header.classList.remove("active");
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
    // Marcar como completado
    bpiBadge.textContent = 'Completado';
    bpiBadge.className = 'resultado-badge badge-verde completado';
    
    // Determinar nivel de gravedad para los resultados
    if (intensidadRedondeada >= 7 || interferenciaRedondeada >= 7) {
      nivelGravedad = 'severo';
      resultadoContainer.className = 'resultado-container nivel-severo';
      // Se elimina la creación del badge de nivel
    } else if (intensidadRedondeada >= 4 || interferenciaRedondeada >= 4) {
      nivelGravedad = 'moderado';
      resultadoContainer.className = 'resultado-container nivel-moderado';
      // Se elimina la creación del badge de nivel
    } else {
      nivelGravedad = 'leve';
      resultadoContainer.className = 'resultado-container nivel-leve';
      // Se elimina la creación del badge de nivel
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
    bpiBadge.className = 'resultado-badge no-completado';
    resultadoContainer.className = 'resultado-container';
    
    // Eliminar el nivel si existe
    const nivelElement = document.getElementById('bpi-nivel');
    if (nivelElement) {
      nivelElement.remove();
    }
    
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

// Función para calcular el puntaje del DN4
function calcularDN4() {
  // Obtener todos los valores de las respuestas
  const quemazon = document.querySelector('input[name="dn4_quemazon"]:checked')?.value || "0";
  const frio = document.querySelector('input[name="dn4_frio"]:checked')?.value || "0";
  const descargas = document.querySelector('input[name="dn4_descargas"]:checked')?.value || "0";
  const hormigueo = document.querySelector('input[name="dn4_hormigueo"]:checked')?.value || "0";
  const alfileres = document.querySelector('input[name="dn4_alfileres"]:checked')?.value || "0";
  const entumecimiento = document.querySelector('input[name="dn4_entumecimiento"]:checked')?.value || "0";
  const picazon = document.querySelector('input[name="dn4_picazon"]:checked')?.value || "0";
  const hipoestesia = document.querySelector('input[name="dn4_hipoestesia"]:checked')?.value || "0";
  const hipoestesiaPinchazo = document.querySelector('input[name="dn4_hipoestesia_pinchazo"]:checked')?.value || "0";
  const cepillado = document.querySelector('input[name="dn4_cepillado"]:checked')?.value || "0";
  
  // Calcular puntaje total (suma de todos los valores)
  const puntaje = 
    parseInt(quemazon) + 
    parseInt(frio) + 
    parseInt(descargas) + 
    parseInt(hormigueo) + 
    parseInt(alfileres) + 
    parseInt(entumecimiento) + 
    parseInt(picazon) + 
    parseInt(hipoestesia) + 
    parseInt(hipoestesiaPinchazo) + 
    parseInt(cepillado);
  
  // Actualizar el valor y la interpretación
  const valorElement = document.getElementById('dn4-valor');
  const interpretacionElement = document.getElementById('dn4-interpretacion');
  const interpretacionClinicaElement = document.getElementById('dn4-interpretacion-clinica');
  const recomendacionesElement = document.getElementById('dn4-recomendaciones');
  const badgeElement = document.getElementById('dn4-badge');
  
  // Establecer el valor
  valorElement.textContent = puntaje + "/10";
  
  // Determinar si hay suficientes preguntas respondidas para considerar el test completo
  const camposRespondidos = [
    quemazon !== "0" || document.querySelector('input[name="dn4_quemazon"]:checked'),
    frio !== "0" || document.querySelector('input[name="dn4_frio"]:checked'),
    descargas !== "0" || document.querySelector('input[name="dn4_descargas"]:checked'),
    hormigueo !== "0" || document.querySelector('input[name="dn4_hormigueo"]:checked'),
    alfileres !== "0" || document.querySelector('input[name="dn4_alfileres"]:checked'),
    entumecimiento !== "0" || document.querySelector('input[name="dn4_entumecimiento"]:checked'),
    picazon !== "0" || document.querySelector('input[name="dn4_picazon"]:checked'),
    hipoestesia !== "0" || document.querySelector('input[name="dn4_hipoestesia"]:checked'),
    hipoestesiaPinchazo !== "0" || document.querySelector('input[name="dn4_hipoestesia_pinchazo"]:checked'),
    cepillado !== "0" || document.querySelector('input[name="dn4_cepillado"]:checked')
  ].filter(Boolean).length;
  
  const testCompleto = camposRespondidos >= 10;
  
  if (testCompleto) {
    badgeElement.textContent = "Completado";
    badgeElement.classList.remove('no-completado');
    badgeElement.classList.add('badge-verde', 'completado');
    
    // Añadir un elemento separado para mostrar la puntuación
    if (valorElement) {
      valorElement.textContent = puntaje + "/10";
      valorElement.style.color = puntaje >= 4 ? "#dc3545" : "#28a745";
      valorElement.style.fontWeight = "bold";
    }
    
    // Interpretación según el puntaje
    if (puntaje >= 4) {
      interpretacionElement.textContent = "Probable dolor neuropático";
      interpretacionElement.className = "resultado-interpretacion rojo";
      
      interpretacionClinicaElement.innerHTML = `
        <p>Con un puntaje de ${puntaje}/10, el paciente presenta características altamente sugestivas de dolor neuropático. El DN4 tiene una sensibilidad del 83% y una especificidad del 90% cuando el puntaje es ≥ 4/10.</p>
        <p>Las características presentes sugieren alteraciones en el procesamiento somatosensorial que pueden deberse a una lesión o enfermedad del sistema nervioso somatosensorial.</p>
      `;
      
      recomendacionesElement.innerHTML = `
        <ul>
          <li>Implementar electroestimulación nerviosa transcutánea (TENS) con frecuencia alta (>80 Hz) para dolor neuropático (nivel de evidencia 1B)</li>
          <li>Aplicar educación en neurociencia del dolor para mejorar la comprensión de los mecanismos del dolor neuropático (nivel de evidencia 1A)</li>
          <li>Utilizar técnicas de desensibilización gradual progresiva en zonas hipersensibles (nivel de evidencia 1B)</li>
          <li>Incorporar ejercicio terapéutico de baja a moderada intensidad para mejorar la función y reducir el dolor (nivel de evidencia 1A)</li>
          <li>Aplicar terapia manual no agresiva como técnicas de movilización neural (nivel de evidencia 2A)</li>
          <li>Considerar el uso de terapia por espejo o imaginería motora graduada para dolor neuropático complejo (nivel de evidencia 1B)</li>
        </ul>
      `;
    } else {
      interpretacionElement.textContent = "Dolor no neuropático";
      interpretacionElement.className = "resultado-interpretacion verde";
      
      interpretacionClinicaElement.innerHTML = `
        <p>Con un puntaje de ${puntaje}/10, el paciente no presenta un patrón típico de dolor neuropático. El dolor probablemente sea de origen nociceptivo o nociplástico.</p>
      `;
      
      recomendacionesElement.innerHTML = `
        <ul>
          <li>Aplicar terapia manual específica según el origen del dolor nociceptivo (nivel de evidencia 1A)</li>
          <li>Prescribir ejercicio terapéutico específico y progresivo para mejorar función y fuerza (nivel de evidencia 1A)</li>
          <li>Implementar estimulación eléctrica (TENS) en modalidad convencional (nivel de evidencia 1B)</li>
          <li>Aplicar termoterapia superficial según la fase del proceso (nivel de evidencia 1B)</li>
          <li>Educación en autocuidado y manejo activo del dolor (nivel de evidencia 1A)</li>
          <li>Realizar reevaluación periódica para identificar cambios en el patrón de dolor (nivel de evidencia 2A)</li>
        </ul>
      `;
    }
  } else {
    badgeElement.textContent = "No completado";
    badgeElement.classList.remove('completado', 'badge-verde');
    badgeElement.classList.add('no-completado');
    interpretacionElement.textContent = "Complete el cuestionario para obtener un resultado";
    interpretacionElement.className = "resultado-interpretacion";
    
    interpretacionClinicaElement.textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    recomendacionesElement.textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
  }
}

// Función para calcular la Escala de Catastrofización ante el Dolor (PCS)
function calcularPCS() {
  // Obtener valores de cada ítem
  let valoresItems = [];
  let completo = true;
  
  // Verificar si están completados todos los ítems
  for (let i = 1; i <= 13; i++) {
    const itemValue = document.querySelector(`input[name="pcs_item${i}"]:checked`)?.value;
    if (itemValue !== undefined) {
      valoresItems.push(parseInt(itemValue));
    } else {
      valoresItems.push(0);
      completo = false;
    }
  }
  
  // Calcular puntuación total
  const puntuacionTotal = valoresItems.reduce((sum, val) => sum + val, 0);
  
  // Calcular subescalas
  // Rumiación: ítems 8, 9, 10, 11 (índices 7, 8, 9, 10)
  const rumiacion = valoresItems[7] + valoresItems[8] + valoresItems[9] + valoresItems[10];
  
  // Magnificación: ítems 6, 7, 13 (índices 5, 6, 12)
  const magnificacion = valoresItems[5] + valoresItems[6] + valoresItems[12];
  
  // Desesperanza: ítems 1, 2, 3, 4, 5, 12 (índices 0, 1, 2, 3, 4, 11)
  const desesperanza = valoresItems[0] + valoresItems[1] + valoresItems[2] + valoresItems[3] + valoresItems[4] + valoresItems[11];
  
  // Actualizar badge
  const badge = document.getElementById('pcs-badge');
  if (completo) {
    badge.textContent = "Completado";
    badge.classList.add("badge-verde");
    badge.classList.add("completado");
  } else {
    badge.textContent = "No completado";
    badge.classList.remove("badge-verde");
    badge.classList.remove("completado");
  }
  
  // Actualizar valores en la interfaz
  document.getElementById('pcs-valor-total').textContent = `${puntuacionTotal}/52`;
  document.getElementById('pcs-valor-rumiacion').textContent = `${rumiacion}/16`;
  document.getElementById('pcs-valor-magnificacion').textContent = `${magnificacion}/12`;
  document.getElementById('pcs-valor-desesperanza').textContent = `${desesperanza}/24`;
  
  // Actualizar interpretación
  const interpretacionTotal = document.getElementById('pcs-interpretacion-total');
  const resultadoContainer = document.getElementById('pcs-resultado');
  const interpretacionClinica = document.getElementById('pcs-interpretacion-clinica');
  const recomendaciones = document.getElementById('pcs-recomendaciones');
  
  if (completo) {
    // Interpretación del valor total
    let nivelCatastrofizacion = "";
    if (puntuacionTotal < 13) {
      nivelCatastrofizacion = "Bajo";
      interpretacionTotal.textContent = "Nivel bajo de catastrofización";
      interpretacionTotal.className = "resultado-interpretacion verde";
      resultadoContainer.className = "resultado-container nivel-leve";
    } else if (puntuacionTotal < 25) {
      nivelCatastrofizacion = "Moderado";
      interpretacionTotal.textContent = "Nivel moderado de catastrofización";
      interpretacionTotal.className = "resultado-interpretacion amarillo";
      resultadoContainer.className = "resultado-container nivel-moderado";
    } else {
      nivelCatastrofizacion = "Alto";
      interpretacionTotal.textContent = "Nivel alto de catastrofización";
      interpretacionTotal.className = "resultado-interpretacion rojo";
      resultadoContainer.className = "resultado-container nivel-severo";
    }
    
    // Interpretación clínica detallada
    interpretacionClinica.innerHTML = `
      <p>El paciente presenta un nivel <strong>${nivelCatastrofizacion.toLowerCase()}</strong> de catastrofización ante el dolor (${puntuacionTotal}/52), lo que indica ${getDescripcionCatastrofizacion(nivelCatastrofizacion)}.</p>
      <p>Análisis de subescalas:</p>
      <ul>
        <li><strong>Rumiación</strong> (${rumiacion}/16): ${getDescripcionRumiacion(rumiacion)}</li>
        <li><strong>Magnificación</strong> (${magnificacion}/12): ${getDescripcionMagnificacion(magnificacion)}</li>
        <li><strong>Desesperanza</strong> (${desesperanza}/24): ${getDescripcionDesesperanza(desesperanza)}</li>
      </ul>
      <p>La catastrofización ante el dolor es un factor psicológico que puede influir negativamente en la experiencia del dolor, la respuesta al tratamiento y la recuperación funcional.</p>
    `;
    
    // Recomendaciones terapéuticas según el nivel
    if (nivelCatastrofizacion === "Bajo") {
      recomendaciones.innerHTML = `
        <p>Con un nivel bajo de catastrofización, se recomienda:</p>
        <ul>
          <li>Mantener la educación sobre el dolor y reforzar conceptos que desmitifiquen creencias erróneas (nivel de evidencia 1A)</li>
          <li>Enfoque principal en terapia física activa y ejercicio terapéutico (nivel de evidencia 1A)</li>
          <li>Proporcionar retroalimentación positiva sobre los avances y capacidades (nivel de evidencia 1B)</li>
          <li>Fomentar estrategias de afrontamiento activas (nivel de evidencia 1B)</li>
          <li>Monitorizar periódicamente para detectar posibles cambios en la catastrofización (nivel de evidencia 2A)</li>
        </ul>
      `;
    } else if (nivelCatastrofizacion === "Moderado") {
      recomendaciones.innerHTML = `
        <p>Con un nivel moderado de catastrofización, se recomienda:</p>
        <ul>
          <li>Implementar educación en neurociencia del dolor para modificar creencias maladaptativas (nivel de evidencia 1A)</li>
          <li>Técnicas de reestructuración cognitiva para identificar y desafiar pensamientos catastróficos (nivel de evidencia 1A)</li>
          <li>Entrenamiento en atención plena (mindfulness) para reducir la rumiación (nivel de evidencia 1B)</li>
          <li>Ejercicio terapéutico graduado con énfasis en la autoeficacia (nivel de evidencia 1A)</li>
          <li>Estrategias de exposición gradual a actividades evitadas (nivel de evidencia 1B)</li>
          <li>Considerar abordaje interdisciplinar si no hay mejoría (nivel de evidencia 1A)</li>
        </ul>
      `;
    } else {
      recomendaciones.innerHTML = `
        <p>Con un nivel alto de catastrofización, se recomienda:</p>
        <ul>
          <li>Abordaje interdisciplinar que incluya psicología clínica (nivel de evidencia 1A)</li>
          <li>Educación intensiva en neurociencia del dolor (nivel de evidencia 1A)</li>
          <li>Terapia cognitivo-conductual estructurada para el manejo del dolor (nivel de evidencia 1A)</li>
          <li>Técnicas específicas para reducir la rumiación y la desesperanza (nivel de evidencia 1B)</li>
          <li>Ejercicio terapéutico con exposición gradual muy controlada (nivel de evidencia 1A)</li>
          <li>Entrenamiento en habilidades específicas de regulación emocional (nivel de evidencia 1B)</li>
          <li>Establecer objetivos funcionales a corto plazo muy concretos y alcanzables (nivel de evidencia 1A)</li>
          <li>Seguimiento cercano y reevaluación frecuente (nivel de evidencia 1B)</li>
        </ul>
      `;
    }
  } else {
    interpretacionTotal.textContent = "Complete el cuestionario";
    interpretacionTotal.className = "resultado-interpretacion";
    resultadoContainer.className = "resultado-container";
    interpretacionClinica.textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    recomendaciones.textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
  }
}

// Funciones auxiliares para las descripciones según los puntajes
function getDescripcionCatastrofizacion(nivel) {
  switch(nivel) {
    case "Bajo":
      return "una tendencia mínima a tener pensamientos negativos exagerados en relación con la experiencia del dolor";
    case "Moderado":
      return "cierta tendencia a amplificar las amenazas del dolor, con pensamientos y sentimientos negativos recurrentes";
    case "Alto":
      return "una fuerte tendencia a amplificar las amenazas del dolor, con pensamientos y sentimientos negativos muy marcados, lo que puede interferir significativamente con la recuperación";
    default:
      return "";
  }
}

function getDescripcionRumiacion(puntaje) {
  if (puntaje <= 5) {
    return "Baja tendencia a centrarse excesivamente en pensamientos dolorosos";
  } else if (puntaje <= 10) {
    return "Moderada tendencia a centrarse repetitivamente en pensamientos relacionados con el dolor";
  } else {
    return "Alta tendencia a la rumiación, con dificultad para apartar los pensamientos sobre el dolor";
  }
}

function getDescripcionMagnificacion(puntaje) {
  if (puntaje <= 3) {
    return "Baja tendencia a exagerar las amenazas del dolor";
  } else if (puntaje <= 7) {
    return "Moderada tendencia a exagerar las amenazas y preocuparse por consecuencias negativas";
  } else {
    return "Alta tendencia a magnificar la gravedad del dolor y sus posibles consecuencias";
  }
}

function getDescripcionDesesperanza(puntaje) {
  if (puntaje <= 8) {
    return "Baja sensación de no poder hacer frente al dolor";
  } else if (puntaje <= 16) {
    return "Moderado sentimiento de impotencia y dificultad para manejar el dolor";
  } else {
    return "Alta sensación de impotencia y desesperanza ante la situación dolorosa";
  }
}

// Función para calcular el Inventario de Sensibilización Central (CSI)
function calcularCSI() {
  // Obtener valores de la Parte A
  let valoresItems = [];
  let completo = true;
  let itemsCompletados = 0;
  
  // Verificar si están completados todos los ítems de la Parte A
  for (let i = 1; i <= 25; i++) {
    const itemValue = document.querySelector(`input[name="csi_item${i}"]:checked`)?.value;
    if (itemValue !== undefined) {
      valoresItems.push(parseInt(itemValue));
      itemsCompletados++;
    } else {
      valoresItems.push(0);
    }
  }
  
  // Calcular puntuación de la Parte A
  const puntuacionA = valoresItems.reduce((sum, val) => sum + val, 0);
  
  // Considerar el cuestionario completo si se han respondido al menos 23 de 25 preguntas
  completo = itemsCompletados >= 23;
  
  // Obtener diagnósticos de la Parte B
  const diagnosticos = [
    document.getElementById('csi_fibromialgia').checked,
    document.getElementById('csi_sindrome_fatiga').checked,
    document.getElementById('csi_tmd').checked,
    document.getElementById('csi_migranas').checked,
    document.getElementById('csi_sii').checked,
    document.getElementById('csi_reflujo').checked,
    document.getElementById('csi_vejiga').checked,
    document.getElementById('csi_quimico').checked,
    document.getElementById('csi_lesion_cuello').checked,
    document.getElementById('csi_ansiedad').checked
  ];
  
  const numeroDiagnosticos = diagnosticos.filter(Boolean).length;
  
  // Actualizar badge
  const badge = document.getElementById('csi-badge');
  if (completo) {
    badge.textContent = "Completado";
    badge.classList.add("badge-verde");
    badge.classList.add("completado");
  } else {
    badge.textContent = "No completado";
    badge.classList.remove("badge-verde");
    badge.classList.remove("completado");
  }
  
  // Actualizar valores en la interfaz
  document.getElementById('csi-valor-a').textContent = `${puntuacionA}/100`;
  document.getElementById('csi-valor-b').textContent = `${numeroDiagnosticos}/10`;
  
  // Actualizar interpretación
  const interpretacionA = document.getElementById('csi-interpretacion-a');
  const interpretacionB = document.getElementById('csi-interpretacion-b');
  const resultadoContainer = document.getElementById('csi-resultado');
  const interpretacionClinica = document.getElementById('csi-interpretacion-clinica');
  const recomendaciones = document.getElementById('csi-recomendaciones');
  
  if (completo) {
    // Interpretación del valor de la Parte A
    let nivelSC = "";
    
    if (puntuacionA < 30) {
      nivelSC = "Subclínico";
      interpretacionA.textContent = "Sensibilización central subclínica";
      interpretacionA.className = "resultado-interpretacion verde";
      resultadoContainer.className = "resultado-container nivel-leve";
    } else if (puntuacionA < 40) {
      nivelSC = "Leve";
      interpretacionA.textContent = "Sensibilización central leve";
      interpretacionA.className = "resultado-interpretacion verde-claro";
      resultadoContainer.className = "resultado-container nivel-leve";
    } else if (puntuacionA < 50) {
      nivelSC = "Moderado";
      interpretacionA.textContent = "Sensibilización central moderada";
      interpretacionA.className = "resultado-interpretacion amarillo";
      resultadoContainer.className = "resultado-container nivel-moderado";
    } else if (puntuacionA < 60) {
      nivelSC = "Severo";
      interpretacionA.textContent = "Sensibilización central severa";
      interpretacionA.className = "resultado-interpretacion rojo";
      resultadoContainer.className = "resultado-container nivel-severo";
    } else {
      nivelSC = "Extremo";
      interpretacionA.textContent = "Sensibilización central extrema";
      interpretacionA.className = "resultado-interpretacion rojo";
      resultadoContainer.className = "resultado-container nivel-severo";
    }
    
    // Interpretación de la Parte B
    if (numeroDiagnosticos === 0) {
      interpretacionB.textContent = "Sin diagnósticos relacionados";
    } else if (numeroDiagnosticos === 1) {
      interpretacionB.textContent = "1 diagnóstico relacionado";
    } else {
      interpretacionB.textContent = `${numeroDiagnosticos} diagnósticos relacionados`;
    }
    
    // Interpretación clínica detallada
    const diagnosticosTexto = obtenerDiagnosticosTexto(diagnosticos);
    
    interpretacionClinica.innerHTML = `
      <p>El paciente presenta un nivel <strong>${nivelSC.toLowerCase()}</strong> de sensibilización central (${puntuacionA}/100), lo que sugiere ${getDescripcionSC(nivelSC)}.</p>
      ${numeroDiagnosticos > 0 ? `
      <p>Además, refiere ${numeroDiagnosticos} ${numeroDiagnosticos === 1 ? 'diagnóstico previo relacionado' : 'diagnósticos previos relacionados'} con síndromes de sensibilización central: ${diagnosticosTexto}.</p>
      <p>La presencia de estos diagnósticos ${numeroDiagnosticos > 2 ? 'múltiples ' : ''}aumenta la probabilidad de que los mecanismos de sensibilización central estén contribuyendo a la presentación clínica actual.</p>
      ` : '<p>No se reportan diagnósticos previos relacionados con síndromes de sensibilización central, lo que sugiere que la contribución de este mecanismo podría ser más reciente o estar en desarrollo.</p>'}
      
      <p>La sensibilización central implica una amplificación de la señalización neural dentro del sistema nervioso central que provoca hipersensibilidad al dolor, alteraciones sensoriales y procesamiento sensorial alterado.</p>
    `;
    
    // Recomendaciones terapéuticas según el nivel
    if (nivelSC === "Subclínico" || nivelSC === "Leve") {
      recomendaciones.innerHTML = `
        <p>Con un nivel ${nivelSC.toLowerCase()} de sensibilización central, se recomienda:</p>
        <ul>
          <li>Educación en neurociencia del dolor para entender los mecanismos de sensibilización (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico de intensidad moderada, priorizando actividades no provocadoras de dolor (nivel de evidencia 1A)</li>
          <li>Técnicas de desensibilización gradual para normalizar el procesamiento sensorial (nivel de evidencia 1B)</li>
          <li>Terapia manual no agresiva con enfoque en reducir la hiperalgesia (nivel de evidencia 1B)</li>
          <li>Estrategias de autorregulación como respiración diafragmática y relajación muscular progresiva (nivel de evidencia 1B)</li>
          <li>Monitorización regular de los síntomas para detectar cambios (nivel de evidencia 2A)</li>
        </ul>
      `;
    } else if (nivelSC === "Moderado") {
      recomendaciones.innerHTML = `
        <p>Con un nivel moderado de sensibilización central, se recomienda:</p>
        <ul>
          <li>Programa estructurado de educación en neurociencia del dolor (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico progresivo con exposición gradual, priorizando actividades aeróbicas de baja intensidad (nivel de evidencia 1A)</li>
          <li>Técnicas de extinción del miedo al movimiento (nivel de evidencia 1B)</li>
          <li>Desensibilización sistemática para hipersensibilidad sensorial (nivel de evidencia 1B)</li>
          <li>Entrenamiento en mindfulness para reducir hipervigilancia (nivel de evidencia 1B)</li>
          <li>Abordaje de factores contextuales (sueño, estrés, patrones de actividad) que pueden perpetuar la sensibilización (nivel de evidencia 1A)</li>
          <li>Considerar derivación a especialista en dolor si no hay mejoría en 4-6 semanas (nivel de evidencia 2A)</li>
        </ul>
      `;
    } else { // Severo o Extremo
      recomendaciones.innerHTML = `
        <p>Con un nivel ${nivelSC.toLowerCase()} de sensibilización central, se recomienda:</p>
        <ul>
          <li>Abordaje interdisciplinar con participación de especialista en dolor (nivel de evidencia 1A)</li>
          <li>Programa intensivo de educación en neurociencia del dolor (nivel de evidencia 1A)</li>
          <li>Exposición gradual muy cuidadosa a estímulos que provocan dolor, monitorizando respuestas (nivel de evidencia 1A)</li>
          <li>Terapia de aceptación y compromiso para reducir el impacto de la hipersensibilidad (nivel de evidencia 1A)</li>
          <li>Programa de actividad física individualizado con progresión muy gradual (nivel de evidencia 1A)</li>
          <li>Técnicas específicas para regular el sistema nervioso autónomo (nivel de evidencia 1B)</li>
          <li>Estrategias de gestión del sueño (nivel de evidencia 1A)</li>
          <li>Intervenciones para reducir el estrés y la ansiedad (nivel de evidencia 1A)</li>
          <li>Plan de tratamiento a largo plazo con objetivos funcionales realistas (nivel de evidencia 1A)</li>
          <li>Considerar derivación para evaluación de tratamiento farmacológico dirigido a mecanismos de sensibilización central (nivel de evidencia 1A)</li>
        </ul>
      `;
    }
  } else {
    interpretacionA.textContent = "Complete el cuestionario";
    interpretacionA.className = "resultado-interpretacion";
    interpretacionB.textContent = "Complete el cuestionario";
    resultadoContainer.className = "resultado-container";
    interpretacionClinica.textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    recomendaciones.textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
  }
}

// Función para obtener la descripción según el nivel de sensibilización central
function getDescripcionSC(nivel) {
  switch(nivel) {
    case "Subclínico":
      return "una presencia mínima de síntomas asociados con la sensibilización del sistema nervioso central";
    case "Leve":
      return "una presencia leve de síntomas relacionados con la sensibilización central, que podrían estar comenzando a afectar la vida diaria";
    case "Moderado":
      return "una clara evidencia de sensibilización central que probablemente esté contribuyendo significativamente a la condición del paciente y afectando su funcionalidad";
    case "Severo":
      return "un alto grado de sensibilización central que probablemente sea un factor determinante en la condición del paciente, con impacto sustancial en múltiples áreas de la vida";
    case "Extremo":
      return "un grado extremo de sensibilización central con manifestaciones generalizadas y profundo impacto en la calidad de vida y funcionalidad";
    default:
      return "";
  }
}

// Función para obtener el texto de diagnósticos seleccionados
function obtenerDiagnosticosTexto(diagnosticos) {
  const nombresdiagnosticos = [
    "fibromialgia",
    "síndrome de fatiga crónica",
    "trastorno temporomandibular",
    "migrañas o cefaleas tensionales",
    "síndrome de intestino irritable",
    "reflujo o dolor torácico no cardíaco",
    "vejiga irritable o cistitis intersticial",
    "sensibilidad a químicos/medicamentos",
    "lesión de cuello (incluyendo latigazo)",
    "ansiedad o ataques de pánico"
  ];
  
  const seleccionados = diagnosticos.map((seleccionado, index) => {
    if (seleccionado) return nombresdiagnosticos[index];
    return null;
  }).filter(Boolean);
  
  if (seleccionados.length === 0) return "ninguno";
  if (seleccionados.length === 1) return seleccionados[0];
  
  const ultimoDiagnostico = seleccionados.pop();
  return `${seleccionados.join(', ')} y ${ultimoDiagnostico}`;
}

// Función para calcular la Escala de Tampa de Kinesiofobia (TSK-11)
function calcularTSK() {
  // Obtener valores de cada ítem
  let valoresItems = [];
  let completo = true;
  
  // Verificar si todos los ítems están completados
  for (let i = 1; i <= 11; i++) {
    const itemValue = document.querySelector(`input[name="tsk_item${i}"]:checked`)?.value;
    if (itemValue !== undefined) {
      valoresItems.push(parseInt(itemValue));
    } else {
      valoresItems.push(0);
      completo = false;
    }
  }
  
  // Calcular puntuación total
  const puntuacionTotal = valoresItems.reduce((sum, val) => sum + val, 0);
  
  // Actualizar badge
  const badge = document.getElementById('tsk-badge');
  if (completo) {
    badge.textContent = "Completado";
    badge.classList.add("badge-verde");
    badge.classList.add("completado");
  } else {
    badge.textContent = "No completado";
    badge.classList.remove("badge-verde");
    badge.classList.remove("completado");
  }
  
  // Actualizar valor en la interfaz
  document.getElementById('tsk-valor').textContent = `${puntuacionTotal}/44`;
  
  // Actualizar interpretación
  const interpretacionEl = document.getElementById('tsk-interpretacion');
  const resultadoContainer = document.getElementById('tsk-resultado');
  const interpretacionClinica = document.getElementById('tsk-interpretacion-clinica');
  const recomendaciones = document.getElementById('tsk-recomendaciones');
  
  if (completo) {
    // Interpretar según el puntaje
    let nivelKinesiofobia;
    if (puntuacionTotal < 17) {
      nivelKinesiofobia = "Mínima";
      interpretacionEl.textContent = "Nivel mínimo de kinesiofobia";
      interpretacionEl.className = "resultado-interpretacion verde";
      resultadoContainer.className = "resultado-container nivel-leve";
    } else if (puntuacionTotal <= 27) {
      nivelKinesiofobia = "Moderada";
      interpretacionEl.textContent = "Nivel moderado de kinesiofobia";
      interpretacionEl.className = "resultado-interpretacion amarillo";
      resultadoContainer.className = "resultado-container nivel-moderado";
    } else {
      nivelKinesiofobia = "Severa";
      interpretacionEl.textContent = "Nivel severo de kinesiofobia";
      interpretacionEl.className = "resultado-interpretacion rojo";
      resultadoContainer.className = "resultado-container nivel-severo";
    }
    
    // Interpretación clínica detallada
    interpretacionClinica.innerHTML = `
      <p>El paciente presenta un nivel de kinesiofobia <strong>${nivelKinesiofobia.toLowerCase()}</strong> (${puntuacionTotal}/44), lo que indica ${getDescripcionKinesiofobia(nivelKinesiofobia)}.</p>
      <p>La kinesiofobia, o miedo al movimiento, puede influir negativamente en la recuperación funcional al limitar la participación en actividades físicas y ejercicios terapéuticos.</p>
      <p>Este resultado sugiere que el paciente ${getPensamientosKinesiofobia(nivelKinesiofobia)}</p>
    `;
    
    // Recomendaciones terapéuticas según el nivel
    if (nivelKinesiofobia === "Mínima") {
      recomendaciones.innerHTML = `
        <p>Con un nivel mínimo de kinesiofobia, se recomienda:</p>
        <ul>
          <li>Reforzar positivamente la confianza actual en el movimiento (nivel de evidencia 1A)</li>
          <li>Educación preventiva básica sobre conceptos erróneos del dolor (nivel de evidencia 1A)</li>
          <li>Prescripción de ejercicio terapéutico regular, enfatizando la progresión gradual (nivel de evidencia 1A)</li>
          <li>Fomentar la autogestión y participación activa en actividades funcionales (nivel de evidencia 1A)</li>
          <li>Monitorizar periódicamente para detectar cambios en las creencias sobre el movimiento (nivel de evidencia 2B)</li>
        </ul>
      `;
    } else if (nivelKinesiofobia === "Moderada") {
      recomendaciones.innerHTML = `
        <p>Con un nivel moderado de kinesiofobia, se recomienda:</p>
        <ul>
          <li>Implementar educación en neurociencia del dolor para abordar creencias erróneas (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico con exposición gradual a movimientos temidos (nivel de evidencia 1A)</li>
          <li>Estrategias cognitivo-conductuales para modificar creencias sobre el daño y el dolor (nivel de evidencia 1A)</li>
          <li>Establecer objetivos funcionales basados en actividades significativas para el paciente (nivel de evidencia 1B)</li>
          <li>Implementar técnicas de imaginería motora para movimientos que generan aprensión (nivel de evidencia 1B)</li>
          <li>Proporcionar retroalimentación positiva durante la realización de ejercicios (nivel de evidencia 1B)</li>
        </ul>
      `;
    } else {
      recomendaciones.innerHTML = `
        <p>Con un nivel severo de kinesiofobia, se recomienda:</p>
        <ul>
          <li>Programa estructurado de educación en neurociencia del dolor (nivel de evidencia 1A)</li>
          <li>Intervención cognitivo-conductual específica para abordar el miedo-evitación (nivel de evidencia 1A)</li>
          <li>Exposición gradual muy progresiva a actividades y movimientos temidos (nivel de evidencia 1A)</li>
          <li>Técnicas de desensibilización sistemática (nivel de evidencia 1B)</li>
          <li>Establecer objetivos funcionales muy pequeños y alcanzables para construir confianza (nivel de evidencia 1A)</li>
          <li>Considerar abordaje multidisciplinar si no hay mejora (nivel de evidencia 1A)</li>
          <li>Uso de diario de exposición a movimientos para registro de expectativas vs. resultados reales (nivel de evidencia 1B)</li>
          <li>Técnicas de atención plena (mindfulness) para reducir la ansiedad anticipatoria (nivel de evidencia 1B)</li>
        </ul>
      `;
    }
  } else {
    interpretacionEl.textContent = "Complete el cuestionario para obtener un resultado";
    interpretacionEl.className = "resultado-interpretacion";
    resultadoContainer.className = "resultado-container";
    interpretacionClinica.textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    recomendaciones.textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
  }
}

// Función para obtener descripción según nivel de kinesiofobia
function getDescripcionKinesiofobia(nivel) {
  switch(nivel) {
    case "Mínima":
      return "un bajo temor al movimiento y buena confianza en la capacidad de su cuerpo para tolerar la actividad física";
    case "Moderada":
      return "cierto grado de temor al movimiento que podría estar limitando su participación en algunas actividades físicas";
    case "Severa":
      return "un alto grado de temor al movimiento que probablemente está limitando significativamente su recuperación funcional y participación en actividades físicas";
    default:
      return "";
  }
}

// Función para describir pensamientos según nivel de kinesiofobia
function getPensamientosKinesiofobia(nivel) {
  switch(nivel) {
    case "Mínima":
      return "generalmente no asocia el movimiento con daño o peligro, lo que favorece una buena adherencia al ejercicio terapéutico";
    case "Moderada":
      return "presenta algunas creencias de que ciertos movimientos podrían ser perjudiciales, lo que podría estar interfiriendo con su recuperación óptima";
    case "Severa":
      return "tiene fuertes creencias de que el movimiento y la actividad física pueden causar daño o reinjuria, lo que está obstaculizando significativamente su progreso";
    default:
      return "";
  }
}

// NDI - Neck Disability Index
function calcularNDI() {
  console.log("Calculando NDI...");
  
  // Obtener todas las preguntas del NDI
  const items = [
    document.querySelector('input[name="ndi_item1"]:checked'),
    document.querySelector('input[name="ndi_item2"]:checked'),
    document.querySelector('input[name="ndi_item3"]:checked'),
    document.querySelector('input[name="ndi_item4"]:checked'),
    document.querySelector('input[name="ndi_item5"]:checked'),
    document.querySelector('input[name="ndi_item6"]:checked'),
    document.querySelector('input[name="ndi_item7"]:checked'),
    document.querySelector('input[name="ndi_item8"]:checked'),
    document.querySelector('input[name="ndi_item9"]:checked'),
    document.querySelector('input[name="ndi_item10"]:checked')
  ];
  
  console.log("Items encontrados:", items);
  
  // Verificar si se han contestado todas las preguntas
  const todasContestadasNDI = items.every(item => item !== null);
  console.log("¿Todas contestadas?", todasContestadasNDI);
  
  // Si no se han contestado todas, actualizar el badge y salir
  if (!todasContestadasNDI) {
    if (document.getElementById('ndi-badge')) {
      document.getElementById('ndi-badge').textContent = "No completado";
      document.getElementById('ndi-badge').className = "resultado-badge no-completado";
    }
    
    return;
  }
  
  // Calcular la puntuación total
  let totalNDI = 0;
  items.forEach(item => {
    totalNDI += parseInt(item.value);
  });
  console.log("Puntuación total:", totalNDI);
  
  // Calcular el porcentaje
  const porcentajeNDI = (totalNDI / 50) * 100;
  console.log("Porcentaje:", porcentajeNDI);
  
  // Determinar el nivel de discapacidad
  let nivelDiscapacidad = "";
  let colorBadge = "";
  
  if (porcentajeNDI < 10) {
    nivelDiscapacidad = "Sin discapacidad";
    colorBadge = "bajo";
  } else if (porcentajeNDI >= 10 && porcentajeNDI < 30) {
    nivelDiscapacidad = "Discapacidad leve";
    colorBadge = "bajo-moderado";
  } else if (porcentajeNDI >= 30 && porcentajeNDI < 50) {
    nivelDiscapacidad = "Discapacidad moderada";
    colorBadge = "moderado";
  } else if (porcentajeNDI >= 50 && porcentajeNDI < 70) {
    nivelDiscapacidad = "Discapacidad severa";
    colorBadge = "moderado-alto";
  } else {
    nivelDiscapacidad = "Discapacidad completa";
    colorBadge = "alto";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('ndi-valor-total')) {
    document.getElementById('ndi-valor-total').textContent = totalNDI + "/50";
  }
  
  if (document.getElementById('ndi-valor-porcentaje')) {
    document.getElementById('ndi-valor-porcentaje').textContent = porcentajeNDI.toFixed(1) + "%";
  }
  
  if (document.getElementById('ndi-nivel-discapacidad')) {
    document.getElementById('ndi-nivel-discapacidad').textContent = nivelDiscapacidad;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('ndi-resultado');
  if (resultadoContainer) {
    if (porcentajeNDI < 30) {
      resultadoContainer.className = "resultado-container nivel-leve";
    } else if (porcentajeNDI < 50) {
      resultadoContainer.className = "resultado-container nivel-moderado";
    } else {
      resultadoContainer.className = "resultado-container nivel-severo";
    }
  }
  
  // Actualizar estado del badge
  if (document.getElementById('ndi-badge')) {
    document.getElementById('ndi-badge').textContent = nivelDiscapacidad;
    document.getElementById('ndi-badge').className = "resultado-badge " + colorBadge;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (porcentajeNDI < 10) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación NDI de <strong>${totalNDI}/50 (${porcentajeNDI.toFixed(1)}%)</strong>, lo que indica <strong>ausencia de discapacidad cervical</strong>.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>No experimenta limitaciones significativas en sus actividades diarias debido a dolor cervical</li>
        <li>Es capaz de realizar sus actividades habituales sin restricciones importantes</li>
        <li>Puede presentar molestias cervicales ocasionales sin impacto funcional</li>
      </ul>
    `;
  } else if (porcentajeNDI >= 10 && porcentajeNDI < 30) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación NDI de <strong>${totalNDI}/50 (${porcentajeNDI.toFixed(1)}%)</strong>, lo que indica <strong>discapacidad cervical leve</strong>.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta algunas limitaciones en actividades específicas pero puede realizar la mayoría de las tareas cotidianas</li>
        <li>Puede experimentar dolor cervical ocasional que no interfiere significativamente con su funcionalidad</li>
        <li>Es posible que tenga algunas dificultades con actividades prolongadas que involucren la región cervical</li>
        <li>Puede presentar momentos de mayor molestia alternados con períodos de menor sintomatología</li>
      </ul>
    `;
  } else if (porcentajeNDI >= 30 && porcentajeNDI < 50) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación NDI de <strong>${totalNDI}/50 (${porcentajeNDI.toFixed(1)}%)</strong>, lo que indica <strong>discapacidad cervical moderada</strong>.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta limitaciones significativas en varias actividades cotidianas debido al dolor y la disfunción cervical</li>
        <li>Probablemente tenga dificultades para mantener posturas prolongadas (como leer, trabajar en computadora)</li>
        <li>Puede presentar alteraciones del sueño y dificultades en la concentración</li>
        <li>Su capacidad para trabajar y realizar actividades recreativas está afectada moderadamente</li>
        <li>Puede experimentar cefaleas asociadas a su problema cervical</li>
      </ul>
    `;
  } else if (porcentajeNDI >= 50 && porcentajeNDI < 70) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación NDI de <strong>${totalNDI}/50 (${porcentajeNDI.toFixed(1)}%)</strong>, lo que indica <strong>discapacidad cervical severa</strong>.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Tiene limitaciones importantes en la mayoría de las actividades de la vida diaria</li>
        <li>Presenta dificultades significativas para el autocuidado</li>
        <li>Experimenta dolor cervical intenso que interfiere con la mayoría de sus actividades</li>
        <li>Tiene restricciones severas para actividades laborales, recreativas y sociales</li>
        <li>Probablemente presenta alteraciones importante del sueño y la concentración</li>
        <li>Es probable que presente cefaleas recurrentes y/o irradiación de síntomas a miembros superiores</li>
      </ul>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación NDI de <strong>${totalNDI}/50 (${porcentajeNDI.toFixed(1)}%)</strong>, lo que indica <strong>discapacidad cervical completa</strong>.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta un impacto extremadamente severo en todas sus actividades cotidianas</li>
        <li>Requiere asistencia para la mayoría de las actividades de autocuidado</li>
        <li>Presenta un dolor cervical inhabilitante</li>
        <li>Tiene una alta probabilidad de incapacidad laboral</li>
        <li>Experimenta severas alteraciones del sueño, concentración y otras funciones cognitivas</li>
        <li>Puede presentar sintomatología asociada como mareos, cefaleas intensas, alteraciones visuales o auditivas</li>
        <li>Es posible que presente signos neurológicos significativos que requieran evaluación médica especializada</li>
      </ul>
      <p><strong>Nota:</strong> Puntuaciones en este rango pueden indicar una condición severa que requiere evaluación médica adicional (neurología/neurocirugía).</p>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (porcentajeNDI < 10) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Valoración postural para identificar factores de riesgo</li>
          <li>Evaluación de la biomecánica laboral y ergonomía</li>
          <li>Monitoreo periódico para prevenir el desarrollo de problemas cervicales</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Educación sobre higiene postural y ergonomía</li>
          <li>Ejercicios preventivos de movilidad y fortalecimiento cervical</li>
          <li>Técnicas de automovilización y estiramientos básicos</li>
          <li>Recomendaciones para mantener la salud cervical en actividades cotidianas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Importancia de mantener una adecuada postura cervical</li>
          <li>Prevención y manejo temprano de molestias cervicales</li>
          <li>Técnicas de relajación básicas para prevenir tensión cervical</li>
          <li>Factores de riesgo a evitar para prevenir problemas cervicales futuros</li>
        </ul>
      </div>
    `;
  } else if (porcentajeNDI >= 10 && porcentajeNDI < 30) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Examen biomecánico completo de la región cervical y estructuras asociadas</li>
          <li>Valoración de la movilidad articular y control motor cervical</li>
          <li>Exploración de patrones de movimiento disfuncionales</li>
          <li>Evaluación del estado de la musculatura cervical y periescapular</li>
          <li>Análisis ergonómico de actividades habituales</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Terapia manual suave para restaurar la movilidad articular normal</li>
          <li>Ejercicios de movilidad, estabilización y fortalecimiento progresivo</li>
          <li>Técnicas de liberación miofascial y relajación muscular</li>
          <li>Corrección postural y reeducación de patrones de movimiento</li>
          <li>Adaptaciones ergonómicas en actividades laborales y cotidianas</li>
          <li>Ejercicios de control motor cervical y escapular</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre biomecánica cervical y patrones de movimiento adecuados</li>
          <li>Estrategias de autogestión del dolor y tensión cervical</li>
          <li>Técnicas de automovilización y autoestiramiento</li>
          <li>Programa de ejercicios domiciliarios específicos</li>
          <li>Modificaciones ergonómicas en actividades diarias y laborales</li>
        </ul>
      </div>
    `;
  } else if (porcentajeNDI >= 30 && porcentajeNDI < 50) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación detallada del patrón de dolor y restricción funcional</li>
          <li>Valoración neurológica básica (reflejos, sensibilidad, fuerza)</li>
          <li>Examen de la articulación temporomandibular y relación con síntomas</li>
          <li>Evaluación de la musculatura profunda cervical y control motor</li>
          <li>Análisis de factores psicosociales asociados</li>
          <li>Evaluación de alteraciones del sueño y su impacto</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa multimodal progresivo con énfasis en control de dolor</li>
          <li>Terapia manual para mejorar la movilidad y reducir dolor</li>
          <li>Reeducación neuromuscular de la región cervical</li>
          <li>Entrenamiento específico de musculatura flexora profunda</li>
          <li>Tratamiento de puntos gatillo y tensión miofascial</li>
          <li>Ejercicios de estabilización cervical y escapular</li>
          <li>Aplicación de agentes físicos para control del dolor según necesidad</li>
          <li>Estrategias de manejo del sueño y mejora de la función cognitiva</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Neurofisiología del dolor y su relación con la disfunción cervical</li>
          <li>Estrategias activas de afrontamiento y autogestión del dolor</li>
          <li>Importancia de la adherencia al programa de ejercicios</li>
          <li>Modificaciones ambientales y ergonómicas específicas</li>
          <li>Técnicas de manejo del estrés y su impacto en los síntomas cervicales</li>
          <li>Progresión gradual en actividades funcionales</li>
          <li>Estrategias para manejar exacerbaciones y prevenir recidivas</li>
        </ul>
      </div>
    `;
  } else if (porcentajeNDI >= 50) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional del dolor y la discapacidad</li>
          <li>Valoración neurológica completa y signos de bandera roja</li>
          <li>Evaluación de factores psicosociales y de salud mental asociados</li>
          <li>Análisis de comorbilidades y medicación actual</li>
          <li>Valoración de factores de sensibilización central</li>
          <li>Evaluación de impacto en actividades básicas de la vida diaria</li>
          <li>Considerar derivación para estudios complementarios (imágenes/neurólogo)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Enfoque interdisciplinario (considerar manejo conjunto con medicina, psicología)</li>
          <li>Programa gradual con énfasis inicial en reducción del dolor y mejora funcional básica</li>
          <li>Terapia manual gentil y adaptada a la tolerancia del paciente</li>
          <li>Neurodinámica y tratamiento de sensibilización periférica y central</li>
          <li>Abordaje de factores psicosociales asociados a la discapacidad</li>
          <li>Ejercicios de control motor comenzando con movimientos de baja carga</li>
          <li>Estrategias de desensibilización gradual</li>
          <li>Terapia de exposición gradual a actividades evitadas</li>
          <li>Rehabilitación del sueño y técnicas de relajación profunda</li>
          <li>Adaptaciones funcionales para actividades esenciales</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación intensiva sobre neurofisiología del dolor</li>
          <li>Estrategias de autogestión del dolor crónico</li>
          <li>Reconceptualización de creencias sobre el dolor y la discapacidad</li>
          <li>Manejo de expectativas y establecimiento de objetivos realistas</li>
          <li>Estrategias para romper el ciclo dolor-inactividad-más dolor</li>
          <li>Técnicas de autorregulación emocional y manejo del estrés</li>
          <li>Importancia de mantener roles sociales y prevenir el aislamiento</li>
          <li>Planes de acción para manejar crisis y prevenir recaídas</li>
          <li>Involucrar a familiares/cuidadores en el proceso terapéutico</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Considerar interconsulta con especialistas según hallazgos (neurología, reumatología)</li>
          <li>Valorar la necesidad de apoyo psicológico especializado</li>
          <li>Evaluar la necesidad de ayudas técnicas temporales</li>
          <li>En casos de discapacidad severa persistente, considerar programas de rehabilitación intensiva</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('ndi-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('ndi-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el puntaje del QuickDASH
function calcularQuickDASH() {
  console.log("Calculando QuickDASH...");
  
  // Obtener todas las preguntas del QuickDASH
  const items = [
    document.querySelector('input[name="quickdash_item1"]:checked'),
    document.querySelector('input[name="quickdash_item2"]:checked'),
    document.querySelector('input[name="quickdash_item3"]:checked'),
    document.querySelector('input[name="quickdash_item4"]:checked'),
    document.querySelector('input[name="quickdash_item5"]:checked'),
    document.querySelector('input[name="quickdash_item6"]:checked'),
    document.querySelector('input[name="quickdash_item7"]:checked'),
    document.querySelector('input[name="quickdash_item8"]:checked'),
    document.querySelector('input[name="quickdash_item9"]:checked'),
    document.querySelector('input[name="quickdash_item10"]:checked'),
    document.querySelector('input[name="quickdash_item11"]:checked')
  ];
  
  console.log("Items encontrados:", items);
  
  // Contar cuántas preguntas han sido respondidas
  const itemsRespondidos = items.filter(item => item !== null).length;
  console.log("Items respondidos:", itemsRespondidos);
  
  // Para un resultado válido, al menos 10 de 11 preguntas deben ser respondidas
  const respuestasMinimas = 10;
  
  // Si no se han contestado suficientes preguntas, actualizar el badge y salir
  if (itemsRespondidos < respuestasMinimas) {
    if (document.getElementById('quickdash-badge')) {
      document.getElementById('quickdash-badge').textContent = "No completado";
      document.getElementById('quickdash-badge').className = "resultado-badge no-completado";
    }
    
    // Actualizar mensajes de resultados
    if (document.getElementById('quickdash-interpretacion-total')) {
      document.getElementById('quickdash-interpretacion-total').textContent = "Complete al menos 10 preguntas";
    }
    if (document.getElementById('quickdash-interpretacion-clinica')) {
      document.getElementById('quickdash-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    if (document.getElementById('quickdash-recomendaciones')) {
      document.getElementById('quickdash-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Calcular la suma de los valores de las preguntas respondidas
  let suma = 0;
  items.forEach(item => {
    if (item !== null) {
      suma += parseInt(item.value);
    }
  });
  console.log("Suma de valores:", suma);
  
  // Calcular el puntaje QuickDASH: [(suma / número de respuestas) - 1] × 25
  // Esto da un puntaje de 0-100 donde 0 = sin discapacidad, 100 = máxima discapacidad
  const puntajeQuickDASH = ((suma / itemsRespondidos) - 1) * 25;
  const puntajeRedondeado = Math.round(puntajeQuickDASH * 10) / 10; // Redondear a 1 decimal
  console.log("Puntaje QuickDASH:", puntajeRedondeado);
  
  // Determinar el nivel de discapacidad
  let nivelDiscapacidad = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (puntajeRedondeado < 16) {
    nivelDiscapacidad = "Discapacidad mínima";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (puntajeRedondeado < 41) {
    nivelDiscapacidad = "Discapacidad moderada";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else {
    nivelDiscapacidad = "Discapacidad severa";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('quickdash-valor-total')) {
    document.getElementById('quickdash-valor-total').textContent = puntajeRedondeado.toFixed(1) + "/100";
  }
  
  if (document.getElementById('quickdash-nivel-discapacidad')) {
    document.getElementById('quickdash-nivel-discapacidad').textContent = nivelDiscapacidad;
  }
  
  if (document.getElementById('quickdash-interpretacion-total')) {
    document.getElementById('quickdash-interpretacion-total').textContent = nivelDiscapacidad;
    document.getElementById('quickdash-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('quickdash-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Actualizar estado del badge
  if (document.getElementById('quickdash-badge')) {
    document.getElementById('quickdash-badge').textContent = nivelDiscapacidad;
    document.getElementById('quickdash-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (puntajeRedondeado < 16) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación QuickDASH de <strong>${puntajeRedondeado.toFixed(1)}/100</strong>, lo que indica <strong>discapacidad mínima</strong> en el brazo, hombro o mano.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta limitaciones mínimas en sus actividades diarias relacionadas con el miembro superior</li>
        <li>Puede realizar la mayoría de las tareas sin dificultad significativa</li>
        <li>Presenta un nivel funcional adecuado para la mayoría de actividades cotidianas y laborales</li>
        <li>Puede experimentar molestias leves que no interfieren significativamente con su calidad de vida</li>
      </ul>
    `;
  } else if (puntajeRedondeado < 41) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación QuickDASH de <strong>${puntajeRedondeado.toFixed(1)}/100</strong>, lo que indica <strong>discapacidad moderada</strong> en el brazo, hombro o mano.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta limitaciones moderadas en actividades que involucran el miembro superior</li>
        <li>Presenta dificultades para realizar algunas tareas cotidianas y laborales</li>
        <li>Puede experimentar dolor o incomodidad que interfiere parcialmente con su funcionalidad</li>
        <li>Posiblemente necesita adaptar o modificar ciertas actividades</li>
        <li>Es probable que tenga restricciones en actividades recreativas que requieren uso activo del miembro superior</li>
      </ul>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación QuickDASH de <strong>${puntajeRedondeado.toFixed(1)}/100</strong>, lo que indica <strong>discapacidad severa</strong> en el brazo, hombro o mano.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta limitaciones importantes en la mayoría de actividades que involucran el miembro superior</li>
        <li>Presenta dificultades significativas para realizar tareas cotidianas básicas</li>
        <li>Probablemente experimenta dolor e incomodidad considerables que afectan su calidad de vida</li>
        <li>Puede requerir asistencia para completar ciertas actividades</li>
        <li>Es probable que presente restricciones importantes en actividades laborales y recreativas</li>
        <li>El impacto en su funcionalidad general es notable, con posibles efectos en su independencia y bienestar emocional</li>
      </ul>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntajeRedondeado < 16) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica detallada para identificar factores contribuyentes menores</li>
          <li>Valoración de patrones de movimiento específicos y ergonomía</li>
          <li>Análisis de actividades ocupacionales y recreativas de alta demanda</li>
          <li>Evaluación de factores preventivos para evitar progresión</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Terapia manual focalizada en segmentos específicos con disfunción (nivel de evidencia 1A)</li>
          <li>Ejercicios de movilidad y estabilización adaptados a necesidades específicas (nivel de evidencia 1A)</li>
          <li>Optimización de patrones de movimiento para actividades específicas (nivel de evidencia 1B)</li>
          <li>Programa preventivo para evitar recurrencias o progresión (nivel de evidencia 1B)</li>
          <li>Técnicas de liberación miofascial para tejidos específicos afectados (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Estrategias de autocuidado y mantenimiento de la función</li>
          <li>Ergonomía e higiene postural específica para actividades habituales</li>
          <li>Ejercicios preventivos para realizar en casa</li>
          <li>Signos de alerta para buscar atención temprana si los síntomas progresan</li>
          <li>Modificaciones menores en actividades laborales/recreativas de alta demanda</li>
        </ul>
      </div>
    `;
  } else if (puntajeRedondeado < 41) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación neuromuscular y biomecánica completa del miembro superior</li>
          <li>Análisis detallado de restricciones articulares, desequilibrios musculares y control motor</li>
          <li>Valoración de impacto funcional en actividades laborales y de vida diaria</li>
          <li>Examen de factores desencadenantes y perpetuantes</li>
          <li>Evaluación de compensaciones proximales y distales</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa multimodal de rehabilitación con énfasis en recuperación funcional (nivel de evidencia 1A)</li>
          <li>Terapia manual específica para disfunciones articulares identificadas (nivel de evidencia 1A)</li>
          <li>Reeducación neuromuscular progresiva de patrones de movimiento (nivel de evidencia 1A)</li>
          <li>Ejercicios de estabilización escapular y control motor (nivel de evidencia 1A)</li>
          <li>Entrenamiento de resistencia progresiva para musculatura débil (nivel de evidencia 1A)</li>
          <li>Técnicas de movilización neural según necesidades (nivel de evidencia 1B)</li>
          <li>Modificación de actividades y ergonomía adaptada (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre fisiopatología y mecanismos de la lesión</li>
          <li>Pacing de actividades y técnicas de conservación de energía</li>
          <li>Ergonomía específica para actividades problemáticas</li>
          <li>Programa de ejercicios domiciliarios con progresión gradual</li>
          <li>Estrategias de autogestión de síntomas y exacerbaciones</li>
          <li>Modificaciones en actividades laborales y de ocio</li>
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional exhaustiva del miembro superior y sistemas relacionados</li>
          <li>Valoración de banderas rojas y posibles complicaciones neurovasculares</li>
          <li>Análisis detallado de limitaciones funcionales y su impacto en calidad de vida</li>
          <li>Evaluación de factores psicosociales y barreras para la recuperación</li>
          <li>Valoración de factores de sensibilización central y regional</li>
          <li>Considerar estudios complementarios o interconsulta según hallazgos (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa interdisciplinario con objetivos funcionales específicos (nivel de evidencia 1A)</li>
          <li>Terapia manual adaptada a la tolerancia y respuesta individual (nivel de evidencia 1A)</li>
          <li>Estrategias de desensibilización para áreas hipersensibles (nivel de evidencia 1B)</li>
          <li>Rehabilitación neuromuscular con énfasis en control motor y no en dolor (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico con progresión muy gradual y supervisada (nivel de evidencia 1A)</li>
          <li>Entrenamiento funcional específico para actividades esenciales (nivel de evidencia 1A)</li>
          <li>Técnicas de manejo del dolor (modalidades físicas, TENS) como complemento (nivel de evidencia 1B)</li>
          <li>Considerar órtesis de posicionamiento o funcionales según necesidad (nivel de evidencia 2A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación intensiva en neurociencia del dolor cuando corresponda</li>
          <li>Estrategias avanzadas de autogestión y resolución de problemas</li>
          <li>Establecimiento de expectativas realistas y objetivos funcionales progresivos</li>
          <li>Técnicas de conservación de energía y protección articular</li>
          <li>Modificaciones significativas del entorno y actividades</li>
          <li>Estrategias para mantener participación social y bienestar emocional</li>
          <li>Plan de mantenimiento a largo plazo y prevención de recaídas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Valorar la necesidad de interconsulta con especialistas según hallazgos clínicos</li>
          <li>Considerar abordaje interdisciplinar en casos de discapacidad persistente</li>
          <li>Evaluar factores ergonómicos y adaptaciones necesarias para actividades esenciales</li>
          <li>Monitorizar respuesta al tratamiento y ajustar plan según evolución</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('quickdash-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('quickdash-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el puntaje del SPADI
function calcularSPADI() {
  console.log("Calculando SPADI...");
  
  // Obtener los ítems de dolor
  const itemsDolor = [
    document.querySelector('input[name="spadi_dolor1"]:checked'),
    document.querySelector('input[name="spadi_dolor2"]:checked'),
    document.querySelector('input[name="spadi_dolor3"]:checked'),
    document.querySelector('input[name="spadi_dolor4"]:checked'),
    document.querySelector('input[name="spadi_dolor5"]:checked')
  ];
  
  // Obtener los ítems de discapacidad
  const itemsDiscapacidad = [
    document.querySelector('input[name="spadi_discap1"]:checked'),
    document.querySelector('input[name="spadi_discap2"]:checked'),
    document.querySelector('input[name="spadi_discap3"]:checked'),
    document.querySelector('input[name="spadi_discap4"]:checked'),
    document.querySelector('input[name="spadi_discap5"]:checked'),
    document.querySelector('input[name="spadi_discap6"]:checked'),
    document.querySelector('input[name="spadi_discap7"]:checked'),
    document.querySelector('input[name="spadi_discap8"]:checked')
  ];
  
  console.log("Ítems de dolor encontrados:", itemsDolor);
  console.log("Ítems de discapacidad encontrados:", itemsDiscapacidad);
  
  // Contar los ítems respondidos
  const dolorRespondidos = itemsDolor.filter(item => item !== null).length;
  const discapacidadRespondidos = itemsDiscapacidad.filter(item => item !== null).length;
  const totalRespondidos = dolorRespondidos + discapacidadRespondidos;
  
  console.log("Ítems de dolor respondidos:", dolorRespondidos);
  console.log("Ítems de discapacidad respondidos:", discapacidadRespondidos);
  
  // El cuestionario debe tener al menos 10 de 13 ítems respondidos (80%) para ser válido
  const respuestasMinimas = 10;
  
  // Si no hay suficientes respuestas, marcar como no completado
  if (totalRespondidos < respuestasMinimas) {
    if (document.getElementById('spadi-badge')) {
      document.getElementById('spadi-badge').textContent = "No completado";
      document.getElementById('spadi-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('spadi-interpretacion-total')) {
      document.getElementById('spadi-interpretacion-total').textContent = "Complete al menos 10 preguntas";
    }
    if (document.getElementById('spadi-interpretacion-clinica')) {
      document.getElementById('spadi-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    if (document.getElementById('spadi-recomendaciones')) {
      document.getElementById('spadi-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Calcular puntuaciones
  // Para cada sección, se suma el valor y se divide por el máximo posible (considerando solo preguntas respondidas)
  
  // Calcular puntuación de dolor
  let sumaDolor = 0;
  itemsDolor.forEach(item => {
    if (item !== null) {
      sumaDolor += parseInt(item.value);
    }
  });
  const puntuacionDolor = (sumaDolor / (dolorRespondidos * 10)) * 100;
  console.log("Puntuación de dolor:", puntuacionDolor);
  
  // Calcular puntuación de discapacidad
  let sumaDiscapacidad = 0;
  itemsDiscapacidad.forEach(item => {
    if (item !== null) {
      sumaDiscapacidad += parseInt(item.value);
    }
  });
  const puntuacionDiscapacidad = (sumaDiscapacidad / (discapacidadRespondidos * 10)) * 100;
  console.log("Puntuación de discapacidad:", puntuacionDiscapacidad);
  
  // Calcular puntuación total del SPADI (promedio de las dos subescalas)
  const puntuacionTotal = (puntuacionDolor + puntuacionDiscapacidad) / 2;
  const puntuacionRedondeada = Math.round(puntuacionTotal * 10) / 10; // Redondear a 1 decimal
  console.log("Puntuación total SPADI:", puntuacionRedondeada);
  
  // Determinar el nivel de afectación
  let nivelAfectacion = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (puntuacionRedondeada < 30) {
    nivelAfectacion = "Afectación leve";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (puntuacionRedondeada < 60) {
    nivelAfectacion = "Afectación moderada";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else {
    nivelAfectacion = "Afectación severa";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('spadi-valor-total')) {
    document.getElementById('spadi-valor-total').textContent = puntuacionRedondeada.toFixed(1) + "/100";
  }
  
  if (document.getElementById('spadi-valor-dolor')) {
    document.getElementById('spadi-valor-dolor').textContent = Math.round(puntuacionDolor * 10) / 10 + "%";
  }
  
  if (document.getElementById('spadi-valor-discapacidad')) {
    document.getElementById('spadi-valor-discapacidad').textContent = Math.round(puntuacionDiscapacidad * 10) / 10 + "%";
  }
  
  if (document.getElementById('spadi-interpretacion-total')) {
    document.getElementById('spadi-interpretacion-total').textContent = nivelAfectacion;
    document.getElementById('spadi-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('spadi-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Actualizar estado del badge
  if (document.getElementById('spadi-badge')) {
    document.getElementById('spadi-badge').textContent = nivelAfectacion;
    document.getElementById('spadi-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (puntuacionRedondeada < 30) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación SPADI de <strong>${puntuacionRedondeada.toFixed(1)}/100</strong>, indicando una <strong>afectación leve</strong> del hombro, con una puntuación de dolor de ${Math.round(puntuacionDolor * 10) / 10}% y una puntuación de discapacidad funcional de ${Math.round(puntuacionDiscapacidad * 10) / 10}%.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta molestias leves a moderadas en el hombro que le permiten realizar la mayoría de actividades cotidianas</li>
        <li>Experimenta ciertas limitaciones específicas, principalmente en actividades que involucran movimientos por encima de la cabeza o que requieren fuerza</li>
        <li>Mantiene un buen nivel de funcionalidad general a pesar de las molestias</li>
        <li>Es probable que responda bien a intervenciones conservadoras dirigidas a los factores biomecánicos específicos</li>
      </ul>
      <p>La diferencia entre las escalas de dolor (${Math.round(puntuacionDolor * 10) / 10}%) y discapacidad (${Math.round(puntuacionDiscapacidad * 10) / 10}%) ${Math.abs(puntuacionDolor - puntuacionDiscapacidad) > 15 ? 'muestra una discrepancia significativa, lo que sugiere que ' + (puntuacionDolor > puntuacionDiscapacidad ? 'el dolor es desproporcionado respecto a la limitación funcional' : 'el paciente ha desarrollado estrategias compensatorias a pesar del dolor') : 'muestra coherencia entre la experiencia de dolor y la limitación funcional'}.</p>
    `;
  } else if (puntuacionRedondeada < 60) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación SPADI de <strong>${puntuacionRedondeada.toFixed(1)}/100</strong>, indicando una <strong>afectación moderada</strong> del hombro, con una puntuación de dolor de ${Math.round(puntuacionDolor * 10) / 10}% y una puntuación de discapacidad funcional de ${Math.round(puntuacionDiscapacidad * 10) / 10}%.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta dolor significativo en el hombro que interfiere con varias actividades cotidianas</li>
        <li>Presenta limitaciones funcionales moderadas, particularmente en actividades que requieren elevación del brazo, movilidad completa o fuerza</li>
        <li>Puede tener dificultades con actividades de autocuidado como vestirse o lavarse</li>
        <li>Probablemente ha modificado la forma en que realiza algunas actividades para adaptarse a sus limitaciones</li>
        <li>Es posible que presente alteraciones en patrones de movimiento y compensaciones posturales</li>
      </ul>
      <p>La diferencia entre las escalas de dolor (${Math.round(puntuacionDolor * 10) / 10}%) y discapacidad (${Math.round(puntuacionDiscapacidad * 10) / 10}%) ${Math.abs(puntuacionDolor - puntuacionDiscapacidad) > 15 ? 'muestra una discrepancia significativa, lo que sugiere que ' + (puntuacionDolor > puntuacionDiscapacidad ? 'el dolor es el síntoma predominante y puede haber componentes de sensibilización' : 'existen factores mecánicos o estructurales que limitan la función más allá del dolor experimentado') : 'indica una correlación clínica normal entre dolor y limitación funcional'}.</p>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación SPADI de <strong>${puntuacionRedondeada.toFixed(1)}/100</strong>, indicando una <strong>afectación severa</strong> del hombro, con una puntuación de dolor de ${Math.round(puntuacionDolor * 10) / 10}% y una puntuación de discapacidad funcional de ${Math.round(puntuacionDiscapacidad * 10) / 10}%.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta dolor intenso en el hombro que limita sustancialmente su función diaria</li>
        <li>Presenta dificultades significativas para realizar actividades básicas de autocuidado</li>
        <li>Tiene limitaciones importantes en actividades como vestirse, bañarse y otras tareas cotidianas</li>
        <li>Probablemente ha desarrollado patrones de movimiento compensatorios importantes</li>
        <li>Puede presentar impacto emocional asociado a la limitación funcional</li>
        <li>Es posible que tenga alteraciones del sueño debido al dolor nocturno o posicional</li>
        <li>Puede requerir asistencia para ciertas actividades que involucran el hombro afectado</li>
      </ul>
      <p>La diferencia entre las escalas de dolor (${Math.round(puntuacionDolor * 10) / 10}%) y discapacidad (${Math.round(puntuacionDiscapacidad * 10) / 10}%) ${Math.abs(puntuacionDolor - puntuacionDiscapacidad) > 15 ? 'muestra una discrepancia significativa, lo que sugiere que ' + (puntuacionDolor > puntuacionDiscapacidad ? 'hay un componente importante de sensibilización que amplifica la experiencia dolorosa' : 'existen restricciones mecánicas o estructurales severas que limitan la función independientemente de la intensidad del dolor') : 'refleja una afectación global grave tanto en síntomas como en función'}.</p>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntuacionRedondeada < 30) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica detallada de la articulación glenohumeral, complejo articular del hombro y región escapulotorácica</li>
          <li>Valoración del control motor y patrones de activación muscular</li>
          <li>Análisis de la postura y alineación escapular</li>
          <li>Evaluación específica de actividades que provocan síntomas</li>
          <li>Análisis ergonómico de actividades laborales o deportivas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Terapia manual dirigida a restaurar la movilidad articular normal del complejo del hombro (nivel de evidencia 1A)</li>
          <li>Ejercicios de estabilización escapular y control motor (nivel de evidencia 1A)</li>
          <li>Reentrenamiento de patrones de movimiento específicos (nivel de evidencia 1B)</li>
          <li>Fortalecimiento progresivo de la musculatura del manguito rotador (nivel de evidencia 1A)</li>
          <li>Técnicas de liberación miofascial para tejidos blandos específicos (nivel de evidencia 1B)</li>
          <li>Ejercicios de estiramiento para estructuras acortadas (nivel de evidencia 1B)</li>
          <li>Corrección de desequilibrios posturales contribuyentes (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre biomecánica del hombro y factores contribuyentes</li>
          <li>Modificaciones posturales y ergonómicas durante actividades específicas</li>
          <li>Técnicas de automovilización y autoestiramiento</li>
          <li>Programa de ejercicios domiciliarios para mantenimiento</li>
          <li>Estrategias preventivas para evitar recurrencias</li>
          <li>Recomendaciones para actividades deportivas o laborales</li>
        </ul>
      </div>
    `;
  } else if (puntuacionRedondeada < 60) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación integral del complejo articular del hombro incluyendo análisis en cadena cinética</li>
          <li>Valoración detallada de disfunciones de movilidad, estabilidad y control motor</li>
          <li>Análisis de patrones compensatorios desarrollados</li>
          <li>Evaluación de factores contribuyentes proximales y distales</li>
          <li>Valoración del impacto funcional en actividades específicas</li>
          <li>Identificación de factores perpetuantes mecánicos y posturales</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa multimodal combinando terapia manual e intervenciones activas (nivel de evidencia 1A)</li>
          <li>Movilización articular específica de todas las articulaciones del complejo del hombro (nivel de evidencia 1A)</li>
          <li>Ejercicios terapéuticos progresivos para restaurar función (nivel de evidencia 1A)</li>
          <li>Reeducación neuromuscular del control escapulohumeral (nivel de evidencia 1A)</li>
          <li>Entrenamiento excéntrico específico para tendones afectados (nivel de evidencia 1A)</li>
          <li>Entrenamiento propioceptivo y de estabilidad dinámica (nivel de evidencia 1B)</li>
          <li>Técnicas neurodinámicas cuando estén indicadas (nivel de evidencia 1B)</li>
          <li>Terapia de ejercicio funcional específico relacionado con actividades limitadas (nivel de evidencia 1A)</li>
          <li>Modalidades físicas complementarias para control del dolor (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación detallada sobre fisiopatología y mecanismos de disfunción</li>
          <li>Estrategias de autogestión del dolor y actividades desencadenantes</li>
          <li>Técnicas de modificación de actividades para minimizar la sobrecarga</li>
          <li>Programa de ejercicios domiciliarios estructurado con progresión clara</li>
          <li>Estrategias ergonómicas específicas para actividades laborales y cotidianas</li>
          <li>Pacing de actividades y técnicas de conservación de energía</li>
          <li>Expectativas realistas sobre la recuperación y temporalidad del proceso</li>
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional exhaustiva del complejo del hombro y sistemas relacionados</li>
          <li>Valoración de posibles complicaciones o banderas rojas requiriendo derivación</li>
          <li>Análisis integral del impacto en calidad de vida y participación social</li>
          <li>Evaluación de factores psicosociales y su influencia en la presentación clínica</li>
          <li>Identificación de barreras para la recuperación funcional</li>
          <li>Valoración de comorbilidades que puedan afectar el pronóstico</li>
          <li>Análisis detallado de estrategias compensatorias y su impacto secundario</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa interdisciplinario estructurado con objetivos funcionales específicos (nivel de evidencia 1A)</li>
          <li>Terapia manual cuidadosa respetando la tolerancia del tejido (nivel de evidencia 1A)</li>
          <li>Estrategias de manejo del dolor multimodales (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico con progresión muy gradual y supervisada (nivel de evidencia 1A)</li>
          <li>Reentrenamiento específico de control motor escapulohumeral (nivel de evidencia 1A)</li>
          <li>Ejercicios graduados de exposición y tolerancia a la carga (nivel de evidencia 1A)</li>
          <li>Entrenamiento funcional contextualizado a necesidades específicas (nivel de evidencia 1A)</li>
          <li>Entrenamiento de compensaciones y adaptaciones funcionales cuando sea necesario (nivel de evidencia 1B)</li>
          <li>Considerar modalidades complementarias como TENS o termoterapia para alivio sintomático (nivel de evidencia 1B)</li>
          <li>Valorar necesidad de órtesis de estabilización o posicionamiento temporal (nivel de evidencia 2A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación intensiva sobre neurofisiología del dolor cuando corresponda</li>
          <li>Estrategias avanzadas de autogestión y adaptación funcional</li>
          <li>Modificaciones significativas del entorno y actividades cotidianas</li>
          <li>Establecimiento de expectativas realistas y objetivos funcionales progresivos</li>
          <li>Técnicas de conservación de energía y protección articular</li>
          <li>Estrategias para maximizar la participación social y mantener roles significativos</li>
          <li>Plan de mantenimiento a largo plazo y prevención de complicaciones secundarias</li>
          <li>Opciones terapéuticas complementarias y cuándo considerarlas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Valorar la necesidad de interconsulta médica especializada según hallazgos clínicos</li>
          <li>Considerar estudios complementarios (ecografía, resonancia) en casos sin progresión adecuada</li>
          <li>Monitorizar respuesta al tratamiento con reevaluaciones regulares usando el SPADI</li>
          <li>Considerar la influencia de factores sistémicos (inflamatorios, metabólicos) en casos refractarios</li>
          <li>Evaluar estrategias de manejo del dolor adicionales en casos de dolor persistente</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('spadi-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('spadi-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el Índice de Discapacidad de Oswestry (ODI)
function calcularOswestry() {
  console.log("Calculando Índice de Oswestry...");
  
  // Obtener todas las preguntas del Oswestry
  const items = [
    document.querySelector('input[name="oswestry_item1"]:checked'),
    document.querySelector('input[name="oswestry_item2"]:checked'),
    document.querySelector('input[name="oswestry_item3"]:checked'),
    document.querySelector('input[name="oswestry_item4"]:checked'),
    document.querySelector('input[name="oswestry_item5"]:checked'),
    document.querySelector('input[name="oswestry_item6"]:checked'),
    document.querySelector('input[name="oswestry_item7"]:checked'),
    document.querySelector('input[name="oswestry_item8"]:checked'),
    document.querySelector('input[name="oswestry_item9"]:checked'),
    document.querySelector('input[name="oswestry_item10"]:checked')
  ];
  
  console.log("Items encontrados:", items);
  
  // Contar cuántas preguntas han sido respondidas
  const itemsRespondidos = items.filter(item => item !== null).length;
  console.log("Items respondidos:", itemsRespondidos);
  
  // Para un resultado válido, al menos 8 de 10 preguntas deben ser respondidas
  const respuestasMinimas = 8;
  
  // Si no se han contestado suficientes preguntas, actualizar el badge y salir
  if (itemsRespondidos < respuestasMinimas) {
    if (document.getElementById('oswestry-badge')) {
      document.getElementById('oswestry-badge').textContent = "No completado";
      document.getElementById('oswestry-badge').className = "resultado-badge no-completado";
    }
    
    // Actualizar mensajes de resultados
    if (document.getElementById('oswestry-interpretacion-total')) {
      document.getElementById('oswestry-interpretacion-total').textContent = "Complete al menos 8 preguntas";
    }
    if (document.getElementById('oswestry-interpretacion-clinica')) {
      document.getElementById('oswestry-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    if (document.getElementById('oswestry-recomendaciones')) {
      document.getElementById('oswestry-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Calcular la suma de los valores de las preguntas respondidas
  let suma = 0;
  items.forEach(item => {
    if (item !== null) {
      suma += parseInt(item.value);
    }
  });
  console.log("Suma de valores:", suma);
  
  // Calcular la puntuación máxima posible (5 puntos por cada pregunta respondida)
  const puntuacionMaxima = itemsRespondidos * 5;
  
  // Calcular el porcentaje de discapacidad
  const porcentajeDiscapacidad = (suma / puntuacionMaxima) * 100;
  const porcentajeRedondeado = Math.round(porcentajeDiscapacidad * 10) / 10; // Redondear a 1 decimal
  console.log("Porcentaje de discapacidad:", porcentajeRedondeado);
  
  // Determinar el nivel de discapacidad
  let nivelDiscapacidad = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (porcentajeRedondeado < 21) {
    nivelDiscapacidad = "Discapacidad mínima";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (porcentajeRedondeado < 41) {
    nivelDiscapacidad = "Discapacidad moderada";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else if (porcentajeRedondeado < 61) {
    nivelDiscapacidad = "Discapacidad severa";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  } else if (porcentajeRedondeado < 81) {
    nivelDiscapacidad = "Discapacidad muy severa";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  } else {
    nivelDiscapacidad = "Discapacidad extrema";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('oswestry-valor-total')) {
    document.getElementById('oswestry-valor-total').textContent = suma + "/" + puntuacionMaxima;
  }
  
  if (document.getElementById('oswestry-valor-porcentaje')) {
    document.getElementById('oswestry-valor-porcentaje').textContent = porcentajeRedondeado.toFixed(1) + "%";
  }
  
  if (document.getElementById('oswestry-nivel-discapacidad')) {
    document.getElementById('oswestry-nivel-discapacidad').textContent = nivelDiscapacidad;
  }
  
  if (document.getElementById('oswestry-interpretacion-total')) {
    document.getElementById('oswestry-interpretacion-total').textContent = nivelDiscapacidad;
    document.getElementById('oswestry-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('oswestry-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Actualizar estado del badge
  if (document.getElementById('oswestry-badge')) {
    document.getElementById('oswestry-badge').textContent = nivelDiscapacidad;
    document.getElementById('oswestry-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (porcentajeRedondeado < 21) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación ODI de <strong>${porcentajeRedondeado.toFixed(1)}%</strong>, lo que indica <strong>discapacidad mínima</strong> por dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Puede realizar la mayoría de las actividades de su vida diaria sin restricciones significativas</li>
        <li>Experimenta dolor lumbar, pero este no interfiere de manera importante con su funcionalidad</li>
        <li>Es probable que presente limitaciones menores solo en actividades específicas de alta demanda para la columna lumbar</li>
        <li>No requiere intervenciones extensivas, aunque se beneficiará de recomendaciones preventivas</li>
        <li>Tiene buen pronóstico para recuperación completa con intervenciones adecuadas</li>
      </ul>
    `;
  } else if (porcentajeRedondeado < 41) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación ODI de <strong>${porcentajeRedondeado.toFixed(1)}%</strong>, lo que indica <strong>discapacidad moderada</strong> por dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta dificultades para algunas actividades de la vida diaria como sentarse, levantarse, y posiblemente para actividades laborales</li>
        <li>Experimenta dolor significativo que interfiere con su funcionalidad en múltiples aspectos</li>
        <li>Puede presentar limitaciones para viajar, levantar objetos, y posiblemente para el cuidado personal</li>
        <li>Es posible que presente alteraciones del sueño y restricciones en su vida social</li>
        <li>Requiere un enfoque terapéutico estructurado para mejorar su funcionalidad y reducir el dolor</li>
        <li>Puede presentar comportamientos de evitación de movimientos debido al dolor</li>
      </ul>
    `;
  } else if (porcentajeRedondeado < 61) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación ODI de <strong>${porcentajeRedondeado.toFixed(1)}%</strong>, lo que indica <strong>discapacidad severa</strong> por dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta limitaciones importantes en múltiples aspectos de su vida diaria</li>
        <li>El dolor lumbar es intenso y constituye el problema principal que afecta todas las áreas de la vida</li>
        <li>Tiene dificultades significativas con actividades básicas como el cuidado personal, dormir, sentarse y estar de pie</li>
        <li>Su vida social está considerablemente restringida debido al dolor</li>
        <li>Puede presentar signos de deterioro físico por inactividad y desacondicionamiento</li>
        <li>Probablemente ha desarrollado estrategias de afrontamiento mal adaptativas y patrones de movimiento disfuncionales</li>
        <li>Requiere un abordaje multidisciplinario para manejar la condición</li>
      </ul>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación ODI de <strong>${porcentajeRedondeado.toFixed(1)}%</strong>, lo que indica <strong>${nivelDiscapacidad}</strong> por dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta limitaciones extremadamente severas en prácticamente todas las áreas funcionales</li>
        <li>El dolor es incapacitante y domina todos los aspectos de su vida</li>
        <li>Tiene dificultades significativas incluso para actividades básicas de autocuidado</li>
        <li>Su movilidad está severamente comprometida, posiblemente requiriendo ayudas para desplazarse</li>
        <li>Presenta alteraciones importantes del sueño, estado de ánimo y calidad de vida</li>
        <li>Es probable que tenga dependencia de medicación analgésica</li>
        <li>Puede presentar factores psicosociales significativos que complican el cuadro</li>
        <li>Requiere un abordaje multidisciplinario intensivo y posiblemente consideración de intervenciones especializadas</li>
      </ul>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (porcentajeRedondeado < 21) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica para identificar factores contribuyentes específicos</li>
          <li>Análisis de la postura y patrones de movimiento específicos</li>
          <li>Valoración del control motor de la región lumbopélvica</li>
          <li>Evaluación ergonómica de actividades laborales y recreativas</li>
          <li>Identificación de factores de riesgo para cronicidad</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Ejercicios específicos para mejorar el control motor lumbopélvico (nivel de evidencia 1A)</li>
          <li>Terapia manual según hallazgos biomecánicos específicos (nivel de evidencia 1B)</li>
          <li>Programa de ejercicio terapéutico enfocado en estabilización y fortalecimiento (nivel de evidencia 1A)</li>
          <li>Corrección de patrones de movimiento disfuncionales (nivel de evidencia 1B)</li>
          <li>Ejercicios de extensibilidad para grupos musculares específicos si es necesario (nivel de evidencia 1B)</li>
          <li>Reentrenamiento postural específico para actividades cotidianas (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre anatomía y biomecánica básica de la columna lumbar</li>
          <li>Recomendaciones ergonómicas para actividades específicas</li>
          <li>Estrategias de autogestión y autocuidado</li>
          <li>Importancia de mantener actividad física regular y evitar el reposo prolongado</li>
          <li>Técnicas de protección articular para actividades de mayor carga</li>
          <li>Reconocimiento temprano de señales de alerta y estrategias preventivas</li>
        </ul>
      </div>
    `;
  } else if (porcentajeRedondeado < 41) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica completa de la región lumbopélvica y cadena cinética relacionada</li>
          <li>Valoración detallada del control motor y estabilidad dinámica</li>
          <li>Análisis de patrones de movimiento y compensaciones</li>
          <li>Evaluación de factores musculares: fuerza, resistencia, flexibilidad</li>
          <li>Evaluación del impacto funcional en actividades cotidianas y laborales</li>
          <li>Identificación de factores perpetuantes y barreras para la recuperación</li>
          <li>Valoración de creencias y comportamientos asociados al dolor</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa multimodal que combine terapia manual y ejercicio terapéutico (nivel de evidencia 1A)</li>
          <li>Ejercicios de control motor progresivos para la región lumbopélvica (nivel de evidencia 1A)</li>
          <li>Programa graduado de fortalecimiento específico (nivel de evidencia 1A)</li>
          <li>Reeducación postural y de patrones de movimiento (nivel de evidencia 1B)</li>
          <li>Ejercicios funcionales relacionados con actividades específicas (nivel de evidencia 1A)</li>
          <li>Técnicas de desensibilización si hay hiperalgesia localizada (nivel de evidencia 1B)</li>
          <li>Entrenamiento en estrategias activas de afrontamiento (nivel de evidencia 1A)</li>
          <li>Terapia manual específica para disfunciones articulares identificadas (nivel de evidencia 1B)</li>
          <li>Ejercicios de resistencia cardiovascular adaptados (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación en neurociencia del dolor para modificar creencias mal adaptativas</li>
          <li>Estrategias de autogestión activa del dolor</li>
          <li>Pacing de actividades y técnicas de conservación de energía</li>
          <li>Modificaciones ergonómicas en el entorno laboral y doméstico</li>
          <li>Importancia de la adherencia al ejercicio terapéutico</li>
          <li>Técnicas de protección articular para actividades de mayor demanda</li>
          <li>Reducción del miedo al movimiento y promoción de actividad física regular</li>
          <li>Reconocimiento y manejo de exacerbaciones</li>
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional completa: física, funcional y psicosocial</li>
          <li>Valoración específica de banderas amarillas, azules y negras</li>
          <li>Evaluación de comorbilidades y su impacto en la presentación clínica</li>
          <li>Análisis de factores de sensibilización central y periférica</li>
          <li>Evaluación del impacto en la calidad de vida y roles sociales</li>
          <li>Valoración de estrategias de afrontamiento y recursos de apoyo</li>
          <li>Identificación de barreras específicas para la recuperación funcional</li>
          <li>Considerar estudios complementarios o interconsultas según los hallazgos (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Abordaje multidisciplinario coordinado (nivel de evidencia 1A)</li>
          <li>Programa de ejercicio terapéutico con progresión muy gradual y supervisada (nivel de evidencia 1A)</li>
          <li>Terapia manual adaptada a la tolerancia del paciente (nivel de evidencia 1B)</li>
          <li>Estrategias de manejo del dolor multimodales (nivel de evidencia 1A)</li>
          <li>Intervenciones cognitivo-conductuales para el manejo del dolor (nivel de evidencia 1A)</li>
          <li>Exposición gradual a actividades evitadas por miedo (nivel de evidencia 1A)</li>
          <li>Reeducación neuromuscular y propioceptiva (nivel de evidencia 1B)</li>
          <li>Entrenamiento específico para actividades funcionales prioritarias (nivel de evidencia 1A)</li>
          <li>Estrategias de regulación del sistema nervioso autonómico (nivel de evidencia 1B)</li>
          <li>Considerar ayudas técnicas temporales según necesidades específicas (nivel de evidencia 2A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación intensiva en neurociencia del dolor</li>
          <li>Estrategias avanzadas de autogestión del dolor crónico</li>
          <li>Expectativas realistas y establecimiento de objetivos funcionales graduales</li>
          <li>Técnicas de conservación de energía y protección articular</li>
          <li>Importancia del sueño y estrategias para su mejora</li>
          <li>Técnicas de regulación emocional y manejo del estrés</li>
          <li>Participación activa en el proceso de rehabilitación</li>
          <li>Estrategias para mantener roles sociales significativos</li>
          <li>Plan de manejo de exacerbaciones y crisis</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Valorar la necesidad de interconsulta con especialistas según hallazgos clínicos</li>
          <li>Considerar enfoque interdisciplinar que incluya psicología del dolor</li>
          <li>Monitorización regular del progreso con ajustes al plan terapéutico</li>
          <li>Enfoque biopsicosocial integral para el manejo a largo plazo</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('oswestry-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('oswestry-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el Cuestionario de Discapacidad de Roland Morris (RMDQ)
function calcularRolandMorris() {
  console.log("Calculando Roland Morris...");
  
  // Obtener todos los ítems del cuestionario
  let puntuacionTotal = 0;
  let itemsMarcados = 0;
  let interaccionUsuario = false;
  
  // Contar los ítems marcados (cada ítem marcado vale 1 punto)
  for (let i = 1; i <= 24; i++) {
    const item = document.getElementById(`rolandmorris_item${i}`);
    if (item) {
      // Verificar si el usuario ha interactuado con el cuestionario
      if (item.checked) {
        puntuacionTotal++;
        itemsMarcados++;
        interaccionUsuario = true;
      }
    }
  }
  
  console.log("Items marcados:", itemsMarcados);
  console.log("Puntuación total:", puntuacionTotal);
  console.log("Interacción usuario:", interaccionUsuario);
  
  // Si el usuario no ha interactuado con el cuestionario, mostramos "No completado"
  if (!interaccionUsuario) {
    if (document.getElementById('rolandmorris-badge')) {
      document.getElementById('rolandmorris-badge').textContent = "No completado";
      document.getElementById('rolandmorris-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('rolandmorris-interpretacion-total')) {
      document.getElementById('rolandmorris-interpretacion-total').textContent = "Complete el cuestionario";
    }
    
    if (document.getElementById('rolandmorris-interpretacion-clinica')) {
      document.getElementById('rolandmorris-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    
    if (document.getElementById('rolandmorris-recomendaciones')) {
      document.getElementById('rolandmorris-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Calcular el porcentaje (sobre 24 puntos posibles)
  const porcentaje = (puntuacionTotal / 24) * 100;
  const porcentajeRedondeado = Math.round(porcentaje * 10) / 10; // Redondear a 1 decimal
  
  // Determinar el nivel de discapacidad
  let nivelDiscapacidad = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (puntuacionTotal <= 6) {
    nivelDiscapacidad = "Discapacidad leve";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (puntuacionTotal <= 12) {
    nivelDiscapacidad = "Discapacidad moderada";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else {
    nivelDiscapacidad = "Discapacidad severa";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('rolandmorris-valor-total')) {
    document.getElementById('rolandmorris-valor-total').textContent = puntuacionTotal + "/24";
  }
  
  if (document.getElementById('rolandmorris-valor-porcentaje')) {
    document.getElementById('rolandmorris-valor-porcentaje').textContent = porcentajeRedondeado.toFixed(1) + "%";
  }
  
  if (document.getElementById('rolandmorris-nivel-discapacidad')) {
    document.getElementById('rolandmorris-nivel-discapacidad').textContent = nivelDiscapacidad;
  }
  
  if (document.getElementById('rolandmorris-interpretacion-total')) {
    document.getElementById('rolandmorris-interpretacion-total').textContent = nivelDiscapacidad;
    document.getElementById('rolandmorris-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar estado del badge
  if (document.getElementById('rolandmorris-badge')) {
    // Siempre se considera completado, incluso si la puntuación es 0, porque es una respuesta válida
    document.getElementById('rolandmorris-badge').textContent = nivelDiscapacidad;
    document.getElementById('rolandmorris-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('rolandmorris-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (puntuacionTotal <= 6) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/24</strong> (${porcentajeRedondeado.toFixed(1)}%) en el Cuestionario de Discapacidad de Roland Morris, lo que indica <strong>discapacidad leve</strong> por dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta algunas limitaciones funcionales específicas, pero puede realizar la mayoría de sus actividades cotidianas</li>
        <li>Es probable que experimente dolor lumbar de intensidad leve a moderada que no interfiere significativamente con su funcionalidad general</li>
        <li>Puede presentar dificultades principalmente con actividades que implican posturas o esfuerzos específicos</li>
        <li>Mantiene su independencia en actividades de autocuidado y vida diaria</li>
        <li>Es probable que responda bien a intervenciones conservadoras dirigidas a factores biomecánicos específicos</li>
        <li>Tiene buen pronóstico para resolución o mejora sustancial con intervención apropiada</li>
      </ul>
    `;
  } else if (puntuacionTotal <= 12) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/24</strong> (${porcentajeRedondeado.toFixed(1)}%) en el Cuestionario de Discapacidad de Roland Morris, lo que indica <strong>discapacidad moderada</strong> por dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta limitaciones funcionales significativas en varias actividades de la vida diaria</li>
        <li>Presenta dificultades con actividades como sentarse, levantarse, caminar distancias moderadas o realizar tareas domésticas</li>
        <li>Es probable que haya desarrollado adaptaciones y compensaciones para manejar sus actividades cotidianas</li>
        <li>Puede tener alteraciones del sueño, cambios en su movilidad y limitaciones en algunas actividades sociales o recreativas</li>
        <li>Posiblemente presente signos de desacondicionamiento físico secundario a la limitación funcional</li>
        <li>Puede estar desarrollando patrones de evitación de movimiento por temor al dolor</li>
        <li>Requiere un enfoque terapéutico estructurado y multimodal</li>
      </ul>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/24</strong> (${porcentajeRedondeado.toFixed(1)}%) en el Cuestionario de Discapacidad de Roland Morris, lo que indica <strong>discapacidad severa</strong> por dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta limitaciones funcionales importantes que afectan la mayoría de las actividades cotidianas</li>
        <li>Presenta dificultades significativas para actividades básicas como vestirse, moverse en la cama, sentarse y estar de pie</li>
        <li>Probablemente requiere ayuda para algunas actividades de autocuidado o movilidad</li>
        <li>Muestra patrones evidentes de evitación del movimiento y comportamientos protectores</li>
        <li>Es probable que presente alteraciones significativas del sueño y posiblemente cambios en el estado de ánimo</li>
        <li>Puede haber desarrollado desacondicionamiento físico importante</li>
        <li>Es posible que presente factores psicosociales significativos que complican el cuadro</li>
        <li>Requiere un abordaje interdisciplinario intensivo</li>
        ${puntuacionTotal >= 18 ? '<li>La severidad de la discapacidad sugiere la necesidad de evaluar posibles complicaciones o comorbilidades que puedan estar contribuyendo al cuadro</li>' : ''}
      </ul>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntuacionTotal <= 6) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica detallada para identificar factores contribuyentes específicos</li>
          <li>Valoración de patrones de movimiento y postura en actividades específicas que desencadenan síntomas</li>
          <li>Análisis del control motor lumbopélvico</li>
          <li>Evaluación de la activación muscular y potenciales desequilibrios</li>
          <li>Análisis ergonómico de actividades laborales y recreativas</li>
          <li>Identificación de factores predisponentes y perpetuantes</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Ejercicios específicos de control motor lumbopélvico (nivel de evidencia 1A)</li>
          <li>Terapia manual según hallazgos biomecánicos específicos (nivel de evidencia 1B)</li>
          <li>Programa de ejercicio terapéutico específico para corregir desequilibrios identificados (nivel de evidencia 1A)</li>
          <li>Corrección de patrones de movimiento disfuncionales (nivel de evidencia 1B)</li>
          <li>Técnicas de liberación miofascial según necesidad (nivel de evidencia 1B)</li>
          <li>Educación postural específica para actividades problemáticas (nivel de evidencia 1B)</li>
          <li>Reentrenamiento propioceptivo y de conciencia corporal (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre biomecánica básica de la columna lumbar</li>
          <li>Principios de protección articular durante actividades cotidianas</li>
          <li>Recomendaciones ergonómicas específicas para actividades problemáticas</li>
          <li>Importancia de mantener actividad física regular y evitar el reposo prolongado</li>
          <li>Estrategias de autogestión y autocuidado</li>
          <li>Programa de ejercicios domiciliarios específicos</li>
          <li>Reconocimiento temprano de signos de alerta y manejo de exacerbaciones</li>
        </ul>
      </div>
    `;
  } else if (puntuacionTotal <= 12) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica integral de la región lumbopélvica y cadena cinética relacionada</li>
          <li>Valoración detallada del control motor y patrones de activación muscular</li>
          <li>Análisis de patrones compensatorios desarrollados</li>
          <li>Evaluación de factores musculares: fuerza, resistencia, flexibilidad</li>
          <li>Evaluación del impacto funcional en actividades cotidianas</li>
          <li>Identificación de factores perpetuantes</li>
          <li>Valoración de creencias y comportamientos asociados al dolor</li>
          <li>Evaluación de factores de riesgo para cronicidad</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa multimodal combinando terapia manual y ejercicio terapéutico (nivel de evidencia 1A)</li>
          <li>Ejercicios progresivos de control motor lumbopélvico (nivel de evidencia 1A)</li>
          <li>Reentrenamiento de patrones funcionales de movimiento (nivel de evidencia 1A)</li>
          <li>Fortalecimiento específico de musculatura deficitaria (nivel de evidencia 1A)</li>
          <li>Programa de ejercicio cardiovascular adaptado (nivel de evidencia 1A)</li>
          <li>Técnicas de desensibilización para áreas hipersensibles (nivel de evidencia 1B)</li>
          <li>Estrategias de exposición gradual a actividades temidas (nivel de evidencia 1A)</li>
          <li>Técnicas de liberación miofascial y movilización articular (nivel de evidencia 1B)</li>
          <li>Ejercicios funcionales relacionados con actividades específicas limitadas (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación en neurociencia del dolor para modificar creencias erróneas</li>
          <li>Estrategias activas de afrontamiento del dolor</li>
          <li>Pacing de actividades y técnicas de conservación de energía</li>
          <li>Modificaciones ergonómicas en entorno laboral y doméstico</li>
          <li>Importancia de la adherencia al programa de ejercicios</li>
          <li>Estrategias para reducir el miedo al movimiento</li>
          <li>Técnicas de autogestión para manejar exacerbaciones</li>
          <li>Importancia del sueño y estrategias para mejorarlo</li>
          <li>Plan progresivo para retomar actividades funcionales</li>
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional biopsicosocial completa</li>
          <li>Valoración específica de factores de sensibilización central y periférica</li>
          <li>Evaluación de comorbilidades y factores contribuyentes</li>
          <li>Análisis de impacto en calidad de vida y roles sociales</li>
          <li>Identificación de barreras específicas para la recuperación funcional</li>
          <li>Valoración de factores psicosociales y estado emocional</li>
          <li>Evaluación de estrategias de afrontamiento y recursos de apoyo</li>
          <li>Considerar evaluación de banderas amarillas, azules y negras</li>
          <li>Evaluar posibles indicaciones para estudios complementarios o interconsultas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Abordaje interdisciplinario coordinado (nivel de evidencia 1A)</li>
          <li>Programa de ejercicio terapéutico con progresión muy gradual y supervisada (nivel de evidencia 1A)</li>
          <li>Estrategias de manejo del dolor multimodales (nivel de evidencia 1A)</li>
          <li>Terapia manual adaptada a la tolerancia del paciente (nivel de evidencia 1B)</li>
          <li>Entrenamiento en actividades funcionales específicas prioritarias (nivel de evidencia 1A)</li>
          <li>Intervenciones para mejorar la calidad del sueño (nivel de evidencia 1B)</li>
          <li>Técnicas de exposición gradual para actividades evitadas (nivel de evidencia 1A)</li>
          <li>Estrategias de autorregulación del sistema nervioso (nivel de evidencia 1B)</li>
          <li>Abordaje específico de factores psicosociales identificados (nivel de evidencia 1A)</li>
          <li>Considerar intervenciones para mejorar estado de ánimo cuando sea necesario (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación intensiva en neurociencia del dolor</li>
          <li>Estrategias avanzadas de autogestión del dolor crónico</li>
          <li>Importancia del enfoque activo en el proceso de rehabilitación</li>
          <li>Establecimiento de expectativas realistas y objetivos funcionales graduales</li>
          <li>Técnicas de conservación de energía y pacing de actividades</li>
          <li>Estrategias para mejorar la calidad del sueño</li>
          <li>Técnicas de regulación emocional y manejo del estrés</li>
          <li>Importancia de mantener roles sociales significativos</li>
          <li>Plan de manejo de exacerbaciones</li>
          <li>Reconceptualización de la relación con el dolor</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Valorar la necesidad de interconsulta con otros especialistas según hallazgos clínicos</li>
          <li>Considerar enfoque interdisciplinar que incluya psicología del dolor en casos complejos</li>
          <li>Monitorización regular del progreso con ajustes al plan terapéutico</li>
          <li>Enfoque biopsicosocial integral para el manejo a largo plazo</li>
          <li>Evaluar necesidad de adaptaciones temporales en entorno laboral o doméstico</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('rolandmorris-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('rolandmorris-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el Índice WOMAC (Western Ontario and McMaster Universities Osteoarthritis Index)
function calcularWOMAC() {
  console.log("Calculando WOMAC...");
  
  // Definir secciones del cuestionario
  const seccionDolor = ["womac_a1", "womac_a2", "womac_a3", "womac_a4", "womac_a5"];
  const seccionRigidez = ["womac_b1", "womac_b2"];
  const seccionFuncion = [
    "womac_c1", "womac_c2", "womac_c3", "womac_c4", "womac_c5", 
    "womac_c6", "womac_c7", "womac_c8", "womac_c9", "womac_c10", 
    "womac_c11", "womac_c12", "womac_c13", "womac_c14", "womac_c15", 
    "womac_c16", "womac_c17"
  ];
  
  // Función para obtener el valor de un ítem
  function getItemValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? parseInt(radio.value) : null;
  }
  
  // Calcular puntuaciones por sección
  let puntuacionDolor = 0;
  let itemsDolor = 0;
  seccionDolor.forEach(item => {
    const valor = getItemValue(item);
    if (valor !== null) {
      puntuacionDolor += valor;
      itemsDolor++;
    }
  });
  
  let puntuacionRigidez = 0;
  let itemsRigidez = 0;
  seccionRigidez.forEach(item => {
    const valor = getItemValue(item);
    if (valor !== null) {
      puntuacionRigidez += valor;
      itemsRigidez++;
    }
  });
  
  let puntuacionFuncion = 0;
  let itemsFuncion = 0;
  seccionFuncion.forEach(item => {
    const valor = getItemValue(item);
    if (valor !== null) {
      puntuacionFuncion += valor;
      itemsFuncion++;
    }
  });
  
  // Calcular total de ítems respondidos
  const totalItems = itemsDolor + itemsRigidez + itemsFuncion;
  console.log("Total de ítems respondidos:", totalItems);
  
  // Verificar si hay suficientes ítems respondidos (al menos el 80% = 20 de 24 ítems)
  const respuestasMinimas = 20;
  const interaccionUsuario = totalItems >= 1; // Al menos 1 ítem respondido para considerar interacción
  
  // Si el usuario no ha interactuado con el cuestionario o no hay suficientes respuestas, mostramos "No completado"
  if (!interaccionUsuario) {
    if (document.getElementById('womac-badge')) {
      document.getElementById('womac-badge').textContent = "No completado";
      document.getElementById('womac-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('womac-interpretacion-total')) {
      document.getElementById('womac-interpretacion-total').textContent = "Complete el cuestionario";
    }
    
    if (document.getElementById('womac-interpretacion-clinica')) {
      document.getElementById('womac-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    
    if (document.getElementById('womac-recomendaciones')) {
      document.getElementById('womac-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Si no hay suficientes respuestas, indicarlo pero mostrar resultados parciales
  let mensajeCompletado = "";
  if (totalItems < respuestasMinimas) {
    mensajeCompletado = "Cuestionario incompleto (menos del 80% de preguntas). Los resultados pueden no ser confiables.";
  }
  
  // Cálculo de puntuaciones finales y normalizadas (0-100%)
  const puntuacionTotal = puntuacionDolor + puntuacionRigidez + puntuacionFuncion;
  
  // WOMAC tiene un total posible de 96 puntos (5 ítems de dolor x 4 = 20, 2 ítems de rigidez x 4 = 8, 17 ítems de función x 4 = 68)
  const maxPuntuacionDolor = 20;
  const maxPuntuacionRigidez = 8;
  const maxPuntuacionFuncion = 68;
  const maxPuntuacionTotal = 96;
  
  // Normalizar puntuaciones para comparabilidad entre subescalas (0-100%)
  const porcentajeDolor = (puntuacionDolor / (itemsDolor * 4)) * 100; // Cada ítem tiene valor máximo de 4
  const porcentajeRigidez = (puntuacionRigidez / (itemsRigidez * 4)) * 100;
  const porcentajeFuncion = (puntuacionFuncion / (itemsFuncion * 4)) * 100;
  const porcentajeTotal = (puntuacionTotal / ((itemsDolor + itemsRigidez + itemsFuncion) * 4)) * 100;
  
  console.log("Puntuación dolor:", puntuacionDolor, `(${porcentajeDolor.toFixed(1)}%)`);
  console.log("Puntuación rigidez:", puntuacionRigidez, `(${porcentajeRigidez.toFixed(1)}%)`);
  console.log("Puntuación función:", puntuacionFuncion, `(${porcentajeFuncion.toFixed(1)}%)`);
  console.log("Puntuación total:", puntuacionTotal, `(${porcentajeTotal.toFixed(1)}%)`);
  
  // Determinar el nivel de afectación basado en el porcentaje total
  let nivelAfectacion = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (porcentajeTotal < 30) {
    nivelAfectacion = "Afectación leve";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (porcentajeTotal < 60) {
    nivelAfectacion = "Afectación moderada";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else {
    nivelAfectacion = "Afectación severa";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('womac-valor-total')) {
    document.getElementById('womac-valor-total').textContent = `${puntuacionTotal}/${totalItems * 4} (${porcentajeTotal.toFixed(1)}%)`;
  }
  
  if (document.getElementById('womac-valor-dolor')) {
    document.getElementById('womac-valor-dolor').textContent = `${puntuacionDolor}/${itemsDolor * 4} (${porcentajeDolor.toFixed(1)}%)`;
  }
  
  if (document.getElementById('womac-valor-rigidez')) {
    document.getElementById('womac-valor-rigidez').textContent = `${puntuacionRigidez}/${itemsRigidez * 4} (${porcentajeRigidez.toFixed(1)}%)`;
  }
  
  if (document.getElementById('womac-valor-funcion')) {
    document.getElementById('womac-valor-funcion').textContent = `${puntuacionFuncion}/${itemsFuncion * 4} (${porcentajeFuncion.toFixed(1)}%)`;
  }
  
  if (document.getElementById('womac-interpretacion-total')) {
    document.getElementById('womac-interpretacion-total').textContent = mensajeCompletado || nivelAfectacion;
    document.getElementById('womac-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar estado del badge
  if (document.getElementById('womac-badge')) {
    document.getElementById('womac-badge').textContent = nivelAfectacion;
    document.getElementById('womac-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('womac-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (porcentajeTotal < 30) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación WOMAC de <strong>${porcentajeTotal.toFixed(1)}%</strong>, lo que indica una <strong>afectación leve</strong> por osteoartritis.</p>
      <p>Análisis por subescalas:</p>
      <ul>
        <li><strong>Dolor:</strong> ${porcentajeDolor.toFixed(1)}% - ${porcentajeDolor < 30 ? 'Leve' : porcentajeDolor < 60 ? 'Moderado' : 'Severo'}</li>
        <li><strong>Rigidez:</strong> ${porcentajeRigidez.toFixed(1)}% - ${porcentajeRigidez < 30 ? 'Leve' : porcentajeRigidez < 60 ? 'Moderada' : 'Severa'}</li>
        <li><strong>Función física:</strong> ${porcentajeFuncion.toFixed(1)}% - ${porcentajeFuncion < 30 ? 'Limitación leve' : porcentajeFuncion < 60 ? 'Limitación moderada' : 'Limitación severa'}</li>
      </ul>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta síntomas leves de osteoartritis que tienen un impacto limitado en sus actividades diarias</li>
        <li>Experimenta dolor ocasional, generalmente relacionado con actividades específicas</li>
        <li>Presenta rigidez articular de baja intensidad, principalmente al inicio del movimiento</li>
        <li>Mantiene buena funcionalidad para la mayoría de actividades cotidianas</li>
        <li>Es probable que responda bien a medidas conservadoras como ejercicio terapéutico y educación</li>
        <li>Tiene buen pronóstico para el mantenimiento de su función con intervención adecuada</li>
      </ul>
    `;
  } else if (porcentajeTotal < 60) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación WOMAC de <strong>${porcentajeTotal.toFixed(1)}%</strong>, lo que indica una <strong>afectación moderada</strong> por osteoartritis.</p>
      <p>Análisis por subescalas:</p>
      <ul>
        <li><strong>Dolor:</strong> ${porcentajeDolor.toFixed(1)}% - ${porcentajeDolor < 30 ? 'Leve' : porcentajeDolor < 60 ? 'Moderado' : 'Severo'}</li>
        <li><strong>Rigidez:</strong> ${porcentajeRigidez.toFixed(1)}% - ${porcentajeRigidez < 30 ? 'Leve' : porcentajeRigidez < 60 ? 'Moderada' : 'Severa'}</li>
        <li><strong>Función física:</strong> ${porcentajeFuncion.toFixed(1)}% - ${porcentajeFuncion < 30 ? 'Limitación leve' : porcentajeFuncion < 60 ? 'Limitación moderada' : 'Limitación severa'}</li>
      </ul>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta síntomas significativos de osteoartritis que impactan en su calidad de vida</li>
        <li>Presenta dolor moderado que puede limitar algunas actividades cotidianas</li>
        <li>Tiene rigidez articular que afecta su movilidad, especialmente al inicio del movimiento</li>
        <li>Muestra limitaciones funcionales para actividades como subir/bajar escaleras, caminar distancias prolongadas o realizar tareas domésticas pesadas</li>
        <li>Probablemente ha desarrollado estrategias compensatorias para mantener sus actividades diarias</li>
        <li>Requiere un programa de intervención estructurado para optimizar su función y controlar los síntomas</li>
      </ul>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación WOMAC de <strong>${porcentajeTotal.toFixed(1)}%</strong>, lo que indica una <strong>afectación severa</strong> por osteoartritis.</p>
      <p>Análisis por subescalas:</p>
      <ul>
        <li><strong>Dolor:</strong> ${porcentajeDolor.toFixed(1)}% - ${porcentajeDolor < 30 ? 'Leve' : porcentajeDolor < 60 ? 'Moderado' : 'Severo'}</li>
        <li><strong>Rigidez:</strong> ${porcentajeRigidez.toFixed(1)}% - ${porcentajeRigidez < 30 ? 'Leve' : porcentajeRigidez < 60 ? 'Moderada' : 'Severa'}</li>
        <li><strong>Función física:</strong> ${porcentajeFuncion.toFixed(1)}% - ${porcentajeFuncion < 30 ? 'Limitación leve' : porcentajeFuncion < 60 ? 'Limitación moderada' : 'Limitación severa'}</li>
      </ul>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta síntomas severos de osteoartritis con impacto significativo en su calidad de vida</li>
        <li>Presenta dolor intenso que interfiere con actividades básicas de la vida diaria</li>
        <li>Tiene rigidez articular importante que limita considerablemente su movilidad</li>
        <li>Muestra limitaciones funcionales severas para múltiples actividades cotidianas como subir/bajar escaleras, ponerse calcetines, entrar/salir de la bañera, etc.</li>
        <li>Probablemente requiere adaptaciones significativas o asistencia para algunas actividades</li>
        <li>Puede haber desarrollado desacondicionamiento físico secundario a la limitación funcional</li>
        <li>Necesita un abordaje multidisciplinario integral para optimizar su función y calidad de vida</li>
        ${porcentajeTotal > 80 ? '<li>La severidad de los síntomas sugiere valorar opciones de intervención avanzadas, incluyendo posibles opciones quirúrgicas si están indicadas</li>' : ''}
      </ul>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (porcentajeTotal < 30) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica detallada para identificar factores contribuyentes específicos</li>
          <li>Valoración de patrones de movimiento y alineación articular</li>
          <li>Análisis de la fuerza muscular y control motor periarticular</li>
          <li>Evaluación de la distribución de cargas durante actividades funcionales</li>
          <li>Valoración de factores modificables (peso, calzado, actividad física, etc.)</li>
          <li>Identificación de factores desencadenantes específicos del dolor</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa de ejercicio terapéutico enfocado en fortalecimiento periarticular (nivel de evidencia 1A)</li>
          <li>Ejercicios de control neuromuscular y propiocepción (nivel de evidencia 1B)</li>
          <li>Entrenamiento aeróbico de bajo impacto (nivel de evidencia 1A)</li>
          <li>Terapia manual según hallazgos biomecánicos específicos (nivel de evidencia 1B)</li>
          <li>Técnicas de movilización articular dentro de rangos indoloros (nivel de evidencia 1B)</li>
          <li>Educación sobre manejo de cargas articulares (nivel de evidencia 1A)</li>
          <li>Estrategias de autocuidado y autogestión (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Información sobre fisiopatología básica de la osteoartritis</li>
          <li>Importancia del ejercicio regular y gestión de peso</li>
          <li>Estrategias de protección articular durante actividades cotidianas</li>
          <li>Beneficios del ejercicio aeróbico de bajo impacto</li>
          <li>Técnicas de automovilización y ejercicios domiciliarios</li>
          <li>Manejo de la actividad física para optimizar el "dosis-respuesta"</li>
          <li>Reconocimiento y manejo de factores desencadenantes</li>
        </ul>
      </div>
    `;
  } else if (porcentajeTotal < 60) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica completa incluyendo articulaciones proximales y distales</li>
          <li>Valoración detallada de la fuerza, resistencia y control motor periarticular</li>
          <li>Análisis de compensaciones funcionales desarrolladas</li>
          <li>Evaluación de factores contribuyentes (peso, alineación, factores metabólicos)</li>
          <li>Valoración del impacto funcional en actividades cotidianas</li>
          <li>Identificación de barreras para la adherencia al ejercicio</li>
          <li>Análisis de patrones de dolor y factores desencadenantes</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa multimodal combinando ejercicio terapéutico y educación (nivel de evidencia 1A)</li>
          <li>Entrenamiento de fuerza progresivo para musculatura periarticular (nivel de evidencia 1A)</li>
          <li>Ejercicios de control neuromuscular y estabilidad dinámica (nivel de evidencia 1A)</li>
          <li>Programa de ejercicio aeróbico adaptado (nivel de evidencia 1A)</li>
          <li>Terapia manual para optimizar movilidad y reducir dolor (nivel de evidencia 1B)</li>
          <li>Técnicas de desensibilización para áreas hipersensibles (nivel de evidencia 1B)</li>
          <li>Entrenamiento funcional específico para actividades limitadas (nivel de evidencia 1A)</li>
          <li>Considerar órtesis o ayudas técnicas según necesidades individuales (nivel de evidencia 1B)</li>
          <li>Técnicas de manejo del dolor complementarias (TENS, termoterapia) (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación detallada sobre fisiopatología de la osteoartritis</li>
          <li>Estrategias activas de autogestión del dolor</li>
          <li>Técnicas de protección articular y conservación de energía</li>
          <li>Modificaciones ergonómicas en entorno doméstico y laboral</li>
          <li>Importancia de la adherencia al programa de ejercicios</li>
          <li>Manejo de expectativas y establecimiento de objetivos realistas</li>
          <li>Pacing de actividades para optimizar función y controlar síntomas</li>
          <li>Importancia del control de peso y nutrición adecuada</li>
          <li>Reconocimiento y manejo de exacerbaciones</li>
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional completa: física, funcional y psicosocial</li>
          <li>Valoración detallada del impacto en actividades de la vida diaria</li>
          <li>Análisis de barreras y facilitadores para la funcionalidad</li>
          <li>Evaluación de comorbilidades y su impacto en la presentación clínica</li>
          <li>Valoración de factores psicosociales asociados</li>
          <li>Identificación de recursos de apoyo y entorno social</li>
          <li>Evaluación de necesidades de adaptación del entorno</li>
          <li>Considerar valoración médica para opciones de tratamiento adicionales</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa multimodal intensivo con enfoque en función y control de síntomas (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico adaptado con progresión muy gradual (nivel de evidencia 1A)</li>
          <li>Fortalecimiento específico de musculatura periarticular con técnicas adaptadas (nivel de evidencia 1A)</li>
          <li>Entrenamiento de transferencias y movilidad funcional (nivel de evidencia 1A)</li>
          <li>Terapia manual cuidadosa para optimizar movilidad y reducir dolor (nivel de evidencia 1B)</li>
          <li>Técnicas avanzadas de manejo del dolor (nivel de evidencia 1A)</li>
          <li>Entrenamiento específico en actividades básicas prioritarias (nivel de evidencia 1A)</li>
          <li>Prescripción de órtesis, ayudas técnicas o adaptaciones (nivel de evidencia 1B)</li>
          <li>Técnicas de desensibilización y modulación del dolor (nivel de evidencia 1B)</li>
          <li>Considerar opciones terapéuticas adicionales en coordinación con equipo médico (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación integral sobre manejo de la osteoartritis avanzada</li>
          <li>Estrategias avanzadas de autogestión del dolor</li>
          <li>Técnicas específicas de protección articular y conservación de energía</li>
          <li>Adaptaciones del entorno doméstico para maximizar independencia</li>
          <li>Importancia del ejercicio adaptado incluso en fases avanzadas</li>
          <li>Manejo de expectativas y establecimiento de objetivos funcionales realistas</li>
          <li>Estrategias para mantener participación social e independencia</li>
          <li>Información sobre opciones terapéuticas avanzadas cuando estén indicadas</li>
          <li>Plan de manejo de crisis y exacerbaciones</li>
          <li>Recursos comunitarios de apoyo disponibles</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Valorar la necesidad de abordaje interdisciplinar</li>
          <li>Considerar derivación para evaluación de opciones terapéuticas avanzadas</li>
          <li>Monitorización regular del estado funcional y ajuste del plan terapéutico</li>
          <li>Implicar al entorno familiar/cuidadores en el proceso terapéutico</li>
          <li>Evaluar necesidades de adaptación del entorno doméstico y laboral</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('womac-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('womac-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el START MSK Tool (Stratified Targeted Treatment Tool for Musculoskeletal Conditions)
function calcularStartMSK() {
  console.log("Calculando START MSK Tool...");
  
  // Obtener todos los ítems del cuestionario
  const items = [
    document.querySelector('input[name="startmsk_item1"]:checked'),
    document.querySelector('input[name="startmsk_item2"]:checked'),
    document.querySelector('input[name="startmsk_item3"]:checked'),
    document.querySelector('input[name="startmsk_item4"]:checked'),
    document.querySelector('input[name="startmsk_item5"]:checked'),
    document.querySelector('input[name="startmsk_item6"]:checked'),
    document.querySelector('input[name="startmsk_item7"]:checked'),
    document.querySelector('input[name="startmsk_item8"]:checked'),
    document.querySelector('input[name="startmsk_item9"]:checked'),
    document.querySelector('input[name="startmsk_item10"]:checked')
  ];
  
  console.log("Items encontrados:", items);
  
  // Contar cuántas preguntas han sido respondidas
  const itemsRespondidos = items.filter(item => item !== null).length;
  console.log("Items respondidos:", itemsRespondidos);
  
  // Verificar si el usuario ha interactuado con el cuestionario
  const interaccionUsuario = itemsRespondidos > 0;
  
  // Si el usuario no ha interactuado con el cuestionario, mostramos "No completado"
  if (!interaccionUsuario) {
    if (document.getElementById('startmsk-badge')) {
      document.getElementById('startmsk-badge').textContent = "No completado";
      document.getElementById('startmsk-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('startmsk-interpretacion-total')) {
      document.getElementById('startmsk-interpretacion-total').textContent = "Complete el cuestionario";
    }
    
    if (document.getElementById('startmsk-interpretacion-clinica')) {
      document.getElementById('startmsk-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    
    if (document.getElementById('startmsk-recomendaciones')) {
      document.getElementById('startmsk-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Para un resultado válido, al menos 8 de 10 preguntas deben ser respondidas
  const respuestasMinimas = 8;
  
  // Si no se han contestado suficientes preguntas, advertir pero continuar calculando
  let mensajeCompletado = "";
  if (itemsRespondidos < respuestasMinimas) {
    mensajeCompletado = " (incompleto - los resultados pueden no ser confiables)";
  }
  
  // Calcular puntuaciones
  let puntuacionTotal = 0;
  let puntuacionFisica = 0;
  let puntuacionPsicosocial = 0;
  
  // Sumar valores de los ítems respondidos y dividir por categorías
  items.forEach((item, index) => {
    if (item !== null) {
      const valor = parseInt(item.value);
      puntuacionTotal += valor;
      
      // Los ítems 1-4 son físicos
      if (index < 4) {
        puntuacionFisica += valor;
      } 
      // Los ítems 5-10 son psicosociales
      else {
        puntuacionPsicosocial += valor;
      }
    }
  });
  
  console.log("Puntuación física:", puntuacionFisica);
  console.log("Puntuación psicosocial:", puntuacionPsicosocial);
  console.log("Puntuación total:", puntuacionTotal);
  
  // Determinar el nivel de riesgo basado en la puntuación total
  let nivelRiesgo = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (puntuacionTotal <= 3) {
    nivelRiesgo = "Riesgo bajo";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (puntuacionTotal <= 6) {
    nivelRiesgo = "Riesgo medio";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else {
    nivelRiesgo = "Riesgo alto";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Clasificación adicional basada en la subescala psicosocial
  let riesgoPsicosocial = puntuacionPsicosocial >= 4 ? "elevado" : "bajo";
  
  // Actualizar elementos en la página
  if (document.getElementById('startmsk-valor-total')) {
    document.getElementById('startmsk-valor-total').textContent = puntuacionTotal + "/10" + mensajeCompletado;
  }
  
  if (document.getElementById('startmsk-valor-fisica')) {
    document.getElementById('startmsk-valor-fisica').textContent = puntuacionFisica + "/4";
  }
  
  if (document.getElementById('startmsk-valor-psicosocial')) {
    document.getElementById('startmsk-valor-psicosocial').textContent = puntuacionPsicosocial + "/6 (" + riesgoPsicosocial + ")";
  }
  
  if (document.getElementById('startmsk-interpretacion-total')) {
    document.getElementById('startmsk-interpretacion-total').textContent = nivelRiesgo;
    document.getElementById('startmsk-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar estado del badge
  if (document.getElementById('startmsk-badge')) {
    document.getElementById('startmsk-badge').textContent = nivelRiesgo;
    document.getElementById('startmsk-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('startmsk-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (puntuacionTotal <= 3) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/10</strong> en el START MSK Tool, indicando un <strong>riesgo bajo</strong> de desarrollar dolor persistente y problemas funcionales a largo plazo.</p>
      <p>Puntuaciones por subescalas:</p>
      <ul>
        <li><strong>Subescala física:</strong> ${puntuacionFisica}/4 - ${puntuacionFisica <= 1 ? "Bajo impacto físico" : "Impacto físico moderado"}</li>
        <li><strong>Subescala psicosocial:</strong> ${puntuacionPsicosocial}/6 - ${riesgoPsicosocial === "elevado" ? "<span class='text-danger'>Riesgo psicosocial elevado</span>" : "Riesgo psicosocial bajo"}</li>
      </ul>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta un cuadro predominantemente biomecánico/nociceptivo</li>
        <li>Tiene bajos niveles de factores psicosociales de mal pronóstico</li>
        <li>Es probable que responda bien a un tratamiento fisioterapéutico estándar</li>
        <li>Tiene buen pronóstico para la recuperación con intervención adecuada</li>
        <li>Presenta pocos signos de sensibilización central o dolor generalizado</li>
        ${riesgoPsicosocial === "elevado" ? "<li>Sin embargo, presenta algunos factores psicosociales que deben ser monitorizados durante el tratamiento</li>" : ""}
      </ul>
    `;
  } else if (puntuacionTotal <= 6) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/10</strong> en el START MSK Tool, indicando un <strong>riesgo medio</strong> de desarrollar dolor persistente y problemas funcionales a largo plazo.</p>
      <p>Puntuaciones por subescalas:</p>
      <ul>
        <li><strong>Subescala física:</strong> ${puntuacionFisica}/4 - ${puntuacionFisica <= 1 ? "Bajo impacto físico" : puntuacionFisica <= 2 ? "Impacto físico moderado" : "Impacto físico significativo"}</li>
        <li><strong>Subescala psicosocial:</strong> ${puntuacionPsicosocial}/6 - ${riesgoPsicosocial === "elevado" ? "<span class='text-danger'>Riesgo psicosocial elevado</span>" : "Riesgo psicosocial bajo"}</li>
      </ul>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta una combinación de factores biomecánicos/nociceptivos y psicosociales</li>
        <li>${riesgoPsicosocial === "elevado" ? "Muestra factores psicosociales significativos que pueden complicar su recuperación" : "Presenta principalmente factores físicos que contribuyen a su condición"}</li>
        <li>Requiere un enfoque terapéutico que aborde tanto los aspectos físicos como los psicosociales</li>
        <li>Puede beneficiarse de una intervención más intensiva que el tratamiento estándar</li>
        <li>Podría mostrar signos tempranos de sensibilización o dolor más generalizado</li>
        <li>Es importante monitorizar la evolución y adaptar el tratamiento según la respuesta</li>
      </ul>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/10</strong> en el START MSK Tool, indicando un <strong>riesgo alto</strong> de desarrollar dolor persistente y problemas funcionales a largo plazo.</p>
      <p>Puntuaciones por subescalas:</p>
      <ul>
        <li><strong>Subescala física:</strong> ${puntuacionFisica}/4 - ${puntuacionFisica <= 2 ? "Impacto físico moderado" : "Impacto físico significativo"}</li>
        <li><strong>Subescala psicosocial:</strong> ${puntuacionPsicosocial}/6 - ${riesgoPsicosocial === "elevado" ? "<span class='text-danger'>Riesgo psicosocial elevado</span>" : "Riesgo psicosocial significativo a pesar de no alcanzar el umbral"}</li>
      </ul>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta una condición compleja con factores de riesgo significativos para cronificación</li>
        <li>Muestra una combinación de factores físicos y psicosociales que necesitan abordaje integrado</li>
        <li>Es probable que presente signos de sensibilización central o dolor generalizado</li>
        <li>Puede tener factores de catastrofización, miedo-evitación o ansiedad/depresión que complican el cuadro</li>
        <li>Requiere un abordaje multidisciplinar y estratificado para optimizar resultados</li>
        <li>Podría beneficiarse de una intervención psicológica específica como parte del tratamiento</li>
        <li>Necesita establecer objetivos realistas y un plan terapéutico a más largo plazo</li>
      </ul>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntuacionTotal <= 3) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica dirigida a la región afectada</li>
          <li>Identificación de factores contribuyentes biomecánicos específicos</li>
          <li>Valoración de patrones de movimiento y control motor</li>
          <li>Análisis de cargas y demandas funcionales</li>
          <li>Identificación de factores desencadenantes y perpetuantes</li>
          <li>Evaluación básica de factores ergonómicos y posturales</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Tratamiento fisioterapéutico estándar (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico dirigido a la disfunción específica (nivel de evidencia 1A)</li>
          <li>Terapia manual según hallazgos biomecánicos (nivel de evidencia 1B)</li>
          <li>Educación sobre el proceso de recuperación y autogestión (nivel de evidencia 1A)</li>
          <li>Corrección de patrones de movimiento alterados (nivel de evidencia 1B)</li>
          <li>Recomendaciones para mantener actividad física general (nivel de evidencia 1A)</li>
          ${riesgoPsicosocial === "elevado" ? "<li>Incluir componentes básicos para abordar factores psicosociales identificados (nivel de evidencia 1A)</li>" : ""}
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Explicación clara de la naturaleza del problema y su pronóstico favorable</li>
          <li>Importancia de mantener actividad física y evitar el reposo excesivo</li>
          <li>Estrategias de autocuidado y control de síntomas</li>
          <li>Reconocimiento y manejo de factores desencadenantes</li>
          <li>Establecimiento de expectativas realistas sobre el tiempo de recuperación</li>
          <li>Importancia de la adherencia al programa de ejercicios</li>
          ${riesgoPsicosocial === "elevado" ? "<li>Reconocimiento del impacto de los factores psicosociales en el dolor y la recuperación</li>" : ""}
        </ul>
      </div>
    `;
  } else if (puntuacionTotal <= 6) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica completa de la región afectada y áreas relacionadas</li>
          <li>Valoración específica de factores psicosociales identificados</li>
          <li>Análisis de factores funcionales y limitaciones en actividades</li>
          <li>Identificación de creencias y comportamientos relacionados con el dolor</li>
          <li>Evaluación de factores ergonómicos y ocupacionales</li>
          <li>Valoración de posibles signos de sensibilización</li>
          <li>Exploración de barreras potenciales para la recuperación</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Abordaje combinado físico y psicosocial (nivel de evidencia 1A)</li>
          <li>Programa de ejercicio terapéutico específico y progresivo (nivel de evidencia 1A)</li>
          <li>Terapia manual adaptada a los hallazgos específicos (nivel de evidencia 1B)</li>
          <li>Estrategias de control del dolor basadas en la neurociencia (nivel de evidencia 1A)</li>
          <li>Técnicas de exposición gradual a actividades temidas o evitadas (nivel de evidencia 1A)</li>
          <li>Reentrenamiento funcional para actividades específicas (nivel de evidencia 1A)</li>
          <li>Entrenamiento del control motor y estabilidad (nivel de evidencia 1B)</li>
          ${riesgoPsicosocial === "elevado" ? "<li>Incorporar elementos de intervención cognitivo-conductual para factores psicosociales (nivel de evidencia 1A)</li>" : ""}
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación en neurociencia del dolor para modificar creencias maladaptativas</li>
          <li>Explicación de la relación bidireccional entre factores físicos y psicosociales</li>
          <li>Estrategias de afrontamiento activo del dolor</li>
          <li>Técnicas de autogestión y resolución de problemas</li>
          <li>Importancia del pacing de actividades y conservación de energía</li>
          <li>Establecimiento de objetivos realistas a corto y medio plazo</li>
          <li>Reconocimiento y manejo de exacerbaciones</li>
          ${riesgoPsicosocial === "elevado" ? "<li>Estrategias específicas para manejar la ansiedad, catastrofización o miedo relacionados con el dolor</li>" : ""}
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional biopsicosocial completa</li>
          <li>Valoración detallada de factores psicosociales y su impacto en la funcionalidad</li>
          <li>Análisis de posibles mecanismos de sensibilización central</li>
          <li>Identificación de patrones de evitación y comportamientos maladaptativos</li>
          <li>Evaluación de impacto funcional en múltiples dimensiones de la vida</li>
          <li>Valoración de posibles comorbilidades y su influencia recíproca</li>
          <li>Exploración de factores contextuales y de soporte social</li>
          <li>Evaluación de calidad del sueño y su relación con los síntomas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Abordaje multidisciplinar coordinado (nivel de evidencia 1A)</li>
          <li>Programa integrado de fisioterapia con componentes cognitivo-conductuales (nivel de evidencia 1A)</li>
          <li>Exposición gradual y sistemática a actividades temidas (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico con progresión adaptada y enfoque funcional (nivel de evidencia 1A)</li>
          <li>Técnicas específicas para modulación del dolor (nivel de evidencia 1B)</li>
          <li>Estrategias de desensibilización para áreas hipersensibles (nivel de evidencia 1B)</li>
          <li>Intervenciones dirigidas al manejo del estrés y regulación emocional (nivel de evidencia 1A)</li>
          <li>Técnicas de control de la atención y mindfulness aplicado al dolor (nivel de evidencia 1A)</li>
          <li>Terapia manual como componente complementario, no central (nivel de evidencia 1B)</li>
          <li>Plan estructurado de retorno gradual a actividades funcionales (nivel de evidencia 1A)</li>
          <li>Considerar derivación a psicología para intervención específica si es necesario (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación intensiva en neurociencia del dolor y sensibilización central</li>
          <li>Reconceptualización del dolor y su significado</li>
          <li>Estrategias avanzadas de autogestión y regulación emocional</li>
          <li>Técnicas específicas para manejar la catastrofización y pensamientos negativos</li>
          <li>Importancia del pacing y establecimiento de límites saludables</li>
          <li>Manejo de la incertidumbre y aceptación en el proceso terapéutico</li>
          <li>Establecimiento de valores y objetivos funcionales significativos</li>
          <li>Estrategias para mejorar la calidad del sueño y manejo del estrés</li>
          <li>Comunicación efectiva con familiares y entorno laboral</li>
          <li>Plan específico para prevención y manejo de recaídas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Establecer plan de tratamiento a más largo plazo con objetivos progresivos</li>
          <li>Considerar derivación a especialista en dolor en casos refractarios</li>
          <li>Involucrar a familiares/cuidadores en el proceso terapéutico</li>
          <li>Monitorización regular utilizando medidas de resultado centradas en el paciente</li>
          <li>Coordinar con otros profesionales cuando sea necesario (médico, psicólogo, terapeuta ocupacional)</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('startmsk-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('startmsk-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el START Back Tool (Stratified Treatment Approach for Back Pain)
function calcularStartBack() {
  console.log("Calculando START Back Tool...");
  
  // Obtener todos los ítems del cuestionario
  const items1a8 = [
    document.querySelector('input[name="startback_item1"]:checked'),
    document.querySelector('input[name="startback_item2"]:checked'),
    document.querySelector('input[name="startback_item3"]:checked'),
    document.querySelector('input[name="startback_item4"]:checked'),
    document.querySelector('input[name="startback_item5"]:checked'),
    document.querySelector('input[name="startback_item6"]:checked'),
    document.querySelector('input[name="startback_item7"]:checked'),
    document.querySelector('input[name="startback_item8"]:checked')
  ];
  
  // Obtener el ítem 9 (qué tan molesto es el dolor)
  const item9 = document.querySelector('input[name="startback_item9"]:checked');
  
  console.log("Items 1-8 encontrados:", items1a8);
  console.log("Item 9 encontrado:", item9);
  
  // Contar cuántas preguntas han sido respondidas
  const items1a8Respondidos = items1a8.filter(item => item !== null).length;
  const item9Respondido = item9 !== null;
  const itemsRespondidos = items1a8Respondidos + (item9Respondido ? 1 : 0);
  
  console.log("Items respondidos:", itemsRespondidos);
  
  // Verificar si el usuario ha interactuado con el cuestionario
  const interaccionUsuario = itemsRespondidos > 0;
  
  // Si el usuario no ha interactuado con el cuestionario, mostramos "No completado"
  if (!interaccionUsuario) {
    if (document.getElementById('startback-badge')) {
      document.getElementById('startback-badge').textContent = "No completado";
      document.getElementById('startback-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('startback-interpretacion-total')) {
      document.getElementById('startback-interpretacion-total').textContent = "Complete el cuestionario";
    }
    
    if (document.getElementById('startback-interpretacion-clinica')) {
      document.getElementById('startback-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    
    if (document.getElementById('startback-recomendaciones')) {
      document.getElementById('startback-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Para un resultado válido, al menos 7 de 9 preguntas deben ser respondidas
  const respuestasMinimas = 7;
  
  // Si no se han contestado suficientes preguntas, advertir pero continuar calculando
  let mensajeCompletado = "";
  if (itemsRespondidos < respuestasMinimas) {
    mensajeCompletado = " (incompleto - los resultados pueden no ser confiables)";
  }
  
  // Calcular puntuaciones
  let puntuacionItems1a8 = 0;
  
  // Sumar valores de los ítems 1-8
  items1a8.forEach(item => {
    if (item !== null) {
      puntuacionItems1a8 += parseInt(item.value);
    }
  });
  
  // Manejar el ítem 9 (se dicotomiza): 0-3 = 0 puntos, 4-5 = 1 punto
  let puntuacionItem9 = 0;
  if (item9 !== null) {
    const valorItem9 = parseInt(item9.value);
    if (valorItem9 >= 4) {
      puntuacionItem9 = 1;
    }
  }
  
  // Calcular puntuación total
  const puntuacionTotal = puntuacionItems1a8 + puntuacionItem9;
  
  // Calcular puntuación psicosocial (ítems 5-9)
  let puntuacionPsicosocial = 0;
  for (let i = 4; i < 8; i++) { // ítems 5-8 (posiciones 4-7 en el array)
    if (items1a8[i] !== null) {
      puntuacionPsicosocial += parseInt(items1a8[i].value);
    }
  }
  puntuacionPsicosocial += puntuacionItem9; // Añadir ítem 9 a la subescala psicosocial
  
  console.log("Puntuación total:", puntuacionTotal);
  console.log("Puntuación psicosocial:", puntuacionPsicosocial);
  
  // Determinar el grupo de riesgo según START Back
  let grupoRiesgo = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (puntuacionTotal <= 3) {
    grupoRiesgo = "Riesgo bajo";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (puntuacionPsicosocial < 4) {
    grupoRiesgo = "Riesgo medio";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else {
    grupoRiesgo = "Riesgo alto";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('startback-valor-total')) {
    document.getElementById('startback-valor-total').textContent = puntuacionTotal + "/9" + mensajeCompletado;
  }
  
  if (document.getElementById('startback-valor-psicosocial')) {
    document.getElementById('startback-valor-psicosocial').textContent = puntuacionPsicosocial + "/5";
  }
  
  if (document.getElementById('startback-grupo-riesgo')) {
    document.getElementById('startback-grupo-riesgo').textContent = grupoRiesgo;
  }
  
  if (document.getElementById('startback-interpretacion-total')) {
    document.getElementById('startback-interpretacion-total').textContent = grupoRiesgo;
    document.getElementById('startback-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar estado del badge
  if (document.getElementById('startback-badge')) {
    document.getElementById('startback-badge').textContent = grupoRiesgo;
    document.getElementById('startback-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('startback-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (puntuacionTotal <= 3) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/9</strong> en el START Back Tool, con una subescala psicosocial de <strong>${puntuacionPsicosocial}/5</strong>, lo que indica un <strong>riesgo bajo</strong> de mal pronóstico para su dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta un cuadro predominantemente biomecánico/nociceptivo</li>
        <li>Tiene pocos factores psicosociales de mal pronóstico</li>
        <li>Es probable que responda bien a un tratamiento fisioterapéutico estándar</li>
        <li>Tiene buen pronóstico para la recuperación con intervención adecuada</li>
        <li>Presenta pocos signos de sensibilización central o dolor generalizado</li>
        <li>Tiene poca probabilidad de desarrollar dolor lumbar persistente o discapacitante</li>
        <li>Se beneficiará de intervenciones basadas principalmente en educación, ejercicio y retorno a la actividad</li>
      </ul>
    `;
  } else if (puntuacionPsicosocial < 4) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/9</strong> en el START Back Tool, con una subescala psicosocial de <strong>${puntuacionPsicosocial}/5</strong>, lo que indica un <strong>riesgo medio</strong> de mal pronóstico para su dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta una combinación de factores físicos y psicosociales</li>
        <li>Tiene síntomas físicos más significativos con algunos factores psicosociales</li>
        <li>Puede presentar dolor referido y limitaciones funcionales importantes</li>
        <li>Requiere un enfoque terapéutico que aborde tanto los aspectos físicos como los factores psicosociales emergentes</li>
        <li>Se beneficiará de un tratamiento fisioterapéutico más intenso que incluya ejercicio terapéutico y componentes educativos</li>
        <li>Tiene riesgo moderado de desarrollar problemas persistentes si no se aborda adecuadamente</li>
        <li>Necesita un enfoque que promueva la autogestión y el retorno gradual a las actividades</li>
      </ul>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/9</strong> en el START Back Tool, con una subescala psicosocial de <strong>${puntuacionPsicosocial}/5</strong>, lo que indica un <strong>riesgo alto</strong> de mal pronóstico para su dolor lumbar.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta una condición compleja con factores de riesgo psicosociales significativos</li>
        <li>Muestra señales evidentes de miedo-evitación, catastrofización o problemas de estado de ánimo</li>
        <li>Es probable que presente signos de sensibilización central y dolor más generalizado</li>
        <li>Tiene alto riesgo de desarrollar dolor lumbar persistente y discapacidad a largo plazo</li>
        <li>Requiere un abordaje integrado psicológico y físico para mejorar los resultados</li>
        <li>Se beneficiará de un enfoque que aborde específicamente los factores psicosociales identificados</li>
        <li>Necesita intervenciones más intensivas y posiblemente un enfoque multidisciplinario</li>
        <li>Debe recibir especial atención a las creencias y comportamientos relacionados con el dolor</li>
      </ul>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntuacionTotal <= 3) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación física centrada en los factores biomecánicos específicos</li>
          <li>Valoración de patrones de movimiento y control motor lumbar</li>
          <li>Identificación de factores ergonómicos y posturales contribuyentes</li>
          <li>Exploración de actividades y posiciones desencadenantes</li>
          <li>Evaluación básica de factores de riesgo modificables</li>
          <li>Análisis funcional de actividades limitadas específicas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Tratamiento fisioterapéutico estándar enfocado en educación y autogestión (nivel de evidencia 1A)</li>
          <li>Ejercicios específicos para mejorar el control motor lumbopélvico (nivel de evidencia 1A)</li>
          <li>Terapia manual según hallazgos específicos, si está indicada (nivel de evidencia 1B)</li>
          <li>Información sobre manejo del dolor y retorno seguro a la actividad (nivel de evidencia 1A)</li>
          <li>Corrección de patrones de movimiento disfuncionales (nivel de evidencia 1B)</li>
          <li>Educación sobre ergonomía y mecánica corporal (nivel de evidencia 1B)</li>
          <li>Estrategias de autocuidado y autogestión (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre la naturaleza benigna y autolimitada del dolor lumbar</li>
          <li>Importancia de mantener la actividad física y evitar el reposo prolongado</li>
          <li>Consejos específicos para el manejo del dolor durante actividades cotidianas</li>
          <li>Promoción de la autogestión y responsabilidad del paciente en su recuperación</li>
          <li>Establecimiento de expectativas realistas sobre el tiempo de recuperación</li>
          <li>Explicación del papel del ejercicio en la recuperación y prevención</li>
          <li>Estrategias para retornar a las actividades normales de manera segura</li>
        </ul>
      </div>
    `;
  } else if (puntuacionPsicosocial < 4) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica completa de la región lumbopélvica</li>
          <li>Valoración del patrón de movimiento y control motor</li>
          <li>Análisis de la irradiación del dolor y posibles componentes radiculares</li>
          <li>Identificación de barreras físicas para la recuperación funcional</li>
          <li>Exploración básica de factores psicosociales emergentes</li>
          <li>Evaluación funcional detallada de actividades limitadas</li>
          <li>Valoración de la condición física general y desacondicionamiento</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa fisioterapéutico más intenso con énfasis en el ejercicio terapéutico (nivel de evidencia 1A)</li>
          <li>Entrenamiento específico del control motor lumbopélvico (nivel de evidencia 1A)</li>
          <li>Ejercicios progresivos de estabilización dinámica (nivel de evidencia 1A)</li>
          <li>Terapia manual como complemento al ejercicio activo (nivel de evidencia 1B)</li>
          <li>Introducción gradual de ejercicios funcionales específicos (nivel de evidencia 1A)</li>
          <li>Reentrenamiento de patrones de movimiento disfuncionales (nivel de evidencia 1B)</li>
          <li>Abordaje de aspectos psicosociales emergentes mediante educación (nivel de evidencia 1A)</li>
          <li>Programa de acondicionamiento físico progresivo (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre neurobiología básica del dolor y factores contribuyentes</li>
          <li>Explicación de la relación entre factores físicos y psicosociales en el dolor lumbar</li>
          <li>Estrategias de autogestión activa y resolución de problemas</li>
          <li>Técnicas de pacing para equilibrar actividad y descanso</li>
          <li>Importancia de la actividad física regular y ejercicios específicos</li>
          <li>Establecimiento de objetivos funcionales progresivos</li>
          <li>Estrategias para manejar exacerbaciones del dolor</li>
          <li>Desmitificación de creencias erróneas sobre el dolor lumbar</li>
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional biopsicosocial completa</li>
          <li>Valoración detallada de factores psicosociales específicos (miedo-evitación, catastrofización, estado ánimo)</li>
          <li>Análisis de creencias y comportamientos relacionados con el dolor</li>
          <li>Evaluación de posibles mecanismos de sensibilización central</li>
          <li>Identificación de patrones de evitación y limitación de actividades</li>
          <li>Valoración del impacto en múltiples dimensiones de la vida</li>
          <li>Evaluación de estrategias de afrontamiento actuales</li>
          <li>Exploración de barreras específicas para la recuperación</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Enfoque integrado psicológico-físico intensivo (nivel de evidencia 1A)</li>
          <li>Intervención cognitivo-conductual para abordar factores psicosociales (nivel de evidencia 1A)</li>
          <li>Programa gradual de exposición a actividades temidas (nivel de evidencia 1A)</li>
          <li>Educación intensiva en neurociencia del dolor (nivel de evidencia 1A)</li>
          <li>Ejercicio terapéutico con énfasis en reducir el miedo al movimiento (nivel de evidencia 1A)</li>
          <li>Estrategias específicas para abordar la catastrofización (nivel de evidencia 1A)</li>
          <li>Técnicas de regulación emocional y manejo del estrés (nivel de evidencia 1B)</li>
          <li>Entrenamiento en actividades funcionales significativas (nivel de evidencia 1A)</li>
          <li>Terapia manual como componente complementario, no central (nivel de evidencia 1B)</li>
          <li>Consideración de abordaje multidisciplinar en casos complejos (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación intensiva en neurociencia del dolor y mecanismos de sensibilización</li>
          <li>Reconceptualización de las creencias sobre el dolor y su significado</li>
          <li>Estrategias avanzadas de autogestión del dolor crónico</li>
          <li>Técnicas específicas para manejar pensamientos catastróficos</li>
          <li>Importancia del ejercicio seguro y exposición gradual a actividades temidas</li>
          <li>Reconocimiento del impacto del estado emocional en la experiencia del dolor</li>
          <li>Desarrollo de habilidades para la regulación emocional</li>
          <li>Establecimiento de objetivos funcionales significativos y alcanzables</li>
          <li>Estrategias para mejorar el sueño y manejar el estrés</li>
          <li>Plan específico para prevención y manejo de recaídas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Considerar derivación a psicólogo con experiencia en dolor crónico cuando sea necesario</li>
          <li>Desarrollar plan de tratamiento a más largo plazo con seguimiento regular</li>
          <li>Involucrar al paciente activamente en todas las decisiones terapéuticas</li>
          <li>Coordinar con otros profesionales de la salud cuando sea necesario</li>
          <li>Reevaluación regular utilizando instrumentos validados para monitorizar progreso</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('startback-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('startback-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el LEFS (Lower Extremity Functional Scale)
function calcularLEFS() {
  console.log("Calculando LEFS...");
  
  // Obtener todos los ítems del cuestionario
  const items = [];
  for (let i = 1; i <= 20; i++) {
    items.push(document.querySelector(`input[name="lefs_item${i}"]:checked`));
  }
  
  console.log("Items encontrados:", items);
  
  // Contar cuántas preguntas han sido respondidas
  const itemsRespondidos = items.filter(item => item !== null).length;
  console.log("Items respondidos:", itemsRespondidos);
  
  // Verificar si el usuario ha interactuado con el cuestionario
  const interaccionUsuario = itemsRespondidos > 0;
  
  // Si el usuario no ha interactuado con el cuestionario, mostramos "No completado"
  if (!interaccionUsuario) {
    if (document.getElementById('lefs-badge')) {
      document.getElementById('lefs-badge').textContent = "No completado";
      document.getElementById('lefs-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('lefs-interpretacion-total')) {
      document.getElementById('lefs-interpretacion-total').textContent = "Complete el cuestionario";
    }
    
    if (document.getElementById('lefs-interpretacion-clinica')) {
      document.getElementById('lefs-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    
    if (document.getElementById('lefs-recomendaciones')) {
      document.getElementById('lefs-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Para un resultado válido, al menos 16 de 20 preguntas deben ser respondidas (80%)
  const respuestasMinimas = 16;
  
  // Si no se han contestado suficientes preguntas, advertir pero continuar calculando
  let mensajeCompletado = "";
  if (itemsRespondidos < respuestasMinimas) {
    mensajeCompletado = " (incompleto - los resultados pueden no ser confiables)";
  }
  
  // Calcular puntuación total
  let puntuacionTotal = 0;
  
  // Sumar valores de los ítems respondidos
  items.forEach(item => {
    if (item !== null) {
      puntuacionTotal += parseInt(item.value);
    }
  });
  
  console.log("Puntuación total:", puntuacionTotal);
  
  // Calcular el porcentaje de función (0-100%)
  const porcentajeFuncion = (puntuacionTotal / (itemsRespondidos * 4)) * 100;
  const porcentajeRedondeado = Math.round(porcentajeFuncion * 10) / 10; // Redondear a 1 decimal
  
  // Determinar el nivel de discapacidad basado en la puntuación total (ajustado por ítems respondidos)
  let nivelDiscapacidad = "";
  let colorBadge = "";
  let colorClase = "";
  
  // Ajustar los umbrales según la cantidad de ítems respondidos
  const factorAjuste = itemsRespondidos / 20;
  const umbralLeve = Math.round(56 * factorAjuste);
  const umbralModerado = Math.round(32 * factorAjuste);
  
  if (puntuacionTotal >= umbralLeve) {
    nivelDiscapacidad = "Limitación leve";
    colorBadge = "bajo";
    colorClase = "nivel-leve";
  } else if (puntuacionTotal >= umbralModerado) {
    nivelDiscapacidad = "Limitación moderada";
    colorBadge = "moderado";
    colorClase = "nivel-moderado";
  } else {
    nivelDiscapacidad = "Limitación severa";
    colorBadge = "alto";
    colorClase = "nivel-severo";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('lefs-valor-total')) {
    document.getElementById('lefs-valor-total').textContent = puntuacionTotal + "/" + (itemsRespondidos * 4) + mensajeCompletado;
  }
  
  if (document.getElementById('lefs-valor-porcentaje')) {
    document.getElementById('lefs-valor-porcentaje').textContent = porcentajeRedondeado.toFixed(1) + "%";
  }
  
  if (document.getElementById('lefs-nivel-discapacidad')) {
    document.getElementById('lefs-nivel-discapacidad').textContent = nivelDiscapacidad;
  }
  
  if (document.getElementById('lefs-interpretacion-total')) {
    document.getElementById('lefs-interpretacion-total').textContent = nivelDiscapacidad;
    document.getElementById('lefs-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar estado del badge
  if (document.getElementById('lefs-badge')) {
    document.getElementById('lefs-badge').textContent = nivelDiscapacidad;
    document.getElementById('lefs-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('lefs-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Generar interpretación clínica basada en la puntuación y porcentaje
  let interpretacionClinica = "";
  
  if (puntuacionTotal >= umbralLeve) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/${itemsRespondidos * 4}</strong> en la Escala Funcional de Extremidad Inferior (LEFS), lo que equivale a un <strong>${porcentajeRedondeado.toFixed(1)}%</strong> de la función normal, indicando una <strong>limitación leve</strong> en la funcionalidad de la extremidad inferior.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Conserva buena capacidad funcional para la mayoría de actividades cotidianas y algunas recreativas</li>
        <li>Presenta restricciones mínimas a leves en actividades específicas de mayor demanda</li>
        <li>Puede experimentar algunas dificultades con actividades como correr, saltar, ponerse en cuclillas o arrodillarse</li>
        <li>Logra caminar distancias moderadas sin limitaciones significativas</li>
        <li>Tiene buen pronóstico para recuperación completa con intervención adecuada</li>
        <li>Puede beneficiarse de intervenciones dirigidas a restaurar la función completa en actividades específicas</li>
      </ul>
      <p>La puntuación indica una diferencia mínima clínicamente importante (MCID) de 9 puntos con respecto a evaluaciones anteriores o futuras: los cambios superiores a 9 puntos deben considerarse clínicamente relevantes.</p>
    `;
  } else if (puntuacionTotal >= umbralModerado) {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/${itemsRespondidos * 4}</strong> en la Escala Funcional de Extremidad Inferior (LEFS), lo que equivale a un <strong>${porcentajeRedondeado.toFixed(1)}%</strong> de la función normal, indicando una <strong>limitación moderada</strong> en la funcionalidad de la extremidad inferior.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Presenta dificultades significativas en actividades de mayor demanda física</li>
        <li>Puede realizar actividades básicas cotidianas con adaptaciones o compensaciones</li>
        <li>Muestra limitaciones evidentes para actividades como correr, saltar o agacharse</li>
        <li>Tiene dificultades moderadas con tareas como subir/bajar escaleras, caminar largas distancias o estar de pie por períodos prolongados</li>
        <li>Puede experimentar restricciones en algunas actividades recreativas o deportivas</li>
        <li>Probablemente ha desarrollado estrategias compensatorias para mantener su independencia funcional</li>
        <li>Requiere un programa de rehabilitación progresivo para mejorar su capacidad funcional</li>
      </ul>
      <p>La puntuación indica una diferencia mínima clínicamente importante (MCID) de 9 puntos con respecto a evaluaciones anteriores o futuras: los cambios superiores a 9 puntos deben considerarse clínicamente relevantes.</p>
    `;
  } else {
    interpretacionClinica = `
      <p>El paciente presenta una puntuación de <strong>${puntuacionTotal}/${itemsRespondidos * 4}</strong> en la Escala Funcional de Extremidad Inferior (LEFS), lo que equivale a un <strong>${porcentajeRedondeado.toFixed(1)}%</strong> de la función normal, indicando una <strong>limitación severa</strong> en la funcionalidad de la extremidad inferior.</p>
      <p>Esta puntuación sugiere que el paciente:</p>
      <ul>
        <li>Experimenta restricciones importantes en la mayoría de las actividades evaluadas</li>
        <li>Presenta dificultades significativas incluso para actividades básicas de la vida diaria</li>
        <li>Muestra limitaciones severas para caminar, subir escaleras, agacharse o permanecer de pie</li>
        <li>Puede requerir adaptaciones o asistencia para algunas actividades cotidianas</li>
        <li>Tiene imposibilidad o gran dificultad para realizar actividades de mayor demanda como correr o arrodillarse</li>
        <li>Probablemente experimenta un impacto significativo en su calidad de vida y participación social</li>
        <li>Requiere un programa de rehabilitación estructurado y progresivo, posiblemente con un enfoque interdisciplinario</li>
      </ul>
      <p>La puntuación indica una diferencia mínima clínicamente importante (MCID) de 9 puntos con respecto a evaluaciones anteriores o futuras: los cambios superiores a 9 puntos deben considerarse clínicamente relevantes.</p>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntuacionTotal >= umbralLeve) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica específica para identificar limitaciones residuales</li>
          <li>Análisis de patrones de movimiento durante actividades más exigentes</li>
          <li>Valoración de la fuerza, control motor y propiocepción</li>
          <li>Evaluación funcional específica de actividades que aún presentan dificultad</li>
          <li>Análisis de factores biomecánicos que puedan predisponer a recurrencias</li>
          <li>Valoración de la capacidad para actividades deportivas o recreativas específicas</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Ejercicios de fortalecimiento progresivo para grupos musculares deficitarios (nivel de evidencia 1A)</li>
          <li>Entrenamiento propioceptivo y de control neuromuscular avanzado (nivel de evidencia 1A)</li>
          <li>Ejercicios funcionales específicos para las actividades que aún presentan limitación (nivel de evidencia 1A)</li>
          <li>Programa de readaptación a actividades deportivas o recreativas específicas (nivel de evidencia 1B)</li>
          <li>Ejercicios pliométricos y de potencia para actividades de mayor demanda (nivel de evidencia 1B)</li>
          <li>Terapia manual específica según hallazgos biomecánicos puntuales (nivel de evidencia 1B)</li>
          <li>Entrenamiento de estabilidad dinámica en situaciones funcionales (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Estrategias para optimizar el rendimiento en actividades específicas</li>
          <li>Prevención de recidivas y manejo de factores de riesgo</li>
          <li>Progresión apropiada en actividades deportivas o de alta demanda</li>
          <li>Importancia del mantenimiento de la condición física general</li>
          <li>Reconocimiento temprano y manejo de posibles exacerbaciones</li>
          <li>Técnicas avanzadas de autocuidado y autogestión</li>
          <li>Establecimiento de objetivos funcionales para lograr recuperación completa en actividades específicas</li>
        </ul>
      </div>
    `;
  } else if (puntuacionTotal >= umbralModerado) {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación biomecánica completa de la extremidad inferior</li>
          <li>Valoración detallada de la fuerza, flexibilidad y control motor</li>
          <li>Análisis de patrones de movimiento funcional</li>
          <li>Identificación de compensaciones y adaptaciones</li>
          <li>Evaluación del impacto funcional en actividades cotidianas y laborales</li>
          <li>Análisis de dolor y su relación con actividades específicas</li>
          <li>Evaluación de posibles factores contribuyentes (alineación, equilibrio muscular)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa progresivo de fortalecimiento muscular (nivel de evidencia 1A)</li>
          <li>Ejercicios de control motor y estabilización articular (nivel de evidencia 1A)</li>
          <li>Entrenamiento propioceptivo y de equilibrio (nivel de evidencia 1A)</li>
          <li>Técnicas de movilización articular específicas según limitaciones (nivel de evidencia 1B)</li>
          <li>Reeducación de patrones de movimiento funcional (nivel de evidencia 1A)</li>
          <li>Programa de ejercicio aeróbico adaptado (nivel de evidencia 1A)</li>
          <li>Entrenamiento funcional progresivo para actividades cotidianas afectadas (nivel de evidencia 1A)</li>
          <li>Ejercicios de estabilidad dinámica y control excéntrico (nivel de evidencia 1A)</li>
          <li>Estrategias para manejo del dolor durante actividades (nivel de evidencia 1B)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre factores biomecánicos y su relación con la condición</li>
          <li>Estrategias de modificación de actividades para optimizar la función</li>
          <li>Técnicas de pacing para evitar sobrecargas y retrocesos</li>
          <li>Progresión gradual de la actividad física y ejercicio</li>
          <li>Principios de protección articular durante actividades cotidianas</li>
          <li>Importancia de la adherencia al programa de ejercicios</li>
          <li>Reconocimiento y manejo de factores que exacerban los síntomas</li>
          <li>Establecimiento de objetivos funcionales realistas y progresivos</li>
        </ul>
      </div>
    `;
  } else {
    recomendaciones = `
      <div class="recomendacion-seccion">
        <h6>Evaluación:</h6>
        <ul>
          <li>Evaluación multidimensional incluyendo aspectos biomecánicos, funcionales y de dolor</li>
          <li>Análisis de limitaciones primarias y restricciones secundarias</li>
          <li>Valoración detallada de barreras para las actividades básicas</li>
          <li>Identificación de factores perpetuantes o agravantes</li>
          <li>Evaluación de impacto en actividades esenciales de la vida diaria</li>
          <li>Análisis de posibles comorbilidades y su influencia</li>
          <li>Valoración de posibles adaptaciones o ayudas técnicas necesarias</li>
          <li>Evaluación de factores psicosociales asociados a la limitación funcional severa</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Intervención:</h6>
        <ul>
          <li>Programa de rehabilitación integral con progresión muy gradual (nivel de evidencia 1A)</li>
          <li>Ejercicios iniciales en descarga o con asistencia según tolerancia (nivel de evidencia 1B)</li>
          <li>Terapia manual para reducir dolor y mejorar movilidad (nivel de evidencia 1B)</li>
          <li>Entrenamiento inicial de control motor básico y activación muscular (nivel de evidencia 1A)</li>
          <li>Progresión gradual hacia fortalecimiento y estabilidad (nivel de evidencia 1A)</li>
          <li>Entrenamiento funcional específico para actividades prioritarias (nivel de evidencia 1A)</li>
          <li>Estrategias de manejo del dolor multimodales (nivel de evidencia 1A)</li>
          <li>Consideración de órtesis o ayudas técnicas temporales si están indicadas (nivel de evidencia 1B)</li>
          <li>Abordaje progresivo para actividades básicas como caminar, transferencias y escaleras (nivel de evidencia 1A)</li>
          <li>Considerar enfoque interdisciplinario para optimizar resultados (nivel de evidencia 1A)</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Educación:</h6>
        <ul>
          <li>Educación sobre la condición y proceso de recuperación esperado</li>
          <li>Estrategias específicas de autogestión para actividades básicas</li>
          <li>Técnicas de conservación de energía y protección articular</li>
          <li>Importancia de equilibrar actividad y descanso (pacing)</li>
          <li>Adaptaciones temporales para optimizar la independencia funcional</li>
          <li>Establecimiento de expectativas realistas y objetivos progresivos</li>
          <li>Desmitificación de creencias limitantes sobre el movimiento y el dolor</li>
          <li>Estrategias para manejo de exacerbaciones y retrocesos</li>
          <li>Importancia de la participación activa en el proceso de rehabilitación</li>
        </ul>
      </div>
      
      <div class="recomendacion-seccion">
        <h6>Consideraciones adicionales:</h6>
        <ul>
          <li>Considerar evaluaciones complementarias si la limitación es desproporcionada o persistente</li>
          <li>Valorar la necesidad de consulta con otros especialistas según hallazgos específicos</li>
          <li>Establecer plan de seguimiento cercano para monitorizar progreso</li>
          <li>Revisar periódicamente la necesidad de adaptaciones o ayudas técnicas</li>
        </ul>
      </div>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('lefs-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('lefs-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el HOOS (Hip Disability and Osteoarthritis Outcome Score)
function calcularHOOS() {
  console.log("Calculando HOOS...");
  
  // Definir las categorías de preguntas
  const categorias = {
    sintomas: ['hoos_s1', 'hoos_s2', 'hoos_s3', 'hoos_s4', 'hoos_s5'],
    dolor: ['hoos_p1', 'hoos_p2', 'hoos_p3', 'hoos_p4', 'hoos_p5', 'hoos_p6', 'hoos_p7', 'hoos_p8', 'hoos_p9', 'hoos_p10'],
    avd: ['hoos_a1', 'hoos_a2', 'hoos_a3', 'hoos_a4', 'hoos_a5', 'hoos_a6', 'hoos_a7', 'hoos_a8', 'hoos_a9', 'hoos_a10', 
          'hoos_a11', 'hoos_a12', 'hoos_a13', 'hoos_a14', 'hoos_a15', 'hoos_a16', 'hoos_a17'],
    deporte: ['hoos_sp1', 'hoos_sp2', 'hoos_sp3', 'hoos_sp4'],
    qol: ['hoos_q1', 'hoos_q2', 'hoos_q3', 'hoos_q4']
  };
  
  // Función para obtener el valor de un ítem
  function getItemValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? parseInt(radio.value) : null;
  }
  
  // Contar ítems respondidos y calcular puntuaciones por categoría
  const puntuaciones = {};
  const itemsRespondidos = {};
  const totalItems = {};
  let totalRespondidos = 0;
  let totalPreguntas = 0;
  
  for (const [categoria, items] of Object.entries(categorias)) {
    puntuaciones[categoria] = 0;
    itemsRespondidos[categoria] = 0;
    totalItems[categoria] = items.length;
    totalPreguntas += items.length;
    
    for (const item of items) {
      const valor = getItemValue(item);
      if (valor !== null) {
        puntuaciones[categoria] += valor;
        itemsRespondidos[categoria]++;
        totalRespondidos++;
      }
    }
  }
  
  console.log("Puntuaciones por categoría:", puntuaciones);
  console.log("Items respondidos por categoría:", itemsRespondidos);
  console.log("Total ítems respondidos:", totalRespondidos);
  
  // Verificar si el usuario ha interactuado con el cuestionario
  const interaccionUsuario = totalRespondidos > 0;
  
  // Si el usuario no ha interactuado con el cuestionario, mostramos "No completado"
  if (!interaccionUsuario) {
    if (document.getElementById('hoos-badge')) {
      document.getElementById('hoos-badge').textContent = "No completado";
      document.getElementById('hoos-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('hoos-interpretacion-total')) {
      document.getElementById('hoos-interpretacion-total').textContent = "Complete el cuestionario";
    }
    
    if (document.getElementById('hoos-interpretacion-clinica')) {
      document.getElementById('hoos-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    
    if (document.getElementById('hoos-recomendaciones')) {
      document.getElementById('hoos-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Para un resultado válido, al menos el 80% de los ítems deben ser respondidos en cada categoría
  const respuestasMinimas = {};
  let cuestionarioCompleto = true;
  const categoriasSuficientes = [];
  
  for (const [categoria, total] of Object.entries(totalItems)) {
    respuestasMinimas[categoria] = Math.ceil(total * 0.8);
    if (itemsRespondidos[categoria] < respuestasMinimas[categoria]) {
      cuestionarioCompleto = false;
    } else {
      categoriasSuficientes.push(categoria);
    }
  }
  
  let mensajeCompletado = "";
  if (!cuestionarioCompleto) {
    mensajeCompletado = " (incompleto - los resultados pueden no ser confiables)";
  }
  
  // Calcular puntuaciones normalizadas (0-100, donde 100 = sin problemas)
  const puntuacionesNormalizadas = {};
  let puntuacionTotal = 0;
  let contadorCategoriasValidas = 0;
  
  for (const [categoria, puntuacion] of Object.entries(puntuaciones)) {
    if (itemsRespondidos[categoria] >= respuestasMinimas[categoria]) {
      // Calcular la puntuación normalizada: 100 - (puntuación media * 25)
      // Puntuación media = suma de valores / número de ítems respondidos
      // Multiplicado por 25 para convertir de escala 0-4 a 0-100
      const puntuacionMedia = puntuacion / itemsRespondidos[categoria];
      puntuacionesNormalizadas[categoria] = 100 - (puntuacionMedia * 25);
      puntuacionTotal += puntuacionesNormalizadas[categoria];
      contadorCategoriasValidas++;
    } else {
      puntuacionesNormalizadas[categoria] = null;
    }
  }
  
  // Calcular puntuación total promediando las categorías válidas
  const puntuacionTotalNormalizada = contadorCategoriasValidas > 0 ? 
                                     puntuacionTotal / contadorCategoriasValidas : null;
  
  console.log("Puntuaciones normalizadas:", puntuacionesNormalizadas);
  console.log("Puntuación total normalizada:", puntuacionTotalNormalizada);
  
  // Determinar el nivel de afectación basado en la puntuación total
  let nivelAfectacion = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (puntuacionTotalNormalizada !== null) {
    if (puntuacionTotalNormalizada >= 70) {
      nivelAfectacion = "Afectación leve";
      colorBadge = "bajo";
      colorClase = "nivel-leve";
    } else if (puntuacionTotalNormalizada >= 40) {
      nivelAfectacion = "Afectación moderada";
      colorBadge = "moderado";
      colorClase = "nivel-moderado";
    } else {
      nivelAfectacion = "Afectación severa";
      colorBadge = "alto";
      colorClase = "nivel-severo";
    }
  } else {
    nivelAfectacion = "No evaluable";
    colorBadge = "no-completado";
    colorClase = "";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('hoos-valor-total')) {
    document.getElementById('hoos-valor-total').textContent = puntuacionTotalNormalizada !== null ? 
                                                           puntuacionTotalNormalizada.toFixed(1) + "%" + mensajeCompletado : 
                                                           "No evaluable";
  }
  
  // Actualizar valores de subescalas
  const idsPorCategoria = {
    sintomas: 'hoos-valor-sintomas',
    dolor: 'hoos-valor-dolor',
    avd: 'hoos-valor-avd',
    deporte: 'hoos-valor-deporte',
    qol: 'hoos-valor-qol'
  };
  
  for (const [categoria, id] of Object.entries(idsPorCategoria)) {
    if (document.getElementById(id)) {
      document.getElementById(id).textContent = puntuacionesNormalizadas[categoria] !== null ? 
                                               puntuacionesNormalizadas[categoria].toFixed(1) + "%" : 
                                               "No evaluable";
    }
  }
  
  if (document.getElementById('hoos-interpretacion-total')) {
    document.getElementById('hoos-interpretacion-total').textContent = nivelAfectacion;
    document.getElementById('hoos-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar estado del badge
  if (document.getElementById('hoos-badge')) {
    document.getElementById('hoos-badge').textContent = nivelAfectacion;
    document.getElementById('hoos-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('hoos-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (puntuacionTotalNormalizada !== null) {
    if (puntuacionTotalNormalizada >= 70) {
      interpretacionClinica = `
        <p>El paciente presenta una puntuación promedio del <strong>${puntuacionTotalNormalizada.toFixed(1)}%</strong> en el cuestionario HOOS, lo que indica una <strong>afectación leve</strong> en la función de cadera y síntomas relacionados.</p>
        <p>Análisis por subescalas:</p>
        <ul>
          ${puntuacionesNormalizadas.dolor !== null ? `<li><strong>Dolor:</strong> ${puntuacionesNormalizadas.dolor.toFixed(1)}% - ${puntuacionesNormalizadas.dolor >= 70 ? 'Leve' : puntuacionesNormalizadas.dolor >= 40 ? 'Moderado' : 'Severo'}</li>` : ''}
          ${puntuacionesNormalizadas.sintomas !== null ? `<li><strong>Síntomas:</strong> ${puntuacionesNormalizadas.sintomas.toFixed(1)}% - ${puntuacionesNormalizadas.sintomas >= 70 ? 'Leves' : puntuacionesNormalizadas.sintomas >= 40 ? 'Moderados' : 'Severos'}</li>` : ''}
          ${puntuacionesNormalizadas.avd !== null ? `<li><strong>Actividades de la vida diaria:</strong> ${puntuacionesNormalizadas.avd.toFixed(1)}% - ${puntuacionesNormalizadas.avd >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.avd >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.deporte !== null ? `<li><strong>Deportes/actividades recreativas:</strong> ${puntuacionesNormalizadas.deporte.toFixed(1)}% - ${puntuacionesNormalizadas.deporte >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.deporte >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.qol !== null ? `<li><strong>Calidad de vida:</strong> ${puntuacionesNormalizadas.qol.toFixed(1)}% - ${puntuacionesNormalizadas.qol >= 70 ? 'Poco afectada' : puntuacionesNormalizadas.qol >= 40 ? 'Moderadamente afectada' : 'Severamente afectada'}</li>` : ''}
        </ul>
        <p>Esta puntuación sugiere que el paciente:</p>
        <ul>
          <li>Conserva una buena funcionalidad de la cadera para la mayoría de las actividades cotidianas</li>
          <li>Presenta síntomas y dolor leves que no interfieren significativamente con su calidad de vida</li>
          <li>Puede experimentar algunas limitaciones en actividades de mayor demanda o deportivas</li>
          <li>Tiene buen pronóstico para mantener o mejorar su función con intervención adecuada</li>
          <li>Probablemente responderá bien a intervenciones conservadoras dirigidas a factores biomecánicos específicos</li>
        </ul>
      `;
    } else if (puntuacionTotalNormalizada >= 40) {
      interpretacionClinica = `
        <p>El paciente presenta una puntuación promedio del <strong>${puntuacionTotalNormalizada.toFixed(1)}%</strong> en el cuestionario HOOS, lo que indica una <strong>afectación moderada</strong> en la función de cadera y síntomas relacionados.</p>
        <p>Análisis por subescalas:</p>
        <ul>
          ${puntuacionesNormalizadas.dolor !== null ? `<li><strong>Dolor:</strong> ${puntuacionesNormalizadas.dolor.toFixed(1)}% - ${puntuacionesNormalizadas.dolor >= 70 ? 'Leve' : puntuacionesNormalizadas.dolor >= 40 ? 'Moderado' : 'Severo'}</li>` : ''}
          ${puntuacionesNormalizadas.sintomas !== null ? `<li><strong>Síntomas:</strong> ${puntuacionesNormalizadas.sintomas.toFixed(1)}% - ${puntuacionesNormalizadas.sintomas >= 70 ? 'Leves' : puntuacionesNormalizadas.sintomas >= 40 ? 'Moderados' : 'Severos'}</li>` : ''}
          ${puntuacionesNormalizadas.avd !== null ? `<li><strong>Actividades de la vida diaria:</strong> ${puntuacionesNormalizadas.avd.toFixed(1)}% - ${puntuacionesNormalizadas.avd >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.avd >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.deporte !== null ? `<li><strong>Deportes/actividades recreativas:</strong> ${puntuacionesNormalizadas.deporte.toFixed(1)}% - ${puntuacionesNormalizadas.deporte >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.deporte >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.qol !== null ? `<li><strong>Calidad de vida:</strong> ${puntuacionesNormalizadas.qol.toFixed(1)}% - ${puntuacionesNormalizadas.qol >= 70 ? 'Poco afectada' : puntuacionesNormalizadas.qol >= 40 ? 'Moderadamente afectada' : 'Severamente afectada'}</li>` : ''}
        </ul>
        <p>Esta puntuación sugiere que el paciente:</p>
        <ul>
          <li>Experimenta dolor y síntomas moderados en la cadera que impactan en sus actividades diarias</li>
          <li>Presenta dificultades significativas para algunas actividades funcionales como subir escaleras, caminar distancias prolongadas o actividades deportivas</li>
          <li>Puede tener limitaciones para ciertas tareas de autocuidado como ponerse calcetines o entrar/salir de la bañera</li>
          <li>Muestra una calidad de vida afectada por su problema de cadera</li>
          <li>Probablemente ha desarrollado estrategias compensatorias para mantener su funcionalidad</li>
          <li>Requiere un programa de intervención estructurado que aborde tanto el dolor como la función</li>
        </ul>
      `;
    } else {
      interpretacionClinica = `
        <p>El paciente presenta una puntuación promedio del <strong>${puntuacionTotalNormalizada.toFixed(1)}%</strong> en el cuestionario HOOS, lo que indica una <strong>afectación severa</strong> en la función de cadera y síntomas relacionados.</p>
        <p>Análisis por subescalas:</p>
        <ul>
          ${puntuacionesNormalizadas.dolor !== null ? `<li><strong>Dolor:</strong> ${puntuacionesNormalizadas.dolor.toFixed(1)}% - ${puntuacionesNormalizadas.dolor >= 70 ? 'Leve' : puntuacionesNormalizadas.dolor >= 40 ? 'Moderado' : 'Severo'}</li>` : ''}
          ${puntuacionesNormalizadas.sintomas !== null ? `<li><strong>Síntomas:</strong> ${puntuacionesNormalizadas.sintomas.toFixed(1)}% - ${puntuacionesNormalizadas.sintomas >= 70 ? 'Leves' : puntuacionesNormalizadas.sintomas >= 40 ? 'Moderados' : 'Severos'}</li>` : ''}
          ${puntuacionesNormalizadas.avd !== null ? `<li><strong>Actividades de la vida diaria:</strong> ${puntuacionesNormalizadas.avd.toFixed(1)}% - ${puntuacionesNormalizadas.avd >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.avd >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.deporte !== null ? `<li><strong>Deportes/actividades recreativas:</strong> ${puntuacionesNormalizadas.deporte.toFixed(1)}% - ${puntuacionesNormalizadas.deporte >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.deporte >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.qol !== null ? `<li><strong>Calidad de vida:</strong> ${puntuacionesNormalizadas.qol.toFixed(1)}% - ${puntuacionesNormalizadas.qol >= 70 ? 'Poco afectada' : puntuacionesNormalizadas.qol >= 40 ? 'Moderadamente afectada' : 'Severamente afectada'}</li>` : ''}
        </ul>
        <p>Esta puntuación sugiere que el paciente:</p>
        <ul>
          <li>Experimenta dolor intenso y síntomas significativos que limitan severamente su función</li>
          <li>Presenta dificultades importantes para actividades básicas de la vida diaria como caminar, subir escaleras o vestirse</li>
          <li>Tiene restricciones severas para actividades deportivas o recreativas</li>
          <li>Muestra una calidad de vida significativamente afectada por su problema de cadera</li>
          <li>Puede requerir adaptaciones o asistencia para algunas actividades cotidianas</li>
          <li>Probablemente ha modificado considerablemente su estilo de vida debido a su condición</li>
          <li>Necesita un abordaje integral de su problema, posiblemente multidisciplinar</li>
          <li>En casos de osteoartritis avanzada, podría ser candidato para evaluación de intervenciones más avanzadas</li>
        </ul>
      `;
    }
  } else {
    interpretacionClinica = `
      <p>No hay suficientes datos para realizar una interpretación clínica completa. Se requiere que al menos el 80% de los ítems de cada subescala sean respondidos para un análisis fiable.</p>
      <p>Subescalas completadas adecuadamente:</p>
      <ul>
        ${categoriasSuficientes.map(cat => `<li>${cat === 'sintomas' ? 'Síntomas' : cat === 'dolor' ? 'Dolor' : cat === 'avd' ? 'Actividades de la vida diaria' : cat === 'deporte' ? 'Deportes/actividades recreativas' : 'Calidad de vida'}</li>`).join('')}
      </ul>
      <p>Por favor, complete las secciones restantes para obtener una interpretación más precisa.</p>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntuacionTotalNormalizada !== null) {
    if (puntuacionTotalNormalizada >= 70) {
      recomendaciones = `
        <div class="recomendacion-seccion">
          <h6>Evaluación:</h6>
          <ul>
            <li>Evaluación biomecánica detallada del complejo coxofemoral y pélvico</li>
            <li>Valoración de patrones de movimiento y control motor en la región lumbopélvica</li>
            <li>Análisis de la fuerza, flexibilidad y estabilidad en la cadena cinética relacionada</li>
            <li>Evaluación funcional específica para actividades que aún presentan dificultad</li>
            <li>Valoración de factores de riesgo para progresión de síntomas</li>
            <li>Análisis de actividades laborales, recreativas o deportivas específicas</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Intervención:</h6>
          <ul>
            <li>Ejercicios específicos para optimizar la biomecánica de la cadera (nivel de evidencia 1A)</li>
            <li>Fortalecimiento progresivo de musculatura estabilizadora de cadera (nivel de evidencia 1A)</li>
            <li>Programa de control neuromuscular para mejorar la estabilidad dinámica (nivel de evidencia 1A)</li>
            <li>Ejercicios específicos para mejorar la movilidad articular según limitaciones identificadas (nivel de evidencia 1B)</li>
            <li>Entrenamiento funcional dirigido a actividades específicas limitadas (nivel de evidencia 1A)</li>
            <li>Terapia manual específica según hallazgos biomecánicos (nivel de evidencia 1B)</li>
            <li>Programa de acondicionamiento general con ejercicios de bajo impacto (nivel de evidencia 1A)</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Educación:</h6>
          <ul>
            <li>Información sobre la naturaleza de su condición y pronóstico favorable</li>
            <li>Estrategias para optimizar la mecánica de la cadera en actividades cotidianas</li>
            <li>Importancia del ejercicio regular para mantenimiento de la función</li>
            <li>Técnicas de autogestión y autocuidado</li>
            <li>Modificaciones para actividades deportivas o recreativas específicas</li>
            <li>Reconocimiento temprano de señales de alerta y manejo de síntomas</li>
            <li>Estrategias para prevenir recurrencias o progresión de síntomas</li>
          </ul>
        </div>
      `;
    } else if (puntuacionTotalNormalizada >= 40) {
      recomendaciones = `
        <div class="recomendacion-seccion">
          <h6>Evaluación:</h6>
          <ul>
            <li>Evaluación biomecánica completa del complejo lumbopélvico y extremidades inferiores</li>
            <li>Valoración detallada de la movilidad, estabilidad y control motor de la cadera</li>
            <li>Análisis de patrones compensatorios y adaptaciones funcionales</li>
            <li>Evaluación del impacto en actividades cotidianas y calidad de vida</li>
            <li>Identificación de barreras específicas para actividades funcionales</li>
            <li>Valoración de factores que exacerban y alivian los síntomas</li>
            <li>Análisis de la distribución de cargas y patrones de movimiento</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Intervención:</h6>
          <ul>
            <li>Programa multimodal de ejercicios terapéuticos progresivos (nivel de evidencia 1A)</li>
            <li>Fortalecimiento específico de musculatura estabilizadora de cadera y core (nivel de evidencia 1A)</li>
            <li>Ejercicios para mejorar el control neuromuscular y propioceptivo (nivel de evidencia 1A)</li>
            <li>Técnicas de movilización articular específicas según restricciones (nivel de evidencia 1B)</li>
            <li>Estiramientos para estructuras acortadas y técnicas de liberación miofascial (nivel de evidencia 1B)</li>
            <li>Programa de ejercicio aeróbico de bajo impacto (nivel de evidencia 1A)</li>
            <li>Entrenamiento funcional progresivo para actividades cotidianas limitadas (nivel de evidencia 1A)</li>
            <li>Estrategias específicas para manejo del dolor durante actividades (nivel de evidencia 1B)</li>
            <li>Reeducación de patrones de movimiento compensatorios (nivel de evidencia 1B)</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Educación:</h6>
          <ul>
            <li>Educación sobre fisiopatología de la condición y factores contribuyentes</li>
            <li>Técnicas de pacing y gestión de actividades para equilibrar función y dolor</li>
            <li>Estrategias de modificación de actividades para optimizar la función</li>
            <li>Principios de protección articular durante actividades cotidianas</li>
            <li>Importancia de la adherencia al programa de ejercicios</li>
            <li>Manejo de expectativas y establecimiento de objetivos realistas</li>
            <li>Reconocimiento y manejo de factores desencadenantes de síntomas</li>
            <li>Técnicas específicas para actividades problemáticas (levantarse, sentarse, etc.)</li>
          </ul>
        </div>
      `;
    } else {
      recomendaciones = `
        <div class="recomendacion-seccion">
          <h6>Evaluación:</h6>
          <ul>
            <li>Evaluación multidimensional detallada de factores físicos, funcionales y psicosociales</li>
            <li>Valoración de limitaciones primarias y adaptaciones secundarias</li>
            <li>Análisis del impacto en actividades esenciales de la vida diaria</li>
            <li>Identificación de factores contribuyentes y perpetuantes</li>
            <li>Evaluación de comorbilidades y su influencia en la presentación clínica</li>
            <li>Valoración de la calidad de vida y participación social</li>
            <li>Análisis de recursos de apoyo y barreras para la recuperación</li>
            <li>Consideración de indicaciones para evaluación complementaria especializada</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Intervención:</h6>
          <ul>
            <li>Programa integral con énfasis en control del dolor y mejora funcional (nivel de evidencia 1A)</li>
            <li>Ejercicios terapéuticos con progresión muy gradual según tolerancia (nivel de evidencia 1A)</li>
            <li>Terapia manual para reducir dolor y mejorar movilidad dentro de límites tolerables (nivel de evidencia 1B)</li>
            <li>Entrenamiento específico para actividades funcionales prioritarias (nivel de evidencia 1A)</li>
            <li>Técnicas multimodales para manejo del dolor (nivel de evidencia 1A)</li>
            <li>Ejercicio acuático si está disponible y es apropiado (nivel de evidencia 1A)</li>
            <li>Programa de acondicionamiento general adaptado (nivel de evidencia 1A)</li>
            <li>Consideración de órtesis o ayudas técnicas según necesidades específicas (nivel de evidencia 2A)</li>
            <li>Abordaje físico-funcional que considere factores psicosociales (nivel de evidencia 1A)</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Educación:</h6>
          <ul>
            <li>Educación detallada sobre la condición y opciones de manejo</li>
            <li>Estrategias de autogestión y manejo activo de síntomas</li>
            <li>Técnicas específicas de protección articular y conservación de energía</li>
            <li>Modificaciones del entorno para optimizar la independencia funcional</li>
            <li>Establecimiento de expectativas realistas y objetivos progresivos</li>
            <li>Importancia del enfoque activo en la recuperación</li>
            <li>Estrategias para mantener participación social y roles significativos</li>
            <li>Técnicas para manejo de exacerbaciones y recaídas</li>
            <li>Información sobre opciones terapéuticas avanzadas cuando sean apropiadas</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Consideraciones adicionales:</h6>
          <ul>
            <li>Valorar derivación a especialista para evaluación avanzada en casos de afectación severa persistente</li>
            <li>Considerar enfoque multidisciplinar para optimizar resultados</li>
            <li>Evaluar necesidad de intervenciones para manejo del dolor adicionales</li>
            <li>Establecer plan de seguimiento regular para monitorizar progreso</li>
            <li>Reevaluar periódicamente usando el HOOS para documentar cambios</li>
          </ul>
        </div>
      `;
    }
  } else {
    recomendaciones = `
      <p>No hay suficientes datos para proporcionar recomendaciones terapéuticas específicas. Se requiere completar al menos el 80% de los ítems de cada subescala para una evaluación fiable.</p>
      <p>Por favor, complete las secciones restantes del cuestionario para recibir recomendaciones personalizadas.</p>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('hoos-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('hoos-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Función para calcular el KOOS (Knee Injury and Osteoarthritis Outcome Score)
function calcularKOOS() {
  console.log("Calculando KOOS...");
  
  // Definir las categorías de preguntas
  const categorias = {
    sintomas: ['koos_s1', 'koos_s2', 'koos_s3', 'koos_s4', 'koos_s5', 'koos_s6', 'koos_s7'],
    dolor: ['koos_p1', 'koos_p2', 'koos_p3', 'koos_p4', 'koos_p5', 'koos_p6', 'koos_p7', 'koos_p8', 'koos_p9'],
    avd: ['koos_a1', 'koos_a2', 'koos_a3', 'koos_a4', 'koos_a5', 'koos_a6', 'koos_a7', 'koos_a8', 'koos_a9', 'koos_a10', 
          'koos_a11', 'koos_a12', 'koos_a13', 'koos_a14', 'koos_a15', 'koos_a16', 'koos_a17'],
    deporte: ['koos_sp1', 'koos_sp2', 'koos_sp3', 'koos_sp4', 'koos_sp5'],
    qol: ['koos_q1', 'koos_q2', 'koos_q3', 'koos_q4']
  };
  
  // Función para obtener el valor de un ítem
  function getItemValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? parseInt(radio.value) : null;
  }
  
  // Contar ítems respondidos y calcular puntuaciones por categoría
  const puntuaciones = {};
  const itemsRespondidos = {};
  const totalItems = {};
  let totalRespondidos = 0;
  let totalPreguntas = 0;
  
  for (const [categoria, items] of Object.entries(categorias)) {
    puntuaciones[categoria] = 0;
    itemsRespondidos[categoria] = 0;
    totalItems[categoria] = items.length;
    totalPreguntas += items.length;
    
    for (const item of items) {
      const valor = getItemValue(item);
      if (valor !== null) {
        puntuaciones[categoria] += valor;
        itemsRespondidos[categoria]++;
        totalRespondidos++;
      }
    }
  }
  
  console.log("Puntuaciones por categoría:", puntuaciones);
  console.log("Items respondidos por categoría:", itemsRespondidos);
  console.log("Total ítems respondidos:", totalRespondidos);
  
  // Verificar si el usuario ha interactuado con el cuestionario
  const interaccionUsuario = totalRespondidos > 0;
  
  // Si el usuario no ha interactuado con el cuestionario, mostramos "No completado"
  if (!interaccionUsuario) {
    if (document.getElementById('koos-badge')) {
      document.getElementById('koos-badge').textContent = "No completado";
      document.getElementById('koos-badge').className = "resultado-badge no-completado";
    }
    
    if (document.getElementById('koos-interpretacion-total')) {
      document.getElementById('koos-interpretacion-total').textContent = "Complete el cuestionario";
    }
    
    if (document.getElementById('koos-interpretacion-clinica')) {
      document.getElementById('koos-interpretacion-clinica').textContent = "Complete el cuestionario para obtener la interpretación clínica.";
    }
    
    if (document.getElementById('koos-recomendaciones')) {
      document.getElementById('koos-recomendaciones').textContent = "Complete el cuestionario para obtener recomendaciones terapéuticas.";
    }
    
    return;
  }
  
  // Para un resultado válido, al menos el 80% de los ítems deben ser respondidos en cada categoría
  const respuestasMinimas = {};
  let cuestionarioCompleto = true;
  const categoriasSuficientes = [];
  
  for (const [categoria, total] of Object.entries(totalItems)) {
    respuestasMinimas[categoria] = Math.ceil(total * 0.8);
    if (itemsRespondidos[categoria] < respuestasMinimas[categoria]) {
      cuestionarioCompleto = false;
    } else {
      categoriasSuficientes.push(categoria);
    }
  }
  
  let mensajeCompletado = "";
  if (!cuestionarioCompleto) {
    mensajeCompletado = " (incompleto - los resultados pueden no ser confiables)";
  }
  
  // Calcular puntuaciones normalizadas (0-100, donde 100 = sin problemas)
  const puntuacionesNormalizadas = {};
  let puntuacionTotal = 0;
  let contadorCategoriasValidas = 0;
  
  for (const [categoria, puntuacion] of Object.entries(puntuaciones)) {
    if (itemsRespondidos[categoria] >= respuestasMinimas[categoria]) {
      // Calcular la puntuación normalizada: 100 - (puntuación media * 25)
      // Puntuación media = suma de valores / número de ítems respondidos
      // Multiplicado por 25 para convertir de escala 0-4 a 0-100
      const puntuacionMedia = puntuacion / itemsRespondidos[categoria];
      puntuacionesNormalizadas[categoria] = 100 - (puntuacionMedia * 25);
      puntuacionTotal += puntuacionesNormalizadas[categoria];
      contadorCategoriasValidas++;
    } else {
      puntuacionesNormalizadas[categoria] = null;
    }
  }
  
  // Calcular puntuación total promediando las categorías válidas
  const puntuacionTotalNormalizada = contadorCategoriasValidas > 0 ? 
                                     puntuacionTotal / contadorCategoriasValidas : null;
  
  console.log("Puntuaciones normalizadas:", puntuacionesNormalizadas);
  console.log("Puntuación total normalizada:", puntuacionTotalNormalizada);
  
  // Determinar el nivel de afectación basado en la puntuación total
  let nivelAfectacion = "";
  let colorBadge = "";
  let colorClase = "";
  
  if (puntuacionTotalNormalizada !== null) {
    if (puntuacionTotalNormalizada >= 70) {
      nivelAfectacion = "Afectación leve";
      colorBadge = "bajo";
      colorClase = "nivel-leve";
    } else if (puntuacionTotalNormalizada >= 40) {
      nivelAfectacion = "Afectación moderada";
      colorBadge = "moderado";
      colorClase = "nivel-moderado";
    } else {
      nivelAfectacion = "Afectación severa";
      colorBadge = "alto";
      colorClase = "nivel-severo";
    }
  } else {
    nivelAfectacion = "No evaluable";
    colorBadge = "no-completado";
    colorClase = "";
  }
  
  // Actualizar elementos en la página
  if (document.getElementById('koos-valor-total')) {
    document.getElementById('koos-valor-total').textContent = puntuacionTotalNormalizada !== null ? 
                                                           puntuacionTotalNormalizada.toFixed(1) + "%" + mensajeCompletado : 
                                                           "No evaluable";
  }
  
  // Actualizar valores de subescalas
  const idsPorCategoria = {
    sintomas: 'koos-valor-sintomas',
    dolor: 'koos-valor-dolor',
    avd: 'koos-valor-avd',
    deporte: 'koos-valor-deporte',
    qol: 'koos-valor-qol'
  };
  
  for (const [categoria, id] of Object.entries(idsPorCategoria)) {
    if (document.getElementById(id)) {
      document.getElementById(id).textContent = puntuacionesNormalizadas[categoria] !== null ? 
                                               puntuacionesNormalizadas[categoria].toFixed(1) + "%" : 
                                               "No evaluable";
    }
  }
  
  if (document.getElementById('koos-interpretacion-total')) {
    document.getElementById('koos-interpretacion-total').textContent = nivelAfectacion;
    document.getElementById('koos-interpretacion-total').className = "resultado-interpretacion " + colorBadge.replace("bajo", "verde").replace("moderado", "amarillo").replace("alto", "rojo");
  }
  
  // Actualizar estado del badge
  if (document.getElementById('koos-badge')) {
    document.getElementById('koos-badge').textContent = nivelAfectacion;
    document.getElementById('koos-badge').className = "resultado-badge completado " + colorBadge;
  }
  
  // Actualizar el contenedor de resultados con la clase de color
  const resultadoContainer = document.getElementById('koos-resultado');
  if (resultadoContainer) {
    resultadoContainer.className = "resultado-container " + colorClase;
  }
  
  // Generar interpretación clínica basada en la puntuación
  let interpretacionClinica = "";
  
  if (puntuacionTotalNormalizada !== null) {
    if (puntuacionTotalNormalizada >= 70) {
      interpretacionClinica = `
        <p>El paciente presenta una puntuación promedio del <strong>${puntuacionTotalNormalizada.toFixed(1)}%</strong> en el cuestionario KOOS, lo que indica una <strong>afectación leve</strong> en la función de rodilla y síntomas relacionados.</p>
        <p>Análisis por subescalas:</p>
        <ul>
          ${puntuacionesNormalizadas.dolor !== null ? `<li><strong>Dolor:</strong> ${puntuacionesNormalizadas.dolor.toFixed(1)}% - ${puntuacionesNormalizadas.dolor >= 70 ? 'Leve' : puntuacionesNormalizadas.dolor >= 40 ? 'Moderado' : 'Severo'}</li>` : ''}
          ${puntuacionesNormalizadas.sintomas !== null ? `<li><strong>Síntomas:</strong> ${puntuacionesNormalizadas.sintomas.toFixed(1)}% - ${puntuacionesNormalizadas.sintomas >= 70 ? 'Leves' : puntuacionesNormalizadas.sintomas >= 40 ? 'Moderados' : 'Severos'}</li>` : ''}
          ${puntuacionesNormalizadas.avd !== null ? `<li><strong>Actividades de la vida diaria:</strong> ${puntuacionesNormalizadas.avd.toFixed(1)}% - ${puntuacionesNormalizadas.avd >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.avd >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.deporte !== null ? `<li><strong>Deportes/actividades recreativas:</strong> ${puntuacionesNormalizadas.deporte.toFixed(1)}% - ${puntuacionesNormalizadas.deporte >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.deporte >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.qol !== null ? `<li><strong>Calidad de vida:</strong> ${puntuacionesNormalizadas.qol.toFixed(1)}% - ${puntuacionesNormalizadas.qol >= 70 ? 'Poco afectada' : puntuacionesNormalizadas.qol >= 40 ? 'Moderadamente afectada' : 'Severamente afectada'}</li>` : ''}
        </ul>
        <p>Esta puntuación sugiere que el paciente:</p>
        <ul>
          <li>Conserva una buena funcionalidad de la rodilla para la mayoría de las actividades cotidianas</li>
          <li>Presenta síntomas y dolor leves que no interfieren significativamente con su calidad de vida</li>
          <li>Puede experimentar algunas limitaciones en actividades de mayor demanda o deportivas</li>
          <li>Muestra buen pronóstico para mantener o mejorar su función con intervención adecuada</li>
          <li>Probablemente responderá bien a intervenciones conservadoras dirigidas a factores biomecánicos específicos</li>
        </ul>
      `;
    } else if (puntuacionTotalNormalizada >= 40) {
      interpretacionClinica = `
        <p>El paciente presenta una puntuación promedio del <strong>${puntuacionTotalNormalizada.toFixed(1)}%</strong> en el cuestionario KOOS, lo que indica una <strong>afectación moderada</strong> en la función de rodilla y síntomas relacionados.</p>
        <p>Análisis por subescalas:</p>
        <ul>
          ${puntuacionesNormalizadas.dolor !== null ? `<li><strong>Dolor:</strong> ${puntuacionesNormalizadas.dolor.toFixed(1)}% - ${puntuacionesNormalizadas.dolor >= 70 ? 'Leve' : puntuacionesNormalizadas.dolor >= 40 ? 'Moderado' : 'Severo'}</li>` : ''}
          ${puntuacionesNormalizadas.sintomas !== null ? `<li><strong>Síntomas:</strong> ${puntuacionesNormalizadas.sintomas.toFixed(1)}% - ${puntuacionesNormalizadas.sintomas >= 70 ? 'Leves' : puntuacionesNormalizadas.sintomas >= 40 ? 'Moderados' : 'Severos'}</li>` : ''}
          ${puntuacionesNormalizadas.avd !== null ? `<li><strong>Actividades de la vida diaria:</strong> ${puntuacionesNormalizadas.avd.toFixed(1)}% - ${puntuacionesNormalizadas.avd >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.avd >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.deporte !== null ? `<li><strong>Deportes/actividades recreativas:</strong> ${puntuacionesNormalizadas.deporte.toFixed(1)}% - ${puntuacionesNormalizadas.deporte >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.deporte >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.qol !== null ? `<li><strong>Calidad de vida:</strong> ${puntuacionesNormalizadas.qol.toFixed(1)}% - ${puntuacionesNormalizadas.qol >= 70 ? 'Poco afectada' : puntuacionesNormalizadas.qol >= 40 ? 'Moderadamente afectada' : 'Severamente afectada'}</li>` : ''}
        </ul>
        <p>Esta puntuación sugiere que el paciente:</p>
        <ul>
          <li>Experimenta dolor y síntomas moderados en la rodilla que impactan en sus actividades diarias</li>
          <li>Presenta dificultades significativas para algunas actividades funcionales como subir/bajar escaleras, ponerse en cuclillas o arrodillarse</li>
          <li>Muestra limitaciones importantes para actividades deportivas o recreativas</li>
          <li>Ha modificado algunas de sus actividades habituales debido a su condición de rodilla</li>
          <li>Presenta una calidad de vida afectada por su problema de rodilla</li>
          <li>Probablemente ha desarrollado adaptaciones y compensaciones para mantener su funcionalidad</li>
          <li>Requiere un programa de intervención estructurado que aborde tanto el dolor como la función</li>
        </ul>
      `;
    } else {
      interpretacionClinica = `
        <p>El paciente presenta una puntuación promedio del <strong>${puntuacionTotalNormalizada.toFixed(1)}%</strong> en el cuestionario KOOS, lo que indica una <strong>afectación severa</strong> en la función de rodilla y síntomas relacionados.</p>
        <p>Análisis por subescalas:</p>
        <ul>
          ${puntuacionesNormalizadas.dolor !== null ? `<li><strong>Dolor:</strong> ${puntuacionesNormalizadas.dolor.toFixed(1)}% - ${puntuacionesNormalizadas.dolor >= 70 ? 'Leve' : puntuacionesNormalizadas.dolor >= 40 ? 'Moderado' : 'Severo'}</li>` : ''}
          ${puntuacionesNormalizadas.sintomas !== null ? `<li><strong>Síntomas:</strong> ${puntuacionesNormalizadas.sintomas.toFixed(1)}% - ${puntuacionesNormalizadas.sintomas >= 70 ? 'Leves' : puntuacionesNormalizadas.sintomas >= 40 ? 'Moderados' : 'Severos'}</li>` : ''}
          ${puntuacionesNormalizadas.avd !== null ? `<li><strong>Actividades de la vida diaria:</strong> ${puntuacionesNormalizadas.avd.toFixed(1)}% - ${puntuacionesNormalizadas.avd >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.avd >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.deporte !== null ? `<li><strong>Deportes/actividades recreativas:</strong> ${puntuacionesNormalizadas.deporte.toFixed(1)}% - ${puntuacionesNormalizadas.deporte >= 70 ? 'Limitación leve' : puntuacionesNormalizadas.deporte >= 40 ? 'Limitación moderada' : 'Limitación severa'}</li>` : ''}
          ${puntuacionesNormalizadas.qol !== null ? `<li><strong>Calidad de vida:</strong> ${puntuacionesNormalizadas.qol.toFixed(1)}% - ${puntuacionesNormalizadas.qol >= 70 ? 'Poco afectada' : puntuacionesNormalizadas.qol >= 40 ? 'Moderadamente afectada' : 'Severamente afectada'}</li>` : ''}
        </ul>
        <p>Esta puntuación sugiere que el paciente:</p>
        <ul>
          <li>Experimenta dolor intenso y síntomas significativos que limitan severamente su función</li>
          <li>Presenta dificultades importantes para actividades básicas de la vida diaria como caminar, subir escaleras o sentarse/levantarse</li>
          <li>Tiene restricciones severas para actividades deportivas o recreativas</li>
          <li>Muestra una calidad de vida significativamente afectada por su problema de rodilla</li>
          <li>Puede requerir adaptaciones o asistencia para algunas actividades cotidianas</li>
          <li>Probablemente ha modificado considerablemente su estilo de vida debido a su condición</li>
          <li>Puede presentar problemas específicos como bloqueos, inestabilidad o rigidez significativa</li>
          <li>Necesita un abordaje integral de su problema, posiblemente multidisciplinar</li>
        </ul>
      `;
    }
  } else {
    interpretacionClinica = `
      <p>No hay suficientes datos para realizar una interpretación clínica completa. Se requiere que al menos el 80% de los ítems de cada subescala sean respondidos para un análisis fiable.</p>
      <p>Subescalas completadas adecuadamente:</p>
      <ul>
        ${categoriasSuficientes.map(cat => `<li>${cat === 'sintomas' ? 'Síntomas' : cat === 'dolor' ? 'Dolor' : cat === 'avd' ? 'Actividades de la vida diaria' : cat === 'deporte' ? 'Deportes/actividades recreativas' : 'Calidad de vida'}</li>`).join('')}
      </ul>
      <p>Por favor, complete las secciones restantes para obtener una interpretación más precisa.</p>
    `;
  }
  
  // Generar recomendaciones terapéuticas
  let recomendaciones = "";
  
  if (puntuacionTotalNormalizada !== null) {
    if (puntuacionTotalNormalizada >= 70) {
      recomendaciones = `
        <div class="recomendacion-seccion">
          <h6>Evaluación:</h6>
          <ul>
            <li>Evaluación biomecánica detallada de la rodilla y articulaciones relacionadas</li>
            <li>Valoración de la función de la musculatura periarticular (cuádriceps, isquiotibiales)</li>
            <li>Análisis de patrones de movimiento y control motor en actividades específicas</li>
            <li>Evaluación de la propiocepción y estabilidad dinámica</li>
            <li>Valoración funcional específica para actividades que aún presentan dificultad</li>
            <li>Análisis de factores de riesgo para progresión o recidiva</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Intervención:</h6>
          <ul>
            <li>Fortalecimiento progresivo de la musculatura estabilizadora de rodilla (nivel de evidencia 1A)</li>
            <li>Ejercicios específicos para mejorar el control neuromuscular (nivel de evidencia 1A)</li>
            <li>Entrenamiento propioceptivo y de estabilidad dinámica (nivel de evidencia 1A)</li>
            <li>Terapia manual específica según hallazgos biomecánicos (nivel de evidencia 1B)</li>
            <li>Ejercicios funcionales para optimizar patrones de movimiento (nivel de evidencia 1A)</li>
            <li>Programa de acondicionamiento general con énfasis en actividades de bajo impacto (nivel de evidencia 1A)</li>
            <li>Entrenamiento específico para actividades deportivas o recreativas limitadas (nivel de evidencia 1B)</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Educación:</h6>
          <ul>
            <li>Información sobre la naturaleza de su condición y pronóstico favorable</li>
            <li>Estrategias de protección articular para actividades de mayor demanda</li>
            <li>Importancia del mantenimiento de la masa muscular y control motor</li>
            <li>Técnicas de autogestión y ejercicios de mantenimiento</li>
            <li>Modificaciones para actividades deportivas o recreativas específicas</li>
            <li>Reconocimiento temprano de señales de alerta y manejo de síntomas</li>
            <li>Estrategias para prevenir recurrencias o progresión de síntomas</li>
          </ul>
        </div>
      `;
    } else if (puntuacionTotalNormalizada >= 40) {
      recomendaciones = `
        <div class="recomendacion-seccion">
          <h6>Evaluación:</h6>
          <ul>
            <li>Evaluación biomecánica completa de rodilla y cadena cinética relacionada</li>
            <li>Valoración detallada de la función muscular, flexibilidad y control motor</li>
            <li>Análisis de patrones compensatorios y adaptaciones funcionales</li>
            <li>Evaluación específica de síntomas como inestabilidad, bloqueos o rigidez</li>
            <li>Valoración del impacto en actividades cotidianas y calidad de vida</li>
            <li>Identificación de factores que exacerban y alivian los síntomas</li>
            <li>Análisis de la distribución de cargas y patrones de movimiento</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Intervención:</h6>
          <ul>
            <li>Programa multimodal de ejercicios terapéuticos progresivos (nivel de evidencia 1A)</li>
            <li>Fortalecimiento específico del cuádriceps y musculatura estabilizadora (nivel de evidencia 1A)</li>
            <li>Entrenamiento neuromuscular para mejorar control y estabilidad (nivel de evidencia 1A)</li>
            <li>Ejercicios propioceptivos y de equilibrio (nivel de evidencia 1A)</li>
            <li>Técnicas de movilización articular específicas según restricciones (nivel de evidencia 1B)</li>
            <li>Programa de ejercicio aeróbico de bajo impacto (nivel de evidencia 1A)</li>
            <li>Entrenamiento funcional para actividades cotidianas limitadas (nivel de evidencia 1A)</li>
            <li>Estrategias específicas para manejo del dolor durante actividades (nivel de evidencia 1B)</li>
            <li>Reeducación de patrones de movimiento compensatorios (nivel de evidencia 1B)</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Educación:</h6>
          <ul>
            <li>Educación sobre la fisiopatología de la condición y factores contribuyentes</li>
            <li>Técnicas de pacing y gestión de actividades para optimizar función</li>
            <li>Estrategias de modificación de actividades para reducir sobrecarga articular</li>
            <li>Importancia de la adherencia al programa de ejercicios</li>
            <li>Manejo de expectativas y establecimiento de objetivos realistas</li>
            <li>Principios de protección articular durante actividades cotidianas</li>
            <li>Reconocimiento y manejo de factores desencadenantes de síntomas</li>
            <li>Técnicas específicas para actividades problemáticas (escaleras, sentarse/levantarse, etc.)</li>
          </ul>
        </div>
      `;
    } else {
      recomendaciones = `
        <div class="recomendacion-seccion">
          <h6>Evaluación:</h6>
          <ul>
            <li>Evaluación multidimensional detallada de factores físicos, funcionales y psicosociales</li>
            <li>Valoración de limitaciones primarias y adaptaciones secundarias</li>
            <li>Análisis del impacto en actividades esenciales de la vida diaria</li>
            <li>Evaluación de posibles complicaciones mecánicas (bloqueos, inestabilidad)</li>
            <li>Valoración de comorbilidades y su influencia en la presentación clínica</li>
            <li>Análisis de la calidad de vida y participación social</li>
            <li>Identificación de recursos de apoyo y barreras para la recuperación</li>
            <li>Consideración de indicaciones para evaluación complementaria especializada</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Intervención:</h6>
          <ul>
            <li>Programa integral con énfasis en control del dolor y mejora funcional (nivel de evidencia 1A)</li>
            <li>Ejercicios terapéuticos con progresión muy gradual según tolerancia (nivel de evidencia 1A)</li>
            <li>Fortalecimiento específico adaptado a la condición actual (nivel de evidencia 1A)</li>
            <li>Terapia manual para reducir dolor y mejorar movilidad dentro de límites tolerables (nivel de evidencia 1B)</li>
            <li>Entrenamiento específico para actividades funcionales prioritarias (nivel de evidencia 1A)</li>
            <li>Ejercicio acuático si está disponible y es apropiado (nivel de evidencia 1A)</li>
            <li>Técnicas multimodales para manejo del dolor (nivel de evidencia 1A)</li>
            <li>Ejercicios de control motor y estabilización (nivel de evidencia 1A)</li>
            <li>Consideración de órtesis o ayudas técnicas según necesidades específicas (nivel de evidencia 2A)</li>
            <li>Abordaje físico-funcional que considere factores psicosociales (nivel de evidencia 1A)</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Educación:</h6>
          <ul>
            <li>Educación detallada sobre la condición y opciones de manejo</li>
            <li>Estrategias de autogestión y manejo activo de síntomas</li>
            <li>Técnicas específicas de protección articular y conservación de energía</li>
            <li>Modificaciones del entorno para optimizar la independencia funcional</li>
            <li>Establecimiento de expectativas realistas y objetivos progresivos</li>
            <li>Importancia del enfoque activo en la recuperación</li>
            <li>Estrategias para mantener participación social y roles significativos</li>
            <li>Técnicas para manejo de exacerbaciones y recaídas</li>
            <li>Información sobre opciones terapéuticas avanzadas cuando sean apropiadas</li>
          </ul>
        </div>
        
        <div class="recomendacion-seccion">
          <h6>Consideraciones adicionales:</h6>
          <ul>
            <li>Valorar derivación a especialista para evaluación avanzada en casos de afectación severa persistente</li>
            <li>Considerar enfoque multidisciplinar para optimizar resultados</li>
            <li>Evaluar necesidad de intervenciones para manejo del dolor adicionales</li>
            <li>Establecer plan de seguimiento regular para monitorizar progreso</li>
            <li>Reevaluar periódicamente usando el KOOS para documentar cambios</li>
          </ul>
        </div>
      `;
    }
  } else {
    recomendaciones = `
      <p>No hay suficientes datos para proporcionar recomendaciones terapéuticas específicas. Se requiere completar al menos el 80% de los ítems de cada subescala para una evaluación fiable.</p>
      <p>Por favor, complete las secciones restantes del cuestionario para recibir recomendaciones personalizadas.</p>
    `;
  }
  
  // Actualizar la interpretación clínica y recomendaciones en la página
  const interpretacionClinicaEl = document.getElementById('koos-interpretacion-clinica');
  if (interpretacionClinicaEl) {
    interpretacionClinicaEl.innerHTML = interpretacionClinica;
    console.log("Interpretación clínica actualizada");
  }
  
  const recomendacionesEl = document.getElementById('koos-recomendaciones');
  if (recomendacionesEl) {
    recomendacionesEl.innerHTML = recomendaciones;
    console.log("Recomendaciones actualizadas");
  }
}

// Inicializar los cuestionarios al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar PSFS
  calcularPSFS();
  
  // Inicializar GROC
  calcularGROC();
  
  // Inicializar SANE
  calcularSANE();
  
  // Inicializar BPI
  calcularBPI();

  // Inicializar PCS
  calcularPCS();

  // Inicializar CSI
  calcularCSI();

  // Inicializar TSK-11
  calcularTSK();
  
  // Inicializar DN4
  calcularDN4();

  // Inicializar NDI
  calcularNDI();

  // Inicializar QuickDASH 
  calcularQuickDASH();

  // Inicializar SPADI (añadir esta línea)
  calcularSPADI();

  // Inicializar Oswestry (añadir esta línea)
  calcularOswestry();

  // Inicializar Roland Morris (añadir esta línea)
  calcularRolandMorris();

  // Inicializar WOMAC (añadir esta línea)
  calcularWOMAC();

  // Inicializar START MSK Tool (añadir esta línea)
  calcularStartMSK();

  // Inicializar START Back Tool (añadir esta línea)
  calcularStartBack();

  // Inicializar LEFS (añadir esta línea)
  calcularLEFS();

  // Inicializar HOOS (añadir esta línea)
  calcularHOOS();

  // Inicializar KOOS (añadir esta línea)
  calcularKOOS();
  
  // Asegurarse de que los event listeners de toggle estén configurados correctamente
  document.querySelectorAll('.cuestionario-header').forEach(header => {
    // Eliminar cualquier evento existente
    const clonedHeader = header.cloneNode(true);
    header.parentNode.replaceChild(clonedHeader, header);
    
    // Añadir el evento de clic con la función toggleCuestionario
    clonedHeader.addEventListener('click', function() {
      const contentId = this.nextElementSibling.id;
      toggleCuestionario(contentId);
    });
  });
});
