/**
 * fuerza-muscular.js
 * Funcionalidades para la evaluación de fuerza muscular
 */

// Objeto con información de patrones musculares para interpretación clínica
const patronesMusculares = {
  hombro: {
    manguito: {
      patron: ['hombro_abduccion', 'hombro_rotext'],
      descripcion: 'Patrón compatible con déficit de manguito rotador',
      recomendacion: 'Considerar evaluación específica de integridad del manguito rotador'
    },
    inestabilidadAnterior: {
      patron: ['hombro_rotext', 'hombro_abduccion'],
      descripcion: 'Patrón compatible con inestabilidad glenohumeral anterior',
      recomendacion: 'Evaluar estabilidad anterior de hombro y considerar fortalecimiento selectivo'
    },
    disquinesia: {
      patron: ['hombro_retesc', 'hombro_elevesc'],
      descripcion: 'Posible disquinesia escapular',
      recomendacion: 'Evaluar control motor escapular en movimientos funcionales'
    }
  },
  cuello: {
    superior: {
      patron: ['cuello_flexion', 'cuello_extension'],
      descripcion: 'Patrón de debilidad en flexores profundos del cuello',
      recomendacion: 'Considerar evaluación de control motor cervical y postura cráneo-cervical'
    }
  },
  cadera: {
    gluteo: {
      patron: ['cadera_extension', 'cadera_abduccion', 'cadera_rotext'],
      descripcion: 'Patrón compatible con déficit de glúteo medio y/o mayor',
      recomendacion: 'Evaluar control motor de cadera en cadena cinética cerrada'
    }
  },
  rodilla: {
    cuadriceps: {
      patron: ['rodilla_extension'],
      descripcion: 'Déficit de fuerza en cuádriceps',
      recomendacion: 'Considerar evaluación de control neuromuscular en gestos funcionales'
    },
    isquiotibiales: {
      patron: ['rodilla_flexion'],
      descripcion: 'Déficit de fuerza en isquiotibiales',
      recomendacion: 'Evaluar relación agonista-antagonista con cuádriceps'
    }
  }
};

// Valores normales esperados para comparación en Escala Daniels
const valoresReferencia = {
  daniels: 5,
  oxford: 10
};

// Función para mostrar la tabla de fuerza según la región seleccionada
function toggleRegionFuerza(regionId) {
  // Ocultar todos los paneles de región
  document.querySelectorAll('.accordion-collapse').forEach(panel => {
    panel.classList.remove('show');
  });
  
  // Mostrar el panel seleccionado
  const panelSeleccionado = document.getElementById(regionId);
  if (panelSeleccionado) {
    panelSeleccionado.classList.add('show');
  }
}

// Función para evaluar fuerza según la escala seleccionada
function evaluarFuerza(input, escala) {
  const valor = parseFloat(input.value);
  const id = input.id;
  const estadoId = id + '_estado';
  const diferentialId = id.replace('_der', '_dif').replace('_izq', '_dif');
  const estado = document.getElementById(estadoId);
  
  if (!estado) return;
  
  if (isNaN(valor)) {
    estado.textContent = '';
    estado.className = '';
    return;
  }
  
  // Determinar el estado según la escala
  let texto = '';
  let clase = '';
  
  if (escala === 'daniels') {
    // Escala Daniels (0-5)
    if (valor <= 1) {
      texto = 'Déficit severo';
      clase = 'badge bg-danger text-white';
    } else if (valor <= 2) {
      texto = 'Déficit moderado';
      clase = 'badge bg-warning text-dark';
    } else if (valor <= 3) {
      texto = 'Déficit leve';
      clase = 'badge bg-warning text-dark';
    } else if (valor <= 4) {
      texto = 'Déficit mínimo';
      clase = 'badge bg-info text-white';
    } else {
      texto = 'Normal';
      clase = 'badge bg-success text-white';
    }
  } else if (escala === 'oxford') {
    // Escala Oxford (0-10)
    if (valor <= 2) {
      texto = 'Déficit severo';
      clase = 'badge bg-danger text-white';
    } else if (valor <= 5) {
      texto = 'Déficit moderado';
      clase = 'badge bg-warning text-dark';
    } else if (valor <= 7) {
      texto = 'Déficit leve';
      clase = 'badge bg-info text-white';
    } else if (valor <= 9) {
      texto = 'Déficit mínimo';
      clase = 'badge bg-info text-white';
    } else {
      texto = 'Normal';
      clase = 'badge bg-success text-white';
    }
  }
  
  // Actualizar estado
  estado.textContent = texto;
  estado.className = clase;
  
  // Calcular y mostrar diferencial bilateral
  calcularDiferencial(id);
  
  // Evaluar patrones
  const region = id.split('_')[0]; // Ej: "hombro", "cuello", etc.
  evaluarPatronesPorRegion(region);
  
  // Actualizar dashboard
  actualizarDashboard(region);
  
  // Actualizar interpretación global
  actualizarInterpretacionGlobal();
}

