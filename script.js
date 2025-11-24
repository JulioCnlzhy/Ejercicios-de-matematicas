// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar notificaciones push
  initPushNotifications();
  
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

// ==============================================
// SISTEMA DE NOTIFICACIONES PUSH CON PROMESAS
// ==============================================

class PushNotificationManager {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.serviceWorkerRegistered = false;
    
    // Botón para activar/desactivar notificaciones
    this.createNotificationButton();
  }

  // Crear botón de notificaciones
  createNotificationButton() {
    return new Promise((resolve) => {
      // Buscar si ya existe un botón de notificaciones
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
          transition: 'all 0.3s ease'
        });

        notificationBtn.addEventListener('mouseenter', () => {
          notificationBtn.style.transform = 'scale(1.1)';
          notificationBtn.style.backgroundColor = '#e6b89c';
        });

        notificationBtn.addEventListener('mouseleave', () => {
          notificationBtn.style.transform = 'scale(1)';
          notificationBtn.style.backgroundColor = '#4a7b9d';
        });

        notificationBtn.addEventListener('click', () => {
          this.toggleNotifications();
        });

        document.body.appendChild(notificationBtn);
      }

      this.updateButtonState();
      resolve(notificationBtn);
    });
  }

  // Actualizar estado del botón
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
        btn.disabled = true;
        break;
      default:
        btn.innerHTML = '🔔';
        btn.title = 'Activar notificaciones';
        btn.style.backgroundColor = '#4a7b9d';
        btn.disabled = false;
    }
  }

  // Verificar y solicitar permisos
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

      // Solicitar permiso
      Notification.requestPermission()
        .then(permission => {
          this.permission = permission;
          this.updateButtonState();
          
          if (permission === 'granted') {
            resolve('granted');
            this.showWelcomeNotification();
          } else {
            reject(new Error('Usuario denegó los permisos'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // Activar/desactivar notificaciones
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

  // Activar notificaciones
  enableNotifications() {
    return new Promise((resolve, reject) => {
      this.checkPermission()
        .then(permission => {
          if (permission === 'granted') {
            this.registerServiceWorker()
              .then(() => {
                resolve('enabled');
                this.scheduleDailyNotifications();
              })
              .catch(reject);
          }
        })
        .catch(reject);
    });
  }

  // Desactivar notificaciones
  disableNotifications() {
    return new Promise((resolve) => {
      this.permission = 'denied';
      this.updateButtonState();
      this.cancelAllNotifications();
      resolve('disabled');
    });
  }

  // Registrar Service Worker (para notificaciones push avanzadas)
  registerServiceWorker() {
    return new Promise((resolve, reject) => {
      if (!'serviceWorker' in navigator) {
        resolve('serviceWorker_not_supported');
        return;
      }

      if (this.serviceWorkerRegistered) {
        resolve('already_registered');
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
          resolve('registration_failed_but_continuing');
        });
    });
  }

  // Mostrar notificación simple
  showNotification(title, message, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || this.permission !== 'granted') {
        reject(new Error('Notificaciones no disponibles'));
        return;
      }

      const notificationOptions = {
        body: message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'math-notification',
        requireInteraction: false,
        ...options
      };

      // Intentar usar Service Worker primero
      if (this.serviceWorkerRegistered && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready
          .then(registration => {
            registration.showNotification(title, notificationOptions);
            resolve('shown_via_serviceworker');
          })
          .catch(() => {
            // Fallback a Notification API
            this.showNativeNotification(title, message, notificationOptions)
              .then(resolve)
              .catch(reject);
          });
      } else {
        // Usar Notification API directamente
        this.showNativeNotification(title, message, notificationOptions)
          .then(resolve)
          .catch(reject);
      }
    });
  }

  // Mostrar notificación nativa
  showNativeNotification(title, message, options) {
    return new Promise((resolve, reject) => {
      try {
        const notification = new Notification(title, options);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        notification.onshow = () => {
          resolve('shown_natively');
        };

        notification.onerror = (error) => {
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

  // Notificación de bienvenida
  showWelcomeNotification() {
    return this.showNotification(
      '¡Bienvenido a Matemáticas! 🎉',
      'Ahora recibirás recordatorios para practicar ejercicios matemáticos',
      {
        icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
        requireInteraction: true
      }
    );
  }

  // Programar notificaciones diarias
  scheduleDailyNotifications() {
    return new Promise((resolve) => {
      // Verificar si ya es una hora adecuada para la primera notificación
      const now = new Date();
      const firstNotificationTime = new Date();
      
      // Programar para la misma hora o la siguiente si ya pasó
      firstNotificationTime.setHours(18, 0, 0, 0); // 6:00 PM
      if (now > firstNotificationTime) {
        firstNotificationTime.setDate(firstNotificationTime.getDate() + 1);
      }

      const timeUntilFirstNotification = firstNotificationTime.getTime() - now.getTime();

      setTimeout(() => {
        this.showDailyNotification();
        // Programar notificación diaria cada 24 horas
        setInterval(() => {
          this.showDailyNotification();
        }, 24 * 60 * 60 * 1000);
      }, timeUntilFirstNotification);

      resolve('scheduled');
    });
  }

  // Mostrar notificación diaria
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
      randomMessage,
      {
        icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
        actions: [
          { action: 'practice', title: 'Practicar Ahora' }
        ]
      }
    ).then(() => {
      console.log('Notificación diaria mostrada');
    }).catch(error => {
      console.warn('Error mostrando notificación diaria:', error);
    });
  }

  // Cancelar todas las notificaciones programadas
  cancelAllNotifications() {
    return new Promise((resolve) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then(registration => {
            registration.getNotifications()
              .then(notifications => {
                notifications.forEach(notification => {
                  notification.close();
                });
              });
          });
      }
      resolve('cancelled');
    });
  }

  // Notificación de logro por completar ejercicios
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
        icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
        requireInteraction: true
      })
      .then(resolve)
      .catch(reject);
    });
  }
}

