// Script específico para funcionalidades móviles
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar en móviles
  if (window.innerWidth <= 767.98) {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    if (sidebar && content) {
      // Crear botón para móviles si no existe
      if (!document.querySelector('.mobile-menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(menuToggle);
        
        // Añadir evento al botón
        menuToggle.addEventListener('click', function() {
          sidebar.classList.toggle('active');
          
          // Si está activo, mostrar sidebar
          if (sidebar.classList.contains('active')) {
            sidebar.style.transform = 'translateX(0)';
          } else {
            sidebar.style.transform = 'translateX(-100%)';
          }
        });
      }
      
      // Mejorar pestañas en móviles
      const tabNav = document.querySelector('.tab-nav');
      if (tabNav) {
        // Hacer que las pestañas sean deslizables
        const tabLinks = tabNav.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
          link.addEventListener('click', function() {
            // Centrar pestaña seleccionada
            const rect = this.getBoundingClientRect();
            tabNav.scrollTo({
              left: rect.left + tabNav.scrollLeft - tabNav.clientWidth / 2 + rect.width / 2,
              behavior: 'smooth'
            });
          });
        });
      }
    }
  }
});
