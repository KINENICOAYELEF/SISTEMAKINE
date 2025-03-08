// Funciones para evaluación antropométrica
document.addEventListener('DOMContentLoaded', function() {
  // Calcular IMC cuando se ingresan peso y talla
  const pesoInput = document.getElementById('peso');
  const tallaInput = document.getElementById('talla');
  const imcInput = document.getElementById('imc');
  
  if (pesoInput && tallaInput && imcInput) {
    pesoInput.addEventListener('input', calcularIMC);
    tallaInput.addEventListener('input', calcularIMC);
  }
  
  // Calcular diferencias en medidas bilaterales
  const medicionesLaterales = document.querySelectorAll('.side-measurement');
  if (medicionesLaterales.length > 0) {
    medicionesLaterales.forEach(input => {
      input.addEventListener('input', function() {
        calcularDiferenciasLaterales(this);
      });
    });
  }
  
  // Calcular índices cuando se ingresan los perímetros necesarios
  const perimetroInputs = document.querySelectorAll('.perimetro-input');
  if (perimetroInputs.length > 0) {
    perimetroInputs.forEach(input => {
      input.addEventListener('input', function() {
        calcularIndices();
        evaluarPerimetros();
      });
    });
  }
  
  // Agregar edad a los cálculos para estimación de masa muscular
  const edadInput = document.getElementById('edad');
  if (edadInput) {
    edadInput.addEventListener('input', function() {
      calcularIndices();
    });
  }
  
  // También ejecutamos los cálculos al cargar la página si hay datos
  if (document.getElementById('peso') && document.getElementById('peso').value &&
      document.getElementById('talla') && document.getElementById('talla').value) {
    calcularIMC();
  }
  
  // Inicializar cálculos de índices si hay datos previos
  if (document.getElementById('perimetro_cintura') && document.getElementById('perimetro_cintura').value) {
    calcularIndices();
    evaluarPerimetros();
  }
  
  // Inicializar diferencias laterales si hay datos previos
  document.querySelectorAll('.side-measurement').forEach(input => {
    if (input.value) {
      calcularDiferenciasLaterales(input);
    }
  });
  
  // Agregar estilos adicionales necesarios
  agregarEstilosAdicionales();
});

// Función para calcular el IMC
function calcularIMC() {
  const peso = parseFloat(document.getElementById('peso').value);
  const talla = parseFloat(document.getElementById('talla').value);
  
  if (peso && talla) {
    const tallaMt = talla / 100; // Convertir cm a m
    const imc = peso / (tallaMt * tallaMt);
    document.getElementById('imc').value = imc.toFixed(2);
    
    // Evaluación del IMC y color
    const imcInput = document.getElementById('imc');
    const estadoImcElement = document.getElementById('estado_imc');
    let estado = '';
    let color = '';
    
    if (imc < 18.5) {
      estado = 'Bajo peso';
      color = '#FFC107'; // Amarillo
    } else if (imc >= 18.5 && imc < 25) {
      estado = 'Normal';
      color = '#28A745'; // Verde
    } else if (imc >= 25 && imc < 30) {
      estado = 'Sobrepeso';
      color = '#FFC107'; // Amarillo
    } else if (imc >= 30 && imc < 35) {
      estado = 'Obesidad Grado I';
      color = '#FD7E14'; // Naranja
    } else if (imc >= 35 && imc < 40) {
      estado = 'Obesidad Grado II';
      color = '#DC3545'; // Rojo
    } else if (imc >= 40) {
      estado = 'Obesidad Grado III';
      color = '#DC3545'; // Rojo
    }
    
    imcInput.style.backgroundColor = color;
    imcInput.style.color = imc >= 25 ? 'white' : 'black';
    
    if (estadoImcElement) {
      estadoImcElement.innerHTML = `<span class="badge" style="background-color: ${color}; color: white;">${estado}</span>`;
    }
    
    actualizarRecomendacionesAntropometria();
    actualizarEstadoAcordeonAntropometria();
  } else {
    document.getElementById('imc').value = '';
    document.getElementById('imc').style.backgroundColor = '';
    document.getElementById('imc').style.color = '';
    
    const estadoImcElement = document.getElementById('estado_imc');
    if (estadoImcElement) {
      estadoImcElement.innerHTML = '';
    }
  }
}

// Función para calcular diferencias entre lados
function calcularDiferenciasLaterales(input) {
  const id = input.id;
  const pairId = input.getAttribute('data-pair');
  const pairInput = document.getElementById(pairId);
  
  if (pairInput) {
    const baseId = id.split('_der')[0].split('_izq')[0];
    const diffElement = document.getElementById('diff_' + baseId.split('perimetro_')[1]);
    
    if (diffElement && input.value && pairInput.value) {
      const val1 = parseFloat(input.value);
      const val2 = parseFloat(pairInput.value);
      const diff = Math.abs(val1 - val2).toFixed(1);
      
      diffElement.textContent = diff + ' cm';
      
      // Colorear basado en la diferencia
      if (diff > 2) {
        diffElement.style.color = '#DC3545'; // Rojo para diferencia significativa
        diffElement.style.fontWeight = 'bold';
      } else if (diff > 1) {
        diffElement.style.color = '#FD7E14'; // Naranja para diferencia moderada
        diffElement.style.fontWeight = 'bold';
      } else {
        diffElement.style.color = '#28A745'; // Verde para diferencia normal
        diffElement.style.fontWeight = 'normal';
      }
      
      // Actualizar estado en la columna de estado
      const estadoElement = document.getElementById('estado_' + baseId.split('perimetro_')[1]);
      if (estadoElement) {
        if (diff > 2) {
          estadoElement.innerHTML = '<span class="badge bg-danger">Asimetría significativa</span>';
        } else if (diff > 1) {
          estadoElement.innerHTML = '<span class="badge bg-warning text-dark">Asimetría moderada</span>';
        } else {
          estadoElement.innerHTML = '<span class="badge bg-success">Normal</span>';
        }
      }
    }
  }
}

