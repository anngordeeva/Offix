/**
 * Конфигурации для различных типов фильтров
 */

export const FILTER_CONFIGS = {
  // Конфигурация для страницы офисов
  offices: {
    filterSelector: ".offices-page__filter-button",
    activeClass: "active",
    cardSelector: ".office-card",
    typeAttribute: "data-type",
    defaultType: "business-center", // Тип по умолчанию
    filterTypes: {
      all: "all",
      "business centers": "business-center",
      coworkings: "coworking",
    },
    // Маппинг типов на текст для обновления счетчиков
    typeMapping: {
      "business-center": "business center",
      coworking: "coworking",
    },
  },
  // Универсальная конфигурация для автоматического определения типов
  universal: {
    filterSelector: ".filter-button",
    activeClass: "active",
    cardSelector: ".card",
    typeAttribute: "data-type",
    defaultType: "default",
    filterTypes: {}, // Пустая конфигурация - типы определяются автоматически
  },
};

/**
 * Получает конфигурацию фильтров для конкретной страницы
 * @param {string} pageName - название страницы
 * @returns {Object|null} конфигурация или null
 */
export function getFilterConfig(pageName) {
  return FILTER_CONFIGS[pageName] || null;
}

/**
 * Получает все доступные конфигурации фильтров для текущей страницы
 * @returns {Array} массив конфигураций
 */
export function getActiveFilterConfigs() {
  const configs = [];

  Object.keys(FILTER_CONFIGS).forEach(key => {
    const config = FILTER_CONFIGS[key];
    if (document.querySelector(config.filterSelector)) {
      configs.push({
        ...config,
        pageName: key,
      });
    }
  });

  return configs;
}

/**
 * Создает универсальную конфигурацию на основе существующих элементов
 * @param {string} filterSelector - селектор кнопок фильтров
 * @param {string} cardSelector - селектор карточек
 * @param {string} typeAttribute - атрибут с типом
 * @param {string} defaultType - тип по умолчанию
 * @returns {Object} универсальная конфигурация
 */
export function createUniversalConfig(
  filterSelector,
  cardSelector,
  typeAttribute = "data-type",
  defaultType = "default"
) {
  return {
    filterSelector,
    activeClass: "active",
    cardSelector,
    typeAttribute,
    defaultType,
    filterTypes: {}, // Пустая конфигурация для автоматического определения
  };
}

/**
 * Автоматически определяет конфигурацию на основе DOM элементов
 * @param {string} pageName - название страницы
 * @returns {Object|null} автоматически определенная конфигурация
 */
export function getAutoDetectedConfig() {
  // Список возможных селекторов для поиска
  const possibleSelectors = [
    ".offices-page__filter-button",
    ".filter-button",
    ".btn-filter",
    "[data-filter]",
  ];

  const possibleCardSelectors = [".office-card", ".card", ".grid-card", "[data-type]"];

  for (const filterSelector of possibleSelectors) {
    if (document.querySelector(filterSelector)) {
      for (const cardSelector of possibleCardSelectors) {
        if (document.querySelector(cardSelector)) {
          return createUniversalConfig(filterSelector, cardSelector);
        }
      }
    }
  }

  return null;
}