// Calcular y mostrar diferencial bilateral
function calcularDiferencial(inputId) {
  // Extraer el identificador base (sin _der o _izq)
  const baseId = inputId.replace('_der', '').replace('_izq', '');
  
  // Obtener los valores
  const derInput = document.getElementById(baseId + '_der');
  const izqInput = document.getElementById(baseId + '_izq');
  const difElement = document.getElementById(baseId + '_dif');
  
  if (!derInput || !izqInput || !difElement) return;
  
  const derValor = parseFloat(derInput.value);
  const izqValor = parseFloat(izqInput.value);
  
  // Verificar si ambos valores son válidos
  if (!isNaN(derValor) && !isNaN(izqValor) && (derValor > 0 || izqValor > 0)) {
    // Calcular diferencial
    const mayor = Math.max(derValor, izqValor);
    const menor = Math.min(derValor, izqValor);
    const diferencial = mayor > 0 ? ((mayor - menor) / mayor) * 100 : 0;
    
    // Mostrar resultado
    difElement.textContent = diferencial.toFixed(1) + '%';
    
    // Aplicar estilo según magnitud
    if (diferencial > 15) {
      difElement.className = 'badge bg-danger text-white';
    } else if (diferencial > 10) {
      difElement.className = 'badge bg-warning text-dark';
    } else {
      difElement.className = 'badge bg-success text-white';
    }
    
    // Resaltar el lado más débil
    if (diferencial > 10) {
      if (derValor < izqValor) {
        derInput.classList.add('input-deficit');
        izqInput.classList.remove('input-deficit');
      } else {
        izqInput.classList.add('input-deficit');
        derInput.classList.remove('input-deficit');
      }
    } else {
      derInput.classList.remove('input-deficit');
      izqInput.classList.remove('input-deficit');
    }
  } else {
    // Limpiar si faltan datos
    difElement.textContent = '';
    difElement.className = '';
    derInput.classList.remove('input-deficit');
    izqInput.classList.remove('input-deficit');
  }
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

// Evaluar dolor al realizar pruebas de fuerza
function evaluarDolorFuerza() {
  // Esta función se llamará cuando se cambie cualquier selector de dolor
  // Actualiza la interpretación global porque el dolor puede afectar la interpretación
  actualizarInterpretacionGlobal();
}

// Evaluar patrones de debilidad por región
function evaluarPatronesPorRegion(region) {
  // Verifica si hay patrones definidos para la región
  if (!patronesMusculares[region]) return;
  
  const patrones = patronesMusculares[region];
  const patronesDetectados = [];
  
  // Evaluar cada patrón posible para la región
  Object.keys(patrones).forEach(patronKey => {
    const patron = patrones[patronKey];
    let coincidencia = true;
    let valoresTotales = 0;
    let valoresBajos = 0;
    
    // Comprobar todos los movimientos del patrón
    patron.patron.forEach(movId => {
      const derInput = document.getElementById(movId + '_der');
      const izqInput = document.getElementById(movId + '_izq');
      
      if (derInput && izqInput) {
        const derValor = parseFloat(derInput.value);
        const izqValor = parseFloat(izqInput.value);
        
        // Contar si hay valores y si están bajos
        if (!isNaN(derValor)) {
          valoresTotales++;
          const escala = derInput.classList.contains('daniels') ? 'daniels' : 'oxford';
          const umbral = escala === 'daniels' ? 4 : 8;
          if (derValor < umbral) valoresBajos++;
        }
        
        if (!isNaN(izqValor)) {
          valoresTotales++;
          const escala = izqInput.classList.contains('daniels') ? 'daniels' : 'oxford';
          const umbral = escala === 'daniels' ? 4 : 8;
          if (izqValor < umbral) valoresBajos++;
        }
      }
    });
    
    // Determinar si hay coincidencia (más del 50% de los valores están bajos)
    if (valoresTotales > 0 && (valoresBajos / valoresTotales) > 0.5) {
      patronesDetectados.push({
        nombre: patronKey,
        descripcion: patron.descripcion,
        recomendacion: patron.recomendacion
      });
    }
  });
  
  // Actualizar la interpretación regional
  const interpretacionElement = document.getElementById('interpretacion-' + region);
  if (interpretacionElement && patronesDetectados.length > 0) {
    let html = '<div class="alert alert-warning">';
    html += '<strong>Patrones detectados:</strong><ul>';
    
    patronesDetectados.forEach(patron => {
      html += `<li><strong>${patron.descripcion}</strong>: ${patron.recomendacion}</li>`;
    });
    
    html += '</ul></div>';
    interpretacionElement.innerHTML = html;
  } else if (interpretacionElement) {
    interpretacionElement.innerHTML = '<div class="alert alert-success">No se detectan patrones de déficit muscular significativos en esta región.</div>';
  }
  
  // Actualizar el badge de la región
  actualizarBadgeRegion(region, patronesDetectados.length > 0);
}

// Actualizar el badge de una región
function actualizarBadgeRegion(region, hayDeficit) {
  const badge = document.getElementById(region + '-badge');
  if (!badge) return;
  
  // Comprobar si hay al menos un valor registrado
  const inputs = document.querySelectorAll(`input[id^="${region}_"][type="number"]`);
  let hayValores = false;
  
  inputs.forEach(input => {
    if (!isNaN(parseFloat(input.value))) {
      hayValores = true;
    }
  });
  
  if (!hayValores) {
    badge.textContent = 'No evaluado';
    badge.className = 'ms-auto badge rounded-pill bg-secondary';
    return;
  }
  
  // Comprobar si hay valores pero evaluación incompleta
  let totalInputs = inputs.length;
  let inputsCompletados = 0;
  
  inputs.forEach(input => {
    if (!isNaN(parseFloat(input.value))) {
      inputsCompletados++;
    }
  });
  
  if (inputsCompletados < totalInputs / 2) {
    badge.textContent = 'Incompleto';
    badge.className = 'ms-auto badge rounded-pill bg-warning text-dark';
    return;
  }
  
  // Comprobar si hay déficit
  if (hayDeficit) {
    badge.textContent = 'Déficit detectado';
    badge.className = 'ms-auto badge rounded-pill bg-danger text-white';
  } else {
    badge.textContent = 'Normal';
    badge.className = 'ms-auto badge rounded-pill bg-success text-white';
  }
}

// Actualizar dashboard de una región
function actualizarDashboard(region) {
  const canvas = document.getElementById('grafico-' + region);
  if (!canvas) return;
  
  // Recopilar datos para el gráfico
  const datos = {
    movimientos: [],
    derecha: [],
    izquierda: []
  };
  
  // Buscar todos los inputs de esta región
  const rows = document.querySelectorAll(`input[id^="${region}_"][id$="_der"]`);
  
  rows.forEach(inputDer => {
    const baseId = inputDer.id.replace('_der', '');
    const inputIzq = document.getElementById(baseId + '_izq');
    
    if (inputDer && inputIzq) {
      const movimiento = baseId.replace(region + '_', '');
      const valDer = parseFloat(inputDer.value);
      const valIzq = parseFloat(inputIzq.value);
      
      if (!isNaN(valDer) || !isNaN(valIzq)) {
        datos.movimientos.push(movimiento.charAt(0).toUpperCase() + movimiento.slice(1));
        datos.derecha.push(isNaN(valDer) ? 0 : valDer);
        datos.izquierda.push(isNaN(valIzq) ? 0 : valIzq);
      }
    }
  });
  
  // Si hay datos, crear el gráfico
  if (datos.movimientos.length > 0) {
    crearGrafico(canvas, datos);
  }
}

// Crear gráfico comparativo
function crearGrafico(canvas, datos) {
  // Verificar si ya existe un gráfico para este canvas
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  // Determinar la escala (mirando el primer input de la región)
  const primerInputId = canvas.id.replace('grafico-', '') + '_' + datos.movimientos[0].toLowerCase() + '_der';
  const primerInput = document.getElementById(primerInputId);
  
  let escala = 'daniels';
  let maxValue = 5;
  
  if (primerInput && primerInput.classList.contains('oxford')) {
    escala = 'oxford';
    maxValue = 10;
  }
  
  // Crear gráfico
  const ctx = canvas.getContext('2d');
  canvas.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.movimientos,
      datasets: [{
        label: 'Derecha',
        data: datos.derecha,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }, {
        label: 'Izquierda',
        data: datos.izquierda,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: maxValue,
          title: {
            display: true,
            text: escala === 'daniels' ? 'Escala Daniels (0-5)' : 'Escala Oxford (0-10)'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Comparativa Bilateral'
        }
      }
    }
  });
}

