// Mapa Corporal Interactivo
// Versión con elementos DOM para garantizar círculos perfectos

class MapaCorporal {
  constructor() {
    // Referencias a los contenedores
    this.containerAnterior = document.getElementById('container-anterior');
    this.containerPosterior = document.getElementById('container-posterior');
    
    // Referencias a las imágenes
    this.imgAnterior = document.getElementById('body-map-front');
    this.imgPosterior = document.getElementById('body-map-back');
    
    // Contenedores para los marcadores (crearemos divs para las marcas)
    this.markerLayerAnterior = null;
    this.markerLayerPosterior = null;

    // Canvas para dibujar las irradiaciones (mantenemos esto para las líneas)
    this.canvasAnterior = document.getElementById('canvas-anterior');
    this.canvasPosterior = document.getElementById('canvas-posterior');
    
    // Estado actual
    this.currentView = 'anterior';
    this.currentTool = 'marker';
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;
    
    // Flag para saber si estamos en dispositivo móvil
    this.isMobile = this.detectMobile();
    
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
    
    // ID para los marcadores DOM
    this.nextMarkerId = 1;
    
    // Inicializar
    this.init();
  }
  
  // Detectar si es dispositivo móvil
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  init() {
    console.log("Inicializando mapa corporal con elementos DOM...");
    console.log("Detectado como: " + (this.isMobile ? "dispositivo móvil" : "computadora"));
    
    // Crear capas para marcadores
    this.createMarkerLayers();
    
    // Configurar canvas para irradiaciones
    this.setupCanvas('anterior');
    this.setupCanvas('posterior');
    
    // Event listeners para herramientas
    document.getElementById('tool-marker').addEventListener('click', () => this.setTool('marker'));
    document.getElementById('tool-arrow').addEventListener('click', () => this.setTool('arrow'));
    document.getElementById('tool-eraser').addEventListener('click', () => this.setTool('eraser'));
    document.getElementById('tool-clear').addEventListener('click', () => this.clearCanvas());
    
    // Event listener para tipo de síntoma
    document.getElementById('sintoma-tipo').addEventListener('change', (e) => {
      this.sintomaActual.tipo = e.target.value;
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
    
    // Cargar datos guardados si existen
    setTimeout(() => {
      const datosGuardados = document.getElementById('mapa-datos').value;
      if (datosGuardados) {
        this.loadMapData(datosGuardados);
      }
    }, 500);
  }
  
  createMarkerLayers() {
    // Crear capa para marcadores en vista anterior
    this.markerLayerAnterior = document.createElement('div');
    this.markerLayerAnterior.className = 'marker-layer';
    this.markerLayerAnterior.style.position = 'absolute';
    this.markerLayerAnterior.style.top = '0';
    this.markerLayerAnterior.style.left = '0';
    this.markerLayerAnterior.style.width = '100%';
    this.markerLayerAnterior.style.height = '100%';
    this.markerLayerAnterior.style.pointerEvents = 'none'; // Para permitir clics a través de la capa
    this.containerAnterior.style.position = 'relative'; // Asegurar que el contenedor sea posición relativa
    this.containerAnterior.appendChild(this.markerLayerAnterior);
    
    // Crear capa para marcadores en vista posterior
    this.markerLayerPosterior = document.createElement('div');
    this.markerLayerPosterior.className = 'marker-layer';
    this.markerLayerPosterior.style.position = 'absolute';
    this.markerLayerPosterior.style.top = '0';
    this.markerLayerPosterior.style.left = '0';
    this.markerLayerPosterior.style.width = '100%';
    this.markerLayerPosterior.style.height = '100%';
    this.markerLayerPosterior.style.pointerEvents = 'none'; // Para permitir clics a través de la capa
    this.containerPosterior.style.position = 'relative'; // Asegurar que el contenedor sea posición relativa
    this.containerPosterior.appendChild(this.markerLayerPosterior);
  }
  
  setupCanvas(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const container = view === 'anterior' ? this.containerAnterior : this.containerPosterior;
    
    if (!canvas) {
      console.error(`Canvas no encontrado para ${view}`);
      return;
    }
    
    // Configurar canvas solo para irradiaciones
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Para permitir clics a través del canvas
    
    // Actualizar dimensiones
    this.updateCanvasDimensions(view);
    
    // Configurar eventos en el contenedor (no en el canvas)
    this.setupEvents(container, view);
    
    // Listener para redimensionar
    window.addEventListener('resize', () => {
      this.updateCanvasDimensions(view);
      this.redrawArrows(view);
    });
  }
  
  updateCanvasDimensions(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const container = view === 'anterior' ? this.containerAnterior : this.containerPosterior;
    
    // Obtener dimensiones actuales del contenedor
    const rect = container.getBoundingClientRect();
    
    // Ajustar canvas al contenedor
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    console.log(`Canvas ${view} actualizado a ${canvas.width}x${canvas.height}`);
  }
  
  setupEvents(container, view) {
    // ------ EVENTOS DE MOUSE (PC) ------
    
    // Mousedown
    container.onmousedown = (e) => {
      if (e.target.classList.contains('marker')) return; // Ignorar si hacemos clic en un marcador
      
      e.preventDefault();
      this.currentView = view;
      
      // Obtener coordenadas relativas al contenedor
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convertir a porcentajes
      const relX = x / rect.width;
      const relY = y / rect.height;
      
      // Guardar la última posición
      this.lastX = relX;
      this.lastY = relY;
      
      if (this.currentTool === 'marker') {
        // Crear un marcador DOM
        this.createMarker(view, relX, relY);
      } else if (this.currentTool === 'eraser') {
        // Borrar cerca de la posición
        this.erase(view, relX, relY);
      } else if (this.currentTool === 'arrow') {
        // Iniciar dibujo de irradiación
        this.isDrawing = true;
        this.startX = relX;
        this.startY = relY;
      }
    };
    
    // Mousemove
    container.onmousemove = (e) => {
      if (this.currentView !== view) return;
      if (!this.isDrawing) return;
      
      e.preventDefault();
      
      // Obtener coordenadas
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convertir a porcentajes
      const relX = x / rect.width;
      const relY = y / rect.height;
      
      if (this.currentTool === 'arrow') {
        // Redibujar flechas con la vista previa
        this.redrawArrows(view, this.startX, this.startY, relX, relY);
      }
    };
    
    // Mouseup
    container.onmouseup = (e) => {
      if (this.currentView !== view) return;
      if (!this.isDrawing) return;
      
      if (this.currentTool === 'arrow') {
        e.preventDefault();
        
        // Obtener coordenadas
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convertir a porcentajes
        const relX = x / rect.width;
        const relY = y / rect.height;
        
        // Verificar distancia mínima
        const dx = relX - this.startX;
        const dy = relY - this.startY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance > 0.05) { // 5% de la distancia como mínimo
          this.createArrow(view, this.startX, this.startY, relX, relY);
        }
      }
      
      this.isDrawing = false;
    };
    
    // Mouseleave
    container.onmouseleave = (e) => {
      if (this.isDrawing && this.currentView === view) {
        this.isDrawing = false;
        this.redrawArrows(view);
      }
    };
    
    // ------ EVENTOS TÁCTILES (MÓVIL) ------
    
    // Touchstart
    container.ontouchstart = (e) => {
      // Verificar si tocamos un marcador existente
      let target = e.target;
      if (target.classList.contains('marker')) return;
      
      e.preventDefault();
      this.currentView = view;
      
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Convertir a porcentajes
      const relX = x / rect.width;
      const relY = y / rect.height;
      
      // Guardar la última posición
      this.lastX = relX;
      this.lastY = relY;
      
      if (this.currentTool === 'marker') {
        this.isDrawing = true;
        this.createMarker(view, relX, relY);
      } else if (this.currentTool === 'eraser') {
        this.isDrawing = true;
        this.erase(view, relX, relY);
      } else if (this.currentTool === 'arrow') {
        this.isDrawing = true;
        this.startX = relX;
        this.startY = relY;
      }
    };
    
    // Touchmove
    container.ontouchmove = (e) => {
      if (!this.isDrawing || this.currentView !== view) return;
      
      e.preventDefault();
      
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Convertir a porcentajes
      const relX = x / rect.width;
      const relY = y / rect.height;
      
      if (this.currentTool === 'marker') {
        // Calcular la distancia desde el último punto
        const dx = relX - this.lastX;
        const dy = relY - this.lastY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Crear puntos a lo largo del trazo
        if (distance >= 0.02) { // 2% de la distancia como mínimo
          const steps = Math.max(1, Math.floor(distance / 0.02));
          for (let i = 1; i <= steps; i++) {
            const ratio = i / steps;
            const pointX = this.lastX + dx * ratio;
            const pointY = this.lastY + dy * ratio;
            this.createMarker(view, pointX, pointY);
          }
          
          // Actualizar la última posición
          this.lastX = relX;
          this.lastY = relY;
        }
      } else if (this.currentTool === 'eraser') {
        // Borrar de forma continua
        this.erase(view, relX, relY);
        
        // Actualizar la última posición
        this.lastX = relX;
        this.lastY = relY;
      } else if (this.currentTool === 'arrow') {
        // Redibujar flechas con la vista previa
        this.redrawArrows(view, this.startX, this.startY, relX, relY);
      }
    };
    
    // Touchend
    container.ontouchend = (e) => {
      if (!this.isDrawing || this.currentView !== view) return;
      
      if (this.currentTool === 'arrow') {
        e.preventDefault();
        
        const touch = e.changedTouches[0];
        const rect = container.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Convertir a porcentajes
        const relX = x / rect.width;
        const relY = y / rect.height;
        
        // Verificar distancia mínima
        const dx = relX - this.startX;
        const dy = relY - this.startY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance > 0.05) { // 5% de la distancia como mínimo
          this.createArrow(view, this.startX, this.startY, relX, relY);
        }
      }
      
      this.isDrawing = false;
    };
  }
  
