/**
 * fuerza-muscular.js
 * Funcionalidades para la evaluación de fuerza muscular
 */

// Mostrar tabla de fuerza según la región seleccionada
function mostrarTablaFuerza() {
  const region = document.getElementById('fuerza_region').value;
  
  // Ocultar todas las tablas
  document.querySelectorAll('.tabla-fuerza').forEach(tabla => {
    tabla.style.display = 'none';
  });
  
  // Mostrar la tabla seleccionada
  if (region) {
    const tablaID = 'tabla_fuerza_' + region;
    const tabla = document.getElementById(tablaID);
    if (tabla) {
      tabla.style.display = 'block';
    }
  }
}

// Evaluar fuerza según la escala seleccionada
function evaluarFuerza(input, escala) {
  const valor = parseFloat(input.value);
  const estadoID = input.id + '_estado';
  const estado = document.getElementById(estadoID);
  
  if (!estado) return;
  
  if (isNaN(valor)) {
    estado.textContent = '';
    return;
  }
  
  if (escala === 'daniels') {
    // Escala Daniels (0-5)
    if (valor <= 1) {
      estado.textContent = 'Grave';
      estado.className = 'badge bg-danger text-white';
    } else if (valor <= 3) {
      estado.textContent = 'Moderado';
      estado.className = 'badge bg-warning text-dark';
    } else if (valor <= 4) {
      estado.textContent = 'Leve';
      estado.className = 'badge bg-info text-white';
    } else {
      estado.textContent = 'Normal';
      estado.className = 'badge bg-success text-white';
    }
  } else if (escala === 'oxford') {
    // Escala Oxford (0-10)
    if (valor <= 2) {
      estado.textContent = 'Grave';
      estado.className = 'badge bg-danger text-white';
    } else if (valor <= 5) {
      estado.textContent = 'Moderado';
      estado.className = 'badge bg-warning text-dark';
    } else if (valor <= 8) {
      estado.textContent = 'Leve';
      estado.className = 'badge bg-info text-white';
    } else {
      estado.textContent = 'Normal';
      estado.className = 'badge bg-success text-white';
    }
  }
  
  // Evaluar asimetrías bilaterales
  evaluarAsimetriasFuerza();
  
  // Actualizar interpretación clínica
  actualizarInterpretacionFuerza();
}

// Cambiar la escala de fuerza entre Daniels y Oxford
function actualizarEscala(selector, baseId) {
  const escala = selector.value;
  const prefijos = ['_der', '_izq'];
  
  prefijos.forEach(prefijo => {
    const inputId = baseId + prefijo;
    const input = document.getElementById(inputId);
    
    if (input) {
      // Guardar el valor actual para convertirlo
      const valorActual = parseFloat(input.value);
      
      // Actualizar clases y atributos
      input.classList.remove('daniels', 'oxford');
      input.classList.add(escala);
      
      // Actualizar rango según la escala
      if (escala === 'daniels') {
        input.setAttribute('max', '5');
        input.setAttribute('step', '0.5');
        if (!isNaN(valorActual) && valorActual > 5) {
          // Convertir de Oxford a Daniels (aproximado)
          input.value = Math.min(5, Math.round(valorActual / 2));
        }
      } else {
        input.setAttribute('max', '10');
        input.setAttribute('step', '1');
        if (!isNaN(valorActual) && valorActual <= 5) {
          // Convertir de Daniels a Oxford (aproximado)
          input.value = Math.round(valorActual * 2);
        }
      }
      
      // Re-evaluar con la nueva escala
      evaluarFuerza(input, escala);
    }
  });
}

// Evaluar asimetrías bilaterales en fuerza
function evaluarAsimetriasFuerza() {
  const region = document.getElementById('fuerza_region').value;
  if (!region) return;
  
  const tabla = document.getElementById('tabla_fuerza_' + region);
  if (!tabla) return;
  
  // Buscar todas las parejas de inputs de fuerza y evaluar asimetrías
  const rows = tabla.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    const inputDer = row.querySelector('input[id$="_der"]');
    const inputIzq = row.querySelector('input[id$="_izq"]');
    
    if (inputDer && inputIzq) {
      const valDer = parseFloat(inputDer.value);
      const valIzq = parseFloat(inputIzq.value);
      
      if (!isNaN(valDer) && !isNaN(valIzq) && (valDer > 0 || valIzq > 0)) {
        // Calcular asimetría
        const mayor = Math.max(valDer, valIzq);
        const menor = Math.min(valDer, valIzq);
        const asimetria = mayor > 0 ? ((mayor - menor) / mayor) * 100 : 0;
        
        // Marcar input con menor valor
        if (asimetria > 15) {
          if (valDer < valIzq) {
            inputDer.style.backgroundColor = '#ffeeee';
          } else if (valIzq < valDer) {
            inputIzq.style.backgroundColor = '#ffeeee';
          }
        } else {
          inputDer.style.backgroundColor = '';
          inputIzq.style.backgroundColor = '';
        }
      }
    }
  });
}

