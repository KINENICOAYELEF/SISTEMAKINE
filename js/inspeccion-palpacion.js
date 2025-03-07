// Funciones para la sección de Inspección y Palpación

// Base de datos de regiones anatómicas, subregiones y estructuras
const regionesAnatomicas = {
  "Columna Vertebral": ["Cervical", "Dorsal", "Lumbar", "Sacro", "Cóccix"],
  "Extremidad Superior": ["Hombro", "Codo", "Muñeca", "Mano", "Dedos"],
  "Extremidad Inferior": ["Cadera", "Rodilla", "Tobillo", "Pie", "Dedos"],
  "Cabeza y Cuello": ["Cráneo", "ATM", "Cara", "Cuello"],
  "Tórax y Abdomen": ["Tórax", "Costillas", "Esternón", "Abdomen", "Pelvis"]
};

const estructurasEspecificas = {
  "Cervical": ["Cuerpos vertebrales", "Apófisis espinosas", "Facetas articulares", "Disco intervertebral", "Músculos paravertebrales", "Trapecio superior", "ECOM", "Escalenos"],
  "Dorsal": ["Cuerpos vertebrales", "Apófisis espinosas", "Facetas articulares", "Disco intervertebral", "Músculos paravertebrales", "Romboides", "Trapecio medio", "Dorsal ancho"],
  "Lumbar": ["Cuerpos vertebrales", "Apófisis espinosas", "Facetas articulares", "Disco intervertebral", "Músculos paravertebrales", "Cuadrado lumbar", "Psoas", "Transverso abdominal"],
  "Sacro": ["Articulación sacroilíaca", "Base del sacro", "Músculos piriformes", "Ligamentos sacroilíacos"],
  "Cóccix": ["Articulación sacrococcígea", "Cóccix distal", "Músculos elevadores del ano", "Ligamentos coccígeos"],
  
  "Hombro": ["Articulación glenohumeral", "Articulación acromioclavicular", "Manguito rotador", "Bíceps porción larga", "Deltoides", "Trapecio", "Bursa subacromial"],
  "Codo": ["Articulación húmero-cubital", "Articulación radio-cubital", "Epicóndilo medial", "Epicóndilo lateral", "Bíceps distal", "Tríceps distal", "Supinador", "Pronador"],
  "Muñeca": ["Articulación radiocarpiana", "Túnel carpiano", "Tendones flexores", "Tendones extensores", "Ligamentos laterales", "Retináculo flexor"],
  "Mano": ["Articulaciones metacarpofalángicas", "Articulaciones interfalángicas", "Músculos tenares", "Músculos hipotenares", "Ligamentos colaterales"],
  "Dedos (Mano)": ["Articulaciones interfalángicas", "Tendones extensores", "Tendones flexores", "Ligamentos colaterales", "Poleas digitales"],
  
  "Cadera": ["Articulación coxofemoral", "Trocánter mayor", "Músculos glúteos", "Tensor de la fascia lata", "Psoas ilíaco", "Cuadrado lumbar", "Pelvis"],
  "Rodilla": ["Articulación femorotibial", "Articulación femoropatelar", "Ligamento cruzado anterior", "Ligamento cruzado posterior", "Ligamento lateral interno", "Ligamento lateral externo", "Menisco medial", "Menisco lateral", "Tendón rotuliano", "Cintilla iliotibial"],
  "Tobillo": ["Articulación tibiotarsiana", "Ligamento lateral externo", "Ligamento deltoideo", "Tendón de Aquiles", "Tendones peroneos", "Tendón tibial posterior", "Seno del tarso"],
  "Pie": ["Articulaciones tarsometatarsianas", "Articulaciones metatarsofalángicas", "Arco longitudinal", "Arco transversal", "Fascia plantar", "Aponeurosis plantar", "Retináculo extensor"],
  "Dedos (Pie)": ["Articulaciones interfalángicas", "Tendones extensores", "Tendones flexores", "Sesamoideos"],
  
  "Cráneo": ["Hueso temporal", "Hueso occipital", "Hueso parietal", "Hueso frontal", "Sutura lambdoidea", "Sutura sagital", "Sutura coronal"],
  "ATM": ["Cóndilo mandibular", "Cavidad glenoidea", "Disco articular", "Músculos pterigoideos", "Músculo temporal", "Músculo masetero"],
  "Cara": ["Musculatura facial", "Senos paranasales", "Nervio trigémino", "Glándulas salivales"],
  "Cuello": ["ECOM", "Escalenos", "Trapecio superior", "Musculatura prevertebral", "Tiroides", "Hioides", "Laringe"],
  
  "Tórax": ["Articulaciones costoesternales", "Articulaciones costovertebrales", "Musculatura intercostal", "Diafragma"],
  "Costillas": ["Ángulo costal", "Cartílagos costales", "Espacio intercostal", "Articulaciones costo-transversas"],
  "Esternón": ["Manubrio", "Cuerpo", "Apéndice xifoides", "Articulación manubrioesternal"],
  "Abdomen": ["Recto abdominal", "Oblicuos", "Transverso", "Cuadrado lumbar", "Psoas"],
  "Pelvis": ["Sínfisis púbica", "Articulación sacroilíaca", "Tuberosidad isquiática", "Cresta ilíaca", "Espina ilíaca anterosuperior"]
};

