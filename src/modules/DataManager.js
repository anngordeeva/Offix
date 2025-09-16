/**
 * Менеджер данных для офисов и других элементов
 * Управляет данными, фильтрацией и подсчетом элементов
 */

export class DataManager {
  constructor() {
    this.data = [];
    this.filteredData = [];
    this.currentFilter = "all";
    this.availableTypes = new Set(["all"]); // Динамически определяемые типы
  }

  /**
   * Инициализирует данные из DOM элементов
   * @param {string} cardSelector - селектор карточек (передается из конфигурации)
   * @param {string} typeAttribute - атрибут с типом элемента
   * @param {string} defaultType - тип по умолчанию для элементов без атрибута
   */
  init(cardSelector = ".card", typeAttribute = "data-type", defaultType = "default") {
    const cards = document.querySelectorAll(cardSelector);
    this.data = Array.from(cards).map((card, index) => {
      const type = card.getAttribute(typeAttribute) || defaultType;
      return {
        id: index,
        element: card,
        type,
        visible: true,
      };
    });

    this.updateAvailableTypes();
    this.filteredData = [...this.data];
    this.updateCounts();
  }

  /**
   * Обновляет доступные типы на основе данных
   */
  updateAvailableTypes() {
    this.availableTypes.clear();
    this.availableTypes.add("all");

    this.data.forEach(item => {
      if (item.type) {
        this.availableTypes.add(item.type);
      }
    });
  }

  /**
   * Фильтрует данные по типу
   * @param {string} filterType - тип фильтра
   */
  filterByType(filterType) {
    if (!this.availableTypes.has(filterType)) {
      return;
    }

    this.currentFilter = filterType;

    this.data.forEach(item => {
      if (filterType === "all" || item.type === filterType) {
        item.visible = true;
        item.element.style.display = "";
      } else {
        item.visible = false;
        item.element.style.display = "none";
      }
    });

    this.filteredData = this.data.filter(item => item.visible);
    this.updateCounts();
  }

  /**
   * Получает количество элементов по типам
   * @returns {Object} объект с количеством по типам
   */
  getCounts() {
    const counts = {
      all: this.data.length,
    };

    this.availableTypes.forEach(type => {
      if (type !== "all") {
        counts[type] = 0;
      }
    });

    this.data.forEach(item => {
      if (item.type && Object.prototype.hasOwnProperty.call(counts, item.type)) {
        counts[item.type]++;
      }
    });

    return counts;
  }

  /**
   * Получает количество отфильтрованных элементов
   * @returns {number} количество видимых элементов
   */
  getFilteredCount() {
    return this.filteredData.length;
  }

  /**
   * Обновляет счетчики в кнопках фильтров
   * @param {string} buttonSelector - селектор кнопок фильтров
   * @param {Object} typeMapping - маппинг типов на текст кнопок (опционально)
   */
  updateCounts(buttonSelector = ".filter-button", typeMapping = null) {
    const counts = this.getCounts();
    const buttons = document.querySelectorAll(buttonSelector);

    buttons.forEach(button => {
      const buttonText = button.textContent.toLowerCase();
      const originalText = button.textContent;

      if (buttonText.includes("all")) {
        button.textContent = originalText.replace(/\(\d+\)/, `(${counts.all})`);
        return;
      }

      // Ищем соответствие для конкретных типов
      let matched = false;
      this.availableTypes.forEach(type => {
        if (type === "all") return;

        // Используем маппинг если предоставлен
        const searchText =
          typeMapping && typeMapping[type] ? typeMapping[type].toLowerCase() : type.toLowerCase();

        if (buttonText.includes(searchText) && counts[type] !== undefined) {
          button.textContent = originalText.replace(/\(\d+\)/, `(${counts[type]})`);
          matched = true;
        }
      });

      // Если не найдено соответствие, пытаемся угадать по тексту
      if (!matched) {
        this.availableTypes.forEach(type => {
          if (type === "all" || matched) return;

          // Простая проверка на вхождение типа в текст кнопки
          if (buttonText.includes(type.toLowerCase()) && counts[type] !== undefined) {
            button.textContent = originalText.replace(/\(\d+\)/, `(${counts[type]})`);
            matched = true;
          }
        });
      }
    });
  }

  /**
   * Получает текущий активный фильтр
   * @returns {string} текущий фильтр
   */
  getCurrentFilter() {
    return this.currentFilter;
  }

  /**
   * Получает все данные
   * @returns {Array} массив всех данных
   */
  getAllData() {
    return this.data;
  }

  /**
   * Получает отфильтрованные данные
   * @returns {Array} массив отфильтрованных данных
   */
  getFilteredData() {
    return this.filteredData;
  }

  /**
   * Получает доступные типы
   * @returns {Array} массив доступных типов
   */
  getAvailableTypes() {
    return Array.from(this.availableTypes);
  }

  /**
   * Проверяет, существует ли тип
   * @param {string} type - тип для проверки
   * @returns {boolean} существует ли тип
   */
  hasType(type) {
    return this.availableTypes.has(type);
  }

  /**
   * Обновляет данные (например, после динамической загрузки)
   * @param {string} cardSelector - селектор карточек
   * @param {string} typeAttribute - атрибут с типом элемента
   * @param {string} defaultType - тип по умолчанию
   */
  refresh(cardSelector = ".card", typeAttribute = "data-type", defaultType = "default") {
    this.init(cardSelector, typeAttribute, defaultType);
  }
}
