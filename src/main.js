document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация иконок Lucide
  lucide.createIcons();

  // 2. Хедер: Эффект при скролле
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
  });

  // 3. Мобильное меню
  const burger = document.getElementById('burger-menu');
  const mobileMenu = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  const toggleMenu = () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };

  burger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

  // 4. Hero Animation (Neural Canvas)
  const initHeroAnimation = () => {
      const canvas = document.getElementById('neural-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let width, height, particles;
      const particleCount = 80;
      const mouse = { x: -100, y: -100 };

      const resize = () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
      resize();

      class Particle {
          constructor() {
              this.x = Math.random() * width;
              this.y = Math.random() * height;
              this.vx = (Math.random() - 0.5) * 0.5;
              this.vy = (Math.random() - 0.5) * 0.5;
              this.radius = Math.random() * 2 + 1;
          }
          update() {
              this.x += this.vx; this.y += this.vy;
              const dx = mouse.x - this.x, dy = mouse.y - this.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 150) { this.x += dx * 0.01; this.y += dy * 0.01; }
              if (this.x < 0 || this.x > width) this.vx *= -1;
              if (this.y < 0 || this.y > height) this.vy *= -1;
          }
          draw() {
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
              ctx.fill();
          }
      }

      particles = Array.from({ length: particleCount }, () => new Particle());
      const animate = () => {
          ctx.clearRect(0, 0, width, height);
          particles.forEach((p, i) => {
              p.update(); p.draw();
              for (let j = i + 1; j < particles.length; j++) {
                  const p2 = particles[j], dx = p.x - p2.x, dy = p.y - p2.y, dist = Math.sqrt(dx*dx + dy*dy);
                  if (dist < 120) {
                      ctx.beginPath();
                      ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 * (1 - dist / 120)})`;
                      ctx.lineWidth = 0.5;
                      ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                  }
              }
          });
          requestAnimationFrame(animate);
      };
      animate();
  };
  initHeroAnimation();

  // 5. Parallax для секции Innovations
  window.addEventListener('mousemove', (e) => {
      document.querySelectorAll('.innovations__card').forEach(card => {
          const bg = card.querySelector('.morph-bg');
          if (bg) {
              const rect = card.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width/2) / 20;
              const y = (e.clientY - rect.top - rect.height/2) / 20;
              gsap.to(bg, { x, y, duration: 1, ease: "power2.out" });
          }
      });
  });

  // 6. Форма Контактов
  const initForm = () => {
      const form = document.getElementById('main-form');
      if (!form) return;
      const phoneInput = document.getElementById('phone-input');
      const captchaText = document.getElementById('captcha-question');
      const successMsg = document.getElementById('form-success');

      phoneInput.addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''));

      const n1 = Math.floor(Math.random() * 10) + 1, n2 = Math.floor(Math.random() * 10) + 1;
      const correctAnswer = n1 + n2;
      captchaText.textContent = `${n1} + ${n2} =`;

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          const userAnswer = parseInt(document.getElementById('captcha-answer').value);
          if (userAnswer !== correctAnswer) {
              alert('Ошибка капчи. Попробуйте снова.');
              return;
          }
          const submitBtn = form.querySelector('.form__submit');
          submitBtn.disabled = true;
          submitBtn.textContent = 'Отправка...';
          setTimeout(() => {
              successMsg.classList.add('active');
              gsap.from(successMsg, { scale: 0.9, opacity: 0, duration: 0.5 });
          }, 1500);
      });
  };
  initForm();

  // 7. Cookie Popup Logic
  const initCookies = () => {
      const popup = document.getElementById('cookie-popup');
      const acceptBtn = document.getElementById('cookie-accept');

      if (!localStorage.getItem('cookies-accepted')) {
          setTimeout(() => popup.classList.add('show'), 2000);
      }

      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookies-accepted', 'true');
          popup.classList.remove('show');
      });
  };
  initCookies();
});