// Función para inicializar los componentes cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar el acordeón de inspección y palpación
  const inspeccionHeader = document.querySelector('.cuestionario-header');
  if (inspeccionHeader) {
    inspeccionHeader.addEventListener('click', function() {
      const contentId = this.getAttribute('onclick').match(/['"]([^'"]+)['"]/)[1];
      toggleInspeccionPalpacion(contentId);
    });
  }
  
  // Inicializar eventos para los selectores de región anatómica
  const regionSelector = document.getElementById('region_anatomica');
  if (regionSelector) {
    regionSelector.addEventListener('change', actualizarSubregiones);
  }
  
  // Inicializar eventos para campos de inspección
  document.querySelectorAll('input[name="cambios_troficos[]"]').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const algunoSeleccionado = document.querySelectorAll('input[name="cambios_troficos[]"]:checked').length > 0;
      document.getElementById('cambios_troficos_detalles_container').style.display = algunoSeleccionado ? 'block' : 'none';
      actualizarInspeccion();
    });
  });
  
  // Inicializar manualmente los llamados a funciones
  const inspeccionSelectors = [
    'insp_color_piel', 'insp_cicatrices', 'insp_edema', 'insp_hematomas'
  ];
  
  inspeccionSelectors.forEach(function(selector) {
    const element = document.getElementById(selector);
    if (element) {
      element.addEventListener('change', function() {
        if (selector === 'insp_cicatrices') toggleCicatricesDetalles();
        else if (selector === 'insp_edema') toggleEdemaDetalles();
        else if (selector === 'insp_hematomas') toggleHematomasDetalles();
        actualizarInspeccion();
      });
    }
  });
  
  // Inicializar eventos para campos de palpación
  document.querySelectorAll('input[name="hallazgos_musculares[]"]').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const algunoSeleccionado = document.querySelectorAll('input[name="hallazgos_musculares[]"]:checked').length > 0;
      document.getElementById('hallazgos_musculares_container').style.display = algunoSeleccionado ? 'block' : 'none';
      actualizarPalpacion();
    });
  });
  
  document.querySelectorAll('input[name="hallazgos_articulares[]"]').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const algunoSeleccionado = document.querySelectorAll('input[name="hallazgos_articulares[]"]:checked').length > 0;
      document.getElementById('hallazgos_articulares_container').style.display = algunoSeleccionado ? 'block' : 'none';
      actualizarPalpacion();
    });
  });
  
  document.querySelectorAll('input[name="insp_deformidades[]"]').forEach(function(checkbox) {
    checkbox.addEventListener('change', toggleDeformidadDetalles);
  });
  
  // Inicializar eventos para los selectores de tejidos blandos
  const tejidosSelectors = [
    'palp_tendones', 'palp_ligamentos', 'palp_bursas', 'palp_fascias'
  ];
  
  tejidosSelectors.forEach(function(selector) {
    const element = document.getElementById(selector);
    if (element) {
      element.addEventListener('change', function() {
        const algunoSeleccionado = tejidosSelectors.some(sel => {
          const el = document.getElementById(sel);
          return el && el.value && el.value !== "Normal";
        });
        document.getElementById('tejidos_blandos_detalles_container').style.display = algunoSeleccionado ? 'block' : 'none';
        actualizarPalpacion();
      });
    }
  });
  
  // Inicializar eventos para el dolor a la palpación
  const dolorSelectors = [
    'palp_dolor_tipo', 'palp_dolor_localizacion', 'palp_dolor_reproduccion'
  ];
  
  dolorSelectors.forEach(function(selector) {
    const element = document.getElementById(selector);
    if (element) {
      element.addEventListener('change', function() {
        const algunoSeleccionado = 
          document.getElementById('palp_dolor_intensidad').value > 0 ||
          document.getElementById('palp_dolor_tipo').value !== "" ||
          document.getElementById('palp_dolor_localizacion').value !== "" ||
          document.getElementById('palp_dolor_reproduccion').checked;
        
        document.getElementById('dolor_palpacion_detalles_container').style.display = algunoSeleccionado ? 'block' : 'none';
        actualizarPalpacion();
      });
    }
  });
  
  console.log('Eventos de Inspección y Palpación inicializados correctamente');
});

// Funciones auxiliares para la sección de Inspección y Palpación

// Función para mostrar/ocultar el contenido del acordeón
function toggleInspeccionPalpacion(contentId) {
  const content = document.getElementById(contentId);
  const header = content.previousElementSibling;
  
  if (content.style.display === "none" || !content.style.display) {
    content.style.display = "block";
    header.classList.add("active");
    // Inicializar las subregiones si se está abriendo
    actualizarSubregiones();
  } else {
    content.style.display = "none";
    header.classList.remove("active");
  }
}

// Función para actualizar las subregiones según la región anatómica seleccionada
function actualizarSubregiones() {
  const regionSelect = document.getElementById('region_anatomica');
  const subregionSelect = document.getElementById('subregion_anatomica');
  const subregionContainer = document.getElementById('subregion_container');
  
  if (!regionSelect || !subregionSelect || !subregionContainer) return;
  
  const regionSeleccionada = regionSelect.value;
  
  if (!regionSeleccionada) {
    subregionContainer.style.display = 'none';
    return;
  }
  
  // Limpiar opciones actuales
  subregionSelect.innerHTML = '<option value="">Seleccionar</option>';
  
  // Agregar nuevas opciones según la región seleccionada
  const subregiones = regionesAnatomicas[regionSeleccionada] || [];
  subregiones.forEach(subregion => {
    const option = document.createElement('option');
    option.value = subregion;
    option.textContent = subregion;
    subregionSelect.appendChild(option);
  });
  
  // Mostrar el contenedor
  subregionContainer.style.display = 'flex';
  
  // Actualizar las estructuras específicas
  actualizarEstructurasEspecificas();
}

