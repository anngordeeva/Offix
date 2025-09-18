/**
 * Компонент подсветки активной секции (scrollspy) для страницы офиса
 * Работает только на экранах шире tablet ( > 1150px )
 */
export class OfficeScrollSpy {
  /**
   * @param {object} options
   * @param {string} options.rootSelector - селектор корневого контейнера страницы офиса
   * @param {string} options.navListSelector - селектор списка навигации справа
   * @param {string} options.sectionsSelector - селектор секций в левом контенте
   * @param {number} [options.topOffsetPx] - отступ сверху для учета фиксированных элементов
   */
  constructor({ rootSelector, navListSelector, sectionsSelector, topOffsetPx = 120 }) {
    this.rootSelector = rootSelector;
    this.navListSelector = navListSelector;
    this.sectionsSelector = sectionsSelector;
    this.topOffsetPx = topOffsetPx;

    this.rootElement = null;
    this.navItems = [];
    this.sections = [];
    this.observer = null;
    this.activeIndex = -1;
    this.updateTimeout = null;

    this.handleResize = this.handleResize.bind(this);
  }

  init() {
    // Инициализируем только на десктопе
    if (!this.isDesktop()) return;

    this.rootElement = document.querySelector(this.rootSelector);
    const navList = document.querySelector(this.navListSelector);
    const allSections = Array.from(document.querySelectorAll(this.sectionsSelector));
    this.navItems = navList ? Array.from(navList.querySelectorAll(".office-page__nav-item")) : [];

    const targetIds = new Set(this.navItems.map(item => item.getAttribute("data-target")).filter(Boolean));
    this.sections = allSections.filter(sec => sec.id && targetIds.has(sec.id));

    if (!this.rootElement || this.sections.length === 0 || this.navItems.length === 0) return;

    const IO = window.IntersectionObserver;
    if (!IO) return;
    this.observer = new IO(
      entries => {
        const intersecting = entries.filter(e => e.isIntersecting);

        if (intersecting.length === 0) return;

        let bestSection = null;
        let bestDistance = Infinity;

        intersecting.forEach(entry => {
          const rect = entry.target.getBoundingClientRect();

          if (rect.top <= 130 && rect.bottom > 130) {
            const distanceFrom130px = Math.abs(rect.top - 130);
            if (distanceFrom130px < bestDistance) {
              bestDistance = distanceFrom130px;
              bestSection = entry.target;
            }
          }
        });

        if (bestSection) {
          const index = this.sections.indexOf(bestSection);
          if (index >= 0) {
            if (this.updateTimeout) {
              clearTimeout(this.updateTimeout);
            }
            this.updateTimeout = setTimeout(() => {
              this.setActive(index);
            }, 50);
          }
        }
      },
      {
        root: null,
        rootMargin: "-130px 0px -100% 0px",
        threshold: [0],
      }
    );

    this.sections.forEach(section => this.observer.observe(section));

    this.navItems.forEach(item => {
      item.addEventListener("click", e => {
        e.preventDefault();
        const targetId = item.getAttribute("data-target");
        if (!targetId) return;
        const section = document.getElementById(targetId);
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        window.scrollTo({ top: Math.max(absoluteTop - this.topOffsetPx, 0), behavior: "smooth" });
      });
    });

    window.addEventListener("resize", this.handleResize);

    this.forceUpdateActiveOnInit();
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.sections = [];
    this.navItems = [];
    this.rootElement = null;
    this.activeIndex = -1;
  }

  handleResize() {
    if (this.isDesktop()) return;
    this.destroy();
  }

  setActive(index) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;
    this.navItems.forEach((item, i) => {
      if (i === index) item.classList.add("active");
      else item.classList.remove("active");
    });
  }

  forceUpdateActiveOnInit() {
    let bestItem = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    this.navItems.forEach(item => {
      const targetId = item.getAttribute("data-target");
      const section = targetId ? document.getElementById(targetId) : null;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - this.topOffsetPx);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestItem = item;
      }
    });
    if (bestItem) {
      const index = this.navItems.indexOf(bestItem);
      if (index >= 0) this.setActive(index);
    }
  }

  isDesktop() {
    return window.innerWidth > 1150;
  }
}
