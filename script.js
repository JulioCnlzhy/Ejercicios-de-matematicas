// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Desplazamiento suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Solo aplicar desplazamiento suave para enlaces internos
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Cerrar menú móvil después de hacer clic
          closeMobileMenu();
        }
      }
    });
  });

  // Menú móvil
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      body.classList.toggle('menu-open');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Cerrar menú al redimensionar la ventana (si se cambia a desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });

    // Prevenir que los clics dentro del menú lo cierren
    navLinks.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function closeMobileMenu() {
    if (navLinks) navLinks.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
    body.classList.remove('menu-open');
  }

  // Mejora: Añadir clase para indicar página activa
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-links a');
  
  navLinksAll.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === 'index.html' && linkHref === '#inicio')) {
      link.classList.add('active');
    }
  });

  // Mejora: Cerrar menú al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Mejora: Ajustar altura del hero basado en el header
  function adjustHeroMargin() {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    if (header && hero) {
      const headerHeight = header.offsetHeight;
      hero.style.marginTop = headerHeight + 'px';
    }
  }

  // Ejecutar al cargar y al redimensionar
  adjustHeroMargin();
  window.addEventListener('resize', adjustHeroMargin);
});