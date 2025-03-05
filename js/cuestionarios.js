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
    badge.classList.add("completado");
  } else {
    badge.textContent = "No completado";
    badge.classList.remove("completado");
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
      resultado.className = "resultado-container nivel-bajo";
      interpretacionEl.textContent = "Limitación severa de la función";
    } else if (promedio < 6) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Limitación moderada de la función";
    } else if (promedio < 8) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Limitación leve de la función";
    } else {
      resultado.className = "resultado-container nivel-alto";
      interpretacionEl.textContent = "Función normal o casi normal";
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
    badge.classList.add("completado");
    
    const resultado = document.getElementById('groc-resultado');
    const valorEl = document.getElementById('groc-valor');
    const interpretacionEl = document.getElementById('groc-interpretacion');
    
    valorEl.textContent = valorGROC;
    
    // Interpretación según el valor
    if (valorGROC <= -5) {
      resultado.className = "resultado-container nivel-bajo";
      interpretacionEl.textContent = "Cambio negativo importante (mucho peor)";
    } else if (valorGROC < 0) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Cambio negativo (peor)";
    } else if (valorGROC === 0) {
      resultado.className = "resultado-container nivel-neutro";
      interpretacionEl.textContent = "Sin cambios";
    } else if (valorGROC <= 3) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Cambio positivo mínimo (un poco mejor)";
    } else if (valorGROC <= 5) {
      resultado.className = "resultado-container nivel-alto";
      interpretacionEl.textContent = "Cambio positivo moderado (mejor)";
    } else {
      resultado.className = "resultado-container nivel-alto";
      interpretacionEl.textContent = "Cambio positivo importante (mucho mejor)";
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
  badge.classList.add("completado");
  
  const resultado = document.getElementById('sane-resultado');
  const valorEl = document.getElementById('sane-valor');
  const interpretacionEl = document.getElementById('sane-interpretacion');
  
  valorEl.textContent = puntuacion + "%";
  
  // Interpretación según el valor
  if (puntuacion < 30) {
    resultado.className = "resultado-container nivel-bajo";
    interpretacionEl.textContent = "Función muy reducida";
  } else if (puntuacion < 50) {
    resultado.className = "resultado-container nivel-bajo";
    interpretacionEl.textContent = "Función deficiente";
  } else if (puntuacion < 70) {
    resultado.className = "resultado-container nivel-medio";
    interpretacionEl.textContent = "Función moderada";
  } else if (puntuacion < 90) {
    resultado.className = "resultado-container nivel-alto";
    interpretacionEl.textContent = "Buena función";
  } else {
    resultado.className = "resultado-container nivel-alto";
    interpretacionEl.textContent = "Función normal o casi normal";
  }
}

// Inicializar la funcionalidad del SANE al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar los valores actuales
  if (document.getElementById('sane_puntuacion')) {
    calcularSANE();
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
  
  // Actualizar el badge con el estado
  const bpiBadge = document.getElementById('bpi-badge');
  
  // Verificar si se han completado todos los campos
  const intensidadCompletada = dolorActual || dolorPromedio || dolorPeor || dolorMenor;
  const interferenciaCompletada = interferencia_actividad || interferencia_animo || interferencia_caminar || 
                                 interferencia_trabajo || interferencia_relaciones || interferencia_sueno || 
                                 interferencia_vida;
  
  if (intensidadCompletada && interferenciaCompletada) {
    if (intensidadRedondeada >= 7 || interferenciaRedondeada >= 7) {
      bpiBadge.textContent = 'Severo';
      bpiBadge.className = 'resultado-badge badge-rojo';
    } else if (intensidadRedondeada >= 4 || interferenciaRedondeada >= 4) {
      bpiBadge.textContent = 'Moderado';
      bpiBadge.className = 'resultado-badge badge-amarillo';
    } else {
      bpiBadge.textContent = 'Leve';
      bpiBadge.className = 'resultado-badge badge-verde';
    }
  } else if (intensidadCompletada || interferenciaCompletada) {
    bpiBadge.textContent = 'Incompleto';
    bpiBadge.className = 'resultado-badge badge-gris';
  } else {
    bpiBadge.textContent = 'No completado';
    bpiBadge.className = 'resultado-badge';
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
  const puntuacionTotal = quemazon + frio + descargas + hormigueo + alfileres + 
                        entumecimiento + picazon + hipoestesia + hipoestesiaPinchazo + cepillado;
  
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
  
  if (!estaCompleto) {
    interpretacion = 'Complete todos los campos para obtener un resultado preciso';
    color = '';
  } else if (puntuacionTotal >= 4) {
    interpretacion = 'Sugiere dolor neuropático (≥4 puntos)';
    color = 'rojo';
  } else {
    interpretacion = 'No sugiere dolor neuropático (<4 puntos)';
    color = 'verde';
  }
  
  // Aplicar interpretación y color
  const interpretacionEl = document.getElementById('dn4-interpretacion');
  interpretacionEl.textContent = interpretacion;
  if (color) {
    interpretacionEl.className = 'resultado-interpretacion ' + color;
  } else {
    interpretacionEl.className = 'resultado-interpretacion';
  }
  
  // Actualizar el badge con el estado
  const dn4Badge = document.getElementById('dn4-badge');
  
  if (estaCompleto) {
    if (puntuacionTotal >= 4) {
      dn4Badge.textContent = 'Positivo';
      dn4Badge.className = 'resultado-badge badge-rojo';
    } else {
      dn4Badge.textContent = 'Negativo';
      dn4Badge.className = 'resultado-badge badge-verde';
    }
  } else if (itemsCompletados > 0) {
    dn4Badge.textContent = 'Incompleto';
    dn4Badge.className = 'resultado-badge badge-gris';
  } else {
    dn4Badge.textContent = 'No completado';
    dn4Badge.className = 'resultado-badge';
  }
}

// Función auxiliar para obtener el valor de un grupo de radio buttons
function obtenerValorRadio(nombre) {
  const radioButtons = document.getElementsByName(nombre);
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      return parseInt(radioButton.value);
    }
  }
  return -1; // Retorna -1 si ninguno está seleccionado
}
});  
