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
  const valorElement = document.getElementById('dn4-valor');
  if (valorElement) {
    valorElement.textContent = puntaje + "/10";
    
    // Agregar una clase de color según el puntaje
    if (puntaje >= 4) {
      valorElement.classList.add('valor-alto');
    } else {
      valorElement.classList.add('valor-bajo');
    }
  }
  
  
  // Añadir un elemento separado para mostrar la puntuación
  const valorElement = document.getElementById('dn4-valor');
  if (valorElement) {
    valorElement.textContent = puntaje + "/10";
    
    // Agregar una clase de color según el puntaje
    if (puntaje >= 4) {
      valorElement.classList.add('valor-alto');
    } else {
      valorElement.classList.add('valor-bajo');
    }
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


// Inicializar los cuestionarios al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar otros cuestionarios (si ya existen en tu código)
  
  // Inicializar DN4
  calcularDN4();
  
  // Asegurarse de que los event listeners de toggle estén configurados
  document.querySelectorAll('.cuestionario-header').forEach(header => {
    header.addEventListener('click', function() {
      const contentId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
      toggleCuestionario(contentId);
    });
  });
});
