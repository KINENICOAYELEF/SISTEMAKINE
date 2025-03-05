// Mapa Corporal Interactivo
// Versión mejorada con tamaño consistente y responsive

class MapaCorporal {
  constructor() {
    // Referencias a los canvas
    this.canvasAnterior = document.getElementById('canvas-anterior');
    this.canvasPosterior = document.getElementById('canvas-posterior');
    
    // Referencias a las imágenes
    this.imgAnterior = document.getElementById('body-map-front');
    this.imgPosterior = document.getElementById('body-map-back');
    
    // Contenedores de canvas
    this.containerAnterior = document.getElementById('container-anterior');
    this.containerPosterior = document.getElementById('container-posterior');
    
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
    
    // Dimensiones internas del canvas (espacio de coordenadas)
    this.canvasWidth = 300;
    this.canvasHeight = 600;
    
    // Tamaños fijos para los marcadores (en el espacio de coordenadas del canvas)
    this.desktopMarkerSize = 15;      // Tamaño en desktop
    this.mobileMarkerSize = 12;       // Tamaño en mobile
    this.paintSpacing = 8;            // Espaciado entre puntos al pintar
    this.symbolSize = 10;             // Tamaño de símbolos de irradiación
    
    // Inicializar
    this.init();
  }
  
  // Detectar si es dispositivo móvil
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  init() {
    console.log("Inicializando mapa corporal...");
    console.log("Detectado como: " + (this.isMobile ? "dispositivo móvil" : "computadora"));
    
    // Configurar canvas
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
    
    // Agregar listener para cambio de tamaño de ventana
    window.addEventListener('resize', () => {
      this.redrawMarks('anterior');
      this.redrawMarks('posterior');
    });
  }
  
  setupCanvas(view) {
    console.log(`Configurando canvas para ${view}...`);
    
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const img = view === 'anterior' ? this.imgAnterior : this.imgPosterior;
    
    if (!canvas || !img) {
      console.error(`Canvas o imagen no encontrados para ${view}`);
      return;
    }
    
    // Configurar dimensiones fijas del canvas
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    // Asegurar que el canvas ocupe todo el contenedor
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    console.log(`Canvas ${view} dimensiones: ${canvas.width}x${canvas.height}`);
    
    // Configurar eventos para todas las herramientas
    this.setupEvents(canvas, view);
  }
  
  getScalingFactor(canvas) {
    // Obtener el tamaño real del canvas en el DOM
    const rect = canvas.getBoundingClientRect();
    
    // Calcular factores de escala
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return { scaleX, scaleY };
  }
  
  convertToCanvasCoords(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const { scaleX, scaleY } = this.getScalingFactor(canvas);
    
    // Convertir coordenadas del cliente a coordenadas del canvas
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;
    
    return { x: canvasX, y: canvasY };
  }
  
  setupEvents(canvas, view) {
    // ------ EVENTOS DE MOUSE (PC) ------
    
    // Mousedown - inicia el dibujo
    canvas.onmousedown = (e) => {
      e.preventDefault();
      this.currentView = view;
      
      // Convertir coordenadas
      const { x: canvasX, y: canvasY } = this.convertToCanvasCoords(canvas, e.clientX, e.clientY);
      
      // Guardar la última posición para el modo de pintura
      this.lastX = canvasX;
      this.lastY = canvasY;
      
      if (this.currentTool === 'marker') {
        // Para marcador, dibujamos inmediatamente
        this.drawMarker(view, canvasX, canvasY);
      } else if (this.currentTool === 'eraser') {
        // Para borrador, borramos inmediatamente
        this.erase(view, canvasX, canvasY);
      } else if (this.currentTool === 'arrow') {
        // Para irradiación, guardamos el punto inicial y activamos el modo de dibujo
        this.isDrawing = true;
        this.startX = canvasX;
        this.startY = canvasY;
      }
    };
    
    // Mousemove - continúa el dibujo si estamos en modo dibujo
    canvas.onmousemove = (e) => {
      if (!this.isDrawing && this.currentTool !== 'marker') return;
      if (this.currentView !== view) return;
      
      e.preventDefault();
      
      // Convertir coordenadas
      const { x: canvasX, y: canvasY } = this.convertToCanvasCoords(canvas, e.clientX, e.clientY);
      
      if (this.currentTool === 'arrow' && this.isDrawing) {
        // Redibujar para mostrar el preview de la irradiación
        this.redrawMarks(view);
        this.drawIrradiation(view, this.startX, this.startY, canvasX, canvasY, true); // true = preview
      }
    };
    
    // Mouseup - finaliza el dibujo
    canvas.onmouseup = (e) => {
      if (!this.isDrawing && this.currentTool !== 'marker') return;
      if (this.currentView !== view) return;
      
      if (this.currentTool === 'arrow') {
        e.preventDefault();
        
        // Convertir coordenadas
        const { x: canvasX, y: canvasY } = this.convertToCanvasCoords(canvas, e.clientX, e.clientY);
        
        // Verificar que no sea un clic muy cercano
        const dx = canvasX - this.startX;
        const dy = canvasY - this.startY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance > 10) { // Solo dibujamos si la distancia es suficiente
          this.drawIrradiation(view, this.startX, this.startY, canvasX, canvasY, false); // false = no es preview
        }
      }
      
      this.isDrawing = false;
    };
    