// Función para actualizar las estructuras específicas según la subregión seleccionada
function actualizarEstructurasEspecificas() {
  const subregionSelect = document.getElementById('subregion_anatomica');
  const estructurasSelect = document.getElementById('estructuras_especificas');
  const estructurasContainer = document.getElementById('estructuras_container');
  
  if (!subregionSelect || !estructurasSelect || !estructurasContainer) return;
  
  const subregionSeleccionada = subregionSelect.value;
  
  if (!subregionSeleccionada) {
    estructurasContainer.style.display = 'none';
    return;
  }
  
  // Limpiar opciones actuales
  estructurasSelect.innerHTML = '<option value="">Seleccionar</option>';
  
  // Agregar nuevas opciones según la subregión seleccionada
  const estructuras = estructurasEspecificas[subregionSeleccionada] || [];
  estructuras.forEach(estructura => {
    const option = document.createElement('option');
    option.value = estructura;
    option.textContent = estructura;
    estructurasSelect.appendChild(option);
  });
  
  // Mostrar el contenedor
  estructurasContainer.style.display = 'flex';
}

// Funciones para mostrar/ocultar detalles adicionales
function toggleCicatricesDetalles() {
  const cicatricesSelect = document.getElementById('insp_cicatrices');
  const detallesContainer = document.getElementById('cicatrices_detalles_container');
  
  if (cicatricesSelect && detallesContainer) {
    detallesContainer.style.display = (cicatricesSelect.value.startsWith('Sí')) ? 'block' : 'none';
  }
}

function toggleEdemaDetalles() {
  const edemaSelect = document.getElementById('insp_edema');
  const detallesContainer = document.getElementById('edema_detalles_container');
  
  if (edemaSelect && detallesContainer) {
    detallesContainer.style.display = (edemaSelect.value !== 'No' && edemaSelect.value !== '') ? 'block' : 'none';
  }
}

function toggleHematomasDetalles() {
  const hematomasSelect = document.getElementById('insp_hematomas');
  const detallesContainer = document.getElementById('hematomas_detalles_container');
  
  if (hematomasSelect && detallesContainer) {
    detallesContainer.style.display = (hematomasSelect.value !== 'No' && hematomasSelect.value !== '') ? 'block' : 'none';
  }
}

function toggleDeformidadDetalles() {
  const checkboxes = document.querySelectorAll('input[name="insp_deformidades[]"]');
  const detallesContainer = document.getElementById('deformidad_detalles_container');
  
  if (checkboxes.length > 0 && detallesContainer) {
    let algunoSeleccionado = false;
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) algunoSeleccionado = true;
    });
    
    detallesContainer.style.display = algunoSeleccionado ? 'block' : 'none';
  }
  
  actualizarInspeccion();
}

// Función para actualizar la información de inspección y generar alertas
function actualizarInspeccion() {
  // Obtener datos de inspección
  const cambiosTroficos = [];
  document.querySelectorAll('input[name="cambios_troficos[]"]:checked').forEach(function(checkbox) {
    cambiosTroficos.push(checkbox.value);
  });
  
  const colorPiel = document.getElementById('insp_color_piel').value;
  const cicatrices = document.getElementById('insp_cicatrices').value;
  const edema = document.getElementById('insp_edema').value;
  const hematomas = document.getElementById('insp_hematomas').value;
  
  const deformidades = [];
  document.querySelectorAll('input[name="insp_deformidades[]"]:checked').forEach(function(checkbox) {
    deformidades.push(checkbox.value);
  });
  
  // Evaluar hallazgos importantes
  const hallazgosImportantes = [];
  
  if (cambiosTroficos.includes('Atrofia')) hallazgosImportantes.push('Atrofia muscular');
  if (colorPiel && colorPiel !== 'Normal') hallazgosImportantes.push('Alteración del color de la piel: ' + colorPiel);
  if (cicatrices && cicatrices !== 'No') hallazgosImportantes.push('Presencia de cicatrices: ' + cicatrices);
  if (edema && edema !== 'No') hallazgosImportantes.push('Presencia de edema: ' + edema);
  if (hematomas && hematomas !== 'No') hallazgosImportantes.push('Presencia de hematomas: ' + hematomas);
  deformidades.forEach(deformidad => hallazgosImportantes.push('Presencia de ' + deformidad.toLowerCase()));
  
  // Mostrar alerta si hay hallazgos importantes
  const alertaInspeccion = document.getElementById('alerta_inspeccion');
  
  if (hallazgosImportantes.length > 0) {
    alertaInspeccion.style.display = 'block';
    
    // Determinar el tipo de alerta según la gravedad de los hallazgos
    if (edema === 'Severo (+++)' || edema === 'Severo con fóvea (+++)' || 
        hematomas === 'Reciente' || cambiosTroficos.includes('Atrofia') || 
        colorPiel === 'Cianosis' || deformidades.length > 0) {
      alertaInspeccion.className = 'alert alert-danger';
      alertaInspeccion.innerHTML = '<strong>¡Hallazgos relevantes!</strong> Se han detectado hallazgos que requieren atención prioritaria:<ul>' + 
        hallazgosImportantes.map(hallazgo => '<li>' + hallazgo + '</li>').join('') + 
      '</ul><p>Considere estos hallazgos al planificar la intervención. Posible necesidad de derivación o imágenes complementarias.</p>';
    } else {
      alertaInspeccion.className = 'alert alert-warning';
      alertaInspeccion.innerHTML = '<strong>Hallazgos a considerar:</strong> Se han detectado los siguientes hallazgos en la inspección:<ul>' + 
        hallazgosImportantes.map(hallazgo => '<li>' + hallazgo + '</li>').join('') + 
      '</ul><p>Considere estos hallazgos al planificar la intervención.</p>';
    }
  } else {
    alertaInspeccion.style.display = 'none';
  }
  
  // Actualizar la interpretación clínica general
  actualizarInterpretacionClinica();
}

