import { Header } from "../components/Header.js";
import { FaqAccordion } from "../modules/FaqAccordion.js";
import { FeedbackModal } from "../modules/FeedbackModal.js";
import { getActiveFilterConfigs, getAutoDetectedConfig } from "../modules/FilterConfigs.js";
import { FilterManager } from "../modules/FilterManager.js";
import { Gallery } from "../modules/Gallery.js";
import { getActiveGridConfigs } from "../modules/GridConfigs.js";
import { GridManager } from "../modules/GridManager.js";
import { OfficeScrollSpy } from "../modules/OfficeScrollSpy.js";
import { ScrollHeader } from "../modules/ScrollHeader.js";
import { getScrollHeaderConfig } from "../modules/ScrollHeaderConfigs.js";
import { SmoothScroll } from "../modules/SmoothScroll.js";

/**
 * Основной класс приложения
 */
export class App {
  constructor() {
    this.currentPage = "home";
    this.components = {
      header: null,
      faqAccordion: null,
      gridManager: null,
      filterManager: null,
      scrollHeader: null,
      officeScrollSpy: null,
    };
    this.smoothScroll = new SmoothScroll();
    this.feedbackModal = new FeedbackModal({
      endpoint: "/add.php",
      app: this, // Передаем ссылку на App для навигации
    });

    // Список доступных страниц
    this.availablePages = [
      "home",
      "virtual-office",
      "offices",
      "office",
      "about-us",
      "blog",
      "blog-post",
      "contacts",
      "404",
    ];
  }

  /**
   * Инициализирует приложение
   */
  init() {
    this.bindEvents();
    this.initComponents();

    // Определяем страницу из URL при инициализации
    const initialPage = this.getPageFromUrl();

    // Если это прямой переход по URL (не через SPA), загружаем страницу без обновления истории
    // Но сначала устанавливаем правильное состояние истории
    if (window.location.pathname !== "/" && !window.history.state) {
      // Устанавливаем начальное состояние истории для корректной работы кнопки "Назад"
      window.history.replaceState({ page: initialPage }, "", window.location.pathname);
      this.loadPageWithoutHistory(initialPage);
    } else {
      this.loadPage(initialPage);
    }

    // Обработчик для кнопки "Назад" браузера
    window.addEventListener("popstate", event => {
      const page = event.state?.page || this.getPageFromUrl();
      if (page !== this.currentPage) {
        this.loadPageWithoutHistory(page);
      }
    });
  }

  /**
   * Возвращает страницу для активного пункта меню:
   * office -> offices, blog-post -> blog, 404 -> home, иначе — исходное имя
   */
  getMenuPageName(pageName) {
    if (pageName === "office") return "offices";
    if (pageName === "blog-post") return "blog";
    if (pageName === "404") return "home";
    return pageName;
  }

