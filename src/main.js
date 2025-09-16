//сброс стилей
import "~/shared/styles/normalize.scss";
// подключение шрифтов
import "~/shared/styles/fonts.scss";
// глобальные стили [переменные и миксины уже глобальные через подробнее в vite.config]
import "~/shared/styles/global.scss";
//глобальные компоненты
import "~/shared/styles/components/_header.scss";
import "~/shared/styles/components/_footer.scss";
import "~/shared/styles/components/_assets.scss";
import "~/shared/styles/components/_layout.scss";
import "~/shared/styles/components/_marquee.scss";
import "~/shared/styles/components/_slider-main.scss";
import "~/shared/styles/components/_hero.scss";
import "~/shared/styles/components/_office-card.scss";
//страницы
import "~/shared/styles/pages/home/index.scss";
import "~/shared/styles/pages/virtual-office/index.scss";
import "~/shared/styles/pages/offices/index.scss";
//слайдер
import "swiper/css";
import "swiper/css/navigation";

import { App } from "./core/App.js";

// Инициализируем приложение
document.addEventListener("DOMContentLoaded", () => {
  new App().init();
});
