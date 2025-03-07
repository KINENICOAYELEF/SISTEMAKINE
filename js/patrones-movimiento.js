// Function to evaluate movement patterns (FMS)
function evaluarPatronMovimiento(inputId) {
  const select = document.getElementById(inputId);
  if (!select) return;
  
  const valor = parseInt(select.value);
  
  // Apply color based on score
  if (valor === 0) {
    select.style.backgroundColor = '#f8d7da'; // Red - pain
    select.style.color = '#fff';
  } else if (valor === 1) {
    select.style.backgroundColor = '#f8d7da'; // Red - unable
    select.style.color = '#000';
  } else if (valor === 2) {
    select.style.backgroundColor = '#fff3cd'; // Yellow - compensations
  } else if (valor === 3) {
    select.style.backgroundColor = '#d4edda'; // Green - optimal
  } else {
    select.style.backgroundColor = ''; // Default
    select.style.color = '';
  }
  
  // Calculate total FMS score
  calcularTotalFMS();
  
  // Update interpretation and recommendations
  actualizarInterpretacionPatrones();
}

// Function to calculate total FMS score
function calcularTotalFMS() {
  const patrones = [
    'fms_sentadilla', 'fms_valla', 'fms_estocada', 
    'fms_hombro', 'fms_eapr', 'fms_tronco', 'fms_rotacion'
  ];
  
  let total = 0;
  let completados = 0;
  let conDolor = 0;
  let asimetrias = 0;
  
  patrones.forEach(patron => {
    const select = document.getElementById(patron);
    if (select && select.value) {
      completados++;
      const valor = parseInt(select.value);
      total += valor;
      
      if (valor === 0) {
        conDolor++;
      }
      
      // Check for asymmetries
      const asimetriaSelect = document.getElementById(patron + '_asimetria');
      if (asimetriaSelect && asimetriaSelect.value !== 'No') {
        asimetrias++;
      }
    }
  });
  
  // Update total display
  const totalElement = document.getElementById('fms_total');
  if (totalElement) {
    totalElement.textContent = total + '/21';
    
    // Color code based on score
    if (total < 14 && completados === 7) {
      totalElement.style.backgroundColor = '#f8d7da'; // Red - high risk
      totalElement.style.color = '#000';
    } else if (total < 17 && completados === 7) {
      totalElement.style.backgroundColor = '#fff3cd'; // Yellow - moderate risk
    } else if (completados === 7) {
      totalElement.style.backgroundColor = '#d4edda'; // Green - low risk
    } else {
      totalElement.style.backgroundColor = ''; // Incomplete
    }
  }
  
  // Update interpretation
  const interpretacionSelect = document.getElementById('fms_interpretacion');
  if (interpretacionSelect && completados === 7) {
    if (conDolor > 0) {
      interpretacionSelect.value = "Alto riesgo - Presencia de dolor en evaluación";
    } else if (total < 14) {
      interpretacionSelect.value = "Alto riesgo de lesión (puntaje < 14)";
    } else if (total < 17) {
      interpretacionSelect.value = "Riesgo moderado de lesión (puntaje 14-16)";
    } else {
      interpretacionSelect.value = "Bajo riesgo de lesión (puntaje 17-21)";
    }
    
    if (asimetrias > 0) {
      interpretacionSelect.value += ` - ${asimetrias} asimetrías detectadas`;
    }
  }
}

