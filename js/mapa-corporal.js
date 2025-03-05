// Mapa Corporal Interactivo
// Este script maneja la funcionalidad interactiva del mapa corporal

class MapaCorporal {
  constructor() {
    // Referencias a los canvas
    this.canvasAnterior = document.getElementById('canvas-anterior');
    this.canvasPosterior = document.getElementById('canvas-posterior');
    
    // Contextos de dibujo
    this.ctxAnterior = null;
    this.ctxPosterior = null;
    
    // Referencias a las imágenes
    this.imgAnterior = document.getElementById('body-map-front');
    this.imgPosterior = document.getElementById('body-map-back');
    
    // Estado actual
    this.currentView = 'anterior'; // 'anterior' o 'posterior'
    this.currentTool = 'marker';   // 'marker', 'arrow', 'eraser'
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    
    // Configuración del síntoma actual
    this.sintomaActual = {
      tipo: 'dolor',
      intensidad: 5,
      color: '#ff0000'
    };
    
    // Almacenar marcas y notas
    this.marcas = {
      anterior: [],
      posterior: []
    };
    
    // Leyenda
    this.leyenda = [];
    
    // Inicializar
    this.init();
  }
  
  init() {
    // Verificar si las imágenes existen
    this.verificarImagenes();
    
    // Inicializar canvas cuando las imágenes están cargadas
    this.imgAnterior.onload = () => {
      console.log('Imagen anterior cargada correctamente');
      this.setupCanvas('anterior');
    };
    
    this.imgPosterior.onload = () => {
      console.log('Imagen posterior cargada correctamente');
      this.setupCanvas('posterior');
    };
    
    // Si las imágenes ya están cargadas
    if (this.imgAnterior.complete) {
      console.log('Imagen anterior ya estaba cargada');
      this.setupCanvas('anterior');
    }
    
    if (this.imgPosterior.complete) {
      console.log('Imagen posterior ya estaba cargada');
      this.setupCanvas('posterior');
    }
    
    // Event listeners para herramientas
    document.getElementById('tool-marker').addEventListener('click', () => this.setTool('marker'));
    document.getElementById('tool-arrow').addEventListener('click', () => this.setTool('arrow'));
    document.getElementById('tool-eraser').addEventListener('click', () => this.setTool('eraser'));
    document.getElementById('tool-clear').addEventListener('click', () => this.clearCanvas());
    
    // Event listener para tipo de síntoma
    document.getElementById('sintoma-tipo').addEventListener('change', (e) => {
      this.sintomaActual.tipo = e.target.value;
      // Mostrar/ocultar control de intensidad solo para dolor
      document.getElementById('dolor-intensidad-container').style.display = 
        e.target.value === 'dolor' ? 'block' : 'none';
    });
    
    // Event listener para intensidad de dolor
    document.getElementById('dolor-intensidad').addEventListener('input', (e) => {
      this.sintomaActual.intensidad = parseInt(e.target.value);
      document.getElementById('dolor-intensidad-value').textContent = e.target.value;
    });
    
    // Event listener para color
    document.getElementById('sintoma-color').addEventListener('input', (e) => {
      this.sintomaActual.color = e.target.value;
    });
    
    // Event listener para guardar
    document.getElementById('save-map-btn').addEventListener('click', () => {
      this.saveMapData();
    });
    
    // Agregar listeners a ambos canvas
    this.addCanvasListeners('anterior');
    this.addCanvasListeners('posterior');
    
    // Redimensionar el canvas si la ventana cambia de tamaño
    window.addEventListener('resize', () => {
      this.resizeCanvas('anterior');
      this.resizeCanvas('posterior');
    });
  }
  
