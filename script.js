// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado - Iniciando configuración...');
  
  // Inicializar notificaciones push
  initPushNotifications();
  
  // Inicializar menú hamburguesa inmediatamente
  initMobileMenu();
  
  // Desplazamiento suave
  initSmoothScroll();
  
  // Configurar página activa
  highlightActivePage();
  
  // Ajustar márgenes
  adjustHeroMargin();
  
  // Event listeners globales
  initGlobalEvents();
});

// ==============================================
// CONFIGURACIÓN DEL MENÚ MÓVIL
// ==============================================

function initMobileMenu() {
  console.log('Inicializando menú móvil...');
  
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (!hamburger || !navLinks) {
    console.warn('Elementos del menú no encontrados');
    return;
  }

  // Mostrar el hamburguesa en móvil
  hamburger.style.display = 'flex';
  
  // Event listener para el hamburguesa
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Hamburguesa clickeado');
    
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Debug
    console.log('Menú activo:', navLinks.classList.contains('active'));
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      console.log('Enlace clickeado, cerrando menú...');
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (navLinks) navLinks.classList.remove('active');
  if (hamburger) hamburger.classList.remove('active');
  body.classList.remove('menu-open');
}

// ==============================================
// CONFIGURACIÓN DE SCROLL SUAVE
// ==============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          closeMobileMenu();
        }
      }
    });
  });
}

// ==============================================
// CONFIGURACIÓN DE PÁGINA ACTIVA
// ==============================================

function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-links a');
  
  navLinksAll.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === 'index.html' && linkHref === '#inicio')) {
      link.classList.add('active');
    }
  });
}

// ==============================================
// CONFIGURACIÓN DE MÁRGENES
// ==============================================

function adjustHeroMargin() {
  const header = document.querySelector('header');
  const hero = document.querySelector('.hero');
  
  if (header && hero) {
    const headerHeight = header.offsetHeight;
    hero.style.marginTop = headerHeight + 'px';
    
    // Reajustar en redimensionamiento
    window.addEventListener('resize', () => {
      const newHeight = header.offsetHeight;
      hero.style.marginTop = newHeight + 'px';
    });
  }
}

// ==============================================
// EVENTOS GLOBALES
// ==============================================