  /**
   * Загружает страницу
   */
  async loadPage(pageName) {
    // Если запрашивается 404 страница, показываем её
    if (pageName === "404") {
      this.showErrorPage();
      return;
    }

    // Проверяем, существует ли страница
    if (!this.availablePages.includes(pageName)) {
      this.showErrorPage();
      return;
    }

    try {
      // Загружаем HTML страницы
      const response = await fetch(`/src/pages/${pageName}.html`);

      // Проверяем статус ответа
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Вставляем контент в контейнер страницы
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.innerHTML = html;
      }

      this.currentPage = pageName;

      // Обновляем URL без перезагрузки страницы (сохраняем якорь если есть)
      const hash = window.location.hash;
      const url = pageName === "home" ? "/" : `/${pageName}`;
      const fullUrl = hash ? `${url}${hash}` : url;
      window.history.pushState({ page: pageName }, "", fullUrl);

      this.initComponents(); // Инициализируем компоненты после загрузки страницы

      // Уведомляем header о смене страницы (с учетом родительского меню)
      if (this.components.header) {
        const menuPageName = this.getMenuPageName(pageName);
        this.components.header.onPageChange(menuPageName);
      }

      // Инициализация галерей на странице (универсально) - ДО слайдеров
      if (document.querySelector(".gallery")) {
        const gallery = new Gallery();
        gallery.init();
      }

      this.initSliders();

      this.scrollToTop();

      // Страница загружена
    } catch {
      // Если это не главная страница, пытаемся загрузить home как fallback
      if (pageName !== "home") {
        try {
          await this.loadPage("home");
          return;
        } catch {
          // console.error("Ошибка загрузки fallback страницы");
        }
      }

      // Если и fallback не сработал, показываем страницу ошибки
      this.showErrorPage();
    }
  }

  /**
   * Инициализирует компоненты
   */
  initComponents() {
    // Инициализируем Header компонент только один раз
    if (document.querySelector(".header") && !this.components.header) {
      this.components.header = new Header();
      this.components.header.init();
    }

    // Инициализируем FAQ аккордеон для текущей страницы
    if (document.querySelector(".faq")) {
      this.components.faqAccordion = new FaqAccordion(".faq");
    }

    // Инициализируем управление сетками и фильтрами
    this.initGridManagers();
    this.initFilterManagers();

    // Инициализируем скролл для header элементов
    this.initScrollHeader();

    // Инициализируем scrollspy для страницы офиса
    this.initOfficeScrollSpy();
  }

  /**
   * Инициализирует управление сетками
   */
  initGridManagers() {
    const activeConfigs = getActiveGridConfigs();

    activeConfigs.forEach(config => {
      this.components.gridManager = new GridManager(config);
      this.components.gridManager.init();
    });
  }

  /**
   * Инициализирует управление кнопками фильтров
   */
  initFilterManagers() {
    let activeConfigs = getActiveFilterConfigs();

    // Если нет активных конфигураций, пытаемся определить автоматически
    if (activeConfigs.length === 0) {
      const autoConfig = getAutoDetectedConfig(this.currentPage);
      if (autoConfig) {
        activeConfigs = [autoConfig];
      }
    }

    activeConfigs.forEach(config => {
      this.components.filterManager = new FilterManager(config);
      this.components.filterManager.init();

      this.components.filterManager.setFilterChangeCallback((filterType, filteredData) => {
        this.handleFilterChange(filterType, filteredData);
      });
    });
  }

  /**
   * Инициализирует скролл для header элементов
   */
  initScrollHeader() {
    // Уничтожаем предыдущий экземпляр если есть
    if (this.components.scrollHeader) {
      this.components.scrollHeader.destroy();
    }

    // Получаем конфигурацию для текущей страницы
    const config = getScrollHeaderConfig(this.currentPage);

    if (config && config.enabled) {
      this.components.scrollHeader = new ScrollHeader(config);
      this.components.scrollHeader.init();
    }
  }

  /**
   * Инициализирует scrollspy для страницы офиса
   */
  initOfficeScrollSpy() {
    // Уничтожаем предыдущий экземпляр если есть
    if (this.components.officeScrollSpy) {
      this.components.officeScrollSpy.destroy();
      this.components.officeScrollSpy = null;
    }

    if (this.currentPage !== "office") return;

    const rootExists = document.querySelector(".office-page__root");
    const navExists = document.querySelector(".office-page__nav-list");
    const sectionsExist =
      document.querySelectorAll(".office-page__content-left .office-page__section").length > 0;

    if (rootExists && navExists && sectionsExist) {
      this.components.officeScrollSpy = new OfficeScrollSpy({
        rootSelector: ".office-page__root",
        navListSelector: ".office-page__nav-list",
        sectionsSelector: ".office-page__content-left .office-page__section",
        topOffsetPx: 120,
      });
      this.components.officeScrollSpy.init();
    }
  }

  /**
   * Обрабатывает изменение фильтра
   * @param {string} filterType - тип фильтра
   * @param {Array} filteredData - отфильтрованные данные
   */
  handleFilterChange() {
    // Обновляем сетку если есть GridManager
    if (this.components.gridManager) {
      this.components.gridManager.update();
    }

    // Здесь можно добавить дополнительную логику для обработки фильтрации
    // console.log(`Фильтр изменен на: ${filterType}, найдено элементов: ${filteredData.length}`);
  }

  /**
   * Инициализирует слайдеры для текущей страницы
   */
  initSliders() {
    // Динамически импортируем и инициализируем слайдеры
    import("../modules/SlidersInit.js").then(({ initPageSliders }) => {
      initPageSliders(this.currentPage);
    });
  }

  /**
   * Скроллит страницу на самый верх
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  /**
   * Привязывает события
   */
  bindEvents() {
    // Обработчик для навигации
    document.addEventListener("click", e => {
      let target = e.target;
      while (target && target !== document.body) {
        if (target.matches("[data-page]")) {
          e.preventDefault();
          const page = target.getAttribute("data-page");
          this.loadPage(page);
          return;
        }
        target = target.parentElement;
      }
    });

    // Делегирование для перехода на страницы с карточек (временное решение, пока нет API)
    document.addEventListener("click", e => {
      let target = e.target;
      while (target && target !== document.body) {
        if (target.classList && target.classList.contains("blog-card__link")) {
          e.preventDefault();
          this.loadPage("blog-post");
          return;
        }
        if (target.classList && target.classList.contains("office-card__link")) {
          e.preventDefault();
          this.loadPage("office");
          return;
        }
        target = target.parentElement;
      }
    });

    // Делегирование: кнопка с data-атрибутом открывает форму обратной связи
    document.addEventListener("click", e => {
      let target = e.target;
      while (target && target !== document.body) {
        if (target.matches("[data-feedback-modal]")) {
          e.preventDefault();
          this.feedbackModal.open();
          return;
        }
        target = target.parentElement;
      }
    });

    // Обработчик для кнопки прокрутки вниз
    document.addEventListener("click", e => {
      if (e.target.matches(".hero__arrow")) {
        e.preventDefault();
        this.smoothScroll.scrollToSection("about-section");
      }
    });

    // Обновляем высоту header при изменении размера окна
    window.addEventListener("resize", () => {
      this.smoothScroll.updateHeaderHeight();
    });
  }

  /**
   * Загружает страницу без обновления истории браузера
   */
  async loadPageWithoutHistory(pageName) {
    // Если запрашивается 404 страница, показываем её
    if (pageName === "404") {
      this.showErrorPage();
      return;
    }

    // Проверяем, существует ли страница
    if (!this.availablePages.includes(pageName)) {
      this.showErrorPage();
      return;
    }

    try {
      // Загружаем HTML страницы
      const response = await fetch(`/src/pages/${pageName}.html`);

      // Проверяем статус ответа
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Вставляем контент в контейнер страницы
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.innerHTML = html;
      }

      this.currentPage = pageName;
      this.initComponents(); // Инициализируем компоненты после загрузки страницы

      // Уведомляем header о смене страницы (с учетом родительского меню)
      if (this.components.header) {
        const menuPageName = this.getMenuPageName(pageName);
        this.components.header.onPageChange(menuPageName);
      }

      // Инициализация галерей на странице (универсально) - ДО слайдеров
      if (document.querySelector(".gallery")) {
        const gallery = new Gallery();
        gallery.init();
      }

      // Инициализируем слайдеры после загрузки страницы
      this.initSliders();

      // Скроллим наверх страницы
      this.scrollToTop();
    } catch (_error) {
      // Логируем ошибку (можно убрать в production)
      // console.error("Ошибка загрузки страницы (без истории):", _error);
      this.showErrorPage();
    }
  }

  /**
   * Получает название страницы из URL
   */
  getPageFromUrl() {
    const path = window.location.pathname;

    // Убираем начальный и конечный слеш
    const cleanPath = path.replace(/^\/+|\/+$/g, "");

    // Если путь пустой или только слеш, возвращаем home
    if (!cleanPath || cleanPath === "") {
      return "home";
    }

    // Получаем последнюю часть пути
    const page = cleanPath.split("/").pop();

    // Убираем .html если есть
    const pageName = page.replace(/\.html$/, "");

    // Проверяем, существует ли такая страница в списке доступных
    if (this.availablePages.includes(pageName)) {
      return pageName;
    }

    // Если страница не найдена, возвращаем 404
    return "404";
  }

  /**
   * Показывает страницу ошибки 404
   */
  async showErrorPage() {
    try {
      // Загружаем HTML страницы 404
      const response = await fetch(`/src/pages/404.html`);
      const html = await response.text();

      // Вставляем контент в контейнер страницы
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.innerHTML = html;
      }

      this.currentPage = "404";

      // Обновляем URL без перезагрузки страницы
      window.history.pushState({ page: "404" }, "", "/404");

      // Уведомляем header о смене страницы
      if (this.components.header) {
        this.components.header.onPageChange("404");
      }

      this.scrollToTop();
    } catch {
      // Fallback если не удалось загрузить 404.html
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.innerHTML = `
          <div class="section">
            <div class="container">
              <h1>Ошибка загрузки страницы</h1>
              <p>К сожалению, произошла ошибка при загрузке страницы. Попробуйте обновить страницу.</p>
            </div>
          </div>
        `;
      }
    }
  }

  /**
   * Показывает модальное окно
   */
  showModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
    `;

    document.body.appendChild(modal);

    // Обработчики для модального окна
    modal.querySelector(".modal-close").onclick = () => this.closeModal(modal);
    modal.querySelector(".modal-btn").onclick = () => this.closeModal(modal);
    modal.onclick = e => {
      if (e.target === modal) this.closeModal(modal);
    };
  }

  /**
   * Закрывает модальное окно
   */
  closeModal(modal) {
    modal.remove();
  }
}
