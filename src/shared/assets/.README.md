# Статические ресурсы

## Структура папок

```
src/shared/assets/
├── icons/          # Иконки (SVG, PNG, ICO)
├── images/         # Изображения (JPG, PNG, WebP)
└── logos/          # Логотипы (SVG, PNG)
```

## Рекомендуемые форматы

### Иконки (`icons/`)
- **SVG** - лучший выбор для иконок (масштабируемые, маленький размер)
- **PNG** - для сложных иконок с градиентами
- **ICO** - для favicon

### Изображения (`images/`)
- **WebP** - лучший формат для современных браузеров
- **JPG** - для фотографий
- **PNG** - для изображений с прозрачностью

### Логотипы (`logos/`)
- **SVG** - лучший выбор (масштабируемые)
- **PNG** - с прозрачностью

## Использование в HTML

```html
<!-- Иконка -->
<img src="/src/shared/assets/icons/icon-name.svg" alt="Описание">

<!-- Изображение -->
<img src="/src/shared/assets/images/photo.jpg" alt="Описание">

<!-- Логотип -->
<img src="/src/shared/assets/logos/logo.svg" alt="Логотип">
```

## Использование в CSS

```scss
.icon {
  background-image: url('../assets/icons/icon-name.svg');
}

.hero-image {
  background-image: url('../assets/images/hero-bg.jpg');
}
```

## Оптимизация

Vite автоматически:
- Оптимизирует изображения при сборке
- Добавляет хеши к именам файлов для кэширования
- Сжимает статические ресурсы
