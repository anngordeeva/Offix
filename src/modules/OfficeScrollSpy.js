/**
 * Компонент подсветки активной секции (scrollspy) для страницы офиса
 * Работает на всех разрешениях, навигация скрывается CSS на мобильных устройствах
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
    this.scrollHandler = null;

    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  init() {
    // Инициализируем на всех разрешениях
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
        // Проверяем, что компонент все еще активен
        if (!this.observer || !this.sections.length || !this.navItems.length) return;

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

    // Наблюдаем за всеми секциями
    this.sections.forEach(section => {
      this.observer.observe(section);
    });

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

        // Обновляем URL с якорем
        this.updateUrlWithAnchor(targetId);
      });
    });

    window.addEventListener("resize", this.handleResize);

    // Добавляем обработчик скролла как fallback для IntersectionObserver
    this.scrollHandler = this.throttle(this.handleScroll, 100);
    window.addEventListener("scroll", this.scrollHandler);

    this.forceUpdateActiveOnInit();

    // Обрабатываем якорь из URL при инициализации
    this.handleInitialAnchor();
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }
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
    // Просто обновляем активный элемент после ресайза
    setTimeout(() => {
      this.forceUpdateActiveOnInit();
    }, 100);
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
    // Проверяем, что компонент инициализирован
    if (!this.navItems.length || !this.sections.length) return;

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

  /**
   * Обновляет URL с якорем
   * @param {string} anchorId - ID якоря
   */
  updateUrlWithAnchor(anchorId) {
    const currentUrl = new window.URL(window.location);
    currentUrl.hash = anchorId;
    window.history.replaceState(null, "", currentUrl.toString());
  }

  /**
   * Обрабатывает якорь из URL при инициализации
   */
  handleInitialAnchor() {
    const hash = window.location.hash;
    if (hash) {
      const anchorId = hash.substring(1); // Убираем #
      const targetSection = document.getElementById(anchorId);
      if (targetSection && this.sections.includes(targetSection)) {
        // Небольшая задержка для корректного позиционирования
        setTimeout(() => {
          const rect = targetSection.getBoundingClientRect();
          const absoluteTop = window.scrollY + rect.top;
          window.scrollTo({
            top: Math.max(absoluteTop - this.topOffsetPx, 0),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }

  /**
   * Обработчик скролла как fallback для IntersectionObserver
   */
  handleScroll() {
    if (!this.sections.length || !this.navItems.length) return;

    let bestSection = null;
    let bestDistance = Infinity;

    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - this.topOffsetPx);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestSection = section;
      }
    });

    if (bestSection) {
      const index = this.sections.indexOf(bestSection);
      if (index >= 0 && index !== this.activeIndex) {
        this.setActive(index);
      }
    }
  }

  /**
   * Throttle функция для оптимизации обработчика скролла
   */
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}