  createMarker(view, relX, relY) {
    // Calcular tamaño base como porcentaje de la altura
    const baseSize = this.isMobile ? 0.04 : 0.05; // 4% o 5% de la altura
    
    // Crear elemento DOM para el marcador
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.id = 'marker-' + this.nextMarkerId++;
    
    // Estilar el marcador como círculo
    marker.style.position = 'absolute';
    marker.style.left = (relX * 100) + '%';
    marker.style.top = (relY * 100) + '%';
    marker.style.width = baseSize * 100 + '%';
    marker.style.height = 'auto'; // Altura automática para mantener relación de aspecto
    marker.style.paddingBottom = baseSize * 100 + '%'; // Hace que el div sea perfectamente circular
    marker.style.borderRadius = '50%';
    marker.style.backgroundColor = this.sintomaActual.color;
    marker.style.transform = 'translate(-50%, -50%)'; // Centrar en el punto
    marker.style.zIndex = '10';
    marker.style.display = 'flex';
    marker.style.justifyContent = 'center';
    marker.style.alignItems = 'center';
    marker.style.pointerEvents = 'auto'; // Para detectar clics
    
    // Añadir número de intensidad si es dolor
    if (this.sintomaActual.tipo === 'dolor') {
      const label = document.createElement('span');
      label.textContent = this.sintomaActual.intensidad.toString();
      label.style.color = '#ffffff';
      label.style.fontWeight = 'bold';
      label.style.fontSize = '1em';
      label.style.position = 'absolute';
      label.style.top = '50%';
      label.style.left = '50%';
      label.style.transform = 'translate(-50%, -50%)';
      label.style.pointerEvents = 'none'; // No interferir con clics
      marker.appendChild(label);
    }
    
    // Añadir evento para borrar al hacer clic (si estamos en modo borrador)
    marker.addEventListener('click', () => {
      if (this.currentTool === 'eraser') {
        this.removeMarker(view, marker.id);
      }
    });
    
    // Añadir al contenedor
    const layer = view === 'anterior' ? this.markerLayerAnterior : this.markerLayerPosterior;
    layer.appendChild(marker);
    
    // Guardar datos del marcador
    const marcaData = {
      id: marker.id,
      tool: 'marker',
      relX: relX,
      relY: relY,
      tipo: this.sintomaActual.tipo,
      intensidad: this.sintomaActual.intensidad,
      color: this.sintomaActual.color
    };
    
    this.marcas[view].push(marcaData);
    this.actualizarLeyenda();
    
    return marker;
  }
  
