// Funcionalidades para la gestión de pacientes

// Función para cargar un paciente específico
function cargarPaciente(patientId) {
  return db.collection('pacientes').doc(patientId).get()
    .then(doc => {
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('El paciente no existe');
      }
    });
}

// Cargar datos de evaluación postural
        cargarDatosEvaluacionPostural(paciente);
        
        // ... resto del código ...
      } else {
        console.log('No existe el paciente con ID:', pacienteId);
      }
    })
    .catch((error) => {
      console.error('Error al cargar el paciente:', error);
    });
}

// Función para guardar un nuevo paciente
function guardarPaciente(patientData) {
  // Añadir marca de tiempo
  patientData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  patientData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  
  return db.collection('pacientes').add(patientData)
    .then(docRef => {
      return docRef.id;
    });
}
// Obtener datos del paciente
  const datosPaciente = {
    // ... datos existentes del paciente ...
    
    // Agregar datos de la evaluación postural
    evaluacionPostural: prepararDatosEvaluacionPostural()
  };
  
  // Guardar en Firebase
  const pacienteRef = firebase.firestore().collection('pacientes').doc(pacienteId);
  
  pacienteRef.set(datosPaciente, { merge: true })
    .then(() => {
      console.log('Paciente guardado correctamente con evaluación postural');
      // ... código existente ...
    })
    .catch((error) => {
      console.error('Error al guardar el paciente:', error);
      alert('Error al guardar: ' + error.message);
    });
}

// Función para cargar los datos de evaluación postural cuando se carga un paciente
function cargarDatosEvaluacionPostural(paciente) {
  if (!paciente || !paciente.evaluacionPostural) return;
  
  const ep = paciente.evaluacionPostural;
  
  // Cargar datos de posición cabeza
  if (ep.cabeza) {
    document.getElementById('posicion-cabeza').value = ep.cabeza.posicion || '';
    document.getElementById('obs-posicion-cabeza').value = ep.cabeza.observaciones || '';
    actualizarRelevanciaPostural('posicion-cabeza');
  }
  
  // Cargar datos de hombros
  if (ep.hombros) {
    document.getElementById('posicion-hombros').value = ep.hombros.posicion || '';
    document.getElementById('obs-posicion-hombros').value = ep.hombros.observaciones || '';
    actualizarRelevanciaPostural('posicion-hombros');
  }
  
  // Cargar datos de rodillas
  if (ep.rodillas) {
    document.getElementById('alineacion-rodillas').value = ep.rodillas.alineacion || '';
    document.getElementById('obs-alineacion-rodillas').value = ep.rodillas.observaciones || '';
    actualizarRelevanciaPostural('alineacion-rodillas');
  }
  
  // Cargar datos de pies
  if (ep.pies) {
    document.getElementById('alineacion-pie').value = ep.pies.alineacion || '';
    document.getElementById('obs-alineacion-pie').value = ep.pies.observaciones || '';
    actualizarRelevanciaPostural('alineacion-pie');
  }
  
  // Cargar datos de asimetrías
  if (ep.asimetrias) {
    document.getElementById('asimetrias').value = ep.asimetrias.tipo || '';
    document.getElementById('obs-asimetrias').value = ep.asimetrias.observaciones || '';
    actualizarRelevanciaPostural('asimetrias');
  }
  
  // Cargar datos de escoliosis
  if (ep.escoliosis) {
    document.getElementById('escoliosis').value = ep.escoliosis.tipo || '';
    document.getElementById('obs-escoliosis').value = ep.escoliosis.observaciones || '';
    actualizarRelevanciaPostural('escoliosis');
  }
  
  // Cargar datos de ángulos
  if (ep.angulos) {
    document.getElementById('angulo-cifosis').value = ep.angulos.cifosis || '';
    document.getElementById('angulo-lordosis').value = ep.angulos.lordosis || '';
    document.getElementById('obs-angulos').value = ep.angulos.observaciones || '';
    evaluarAngulosPosturales();
  }
  
  // Cargar datos de interpretación
  if (ep.interpretacion) {
    document.getElementById('alteraciones-relevantes').value = ep.interpretacion.alteracionesRelevantes || '';
    document.getElementById('impresion-funcional').value = ep.interpretacion.impresionFuncional || '';
  }
  
  // Cargar datos de fotos
  if (ep.fotos) {
    document.getElementById('observacion-fotos').value = ep.fotos.observaciones || '';
    
    // Cargar previews de fotos si existen URLs
    if (ep.fotos.anterior) {
      fotoAnteriorURL = ep.fotos.anterior;
      document.getElementById('preview-anterior').innerHTML = 
        `<img src="${fotoAnteriorURL}" class="img-fluid img-thumbnail" alt="Vista anterior">`;
    }
    
    if (ep.fotos.lateral) {
      fotoLateralURL = ep.fotos.lateral;
      document.getElementById('preview-lateral').innerHTML = 
        `<img src="${fotoLateralURL}" class="img-fluid img-thumbnail" alt="Vista lateral">`;
    }
    
    if (ep.fotos.posterior) {
      fotoPosteriorURL = ep.fotos.posterior;
      document.getElementById('preview-posterior').innerHTML = 
        `<img src="${fotoPosteriorURL}" class="img-fluid img-thumbnail" alt="Vista posterior">`;
    }
  }
  
  // Actualizar resumen y estado de completado
  actualizarResumenPostural();
  actualizarEstadoCompletado();
}


