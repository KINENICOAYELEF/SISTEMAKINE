<!-- Script para la funcionalidad de evaluación postural -->
<script>
// Script para la sección 6.3 Evaluación Postural
(function() {
  // Todas las funciones de evaluación postural ahora están encapsuladas
  // y no afectarán a otras partes del código

  // Exponemos solo las funciones que necesitan ser accesibles globalmente
  window.evalPostural = evalPostural;
  window.limpiarEvaluacionPostural = limpiarEvaluacionPostural;
  window.guardarEvaluacionPostural = guardarEvaluacionPostural;
  
  // Función principal para evaluar hallazgos posturales
  function evalPostural(selectElement) {
    const campo = selectElement.id;
    const valor = selectElement.value;
    const relevanciaElement = document.getElementById(`relevancia-${campo}`);
    
    if (!relevanciaElement) return;
    
    // Evaluar relevancia
    let relevancia = '';
    let colorFondo = '';
    let colorTexto = 'white';
    
    // Lógica por campo
    if (campo === 'posicion-cabeza') {
      if (valor === 'Neutra') {
        relevancia = 'Normal';
        colorFondo = '#28a745'; // verde
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        colorFondo = '#ffc107'; // amarillo
        colorTexto = 'black'; // texto negro para fondo amarillo
      } else if (valor.includes('moderada')) {
        relevancia = 'Moderada';
        colorFondo = '#fd7e14'; // naranja
      } else if (valor.includes('severa')) {
        relevancia = 'Alta';
        colorFondo = '#dc3545'; // rojo
      }
    } 
    else if (campo === 'posicion-hombros') {
      if (valor === 'Neutros') {
        relevancia = 'Normal';
        colorFondo = '#28a745';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        colorFondo = '#ffc107';
        colorTexto = 'black';
      } else if (valor.includes('moderada')) {
        relevancia = 'Moderada';
        colorFondo = '#fd7e14';
      } else if (valor.includes('significativa')) {
        relevancia = 'Alta';
        colorFondo = '#dc3545';
      }
    }
    else if (campo === 'alineacion-rodillas') {
      if (valor === 'Neutra') {
        relevancia = 'Normal';
        colorFondo = '#28a745';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        colorFondo = '#ffc107';
        colorTexto = 'black';
      } else if (valor.includes('moderado')) {
        relevancia = 'Moderada';
        colorFondo = '#fd7e14';
      } else if (valor.includes('dinámico') || valor.includes('significativo')) {
        relevancia = 'Alta';
        colorFondo = '#dc3545';
      }
    }
    else if (campo === 'alineacion-pie') {
      if (valor === 'Neutro') {
        relevancia = 'Normal';
        colorFondo = '#28a745';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        colorFondo = '#ffc107';
        colorTexto = 'black';
      } else if (valor.includes('excesiva') || valor.includes('significativa')) {
        relevancia = 'Alta';
        colorFondo = '#dc3545';
      } else {
        relevancia = 'Moderada';
        colorFondo = '#fd7e14';
      }
    }
    else if (campo === 'asimetrias') {
      if (valor === 'No') {
        relevancia = 'Normal';
        colorFondo = '#28a745';
      } else if (valor.includes('leve')) {
        relevancia = 'Baja';
        colorFondo = '#ffc107';
        colorTexto = 'black';
      } else if (valor.includes('significativa')) {
        relevancia = 'Alta';
        colorFondo = '#dc3545';
      } else {
        relevancia = 'Moderada';
        colorFondo = '#fd7e14';
      }
    }
    else if (campo === 'escoliosis') {
      if (valor === 'No') {
        relevancia = 'Normal';
        colorFondo = '#28a745';
      } else if (valor === 'Leve') {
        relevancia = 'Baja';
        colorFondo = '#ffc107';
        colorTexto = 'black';
      } else if (valor === 'Moderada') {
        relevancia = 'Moderada';
        colorFondo = '#fd7e14';
      } else {
        relevancia = 'Alta';
        colorFondo = '#dc3545';
      }
    }
    
    // Actualizar el elemento de relevancia con estilos en línea
    if (relevancia) {
      relevanciaElement.textContent = relevancia;
      // Aplicar estilos en línea directamente
      relevanciaElement.style.backgroundColor = colorFondo;
      relevanciaElement.style.color = colorTexto;
      relevanciaElement.style.padding = '5px';
      relevanciaElement.style.borderRadius = '3px';
      relevanciaElement.style.textAlign = 'center';
      relevanciaElement.style.fontWeight = 'bold';
    } else {
      relevanciaElement.textContent = 'No evaluado';
      relevanciaElement.style.backgroundColor = '#6c757d'; // gris
      relevanciaElement.style.color = 'white';
      relevanciaElement.style.padding = '5px';
      relevanciaElement.style.borderRadius = '3px';
      relevanciaElement.style.textAlign = 'center';
      relevanciaElement.style.fontWeight = 'bold';
    }
    
    // Actualizar recomendaciones y resumen
    actualizarRecomendaciones();
    actualizarResumen();
    actualizarBadgePostural();
  }

  // Función para actualizar el resumen
  function actualizarResumen() {
    const resumenElement = document.getElementById('resumen-postural');
    if (!resumenElement) return;
    
    const campos = [
      { id: 'posicion-cabeza', label: 'Cabeza' },
      { id: 'posicion-hombros', label: 'Hombros' },
      { id: 'alineacion-rodillas', label: 'Rodillas' },
      { id: 'alineacion-pie', label: 'Pies' },
      { id: 'asimetrias', label: 'Asimetrías' },
      { id: 'escoliosis', label: 'Escoliosis' }
    ];
    
    const hallazgos = [];
    const alteracionesRelevantes = [];
    
    campos.forEach(campo => {
      const elemento = document.getElementById(campo.id);
      if (elemento && elemento.value && 
          elemento.value !== 'No' && 
          elemento.value !== 'Neutro' && 
          elemento.value !== 'Neutra' && 
          elemento.value !== 'Neutros') {
        hallazgos.push(`${campo.label}: ${elemento.value}`);
        alteracionesRelevantes.push(`${campo.label}: ${elemento.value}`);
      }
    });
    
    // Actualizar resumen
    if (hallazgos.length > 0) {
      resumenElement.innerHTML = hallazgos.join('; ');
      
      // Actualizar campo de alteraciones relevantes
      const alteracionesElement = document.getElementById('alteraciones-relevantes');
      if (alteracionesElement) {
        alteracionesElement.value = alteracionesRelevantes.join('.\n');
      }
    } else {
      resumenElement.textContent = 'No se han registrado hallazgos posturales significativos.';
      
      // Limpiar campo de alteraciones si no hay hallazgos
      const alteracionesElement = document.getElementById('alteraciones-relevantes');
      if (alteracionesElement) {
        alteracionesElement.value = '';
      }
    }
  }

  // Función para actualizar las recomendaciones
  function actualizarRecomendaciones() {
    // Obtener elementos
    const recomendacionesElement = document.getElementById('recomendaciones-posturales');
    const recomendacionesEvaluacion = document.getElementById('recomendacion-evaluacion');
    const recomendacionesTratamiento = document.getElementById('recomendacion-tratamiento');
    const recomendacionesEducacion = document.getElementById('recomendacion-educacion');
    
    const listaEvaluacion = document.getElementById('lista-evaluacion');
    const listaTratamiento = document.getElementById('lista-tratamiento');
    const listaEducacion = document.getElementById('lista-educacion');
    
    if (!recomendacionesElement || !recomendacionesEvaluacion || !recomendacionesTratamiento || !recomendacionesEducacion ||
        !listaEvaluacion || !listaTratamiento || !listaEducacion) return;
    
    // Limpiar listas
    listaEvaluacion.innerHTML = '';
    listaTratamiento.innerHTML = '';
    listaEducacion.innerHTML = '';
    
    // Arreglos para almacenar recomendaciones
    const evalRecomendaciones = [];
    const tratamientoRecomendaciones = [];
    const educacionRecomendaciones = [];
    
    // Obtener valores de los campos
    const posicionCabeza = document.getElementById('posicion-cabeza')?.value || '';
    const posicionHombros = document.getElementById('posicion-hombros')?.value || '';
    const alineacionRodillas = document.getElementById('alineacion-rodillas')?.value || '';
    const alineacionPie = document.getElementById('alineacion-pie')?.value || '';
    const asimetrias = document.getElementById('asimetrias')?.value || '';
    const escoliosis = document.getElementById('escoliosis')?.value || '';
    
    // Recomendaciones para Cabeza
    if (posicionCabeza.includes('anterior')) {
      evalRecomendaciones.push('Evaluar la movilidad segmentaria de la columna cervical y el control motor cervico-escapular');
      tratamientoRecomendaciones.push('Para la posición anterior de cabeza, enfóquese en ejercicios de control motor cervical y fortalecimiento de flexores profundos, no en estiramientos pasivos');
      if (posicionCabeza.includes('moderada') || posicionCabeza.includes('severa')) {
        evalRecomendaciones.push('Considerar evaluación de la funcionalidad de la ATM y músculos masticatorios');
        tratamientoRecomendaciones.push('Implementar ejercicios de biofeedback para la postura cráneo-cervical durante actividades diarias');
      }
    }
    
    // Recomendaciones para Hombros
    if (posicionHombros.includes('Protracción')) {
      evalRecomendaciones.push('Evaluar la función escapular y el ritmo escápulo-humeral');
      tratamientoRecomendaciones.push('Para la protracción de hombros, priorizar ejercicios de control motor escapular y fortalecimiento de trapecio medio/inferior');
      educacionRecomendaciones.push('Educar sobre ergonomía en posición sedente y durante el uso de dispositivos electrónicos');
    }
    
    // Recomendaciones para Rodillas
    if (alineacionRodillas.includes('dinámico')) {
      evalRecomendaciones.push('Realizar test funcionales como sentadilla monopodal y landing para valorar control de valgo dinámico');
      tratamientoRecomendaciones.push('El valgo dinámico de rodilla tiene relación con riesgo de lesiones. Considere entrenamiento neuromuscular y fortalecimiento de cadera');
      tratamientoRecomendaciones.push('Incluir ejercicios de estabilización de core y control neuromuscular de miembro inferior');
      educacionRecomendaciones.push('Educar sobre técnicas apropiadas de aterrizaje y cambio de dirección durante actividades deportivas');
    } else if (alineacionRodillas.includes('Valgo')) {
      evalRecomendaciones.push('Evaluar fuerza de abductores y rotadores externos de cadera');
    } else if (alineacionRodillas.includes('Varo')) {
      evalRecomendaciones.push('Evaluar movilidad de cadera y tobillo para descartar compensaciones');
    }
    
    // Recomendaciones para Pies
    if (alineacionPie.includes('Pronación')) {
      evalRecomendaciones.push('Evaluar la funcionalidad del arco plantar con test de Jack y navicular drop test');
      if (alineacionPie.includes('excesiva')) {
        tratamientoRecomendaciones.push('Para pronación excesiva, considerar programa progresivo de fortalecimiento intrínseco del pie y ejercicios de propiocepción');
        tratamientoRecomendaciones.push('Evaluar la necesidad de soporte temporal del arco plantar mientras se desarrolla la fuerza intrínseca');
      }
    } else if (alineacionPie.includes('Supinación')) {
      evalRecomendaciones.push('Evaluar la flexibilidad de la cadena lateral del miembro inferior');
      tratamientoRecomendaciones.push('Para supinación significativa, trabajar en la movilidad del mediopié y entrenamiento propioceptivo');
    }
    
    // Recomendaciones para Asimetrías
    if (asimetrias.includes('significativa')) {
      evalRecomendaciones.push('Realizar evaluación biomecánica detallada para identificar causas de la asimetría de miembros inferiores');
      tratamientoRecomendaciones.push('Para asimetrías significativas de miembros inferiores, considerar estrategias de compensación funcional y evaluación de necesidad de alza');
      educacionRecomendaciones.push('Explicar la relación entre asimetrías y patrones de carga durante actividades funcionales');
    }
    
    // Recomendaciones para Escoliosis
    if (escoliosis === 'Leve') {
      evalRecomendaciones.push('Monitorizar la evolución de la escoliosis periódicamente');
      tratamientoRecomendaciones.push('Para escoliosis leve, ejercicios de concientización postural y fortalecimiento general');
    } else if (escoliosis === 'Moderada') {
      evalRecomendaciones.push('Evaluar la función respiratoria y la movilidad torácica');
      tratamientoRecomendaciones.push('Para escoliosis moderada, incluir ejercicios específicos de corrección 3D como los del método Schroth');
      educacionRecomendaciones.push('Educación sobre manejo postural en actividades diarias para minimizar la progresión');
    } else if (escoliosis === 'Significativa' || escoliosis === 'Estructural') {
      evalRecomendaciones.push('Derivar para evaluación médica especializada (traumatología/ortopedia)');
      tratamientoRecomendaciones.push('Para escoliosis significativa, considerar abordaje multidisciplinario incluyendo ejercicios específicos de Schroth o similar');
      educacionRecomendaciones.push('Educar sobre la importancia de la adherencia al programa de ejercicios y el seguimiento médico');
    }
    
    // Agregar recomendaciones a las listas
    evalRecomendaciones.forEach(recomendacion => {
      const li = document.createElement('li');
      li.textContent = recomendacion;
      listaEvaluacion.appendChild(li);
    });
    
    tratamientoRecomendaciones.forEach(recomendacion => {
      const li = document.createElement('li');
      li.textContent = recomendacion;
      listaTratamiento.appendChild(li);
    });
    
    educacionRecomendaciones.forEach(recomendacion => {
      const li = document.createElement('li');
      li.textContent = recomendacion;
      listaEducacion.appendChild(li);
    });
    
    // Mostrar/ocultar secciones según si tienen contenido
    recomendacionesEvaluacion.classList.toggle('d-none', evalRecomendaciones.length === 0);
    recomendacionesTratamiento.classList.toggle('d-none', tratamientoRecomendaciones.length === 0);
    recomendacionesEducacion.classList.toggle('d-none', educacionRecomendaciones.length === 0);
    
    // Al final, actualizar el color con estilos en línea
    if (recomendacionesElement) {
      const totalRecomendaciones = evalRecomendaciones.length + tratamientoRecomendaciones.length + educacionRecomendaciones.length;
      
      // Aplicar estilos en línea directamente
      if (totalRecomendaciones === 0) {
        recomendacionesElement.style.backgroundColor = '#d1ecf1'; // azul claro (info)
        recomendacionesElement.style.borderColor = '#bee5eb';
        recomendacionesElement.style.color = '#0c5460';
      } else if (totalRecomendaciones < 3) {
        recomendacionesElement.style.backgroundColor = '#d4edda'; // verde claro (success)
        recomendacionesElement.style.borderColor = '#c3e6cb';
        recomendacionesElement.style.color = '#155724';
      } else if (totalRecomendaciones < 7) {
        recomendacionesElement.style.backgroundColor = '#fff3cd'; // amarillo claro (warning)
        recomendacionesElement.style.borderColor = '#ffeeba';
        recomendacionesElement.style.color = '#856404';
      } else {
        recomendacionesElement.style.backgroundColor = '#f8d7da'; // rojo claro (danger)
        recomendacionesElement.style.borderColor = '#f5c6cb';
        recomendacionesElement.style.color = '#721c24';
      }
      
      // Asegurar que siempre tenga estilos de alerta
      recomendacionesElement.style.position = 'relative';
      recomendacionesElement.style.padding = '0.75rem 1.25rem';
      recomendacionesElement.style.marginBottom = '1rem';
      recomendacionesElement.style.border = '1px solid transparent';
      recomendacionesElement.style.borderRadius = '0.25rem';
    }
  }

  // Función para actualizar el badge
  function actualizarBadgePostural() {
    const badgeElement = document.getElementById('evaluacion-postural-badge');
    if (!badgeElement) return;
    
    const campos = [
      'posicion-cabeza', 'posicion-hombros', 'alineacion-rodillas', 
      'alineacion-pie', 'asimetrias', 'escoliosis'
    ];
    
    let completados = 0;
    campos.forEach(campo => {
      const elemento = document.getElementById(campo);
      if (elemento && elemento.value) {
        completados++;
      }
    });
    
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

  // Función para limpiar la evaluación
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
      const elemento = document.getElementById(id);
      if (elemento) elemento.value = '';
    });
    
    // Limpiar inputs
    const inputs = [
      'obs-posicion-cabeza', 'obs-posicion-hombros', 'obs-alineacion-rodillas',
      'obs-alineacion-pie', 'obs-asimetrias', 'obs-escoliosis',
      'alteraciones-relevantes', 'impresion-funcional', 'observacion-fotos'
    ];
    
    inputs.forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.value = '';
    });
    
    // Limpiar relevancia
    const relevanciaElements = [
      'relevancia-posicion-cabeza', 'relevancia-posicion-hombros', 'relevancia-alineacion-rodillas',
      'relevancia-alineacion-pie', 'relevancia-asimetrias', 'relevancia-escoliosis'
    ];
    
    relevanciaElements.forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.textContent = 'No evaluado';
        elemento.style.backgroundColor = '#6c757d'; // gris
        elemento.style.color = 'white';
        elemento.style.padding = '5px';
        elemento.style.borderRadius = '3px';
        elemento.style.textAlign = 'center';
        elemento.style.fontWeight = 'bold';
      }
    });
    
    // Resetear resumen
    const resumenElement = document.getElementById('resumen-postural');
    if (resumenElement) {
      resumenElement.textContent = 'No se han registrado hallazgos posturales.';
    }
    
    // Resetear recomendaciones
    const recomendacionesElement = document.getElementById('recomendaciones-posturales');
    if (recomendacionesElement) {
      // Aplicar estilos en línea
      recomendacionesElement.style.backgroundColor = '#d1ecf1'; // azul claro (info)
      recomendacionesElement.style.borderColor = '#bee5eb';
      recomendacionesElement.style.color = '#0c5460';
    }
    
    // Ocultar secciones de recomendaciones
    ['recomendacion-evaluacion', 'recomendacion-tratamiento', 'recomendacion-educacion'].forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.classList.add('d-none');
    });
    
    // Limpiar listas de recomendaciones
    ['lista-evaluacion', 'lista-tratamiento', 'lista-educacion'].forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.innerHTML = '';
    });
    
    // Resetear badge
    const badgeElement = document.getElementById('evaluacion-postural-badge');
    if (badgeElement) {
      badgeElement.textContent = 'No completado';
      badgeElement.className = 'resultado-badge bg-secondary';
    }
  }

  // Función para guardar la evaluación
  function guardarEvaluacionPostural() {
    alert('Evaluación postural guardada correctamente.');
    
    const badgeElement = document.getElementById('evaluacion-postural-badge');
    if (badgeElement) {
      badgeElement.textContent = 'Guardado';
      badgeElement.className = 'resultado-badge bg-success';
    }
    
    // En una integración real, aquí se guardarían los datos en Firebase
  }
})();

/// Versión específica para la sección postural
function togglePostural(id) {
  const elemento = document.getElementById(id);
  if (elemento) {
    if (elemento.style.display === 'none') {
      elemento.style.display = 'block';
      // Cambiar ícono de + a -
      const iconElement = elemento.previousElementSibling.querySelector('i');
      if (iconElement) {
        iconElement.classList.remove('fa-plus-circle');
        iconElement.classList.add('fa-minus-circle');
      }
    } else {
      elemento.style.display = 'none';
      // Cambiar ícono de - a +
      const iconElement = elemento.previousElementSibling.querySelector('i');
      if (iconElement) {
        iconElement.classList.remove('fa-minus-circle');
        iconElement.classList.add('fa-plus-circle');
      }
    }
  }
}

// Inicializar eventos cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar la sección postural si existe
  if (document.getElementById('evaluacion-postural-content')) {
    // Configurar toggle específico para esta sección
    const header = document.querySelector('.cuestionario-header[onclick="toggleCuestionario(\'evaluacion-postural-content\')"]');
    if (header) {
      header.setAttribute('onclick', 'togglePostural(\'evaluacion-postural-content\')');
    }
  }
});
</script>