// Función para actualizar la información de palpación y generar alertas
function actualizarPalpacion() {
  // Obtener datos de palpación
  const temperatura = document.querySelector('input[name="palp_temperatura"]:checked')?.value || '';
  const tonoMuscular = document.getElementById('palp_tono_muscular').value;
  
  const hallazgosMusculares = [];
  document.querySelectorAll('input[name="hallazgos_musculares[]"]:checked').forEach(function(checkbox) {
    hallazgosMusculares.push(checkbox.value);
  });
  
  const movilidadArticular = document.getElementById('palp_movilidad_articular').value;
  
  const hallazgosArticulares = [];
  document.querySelectorAll('input[name="hallazgos_articulares[]"]:checked').forEach(function(checkbox) {
    hallazgosArticulares.push(checkbox.value);
  });
  
  const tendones = document.getElementById('palp_tendones').value;
  const ligamentos = document.getElementById('palp_ligamentos').value;
  const bursas = document.getElementById('palp_bursas').value;
  const fascias = document.getElementById('palp_fascias').value;
  
  const dolorIntensidad = parseInt(document.getElementById('palp_dolor_intensidad').value) || 0;
  const dolorTipo = document.getElementById('palp_dolor_tipo').value;
  const dolorLocalizacion = document.getElementById('palp_dolor_localizacion').value;
  const dolorReproduccion = document.getElementById('palp_dolor_reproduccion').checked;
  
  // Evaluar hallazgos importantes
  const hallazgosImportantes = [];
  
  if (temperatura === 'Aumentada') hallazgosImportantes.push('Temperatura local aumentada (posible proceso inflamatorio agudo)');
  if (temperatura === 'Disminuida') hallazgosImportantes.push('Temperatura local disminuida (posible compromiso vascular)');
  
  if (tonoMuscular && tonoMuscular !== 'Normal') hallazgosImportantes.push('Alteración del tono muscular: ' + tonoMuscular);
  
  hallazgosMusculares.forEach(hallazgo => {
    if (hallazgo === 'Puntos gatillo') hallazgosImportantes.push('Presencia de puntos gatillo miofasciales (posible síndrome de dolor miofascial)');
    else if (hallazgo === 'Bandas tensas') hallazgosImportantes.push('Presencia de bandas tensas');
    else if (hallazgo === 'Contracturas') hallazgosImportantes.push('Presencia de contracturas musculares');
    else if (hallazgo === 'Espasmos') hallazgosImportantes.push('Presencia de espasmos musculares (posible protección antiálgica)');
  });
  
  if (movilidadArticular && movilidadArticular !== 'Normal') hallazgosImportantes.push('Alteración de la movilidad articular: ' + movilidadArticular);
  
  hallazgosArticulares.forEach(hallazgo => {
    if (hallazgo === 'Inestabilidad') hallazgosImportantes.push('Inestabilidad articular (posible lesión ligamentaria)');
    else if (hallazgo === 'Derrame articular') hallazgosImportantes.push('Presencia de derrame articular (posible proceso inflamatorio/traumático)');
    else if (hallazgo === 'Crepitación') hallazgosImportantes.push('Crepitación articular (posible desgaste articular)');
    else if (hallazgo === 'Bloqueo') hallazgosImportantes.push('Bloqueo articular (posible lesión meniscal/cuerpo libre)');
  });
  
  if (tendones && tendones !== 'Normal') hallazgosImportantes.push('Alteración de tendones: ' + tendones);
  if (ligamentos && ligamentos !== 'Normal') hallazgosImportantes.push('Alteración de ligamentos: ' + ligamentos);
  if (bursas && bursas !== 'Normal') hallazgosImportantes.push('Alteración de bursas: ' + bursas);
  if (fascias && fascias !== 'Normal') hallazgosImportantes.push('Alteración de fascias: ' + fascias);
  
  if (dolorIntensidad >= 7) hallazgosImportantes.push('Dolor severo a la palpación (EVA ' + dolorIntensidad + '/10)');
  else if (dolorIntensidad >= 4) hallazgosImportantes.push('Dolor moderado a la palpación (EVA ' + dolorIntensidad + '/10)');
  
  if (dolorReproduccion) hallazgosImportantes.push('La palpación reproduce el dolor principal del paciente');
  
  // Mostrar alerta si hay hallazgos importantes
  const alertaPalpacion = document.getElementById('alerta_palpacion');
  
  if (hallazgosImportantes.length > 0) {
    alertaPalpacion.style.display = 'block';
    
    // Determinar el tipo de alerta según la gravedad de los hallazgos
    if (temperatura === 'Aumentada' || 
        hallazgosMusculares.includes('Espasmos') || 
        hallazgosArticulares.includes('Inestabilidad') || 
        hallazgosArticulares.includes('Derrame articular') || 
        dolorIntensidad >= 7 || 
        dolorReproduccion) {
      alertaPalpacion.className = 'alert alert-danger';
      alertaPalpacion.innerHTML = '<strong>¡Hallazgos relevantes!</strong> Se han detectado hallazgos que requieren atención prioritaria:<ul>' + 
        hallazgosImportantes.map(hallazgo => '<li>' + hallazgo + '</li>').join('') + 
      '</ul><p>Considere estos hallazgos al planificar la intervención. Posible necesidad de derivación o imágenes complementarias.</p>';
    } else {
      alertaPalpacion.className = 'alert alert-warning';
      alertaPalpacion.innerHTML = '<strong>Hallazgos a considerar:</strong> Se han detectado los siguientes hallazgos en la palpación:<ul>' + 
        hallazgosImportantes.map(hallazgo => '<li>' + hallazgo + '</li>').join('') + 
      '</ul><p>Considere estos hallazgos al planificar la intervención.</p>';
    }
  } else {
    alertaPalpacion.style.display = 'none';
  }
  
  // Actualizar la interpretación clínica general
  actualizarInterpretacionClinica();
}

