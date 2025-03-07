// Function to show ROM table for selected region
function mostrarTablaROM() {
  // First, hide all tables
  document.querySelectorAll('.tabla-rom').forEach(tabla => {
    tabla.style.display = 'none';
  });
  
  // Show the selected table
  const region = document.getElementById('rom_region').value;
  if (region) {
    const tabla = document.getElementById('tabla_rom_' + region);
    if (tabla) {
      tabla.style.display = 'block';
      
      // Update completion badge
      document.getElementById('rom-evaluation-badge').textContent = 'En progreso';
      document.getElementById('rom-evaluation-badge').className = 'resultado-badge badge-warning';
    }
    
    // Load accessory movements for the selected region
    cargarMovimientosAccesorios(region);
  }
}

// Function to evaluate ROM values
function evaluarROM(inputId, min, warning, normal) {
  const input = document.getElementById(inputId);
  const estadoElement = document.getElementById(inputId + '_estado');
  
  if (input && estadoElement) {
    const valor = parseInt(input.value);
    
    if (isNaN(valor)) {
      estadoElement.textContent = '';
      input.style.backgroundColor = '';
      return;
    }
    
    if (valor < min) {
      estadoElement.textContent = 'Inválido';
      estadoElement.style.color = '#dc3545';
      input.style.backgroundColor = '#ffcccc';
    } else if (valor < warning) {
      estadoElement.textContent = 'Limitación Severa';
      estadoElement.style.color = '#dc3545';
      input.style.backgroundColor = '#ffdddd';
    } else if (valor < normal) {
      estadoElement.textContent = 'Limitación Moderada';
      estadoElement.style.color = '#ff8800';
      input.style.backgroundColor = '#fff3cd';
    } else {
      estadoElement.textContent = 'Normal';
      estadoElement.style.color = '#28a745';
      input.style.backgroundColor = '#e8f6e8';
    }
    
    // Update interpretation and recommendations based on all ROM values
    actualizarInterpretacionROM();
  }
}

// Function to evaluate pain across all movements
function evaluarDolorROM() {
  const region = document.getElementById('rom_region').value;
  if (!region) return;
  
  // Update interpretation based on pain patterns
  actualizarInterpretacionROM();
}

