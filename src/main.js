document.addEventListener('DOMContentLoaded', () => {
  // Инициализация иконок Lucide
  lucide.createIcons();

  // Эффект при скролле для хедера
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.classList.add('header--scrolled');
      } else {
          header.classList.remove('header--scrolled');
      }
  });

  // Мобильное меню (заготовка под логику)
  const burger = document.getElementById('burger-menu');
  burger.addEventListener('click', () => {
      // Здесь будет логика открытия меню в следующем этапе
      console.log('Mobile menu toggled');
  });
});