function initGlobalEvents() {
  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!e.target.closest('.navbar') && 
        navLinks && navLinks.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Cerrar menú con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Cerrar menú al redimensionar (si se cambia a desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

// ==============================================
// SISTEMA DE NOTIFICACIONES PUSH MEJORADO
// ==============================================

class PushNotificationManager {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.serviceWorkerRegistered = false;
    
    console.log('Notificaciones soportadas:', this.isSupported);
    console.log('Permiso actual:', this.permission);
    
    this.createNotificationButton();
  }

  createNotificationButton() {
    return new Promise((resolve) => {
      // Solo crear el botón si las notificaciones son soportadas
      if (!this.isSupported) {
        console.log('Notificaciones no soportadas en este navegador');
        resolve(null);
        return;
      }

      let notificationBtn = document.getElementById('notification-toggle');
      
      if (!notificationBtn) {
        notificationBtn = document.createElement('button');
        notificationBtn.id = 'notification-toggle';
        notificationBtn.className = 'notification-btn';
        notificationBtn.innerHTML = '🔔';
        notificationBtn.title = 'Activar notificaciones';
        
        // Estilos del botón
        Object.assign(notificationBtn.style, {
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#4a7b9d',
          color: 'white',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: '1000',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        });

        notificationBtn.addEventListener('mouseenter', () => {
          notificationBtn.style.transform = 'scale(1.1)';
          notificationBtn.style.backgroundColor = '#e6b89c';
        });

        notificationBtn.addEventListener('mouseleave', () => {
          notificationBtn.style.transform = 'scale(1)';
          notificationBtn.style.backgroundColor = '#4a7b9d';
        });

        notificationBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleNotifications();
        });

        document.body.appendChild(notificationBtn);
      }

      this.updateButtonState();
      resolve(notificationBtn);
    });
  }

  updateButtonState() {
    const btn = document.getElementById('notification-toggle');
    if (!btn) return;

    switch(this.permission) {
      case 'granted':
        btn.innerHTML = '🔔';
        btn.title = 'Notificaciones activas - Click para desactivar';
        btn.style.backgroundColor = '#2ecc71';
        break;
      case 'denied':
        btn.innerHTML = '🔕';
        btn.title = 'Notificaciones bloqueadas';
        btn.style.backgroundColor = '#e74c3c';
        btn.onclick = null;
        break;
      default:
        btn.innerHTML = '🔔';
        btn.title = 'Activar notificaciones';
        btn.style.backgroundColor = '#4a7b9d';
    }
  }

  checkPermission() {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Las notificaciones no son compatibles con este navegador'));
        return;
      }

      if (this.permission === 'granted') {
        resolve('granted');
        return;
      }

      if (this.permission === 'denied') {
        reject(new Error('Los permisos para notificaciones fueron denegados'));
        return;
      }

      // Solicitar permiso - ESTA ES LA PARTE CLAVE PARA MÓVIL
      console.log('Solicitando permiso de notificaciones...');
      Notification.requestPermission()
        .then(permission => {
          console.log('Permiso obtenido:', permission);
          this.permission = permission;
          this.updateButtonState();
          
          if (permission === 'granted') {
            resolve('granted');
            this.showWelcomeNotification();
          } else {
            reject(new Error('Usuario denegó los permisos: ' + permission));
          }
        })
        .catch(error => {
          console.error('Error solicitando permiso:', error);
          reject(error);
        });
    });
  }

  toggleNotifications() {
    return new Promise((resolve, reject) => {
      if (this.permission === 'granted') {
        this.disableNotifications()
          .then(() => {
            resolve('disabled');
            this.showNotification(
              'Notificaciones Desactivadas',
              'Ya no recibirás notificaciones de Matemáticas'
            );
          })
          .catch(reject);
      } else {
        this.enableNotifications()
          .then(resolve)
          .catch(reject);
      }
    });
  }

  enableNotifications() {
    return new Promise((resolve, reject) => {
      console.log('Activando notificaciones...');
      this.checkPermission()
        .then(permission => {
          if (permission === 'granted') {
            this.registerServiceWorker()
              .then(() => {
                console.log('Notificaciones activadas correctamente');
                resolve('enabled');
                this.scheduleDailyNotifications();
              })
              .catch(error => {
                console.warn('Error registrando Service Worker:', error);
                // Continuar aunque falle el Service Worker
                resolve('enabled_without_sw');
                this.scheduleDailyNotifications();
              });
          }
        })
        .catch(reject);
    });
  }

  disableNotifications() {
    return new Promise((resolve) => {
      this.permission = 'denied';
      this.updateButtonState();
      this.cancelAllNotifications();
      resolve('disabled');
    });
  }

  registerServiceWorker() {
    return new Promise((resolve, reject) => {
      if (!'serviceWorker' in navigator) {
        resolve('serviceWorker_not_supported');
        return;
      }

      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          this.serviceWorkerRegistered = true;
          console.log('Service Worker registrado exitosamente');
          resolve(registration);
        })
        .catch(error => {
          console.warn('Error registrando Service Worker:', error);
          reject(error);
        });
    });
  }

  showNotification(title, message, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || this.permission !== 'granted') {
        reject(new Error('Notificaciones no disponibles'));
        return;
      }

      const notificationOptions = {
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
        tag: 'math-notification',
        requireInteraction: false,
        ...options
      };

      // Usar Notification API directamente (más confiable en móviles)
      this.showNativeNotification(title, message, notificationOptions)
        .then(resolve)
        .catch(reject);
    });
  }

  showNativeNotification(title, message, options) {
    return new Promise((resolve, reject) => {
      try {
        const notification = new Notification(title, options);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        notification.onshow = () => {
          console.log('Notificación mostrada exitosamente');
          resolve('shown_natively');
        };

        notification.onerror = (error) => {
          console.error('Error mostrando notificación:', error);
          reject(error);
        };

        // Cerrar automáticamente después de 5 segundos
        setTimeout(() => {
          notification.close();
        }, 5000);

      } catch (error) {
        reject(error);
      }
    });
  }

  showWelcomeNotification() {
    return this.showNotification(
      '¡Bienvenido a Matemáticas! 🎉',
      'Ahora recibirás recordatorios para practicar ejercicios matemáticos',
      {
        requireInteraction: true
      }
    );
  }

  scheduleDailyNotifications() {
    return new Promise((resolve) => {
      // Programar primera notificación en 10 segundos (para prueba)
      setTimeout(() => {
        this.showDailyNotification();
      }, 10000);

      // Programar notificación diaria cada 24 horas
      setInterval(() => {
        this.showDailyNotification();
      }, 24 * 60 * 60 * 1000);

      resolve('scheduled');
    });
  }

  showDailyNotification() {
    const messages = [
      '¡Es un buen momento para practicar matemáticas! ¿Listo para un desafío?',
      'Recordatorio: 15 minutos de práctica diaria mejoran tus habilidades matemáticas',
      'Nuevos ejercicios te esperan. ¡No dejes para mañana lo que puedes practicar hoy!',
      '¿Sabías que la práctica constante es clave para dominar las matemáticas?',
      '¡Mantén tu mente activa! Un pequeño ejercicio matemático cada día hace la diferencia'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return this.showNotification(
      '📚 Hora de Matemáticas',
      randomMessage
    ).catch(error => {
      console.warn('Error mostrando notificación diaria:', error);
    });
  }

  cancelAllNotifications() {
    return new Promise((resolve) => {
      resolve('cancelled');
    });
  }

  showAchievementNotification(exerciseType, score) {
    return new Promise((resolve, reject) => {
      if (this.permission !== 'granted') {
        resolve('notifications_disabled');
        return;
      }

      let title, message;

      if (score >= 90) {
        title = '¡Excelente Trabajo! 🏆';
        message = `Obtuviste ${score}% en ${exerciseType}. ¡Sigue así!`;
      } else if (score >= 70) {
        title = '¡Buen Progreso! 👍';
        message = `Obtuviste ${score}% en ${exerciseType}. Casi lo dominas.`;
      } else {
        title = '¡Sigue Practicando! 📚';
        message = `Obtuviste ${score}% en ${exerciseType}. La práctica hace al maestro.`;
      }

      this.showNotification(title, message, {
        requireInteraction: true
      })
      .then(resolve)
      .catch(reject);
    });
  }
}

