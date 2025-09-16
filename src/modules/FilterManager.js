import { DataManager } from "./DataManager.js";

/**
 * Расширенный компонент для управления кнопками фильтров
 * Включает UI логику, работу с данными и подсчет элементов
 */
export class FilterManager {
  constructor(config = {}) {
    this.config = {
      filterSelector: ".filter-button",
      activeClass: "active",
      cardSelector: ".card",
      typeAttribute: "data-type",
      filterTypes: {},
      ...config,
    };
    this.filterButtons = [];
    this.dataManager = new DataManager();
    this.onFilterChange = null;
  }

  /**
   * Инициализирует управление кнопками фильтров
   */
  init() {
    this.filterButtons = Array.from(document.querySelectorAll(this.config.filterSelector));
    if (this.filterButtons.length === 0) return;

    // Инициализируем менеджер данных
    this.dataManager.init(
      this.config.cardSelector,
      this.config.typeAttribute,
      this.config.defaultType || "default"
    );

    this.bindEvents();
    this.updateButtonCounts();
  }

  /**
   * Привязывает события к кнопкам фильтров
   */
  bindEvents() {
    this.filterButtons.forEach(button => {
      button.addEventListener("click", e => {
        e.preventDefault();
        this.handleFilterClick(button);
      });
    });
  }

  /**
   * Обрабатывает клик по кнопке фильтра
   * @param {HTMLElement} clickedButton - нажатая кнопка
   */
  handleFilterClick(clickedButton) {
    this.filterButtons.forEach(btn => {
      btn.classList.remove(this.config.activeClass);
    });

    clickedButton.classList.add(this.config.activeClass);

    // Определяем тип фильтра по тексту кнопки
    const buttonText = clickedButton.textContent.toLowerCase();
    let filterType = "all";

    // Сначала ищем в конфигурации
    if (this.config.filterTypes && Object.keys(this.config.filterTypes).length > 0) {
      Object.keys(this.config.filterTypes).forEach(key => {
        if (buttonText.includes(key.toLowerCase())) {
          filterType = this.config.filterTypes[key];
        }
      });
    } else {
      // Если конфигурация пустая, пытаемся определить тип динамически
      const availableTypes = this.dataManager.getAvailableTypes();
      availableTypes.forEach(type => {
        if (type !== "all" && buttonText.includes(type.toLowerCase())) {
          filterType = type;
        }
      });
    }

    // Применяем фильтр
    this.dataManager.filterByType(filterType);

    // Вызываем callback если он установлен
    if (this.onFilterChange) {
      this.onFilterChange(filterType, this.dataManager.getFilteredData());
    }
  }

  /**
   * Обновляет список кнопок фильтров (например, после динамической загрузки контента)
   */
  update() {
    this.filterButtons = Array.from(document.querySelectorAll(this.config.filterSelector));
    this.dataManager.refresh(
      this.config.cardSelector,
      this.config.typeAttribute,
      this.config.defaultType || "default"
    );
    this.bindEvents();
    this.updateButtonCounts();
  }

  /**
   * Обновляет счетчики в кнопках фильтров
   */
  updateButtonCounts() {
    const typeMapping = this.config.typeMapping || null;
    this.dataManager.updateCounts(this.config.filterSelector, typeMapping);
  }

  /**
   * Устанавливает callback для изменения фильтра
   * @param {Function} callback - функция обратного вызова
   */
  setFilterChangeCallback(callback) {
    this.onFilterChange = callback;
  }

  /**
   * Получает менеджер данных
   * @returns {DataManager} менеджер данных
   */
  getDataManager() {
    return this.dataManager;
  }

  /**
   * Применяет фильтр программно
   * @param {string} filterType - тип фильтра
   */
  applyFilter(filterType) {
    if (!this.dataManager.hasType(filterType)) {
      return;
    }

    const button = this.filterButtons.find(btn => {
      const buttonText = btn.textContent.toLowerCase();

      if (this.config.filterTypes && Object.keys(this.config.filterTypes).length > 0) {
        return Object.keys(this.config.filterTypes).some(
          key => buttonText.includes(key.toLowerCase()) && this.config.filterTypes[key] === filterType
        );
      } else {
        return buttonText.includes(filterType.toLowerCase());
      }
    });

    if (button) {
      this.handleFilterClick(button);
    }
  }

  /**
   * Уничтожает обработчики событий
   */
  destroy() {
    this.filterButtons.forEach(button => {
      button.removeEventListener("click", this.handleFilterClick);
    });
    this.filterButtons = [];
  }
}
