// Función para actualizar la inspección con sistema de semáforo
function actualizarInspeccion() {
  let nivelSeveridad = 0; // 0: Normal/Leve, 1: Moderado, 2: Severo
  let hallazgosDetectados = [];
  
  // Evaluar cambios tróficos
  if (document.getElementById('insp_atrofia').checked) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Atrofia muscular");
  }
  if (document.getElementById('insp_hipertrofia').checked) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Hipertrofia muscular");
  }
  
  // Evaluar coloración de piel
  const colorPiel = document.getElementById('insp_color_piel').value;
  if (colorPiel === "Eritema" || colorPiel === "Palidez") {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(`Alteración en la coloración: ${colorPiel}`);
  } else if (colorPiel === "Cianosis") {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
    hallazgosDetectados.push("Cianosis");
  }
  
  // Evaluar cicatrices
  const cicatrices = document.getElementById('insp_cicatrices').value;
  if (cicatrices.includes("adheridas") || cicatrices.includes("hipertróficas")) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(cicatrices);
  } else if (cicatrices.includes("queloides")) {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
    hallazgosDetectados.push("Cicatrices queloides");
  }
  
  // Evaluar edema
  const edema = document.getElementById('insp_edema').value;
  if (edema === "Leve (+)") {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Edema leve");
  } else if (edema.includes("Moderado")) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Edema moderado");
  } else if (edema.includes("Severo")) {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
    hallazgosDetectados.push("Edema severo");
  }
  
  // Evaluar hematomas
  const hematomas = document.getElementById('insp_hematomas').value;
  if (hematomas === "Reciente") {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Hematoma reciente");
  }
  
  // Evaluar deformidades
  if (document.getElementById('insp_deformidad').checked) {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
    hallazgosDetectados.push("Deformidad estructural");
  }
  if (document.getElementById('insp_alteracion_postural').checked) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Alteración postural");
  }
  if (document.getElementById('insp_desviacion_eje').checked) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Desviación del eje");
  }
  
  // Actualizar alerta según nivel de severidad
  const alertaInspeccion = document.getElementById('alerta_inspeccion');
  if (nivelSeveridad === 0) {
    alertaInspeccion.className = "alert alert-success mt-3";
    alertaInspeccion.innerHTML = "<strong><i class='fas fa-check-circle'></i> Estado de inspección:</strong> No se han detectado hallazgos significativos.";
  } else if (nivelSeveridad === 1) {
    alertaInspeccion.className = "alert alert-warning mt-3";
    alertaInspeccion.innerHTML = `<strong><i class='fas fa-exclamation-triangle'></i> Estado de inspección:</strong> Se han detectado hallazgos moderados que requieren atención: ${hallazgosDetectados.join(", ")}.`;
  } else {
    alertaInspeccion.className = "alert alert-danger mt-3";
    alertaInspeccion.innerHTML = `<strong><i class='fas fa-exclamation-circle'></i> Estado de inspección:</strong> Se han detectado hallazgos severos que requieren intervención: ${hallazgosDetectados.join(", ")}.`;
  }
  
  // Almacenar nivel de severidad para interpretación global
  document.getElementById('inspeccion-palpacion-badge').innerText = 'En progreso';
  
  // Actualizar la interpretación clínica
  actualizarInterpretacionClinica();
}