  verificarImagenes() {
    // Verificar si las imágenes existen y mostrar mensaje de error si no
    this.imgAnterior.onerror = () => {
      console.error('Error al cargar la imagen anterior. Verifique la ruta: img/body-map-front.jpg');
      this.mostrarErrorImagen(this.imgAnterior);
    };
    
    this.imgPosterior.onerror = () => {
      console.error('Error al cargar la imagen posterior. Verifique la ruta: img/body-map-back.jpg');
      this.mostrarErrorImagen(this.imgPosterior);
    };
  }
  
  mostrarErrorImagen(imgElement) {
    // Reemplazar la imagen con un mensaje de error
    const container = imgElement.parentElement;
    const errorMsg = document.createElement('div');
    errorMsg.className = 'alert alert-danger text-center';
    errorMsg.innerHTML = `
      <strong>Error al cargar la imagen</strong><br>
      Verifique que las imágenes estén en la carpeta correcta:<br>
      <code>img/body-map-front.jpg</code> y <code>img/body-map-back.jpg</code>
    `;
    container.appendChild(errorMsg);
  }
  
  setupCanvas(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const img = view === 'anterior' ? this.imgAnterior : this.imgPosterior;
    
    // Configurar tamaño del canvas para que coincida con la imagen
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Obtener contexto de dibujo
    const ctx = canvas.getContext('2d');
    if (view === 'anterior') {
      this.ctxAnterior = ctx;
    } else {
      this.ctxPosterior = ctx;
    }
    
    // Asegurar que el canvas se posiciona correctamente
    this.posicionarCanvas(view);
    
    // Realizar el redimensionamiento inicial
    this.resizeCanvas(view);
  }
  
  addCanvasListeners(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    
    // Event listeners para dibujo
    canvas.addEventListener('mousedown', (e) => {
      this.currentView = view;
      this.startDrawing(e, view);
    });
    
    canvas.addEventListener('touchstart', (e) => {
      this.currentView = view;
      this.startDrawing(e, view);
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (this.currentView === view) {
        this.draw(e, view);
      }
    });
    
    canvas.addEventListener('touchmove', (e) => {
      if (this.currentView === view) {
        this.draw(e, view);
      }
    });
    
    canvas.addEventListener('mouseup', () => {
      if (this.currentView === view) {
        this.stopDrawing(view);
      }
    });
    
    canvas.addEventListener('touchend', () => {
      if (this.currentView === view) {
        this.stopDrawing(view);
      }
    });
    
    canvas.addEventListener('mouseout', () => {
      if (this.currentView === view) {
        this.stopDrawing(view);
      }
    });
  }
  
  posicionarCanvas(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const img = view === 'anterior' ? this.imgAnterior : this.imgPosterior;
    
    // Asegurar que el canvas se posiciona exactamente sobre la imagen
    if (img.complete) {
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }
  }
  
  resizeCanvas(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const img = view === 'anterior' ? this.imgAnterior : this.imgPosterior;
    
    // Solo redimensionar si la imagen está cargada
    if (img.complete) {
      // Redimensionar canvas para que coincida con el tamaño actual de la imagen
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      
      // Redibujar las marcas guardadas
      this.redrawMarks(view);
    } else {
      // Si la imagen no está cargada, intentar de nuevo después
      setTimeout(() => this.resizeCanvas(view), 100);
    }
  }
  
  startDrawing(e, view) {
    this.isDrawing = true;
    
    // Obtener coordenadas relativas al canvas
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const rect = canvas.getBoundingClientRect();
    
    // Determinar si es evento táctil o de ratón
    let clientX, clientY;
    
    if (e.type === 'touchstart') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevenir scroll en dispositivos táctiles
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    this.lastX = clientX - rect.left;
    this.lastY = clientY - rect.top;
  }
  
