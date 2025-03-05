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
    
    // Contenedores de los canvas
    this.containerAnterior = document.getElementById('container-anterior');
    this.containerPosterior = document.getElementById('container-posterior');
    
    // Estado actual
    this.currentView = 'anterior'; // 'anterior' o 'posterior'
    this.currentTool = 'marker';   // 'marker', 'arrow', 'eraser'
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    
    // Debug mode
    this.debug = false;
    
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
    
    // Esperar a que las imágenes estén cargadas
    this.waitForImagesAndSetup();
    
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
    
    // Redimensionar el canvas si la ventana cambia de tamaño
    window.addEventListener('resize', () => {
      this.setupCanvases();
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
  
  waitForImagesAndSetup() {
    // Comprobamos si ambas imágenes están cargadas
    const checkAndSetup = () => {
      if (this.imgAnterior.complete && this.imgPosterior.complete) {
        this.setupCanvases();
      } else {
        // Volver a comprobar después de un breve retraso
        setTimeout(checkAndSetup, 100);
      }
    };
    
    // Empezar a comprobar
    checkAndSetup();
  }
  
  setupCanvases() {
    // Crear canvas para la vista anterior
    this.setupCanvas('anterior');
    
    // Crear canvas para la vista posterior
    this.setupCanvas('posterior');
    
    // Redibujar marcas si existen
    this.redrawMarks('anterior');
    this.redrawMarks('posterior');
  }
  
  setupCanvas(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const img = view === 'anterior' ? this.imgAnterior : this.imgPosterior;
    const container = view === 'anterior' ? this.containerAnterior : this.containerPosterior;
    
    if (!img.complete) {
      console.log(`La imagen ${view} no está lista aún`);
      return;
    }
    
    // Asegurar que el canvas tenga el tamaño de la imagen
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    
    // Asegurar que el canvas esté posicionado exactamente sobre la imagen
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Obtener contexto de dibujo
    const ctx = canvas.getContext('2d');
    if (view === 'anterior') {
      this.ctxAnterior = ctx;
    } else {
      this.ctxPosterior = ctx;
    }
    
    // Imprimir tamaños para debug
    if (this.debug) {
      console.log(`Canvas ${view}: width=${canvas.width}, height=${canvas.height}`);
      console.log(`Imagen ${view}: width=${img.clientWidth}, height=${img.clientHeight}`);
    }
    
    // CORRECCIÓN IMPORTANTE: Remover y volver a agregar los event listeners
    // Esto evita duplicados y asegura que tengamos referencias actualizadas
    this.removeCanvasListeners(view);
    this.addCanvasListeners(view);
    
    // Debug visual - muestra un borde alrededor del canvas para verificar posición
    if (this.debug) {
      canvas.style.border = '2px solid red';
    }
  }
  
  removeCanvasListeners(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    
    // Remover todos los event listeners existentes
    canvas.replaceWith(canvas.cloneNode(true));
    
    // Actualizar referencia al nuevo canvas
    if (view === 'anterior') {
      this.canvasAnterior = document.getElementById('canvas-anterior');
    } else {
      this.canvasPosterior = document.getElementById('canvas-posterior');
    }
  }
  
  addCanvasListeners(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    
    // IMPORTANTE: Usar bind para mantener el contexto de 'this'
    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this, view));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this, view));
    canvas.addEventListener('mouseup', this.handleMouseUp.bind(this, view));
    canvas.addEventListener('mouseout', this.handleMouseOut.bind(this, view));
    
    // Eventos táctiles
    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this, view));
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this, view));
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this, view));
  }
  
  // MANEJADORES DE EVENTOS PARA MOUSE
  handleMouseDown(view, e) {
    e.preventDefault();
    this.currentView = view;
    this.isDrawing = true;
    
    // Obtener coordenadas relativas al canvas
    const rect = e.target.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
    
    if (this.debug) {
      console.log(`Mouse down en ${view} en (${this.lastX}, ${this.lastY})`);
    }
  }
  
  handleMouseMove(view, e) {
    if (!this.isDrawing || this.currentView !== view) return;
    e.preventDefault();
    
    // Obtener coordenadas actuales
    const rect = e.target.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // Dibujar según la herramienta seleccionada
    const ctx = view === 'anterior' ? this.ctxAnterior : this.ctxPosterior;
    this.drawWithCurrentTool(ctx, view, this.lastX, this.lastY, currentX, currentY);
    
    // Actualizar coordenadas
    this.lastX = currentX;
    this.lastY = currentY;
    
    if (this.debug) {
      console.log(`Mouse move en ${view} a (${currentX}, ${currentY})`);
    }
  }
  
  handleMouseUp(view, e) {
    if (this.isDrawing && this.currentView === view) {
      e.preventDefault();
      this.isDrawing = false;
      this.actualizarLeyenda();
      
      if (this.debug) {
        console.log(`Mouse up en ${view}`);
      }
    }
  }
  
  handleMouseOut(view, e) {
    if (this.isDrawing && this.currentView === view) {
      e.preventDefault();
      this.isDrawing = false;
      this.actualizarLeyenda();
      
      if (this.debug) {
        console.log(`Mouse out en ${view}`);
      }
    }
  }
  
  // MANEJADORES DE EVENTOS PARA TOUCH
  handleTouchStart(view, e) {
    e.preventDefault();
    this.currentView = view;
    this.isDrawing = true;
    
    // Obtener coordenadas del primer toque
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    this.lastX = touch.clientX - rect.left;
    this.lastY = touch.clientY - rect.top;
    
    if (this.debug) {
      console.log(`Touch start en ${view} en (${this.lastX}, ${this.lastY})`);
    }
  }
  
  handleTouchMove(view, e) {
    if (!this.isDrawing || this.currentView !== view) return;
    e.preventDefault();
    
    // Obtener coordenadas actuales del primer toque
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    // Dibujar según la herramienta seleccionada
    const ctx = view === 'anterior' ? this.ctxAnterior : this.ctxPosterior;
    this.drawWithCurrentTool(ctx, view, this.lastX, this.lastY, currentX, currentY);
    
    // Actualizar coordenadas
    this.lastX = currentX;
    this.lastY = currentY;
    
    if (this.debug) {
      console.log(`Touch move en ${view} a (${currentX}, ${currentY})`);
    }
  }
  
  handleTouchEnd(view, e) {
    if (this.isDrawing && this.currentView === view) {
      e.preventDefault();
      this.isDrawing = false;
      this.actualizarLeyenda();
      
      if (this.debug) {
        console.log(`Touch end en ${view}`);
      }
    }
  }
  
  // MÉTODO UNIFICADO PARA DIBUJAR
  drawWithCurrentTool(ctx, view, startX, startY, endX, endY) {
    switch (this.currentTool) {
      case 'marker':
        this.drawMarker(ctx, endX, endY);
        // Guardar la marca
        this.marcas[view].push({
          tool: 'marker',
          startX: endX,
          startY: endY,
          endX: endX,
          endY: endY,
          tipo: this.sintomaActual.tipo,
          intensidad: this.sintomaActual.intensidad,
          color: this.sintomaActual.color
        });
        break;
        
      case 'arrow':
        this.drawArrow(ctx, startX, startY, endX, endY);
        // Guardar la marca
        this.marcas[view].push({
          tool: 'arrow',
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY,
          tipo: this.sintomaActual.tipo,
          intensidad: this.sintomaActual.intensidad,
          color: this.sintomaActual.color
        });
        break;
        
      case 'eraser':
        this.erase(ctx, view, endX, endY);
        break;
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
  
  erase(ctx, view, x, y) {
    const eraseRadius = 20;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Eliminar marcas en esta área
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
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = view === 'anterior' ? this.ctxAnterior : this.ctxPosterior;
    
    if (!ctx) {
      console.log(`El contexto para ${view} no está listo aún`);
      return;
    }
    
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
      console.log('Inicializando el mapa corporal...');
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