// ==============================================
// INICIALIZACIÓN MEJORADA
// ==============================================

function initPushNotifications() {
  return new Promise((resolve) => {
    // Esperar un poco para que la página cargue completamente
    setTimeout(() => {
      const notificationManager = new PushNotificationManager();
      
      // Exponer el manager globalmente
      window.MathNotifications = notificationManager;

      // Verificar si ya tenemos permisos al cargar
      if (notificationManager.permission === 'granted') {
        notificationManager.registerServiceWorker()
          .then(() => {
            notificationManager.scheduleDailyNotifications();
          })
          .catch(console.warn);
      }

      // Mostrar banner informativo (solo en escritorio o después de interacción)
      if (window.innerWidth > 768 || notificationManager.permission === 'default') {
        showNotificationBanner(notificationManager);
      }

      resolve(notificationManager);
    }, 1000);
  });
}

function showNotificationBanner(notificationManager) {
  return new Promise((resolve) => {
    if (localStorage.getItem('notificationBannerShown')) {
      resolve('banner_already_shown');
      return;
    }

    if (notificationManager.permission === 'granted') {
      resolve('permissions_already_granted');
      return;
    }

    const banner = document.createElement('div');
    banner.id = 'notification-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <span class="banner-icon">🔔</span>
        <div class="banner-text">
          <strong>¿Quieres recordatorios para practicar?</strong>
          <p>Activa las notificaciones para recibir recordatorios diarios.</p>
        </div>
        <div class="banner-actions">
          <button id="banner-enable" class="banner-btn enable">Activar</button>
          <button id="banner-dismiss" class="banner-btn dismiss">Ahora no</button>
        </div>
      </div>
    `;

    // Añadir estilos inline para mayor confiabilidad
    Object.assign(banner.style, {
      position: 'fixed',
      bottom: '90px',
      left: '20px',
      right: '20px',
      backgroundColor: 'var(--light)',
      border: '2px solid var(--primary)',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 8px 25px var(--shadow)',
      zIndex: '999',
      maxWidth: '500px',
      margin: '0 auto'
    });

    document.body.appendChild(banner);

    // Event listeners
    document.getElementById('banner-enable').addEventListener('click', () => {
      notificationManager.enableNotifications()
        .then(() => {
          localStorage.setItem('notificationBannerShown', 'true');
          banner.remove();
          resolve('enabled');
        })
        .catch((error) => {
          console.warn('Error activando notificaciones:', error);
          banner.remove();
          resolve('enable_failed');
        });
    });

    document.getElementById('banner-dismiss').addEventListener('click', () => {
      localStorage.setItem('notificationBannerShown', 'true');
      banner.remove();
      resolve('dismissed');
    });

    // Auto-ocultar después de 15 segundos
    setTimeout(() => {
      if (document.body.contains(banner)) {
        banner.remove();
      }
    }, 15000);
  });
}

// Exportar funciones para uso en otros archivos
window.MathUtils = {
  showAchievement: (exerciseType, score) => {
    if (window.MathNotifications) {
      return window.MathNotifications.showAchievementNotification(exerciseType, score);
    }
    return Promise.resolve('notifications_not_available');
  }
};