// Function to add functional movement row
function agregarMovimientoFuncional() {
  const container = document.getElementById('movimientos_funcionales_container');
  const movId = 'mov_func_' + Date.now();
  
  const html = `
    <div class="form-row mb-3" id="${movId}_container">
      <div class="form-col form-col-md-3">
        <div class="form-group">
          <input type="text" id="${movId}_nombre" name="${movId}_nombre" class="form-control" placeholder="Nombre del movimiento">
        </div>
      </div>
      <div class="form-col form-col-md-2">
        <div class="form-group">
          <select id="${movId}_estado" name="${movId}_estado" class="form-select" onchange="colorearMovimientoFuncional('${movId}')">
            <option value="">Estado</option>
            <option value="Funcional">Funcional</option>
            <option value="Limitado">Limitado</option>
            <option value="Disfuncional">Disfuncional</option>
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
          <input type="text" id="${movId}_obs" name="${movId}_obs" class="form-control" placeholder="Observaciones">
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

// Function to color functional movement row based on state
function colorearMovimientoFuncional(movId) {
  const estado = document.getElementById(`${movId}_estado`).value;
  const container = document.getElementById(`${movId}_container`);
  
  // Reset background
  container.style.backgroundColor = '';
  
  // Apply color based on state
  if (estado === 'Funcional') {
    container.style.backgroundColor = '#e8f6e8';
  } else if (estado === 'Limitado') {
    container.style.backgroundColor = '#fff3cd';
  } else if (estado === 'Disfuncional') {
    container.style.backgroundColor = '#f8d7da';
  }
}

// Function to load accessory movements for selected region
function cargarMovimientosAccesorios(region) {
  const container = document.getElementById('movimientos_accesorios_container');
  container.innerHTML = ''; // Clear previous content
  
  let movimientos = [];
  
  // Define accessory movements based on the region
  switch(region) {
    case 'columna_cervical':
      movimientos = [
        'Deslizamiento anterior C1-C2', 
        'Deslizamiento posterior C1-C2',
        'Deslizamiento lateral C1-C2',
        'Deslizamiento anterior C2-C3',
        'Deslizamiento posterior C2-C3',
        'Deslizamiento lateral C2-C3',
        'Deslizamiento anterior C3-C7',
        'Deslizamiento posterior C3-C7',
        'Deslizamiento lateral C3-C7'
      ];
      break;
    case 'columna_dorsal':
      movimientos = [
        'Deslizamiento craneal D1-D4',
        'Deslizamiento caudal D1-D4',
        'Deslizamiento lateral D1-D4',
        'Deslizamiento craneal D5-D12',
        'Deslizamiento caudal D5-D12',
        'Deslizamiento lateral D5-D12',
        'Rotación costovertebral'
      ];
      break;
    case 'columna_lumbar':
      movimientos = [
        'Deslizamiento craneal L1-L5',
        'Deslizamiento caudal L1-L5',
        'Deslizamiento lateral L1-L5',
        'Gap central L1-L5',
        'Deslizamiento craneal L5-S1',
        'Deslizamiento caudal L5-S1',
        'Deslizamiento lateral L5-S1'
      ];
      break;
    case 'hombro':
      movimientos = [
        'Deslizamiento anterior glenohumeral',
        'Deslizamiento posterior glenohumeral',
        'Deslizamiento inferior glenohumeral',
        'Tracción glenohumeral',
        'Deslizamiento acromioclavicular',
        'Deslizamiento esternoclavicular'
      ];
      break;
    case 'codo':
      movimientos = [
        'Deslizamiento anterior/posterior húmero-cubital',
        'Deslizamiento anterior/posterior radio-humeral',
        'Deslizamiento anterior/posterior radio-cubital proximal',
        'Tracción codo'
      ];
      break;
    case 'muneca_mano':
      movimientos = [
        'Deslizamiento anterior/posterior radio-carpiana',
        'Deslizamiento lateral radio-carpiana',
        'Tracción radio-carpiana',
        'Deslizamiento intercarpianos',
        'Deslizamiento carpometacarpiano',
        'Deslizamiento metacarpofalángico',
        'Deslizamiento interfalángico'
      ];
      break;
    case 'cadera':
      movimientos = [
        'Tracción coxofemoral',
        'Deslizamiento caudal coxofemoral',
        'Deslizamiento anterior coxofemoral',
        'Deslizamiento posterior coxofemoral',
        'Compresión/distracción sacroilíaca'
      ];
      break;
    case 'rodilla':
      movimientos = [
        'Deslizamiento anterior tibia',
        'Deslizamiento posterior tibia',
        'Deslizamiento lateral/medial tibia',
        'Deslizamiento patelar superior/inferior',
        'Deslizamiento patelar medial/lateral',
        'Tracción tibiofemoral'
      ];
      break;
    case 'tobillo_pie':
      movimientos = [
        'Deslizamiento anterior/posterior tibio-astragalino',
        'Deslizamiento medial/lateral tibio-astragalino',
        'Tracción tibio-astragalino',
        'Deslizamiento calcáneo-cuboidea',
        'Deslizamiento astrágalo-escafoidea',
        'Deslizamiento intermetatarsiano'
      ];
      break;
    case 'atm':
      movimientos = [
        'Deslizamiento anterior/posterior ATM',
        'Tracción ATM',
        'Deslizamiento medial ATM',
        'Deslizamiento lateral ATM'
      ];
      break;
    default:
      container.innerHTML = '<p class="text-muted">Seleccione una región anatómica para ver los movimientos accesorios correspondientes.</p>';
      return;
  }
  
  // Create accessory movement table
  let html = `
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Movimiento Accesorio</th>
            <th>Amplitud</th>
            <th>Sensación Terminal</th>
            <th>Dolor</th>
            <th>Respuesta</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add rows for each accessory movement
  movimientos.forEach(movimiento => {
    const movId = 'acc_' + region + '_' + movimiento.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    html += `
      <tr id="${movId}_row">
        <td>${movimiento}</td>
        <td>
          <select id="${movId}_amplitud" name="${movId}_amplitud" class="form-select" onchange="evaluarMovimientoAccesorio('${movId}')">
            <option value="">Seleccionar</option>
            <option value="Hipomóvil+">Hipomóvil+++</option>
            <option value="Hipomóvil++">Hipomóvil++</option>
            <option value="Hipomóvil+">Hipomóvil+</option>
            <option value="Normal">Normal</option>
            <option value="Hipermóvil+">Hipermóvil+</option>
            <option value="Hipermóvil++">Hipermóvil++</option>
            <option value="Hipermóvil+++">Hipermóvil+++</option>
          </select>
        </td>
        <td>
          <select id="${movId}_sensacion" name="${movId}_sensacion" class="form-select">
            <option value="">Seleccionar</option>
            <option value="Blanda">Blanda</option>
            <option value="Firme">Firme</option>
            <option value="Dura">Dura</option>
            <option value="Espasmo">Espasmo</option>
          </select>
        </td>
        <td>
          <select id="${movId}_dolor" name="${movId}_dolor" class="form-select" onchange="evaluarMovimientoAccesorio('${movId}')">
            <option value="No">No</option>
            <option value="Leve">Leve</option>
            <option value="Moderado">Moderado</option>
            <option value="Severo">Severo</option>
          </select>
        </td>
        <td>
          <select id="${movId}_respuesta" name="${movId}_respuesta" class="form-select" onchange="evaluarMovimientoAccesorio('${movId}')">
            <option value="">Seleccionar</option>
            <option value="Alivia">Alivia síntomas</option>
            <option value="Empeora">Empeora síntomas</option>
            <option value="Reproduce">Reproduce síntomas</option>
            <option value="Sin cambios">Sin cambios</option>
          </select>
        </td>
        <td>
          <input type="text" id="${movId}_obs" name="${movId}_obs" class="form-control">
        </td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
}

// Function to evaluate and colorize accessory movement row
function evaluarMovimientoAccesorio(movId) {
  const amplitud = document.getElementById(`${movId}_amplitud`).value;
  const dolor = document.getElementById(`${movId}_dolor`).value;
  const respuesta = document.getElementById(`${movId}_respuesta`).value;
  const row = document.getElementById(`${movId}_row`);
  
  // Reset background
  row.style.backgroundColor = '';
  
  // Apply color based on findings
  if (amplitud.includes('Hipomóvil+++') || dolor === 'Severo') {
    row.style.backgroundColor = '#f8d7da'; // Red - severe restriction
  } else if (amplitud.includes('Hipomóvil++') || amplitud.includes('Hipermóvil++') || dolor === 'Moderado') {
    row.style.backgroundColor = '#fff3cd'; // Yellow - moderate restriction or hypermobility
  } else if (respuesta === 'Reproduce' || respuesta === 'Empeora') {
    row.style.backgroundColor = '#fff3cd'; // Yellow - reproduced or worsened symptoms
  } else if (respuesta === 'Alivia') {
    row.style.backgroundColor = '#e8f6e8'; // Green - relieved symptoms
  }
  
  // Update interpretation
  actualizarInterpretacionMovimientosAccesorios();
}

// Function to update clinical interpretation for accessory movements
function actualizarInterpretacionMovimientosAccesorios() {
  const region = document.getElementById('rom_region').value;
  if (!region) return;
  
  let hipomoviles = 0;
  let hipermoviles = 0;
  let dolorosos = 0;
  let alivian = 0;
  let empeoran = 0;
  let reproducen = 0;
  
  // Count issues in accessory movements
  document.querySelectorAll(`[id^="acc_${region}_"][id$="_amplitud"]`).forEach(select => {
    const movId = select.id.replace('_amplitud', '');
    const amplitud = select.value;
    const dolor = document.getElementById(`${movId}_dolor`).value;
    const respuesta = document.getElementById(`${movId}_respuesta`).value;
    
    if (amplitud.includes('Hipomóvil')) {
      hipomoviles++;
    } else if (amplitud.includes('Hipermóvil')) {
      hipermoviles++;
    }
    
    if (dolor !== 'No') {
      dolorosos++;
    }
    
    if (respuesta === 'Alivia') {
      alivian++;
    } else if (respuesta === 'Empeora') {
      empeoran++;
    } else if (respuesta === 'Reproduce') {
      reproducen++;
    }
  });
  
  // Consider this data in the overall interpretation
  actualizarInterpretacionROM(hipomoviles, hipermoviles, dolorosos, alivian, empeoran, reproducen);
}

// Function to update clinical interpretation and recommendations
function actualizarInterpretacionROM(hipomoviles = 0, hipermoviles = 0, dolorososAcc = 0, alivian = 0, empeoran = 0, reproducen = 0) {
  const region = document.getElementById('rom_region').value;
  if (!region) return;
  
  // Get all ROM inputs for the selected region
  const romInputs = document.querySelectorAll(`#tabla_rom_${region} .rom-input`);
  const dolorSelects = document.querySelectorAll(`#tabla_rom_${region} select[id$="_dolor"]`);
  
  // Count limitations and painful movements
  let limitacionesGraves = 0;
  let limitacionesModeradas = 0;
  let movimientosDolorosos = 0;
  let totalInputs = 0;
  
  romInputs.forEach(input => {
    const estado = document.getElementById(input.id + '_estado');
    if (estado && estado.textContent) {
      totalInputs++;
      if (estado.textContent === 'Limitación Severa') {
        limitacionesGraves++;
      } else if (estado.textContent === 'Limitación Moderada') {
        limitacionesModeradas++;
      }
    }
  });
  
  dolorSelects.forEach(select => {
    if (select.value !== 'No') {
      movimientosDolorosos++;
    }
  });
  
  // Update completion badge
  if (totalInputs > 0) {
    document.getElementById('rom-evaluation-badge').textContent = 'Completado';
    document.getElementById('rom-evaluation-badge').className = 'resultado-badge badge-success';
  }
  
  // Generate interpretation text
  const interpretacionElement = document.getElementById('interpretacion-rom-texto');
  const recomendacionesElement = document.getElementById('recomendaciones-rom-texto');
  
  if (totalInputs === 0) {
    interpretacionElement.innerHTML = "Complete la evaluación de rangos de movimiento para obtener la interpretación clínica.";
    recomendacionesElement.innerHTML = "Complete la evaluación de rangos de movimiento para obtener recomendaciones para el plan de tratamiento.";
    return;
  }
  
  // Calculate percentage of limitations
  const porcentajeLimitaciones = ((limitacionesGraves + limitacionesModeradas) / totalInputs) * 100;
  
  // Get region name in readable format
  const regionName = region.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Generate interpretation based on findings
  let interpretacion = '';
  let recomendaciones = '';
  
  if (limitacionesGraves > 0 && porcentajeLimitaciones > 50) {
    interpretacion = `<span class="text-danger">Restricción severa de movilidad en ${regionName}.</span> Presenta limitaciones importantes en ${limitacionesGraves} movimientos con restricción severa y ${limitacionesModeradas} con restricción moderada. El patrón de limitación sugiere un compromiso articular significativo`;
    
    if (movimientosDolorosos > 0) {
      interpretacion += ` con ${movimientosDolorosos} movimientos dolorosos, lo que indica un componente inflamatorio/nociceptivo activo.`;
    } else {
      interpretacion += `, aunque la ausencia de dolor sugiere una adaptación crónica o un componente estructural.`;
    }
    
    // Add findings from accessory movements if available
    if (hipomoviles > 0 || hipermoviles > 0) {
      interpretacion += ` La evaluación de movimientos accesorios revela ${hipomoviles} segmentos hipomóviles y ${hipermoviles} hipermóviles`;
      
      if (alivian > 0) {
        interpretacion += `, con ${alivian} técnicas que alivian síntomas lo que sugiere una disfunción mecánica tratable mediante terapia manual.`;
      } else if (empeoran > 0 || reproducen > 0) {
        interpretacion += `, con ${empeoran + reproducen} técnicas que reproducen o empeoran los síntomas, sugiriendo una irritabilidad moderada a alta.`;
      } else {
        interpretacion += `.`;
      }
    }
    
    recomendaciones = `
      <ul>
        <li><strong>Priorizar técnicas de movilización articular progresiva</strong> para restaurar los rangos de movimiento, especialmente en ${regionName}.</li>
        <li>Considerar técnicas de terapia manual específicas enfocadas en las articulaciones más limitadas.</li>
        <li>Implementar ejercicios terapéuticos graduales enfocados en mejorar movilidad y control motor.</li>
        <li>Educación al paciente sobre estrategias de automanejo.</li>
    `;
    
    if (movimientosDolorosos > 0 || dolorososAcc > 0) {
      recomendaciones += `
        <li>Incorporar técnicas de modulación del dolor antes de las intervenciones mecánicas.</li>
        <li>Considerar estrategias de control de la inflamación si corresponde.</li>
      `;
    }
    
    if (alivian > 0) {
      recomendaciones += `
        <li>Utilizar las técnicas que demostraron alivio de síntomas como parte central del tratamiento.</li>
      `;
    }
    
    recomendaciones += `</ul>`;
    
  } else if (porcentajeLimitaciones > 25) {
    interpretacion = `<span class="text-warning">Restricción moderada de movilidad en ${regionName}.</span> Presenta ${limitacionesModeradas} movimientos con limitación moderada y ${limitacionesGraves} con limitación severa. Este patrón sugiere un compromiso de movilidad que podría estar afectando la función`;
    
    if (movimientosDolorosos > 0) {
      interpretacion += `, con presencia de dolor en ${movimientosDolorosos} movimientos.`;
    } else {
      interpretacion += `, sin presencia de dolor durante los rangos evaluados.`;
    }
    
    // Add findings from accessory movements if available
    if (hipomoviles > 0 || hipermoviles > 0) {
      interpretacion += ` El examen de movimientos accesorios muestra ${hipomoviles} segmentos hipomóviles y ${hipermoviles} hipermóviles`;
      
      if (alivian > 0 || reproducen > 0) {
        interpretacion += `, con ${alivian} técnicas que alivian síntomas y ${reproducen} que los reproducen, proporcionando orientación para el tratamiento manual.`;
      } else {
        interpretacion += `.`;
      }
    }
    
    recomendaciones = `
      <ul>
        <li><strong>Implementar programa progresivo de ejercicios de movilidad articular</strong> específicos para ${regionName}.</li>
        <li>Complementar con ejercicios de fortalecimiento y control motor en rangos disponibles.</li>
        <li>Considerar técnicas manuales como complemento para mejorar la movilidad articular.</li>
        <li>Educación sobre estrategias para mantener y mejorar movilidad en el hogar.</li>
      `;
      
    if (alivian > 0) {
      recomendaciones += `
        <li>Priorizar las técnicas que demostraron alivio sintomático durante la evaluación.</li>
      `;
    }
    
    recomendaciones += `</ul>`;
    
  } else {
    interpretacion = `<span class="text-success">Movilidad general conservada en ${regionName}.</span> Presenta rangos de movimiento mayoritariamente dentro de límites funcionales, con solo ${limitacionesModeradas} movimientos con limitación moderada y ${limitacionesGraves} con limitación severa`;
    
    if (movimientosDolorosos > 0) {
      interpretacion += `. Sin embargo, presenta dolor en ${movimientosDolorosos} movimientos, lo que sugiere un componente nociceptivo que debe ser abordado.`;
      
      // Add findings from accessory movements if available
      if (reproducen > 0 || empeoran > 0) {
        interpretacion += ` Los movimientos accesorios identificaron ${reproducen + empeoran} técnicas que reproducen o empeoran los síntomas, proporcionando información valiosa para el manejo dirigido.`;
      }
      
      recomendaciones = `
        <ul>
          <li><strong>Enfoque terapéutico centrado en el manejo del componente doloroso</strong> más que en recuperar rangos de movimiento.</li>
          <li>Implementar estrategias de control motor y estabilización para optimizar patrones de movimiento.</li>
          <li>Ejercicios funcionales para mantener y potenciar los rangos actuales.</li>
          <li>Educación sobre factores que pueden influir en la percepción del dolor durante el movimiento.</li>
        `;
        
      if (alivian > 0) {
        recomendaciones += `
          <li>Utilizar las técnicas que demostraron alivio de síntomas como parte del tratamiento.</li>
        `;
      }
      
      recomendaciones += `</ul>`;
      
    } else {
      interpretacion += `. No presenta dolor durante los movimientos evaluados.`;
      
      if (hipomoviles > 0 || hipermoviles > 0) {
        interpretacion += ` El examen de movimientos accesorios revela algunas alteraciones sutiles (${hipomoviles} segmentos hipomóviles, ${hipermoviles} hipermóviles) que podrían monitorizarse.`;
      }
      
      recomendaciones = `
        <ul>
          <li><strong>Enfoque preventivo</strong> para mantener los rangos funcionales actuales.</li>
          <li>Implementar ejercicios de fortalecimiento y control motor para optimizar la función.</li>
          <li>Educación sobre ergonomía y posturas adecuadas para prevenir limitaciones futuras.</li>
          <li>Considerar ejercicios específicos para las pocas áreas con limitación leve identificadas.</li>
        </ul>
      `;
    }
  }
  
  // Add evidence-based context
  interpretacion += `<p class="mt-3 text-muted">Nota: La interpretación integra hallazgos de rangos activos, pasivos y movimientos accesorios, considerando la relevancia funcional para este paciente específico.</p>`;
  
  // Update elements
  interpretacionElement.innerHTML = interpretacion;
  recomendacionesElement.innerHTML = recomendaciones;
}

// Function to remove an element
function eliminarElemento(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.remove();
  }
}

// Initialize event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add listener for movement button
  const agregarMovimientoBtn = document.getElementById('agregar_movimiento_btn');
  if (agregarMovimientoBtn) {
    agregarMovimientoBtn.addEventListener('click', agregarMovimientoFuncional);
  }
  
  // Add listener for region select
  const romRegionSelect = document.getElementById('rom_region');
  if (romRegionSelect) {
    romRegionSelect.addEventListener('change', mostrarTablaROM);
  }
  
  console.log('ROM evaluation event listeners initialized');
});
