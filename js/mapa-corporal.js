// Mapa Corporal Interactivo Universal
// Versión simplificada y directa para funcionar en todas las plataformas

class MapaCorporal {
  constructor() {
    // Forzar compatibilidad con todos los navegadores
    this.forceCompatibilityMode = true;
    
    // Referencias a los canvas
    this.canvasAnterior = document.getElementById('canvas-anterior');
    this.canvasPosterior = document.getElementById('canvas-posterior');
    
    // Referencias a las imágenes
    this.imgAnterior = document.getElementById('body-map-front');
    this.imgPosterior = document.getElementById('body-map-back');
    
    // Estado actual
    this.currentView = 'anterior'; // 'anterior' o 'posterior'
    this.currentTool = 'marker';   // 'marker', 'arrow', 'eraser'
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    
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
    
    // Inicializar
    this.init();
  }
  
  init() {
    console.log('Inicializando mapa corporal universal...');
    
    // Esperar a que las imágenes estén listas
    if (this.imgAnterior.complete && this.imgPosterior.complete) {
      this.setupCanvases();
    } else {
      this.imgAnterior.onload = () => {
        if (this.imgPosterior.complete) this.setupCanvases();
      };
      this.imgPosterior.onload = () => {
        if (this.imgAnterior.complete) this.setupCanvases();
      };
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
    
    // Monitorizando clicks para depuración
    document.addEventListener('click', (e) => {
      console.log('Click detectado en:', e.target);
    });
    
    // Reconfigurar al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
      this.setupCanvases();
    });
  }
  
  setupCanvases() {
    console.log('Configurando canvases...');
    
    // Configurar canvas anterior
    this.setupCanvas('anterior');
    
    // Configurar canvas posterior
    this.setupCanvas('posterior');
    
    // Redibujar marcas
    setTimeout(() => {
      this.redrawMarks('anterior');
      this.redrawMarks('posterior');
    }, 100);
  }
  
  setupCanvas(view) {
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const img = view === 'anterior' ? this.imgAnterior : this.imgPosterior;
    
    if (!canvas || !img) {
      console.error(`Canvas o imagen no encontrados para ${view}`);
      return;
    }
    
    console.log(`Configurando canvas para ${view}...`);
    
    // Asegurar que el canvas tenga el tamaño correcto
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    
    // Posicionar el canvas exactamente sobre la imagen
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Eliminar y volver a configurar los event listeners
    this.removeAllEventListeners(canvas);
    
    if (this.forceCompatibilityMode) {
      // Modo de compatibilidad: usar onclick/onmousedown en lugar de listeners
      this.setupCompatibilityEventHandlers(canvas, view);
    } else {
      // Configurar event listeners estándar
      this.setupEventListeners(canvas, view);
    }
    
    console.log(`Canvas de ${view} configurado: ${canvas.width}x${canvas.height}`);
  }
  
  removeAllEventListeners(element) {
    // Creamos un clon del elemento sin los event listeners
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    
    // Actualizamos la referencia
    if (element === this.canvasAnterior) {
      this.canvasAnterior = document.getElementById('canvas-anterior');
    } else if (element === this.canvasPosterior) {
      this.canvasPosterior = document.getElementById('canvas-posterior');
    }
    
    return clone;
  }
  
  setupCompatibilityEventHandlers(canvas, view) {
    console.log(`Configurando manejadores de eventos de compatibilidad para ${view}`);
    
    // Asignar directamente usando on* (más compatible)
    canvas.onclick = (e) => {
      console.log(`Click en canvas ${view}`);
      this.currentView = view;
      
      // Obtener coordenadas relativas al canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Dibujar según la herramienta seleccionada
      if (this.currentTool === 'marker') {
        this.drawMarkerImmediate(view, x, y);
      } else if (this.currentTool === 'eraser') {
        this.eraseImmediate(view, x, y);
      }
    };
    
    // Para la herramienta de flecha, necesitamos mousedown/mousemove/mouseup
    canvas.onmousedown = (e) => {
      if (this.currentTool === 'arrow') {
        this.isDrawing = true;
        this.currentView = view;
        
        const rect = canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        
        console.log(`Arrow start en ${view}: (${this.startX}, ${this.startY})`);
      }
    };
    
    canvas.onmousemove = (e) => {
      if (this.isDrawing && this.currentTool === 'arrow' && this.currentView === view) {
        // Obtener coordenadas actuales
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // Redibujar para mostrar la flecha en tiempo real
        this.redrawMarks(view);
        
        // Dibujar la flecha temporal
        const ctx = this.getContext(view);
        this.drawArrow(ctx, this.startX, this.startY, currentX, currentY);
      }
    };
    
    canvas.onmouseup = (e) => {
      if (this.isDrawing && this.currentTool === 'arrow' && this.currentView === view) {
        // Finalizar el dibujo de la flecha
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        
        // Guardar la flecha
        this.drawArrowImmediate(view, this.startX, this.startY, endX, endY);
        
        this.isDrawing = false;
        console.log(`Arrow end en ${view}: (${endX}, ${endY})`);
      }
    };
    
    canvas.onmouseleave = (e) => {
      if (this.isDrawing && this.currentView === view) {
        // Cancelar el dibujo
        this.isDrawing = false;
        this.redrawMarks(view);
      }
    };
    
    // Eventos táctiles
    canvas.ontouchstart = (e) => {
      e.preventDefault();
      
      this.currentView = view;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      if (this.currentTool === 'marker') {
        this.drawMarkerImmediate(view, x, y);
      } else if (this.currentTool === 'eraser') {
        this.eraseImmediate(view, x, y);
      } else if (this.currentTool === 'arrow') {
        this.isDrawing = true;
        this.startX = x;
        this.startY = y;
      }
    };
    
    canvas.ontouchmove = (e) => {
      e.preventDefault();
      
      if (this.isDrawing && this.currentTool === 'arrow' && this.currentView === view) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        
        // Redibujar para mostrar la flecha en tiempo real
        this.redrawMarks(view);
        
        // Dibujar la flecha temporal
        const ctx = this.getContext(view);
        this.drawArrow(ctx, this.startX, this.startY, currentX, currentY);
      }
    };
    
    canvas.ontouchend = (e) => {
      e.preventDefault();
      
      if (this.isDrawing && this.currentTool === 'arrow' && this.currentView === view) {
        // Usamos las últimas coordenadas conocidas
        const touch = e.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const endX = touch.clientX - rect.left;
        const endY = touch.clientY - rect.top;
        
        // Guardar la flecha
        this.drawArrowImmediate(view, this.startX, this.startY, endX, endY);
        
        this.isDrawing = false;
      }
    };
  }
  
  setupEventListeners(canvas, view) {
    // Eventos de mouse
    canvas.addEventListener('mousedown', (e) => {
      console.log(`Mouse down en ${view}`);
      this.currentView = view;
      this.isDrawing = true;
      
      const rect = canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
      
      if (this.currentTool === 'marker') {
        this.drawMarkerImmediate(view, this.startX, this.startY);
      } else if (this.currentTool === 'eraser') {
        this.eraseImmediate(view, this.startX, this.startY);
      }
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (this.isDrawing && this.currentView === view) {
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        if (this.currentTool === 'marker') {
          this.drawMarkerImmediate(view, currentX, currentY);
        } else if (this.currentTool === 'eraser') {
          this.eraseImmediate(view, currentX, currentY);
        } else if (this.currentTool === 'arrow') {
          // Para flechas, solo mostramos una vista previa
          this.redrawMarks(view);
          const ctx = this.getContext(view);
          this.drawArrow(ctx, this.startX, this.startY, currentX, currentY);
        }
      }
    });
    
    canvas.addEventListener('mouseup', (e) => {
      if (this.isDrawing && this.currentView === view) {
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        if (this.currentTool === 'arrow') {
          this.drawArrowImmediate(view, this.startX, this.startY, currentX, currentY);
        }
        
        this.isDrawing = false;
        this.actualizarLeyenda();
      }
    });
    
    canvas.addEventListener('mouseleave', (e) => {
      if (this.isDrawing && this.currentView === view) {
        this.isDrawing = false;
        this.redrawMarks(view);
      }
    });
    
    // Eventos táctiles
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      console.log(`Touch start en ${view}`);
      
      this.currentView = view;
      this.isDrawing = true;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      this.startX = touch.clientX - rect.left;
      this.startY = touch.clientY - rect.top;
      
      if (this.currentTool === 'marker') {
        this.drawMarkerImmediate(view, this.startX, this.startY);
      } else if (this.currentTool === 'eraser') {
        this.eraseImmediate(view, this.startX, this.startY);
      }
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      if (this.isDrawing && this.currentView === view) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        
        if (this.currentTool === 'marker') {
          this.drawMarkerImmediate(view, currentX, currentY);
        } else if (this.currentTool === 'eraser') {
          this.eraseImmediate(view, currentX, currentY);
        } else if (this.currentTool === 'arrow') {
          // Para flechas, solo mostramos una vista previa
          this.redrawMarks(view);
          const ctx = this.getContext(view);
          this.drawArrow(ctx, this.startX, this.startY, currentX, currentY);
        }
      }
    });
    
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      
      if (this.isDrawing && this.currentView === view) {
        const touch = e.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        
        if (this.currentTool === 'arrow') {
          this.drawArrowImmediate(view, this.startX, this.startY, currentX, currentY);
        }
        
        this.isDrawing = false;
        this.actualizarLeyenda();
      }
    });
  }
  
  getContext(view) {
    if (view === 'anterior') {
      if (!this.ctxAnterior) {
        this.ctxAnterior = this.canvasAnterior.getContext('2d');
      }
      return this.ctxAnterior;
    } else {
      if (!this.ctxPosterior) {
        this.ctxPosterior = this.canvasPosterior.getContext('2d');
      }
      return this.ctxPosterior;
    }
  }
  
  // Métodos de dibujo inmediato
  drawMarkerImmediate(view, x, y) {
    console.log(`Dibujando marca en ${view} en (${x}, ${y})`);
    
    // Dibujar en el canvas
    const ctx = this.getContext(view);
    this.drawMarker(ctx, x, y);
    
    // Guardar la marca
    this.marcas[view].push({
      tool: 'marker',
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      tipo: this.sintomaActual.tipo,
      intensidad: this.sintomaActual.intensidad,
      color: this.sintomaActual.color
    });
    
    // Actualizar leyenda
    this.actualizarLeyenda();
  }
  
  drawArrowImmediate(view, startX, startY, endX, endY) {
    console.log(`Dibujando flecha en ${view} de (${startX}, ${startY}) a (${endX}, ${endY})`);
    
    // Verificar que no sea un clic accidental
    const dx = endX - startX;
    const dy = endY - startY;
    const distancia = Math.sqrt(dx*dx + dy*dy);
    
    if (distancia < 5) {
      console.log('Ignorando flecha muy pequeña');
      return;
    }
    
    // Dibujar en el canvas
    const ctx = this.getContext(view);
    this.drawArrow(ctx, startX, startY, endX, endY);
    
    // Guardar la flecha
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
    
    // Actualizar leyenda
    this.actualizarLeyenda();
  }
  
  eraseImmediate(view, x, y) {
    console.log(`Borrando en ${view} en (${x}, ${y})`);
    
    // Dibujar en el canvas
    const ctx = this.getContext(view);
    
    // Aplicar borrador
    const eraseRadius = 20;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Eliminar marcas en esta área
    this.marcas[view] = this.marcas[view].filter(marca => {
      if (marca.tool === 'marker') {
        const distancia = Math.sqrt(
          Math.pow(marca.endX - x, 2) + Math.pow(marca.endY - y, 2)
        );
        return distancia > eraseRadius;
      } else if (marca.tool === 'arrow') {
        // Para flechas, verificamos ambos extremos y el centro
        const distanciaInicio = Math.sqrt(
          Math.pow(marca.startX - x, 2) + Math.pow(marca.startY - y, 2)
        );
        const distanciaFin = Math.sqrt(
          Math.pow(marca.endX - x, 2) + Math.pow(marca.endY - y, 2)
        );
        const distanciaCentro = Math.sqrt(
          Math.pow((marca.startX + marca.endX)/2 - x, 2) + 
          Math.pow((marca.startY + marca.endY)/2 - y, 2)
        );
        return distanciaInicio > eraseRadius && 
               distanciaFin > eraseRadius && 
               distanciaCentro > eraseRadius;
      }
      return true;
    });
    
    // Actualizar leyenda
    this.actualizarLeyenda();
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
  
  clearCanvas() {
    if (confirm('¿Estás seguro de querer borrar todas las marcas del mapa actual?')) {
      const view = this.currentView;
      
      // Limpiar canvas
      const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
      const ctx = this.getContext(view);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Limpiar marcas de esta vista
      this.marcas[view] = [];
      
      // Actualizar leyenda
      this.actualizarLeyenda();
      
      console.log(`Canvas ${view} limpiado`);
    }
  }
  
  redrawMarks(view) {
    console.log(`Redibujando marcas en ${view}...`);
    
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = this.getContext(view);
    
    if (!ctx) {
      console.error(`Contexto no disponible para ${view}`);
      return;
    }
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redibujar todas las marcas
    this.marcas[view].forEach(marca => {
      if (marca.tool === 'marker') {
        // Guardar configuración actual
        const currentTipo = this.sintomaActual.tipo;
        const currentIntensidad = this.sintomaActual.intensidad;
        const currentColor = this.sintomaActual.color;
        
        // Aplicar configuración de la marca
        this.sintomaActual.tipo = marca.tipo;
        this.sintomaActual.intensidad = marca.intensidad;
        this.sintomaActual.color = marca.color;
        
        // Dibujar marca
        this.drawMarker(ctx, marca.endX, marca.endY);
        
        // Restaurar configuración
        this.sintomaActual.tipo = currentTipo;
        this.sintomaActual.intensidad = currentIntensidad;
        this.sintomaActual.color = currentColor;
      } else if (marca.tool === 'arrow') {
        // Guardar configuración actual
        const currentColor = this.sintomaActual.color;
        
        // Aplicar configuración de la marca
        this.sintomaActual.color = marca.color;
        
        // Dibujar flecha
        this.drawArrow(ctx, marca.startX, marca.startY, marca.endX, marca.endY);
        
        // Restaurar configuración
        this.sintomaActual.color = currentColor;
      }
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
    console.log(`Herramienta seleccionada: ${tool}`);
    
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
    console.log('Datos del mapa guardados:', mapData);
  }
  
  // Cargar datos previamente guardados
  loadMapData(data) {
    if (!data) return;
    
    try {
      const mapData = JSON.parse(data);
      console.log('Cargando datos del mapa:', mapData);
      
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
  console.log('DOM cargado. Iniciando mapa corporal...');
  
  // Dar tiempo para que todo esté completamente cargado
  setTimeout(() => {
    try {
      window.mapaCorporal = new MapaCorporal();
      
      // Si hay datos previos en el campo oculto, cargarlos
      const datosGuardados = document.getElementById('mapa-datos').value;
      if (datosGuardados) {
        window.mapaCorporal.loadMapData(datosGuardados);
      }
    } catch (error) {
      console.error('Error al inicializar el mapa corporal:', error);
      alert('Hubo un problema al inicializar el mapa corporal. Por favor, recarga la página.');
    }
  }, 500);
});