// Función para calcular los índices antropométricos
function calcularIndices() {
  // Índice Cintura/Cadera
  const cintura = parseFloat(document.getElementById('perimetro_cintura').value);
  const cadera = parseFloat(document.getElementById('perimetro_cadera').value);
  const iccElement = document.getElementById('indice_cintura_cadera');
  const estadoIccElement = document.getElementById('estado_icc');
  
  if (cintura && cadera) {
    const icc = (cintura / cadera).toFixed(2);
    if (iccElement) iccElement.value = icc;
    
    // Evaluación de ICC según género
    const genero = document.getElementById('genero') ? document.getElementById('genero').value : '';
    let estadoIcc = '';
    let colorIcc = '';
    
    if (genero === 'Masculino') {
      if (icc <= 0.95) {
        estadoIcc = 'Normal';
        colorIcc = '#28A745'; // Verde
      } else if (icc > 0.95 && icc <= 1.0) {
        estadoIcc = 'Riesgo moderado';
        colorIcc = '#FFC107'; // Amarillo
      } else {
        estadoIcc = 'Riesgo alto';
        colorIcc = '#DC3545'; // Rojo
      }
    } else if (genero === 'Femenino') {
      if (icc <= 0.80) {
        estadoIcc = 'Normal';
        colorIcc = '#28A745'; // Verde
      } else if (icc > 0.80 && icc <= 0.85) {
        estadoIcc = 'Riesgo moderado';
        colorIcc = '#FFC107'; // Amarillo
      } else {
        estadoIcc = 'Riesgo alto';
        colorIcc = '#DC3545'; // Rojo
      }
    } else {
      estadoIcc = 'Seleccione género para evaluación';
      colorIcc = '#6C757D'; // Gris
    }
    
    if (estadoIccElement) {
      estadoIccElement.innerHTML = `<span class="badge" style="background-color: ${colorIcc}; color: white;">${estadoIcc}</span>`;
    }
  } else {
    if (iccElement) iccElement.value = '';
    if (estadoIccElement) estadoIccElement.innerHTML = '';
  }
  
  // Índice Cintura/Altura
  const altura = parseFloat(document.getElementById('talla').value);
  const icaElement = document.getElementById('indice_cintura_altura');
  const estadoIcaElement = document.getElementById('estado_ica');
  
  if (cintura && altura) {
    // Calcular como se muestra en la imagen 3: (cintura/altura)*100
    const ica = ((cintura / altura) * 100).toFixed(2);
    if (icaElement) icaElement.value = ica;
    
    // Evaluación de ICA
    let estadoIca = '';
    let colorIca = '';
    
    if (ica < 40) {
      estadoIca = 'Riesgo bajo - Delgadez';
      colorIca = '#FFC107'; // Amarillo
    } else if (ica >= 40 && ica <= 50) {
      estadoIca = 'Normal';
      colorIca = '#28A745'; // Verde
    } else if (ica > 50 && ica <= 60) {
      estadoIca = 'Riesgo aumentado';
      colorIca = '#FD7E14'; // Naranja
    } else {
      estadoIca = 'Riesgo alto';
      colorIca = '#DC3545'; // Rojo
    }
    
    if (estadoIcaElement) {
      estadoIcaElement.innerHTML = `<span class="badge" style="background-color: ${colorIca}; color: white;">${estadoIca}</span>`;
    }
  } else {
    if (icaElement) icaElement.value = '';
    if (estadoIcaElement) estadoIcaElement.innerHTML = '';
  }
  
  // Estimación de masa muscular (usando perímetro de pantorrilla como proxy)
  const pantorrillaD = parseFloat(document.getElementById('perimetro_pantorrilla_der').value);
  const pantorrillaI = parseFloat(document.getElementById('perimetro_pantorrilla_izq').value);
  const immElement = document.getElementById('indice_masa_muscular');
  const estadoImmElement = document.getElementById('estado_imm');
  
  if (pantorrillaD || pantorrillaI) {
    const pantorrilla = pantorrillaD || pantorrillaI; // Usar el valor disponible
    
    // Evaluación de masa muscular basada en perímetro de pantorrilla
    let estadoImm = '';
    let colorImm = '';
    
    const genero = document.getElementById('genero') ? document.getElementById('genero').value : '';
    
    if (genero === 'Masculino') {
      if (pantorrilla < 31) {
        estadoImm = 'Posible sarcopenia';
        colorImm = '#DC3545'; // Rojo
      } else {
        estadoImm = 'Normal';
        colorImm = '#28A745'; // Verde
      }
    } else if (genero === 'Femenino') {
      if (pantorrilla < 30) {
        estadoImm = 'Posible sarcopenia';
        colorImm = '#DC3545'; // Rojo
      } else {
        estadoImm = 'Normal';
        colorImm = '#28A745'; // Verde
      }
    } else {
      estadoImm = 'Seleccione género para evaluación';
      colorImm = '#6C757D'; // Gris
    }
    
    if (immElement) immElement.value = pantorrilla.toFixed(1) + ' cm';
    if (estadoImmElement) {
      estadoImmElement.innerHTML = `<span class="badge" style="background-color: ${colorImm}; color: white;">${estadoImm}</span>`;
    }
  } else {
    if (immElement) immElement.value = '';
    if (estadoImmElement) estadoImmElement.innerHTML = '';
  }
  
  // Llamar a la nueva función para calcular masa muscular apendicular
  calcularMasaMuscularApendicular();
  
  actualizarRecomendacionesAntropometria();
  actualizarEstadoAcordeonAntropometria();
}