// Actualizar interpretación global
function actualizarInterpretacionGlobal() {
  const interpretacionElemento = document.getElementById('interpretacion-fuerza-texto');
  const recomendacionesElemento = document.getElementById('recomendaciones-fuerza-texto');
  
  if (!interpretacionElemento || !recomendacionesElemento) return;
  
  // Recopilar datos de fuerza y dolor
  const debilidades = [];
  const asimetrias = [];
  const dolores = [];
  const patrones = [];
  
  // Comprobar si hay al menos una evaluación realizada
  const inputs = document.querySelectorAll('.fuerza-input');
  let hayEvaluacion = false;
  
  inputs.forEach(input => {
    if (!isNaN(parseFloat(input.value))) {
      hayEvaluacion = true;
    }
  });
  
  if (!hayEvaluacion) {
    interpretacionElemento.innerHTML = 'Complete la evaluación de fuerza muscular para obtener recomendaciones clínicas.';
    recomendacionesElemento.innerHTML = 'Complete la evaluación para obtener recomendaciones específicas.';
    return;
  }
  
  // Buscar debilidades y asimetrías
  inputs.forEach(input => {
    if (isNaN(parseFloat(input.value))) return;
    
    const id = input.id;
    const partes = id.split('_');
    const region = partes[0];
    const movimiento = partes[1];
    const lado = partes[2];
    
    // Traducir los nombres para mejor legibilidad
    const regionesNombres = {
      'cuello': 'Cuello',
      'hombro': 'Hombro',
      'codo': 'Codo y antebrazo',
      'muneca': 'Muñeca y mano',
      'tronco': 'Tronco/Core',
      'cadera': 'Cadera',
      'rodilla': 'Rodilla',
      'tobillo': 'Tobillo y pie'
    };
    
    const movimientosNombres = {
      'flexion': 'flexión',
      'extension': 'extensión',
      'abduccion': 'abducción',
      'aduccion': 'aducción',
      'rotint': 'rotación interna',
      'rotext': 'rotación externa',
      'elevesc': 'elevación escapular',
      'retesc': 'retracción escapular',
      'pronacion': 'pronación',
      'supinacion': 'supinación',
      'inclinacion': 'inclinación lateral',
      'rotacion': 'rotación'
    };
    
    const ladosNombres = {
      'der': 'derecho',
      'izq': 'izquierdo'
    };
    
    // Verificar debilidad
    const valor = parseFloat(input.value);
    const escala = input.classList.contains('daniels') ? 'daniels' : 'oxford';
    const umbralDebilidad = escala === 'daniels' ? 4 : 8;
    
    if (valor < umbralDebilidad) {
      const regionNombre = regionesNombres[region] || region;
      const movimientoNombre = movimientosNombres[movimiento] || movimiento;
      const ladoNombre = ladosNombres[lado] || lado;
      
      debilidades.push({
        texto: `${regionNombre} (${movimientoNombre}) ${ladoNombre}`,
        valor: valor,
        escala: escala,
        region: region
      });
    }
    
    // Verificar asimetría
    const baseId = id.replace('_' + lado, '');
    const idOpuesto = baseId + (lado === 'der' ? '_izq' : '_der');
    const inputOpuesto = document.getElementById(idOpuesto);
    
    if (inputOpuesto) {
      const valorOpuesto = parseFloat(inputOpuesto.value);
      
      if (!isNaN(valorOpuesto)) {
        const mayor = Math.max(valor, valorOpuesto);
        const menor = Math.min(valor, valorOpuesto);
        const diferencia = mayor > 0 ? ((mayor - menor) / mayor) * 100 : 0;
        
        if (diferencia > 15) {
          const regionNombre = regionesNombres[region] || region;
          const movimientoNombre = movimientosNombres[movimiento] || movimiento;
          const ladoDebil = valor < valorOpuesto ? ladosNombres[lado] : ladosNombres[lado === 'der' ? 'izq' : 'der'];
          
          asimetrias.push({
            texto: `${regionNombre} (${movimientoNombre})`,
            diferencia: diferencia.toFixed(1),
            ladoDebil: ladoDebil,
            region: region
          });
        }
      }
    }
  });
  
  // Buscar dolores
  const selectoresDolor = document.querySelectorAll('select[id$="_dolor"]');
  
  selectoresDolor.forEach(select => {
    if (select.value !== 'No') {
      const id = select.id.replace('_dolor', '');
      const partes = id.split('_');
      const region = partes[0];
      const movimiento = partes[1];
      
      const regionesNombres = {
        'cuello': 'Cuello',
        'hombro': 'Hombro',
        'codo': 'Codo y antebrazo',
        'muneca': 'Muñeca y mano',
        'tronco': 'Tronco/Core',
        'cadera': 'Cadera',
        'rodilla': 'Rodilla',
        'tobillo': 'Tobillo y pie'
      };
      
      const movimientosNombres = {
        'flexion': 'flexión',
        'extension': 'extensión',
        'abduccion': 'abducción',
        'aduccion': 'aducción',
        'rotint': 'rotación interna',
        'rotext': 'rotación externa',
        'elevesc': 'elevación escapular',
        'retesc': 'retracción escapular',
        'pronacion': 'pronación',
        'supinacion': 'supinación',
        'inclinacion': 'inclinación lateral',
        'rotacion': 'rotación'
      };
      
      const regionNombre = regionesNombres[region] || region;
      const movimientoNombre = movimientosNombres[movimiento] || movimiento;
      
      dolores.push({
        texto: `${regionNombre} (${movimientoNombre})`,
        momento: select.value,
        region: region
      });
    }
  });
  
  // Buscar patrones detectados
  Object.keys(patronesMusculares).forEach(region => {
    const patronesRegion = patronesMusculares[region];
    
    Object.keys(patronesRegion).forEach(patronKey => {
      const patron = patronesRegion[patronKey];
      let coincidencia = true;
      let valoresTotales = 0;
      let valoresBajos = 0;
      
      // Comprobar todos los movimientos del patrón
      patron.patron.forEach(movId => {
        const derInput = document.getElementById(movId + '_der');
        const izqInput = document.getElementById(movId + '_izq');
        
        if (derInput && izqInput) {
          const derValor = parseFloat(derInput.value);
          const izqValor = parseFloat(izqInput.value);
          
          // Contar si hay valores y si están bajos
          if (!isNaN(derValor)) {
            valoresTotales++;
            const escala = derInput.classList.contains('daniels') ? 'daniels' : 'oxford';
            const umbral = escala === 'daniels' ? 4 : 8;
            if (derValor < umbral) valoresBajos++;
          }
          
          if (!isNaN(izqValor)) {
            valoresTotales++;
            const escala = izqInput.classList.contains('daniels') ? 'daniels' : 'oxford';
            const umbral = escala === 'daniels' ? 4 : 8;
            if (izqValor < umbral) valoresBajos++;
          }
        }
      });
      
      // Determinar si hay coincidencia (más del 50% de los valores están bajos)
      if (valoresTotales > 0 && (valoresBajos / valoresTotales) > 0.5) {
        patrones.push({
          nombre: patronKey,
          descripcion: patron.descripcion,
          recomendacion: patron.recomendacion,
          region: region
        });
      }
    });
  });
  
  // Generar texto de interpretación
  let interpretacionTexto = '';
  let recomendacionesTexto = '';
  
  // Interpretación de debilidades
  if (debilidades.length > 0) {
    interpretacionTexto += '<p><strong>Debilidades identificadas:</strong></p><ul>';
    
    // Agrupar por región
    const regionesDebilidad = {};
    debilidades.forEach(debilidad => {
      if (!regionesDebilidad[debilidad.region]) {
        regionesDebilidad[debilidad.region] = [];
      }
      regionesDebilidad[debilidad.region].push(debilidad);
    });
    
    Object.keys(regionesDebilidad).forEach(region => {
      const debilidadesRegion = regionesDebilidad[region];
      const regionNombre = {
        'cuello': 'Cuello',
        'hombro': 'Hombro',
        'codo': 'Codo y antebrazo',
        'muneca': 'Muñeca y mano',
        'tronco': 'Tronco/Core',
        'cadera': 'Cadera',
        'rodilla': 'Rodilla',
        'tobillo': 'Tobillo y pie'
      }[region] || region;
      
      interpretacionTexto += `<li><strong>${regionNombre}:</strong> `;
      interpretacionTexto += debilidadesRegion.map(d => d.texto).join(', ');
      interpretacionTexto += '</li>';
    });
    
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Recomendaciones por debilidad:</strong></p><ul>';
    Object.keys(regionesDebilidad).forEach(region => {
      const regionNombre = {
        'cuello': 'Cuello',
        'hombro': 'Hombro',
        'codo': 'Codo y antebrazo',
        'muneca': 'Muñeca y mano',
        'tronco': 'Tronco/Core',
        'cadera': 'Cadera',
        'rodilla': 'Rodilla',
        'tobillo': 'Tobillo y pie'
      }[region] || region;
      
      recomendacionesTexto += `<li><strong>${regionNombre}:</strong> Considerar programa de fortalecimiento progresivo específico.</li>`;
    });
    recomendacionesTexto += '</ul>';
  } else {
    interpretacionTexto += '<p><strong>Fuerza muscular:</strong> No se detectan debilidades significativas.</p>';
  }
  
  // Interpretación de asimetrías
  if (asimetrias.length > 0) {
    interpretacionTexto += '<p><strong>Asimetrías bilaterales significativas:</strong></p><ul>';
    asimetrias.forEach(asimetria => {
      interpretacionTexto += `<li>${asimetria.texto}: ${asimetria.diferencia}% de déficit en lado ${asimetria.ladoDebil}</li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Abordaje de asimetrías:</strong> Trabajar en la corrección de desequilibrios bilaterales, enfatizando el lado más débil.</p>';
  }
  
  // Interpretación de dolor
  if (dolores.length > 0) {
    interpretacionTexto += '<p><strong>Dolor durante el test:</strong></p><ul>';
    dolores.forEach(dolor => {
      interpretacionTexto += `<li>${dolor.texto}: ${dolor.momento}</li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Consideraciones por dolor:</strong> Trabajar inicialmente con cargas submáximas y rangos no dolorosos. Considerar abordaje complementario del dolor.</p>';
  }
  
  // Interpretación de patrones
  if (patrones.length > 0) {
    interpretacionTexto += '<p><strong>Patrones clínicos identificados:</strong></p><ul>';
    patrones.forEach(patron => {
      interpretacionTexto += `<li><strong>${patron.descripcion}</strong></li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Recomendaciones específicas por patrón:</strong></p><ul>';
    patrones.forEach(patron => {
      recomendacionesTexto += `<li>${patron.recomendacion}</li>`;
    });
    recomendacionesTexto += '</ul>';
  }
  
  // Si no hay nada específico, dar recomendaciones generales
  if (recomendacionesTexto === '') {
    recomendacionesTexto = '<p>Mantener el programa de fortalecimiento general y considerar progresión en intensidad según objetivos funcionales.</p>';
  }
  
  // Actualizar el DOM con la interpretación
  interpretacionElemento.innerHTML = interpretacionTexto || 'Complete la evaluación de fuerza muscular para obtener recomendaciones clínicas.';
  recomendacionesElemento.innerHTML = recomendacionesTexto || 'Complete la evaluación para obtener recomendaciones específicas.';
  
  // Actualizar el badge global
  const badge = document.getElementById('fuerza-analitica-badge');
  if (badge) {
    if (debilidades.length > 0 || asimetrias.length > 0 || patrones.length > 0) {
      badge.textContent = 'Déficit detectado';
      badge.className = 'resultado-badge bg-warning';
    } else if (hayEvaluacion) {
      badge.textContent = 'Completado';
      badge.className = 'resultado-badge bg-success';
    } else {
      badge.textContent = 'No completado';
      badge.className = 'resultado-badge';
    }
  }
}

// Función para desplegar/colapsar el contenido del cuestionario
function toggleCuestionario(contentId) {
  const content = document.getElementById(contentId);
  if (content) {
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    
    // Cambiar el ícono
    const header = content.previousElementSibling;
    if (header) {
      const icon = header.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-plus-circle');
        icon.classList.toggle('fa-minus-circle');
      }
    }
  }
}

// Aplicar sugerencia bilateral (copiar valor al lado opuesto)
function sugerirBilateral(input) {
  const id = input.id;
  const baseId = id.replace('_der', '').replace('_izq', '');
  const esIzquierdo = id.endsWith('_izq');
  
  const targetId = baseId + (esIzquierdo ? '_der' : '_izq');
  const targetInput = document.getElementById(targetId);
  
  if (targetInput && !targetInput.value) {
    targetInput.value = input.value;
    
    // Determinar la escala
    const escala = input.classList.contains('daniels') ? 'daniels' : 'oxford';
    
    // Re-evaluar con la nueva escala
    evaluarFuerza(targetInput, escala);
  }
}

// Inicializar listeners después de que carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Seleccionadores de escala
  document.querySelectorAll('.escala-selector').forEach(selector => {
    selector.addEventListener('change', function() {
      const row = this.closest('tr');
      if (row) {
        const input = row.querySelector('input[id$="_der"]');
        if (input) {
          const baseId = input.id.replace('_der', '');
          actualizarEscala(this, baseId);
        }
      }
    });
  });
  
  // Inputs de fuerza
  document.querySelectorAll('.fuerza-input').forEach(input => {
    input.addEventListener('change', function() {
      const escala = this.classList.contains('daniels') ? 'daniels' : 'oxford';
      evaluarFuerza(this, escala);
      
      // Sugerir el mismo valor para el lado contralateral si está vacío
      sugerirBilateral(this);
    });
  });
  
  // Agregar CSS para inputs con déficit
  const style = document.createElement('style');
  style.textContent = `
    .input-deficit {
      background-color: #ffeeee !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('Módulo de fuerza muscular inicializado correctamente.');
});