// Función para generar la interpretación clínica y recomendaciones
function actualizarInterpretacionClinica() {
  // Obtener referencias a los elementos de interpretación
  const interpretacionTexto = document.getElementById('interpretacion-texto');
  const recomendacionesTexto = document.getElementById('recomendaciones-texto');
  const consideracionesTexto = document.getElementById('consideraciones-texto');
  
  // Comprobar si hay suficiente información para generar interpretación
  const regionSeleccionada = document.getElementById('region_anatomica')?.value || '';
  const subregionSeleccionada = document.getElementById('subregion_anatomica')?.value || '';
  
  if (!regionSeleccionada) {
    interpretacionTexto.textContent = 'Seleccione una región anatómica para obtener una interpretación clínica.';
    recomendacionesTexto.textContent = 'Complete la evaluación para obtener recomendaciones.';
    consideracionesTexto.textContent = 'Complete la evaluación para obtener consideraciones adicionales.';
    return;
  }
  
  // Recopilar hallazgos de inspección
  const cambiosTroficos = [];
  document.querySelectorAll('input[name="cambios_troficos[]"]:checked').forEach(function(checkbox) {
    cambiosTroficos.push(checkbox.value);
  });
  
  const colorPiel = document.getElementById('insp_color_piel').value;
  const cicatrices = document.getElementById('insp_cicatrices').value;
  const edema = document.getElementById('insp_edema').value;
  const hematomas = document.getElementById('insp_hematomas').value;
  
  const deformidades = [];
  document.querySelectorAll('input[name="insp_deformidades[]"]:checked').forEach(function(checkbox) {
    deformidades.push(checkbox.value);
  });
  
  // Recopilar hallazgos de palpación
  const temperatura = document.querySelector('input[name="palp_temperatura"]:checked')?.value || '';
  const tonoMuscular = document.getElementById('palp_tono_muscular').value;
  
  const hallazgosMusculares = [];
  document.querySelectorAll('input[name="hallazgos_musculares[]"]:checked').forEach(function(checkbox) {
    hallazgosMusculares.push(checkbox.value);
  });
  
  const movilidadArticular = document.getElementById('palp_movilidad_articular').value;
  
  const hallazgosArticulares = [];
  document.querySelectorAll('input[name="hallazgos_articulares[]"]:checked').forEach(function(checkbox) {
    hallazgosArticulares.push(checkbox.value);
  });
  
  const dolorIntensidad = parseInt(document.getElementById('palp_dolor_intensidad').value) || 0;
  const dolorReproduccion = document.getElementById('palp_dolor_reproduccion').checked;
  
  // Determinar el nivel de severidad general
  let nivelSeveridad = 'leve';
  
  // Factores de severidad alta
  if (edema === 'Severo (+++)' || edema === 'Severo con fóvea (+++)' || 
      hematomas === 'Reciente' || 
      temperatura === 'Aumentada' || 
      hallazgosArticulares.includes('Inestabilidad') || 
      hallazgosArticulares.includes('Derrame articular') || 
      dolorIntensidad >= 7 || 
      dolorReproduccion) {
    nivelSeveridad = 'alta';
  } 
  // Factores de severidad moderada
  else if (cambiosTroficos.length > 0 || 
           colorPiel !== '' && colorPiel !== 'Normal' || 
           cicatrices.startsWith('Sí') || 
           edema.startsWith('Moderado') || 
           deformidades.length > 0 || 
           hallazgosMusculares.includes('Puntos gatillo') || 
           hallazgosMusculares.includes('Contracturas') || 
           hallazgosMusculares.includes('Espasmos') || 
           movilidadArticular && movilidadArticular !== 'Normal' || 
           hallazgosArticulares.includes('Crepitación') || 
           dolorIntensidad >= 4) {
    nivelSeveridad = 'moderada';
  }
  
  // Generar interpretación clínica según región y hallazgos
  let interpretacion = `Evaluación de ${regionSeleccionada}${subregionSeleccionada ? ' - ' + subregionSeleccionada : ''}. `;
  
  if (nivelSeveridad === 'alta') {
    interpretacion += 'Los hallazgos sugieren un cuadro de severidad alta con ';
  } else if (nivelSeveridad === 'moderada') {
    interpretacion += 'Los hallazgos sugieren un cuadro de severidad moderada con ';
  } else {
    interpretacion += 'Los hallazgos sugieren un cuadro de severidad leve con ';
  }
  
  // Construir descripción específica según hallazgos
  let descripcionHallazgos = [];
  
  if (edema && edema !== 'No') descripcionHallazgos.push(edema.toLowerCase());
  if (hematomas && hematomas !== 'No') descripcionHallazgos.push('presencia de hematomas ' + hematomas.toLowerCase());
  if (temperatura === 'Aumentada') descripcionHallazgos.push('aumento de temperatura local');
  if (temperatura === 'Disminuida') descripcionHallazgos.push('disminución de temperatura local');
  
  if (cambiosTroficos.includes('Atrofia')) descripcionHallazgos.push('atrofia muscular');
  if (cambiosTroficos.includes('Hipertrofia')) descripcionHallazgos.push('hipertrofia muscular');
  
  if (hallazgosMusculares.includes('Puntos gatillo')) descripcionHallazgos.push('puntos gatillo miofasciales');
  if (hallazgosMusculares.includes('Bandas tensas')) descripcionHallazgos.push('bandas tensas');
  if (hallazgosMusculares.includes('Contracturas')) descripcionHallazgos.push('contracturas musculares');
  if (hallazgosMusculares.includes('Espasmos')) descripcionHallazgos.push('espasmos musculares');
  
  if (hallazgosArticulares.includes('Inestabilidad')) descripcionHallazgos.push('inestabilidad articular');
  if (hallazgosArticulares.includes('Derrame articular')) descripcionHallazgos.push('derrame articular');
  if (hallazgosArticulares.includes('Crepitación')) descripcionHallazgos.push('crepitación articular');
  if (hallazgosArticulares.includes('Bloqueo')) descripcionHallazgos.push('bloqueo articular');
  
  if (dolorIntensidad > 0) {
    let intensidadDesc = dolorIntensidad >= 7 ? 'severo' : (dolorIntensidad >= 4 ? 'moderado' : 'leve');
    descripcionHallazgos.push(`dolor ${intensidadDesc} a la palpación (EVA ${dolorIntensidad}/10)`);
  }
  
  if (movilidadArticular && movilidadArticular !== 'Normal') {
    descripcionHallazgos.push(movilidadArticular.toLowerCase());
  }
  
  // Completar la interpretación
  if (descripcionHallazgos.length > 0) {
    interpretacion += formatearLista(descripcionHallazgos) + '.';
  } else {
    interpretacion += 'hallazgos mínimos durante la evaluación.';
  }
  
  // Agregar posible diagnóstico clínico de acuerdo a la región y hallazgos
  interpretacion += ' ' + generarHipotesisDiagnostica(regionSeleccionada, subregionSeleccionada, nivelSeveridad, descripcionHallazgos);
  
  // Generar recomendaciones específicas según hallazgos
  let recomendaciones = generarRecomendaciones(regionSeleccionada, subregionSeleccionada, nivelSeveridad, {
    cambiosTroficos,
    colorPiel,
    cicatrices,
    edema,
    hematomas,
    deformidades,
    temperatura,
    tonoMuscular,
    hallazgosMusculares,
    movilidadArticular,
    hallazgosArticulares,
    dolorIntensidad,
    dolorReproduccion
  });
  
  // Generar consideraciones adicionales
  let consideraciones = generarConsideracionesAdicionales(regionSeleccionada, subregionSeleccionada, nivelSeveridad);
  
  // Actualizar los elementos de la interpretación clínica
  interpretacionTexto.innerHTML = interpretacion;
  recomendacionesTexto.innerHTML = recomendaciones;
  consideracionesTexto.innerHTML = consideraciones;
  
  // Actualizar el estado del badge
  const badge = document.getElementById('inspeccion-palpacion-badge');
  if (badge) {
    if (interpretacion !== 'Seleccione una región anatómica para obtener una interpretación clínica.') {
      badge.textContent = 'Completado';
      badge.className = 'resultado-badge badge-success';
    } else {
      badge.textContent = 'No completado';
      badge.className = 'resultado-badge';
    }
  }
}