  draw(e, view) {
    if (!this.isDrawing) return;
    
    const ctx = view === 'anterior' ? this.ctxAnterior : this.ctxPosterior;
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const rect = canvas.getBoundingClientRect();
    
    // Determinar si es evento táctil o de ratón
    let clientX, clientY;
    
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevenir scroll en dispositivos táctiles
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;
    
    // Dibujar según la herramienta seleccionada
    switch (this.currentTool) {
      case 'marker':
        this.drawMarker(ctx, currentX, currentY);
        break;
      case 'arrow':
        this.drawArrow(ctx, this.lastX, this.lastY, currentX, currentY);
        break;
      case 'eraser':
        this.erase(ctx, currentX, currentY);
        break;
    }
    
    // Guardar la marca si no es borrador
    if (this.currentTool !== 'eraser') {
      this.marcas[view].push({
        tool: this.currentTool,
        startX: this.lastX,
        startY: this.lastY,
        endX: currentX,
        endY: currentY,
        tipo: this.sintomaActual.tipo,
        intensidad: this.sintomaActual.intensidad,
        color: this.sintomaActual.color
      });
    }
    
    // Actualizar coordenadas
    this.lastX = currentX;
    this.lastY = currentY;
  }
  
  stopDrawing(view) {
    if (this.isDrawing) {
      this.isDrawing = false;
      
      // Añadir a la leyenda si es un tipo nuevo
      if (this.currentTool !== 'eraser') {
        this.actualizarLeyenda();
      }
    }
  }
  