  removeMarker(view, id) {
    // Eliminar elemento DOM
    const marker = document.getElementById(id);
    if (marker) {
      marker.remove();
    }
    
    // Eliminar de la lista de marcas
    this.marcas[view] = this.marcas[view].filter(m => m.id !== id);
    this.actualizarLeyenda();
  }
  
  createArrow(view, startX, startY, endX, endY) {
    // Guardar datos de la flecha
    const arrowId = 'arrow-' + this.nextMarkerId++;
    
    const arrowData = {
      id: arrowId,
      tool: 'arrow',
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      color: this.sintomaActual.color
    };
    
    this.marcas[view].push(arrowData);
    this.redrawArrows(view);
    this.actualizarLeyenda();
  }
  
  redrawArrows(view, previewStartX = null, previewStartY = null, previewEndX = null, previewEndY = null) {
    // Obtener el canvas correcto
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = canvas.getContext('2d');
    
    // Borrar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar todas las flechas guardadas
    const flechas = this.marcas[view].filter(m => m.tool === 'arrow');
    
    flechas.forEach(flecha => {
      this.drawArrow(ctx, flecha.startX, flecha.startY, flecha.endX, flecha.endY, flecha.color);
    });
    
    // Dibujar vista previa si está disponible
    if (previewStartX !== null) {
      this.drawArrow(ctx, previewStartX, previewStartY, previewEndX, previewEndY, this.sintomaActual.color, true);
    }
  }
  
