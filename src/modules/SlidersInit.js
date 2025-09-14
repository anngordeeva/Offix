import { swiperManager } from "./SwiperManager.js";

/**
 * Конфигурация слайдеров для разных страниц
 */
const slidersConfig = {
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
  },
  about: {
    // Здесь можно добавить конфигурацию для других страниц
  },
};

/**
 * Инициализация всех слайдеров на текущей странице
 * @param {string} pageName - Название страницы (home, about, etc.)
 */
export function initPageSliders(pageName = "home") {
  const config = slidersConfig[pageName];

  if (!config) {
    return;
  }

  // Инициализируем каждый слайдер из конфигурации
  Object.entries(config).forEach(([selector, options]) => {
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
