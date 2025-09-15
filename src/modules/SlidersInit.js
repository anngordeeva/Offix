import { swiperManager } from "./SwiperManager.js";

/**
 * Проверка размера экрана для отключения слайдеров на планшетах и мобильных
 * @returns {boolean} - true если экран больше планшета (desktop)
 */
function isDesktop() {
  return window.innerWidth > 1150;
}

/**
 * Получение конфигурации слайдеров для разных страниц
 * @param {string} pageName - Название страницы
 * @returns {Object} - Конфигурация слайдеров
 */
function getSlidersConfig(pageName) {
  const baseConfig = {
    home: {
      ".offices__swiper": {
        slidesPerView: "auto",
        centeredSlides: false,
        loop: true,
        initialSlide: 0,
        spaceBetween: 32,
        slidesOffsetBefore: 424, // 392px (ширина слайда) + 32px (отступ)
        slidesOffsetAfter: 0,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        navigation: {
          nextEl: ".swiper__button-next",
          prevEl: ".swiper__button-prev",
        },
      },
      ".news__swiper": {
        slidesPerView: "auto",
        centeredSlides: false,
        loop: true,
        initialSlide: 0,
        spaceBetween: 32,
        slidesOffsetBefore: 424, // 392px (ширина слайда) + 32px (отступ)
        slidesOffsetAfter: 0,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        navigation: {
          nextEl: ".news__swiper-next",
          prevEl: ".news__swiper-prev",
        },
      },
      ".reviews__swiper": {
        slidesPerView: 1,
        loop: false,

        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },

        allowTouchMove: true,
        speed: 500,
        navigation: {
          nextEl: ".reviews__swiper-next",
          prevEl: ".reviews__swiper-prev",
        },
      },
    },
    "virtual-office": {
      ".reviews__swiper": {
        slidesPerView: 1,
        loop: false,

        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },

        allowTouchMove: true,
        speed: 500,
        navigation: {
          nextEl: ".reviews__swiper-next",
          prevEl: ".reviews__swiper-prev",
        },
      },
      ".news__swiper": {
        slidesPerView: "auto",
        centeredSlides: false,
        loop: true,
        initialSlide: 0,
        spaceBetween: 32,
        slidesOffsetBefore: 424, // 392px (ширина слайда) + 32px (отступ)
        slidesOffsetAfter: 0,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        navigation: {
          nextEl: ".news__swiper-next",
          prevEl: ".news__swiper-prev",
        },
      },
    },
    about: {
      // TODO: add config all page
    },
  };

  return baseConfig[pageName] || {};
}

/**
 * Инициализация всех слайдеров на текущей странице
 * @param {string} pageName - Название страницы (home, about, etc.)
 */
export function initPageSliders(pageName = "home") {
  const config = getSlidersConfig(pageName);

  if (!config) {
    return;
  }

  // Инициализируем каждый слайдер из конфигурации
  Object.entries(config).forEach(([selector, options]) => {
    // Отключаем offices__swiper и news__swiper на планшетах и мобильных
    if ((selector === ".offices__swiper" || selector === ".news__swiper") && !isDesktop()) {
      return; // Пропускаем инициализацию этих слайдеров
    }

    swiperManager.initSwiperWhenReady(selector, options);
  });
}

/**
 * Получение экземпляра слайдера по селектору
 * @param {string} selector - CSS селектор слайдера
 * @returns {Swiper|undefined} - Экземпляр Swiper
 */
export function getSlider(selector) {
  return swiperManager.getSwiper(selector);
}

/**
 * Уничтожение всех слайдеров
 */
export function destroyAllSliders() {
  swiperManager.destroyAll();
}

/**
 * Обработчик изменения размера окна для переинициализации слайдеров
 */
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Уничтожаем все слайдеры
    destroyAllSliders();

    // Переинициализируем слайдеры с учетом нового размера экрана
    const currentPage = document.body.dataset.page || "home";
    initPageSliders(currentPage);
  }, 250); // Задержка для оптимизации производительности
});
