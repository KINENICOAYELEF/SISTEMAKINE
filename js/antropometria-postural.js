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
    iccElement.value = icc;
  
    
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
  
  // CORRECCIÓN: Índice Cintura/Altura
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
  
  // Actualizar el estado del acordeón para mostrar que se ha completado
  actualizarEstadoAcordeonAntropometria();
}

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
  if (peso && talla && (perimetroCuello || perimetroCintura || perimetroCadera)) {
    antropometriaBadge.textContent = 'Completado';
    antropometriaBadge.classList.remove('badge-secondary');
    antropometriaBadge.classList.add('badge-success');
  } else {
    antropometriaBadge.textContent = 'No completado';
    antropometriaBadge.classList.remove('badge-success');
    antropometriaBadge.classList.add('badge-secondary');
  }
}

// Agregar esta función a los eventos de cambio en los inputs relevantes
document.addEventListener('DOMContentLoaded', function() {
  const antropometriaInputs = [
    document.getElementById('peso'),
    document.getElementById('talla'),
    document.getElementById('perimetro_cuello'),
    document.getElementById('perimetro_cintura'),
    document.getElementById('perimetro_cadera')
  ];
  
  antropometriaInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', actualizarEstadoAcordeonAntropometria);
    }
  });
});
// Funciones para la evaluación postural
document.addEventListener('DOMContentLoaded', function() {
  // Monitorear cambios en los selectores de evaluación postural
  const selectoresPosturales = document.querySelectorAll('select[id^="postura_"]');
  if (selectoresPosturales.length > 0) {
    selectoresPosturales.forEach(select => {
      select.addEventListener('change', function() {
        actualizarEstadoPostural(this);
      });
    });
  }
  
  // Generar recomendaciones automáticas cuando se completan observaciones
  const observacionesInputs = document.querySelectorAll('input[id^="obs_"]');
  if (observacionesInputs.length > 0) {
    observacionesInputs.forEach(input => {
      input.addEventListener('input', function() {
        actualizarInterpretacionPostural();
      });
    });
  }
  
  // Actualizar interpretación cuando se cambia el texto de alteraciones posturales
  const alteracionesPosturalesTextarea = document.getElementById('alteracionesPosturales');
  if (alteracionesPosturalesTextarea) {
    alteracionesPosturalesTextarea.addEventListener('input', function() {
      actualizarInterpretacionPostural();
    });
  }
});

// Función para actualizar el estado visual de los elementos posturales seleccionados
function actualizarEstadoPostural(selectElement) {
  const id = selectElement.id;
  const valor = selectElement.value;
  
  // Cambiar el color de fondo del select según la selección
  if (valor && valor !== '') {
    // Colores según el tipo de hallazgo
    if (valor.includes('Normal') || valor.includes('Neutr') || valor === 'No') {
      // Estado normal - verde claro
      selectElement.style.backgroundColor = '#d4edda';
      selectElement.style.color = '#155724';
    } else if (valor.includes('Leve') || valor.includes('Moderada') || 
               valor.includes('Hiperlordosis') || valor.includes('Hipercifosis') ||
               valor === 'Protracción' || valor === 'Retracción') {
      // Alteración moderada - amarillo claro
      selectElement.style.backgroundColor = '#fff3cd';
      selectElement.style.color = '#856404';
    } else {
      // Alteración importante - rojo claro
      selectElement.style.backgroundColor = '#f8d7da';
      selectElement.style.color = '#721c24';
    }
  } else {
    // Sin selección - restablecer estilo
    selectElement.style.backgroundColor = '';
    selectElement.style.color = '';
  }
  
  // Actualizar sugerencias automáticas y recomendaciones
  actualizarInterpretacionPostural();
  
  // Si es un hallazgo relevante, sugerir agregarlo a las alteraciones posturales
  if (valor && valor !== '' && 
      !valor.includes('Normal') && !valor.includes('Neutr') && valor !== 'No') {
    const region = id.replace('postura_', '');
    const regionText = region.replace(/_/g, ' ');
    
    // Obtener el textarea de alteraciones posturales
    const alteracionesTextarea = document.getElementById('alteracionesPosturales');
    if (alteracionesTextarea) {
      const textoActual = alteracionesTextarea.value.trim();
      const nuevaAlteracion = `${regionText}: ${valor}`;
      
      // Verificar si la alteración ya está incluida en el texto
      if (textoActual === '') {
        alteracionesTextarea.value = nuevaAlteracion;
      } else if (!textoActual.includes(nuevaAlteracion)) {
        // Evitar duplicados
        alteracionesTextarea.value = textoActual + '\n' + nuevaAlteracion;
      }
    }
  }
}

