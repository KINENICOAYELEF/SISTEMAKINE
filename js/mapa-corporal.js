// Mapa Corporal Interactivo
// Versión con dimensiones fijas para solucionar problemas de visualización

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
    
    // Inicializar
    this.init();
  }
  
  init() {
    console.log("Inicializando mapa corporal...");
    
    // Forzar un tamaño fijo para las imágenes (IMPORTANTE)
    this.imgAnterior.style.width = '300px';
    this.imgPosterior.style.width = '300px';
    
    // Configurar canvas con dimensiones fijas
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
  }
  
  setupCanvas(view) {
    console.log(`Configurando canvas para ${view}...`);
    
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const img = view === 'anterior' ? this.imgAnterior : this.imgPosterior;
    const container = view === 'anterior' ? this.containerAnterior : this.containerPosterior;
    
    if (!canvas || !img) {
      console.error(`Canvas o imagen no encontrados para ${view}`);
      return;
    }
    
    // SOLUCIÓN: Forzar dimensiones específicas en el canvas
    canvas.width = 300;
    canvas.height = 600;
    
    // Asegurar que el canvas ocupe todo el contenedor
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    console.log(`Canvas ${view} dimensiones: ${canvas.width}x${canvas.height}`);
    
    // Configurar eventos - Método directo
    this.setupClickEvents(canvas, view);
  }
  
  setupClickEvents(canvas, view) {
    // Evento de clic simple para marcar
    canvas.onclick = (e) => {
      // Obtener coordenadas relativas al canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log(`Clic en ${view} en (${x}, ${y})`);
      
      // Ajustar coordenadas según el tamaño real del canvas vs. tamaño mostrado
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = x * scaleX;
      const canvasY = y * scaleY;
      
      // Dibujar según la herramienta seleccionada
      if (this.currentTool === 'marker') {
        this.drawMarker(view, canvasX, canvasY);
      } else if (this.currentTool === 'eraser') {
        this.erase(view, canvasX, canvasY);
      }
    };
    
    // Eventos táctiles
    canvas.ontouchstart = (e) => {
      e.preventDefault();
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      console.log(`Touch en ${view} en (${x}, ${y})`);
      
      // Ajustar coordenadas
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = x * scaleX;
      const canvasY = y * scaleY;
      
      // Dibujar según la herramienta seleccionada
      if (this.currentTool === 'marker') {
        this.drawMarker(view, canvasX, canvasY);
      } else if (this.currentTool === 'eraser') {
        this.erase(view, canvasX, canvasY);
      }
    };
  }
  
  drawMarker(view, x, y) {
    console.log(`Dibujando marca en ${view} en (${x}, ${y})`);
    
    // Obtener contexto
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = canvas.getContext('2d');
    
    // Dibujar círculo
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
    
    // Guardar la marca
    this.marcas[view].push({
      tool: 'marker',
      x: x,
      y: y,
      tipo: this.sintomaActual.tipo,
      intensidad: this.sintomaActual.intensidad,
      color: this.sintomaActual.color
    });
    
    // Actualizar leyenda
    this.actualizarLeyenda();
  }
  
  erase(view, x, y) {
    console.log(`Borrando en ${view} en (${x}, ${y})`);
    
    // Obtener contexto
    const canvas = view === 'anterior' ? this.canvasAnterior : this.canvasPosterior;
    const ctx = canvas.getContext('2d');
    
    // Radio de borrado
    const eraseRadius = 20;
    
    // Borrar área
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Filtrar marcas que quedan fuera del radio de borrado
    this.marcas[view] = this.marcas[view].filter(marca => {
      const distance = Math.sqrt(Math.pow(marca.x - x, 2) + Math.pow(marca.y - y, 2));
      return distance > eraseRadius;
    });
    
    // Actualizar leyenda
    this.actualizarLeyenda();
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
      // Marcadores
      if (marca.tool === 'marker') {
        // Dibujar círculo
        const radius = 10;
        ctx.beginPath();
        ctx.arc(marca.x, marca.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = marca.color;
        ctx.fill();
        
        // Añadir número de intensidad si es dolor
        if (marca.tipo === 'dolor') {
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(marca.intensidad.toString(), marca.x, marca.y);
        }
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
  // Retrasar la inicialización para asegurar que todo está cargado
  setTimeout(() => {
    console.log('Inicializando mapa corporal con dimensiones fijas...');
    window.mapaCorporal = new MapaCorporal();
    
    // Si hay datos previos en el campo oculto, cargarlos
    const datosGuardados = document.getElementById('mapa-datos').value;
    if (datosGuardados) {
      window.mapaCorporal.loadMapData(datosGuardados);
    }
  }, 500);
});