// Función para evaluar perímetros específicos
function evaluarPerimetros() {
  // Evaluación de riesgo por perímetro de cuello
  const perimetroCuello = parseFloat(document.getElementById('perimetro_cuello').value);
  const estadoCuello = document.getElementById('estado_cuello');
  
  if (perimetroCuello && estadoCuello) {
    const genero = document.getElementById('genero') ? document.getElementById('genero').value : '';
    let estado = '';
    let color = '';
    
    if (genero === 'Masculino') {
      if (perimetroCuello > 43) {
        estado = 'Riesgo aumentado';
        color = '#DC3545'; // Rojo
      } else if (perimetroCuello > 40) {
        estado = 'Riesgo moderado';
        color = '#FD7E14'; // Naranja
      } else {
        estado = 'Normal';
        color = '#28A745'; // Verde
      }
    } else if (genero === 'Femenino') {
      if (perimetroCuello > 38) {
        estado = 'Riesgo aumentado';
        color = '#DC3545'; // Rojo
      } else if (perimetroCuello > 35) {
        estado = 'Riesgo moderado';
        color = '#FD7E14'; // Naranja
      } else {
        estado = 'Normal';
        color = '#28A745'; // Verde
      }
    } else {
      estado = 'Pendiente';
      color = '#6C757D'; // Gris
    }
    
    estadoCuello.innerHTML = `<span class="badge" style="background-color: ${color}; color: white;">${estado}</span>`;
  }
  
  // Evaluación de riesgo cardiovascular por perímetro abdominal
  const perimetroAbdominal = parseFloat(document.getElementById('perimetro_cintura').value);
  const estadoAbdominal = document.getElementById('estado_cintura');
  
  if (perimetroAbdominal && estadoAbdominal) {
    const genero = document.getElementById('genero') ? document.getElementById('genero').value : '';
    let estado = '';
    let color = '';
    
    if (genero === 'Masculino') {
      if (perimetroAbdominal >= 102) {
        estado = 'Riesgo cardiovascular alto';
        color = '#DC3545'; // Rojo
      } else if (perimetroAbdominal >= 94) {
        estado = 'Riesgo cardiovascular moderado';
        color = '#FD7E14'; // Naranja
      } else {
        estado = 'Normal';
        color = '#28A745'; // Verde
      }
    } else if (genero === 'Femenino') {
      if (perimetroAbdominal >= 88) {
        estado = 'Riesgo cardiovascular alto';
        color = '#DC3545'; // Rojo
      } else if (perimetroAbdominal >= 80) {
        estado = 'Riesgo cardiovascular moderado';
        color = '#FD7E14'; // Naranja
      } else {
        estado = 'Normal';
        color = '#28A745'; // Verde
      }
    } else {
      estado = 'Pendiente';
      color = '#6C757D'; // Gris
    }
    
    estadoAbdominal.innerHTML = `<span class="badge" style="background-color: ${color}; color: white;">${estado}</span>`;
  }
}

// Función para calcular la masa muscular apendicular estimada basada en perímetros
function calcularMasaMuscularApendicular() {
  const peso = parseFloat(document.getElementById('peso').value);
  const talla = parseFloat(document.getElementById('talla').value);
  const genero = document.getElementById('genero') ? document.getElementById('genero').value : '';
  const edad = document.getElementById('edad') ? parseFloat(document.getElementById('edad').value) : 0;
  
  // Obtener los perímetros de las extremidades
  const brazoD = parseFloat(document.getElementById('perimetro_brazo_der').value) || 0;
  const brazoI = parseFloat(document.getElementById('perimetro_brazo_izq').value) || 0;
  const brazoContD = parseFloat(document.getElementById('perimetro_brazo_cont_der').value) || 0;
  const brazoContI = parseFloat(document.getElementById('perimetro_brazo_cont_izq').value) || 0;
  const musloProxD = parseFloat(document.getElementById('perimetro_muslo_prox_der').value) || 0;
  const musloProxI = parseFloat(document.getElementById('perimetro_muslo_prox_izq').value) || 0;
  const pantorrillaD = parseFloat(document.getElementById('perimetro_pantorrilla_der').value) || 0;
  const pantorrillaI = parseFloat(document.getElementById('perimetro_pantorrilla_izq').value) || 0;
  
  const ammaElement = document.getElementById('masa_muscular_apendicular');
  const riesgoElement = document.getElementById('riesgo_sarcopenia');
  const estadoAmmaElement = document.getElementById('estado_amma');
  const estadoSarcopeniaElement = document.getElementById('estado_sarcopenia');
  
  // Verificar si tenemos suficientes datos para estimar
  if (peso && talla && genero && 
      ((brazoD || brazoI) || (brazoContD || brazoContI)) && 
      (musloProxD || musloProxI) && 
      (pantorrillaD || pantorrillaI)) {
    
    // Usar promedio de los lados o el valor disponible
    const brazo = (brazoD && brazoI) ? (brazoD + brazoI) / 2 : (brazoD || brazoI);
    const brazoCont = (brazoContD && brazoContI) ? (brazoContD + brazoContI) / 2 : (brazoContD || brazoContI);
    const musloProx = (musloProxD && musloProxI) ? (musloProxD + musloProxI) / 2 : (musloProxD || musloProxI);
    const pantorrilla = (pantorrillaD && pantorrillaI) ? (pantorrillaD + pantorrillaI) / 2 : (pantorrillaD || pantorrillaI);
    
    // Usar el perímetro de brazo disponible (priorizar el contraído si está disponible)
    const brazoPredictivo = brazoCont || brazo;
    
    let amma = 0;
    const tallaMt = talla / 100; // Convertir cm a m
    const imc = peso / (tallaMt * tallaMt);
    
    // Ecuaciones predictivas para masa muscular apendicular basadas en perímetros
    // Estas son ecuaciones simplificadas basadas en literatura científica
    if (genero === 'Masculino') {
      // Para hombres
      amma = (0.2 * peso) + (0.1 * brazoPredictivo) + (0.15 * musloProx) + (0.2 * pantorrilla) - (0.05 * edad) - 2.5;
      
      // Ajuste por IMC para casos extremos
      if (imc < 20) amma *= 0.9;
      if (imc > 30) amma *= 1.1;
    } else if (genero === 'Femenino') {
      // Para mujeres
      amma = (0.15 * peso) + (0.08 * brazoPredictivo) + (0.1 * musloProx) + (0.15 * pantorrilla) - (0.04 * edad) - 1.8;
      
      // Ajuste por IMC para casos extremos
      if (imc < 19) amma *= 0.9;
      if (imc > 30) amma *= 1.1;
    }
    
    // Asegurar que el resultado sea positivo y realista
    amma = Math.max(amma, 5); // No permitir valores menores a 5kg
    amma = Math.min(amma, peso * 0.4); // No permitir valores mayores al 40% del peso corporal
    
    // Establecer el valor calculado
    if (ammaElement) ammaElement.value = amma.toFixed(2) + ' kg';
    
    // Evaluar riesgo de sarcopenia según género y edad
    let estadoSarcopenia = '';
    let colorSarcopenia = '';
    let riesgoSarcopenia = '';
    
    // El índice de masa muscular apendicular (IMMA) es la masa muscular apendicular dividida por talla²
    const imma = amma / (tallaMt * tallaMt);
    
    if (genero === 'Masculino') {
      if (imma < 7.0) {
        estadoSarcopenia = 'Alto riesgo';
        colorSarcopenia = '#DC3545'; // Rojo
        riesgoSarcopenia = 'Alto';
      } else if (imma < 7.5) {
        estadoSarcopenia = 'Riesgo moderado';
        colorSarcopenia = '#FD7E14'; // Naranja
        riesgoSarcopenia = 'Moderado';
      } else {
        estadoSarcopenia = 'Riesgo bajo';
        colorSarcopenia = '#28A745'; // Verde
        riesgoSarcopenia = 'Bajo';
      }
    } else if (genero === 'Femenino') {
      if (imma < 5.5) {
        estadoSarcopenia = 'Alto riesgo';
        colorSarcopenia = '#DC3545'; // Rojo
        riesgoSarcopenia = 'Alto';
      } else if (imma < 6.0) {
        estadoSarcopenia = 'Riesgo moderado';
        colorSarcopenia = '#FD7E14'; // Naranja
        riesgoSarcopenia = 'Moderado';
      } else {
        estadoSarcopenia = 'Riesgo bajo';
        colorSarcopenia = '#28A745'; // Verde
        riesgoSarcopenia = 'Bajo';
      }
    }
    
    if (riesgoElement) riesgoElement.value = riesgoSarcopenia;
    
    if (estadoAmmaElement) {
      estadoAmmaElement.innerHTML = `<span class="badge" style="background-color: ${colorSarcopenia}; color: white;">${amma.toFixed(2)} kg (IMMA: ${imma.toFixed(2)} kg/m²)</span>`;
    }
    
    if (estadoSarcopeniaElement) {
      estadoSarcopeniaElement.innerHTML = `<span class="badge" style="background-color: ${colorSarcopenia}; color: white;">${estadoSarcopenia}</span>`;
    }
    
  } else {
    // Limpiar los valores si los datos están incompletos
    if (ammaElement) ammaElement.value = '';
    if (riesgoElement) riesgoElement.value = '';
    
    if (estadoAmmaElement) estadoAmmaElement.innerHTML = '';
    if (estadoSarcopeniaElement) estadoSarcopeniaElement.innerHTML = '';
  }
}