// Función para actualizar automáticamente la interpretación postural
function actualizarInterpretacionPostural() {
  const selectoresPosturales = document.querySelectorAll('select[id^="postura_"]');
  const interpretacionTextarea = document.getElementById('interpretacionPostural');
  
  if (!interpretacionTextarea) return;
  
  // Recopilar alteraciones seleccionadas
  let alteracionesSeleccionadas = [];
  selectoresPosturales.forEach(select => {
    if (select.value && select.value !== '' && 
        !select.value.includes('Normal') && !select.value.includes('Neutr') && select.value !== 'No') {
      const region = select.id.replace('postura_', '');
      alteracionesSeleccionadas.push({
        region: region.replace(/_/g, ' '),
        valor: select.value
      });
    }
  });
  
  // Generar interpretación basada en la evidencia
  let interpretacion = '';
  
  if (alteracionesSeleccionadas.length === 0) {
    interpretacion = 'No se han detectado alteraciones posturales significativas. Postura dentro de parámetros normales.';
  } else {
    // Introducción basada en evidencia
    interpretacion = 'INTERPRETACIÓN BASADA EN EVIDENCIA:\n\n';
    interpretacion += 'Los hallazgos posturales observados deben interpretarse en el contexto clínico completo del paciente. ';
    interpretacion += 'La evidencia científica actual muestra que las variaciones posturales son comunes en la población y no predicen necesariamente dolor o disfunción.\n\n';
    
    interpretacion += 'Hallazgos relevantes:\n';
    
    // Añadir los hallazgos específicos con interpretación basada en evidencia
    alteracionesSeleccionadas.forEach(alteracion => {
      interpretacion += `- ${alteracion.region} (${alteracion.valor}): `;
      
      // Interpretaciones específicas según la región y hallazgo
      if (alteracion.region.includes('cervical') || alteracion.region.includes('dorsal') || 
          alteracion.region.includes('lumbar')) {
        interpretacion += 'Representa una variante común que por sí sola no se correlaciona con dolor. Evaluar su relevancia clínica en relación a los síntomas específicos y funcionalidad.';
      } else if (alteracion.region.includes('cabeza') && alteracion.valor.includes('Anterior')) {
        interpretacion += 'Hallazgo frecuente en la población general. La evidencia no respalda la "corrección postural" como objetivo principal, sino mejorar la funcionalidad y educación sobre dolor.';
      } else if (alteracion.region.includes('escoliosis')) {
        interpretacion += 'Evaluar su magnitud clínica y funcional. En casos leves a moderados, el enfoque debe ser funcional más que correctivo.';
      } else if (alteracion.region.includes('pelvis')) {
        interpretacion += 'Considerar su impacto en la función, más que como una alteración estructural a "corregir". Evaluar movilidad y control motor de la región.';
      } else if (alteracion.region.includes('rodillas') || alteracion.region.includes('pies')) {
        interpretacion += 'Evaluar su impacto en la marcha, equilibrio y funcionalidad. Considerar factores biomecánicos solo si existe correlación clara con los síntomas.';
      } else {
        interpretacion += 'Evaluar su relevancia clínica en el contexto de los síntomas y limitación funcional del paciente.';
      }
      
      interpretacion += '\n';
    });
    
    // Recomendaciones generales basadas en evidencia
    interpretacion += '\nRECOMENDACIONES CLÍNICAS:\n';
    interpretacion += '• Enfoque terapéutico: Priorizar intervenciones que mejoren la función y movilidad más que "corregir" la postura.\n';
    interpretacion += '• Educación: Explicar al paciente que las variantes posturales son normales y frecuentes en la población asintomática.\n';
    interpretacion += '• Abordaje biopsicosocial: Considerar factores psicológicos, creencias sobre postura y expectativas del paciente.\n';
    interpretacion += '• Ejercicio: Promover variedad de movimientos y posturas, evitando el concepto de "postura ideal".';
  }
  
  // Actualizar el campo de interpretación
  interpretacionTextarea.value = interpretacion;
}
// Función para agregar CSS adicional necesario para las nuevas secciones
function agregarEstilosAdicionales() {
  const style = document.createElement('style');
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
  `;
  
  document.head.appendChild(style);
}

// Ejecutar la función para agregar estilos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  agregarEstilosAdicionales();
  
  // También podemos agregar la inicialización de los cálculos automáticos aquí
  // para asegurar que todos los elementos estén listos
  
  // Inicializar IMC si hay datos previos
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
  
  // Inicializar estado postural si hay selecciones previas
  document.querySelectorAll('select[id^="postura_"]').forEach(select => {
    if (select.value) {
      actualizarEstadoPostural(select);
    }
  });
});

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
    cintura_cadera: document.getElementById('indice_cintura_cadera').value,
    cintura_altura: document.getElementById('indice_cintura_altura').value,
    masa_muscular: document.getElementById('indice_masa_muscular').value,
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
