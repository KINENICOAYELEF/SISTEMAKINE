// Funcionalidades para la gestión de evoluciones

// Función para cargar evoluciones de un paciente
function cargarEvolucionesPaciente(patientId) {
  return db.collection('evoluciones')
    .where('pacienteId', '==', patientId)
    .orderBy('fecha', 'desc')
    .get()
    .then(snapshot => {
      const evoluciones = [];
      
      snapshot.forEach(doc => {
        evoluciones.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return evoluciones;
    });
}

// Función para cargar una evolución específica
function cargarEvolucion(evolutionId) {
  return db.collection('evoluciones').doc(evolutionId).get()
    .then(doc => {
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('La evolución no existe');
      }
    });
}

// Función para guardar una nueva evolución
function guardarEvolucion(evolutionData) {
  // Añadir marca de tiempo
  evolutionData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  
  // Asegurarse de que la fecha sea un objeto Date
  if (evolutionData.fecha && typeof evolutionData.fecha === 'string') {
    evolutionData.fecha = new Date(evolutionData.fecha);
  } else if (!evolutionData.fecha) {
    evolutionData.fecha = new Date();
  }
  
  return db.collection('evoluciones').add(evolutionData)
    .then(docRef => {
      // Actualizar la última visita del paciente
      return db.collection('pacientes').doc(evolutionData.pacienteId).update({
        ultimaVisita: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => docRef.id);
    });
}

// Función para actualizar una evolución existente
function actualizarEvolucion(evolutionId, evolutionData) {
  // Asegurarse de que la fecha sea un objeto Date
  if (evolutionData.fecha && typeof evolutionData.fecha === 'string') {
    evolutionData.fecha = new Date(evolutionData.fecha);
  }
  
  return db.collection('evoluciones').doc(evolutionId).update(evolutionData);
}

// Función para eliminar una evolución
function eliminarEvolucion(evolutionId) {
  return db.collection('evoluciones').doc(evolutionId).delete();
}

// Función para calcular estadísticas de evolución
function calcularEstadisticasEvolucion(evoluciones) {
  if (!evoluciones || evoluciones.length === 0) {
    return {
      total: 0,
      promedioDolor: 0,
      tendenciaDolor: 'Sin datos',
      promedioDuracion: 0,
      ultimaFecha: 'Sin evoluciones'
    };
  }
  
  // Ordenar evoluciones por fecha (más antigua a más reciente)
  const evolucionesOrdenadas = [...evoluciones].sort((a, b) => {
    const fechaA = a.fecha ? (a.fecha.toDate ? a.fecha.toDate() : new Date(a.fecha)) : new Date(0);
    const fechaB = b.fecha ? (b.fecha.toDate ? b.fecha.toDate() : new Date(b.fecha)) : new Date(0);
    return fechaA - fechaB;
  });
  
  // Calcular total
  const total = evoluciones.length;
  
  // Calcular promedio de dolor (EVA)
  let sumaDolor = 0;
  let contadorDolor = 0;
  
  evoluciones.forEach(ev => {
    if (ev.nivelDolor !== undefined && ev.nivelDolor !== null) {
      sumaDolor += parseFloat(ev.nivelDolor);
      contadorDolor++;
    }
  });
  
  const promedioDolor = contadorDolor > 0 ? (sumaDolor / contadorDolor).toFixed(1) : 'Sin datos';
  
  // Calcular tendencia del dolor
  let tendenciaDolor = 'Sin datos';
  
  if (evolucionesOrdenadas.length >= 2 && 
      evolucionesOrdenadas[0].nivelDolor !== undefined && 
      evolucionesOrdenadas[evolucionesOrdenadas.length - 1].nivelDolor !== undefined) {
    
    const primerDolor = parseFloat(evolucionesOrdenadas[0].nivelDolor);
    const ultimoDolor = parseFloat(evolucionesOrdenadas[evolucionesOrdenadas.length - 1].nivelDolor);
    
    if (ultimoDolor < primerDolor) {
      tendenciaDolor = 'Mejora';
    } else if (ultimoDolor > primerDolor) {
      tendenciaDolor = 'Empeora';
    } else {
      tendenciaDolor = 'Estable';
    }
  }
  
  // Calcular promedio de duración
  let sumaDuracion = 0;
  let contadorDuracion = 0;
  
  evoluciones.forEach(ev => {
    if (ev.duracionSesion !== undefined && ev.duracionSesion !== null) {
      sumaDuracion += parseFloat(ev.duracionSesion);
      contadorDuracion++;
    }
  });
  
  const promedioDuracion = contadorDuracion > 0 ? (sumaDuracion / contadorDuracion).toFixed(0) : 'Sin datos';
  
  // Obtener última fecha
  const ultimaEvolucion = evolucionesOrdenadas[evolucionesOrdenadas.length - 1];
  const ultimaFecha = ultimaEvolucion.fecha ? 
    (ultimaEvolucion.fecha.toDate ? 
      ultimaEvolucion.fecha.toDate().toLocaleDateString() : 
      new Date(ultimaEvolucion.fecha).toLocaleDateString()) : 
    'Fecha desconocida';
  
  return {
    total,
    promedioDolor,
    tendenciaDolor,
    promedioDuracion,
    ultimaFecha
  };
}

// Función para generar gráfico de evolución del dolor
function generarGraficoEvolucionDolor(evoluciones, canvasId) {
  if (!evoluciones || evoluciones.length === 0) {
    return;
  }
  
  // Ordenar evoluciones por fecha (más antigua a más reciente)
  const evolucionesOrdenadas = [...evoluciones].sort((a, b) => {
    const fechaA = a.fecha ? (a.fecha.toDate ? a.fecha.toDate() : new Date(a.fecha)) : new Date(0);
    const fechaB = b.fecha ? (b.fecha.toDate ? b.fecha.toDate() : new Date(b.fecha)) : new Date(0);
    return fechaA - fechaB;
  });
  
  // Preparar datos para el gráfico
  const fechas = [];
  const nivelesDolor = [];
  
  evolucionesOrdenadas.forEach(ev => {
    if (ev.fecha && ev.nivelDolor !== undefined && ev.nivelDolor !== null) {
      const fecha = ev.fecha.toDate ? 
        ev.fecha.toDate().toLocaleDateString() : 
        new Date(ev.fecha).toLocaleDateString();
      
      fechas.push(fecha);
      nivelesDolor.push(parseFloat(ev.nivelDolor));
    }
  });
  
  // Si no hay datos suficientes, salir
  if (fechas.length < 2) {
    return;
  }
  
  // Obtener el contexto del canvas
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Crear gráfico
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Nivel de Dolor (EVA)',
        data: nivelesDolor,
        backgroundColor: 'rgba(131, 0, 224, 0.2)',
        borderColor: 'rgba(131, 0, 224, 1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: 'rgba(131, 0, 224, 1)',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          title: {
            display: true,
            text: 'Nivel de Dolor (EVA)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Fecha'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Evolución del Dolor a lo largo del tiempo',
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Dolor: ${context.raw}/10`;
            }
          }
        }
      }
    }
  });
  
  return chart;
}

// Función para exportar evoluciones a PDF
function exportarEvolucionesPDF(patientData, evoluciones) {
  // Crear un nuevo documento PDF
  const doc = new jsPDF();
  
  // Configurar márgenes y estilos
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Añadir logo o título
  doc.setFontSize(18);
  doc.setTextColor(131, 0, 224); // Color principal
  doc.text('SISTEMAKINE', pageWidth / 2, margin, { align: 'center' });
  
  // Añadir información del paciente
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Ficha de Evoluciones - ${patientData.nombreCompleto}`, pageWidth / 2, margin + 10, { align: 'center' });
  
  // Datos del paciente
  doc.setFontSize(10);
  doc.text(`Paciente: ${patientData.nombreCompleto}`, margin, margin + 25);
  doc.text(`RUT: ${patientData.documentoIdentidad || 'No registrado'}`, margin, margin + 30);
  
  // Encabezado de la tabla
  let y = margin + 40;
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(131, 0, 224);
  doc.rect(margin, y, contentWidth, 8, 'F');
  
  // Dividir el ancho en columnas
  const col1 = 25; // Fecha
  const col2 = 15; // Dolor
  const col3 = 15; // Duración
  const col4 = contentWidth - col1 - col2 - col3; // Observaciones
  
  // Texto del encabezado
  doc.text('Fecha', margin + 5, y + 5);
  doc.text('Dolor', margin + col1 + 5, y + 5);
  doc.text('Duración', margin + col1 + col2 + 5, y + 5);
  doc.text('Observaciones', margin + col1 + col2 + col3 + 5, y + 5);
  
  y += 8;
  
  // Ordenar evoluciones por fecha (más reciente a más antigua)
  const evolucionesOrdenadas = [...evoluciones].sort((a, b) => {
    const fechaA = a.fecha ? (a.fecha.toDate ? a.fecha.toDate() : new Date(a.fecha)) : new Date(0);
    const fechaB = b.fecha ? (b.fecha.toDate ? b.fecha.toDate() : new Date(b.fecha)) : new Date(0);
    return fechaB - fechaA;
  });
  
  // Añadir filas de datos
  let alternarColor = false;
  
  evolucionesOrdenadas.forEach((ev, index) => {
    // Verificar si necesitamos una nueva página
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    
    // Color de fondo alternado
    if (alternarColor) {
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y, contentWidth, 20, 'F');
    }
    alternarColor = !alternarColor;
    
    // Color del texto
    doc.setTextColor(0, 0, 0);
    
    // Datos
    const fecha = ev.fecha ? 
      (ev.fecha.toDate ? 
        ev.fecha.toDate().toLocaleDateString() : 
        new Date(ev.fecha).toLocaleDateString()) : 
      'Fecha desconocida';
    
    const nivelDolor = ev.nivelDolor !== undefined ? `${ev.nivelDolor}/10` : '-';
    const duracion = ev.duracionSesion ? `${ev.duracionSesion} min` : '-';
    
    // Texto con saltos de línea para observaciones
    doc.text(fecha, margin + 5, y + 5);
    doc.text(nivelDolor, margin + col1 + 5, y + 5);
    doc.text(duracion, margin + col1 + col2 + 5, y + 5);
    
    // Manejar texto largo con saltos de línea automáticos
    const observaciones = ev.observaciones || '-';
    const splitObservaciones = doc.splitTextToSize(observaciones, col4 - 10);
    doc.text(splitObservaciones, margin + col1 + col2 + col3 + 5, y + 5);
    
    // Ajustar altura según el contenido
    const textHeight = Math.max(20, splitObservaciones.length * 5 + 5);
    
    // Si hay texto que requiere más altura, ajustar el rectángulo
    if (textHeight > 20) {
      if (alternarColor) {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, contentWidth, textHeight, 'F');
      }
    }
    
    y += textHeight;
  });
  
  // Añadir pie de página con fecha de generación
  const fechaGeneracion = new Date().toLocaleDateString();
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Documento generado el ${fechaGeneracion} por SISTEMAKINE`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  
  // Guardar el documento
  doc.save(`Evoluciones_${patientData.nombreCompleto.replace(/\s+/g, '_')}.pdf`);
}

// Exportar funciones para uso global
window.cargarEvolucionesPaciente = cargarEvolucionesPaciente;
window.cargarEvolucion = cargarEvolucion;
window.guardarEvolucion = guardarEvolucion;
window.actualizarEvolucion = actualizarEvolucion;
window.eliminarEvolucion = eliminarEvolucion;
window.calcularEstadisticasEvolucion = calcularEstadisticasEvolucion;
window.generarGraficoEvolucionDolor = generarGraficoEvolucionDolor;
window.exportarEvolucionesPDF = exportarEvolucionesPDF;
