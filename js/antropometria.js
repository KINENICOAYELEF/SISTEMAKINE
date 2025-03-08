// Funciones para evaluación antropométrica
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM cargado - inicializando antropometría");
  
  // Verificar si podemos encontrar los elementos
  verificarElementos();
  
  // Calcular IMC cuando se ingresan peso y talla
  const pesoInput = document.getElementById('peso');
  const tallaInput = document.getElementById('talla');
  const imcInput = document.getElementById('imc');
  
  if (pesoInput && tallaInput && imcInput) {
    console.log("Agregando event listeners a peso y talla");
    pesoInput.addEventListener('input', calcularIMC);
    tallaInput.addEventListener('input', calcularIMC);
  }
  
  // Calcular diferencias en medidas bilaterales
  const medicionesLaterales = document.querySelectorAll('.side-measurement');
  if (medicionesLaterales.length > 0) {
    console.log("Agregando event listeners a mediciones laterales");
    medicionesLaterales.forEach(input => {
      input.addEventListener('input', function() {
        calcularDiferenciasLaterales(this);
      });
    });
  }
  
  // Calcular índices cuando se ingresan los perímetros necesarios
  const perimetroInputs = document.querySelectorAll('.perimetro-input');
  if (perimetroInputs.length > 0) {
    console.log("Agregando event listeners a perímetros");
    perimetroInputs.forEach(input => {
      input.addEventListener('input', function() {
        console.log("Cambio en perímetro:", input.id);
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
    console.log("Calculando IMC inicial");
    calcularIMC();
  }
  
  // Inicializar cálculos de índices si hay datos previos
  if (document.getElementById('perimetro_cintura') && document.getElementById('perimetro_cintura').value) {
    console.log("Calculando índices iniciales");
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

// Función para verificar si los elementos existen
function verificarElementos() {
  console.log("Verificando elementos de antropometría:");
  console.log("peso:", document.getElementById('peso'));
  console.log("talla:", document.getElementById('talla'));
  console.log("imc:", document.getElementById('imc'));
  console.log("perimetro_cuello:", document.getElementById('perimetro_cuello'));
  console.log("perimetro_cintura:", document.getElementById('perimetro_cintura'));
  console.log("perimetro_cadera:", document.getElementById('perimetro_cadera'));
  console.log("texto_recomendaciones_antropometria:", document.getElementById('texto_recomendaciones_antropometria'));
  console.log("recomendaciones_antropometria:", document.getElementById('recomendaciones_antropometria'));
}

// Función para calcular el IMC
function calcularIMC() {
  console.log("Ejecutando calcularIMC()");
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
    
    actualizarRecomendacionesAntropometria(); // IMPORTANTE: usar esta función, no actualizarRecomendaciones()
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
  console.log("Calculando diferencias laterales para:", input.id);
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
  console.log("Ejecutando calcularIndices()");
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
  
  actualizarRecomendacionesAntropometria(); // IMPORTANTE: usar esta función, no actualizarRecomendaciones()
  actualizarEstadoAcordeonAntropometria();
}

// Función para evaluar perímetros específicos
function evaluarPerimetros() {
  console.log("Ejecutando evaluarPerimetros()");
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
  
  // También actualizar las recomendaciones cada vez que se evalúan los perímetros
  actualizarRecomendacionesAntropometria();
}

// Función para calcular la masa muscular apendicular estimada basada en perímetros
function calcularMasaMuscularApendicular() {
  console.log("Ejecutando calcularMasaMuscularApendicular()");
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

// Función mejorada para actualizar recomendaciones clínicas basadas en antropometría
function actualizarRecomendacionesAntropometria() {
  console.log("Ejecutando actualizarRecomendacionesAntropometria()");
  const recomendacionesElement = document.getElementById('texto_recomendaciones_antropometria');
  if (!recomendacionesElement) {
    console.error("No se encontró el elemento texto_recomendaciones_antropometria");
    return;
  }
  
  const imc = parseFloat(document.getElementById('imc').value);
  const cintura = parseFloat(document.getElementById('perimetro_cintura').value);
  const cadera = parseFloat(document.getElementById('perimetro_cadera').value);
  const genero = document.getElementById('genero') ? document.getElementById('genero').value : '';
  const riesgoSarcopenia = document.getElementById('riesgo_sarcopenia') ? 
                          document.getElementById('riesgo_sarcopenia').value : '';
  const perimetroCuello = parseFloat(document.getElementById('perimetro_cuello').value);
  
  console.log("Valores para recomendaciones:", {
    imc, cintura, cadera, genero, riesgoSarcopenia, perimetroCuello
  });
  
  let evaluacionRecomendaciones = [];
  let tratamientoRecomendaciones = [];
  let educacionRecomendaciones = [];
  
  // Color para el panel de recomendaciones basado en la cantidad de hallazgos
  let colorPanel = 'alert-info';
  let cantidadHallazgos = 0;
  
  // Recomendaciones basadas en IMC
  if (imc) {
    if (imc < 18.5) {
      cantidadHallazgos++;
      evaluacionRecomendaciones.push('IMC indica bajo peso. Considere evaluación nutricional completa.');
      evaluacionRecomendaciones.push('Evaluar posibles causas de pérdida de peso (metabólicas, digestivas, psicológicas).');
      tratamientoRecomendaciones.push('Derivación a nutricionista para plan de alimentación hipercalórico.');
      educacionRecomendaciones.push('Explicar al paciente la importancia del aporte calórico adecuado para la recuperación funcional.');
    } else if (imc >= 25 && imc < 30) {
      cantidadHallazgos++;
      evaluacionRecomendaciones.push('IMC indica sobrepeso. Evaluar composición corporal (% de grasa vs. masa muscular).');
      tratamientoRecomendaciones.push('Recomendar actividad física regular (150 min/semana de ejercicio aeróbico moderado + 2 sesiones de fortalecimiento).');
      tratamientoRecomendaciones.push('Considerar plan de alimentación equilibrado con déficit calórico moderado (300-500 kcal/día).');
      educacionRecomendaciones.push('Educar sobre alimentación saludable y beneficios de la actividad física regular.');
    } else if (imc >= 30 && imc < 35) {
      cantidadHallazgos += 2;
      evaluacionRecomendaciones.push('IMC indica obesidad grado I. Evaluar factores de riesgo metabólico (HTA, dislipidemia, glucosa).');
      tratamientoRecomendaciones.push('Derivar a nutricionista para plan de alimentación estructurado.');
      tratamientoRecomendaciones.push('Recomendar programa de ejercicio supervisado que combine actividad aeróbica y fortalecimiento.');
      educacionRecomendaciones.push('Educar sobre complicaciones de la obesidad y beneficios de la pérdida de peso gradual (5-10% en 6 meses).');
    } else if (imc >= 35) {
      cantidadHallazgos += 3;
      evaluacionRecomendaciones.push('IMC indica obesidad grado II-III. Evaluación médica completa para descartar patologías asociadas.');
      evaluacionRecomendaciones.push('Evaluar limitaciones funcionales relacionadas con el peso.');
      tratamientoRecomendaciones.push('Derivación a equipo multidisciplinario (médico, nutricionista, psicólogo).');
      tratamientoRecomendaciones.push('Considerar programa de ejercicio adaptado a las limitaciones funcionales.');
      educacionRecomendaciones.push('Establecer metas realistas y graduales de pérdida de peso.');
    }
  }
  
  // Recomendaciones basadas en perímetro de cintura
  if (cintura && genero) {
    const riesgoModerado = (genero === 'Masculino' && cintura >= 94 && cintura < 102) || 
                           (genero === 'Femenino' && cintura >= 80 && cintura < 88);
    const riesgoElevado = (genero === 'Masculino' && cintura >= 102) || 
                          (genero === 'Femenino' && cintura >= 88);
    
    if (riesgoElevado) {
      cantidadHallazgos += 2;
      evaluacionRecomendaciones.push('Perímetro de cintura indica riesgo cardiovascular alto. Evaluar perfil lipídico, presión arterial y glucemia.');
      tratamientoRecomendaciones.push('Priorizar reducción de grasa abdominal con ejercicio aeróbico regular (30-60 min/día, 5+ días/semana).');
      tratamientoRecomendaciones.push('Considerar derivación a médico para evaluación de síndrome metabólico.');
      educacionRecomendaciones.push('Educar sobre relación entre grasa abdominal y riesgo cardiovascular/metabólico.');
    } else if (riesgoModerado) {
      cantidadHallazgos++;
      evaluacionRecomendaciones.push('Perímetro de cintura indica riesgo cardiovascular moderado.');
      tratamientoRecomendaciones.push('Recomendar ejercicio regular combinando aeróbico (150 min/semana) y fortalecimiento (2 sesiones/semana).');
      educacionRecomendaciones.push('Aconsejar sobre alimentación saludable enfatizando reducción de azúcares refinados y grasas saturadas.');
    }
  }
  
  // Recomendaciones basadas en índice cintura/cadera
  const icc = document.getElementById('indice_cintura_cadera') ? 
             parseFloat(document.getElementById('indice_cintura_cadera').value) : 0;
  
  if (icc && genero) {
    const riesgoElevadoICC = (genero === 'Masculino' && icc > 1.0) || 
                             (genero === 'Femenino' && icc > 0.85);
    const riesgoModeradoICC = (genero === 'Masculino' && icc > 0.95 && icc <= 1.0) || 
                              (genero === 'Femenino' && icc > 0.80 && icc <= 0.85);
    
    if (riesgoElevadoICC) {
      cantidadHallazgos++;
      evaluacionRecomendaciones.push('Índice cintura/cadera elevado indica distribución central de grasa con mayor riesgo metabólico.');
      tratamientoRecomendaciones.push('Incorporar ejercicios específicos para core y zona abdominal además del programa de ejercicio general.');
    } else if (riesgoModeradoICC) {
      evaluacionRecomendaciones.push('Índice cintura/cadera moderadamente elevado, monitorizar en próximas evaluaciones.');
    }
  }
  
  // Recomendaciones basadas en índice cintura/altura
  const ica = document.getElementById('indice_cintura_altura') ? 
             parseFloat(document.getElementById('indice_cintura_altura').value) : 0;
  
  if (ica) {
    if (ica > 60) {
      cantidadHallazgos += 2;
      evaluacionRecomendaciones.push('Índice cintura/altura indica riesgo cardiometabólico alto.');
      tratamientoRecomendaciones.push('Priorizar estrategias de reducción de grasa abdominal.');
    } else if (ica > 50 && ica <= 60) {
      cantidadHallazgos++;
      evaluacionRecomendaciones.push('Índice cintura/altura indica riesgo cardiometabólico aumentado.');
      tratamientoRecomendaciones.push('Recomendar incremento progresivo de actividad física diaria.');
    } else if (ica < 40) {
      evaluacionRecomendaciones.push('Índice cintura/altura bajo, vigilar posible bajo peso.');
    }
  }
  
  // Recomendaciones basadas en perímetro de cuello
  if (perimetroCuello && genero) {
    const cuelloRiesgoAlto = (genero === 'Masculino' && perimetroCuello > 43) || 
                             (genero === 'Femenino' && perimetroCuello > 38);
    const cuelloRiesgoModerado = (genero === 'Masculino' && perimetroCuello > 40 && perimetroCuello <= 43) || 
                                 (genero === 'Femenino' && perimetroCuello > 35 && perimetroCuello <= 38);
    
    if (cuelloRiesgoAlto) {
      cantidadHallazgos++;
      evaluacionRecomendaciones.push('Perímetro de cuello aumentado. Considerar screening para apnea del sueño y riesgo cardiovascular.');
      educacionRecomendaciones.push('Informar sobre relación entre perímetro de cuello aumentado y alteraciones del sueño/respiratorias.');
    } else if (cuelloRiesgoModerado) {
      evaluacionRecomendaciones.push('Perímetro de cuello moderadamente aumentado. Consultar sobre calidad del sueño y ronquidos.');
    }
  }
  
  // Recomendaciones basadas en diferencias laterales
  const medidasLaterales = document.querySelectorAll('.side-measurement');
  let asimetriasSignificativas = false;
  let asimetriasModeradas = false;
  
  medidasLaterales.forEach(input => {
    const id = input.id;
    const pairId = input.getAttribute('data-pair');
    
    if (document.getElementById(pairId) && input.value && document.getElementById(pairId).value) {
      const val1 = parseFloat(input.value);
      const val2 = parseFloat(document.getElementById(pairId).value);
      const diff = Math.abs(val1 - val2);
      
      if (diff > 2) {
        asimetriasSignificativas = true;
      } else if (diff > 1) {
        asimetriasModeradas = true;
      }
    }
  });
  
  if (asimetriasSignificativas) {
    cantidadHallazgos += 2;
    evaluacionRecomendaciones.push('Asimetrías significativas (>2cm) entre miembros. Realizar evaluación funcional detallada.');
    evaluacionRecomendaciones.push('Considerar evaluación de fuerza, movilidad y control motor para identificar déficits específicos.');
    tratamientoRecomendaciones.push('Implementar programa de ejercicios para corregir desequilibrios musculares.');
    tratamientoRecomendaciones.push('Evaluar necesidad de estudios de imagen si existe sospecha de patología estructural.');
  } else if (asimetriasModeradas) {
    cantidadHallazgos++;
    evaluacionRecomendaciones.push('Asimetrías moderadas (1-2cm) entre miembros. Monitorizar en evaluaciones futuras.');
    evaluacionRecomendaciones.push('Evaluar si las asimetrías están relacionadas con dominancia o factores ocupacionales/deportivos.');
  }
  
  // Recomendaciones basadas en riesgo de sarcopenia
  if (riesgoSarcopenia) {
    if (riesgoSarcopenia === 'Alto') {
      cantidadHallazgos += 3;
      evaluacionRecomendaciones.push('Alto riesgo de sarcopenia. Evaluar:');
      evaluacionRecomendaciones.push('- Fuerza muscular (dinamometría de agarre, prueba sentarse-pararse 5 veces).');
      evaluacionRecomendaciones.push('- Desempeño físico (velocidad de marcha, Short Physical Performance Battery).');
      evaluacionRecomendaciones.push('- Nivel de actividad física y factores de riesgo nutricionales.');
      
      tratamientoRecomendaciones.push('Intervenciones para sarcopenia:');
      tratamientoRecomendaciones.push('- Programa de ejercicio de fortalecimiento muscular progresivo 2-3 veces/semana.');
      tratamientoRecomendaciones.push('- Entrenamiento de resistencia con cargas moderadas-altas (60-80% 1RM).');
      tratamientoRecomendaciones.push('- Evaluación nutricional con énfasis en ingesta proteica (1.2-1.5 g/kg/día).');
      tratamientoRecomendaciones.push('- Considerar derivación a geriatra o especialista en sarcopenia.');
      
      educacionRecomendaciones.push('Educar sobre importancia de mantener la masa muscular, especialmente en adultos mayores.');
      educacionRecomendaciones.push('Explicar el impacto de la sarcopenia en la funcionalidad y calidad de vida.');
    } else if (riesgoSarcopenia === 'Moderado') {
      cantidadHallazgos += 2;
      evaluacionRecomendaciones.push('Riesgo moderado de sarcopenia. Evaluar fuerza muscular y desempeño físico.');
      
      tratamientoRecomendaciones.push('Programa preventivo para sarcopenia:');
      tratamientoRecomendaciones.push('- Ejercicio con énfasis en fortalecimiento muscular 2 veces/semana.');
      tratamientoRecomendaciones.push('- Asegurar ingesta proteica adecuada (1.0-1.2 g/kg/día).');
      tratamientoRecomendaciones.push('- Reevaluación en 3-6 meses.');
      
      educacionRecomendaciones.push('Explicar la importancia de la prevención de la sarcopenia y sus beneficios.');
    }
  }
  
  // Determinar color del panel según la cantidad de hallazgos
  if (cantidadHallazgos >= 5) {
    colorPanel = 'alert-danger';
  } else if (cantidadHallazgos >= 3) {
    colorPanel = 'alert-warning';
  } else if (cantidadHallazgos >= 1) {
    colorPanel = 'alert-success';
  }
  
  console.log("Cantidad de hallazgos:", cantidadHallazgos, "Color panel:", colorPanel);
  
  // Cambiar color del panel de recomendaciones
  const panelRecomendaciones = document.getElementById('recomendaciones_antropometria');
  if (panelRecomendaciones) {
    panelRecomendaciones.className = 'alert mt-3 ' + colorPanel;
  }
  
  // Preparar HTML con las recomendaciones
  let html = '';
  
  console.log("Recomendaciones de evaluación:", evaluacionRecomendaciones.length);
  console.log("Recomendaciones de tratamiento:", tratamientoRecomendaciones.length);
  console.log("Recomendaciones educativas:", educacionRecomendaciones.length);
  
  if (evaluacionRecomendaciones.length > 0 || tratamientoRecomendaciones.length > 0 || educacionRecomendaciones.length > 0) {
    if (evaluacionRecomendaciones.length > 0) {
      html += '<h6><i class="fas fa-clipboard-check"></i> Recomendaciones para evaluación:</h6>';
      html += '<ul class="mb-3">';
      evaluacionRecomendaciones.forEach(rec => {
        html += `<li>${rec}</li>`;
      });
      html += '</ul>';
    }
    
    if (tratamientoRecomendaciones.length > 0) {
      html += '<h6><i class="fas fa-heartbeat"></i> Recomendaciones para tratamiento:</h6>';
      html += '<ul class="mb-3">';
      tratamientoRecomendaciones.forEach(rec => {
        html += `<li>${rec}</li>`;
      });
      html += '</ul>';
    }
    
    if (educacionRecomendaciones.length > 0) {
      html += '<h6><i class="fas fa-chalkboard-teacher"></i> Recomendaciones educativas:</h6>';
      html += '<ul class="mb-0">';
      educacionRecomendaciones.forEach(rec => {
        html += `<li>${rec}</li>`;
      });
      html += '</ul>';
    }
    
    recomendacionesElement.innerHTML = html;
    console.log("Recomendaciones actualizadas con éxito");
  } else {
    recomendacionesElement.innerHTML = 'Complete los datos antropométricos para obtener recomendaciones clínicas automáticas.';
    console.log("No hay suficientes datos para generar recomendaciones");
  }
}

// Función para actualizar el estado del acordeón de antropometría
function actualizarEstadoAcordeonAntropometria() {
  console.log("Ejecutando actualizarEstadoAcordeonAntropometria()");
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

// Función para guardar todos los datos antropométricos en el objeto del paciente
function prepararDatosAntropometriaPostural(formData) {
  // Esta función se debe llamar desde la función prepararDatosPaciente en pacientes.js
  console.log("Preparando datos de antropometría para guardar");
  
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
  
  return formData;
}

// Exponer las funciones necesarias globalmente para usarlas en otros archivos
window.prepararDatosAntropometriaPostural = prepararDatosAntropometriaPostural;

// Añadir esta función para forzar la actualización de recomendaciones
// La puedes llamar desde la consola o añadir un botón para depuración
function forzarActualizacionRecomendaciones() {
  console.log("Forzando actualización de recomendaciones...");
  actualizarRecomendacionesAntropometria();
}

// Exponer función para depuración
window.forzarActualizacionRecomendaciones = forzarActualizacionRecomendaciones;
