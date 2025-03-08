document.addEventListener('DOMContentLoaded', function() {
  // Esperar un momento para asegurar que todos los elementos estén cargados
  setTimeout(function() {
    // Identificar y eliminar específicamente la barra morada
    const purpleBar = document.querySelector('.dashboard nav') || 
                      document.querySelector('nav.navbar-mobile') || 
                      document.querySelector('.mobile-header-purple');
    
    if (purpleBar) {
      console.log("Eliminando barra morada duplicada");
      purpleBar.remove();
    }
  }, 100);
});