  drawArrow(ctx, relStartX, relStartY, relEndX, relEndY, color, isPreview = false) {
    // Convertir coordenadas relativas a pixeles
    const startX = relStartX * ctx.canvas.width;
    const startY = relStartY * ctx.canvas.height;
    const endX = relEndX * ctx.canvas.width;
    const endY = relEndY * ctx.canvas.height;
    
    // Calcular tamaño del símbolo (proporcional a la altura del canvas)
    const symbolSize = ctx.canvas.height * 0.02; // 2% de la altura
    
    // Dibujar línea punteada
    ctx.beginPath();
    ctx.setLineDash([5, 3]);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Dibujar símbolo de irradiación (asterisco)
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 4) * i;
      ctx.moveTo(endX - symbolSize * Math.cos(a), endY - symbolSize * Math.sin(a));
      ctx.lineTo(endX + symbolSize * Math.cos(a), endY + symbolSize * Math.sin(a));
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  erase(view, relX, relY) {
    // Radio de borrado (% del contenedor)
    const eraseRadius = this.isMobile ? 0.05 : 0.04; // 5% o 4% del contenedor
    
    // Obtener todos los marcadores de esta vista
    const marcadores = Array.from(this.marcas[view]).filter(m => m.tool === 'marker');
    const flechas = Array.from(this.marcas[view]).filter(m => m.tool === 'arrow');
    
    // Borrar marcadores cercanos
    for (const marca of marcadores) {
      const dx = marca.relX - relX;
      const dy = marca.relY - relY;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance <= eraseRadius) {
        this.removeMarker(view, marca.id);
      }
    }
    
    // Borrar flechas cercanas
    for (const flecha of flechas) {
      // Comprobar si el borrador está cerca del inicio, fin o punto medio
      const distStart = Math.sqrt(Math.pow(flecha.startX - relX, 2) + Math.pow(flecha.startY - relY, 2));
      const distEnd = Math.sqrt(Math.pow(flecha.endX - relX, 2) + Math.pow(flecha.endY - relY, 2));
      
      // Punto medio
      const midX = (flecha.startX + flecha.endX) / 2;
      const midY = (flecha.startY + flecha.endY) / 2;
      const distMid = Math.sqrt(Math.pow(midX - relX, 2) + Math.pow(midY - relY, 2));
      
      if (distStart <= eraseRadius || distEnd <= eraseRadius || distMid <= eraseRadius) {
        // Eliminar flecha
        this.marcas[view] = this.marcas[view].filter(m => m.id !== flecha.id);
      }
    }
    
