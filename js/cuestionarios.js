// Funcionalidad para los cuestionarios clínicos

// Función para alternar la visibilidad de los cuestionarios
function toggleCuestionario(contentId) {
  const content = document.getElementById(contentId);
  const header = content.previousElementSibling;
  
  if (content.style.display === "none" || !content.style.display) {
    content.style.display = "block";
    header.classList.add("active");
  } else {
    content.style.display = "none";
    header.classList.remove("active");
  }
}

// Función para calcular escala PSFS
function calcularPSFS() {
  const puntuacion1 = document.getElementById('psfs_puntuacion1').value;
  const puntuacion2 = document.getElementById('psfs_puntuacion2').value;
  const puntuacion3 = document.getElementById('psfs_puntuacion3').value;
  
  let valores = [];
  
  if (puntuacion1 !== "") valores.push(parseFloat(puntuacion1));
  if (puntuacion2 !== "") valores.push(parseFloat(puntuacion2));
  if (puntuacion3 !== "") valores.push(parseFloat(puntuacion3));
  
  // Actualizar badge
  const badge = document.getElementById('psfs-badge');
  if (valores.length > 0) {
    badge.textContent = "Completado";
    badge.classList.add("completado");
  } else {
    badge.textContent = "No completado";
    badge.classList.remove("completado");
  }
  
  // Calcular promedio si hay valores
  if (valores.length > 0) {
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const promedioRedondeado = promedio.toFixed(1);
    
    const resultado = document.getElementById('psfs-resultado');
    const valorEl = document.getElementById('psfs-valor');
    const interpretacionEl = document.getElementById('psfs-interpretacion');
    
    valorEl.textContent = promedioRedondeado;
    
    // Interpretación según el valor
    if (promedio < 3) {
      resultado.className = "resultado-container nivel-bajo";
      interpretacionEl.textContent = "Limitación severa de la función";
    } else if (promedio < 6) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Limitación moderada de la función";
    } else if (promedio < 8) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Limitación leve de la función";
    } else {
      resultado.className = "resultado-container nivel-alto";
      interpretacionEl.textContent = "Función normal o casi normal";
    }
  }
}

// Función para calcular GROC
function calcularGROC() {
  const checkedRadio = document.querySelector('input[name="groc"]:checked');
  
  if (checkedRadio) {
    const valorGROC = parseInt(checkedRadio.value);
    
    // Actualizar badge
    const badge = document.getElementById('groc-badge');
    badge.textContent = "Completado";
    badge.classList.add("completado");
    
    const resultado = document.getElementById('groc-resultado');
    const valorEl = document.getElementById('groc-valor');
    const interpretacionEl = document.getElementById('groc-interpretacion');
    
    valorEl.textContent = valorGROC;
    
    // Interpretación según el valor
    if (valorGROC <= -5) {
      resultado.className = "resultado-container nivel-bajo";
      interpretacionEl.textContent = "Cambio negativo importante (mucho peor)";
    } else if (valorGROC < 0) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Cambio negativo (peor)";
    } else if (valorGROC === 0) {
      resultado.className = "resultado-container nivel-neutro";
      interpretacionEl.textContent = "Sin cambios";
    } else if (valorGROC <= 3) {
      resultado.className = "resultado-container nivel-medio";
      interpretacionEl.textContent = "Cambio positivo mínimo (un poco mejor)";
    } else if (valorGROC <= 5) {
      resultado.className = "resultado-container nivel-alto";
      interpretacionEl.textContent = "Cambio positivo moderado (mejor)";
    } else {
      resultado.className = "resultado-container nivel-alto";
      interpretacionEl.textContent = "Cambio positivo importante (mucho mejor)";
    }
  }
}

// Función para calcular SANE
function calcularSANE() {
  const puntuacion = document.getElementById('sane_puntuacion').value;
  
  // Actualizar el valor mostrado junto al slider
  document.getElementById('sane_puntuacion_value').textContent = puntuacion;
  
  // Actualizar badge
  const badge = document.getElementById('sane-badge');
  badge.textContent = "Completado";
  badge.classList.add("completado");
  
  const resultado = document.getElementById('sane-resultado');
  const valorEl = document.getElementById('sane-valor');
  const interpretacionEl = document.getElementById('sane-interpretacion');
  
  valorEl.textContent = puntuacion + "%";
  
  // Interpretación según el valor
  if (puntuacion < 30) {
    resultado.className = "resultado-container nivel-bajo";
    interpretacionEl.textContent = "Función muy reducida";
  } else if (puntuacion < 50) {
    resultado.className = "resultado-container nivel-bajo";
    interpretacionEl.textContent = "Función deficiente";
  } else if (puntuacion < 70) {
    resultado.className = "resultado-container nivel-medio";
    interpretacionEl.textContent = "Función moderada";
  } else if (puntuacion < 90) {
    resultado.className = "resultado-container nivel-alto";
    interpretacionEl.textContent = "Buena función";
  } else {
    resultado.className = "resultado-container nivel-alto";
    interpretacionEl.textContent = "Función normal o casi normal";
  }
}

// Inicializar la funcionalidad del SANE al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar los valores actuales
  if (document.getElementById('sane_puntuacion')) {
    calcularSANE();
  }
});