// Función para actualizar la palpación con sistema de semáforo
function actualizarPalpacion() {
  let nivelSeveridad = 0; // 0: Normal/Leve, 1: Moderado, 2: Severo
  let hallazgosDetectados = [];
  
  // Evaluar temperatura
  const temperatura = document.querySelector('input[name="palp_temperatura"]:checked').value;
  if (temperatura !== "Normal") {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(`Temperatura ${temperatura.toLowerCase()}`);
  }
  
  // Evaluar tono muscular
  const tonoMuscular = document.getElementById('palp_tono_muscular').value;
  if (tonoMuscular.includes("leve")) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(tonoMuscular);
  } else if (tonoMuscular.includes("moderada")) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(tonoMuscular);
  } else if (tonoMuscular.includes("severa")) {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
    hallazgosDetectados.push(tonoMuscular);
  }
  
  // Evaluar hallazgos musculares
  let countHallazgosMusculares = 0;
  if (document.getElementById('palp_bandas_tensas').checked) {
    countHallazgosMusculares++;
    hallazgosDetectados.push("Bandas tensas");
  }
  if (document.getElementById('palp_puntos_gatillo').checked) {
    countHallazgosMusculares++;
    hallazgosDetectados.push("Puntos gatillo");
  }
  if (document.getElementById('palp_espasmos').checked) {
    countHallazgosMusculares++;
    hallazgosDetectados.push("Espasmos musculares");
  }
  if (document.getElementById('palp_debilidad').checked) {
    countHallazgosMusculares++;
    hallazgosDetectados.push("Debilidad muscular palpable");
  }
  
  if (countHallazgosMusculares === 1) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
  } else if (countHallazgosMusculares >= 2) {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
  }
  
  // Evaluar hallazgos articulares
  const movilidadArticular = document.getElementById('palp_movilidad_articular').value;
  if (movilidadArticular.includes("leve")) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(movilidadArticular);
  } else if (movilidadArticular.includes("moderada")) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(movilidadArticular);
  } else if (movilidadArticular.includes("severa")) {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
    hallazgosDetectados.push(movilidadArticular);
  }
  
  let countHallazgosArticulares = 0;
  if (document.getElementById('palp_crepitacion').checked) {
    countHallazgosArticulares++;
    hallazgosDetectados.push("Crepitación");
  }
  if (document.getElementById('palp_derrame').checked) {
    countHallazgosArticulares++;
    hallazgosDetectados.push("Derrame articular");
    nivelSeveridad = Math.max(nivelSeveridad, 2); // Derrame es severo
  }
  if (document.getElementById('palp_inestabilidad').checked) {
    countHallazgosArticulares++;
    hallazgosDetectados.push("Inestabilidad articular");
    nivelSeveridad = Math.max(nivelSeveridad, 2); // Inestabilidad es severo
  }
  if (document.getElementById('palp_bloqueo').checked) {
    countHallazgosArticulares++;
    hallazgosDetectados.push("Bloqueo articular");
    nivelSeveridad = Math.max(nivelSeveridad, 2); // Bloqueo es severo
  }
  
  if (countHallazgosArticulares === 1 && nivelSeveridad < 2) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
  }
  
  // Evaluar dolor a la palpación
  const intensidadDolor = parseInt(document.getElementById('palp_dolor_intensidad').value);
  if (intensidadDolor >= 1 && intensidadDolor <= 3) {
    nivelSeveridad = Math.max(nivelSeveridad, 0);
    hallazgosDetectados.push(`Dolor leve (${intensidadDolor}/10)`);
  } else if (intensidadDolor >= 4 && intensidadDolor <= 6) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push(`Dolor moderado (${intensidadDolor}/10)`);
  } else if (intensidadDolor >= 7) {
    nivelSeveridad = Math.max(nivelSeveridad, 2);
    hallazgosDetectados.push(`Dolor severo (${intensidadDolor}/10)`);
  }
  
  // Verificar si reproduce el dolor del paciente
  if (document.getElementById('palp_dolor_reproduccion').checked) {
    nivelSeveridad = Math.max(nivelSeveridad, 1);
    hallazgosDetectados.push("Reproduce el dolor del paciente");
  }
  
  // Actualizar alerta según nivel de severidad
  const alertaPalpacion = document.getElementById('alerta_palpacion');
  if (nivelSeveridad === 0) {
    alertaPalpacion.className = "alert alert-success mt-3";
    alertaPalpacion.innerHTML = "<strong><i class='fas fa-check-circle'></i> Estado de palpación:</strong> No se han detectado hallazgos significativos.";
  } else if (nivelSeveridad === 1) {
    alertaPalpacion.className = "alert alert-warning mt-3";
    alertaPalpacion.innerHTML = `<strong><i class='fas fa-exclamation-triangle'></i> Estado de palpación:</strong> Se han detectado hallazgos moderados que requieren atención: ${hallazgosDetectados.join(", ")}.`;
  } else {
    alertaPalpacion.className = "alert alert-danger mt-3";
    alertaPalpacion.innerHTML = `<strong><i class='fas fa-exclamation-circle'></i> Estado de palpación:</strong> Se han detectado hallazgos severos que requieren intervención: ${hallazgosDetectados.join(", ")}.`;
  }
  
  // Actualizar la interpretación clínica
  actualizarInterpretacionClinica();
}

