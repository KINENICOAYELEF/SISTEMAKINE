// SISTEMAKINE - Responsive JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const navbar = document.querySelector('.navbar');
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  
  // Crear botón para mostrar/ocultar sidebar en móviles
  if (!document.querySelector('.sidebar-toggle') && sidebar && content) {
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(sidebarToggle);
    
    // Añadir evento de clic para el sidebar
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      document.body.classList.toggle('sidebar-active');
      
      // Añadir overlay para cerrar el sidebar al tocar fuera
      if (sidebar.classList.contains('active') && !document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '1040';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        
        // Mostrar con animación
        setTimeout(() => {
          overlay.style.display = 'block';
        }, 10);
        
        overlay.addEventListener('click', function() {
          sidebar.classList.remove('active');
          document.body.classList.remove('sidebar-active');
          overlay.style.display = 'none';
          setTimeout(() => {
            overlay.remove();
          }, 300);
        });
      } else {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
          overlay.style.display = 'none';
          setTimeout(() => {
            overlay.remove();
          }, 300);
        }
      }
    });
  }
  
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
  
  // Mejorar la experiencia de las pestañas en móviles
  const tabNav = document.querySelector('.tab-nav');
  if (tabNav) {
    // Asegurarse de que se pueda desplazar horizontalmente
    tabNav.style.overflowX = 'auto';
    tabNav.style.flexWrap = 'nowrap';
    tabNav.style.whiteSpace = 'nowrap';
    tabNav.style.WebkitOverflowScrolling = 'touch';
    
    // Ajustar el ancho de las pestañas en móviles
    const tabLinks = tabNav.querySelectorAll('.tab-link');
    if (window.innerWidth <= 575.98) {
      tabLinks.forEach(link => {
        link.style.padding = '0.5rem 0.75rem';
        link.style.fontSize = '0.9rem';
      });
    }
    
    // Desplazamiento suave al cambiar pestañas
    tabLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Obtener la posición del elemento
        const rect = this.getBoundingClientRect();
        // Desplazar suavemente la pestaña al centro si es posible
        tabNav.scrollTo({
          left: rect.left + tabNav.scrollLeft - tabNav.clientWidth / 2 + rect.width / 2,
          behavior: 'smooth'
        });
      });
    });
  }
});
