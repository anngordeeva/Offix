/**
 * Компонент Header с мобильным меню
 */
export class Header {
  constructor() {
    this.isMenuOpen = false;
    this.burgerBtn = null;
    this.mobileMenu = null;
    this.navLinks = [];
    this.header = null;
    this.isScrolled = false;
    this.currentPage = "home"; // Текущая страница
    this.whiteBgPages = ["offices", "office"]; // Страницы с белым фоном по умолчанию (независимо от скролла)
  }

  init() {
    this.header = document.querySelector(".header");
    this.burgerBtn = document.getElementById("burger-btn");
    this.mobileMenu = document.getElementById("mobile-menu");
    this.navLinks = document.querySelectorAll(".header__nav-link");
    this.logo = document.querySelector(".header__logo");

    // Устанавливаем текущую страницу из URL
    this.currentPage = this.getCurrentPage();

    this.bindEvents();
    this.setupMobileMenu();
    this.initScrollHandler();
    this.updateHeaderState();

    this.setActiveLink(this.currentPage);
  }

  bindEvents() {
    if (this.burgerBtn) {
      this.burgerBtn.addEventListener("click", () => this.toggleMobileMenu());
    }

    if (this.mobileMenu) {
      const overlay = this.mobileMenu.querySelector(".mobile-menu__overlay");
      if (overlay) {
        overlay.addEventListener("click", () => this.closeMobileMenu());
      }
    }

    if (this.logo) {
      this.logo.addEventListener("click", () => this.closeMobileMenu());
    }

    this.navLinks.forEach(link => {
      link.addEventListener("click", () => this.closeMobileMenu());
    });
  }

  setupMobileMenu() {
    const mobileNav = this.mobileMenu?.querySelector(".mobile-menu__nav");
    if (!mobileNav || this.navLinks.length === 0) return;

    mobileNav.innerHTML = "";

    this.navLinks.forEach(link => {
      const clonedLink = link.cloneNode(true);
      clonedLink.classList.remove("header__nav-link");
      clonedLink.classList.add("mobile-menu__link");
      mobileNav.appendChild(clonedLink);
    });

    const mobileLinks = mobileNav.querySelectorAll(".mobile-menu__link");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => this.closeMobileMenu());
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    if (this.mobileMenu && this.burgerBtn) {
      this.mobileMenu.classList.add("active");
      this.burgerBtn.classList.add("active");
      document.body.style.overflow = "hidden";
      this.isMenuOpen = true;
      this.updateHeaderState();
    }
  }

  closeMobileMenu() {
    if (this.mobileMenu && this.burgerBtn) {
      this.mobileMenu.classList.remove("active");
      this.burgerBtn.classList.remove("active");
      document.body.style.overflow = "";
      this.isMenuOpen = false;
      this.updateHeaderState();
    }
  }

  /**
   * Инициализирует обработчик скролла
   */
  initScrollHandler() {
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.isScrolled = scrollTop > 50; // Изменяем фон после 50px скролла
      this.updateHeaderState();
    });
  }

  /**
   * Обновляет состояние header'а
   */
  updateHeaderState() {
    if (!this.header) return;

    const isWhiteBgPage = this.whiteBgPages.includes(this.currentPage);

    const shouldShowWhiteBgOnScroll = !isWhiteBgPage && this.isScrolled;

    const shouldHaveWhiteBg = this.isMenuOpen || isWhiteBgPage || shouldShowWhiteBgOnScroll;

    if (shouldHaveWhiteBg) {
      this.header.classList.add("header--white-bg");
    } else {
      this.header.classList.remove("header--white-bg");
    }
  }

  /**
   * Получает текущую страницу
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "home";
    return page.replace(".html", "");
  }

  /**
   * Обновляет состояние при изменении страницы
   */
  onPageChange(pageName) {
    this.currentPage = pageName; // Обновляем текущую страницу
    this.updateHeaderState();
    this.setActiveLink(pageName);
  }

  /**
   * Устанавливает активную ссылку
   */
  setActiveLink(pageName) {
    this.navLinks.forEach(link => {
      link.classList.remove("active");
    });

    if (pageName === "home") {
      return;
    }

    const activeLink = Array.from(this.navLinks).find(link => {
      const linkPage = link.getAttribute("data-page");
      return linkPage === pageName;
    });

    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  update() {
    this.navLinks = document.querySelectorAll(".header__nav-link");
    this.setupMobileMenu();
    this.updateHeaderState();

    const currentPage = this.getCurrentPage();
    this.setActiveLink(currentPage);
  }
}