// Función para actualizar recomendaciones clínicas basadas en antropometría
function actualizarRecomendacionesAntropometria() {
  const recomendacionesElement = document.getElementById('texto_recomendaciones_antropometria');
  if (!recomendacionesElement) return;
  
  const imc = parseFloat(document.getElementById('imc').value);
  const cintura = parseFloat(document.getElementById('perimetro_cintura').value);
  const genero = document.getElementById('genero') ? document.getElementById('genero').value : '';
  const riesgoSarcopenia = document.getElementById('riesgo_sarcopenia') ? 
                          document.getElementById('riesgo_sarcopenia').value : '';
  
  let recomendaciones = [];
  
  // Recomendaciones basadas en IMC
  if (imc) {
    if (imc < 18.5) {
      recomendaciones.push('IMC indica bajo peso. Considere evaluación nutricional y posibles causas de pérdida de peso.');
    } else if (imc >= 25 && imc < 30) {
      recomendaciones.push('IMC indica sobrepeso. Considere recomendaciones sobre actividad física y alimentación saludable.');
    } else if (imc >= 30) {
      recomendaciones.push('IMC indica obesidad. Se recomienda derivación a nutricionista y evaluación de factores de riesgo metabólico.');
    }
  }
  
  // Recomendaciones basadas en perímetro de cintura
  if (cintura && genero) {
    const riesgoElevado = (genero === 'Masculino' && cintura >= 102) || (genero === 'Femenino' && cintura >= 88);
    
    if (riesgoElevado) {
      recomendaciones.push('Perímetro de cintura indica riesgo cardiovascular elevado. Considere evaluación de factores de riesgo metabólico y derivación a especialista.');
    }
  }
  
  // Recomendaciones basadas en diferencias laterales
  const medidasLaterales = document.querySelectorAll('.side-measurement');
  let asimetriasSignificativas = false;
  
  medidasLaterales.forEach(input => {
    const id = input.id;
    const pairId = input.getAttribute('data-pair');
    
    if (document.getElementById(pairId) && input.value && document.getElementById(pairId).value) {
      const val1 = parseFloat(input.value);
      const val2 = parseFloat(document.getElementById(pairId).value);
      const diff = Math.abs(val1 - val2);
      
      if (diff > 2) {
        asimetriasSignificativas = true;
      }
    }
  });
  
  if (asimetriasSignificativas) {
    recomendaciones.push('Se detectaron asimetrías significativas (>2cm) entre ambos lados. Considere evaluación funcional detallada y posibles causas (atrofia, hipertrofia, edema).');
  }
  
  // Recomendaciones basadas en riesgo de sarcopenia
  if (riesgoSarcopenia) {
    if (riesgoSarcopenia === 'Alto') {
      recomendaciones.push('Alto riesgo de sarcopenia. Se recomienda:');
      recomendaciones.push('- Evaluación de fuerza muscular (dinamometría de agarre, prueba sentarse-pararse 5 veces).');
      recomendaciones.push('- Programa de ejercicio de fortalecimiento muscular progresivo 2-3 veces/semana.');
      recomendaciones.push('- Evaluación nutricional con énfasis en ingesta proteica (1.2-1.5 g/kg/día).');
      recomendaciones.push('- Considerar derivación a geriatra o especialista en sarcopenia.');
    } else if (riesgoSarcopenia === 'Moderado') {
      recomendaciones.push('Riesgo moderado de sarcopenia. Se recomienda:');
      recomendaciones.push('- Programa de ejercicio con énfasis en fortalecimiento muscular 2 veces/semana.');
      recomendaciones.push('- Asegurar ingesta proteica adecuada (1.0-1.2 g/kg/día).');
      recomendaciones.push('- Seguimiento en 3-6 meses para reevaluación.');
    }
  }
  
  // Mostrar recomendaciones
  if (recomendaciones.length > 0) {
    let html = '<ul class="mb-0">';
    recomendaciones.forEach(rec => {
      html += `<li>${rec}</li>`;
    });
    html += '</ul>';
    
    recomendacionesElement.innerHTML = html;
  } else {
    recomendacionesElement.innerHTML = 'Complete los datos antropométricos para obtener recomendaciones clínicas automáticas.';
  }
}