// Function to add a specific movement pattern
function agregarPatronEspecifico() {
  const container = document.getElementById('patrones_especificos_container');
  const patronId = 'patron_esp_' + Date.now();
  
  const html = `
    <div class="form-row mb-3" id="${patronId}_container">
      <div class="form-col form-col-md-3">
        <div class="form-group">
          <input type="text" id="${patronId}_nombre" name="${patronId}_nombre" class="form-control" placeholder="Nombre del patrón">
        </div>
      </div>
      <div class="form-col form-col-md-2">
        <div class="form-group">
          <select id="${patronId}_estado" name="${patronId}_estado" class="form-select" onchange="colorearPatronEspecifico('${patronId}')">
            <option value="">Estado</option>
            <option value="Óptimo">Óptimo</option>
            <option value="Funcional">Funcional</option>
            <option value="Disfuncional">Disfuncional</option>
            <option value="Doloroso">Doloroso</option>
          </select>
        </div>
      </div>
      <div class="form-col form-col-md-3">
        <div class="form-group">
          <input type="text" id="${patronId}_comp" name="${patronId}_comp" class="form-control" placeholder="Compensaciones">
        </div>
      </div>
      <div class="form-col form-col-md-3">
        <div class="form-group">
          <input type="text" id="${patronId}_obs" name="${patronId}_obs" class="form-control" placeholder="Observaciones">
        </div>
      </div>
      <div class="form-col form-col-md-1">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarElemento('${patronId}_container')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', html);
}

// Function to color specific pattern based on state
function colorearPatronEspecifico(patronId) {
  const estado = document.getElementById(`${patronId}_estado`).value;
  const container = document.getElementById(`${patronId}_container`);
  
  // Reset background
  container.style.backgroundColor = '';
  
  // Apply color based on state
  if (estado === 'Óptimo') {
    container.style.backgroundColor = '#d4edda'; // Green
  } else if (estado === 'Funcional') {
    container.style.backgroundColor = '#e8f6e8'; // Light green
  } else if (estado === 'Disfuncional') {
    container.style.backgroundColor = '#fff3cd'; // Yellow
  } else if (estado === 'Doloroso') {
    container.style.backgroundColor = '#f8d7da'; // Red
  }
  
  // Update interpretation
  actualizarInterpretacionPatrones();
}

// Function to add a specific work/sport movement
function agregarMovimientoEspecifico() {
  const container = document.getElementById('movimientos_especificos_container');
  const movId = 'mov_esp_' + Date.now();
  
  const html = `
    <div class="form-row mb-3" id="${movId}_container">
      <div class="form-col form-col-md-3">
        <div class="form-group">
          <input type="text" id="${movId}_nombre" name="${movId}_nombre" class="form-control" placeholder="Movimiento deportivo/laboral">
        </div>
      </div>
      <div class="form-col form-col-md-2">
        <div class="form-group">
          <select id="${movId}_estado" name="${movId}_estado" class="form-select" onchange="colorearMovimientoEspecifico('${movId}')">
            <option value="">Estado</option>
            <option value="Óptimo">Óptimo</option>
            <option value="Funcional">Funcional</option>
            <option value="Disfuncional">Disfuncional</option>
            <option value="Doloroso">Doloroso</option>
          </select>
        </div>
      </div>
      <div class="form-col form-col-md-2">
        <div class="form-group">
          <select id="${movId}_dolor" name="${movId}_dolor" class="form-select">
            <option value="No">Sin dolor</option>
            <option value="Leve">Dolor leve</option>
            <option value="Moderado">Dolor moderado</option>
            <option value="Severo">Dolor severo</option>
          </select>
        </div>
      </div>
      <div class="form-col form-col-md-4">
        <div class="form-group">
          <input type="text" id="${movId}_obs" name="${movId}_obs" class="form-control" placeholder="Aspectos técnicos/compensaciones">
        </div>
      </div>
      <div class="form-col form-col-md-1">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarElemento('${movId}_container')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', html);
}

// Function to color specific work/sport movement based on state
function colorearMovimientoEspecifico(movId) {
  const estado = document.getElementById(`${movId}_estado`).value;
  const container = document.getElementById(`${movId}_container`);
  
  // Reset background
  container.style.backgroundColor = '';
  
  // Apply color based on state
  if (estado === 'Óptimo') {
    container.style.backgroundColor = '#d4edda'; // Green
  } else if (estado === 'Funcional') {
    container.style.backgroundColor = '#e8f6e8'; // Light green
  } else if (estado === 'Disfuncional') {
    container.style.backgroundColor = '#fff3cd'; // Yellow
  } else if (estado === 'Doloroso') {
    container.style.backgroundColor = '#f8d7da'; // Red
  }
  
  // Update interpretation
  actualizarInterpretacionPatrones();
}

