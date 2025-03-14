/**
 * Script de solución independiente para SISTEMAKINE
 * Este script soluciona los problemas de cálculo e interpretación del hombro
 * sin interferir con el resto del sistema
 */

(function() {
  // Esperar a que la página esté completamente cargada
  window.addEventListener('load', function() {
    console.log("Script de solución para hombro cargado correctamente");
    setTimeout(crearBotonCalculoHombro, 1000);
  });

  // Función para crear el botón de cálculo
  function crearBotonCalculoHombro() {
    // Buscar el contenedor del hombro
    let contenedor = document.querySelector('.calculadora-deficit-hombro');
    if (!contenedor) {
      // Alternativas para encontrar un buen lugar para el botón
      const posiblesContenedores = [
        document.querySelector('[id*="hombro_deficit"]'),
        document.querySelector('div[id*="hombro"]'),
        document.querySelector('.tabla-rom'),
        document.querySelector('#tabla_rom_hombro')
      ];
      
      for (let posible of posiblesContenedores) {
        if (posible) {
          contenedor = posible;
          break;
        }
      }
    }
    
    // Si encontramos un contenedor, añadimos el botón
    if (contenedor) {
      if (!document.getElementById('btn_calcular_hombro_fix')) {
        const boton = document.createElement('button');
        boton.id = 'btn_calcular_hombro_fix';
        boton.className = 'btn btn-success mt-2 mb-2 w-100';
        boton.textContent = 'ACTUALIZAR CÁLCULOS E INTERPRETACIÓN DEL HOMBRO';
        boton.style.fontWeight = 'bold';
        boton.style.padding = '10px';
        
        boton.onclick = function() {
          calcularHombro();
          return false; // Prevenir comportamiento por defecto
        };
        
        contenedor.appendChild(boton);
        console.log("Botón de cálculo para hombro creado correctamente");
      }
    } else {
      // Crear botón flotante como último recurso
      crearBotonFlotante();
    }
  }
  
  // Crear botón flotante (aparecerá en la esquina de la pantalla)
  function crearBotonFlotante() {
    if (!document.getElementById('btn_flotante_hombro')) {
      const boton = document.createElement('button');
      boton.id = 'btn_flotante_hombro';
      boton.textContent = 'CALCULAR HOMBRO';
      boton.style.position = 'fixed';
      boton.style.bottom = '20px';
      boton.style.right = '20px';
      boton.style.zIndex = '9999';
      boton.style.padding = '10px 15px';
      boton.style.backgroundColor = '#198754';
      boton.style.color = 'white';
      boton.style.border = 'none';
      boton.style.borderRadius = '5px';
      boton.style.fontWeight = 'bold';
      boton.style.cursor = 'pointer';
      
      boton.onclick = function() {
        calcularHombro();
        return false;
      };
      
      document.body.appendChild(boton);
      console.log("Botón flotante para cálculo de hombro creado");
    }
  }
  
  // Función principal para realizar todos los cálculos del hombro
  function calcularHombro() {
    console.log("Iniciando cálculos del hombro...");
    
    // 1. Recopilar todos los valores ingresados
    const inputs = {};
    document.querySelectorAll('input[id^="hombro_"][type="number"]').forEach(input => {
      if (input.value) {
        inputs[input.id] = parseFloat(input.value);
      }
    });
    
    console.log("Valores encontrados:", inputs);
    
    // 2. Evaluar estado de rangos de movimiento
    evaluarEstadosROM(inputs);
    
    // 3. Calcular déficit funcional
    const deficitPorcentaje = calcularDeficitFuncional(inputs);
    
    // 4. Actualizar interpretación y recomendaciones
    actualizarInterpretaciones(inputs, deficitPorcentaje);
    
    // Mostrar mensaje de éxito
    alert('Cálculos e interpretaciones de hombro actualizados exitosamente');
  }
  
  // Evaluar estados de ROM para cada valor
  function evaluarEstadosROM(inputs) {
    // Definir valores normativos
    const valoresNormativos = {
      "flexion": 180,
      "extension": 50,
      "abduccion": 180,
      "aduccion": 30,
      "rot_int": 70,
      "rot_ext": 90
    };
    
    // Procesar cada input activo
    for (const [id, valor] of Object.entries(inputs)) {
      if (id.endsWith('_activo')) {
        // Extraer el tipo de movimiento del ID
        let movimiento = "";
        
        if (id.includes('_flexion_')) movimiento = "flexion";
        else if (id.includes('_extension_')) movimiento = "extension";
        else if (id.includes('_abduccion_')) movimiento = "abduccion";
        else if (id.includes('_aduccion_')) movimiento = "aduccion";
        else if (id.includes('_rot_int_')) movimiento = "rot_int";
        else if (id.includes('_rot_ext_')) movimiento = "rot_ext";
        
        // Obtener valor normativo
        const valorNormal = valoresNormativos[movimiento];
        const valorModerado = valorNormal * 0.6;
        
        // Determinar estado
        let estado = "Normal";
        let colorClase = "bg-success text-white";
        
        if (valor < valorModerado) {
          estado = "Disminuido";
          colorClase = "bg-danger text-white";
        } else if (valor < valorNormal) {
          estado = "Limitado";
          colorClase = "bg-warning";
        }
        
        // Actualizar elemento de estado
        const estadoElement = document.getElementById(id + "_estado");
        if (estadoElement) {
          estadoElement.innerHTML = estado;
          estadoElement.className = colorClase;
        }
      }
    }
  }
  
  // Calcular déficit funcional
  function calcularDeficitFuncional(inputs) {
    // Valores normativos para hombro
    const valoresNormativos = {
      "flexion": 180,
      "extension": 50,
      "abduccion": 180,
      "aduccion": 30,
      "rot_int": 70,
      "rot_ext": 90
    };
    
    let totalDeficit = 0;
    let movimientosEvaluados = 0;
    
    // Procesar cada input activo
    for (const [id, valor] of Object.entries(inputs)) {
      if (id.endsWith('_activo')) {
        // Extraer el tipo de movimiento del ID
        let movimiento = "";
        
        if (id.includes('_flexion_')) movimiento = "flexion";
        else if (id.includes('_extension_')) movimiento = "extension";
        else if (id.includes('_abduccion_')) movimiento = "abduccion";
        else if (id.includes('_aduccion_')) movimiento = "aduccion";
        else if (id.includes('_rot_int_')) movimiento = "rot_int";
        else if (id.includes('_rot_ext_')) movimiento = "rot_ext";
        
        const valorNormativo = valoresNormativos[movimiento];
        
        if (valorNormativo) {
          // Calcular déficit en porcentaje
          const deficitPorcentaje = Math.max(0, Math.min(100, 100 - (valor / valorNormativo * 100)));
          totalDeficit += deficitPorcentaje;
          movimientosEvaluados++;
        }
      }
    }
    
    // Calcular promedio
    let deficitPromedio = 0;
    if (movimientosEvaluados > 0) {
      deficitPromedio = totalDeficit / movimientosEvaluados;
      
      // Actualizar campo de déficit total
      const deficitTotalElement = document.getElementById("hombro_deficit_total");
      if (deficitTotalElement) {
        deficitTotalElement.value = deficitPromedio.toFixed(1) + "%";
      }
      
      // Actualizar barra visual
      const deficitVisualElement = document.getElementById("hombro_deficit_visual");
      if (deficitVisualElement && deficitVisualElement.querySelector('.progress-bar')) {
        const barra = deficitVisualElement.querySelector('.progress-bar');
        barra.style.width = deficitPromedio + "%";
        
        // Cambiar color según severidad
        let colorClase = "bg-success";
        if (deficitPromedio >= 50) colorClase = "bg-danger";
        else if (deficitPromedio >= 25) colorClase = "bg-warning";
        else if (deficitPromedio >= 10) colorClase = "bg-info";
        
        barra.className = `progress-bar ${colorClase}`;
      }
    }
    
    return deficitPromedio;
  }
  
  // Actualizar interpretaciones y recomendaciones
  function actualizarInterpretaciones(inputs, deficitPorcentaje) {
    // Contar estados
    let movimientosDisminuidos = 0;
    let movimientosLimitados = 0;
    let movimientosNormales = 0;
    
    document.querySelectorAll('[id^="hombro_"][id$="_estado"]').forEach(elem => {
      if (elem.textContent === "Disminuido") movimientosDisminuidos++;
      else if (elem.textContent === "Limitado") movimientosLimitados++;
      else if (elem.textContent === "Normal") movimientosNormales++;
    });
    
    // Contar movimientos dolorosos
    let movimientosDolorosos = 0;
    document.querySelectorAll('select[id^="hombro_"][id$="_dolor"]').forEach(select => {
      if (select.value && select.value !== "No") {
        movimientosDolorosos++;
      }
    });
    
    // Generar texto de interpretación
    let interpretacion = "";
    
    if (movimientosDisminuidos > 0) {
      interpretacion += `<p class="alert alert-danger">Se observa limitación severa en ${movimientosDisminuidos} movimiento(s) de hombro, indicando un compromiso importante de la movilidad con potencial impacto funcional significativo.</p>`;
    } else if (movimientosLimitados > 0) {
      interpretacion += `<p class="alert alert-warning">Se observa limitación moderada en ${movimientosLimitados} movimiento(s) de hombro, sugiriendo restricción de movilidad con impacto funcional moderado.</p>`;
    } else if (movimientosNormales > 0) {
      interpretacion += `<p class="alert alert-success">Los rangos de movimiento de hombro se encuentran dentro de parámetros normales o funcionales.</p>`;
    } else {
      interpretacion += `<p class="alert alert-info">Complete la evaluación de rangos de movimiento para obtener una interpretación más detallada.</p>`;
    }
    
    if (movimientosDolorosos > 0) {
      interpretacion += `<p>Se evidencia dolor durante ${movimientosDolorosos} movimiento(s), lo que sugiere componente inflamatorio o sensibilización.</p>`;
    }
    
    if (deficitPorcentaje > 0) {
      interpretacion += `<p>El déficit funcional calculado es de ${deficitPorcentaje.toFixed(1)}%, lo que indica `;
      if (deficitPorcentaje >= 50) interpretacion += `una limitación severa`;
      else if (deficitPorcentaje >= 25) interpretacion += `una limitación moderada`;
      else if (deficitPorcentaje >= 10) interpretacion += `una limitación leve`;
      else interpretacion += `una limitación mínima`;
      interpretacion += ` en la función global del hombro.</p>`;
    }
    
    // Actualizar elemento de interpretación
    const interpretacionElement = document.getElementById("interpretacion-hombro-texto");
    if (interpretacionElement) {
      interpretacionElement.innerHTML = interpretacion;
    }
    
    // Generar recomendaciones
    let recomendaciones = "<ul>";
    
    if (movimientosDisminuidos > 0) {
      recomendaciones += `<li>Priorizar técnicas para <strong>recuperación progresiva de la movilidad</strong> con abordaje gradual.</li>`;
      recomendaciones += `<li>Considerar tratamiento <strong>multimodal</strong> que incluya movilizaciones articulares y ejercicio terapéutico.</li>`;
      recomendaciones += `<li>Implementar programa de <strong>ejercicios domiciliarios</strong> con progresión controlada.</li>`;
    } else if (movimientosLimitados > 0) {
      recomendaciones += `<li>Implementar técnicas de <strong>movilización articular específica</strong> para los movimientos comprometidos.</li>`;
      recomendaciones += `<li>Diseñar <strong>ejercicios de control motor</strong> con énfasis en calidad más que en rango.</li>`;
      recomendaciones += `<li>Monitorizar la <strong>progresión</strong> enfocándose en mejorar la funcionalidad para actividades diarias.</li>`;
    } else {
      recomendaciones += `<li>Realizar <strong>ejercicios de movilidad</strong> para mantener rangos funcionales.</li>`;
      recomendaciones += `<li>Integrar <strong>entrenamiento funcional</strong> que incluya los patrones de movimiento específicos.</li>`;
      recomendaciones += `<li>Educar sobre <strong>ergonomía y posturas</strong> para prevenir limitaciones.</li>`;
    }
    
    if (movimientosDolorosos > 0) {
      recomendaciones += `<li>Implementar estrategias de <strong>modulación del dolor</strong> durante las técnicas terapéuticas.</li>`;
      recomendaciones += `<li>Considerar <strong>dosificación gradual</strong> de la intensidad para no exacerbar síntomas.</li>`;
    }
    
    recomendaciones += "</ul>";
    
    // Actualizar elemento de recomendaciones
    const recomendacionesElement = document.getElementById("recomendaciones-hombro-texto");
    if (recomendacionesElement) {
      recomendacionesElement.innerHTML = recomendaciones;
    }
    
    // Actualizar consideraciones
    const consideraciones = `<ul>
      <li>Analizar la calidad del ritmo escapulohumeral durante los movimientos.</li>
      <li>Evaluar la estabilidad dinámica durante actividades funcionales.</li>
      <li>Considerar el efecto de la postura cervical y dorsal en la mecánica del hombro.</li>
      <li>Valorar patrones de reclutamiento muscular y posibles compensaciones.</li>
    </ul>`;
    
    const consideracionesElement = document.getElementById("consideraciones-hombro-texto");
    if (consideracionesElement) {
      consideracionesElement.innerHTML = consideraciones;
    }
  }
  
  // Exponer la función al ámbito global para acceso desde la consola
  window.calcularHombroSistemakine = calcularHombro;
})();