// Función para actualizar el estado del acordeón de antropometría
function actualizarEstadoAcordeonAntropometria() {
  const peso = document.getElementById('peso').value;
  const talla = document.getElementById('talla').value;
  const perimetroCuello = document.getElementById('perimetro_cuello').value;
  const perimetroCintura = document.getElementById('perimetro_cintura').value;
  const perimetroCadera = document.getElementById('perimetro_cadera').value;
  
  const antropometriaBadge = document.getElementById('antropometria-badge');
  
  // Verificar si se han completado los campos mínimos necesarios
  if (antropometriaBadge && peso && talla && (perimetroCuello || perimetroCintura || perimetroCadera)) {
    antropometriaBadge.textContent = 'Completado';
    antropometriaBadge.classList.remove('badge-secondary');
    antropometriaBadge.classList.add('badge-success');
  } else if (antropometriaBadge) {
    antropometriaBadge.textContent = 'No completado';
    antropometriaBadge.classList.remove('badge-success');
    antropometriaBadge.classList.add('badge-secondary');
  }
}

// Función para agregar CSS adicional necesario para las nuevas secciones
function agregarEstilosAdicionales() {
  // Verificar si ya existe un estilo con este ID para evitar duplicados
  if (document.getElementById('antropometria-estilos-adicionales')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'antropometria-estilos-adicionales';
  style.textContent = `
    /* Estilos para la tabla de perímetros */
    .perimetros-table .table-secondary {
      background-color: #e2e3e5;
    }
    
    /* Estilos para los inputs de perímetros */
    .perimetro-input {
      width: 100%;
      padding: 0.375rem 0.75rem;
    }
    
    /* Estilos para badges de estado */
    .badge {
      padding: 0.5em 0.75em;
      border-radius: 0.25rem;
      font-weight: 500;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
    }
    
    /* Colores para estados */
    .bg-success {
      background-color: #28a745 !important;
      color: white;
    }
    
    .bg-warning {
      background-color: #ffc107 !important;
      color: #212529;
    }
    
    .bg-danger {
      background-color: #dc3545 !important;
      color: white;
    }
    
    .bg-info {
      background-color: #17a2b8 !important;
      color: white;
    }
    
    /* Estilos para recomendaciones y alertas */
    .alert {
      position: relative;
      padding: 0.75rem 1.25rem;
      margin-bottom: 1rem;
      border: 1px solid transparent;
      border-radius: 0.25rem;
    }
    
    .alert-info {
      color: #0c5460;
      background-color: #d1ecf1;
      border-color: #bee5eb;
    }
    
    .alert-warning {
      color: #856404;
      background-color: #fff3cd;
      border-color: #ffeeba;
    }
    
    /* Estilos específicos para tu sistema */
    .badge-success {
      background-color: #28a745;
      color: white;
    }
    
    .badge-secondary {
      background-color: #6c757d;
      color: white;
    }
  `;
  
  document.head.appendChild(style);
}

// Función para guardar todos los datos adicionales en el objeto del paciente
function prepararDatosAntropometriaPostural(formData) {
  // Esta función se debe llamar desde la función prepararDatosPaciente en pacientes.js
  
  // Datos antropométricos
  formData.antropometria = {
    peso: document.getElementById('peso').value,
    talla: document.getElementById('talla').value,
    imc: document.getElementById('imc').value,
    perimetros: {}
  };
  
  // Recopilar todos los perímetros
  document.querySelectorAll('input[id^="perimetro_"]').forEach(input => {
    if (input.value) {
      formData.antropometria.perimetros[input.id] = input.value;
    }
  });
  
  // Índices calculados
  formData.antropometria.indices = {
    cintura_cadera: document.getElementById('indice_cintura_cadera') ? document.getElementById('indice_cintura_cadera').value : '',
    cintura_altura: document.getElementById('indice_cintura_altura') ? document.getElementById('indice_cintura_altura').value : '',
    masa_muscular: document.getElementById('indice_masa_muscular') ? document.getElementById('indice_masa_muscular').value : '',
    masa_muscular_apendicular: document.getElementById('masa_muscular_apendicular') ? 
                              document.getElementById('masa_muscular_apendicular').value : '',
    riesgo_sarcopenia: document.getElementById('riesgo_sarcopenia') ? 
                      document.getElementById('riesgo_sarcopenia').value : ''
  };
  
  // Datos posturales
  formData.postura = {
    alineacion: document.getElementById('alineacionCorporal') ? document.getElementById('alineacionCorporal').value : '',
    alteraciones: document.getElementById('alteracionesPosturales') ? document.getElementById('alteracionesPosturales').value : '',
    lateralidad: document.getElementById('lateralidad') ? document.getElementById('lateralidad').value : '',
    asimetrias: document.getElementById('asimetrias') ? document.getElementById('asimetrias').value : '',
    interpretacion: document.getElementById('interpretacionPostural') ? document.getElementById('interpretacionPostural').value : '',
    hallazgos: {}
  };
  
  // Recopilar todos los hallazgos posturales
  document.querySelectorAll('select[id^="postura_"]').forEach(select => {
    if (select.value) {
      const region = select.id.replace('postura_', '');
      formData.postura.hallazgos[region] = {
        valor: select.value,
        observacion: document.getElementById('obs_' + region) ? 
                    document.getElementById('obs_' + region).value : ''
      };
    }
  });
  
  return formData;
}

// Exponer las funciones necesarias globalmente para usarlas en otros archivos
window.prepararDatosAntropometriaPostural = prepararDatosAntropometriaPostural;

// Variables para almacenar URLs de fotos
let fotoAnteriorURL = null;
let fotoLateralURL = null;
let fotoPosteriorURL = null;

// Referencias al storage de Firebase
const storage = firebase.storage();
const storageRef = storage.ref();

// Inicializar listeners para la evaluación postural
function inicializarEvaluacionPostural() {
  // Event listeners para carga de fotos
  document.getElementById('foto-anterior').addEventListener('change', function(e) {
    cargarFoto(e, 'anterior');
  });
  
  document.getElementById('foto-lateral').addEventListener('change', function(e) {
    cargarFoto(e, 'lateral');
  });
  
  document.getElementById('foto-posterior').addEventListener('change', function(e) {
    cargarFoto(e, 'posterior');
  });
  
  // Event listeners para actualizar el resumen
  const camposPosturales = [
    'posicion-cabeza', 'posicion-hombros', 'alineacion-rodillas', 
    'alineacion-pie', 'asimetrias', 'escoliosis'
  ];
  
  camposPosturales.forEach(campo => {
    document.getElementById(campo).addEventListener('change', actualizarResumenPostural);
  });
  
  // Event listeners para ángulos posturales
  document.getElementById('angulo-cifosis').addEventListener('input', function() {
    evaluarAngulosPosturales();
  });
  
  document.getElementById('angulo-lordosis').addEventListener('input', function() {
    evaluarAngulosPosturales();
  });
}

// Función para cargar foto a Firebase Storage
function cargarFoto(event, tipo) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Verificar tamaño (máximo 6MB)
  if (file.size > 6 * 1024 * 1024) {
    alert('La imagen es demasiado grande. Máximo 6MB.');
    return;
  }
  
  // Mostrar barra de progreso
  const progressBar = document.getElementById(`progress-${tipo}`);
  progressBar.classList.remove('d-none');
  const progressBarInner = progressBar.querySelector('.progress-bar');
  
  // Crear referencia única para la foto
  const timestamp = new Date().getTime();
  const pacienteId = document.getElementById('pacienteId').value || 'temp';
  const fotoRef = storageRef.child(`pacientes/${pacienteId}/fotos/postal_${tipo}_${timestamp}`);
  
  // Iniciar subida
  const uploadTask = fotoRef.put(file);
  
  // Controlar eventos de la subida
  uploadTask.on('state_changed', 
    // Progreso
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBarInner.style.width = progress + '%';
    },
    // Error
    (error) => {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen: ' + error.message);
      progressBar.classList.add('d-none');
    },
    // Completado
    () => {
      // Obtener URL de descarga
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        // Guardar URL según tipo
        if (tipo === 'anterior') fotoAnteriorURL = downloadURL;
        if (tipo === 'lateral') fotoLateralURL = downloadURL;
        if (tipo === 'posterior') fotoPosteriorURL = downloadURL;
        
        // Mostrar preview
        const previewElement = document.getElementById(`preview-${tipo}`);
        previewElement.innerHTML = `<img src="${downloadURL}" class="img-fluid img-thumbnail" alt="Vista ${tipo}">`;
        
        // Ocultar barra de progreso
        progressBar.classList.add('d-none');
        
        // Actualizar badge
        actualizarEstadoCompletado();
      });
    }
  );
}