    // Mouseleave - cancela el dibujo si salimos del canvas
    canvas.onmouseleave = (e) => {
      if (this.isDrawing && this.currentView === view) {
        this.isDrawing = false;
        this.redrawMarks(view);
      }
    };
    
    // ------ EVENTOS TÁCTILES (MÓVIL) ------
    
    // Touchstart - inicia el dibujo
    canvas.ontouchstart = (e) => {
      e.preventDefault();
      this.currentView = view;
      
      const touch = e.touches[0];
      // Convertir coordenadas
      const { x: canvasX, y: canvasY } = this.convertToCanvasCoords(canvas, touch.clientX, touch.clientY);
      
      // Guardar la última posición para el modo de pintura
      this.lastX = canvasX;
      this.lastY = canvasY;
      
      if (this.currentTool === 'marker') {
        this.isDrawing = true;
        this.drawMarker(view, canvasX, canvasY);
      } else if (this.currentTool === 'eraser') {
        this.isDrawing = true;
        this.erase(view, canvasX, canvasY);
      } else if (this.currentTool === 'arrow') {
        this.isDrawing = true;
        this.startX = canvasX;
        this.startY = canvasY;
      }
    };
    
    // Touchmove - continúa el dibujo (permite pintar en móviles)
    canvas.ontouchmove = (e) => {
      if (!this.isDrawing || this.currentView !== view) return;
      
      e.preventDefault();
      
      const touch = e.touches[0];
      // Convertir coordenadas
      const { x: canvasX, y: canvasY } = this.convertToCanvasCoords(canvas, touch.clientX, touch.clientY);
      
      if (this.currentTool === 'marker') {
        // Calcular la distancia desde el último punto
        const dx = canvasX - this.lastX;
        const dy = canvasY - this.lastY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Dibujar múltiples puntos entre la última posición y la actual para crear efecto de pincel
        if (distance >= this.paintSpacing) {
          const steps = Math.max(1, Math.floor(distance / this.paintSpacing));
          for (let i = 1; i <= steps; i++) {
            const ratio = i / steps;
            const pointX = this.lastX + dx * ratio;
            const pointY = this.lastY + dy * ratio;
            this.drawMarker(view, pointX, pointY);
          }
          
          // Actualizar la última posición
          this.lastX = canvasX;
          this.lastY = canvasY;
        }
      } else if (this.currentTool === 'eraser') {
        // Borrar de forma continua
        this.erase(view, canvasX, canvasY);
        
        // Actualizar la última posición
        this.lastX = canvasX;
        this.lastY = canvasY;
      } else if (this.currentTool === 'arrow') {
        // Redibujar para mostrar el preview de la irradiación
        this.redrawMarks(view);
        this.drawIrradiation(view, this.startX, this.startY, canvasX, canvasY, true);
      }
    };
    
    // Touchend - finaliza el dibujo
    canvas.ontouchend = (e) => {
      if (!this.isDrawing || this.currentView !== view) return;
      
      if (this.currentTool === 'arrow') {
        e.preventDefault();
        
        const touch = e.changedTouches[0];
        // Convertir coordenadas
        const { x: canvasX, y: canvasY } = this.convertToCanvasCoords(canvas, touch.clientX, touch.clientY);
        
        // Verificar que no sea un toque muy cercano
        const dx = canvasX - this.startX;
        const dy = canvasY - this.startY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance > 10) {
          this.drawIrradiation(view, this.startX, this.startY, canvasX, canvasY, false);
        }
      }
      
