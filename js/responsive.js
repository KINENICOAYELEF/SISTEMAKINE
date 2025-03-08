// SISTEMAKINE - Responsive JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  
  // Remover cualquier botón o toggle previo
  const oldButtons = document.querySelectorAll('#menu-toggle, .navbar-toggler, button[aria-label="Toggle navigation"], .btn-toggle-sidebar, .menu-toggle, .sidebar-toggle');
  oldButtons.forEach(button => {
    if (button && button.parentNode) {
      button.parentNode.removeChild(button);
    }
  });
  
  // Crear overlay para cerrar el sidebar expandido
  if (!document.querySelector('.sidebar-overlay') && sidebar) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Evento para cerrar el sidebar al hacer clic en el overlay
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('expanded');
      document.body.classList.remove('sidebar-expanded');
    });
  }
  
  // Si estamos en móvil, configurar el sidebar para ser clickable
  if (window.innerWidth <= 767.98 && sidebar) {
    // Detectar si estamos en dashboard para ajustar estilos 
    if (window.location.href.includes('dashboard.html')) {
      document.body.classList.add('dashboard');
    }
    
    // Hacer que el sidebar sea clickable para expandir/colapsar
    sidebar.addEventListener('click', function(e) {
      // Solo expandir si hacemos clic en el sidebar mismo, no en los enlaces
      if (e.target === sidebar || e.target.classList.contains('sidebar-header') || 
          e.target.classList.contains('sidebar-brand') || e.target.classList.contains('sidebar-nav')) {
        toggleSidebar();
      }
    });
    
    // Hacer que los ítems del sidebar sean clickables individualmente
    const sidebarItems = sidebar.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      const link = item.querySelector('.sidebar-link');
      
      // Si es un enlace sin hijos, que funcione normalmente
      if (link) {
        if (window.innerWidth <= 767.98) {
          // Al hacer hover en modo de iconos, mostrar un tooltip con el nombre
          link.setAttribute('data-title', link.querySelector('span').textContent.trim());
          
          // En móviles, al hacer clic en un icono, primero expandir el sidebar
          link.addEventListener('click', function(e) {
            if (!sidebar.classList.contains('expanded')) {
              e.preventDefault();
              toggleSidebar();
              // Después de un pequeño delay, hacer clic en el enlace
              setTimeout(() => {
                this.click();
              }, 300);
            }
          });
        }
      }
    });
    
    // Función para alternar el estado del sidebar
    function toggleSidebar() {
      sidebar.classList.toggle('expanded');
      document.body.classList.toggle('sidebar-expanded');
    }
  }
  
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
  
  // Ajustar sidebar al cambiar tamaño de ventana
  window.addEventListener('resize', function() {
    if (window.innerWidth > 767.98) {
      // En escritorio, reset todo
      if (sidebar) {
        sidebar.classList.remove('expanded');
        document.body.classList.remove('sidebar-expanded');
      }
    }
  });
});
