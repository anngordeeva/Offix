/**
 * Универсальный модуль для аккордеона
 */
export class Accordion {
  constructor(container, options = {}) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;

    this.options = {
      // Селекторы элементов
      itemSelector: ".accordion__item",
      triggerSelector: ".accordion__trigger",
      contentSelector: ".accordion__content",
      activeClass: "active",

      // Поведение
      allowMultiple: false,
      closeOthers: true,

      // Анимация
      animationDuration: 300,

      // Callbacks
      onOpen: null,
      onClose: null,
      onToggle: null,

      ...options,
    };

    this.items = [];
    this.init();
  }

  /**
   * Инициализирует аккордеон
   */
  init() {
    if (!this.container) {
      return;
    }

    this.items = Array.from(this.container.querySelectorAll(this.options.itemSelector));

    if (this.items.length === 0) {
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    this.items.forEach((item, index) => {
      const trigger = item.querySelector(this.options.triggerSelector);

      if (trigger) {
        trigger.addEventListener("click", e => {
          e.preventDefault();
          this.toggleItem(index);
        });
      }
    });
  }

  /**
   * Переключает состояние элемента аккордеона
   * @param {number} index - Индекс элемента
   */
  toggleItem(index) {
    const item = this.items[index];
    if (!item) return;

    const isActive = item.classList.contains(this.options.activeClass);

    if (isActive) {
      this.closeItem(index);
    } else {
      this.openItem(index);
    }
  }

  /**
   * Открывает элемент аккордеона
   * @param {number} index - Индекс элемента
   */
  openItem(index) {
    const item = this.items[index];
    if (!item) return;

    if (this.options.closeOthers) {
      this.closeAll();
    }

    item.classList.add(this.options.activeClass);

    if (this.options.onOpen) {
      this.options.onOpen(item, index);
    }
    if (this.options.onToggle) {
      this.options.onToggle(item, index, true);
    }
  }

  /**
   * Закрывает элемент аккордеона
   * @param {number} index - Индекс элемента
   */
  closeItem(index) {
    const item = this.items[index];
    if (!item) return;

    item.classList.remove(this.options.activeClass);

    if (this.options.onClose) {
      this.options.onClose(item, index);
    }
    if (this.options.onToggle) {
      this.options.onToggle(item, index, false);
    }
  }

  closeAll() {
    this.items.forEach((item, index) => {
      if (item.classList.contains(this.options.activeClass)) {
        this.closeItem(index);
      }
    });
  }

  openAll() {
    if (!this.options.allowMultiple) {
      return;
    }

    this.items.forEach((item, index) => {
      if (!item.classList.contains(this.options.activeClass)) {
        this.openItem(index);
      }
    });
  }

  /**
   * Получает активные элементы
   * @returns {Array} Массив активных элементов
   */
  getActiveItems() {
    return this.items.filter(item => item.classList.contains(this.options.activeClass));
  }

  /**
   * Получает индекс активного элемента (для single mode)
   * @returns {number|null} Индекс активного элемента или null
   */
  getActiveIndex() {
    const activeItems = this.getActiveItems();
    return activeItems.length > 0 ? this.items.indexOf(activeItems[0]) : null;
  }

  refresh() {
    this.items = Array.from(this.container.querySelectorAll(this.options.itemSelector));
    this.bindEvents();
  }

  destroy() {
    this.items.forEach(item => {
      const trigger = item.querySelector(this.options.triggerSelector);
      if (trigger) {
        trigger.replaceWith(trigger.cloneNode(true));
      }
    });
    this.items = [];
  }
}