// Función para actualizar la interpretación clínica y recomendaciones
function actualizarInterpretacionClinica() {
  const severidadInspeccion = document.getElementById('alerta_inspeccion').className.includes('danger') ? 2 : 
                             document.getElementById('alerta_inspeccion').className.includes('warning') ? 1 : 0;
  
  const severidadPalpacion = document.getElementById('alerta_palpacion').className.includes('danger') ? 2 : 
                            document.getElementById('alerta_palpacion').className.includes('warning') ? 1 : 0;
  
  const severidadTotal = Math.max(severidadInspeccion, severidadPalpacion);
  
  // Marcar el estado de completado según la severidad
  const badgeElement = document.getElementById('inspeccion-palpacion-badge');
  if (severidadTotal === 0) {
    badgeElement.innerText = 'Completado - Normal';
    badgeElement.className = 'resultado-badge badge-success';
  } else if (severidadTotal === 1) {
    badgeElement.innerText = 'Completado - Moderado';
    badgeElement.className = 'resultado-badge badge-warning';
  } else {
    badgeElement.innerText = 'Completado - Severo';
    badgeElement.className = 'resultado-badge badge-danger';
  }
  
  // Generar interpretación clínica
  let interpretacion = "";
  let recomendaciones = "";
  let consideraciones = "";
  
  // Recopilar hallazgos para la interpretación
  const hallazgosInspeccion = document.getElementById('alerta_inspeccion').innerHTML;
  const hallazgosPalpacion = document.getElementById('alerta_palpacion').innerHTML;
  
  // Mostrar interpretación según severidad
  if (severidadTotal === 0) {
    interpretacion = `<p>La evaluación de inspección y palpación no muestra hallazgos significativos. Los tejidos presentan características normales sin signos de alteración estructural o funcional relevante.</p>`;
    
    recomendaciones = `<ul>
      <li>Continuar con evaluación funcional para valorar capacidades dinámicas.</li>
      <li>Considerar factores mecánicos y posturales que podrían estar contribuyendo a la sintomatología.</li>
      <li>El abordaje puede centrarse en aspectos preventivos y educativos.</li>
    </ul>`;
    
    consideraciones = `<p>Ausencia de hallazgos significativos a la inspección y palpación no descarta patología. Considere complementar con pruebas específicas, evaluación del movimiento y valoración funcional.</p>`;
  } else if (severidadTotal === 1) {
    interpretacion = `<p>La evaluación revela hallazgos de relevancia clínica moderada que sugieren alteraciones tisulares que requieren atención. Se evidencian signos de compromiso leve a moderado que pueden estar relacionados con la sintomatología actual.</p>`;
    
    recomendaciones = `<ul>
      <li>Realizar evaluaciones específicas adicionales para precisar el diagnóstico.</li>
      <li>Considerar terapia manual dirigida a las estructuras comprometidas.</li>
      <li>Implementar estrategias de control del dolor y modulación de la inflamación.</li>
      <li>Establecer un programa progresivo para recuperación funcional.</li>
    </ul>`;
    
    consideraciones = `<p>Los hallazgos moderados suelen responder favorablemente a la intervención conservadora. Monitorizar la evolución de los signos clínicos durante el tratamiento para ajustar el abordaje según sea necesario.</p>`;
  } else {
    interpretacion = `<p>La evaluación evidencia hallazgos significativos que indican compromiso importante de estructuras. La severidad de los signos clínicos sugiere un proceso patológico establecido que requiere intervención prioritaria y posible derivación para evaluación complementaria.</p>`;
    
    recomendaciones = `<ul>
      <li>Considerar derivación médica para estudios de imagen y evaluación especializada.</li>
      <li>Implementar estrategias para manejo del dolor y control de la inflamación como prioridad.</li>
      <li>Diseñar un plan de tratamiento conservador inicial con progresión cuidadosa.</li>
      <li>Establecer objetivos terapéuticos realistas a corto y mediano plazo.</li>
      <li>Monitorizar de cerca la respuesta al tratamiento y signos de alerta.</li>
    </ul>`;
    
    consideraciones = `<p>La presencia de hallazgos severos requiere un abordaje multidisciplinario y seguimiento cercano. La evolución clínica determinará la necesidad de ajustes en el plan de tratamiento y posibles derivaciones.</p>`;
  }
  
  // Actualizar contenido en la interfaz
  document.getElementById('interpretacion-texto').innerHTML = interpretacion;
  document.getElementById('recomendaciones-texto').innerHTML = recomendaciones;
  document.getElementById('consideraciones-texto').innerHTML = consideraciones;
}

// Función para mostrar/ocultar el contenido del acordeón
function toggleCuestionario(id) {
  const content = document.getElementById(id);
  if (content.style.display === "none") {
    content.style.display = "block";
    
    // Inicializar valores por defecto
    setTimeout(() => {
      actualizarInspeccion();
      actualizarPalpacion();
    }, 100);
  } else {
    content.style.display = "none";
  }
}

// Inicializar las funciones cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  // Cualquier inicialización adicional que se necesite
});
