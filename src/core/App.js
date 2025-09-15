import { Header } from "../components/Header.js";
import { FaqAccordion } from "../modules/FaqAccordion.js";
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
    };
    this.smoothScroll = new SmoothScroll();
  }

  /**
   * Инициализирует приложение
   */
  init() {
    this.loadPage("home");
    this.bindEvents();
    this.initComponents();
  }

  /**
   * Загружает страницу
   */
  async loadPage(pageName) {
    try {
      // Загружаем HTML страницы
      const response = await fetch(`/src/pages/${pageName}.html`);
      const html = await response.text();

      // Вставляем в body
      document.body.innerHTML = html;

      this.currentPage = pageName;
      this.initComponents(); // Инициализируем компоненты после загрузки страницы

      // Уведомляем header о смене страницы
      if (this.components.header) {
        this.components.header.onPageChange();
      }

      // Инициализируем слайдеры после загрузки страницы
      this.initSliders();

      // Страница загружена
    } catch {
      // Ошибка загрузки страницы
      // Показываем простую страницу ошибки
      this.showErrorPage();
    }
  }

  /**
   * Инициализирует компоненты
   */
  initComponents() {
    // Инициализируем Header компонент
    if (document.querySelector(".header")) {
      this.components.header = new Header();
      this.components.header.init();
    }

    // Инициализируем FAQ аккордеон
    if (document.querySelector(".faq")) {
      this.components.faqAccordion = new FaqAccordion(".faq");
    }
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
   * Привязывает события
   */
  bindEvents() {
    // Обработчик для навигации
    document.addEventListener("click", e => {
      if (e.target.matches("[data-page]")) {
        e.preventDefault();
        const page = e.target.getAttribute("data-page") || "home";
        this.loadPage(page);
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