// Función para actualizar la relevancia clínica según el hallazgo
function actualizarRelevanciaPostural(campo) {
  const selectElement = document.getElementById(campo);
  const relevanciaElement = document.getElementById(`relevancia-${campo}`);
  
  if (!selectElement || !relevanciaElement) return;
  
  const valor = selectElement.value;
  let relevancia = '';
  let clase = '';
  
  // Definir relevancia según el campo y valor
  switch(campo) {
    case 'posicion-cabeza':
      if (valor === 'Neutra') {
        relevancia = 'Normal';
        clase = 'text-success';
      } else if (valor === 'Anterior leve') {
        relevancia = 'Baja';
        clase = 'text-warning';
      } else if (valor.includes('moderada')) {
        relevancia = 'Moderada';
        clase = 'text-warning';
      } else if (valor.includes('severa')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      }
      break;
      
    case 'posicion-hombros':
      if (valor === 'Neutros') {
        relevancia = 'Normal';
        clase = 'text-success';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        clase = 'text-warning';
      } else if (valor.includes('moderada')) {
        relevancia = 'Moderada';
        clase = 'text-warning';
      } else if (valor.includes('significativa')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      }
      break;
      
    case 'alineacion-rodillas':
      if (valor === 'Neutra') {
        relevancia = 'Normal';
        clase = 'text-success';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        clase = 'text-warning';
      } else if (valor.includes('moderado')) {
        relevancia = 'Moderada';
        clase = 'text-warning';
      } else if (valor.includes('dinámico')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      } else if (valor.includes('significativo')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      }
      break;
      
    case 'alineacion-pie':
      if (valor === 'Neutro') {
        relevancia = 'Normal';
        clase = 'text-success';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        clase = 'text-warning';
      } else if (valor.includes('excesiva')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      } else if (valor.includes('significativa')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      } else if (valor.includes('Asimetría')) {
        relevancia = 'Moderada';
        clase = 'text-warning';
      }
      break;
      
    case 'asimetrias':
      if (valor === 'No') {
        relevancia = 'Normal';
        clase = 'text-success';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        clase = 'text-warning';
      } else if (valor.includes('significativa')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      } else {
        relevancia = 'Moderada';
        clase = 'text-warning';
      }
      break;
      
    case 'escoliosis':
      if (valor === 'No') {
        relevancia = 'Normal';
        clase = 'text-success';
      } else if (valor.includes('Leve')) {
        relevancia = 'Baja';
        clase = 'text-warning';
      } else if (valor.includes('Moderada')) {
        relevancia = 'Moderada';
        clase = 'text-warning';
      } else if (valor.includes('Significativa') || valor.includes('Estructural')) {
        relevancia = 'Alta';
        clase = 'text-danger';
      }
      break;
  }
  
  // Actualizar el elemento de relevancia
  if (relevancia) {
    relevanciaElement.textContent = relevancia;
    relevanciaElement.className = '';
    relevanciaElement.classList.add(clase);
  } else {
    relevanciaElement.textContent = 'No evaluado';
    relevanciaElement.className = '';
  }
  
  // Actualizar recomendaciones específicas
  actualizarRecomendaciones();
  
  // Actualizar estado de completado
  actualizarEstadoCompletado();
}