// ==============================================
// INICIALIZACIÓN DEL SISTEMA
// ==============================================

function initPushNotifications() {
  return new Promise((resolve) => {
    const notificationManager = new PushNotificationManager();
    
    // Exponer el manager globalmente para uso en otros archivos
    window.MathNotifications = notificationManager;

    // Verificar si ya tenemos permisos al cargar
    if (notificationManager.permission === 'granted') {
      notificationManager.registerServiceWorker()
        .then(() => {
          notificationManager.scheduleDailyNotifications();
        })
        .catch(console.warn);
    }

    // Mostrar banner informativo sobre notificaciones (solo una vez)
    showNotificationBanner(notificationManager);

    resolve(notificationManager);
  });
}

// Banner informativo sobre notificaciones
function showNotificationBanner(notificationManager) {
  return new Promise((resolve) => {
    // Verificar si ya mostramos el banner
    if (localStorage.getItem('notificationBannerShown')) {
      resolve('banner_already_shown');
      return;
    }

    // Solo mostrar si no hay permisos concedidos
    if (notificationManager.permission === 'granted') {
      resolve('permissions_already_granted');
      return;
    }

    // Crear banner
    const banner = document.createElement('div');
    banner.id = 'notification-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <span class="banner-icon">🔔</span>
        <div class="banner-text">
          <strong>¿Quieres recordatorios para practicar?</strong>
          <p>Activa las notificaciones para recibir recordatorios diarios de ejercicios matemáticos.</p>
        </div>
        <div class="banner-actions">
          <button id="banner-enable" class="banner-btn enable">Activar</button>
          <button id="banner-dismiss" class="banner-btn dismiss">Ahora no</button>
        </div>
      </div>
    `;

    // Estilos del banner
    Object.assign(banner.style, {
      position: 'fixed',
      bottom: '80px',
      left: '20px',
      right: '20px',
      backgroundColor: 'var(--light)',
      border: '2px solid var(--primary)',
      borderRadius: 'var(--border-radius)',
      padding: 'var(--spacing-md)',
      boxShadow: '0 8px 25px var(--shadow)',
      zIndex: '999',
      maxWidth: '500px',
      margin: '0 auto'
    });

    // Añadir estilos CSS para el banner
    const style = document.createElement('style');
    style.textContent = `
      .banner-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }
      .banner-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      .banner-text {
        flex-grow: 1;
      }
      .banner-text strong {
        display: block;
        margin-bottom: 0.25rem;
        color: var(--primary);
      }
      .banner-text p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text);
        opacity: 0.8;
      }
      .banner-actions {
        display: flex;
        gap: var(--spacing-sm);
        flex-shrink: 0;
      }
      .banner-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      .banner-btn.enable {
        background-color: var(--primary);
        color: white;
      }
      .banner-btn.enable:hover {
        background-color: var(--accent);
        transform: translateY(-2px);
      }
      .banner-btn.dismiss {
        background-color: transparent;
        color: var(--text);
        border: 1px solid var(--secondary);
      }
      .banner-btn.dismiss:hover {
        background-color: var(--secondary);
      }

      @media (max-width: 768px) {
        .banner-content {
          flex-direction: column;
          text-align: center;
          gap: var(--spacing-sm);
        }
        .banner-actions {
          width: 100%;
          justify-content: center;
        }
        .banner-btn {
          flex: 1;
          max-width: 120px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Event listeners para los botones del banner
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

    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
      if (document.body.contains(banner)) {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(20px)';
        banner.style.transition = 'all 0.5s ease';
        setTimeout(() => {
          if (document.body.contains(banner)) {
            banner.remove();
          }
        }, 500);
      }
    }, 10000);
  });
}

// Exportar funciones para uso en otros archivos
window.MathUtils = {
  showAchievement: (exerciseType, score) => {
    if (window.MathNotifications) {
      return window.MathNotifications.showAchievementNotification(exerciseType, score);
    }
    return Promise.resolve('notifications_not_available');
  },
  
  requestNotificationPermission: () => {
    if (window.MathNotifications) {
      return window.MathNotifications.enableNotifications();
    }
    return Promise.reject(new Error('Notification system not initialized'));
  }
};