    // Redibujar flechas
    this.redrawArrows(view);
    this.actualizarLeyenda();
  }
  
  clearCanvas() {
    if (confirm('¿Estás seguro de querer borrar todas las marcas del mapa actual?')) {
      const view = this.currentView;
      
      // Eliminar todos los marcadores DOM
      if (view === 'anterior') {
        while (this.markerLayerAnterior.firstChild) {
          this.markerLayerAnterior.removeChild(this.markerLayerAnterior.firstChild);
        }
      } else {
        while (this.markerLayerPosterior.firstChild) {
          this.markerLayerPosterior.removeChild(this.markerLayerPosterior.firstChild);
        }
      }
      
      // Borrar canvas
      const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Limpiar marcas
      this.marcas[view] = [];
      
      // Actualizar leyenda
      this.actualizarLeyenda();
    }
  }
  
  actualizarLeyenda() {
    // Recopilar tipos de síntomas únicos
    const uniqueSymptoms = new Map();
    
    // Procesar marcas de ambas vistas
    [...this.marcas.anterior, ...this.marcas.posterior].forEach(marca => {
      if (marca.tool === 'marker') {
        const key = `${marca.tipo}-${marca.color}`;
        if (!uniqueSymptoms.has(key)) {
          uniqueSymptoms.set(key, {
            tipo: marca.tipo,
            color: marca.color,
            intensidad: marca.tipo === 'dolor' ? marca.intensidad : null
          });
        }
      }
    });
    
    // Actualizar leyenda
    const leyendaContainer = document.getElementById('leyenda-items');
    leyendaContainer.innerHTML = '';
    
    if (uniqueSymptoms.size === 0 && 
        !this.marcas.anterior.some(m => m.tool === 'arrow') && 
        !this.marcas.posterior.some(m => m.tool === 'arrow')) {
      leyendaContainer.innerHTML = '<p class="text-muted">No hay síntomas marcados</p>';
      return;
    }
    
    // Crear elementos de leyenda para síntomas
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
    
    // Agregar irradiación a la leyenda si existe al menos una
    const tieneIrradiacion = [...this.marcas.anterior, ...this.marcas.posterior].some(marca => marca.tool === 'arrow');
    
    if (tieneIrradiacion) {
      const item = document.createElement('div');
      item.className = 'leyenda-item';
      
      const symbolContainer = document.createElement('div');
      symbolContainer.className = 'color-box';
      symbolContainer.style.backgroundColor = 'transparent';
      symbolContainer.style.border = 'none';
      symbolContainer.innerHTML = '✲'; // Símbolo de asterisco en Unicode
      
      const text = document.createElement('span');
      text.textContent = 'Irradiación';
      
      item.appendChild(symbolContainer);
      item.appendChild(text);
      leyendaContainer.appendChild(item);
    }
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
    console.log(`Herramienta seleccionada: ${tool}`);
    
    this.currentTool = tool;
    
    // Actualizar UI
    document.getElementById('tool-marker').classList.remove('active');
    document.getElementById('tool-arrow').classList.remove('active');
    document.getElementById('tool-eraser').classList.remove('active');
    
    document.getElementById(`tool-${tool}`).classList.add('active');
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
    console.log('Datos del mapa guardados');
  }
  
  loadMapData(data) {
    if (!data) return;
    
    try {
      const mapData = JSON.parse(data);
      
      // Cargar marcas
      if (mapData.marcas) {
        // Limpiamos marcadores existentes
        while (this.markerLayerAnterior.firstChild) {
          this.markerLayerAnterior.removeChild(this.markerLayerAnterior.firstChild);
        }
        while (this.markerLayerPosterior.firstChild) {
          this.markerLayerPosterior.removeChild(this.markerLayerPosterior.firstChild);
        }
        
        // Limpiar canvas
        this.canvasAnterior.getContext('2d').clearRect(0, 0, this.canvasAnterior.width, this.canvasAnterior.height);
        this.canvasPosterior.getContext('2d').clearRect(0, 0, this.canvasPosterior.width, this.canvasPosterior.height);
        
        // Array temporal para las marcas
        let tempMarcas = {
          anterior: [],
          posterior: []
        };
        
        // Procesar datos y recrear marcadores
        for (const view of ['anterior', 'posterior']) {
          if (Array.isArray(mapData.marcas[view])) {
            for (const marca of mapData.marcas[view]) {
              // Normalizar datos antiguos
              this.normalizarMarca(marca, view, tempMarcas);
            }
          }
        }
        
        // Establecer marcas normalizadas
        this.marcas = tempMarcas;
        
        // Recrear marcadores DOM y redibjar flechas
        this.recreateAllMarkers();
        this.redrawArrows('anterior');
        this.redrawArrows('posterior');
        
        // Asignar ID siguiente
        this.nextMarkerId = Math.max(
          1,
          ...this.marcas.anterior.map(m => {
            const id = m.id?.split('-')?.[1];
            return id ? parseInt(id) : 0;
          }),
          ...this.marcas.posterior.map(m => {
            const id = m.id?.split('-')?.[1];
            return id ? parseInt(id) : 0;
          })
        ) + 1;
        
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
  
  // Función para normalizar datos antiguos
  normalizarMarca(marca, view, tempMarcas) {
    if (marca.tool === 'marker') {
      // Asignar ID si no tiene
      if (!marca.id) {
        marca.id = 'marker-' + this.nextMarkerId++;
      }
      
      // Normalizar posición relativa
      if (marca.relX === undefined && marca.x !== undefined) {
        // Estimar relativo desde absoluto (valores antiguos)
        marca.relX = marca.x / 300; // La base era 300px
        marca.relY = marca.y / 600; // La base era 600px
      }
      
      tempMarcas[view].push({
        id: marca.id,
        tool: 'marker',
        relX: marca.relX,
        relY: marca.relY,
        tipo: marca.tipo,
        intensidad: marca.intensidad,
        color: marca.color
      });
      
      // Recrear el elemento DOM
      this.createMarkerFromData(view, marca);
    } 
    else if (marca.tool === 'arrow') {
      // Asignar ID si no tiene
      if (!marca.id) {
        marca.id = 'arrow-' + this.nextMarkerId++;
      }
      
      // Normalizar posiciones relativas
      let startX, startY, endX, endY;
      
      if (marca.relStartX !== undefined) {
        startX = marca.relStartX;
        startY = marca.relStartY;
        endX = marca.relEndX;
        endY = marca.relEndY;
      } 
      else if (marca.startX !== undefined) {
        // Estimar relativo desde absoluto (valores antiguos)
        startX = marca.startX / 300; // La base era 300px
        startY = marca.startY / 600; // La base era 600px
        endX = marca.endX / 300;
        endY = marca.endY / 600;
      }
      
      tempMarcas[view].push({
        id: marca.id,
        tool: 'arrow',
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        color: marca.color
      });
    }
  }
  
  // Crear un marcador a partir de datos guardados
  createMarkerFromData(view, data) {
    // Calcular tamaño base como porcentaje de la altura
    const baseSize = this.isMobile ? 0.04 : 0.05; // 4% o 5% de la altura
    
    // Crear elemento DOM para el marcador
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.id = data.id;
    
    // Estilar el marcador como círculo
    marker.style.position = 'absolute';
    marker.style.left = (data.relX * 100) + '%';
    marker.style.top = (data.relY * 100) + '%';
    marker.style.width = baseSize * 100 + '%';
    marker.style.height = 'auto';
    marker.style.paddingBottom = baseSize * 100 + '%';
    marker.style.borderRadius = '50%';
    marker.style.backgroundColor = data.color;
    marker.style.transform = 'translate(-50%, -50%)';
    marker.style.zIndex = '10';
    marker.style.display = 'flex';
    marker.style.justifyContent = 'center';
    marker.style.alignItems = 'center';
    marker.style.pointerEvents = 'auto';
    
    // Añadir número de intensidad si es dolor
    if (data.tipo === 'dolor') {
      const label = document.createElement('span');
      label.textContent = data.intensidad.toString();
      label.style.color = '#ffffff';
      label.style.fontWeight = 'bold';
      label.style.fontSize = '1em';
      label.style.position = 'absolute';
      label.style.top = '50%';
      label.style.left = '50%';
      label.style.transform = 'translate(-50%, -50%)';
      label.style.pointerEvents = 'none';
      marker.appendChild(label);
    }
    
    // Añadir evento para borrar al hacer clic (si estamos en modo borrador)
    marker.addEventListener('click', () => {
      if (this.currentTool === 'eraser') {
        this.removeMarker(view, marker.id);
      }
    });
    
    // Añadir al contenedor
    const layer = view === 'anterior' ? this.markerLayerAnterior : this.markerLayerPosterior;
    layer.appendChild(marker);
    
    return marker;
  }
  
  // Recrear todos los marcadores
  recreateAllMarkers() {
    // Limpiar capas
    while (this.markerLayerAnterior.firstChild) {
      this.markerLayerAnterior.removeChild(this.markerLayerAnterior.firstChild);
    }
    while (this.markerLayerPosterior.firstChild) {
      this.markerLayerPosterior.removeChild(this.markerLayerPosterior.firstChild);
    }
    
    // Recrear marcadores
    for (const marca of this.marcas.anterior) {
      if (marca.tool === 'marker') {
        this.createMarkerFromData('anterior', marca);
      }
    }
    
    for (const marca of this.marcas.posterior) {
      if (marca.tool === 'marker') {
        this.createMarkerFromData('posterior', marca);
      }
    }
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  // Retrasar la inicialización para asegurar que todo está cargado
  setTimeout(() => {
    console.log('Inicializando mapa corporal con elementos DOM...');
    window.mapaCorporal = new MapaCorporal();
  }, 500);
});
