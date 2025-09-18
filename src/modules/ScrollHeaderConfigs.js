/**
 * Конфигурации для ScrollHeader на разных страницах
 */

// Конфигурация для страницы office
export const officeScrollConfig = {
  selector: ".office-page__header",
  scrollClass: "scroll",
  scrollThreshold: 30,
  maxWidth: 1150,
  enabled: true,
  // доп логика
  // onScroll: (isScrolled, element) => {
  // },
};

/**
 * Получает конфигурацию для конкретной страницы
 * @param {string} pageName - название страницы
 * @returns {Object|null} конфигурация или null
 */
export function getScrollHeaderConfig(pageName) {
  const configs = {
    office: officeScrollConfig,
  };

  return configs[pageName] || null;
}

/**
 * Получает все активные конфигурации
 * @returns {Array} массив активных конфигураций
 */
export function getActiveScrollHeaderConfigs() {
  const allConfigs = [officeScrollConfig];

  return allConfigs.filter(config => config.enabled);
}