// Función para formatear una lista de elementos en texto natural
function formatearLista(elementos) {
  if (elementos.length === 0) return '';
  if (elementos.length === 1) return elementos[0];
  if (elementos.length === 2) return `${elementos[0]} y ${elementos[1]}`;
  
  const ultimoElemento = elementos.pop();
  return `${elementos.join(', ')} y ${ultimoElemento}`;
}

// Función para generar hipótesis diagnósticas según la región y hallazgos
function generarHipotesisDiagnostica(region, subregion, severidad, hallazgos) {
  if (!region) return '';
  
  let hipotesis = 'Estos hallazgos son compatibles con ';
  
  // Columna Vertebral
  if (region === 'Columna Vertebral') {
    if (subregion === 'Cervical') {
      if (hallazgos.includes('puntos gatillo miofasciales') || hallazgos.includes('contracturas musculares')) {
        hipotesis += 'un cuadro de cervicalgia de origen muscular, posiblemente asociado a síndrome miofascial.';
      } else if (hallazgos.includes('crepitación articular') || hallazgos.includes('hipomóvil')) {
        hipotesis += 'un cuadro de cervicalgia de origen artrógeno, posiblemente asociado a cambios degenerativos articulares.';
      } else {
        hipotesis += 'un cuadro de cervicalgia mecánica.';
      }
    } else if (subregion === 'Lumbar') {
      if (hallazgos.includes('puntos gatillo miofasciales') || hallazgos.includes('contracturas musculares')) {
        hipotesis += 'un cuadro de lumbalgia de origen muscular, posiblemente asociado a síndrome miofascial.';
      } else if (hallazgos.includes('crepitación articular') || hallazgos.includes('hipomóvil')) {
        hipotesis += 'un cuadro de lumbalgia de origen artrógeno, posiblemente asociado a cambios degenerativos articulares.';
      } else {
        hipotesis += 'un cuadro de lumbalgia mecánica.';
      }
    } else {
      hipotesis += `un cuadro de disfunción músculo-esquelética a nivel ${subregion ? subregion.toLowerCase() : 'de columna vertebral'}.`;
    }
  }
  // Extremidad Superior
  else if (region === 'Extremidad Superior') {
    if (subregion === 'Hombro') {
      if (hallazgos.includes('inestabilidad articular')) {
        hipotesis += 'un cuadro de inestabilidad de hombro.';
      } else if (hallazgos.includes('crepitación articular') && hallazgos.includes('dolor')) {
        hipotesis += 'un posible síndrome de pinzamiento subacromial.';
      } else if (hallazgos.includes('puntos gatillo miofasciales')) {
        hipotesis += 'un síndrome miofascial a nivel de cintura escapular.';
      } else {
        hipotesis += 'un cuadro de disfunción de hombro.';
      }
    } else if (subregion === 'Codo') {
      if (hallazgos.includes('dolor moderado') || hallazgos.includes('dolor severo')) {
        hipotesis += 'una posible epicondilalgia/epitrocleitis.';
      } else {
        hipotesis += 'un cuadro de disfunción de codo.';
      }
    } else if (subregion === 'Muñeca' || subregion === 'Mano') {
      if (hallazgos.includes('crepitación articular') && hallazgos.includes('dolor')) {
        hipotesis += 'posibles cambios degenerativos articulares.';
      } else if (hallazgos.includes('espasmos musculares')) {
        hipotesis += 'un cuadro de tensión muscular excesiva.';
      } else {
        hipotesis += `un cuadro de disfunción de ${subregion ? subregion.toLowerCase() : 'extremidad superior'}.`;
      }
    } else {
      hipotesis += `un cuadro de disfunción músculo-esquelética a nivel de ${subregion ? subregion.toLowerCase() : 'extremidad superior'}.`;
    }
  }
  // Extremidad Inferior
  else if (region === 'Extremidad Inferior') {
    if (subregion === 'Rodilla') {
      if (hallazgos.includes('derrame articular')) {
        hipotesis += 'un proceso inflamatorio articular.';
      } else if (hallazgos.includes('inestabilidad articular')) {
        hipotesis += 'una posible lesión ligamentaria.';
      } else if (hallazgos.includes('bloqueo articular')) {
        hipotesis += 'una posible lesión meniscal.';
      } else if (hallazgos.includes('crepitación articular')) {
        hipotesis += 'posibles cambios degenerativos articulares.';
      } else {
        hipotesis += 'un cuadro de disfunción de rodilla.';
      }
    } else if (subregion === 'Tobillo') {
      if (hallazgos.includes('inestabilidad articular')) {
        hipotesis += 'una posible inestabilidad ligamentaria crónica.';
      } else if (hallazgos.includes('edema')) {
        hipotesis += 'un proceso inflamatorio postraumático o crónico.';
      } else {
        hipotesis += 'un cuadro de disfunción de tobillo.';
      }
    } else {
      hipotesis += `un cuadro de disfunción músculo-esquelética a nivel de ${subregion ? subregion.toLowerCase() : 'extremidad inferior'}.`;
    }
  }
  else {
    hipotesis += `un cuadro de disfunción músculo-esquelética a nivel de ${region.toLowerCase()}.`;
  }
  
  return hipotesis;
}

