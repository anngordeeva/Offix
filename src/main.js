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

import { Header } from "./components/Header.js";

/**
 * Простое приложение для верстки
 */
class App {
  constructor() {
    this.currentPage = "home";
    this.components = {
      header: null,
    };
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

      console.log(`Страница "${pageName}" загружена`);
    } catch (error) {
      console.error(`Ошибка загрузки страницы "${pageName}":`, error);
      // Показываем простую страницу ошибки
      this.showErrorPage();
    }
  }

  /**
   * Показывает страницу ошибки
   */
  showErrorPage() {
    document.body.innerHTML = `
      <div class="page">
        <div class="main-container">
          <h1>Ошибка загрузки</h1>
          <p>Не удалось загрузить страницу. Проверьте консоль браузера.</p>
          <a href="#" data-page="home">Вернуться на главную</a>
        </div>
      </div>
    `;
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
  }

  /**
   * Привязывает события
   */
  bindEvents() {
    // Обработчик для навигации
    document.addEventListener("click", e => {
      if (e.target.matches("[data-page]")) {
        e.preventDefault();
        const page = e.target.getAttribute("data-page");
        this.loadPage(page);
      }
    });

    // Обработчик для модального окна
    document.addEventListener("click", e => {
      if (e.target.textContent === "TESTING") {
        this.showModal();
      }
    });
  }

  /**
   * Показывает модальное окно
   */
  showModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h2>Тестовое модальное окно</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>Простая архитектура для верстки!</p>
          <p>Легко перейти на любой фреймворк.</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-primary">OK</button>
        </div>
      </div>
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

// Инициализируем приложение
document.addEventListener("DOMContentLoaded", () => {
  new App().init();
});