  drawMarker(ctx, x, y) {
    const radius = 10;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.sintomaActual.color;
    ctx.fill();
    
    // Añadir número de intensidad si es dolor
    if (this.sintomaActual.tipo === 'dolor') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.sintomaActual.intensidad.toString(), x, y);
    }
  }
  
  drawArrow(ctx, fromX, fromY, toX, toY) {
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // Línea principal
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = this.sintomaActual.color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Punta de flecha
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = this.sintomaActual.color;
    ctx.fill();
  }
  
  erase(ctx, x, y) {
    const eraseRadius = 20;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Eliminar marcas en esta área
    const view = this.currentView;
    this.marcas[view] = this.marcas[view].filter(marca => {
      const distancia = Math.sqrt(
        Math.pow(marca.endX - x, 2) + Math.pow(marca.endY - y, 2)
      );
      return distancia > eraseRadius;
    });
  }
  
  clearCanvas() {
    if (confirm('¿Estás seguro de querer borrar todas las marcas del mapa actual?')) {
      const view = this.currentView;
      const ctx = view === 'anterior' ? this.ctxAnterior : this.ctxPosterior;
      const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Limpiar marcas de esta vista
      this.marcas[view] = [];
      
      // Actualizar leyenda
      this.actualizarLeyenda();
    }
  }
  
  redrawMarks(view) {
    const ctx = view === 'anterior' ? this.ctxAnterior : this.ctxPosterior;
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redibujar todas las marcas
    this.marcas[view].forEach(marca => {
      // Guardar configuración actual
      const currentTool = this.currentTool;
      const currentTipo = this.sintomaActual.tipo;
      const currentIntensidad = this.sintomaActual.intensidad;
      const currentColor = this.sintomaActual.color;
      
      // Aplicar configuración de la marca
      this.currentTool = marca.tool;
      this.sintomaActual.tipo = marca.tipo;
      this.sintomaActual.intensidad = marca.intensidad;
      this.sintomaActual.color = marca.color;
      
      // Dibujar según el tipo de herramienta
      if (marca.tool === 'marker') {
        this.drawMarker(ctx, marca.endX, marca.endY);
      } else if (marca.tool === 'arrow') {
        this.drawArrow(ctx, marca.startX, marca.startY, marca.endX, marca.endY);
      }
      
      // Restaurar configuración
      this.currentTool = currentTool;
      this.sintomaActual.tipo = currentTipo;
      this.sintomaActual.intensidad = currentIntensidad;
      this.sintomaActual.color = currentColor;
    });
  }
  
  actualizarLeyenda() {
    // Recopilar tipos de síntomas únicos
    const uniqueSymptoms = new Map();
    
    // Procesar marcas de ambas vistas
    [...this.marcas.anterior, ...this.marcas.posterior].forEach(marca => {
      const key = `${marca.tipo}-${marca.color}`;
      if (!uniqueSymptoms.has(key)) {
        uniqueSymptoms.set(key, {
          tipo: marca.tipo,
          color: marca.color,
          intensidad: marca.tipo === 'dolor' ? marca.intensidad : null
        });
      }
    });
    
    // Actualizar leyenda
    const leyendaContainer = document.getElementById('leyenda-items');
    leyendaContainer.innerHTML = '';
    
    if (uniqueSymptoms.size === 0) {
      leyendaContainer.innerHTML = '<p class="text-muted">No hay síntomas marcados</p>';
      return;
    }
    
    // Crear elementos de leyenda
    uniqueSymptoms.forEach((symptom) => {
      const item = document.createElement('div');
      item.className = 'leyenda-item';
      
      const colorBox = document.createElement('div');
      colorBox.className = 'color-box';
      colorBox.style.backgroundColor = symptom.color;
      
      const text = document.createElement('span');
      text.textContent = this.getNombreSintoma(symptom.tipo);
      
      if (symptom.tipo === 'dolor' && symptom.intensidad !== null) {
        text.textContent += ` (${symptom.intensidad}/10)`;
      }
      
      item.appendChild(colorBox);
      item.appendChild(text);
      leyendaContainer.appendChild(item);
    });
  }
  
  getNombreSintoma(tipo) {
    const nombres = {
      'dolor': 'Dolor',
      'parestesia': 'Parestesia',
      'debilidad': 'Debilidad',
      'rigidez': 'Rigidez',
      'inestabilidad': 'Inestabilidad'
    };
    
    return nombres[tipo] || tipo;
  }
  
  setTool(tool) {
    this.currentTool = tool;
    
    // Actualizar UI
    document.getElementById('tool-marker').classList.remove('active');
    document.getElementById('tool-arrow').classList.remove('active');
    document.getElementById('tool-eraser').classList.remove('active');
    
    document.getElementById(`tool-${tool}`).classList.add('active');
    
    // Cambiar cursor
    const cursorStyle = tool === 'eraser' ? 'cell' : 'crosshair';
    this.canvasAnterior.style.cursor = cursorStyle;
    this.canvasPosterior.style.cursor = cursorStyle;
  }
  
  saveMapData() {
    // Crear objeto con todos los datos
    const mapData = {
      marcas: this.marcas,
      notas: document.getElementById('mapa-notas').value
    };
    
    // Guardar como JSON en el campo oculto
    document.getElementById('mapa-datos').value = JSON.stringify(mapData);
    
    // Notificar al usuario
    alert('Las marcas del mapa corporal han sido guardadas.');
  }
  
  // Cargar datos previamente guardados
  loadMapData(data) {
    if (!data) return;
    
    try {
      const mapData = JSON.parse(data);
      
      // Cargar marcas
      if (mapData.marcas) {
        this.marcas = mapData.marcas;
        
        // Redibujar
        this.redrawMarks('anterior');
        this.redrawMarks('posterior');
        
        // Actualizar leyenda
        this.actualizarLeyenda();
      }
      
      // Cargar notas
      if (mapData.notas) {
        document.getElementById('mapa-notas').value = mapData.notas;
      }
    } catch (error) {
      console.error('Error al cargar datos del mapa:', error);
    }
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    try {
      const mapaCorporal = new MapaCorporal();
      
      // Hacer accesible a nivel global para uso desde otras partes del código
      window.mapaCorporal = mapaCorporal;
      
      // Si hay datos previos en el campo oculto, cargarlos
      const datosGuardados = document.getElementById('mapa-datos').value;
      if (datosGuardados) {
        mapaCorporal.loadMapData(datosGuardados);
      }
    } catch (error) {
      console.error('Error al inicializar el mapa corporal:', error);
    }
  }, 500); // Pequeño retraso para asegurar que todos los elementos estén cargados
});
