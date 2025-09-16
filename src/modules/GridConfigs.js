/**
 * Конфигурации для различных типов сеток
 */

export const GRID_CONFIGS = {
  // Конфигурация для страницы офисов
  offices: {
    gridSelector: ".offices-page__list",
    cardSelector: ".office-card",
    wideClass: "wide",
    tallClass: "tall",
  },
};

/**
 * Получает конфигурацию для конкретной страницы
 * @param {string} pageName - название страницы
 * @returns {Object|null} конфигурация или null
 */
export function getGridConfig(pageName) {
  return GRID_CONFIGS[pageName] || null;
}

/**
 * Получает все доступные конфигурации для текущей страницы
 * @returns {Array} массив конфигураций
 */
export function getActiveGridConfigs() {
  const configs = [];

  Object.keys(GRID_CONFIGS).forEach(key => {
    const config = GRID_CONFIGS[key];
    if (document.querySelector(config.gridSelector)) {
      configs.push(config);
    }
  });

  return configs;
}
