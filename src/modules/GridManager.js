/**
 * Универсальный модуль для управления сетками с wide элементами
 * Применяет фиксированный паттерн: 0-tall, 1-wide, 2,3,4-обычные, 5-wide, 6-tall, 7,8,9-обычные...
 * Паттерн повторяется каждые 10 элементов для стабильной работы с фильтрами
 */
export class GridManager {
  constructor(config = {}) {
    this.config = {
      gridSelector: ".grid-list",
      cardSelector: ".grid-card",
      wideClass: "wide",
      tallClass: "tall",
      ...config,
    };
    this.gridContainer = null;
    this.cards = [];
  }

  /**
   * Инициализирует управление сеткой
   */
  init() {
    this.gridContainer = document.querySelector(this.config.gridSelector);
    if (!this.gridContainer) return;

    this.cards = Array.from(this.gridContainer.querySelectorAll(this.config.cardSelector));
    this.arrangeGrid();
  }

  /**
   * Управляет размещением элементов в сетке
   */
  arrangeGrid() {
    // Получаем только видимые карточки
    const visibleCards = this.cards.filter(card => card.style.display !== "none" && !card.hidden);

    // Сбрасываем все классы
    this.cards.forEach(card => {
      card.classList.remove(this.config.wideClass);
      card.classList.remove(this.config.tallClass);
    });

    // Применяем паттерн только к видимым элементам
    visibleCards.forEach((card, index) => {
      const patternIndex = index % 10; // Цикл из 10 элементов: 0-tall, 1-wide, 2,3,4-обычные, 5-wide, 6-tall, 7,8,9-обычные

      if (patternIndex === 0) {
        card.classList.add(this.config.tallClass);
      } else if (patternIndex === 1) {
        card.classList.add(this.config.wideClass);
      } else if (patternIndex === 5) {
        card.classList.add(this.config.wideClass);
      } else if (patternIndex === 6) {
        card.classList.add(this.config.tallClass);
      }
    });
  }

  /**
   * Обновляет сетку (например, после изменения фильтров)
   */
  update() {
    this.init();
  }

  /**
   * Возвращает информацию о паттерне размещения
   * @returns {Object} информация о паттерне
   */
  getPatternInfo() {
    return {
      cycle: 10, // Паттерн повторяется каждые 10 элементов
      widePositions: [1, 5], // Позиции wide элементов в цикле
      tallPositions: [0, 6], // Позиции tall элементов в цикле
      normalPositions: [2, 3, 4, 7, 8, 9], // Позиции обычных элементов в цикле
    };
  }
}
