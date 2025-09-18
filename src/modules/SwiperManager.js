import Swiper from "swiper";
import { EffectFade, Navigation, Pagination } from "swiper/modules";

/**
 * Менеджер для управления Swiper слайдерами
 */
export class SwiperManager {
  constructor() {
    this.swipers = new Map();
  }

  /**
   * Инициализация конкретного слайдера
   * @param {string} selector - CSS селектор контейнера слайдера
   * @param {Object} options - Опции для Swiper
   * @returns {Swiper|null} - Экземпляр Swiper или null
   */
  initSwiper(selector, options = {}) {
    const element = document.querySelector(selector);
    if (!element) {
      return null;
    }

    // Если на элементе уже есть экземпляр, проверяем его состояние
    if (element.swiper) {
      if (element.swiper.destroyed) {
        element.swiper.destroy(true, true);
        element.swiper = null;
      } else {
        return element.swiper;
      }
    }

    const defaultOptions = {
      modules: [Navigation, EffectFade, Pagination],
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    };

    const finalOptions = { ...defaultOptions, ...options };
    const swiper = new Swiper(selector, finalOptions);

    this.swipers.set(selector, swiper);

    swiper.on("slideChange", () => {
      // Слайд изменен
    });

    return swiper;
  }

  /**
   * @param {string} selector - CSS селектор контейнера слайдера
   * @param {Object} options - Опции для Swiper
   * @returns {Swiper|null} - Экземпляр Swiper или null
   */
  initSwiperWhenReady(selector, options = {}) {
    return this.initSwiper(selector, options);
  }

  /**
   * Получение экземпляра слайдера
   * @param {string} selector - CSS селектор контейнера слайдера
   * @returns {Swiper|undefined} - Экземпляр Swiper
   */
  getSwiper(selector) {
    return this.swipers.get(selector);
  }

  /**
   * Уничтожение слайдера
   * @param {string} selector - CSS селектор контейнера слайдера
   */
  destroySwiper(selector) {
    const swiper = this.swipers.get(selector);
    if (swiper) {
      swiper.destroy(true, true);
      // Чистим ссылку на экземпляр у DOM-элемента, чтобы классы могли устанавливаться при реинициализации
      if (swiper.el && swiper.el.swiper) {
        swiper.el.swiper = null;
      }
      this.swipers.delete(selector);
    }
  }

  destroyAll() {
    this.swipers.forEach(swiper => {
      swiper.destroy(true, true);
      if (swiper.el && swiper.el.swiper) {
        swiper.el.swiper = null;
      }
    });
    this.swipers.clear();
  }
}

export const swiperManager = new SwiperManager();
