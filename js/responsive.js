// SISTEMAKINE - Responsive JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  
  // Detectar si estamos en el dashboard
  const isDashboard = window.location.href.includes('dashboard.html');
  
  // Aplicar clase específica al body según la página
  if (isDashboard) {
    document.body.classList.add('dashboard-page');
  }
  
  // Crear overlay para ambas versiones
  if (!document.querySelector('.sidebar-overlay') && sidebar) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Evento para cerrar el sidebar al hacer clic en el overlay
    overlay.addEventListener('click', function() {
      if (isDashboard) {
        // En dashboard, colapsar
        sidebar.classList.remove('expanded');
        document.body.classList.remove('sidebar-expanded');
      } else {
        // En otras páginas, ocultar
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-active');
      }
    });
  }

  // CONFIGURACIÓN ESPECÍFICA PARA EL DASHBOARD
  if (isDashboard && sidebar) {
    // En el dashboard, hacer que el sidebar sea clickable para expandir/colapsar
    sidebar.addEventListener('click', function(e) {
      // Solo expandir si hacemos clic en el sidebar mismo, no en los enlaces
      if (e.target === sidebar || e.target.classList.contains('sidebar-header') || 
          e.target.classList.contains('sidebar-brand') || e.target.classList.contains('sidebar-nav')) {
        toggleDashboardSidebar();
      }
    });
    
    // Hacer que los ítems del sidebar sean clickables individualmente
    const sidebarItems = sidebar.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      const link = item.querySelector('.sidebar-link');
      
      // Si es un enlace, configurar comportamiento
      if (link) {
        // Al hacer hover en modo de iconos, mostrar tooltip
        link.setAttribute('data-title', link.querySelector('span') ? 
                         link.querySelector('span').textContent.trim() : '');
        
        // Al hacer clic en un icono, primero expandir el sidebar
        link.addEventListener('click', function(e) {
          if (!sidebar.classList.contains('expanded')) {
            e.preventDefault();
            toggleDashboardSidebar();
            
            // Después de un delay, hacer clic en el enlace
            setTimeout(() => {
              this.click();
            }, 300);
          }
        });
      }
    });
    
    // Función para alternar el estado del sidebar en dashboard
    function toggleDashboardSidebar() {
      sidebar.classList.toggle('expanded');
      document.body.classList.toggle('sidebar-expanded');
    }
  }
  // CONFIGURACIÓN PARA OTRAS PÁGINAS (NO DASHBOARD)
  else if (!isDashboard && sidebar) {
    // En otras páginas, crear botón para mostrar/ocultar sidebar
    if (!document.querySelector('.sidebar-toggle')) {
      const sidebarToggle = document.createElement('button');
      sidebarToggle.className = 'sidebar-toggle';
      sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
      sidebarToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.appendChild(sidebarToggle);
      
      // Añadir evento de clic para el sidebar
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('sidebar-active');
        
        // Actualizar el aria-label según el estado
        if (sidebar.classList.contains('active')) {
          sidebarToggle.setAttribute('aria-label', 'Cerrar menú');
          // Mostrar overlay con animación
          document.querySelector('.sidebar-overlay').style.display = 'block';
        } else {
          sidebarToggle.setAttribute('aria-label', 'Abrir menú');
          // Ocultar overlay
          document.querySelector('.sidebar-overlay').style.display = 'none';
        }
      });
      
      // También cerrar el sidebar al hacer clic en cualquier enlace
      const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
      sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
          if (window.innerWidth <= 767.98) {
            setTimeout(() => {
              sidebar.classList.remove('active');
              document.body.classList.remove('sidebar-active');
              document.querySelector('.sidebar-overlay').style.display = 'none';
              sidebarToggle.setAttribute('aria-label', 'Abrir menú');
            }, 150);
          }
        });
      });
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
});
