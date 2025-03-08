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
// Añadir botón para mostrar/ocultar sidebar en móviles
  const content = document.querySelector('.content');
  if (content) {
    // Crear botón de toggle para el sidebar si no existe
    if (!document.querySelector('.sidebar-toggle')) {
      const sidebarToggle = document.createElement('button');
      sidebarToggle.className = 'sidebar-toggle btn btn-primary btn-sm';
      sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
      sidebarToggle.style.position = 'fixed';
      sidebarToggle.style.top = '10px';
      sidebarToggle.style.left = '10px';
      sidebarToggle.style.zIndex = '1000';
      sidebarToggle.style.display = 'none';
      
      // Solo mostrar en pantallas pequeñas
      if (window.innerWidth <= 575.98) {
        sidebarToggle.style.display = 'block';
      }
      
      document.body.appendChild(sidebarToggle);
      
      // Añadir evento de clic
      sidebarToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          sidebar.classList.toggle('active');
          
          // Ajustar el margen del contenido si es necesario
          if (sidebar.classList.contains('active')) {
            content.style.marginLeft = '200px';
          } else {
            content.style.marginLeft = '0';
          }
        }
      });
      
      // Actualizar visibilidad del botón al cambiar el tamaño de la ventana
      window.addEventListener('resize', function() {
        if (window.innerWidth <= 575.98) {
          sidebarToggle.style.display = 'block';
        } else {
          sidebarToggle.style.display = 'none';
        }
      });
    }
  }
});
