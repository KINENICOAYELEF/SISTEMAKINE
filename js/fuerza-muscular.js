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
