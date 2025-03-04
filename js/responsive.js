// Controla el menú responsive en dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const navbar = document.querySelector('.navbar');
  
  // Solo si existe una barra de navegación
  if (navbar) {
    // Crear el botón de menú si no existe
    if (!document.querySelector('.menu-toggle')) {
      const menuToggle = document.createElement('div');
      menuToggle.className = 'menu-toggle';
      menuToggle.innerHTML = '☰';
      navbar.appendChild(menuToggle);
      
      // Añadir evento de clic
      menuToggle.addEventListener('click', function() {
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav) {
          navbarNav.classList.toggle('show');
        }
      });
    }
  }
  
  // Hacer que todas las tablas sean responsive
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Si la tabla no está ya dentro de un contenedor responsive
    if (!table.parentElement.classList.contains('table-responsive')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });
});
