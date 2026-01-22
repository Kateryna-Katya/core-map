/**
 * Core-Map.blog - Main Script 2026
 * Содержит: Neural Canvas, Form Logic, Mobile Menu, Cookies, Parallax
 */

document.addEventListener('DOMContentLoaded', () => {

  // === 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE) ===
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // === 2. ХЕДЕР: ЭФФЕКТ ПРИ СКРОЛЛЕ ===
  const header = document.querySelector('.header');
  if (header) {
      const handleScroll = () => {
          header.classList.toggle('header--scrolled', window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Проверка при загрузке
  }

  // === 3. МОБИЛЬНОЕ МЕНЮ ===
  const burger = document.getElementById('burger-menu');
  const mobileMenu = document.getElementById('mobile-menu-overlay');

  if (burger && mobileMenu) {
      const toggleMenu = () => {
          burger.classList.toggle('active');
          mobileMenu.classList.toggle('active');
          document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      };

      burger.addEventListener('click', toggleMenu);

      // Закрытие при клике на любую ссылку в меню
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
              if (mobileMenu.classList.contains('active')) toggleMenu();
          });
      });
  }

  // === 4. ЛОГИКА ФОРМЫ (КОНТАКТЫ) ===
  const initForm = () => {
      const form = document.getElementById('main-form');
      if (!form) return; // Выходим, если формы нет на текущей странице

      const phoneInput = document.getElementById('phone-input');
      const captchaText = document.getElementById('captcha-question');
      const captchaInput = document.getElementById('captcha-answer');
      const successMsg = document.getElementById('form-success');
      const submitBtn = form.querySelector('.form__submit');

      // Валидация телефона (только цифры)
      if (phoneInput) {
          phoneInput.addEventListener('input', (e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
          });
      }

      // Генерация капчи
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;
      const correctAnswer = n1 + n2;

      if (captchaText) {
          captchaText.textContent = `${n1} + ${n2} =`;
      }

      // Обработка отправки
      form.addEventListener('submit', (e) => {
          e.preventDefault();

          // Проверка капчи
          if (captchaInput) {
              const userAnswer = parseInt(captchaInput.value);
              if (userAnswer !== correctAnswer) {
                  alert('Ошибка: Неверный ответ капчи. Попробуйте снова.');
                  captchaInput.value = '';
                  captchaInput.focus();
                  return;
              }
          }

          // Визуализация отправки
          if (submitBtn) {
              submitBtn.disabled = true;
              const originalText = submitBtn.innerHTML;
              submitBtn.innerHTML = '<span>Отправка...</span>';
          }

          // Имитация AJAX запроса
          setTimeout(() => {
              if (successMsg) {
                  successMsg.classList.add('active');
                  // Анимация успеха через GSAP (если подключен)
                  if (typeof gsap !== 'undefined') {
                      gsap.from(successMsg, {
                          scale: 0.8,
                          opacity: 0,
                          duration: 0.6,
                          ease: "back.out(1.7)"
                      });
                  }
              }
              form.reset();
          }, 1500);
      });
  };

  initForm();

  // === 5. HERO CANVAS (NEURAL NETWORK ANIMATION) ===
  const initHeroCanvas = () => {
      const canvas = document.getElementById('neural-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let width, height, particles;
      const particleCount = 75;
      const mouse = { x: -1000, y: -1000 };

      const resize = () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', e => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
      });

      resize();

      class Particle {
          constructor() {
              this.x = Math.random() * width;
              this.y = Math.random() * height;
              this.vx = (Math.random() - 0.5) * 0.4;
              this.vy = (Math.random() - 0.5) * 0.4;
              this.radius = Math.random() * 1.5 + 1;
          }
          update() {
              this.x += this.vx;
              this.y += this.vy;

              const dx = mouse.x - this.x;
              const dy = mouse.y - this.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 150) {
                  this.x += dx * 0.01;
                  this.y += dy * 0.01;
              }

              if (this.x < 0 || this.x > width) this.vx *= -1;
              if (this.y < 0 || this.y > height) this.vy *= -1;
          }
          draw() {
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
              ctx.fill();
          }
      }

      particles = Array.from({ length: particleCount }, () => new Particle());

      const animate = () => {
          ctx.clearRect(0, 0, width, height);
          particles.forEach((p, i) => {
              p.update();
              p.draw();
              for (let j = i + 1; j < particles.length; j++) {
                  const p2 = particles[j];
                  const dx = p.x - p2.x;
                  const dy = p.y - p2.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < 120) {
                      ctx.beginPath();
                      ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 120)})`;
                      ctx.lineWidth = 0.6;
                      ctx.moveTo(p.x, p.y);
                      ctx.lineTo(p2.x, p2.y);
                      ctx.stroke();
                  }
              }
          });
          requestAnimationFrame(animate);
      };
      animate();
  };

  initHeroCanvas();

  // === 6. PARALLAX ДЛЯ КАРТОЧЕК (GSAP) ===
  if (typeof gsap !== 'undefined') {
      window.addEventListener('mousemove', (e) => {
          const cards = document.querySelectorAll('.innovations__card, .blog-card');
          cards.forEach(card => {
              const bg = card.querySelector('.morph-bg, .morph-frame');
              if (bg) {
                  const rect = card.getBoundingClientRect();
                  const x = (e.clientX - rect.left - rect.width / 2) / 25;
                  const y = (e.clientY - rect.top - rect.height / 2) / 25;
                  gsap.to(bg, { x, y, duration: 1.2, ease: "power2.out" });
              }
          });
      });
  }

  // === 7. COOKIE POPUP ===
  const initCookies = () => {
      const popup = document.getElementById('cookie-popup');
      const acceptBtn = document.getElementById('cookie-accept');

      if (popup && acceptBtn) {
          if (!localStorage.getItem('core_map_cookies')) {
              setTimeout(() => popup.classList.add('show'), 2500);
          }

          acceptBtn.addEventListener('click', () => {
              localStorage.setItem('core_map_cookies', 'true');
              popup.classList.remove('show');
          });
      }
  };

  initCookies();
});