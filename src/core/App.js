import { Header } from "../components/Header.js";
import { FaqAccordion } from "../modules/FaqAccordion.js";
import { getActiveFilterConfigs, getAutoDetectedConfig } from "../modules/FilterConfigs.js";
import { FilterManager } from "../modules/FilterManager.js";
import { getActiveGridConfigs } from "../modules/GridConfigs.js";
import { GridManager } from "../modules/GridManager.js";
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
    };
    this.smoothScroll = new SmoothScroll();
  }

  /**
   * Инициализирует приложение
   */
  init() {
    this.bindEvents();
    this.initComponents();
    this.loadPage("home");

    // Обработчик для кнопки "Назад" браузера
    window.addEventListener("popstate", event => {
      const page = event.state?.page || this.getPageFromUrl();
      if (page !== this.currentPage) {
        this.loadPageWithoutHistory(page);
      }
    });
  }

  /**
   * Загружает страницу
   */
  async loadPage(pageName) {
    try {
      // Загружаем HTML страницы
      const response = await fetch(`/src/pages/${pageName}.html`);
      const html = await response.text();

      // Вставляем контент в контейнер страницы
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.innerHTML = html;
      }

      this.currentPage = pageName;

      // Обновляем URL без перезагрузки страницы
      const url = pageName === "home" ? "/" : `/${pageName}`;
      window.history.pushState({ page: pageName }, "", url);

      this.initComponents(); // Инициализируем компоненты после загрузки страницы

      // Уведомляем header о смене страницы
      if (this.components.header) {
        this.components.header.onPageChange(pageName);
      }

      this.initSliders();

      this.scrollToTop();

      // Страница загружена
    } catch {
      // Ошибка загрузки страницы
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

    // Обработчик для модального окна
    document.addEventListener("click", e => {
      if (e.target.textContent === "TESTING") {
        this.showModal();
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
    try {
      // Загружаем HTML страницы
      const response = await fetch(`/src/pages/${pageName}.html`);
      const html = await response.text();

      // Вставляем контент в контейнер страницы
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        pageContent.innerHTML = html;
      }

      this.currentPage = pageName;
      this.initComponents(); // Инициализируем компоненты после загрузки страницы

      // Уведомляем header о смене страницы
      if (this.components.header) {
        this.components.header.onPageChange(pageName);
      }

      // Инициализируем слайдеры после загрузки страницы
      this.initSliders();

      // Скроллим наверх страницы
      this.scrollToTop();
    } catch {
      this.showErrorPage();
    }
  }

  /**
   * Получает название страницы из URL
   */
  getPageFromUrl() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "home";
    return page.replace(".html", "");
  }

  /**
   * Показывает страницу ошибки
   */
  showErrorPage() {
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
