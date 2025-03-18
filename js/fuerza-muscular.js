/**
 * fuerza-muscular.js
 * Funcionalidades para la evaluación de fuerza muscular analítica
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
    estado.className = 'estado-celda';
    return;
  }
  
  // Determinar el estado según la escala
  let texto = '';
  let clase = '';
  let bg = '';
  
  if (escala === 'daniels') {
    // Escala Daniels (0-5)
    if (valor <= 1) {
      texto = 'Déficit severo';
      clase = 'badge bg-danger text-white';
      bg = '#f8d7da'; // Rojo claro para fondo
    } else if (valor <= 2) {
      texto = 'Déficit moderado';
      clase = 'badge bg-warning text-dark';
      bg = '#fff3cd'; // Amarillo claro para fondo
    } else if (valor <= 3) {
      texto = 'Déficit leve';
      clase = 'badge bg-warning text-dark';
      bg = '#fff3cd'; // Amarillo claro para fondo
    } else if (valor <= 4) {
      texto = 'Déficit mínimo';
      clase = 'badge bg-info text-white';
      bg = '#d1ecf1'; // Azul claro para fondo
    } else {
      texto = 'Normal';
      clase = 'badge bg-success text-white';
      bg = '#d4edda'; // Verde claro para fondo
    }
  } else if (escala === 'mrc') {
    // Escala MRC Modificada
    if (valor <= 1) {
      texto = 'Déficit severo';
      clase = 'badge bg-danger text-white';
      bg = '#f8d7da'; // Rojo claro para fondo
    } else if (valor <= 3) {
      texto = 'Déficit moderado';
      clase = 'badge bg-warning text-dark';
      bg = '#fff3cd'; // Amarillo claro para fondo
    } else if (valor <= 4) {
      texto = 'Déficit leve';
      clase = 'badge bg-info text-white';
      bg = '#d1ecf1'; // Azul claro para fondo
    } else {
      texto = 'Normal';
      clase = 'badge bg-success text-white';
      bg = '#d4edda'; // Verde claro para fondo
    }
  }
  
  // Actualizar estado
  estado.innerHTML = `<span class="${clase}">${texto}</span>`;
  estado.style.backgroundColor = bg;
  
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

// Evaluar dolor al realizar pruebas de fuerza
function evaluarDolorFuerza(select) {
  const valor = select.value;
  
  // Aplicar color de fondo según presencia de dolor
  if (valor === 'No') {
    select.style.backgroundColor = '';
    select.style.color = '';
  } else {
    // Colores según momento del dolor
    const colores = {
      'Al inicio': '#ffe6e6',
      'Durante': '#ffcccc',
      'Al final': '#ffb3b3',
      'Después': '#ff9999',
      'Todo el tiempo': '#ff8080'
    };
    
    select.style.backgroundColor = colores[valor] || '#ffcccc';
    select.style.color = '#333';
  }
  
  // Recuperar el ID base para actualizar interpretaciones
  const id = select.id.replace('_dolor', '');
  const region = id.split('_')[0]; // Ej: "hombro", "cuello", etc.
  
  // Actualizar interpretaciones
  evaluarPatronesPorRegion(region);
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
    
    // Definir clase y color según magnitud del diferencial
    let clase = '';
    let bg = '';
    
    if (diferencial > 15) {
      clase = 'badge bg-danger text-white';
      bg = '#f8d7da'; // Rojo claro
    } else if (diferencial > 10) {
      clase = 'badge bg-warning text-dark';
      bg = '#fff3cd'; // Amarillo claro
    } else {
      clase = 'badge bg-success text-white';
      bg = '#d4edda'; // Verde claro
    }
    
    // Mostrar resultado
    difElement.innerHTML = `<span class="${clase}">${diferencial.toFixed(1)}%</span>`;
    difElement.style.backgroundColor = bg;
    
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
    difElement.style.backgroundColor = '';
    derInput.classList.remove('input-deficit');
    izqInput.classList.remove('input-deficit');
  }
}

// Cambiar la escala de fuerza entre Daniels y MRC
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
      input.classList.remove('daniels', 'mrc');
      input.classList.add(escala);
      
      // Actualizar rango y opciones según la escala
      if (escala === 'daniels') {
        input.setAttribute('max', '5');
        input.setAttribute('step', '1');
      } else {
        // Para MRC Modificada mantenemos el mismo rango pero con opciones específicas
        input.setAttribute('max', '5');
        input.setAttribute('step', '1');
      }
      
      // Re-evaluar con la nueva escala si hay un valor
      if (!isNaN(valorActual)) {
        evaluarFuerza(input, escala);
      }
    }
  });
}

// Evaluar patrones de debilidad por región
function evaluarPatronesPorRegion(region) {
  // Verifica si hay patrones definidos para la región
  if (!patronesMusculares[region]) return;
  
  const patrones = patronesMusculares[region];
  const patronesDetectados = [];
  const doloresDetectados = [];
  
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
          const escala = derInput.classList.contains('daniels') ? 'daniels' : 'mrc';
          const umbral = escala === 'daniels' ? 4 : 4;
          if (derValor < umbral) valoresBajos++;
        }
        
        if (!isNaN(izqValor)) {
          valoresTotales++;
          const escala = izqInput.classList.contains('daniels') ? 'daniels' : 'mrc';
          const umbral = escala === 'daniels' ? 4 : 4;
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
  
  // Buscar si hay dolor en algún movimiento de la región
  const selectoresDolor = document.querySelectorAll(`select[id^="${region}_"][id$="_dolor"]`);
  selectoresDolor.forEach(select => {
    if (select.value !== 'No') {
      const id = select.id.replace('_dolor', '');
      const movimiento = id.replace(`${region}_`, '');
      
      // Traducir nombres de movimientos a formato legible
      const movimientosNombres = {
        'flexion': 'Flexión',
        'extension': 'Extensión',
        'abduccion': 'Abducción',
        'aduccion': 'Aducción',
        'rotint': 'Rotación interna',
        'rotext': 'Rotación externa',
        'inclinacion': 'Inclinación lateral',
        'rotacion': 'Rotación'
      };
      
      const movimientoNombre = movimientosNombres[movimiento] || movimiento;
      
      doloresDetectados.push({
        movimiento: movimientoNombre,
        momento: select.value
      });
    }
  });
  
  // Actualizar la interpretación regional
  const interpretacionElement = document.getElementById('interpretacion-' + region);
  if (!interpretacionElement) return;
  
  let html = '';
  
  // Si hay patrones detectados
  if (patronesDetectados.length > 0) {
    html += '<div class="alert alert-warning">';
    html += '<strong>Patrones detectados:</strong><ul>';
    
    patronesDetectados.forEach(patron => {
      html += `<li><strong>${patron.descripcion}</strong>: ${patron.recomendacion}</li>`;
    });
    
    html += '</ul></div>';
  }
  
  // Si hay dolor
  if (doloresDetectados.length > 0) {
    html += '<div class="alert alert-danger">';
    html += '<strong>Dolor durante evaluación:</strong><ul>';
    
    doloresDetectados.forEach(dolor => {
      html += `<li>${dolor.movimiento}: ${dolor.momento}</li>`;
    });
    
    html += '</ul>';
    html += '<p><strong>Consideración:</strong> La presencia de dolor puede alterar los resultados por inhibición refleja.</p>';
    html += '</div>';
  }
  
  // Si no hay patrones ni dolor pero hay alguna evaluación
  if (patronesDetectados.length === 0 && doloresDetectados.length === 0) {
    // Verificar si hay al menos una evaluación
    const inputs = document.querySelectorAll(`input[id^="${region}_"][type="number"]`);
    let hayEvaluacion = false;
    
    inputs.forEach(input => {
      if (!isNaN(parseFloat(input.value))) {
        hayEvaluacion = true;
      }
    });
    
    if (hayEvaluacion) {
      html += '<div class="alert alert-success">';
      html += 'No se detectan patrones de déficit muscular significativos en esta región.';
      html += '</div>';
    } else {
      html = '<div class="alert alert-info">Complete la evaluación para obtener interpretación clínica.</div>';
    }
  }
  
  interpretacionElement.innerHTML = html;
  
  // Actualizar el badge de la región
  actualizarBadgeRegion(region, patronesDetectados.length > 0 || doloresDetectados.length > 0);
}

// Actualizar el badge de una región
function actualizarBadgeRegion(region, hayDeficitODolor) {
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
    badge.textContent = 'No completado';
    badge.className = 'badge bg-secondary ms-auto';
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
    badge.className = 'badge bg-warning text-dark ms-auto';
    return;
  }
  
  // Comprobar si hay déficit o dolor
  if (hayDeficitODolor) {
    badge.textContent = 'Déficit detectado';
    badge.className = 'badge bg-danger text-white ms-auto';
  } else {
    badge.textContent = 'Normal';
    badge.className = 'badge bg-success text-white ms-auto';
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
        // Traducir nombres de movimientos a formato legible
        const movimientosNombres = {
          'flexion': 'Flexión',
          'extension': 'Extensión',
          'abduccion': 'Abducción',
          'aduccion': 'Aducción',
          'rotint': 'Rot. Int.',
          'rotext': 'Rot. Ext.',
          'inclinacion': 'Inclinación',
          'rotacion': 'Rotación'
        };
        
        const movimientoNombre = movimientosNombres[movimiento] || movimiento;
        
        datos.movimientos.push(movimientoNombre);
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

// Función para crear el gráfico de radar moderno
function crearGrafico(canvas, datos) {
  // Verificar si ya existe un gráfico para este canvas
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  // Determinar la escala (mirando el primer input de la región)
  const regionNombre = canvas.id.replace('grafico-radar-', '');
  const primerMovimiento = datos.movimientos[0] ? convertirAIdMovimiento(datos.movimientos[0]) : '';
  const primerInputId = regionNombre + '_' + primerMovimiento + '_der';
  const primerInput = document.getElementById(primerInputId);
  
  let escala = 'daniels';
  let maxValue = 5;
  
  if (primerInput && primerInput.classList.contains('mrc')) {
    escala = 'mrc';
    maxValue = 5;
  }
  
  // Color theme moderno
  const derColor = 'rgba(110, 231, 183, 1)';   // Verde turquesa
  const izqColor = 'rgba(96, 165, 250, 1)';    // Azul claro
  
  // Crear gráfico tipo radar moderno
  const ctx = canvas.getContext('2d');
  canvas.chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: datos.movimientos,
      datasets: [{
        label: 'Derecha',
        data: datos.derecha,
        backgroundColor: 'rgba(110, 231, 183, 0.3)',
        borderColor: derColor,
        pointBackgroundColor: derColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: derColor,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }, {
        label: 'Izquierda',
        data: datos.izquierda,
        backgroundColor: 'rgba(96, 165, 250, 0.3)',
        borderColor: izqColor,
        pointBackgroundColor: izqColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: izqColor,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: maxValue,
          ticks: {
            stepSize: 1,
            display: true,
            backdropColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 10
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          angleLines: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          pointLabels: {
            font: {
              size: 11,
              family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            },
            color: 'rgba(255, 255, 255, 0.9)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            boxWidth: 10,
            padding: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              size: 11
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 11
          },
          padding: 10,
          cornerRadius: 4,
          displayColors: true
        }
      }
    }
  });
  
  // Crear también gráfico de barras horizontales moderno
  crearBarrasHorizontales(regionNombre, datos, escala);
}

// Función para crear barras horizontales estilo moderno
function crearBarrasHorizontales(region, datos, escala) {
  const contenedor = document.getElementById(`grafico-barras-${region}`);
  if (!contenedor) return;
  
  // Limpiar contenedor
  contenedor.innerHTML = '';
  
  // Valor máximo según escala
  const valorMaximo = escala === 'daniels' ? 5 : 5;
  
  // Crear elementos para cada movimiento
  datos.movimientos.forEach((movimiento, index) => {
    const valorDer = datos.derecha[index] || 0;
    const valorIzq = datos.izquierda[index] || 0;
    
    // Calcular porcentajes
    const porcentajeDer = (valorDer / valorMaximo) * 100;
    const porcentajeIzq = (valorIzq / valorMaximo) * 100;
    
    // Crear elemento para este movimiento
    const movimientoItem = document.createElement('div');
    movimientoItem.className = 'movimiento-item';
    
    // Nombre del movimiento
    const nombre = document.createElement('div');
    nombre.className = 'movimiento-nombre';
    nombre.textContent = movimiento;
    movimientoItem.appendChild(nombre);
    
    // Barra derecha
    const labelDer = document.createElement('div');
    labelDer.className = 'lado-label';
    labelDer.innerHTML = `
      <span>Derecha</span>
      <span>${valorDer}/${valorMaximo}</span>
    `;
    movimientoItem.appendChild(labelDer);
    
    const barraBackDer = document.createElement('div');
    barraBackDer.className = 'barra-background';
    
    const barraDer = document.createElement('div');
    barraDer.className = 'barra barra-der';
    barraDer.style.width = `${porcentajeDer}%`;
    
    barraBackDer.appendChild(barraDer);
    movimientoItem.appendChild(barraBackDer);
    
    // Barra izquierda
    const labelIzq = document.createElement('div');
    labelIzq.className = 'lado-label';
    labelIzq.innerHTML = `
      <span>Izquierda</span>
      <span>${valorIzq}/${valorMaximo}</span>
    `;
    movimientoItem.appendChild(labelIzq);
    
    const barraBackIzq = document.createElement('div');
    barraBackIzq.className = 'barra-background';
    
    const barraIzq = document.createElement('div');
    barraIzq.className = 'barra barra-izq';
    barraIzq.style.width = `${porcentajeIzq}%`;
    
    barraBackIzq.appendChild(barraIzq);
    movimientoItem.appendChild(barraBackIzq);
    
    // Añadir a contenedor
    contenedor.appendChild(movimientoItem);
  });
  
  // Calcular y mostrar promedio global para la región
  const promedioDer = datos.derecha.length > 0 ? 
    datos.derecha.reduce((a, b) => a + b, 0) / datos.derecha.length : 0;
  
  const promedioIzq = datos.izquierda.length > 0 ? 
    datos.izquierda.reduce((a, b) => a + b, 0) / datos.izquierda.length : 0;
  
  const promedioGlobal = (promedioDer + promedioIzq) / 2;
  const porcentajeGlobal = Math.round((promedioGlobal / valorMaximo) * 100);
  
  // Si hay espacio, mostrar también el promedio global
  if (datos.movimientos.length <= 5) {
    const dividerEl = document.createElement('hr');
    dividerEl.className = 'my-3 border-secondary';
    contenedor.appendChild(dividerEl);
    
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'text-center';
    
    const scoreTitle = document.createElement('div');
    scoreTitle.className = 'text-white-50 mb-2';
    scoreTitle.textContent = 'Puntuación global';
    
    const scoreCircle = document.createElement('div');
    scoreCircle.className = 'score-circle';
    
    // Crear círculo con progreso SVG
    const circleSvg = `
      <svg viewBox="0 0 36 36" class="w-100 h-100">
        <path class="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          stroke-width="3"
        />
        <path class="circle"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="url(#gradient)"
          stroke-width="3"
          stroke-dasharray="${porcentajeGlobal}, 100"
          stroke-linecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#6ee7b7" />
            <stop offset="100%" stop-color="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div class="score-text">${porcentajeGlobal}%</div>
    `;
    
    scoreCircle.innerHTML = circleSvg;
    
    scoreContainer.appendChild(scoreTitle);
    scoreContainer.appendChild(scoreCircle);
    contenedor.appendChild(scoreContainer);
  }
}

// Función auxiliar para convertir nombre legible a ID de movimiento
function convertirAIdMovimiento(nombreLegible) {
  const mapa = {
    'Flexión': 'flexion',
    'Extensión': 'extension',
    'Abducción': 'abduccion',
    'Aducción': 'aduccion',
    'Rot. Int.': 'rotint',
    'Rotación interna': 'rotint',
    'Rot. Ext.': 'rotext',
    'Rotación externa': 'rotext',
    'Inclinación': 'inclinacion',
    'Inclinación lateral': 'inclinacion',
    'Rotación': 'rotacion'
  };
  
  return mapa[nombreLegible] || nombreLegible.toLowerCase();
}

// Modificar la función actualizarDashboard
function actualizarDashboard(region) {
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
        // Traducir nombres de movimientos a formato legible
        const movimientosNombres = {
          'flexion': 'Flexión',
          'extension': 'Extensión',
          'abduccion': 'Abducción',
          'aduccion': 'Aducción',
          'rotint': 'Rot. Int.',
          'rotext': 'Rot. Ext.',
          'inclinacion': 'Inclinación',
          'rotacion': 'Rotación'
        };
        
        const movimientoNombre = movimientosNombres[movimiento] || movimiento;
        
        datos.movimientos.push(movimientoNombre);
        datos.derecha.push(isNaN(valDer) ? 0 : valDer);
        datos.izquierda.push(isNaN(valIzq) ? 0 : valIzq);
      }
    }
  });
  
  // Si hay datos, crear el gráfico
  if (datos.movimientos.length > 0) {
    const canvas = document.getElementById('grafico-radar-' + region);
    if (canvas) {
      crearGrafico(canvas, datos);
    }
  }
}
// Función auxiliar para convertir nombre legible a ID de movimiento
function convertirAIdMovimiento(nombreLegible) {
  const mapa = {
    'Flexión': 'flexion',
    'Extensión': 'extension',
    'Abducción': 'abduccion',
    'Aducción': 'aduccion',
    'Rot. Int.': 'rotint',
    'Rotación interna': 'rotint',
    'Rot. Ext.': 'rotext',
    'Rotación externa': 'rotext',
    'Inclinación': 'inclinacion',
    'Inclinación lateral': 'inclinacion',
    'Rotación': 'rotacion'
  };
  
  return mapa[nombreLegible] || nombreLegible.toLowerCase();
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
      'cuello': 'Cabeza y Cuello',
      'hombro': 'Complejo del Hombro',
      'codo': 'Codo y Antebrazo',
      'muneca': 'Muñeca y Mano',
      'tronco': 'Tronco/Core',
      'cadera': 'Cadera',
      'rodilla': 'Rodilla',
      'tobillo': 'Tobillo y Pie'
    };
    
    const movimientosNombres = {
      'flexion': 'flexión',
      'extension': 'extensión',
      'abduccion': 'abducción',
      'aduccion': 'aducción',
      'rotint': 'rotación interna',
      'rotext': 'rotación externa',
      'inclinacion': 'inclinación lateral',
      'rotacion': 'rotación'
    };
    
    const ladosNombres = {
      'der': 'derecho',
      'izq': 'izquierdo'
    };
    
    // Verificar debilidad
    const valor = parseFloat(input.value);
    const escala = input.classList.contains('daniels') ? 'daniels' : 'mrc';
    const umbralDebilidad = escala === 'daniels' ? 4 : 4;
    
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
        'cuello': 'Cabeza y Cuello',
        'hombro': 'Complejo del Hombro',
        'codo': 'Codo y Antebrazo',
        'muneca': 'Muñeca y Mano',
        'tronco': 'Tronco/Core',
        'cadera': 'Cadera',
        'rodilla': 'Rodilla',
        'tobillo': 'Tobillo y Pie'
      };
      
      const movimientosNombres = {
        'flexion': 'flexión',
        'extension': 'extensión',
        'abduccion': 'abducción',
        'aduccion': 'aducción',
        'rotint': 'rotación interna',
        'rotext': 'rotación externa',
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
            const escala = derInput.classList.contains('daniels') ? 'daniels' : 'mrc';
            const umbral = escala === 'daniels' ? 4 : 4;
            if (derValor < umbral) valoresBajos++;
          }
          
          if (!isNaN(izqValor)) {
            valoresTotales++;
            const escala = izqInput.classList.contains('daniels') ? 'daniels' : 'mrc';
            const umbral = escala === 'daniels' ? 4 : 4;
            if (izqValor < umbral) valoresBajos++;
          }
        }
      });
      
      // Determinar si hay coincidencia (más del 50% de los valores están bajos)
      if (valoresTotales > 0 && (valoresBajos / valoresTotales) > 0.5) {
        const regionesNombres = {
          'cuello': 'Cabeza y Cuello',
          'hombro': 'Complejo del Hombro',
          'codo': 'Codo y Antebrazo',
          'muneca': 'Muñeca y Mano',
          'tronco': 'Tronco/Core',
          'cadera': 'Cadera',
          'rodilla': 'Rodilla',
          'tobillo': 'Tobillo y Pie'
        };
        
        patrones.push({
          nombre: patronKey,
          region: regionesNombres[region] || region,
          descripcion: patron.descripcion,
          recomendacion: patron.recomendacion
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
      const region = debilidad.region;
      const regionNombre = {
        'cuello': 'Cabeza y Cuello',
        'hombro': 'Complejo del Hombro',
        'codo': 'Codo y Antebrazo',
        'muneca': 'Muñeca y Mano',
        'tronco': 'Tronco/Core',
        'cadera': 'Cadera',
        'rodilla': 'Rodilla',
        'tobillo': 'Tobillo y Pie'
      }[region] || region;
      
      if (!regionesDebilidad[regionNombre]) {
        regionesDebilidad[regionNombre] = [];
      }
      regionesDebilidad[regionNombre].push(debilidad);
    });
    
    Object.keys(regionesDebilidad).forEach(regionNombre => {
      const debilidadesRegion = regionesDebilidad[regionNombre];
      
      interpretacionTexto += `<li><strong>${regionNombre}:</strong> `;
      interpretacionTexto += debilidadesRegion.map(d => d.texto).join(', ');
      interpretacionTexto += '</li>';
    });
    
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Recomendaciones por debilidad:</strong></p><ul>';
    Object.keys(regionesDebilidad).forEach(regionNombre => {
      recomendacionesTexto += `<li><strong>${regionNombre}:</strong> Considerar programa de fortalecimiento progresivo específico para los déficits identificados.</li>`;
    });
    recomendacionesTexto += '</ul>';
  } else {
    interpretacionTexto += '<p><strong>Fuerza muscular:</strong> No se detectan debilidades significativas.</p>';
  }
  
  // Interpretación de asimetrías
  if (asimetrias.length > 0) {
    interpretacionTexto += '<p><strong>Asimetrías bilaterales significativas (>15%):</strong></p><ul>';
    asimetrias.forEach(asimetria => {
      interpretacionTexto += `<li>${asimetria.texto}: <span class="text-danger">${asimetria.diferencia}%</span> de déficit en lado ${asimetria.ladoDebil}</li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Abordaje de asimetrías:</strong> Trabajar en la corrección de desequilibrios bilaterales, enfatizando el lado más débil y considerando:</p>';
    recomendacionesTexto += '<ul>';
    recomendacionesTexto += '<li>Progresión desde ejercicios isométricos a dinámicos concéntricos/excéntricos.</li>';
    recomendacionesTexto += '<li>Monitorización regular de la evolución de las asimetrías.</li>';
    recomendacionesTexto += '</ul>';
  }
  
  // Interpretación de dolor
  if (dolores.length > 0) {
    interpretacionTexto += '<p><strong>Dolor durante el test:</strong></p><ul>';
    dolores.forEach(dolor => {
      interpretacionTexto += `<li>${dolor.texto}: <span class="text-danger">${dolor.momento}</span></li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Consideraciones por dolor:</strong></p><ul>';
    recomendacionesTexto += '<li>Trabajar inicialmente con cargas submáximas y rangos no dolorosos.</li>';
    recomendacionesTexto += '<li>Considerar técnicas de modulación del dolor previo al trabajo de fuerza.</li>';
    recomendacionesTexto += '<li>Monitorizar sistemáticamente la respuesta al dolor durante la progresión de ejercicios.</li>';
    recomendacionesTexto += '</ul>';
  }
  
  // Interpretación de patrones
  if (patrones.length > 0) {
    interpretacionTexto += '<p><strong>Patrones clínicos identificados:</strong></p><ul>';
    patrones.forEach(patron => {
      interpretacionTexto += `<li><strong>${patron.region}:</strong> ${patron.descripcion}</li>`;
    });
    interpretacionTexto += '</ul>';
    
    recomendacionesTexto += '<p><strong>Recomendaciones específicas por patrón:</strong></p><ul>';
    patrones.forEach(patron => {
      recomendacionesTexto += `<li><strong>${patron.region}:</strong> ${patron.recomendacion}</li>`;
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
    if (debilidades.length > 0 || asimetrias.length > 0 || patrones.length > 0 || dolores.length > 0) {
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

// Función para añadir un músculo específico a evaluar
function agregarMusculoEspecifico(region) {
  const contenedor = document.getElementById(`${region}_musculos_adicionales`);
  if (!contenedor) return;
  
  // Generar un ID único para el nuevo músculo
  const timestamp = Date.now();
  const musculoId = `${region}_musculo_${timestamp}`;
  
  // Crear HTML para la fila de evaluación
  const html = `
    <div class="musculo-adicional-item mb-4" id="${musculoId}_container">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <input type="text" class="form-control" id="${musculoId}_nombre" placeholder="Nombre del músculo específico" style="width: 70%;">
          <button type="button" class="btn btn-sm btn-danger" onclick="eliminarMusculoEspecifico('${musculoId}_container')">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="table-light">
                <tr>
                  <th>Escala</th>
                  <th colspan="2">Derecha</th>
                  <th colspan="2">Izquierda</th>
                  <th>Diferencial</th>
                  <th>Dolor</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select class="form-select escala-selector" onchange="actualizarEscala(this, '${musculoId}')">
                      <option value="daniels">Daniels (0-5)</option>
                      <option value="mrc">MRC Modificada</option>
                    </select>
                  </td>
                  <td>
                    <input type="number" id="${musculoId}_der" name="${musculoId}_der" class="form-control fuerza-input daniels" min="0" max="5" step="1" onchange="evaluarFuerza(this, 'daniels')">
                  </td>
                  <td id="${musculoId}_der_estado" class="estado-celda"></td>
                  <td>
                    <input type="number" id="${musculoId}_izq" name="${musculoId}_izq" class="form-control fuerza-input daniels" min="0" max="5" step="1" onchange="evaluarFuerza(this, 'daniels')">
                  </td>
                  <td id="${musculoId}_izq_estado" class="estado-celda"></td>
                  <td id="${musculoId}_dif" class="diferencial-celda"></td>
                  <td>
                    <select id="${musculoId}_dolor" name="${musculoId}_dolor" class="form-select dolor-selector" onchange="evaluarDolorFuerza(this)">
                      <option value="No">No</option>
                      <option value="Al inicio">Al inicio</option>
                      <option value="Durante">Durante</option>
                      <option value="Al final">Al final</option>
                      <option value="Después">Después</option>
                      <option value="Todo el tiempo">Todo el tiempo</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" id="${musculoId}_obs" name="${musculoId}_obs" class="form-control">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Añadir el HTML al contenedor
  contenedor.insertAdjacentHTML('beforeend', html);
  
  // Actualizar los valores para que se muestre en el dashboard
  document.getElementById(`${region}-badge`).textContent = 'Pendiente';
  document.getElementById(`${region}-badge`).className = 'badge bg-warning text-dark ms-auto';
}

// Función para eliminar un músculo específico
function eliminarMusculoEspecifico(contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (contenedor) {
    const region = contenedorId.split('_')[0];
    contenedor.remove();
    
    // Actualizar dashboard e interpretación
    actualizarDashboard(region);
    evaluarPatronesPorRegion(region);
    actualizarInterpretacionGlobal();
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
      const escala = this.classList.contains('daniels') ? 'daniels' : 'mrc';
      evaluarFuerza(this, escala);
      
      // Sugerir el mismo valor para el lado contralateral si está vacío
      sugerirBilateral(this);
    });
  });
  
  // Selectores de dolor
  document.querySelectorAll('.dolor-selector').forEach(select => {
    select.addEventListener('change', function() {
      evaluarDolorFuerza(this);
    });
  });
  
  console.log('Módulo de fuerza muscular inicializado correctamente.');
});

// Aplicar sugerencia bilateral (copiar valor al lado opuesto)
function sugerirBilateral(input) {
  const id = input.id;
  const baseId = id.replace('_der', '').replace('_izq', '');
  const esIzquierdo = id.endsWith('_izq');
  
  const targetId = baseId + (esIzquierdo ? '_der' : '_izq');
  const targetInput = document.getElementById(targetId);
  
  if (targetInput && targetInput.value === '') {
    targetInput.value = input.value;
    
    // Determinar la escala
    const escala = input.classList.contains('daniels') ? 'daniels' : 'mrc';
    
    // Re-evaluar con la nueva escala
    evaluarFuerza(targetInput, escala);
  }
}

// Agregar CSS dinámico para los estilos
(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Estilos para evaluación de fuerza muscular */
    .input-deficit {
      background-color: #ffeeee !important;
      border-color: #ff8080 !important;
    }
    
    .estado-celda {
      vertical-align: middle;
      text-align: center;
      transition: background-color 0.3s ease;
    }
    
    .diferencial-celda {
      vertical-align: middle;
      text-align: center;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    
    .dolor-selector {
      transition: background-color 0.3s ease;
    }
    
    .grafico-container {
      position: relative;
      height: 300px;
      width: 100%;
      max-width: 100%;
    }
    
    .accordion-button .fas.fa-circle {
      font-size: 10px;
      opacity: 0.7;
    }
    
    .accordion-header .badge {
      margin-left: auto;
      margin-right: 15px;
    }
    
    .musculo-adicional-item .card-header {
      background-color: #f8f9fa;
    }
    
    /* Animación para las transiciones */
    .accordion-collapse {
      transition: all 0.3s ease-out;
    }
    
    .card {
      transition: all 0.2s ease-out;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
    
    .card:hover {
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
  `;
  document.head.appendChild(style);
})();

// Datos normativos para handgrip según edad y sexo (basados en estudios actualizados)
const valoresNormativosHandgrip = {
  masculino: {
    "18-29": 46.2,
    "30-39": 45.5,
    "40-49": 43.9,
    "50-59": 40.5,
    "60-69": 36.2,
    "70-79": 32.8,
    "80+": 26.5
  },
  femenino: {
    "18-29": 29.5,
    "30-39": 28.8,
    "40-49": 27.5,
    "50-59": 25.8,
    "60-69": 22.5,
    "70-79": 19.5,
    "80+": 16.8
  }
};

// Valores percentiles para ambos sexos (simplificados para este ejemplo)
const percentilesHandgrip = {
  masculino: {
    "p10": 0.68, // 68% del valor normativo
    "p25": 0.80,
    "p50": 1.00,
    "p75": 1.15,
    "p90": 1.30
  },
  femenino: {
    "p10": 0.66,
    "p25": 0.78,
    "p50": 1.00,
    "p75": 1.18,
    "p90": 1.32
  }
};

// Puntos de corte para sarcopenia según EWGSOP2 (European Working Group on Sarcopenia in Older People 2)
const puntosCorteSarcopenia = {
  masculino: 27, // kg
  femenino: 16 // kg
};

/**
 * Actualiza los valores normativos basados en los datos del paciente
 */
function actualizarValoresNormativos() {
  const edad = parseInt(document.getElementById('dinamometria_edad').value) || 0;
  const sexo = document.getElementById('dinamometria_sexo').value;
  
  if (!edad || !sexo) return;
  
  // Determinar el grupo de edad
  let grupoEdad = "";
  if (edad >= 18 && edad <= 29) grupoEdad = "18-29";
  else if (edad >= 30 && edad <= 39) grupoEdad = "30-39";
  else if (edad >= 40 && edad <= 49) grupoEdad = "40-49";
  else if (edad >= 50 && edad <= 59) grupoEdad = "50-59";
  else if (edad >= 60 && edad <= 69) grupoEdad = "60-69";
  else if (edad >= 70 && edad <= 79) grupoEdad = "70-79";
  else if (edad >= 80) grupoEdad = "80+";
  
  // Actualizar el valor normativo
  const valorNormativo = valoresNormativosHandgrip[sexo][grupoEdad];
  if (valorNormativo) {
    document.getElementById('handgrip_valor_normativo').textContent = valorNormativo.toFixed(1);
  }
  
  // Recalcular los resultados si ya hay datos
  calcularHandgrip();
}

/**
 * Calcula todos los valores y actualiza la interfaz para el handgrip
 */
function calcularHandgrip(forzarActualizacion = false) {
  // Obtener valores de los intentos
  const der1 = parseFloat(document.getElementById('handgrip_der_1').value) || 0;
  const der2 = parseFloat(document.getElementById('handgrip_der_2').value) || 0;
  const der3 = parseFloat(document.getElementById('handgrip_der_3').value) || 0;
  const izq1 = parseFloat(document.getElementById('handgrip_izq_1').value) || 0;
  const izq2 = parseFloat(document.getElementById('handgrip_izq_2').value) || 0;
  const izq3 = parseFloat(document.getElementById('handgrip_izq_3').value) || 0;
  
  // Verificar si hay datos para calcular
  if (!forzarActualizacion && der1 === 0 && der2 === 0 && der3 === 0 && izq1 === 0 && izq2 === 0 && izq3 === 0) {
    return;
  }
  
  // Calcular promedio (ignorando valores de 0)
  let promedioDer = 0;
  let contadorDer = 0;
  [der1, der2, der3].forEach(val => {
    if (val > 0) {
      promedioDer += val;
      contadorDer++;
    }
  });
  promedioDer = contadorDer > 0 ? promedioDer / contadorDer : 0;
  
  let promedioIzq = 0;
  let contadorIzq = 0;
  [izq1, izq2, izq3].forEach(val => {
    if (val > 0) {
      promedioIzq += val;
      contadorIzq++;
    }
  });
  promedioIzq = contadorIzq > 0 ? promedioIzq / contadorIzq : 0;
  
  // Calcular mejor intento
  const mejorDer = Math.max(der1 || 0, der2 || 0, der3 || 0);
  const mejorIzq = Math.max(izq1 || 0, izq2 || 0, izq3 || 0);
  
  // Actualizar campos de resultado
  document.getElementById('handgrip_der_promedio').value = promedioDer.toFixed(1);
  document.getElementById('handgrip_izq_promedio').value = promedioIzq.toFixed(1);
  document.getElementById('handgrip_der_mejor').value = mejorDer.toFixed(1);
  document.getElementById('handgrip_izq_mejor').value = mejorIzq.toFixed(1);
  
  // Determinar qué valor usar para el análisis
  const tipoValor = document.getElementById('handgrip_valor_analisis').value;
  const valorDer = tipoValor === 'mejor' ? mejorDer : promedioDer;
  const valorIzq = tipoValor === 'mejor' ? mejorIzq : promedioIzq;
  
  // Calcular asimetría bilateral
  let asimetria = 0;
  if (valorDer > 0 && valorIzq > 0) {
    const mayor = Math.max(valorDer, valorIzq);
    const menor = Math.min(valorDer, valorIzq);
    asimetria = ((mayor - menor) / mayor) * 100;
  }
  document.getElementById('handgrip_asimetria').textContent = asimetria.toFixed(1);
  
  // Calcular fuerza normalizada por peso
  const peso = parseFloat(document.getElementById('dinamometria_peso').value) || 0;
  let fuerzaNormalizada = 0;
  if (peso > 0) {
    // Usar el valor de la mano dominante o el mayor si no se especifica
    const manoDominante = document.getElementById('mano_dominante').value;
    let valorDominante = 0;
    
    if (manoDominante === 'derecha') {
      valorDominante = valorDer;
    } else if (manoDominante === 'izquierda') {
      valorDominante = valorIzq;
    } else {
      // Si es ambidiestro o no especificado, usar el mayor valor
      valorDominante = Math.max(valorDer, valorIzq);
    }
    
    fuerzaNormalizada = valorDominante / peso;
  }
  document.getElementById('handgrip_normalizado').textContent = fuerzaNormalizada.toFixed(2);
  
  // Comparar con valor normativo
  const sexo = document.getElementById('dinamometria_sexo').value;
  const valorNormativo = parseFloat(document.getElementById('handgrip_valor_normativo').textContent) || 0;
  
  let percentil = '-';
  let colorPercentil = 'secondary';
  
  if (valorNormativo > 0 && (valorDer > 0 || valorIzq > 0)) {
    // Usar el mejor valor de cualquier mano para la comparación con los normativos
    const mejorValor = Math.max(valorDer, valorIzq);
    const proporcionNormativo = mejorValor / valorNormativo;
    
    // Determinar percentil
    if (sexo && percentilesHandgrip[sexo]) {
      if (proporcionNormativo < percentilesHandgrip[sexo].p10) {
        percentil = "< P10 (Muy bajo)";
        colorPercentil = "danger";
      } else if (proporcionNormativo < percentilesHandgrip[sexo].p25) {
        percentil = "P10-P25 (Bajo)";
        colorPercentil = "warning";
      } else if (proporcionNormativo < percentilesHandgrip[sexo].p75) {
        percentil = "P25-P75 (Normal)";
        colorPercentil = "success";
      } else if (proporcionNormativo < percentilesHandgrip[sexo].p90) {
        percentil = "P75-P90 (Alto)";
        colorPercentil = "primary";
      } else {
        percentil = "> P90 (Muy alto)";
        colorPercentil = "info";
      }
    }
    
    document.getElementById('handgrip_percentil').innerHTML = `<span class="badge bg-${colorPercentil}">${percentil}</span>`;
    
    // Evaluar riesgo de sarcopenia
    if (sexo && puntosCorteSarcopenia[sexo]) {
      const puntoDiagnostico = puntosCorteSarcopenia[sexo];
      const mejorValor = Math.max(valorDer, valorIzq);
      
      let riesgoSarcopenia = '';
      let colorRiesgo = '';
      
      if (mejorValor < puntoDiagnostico) {
        riesgoSarcopenia = "Elevado";
        colorRiesgo = "danger";
      } else {
        riesgoSarcopenia = "Normal";
        colorRiesgo = "success";
      }
      
      document.getElementById('handgrip_sarcopenia').innerHTML = 
        `<span class="badge bg-${colorRiesgo}">${riesgoSarcopenia}</span>`;
    }
    
    // Generar interpretación clínica
    generarInterpretacionHandgrip(valorDer, valorIzq, valorNormativo, asimetria, percentil, fuerzaNormalizada);
    
    // Crear gráfico comparativo
    crearGraficoHandgrip(valorDer, valorIzq, valorNormativo);
  }
}

/**
 * Genera la interpretación clínica y recomendaciones para handgrip
 */
function generarInterpretacionHandgrip(valorDer, valorIzq, valorNormativo, asimetria, percentil, fuerzaNormalizada) {
  const sexo = document.getElementById('dinamometria_sexo').value;
  const edad = parseInt(document.getElementById('dinamometria_edad').value) || 0;
  const mejorValor = Math.max(valorDer, valorIzq);
  const manoDominante = document.getElementById('mano_dominante').value;
  
  let interpretacion = '';
  let recomendaciones = '';
  
  // Determinar el estado general según la comparación con el valor normativo
  let estadoGeneral = '';
  let colorEstado = '';
  
  if (valorNormativo > 0) {
    const proporcion = mejorValor / valorNormativo;
    
    if (proporcion >= 0.85) {
      estadoGeneral = "normal";
      colorEstado = "success";
    } else if (proporcion >= 0.70) {
      estadoGeneral = "ligeramente disminuida";
      colorEstado = "warning";
    } else {
      estadoGeneral = "significativamente disminuida";
      colorEstado = "danger";
    }
  }
  
  // Construir la interpretación clínica
  if (mejorValor > 0 && estadoGeneral) {
    interpretacion = `
      <div class="alert alert-${colorEstado}">
        <p><strong>La fuerza de prensión manual es ${estadoGeneral}</strong> en comparación con valores normativos para su edad y sexo.</p>
    `;
    
    // Agregar información sobre asimetría si es relevante
    if (valorDer > 0 && valorIzq > 0) {
      interpretacion += `<p>`;
      
      if (asimetria > 10) {
        interpretacion += `Existe una <strong>asimetría significativa</strong> (${asimetria.toFixed(1)}%) entre la fuerza de ambas manos. `;
        
        if (manoDominante) {
          const ladoMasFuerte = valorDer > valorIzq ? "derecha" : "izquierda";
          if (ladoMasFuerte !== manoDominante) {
            interpretacion += `Curiosamente, la mano no dominante (${ladoMasFuerte}) presenta mayor fuerza que la dominante, lo que podría indicar una patología o compensación funcional. `;
          }
        }
      } else {
        interpretacion += `No existe asimetría significativa entre ambas manos (${asimetria.toFixed(1)}%), lo que indica un patrón de fuerza bilateral equilibrado. `;
      }
      
      interpretacion += `</p>`;
    }
    
    // Agregar información sobre el riesgo de sarcopenia si corresponde
    if (sexo && puntosCorteSarcopenia[sexo]) {
      if (mejorValor < puntosCorteSarcopenia[sexo]) {
        interpretacion += `
          <p>Los valores se encuentran por debajo del punto de corte para diagnóstico de sarcopenia 
          (${puntosCorteSarcopenia[sexo]} kg) según los criterios EWGSOP2, lo que sugiere <strong>probable
          sarcopenia</strong> que debería confirmarse con evaluación adicional de la masa muscular.</p>
        `;
      }
    }
    
    // Consideraciones especiales según la edad
    if (edad >= 60) {
      interpretacion += `
        <p>Considerando la edad del paciente, estos valores tienen importancia pronóstica para la 
        funcionalidad, independencia en actividades de la vida diaria y riesgo de fragilidad.</p>
      `;
    }
    
    interpretacion += `</div>`;
    
    // Construir recomendaciones basadas en los hallazgos
    recomendaciones = `<ul class="list-group">`;
    
    if (estadoGeneral === "significativamente disminuida" || estadoGeneral === "ligeramente disminuida") {
      recomendaciones += `
        <li class="list-group-item list-group-item-warning">
          <strong>Entrenamiento de fuerza progresivo</strong>: Se recomienda programa de entrenamiento 
          de fuerza con resistencia progresiva, 2-3 sesiones semanales, enfocado en grandes grupos musculares.
        </li>
        <li class="list-group-item">
          <strong>Evaluación nutricional</strong>: Considerar evaluación del estado nutricional y 
          consumo adecuado de proteínas (1.2-1.5g/kg/día).
        </li>
      `;
      
      if (edad >= 60) {
        recomendaciones += `
          <li class="list-group-item">
            <strong>Evaluación completa de sarcopenia</strong>: Considerar evaluación complementaria de 
            masa muscular y rendimiento físico (SPPB, velocidad de marcha).
          </li>
        `;
      }
    }
    
    if (asimetria > 10) {
      recomendaciones += `
        <li class="list-group-item list-group-item-info">
          <strong>Entrenamiento bilateral equilibrado</strong>: Implementar ejercicios específicos para 
          corregir la asimetría, con mayor énfasis en el lado más débil.
        </li>
      `;
    }
    
    // Recomendaciones generales
    recomendaciones += `
      <li class="list-group-item">
        <strong>Seguimiento periódico</strong>: Evaluar la fuerza de prensión cada 3-6 meses para 
        monitorear cambios y respuesta al tratamiento.
      </li>
    `;
    
    recomendaciones += `</ul>`;
  } else {
    interpretacion = `<div class="alert alert-secondary">Complete la evaluación con dinamometría para obtener interpretación clínica.</div>`;
    recomendaciones = `<div class="alert alert-secondary">Complete la evaluación para obtener recomendaciones específicas.</div>`;
  }
  
  // Actualizar la interfaz
  document.getElementById('interpretacion-dinamometria-texto').innerHTML = interpretacion;
  document.getElementById('recomendaciones-dinamometria-texto').innerHTML = recomendaciones;
  
  // Actualizar el badge general
  const dinamometriaBadge = document.getElementById('dinamometria-badge');
  if (mejorValor > 0) {
    dinamometriaBadge.textContent = `${estadoGeneral.charAt(0).toUpperCase() + estadoGeneral.slice(1)}`;
    dinamometriaBadge.className = `resultado-badge badge bg-${colorEstado}`;
  }
}

/**
 * Crea un gráfico comparativo para los valores de handgrip
 */
function crearGraficoHandgrip(valorDer, valorIzq, valorNormativo) {
  const contenedor = document.getElementById('handgrip_grafico');
  
  // Limpiar contenedor
  contenedor.innerHTML = '';
  
  // Si no hay valores suficientes, mostrar mensaje
  if (valorDer <= 0 && valorIzq <= 0 || valorNormativo <= 0) {
    contenedor.innerHTML = '<div class="text-center text-muted">Complete los datos para generar el gráfico comparativo</div>';
    return;
  }
  
  // Crear el gráfico simple usando divs con altura proporcional
  const maxValor = Math.max(valorDer, valorIzq, valorNormativo);
  const escala = 180 / maxValor; // 180px es la altura máxima que queremos para las barras
  
  const html = `
    <div class="d-flex justify-content-around align-items-end h-100">
      <div class="d-flex flex-column align-items-center">
        <div class="bg-primary" style="width: 40px; height: ${valorDer * escala}px;"></div>
        <div class="mt-2">Der: ${valorDer.toFixed(1)}</div>
      </div>
      <div class="d-flex flex-column align-items-center">
        <div class="bg-info" style="width: 40px; height: ${valorIzq * escala}px;"></div>
        <div class="mt-2">Izq: ${valorIzq.toFixed(1)}</div>
      </div>
      <div class="d-flex flex-column align-items-center">
        <div class="bg-secondary" style="width: 40px; height: ${valorNormativo * escala}px;"></div>
        <div class="mt-2">Ref: ${valorNormativo.toFixed(1)}</div>
      </div>
    </div>
  `;
  
  contenedor.innerHTML = html;
}

/**
 * Función para agregar otra dinamometría personalizada
 */
function agregarDinamometria() {
  const container = document.getElementById('otras_dinamometrias_container');
  const numDinamometria = container.children.length + 1;
  
  const nuevaDinamometria = document.createElement('div');
  nuevaDinamometria.className = 'form-row mb-4 border-bottom pb-4';
  nuevaDinamometria.innerHTML = `
    <div class="form-col form-col-md-12 mb-3">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Nombre de la dinamometría" 
               id="otra_dinamometria_nombre_${numDinamometria}">
        <div class="input-group-append">
          <button class="btn btn-outline-danger" type="button" 
                  onclick="eliminarDinamometria(this.parentNode.parentNode.parentNode.parentNode)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="form-col form-col-md-3">
      <div class="form-group">
        <label>Lado derecho (kg)</label>
        <input type="number" class="form-control" min="0" max="200" step="0.1" 
               id="otra_dinamometria_der_${numDinamometria}">
      </div>
    </div>
    <div class="form-col form-col-md-3">
      <div class="form-group">
        <label>Lado izquierdo (kg)</label>
        <input type="number" class="form-control" min="0" max="200" step="0.1" 
               id="otra_dinamometria_izq_${numDinamometria}">
      </div>
    </div>
    <div class="form-col form-col-md-6">
      <div class="form-group">
        <label>Observaciones</label>
        <textarea class="form-control" rows="1" id="otra_dinamometria_obs_${numDinamometria}"></textarea>
      </div>
    </div>
  `;
  
  container.appendChild(nuevaDinamometria);
}

/**
 * Función para eliminar una dinamometría personalizada
 */
function eliminarDinamometria(elemento) {
  elemento.remove();
}


/**
 * SISTEMAKINE - Calculadora de Repetición Máxima (RM)
 * Implementación basada en las recomendaciones exactas de la NSCA
 * NSCA's Essentials of Personal Training, Capítulo 15
 */

// Fórmulas para calcular 1RM a partir de submáximos
const formulas1RM = {
  // Fórmula de Brzycki: 1RM = peso / (1.0278 - 0.0278 × reps)
  brzycki: function(peso, reps) {
    return peso / (1.0278 - 0.0278 * reps);
  },
  
  // Fórmula de Epley: 1RM = peso × (1 + 0.0333 × reps)
  epley: function(peso, reps) {
    return peso * (1 + 0.0333 * reps);
  },
  
  // Fórmula de Lander: 1RM = 100 × peso / (101.3 - 2.67123 × reps)
  lander: function(peso, reps) {
    return 100 * peso / (101.3 - 2.67123 * reps);
  },
  
  // Fórmula de Lombardi: 1RM = peso × reps^0.1
  lombardi: function(peso, reps) {
    return peso * Math.pow(reps, 0.1);
  },
  
  // Fórmula de O'Conner: 1RM = peso × (1 + 0.025 × reps)
  oconner: function(peso, reps) {
    return peso * (1 + 0.025 * reps);
  },
  
  // Fórmula de Wathen: 1RM = 100 × peso / (48.8 + 53.8 × e^(-0.075 × reps))
  wathen: function(peso, reps) {
    return 100 * peso / (48.8 + 53.8 * Math.exp(-0.075 * reps));
  },
  
  // Promedio de todas las fórmulas
  promedio: function(peso, reps) {
    const valores = [
      this.brzycki(peso, reps),
      this.epley(peso, reps),
      this.lander(peso, reps),
      this.lombardi(peso, reps),
      this.oconner(peso, reps),
      this.wathen(peso, reps)
    ];
    return valores.reduce((sum, value) => sum + value, 0) / valores.length;
  }
};

// Tablas relacionadas con RPE/RIR para calcular 1RM
// Estas son herramientas modernas, compatibles con NSCA pero no explícitamente descritas en el capítulo 15
const tablaRPEaRIR = {
  10: 0,     // RPE 10 = 0 repeticiones en reserva (fallo muscular)
  9.5: 0.5,  // RPE 9.5 = 0.5 repeticiones en reserva
  9: 1,      // RPE 9 = 1 repetición en reserva
  8.5: 1.5,  // RPE 8.5 = 1.5 repeticiones en reserva
  8: 2,      // RPE 8 = 2 repeticiones en reserva
  7.5: 2.5,  // RPE 7.5 = 2.5 repeticiones en reserva
  7: 3,      // RPE 7 = 3 repeticiones en reserva
  6: 4,      // RPE 6 = 4 repeticiones en reserva
  5: 5,      // RPE 5 = 5 repeticiones en reserva
  4: 6,      // RPE 4 = 6 repeticiones en reserva
  3: 7,      // RPE 3 = 7 repeticiones en reserva
  2: 8,      // RPE 2 = 8 repeticiones en reserva
  1: 9       // RPE 1 = 9 repeticiones en reserva
};

// Tablas de porcentajes para RPE/RIR
const tablaRPEaPorcentaje1RM = {
  1: {10: 100, 9.5: 98, 9: 96, 8.5: 94, 8: 92, 7.5: 90, 7: 88},
  2: {10: 95, 9.5: 93, 9: 91, 8.5: 89, 8: 87, 7.5: 85, 7: 83},
  3: {10: 92, 9.5: 90, 9: 88, 8.5: 86, 8: 84, 7.5: 82, 7: 80},
  4: {10: 89, 9.5: 87, 9: 85, 8.5: 83, 8: 81, 7.5: 79, 7: 77},
  5: {10: 86, 9.5: 84, 9: 82, 8.5: 80, 8: 78, 7.5: 76, 7: 74},
  6: {10: 84, 9.5: 82, 9: 80, 8.5: 78, 8: 76, 7.5: 74, 7: 72},
  7: {10: 82, 9.5: 80, 9: 78, 8.5: 76, 8: 74, 7.5: 72, 7: 70},
  8: {10: 80, 9.5: 78, 9: 76, 8.5: 74, 8: 72, 7.5: 70, 7: 68},
  9: {10: 78, 9.5: 76, 9: 74, 8.5: 72, 8: 70, 7.5: 68, 7: 66},
  10: {10: 76, 9.5: 74, 9: 72, 8.5: 70, 8: 68, 7.5: 66, 7: 64},
  12: {10: 72, 9.5: 70, 9: 68, 8.5: 66, 8: 64, 7.5: 62, 7: 60},
  15: {10: 68, 9.5: 66, 9: 64, 8.5: 62, 8: 60, 7.5: 58, 7: 56}
};

// RIR a porcentaje (simplificado de RPE)
const tablaRIRaPorcentaje1RM = {
  1: {0: 100, 1: 96, 2: 92, 3: 88, 4: 85, 5: 82, 6: 80},
  2: {0: 95, 1: 91, 2: 87, 3: 83, 4: 80, 5: 77, 6: 75},
  3: {0: 92, 1: 88, 2: 84, 3: 80, 4: 77, 5: 74, 6: 72},
  4: {0: 89, 1: 85, 2: 81, 3: 77, 4: 74, 5: 71, 6: 69},
  5: {0: 86, 1: 82, 2: 78, 3: 74, 4: 71, 5: 68, 6: 66},
  6: {0: 84, 1: 80, 2: 76, 3: 72, 4: 69, 5: 66, 6: 64},
  7: {0: 82, 1: 78, 2: 74, 3: 70, 4: 67, 5: 64, 6: 62},
  8: {0: 80, 1: 76, 2: 72, 3: 68, 4: 65, 5: 62, 6: 60},
  9: {0: 78, 1: 74, 2: 70, 3: 66, 4: 63, 5: 60, 6: 58},
  10: {0: 76, 1: 72, 2: 68, 3: 64, 4: 61, 5: 58, 6: 56},
  12: {0: 72, 1: 68, 2: 64, 3: 60, 4: 57, 5: 54, 6: 52},
  15: {0: 68, 1: 64, 2: 60, 3: 56, 4: 53, 5: 50, 6: 48}
};

// Clasificación de ejercicios según NSCA (pág. 400-401)
const clasificacionEjercicios = {
  // Ejercicios principales (core exercises)
  "Press banca": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Sentadilla": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  "Peso muerto": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  "Press hombro": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Leg press": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  "Remo con barra": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Dominadas": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Press de banca inclinado": { tipo: "core", grupoMuscular: "upper", multiarticular: true },
  "Hip thrust": { tipo: "core", grupoMuscular: "lower", multiarticular: true },
  
  // Ejercicios de asistencia (assistance exercises)
  "Curl bíceps": { tipo: "assistance", grupoMuscular: "upper", multiarticular: false },
  "Extensión tríceps": { tipo: "assistance", grupoMuscular: "upper", multiarticular: false },
  "Extensión rodilla": { tipo: "assistance", grupoMuscular: "lower", multiarticular: false },
  "Flexión rodilla": { tipo: "assistance", grupoMuscular: "lower", multiarticular: false },
  "Curl de piernas": { tipo: "assistance", grupoMuscular: "lower", multiarticular: false }
};

// Objetivos de entrenamiento según NSCA con rangos porcentuales exactos (Tabla 15.6, pág. 409)
const objetivosEntrenamiento = {
  "Fuerza máxima": {
    rangoMin: 85,
    rangoMax: 100,
    repeticiones: "1-6",
    series: "1-3 (novato), 3+ (intermedio/avanzado)",
    descanso: "2-5 minutos",
    frecuencia: "2-3 veces/semana",
    descripcion: "Desarrollo de la capacidad para generar máxima tensión muscular",
    color: "danger" // Rojo en sistema de semáforo (alta intensidad)
  },
  "Hipertrofia": {
    rangoMin: 67,
    rangoMax: 85,
    repeticiones: "6-12",
    series: "1-3 (novato), 3+ (intermedio/avanzado)",
    descanso: "≥2-3 min (ejercicios multiarticulares), 60-90 segundos (ejercicios monoarticulares)",
    frecuencia: "2-3 veces/semana por grupo muscular",
    descripcion: "Aumento del tamaño muscular y tono",
    color: "warning" // Amarillo en sistema de semáforo (intensidad media)
  },
  "Resistencia muscular": {
    rangoMin: 50,
    rangoMax: 67,
    repeticiones: "12-20+",
    series: "1-3 (novato), 3+ (intermedio/avanzado)",
    descanso: "≤30 segundos",
    frecuencia: "2-3 veces/semana por grupo muscular",
    descripcion: "Mejora de la capacidad para realizar esfuerzos repetidos",
    color: "success" // Verde en sistema de semáforo (baja intensidad)
  },
  "Potencia": {
    rangoMin: 30,
    rangoMax: 60,
    repeticiones: "3-6",
    series: "1-3 (novato), 3-6 (intermedio/avanzado)",
    descanso: "2-5 minutos",
    frecuencia: "2-3 veces/semana",
    caracteristica: "Máxima velocidad de ejecución",
    descripcion: "Desarrollo de la velocidad y capacidad explosiva",
    color: "primary" // Azul (diferenciado, enfoque en velocidad de ejecución)
  }
};

// Recomendaciones de frecuencia según nivel exactamente como en NSCA (Tabla 15.2, pág. 399)
const frecuenciaEntrenamiento = {
  "Novato o principiante": "2-3 sesiones por semana (cuerpo completo)",
  "Intermedio": "3 sesiones si usa entrenamiento de cuerpo completo, 4 sesiones si usa rutina dividida",
  "Avanzado": "3-6 sesiones por semana"
};

// Recomendaciones de progresión según nivel (adaptado directamente de NSCA, capítulo 15)
const recomendacionesProgresion = {
  "Principiante": {
    // Datos basados en la clasificación NSCA (pág. 396, tabla 15.1)
    experiencia: "Menos de 2 meses de entrenamiento regular",
    frecuencia: "2-3 días por semana (cuerpo completo)",
    // Datos de incremento de cargas basados en pág. 410, tabla 15.7
    incrementoAbsoluto: {
      upper: {
        core: "2.5-5 lb (1-2 kg)",
        assistance: "1.25-2.5 lb (0.5-1 kg)"
      },
      lower: {
        core: "10-15 lb (4-7 kg)",
        assistance: "5-10 lb (2-4 kg)"
      }
    },
    incrementoRelativo: {
      upper: {
        core: "2.5%",
        assistance: "1-2%"
      },
      lower: {
        core: "5%",
        assistance: "2.5-5%"
      }
    },
    consideraciones: "Enfoque en la técnica correcta, aprender patrones básicos de movimiento. Use la regla 2-for-2 para progresión."
  },
  "Intermedio": {
    // Datos basados en la clasificación NSCA (pág. 396, tabla 15.1)
    experiencia: "De 2 meses a 1 año de entrenamiento regular",
    frecuencia: "3-4 días por semana (cuerpo completo o rutina dividida)",
    // Datos de incremento de cargas basados en pág. 410, tabla 15.7
    incrementoAbsoluto: {
      upper: {
        core: "5-10+ lb (2-4+ kg)",
        assistance: "5-10 lb (2-4 kg)"
      },
      lower: {
        core: "15-20+ lb (7-9+ kg)",
        assistance: "10-15 lb (4-7 kg)"
      }
    },
    incrementoRelativo: {
      upper: {
        core: "2.5-5+%",
        assistance: "2.5-5%"
      },
      lower: {
        core: "5-10+%",
        assistance: "5-10%"
      }
    },
    consideraciones: "Implementar rutinas divididas, variar volumen e intensidad. Seguir la regla 2-for-2 para progresión."
  },
  "Avanzado": {
    // Datos basados en la clasificación NSCA (pág. 396, tabla 15.1)
    experiencia: "Más de 1 año de entrenamiento regular",
    frecuencia: "3-6 días por semana (generalmente rutina dividida)",
    // El PDF no especifica incrementos absolutos para avanzados, pero menciona menores incrementos
    consideraciones: "Usar periodización compleja, variación planificada, mayor especificidad. Implementar ciclos de carga-descarga con ratio 3:1 o 2:1."
  }
};

// Ajustes de cargas usando la regla 2-for-2 (pág. 411, tabla 15.8)
const regla2For2 = {
  descripcion: "Incrementar el peso cuando el cliente pueda realizar 2 repeticiones más que el objetivo en 2 sesiones consecutivas",
  ejemplo: "Si el objetivo es 10 repeticiones y el cliente realiza 12 repeticiones en dos sesiones consecutivas, incrementar el peso para la siguiente sesión"
};

/**
 * Calcula 1RM usando la fórmula seleccionada basado en repeticiones
 */
function calcular1RM() {
  // Obtener los valores del formulario
  const ejercicio = document.getElementById('rm_ejercicio').value;
  const ejercicioOtro = document.getElementById('rm_ejercicio_otro').value;
  const ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
  
  const peso = parseFloat(document.getElementById('rm_peso').value);
  const repeticiones = parseInt(document.getElementById('rm_repeticiones').value);
  const formulaSeleccionada = document.getElementById('rm_formula').value;
  const nivelSeleccionado = document.getElementById('rm_nivel').value;
  
  // Validar la entrada
  if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || peso <= 0 || repeticiones <= 0) {
    alert('Por favor, complete todos los campos con valores válidos.');
    return;
  }
  
  // Limitar repeticiones a un máximo de 15 para mayor precisión
  if (repeticiones > 15) {
    alert('Para mayor precisión, ingrese un número de repeticiones entre 1 y 15.');
    return;
  }
  
  // Calcular 1RM con la fórmula seleccionada
  let valor1RM = 0;
  
  if (formulaSeleccionada === 'promedio') {
    valor1RM = formulas1RM.promedio(peso, repeticiones);
  } else {
    valor1RM = formulas1RM[formulaSeleccionada](peso, repeticiones);
  }
  
  // Redondear a 1 decimal para facilitar la visualización
  valor1RM = Math.round(valor1RM * 10) / 10;
  
  // Actualizar la interfaz
  document.getElementById('valor_1rm').textContent = valor1RM + ' kg';
  document.getElementById('metodo_calculo').textContent = `Basado en la fórmula: ${formulaSeleccionada}`;
  
  // Generar tabla de cargas de entrenamiento
  generarTablaCargas(valor1RM, ejercicioNombre);
  
  // Generar recomendaciones basadas en NSCA
  generarRecomendaciones(valor1RM, ejercicioNombre, peso, repeticiones, nivelSeleccionado, 'formula');
  
  // Mostrar el contenedor de resultados
  document.getElementById('resultado_1rm_container').style.display = 'block';
}

/**
 * Calcula 1RM usando el método RPE (Rating of Perceived Exertion)
 */
function calcular1RMporRPE() {
  // Obtener los valores del formulario
  const ejercicio = document.getElementById('rpe_ejercicio').value;
  const ejercicioOtro = document.getElementById('rpe_ejercicio_otro') ? document.getElementById('rpe_ejercicio_otro').value : '';
  const ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
  
  const peso = parseFloat(document.getElementById('rpe_peso').value);
  const repeticiones = parseInt(document.getElementById('rpe_repeticiones').value);
  const rpeValor = parseFloat(document.getElementById('rpe_valor').value);
  
  // Validar la entrada
  if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rpeValor) || 
      peso <= 0 || repeticiones <= 0 || rpeValor < 1 || rpeValor > 10) {
    alert('Por favor, complete todos los campos con valores válidos. RPE debe estar entre 1 y 10.');
    return;
  }
  
  // Limitar repeticiones a un máximo de 15 para mayor precisión
  if (repeticiones > 15) {
    alert('Para mayor precisión, ingrese un número de repeticiones entre 1 y 15.');
    return;
  }
  
  // Determinar el porcentaje de 1RM basado en RPE y repeticiones
  let porcentaje = 0;
  
  // Ajustar las repeticiones a las disponibles en la tabla
  let repsAjustadas = repeticiones;
  if (repeticiones > 10 && repeticiones < 15) {
    repsAjustadas = 12;
  } else if (repeticiones > 12) {
    repsAjustadas = 15;
  }
  
  // Ajustar el RPE a los valores disponibles en la tabla
  let rpeAjustado = Math.floor(rpeValor * 2) / 2; // Redondear a 0.5 más cercano
  if (rpeAjustado < 7) rpeAjustado = 7; // Valor mínimo en nuestra tabla
  if (rpeAjustado > 10) rpeAjustado = 10; // Valor máximo en nuestra tabla
  
  // Obtener el porcentaje de la tabla
  if (tablaRPEaPorcentaje1RM[repsAjustadas] && tablaRPEaPorcentaje1RM[repsAjustadas][rpeAjustado]) {
    porcentaje = tablaRPEaPorcentaje1RM[repsAjustadas][rpeAjustado];
  } else {
    // Calcular un valor aproximado si no está en la tabla
    // Encontrar los valores más cercanos
    const repsDisponibles = Object.keys(tablaRPEaPorcentaje1RM).map(Number);
    const repCercana = repsDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - repeticiones) < Math.abs(prev - repeticiones) ? curr : prev)
    );
    
    const rpesDisponibles = Object.keys(tablaRPEaPorcentaje1RM[repCercana]).map(Number);
    const rpeCercano = rpesDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - rpeValor) < Math.abs(prev - rpeValor) ? curr : prev)
    );
    
    porcentaje = tablaRPEaPorcentaje1RM[repCercana][rpeCercano];
  }
  
  // Calcular 1RM basado en el porcentaje
  const valor1RM = Math.round((peso / (porcentaje / 100)) * 10) / 10;
  
  // Actualizar la interfaz
  document.getElementById('valor_1rm').textContent = valor1RM + ' kg';
  document.getElementById('metodo_calculo').textContent = `Basado en RPE: ${rpeValor} con ${repeticiones} repeticiones`;
  
  // Generar tabla de cargas de entrenamiento
  generarTablaCargas(valor1RM, ejercicioNombre);
  
  // Generar recomendaciones basadas en NSCA
  generarRecomendaciones(valor1RM, ejercicioNombre, peso, repeticiones, 'Intermedio', 'rpe');
  
  // Mostrar el contenedor de resultados
  document.getElementById('resultado_1rm_container').style.display = 'block';
}

/**
 * Calcula 1RM usando el método RIR (Repetitions in Reserve)
 */
function calcular1RMporRIR() {
  // Obtener los valores del formulario
  const ejercicio = document.getElementById('rir_ejercicio').value;
  const ejercicioOtro = document.getElementById('rir_ejercicio_otro') ? document.getElementById('rir_ejercicio_otro').value : '';
  const ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
  
  const peso = parseFloat(document.getElementById('rir_peso').value);
  const repeticiones = parseInt(document.getElementById('rir_repeticiones').value);
  const rirValor = parseInt(document.getElementById('rir_valor').value);
  
  // Validar la entrada
  if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rirValor) || 
      peso <= 0 || repeticiones <= 0 || rirValor < 0 || rirValor > 6) {
    alert('Por favor, complete todos los campos con valores válidos. RIR debe estar entre 0 y 6.');
    return;
  }
  
  // Limitar repeticiones a un máximo de 15 para mayor precisión
  if (repeticiones > 15) {
    alert('Para mayor precisión, ingrese un número de repeticiones entre 1 y 15.');
    return;
  }
  
  // Determinar el porcentaje de 1RM basado en RIR y repeticiones
  let porcentaje = 0;
  
  // Ajustar las repeticiones a las disponibles en la tabla
  let repsAjustadas = repeticiones;
  if (repeticiones > 10 && repeticiones < 15) {
    repsAjustadas = 12;
  } else if (repeticiones > 12) {
    repsAjustadas = 15;
  }
  
  // Obtener el porcentaje de la tabla
  if (tablaRIRaPorcentaje1RM[repsAjustadas] && tablaRIRaPorcentaje1RM[repsAjustadas][rirValor]) {
    porcentaje = tablaRIRaPorcentaje1RM[repsAjustadas][rirValor];
  } else {
    // Calcular un valor aproximado si no está en la tabla
    // Encontrar los valores más cercanos
    const repsDisponibles = Object.keys(tablaRIRaPorcentaje1RM).map(Number);
    const repCercana = repsDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - repeticiones) < Math.abs(prev - repeticiones) ? curr : prev)
    );
    
    const rirsDisponibles = Object.keys(tablaRIRaPorcentaje1RM[repCercana]).map(Number);
    const rirCercano = rirsDisponibles.reduce((prev, curr) => 
      (Math.abs(curr - rirValor) < Math.abs(prev - rirValor) ? curr : prev)
    );
    
    porcentaje = tablaRIRaPorcentaje1RM[repCercana][rirCercano];
  }
  
  // Calcular 1RM basado en el porcentaje
  const valor1RM = Math.round((peso / (porcentaje / 100)) * 10) / 10;
  
  // Actualizar la interfaz
  document.getElementById('valor_1rm').textContent = valor1RM + ' kg';
  document.getElementById('metodo_calculo').textContent = `Basado en RIR: ${rirValor} con ${repeticiones} repeticiones`;
  
  // Generar tabla de cargas de entrenamiento
  generarTablaCargas(valor1RM, ejercicioNombre);
  
  // Generar recomendaciones basadas en NSCA
  generarRecomendaciones(valor1RM, ejercicioNombre, peso, repeticiones, 'Intermedio', 'rir');
  
  // Mostrar el contenedor de resultados
  document.getElementById('resultado_1rm_container').style.display = 'block';
}

/**
 * Genera la tabla de cargas de entrenamiento basada en el 1RM calculado
 * Siguiendo exactamente los rangos de la NSCA (tabla 15.6, pág. 409)
 */
function generarTablaCargas(rm, ejercicio) {
  const tablaCargas = document.getElementById('tabla_cargas');
  tablaCargas.innerHTML = '';
  
  // Determinar si el ejercicio es multiarticular o de asistencia
  let tipoEjercicio = "assistance"; // Por defecto
  if (clasificacionEjercicios[ejercicio]) {
    tipoEjercicio = clasificacionEjercicios[ejercicio].tipo;
  }
  
  // Generar filas para cada objetivo de entrenamiento
  for (const [objetivo, datos] of Object.entries(objetivosEntrenamiento)) {
    // Calcular el punto medio del rango
    const porcentajeMedio = (datos.rangoMin + datos.rangoMax) / 2;
    const cargaMedia = Math.round(rm * porcentajeMedio / 100);
    
    // Añadir fila a la tabla
    const row = document.createElement('tr');
    row.className = `table-${datos.color}`;
    
    row.innerHTML = `
      <td><strong>${objetivo}</strong></td>
      <td>${datos.rangoMin}-${datos.rangoMax}%</td>
      <td>${cargaMedia} kg</td>
      <td>${datos.repeticiones}</td>
      <td>${datos.descripcion}</td>
    `;
    
    tablaCargas.appendChild(row);
  }
}

/**
 * Genera recomendaciones personalizadas basadas en NSCA
 */
function generarRecomendaciones(rm, ejercicio, pesoActual, repeticionesActuales, nivelSeleccionado, metodo) {
  const containerRecomendaciones = document.getElementById('recomendaciones_rm');
  
  // Determinar tipo de ejercicio y grupo muscular
  let tipoEjercicio = "assistance";
  let grupoMuscular = "upper";
  let esMultiarticular = false;
  
  if (clasificacionEjercicios[ejercicio]) {
    tipoEjercicio = clasificacionEjercicios[ejercicio].tipo;
    grupoMuscular = clasificacionEjercicios[ejercicio].grupoMuscular;
    esMultiarticular = clasificacionEjercicios[ejercicio].multiarticular;
  }
  
  // Determinar nivel de entrenamiento
  let nivel = nivelSeleccionado;
  let nivelNormalizado = "Principiante";
  
  if (nivel === "Intermedio") {
    nivelNormalizado = "Intermedio";
  } else if (nivel === "Avanzado") {
    nivelNormalizado = "Avanzado";
  }
  
  // Si se usó RPE o RIR, estimar nivel basado en eso también
  if (metodo === 'rpe' || metodo === 'rir') {
    // Los usuarios de RPE/RIR suelen ser al menos de nivel intermedio
    if (nivelNormalizado === 'Principiante') {
      nivelNormalizado = 'Intermedio';
    }
  }
  
  // Recomendaciones específicas de incremento basadas en NSCA (tabla 15.7, pág. 410)
  const recomendacionIncremento = recomendacionesProgresion[nivelNormalizado].incrementoAbsoluto ?
    recomendacionesProgresion[nivelNormalizado].incrementoAbsoluto[grupoMuscular][tipoEjercicio] :
    "Incrementos personalizados basados en adaptación";
  
  const recomendacionIncrementoPorcentaje = recomendacionesProgresion[nivelNormalizado].incrementoRelativo ?
    recomendacionesProgresion[nivelNormalizado].incrementoRelativo[grupoMuscular][tipoEjercicio] :
    "Incrementos pequeños (1-2.5%)";
  
  // Generar HTML con recomendaciones
  let recomendacionesHTML = `
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Recomendaciones para Prescripción según NSCA</h5>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <strong>1RM Estimado:</strong> ${rm} kg para ${ejercicio}<br>
          <strong>Nivel:</strong> ${nivel}<br>
          <strong>Tipo de Ejercicio:</strong> ${tipoEjercicio === "core" ? "Ejercicio Principal" : "Ejercicio de Asistencia"}<br>
          <strong>Grupo Muscular:</strong> ${grupoMuscular === "upper" ? "Tren Superior" : "Tren Inferior"}<br>
          <strong>Método de Cálculo:</strong> ${metodo === 'formula' ? 'Fórmula tradicional' : (metodo === 'rpe' ? 'RPE (Valoración de Esfuerzo Percibido)' : 'RIR (Repeticiones en Reserva)')}
        </div>
        
        <h6>Recomendaciones de Entrenamiento (NSCA)</h6>
        <ul class="list-group mb-3">
          <li class="list-group-item">
            <strong>Frecuencia:</strong> ${frecuenciaEntrenamiento[nivel === "Principiante" ? "Novato o principiante" : nivelNormalizado]}
          </li>
          <li class="list-group-item">
            <strong>Incremento de Carga Recomendado:</strong> ${recomendacionIncremento} (${recomendacionIncrementoPorcentaje} del peso actual)
          </li>
          <li class="list-group-item">
            <strong>Progresión:</strong> Siga la regla 2-for-2: Aumente el peso cuando pueda realizar 2 repeticiones más que el objetivo en 2 sesiones consecutivas.
          </li>
          <li class="list-group-item">
            <strong>Consideraciones:</strong> ${recomendacionesProgresion[nivelNormalizado].consideraciones}
          </li>
        </ul>
  `;
  
  // Añadir recomendaciones específicas basadas en el tipo de ejercicio (NSCA, pág. 400-401)
  if (tipoEjercicio === "core" && esMultiarticular) {
    recomendacionesHTML += `
      <div class="alert alert-success">
        <h6><i class="fas fa-check-circle"></i> Recomendaciones Específicas (NSCA):</h6>
        <p>Este es un ejercicio multiarticular principal. Según la NSCA, estos ejercicios son más efectivos para el desarrollo general porque reclutan grandes músculos mientras activan sinergistas.</p>
        <p>Para seguir las recomendaciones de la NSCA:</p>
        <ul>
          <li>Coloque este ejercicio al inicio de su rutina cuando hay menos fatiga (pág. 402)</li>
          <li>Utilice un volumen adecuado: ${objetivosEntrenamiento["Fuerza máxima"].series} series para desarrollo de fuerza</li>
          <li>Descanso entre series: ${objetivosEntrenamiento["Fuerza máxima"].descanso} para ejercicios de fuerza máxima</li>
          <li>Orden de ejercicios recomendado: Potencia → Core → Asistencia (pág. 402, Tabla 15.3)</li>
          ${grupoMuscular === "lower" ? '<li>Para entrenamiento dividido (split), coordine los días de entrenamiento para permitir recuperación adecuada</li>' : '<li>Permita al menos 48 horas de recuperación antes de entrenar el mismo grupo muscular nuevamente</li>'}
        </ul>
      </div>
    `;
  } else {
    recomendacionesHTML += `
      <div class="alert alert-warning">
        <h6><i class="fas fa-info-circle"></i> Recomendaciones Específicas (NSCA):</h6>
        <p>Este es un ejercicio de asistencia. Según la NSCA, estos ejercicios son suplementarios y generalmente involucran un solo grupo muscular o articulación (pág. 401).</p>
        <p>Para seguir las recomendaciones de la NSCA:</p>
        <ul>
          <li>Realice este ejercicio después de los ejercicios principales multiarticulares (pág. 402)</li>
          <li>Considere un volumen moderado: ${objetivosEntrenamiento["Hipertrofia"].series} series para desarrollo de hipertrofia</li>
          <li>Descanso entre series: ${objetivosEntrenamiento["Hipertrofia"].descanso} para ejercicios de hipertrofia</li>
          <li>Para ejercicios de asistencia, considere cargas menores: aproximadamente 8RM para ejercicios de asistencia (pág. 409)</li>
          <li>Utilice este ejercicio para corregir desequilibrios o reforzar músculos específicos</li>
        </ul>
      </div>
    `;
  }
  
  // Añadir recomendaciones específicas para el método de cálculo utilizado
  if (metodo === 'rpe') {
    recomendacionesHTML += `
      <div class="alert alert-info">
        <h6><i class="fas fa-tachometer-alt"></i> Sobre el uso de RPE:</h6>
        <p>El uso de RPE (Rating of Perceived Exertion) no está explícitamente descrito en el capítulo 15 de NSCA, pero es compatible con el método de Repeticiones en Reserva (RIR) mencionado en la pág. 407:</p>
        <ul>
          <li>RPE 10 corresponde a 0 RIR (fallo muscular)</li>
          <li>RPE 9 corresponde a 1 RIR</li>
          <li>RPE 8 corresponde a 2 RIR</li>
          <li>RPE 7 corresponde a 3 RIR</li>
        </ul>
        <p>Esto puede utilizarse junto con el método de RM para prescripción de cargas.</p>
      </div>
    `;
  } else if (metodo === 'rir') {
    recomendacionesHTML += `
      <div class="alert alert-info">
        <h6><i class="fas fa-battery-three-quarters"></i> Sobre el uso de RIR:</h6>
        <p>La NSCA describe el método de Repeticiones en Reserva (RIR) en la pág. 407 como "repeticiones en reserva" o "entrenamiento sin fallo":</p>
        <ul>
          <li>0 RIR significa entrenamiento hasta el fallo muscular</li>
          <li>1-3 RIR es ideal para desarrollo de fuerza e hipertrofia</li>
          <li>Según la pág. 407, "entrenar a pocas repeticiones del fallo produce menores niveles de fatiga o dolor muscular"</li>
          <li>Para principiantes, la NSCA recomienda no entrenar hasta el fallo frecuentemente</li>
        </ul>
      </div>
    `;
  }
  
  // Añadir recomendaciones de seguridad de NSCA (pág. 405)
  recomendacionesHTML += `
    <div class="alert alert-danger">
      <h6><i class="fas fa-exclamation-triangle"></i> Consideraciones de Seguridad (NSCA):</h6>
      <ul>
        <li>Las estimaciones de 1RM varían en precisión según el tipo de ejercicio, población y nivel de entrenamiento.</li>
        <li>Estas estimaciones son menos precisas cuando las repeticiones superan las 10 (pág. 406).</li>
        <li>"Si el cliente no puede realizar correctamente un ejercicio, las regresiones, máquinas asistidas o mecánica adecuada deben ser prioridad" (pág. 405).</li>
        <li>La NSCA enfatiza en la pág. 409: "Aunque puede haber beneficios de entrenar hasta el fallo, es prudente secuenciar el entrenamiento del cliente."</li>
        <li>Según la pág. 405: "El esfuerzo individual del cliente debe ser monitorizado para asegurar que las últimas repeticiones sean desafiantes pero no comprometan la técnica adecuada."</li>
      </ul>
    </div>
  `;
  
  recomendacionesHTML += `
      </div>
    </div>
  `;
  
  // Actualizar el contenedor
  containerRecomendaciones.innerHTML = recomendacionesHTML;
  containerRecomendaciones.style.display = 'block';
}

/**
 * Guarda la evaluación actual en el historial
 */
function guardarRM() {
  // Determinar qué método está siendo utilizado
  let ejercicioNombre, peso, valor, metodo, valor1RM;
  
  // Pestaña activa
  const pestanaActiva = document.querySelector('.tab-pane.active');
  const idPestana = pestanaActiva.id;
  
  if (idPestana === 'reps-content') {
    const ejercicio = document.getElementById('rm_ejercicio').value;
    const ejercicioOtro = document.getElementById('rm_ejercicio_otro').value;
    ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
    
    peso = parseFloat(document.getElementById('rm_peso').value);
    const repeticiones = parseInt(document.getElementById('rm_repeticiones').value);
    const formula = document.getElementById('rm_formula').value;
    
    valor = `${repeticiones} reps`;
    metodo = `Fórmula: ${formula}`;
    
    // Validar datos
    if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || peso <= 0 || repeticiones <= 0) {
      alert('Complete todos los campos antes de guardar la evaluación.');
      return;
    }
    
    // Calcular 1RM
    if (formula === 'promedio') {
      valor1RM = formulas1RM.promedio(peso, repeticiones);
    } else {
      valor1RM = formulas1RM[formula](peso, repeticiones);
    }
  } 
  else if (idPestana === 'rpe-content') {
    const ejercicio = document.getElementById('rpe_ejercicio').value;
    const ejercicioOtro = document.getElementById('rpe_ejercicio_otro') ? document.getElementById('rpe_ejercicio_otro').value : '';
    ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
    
    peso = parseFloat(document.getElementById('rpe_peso').value);
    const repeticiones = parseInt(document.getElementById('rpe_repeticiones').value);
    const rpeValor = parseFloat(document.getElementById('rpe_valor').value);
    
    valor = `${repeticiones} reps, RPE ${rpeValor}`;
    metodo = 'RPE';
    
    // Validar datos
    if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rpeValor) || peso <= 0 || repeticiones <= 0) {
      alert('Complete todos los campos antes de guardar la evaluación.');
      return;
    }
    
    // Usar el valor 1RM ya calculado (si existe)
    valor1RM = parseFloat(document.getElementById('valor_1rm').textContent);
  }
  else if (idPestana === 'rir-content') {
    const ejercicio = document.getElementById('rir_ejercicio').value;
    const ejercicioOtro = document.getElementById('rir_ejercicio_otro') ? document.getElementById('rir_ejercicio_otro').value : '';
    ejercicioNombre = ejercicio === 'Otro' ? ejercicioOtro : ejercicio;
    
    peso = parseFloat(document.getElementById('rir_peso').value);
    const repeticiones = parseInt(document.getElementById('rir_repeticiones').value);
    const rirValor = parseInt(document.getElementById('rir_valor').value);
    
    valor = `${repeticiones} reps, RIR ${rirValor}`;
    metodo = 'RIR';
    
    // Validar datos
    if (!ejercicioNombre || isNaN(peso) || isNaN(repeticiones) || isNaN(rirValor) || peso <= 0 || repeticiones <= 0) {
      alert('Complete todos los campos antes de guardar la evaluación.');
      return;
    }
    
    // Usar el valor 1RM ya calculado (si existe)
    valor1RM = parseFloat(document.getElementById('valor_1rm').textContent);
  }
  else {
    alert('No se pudo determinar el método de cálculo activo.');
    return;
  }
  
  // Si aún no tenemos un valor 1RM válido, salir
  if (isNaN(valor1RM) || valor1RM <= 0) {
    alert('Primero debe calcular el 1RM antes de guardar.');
    return;
  }
  
  valor1RM = Math.round(valor1RM * 10) / 10;
  
  // Fecha actual
  const fechaActual = new Date().toLocaleDateString();
  
  // Crear nueva fila en la tabla de historial
  const historialRM = document.getElementById('historial_rm');
  const newRow = document.createElement('tr');
  
  newRow.innerHTML = `
    <td>${ejercicioNombre}</td>
    <td>${fechaActual}</td>
    <td>${peso} kg</td>
    <td>${valor}</td>
    <td>${valor1RM} kg</td>
    <td>${metodo}</td>
    <td>
      <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarRegistroRM(this)">
        <i class="fas fa-trash"></i>
      </button>
    </td>
  `;
  
  historialRM.appendChild(newRow);
  
  // Opcional: Guardar en localStorage o base de datos
  guardarHistorialRM();
  
  // Actualizar el badge de la sección
  const badge = document.getElementById('rm-calculator-badge');
  badge.textContent = 'Completado';
  badge.className = 'resultado-badge badge bg-success';
  
  alert('Evaluación guardada correctamente.');
}

/**
 * Elimina un registro del historial de RM
 */
function eliminarRegistroRM(button) {
  if (confirm('¿Está seguro de que desea eliminar este registro?')) {
    const row = button.closest('tr');
    row.remove();
    
    // Actualizar almacenamiento
    guardarHistorialRM();
  }
}

/**
 * Guarda el historial de RM en localStorage (simplificado)
 * En una implementación real, esto se conectaría con Firebase
 */
function guardarHistorialRM() {
  // Implementación simplificada - en la versión real se usaría Firebase
  console.log('Historial actualizado - en versión final se guardaría en Firebase');
}

/**
 * Manejador para mostrar/ocultar el campo de "otro ejercicio"
 */
function manejarCambioEjercicio(selectId, otroId) {
  const ejercicio = document.getElementById(selectId);
  const otroEjercicio = document.getElementById(otroId);
  
  if (ejercicio && otroEjercicio) {
    if (ejercicio.value === 'Otro') {
      otroEjercicio.style.display = 'block';
    } else {
      otroEjercicio.style.display = 'none';
    }
  }
}

/**
 * Inicialización de la calculadora
 */
function inicializarCalculadoraRM() {
  // Configurar eventos para todos los selectores de ejercicio
  document.getElementById('rm_ejercicio').addEventListener('change', function() {
    manejarCambioEjercicio('rm_ejercicio', 'rm_ejercicio_otro');
  });
  
  if (document.getElementById('rpe_ejercicio')) {
    document.getElementById('rpe_ejercicio').addEventListener('change', function() {
      manejarCambioEjercicio('rpe_ejercicio', 'rpe_ejercicio_otro');
    });
  }
  
  if (document.getElementById('rir_ejercicio')) {
    document.getElementById('rir_ejercicio').addEventListener('change', function() {
      manejarCambioEjercicio('rir_ejercicio', 'rir_ejercicio_otro');
    });
  }
  
  // Inicializar estado
  manejarCambioEjercicio('rm_ejercicio', 'rm_ejercicio_otro');
}

// Ejecutar inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarCalculadoraRM);