// Evaluar dolor al realizar pruebas de fuerza
function evaluarDolorFuerza() {
  actualizarInterpretacionFuerza();
}

// Actualizar la interpretación clínica de la fuerza
function actualizarInterpretacionFuerza() {
  const region = document.getElementById('fuerza_region').value;
  if (!region) return;
  
  const tabla = document.getElementById('tabla_fuerza_' + region);
  if (!tabla) return;
  
  // Recopilar datos de fuerza y dolor
  const debilidades = [];
  const asimetrias = [];
  const dolores = [];
  
  const rows = tabla.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    const movimiento = row.querySelector('td:first-child').textContent;
    const inputDer = row.querySelector('input[id$="_der"]');
    const inputIzq = row.querySelector('input[id$="_izq"]');
    const selectDolor = row.querySelector('select[id$="_dolor"]');
    
    if (inputDer && inputIzq) {
      const valDer = parseFloat(inputDer.value);
      const valIzq = parseFloat(inputIzq.value);
      
      if (!isNaN(valDer) && !isNaN(valIzq)) {
        // Evaluar debilidad
        const escalaDaniels = inputDer.classList.contains('daniels');
        const umbralDebilidad = escalaDaniels ? 4 : 8;
        
        if (valDer < umbralDebilidad) {
          debilidades.push(`${movimiento} (derecha)`);
        }
        if (valIzq < umbralDebilidad) {
          debilidades.push(`${movimiento} (izquierda)`);
        }
        
        // Evaluar asimetría
        if (valDer > 0 || valIzq > 0) {
          const mayor = Math.max(valDer, valIzq);
          const menor = Math.min(valDer, valIzq);
          const asimetria = mayor > 0 ? ((mayor - menor) / mayor) * 100 : 0;
          
          if (asimetria > 15) {
            asimetrias.push({
              movimiento: movimiento,
              asimetria: asimetria.toFixed(1),
              lado: valDer < valIzq ? 'derecho' : 'izquierdo'
            });
          }
        }
      }
    }
    
    // Evaluar dolor
    if (selectDolor && selectDolor.value !== 'No') {
      dolores.push({
        movimiento: movimiento,
        momento: selectDolor.value
      });
    }
  });
  
  // Generar texto de interpretación
  let interpretacionTexto = '';
  let recomendacionesTexto = '';
  
  // Interpretación de debilidades
  if (debilidades.length > 0) {
    interpretacionTexto += '<p><strong>Debilidades identificadas:</strong></p><ul>';
    debilidades.forEach(debilidad => {
      interpretacionTexto += `<li>${debilidad}</li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p>Considerar fortalecimiento específico para: ' + debilidades.join(', ') + '.</p>';
  } else {
    interpretacionTexto += '<p><strong>Fuerza muscular:</strong> No se detectan debilidades significativas.</p>';
  }
  
  // Interpretación de asimetrías
  if (asimetrias.length > 0) {
    interpretacionTexto += '<p><strong>Asimetrías bilaterales:</strong></p><ul>';
    asimetrias.forEach(asimetria => {
      interpretacionTexto += `<li>${asimetria.movimiento}: ${asimetria.asimetria}% de déficit en lado ${asimetria.lado}</li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Abordar asimetrías:</strong> Priorizar el trabajo de equilibrio bilateral en los siguientes movimientos: ' + 
      asimetrias.map(a => a.movimiento).join(', ') + '.</p>';
  }
  
  // Interpretación de dolor
  if (dolores.length > 0) {
    interpretacionTexto += '<p><strong>Movimientos que generan dolor:</strong></p><ul>';
    dolores.forEach(dolor => {
      interpretacionTexto += `<li>${dolor.movimiento}: ${dolor.momento}</li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Considerar precauciones por dolor:</strong> Trabajar dentro de rangos no dolorosos o con cargas submáximas en: ' + 
      dolores.map(d => d.movimiento).join(', ') + '.</p>';
  }
  
  // Actualizar el DOM con la interpretación
  const interpretacionElemento = document.getElementById('interpretacion-fuerza-texto');
  const recomendacionesElemento = document.getElementById('recomendaciones-fuerza-texto');
  
  if (interpretacionElemento) {
    interpretacionElemento.innerHTML = interpretacionTexto || 'Complete la evaluación de fuerza muscular para obtener recomendaciones clínicas.';
  }
  
  if (recomendacionesElemento) {
    recomendacionesElemento.innerHTML = recomendacionesTexto || 'Complete la evaluación para obtener recomendaciones específicas.';
  }
  
  // Actualizar el badge del acordeón
  const badge = document.getElementById('fuerza-analitica-badge');
  if (badge) {
    if (debilidades.length > 0 || asimetrias.length > 0 || dolores.length > 0) {
      badge.textContent = 'Evaluada';
      badge.className = 'resultado-badge bg-success';
    } else if (tabla.querySelectorAll('input[type="number"]').length > 0) {
      badge.textContent = 'Completado';
      badge.className = 'resultado-badge bg-primary';
    } else {
      badge.textContent = 'No completado';
      badge.className = 'resultado-badge';
    }
  }
}

// Evaluación de Dinamometría
function evaluarDinamometria(tipo) {
  // Obtener valores según el tipo de dinamometría
  let der, izq, difElement, estadoElement;
  
  if (tipo === 'mano') {
    der = parseFloat(document.getElementById('dinamometria_mano_der').value);
    izq = parseFloat(document.getElementById('dinamometria_mano_izq').value);
    difElement = document.getElementById('dinamometria_mano_dif');
    estadoElement = document.getElementById('dinamometria_mano_estado');
  } else if (tipo === 'pinza') {
    der = parseFloat(document.getElementById('dinamometria_pinza_der').value);
    izq = parseFloat(document.getElementById('dinamometria_pinza_izq').value);
    difElement = document.getElementById('dinamometria_pinza_dif');
    estadoElement = document.getElementById('dinamometria_pinza_estado');
  } else {
    // Para dinamometrías personalizadas
    der = parseFloat(document.getElementById(`dinamometria_${tipo}_der`).value);
    izq = parseFloat(document.getElementById(`dinamometria_${tipo}_izq`).value);
    difElement = document.getElementById(`dinamometria_${tipo}_dif`);
    estadoElement = document.getElementById(`dinamometria_${tipo}_estado`);
  }
  
  // Si no hay valores, no continuar
  if (isNaN(der) || isNaN(izq)) {
    if (difElement) difElement.value = '';
    if (estadoElement) {
      estadoElement.textContent = 'Pendiente';
      estadoElement.className = 'alert alert-secondary';
    }
    return;
  }
  
  // Calcular diferencia porcentual
  const mayor = Math.max(der, izq);
  const menor = Math.min(der, izq);
  let diferencia = 0;
  
  if (mayor > 0) {
    diferencia = ((mayor - menor) / mayor) * 100;
    if (difElement) difElement.value = diferencia.toFixed(1) + '%';
  } else {
    if (difElement) difElement.value = '0%';
  }
  
  // Evaluar la fuerza según valores de referencia y asimetría
  if (estadoElement) {
    let estado, clase;
    
    // Evaluar según asimetría
    if (diferencia >= 15) {
      // Asimetría significativa
      estado = `Asimetría significativa (${diferencia.toFixed(1)}%)`;
      clase = 'alert alert-warning';
    } else {
      // Fuerza dentro de parámetros normales de simetría
      estado = 'Simetría bilateral adecuada';
      clase = 'alert alert-success';
    }
    
    // Establecer texto y clase
    estadoElement.textContent = estado;
    estadoElement.className = clase;
  }
  
  // Actualizar interpretación de dinamometría
  actualizarInterpretacionDinamometria();
}

// Agregar dinamometría personalizada
function agregarDinamometria() {
  const container = document.getElementById('otras_dinamometrias_container');
  const id = 'dinamometria_personalizada_' + Date.now();
  
  const html = `
    <div class="card mb-4" id="${id}_container">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>Dinamometría Personalizada</span>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarDinamometria('${id}_container')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="form-row mb-3">
          <div class="form-col form-col-md-12">
            <div class="form-group">
              <label for="${id}_nombre" class="form-label">Nombre/Descripción</label>
              <input type="text" id="${id}_nombre" name="${id}_nombre" class="form-control">
            </div>
          </div>
        </div>
        <div class="form-row mb-4">
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="${id}_der" class="form-label">Derecha (kg)</label>
              <input type="number" id="${id}_der" name="${id}_der" class="form-control" min="0" max="150" step="0.1" onchange="evaluarDinamometria('${id}')">
            </div>
          </div>
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="${id}_izq" class="form-label">Izquierda (kg)</label>
              <input type="number" id="${id}_izq" name="${id}_izq" class="form-control" min="0" max="150" step="0.1" onchange="evaluarDinamometria('${id}')">
            </div>
          </div>
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="${id}_dif" class="form-label">Diferencia (%)</label>
              <input type="text" id="${id}_dif" class="form-control" readonly>
            </div>
          </div>
          <div class="form-col form-col-md-3">
            <div class="form-group">
              <label for="${id}_estado" class="form-label">Estado</label>
              <div id="${id}_estado" class="alert alert-secondary">Pendiente</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col form-col-md-12">
            <div class="form-group">
              <label for="${id}_obs" class="form-label">Observaciones</label>
              <textarea id="${id}_obs" name="${id}_obs" class="form-control" rows="2"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', html);
  
  // Actualizar el badge
  const badge = document.getElementById('dinamometria-badge');
  if (badge) {
    badge.textContent = 'En progreso';
    badge.className = 'resultado-badge bg-warning';
  }
}

// Eliminar dinamometría personalizada
function eliminarDinamometria(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.remove();
  }
}

// Actualizar interpretación de dinamometría
function actualizarInterpretacionDinamometria() {
  const interpretacionElemento = document.getElementById('interpretacion-dinamometria-texto');
  const recomendacionesElemento = document.getElementById('recomendaciones-dinamometria-texto');
  
  if (!interpretacionElemento || !recomendacionesElemento) return;
  
  // Recopilar datos de todas las dinamometrías
  const asimetrias = [];
  const debilidades = [];
  
  // Evaluar dinamometría de mano
  const manoDer = parseFloat(document.getElementById('dinamometria_mano_der').value);
  const manoIzq = parseFloat(document.getElementById('dinamometria_mano_izq').value);
  
  if (!isNaN(manoDer) && !isNaN(manoIzq)) {
    // Evaluar asimetría
    const mayor = Math.max(manoDer, manoIzq);
    const menor = Math.min(manoDer, manoIzq);
    if (mayor > 0) {
      const diferenciaManoPct = ((mayor - menor) / mayor) * 100;
      if (diferenciaManoPct > 10) {
        asimetrias.push({
          tipo: 'Prensión manual',
          diferencia: diferenciaManoPct.toFixed(1),
          lado: manoDer < manoIzq ? 'derecho' : 'izquierdo'
        });
      }
    }
    
    // Evaluar debilidad (según valores normativos aproximados)
    const genero = document.querySelector('select[name="genero"]') ? document.querySelector('select[name="genero"]').value : '';
    const edad = document.getElementById('fechaNacimiento') ? calcularEdad(document.getElementById('fechaNacimiento').value) : 30;
    
    let valorNormativo = 0;
    if (genero === 'Masculino') {
      valorNormativo = edad < 30 ? 45 : (edad < 50 ? 40 : 35);
    } else if (genero === 'Femenino') {
      valorNormativo = edad < 30 ? 30 : (edad < 50 ? 25 : 20);
    } else {
      valorNormativo = edad < 30 ? 38 : (edad < 50 ? 33 : 28); // Promedio si no hay género especificado
    }
    
    if (manoDer < valorNormativo * 0.8) {
      debilidades.push({
        tipo: 'Prensión manual derecha',
        valor: manoDer,
        normativo: valorNormativo
      });
    }
    
    if (manoIzq < valorNormativo * 0.8) {
      debilidades.push({
        tipo: 'Prensión manual izquierda',
        valor: manoIzq,
        normativo: valorNormativo
      });
    }
  }
  
  // Generar texto de interpretación
  let interpretacionTexto = '';
  let recomendacionesTexto = '';
  
  if (asimetrias.length > 0 || debilidades.length > 0) {
    // Interpretación de asimetrías
    if (asimetrias.length > 0) {
      interpretacionTexto += '<p><strong>Asimetrías bilaterales:</strong></p><ul>';
      asimetrias.forEach(asimetria => {
        interpretacionTexto += `<li>${asimetria.tipo}: ${asimetria.diferencia}% de déficit en lado ${asimetria.lado}</li>`;
      });
      interpretacionTexto += '</ul>';
      
      recomendacionesTexto += '<p><strong>Abordar asimetrías:</strong> Priorizar el trabajo bilateral con énfasis en el lado más débil.</p>';
    }
    
    // Interpretación de debilidades
    if (debilidades.length > 0) {
      interpretacionTexto += '<p><strong>Valores por debajo de referencia normativa:</strong></p><ul>';
      debilidades.forEach(debilidad => {
        interpretacionTexto += `<li>${debilidad.tipo}: ${debilidad.valor} kg (valor de referencia: ≈${debilidad.normativo} kg)</li>`;
      });
      interpretacionTexto += '</ul>';
      
      recomendacionesTexto += '<p><strong>Recomendaciones para déficit de fuerza:</strong> Implementar programa progresivo de fortalecimiento para mejorar valores de dinamometría.</p>';
    }
  } else if (manoDer > 0 || manoIzq > 0) {
    interpretacionTexto = '<p>Los valores de dinamometría se encuentran dentro de rangos adecuados de simetría bilateral.</p>';
    recomendacionesTexto = '<p>Continuar con trabajo de mantenimiento de fuerza.</p>';
  } else {
    interpretacionTexto = 'Complete la evaluación con dinamometría para obtener recomendaciones clínicas.';
    recomendacionesTexto = 'Complete la evaluación para obtener recomendaciones específicas.';
  }
  
  // Actualizar el DOM con la interpretación
  interpretacionElemento.innerHTML = interpretacionTexto;
  recomendacionesElemento.innerHTML = recomendacionesTexto;
  
  // Actualizar el badge del acordeón
  const badge = document.getElementById('dinamometria-badge');
  if (badge) {
    if (manoDer > 0 || manoIzq > 0) {
      badge.textContent = 'Completado';
      badge.className = 'resultado-badge bg-success';
    } else {
      badge.textContent = 'No completado';
      badge.className = 'resultado-badge';
    }
  }
}

// Calcular edad a partir de fecha de nacimiento
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 30; // Valor por defecto
  
  const fechaNac = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  return edad;
}

// Calcular 1RM utilizando diferentes fórmulas
function calcular1RM() {
  const peso = parseFloat(document.getElementById('rm_peso').value);
  const repeticiones = parseInt(document.getElementById('rm_repeticiones').value);
  const formula = document.getElementById('rm_formula').value;
  
  if (!peso || !repeticiones || repeticiones < 1) {
    alert('Por favor, ingrese un peso y número de repeticiones válidos.');
    return;
  }
  
  let rm1 = 0;
  
  // Calcular 1RM según la fórmula seleccionada
  switch (formula) {
    case 'brzycki':
      rm1 = peso / (1.0278 - 0.0278 * repeticiones);
      break;
    case 'epley':
      rm1 = peso * (1 + 0.0333 * repeticiones);
      break;
    case 'lander':
      rm1 = (100 * peso) / (101.3 - 2.67123 * repeticiones);
      break;
    case 'lombardi':
      rm1 = peso * Math.pow(repeticiones, 0.1);
      break;
    case 'oconner':
      rm1 = peso * (1 + 0.025 * repeticiones);
      break;
    case 'wathen':
      rm1 = (100 * peso) / (48.8 + 53.8 * Math.exp(-0.075 * repeticiones));
      break;
    default:
      rm1 = peso * (1 + 0.0333 * repeticiones); // Epley por defecto
  }
  
  // Redondear a 1 decimal
  rm1 = Math.round(rm1 * 10) / 10;
  
  // Mostrar resultado
  document.getElementById('resultado_1rm_container').style.display = 'block';
  document.getElementById('valor_1rm').textContent = rm1.toFixed(1) + ' kg';
  
  // Generar tabla de cargas
  const porcentajes = [
    { porcentaje: 100, reps: '1', aplicacion: 'Fuerza máxima' },
    { porcentaje: 95, reps: '2', aplicacion: 'Fuerza máxima' },
    { porcentaje: 90, reps: '3-4', aplicacion: 'Fuerza máxima' },
    { porcentaje: 85, reps: '5-6', aplicacion: 'Fuerza/Potencia' },
    { porcentaje: 80, reps: '7-8', aplicacion: 'Fuerza/Hipertrofia' },
    { porcentaje: 75, reps: '8-10', aplicacion: 'Hipertrofia/Fuerza' },
    { porcentaje: 70, reps: '10-12', aplicacion: 'Hipertrofia' },
    { porcentaje: 65, reps: '12-15', aplicacion: 'Hipertrofia/Resistencia' },
    { porcentaje: 60, reps: '15-20', aplicacion: 'Resistencia muscular' },
    { porcentaje: 50, reps: '20-25', aplicacion: 'Resistencia muscular' },
    { porcentaje: 40, reps: '>25', aplicacion: 'Resistencia muscular/Activación' }
  ];
  
  const tablaCargas = document.getElementById('tabla_cargas');
  tablaCargas.innerHTML = '';
  
  porcentajes.forEach(fila => {
    const peso = (rm1 * fila.porcentaje / 100).toFixed(1);
    tablaCargas.innerHTML += `
      <tr>
        <td>${fila.porcentaje}%</td>
        <td>${peso} kg</td>
        <td>${fila.reps}</td>
        <td>${fila.aplicacion}</td>
      </tr>
    `;
  });
  
  // Actualizar el badge
  const badge = document.getElementById('rm-calculator-badge');
  if (badge) {
    badge.textContent = 'Calculado';
    badge.className = 'resultado-badge bg-success';
  }
}

// Guardar valoración de RM en historial
function guardarRM() {
  const ejercicio = document.getElementById('rm_ejercicio').value;
  const ejercicioOtro = document.getElementById('rm_ejercicio_otro').value;
  const peso = document.getElementById('rm_peso').value;
  const repeticiones = document.getElementById('rm_repeticiones').value;
  const valorRM = document.getElementById('valor_1rm').textContent;
  const formula = document.getElementById('rm_formula').value;
  
  if (!ejercicio || !peso || !repeticiones || !valorRM) {
    alert('Por favor, complete todos los campos y calcule el 1RM antes de guardar.');
    return;
  }
  
  const nombreEjercicio = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
  const fechaActual = new Date().toLocaleDateString();
  
  // Agregar entrada al historial
  const historialTabla = document.getElementById('historial_rm');
  historialTabla.innerHTML += `
    <tr>
      <td>${nombreEjercicio}</td>
      <td>${fechaActual}</td>
      <td>${peso}</td>
      <td>${repeticiones}</td>
      <td>${valorRM}</td>
      <td>${formula.charAt(0).toUpperCase() + formula.slice(1)}</td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('tr').remove()">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
  
  // Limpiar formulario
  if (ejercicio === 'Otro') {
    document.getElementById('rm_ejercicio_otro').value = '';
  }
  document.getElementById('rm_peso').value = '';
  document.getElementById('rm_repeticiones').value = '';
  document.getElementById('resultado_1rm_container').style.display = 'none';
}

// Mostrar campo para especificar otro ejercicio
document.addEventListener('DOMContentLoaded', function() {
  const ejercicioSelect = document.getElementById('rm_ejercicio');
  const ejercicioOtroInput = document.getElementById('rm_ejercicio_otro');
  
  if (ejercicioSelect && ejercicioOtroInput) {
    ejercicioSelect.addEventListener('change', function() {
      ejercicioOtroInput.style.display = this.value === 'Otro' ? 'block' : 'none';
    });
  }
});

// Evaluar test funcional
function evaluarTestFuncional(test) {
  let resultado = '';
  let clase = '';
  
  if (test === 'sit_to_stand') {
    const repeticiones = parseInt(document.getElementById('sit_to_stand_repeticiones').value);
    const edad = parseInt(document.getElementById('sit_to_stand_edad').value);
    const genero = document.getElementById('sit_to_stand_genero').value;
    
    if (!repeticiones || !edad || !genero) {
      return;
    }
    
    // Valores normativos aproximados por grupo de edad y género
    let valorNormativo = 0;
    
    if (genero === 'Masculino') {
      if (edad < 60) {
        valorNormativo = 14;
      } else if (edad < 70) {
        valorNormativo = 12;
      } else if (edad < 80) {
        valorNormativo = 11;
      } else {
        valorNormativo = 9;
      }
    } else { // Femenino
      if (edad < 60) {
        valorNormativo = 12;
      } else if (edad < 70) {
        valorNormativo = 11;
      } else if (edad < 80) {
        valorNormativo = 10;
      } else {
        valorNormativo = 8;
      }
    }
    
    // Evaluar resultado
    if (repeticiones >= valorNormativo * 1.2) {
      resultado = `Superior al promedio (${repeticiones}/${valorNormativo})`;
      clase = 'alert alert-success';
    } else if (repeticiones >= valorNormativo * 0.8) {
      resultado = `Dentro del promedio (${repeticiones}/${valorNormativo})`;
      clase = 'alert alert-info';
    } else {
      resultado = `Por debajo del promedio (${repeticiones}/${valorNormativo})`;
      clase = 'alert alert-warning';
    }
    
    // Actualizar elemento
    const resultadoElement = document.getElementById('sit_to_stand_resultado');
    if (resultadoElement) {
      resultadoElement.textContent = resultado;
      resultadoElement.className = clase;
    }
  } else if (test === 'push_up') {
    const repeticiones = parseInt(document.getElementById('push_up_repeticiones').value);
    const edad = parseInt(document.getElementById('push_up_edad').value);
    const genero = document.getElementById('push_up_genero').value;
    
    if (!repeticiones || !edad || !genero) {
      return;
    }
    
    // Valores normativos aproximados por grupo de edad y género
    let valorNormativo = 0;
    
    if (genero === 'Masculino') {
      if (edad < 30) {
        valorNormativo = 22;
      } else if (edad < 40) {
        valorNormativo = 17;
      } else if (edad < 50) {
        valorNormativo = 13;
      } else if (edad < 60) {
        valorNormativo = 10;
      } else {
        valorNormativo = 8;
      }
    } else { // Femenino
      if (edad < 30) {
        valorNormativo = 15;
      } else if (edad < 40) {
        valorNormativo = 13;
      } else if (edad < 50) {
        valorNormativo = 11;
      } else if (edad < 60) {
        valorNormativo = 7;
      } else {
        valorNormativo = 5;
      }
    }
    
    // Evaluar resultado
    if (repeticiones >= valorNormativo * 1.2) {
      resultado = `Superior al promedio (${repeticiones}/${valorNormativo})`;
      clase = 'alert alert-success';
    } else if (repeticiones >= valorNormativo * 0.8) {
      resultado = `Dentro del promedio (${repeticiones}/${valorNormativo})`;
      clase = 'alert alert-info';
    } else {
      resultado = `Por debajo del promedio (${repeticiones}/${valorNormativo})`;
      clase = 'alert alert-warning';
    }
    
    // Actualizar elemento
    const resultadoElement = document.getElementById('push_up_resultado');
    if (resultadoElement) {
      resultadoElement.textContent = resultado;
      resultadoElement.className = clase;
    }
  }
  
  // Actualizar interpretación de fuerza funcional
  actualizarInterpretacionFuerzaFuncional();
  
  // Actualizar el badge
  const badge = document.getElementById('fuerza-funcional-badge');
  if (badge) {
    badge.textContent = 'En progreso';
    badge.className = 'resultado-badge bg-info';
  }
}

// Agregar test funcional personalizado
function agregarTestFuncional() {
  const container = document.getElementById('otros_tests_funcionales_container');
  const id = 'test_funcional_' + Date.now();
  
  const html = `
    <div class="mb-4" id="${id}_container">
      <hr>
      <div class="form-row mb-3">
        <div class="form-col form-col-md-10">
          <h6>Test Funcional Personalizado</h6>
        </div>
        <div class="form-col form-col-md-2 text-right">
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarTestFuncional('${id}_container')">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
      
      <div class="form-row mb-3">
        <div class="form-col form-col-md-12">
          <div class="form-group">
            <label for="${id}_nombre" class="form-label">Nombre del test</label>
            <input type="text" id="${id}_nombre" name="${id}_nombre" class="form-control">
          </div>
        </div>
      </div>
      
      <div class="form-row mb-3">
        <div class="form-col form-col-md-6">
          <div class="form-group">
            <label for="${id}_descripcion" class="form-label">Descripción/Protocolo</label>
            <textarea id="${id}_descripcion" name="${id}_descripcion" class="form-control" rows="2"></textarea>
          </div>
        </div>
        <div class="form-col form-col-md-6">
          <div class="form-group">
            <label for="${id}_resultado" class="form-label">Resultado</label>
            <textarea id="${id}_resultado" name="${id}_resultado" class="form-control" rows="2"></textarea>
          </div>
        </div>
      </div>
      
      <div class="form-row mb-3">
        <div class="form-col form-col-md-12">
          <div class="form-group">
            <label for="${id}_interpretacion" class="form-label">Interpretación</label>
            <textarea id="${id}_interpretacion" name="${id}_interpretacion" class="form-control" rows="2"></textarea>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', html);
}

// Eliminar test funcional personalizado
function eliminarTestFuncional(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.remove();
  }
}

// Agregar tarea específica
function agregarTareaEspecifica() {
  const container = document.getElementById('tareas_especificas_container');
  const id = 'tarea_especifica_' + Date.now();
  
  const html = `
    <div class="card mb-3" id="${id}_container">
      <div class="card-header d-flex justify-content-between align-items-center">
        <input type="text" id="${id}_nombre" name="${id}_nombre" class="form-control" placeholder="Nombre de la tarea">
        <button type="button" class="btn btn-sm btn-outline-danger ml-2" onclick="eliminarTareaEspecifica('${id}_container')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="form-row mb-3">
          <div class="form-col form-col-md-12">
            <div class="form-group">
              <label for="${id}_descripcion" class="form-label">Descripción de la tarea</label>
              <textarea id="${id}_descripcion" name="${id}_descripcion" class="form-control" rows="2" placeholder="Describa la tarea y su relevancia para el paciente..."></textarea>
            </div>
          </div>
        </div>
        
        <div class="form-row mb-3">
          <div class="form-col form-col-md-4">
            <div class="form-group">
              <label for="${id}_capacidad" class="form-label">Capacidad de ejecución</label>
              <select id="${id}_capacidad" name="${id}_capacidad" class="form-select">
                <option value="">Seleccionar</option>
                <option value="No puede realizar">No puede realizar</option>
                <option value="Realiza con mucha dificultad">Realiza con mucha dificultad</option>
                <option value="Realiza con dificultad moderada">Realiza con dificultad moderada</option>
                <option value="Realiza con ligera dificultad">Realiza con ligera dificultad</option>
                <option value="Realiza sin dificultad">Realiza sin dificultad</option>
              </select>
            </div>
          </div>
          <div class="form-col form-col-md-4">
            <div class="form-group">
              <label for="${id}_dolor" class="form-label">Dolor durante la ejecución</label>
              <select id="${id}_dolor" name="${id}_dolor" class="form-select">
                <option value="">Seleccionar</option>
                <option value="Sin dolor">Sin dolor</option>
                <option value="Dolor leve">Dolor leve</option>
                <option value="Dolor moderado">Dolor moderado</option>
                <option value="Dolor intenso">Dolor intenso</option>
              </select>
            </div>
          </div>
          <div class="form-col form-col-md-4">
            <div class="form-group">
              <label for="${id}_calidad" class="form-label">Calidad del movimiento</label>
              <select id="${id}_calidad" name="${id}_calidad" class="form-select">
                <option value="">Seleccionar</option>
                <option value="Óptima">Óptima</option>
                <option value="Buena">Buena</option>
                <option value="Regular">Regular</option>
                <option value="Deficiente">Deficiente</option>
                <option value="Muy deficiente">Muy deficiente</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-col form-col-md-12">
            <div class="form-group">
              <label for="${id}_observaciones" class="form-label">Observaciones</label>
              <textarea id="${id}_observaciones" name="${id}_observaciones" class="form-control" rows="2" placeholder="Compensaciones, limitaciones, factores contextuales..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', html);
  
  // Actualizar el badge
  const badge = document.getElementById('fuerza-funcional-badge');
  if (badge) {
    badge.textContent = 'En progreso';
    badge.className = 'resultado-badge bg-warning';
  }
}

// Eliminar tarea específica
function eliminarTareaEspecifica(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.remove();
  }
}

// Actualizar interpretación de fuerza funcional
function actualizarInterpretacionFuerzaFuncional() {
  const interpretacionElemento = document.getElementById('interpretacion-fuerza-funcional-texto');
  const recomendacionesElemento = document.getElementById('recomendaciones-fuerza-funcional-texto');
  
  if (!interpretacionElemento || !recomendacionesElemento) return;
  
  // Recopilar datos de tests funcionales
  const hallazgos = [];
  
  // Evaluar Sit-to-Stand
  const stsResultado = document.getElementById('sit_to_stand_resultado');
  if (stsResultado && stsResultado.textContent !== 'Pendiente') {
    hallazgos.push({
      test: '30-second Sit-to-Stand',
      resultado: stsResultado.textContent,
      clase: stsResultado.className
    });
  }
  
  // Evaluar Push-up
  const pushupResultado = document.getElementById('push_up_resultado');
  if (pushupResultado && pushupResultado.textContent !== 'Pendiente') {
    hallazgos.push({
      test: 'Push-up Test',
      resultado: pushupResultado.textContent,
      clase: pushupResultado.className
    });
  }
  
  // Generar texto de interpretación
  let interpretacionTexto = '';
  let recomendacionesTexto = '';
  
  if (hallazgos.length > 0) {
    interpretacionTexto += '<p><strong>Hallazgos en tests funcionales:</strong></p><ul>';
    
    hallazgos.forEach(hallazgo => {
      interpretacionTexto += `<li>${hallazgo.test}: ${hallazgo.resultado}</li>`;
      
      // Generar recomendaciones basadas en resultados
      if (hallazgo.clase.includes('alert-warning') || hallazgo.clase.includes('alert-danger')) {
        if (hallazgo.test === '30-second Sit-to-Stand') {
          recomendacionesTexto += '<p>Considerar entrenamiento específico de fuerza-resistencia de miembros inferiores.</p>';
        } else if (hallazgo.test === 'Push-up Test') {
          recomendacionesTexto += '<p>Implementar programa progresivo de fortalecimiento de miembros superiores y core.</p>';
        }
      }
    });
    
    interpretacionTexto += '</ul>';
    
    // Evaluar tareas específicas
    const tareasContainer = document.getElementById('tareas_especificas_container');
    if (tareasContainer) {
      const tareasCards = tareasContainer.querySelectorAll('.card');
      
      if (tareasCards.length > 0) {
        interpretacionTexto += '<p><strong>Desempeño en tareas específicas:</strong></p><ul>';
        
        tareasCards.forEach(card => {
          const nombre = card.querySelector('input[id$="_nombre"]').value || 'Tarea no especificada';
          const capacidad = card.querySelector('select[id$="_capacidad"]').value;
          const dolor = card.querySelector('select[id$="_dolor"]').value;
          
          if (capacidad || dolor) {
            interpretacionTexto += `<li>${nombre}: ${capacidad}${dolor ? ', ' + dolor : ''}</li>`;
            
            // Generar recomendaciones basadas en limitaciones
            if ((capacidad && (capacidad.includes('dificultad') || capacidad.includes('No puede'))) || 
                (dolor && dolor !== 'Sin dolor')) {
              recomendacionesTexto += `<p>Para la tarea "${nombre}": Descomponer en componentes más simples e incorporar progresivamente en el entrenamiento funcional.</p>`;
            }
          }
        });
        
        interpretacionTexto += '</ul>';
      }
    }
    
    // Recomendaciones generales si no hay específicas
    if (!recomendacionesTexto) {
      recomendacionesTexto = '<p>Mantener el enfoque funcional actual. Considerar progresión con tareas más complejas o específicas según evolución.</p>';
    }
  } else {
    interpretacionTexto = 'Complete la evaluación de fuerza funcional para obtener recomendaciones clínicas.';
    recomendacionesTexto = 'Complete la evaluación para obtener recomendaciones específicas.';
  }
  
  // Actualizar el DOM con la interpretación
  interpretacionElemento.innerHTML = interpretacionTexto;
  recomendacionesElemento.innerHTML = recomendacionesTexto;
  
  // Actualizar el badge del acordeón
  const badge = document.getElementById('fuerza-funcional-badge');
  if (badge && hallazgos.length > 0) {
    badge.textContent = 'Completado';
    badge.className = 'resultado-badge bg-success';
  }
}

// Inicializar listeners después de que carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Seleccionadores de escala
  document.querySelectorAll('.escala-selector').forEach(selector => {
    selector.addEventListener('change', function() {
      const baseId = this.closest('tr').querySelector('input[id$="_der"]').id.replace('_der', '');
      actualizarEscala(this, baseId);
    });
  });
  
  // Inputs de fuerza
  document.querySelectorAll('.fuerza-input').forEach(input => {
    input.addEventListener('change', function() {
      const escala = this.classList.contains('daniels') ? 'daniels' : 'oxford';
      evaluarFuerza(this, escala);
    });
  });
  
  // Eventos para RM
  const rmEjercicio = document.getElementById('rm_ejercicio');
  if (rmEjercicio) {
    rmEjercicio.addEventListener('change', function() {
      const rmEjercicioOtro = document.getElementById('rm_ejercicio_otro');
      if (rmEjercicioOtro) {
        rmEjercicioOtro.style.display = this.value === 'Otro' ? 'block' : 'none';
      }
    });
  }
  
  console.log('Módulo de fuerza muscular inicializado correctamente.');
});