// Function to update clinical interpretation for movement patterns
function actualizarInterpretacionPatrones() {
  // Get FMS total if complete
  const totalElement = document.getElementById('fms_total');
  const interpretacionFMS = document.getElementById('fms_interpretacion');
  
  let fmsComplete = false;
  let fmsTotal = 0;
  let fmsRiesgo = '';
  
  if (totalElement && interpretacionFMS && interpretacionFMS.value) {
    fmsComplete = true;
    fmsTotal = parseInt(totalElement.textContent);
    fmsRiesgo = interpretacionFMS.value;
  }
  
  // Count pattern states
  let patronesOptimos = 0;
  let patronesFuncionales = 0;
  let patronesDisfuncionales = 0;
  let patronesDolorosos = 0;
  let totalPatrones = 0;
  
  // Check predefined patterns
  const patrones = ['patron_sentadilla', 'patron_marcha', 'patron_escaleras'];
  patrones.forEach(patron => {
    const estadoSelect = document.getElementById(`${patron}_estado`);
    if (estadoSelect && estadoSelect.value) {
      totalPatrones++;
      const estado = estadoSelect.value;
      
      if (estado === 'Óptimo') patronesOptimos++;
      if (estado === 'Funcional') patronesFuncionales++;
      if (estado === 'Disfuncional') patronesDisfuncionales++;
      if (estado === 'Doloroso') patronesDolorosos++;
    }
  });
  
  // Check added specific patterns
  document.querySelectorAll('[id^="patron_esp_"][id$="_estado"]').forEach(estadoSelect => {
    if (estadoSelect && estadoSelect.value) {
      totalPatrones++;
      const estado = estadoSelect.value;
      
      if (estado === 'Óptimo') patronesOptimos++;
      if (estado === 'Funcional') patronesFuncionales++;
      if (estado === 'Disfuncional') patronesDisfuncionales++;
      if (estado === 'Doloroso') patronesDolorosos++;
    }
  });
  
  // Check added sport/work movements
  document.querySelectorAll('[id^="mov_esp_"][id$="_estado"]').forEach(estadoSelect => {
    if (estadoSelect && estadoSelect.value) {
      totalPatrones++;
      const estado = estadoSelect.value;
      
      if (estado === 'Óptimo') patronesOptimos++;
      if (estado === 'Funcional') patronesFuncionales++;
      if (estado === 'Disfuncional') patronesDisfuncionales++;
      if (estado === 'Doloroso') patronesDolorosos++;
    }
  });
  
  // Generate interpretation text
  const interpretacionElement = document.getElementById('interpretacion-patrones-texto');
  const recomendacionesElement = document.getElementById('recomendaciones-patrones-texto');
  
  if (!fmsComplete && totalPatrones === 0) {
    interpretacionElement.innerHTML = "Complete la evaluación de patrones de movimiento para obtener la interpretación clínica.";
    recomendacionesElement.innerHTML = "Complete la evaluación de patrones de movimiento para obtener recomendaciones para el plan de tratamiento.";
    return;
  }
  
  // Generate interpretation based on findings
  let interpretacion = '';
  let recomendaciones = '';
  
  if (patronesDolorosos > 0 || (fmsComplete && fmsRiesgo.includes('dolor'))) {
    // Painful patterns
    interpretacion = `<span class="text-danger">Alteración severa de patrones de movimiento con presencia de dolor.</span> `;
    
    if (fmsComplete) {
      interpretacion += `La evaluación FMS muestra un puntaje de ${fmsTotal}/21, indicando ${fmsRiesgo.toLowerCase()}. `;
    }
    
    interpretacion += `El paciente presenta ${patronesDolorosos} patrones de movimiento dolorosos y ${patronesDisfuncionales} disfuncionales de un total de ${totalPatrones} evaluados. `;
    interpretacion += `Este hallazgo sugiere una alteración significativa del control motor con componente nociceptivo activo durante la ejecución de movimientos funcionales.`;
    
    recomendaciones = `
      <ul>
        <li><strong>Priorizar manejo del dolor</strong> durante movimientos funcionales específicos.</li>
        <li>Implementar estrategias de <strong>control motor en rangos sin dolor</strong>, progresando gradualmente.</li>
        <li>Modificar temporalmente patrones dolorosos, utilizando variantes que no generen dolor.</li>
        <li>Educar sobre mecanismos del dolor y su relación con el movimiento.</li>
        <li>Considerar técnicas específicas de <strong>facilitación neuromuscular</strong> para mejorar control motor sin provocar dolor.</li>
      </ul>
    `;
    
  } else if (patronesDisfuncionales > totalPatrones * 0.5 || (fmsComplete && fmsTotal < 14)) {
    // Dysfunctional patterns predominant
    interpretacion = `<span class="text-warning">Alteración moderada-severa de patrones de movimiento.</span> `;
    
    if (fmsComplete) {
      interpretacion += `La evaluación FMS muestra un puntaje de ${fmsTotal}/21, indicando ${fmsRiesgo.toLowerCase()}. `;
    }
    
    interpretacion += `El paciente presenta ${patronesDisfuncionales} patrones disfuncionales de un total de ${totalPatrones} evaluados. `;
    
    if (patronesFuncionales > 0 || patronesOptimos > 0) {
      interpretacion += `Mantiene ${patronesFuncionales + patronesOptimos} patrones funcionales u óptimos que pueden servir como base para la rehabilitación. `;
    }
    
    interpretacion += `Este perfil sugiere alteraciones en el control motor y posibles compensaciones debidas a déficits de fuerza, flexibilidad o propiocepción.`;
    
    recomendaciones = `
      <ul>
        <li><strong>Reeducación de patrones de movimiento básicos</strong> con progresión hacia patrones funcionales específicos.</li>
        <li>Implementar programa de <strong>estabilidad central (core)</strong> como base para patrones periféricos.</li>
        <li>Trabajar componentes deficitarios identificados: fuerza, flexibilidad, propiocepción.</li>
        <li>Utilizar feedback (visual, verbal, táctil) para mejorar conciencia corporal y calidad de movimiento.</li>
        <li>Progresar desde entornos controlados hacia entornos variables según mejore el control motor.</li>
      </ul>
    `;
    
  } else if (patronesFuncionales > totalPatrones * 0.5 || (fmsComplete && fmsTotal >= 14 && fmsTotal < 17)) {
    // Functional patterns predominant with some dysfunctions
    interpretacion = `<span class="text-info">Patrones de movimiento mayoritariamente funcionales con algunas disfunciones.</span> `;
    
    if (fmsComplete) {
      interpretacion += `La evaluación FMS muestra un puntaje de ${fmsTotal}/21, indicando ${fmsRiesgo.toLowerCase()}. `;
    }
    
    interpretacion += `El paciente presenta ${patronesFuncionales} patrones funcionales y ${patronesOptimos} óptimos, con ${patronesDisfuncionales} patrones disfuncionales. `;
    interpretacion += `Este perfil sugiere un control motor generalmente adecuado pero con áreas específicas de mejora que deben abordarse para optimizar función y prevenir problemas futuros.`;
    
    recomendaciones = `
      <ul>
        <li><strong>Optimizar patrones específicos disfuncionales</strong> identificados en la evaluación.</li>
        <li>Implementar <strong>ejercicios correctivos dirigidos</strong> a las compensaciones observadas.</li>
        <li>Fortalecer componentes de estabilidad dinámica y control neuromuscular avanzado.</li>
        <li>Progresar hacia ejercicios funcionales con mayor carga/velocidad manteniendo calidad de movimiento.</li>
        <li>Enfatizar variabilidad de práctica para consolidar patrones en diferentes contextos.</li>
      </ul>
    `;
    
  } else if ((patronesOptimos + patronesFuncionales) === totalPatrones || (fmsComplete && fmsTotal >= 17)) {
    // Mostly optimal patterns
    interpretacion = `<span class="text-success">Patrones de movimiento funcionales u óptimos.</span> `;
    
    if (fmsComplete) {
      interpretacion += `La evaluación FMS muestra un puntaje de ${fmsTotal}/21, indicando ${fmsRiesgo.toLowerCase()}. `;
    }
    
    interpretacion += `El paciente presenta ${patronesOptimos} patrones óptimos y ${patronesFuncionales} funcionales de un total de ${totalPatrones} evaluados. `;
    interpretacion += `Este perfil indica un excelente control motor y calidad de movimiento, con capacidad para realizar patrones funcionales complejos de forma segura y eficiente.`;
    
    recomendaciones = `
      <ul>
        <li><strong>Mantener los actuales niveles de calidad de movimiento</strong> e integrarlos en actividades específicas del paciente.</li>
        <li>Introducir <strong>progresiones de complejidad</strong> en los patrones evaluados (resistencia, velocidad, estabilidad).</li>
        <li>Optimizar rendimiento específico en movimientos laborales/deportivos relevantes.</li>
        <li>Implementar estrategias preventivas para mantener la calidad del movimiento a largo plazo.</li>
        <li>Educar sobre la importancia de mantener patrones óptimos en diversas actividades.</li>
      </ul>
    `;
  } else {
    // Mixed findings
    interpretacion = `<span class="text-primary">Patrón mixto de calidad de movimiento.</span> `;
    
    if (fmsComplete) {
      interpretacion += `La evaluación FMS muestra un puntaje de ${fmsTotal}/21. `;
    }
    
    interpretacion += `El paciente presenta un perfil mixto con ${patronesOptimos} patrones óptimos, ${patronesFuncionales} funcionales y ${patronesDisfuncionales} disfuncionales de un total de ${totalPatrones} evaluados. `;
    interpretacion += `Este perfil sugiere capacidades variables de control motor según los patrones específicos, con necesidad de intervención dirigida a los déficits identificados.`;
    
    recomendaciones = `
      <ul>
        <li><strong>Priorizar la corrección de patrones disfuncionales específicos</strong> mientras se mantienen los funcionales/óptimos.</li>
        <li>Implementar programa individualizado que aborde los componentes deficitarios identificados.</li>
        <li>Utilizar los patrones óptimos como modelo para transferencia de aprendizaje motor a los disfuncionales.</li>
        <li>Educar sobre autocorrección y estrategias de monitoreo de la calidad del movimiento.</li>
        <li>Progresión gradual de dificultad asegurando que se mantiene la calidad del movimiento.</li>
      </ul>
    `;
  }
  
  // Add evidence-based context
  interpretacion += `<p class="mt-3 text-muted">Nota: La interpretación considera la calidad del movimiento y control motor, que son predictores más fuertes de funcionalidad y riesgo de lesión que la movilidad articular aislada.</p>`;
  
  // Update elements
  interpretacionElement.innerHTML = interpretacion;
  recomendacionesElement.innerHTML = recomendaciones;
}

// Initialize event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add listener for pattern button
  const agregarPatronBtn = document.getElementById('agregar_patron_btn');
  if (agregarPatronBtn) {
    agregarPatronBtn.addEventListener('click', agregarPatronEspecifico);
  }
  
  // Add listener for specific movement button
  const agregarMovimientoBtn = document.getElementById('agregar_movimiento_especifico_btn');
  if (agregarMovimientoBtn) {
    agregarMovimientoBtn.addEventListener('click', agregarMovimientoEspecifico);
  }
  
  // Set up event listeners for predefined patterns
  const patronesPredefinidos = ['patron_sentadilla', 'patron_marcha', 'patron_escaleras'];
  patronesPredefinidos.forEach(patron => {
    const estadoSelect = document.getElementById(`${patron}_estado`);
    if (estadoSelect) {
      estadoSelect.addEventListener('change', function() {
        colorearPatronEspecifico(patron);
      });
    }
  });
  
  console.log('Movement patterns evaluation event listeners initialized');
});