// Función para evaluar ángulos posturales
function evaluarAngulosPosturales() {
  const anguloCifosis = document.getElementById('angulo-cifosis').value;
  const anguloLordosis = document.getElementById('angulo-lordosis').value;
  const relevanciaElement = document.getElementById('relevancia-angulos');
  
  // Verificar si se han ingresado valores
  if (!anguloCifosis && !anguloLordosis) {
    relevanciaElement.textContent = 'No medido';
    relevanciaElement.className = '';
    return;
  }
  
  // Evaluar cifosis
  let relevancia = 'Normal';
  let clase = 'text-success';
  
  if (anguloCifosis) {
    const cifosis = parseInt(anguloCifosis);
    if (cifosis > 50) {
      relevancia = 'Alta';
      clase = 'text-danger';
    } else if (cifosis > 40) {
      relevancia = 'Moderada';
      clase = 'text-warning';
    }
  }
  
  // Evaluar lordosis
  if (anguloLordosis) {
    const lordosis = parseInt(anguloLordosis);
    if (lordosis > 50) {
      relevancia = 'Alta';
      clase = 'text-danger';
    } else if (lordosis > 40 && relevancia !== 'Alta') {
      relevancia = 'Moderada';
      clase = 'text-warning';
    }
  }
  
  // Actualizar el elemento de relevancia
  relevanciaElement.textContent = relevancia;
  relevanciaElement.className = '';
  relevanciaElement.classList.add(clase);
  
  // Actualizar estado de completado
  actualizarEstadoCompletado();
}

// Función para actualizar resumen postural
function actualizarResumenPostural() {
  const campos = [
    { id: 'posicion-cabeza', label: 'Cabeza' },
    { id: 'posicion-hombros', label: 'Hombros' },
    { id: 'alineacion-rodillas', label: 'Rodillas' },
    { id: 'alineacion-pie', label: 'Pies' },
    { id: 'asimetrias', label: 'Asimetrías' },
    { id: 'escoliosis', label: 'Escoliosis' }
  ];
  
  // Recolectar hallazgos significativos
  const hallazgos = [];
  
  campos.forEach(campo => {
    const select = document.getElementById(campo.id);
    if (select && select.value && select.value !== 'No' && select.value !== 'Neutro' && select.value !== 'Neutra' && select.value !== 'Neutros') {
      hallazgos.push(`${campo.label}: ${select.value}`);
    }
  });
  
  // Actualizar el resumen
  const resumenElement = document.getElementById('resumen-postural');
  if (hallazgos.length > 0) {
    resumenElement.innerHTML = hallazgos.join('; ');
  } else {
    resumenElement.textContent = 'No se han registrado hallazgos posturales significativos.';
  }
  
  // Generar texto de alteraciones relevantes si está vacío
  const alteracionesElement = document.getElementById('alteraciones-relevantes');
  if (alteracionesElement.value.trim() === '') {
    alteracionesElement.value = hallazgos.join('.\n');
  }
  
  // Actualizar recomendaciones específicas
  actualizarRecomendaciones();
}

// Función para actualizar recomendaciones específicas
function actualizarRecomendaciones() {
  const recomendacionElement = document.getElementById('recomendacion-especifica');
  const recomendaciones = [];
  
  // Verificar posición de cabeza
  const posicionCabeza = document.getElementById('posicion-cabeza').value;
  if (posicionCabeza.includes('anterior')) {
    recomendaciones.push('Para la posición anterior de cabeza, enfóquese en ejercicios de control motor cervical y fortalecimiento de flexores profundos, no en estiramientos pasivos.');
  }
  
  // Verificar protracción de hombros
  const posicionHombros = document.getElementById('posicion-hombros').value;
  if (posicionHombros.includes('Protracción')) {
    recomendaciones.push('Para la protracción de hombros, priorizar ejercicios de control motor escapular y fortalecimiento de trapecio medio/inferior.');
  }
  
  // Verificar valgo dinámico
  const alineacionRodillas = document.getElementById('alineacion-rodillas').value;
  if (alineacionRodillas.includes('dinámico')) {
    recomendaciones.push('El valgo dinámico de rodilla tiene relación con riesgo de lesiones. Considere entrenamiento neuromuscular y fortalecimiento de cadera.');
  }
  
  // Verificar escoliosis
  const escoliosis = document.getElementById('escoliosis').value;
  if (escoliosis.includes('Significativa') || escoliosis.includes('Estructural')) {
    recomendaciones.push('Para escoliosis significativa, considere evaluación médica especializada y enfoque en ejercicios específicos de Schroth o similar.');
  }
  
  // Actualizar el elemento de recomendaciones
  if (recomendaciones.length > 0) {
    recomendacionElement.innerHTML = recomendaciones.join('<br>');
  } else {
    recomendacionElement.textContent = 'No hay recomendaciones específicas adicionales.';
  }
}

