# GridManager - Универсальный менеджер сеток

Универсальный компонент для управления CSS Grid с поддержкой элементов `wide`, которые занимают несколько ячеек.

## Возможности

- Автоматическое управление размещением элементов в сетке
- Поддержка элементов `wide` (занимают 2x2 ячейки)
- Автоматическое добавление класса `tall` соседним элементам
- Универсальная конфигурация для разных типов сеток
- Чистая архитектура без привязки к фильтрам
- Адаптивность

## Архитектура

Система состоит из двух независимых модулей:

- **GridManager** - управляет размещением элементов в сетке
- **FilterManager** - управляет фильтрами и уведомляет GridManager об изменениях

## Использование

### Базовое использование

```javascript
import { GridManager } from './modules/GridManager.js';

// Создание экземпляра с конфигурацией по умолчанию
const gridManager = new GridManager();
gridManager.init();
```

### Кастомная конфигурация

```javascript
const config = {
  gridSelector: ".my-grid",
  cardSelector: ".my-card",
  wideClass: "featured",
  tallClass: "extended",
  filterSelector: ".my-filter-button",
  activeClass: "active"
};

const gridManager = new GridManager(config);
gridManager.init();
```

### Использование с конфигурациями

```javascript
import { GridManager } from './modules/GridManager.js';
import { getGridConfig } from './modules/GridConfigs.js';

// Получение конфигурации для конкретной страницы
const config = getGridConfig('offices');
const gridManager = new GridManager(config);
gridManager.init();
```

## Конфигурация

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `gridSelector` | string | `.grid-list` | Селектор контейнера сетки |
| `cardSelector` | string | `.grid-card` | Селектор карточек |
| `wideClass` | string | `wide` | Класс для широких элементов |
| `tallClass` | string | `tall` | Класс для высоких элементов |
| `filterSelector` | string | `.filter-button` | Селектор кнопок фильтра |
| `activeClass` | string | `active` | Класс для активных элементов |

## CSS требования

### Базовая сетка

```scss
.grid-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 48px 32px;
}
```

### Стили для карточек

```scss
.grid-card {
  // Базовые стили карточки
  
  &.wide {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  &.tall {
    grid-row: span 2;
  }
}
```

## Логика размещения

Компонент использует фиксированный паттерн для стабильной работы с фильтрами:

**Паттерн:** `0-tall, 1-wide, 2,3,4-обычные, 5-wide, 6-tall, 7,8,9-обычные...`

- **Индекс 0, 10, 20...** → `tall` (высокие элементы)
- **Индекс 1, 11, 21...** → `wide` (широкие элементы 2x2)
- **Индекс 2, 3, 4, 7, 8, 9, 12, 13, 14...** → обычные элементы
- **Индекс 5, 15, 25...** → `wide` (широкие элементы 2x2)
- **Индекс 6, 16, 26...** → `tall` (высокие элементы)

Паттерн повторяется каждые 10 элементов, что обеспечивает стабильную работу независимо от фильтрации.

### Визуализация паттерна:

```
Индекс:  0    1    2    3    4    5    6    7    8    9   10   11   12   13   14
Класс:  tall wide norm norm norm wide tall norm norm norm tall wide norm norm norm
```

**Цикл из 10 элементов:**
- **0, 10, 20...** → `tall` (высота 2 строки)
- **1, 11, 21...** → `wide` (2x2 ячейки)  
- **2, 3, 4, 7, 8, 9, 12, 13, 14...** → обычные (1x1 ячейка)
- **5, 15, 25...** → `wide` (2x2 ячейки)
- **6, 16, 26...** → `tall` (высота 2 строки)

## Примеры конфигураций

### Страница офисов

```javascript
{
  gridSelector: ".offices-page__list",
  cardSelector: ".office-card",
  wideClass: "wide",
  tallClass: "tall",
  filterSelector: ".offices-page__filter-button",
  activeClass: "active"
}
```

### Галерея изображений

```javascript
{
  gridSelector: ".gallery__grid",
  cardSelector: ".gallery-item",
  wideClass: "highlighted",
  tallClass: "tall",
  filterSelector: ".gallery__filter-button",
  activeClass: "active"
}
```

## API

### Методы

- `init()` - Инициализация компонента
- `update()` - Обновление сетки
- `arrangeGrid()` - Пересчет размещения элементов
- `bindFilterEvents()` - Привязка событий фильтров

### События

Компонент автоматически обрабатывает клики по кнопкам фильтров и обновляет сетку.

## FilterManager

Простой компонент для управления кнопками фильтров (только UI):

```javascript
import { FilterManager } from './modules/FilterManager.js';

const filterManager = new FilterManager({
  filterSelector: ".filter-button",
  activeClass: "active"
});

filterManager.init();
```

**Возможности:**
- Переключение активного состояния кнопок
- Простая UI логика без привязки к бэкенду
- Легко интегрируется с любой системой фильтрации

## Интеграция с App.js

Оба компонента автоматически инициализируются в `App.js`:

```javascript
// В App.js
initGridManagers() {
  const activeConfigs = getActiveGridConfigs();
  activeConfigs.forEach(config => {
    this.components.gridManager = new GridManager(config);
    this.components.gridManager.init();
  });
}

initFilterManagers() {
  const activeConfigs = getActiveFilterConfigs();
  activeConfigs.forEach(config => {
    this.components.filterManager = new FilterManager(config);
    this.components.filterManager.init();
  });
}
```

## Преимущества разделения

- **Единственная ответственность** - каждый модуль отвечает за свою область
- **Переиспользуемость** - GridManager можно использовать без фильтров
- **Тестируемость** - легче тестировать каждый модуль отдельно
- **Гибкость** - можно легко заменить логику фильтрации