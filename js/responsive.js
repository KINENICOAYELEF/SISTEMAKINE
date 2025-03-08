// SISTEMAKINE - Responsive JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const navbar = document.querySelector('.navbar');
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  
  // Detectar si estamos en el dashboard
  if (window.location.href.includes('dashboard.html')) {
    document.body.classList.add('dashboard');
  }
  
  // Crear botón para mostrar/ocultar sidebar en móviles
  if (!document.querySelector('.sidebar-toggle') && sidebar && content) {
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    sidebarToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.appendChild(sidebarToggle);
    
    // Crear overlay una sola vez
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Añadir evento de clic para el sidebar
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      document.body.classList.toggle('sidebar-active');
      
      // Actualizar el aria-label según el estado
      if (sidebar.classList.contains('active')) {
        sidebarToggle.setAttribute('aria-label', 'Cerrar menú');
        // Mostrar overlay con animación
        setTimeout(() => {
          overlay.style.display = 'block';
        }, 10);
      } else {
        sidebarToggle.setAttribute('aria-label', 'Abrir menú');
        // Ocultar overlay
        overlay.style.display = 'none';
      }
    });
    
    // Evento para cerrar el sidebar al hacer clic en el overlay
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      document.body.classList.remove('sidebar-active');
      overlay.style.display = 'none';
      sidebarToggle.setAttribute('aria-label', 'Abrir menú');
    });
    
    // También cerrar el sidebar al hacer clic en cualquier enlace dentro del sidebar
    const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 575.98) {
          setTimeout(() => {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-active');
            overlay.style.display = 'none';
            sidebarToggle.setAttribute('aria-label', 'Abrir menú');
          }, 150); // Un pequeño retraso para que se sienta el clic
        }
      });
    });
  }
  
  // El resto del código para tablas y pestañas...
  // Hacer que todas las tablas sean responsive
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
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
    tabNav.style.overflowX = 'auto';
    tabNav.style.flexWrap = 'nowrap';
    tabNav.style.whiteSpace = 'nowrap';
    tabNav.style.WebkitOverflowScrolling = 'touch';
    
    const tabLinks = tabNav.querySelectorAll('.tab-link');
    if (window.innerWidth <= 575.98) {
      tabLinks.forEach(link => {
        link.style.padding = '0.5rem 0.75rem';
        link.style.fontSize = '0.9rem';
      });
    }
    
    tabLinks.forEach(link => {
      link.addEventListener('click', function() {
        const rect = this.getBoundingClientRect();
        tabNav.scrollTo({
          left: rect.left + tabNav.scrollLeft - tabNav.clientWidth / 2 + rect.width / 2,
          behavior: 'smooth'
        });
      });
    });
  }
});