// Función para actualizar un paciente existente
function actualizarPaciente(patientId, patientData) {
  // Añadir marca de tiempo de actualización
  patientData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  
  return db.collection('pacientes').doc(patientId).update(patientData);
}

// Función para eliminar un paciente
function eliminarPaciente(patientId) {
  return db.collection('pacientes').doc(patientId).delete()
    .then(() => {
      // Eliminar también las evoluciones asociadas
      return db.collection('evoluciones')
        .where('pacienteId', '==', patientId)
        .get()
        .then(snapshot => {
          const batch = db.batch();
          
          snapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
          
          return batch.commit();
        });
    });
}

// Función para buscar pacientes
function buscarPacientes(searchTerm) {
  return db.collection('pacientes')
    .orderBy('nombreCompleto')
    .get()
    .then(snapshot => {
      const results = [];
      
      snapshot.forEach(doc => {
        const patient = doc.data();
        
        // Búsqueda en el cliente (Firestore no soporta búsquedas parciales)
        if (
          (patient.nombreCompleto && patient.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.documentoIdentidad && patient.documentoIdentidad.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.telefonoPersonal && patient.telefonoPersonal.includes(searchTerm))
        ) {
          results.push({
            id: doc.id,
            ...patient
          });
        }
      });
      
      return results;
    });
}

// Función para cargar la lista completa de pacientes
function cargarListaPacientes() {
  return db.collection('pacientes')
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      const patients = [];
      
      snapshot.forEach(doc => {
        patients.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return patients;
    });
}

// Función para subir un documento a Firebase Storage
function subirDocumento(file, patientId, folderName) {
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`pacientes/${patientId}/${folderName}/${file.name}`);
  
  return fileRef.put(file)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
      return {
        nombre: file.name,
        tipo: file.type,
        tamaño: file.size,
        url: downloadURL,
        fechaSubida: firebase.firestore.FieldValue.serverTimestamp()
      };
    });
}

// Función para formatear fecha como string
function formatDate(date) {
  if (!date) return '';
  
  if (typeof date === 'object' && date.toDate) {
    date = date.toDate();
  }
  
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleDateString();
}

// Función para calcular la edad a partir de la fecha de nacimiento
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '';
  
  if (typeof fechaNacimiento === 'object' && fechaNacimiento.toDate) {
    fechaNacimiento = fechaNacimiento.toDate();
  }
  
  if (!(fechaNacimiento instanceof Date)) {
    fechaNacimiento = new Date(fechaNacimiento);
  }
  
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const m = hoy.getMonth() - fechaNacimiento.getMonth();
  
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  
  return edad;
}

// Función para preparar datos del formulario para guardar
function prepararDatosPaciente(formData) {
  // Procesar fechas
  if (formData.fechaNacimiento) {
    formData.fechaNacimiento = new Date(formData.fechaNacimiento);
  }
  
  if (formData.fechaDerivacion) {
    formData.fechaDerivacion = new Date(formData.fechaDerivacion);
  }
  
  if (formData.inicioSintomas) {
    formData.inicioSintomas = new Date(formData.inicioSintomas);
  }
  
  // Calcular edad si hay fecha de nacimiento
  if (formData.fechaNacimiento) {
    formData.edad = calcularEdad(formData.fechaNacimiento);
  }
  
  // Convertir valores numéricos
  const numericFields = [
    'edad', 'peso', 'talla', 'imc', 'frecuenciaCardiaca', 'frecuenciaRespiratoria',
    'saturacionOxigeno', 'alicia_intensidad', 'escalaEVA', 'escalaNumerica',
    'horasSueno'
  ];
  
  numericFields.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      formData[field] = parseFloat(formData[field]);
    }
  });
  
  return formData;
}

