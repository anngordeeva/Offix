/**
 * Универсальный модуль для отслеживания скролла и управления состоянием header элементов
 */
export class ScrollHeader {
  constructor(config = {}) {
    // Конфигурация по умолчанию
    this.config = {
      selector: ".scroll-header", // CSS селектор элемента
      scrollClass: "scroll", // Класс, который добавляется при скролле
      scrollThreshold: 100, // Порог скролла в пикселях
      maxWidth: 1024, // Максимальная ширина экрана для активации (tablet breakpoint)
      enabled: true, // Включен ли модуль
      ...config, // Переопределение конфигурации
    };

    this.header = null;
    this.isScrolled = false;
    this.isActive = false;

    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  /**
   * Инициализирует модуль
   */
  init() {
    if (!this.config.enabled) {
      return;
    }

    this.header = document.querySelector(this.config.selector);

    if (!this.header) {
      return;
    }

    this.checkScreenSize();
    this.bindEvents();

    this.handleScroll();
  }

  /**
   * Проверяет размер экрана
   */
  checkScreenSize() {
    this.isActive = window.innerWidth <= this.config.maxWidth;
  }

  /**
   * Привязывает события
   */
  bindEvents() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });
  }

  /**
   * Обрабатывает событие скролла
   */
  handleScroll() {
    if (!this.header || !this.isActive) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeScrolled = scrollTop > this.config.scrollThreshold;

    if (shouldBeScrolled && !this.isScrolled) {
      this.addScrollClass();
    } else if (!shouldBeScrolled && this.isScrolled) {
      this.removeScrollClass();
    }
  }

  /**
   * Обрабатывает изменение размера окна
   */
  handleResize() {
    this.checkScreenSize();

    if (!this.isActive && this.isScrolled) {
      this.removeScrollClass();
    }
  }

  /**
   * Добавляет класс scroll
   */
  addScrollClass() {
    this.header.classList.add(this.config.scrollClass);
    this.isScrolled = true;

    if (this.config.onScroll) {
      this.config.onScroll(true, this.header);
    }
  }

  /**
   * Убирает класс scroll
   */
  removeScrollClass() {
    this.header.classList.remove(this.config.scrollClass);
    this.isScrolled = false;

    if (this.config.onScroll) {
      this.config.onScroll(false, this.header);
    }
  }

  /**
   * Обновляет конфигурацию
   * @param {Object} newConfig - новая конфигурация
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.selector || newConfig.maxWidth) {
      this.destroy();
      this.init();
    }
  }

  /**
   * Уничтожает модуль и очищает события
   */
  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);

    if (this.header && this.isScrolled) {
      this.removeScrollClass();
    }
  }

  /**
   * Получает текущее состояние
   */
  getState() {
    return {
      isScrolled: this.isScrolled,
      isActive: this.isActive,
      header: this.header,
    };
  }
}