// Función para generar recomendaciones específicas según hallazgos
function generarRecomendaciones(region, subregion, severidad, hallazgos) {
  let recomendaciones = '<ul>';
  
  // Recomendaciones generales según severidad
  if (severidad === 'alta') {
    recomendaciones += '<li><strong>Se recomienda considerar derivación médica o imagenología</strong> para descartar lesiones estructurales significativas.</li>';
  }
  
  // Recomendaciones según hallazgos específicos
  if (hallazgos.edema && hallazgos.edema !== 'No') {
    recomendaciones += '<li>Abordar el edema con técnicas de drenaje manual, elevación y compresión según corresponda.</li>';
  }
  
  if (hallazgos.temperatura === 'Aumentada') {
    recomendaciones += '<li>Considerar técnicas de modulación inflamatoria como crioterapia en fases iniciales.</li>';
  }
  
  if (hallazgos.hallazgosMusculares.includes('Puntos gatillo')) {
    recomendaciones += '<li>Incluir técnicas de liberación miofascial, punción seca o compresión isquémica para los puntos gatillo identificados.</li>';
  }
  
  if (hallazgos.hallazgosMusculares.includes('Contracturas') || hallazgos.hallazgosMusculares.includes('Espasmos')) {
    recomendaciones += '<li>Aplicar técnicas de relajación muscular, estiramientos y calor local para abordar la hipertonía muscular.</li>';
  }
  
  if (hallazgos.movilidadArticular && hallazgos.movilidadArticular.includes('Hipomóvil')) {
    recomendaciones += '<li>Implementar técnicas de movilización articular y ejercicios de movilidad para restaurar el rango de movimiento normal.</li>';
  }
  
  if (hallazgos.movilidadArticular && hallazgos.movilidadArticular.includes('Hipermóvil')) {
    recomendaciones += '<li>Priorizar el trabajo de estabilización articular, control motor y fortalecimiento de la musculatura estabilizadora.</li>';
  }
  
  if (hallazgos.hallazgosArticulares.includes('Inestabilidad')) {
    recomendaciones += '<li>Enfatizar ejercicios de estabilización, propiocepción y fortalecimiento de la musculatura estabilizadora.</li>';
  }
  
  if (hallazgos.hallazgosArticulares.includes('Crepitación')) {
    recomendaciones += '<li>Incluir ejercicios de bajo impacto, trabajo de control motor y posiblemente suplementación nutricional para tejido articular.</li>';
  }
  
  if (hallazgos.dolorIntensidad >= 7) {
    recomendaciones += '<li>Priorizar estrategias de modulación del dolor: electroterapia, termoterapia, técnicas manuales suaves y educación sobre el dolor.</li>';
  }
  
  if (hallazgos.cicatrices && hallazgos.cicatrices.includes('adheridas')) {
    recomendaciones += '<li>Aplicar técnicas de movilización de cicatrices para mejorar su flexibilidad y reducir adherencias.</li>';
  }
  
  // Recomendaciones específicas por región
  if (region === 'Columna Vertebral') {
    if (subregion === 'Cervical') {
      recomendaciones += '<li>Incluir ejercicios de control motor cervical, corrección postural y educación sobre ergonomía.</li>';
    } else if (subregion === 'Lumbar') {
      recomendaciones += '<li>Enfatizar ejercicios de estabilización lumbar, control motor del core y educación sobre mecánica corporal.</li>';
    }
  } else if (region === 'Extremidad Superior' && subregion === 'Hombro') {
    recomendaciones += '<li>Abordar el ritmo escapulohumeral, fortalecimiento del manguito rotador y mejora de la postura de cintura escapular.</li>';
  } else if (region === 'Extremidad Inferior' && subregion === 'Rodilla') {
    recomendaciones += '<li>Incluir ejercicios de estabilización, fortalecimiento de cuádriceps/isquiotibiales y trabajo propioceptivo.</li>';
  }
  
  // Recomendaciones de autocuidado
  recomendaciones += '<li>Educar al paciente sobre estrategias de autocuidado específicas para su condición.</li>';
  
  recomendaciones += '</ul>';
  return recomendaciones;
}