// Función para llenar un formulario con datos existentes
function llenarFormularioPaciente(patient, formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Recorrer todos los campos del formulario
  Array.from(form.elements).forEach(element => {
    if (!element.name) return;
    
    const fieldName = element.name;
    const value = patient[fieldName];
    
    if (value === undefined || value === null) return;
    
    // Manejar diferentes tipos de campos
    switch (element.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'textarea':
        element.value = value;
        break;
        
      case 'date':
        if (value && typeof value === 'object' && value.toDate) {
          const date = value.toDate();
          const year = date.getFullYear();
          let month = (date.getMonth() + 1).toString().padStart(2, '0');
          let day = date.getDate().toString().padStart(2, '0');
          element.value = `${year}-${month}-${day}`;
        } else if (value instanceof Date) {
          const year = value.getFullYear();
          let month = (value.getMonth() + 1).toString().padStart(2, '0');
          let day = value.getDate().toString().padStart(2, '0');
          element.value = `${year}-${month}-${day}`;
        } else if (typeof value === 'string') {
          element.value = value;
        }
        break;
        
      case 'checkbox':
        element.checked = value === true;
        break;
        
      case 'radio':
        element.checked = element.value === value.toString();
        break;
        
      case 'select-one':
        Array.from(element.options).forEach(option => {
          option.selected = option.value === value.toString();
        });
        break;
        
      case 'select-multiple':
        if (Array.isArray(value)) {
          Array.from(element.options).forEach(option => {
            option.selected = value.includes(option.value);
          });
        }
        break;
    }
  });
}

// Función para recopilar datos de un formulario
function recopilarDatosFormulario(formId) {
  const form = document.getElementById(formId);
  if (!form) return {};
  
  const formData = {};
  
  // Recorrer todos los campos del formulario
  Array.from(form.elements).forEach(element => {
    if (!element.name) return;
    
    const fieldName = element.name;
    
    // Manejar diferentes tipos de campos
    switch (element.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'date':
      case 'textarea':
        formData[fieldName] = element.value;
        break;
        
      case 'checkbox':
        formData[fieldName] = element.checked;
        break;
        
      case 'radio':
        if (element.checked) {
          formData[fieldName] = element.value;
        }
        break;
        
      case 'select-one':
        formData[fieldName] = element.value;
        break;
        
      case 'select-multiple':
        formData[fieldName] = Array.from(element.selectedOptions).map(option => option.value);
        break;
    }
  });
  
  return formData;
}

// Agregar esto al final de tu código existente de guardarEvaluacionPostural()
function guardarEvaluacionPostural() {
  const datosEvaluacionPostural = prepararDatosEvaluacionPostural();
  const pacienteId = document.getElementById('pacienteId').value;
  
  if (!pacienteId) {
    alert('No se ha identificado un ID de paciente. Guarde primero los datos básicos.');
    return;
  }
  
  // Referencia al documento del paciente
  const pacienteRef = firebase.firestore().collection('pacientes').doc(pacienteId);
  
  // Actualizar sólo la sección de evaluación postural
  pacienteRef.update({
    'evaluacionPostural': datosEvaluacionPostural
  })
  .then(() => {
    console.log('Evaluación postural guardada correctamente');
    alert('Evaluación postural guardada correctamente.');
    
    // Actualizar badge
    const badgeElement = document.getElementById('evaluacion-postural-badge');
    badgeElement.textContent = 'Guardado';
    badgeElement.className = 'resultado-badge bg-success';
  })
  .catch((error) => {
    console.error('Error al guardar la evaluación postural:', error);
    alert('Error al guardar: ' + error.message);
  });
}

// Exportar funciones para uso global
window.cargarPaciente = cargarPaciente;
window.guardarPaciente = guardarPaciente;
window.actualizarPaciente = actualizarPaciente;
window.eliminarPaciente = eliminarPaciente;
window.buscarPacientes = buscarPacientes;
window.cargarListaPacientes = cargarListaPacientes;
window.subirDocumento = subirDocumento;
window.formatDate = formatDate;
window.calcularEdad = calcularEdad;
window.prepararDatosPaciente = prepararDatosPaciente;
window.llenarFormularioPaciente = llenarFormularioPaciente;
window.recopilarDatosFormulario = recopilarDatosFormulario;