      this.isDrawing = false;
    };
  }
  
  drawMarker(view, x, y) {
    // Obtener contexto
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = canvas.getContext('2d');
    
    // Seleccionar el radio adecuado según el dispositivo
    const radius = this.isMobile ? this.mobileMarkerSize : this.desktopMarkerSize;
    
    // Dibujar círculo perfecto
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.sintomaActual.color;
    ctx.fill();
    
    // Añadir número de intensidad si es dolor
    if (this.sintomaActual.tipo === 'dolor') {
      ctx.fillStyle = '#ffffff';
      const fontSize = Math.max(radius * 0.8, 8);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.sintomaActual.intensidad.toString(), x, y);
    }
    
    // Guardar la marca (con el tamaño exacto usado)
    this.marcas[view].push({
      tool: 'marker',
      x: x,
      y: y,
      tipo: this.sintomaActual.tipo,
      intensidad: this.sintomaActual.intensidad,
      color: this.sintomaActual.color,
      radius: radius
    });
    
    // Actualizar leyenda
    this.actualizarLeyenda();
  }
  
  // Función para dibujar irradiación
  drawIrradiation(view, fromX, fromY, toX, toY, isPreview = false) {
    // Obtener contexto
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = canvas.getContext('2d');
    
    // Calcular ángulo y distancia
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx);
    
    // Dibujar línea principal (punteada para mejorar visibilidad)
    ctx.beginPath();
    ctx.setLineDash([5, 3]); // Línea punteada
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = this.sintomaActual.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]); // Restaurar línea sólida
    
    // Dibujar símbolo de irradiación (asterisco)
    const symbolSize = this.symbolSize;
    
    // Dibujar asterisco en el punto final
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 4) * i;
      ctx.moveTo(toX - symbolSize * Math.cos(a), toY - symbolSize * Math.sin(a));
      ctx.lineTo(toX + symbolSize * Math.cos(a), toY + symbolSize * Math.sin(a));
    }
    ctx.strokeStyle = this.sintomaActual.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Si no es preview, guardar la irradiación
    if (!isPreview) {
      console.log(`Guardando irradiación en ${view} de (${fromX}, ${fromY}) a (${toX}, ${toY})`);
      
      this.marcas[view].push({
        tool: 'arrow', // Mantener 'arrow' para compatibilidad con datos anteriores
        startX: fromX,
        startY: fromY,
        endX: toX,
        endY: toY,
        tipo: this.sintomaActual.tipo,
        color: this.sintomaActual.color,
        symbolSize: symbolSize
      });
      
      // Actualizar leyenda
      this.actualizarLeyenda();
    }
  }
  
  erase(view, x, y) {
    console.log(`Borrando en ${view} en (${x}, ${y})`);
    
    // Obtener contexto
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = canvas.getContext('2d');
    
    // Radio de borrado (un poco más grande en móvil para facilitar)
    const eraseRadius = this.isMobile ? 25 : 20;
    
    // Mostrar visualmente el área de borrado (solo retroalimentación)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Filtrar marcas que quedan fuera del radio de borrado
    this.marcas[view] = this.marcas[view].filter(marca => {
      if (marca.tool === 'marker') {
        const distance = Math.sqrt(Math.pow(marca.x - x, 2) + Math.pow(marca.y - y, 2));
        return distance > eraseRadius;
      } else if (marca.tool === 'arrow') {
        // Para irradiaciones, verificamos si el borrador toca alguno de los extremos
        const distStart = Math.sqrt(Math.pow(marca.startX - x, 2) + Math.pow(marca.startY - y, 2));
        const distEnd = Math.sqrt(Math.pow(marca.endX - x, 2) + Math.pow(marca.endY - y, 2));
        
        // También calculamos un punto medio en la flecha
        const midX = (marca.startX + marca.endX) / 2;
        const midY = (marca.startY + marca.endY) / 2;
        const distMid = Math.sqrt(Math.pow(midX - x, 2) + Math.pow(midY - y, 2));
        
        // Si el borrador toca algún punto, eliminamos la flecha
        return distStart > eraseRadius && distEnd > eraseRadius && distMid > eraseRadius;
      }
      return true;
    });
    
    // Actualizar leyenda y redibujamos para mostrar el estado actual
    this.actualizarLeyenda();
    this.redrawMarks(view);
  }
  
  clearCanvas() {
    if (confirm('¿Estás seguro de querer borrar todas las marcas del mapa actual?')) {
      const view = this.currentView;
      
      // Obtener contexto
      const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
      const ctx = canvas.getContext('2d');
      
      // Borrar todo el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Limpiar marcas
      this.marcas[view] = [];
      
      // Actualizar leyenda
      this.actualizarLeyenda();
    }
  }
  
  redrawMarks(view) {
    // Obtener contexto
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = canvas.getContext('2d');
    
    // Borrar todo el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redibujar todas las marcas
    this.marcas[view].forEach(marca => {
      if (marca.tool === 'marker') {
        // Dibujar marca como círculo perfecto
        ctx.beginPath();
        
        // Usar el radio almacenado si existe, o el predeterminado del dispositivo
        const radius = marca.radius || (this.isMobile ? this.mobileMarkerSize : this.desktopMarkerSize);
        
        ctx.arc(marca.x, marca.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = marca.color;
        ctx.fill();
        
        // Añadir número de intensidad si es dolor
        if (marca.tipo === 'dolor') {
          ctx.fillStyle = '#ffffff';
          const fontSize = Math.max(radius * 0.8, 8);
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(marca.intensidad.toString(), marca.x, marca.y);
        }
      } else if (marca.tool === 'arrow') {
        // Dibujar irradiación
        const fromX = marca.startX;
        const fromY = marca.startY;
        const toX = marca.endX;
        const toY = marca.endY;
        
        // Línea punteada
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = marca.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Símbolo de irradiación (asterisco)
        const symbolSize = marca.symbolSize || this.symbolSize;
        
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = (Math.PI / 4) * i;
          ctx.moveTo(toX - symbolSize * Math.cos(a), toY - symbolSize * Math.sin(a));
          ctx.lineTo(toX + symbolSize * Math.cos(a), toY + symbolSize * Math.sin(a));
        }
        ctx.strokeStyle = marca.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }
  
  actualizarLeyenda() {
    // Recopilar tipos de síntomas únicos
    const uniqueSymptoms = new Map();
    
    // Procesar marcas de ambas vistas
    [...this.marcas.anterior, ...this.marcas.posterior].forEach(marca => {
      // Solo consideramos las marcas de tipo 'marker'
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
    
    // Agregar irradiación a la leyenda si existe al menos una
    const tieneIrradiacion = [...this.marcas.anterior, ...this.marcas.posterior].some(marca => marca.tool === 'arrow');
    
    if (tieneIrradiacion) {
      const item = document.createElement('div');
      item.className = 'leyenda-item';
      
      const symbolContainer = document.createElement('div');
      symbolContainer.className = 'color-box';
      symbolContainer.style.backgroundColor = 'transparent';
      symbolContainer.style.border = 'none';
      symbolContainer.innerHTML = '&#10022;'; // Símbolo de asterisco
      
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
  
  // Cargar datos previamente guardados
  loadMapData(data) {
    if (!data) return;
    
    try {
      const mapData = JSON.parse(data);
      
      // Cargar marcas
      if (mapData.marcas) {
        // Migrar datos antiguos si es necesario
        for (const view of ['anterior', 'posterior']) {
          if (mapData.marcas[view]) {
            mapData.marcas[view] = mapData.marcas[view].map(marca => {
              // Agregar radio fijo para marcas antiguas que no lo tengan
              if (marca.tool === 'marker' && !marca.radius) {
                marca.radius = this.isMobile ? this.mobileMarkerSize : this.desktopMarkerSize;
              }
              
              // Agregar tamaño de símbolo para irradiaciones antiguas
              if (marca.tool === 'arrow' && !marca.symbolSize) {
                marca.symbolSize = this.symbolSize;
              }
              
              return marca;
            });
          }
        }
        
        this.marcas = mapData.marcas;
        
        // Dibujar las marcas
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
  // Retrasar la inicialización para asegurar que todo está cargado
  setTimeout(() => {
    console.log('Inicializando mapa corporal mejorado...');
    window.mapaCorporal = new MapaCorporal();
    
    // Si hay datos previos en el campo oculto, cargarlos
    const datosGuardados = document.getElementById('mapa-datos').value;
    if (datosGuardados) {
      window.mapaCorporal.loadMapData(datosGuardados);
    }
  }, 500);
});