// Función para actualizar el estado de completado de la evaluación
function actualizarEstadoCompletado() {
  const campos = [
    'posicion-cabeza', 'posicion-hombros', 'alineacion-rodillas', 
    'alineacion-pie', 'asimetrias', 'escoliosis'
  ];
  
  // Contar campos completados
  let completados = 0;
  campos.forEach(campo => {
    const select = document.getElementById(campo);
    if (select && select.value) {
      completados++;
    }
  });
  
  // Actualizar badge
  const badgeElement = document.getElementById('evaluacion-postural-badge');
  if (completados >= 4) {
    badgeElement.textContent = 'Completado';
    badgeElement.className = 'resultado-badge bg-success';
  } else if (completados >= 2) {
    badgeElement.textContent = 'Parcial';
    badgeElement.className = 'resultado-badge bg-warning';
  } else {
    badgeElement.textContent = 'No completado';
    badgeElement.className = 'resultado-badge bg-secondary';
  }
}

// Función para limpiar la evaluación postural
function limpiarEvaluacionPostural() {
  if (!confirm('¿Está seguro de limpiar todos los datos de la evaluación postural?')) {
    return;
  }
  
  // Limpiar selects
  const selects = [
    'posicion-cabeza', 'posicion-hombros', 'alineacion-rodillas', 
    'alineacion-pie', 'asimetrias', 'escoliosis'
  ];
  
  selects.forEach(id => {
    const select = document.getElementById(id);
    if (select) select.value = '';
  });
  
  // Limpiar inputs
  const inputs = [
    'obs-posicion-cabeza', 'obs-posicion-hombros', 'obs-alineacion-rodillas',
    'obs-alineacion-pie', 'obs-asimetrias', 'obs-escoliosis',
    'angulo-cifosis', 'angulo-lordosis', 'obs-angulos',
    'alteraciones-relevantes', 'impresion-funcional', 'observacion-fotos'
  ];
  
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });
  
  // Limpiar previews de imágenes
  document.getElementById('preview-anterior').innerHTML = '';
  document.getElementById('preview-lateral').innerHTML = '';
  document.getElementById('preview-posterior').innerHTML = '';
  
  // Limpiar URLs de fotos
  fotoAnteriorURL = null;
  fotoLateralURL = null;
  fotoPosteriorURL = null;
  
  // Resetear badge
  const badgeElement = document.getElementById('evaluacion-postural-badge');
  badgeElement.textContent = 'No completado';
  badgeElement.className = 'resultado-badge bg-secondary';
  
  // Resetear resumen
  document.getElementById('resumen-postural').textContent = 'No se han registrado hallazgos posturales.';
  
  // Resetear recomendaciones específicas
  document.getElementById('recomendacion-especifica').textContent = 'No hay recomendaciones específicas adicionales.';
  
  // Resetear relevancia clínica
  const relevanciaElements = [
    'relevancia-posicion-cabeza', 'relevancia-posicion-hombros', 'relevancia-alineacion-rodillas',
    'relevancia-alineacion-pie', 'relevancia-asimetrias', 'relevancia-escoliosis', 'relevancia-angulos'
  ];
  
  relevanciaElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = 'No evaluado';
      element.className = '';
    }
  });
}

// Función para preparar los datos de la evaluación postural para Firebase
function prepararDatosEvaluacionPostural() {
  return {
    cabeza: {
      posicion: document.getElementById('posicion-cabeza').value,
      observaciones: document.getElementById('obs-posicion-cabeza').value
    },
    hombros: {
      posicion: document.getElementById('posicion-hombros').value,
      observaciones: document.getElementById('obs-posicion-hombros').value
    },
    rodillas: {
      alineacion: document.getElementById('alineacion-rodillas').value,
      observaciones: document.getElementById('obs-alineacion-rodillas').value
    },
    pies: {
      alineacion: document.getElementById('alineacion-pie').value,
      observaciones: document.getElementById('obs-alineacion-pie').value
    },
    asimetrias: {
      tipo: document.getElementById('asimetrias').value,
      observaciones: document.getElementById('obs-asimetrias').value
    },
    escoliosis: {
      tipo: document.getElementById('escoliosis').value,
      observaciones: document.getElementById('obs-escoliosis').value
    },
    angulos: {
      cifosis: document.getElementById('angulo-cifosis').value,
      lordosis: document.getElementById('angulo-lordosis').value,
      observaciones: document.getElementById('obs-angulos').value
    },
    fotos: {
      anterior: fotoAnteriorURL,
      lateral: fotoLateralURL,
      posterior: fotoPosteriorURL,
      observaciones: document.getElementById('observacion-fotos').value
    },
    interpretacion: {
      alteracionesRelevantes: document.getElementById('alteraciones-relevantes').value,
      impresionFuncional: document.getElementById('impresion-funcional').value
    },
    resumen: document.getElementById('resumen-postural').innerHTML
  };
}

// Función para guardar la evaluación postural
function guardarEvaluacionPostural() {
  // Mostrar mensaje de guardado
  const datosEvaluacionPostural = prepararDatosEvaluacionPostural();
  
  // Simular guardado para desarrollo - más adelante se integra con firebase
  console.log('Datos de evaluación postural preparados para Firebase:', datosEvaluacionPostural);
  
  // Mostrar mensaje de éxito - se reemplazará por la integración real
  alert('Evaluación postural guardada correctamente.');
  
  // Actualizar badge a completado
  const badgeElement = document.getElementById('evaluacion-postural-badge');
  badgeElement.textContent = 'Guardado';
  badgeElement.className = 'resultado-badge bg-success';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar evaluación postural si estamos en la página correcta
  if (document.getElementById('evaluacion-postural-content')) {
    inicializarEvaluacionPostural();
  }
});