// Función para generar consideraciones adicionales
function generarConsideracionesAdicionales(region, subregion, severidad) {
  let consideraciones = '<ul>';
  
  // Consideraciones generales según severidad
  if (severidad === 'alta') {
    consideraciones += '<li><strong>Considerar la necesidad de contar con estudios complementarios</strong> antes de definir un plan terapéutico definitivo.</li>';
  }
  
  // Consideraciones específicas por región
  if (region === 'Columna Vertebral') {
    consideraciones += '<li>Evaluar patrón de movimiento global y compensaciones en extremidades y tronco.</li>';
    
    if (subregion === 'Cervical') {
      consideraciones += '<li>Valorar la presencia de signos neurológicos periféricos que podrían sugerir radiculopatía.</li>';
      consideraciones += '<li>Considerar la influencia de factores como estrés, tensión emocional y ergonomía laboral en la sintomatología.</li>';
    } else if (subregion === 'Dorsal') {
      consideraciones += '<li>Evaluar la relación con patrón respiratorio y mecánica costal.</li>';
    } else if (subregion === 'Lumbar') {
      consideraciones += '<li>Valorar influencia de factores laborales, actividades de carga y mecánica corporal habitual.</li>';
      consideraciones += '<li>Considerar evaluación de musculatura profunda estabilizadora (transverso, multífidos).</li>';
    }
  } else if (region === 'Extremidad Superior') {
    consideraciones += '<li>Evaluar patrón funcional global en actividades cotidianas y laborales.</li>';
    
    if (subregion === 'Hombro') {
      consideraciones += '<li>Considerar evaluación específica del manguito rotador y estabilidad glenohumeral.</li>';
      consideraciones += '<li>Evaluar relación con postura de columna cervical y dorsal alta.</li>';
    } else if (subregion === 'Codo') {
      consideraciones += '<li>Evaluar biomecánica de la muñeca y prono-supinación en actividades repetitivas.</li>';
    } else if (subregion === 'Muñeca' || subregion === 'Mano') {
      consideraciones += '<li>Considerar factores neurológicos como compresión nerviosa proximal (túnel carpiano, cubital, etc.).</li>';
    }
  } else if (region === 'Extremidad Inferior') {
    consideraciones += '<li>Evaluar patrón de marcha, cadena cinética y distribución de cargas.</li>';
    
    if (subregion === 'Cadera') {
      consideraciones += '<li>Evaluar influencia en mecánica lumbo-pélvica y posibles compensaciones.</li>';
    } else if (subregion === 'Rodilla') {
      consideraciones += '<li>Considerar alineación mecánica global (eje Q, pronación/supinación del pie, rotación tibial).</li>';
      consideraciones += '<li>Evaluar patrones de activación muscular, especialmente VMO vs VL y equilibrio isquiotibiales/cuádriceps.</li>';
    } else if (subregion === 'Tobillo' || subregion === 'Pie') {
      consideraciones += '<li>Evaluar influencia en la biomecánica proximal (rodilla y cadera).</li>';
      consideraciones += '<li>Considerar necesidad de soporte plantar o análisis de la pisada.</li>';
    }
  }
  
  // Consideraciones generales
  consideraciones += '<li>Evaluar factores contextuales como creencias, expectativas y factores psicosociales que puedan influir en el proceso terapéutico.</li>';
  
  consideraciones += '</ul>';
  return consideraciones;
}

// Asegurar que el código está disponible globalmente
window.toggleInspeccionPalpacion = toggleInspeccionPalpacion;
window.actualizarSubregiones = actualizarSubregiones;
window.actualizarEstructurasEspecificas = actualizarEstructurasEspecificas;
window.toggleCicatricesDetalles = toggleCicatricesDetalles;
window.toggleEdemaDetalles = toggleEdemaDetalles;
window.toggleHematomasDetalles = toggleHematomasDetalles;
window.toggleDeformidadDetalles = toggleDeformidadDetalles;
window.actualizarInspeccion = actualizarInspeccion;
window.actualizarPalpacion = actualizarPalpacion;
